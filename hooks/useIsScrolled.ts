import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `threshold` pixels. Only re-renders
 * when the boolean flips, not on every scroll event.
 */
const useIsScrolled = (threshold: number) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return isScrolled;
};

export default useIsScrolled;
