import { isMissionControlPath } from "../data/navigation";
import type { VisitorDeviceInput } from "./schemas/visitor";
import { brandFromModel, parseUserAgent } from "./userAgent";

const ENDPOINT = "/api/visitors/session";
const SESSION_ID_KEY = "openfolio:visitorSessionId";
const SESSION_READY_KEY = "openfolio:visitorSessionReady";
const RETURNING_KEY = "openfolio:visitorReturning";
const PAGE_DEDUPE_MS = 1000;
const LINK_BATCH_SIZE = 5;
const LINK_FLUSH_MS = 2000;
const MAX_QUEUED_LINKS = 20;
const MAX_INIT_ATTEMPTS = 2;

export const isVisitorTrackingEnabled = (): boolean =>
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false";

type UserAgentDataHints = {
  model?: string;
  platform?: string;
  platformVersion?: string;
};

type NavigatorWithUaData = Navigator & {
  userAgentData?: {
    mobile?: boolean;
    platform?: string;
    getHighEntropyValues?: (hints: string[]) => Promise<UserAgentDataHints>;
  };
};

const storageGet = (storage: Storage, key: string): string | null => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const storageSet = (storage: Storage, key: string, value: string) => {
  try {
    storage.setItem(key, value);
  } catch {
    // Private mode / quota: tracking degrades to per-page-load.
  }
};

const createUuid = (): string => {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  /* eslint-disable no-bitwise */
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  /* eslint-enable no-bitwise */
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
    .slice(6, 8)
    .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
};

/** Tab-scoped id: survives reloads and navigation, not new tabs. */
const getSessionId = (): string => {
  const existing = storageGet(sessionStorage, SESSION_ID_KEY);
  if (existing) return existing;
  const id = createUuid();
  storageSet(sessionStorage, SESSION_ID_KEY, id);
  return id;
};

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      }
    );
  });

const osFromHints = (hints: UserAgentDataHints): string | null => {
  const version = hints.platformVersion;
  if (!hints.platform || !version) return null;
  const major = parseInt(version, 10);
  if (hints.platform === "Windows") {
    return major >= 13 ? "Windows 11" : "Windows 10";
  }
  if (hints.platform === "Android") return `Android ${major}`;
  if (hints.platform === "macOS") {
    return `macOS ${version.split(".").slice(0, 2).join(".")}`;
  }
  return null;
};

/** UA + Client Hints + screen metrics. No permissions, no fingerprinting. */
const collectDevice = async (): Promise<VisitorDeviceInput> => {
  const nav = navigator as NavigatorWithUaData;
  const ua = nav.userAgent;
  const parsed = parseUserAgent(ua);
  const device: VisitorDeviceInput = {
    ...parsed,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    touchSupport: nav.maxTouchPoints > 0 || "ontouchstart" in window,
    referrer: document.referrer ? document.referrer.slice(0, 2048) : undefined,
  };

  // iPadOS reports a desktop Safari UA.
  if (/Macintosh/.test(ua) && nav.maxTouchPoints > 1) {
    device.deviceType = "Tablet";
    device.deviceBrand = "Apple";
    device.deviceModel = "iPad";
    device.operatingSystem = "iPadOS";
  }

  const uaData = nav.userAgentData;
  if (uaData?.mobile && device.deviceType === "Desktop") {
    device.deviceType = "Mobile";
  }
  if (uaData?.getHighEntropyValues) {
    try {
      const hints = await withTimeout(
        uaData.getHighEntropyValues(["model", "platformVersion"]),
        800
      );
      if (hints.model) {
        device.deviceModel = hints.model.slice(0, 120);
        device.deviceBrand = brandFromModel(hints.model) ?? device.deviceBrand;
      }
      device.operatingSystem = osFromHints(hints) ?? device.operatingSystem;
    } catch {
      // Hints are optional.
    }
  }

  return device;
};

const currentPath = (): string =>
  `${window.location.pathname}${window.location.search}`.slice(0, 512);

const normalizePath = (url: string): string =>
  (url.split("#")[0] || "/").slice(0, 512);

const send = (
  method: "POST" | "PATCH",
  payload: Record<string, unknown>
): Promise<Response> =>
  fetch(ENDPOINT, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  });

/** Text/plain body keeps sendBeacon CORS-safelisted; the API parses it. */
const beacon = (payload: Record<string, unknown>) => {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, body)) return;
  } catch {
    // Fall through to fetch.
  }
  send("PATCH", payload).catch(() => undefined);
};

export type VisitorTracker = {
  trackPage: (url: string) => void;
  handleClick: (event: MouseEvent) => void;
  handleHide: () => void;
};

/** One session document per tab; later activity merges into it. */
export const createVisitorTracker = (): VisitorTracker => {
  const sessionId = getSessionId();
  let ready = storageGet(sessionStorage, SESSION_READY_KEY) === sessionId;
  let disabled = false;
  let initInFlight = false;
  let initAttempts = 0;
  let lastPage: { path: string; at: number } | null = null;
  let linkQueue: string[] = [];
  let flushTimer: number | null = null;

  const patchPage = (path: string) => {
    const now = Date.now();
    if (
      lastPage &&
      lastPage.path === path &&
      now - lastPage.at < PAGE_DEDUPE_MS
    ) {
      return;
    }
    lastPage = { path, at: now };
    send("PATCH", { sessionId, page: path }).catch(() => undefined);
  };

  const flushLinks = (useBeacon: boolean) => {
    if (flushTimer !== null) {
      window.clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (!ready || disabled || !linkQueue.length) return false;
    const links = linkQueue;
    linkQueue = [];
    const payload = { sessionId, links, touch: true };
    if (useBeacon) beacon(payload);
    else send("PATCH", payload).catch(() => undefined);
    return true;
  };

  const init = async (landingPage: string) => {
    if (initInFlight || initAttempts >= MAX_INIT_ATTEMPTS) return;
    initInFlight = true;
    initAttempts += 1;
    try {
      const device = await collectDevice();
      const response = await send("POST", {
        sessionId,
        landingPage,
        isReturningVisitor: storageGet(localStorage, RETURNING_KEY) === "1",
        device,
      });
      if (response.status === 503 || response.status === 400) {
        disabled = true;
        return;
      }
      if (!response.ok) return;

      ready = true;
      lastPage = { path: landingPage, at: Date.now() };
      storageSet(sessionStorage, SESSION_READY_KEY, sessionId);
      storageSet(localStorage, RETURNING_KEY, "1");

      const now = currentPath();
      if (
        now !== landingPage &&
        !isMissionControlPath(window.location.pathname)
      ) {
        patchPage(now);
      }
      flushLinks(false);
    } catch {
      // Network failure: retry on the next navigation (bounded).
    } finally {
      initInFlight = false;
    }
  };

  const trackPage = (url: string) => {
    if (disabled) return;
    const path = normalizePath(url);
    if (isMissionControlPath(path.split("?")[0] || path)) return;
    if (!ready) {
      init(path).catch(() => undefined);
      return;
    }
    patchPage(path);
  };

  const handleClick = (event: MouseEvent) => {
    if (disabled || isMissionControlPath(window.location.pathname)) return;
    const target = event.target as Element | null;
    const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!anchor || anchor.closest("[data-visitor-ignore]")) return;

    const rawHref = anchor.getAttribute("href") || "";
    if (!rawHref || rawHref.startsWith("#")) return;

    let link = anchor.href;
    try {
      const url = new URL(anchor.href, window.location.href);
      if (url.origin === window.location.origin) {
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search &&
          url.hash
        ) {
          return;
        }
        link = `${url.pathname}${url.search}`;
      }
    } catch {
      // Keep the raw resolved href.
    }

    linkQueue = [...linkQueue, link.slice(0, 2048)].slice(-MAX_QUEUED_LINKS);
    if (linkQueue.length >= LINK_BATCH_SIZE) {
      flushLinks(false);
    } else if (flushTimer === null) {
      flushTimer = window.setTimeout(() => flushLinks(false), LINK_FLUSH_MS);
    }
  };

  const handleHide = () => {
    if (!ready || disabled) return;
    if (!flushLinks(true)) beacon({ sessionId, touch: true });
  };

  return { trackPage, handleClick, handleHide };
};
