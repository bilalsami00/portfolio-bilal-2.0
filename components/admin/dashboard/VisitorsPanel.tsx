import { useCallback, useEffect, useState } from "react";
import useListControls from "../../../hooks/useListControls";
import {
  formatDateTime,
  formatDuration,
  formatRelative,
  isSessionActive,
  maskIp,
  parseIsoDate,
  sessionDurationMs,
} from "../../../utilities/dashboardFormat";
import { Button } from "../../shared/Button";
import {
  useDashboardData,
  VisitorSessionRecord,
} from "./DashboardDataProvider";
import {
  AdminDialog,
  ConfirmDialog,
  DetailRow,
  ListToolbar,
  Pagination,
  PanelMessage,
  SkeletonRows,
} from "./DashboardUi";

type VisitorSort = "newest" | "oldest" | "recent" | "longest" | "pages";

const sortOptions: { value: VisitorSort; label: string }[] = [
  { value: "newest", label: "Newest session" },
  { value: "oldest", label: "Oldest session" },
  { value: "recent", label: "Last active" },
  { value: "longest", label: "Longest duration" },
  { value: "pages", label: "Most pages" },
];

const timeOf = (iso: string) => parseIsoDate(iso)?.getTime() ?? 0;

const sorters: Record<
  VisitorSort,
  (a: VisitorSessionRecord, b: VisitorSessionRecord) => number
> = {
  newest: (a, b) => timeOf(b.sessionStart) - timeOf(a.sessionStart),
  oldest: (a, b) => timeOf(a.sessionStart) - timeOf(b.sessionStart),
  recent: (a, b) => timeOf(b.lastActivity) - timeOf(a.lastActivity),
  longest: (a, b) => sessionDurationMs(b) - sessionDurationMs(a),
  pages: (a, b) => b.visitedPages.length - a.visitedPages.length,
};

const matches = (session: VisitorSessionRecord, needle: string) =>
  [
    session.ipAddress,
    session.country,
    session.city,
    session.deviceType,
    session.deviceBrand ?? "",
    session.deviceModel ?? "",
    session.browser,
    session.operatingSystem,
    session.referrer,
    ...session.visitedPages,
  ].some((value) => value.toLowerCase().includes(needle));

const locationLabel = (session: VisitorSessionRecord) =>
  [session.city, session.country]
    .filter((value) => value && value !== "unknown")
    .join(", ") || "unknown";

const deviceLabel = (session: VisitorSessionRecord) =>
  [session.deviceBrand, session.deviceModel].filter(Boolean).join(" ");

const useNow = (intervalMs: number) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
};

const IpCell = ({ ip }: { ip: string }) => {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard
      ?.writeText(ip)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      <code className="font-mono text-xs text-parchment-200">
        {revealed ? ip : maskIp(ip)}
      </code>
      <button
        type="button"
        className="text-[0.65rem] font-accent uppercase tracking-[0.14em] text-steel-400 hover:text-parchment-100"
        onClick={() => setRevealed((value) => !value)}
        aria-label={revealed ? "Hide IP address" : "Reveal IP address"}
      >
        {revealed ? "Hide" : "Reveal"}
      </button>
      {ip !== "unknown" && (
        <button
          type="button"
          className="text-[0.65rem] font-accent uppercase tracking-[0.14em] text-steel-400 hover:text-parchment-100"
          onClick={copy}
          aria-label="Copy IP address"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      )}
    </span>
  );
};

const ActivityBadge = ({
  lastActivity,
  now,
}: {
  lastActivity: string;
  now: number;
}) =>
  isSessionActive(lastActivity, now) ? (
    <span className="status-pill !py-1 !px-2 !text-[0.65rem]">Active</span>
  ) : (
    <span className="text-parchment-400">
      {formatRelative(parseIsoDate(lastActivity), now)}
    </span>
  );

const PagePills = ({ pages, max = 3 }: { pages: string[]; max?: number }) => (
  <span className="flex flex-wrap gap-1.5">
    {pages.slice(0, max).map((page) => (
      <span
        key={page}
        className="tech-tag !px-2 !py-0.5 max-w-[12rem] truncate"
      >
        {page}
      </span>
    ))}
    {pages.length > max && (
      <span className="tech-tag !px-2 !py-0.5">+{pages.length - max}</span>
    )}
  </span>
);

const OrderedList = ({ items, empty }: { items: string[]; empty: string }) =>
  items.length ? (
    <ol className="space-y-1.5 list-decimal pl-5">
      {items.map((item) => (
        <li key={item} className="break-all">
          {item}
        </li>
      ))}
    </ol>
  ) : (
    <span className="text-parchment-400">{empty}</span>
  );

const VisitorDetail = ({
  session,
  now,
}: {
  session: VisitorSessionRecord;
  now: number;
}) => (
  <dl>
    <DetailRow label="Status">
      <span className="inline-flex flex-wrap items-center gap-2">
        <ActivityBadge lastActivity={session.lastActivity} now={now} />
        {session.isReturningVisitor && (
          <span className="tech-tag !py-0.5">Returning visitor</span>
        )}
      </span>
    </DetailRow>
    <DetailRow label="IP address">
      <IpCell ip={session.ipAddress} />
    </DetailRow>
    <DetailRow label="Location">{locationLabel(session)}</DetailRow>
    <DetailRow label="Device">
      {session.deviceType}
      {deviceLabel(session) && ` · ${deviceLabel(session)}`}
    </DetailRow>
    <DetailRow label="Browser">{session.browser}</DetailRow>
    <DetailRow label="OS">{session.operatingSystem}</DetailRow>
    <DetailRow label="Screen">{session.screenSize}</DetailRow>
    <DetailRow label="Viewport">{session.viewportSize}</DetailRow>
    <DetailRow label="Touch">{session.touchSupport ? "Yes" : "No"}</DetailRow>
    <DetailRow label="Referrer">{session.referrer}</DetailRow>
    <DetailRow label="Landing page">{session.landingPage}</DetailRow>
    <DetailRow label="Session start">
      {formatDateTime(parseIsoDate(session.sessionStart))}
    </DetailRow>
    <DetailRow label="Last activity">
      {formatDateTime(parseIsoDate(session.lastActivity))}
    </DetailRow>
    <DetailRow label="Duration">
      {formatDuration(sessionDurationMs(session))}
    </DetailRow>
    <DetailRow label={`Pages (${session.visitedPages.length})`}>
      <OrderedList items={session.visitedPages} empty="No pages recorded" />
    </DetailRow>
    <DetailRow label={`Clicks (${session.clickedLinks.length})`}>
      <OrderedList items={session.clickedLinks} empty="No link clicks" />
    </DetailRow>
    <DetailRow label="Session ID">
      <code className="font-mono text-xs">{session.sessionId}</code>
    </DetailRow>
  </dl>
);

const VisitorsPanel = () => {
  const { sessions, sessionsState, deleteSession } = useDashboardData();
  const now = useNow(30000);
  const list = useListControls<VisitorSessionRecord, VisitorSort>(sessions, {
    matches,
    sorters,
    defaultSort: "newest",
  });
  const [viewing, setViewing] = useState<VisitorSessionRecord | null>(null);
  const [pendingDelete, setPendingDelete] =
    useState<VisitorSessionRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Keep the open detail view in sync with realtime updates.
  const liveViewing = viewing
    ? sessions.find((session) => session.id === viewing.id) ?? viewing
    : null;

  const closeView = useCallback(() => setViewing(null), []);
  const cancelDelete = useCallback(() => {
    setPendingDelete(null);
    setDeleteError(null);
  }, []);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);
    deleteSession(pendingDelete.id)
      .then(() => setPendingDelete(null))
      .catch(() => setDeleteError("Could not delete this session. Try again."))
      .finally(() => setDeleting(false));
  };

  const actions = (session: VisitorSessionRecord) => (
    <div className="flex gap-2 lg:justify-end">
      <Button
        variant="secondary"
        className="btn-sm"
        onClick={() => setViewing(session)}
      >
        View
      </Button>
      <Button
        variant="secondary"
        className="btn-sm"
        onClick={() => setPendingDelete(session)}
      >
        Delete
      </Button>
    </div>
  );

  let body;
  if (sessionsState === "loading") {
    body = <SkeletonRows />;
  } else if (sessionsState === "error") {
    body = (
      <PanelMessage
        tone="error"
        title="Visitors unavailable"
        description="Could not load visitor sessions. Check your connection and Firestore rules."
      />
    );
  } else if (!sessions.length) {
    body = (
      <PanelMessage
        title="No visitors yet"
        description="Sessions appear here as people browse the public site."
      />
    );
  } else if (!list.results.length) {
    body = (
      <PanelMessage
        title="No matches"
        description="Try a different search term."
      />
    );
  } else {
    body = (
      <>
        <div className="hidden lg:block overflow-x-auto border border-steel-700/40">
          <table className="w-full text-left text-sm">
            <thead className="text-[0.7rem] font-accent uppercase tracking-[0.16em] text-steel-400">
              <tr className="border-b border-steel-700/40">
                <th scope="col" className="px-4 py-3 font-semibold">
                  IP
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Location
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Device
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Pages
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Clicks
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Duration
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Last activity
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {list.pageItems.map((session) => (
                <tr
                  key={session.id}
                  className="border-b border-steel-700/40 last:border-0 align-top"
                >
                  <td className="px-4 py-3">
                    <IpCell ip={session.ipAddress} />
                  </td>
                  <td className="px-4 py-3 text-parchment-300">
                    {locationLabel(session)}
                  </td>
                  <td className="px-4 py-3 text-parchment-300">
                    <span className="text-parchment-100">
                      {session.deviceType}
                    </span>
                    <span className="block text-xs text-steel-400">
                      {session.browser} · {session.operatingSystem}
                    </span>
                    {deviceLabel(session) && (
                      <span className="block text-xs text-steel-400">
                        {deviceLabel(session)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <PagePills pages={session.visitedPages} />
                  </td>
                  <td className="px-4 py-3 text-parchment-300">
                    {session.clickedLinks.length}
                  </td>
                  <td className="px-4 py-3 text-parchment-300 whitespace-nowrap">
                    {formatDuration(sessionDurationMs(session))}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ActivityBadge
                      lastActivity={session.lastActivity}
                      now={now}
                    />
                  </td>
                  <td className="px-4 py-3">{actions(session)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="lg:hidden grid gap-3 md:grid-cols-2">
          {list.pageItems.map((session) => (
            <li key={session.id} className="ink-panel p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <IpCell ip={session.ipAddress} />
                <span className="shrink-0 text-xs">
                  <ActivityBadge
                    lastActivity={session.lastActivity}
                    now={now}
                  />
                </span>
              </div>
              <p className="text-sm text-parchment-300">
                {locationLabel(session)} · {session.deviceType}
                <span className="block text-xs text-steel-400">
                  {session.browser} · {session.operatingSystem}
                  {deviceLabel(session) && ` · ${deviceLabel(session)}`}
                </span>
              </p>
              <PagePills pages={session.visitedPages} />
              <p className="text-xs text-steel-400 font-accent tracking-wide">
                {session.clickedLinks.length} clicks ·{" "}
                {formatDuration(sessionDurationMs(session))}
              </p>
              {actions(session)}
            </li>
          ))}
        </ul>

        <Pagination
          page={list.page}
          pageCount={list.pageCount}
          total={list.results.length}
          onPageChange={list.setPage}
        />
      </>
    );
  }

  return (
    <div className="space-y-5" data-visitor-ignore>
      <ListToolbar
        idPrefix="visitors"
        query={list.query}
        onQueryChange={list.setQuery}
        searchPlaceholder="IP, location, device, browser, page…"
        sort={list.sort}
        sortOptions={sortOptions}
        onSortChange={list.setSort}
        pageSize={list.pageSize}
        onPageSizeChange={list.setPageSize}
      />

      {body}

      <AdminDialog
        open={Boolean(liveViewing)}
        title="Visitor session"
        onClose={closeView}
        footer={
          liveViewing && (
            <Button
              variant="secondary"
              className="btn-sm"
              onClick={() => {
                setPendingDelete(liveViewing);
                setViewing(null);
              }}
            >
              Delete session
            </Button>
          )
        }
      >
        {liveViewing && <VisitorDetail session={liveViewing} now={now} />}
      </AdminDialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete visitor session?"
        description="This permanently removes the session and its page and click history. This cannot be undone."
        confirmLabel="Delete session"
        busy={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default VisitorsPanel;
