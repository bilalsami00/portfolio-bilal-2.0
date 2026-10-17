import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

/* Read each key statically so Next.js inlines them into the client bundle. */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
};

export const isFirebaseClientConfigured = (): boolean =>
  process.env.NEXT_PUBLIC_FIREBASE_ENABLED === "true" &&
  Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );

let clientApp: FirebaseApp | null = null;

const getClientApp = (): FirebaseApp | null => {
  if (typeof window === "undefined" || !isFirebaseClientConfigured()) {
    return null;
  }
  if (!clientApp) {
    clientApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return clientApp;
};

export const getClientAuth = (): Auth | null => {
  const app = getClientApp();
  return app ? getAuth(app) : null;
};

export const getClientDb = (): Firestore | null => {
  const app = getClientApp();
  return app ? getFirestore(app) : null;
};

export const firestoreCollections = {
  admins: "admins",
  contactMessages: "contactMessages",
  visitorSessions: "visitorSessions",
  emailNotifications: "emailNotifications",
} as const;
