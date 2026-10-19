import { useCallback, useMemo, useState } from "react";
import useListControls from "../../../hooks/useListControls";
import useRecordSelection from "../../../hooks/useRecordSelection";
import {
  BulkDeleteError,
  formatBulkDeleteFailure,
  formatBulkDeleteSuccess,
} from "../../../utilities/bulkDelete";
import {
  downloadCsv,
  formatDateTime,
} from "../../../utilities/dashboardFormat";
import { Button } from "../../shared/Button";
import {
  ContactMessageRecord,
  useDashboardData,
} from "./DashboardDataProvider";
import {
  AdminDialog,
  BulkSelectionBar,
  ConfirmDialog,
  DetailRow,
  ListToolbar,
  Pagination,
  PanelMessage,
  RecordCheckbox,
  SelectAllCheckbox,
  SkeletonRows,
} from "./DashboardUi";

type MessageSort = "newest" | "oldest" | "name";

const sortOptions: { value: MessageSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "Name A–Z" },
];

const time = (message: ContactMessageRecord) =>
  message.createdAt?.getTime() ?? 0;

const sorters: Record<
  MessageSort,
  (a: ContactMessageRecord, b: ContactMessageRecord) => number
> = {
  newest: (a, b) => time(b) - time(a),
  oldest: (a, b) => time(a) - time(b),
  name: (a, b) => a.fullName.localeCompare(b.fullName),
};

const matches = (message: ContactMessageRecord, needle: string) =>
  [
    message.fullName,
    message.email,
    message.phone,
    message.company,
    message.subject,
    message.message,
  ].some((value) => value.toLowerCase().includes(needle));

const exportMessages = (messages: ContactMessageRecord[]) => {
  downloadCsv(`contact-messages-${new Date().toISOString().slice(0, 10)}.csv`, [
    ["Date", "Name", "Email", "Phone", "Company", "Subject", "Message"],
    ...messages.map((message) => [
      message.createdAt?.toISOString() ?? "",
      message.fullName,
      message.email,
      message.phone,
      message.company,
      message.subject,
      message.message,
    ]),
  ]);
};

const MessagesPanel = () => {
  const { messages, messagesState, deleteMessage, deleteMessages } =
    useDashboardData();
  const list = useListControls<ContactMessageRecord, MessageSort>(messages, {
    matches,
    sorters,
    defaultSort: "newest",
  });
  const resultIds = useMemo(
    () => list.results.map((message) => message.id),
    [list.results]
  );
  const pageIds = list.pageItems.map((message) => message.id);
  const selection = useRecordSelection(resultIds);
  const pageFlags = selection.flags(pageIds);
  const [viewing, setViewing] = useState<ContactMessageRecord | null>(null);
  const [pendingDelete, setPendingDelete] =
    useState<ContactMessageRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [pendingBulk, setPendingBulk] = useState<string[] | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkNotice, setBulkNotice] = useState<string | null>(null);

  const closeView = useCallback(() => setViewing(null), []);
  const cancelDelete = useCallback(() => {
    setPendingDelete(null);
    setDeleteError(null);
  }, []);

  const confirmDelete = () => {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    deleteMessage(pendingDelete.id)
      .then(() => setPendingDelete(null))
      .catch(() => setDeleteError("Could not delete this message. Try again."))
      .finally(() => setDeleting(false));
  };

  const cancelBulkDelete = useCallback(() => {
    if (bulkDeleting) return;
    setPendingBulk(null);
    setBulkError(null);
  }, [bulkDeleting]);

  const requestBulkDelete = () => {
    if (bulkDeleting || selection.selectedCount === 0) return;
    setBulkError(null);
    setBulkNotice(null);
    setPendingBulk([...selection.selectedIds]);
  };

  const confirmBulkDelete = () => {
    if (!pendingBulk || bulkDeleting) return;
    const allowed = new Set(resultIds);
    const ids = pendingBulk.filter((id) => allowed.has(id));
    if (!ids.length) {
      setBulkNotice(null);
      setPendingBulk(null);
      setBulkError("Those messages are no longer available.");
      return;
    }
    setBulkDeleting(true);
    setBulkError(null);
    deleteMessages(ids)
      .then((deleted) => {
        selection.clear();
        setPendingBulk(null);
        setBulkNotice(formatBulkDeleteSuccess(deleted, "message", "messages"));
      })
      .catch((error: unknown) => {
        if (error instanceof BulkDeleteError) {
          selection.replace(error.failedIds);
          setPendingBulk(error.failedIds);
          setBulkError(formatBulkDeleteFailure(error, "message", "messages"));
          return;
        }
        setBulkError("Could not delete the selected messages. Try again.");
      })
      .finally(() => setBulkDeleting(false));
  };

  let body;
  if (messagesState === "loading") {
    body = <SkeletonRows />;
  } else if (messagesState === "error") {
    body = (
      <PanelMessage
        tone="error"
        title="Messages unavailable"
        description="Could not load messages. Check your connection and Firestore rules."
      />
    );
  } else if (!messages.length) {
    body = (
      <PanelMessage
        title="No messages yet"
        description="Contact form submissions will appear here in real time."
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
        <div className="hidden md:block overflow-x-auto border border-steel-700/40">
          <table className="w-full text-left text-sm">
            <thead className="text-[0.7rem] font-accent uppercase tracking-[0.16em] text-steel-400">
              <tr className="border-b border-steel-700/40">
                <th scope="col" className="w-12 px-4 py-3 font-semibold">
                  <SelectAllCheckbox
                    id="messages-select-all"
                    checked={pageFlags.allSelected}
                    indeterminate={pageFlags.indeterminate}
                    onChange={() => selection.toggleVisible(pageIds)}
                    label="Select all visible messages"
                    hideLabel
                    disabled={bulkDeleting}
                  />
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Subject
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {list.pageItems.map((message) => (
                <tr
                  key={message.id}
                  className="border-b border-steel-700/40 last:border-0 align-top"
                >
                  <td className="px-4 py-3">
                    <RecordCheckbox
                      id={`message-select-${message.id}`}
                      checked={selection.selected.has(message.id)}
                      onChange={(checked) =>
                        selection.toggle(message.id, checked)
                      }
                      label={`Select message from ${message.fullName}`}
                      disabled={bulkDeleting}
                    />
                  </td>
                  <td className="px-4 py-3 text-parchment-100">
                    {message.fullName}
                    {message.company && (
                      <span className="block text-xs text-steel-400">
                        {message.company}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-parchment-300 break-all">
                    {message.email}
                  </td>
                  <td className="px-4 py-3 text-parchment-300 max-w-[18rem] truncate">
                    {message.subject}
                  </td>
                  <td className="px-4 py-3 text-parchment-400 whitespace-nowrap">
                    {formatDateTime(message.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        className="btn-sm"
                        onClick={() => setViewing(message)}
                      >
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        className="btn-sm"
                        onClick={() => setPendingDelete(message)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          <SelectAllCheckbox
            id="messages-select-all-mobile"
            checked={pageFlags.allSelected}
            indeterminate={pageFlags.indeterminate}
            onChange={() => selection.toggleVisible(pageIds)}
            label="Select all"
            disabled={bulkDeleting}
          />
        </div>

        <ul className="md:hidden space-y-3">
          {list.pageItems.map((message) => (
            <li key={message.id} className="ink-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <RecordCheckbox
                    id={`message-select-mobile-${message.id}`}
                    checked={selection.selected.has(message.id)}
                    onChange={(checked) =>
                      selection.toggle(message.id, checked)
                    }
                    label={`Select message from ${message.fullName}`}
                    disabled={bulkDeleting}
                  />
                  <div className="min-w-0">
                    <p className="text-parchment-100 font-semibold truncate">
                      {message.fullName}
                    </p>
                    <p className="text-xs text-steel-400 break-all">
                      {message.email}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-xs text-steel-400">
                  {formatDateTime(message.createdAt)}
                </p>
              </div>
              <p className="mt-3 text-sm text-parchment-300 truncate">
                {message.subject}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  className="btn-sm"
                  onClick={() => setViewing(message)}
                >
                  View
                </Button>
                <Button
                  variant="secondary"
                  className="btn-sm"
                  onClick={() => setPendingDelete(message)}
                >
                  Delete
                </Button>
              </div>
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
        idPrefix="messages"
        query={list.query}
        onQueryChange={list.setQuery}
        searchPlaceholder="Name, email, subject, message…"
        sort={list.sort}
        sortOptions={sortOptions}
        onSortChange={list.setSort}
        pageSize={list.pageSize}
        onPageSizeChange={list.setPageSize}
        actions={
          <Button
            variant="secondary"
            className="w-full sm:w-auto !min-h-[2.9rem]"
            onClick={() => exportMessages(list.results)}
            disabled={!list.results.length}
          >
            Export CSV
          </Button>
        }
      />

      {bulkNotice && (
        <p className="form-notice form-notice--success" role="status">
          {bulkNotice}
        </p>
      )}
      {bulkError && !pendingBulk && (
        <p className="form-notice" role="alert">
          {bulkError}
        </p>
      )}

      <BulkSelectionBar
        count={messagesState === "ready" ? selection.selectedCount : 0}
        noun="message"
        onDelete={requestBulkDelete}
        disabled={bulkDeleting}
      />

      {body}

      <AdminDialog
        open={Boolean(viewing)}
        title={viewing?.subject || "Message"}
        onClose={closeView}
        footer={
          viewing && (
            <>
              <a
                href={`mailto:${viewing.email}?subject=${encodeURIComponent(
                  `Re: ${viewing.subject}`
                )}`}
                className="btn-primary btn-sm"
              >
                Reply by email
              </a>
              <Button
                variant="secondary"
                className="btn-sm"
                onClick={() => {
                  setPendingDelete(viewing);
                  setViewing(null);
                }}
              >
                Delete
              </Button>
            </>
          )
        }
      >
        {viewing && (
          <dl>
            <DetailRow label="Name">{viewing.fullName}</DetailRow>
            <DetailRow label="Email">{viewing.email}</DetailRow>
            {viewing.phone && (
              <DetailRow label="Phone">{viewing.phone}</DetailRow>
            )}
            {viewing.company && (
              <DetailRow label="Company">{viewing.company}</DetailRow>
            )}
            <DetailRow label="Subject">{viewing.subject}</DetailRow>
            <DetailRow label="Received">
              {formatDateTime(viewing.createdAt)}
            </DetailRow>
            <DetailRow label="Message">
              <span className="whitespace-pre-wrap leading-relaxed">
                {viewing.message}
              </span>
            </DetailRow>
          </dl>
        )}
      </AdminDialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete message?"
        description={`This permanently removes the message from ${
          pendingDelete?.fullName || "this sender"
        }. This cannot be undone.`}
        confirmLabel="Delete message"
        busy={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <ConfirmDialog
        open={Boolean(pendingBulk)}
        title="Delete selected messages?"
        description={
          pendingBulk
            ? `This permanently deletes ${pendingBulk.length} ${
                pendingBulk.length === 1 ? "message" : "messages"
              } from contact messages. Visitor sessions are not affected. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete messages"
        busy={bulkDeleting}
        error={bulkError}
        onConfirm={confirmBulkDelete}
        onCancel={cancelBulkDelete}
      />
    </div>
  );
};

export default MessagesPanel;
