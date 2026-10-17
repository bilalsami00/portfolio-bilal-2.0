import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminDb } from "../../../server/firebaseAdmin";
import logServerError from "../../../server/log";
import { readJsonBody } from "../../../server/requestContext";
import {
  createVisitorSession,
  updateVisitorSession,
} from "../../../server/visitorSessions";
import {
  visitorSessionCreateSchema,
  visitorSessionUpdateSchema,
} from "../../../utilities/schemas/visitor";

type SessionResponse = { ok: boolean; error?: string };

const hasLandingPage = (body: unknown): boolean =>
  Boolean(
    body &&
      typeof body === "object" &&
      "landingPage" in (body as Record<string, unknown>)
  );

/**
 * POST with `landingPage` creates a session; POST without it (sendBeacon)
 * or PATCH updates one.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SessionResponse>
) {
  if (req.method !== "POST" && req.method !== "PATCH") {
    res.setHeader("Allow", "POST, PATCH");
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const db = getAdminDb();
  if (!db) {
    res.status(503).json({ ok: false, error: "Unavailable" });
    return;
  }

  const body = readJsonBody(req);

  try {
    if (req.method === "POST" && hasLandingPage(body)) {
      const parsed = visitorSessionCreateSchema.safeParse(body);
      if (!parsed.success) {
        res.status(400).json({ ok: false, error: "Invalid payload" });
        return;
      }
      await createVisitorSession(db, req, parsed.data);
      res.status(200).json({ ok: true });
      return;
    }

    const parsed = visitorSessionUpdateSchema.safeParse(body);
    if (
      !parsed.success ||
      !(
        parsed.data.page ||
        parsed.data.link ||
        parsed.data.links?.length ||
        parsed.data.touch
      )
    ) {
      res.status(400).json({ ok: false, error: "Invalid payload" });
      return;
    }

    const { found } = await updateVisitorSession(db, parsed.data);
    res.status(found ? 200 : 404).json({ ok: found });
  } catch (error) {
    logServerError("visitors: session write failed", error);
    res.status(500).json({ ok: false, error: "Unavailable" });
  }
}
