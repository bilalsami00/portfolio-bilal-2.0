import nodemailer, { Transporter } from "nodemailer";
import { Timestamp } from "firebase-admin/firestore";
import { siteIdentity } from "../data/site";
import type { ContactMessageInput } from "../utilities/schemas/contact";
import type { VisitorSessionDocument } from "../utilities/schemas/visitor";
import { getAdminDb } from "./firebaseAdmin";

/** Server-only. SMTP credentials must never reach the client bundle. */

const VISITOR_IP_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const EMAIL_NOTIFICATIONS = "emailNotifications";

export const isEmailConfigured = (): boolean =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.NOTIFY_EMAIL
  );

let transporter: Transporter | null = null;

const getTransporter = (): Transporter => {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT) || 587;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }
  return transporter;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Header-safe single line (no CR/LF injection into Subject). */
const singleLine = (value: string): string =>
  value.replace(/[\r\n]+/g, " ").trim();

type EmailRow = [label: string, value: string];

const renderRows = (rows: EmailRow[]) => {
  const filled = rows.filter(([, value]) => value && value.trim());
  const text = filled.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${filled
    .map(
      ([label, value]) =>
        `<tr><td style="font-weight:bold;vertical-align:top;color:#555">${escapeHtml(
          label
        )}</td><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`
    )
    .join("")}</table>`;
  return { text, html };
};

const sendMail = async (options: {
  subject: string;
  rows: EmailRow[];
  replyTo?: string;
}) => {
  const { text, html } = renderRows(options.rows);
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL,
    replyTo: options.replyTo,
    subject: singleLine(options.subject),
    text,
    html,
  });
};

/** One email per stored contact message. No-op without SMTP config. */
export const sendContactNotification = async (
  message: ContactMessageInput,
  submittedAt: Date
): Promise<void> => {
  if (!isEmailConfigured()) return;

  await sendMail({
    subject: `${message.fullName} filled the contact form on ${siteIdentity.siteName}`,
    replyTo: message.email,
    rows: [
      ["Name", message.fullName],
      ["Email", message.email],
      ["Phone", message.phone],
      ["Company", message.company],
      ["Subject", message.subject],
      ["Message", message.message],
      ["Submitted", submittedAt.toISOString()],
    ],
  });
};

const sanitizeDocId = (value: string): string =>
  value.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 200);

/**
 * Emails once per new session, and at most once per IP every 24 hours.
 * Dedupe docs are reserved in a transaction before sending so concurrent
 * sessions from one IP cannot both send; they are released if SMTP fails.
 */
export const sendVisitorNotification = async (
  session: VisitorSessionDocument
): Promise<void> => {
  if (!isEmailConfigured()) return;
  const db = getAdminDb();
  if (!db) return;

  const notifications = db.collection(EMAIL_NOTIFICATIONS);
  const sessionRef = notifications.doc(
    `visitor-session-${sanitizeDocId(session.sessionId)}`
  );
  const ipRef = notifications.doc(
    `visitor-ip-${sanitizeDocId(session.ipAddress)}`
  );
  const now = Timestamp.now();
  const record = {
    type: "visitor",
    sessionId: session.sessionId,
    ipAddress: session.ipAddress,
    landingPage: session.landingPage,
    sentAt: now,
  };

  const reserved = await db.runTransaction(async (transaction) => {
    const [sessionSnap, ipSnap] = await transaction.getAll(sessionRef, ipRef);
    if (sessionSnap.exists) return false;
    const lastSentAt = ipSnap.get("sentAt") as Timestamp | undefined;
    if (
      lastSentAt &&
      now.toMillis() - lastSentAt.toMillis() < VISITOR_IP_COOLDOWN_MS
    ) {
      return false;
    }
    transaction.set(sessionRef, record);
    transaction.set(ipRef, record);
    return true;
  });

  if (!reserved) return;

  try {
    await sendMail({
      subject: `Someone viewed ${siteIdentity.siteName}`,
      rows: [
        ["IP", session.ipAddress],
        ["Country", session.country],
        ["City", session.city],
        ["Page opened", session.landingPage],
        ["Time", session.sessionStart],
      ],
    });
  } catch (error) {
    await Promise.allSettled([sessionRef.delete(), ipRef.delete()]);
    throw error;
  }
};
