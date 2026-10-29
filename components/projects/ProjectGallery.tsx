import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent,
} from "react";
import { createPortal } from "react-dom";
import type { GalleryImage } from "../../utilities/projectGallery";
import { stepGalleryIndex } from "../../utilities/projectGallery";

type ProjectGalleryProps = {
  images: GalleryImage[];
  onLightboxChange?: (open: boolean) => void;
};

type Frame = {
  fitW: number;
  fitH: number;
};

type ImagePoint = {
  rx: number;
  ry: number;
};

const ZOOM_STEPS = [1, 1.25, 1.5, 2, 3, 4, 6, 8, 12, 16];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const zoomLevels = (maxScale: number) => {
  const levels = ZOOM_STEPS.filter((level) => level < maxScale - 0.01);
  levels.push(Math.round(maxScale * 100) / 100);
  return levels;
};

const stepZoom = (current: number, direction: 1 | -1, maxScale: number) => {
  const levels = zoomLevels(maxScale);
  if (direction > 0) {
    return (
      levels.find((level) => level > current + 0.001) ??
      levels[levels.length - 1]
    );
  }
  const lower = [...levels].reverse().find((level) => level < current - 0.001);
  return lower ?? levels[0];
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
  const stageRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const pointerStart = useRef<{
    x: number;
    y: number;
    interactive: boolean;
  } | null>(null);
  const pendingCenter = useRef<ImagePoint | null>(null);
  const naturalRef = useRef({ width: 0, height: 0 });
  const frameRef = useRef<Frame | null>(null);
  const layoutSizeRef = useRef({ w: 0, h: 0 });
  const scaleRef = useRef(1);
  const indexRef = useRef(index);
  const onIndexRef = useRef(onIndex);
  const onCloseRef = useRef(onClose);
  const [scale, setScale] = useState(1);
  const [frame, setFrame] = useState<Frame | null>(null);
  const image = images[index];
  const multiple = images.length > 1;

  indexRef.current = index;
  onIndexRef.current = onIndex;
  onCloseRef.current = onClose;
  frameRef.current = frame;
  scaleRef.current = scale;

  const measure = () => {
    const stage = stageRef.current;
    const { width, height } = naturalRef.current;
    if (!stage || width <= 0 || height <= 0) return;
    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    if (stageW <= 0 || stageH <= 0) return;
    const dpr = window.devicePixelRatio || 1;
    // Cap the fitted size at one source pixel per device pixel. The stage is
    // often wider than these screenshots, and stretching them softens text.
    const ratio = Math.min(stageW / width, stageH / height, 1 / dpr);
    const next = {
      fitW: Math.max(1, Math.floor(width * ratio)),
      fitH: Math.max(1, Math.floor(height * ratio)),
    };
    const { current } = frameRef;
    if (current && current.fitW === next.fitW && current.fitH === next.fitH) {
      pendingCenter.current = null;
      return;
    }
    setFrame(next);
  };

  const captureCenter = () => {
    const stage = stageRef.current;
    const photo = imageRef.current;
    if (!stage || !photo) return;
    const stageRect = stage.getBoundingClientRect();
    const imageRect = photo.getBoundingClientRect();
    if (imageRect.width <= 0 || imageRect.height <= 0) return;
    const centerX = stageRect.left + stage.clientWidth / 2;
    const centerY = stageRect.top + stage.clientHeight / 2;
    pendingCenter.current = {
      rx: clamp((centerX - imageRect.left) / imageRect.width, 0, 1),
      ry: clamp((centerY - imageRect.top) / imageRect.height, 0, 1),
    };
  };

  const imageKey = image?.src ?? "";

  useLayoutEffect(() => {
    const element = imageRef.current;
    const ready =
      !!element &&
      element.complete &&
      element.naturalWidth > 0 &&
      element.naturalHeight > 0;
    naturalRef.current = ready
      ? { width: element.naturalWidth, height: element.naturalHeight }
      : { width: 0, height: 0 };
    pendingCenter.current = null;
    setScale(1);
    const stage = stageRef.current;
    if (stage) {
      stage.scrollTop = 0;
      stage.scrollLeft = 0;
    }
    if (!ready) setFrame(null);
    else measure();
    // Fit is derived from this screenshot's intrinsic size, not object identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageKey]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return undefined;
    const refit = () => {
      const boxW = stage.offsetWidth;
      const boxH = stage.offsetHeight;
      // Scrollbars change clientWidth/clientHeight without changing the
      // stage's border box. Refitting on that feedback resized the image,
      // which toggled the bars again and shook the picture after reset.
      if (
        frameRef.current &&
        boxW === layoutSizeRef.current.w &&
        boxH === layoutSizeRef.current.h
      ) {
        return;
      }
      layoutSizeRef.current = { w: boxW, h: boxH };
      if (scaleRef.current > 1.001) captureCenter();
      else pendingCenter.current = null;
      measure();
    };
    const observer = new ResizeObserver(refit);
    observer.observe(stage);
    window.addEventListener("resize", refit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", refit);
    };
  }, [imageKey]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const photo = imageRef.current;
    if (!stage || !photo) return;
    if (scale <= 1.001) {
      pendingCenter.current = null;
      stage.scrollTop = 0;
      stage.scrollLeft = 0;
      return;
    }
    const point = pendingCenter.current;
    pendingCenter.current = null;
    if (!point) return;
    const stageRect = stage.getBoundingClientRect();
    const imageRect = photo.getBoundingClientRect();
    if (imageRect.width <= 0 || imageRect.height <= 0) return;
    const centerX = stageRect.left + stage.clientWidth / 2;
    const centerY = stageRect.top + stage.clientHeight / 2;
    const desiredLeft = centerX - point.rx * imageRect.width;
    const desiredTop = centerY - point.ry * imageRect.height;
    stage.scrollLeft += imageRect.left - desiredLeft;
    stage.scrollTop += imageRect.top - desiredTop;
  }, [scale, frame]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() =>
      closeRef.current?.focus()
    );

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
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        const currentFrame = frameRef.current;
        const maxScale = currentFrame
          ? Math.min(
              16,
              Math.max(2, naturalRef.current.width / currentFrame.fitW)
            )
          : 2;
        const next = stepZoom(scaleRef.current, 1, maxScale);
        if (next !== scaleRef.current) {
          captureCenter();
          setScale(next);
        }
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        const currentFrame = frameRef.current;
        const maxScale = currentFrame
          ? Math.min(
              16,
              Math.max(2, naturalRef.current.width / currentFrame.fitW)
            )
          : 2;
        const next = stepZoom(scaleRef.current, -1, maxScale);
        if (next !== scaleRef.current) {
          captureCenter();
          setScale(next);
        }
      } else if (event.key === "0") {
        event.preventDefault();
        pendingCenter.current = null;
        setScale(1);
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
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [images.length]);

  if (!image) return null;

  const maxScale =
    frame && frame.fitW > 0
      ? Math.min(16, Math.max(2, naturalRef.current.width / frame.fitW))
      : 2;
  const atMin = scale <= 1.001;
  const atMax = scale >= maxScale - 0.001;
  const renderedW = frame ? Math.round(frame.fitW * scale) : 0;
  const renderedH = frame ? Math.round(frame.fitH * scale) : 0;

  const changeZoom = (direction: 1 | -1) => {
    const next = stepZoom(scale, direction, maxScale);
    if (next === scale) return;
    captureCenter();
    setScale(next);
  };

  const resetFit = () => {
    pendingCenter.current = null;
    setScale(1);
  };

  const showPrevious = () =>
    onIndex(stepGalleryIndex(index, -1, images.length));
  const showNext = () => onIndex(stepGalleryIndex(index, 1, images.length));

  const rememberNaturalSize = (element: HTMLImageElement) => {
    if (element !== imageRef.current) return;
    if (!element.naturalWidth || !element.naturalHeight) return;
    if (
      element.naturalWidth === naturalRef.current.width &&
      element.naturalHeight === naturalRef.current.height
    ) {
      return;
    }
    naturalRef.current = {
      width: element.naturalWidth,
      height: element.naturalHeight,
    };
    measure();
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (scaleRef.current > 1.001) return;
    if (event.target instanceof Element && event.target.closest("button")) {
      touchStart.current = null;
      return;
    }
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (scaleRef.current > 1.001 || !touchStart.current || !multiple) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) showNext();
    else showPrevious();
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const interactive =
      event.target instanceof Element &&
      Boolean(event.target.closest("img, button"));
    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
      interactive,
    };
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.interactive) return;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8)
      return;
    if (
      event.target instanceof Element &&
      event.target.closest("img, button")
    ) {
      return;
    }
    const stage = stageRef.current;
    if (
      !stage ||
      !(event.target instanceof Node) ||
      !stage.contains(event.target)
    ) {
      return;
    }
    const rect = stage.getBoundingClientRect();
    const onVerticalBar =
      stage.scrollHeight > stage.clientHeight + 1 &&
      event.clientX > rect.right - 18;
    const onHorizontalBar =
      stage.scrollWidth > stage.clientWidth + 1 &&
      event.clientY > rect.bottom - 18;
    if (onVerticalBar || onHorizontalBar) return;
    onClose();
  };

  return createPortal(
    <div
      ref={dialogRef}
      className="lightbox-shell fixed inset-0 z-[140] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      data-lenis-prevent
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4">
        <p className="lightbox-readout" aria-live="polite">
          {index + 1} / {images.length}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center" role="group" aria-label="Zoom">
            <button
              type="button"
              className="lightbox-control"
              aria-label="Zoom out"
              onClick={() => changeZoom(-1)}
              disabled={atMin}
            >
              −
            </button>
            <span className="lightbox-readout" aria-live="polite">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              className="lightbox-control"
              aria-label="Zoom in"
              onClick={() => changeZoom(1)}
              disabled={atMax}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="lightbox-control"
            onClick={resetFit}
            disabled={atMin}
          >
            Fit
          </button>
          <button
            ref={closeRef}
            type="button"
            className="lightbox-control"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1">
        {multiple && (
          <div className="hidden items-center pl-[max(0.75rem,env(safe-area-inset-left))] sm:flex">
            <button
              type="button"
              className="lightbox-control"
              onClick={showPrevious}
              aria-label="Previous screenshot"
            >
              Previous
            </button>
          </div>
        )}
        <div ref={stageRef} className="lightbox-stage min-h-0 min-w-0 flex-1">
          <img
            ref={imageRef}
            key={image.src}
            src={image.src}
            alt={image.alt}
            width={renderedW > 0 ? renderedW : undefined}
            height={renderedH > 0 ? renderedH : undefined}
            draggable={false}
            decoding="async"
            onLoad={(event) => rememberNaturalSize(event.currentTarget)}
            className="block max-w-none shrink-0 select-none"
            style={
              renderedW > 0
                ? {
                    width: renderedW,
                    height: renderedH,
                    maxWidth: "none",
                    maxHeight: "none",
                    objectFit: "contain",
                  }
                : { visibility: "hidden" }
            }
          />
        </div>
        {multiple && (
          <div className="hidden items-center pr-[max(0.75rem,env(safe-area-inset-right))] sm:flex">
            <button
              type="button"
              className="lightbox-control"
              onClick={showNext}
              aria-label="Next screenshot"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {multiple && (
        <div className="flex gap-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:hidden">
          <button
            type="button"
            className="lightbox-control flex-1"
            onClick={showPrevious}
            aria-label="Previous screenshot"
          >
            Previous
          </button>
          <button
            type="button"
            className="lightbox-control flex-1"
            onClick={showNext}
            aria-label="Next screenshot"
          >
            Next
          </button>
        </div>
      )}
    </div>,
    document.body
  );
};

const ProjectGallery = ({ images, onLightboxChange }: ProjectGalleryProps) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const current = images[active] ?? images[0];

  useEffect(() => {
    onLightboxChange?.(lightbox !== null);
  }, [lightbox, onLightboxChange]);

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
          onIndex={(next) => {
            setLightbox(next);
            setActive(next);
          }}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
};

export default ProjectGallery;
