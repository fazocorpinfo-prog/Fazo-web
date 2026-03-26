"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * GSAP ScrollTrigger hook — runs setup callback once on mount,
 * kills all ScrollTriggers created inside on unmount.
 */
export function useGSAPScrollTrigger(
  setup: (ctx: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }) => void,
  deps: React.DependencyList = []
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctxRef.current = gsap.context(() => {
      setup({ gsap, ScrollTrigger });
    });
    return () => {
      ctxRef.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * GSAP Timeline hook — creates a timeline on mount, kills on unmount.
 */
export function useGSAPTimeline(
  setup: (tl: gsap.core.Timeline) => void,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    const tl = gsap.timeline();
    setup(tl);
    return () => { tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { gsap, ScrollTrigger };
