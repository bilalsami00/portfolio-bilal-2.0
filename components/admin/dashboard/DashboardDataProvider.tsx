import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { deleteInBatches } from "../../../utilities/bulkDelete";
import {
  firestoreCollections,
  getClientDb,
} from "../../../utilities/firebaseClient";
import type { ContactMessageInput } from "../../../utilities/schemas/contact";
import type {
  VisitorDeviceType,
  VisitorSessionDocument,
} from "../../../utilities/schemas/visitor";

export const VISITOR_SESSION_LIMIT = 1000;

export type LoadState = "loading" | "ready" | "error";

export type ContactMessageRecord = ContactMessageInput & {
  id: string;
  createdAt: Date | null;
};

export type VisitorSessionRecord = VisitorSessionDocument & { id: string };

type DashboardDataValue = {
  messages: ContactMessageRecord[];
  messagesState: LoadState;
  sessions: VisitorSessionRecord[];
  sessionsState: LoadState;
  deleteMessage: (id: string) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  deleteMessages: (ids: readonly string[]) => Promise<number>;
  deleteSessions: (ids: readonly string[]) => Promise<number>;
};

const DashboardDataContext = createContext<DashboardDataValue | undefined>(
  undefined
);

const text = (value: unknown): string =>
  typeof value === "string" ? value : "";

const textList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const toMessage = (id: string, data: DocumentData): ContactMessageRecord => ({
  id,
  fullName: text(data.fullName),
  email: text(data.email),
  phone: text(data.phone),
  company: text(data.company),
  subject: text(data.subject),
  message: text(data.message),
  createdAt:
    data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
});

const toSession = (id: string, data: DocumentData): VisitorSessionRecord => ({
  id,
  sessionId: text(data.sessionId) || id,
  ipAddress: text(data.ipAddress) || "unknown",
  country: text(data.country) || "unknown",
  city: text(data.city) || "unknown",
  deviceType: (text(data.deviceType) || "Desktop") as VisitorDeviceType,
  deviceBrand: text(data.deviceBrand) || null,
  deviceModel: text(data.deviceModel) || null,
  browser: text(data.browser) || "unknown",
  operatingSystem: text(data.operatingSystem) || "unknown",
  screenSize: text(data.screenSize) || "unknown",
  viewportSize: text(data.viewportSize) || "unknown",
  touchSupport: data.touchSupport === true,
  referrer: text(data.referrer) || "direct",
  landingPage: text(data.landingPage),
  isReturningVisitor: data.isReturningVisitor === true,
  visitedPages: textList(data.visitedPages),
  clickedLinks: textList(data.clickedLinks),
  sessionStart: text(data.sessionStart),
  lastActivity: text(data.lastActivity),
});

/** Realtime admin-only reads. Mounted only after the whitelist check passes. */
export const DashboardDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [messagesState, setMessagesState] = useState<LoadState>("loading");
  const [sessions, setSessions] = useState<VisitorSessionRecord[]>([]);
  const [sessionsState, setSessionsState] = useState<LoadState>("loading");

  useEffect(() => {
    const db = getClientDb();
    if (!db) {
      setMessagesState("error");
      setSessionsState("error");
      return undefined;
    }

    const unsubscribeMessages = onSnapshot(
      query(
        collection(db, firestoreCollections.contactMessages),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        setMessages(
          snapshot.docs.map((item) => toMessage(item.id, item.data()))
        );
        setMessagesState("ready");
      },
      () => setMessagesState("error")
    );

    const unsubscribeSessions = onSnapshot(
      query(
        collection(db, firestoreCollections.visitorSessions),
        orderBy("sessionStart", "desc"),
        limit(VISITOR_SESSION_LIMIT)
      ),
      (snapshot) => {
        setSessions(
          snapshot.docs.map((item) => toSession(item.id, item.data()))
        );
        setSessionsState("ready");
      },
      () => setSessionsState("error")
    );

    return () => {
      unsubscribeMessages();
      unsubscribeSessions();
    };
  }, []);

  const deleteMessage = useCallback(async (id: string) => {
    const db = getClientDb();
    if (!db) throw new Error("Firestore unavailable");
    await deleteDoc(doc(db, firestoreCollections.contactMessages, id));
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    const db = getClientDb();
    if (!db) throw new Error("Firestore unavailable");
    await deleteDoc(doc(db, firestoreCollections.visitorSessions, id));
  }, []);

  const deleteMany = useCallback(
    async (collectionName: string, ids: readonly string[]) => {
      const db = getClientDb();
      if (!db) throw new Error("Firestore unavailable");
      return deleteInBatches(async (chunk) => {
        const batch = writeBatch(db);
        chunk.forEach((id) => {
          batch.delete(doc(db, collectionName, id));
        });
        await batch.commit();
      }, ids);
    },
    []
  );

  const deleteMessages = useCallback(
    async (ids: readonly string[]) =>
      deleteMany(firestoreCollections.contactMessages, ids),
    [deleteMany]
  );

  const deleteSessions = useCallback(
    async (ids: readonly string[]) =>
      deleteMany(firestoreCollections.visitorSessions, ids),
    [deleteMany]
  );

  const value = useMemo(
    () => ({
      messages,
      messagesState,
      sessions,
      sessionsState,
      deleteMessage,
      deleteSession,
      deleteMessages,
      deleteSessions,
    }),
    [
      messages,
      messagesState,
      sessions,
      sessionsState,
      deleteMessage,
      deleteSession,
      deleteMessages,
      deleteSessions,
    ]
  );

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
};

export const useDashboardData = (): DashboardDataValue => {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error(
      "useDashboardData must be used within DashboardDataProvider"
    );
  }
  return context;
};
