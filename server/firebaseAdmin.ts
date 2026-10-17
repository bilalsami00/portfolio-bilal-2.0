import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

/** Server-only. Never import this module from components or pages. */

const ADMIN_APP_NAME = "openfolio-admin";

const readPrivateKey = (): string | undefined => {
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  if (!raw) return undefined;
  return raw.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
};

export const isFirebaseAdminConfigured = (): boolean =>
  Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      readPrivateKey()
  );

let adminDb: Firestore | null = null;

const getAdminApp = (): App => {
  const existing = getApps().find((app) => app.name === ADMIN_APP_NAME);
  if (existing) return getApp(ADMIN_APP_NAME);

  return initializeApp(
    {
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: readPrivateKey(),
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    },
    ADMIN_APP_NAME
  );
};

/** Returns null when the service account env vars are missing. */
export const getAdminDb = (): Firestore | null => {
  if (!isFirebaseAdminConfigured()) return null;
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
    adminDb.settings({ ignoreUndefinedProperties: true });
  }
  return adminDb;
};
