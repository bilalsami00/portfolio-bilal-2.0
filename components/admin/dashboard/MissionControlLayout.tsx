import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useMemo, useState } from "react";
import PageShell from "../../layout";
import Container from "../../shared/Container";
import { Button } from "../../shared/Button";
import { routePaths } from "../../../data/navigation";
import {
  isSameLocalDay,
  parseIsoDate,
} from "../../../utilities/dashboardFormat";
import { AdminAuthProvider, useAdminAuth } from "../AdminAuthProvider";
import MaskedNotFound from "../MaskedNotFound";
import {
  DashboardDataProvider,
  useDashboardData,
  VISITOR_SESSION_LIMIT,
} from "./DashboardDataProvider";

const tabs = [
  { href: routePaths.missionControlMessages, label: "Messages" },
  { href: routePaths.missionControlVisitors, label: "Visitors" },
] as const;

const LiveClock = () => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className="font-accent text-xs tracking-[0.14em] uppercase text-steel-400">
      {now
        ? now.toLocaleString(undefined, {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "\u00a0"}
    </span>
  );
};

const StatCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <div className="ink-panel p-4 sm:p-5">
    <p className="text-[0.7rem] font-accent uppercase tracking-[0.18em] text-steel-400">
      {label}
    </p>
    <p className="mt-2 font-display text-3xl sm:text-4xl font-bold text-parchment-100 leading-none">
      {value}
    </p>
    {hint && <p className="mt-2 text-xs text-steel-500">{hint}</p>}
  </div>
);

const OverviewStats = () => {
  const { messages, messagesState, sessions, sessionsState } =
    useDashboardData();

  const stats = useMemo(() => {
    const today = new Date();
    return {
      pageViews: sessions.reduce(
        (sum, session) => sum + session.visitedPages.length,
        0
      ),
      todaysVisitors: sessions.filter((session) =>
        isSameLocalDay(parseIsoDate(session.sessionStart), today)
      ).length,
    };
  }, [sessions]);

  const show = (state: string, value: number, capped = false) => {
    if (state === "loading") return "…";
    if (state === "error") return "—";
    return `${value.toLocaleString()}${capped ? "+" : ""}`;
  };
  const capped = sessions.length >= VISITOR_SESSION_LIMIT;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <StatCard
        label="Total messages"
        value={show(messagesState, messages.length)}
      />
      <StatCard
        label="Total visitors"
        value={show(sessionsState, sessions.length, capped)}
        hint={
          capped ? `Latest ${VISITOR_SESSION_LIMIT} sessions loaded` : undefined
        }
      />
      <StatCard
        label="Page views"
        value={show(sessionsState, stats.pageViews)}
      />
      <StatCard
        label="Today's visitors"
        value={show(sessionsState, stats.todaysVisitors)}
      />
    </div>
  );
};

const DashboardShell = ({
  children,
  onSignOut,
}: {
  children: ReactNode;
  onSignOut: () => void;
}) => {
  const { pathname } = useRouter();
  const { user } = useAdminAuth();

  return (
    <section className="py-10 sm:py-14 min-h-[60vh]">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-eyebrow">Mission Control</p>
            <div className="crimson-mark mt-4 mb-5" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-parchment-100">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-parchment-400 break-all">
              Signed in as {user?.email ?? "admin"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LiveClock />
            <Button variant="secondary" className="btn-sm" onClick={onSignOut}>
              Sign out
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <OverviewStats />
        </div>

        <nav
          className="mt-8 flex gap-1 border-b border-steel-700/40"
          aria-label="Dashboard sections"
        >
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`nav-link ${
                  active
                    ? "nav-link-active"
                    : "text-parchment-300 hover:text-parchment-100"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6">{children}</div>
      </Container>
    </section>
  );
};

const NeutralState = ({ label }: { label: string }) => (
  <PageShell title="Mission Control" path={routePaths.missionControl} noIndex>
    <section className="py-16 sm:py-24 min-h-[60vh]">
      <Container className="max-w-xl">
        <p className="ink-panel p-6 text-sm text-parchment-400" role="status">
          {label}
        </p>
      </Container>
    </section>
  </PageShell>
);

const titles: Record<string, string> = {
  [routePaths.missionControlMessages]: "Messages · Mission Control",
  [routePaths.missionControlVisitors]: "Visitors · Mission Control",
};

/** Renders dashboard content only for whitelisted admins; else a 404. */
const DashboardGate = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { status, signOut } = useAdminAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = () => {
    setSigningOut(true);
    signOut()
      .then(() => router.replace(routePaths.missionControl))
      .catch(() => undefined);
  };

  if (signingOut) return <NeutralState label="Signing out…" />;
  if (status === "loading") return <NeutralState label="Checking access…" />;
  if (status !== "authorized") return <MaskedNotFound />;

  return (
    <PageShell
      title={titles[router.pathname] ?? "Mission Control"}
      path={router.pathname}
      noIndex
    >
      <DashboardDataProvider>
        <DashboardShell onSignOut={handleSignOut}>{children}</DashboardShell>
      </DashboardDataProvider>
    </PageShell>
  );
};

const MissionControlLayout = ({ children }: { children: ReactNode }) => (
  <AdminAuthProvider>
    <DashboardGate>{children}</DashboardGate>
  </AdminAuthProvider>
);

export const getMissionControlLayout = (page: ReactNode) => (
  <MissionControlLayout>{page}</MissionControlLayout>
);

export default MissionControlLayout;
