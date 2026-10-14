import { useRouter } from "next/router";
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { routePaths } from "../../data/navigation";

/** Fixed header clearance — matches `scroll-padding-top: 6rem` in globals.css */
const ANCHOR_OFFSET_PX = -96;

const isSmoothScrollRoute = (pathname: string): boolean => {
  if (pathname === routePaths.projects) return false;
  if (pathname.startsWith(routePaths.missionControl)) return false;
  return true;
};

const isPageScrollLocked = (): boolean =>
  document.body.style.overflow === "hidden" ||
  document.documentElement.style.overflow === "hidden";

/**
 * Lenis-based inertia scrolling for public non-project pages.
 * Opted out on Projects and Mission Control. Respects prefers-reduced-motion.
 */
const SmoothScroll = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isSmoothScrollRoute(router.pathname)) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: ANCHOR_OFFSET_PX },
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
      lerp: 0.1,
      wheelMultiplier: 1,
    });

    let active = true;
    let onReducedMotionChange: (() => void) | undefined;

    const syncScrollLock = () => {
      if (!active) return;
      if (isPageScrollLocked()) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    const observer = new MutationObserver(syncScrollLock);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
    syncScrollLock();

    const teardown = () => {
      if (!active) return;
      active = false;
      if (onReducedMotionChange) {
        reducedMotion.removeEventListener("change", onReducedMotionChange);
      }
      observer.disconnect();
      lenis.destroy();
    };

    onReducedMotionChange = () => {
      if (reducedMotion.matches) {
        teardown();
      }
    };
    reducedMotion.addEventListener("change", onReducedMotionChange);

    return teardown;
  }, [router.pathname]);

  return null;
};

export default SmoothScroll;
