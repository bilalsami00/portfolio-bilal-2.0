import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  createVisitorTracker,
  isVisitorTrackingEnabled,
} from "../../utilities/visitorTracking";

/**
 * Lightweight session tracking for public pages. Skips Mission Control,
 * never blocks rendering, and swallows every network failure.
 */
const VisitorTracker = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isVisitorTrackingEnabled()) return undefined;

    let tracker: ReturnType<typeof createVisitorTracker>;
    try {
      tracker = createVisitorTracker();
    } catch {
      return undefined;
    }

    const onRouteChange = (url: string) => tracker.trackPage(url);
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") tracker.handleHide();
    };

    tracker.trackPage(router.asPath);
    router.events.on("routeChangeComplete", onRouteChange);
    document.addEventListener("click", tracker.handleClick, true);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", tracker.handleHide);

    return () => {
      router.events.off("routeChangeComplete", onRouteChange);
      document.removeEventListener("click", tracker.handleClick, true);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", tracker.handleHide);
    };
    // Mount once per page load; route changes arrive through router events.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default VisitorTracker;
