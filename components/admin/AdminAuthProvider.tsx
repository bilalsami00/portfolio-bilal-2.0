import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  firestoreCollections,
  getClientAuth,
  getClientDb,
  isFirebaseClientConfigured,
} from "../../utilities/firebaseClient";

export type AdminAuthStatus =
  | "loading"
  | "not-configured"
  | "guest"
  | "unauthorized"
  | "error"
  | "authorized";

export type AdminSignInResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "invalid"
        | "denied"
        | "network"
        | "rate-limited"
        | "not-configured";
    };

type AdminAuthContextValue = {
  status: AdminAuthStatus;
  user: User | null;
  signIn: (
    email: string,
    password: string,
    remember: boolean
  ) => Promise<AdminSignInResult>;
  signOut: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
  undefined
);

type WhitelistResult = "admin" | "not-admin" | "network";

/** Existence of `admins/{uid}` is the whitelist. Errors fail closed. */
const checkWhitelist = async (uid: string): Promise<WhitelistResult> => {
  const db = getClientDb();
  if (!db) return "network";
  try {
    const snapshot = await getDoc(doc(db, firestoreCollections.admins, uid));
    return snapshot.exists() ? "admin" : "not-admin";
  } catch (error) {
    // permission-denied means the rules rejected the read: not an admin.
    return (error as { code?: string }).code === "permission-denied"
      ? "not-admin"
      : "network";
  }
};

const signInErrorReason = (
  error: unknown
): Exclude<AdminSignInResult, { ok: true }>["reason"] => {
  const code = (error as { code?: string }).code || "";
  if (code === "auth/network-request-failed") return "network";
  if (code === "auth/too-many-requests") return "rate-limited";
  return "invalid";
};

type AdminAuthProviderProps = {
  children: ReactNode;
};

/**
 * Firebase Email/Password session plus the Firestore admin whitelist.
 * Only `authorized` grants access; every other state is treated as locked.
 */
export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const configured = isFirebaseClientConfigured();
  const [status, setStatus] = useState<AdminAuthStatus>(
    configured ? "loading" : "not-configured"
  );
  const [user, setUser] = useState<User | null>(null);
  const signInPendingRef = useRef(false);
  const verifiedUidRef = useRef<string | null>(null);

  useEffect(() => {
    const auth = getClientAuth();
    if (!auth) {
      setStatus("not-configured");
      return undefined;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      // signIn() resolves its own attempt; avoid racing it here.
      if (signInPendingRef.current) return;

      if (!nextUser) {
        verifiedUidRef.current = null;
        setUser(null);
        setStatus((previous) =>
          previous === "unauthorized" ? previous : "guest"
        );
        return;
      }

      if (verifiedUidRef.current === nextUser.uid) return;

      setStatus("loading");
      checkWhitelist(nextUser.uid)
        .then(async (result) => {
          if (auth.currentUser?.uid !== nextUser.uid) return;
          if (result === "admin") {
            verifiedUidRef.current = nextUser.uid;
            setUser(nextUser);
            setStatus("authorized");
            return;
          }
          setUser(null);
          if (result === "not-admin") {
            setStatus("unauthorized");
            await firebaseSignOut(auth).catch(() => undefined);
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    });
  }, []);

  const signIn = useCallback(
    async (
      email: string,
      password: string,
      remember: boolean
    ): Promise<AdminSignInResult> => {
      const auth = getClientAuth();
      if (!auth) return { ok: false, reason: "not-configured" };

      signInPendingRef.current = true;
      try {
        await setPersistence(
          auth,
          remember ? browserLocalPersistence : browserSessionPersistence
        );
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const result = await checkWhitelist(credential.user.uid);
        if (result === "admin") {
          verifiedUidRef.current = credential.user.uid;
          setUser(credential.user);
          setStatus("authorized");
          return { ok: true };
        }

        verifiedUidRef.current = null;
        await firebaseSignOut(auth).catch(() => undefined);
        setUser(null);
        setStatus("guest");
        return {
          ok: false,
          reason: result === "not-admin" ? "denied" : "network",
        };
      } catch (error) {
        return { ok: false, reason: signInErrorReason(error) };
      } finally {
        signInPendingRef.current = false;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    const auth = getClientAuth();
    verifiedUidRef.current = null;
    setUser(null);
    setStatus("guest");
    if (auth) await firebaseSignOut(auth).catch(() => undefined);
  }, []);

  const value = useMemo(
    () => ({ status, user, signIn, signOut }),
    [status, user, signIn, signOut]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextValue => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
