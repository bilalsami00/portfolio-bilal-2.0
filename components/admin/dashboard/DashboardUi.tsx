import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../shared/Button";

type AdminDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
};

/** Portal dialog matching ProjectDetailsModal (scrim, ink panel, Escape). */
export const AdminDialog = ({
  open,
  title,
  onClose,
  children,
  footer,
  size = "lg",
}: AdminDialogProps) => {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 overlay-scrim"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full ${
          size === "md" ? "max-w-md" : "max-w-3xl"
        } max-h-[92vh] overflow-y-auto overscroll-contain ink-panel border-crimson-700/30`}
        data-lenis-prevent
      >
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 p-5 sm:p-6 surface-fade-top">
          <h2 className="font-display text-xl sm:text-2xl text-parchment-100 font-bold leading-snug break-words">
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="btn-secondary btn-sm shrink-0"
          >
            Close
          </button>
        </div>
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-steel-700/40 px-5 py-4 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  busy: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel,
  busy,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <AdminDialog
    open={open}
    title={title}
    onClose={busy ? () => undefined : onCancel}
    size="md"
    footer={
      <>
        <Button variant="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={busy}>
          {busy ? "Deleting…" : confirmLabel}
        </Button>
      </>
    }
  >
    <p className="text-sm text-parchment-400 leading-relaxed">{description}</p>
    {error && (
      <p className="form-notice mt-4" role="alert">
        {error}
      </p>
    )}
  </AdminDialog>
);

type SortOption<S extends string> = { value: S; label: string };

type ListToolbarProps<S extends string> = {
  idPrefix: string;
  query: string;
  onQueryChange: (value: string) => void;
  searchPlaceholder: string;
  sort: S;
  sortOptions: SortOption<S>[];
  onSortChange: (value: S) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  actions?: ReactNode;
};

const controlLabel =
  "block text-[0.7rem] font-accent uppercase tracking-[0.16em] text-steel-400";

export const ListToolbar = <S extends string>({
  idPrefix,
  query,
  onQueryChange,
  searchPlaceholder,
  sort,
  sortOptions,
  onSortChange,
  pageSize,
  onPageSizeChange,
  actions,
}: ListToolbarProps<S>) => (
  <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
    <label htmlFor={`${idPrefix}-search`} className={`${controlLabel} flex-1`}>
      Search
      <input
        id={`${idPrefix}-search`}
        type="search"
        className="contact-field mt-2 !py-2.5"
        placeholder={searchPlaceholder}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </label>
    <div className="grid grid-cols-2 gap-3 sm:flex sm:items-end">
      <label htmlFor={`${idPrefix}-sort`} className={controlLabel}>
        Sort
        <select
          id={`${idPrefix}-sort`}
          className="contact-field mt-2 !py-2.5 sm:min-w-[11rem]"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as S)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor={`${idPrefix}-page-size`} className={controlLabel}>
        Per page
        <select
          id={`${idPrefix}-page-size`}
          className="contact-field mt-2 !py-2.5"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {[10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      {actions && <div className="col-span-2 sm:col-span-1">{actions}</div>}
    </div>
  </div>
);

type PaginationProps = {
  page: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  page,
  pageCount,
  total,
  onPageChange,
}: PaginationProps) => (
  <nav
    className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-steel-400"
    aria-label="Pagination"
  >
    <p className="font-accent tracking-wide">
      {total} result{total === 1 ? "" : "s"} · Page {page} of {pageCount}
    </p>
    <div className="flex gap-2">
      <Button
        variant="secondary"
        className="btn-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </Button>
      <Button
        variant="secondary"
        className="btn-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
      >
        Next
      </Button>
    </div>
  </nav>
);

export const SkeletonRows = ({ rows = 4 }: { rows?: number }) => (
  <div className="space-y-3" aria-hidden>
    {Array.from({ length: rows }, (_, index) => (
      <div
        key={index}
        className="h-14 animate-pulse border border-steel-700/40 bg-ink-800/70"
      />
    ))}
  </div>
);

export const PanelMessage = ({
  title,
  description,
  tone = "neutral",
}: {
  title: string;
  description: string;
  tone?: "neutral" | "error";
}) => (
  <div
    className={`border p-8 text-center ${
      tone === "error" ? "border-crimson-700/40" : "border-steel-700/40"
    }`}
    role={tone === "error" ? "alert" : "status"}
  >
    <p className="font-display text-lg text-parchment-100 font-bold">{title}</p>
    <p className="mt-2 text-sm text-parchment-400">{description}</p>
  </div>
);

type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
};

export const RecordCheckbox = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
}: CheckboxProps) => (
  <input
    id={id}
    type="checkbox"
    className="h-4 w-4 accent-crimson-500"
    checked={checked}
    disabled={disabled}
    aria-label={label}
    onChange={(event) => onChange(event.target.checked)}
  />
);

export const SelectAllCheckbox = ({
  id,
  checked,
  indeterminate,
  onChange,
  label,
  hideLabel = false,
  disabled = false,
}: CheckboxProps & { indeterminate: boolean; hideLabel?: boolean }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, checked]);

  return (
    <label
      htmlFor={id}
      className="inline-flex items-center gap-2 text-sm text-parchment-300 cursor-pointer select-none"
    >
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        className="h-4 w-4 accent-crimson-500"
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={hideLabel ? "sr-only" : undefined}>{label}</span>
    </label>
  );
};

export const BulkSelectionBar = ({
  count,
  noun,
  onDelete,
  disabled = false,
}: {
  count: number;
  noun: string;
  onDelete: () => void;
  disabled?: boolean;
}) => {
  if (count < 1) return null;
  const label = `${count} ${count === 1 ? noun : `${noun}s`} selected`;
  return (
    <div className="flex flex-col gap-3 border border-steel-700/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-parchment-200" aria-live="polite">
        {label}
      </p>
      <Button
        className="btn-sm w-full sm:w-auto"
        onClick={onDelete}
        disabled={disabled}
      >
        Delete Selected
      </Button>
    </div>
  );
};

export const DetailRow = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="border-b border-steel-700/40 py-3 sm:grid sm:grid-cols-[10rem_1fr] sm:gap-4">
    <dt className="text-[0.7rem] font-accent uppercase tracking-[0.16em] text-steel-400">
      {label}
    </dt>
    <dd className="mt-1 sm:mt-0 text-sm text-parchment-200 break-words">
      {children}
    </dd>
  </div>
);
