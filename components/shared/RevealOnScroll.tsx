import { ReactNode, useEffect, useRef, useState } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delayClass?: string;
};

/**
 * Intersection-based fade/slide reveal.
 * Respects prefers-reduced-motion via CSS.
 */
const RevealOnScroll = ({
  children,
  className = "",
  delayClass = "",
}: RevealOnScrollProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return undefined;

    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (media.matches) {
        setIsVisible(true);
        return undefined;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`reveal-base ${
        isVisible ? "reveal-visible" : ""
      } ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
