import type { NextApiRequest } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";

const headerValue = (req: NextApiRequest, name: string): string => {
  const value = req.headers[name];
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw || "").trim();
};

const firstHop = (value: string): string => value.split(",")[0]?.trim() || "";

/** First non-empty proxy header wins; never invents a public IP locally. */
export const getClientIp = (req: NextApiRequest): string => {
  const candidates = [
    firstHop(headerValue(req, "x-forwarded-for")),
    headerValue(req, "x-real-ip"),
    firstHop(headerValue(req, "x-vercel-forwarded-for")),
    headerValue(req, "cf-connecting-ip"),
  ];
  const ip = candidates.find(Boolean);
  if (ip) return ip.slice(0, 64);
  return isDevelopment ? "127.0.0.1" : "unknown";
};

const decodeHeader = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/** Geo from hosting-platform headers only (Vercel, Cloudflare). */
export const getClientGeo = (
  req: NextApiRequest
): { country: string; city: string } => {
  const rawCountry =
    headerValue(req, "x-vercel-ip-country") || headerValue(req, "cf-ipcountry");
  const country = rawCountry && rawCountry !== "XX" ? rawCountry : "";
  const city = decodeHeader(headerValue(req, "x-vercel-ip-city"));

  if (!country && !city && isDevelopment) {
    return { country: "Local", city: "Development" };
  }
  return {
    country: (country || "unknown").slice(0, 64),
    city: (city || "unknown").slice(0, 120),
  };
};

export const getRequestUserAgent = (req: NextApiRequest): string =>
  headerValue(req, "user-agent").slice(0, 512);

/** External Referer header of the API request, ignoring our own origin. */
export const getExternalRequestReferrer = (req: NextApiRequest): string => {
  const referer = headerValue(req, "referer");
  const host = headerValue(req, "host");
  if (!referer) return "";
  try {
    return new URL(referer).host === host ? "" : referer.slice(0, 2048);
  } catch {
    return "";
  }
};

/** Accepts JSON bodies and the text/plain JSON strings sent by sendBeacon. */
export const readJsonBody = (req: NextApiRequest): unknown => {
  const { body } = req as { body: unknown };
  if (typeof body !== "string") return body;
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return null;
  }
};

type RateWindow = { count: number; resetAt: number };

/**
 * Per-instance, in-memory limiter. Serverless instances do not share state,
 * so this only blunts bursts; it is not a hard guarantee.
 */
export const createRateLimiter = (limit: number, windowMs: number) => {
  const windows = new Map<string, RateWindow>();

  return (key: string): boolean => {
    const now = Date.now();
    if (windows.size > 5000) {
      windows.forEach((entry, entryKey) => {
        if (entry.resetAt <= now) windows.delete(entryKey);
      });
    }
    const entry = windows.get(key);
    if (!entry || entry.resetAt <= now) {
      windows.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
};
