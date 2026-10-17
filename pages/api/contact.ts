import type { NextApiRequest, NextApiResponse } from "next";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "../../server/firebaseAdmin";
import { sendContactNotification } from "../../server/email";
import logServerError from "../../server/log";
import {
  createRateLimiter,
  getClientIp,
  readJsonBody,
} from "../../server/requestContext";
import {
  CONTACT_HONEYPOT_FIELD,
  contactMessageSchema,
  toFieldErrors,
} from "../../utilities/schemas/contact";

type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const allowSubmission = createRateLimiter(5, 10 * 60 * 1000);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const db = getAdminDb();
  if (!db) {
    res
      .status(503)
      .json({ ok: false, error: "Messaging is temporarily unavailable." });
    return;
  }

  const body = readJsonBody(req);
  if (!body || typeof body !== "object") {
    res.status(400).json({ ok: false, error: "Invalid submission." });
    return;
  }

  const honeypot = (body as Record<string, unknown>)[CONTACT_HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim()) {
    res.status(200).json({ ok: true });
    return;
  }

  const parsed = contactMessageSchema.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error) as Record<string, string>,
    });
    return;
  }

  if (!allowSubmission(getClientIp(req))) {
    res
      .status(429)
      .json({ ok: false, error: "Too many messages. Please try again later." });
    return;
  }

  const createdAt = Timestamp.now();
  try {
    await db.collection("contactMessages").add({ ...parsed.data, createdAt });
  } catch (error) {
    logServerError("contact: Firestore write failed", error);
    res
      .status(500)
      .json({ ok: false, error: "Could not send your message right now." });
    return;
  }

  try {
    await sendContactNotification(parsed.data, createdAt.toDate());
  } catch (error) {
    logServerError("contact: notification email failed", error);
  }

  res.status(200).json({ ok: true });
}
