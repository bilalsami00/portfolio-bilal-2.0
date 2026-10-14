import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { routePaths } from "../../data/navigation";

const SEQUENCE_TIMEOUT_MS = 1000;

const shortcuts = [
  { keys: "G then H", action: "Go to Home", href: routePaths.home },
  { keys: "G then A", action: "Go to About", href: routePaths.about },
  { keys: "G then P", action: "Go to Projects", href: routePaths.projects },
  { keys: "G then C", action: "Go to Contact", href: routePaths.contact },
  { keys: "?", action: "Show keyboard shortcuts", href: null },
  { keys: "Esc", action: "Close menu or this panel", href: null },
] as const;

const sequenceRoutes: Record<string, string> = {
  h: routePaths.home,
  a: routePaths.about,
  p: routePaths.projects,
  c: routePaths.contact,
};

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return Boolean(target.closest('[contenteditable="true"]'));
};

/**
 * Public-site G-then-* navigation shortcuts and a compact help dialog.
 * Disabled on Mission Control routes.
 */
const KeyboardShortcuts = () => {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);
  const helpOpenRef = useRef(false);
  const pendingRef = useRef<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const isMissionControl = router.pathname.startsWith(
    routePaths.missionControl
  );

  const clearPending = useCallback(() => {
    pendingRef.current = null;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const openHelp = useCallback(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setHelpOpen(true);
  }, []);

  const closeHelp = useCallback(() => {
    setHelpOpen(false);
    const previous = previousFocusRef.current;
    previousFocusRef.current = null;
    if (previous && document.contains(previous)) {
      previous.focus();
    }
  }, []);

  useEffect(() => {
    helpOpenRef.current = helpOpen;
  }, [helpOpen]);

  useEffect(() => {
    if (!helpOpen) return undefined;

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [helpOpen]);

  useEffect(() => {
    if (isMissionControl) {
      clearPending();
      setHelpOpen(false);
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isEditableTarget(event.target)) {
        clearPending();
        return;
      }

      if (event.key === "Escape") {
        if (helpOpenRef.current) {
          event.preventDefault();
          event.stopPropagation();
          closeHelp();
        }
        clearPending();
        return;
      }

      if (helpOpenRef.current) return;

      if (event.key === "?") {
        event.preventDefault();
        clearPending();
        openHelp();
        return;
      }

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (pendingRef.current === "g") {
        const href = sequenceRoutes[key];
        clearPending();
        if (href) {
          event.preventDefault();
          router.push(href).catch(() => undefined);
        }
        return;
      }

      if (key === "g") {
        clearPending();
        pendingRef.current = "g";
        timeoutRef.current = setTimeout(() => {
          pendingRef.current = null;
          timeoutRef.current = null;
        }, SEQUENCE_TIMEOUT_MS);
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      clearPending();
    };
  }, [isMissionControl, router, clearPending, openHelp, closeHelp]);

  if (isMissionControl || !helpOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
        aria-label="Close keyboard shortcuts"
        onClick={closeHelp}
      />

      <div
        className="relative z-10 w-full max-w-md ink-panel border-crimson-700/30 p-5 sm:p-6 shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
        data-lenis-prevent
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-eyebrow">Keyboard</p>
            <div className="crimson-mark mt-3 mb-3" />
            <h2
              id="keyboard-shortcuts-title"
              className="font-display text-2xl text-parchment-100 font-bold leading-snug"
            >
              Shortcuts
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeHelp}
            className="btn-secondary !px-3 !py-2 !min-h-[2.5rem] text-xs shrink-0"
          >
            Close
          </button>
        </div>

        <ul className="mt-5 space-y-3">
          {shortcuts.map((item) => (
            <li
              key={item.keys}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="text-parchment-300 leading-snug">
                {item.action}
              </span>
              <kbd className="shrink-0 font-accent text-xs tracking-wide text-parchment-100 border border-steel-700/70 bg-ink-800/80 px-2.5 py-1">
                {item.keys}
              </kbd>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs text-steel-400 leading-relaxed">
          Shortcuts are ignored while typing in form fields. Press{" "}
          <kbd className="font-accent text-parchment-300">?</kbd> anytime on
          public pages to reopen this panel.
        </p>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
