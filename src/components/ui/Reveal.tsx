"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  /** Stagger, in milliseconds, so a row of cards arrives one after another. */
  delay?: number;
  className?: string;
};

/**
 * Fades and lifts its children the first time they scroll into view.
 * The animation itself is CSS (see globals.css) — this only flips a data
 * attribute, and it is removed entirely for anyone using "reduce motion".
 *
 * There are two triggers on purpose. The observer is the cheap, accurate one.
 * The scroll listener is a safety net: a fast scroll flick, or the layout
 * shifting as images finish loading, can carry an element past the viewport
 * between two frames without the observer ever seeing it intersect — and the
 * content would then stay invisible permanently. Whichever fires first wins,
 * and both are torn down immediately after.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Old browsers, or a server-rendered crawler: just show the content.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) reveal();
      },
      { threshold: 0, rootMargin: "0px 0px -5% 0px" },
    );

    /** Has the element reached the viewport, or already passed above it? */
    function checkPosition() {
      if (!element) return;
      if (element.getBoundingClientRect().top < window.innerHeight * 0.95) reveal();
    }

    function reveal() {
      setShown(true);
      teardown();
    }

    function teardown() {
      observer.disconnect();
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
    }

    observer.observe(element);
    window.addEventListener("scroll", checkPosition, { passive: true });
    window.addEventListener("resize", checkPosition, { passive: true });

    return teardown;
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={shown ? "in" : "out"}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={cn(className)}
    >
      {children}
    </div>
  );
}
