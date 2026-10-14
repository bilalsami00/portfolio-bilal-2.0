import { useRouter } from "next/router";
import { useEffect } from "react";

export const PREV_PATH_KEY = "openfolio:prevPath";
export const CURRENT_PATH_KEY = "openfolio:path";

/**
 * Remembers the last in-app path so the 404 page can offer a safe Back action
 * without trusting window.history.length or cross-origin referrers.
 */
const PathMemory = () => {
  const router = useRouter();

  useEffect(() => {
    const write = (key: string, value: string) => {
      try {
        sessionStorage.setItem(key, value);
      } catch {
        // Ignore private-mode / storage failures.
      }
    };

    const clearPrev = () => {
      try {
        sessionStorage.removeItem(PREV_PATH_KEY);
      } catch {
        // Ignore.
      }
    };

    // Full document load: sync current path and drop stale prev hops.
    clearPrev();
    write(CURRENT_PATH_KEY, router.asPath);

    const onStart = (url: string) => {
      try {
        const current =
          sessionStorage.getItem(CURRENT_PATH_KEY) || router.asPath;
        const currentPath = current.split("?")[0]?.split("#")[0] || current;
        const nextPath = url.split("?")[0]?.split("#")[0] || url;
        if (currentPath && currentPath !== nextPath) {
          write(PREV_PATH_KEY, current);
        }
      } catch {
        // Ignore.
      }
    };

    const onComplete = (url: string) => {
      write(CURRENT_PATH_KEY, url);
    };

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onComplete);
    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onComplete);
    };
  }, [router]);

  return null;
};

export default PathMemory;
