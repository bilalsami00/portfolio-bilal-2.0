const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

export const parseIsoDate = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTime = (date: Date | null): string =>
  date
    ? date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export const formatRelative = (date: Date | null, now = Date.now()): string => {
  if (!date) return "—";
  const seconds = Math.round((now - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return formatDateTime(date);
};

export const formatDuration = (ms: number): string => {
  if (!Number.isFinite(ms) || ms <= 0) return "0s";
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

export const sessionDurationMs = (session: {
  sessionStart: string;
  lastActivity: string;
}): number => {
  const start = parseIsoDate(session.sessionStart);
  const last = parseIsoDate(session.lastActivity);
  return start && last ? Math.max(0, last.getTime() - start.getTime()) : 0;
};

export const isSessionActive = (
  lastActivity: string,
  now = Date.now()
): boolean => {
  const last = parseIsoDate(lastActivity);
  return Boolean(last && now - last.getTime() < ACTIVE_WINDOW_MS);
};

export const isSameLocalDay = (date: Date | null, reference = new Date()) =>
  Boolean(date && date.toDateString() === reference.toDateString());

export const maskIp = (ip: string): string => {
  if (!ip || ip === "unknown") return "unknown";
  if (ip.includes(".")) {
    const parts = ip.split(".");
    return `${parts.slice(0, 2).join(".")}.•••.•••`;
  }
  const groups = ip.split(":").filter(Boolean);
  return `${groups.slice(0, 2).join(":")}:••••`;
};

const csvCell = (value: string): string => {
  // Neutralise spreadsheet formula injection.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
};

export const downloadCsv = (filename: string, rows: string[][]) => {
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.setAttribute("data-visitor-ignore", "");
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
