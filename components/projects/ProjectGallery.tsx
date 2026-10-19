import { useEffect, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import type { GalleryImage } from "../../utilities/projectGallery";
import { stepGalleryIndex } from "../../utilities/projectGallery";

type ProjectGalleryProps = {
  images: GalleryImage[];
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
};

const Lightbox = ({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: GalleryImage[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) => {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const image = images[index];
  const multiple = images.length > 1;
  const indexRef = useRef(index);
  const onIndexRef = useRef(onIndex);
  const onCloseRef = useRef(onClose);
  indexRef.current = index;
  onIndexRef.current = onIndex;
  onCloseRef.current = onClose;

  useEffect(() => {
    setZoomed(false);
  }, [index]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      const { target } = event;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (images.length > 1 && event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        onIndexRef.current(
          stepGalleryIndex(indexRef.current, -1, images.length)
        );
      } else if (images.length > 1 && event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        onIndexRef.current(
          stepGalleryIndex(indexRef.current, 1, images.length)
        );
      } else if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const items = Array.from(
          dialog.querySelectorAll<HTMLElement>("button:not([disabled])")
        ).filter((item) => item.getClientRects().length > 0);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [images.length]);

  if (!image) return null;

  const showPrevious = () =>
    onIndex(stepGalleryIndex(index, -1, images.length));
  const showNext = () => onIndex(stepGalleryIndex(index, 1, images.length));

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (zoomed) return;
    if (event.target instanceof HTMLElement && event.target.closest("button")) {
      touchStart.current = null;
      return;
    }
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (zoomed || !touchStart.current || !multiple) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) showNext();
    else showPrevious();
  };

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[140]"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      data-lenis-prevent
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/92"
        aria-label="Close screenshot"
        onClick={onClose}
      />
      <div className="pointer-events-none relative z-10 flex h-[100dvh] flex-col p-3 sm:p-5">
        <div className="pointer-events-auto mb-3 flex items-center justify-between gap-3">
          <p className="text-sm text-parchment-300" aria-live="polite">
            {multiple ? `${index + 1} / ${images.length}` : "1 / 1"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-secondary btn-sm !min-h-[2.75rem]"
              aria-pressed={zoomed}
              onClick={() => setZoomed((value) => !value)}
            >
              {zoomed ? "Fit" : "Zoom"}
            </button>
            <button
              ref={closeRef}
              type="button"
              className="btn-secondary btn-sm !min-h-[2.75rem]"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          {multiple && (
            <button
              type="button"
              className="pointer-events-auto absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 btn-secondary btn-sm !min-h-[2.75rem] sm:inline-flex"
              onClick={showPrevious}
              aria-label="Previous screenshot"
            >
              Previous
            </button>
          )}
          <div
            className={`flex h-full items-center justify-center ${
              zoomed ? "pointer-events-auto overflow-auto" : "sm:px-28"
            }`}
          >
            <img
              key={image.preview}
              src={image.preview}
              width={image.width}
              height={image.height}
              alt={image.alt}
              className={`pointer-events-auto h-auto object-contain ${
                zoomed
                  ? "max-w-none w-[min(1600px,140%)]"
                  : "max-h-full max-w-full"
              } ${reducedMotion ? "" : "transition-opacity duration-200"}`}
              decoding="async"
            />
          </div>
          {multiple && (
            <button
              type="button"
              className="pointer-events-auto absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 btn-secondary btn-sm !min-h-[2.75rem] sm:inline-flex"
              onClick={showNext}
              aria-label="Next screenshot"
            >
              Next
            </button>
          )}
        </div>

        {multiple && (
          <div className="pointer-events-auto mt-3 flex justify-between gap-3 sm:hidden">
            <button
              type="button"
              className="btn-secondary btn-sm !min-h-[2.75rem] flex-1"
              onClick={showPrevious}
              aria-label="Previous screenshot"
            >
              Previous
            </button>
            <button
              type="button"
              className="btn-secondary btn-sm !min-h-[2.75rem] flex-1"
              onClick={showNext}
              aria-label="Next screenshot"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

const ProjectGallery = ({ images }: ProjectGalleryProps) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const current = images[active] ?? images[0];

  const open = (index: number, opener: HTMLElement) => {
    returnFocus.current = opener;
    setActive(index);
    setLightbox(index);
  };

  const closeLightbox = () => {
    setLightbox(null);
    const target = returnFocus.current;
    returnFocus.current = null;
    window.requestAnimationFrame(() => {
      if (target && document.contains(target)) target.focus();
    });
  };

  if (!current) return null;

  return (
    <div className="bg-ink-950">
      <button
        type="button"
        className="block w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-crimson-500"
        onClick={(event) => open(active, event.currentTarget)}
        aria-label={`Open ${current.alt}`}
      >
        <img
          src={current.preview}
          width={current.width}
          height={current.height}
          alt={current.alt}
          className="mx-auto max-h-[70vh] w-full object-contain object-top"
          decoding="async"
        />
      </button>
      <p className="px-4 py-3 text-sm text-parchment-400">{current.alt}</p>

      {images.length > 1 && (
        <ul className="grid grid-cols-2 gap-2 px-3 pb-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => {
            const selected = index === active;
            return (
              <li key={image.src}>
                <button
                  type="button"
                  className={`block w-full overflow-hidden border bg-ink-900 ${
                    selected
                      ? "border-crimson-500"
                      : "border-steel-700/40 hover:border-parchment-500"
                  }`}
                  aria-label={`Open ${image.alt}`}
                  aria-current={selected ? "true" : undefined}
                  onClick={(event) => open(index, event.currentTarget)}
                >
                  <img
                    src={image.thumb}
                    alt=""
                    className="aspect-[16/10] w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {lightbox !== null && (
        <Lightbox
          images={images}
          index={lightbox}
          onIndex={(index) => {
            setLightbox(index);
            setActive(index);
          }}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
};

export default ProjectGallery;
