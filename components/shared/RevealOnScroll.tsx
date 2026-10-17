import { ReactNode, TransitionEvent, useEffect, useRef, useState } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delayClass?: string;
  /** Render as a list item when the reveal wraps entries of a list. */
  as?: "div" | "li";
};

type RevealState = "hidden" | "visible" | "done";

/**
 * Intersection-based fade/slide reveal.
 * Respects prefers-reduced-motion via CSS.
 * Reveal classes are dropped once the entrance finishes so their transition
 * and delay never override hover transitions declared on the same element.
 */
const RevealOnScroll = ({
  children,
  className = "",
  delayClass = "",
  as = "div",
}: RevealOnScrollProps) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<RevealState>("hidden");

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return undefined;

    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (media.matches) {
        setState("done");
        return undefined;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (
      state === "visible" &&
      event.target === event.currentTarget &&
      event.propertyName === "opacity"
    ) {
      setState("done");
    }
  };

  let revealClasses = "";
  if (state === "hidden") revealClasses = `reveal-base ${delayClass}`;
  if (state === "visible") {
    revealClasses = `reveal-base reveal-visible ${delayClass}`;
  }

  const Tag = as;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        elementRef.current = node;
      }}
      className={`${revealClasses} ${className}`}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </Tag>
  );
};

export default RevealOnScroll;
