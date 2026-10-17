import type { NextApiRequest } from "next";
import { FieldValue } from "firebase-admin/firestore";
import type { Firestore } from "firebase-admin/firestore";
import { parseUserAgent } from "../utilities/userAgent";
import type {
  VisitorSessionCreateInput,
  VisitorSessionDocument,
  VisitorSessionUpdateInput,
} from "../utilities/schemas/visitor";
import { sendVisitorNotification } from "./email";
import logServerError from "./log";
import {
  getClientGeo,
  getClientIp,
  getExternalRequestReferrer,
  getRequestUserAgent,
} from "./requestContext";

const COLLECTION = "visitorSessions";
const MAX_VISITED_PAGES = 200;
const MAX_CLICKED_LINKS = 500;

const known = (value: string | null | undefined): string | null =>
  value && value.trim() && value !== "unknown" ? value.trim() : null;

/** Returns `created: false` when the session already exists (idempotent). */
export const createVisitorSession = async (
  db: Firestore,
  req: NextApiRequest,
  input: VisitorSessionCreateInput
): Promise<{ created: boolean }> => {
  const ref = db.collection(COLLECTION).doc(input.sessionId);
  const existing = await ref.get();
  if (existing.exists) return { created: false };

  const parsedUa = parseUserAgent(getRequestUserAgent(req));
  const device = input.device ?? {};
  const now = new Date().toISOString();
  const { country, city } = getClientGeo(req);

  const session: VisitorSessionDocument = {
    sessionId: input.sessionId,
    ipAddress: getClientIp(req),
    country,
    city,
    deviceType:
      parsedUa.deviceType === "Bot"
        ? "Bot"
        : device.deviceType ?? parsedUa.deviceType,
    deviceBrand: known(device.deviceBrand) ?? parsedUa.deviceBrand,
    deviceModel: known(device.deviceModel) ?? parsedUa.deviceModel,
    browser: known(device.browser) ?? parsedUa.browser,
    operatingSystem: known(device.operatingSystem) ?? parsedUa.operatingSystem,
    screenSize: known(device.screenSize) ?? "unknown",
    viewportSize: known(device.viewportSize) ?? "unknown",
    touchSupport: device.touchSupport ?? false,
    referrer:
      known(device.referrer) ?? (getExternalRequestReferrer(req) || "direct"),
    landingPage: input.landingPage,
    isReturningVisitor: input.isReturningVisitor,
    visitedPages: [input.landingPage],
    clickedLinks: [],
    sessionStart: now,
    lastActivity: now,
  };

  try {
    await ref.create(session);
  } catch (error) {
    // ALREADY_EXISTS: a concurrent request created it first.
    if ((error as { code?: number }).code === 6) return { created: false };
    throw error;
  }

  try {
    await sendVisitorNotification(session);
  } catch (error) {
    logServerError("visitors: notification email failed", error);
  }

  return { created: true };
};

/** Returns `found: false` when no session exists; never creates documents. */
export const updateVisitorSession = async (
  db: Firestore,
  input: VisitorSessionUpdateInput
): Promise<{ found: boolean }> => {
  const ref = db.collection(COLLECTION).doc(input.sessionId);
  const snapshot = await ref.get();
  if (!snapshot.exists) return { found: false };

  const visitedCount = (snapshot.get("visitedPages") as string[] | undefined)
    ?.length;
  const clickedCount = (snapshot.get("clickedLinks") as string[] | undefined)
    ?.length;

  const links = [...(input.links ?? []), ...(input.link ? [input.link] : [])];
  const update: Record<string, unknown> = {
    lastActivity: new Date().toISOString(),
  };

  if (input.page && (visitedCount ?? 0) < MAX_VISITED_PAGES) {
    update.visitedPages = FieldValue.arrayUnion(input.page);
  }
  if (links.length && (clickedCount ?? 0) < MAX_CLICKED_LINKS) {
    update.clickedLinks = FieldValue.arrayUnion(...links);
  }

  await ref.update(update);
  return { found: true };
};
