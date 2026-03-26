"use client";
import { useEffect, useRef } from "react";

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    let mx = -100, my = -100, ox = -100, oy = -100, raf = 0;
    let isMoving = false;
    let moveTimeout: ReturnType<typeof setTimeout>;
    let isHidden = false;
    const T = 0.12;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let magTargetX = 0, magTargetY = 0, isMagnetic = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (!isMoving) {
        isMoving = true;
        if (!isHidden) raf = requestAnimationFrame(tick);
      }
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => { isMoving = false; }, 100);
    };

    const onButtonEnter = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      outerRef.current?.classList.add("button-hover");
      outerRef.current?.classList.remove("hovered", "text-hover");
      const rect = el.getBoundingClientRect();
      magTargetX = rect.left + rect.width  / 2;
      magTargetY = rect.top  + rect.height / 2;
      isMagnetic = true;
    };
    const onInteractiveEnter = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      outerRef.current?.classList.add("hovered");
      outerRef.current?.classList.remove("button-hover", "text-hover");
      const rect = el.getBoundingClientRect();
      magTargetX = rect.left + rect.width  / 2;
      magTargetY = rect.top  + rect.height / 2;
      isMagnetic = true;
    };
    const onLeave = () => {
      outerRef.current?.classList.remove("hovered", "button-hover");
      isMagnetic = false;
    };

    const onTextEnter = () => {
      if (!outerRef.current?.classList.contains("hovered") && !outerRef.current?.classList.contains("button-hover")) {
        outerRef.current?.classList.add("text-hover");
      }
    };
    const onTextLeave = () => outerRef.current?.classList.remove("text-hover");

    const onSelectionChange = () => {
      const sel = window.getSelection?.();
      const hasSelection = sel && sel.toString().trim().length > 0;
      outerRef.current?.classList.toggle("selecting", !!hasSelection);
      dotRef.current?.classList.toggle("selecting", !!hasSelection);
    };

    // Pause when tab hidden
    const onVisibility = () => {
      isHidden = document.hidden;
      if (!isHidden && isMoving) raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVisibility);

    const buttons = Array.from(document.querySelectorAll("button, [role=button]"));
    const otherInteractive = Array.from(document.querySelectorAll("a:not(button):not([role=button]), input, select, textarea"));
    const textEls = Array.from(document.querySelectorAll("h1, h2, h3, h4, p"));

    buttons.forEach((el) => {
      el.addEventListener("mouseenter", onButtonEnter as EventListener);
      el.addEventListener("mouseleave", onLeave);
    });
    otherInteractive.forEach((el) => {
      el.addEventListener("mouseenter", onInteractiveEnter as EventListener);
      el.addEventListener("mouseleave", onLeave);
    });
    textEls.forEach((el) => {
      el.addEventListener("mouseenter", onTextEnter);
      el.addEventListener("mouseleave", onTextLeave);
    });
    document.addEventListener("selectionchange", onSelectionChange);

    function tick() {
      if (isHidden) return;

      let targetOX = mx, targetOY = my;
      if (isMagnetic) {
        const dx = magTargetX - mx;
        const dy = magTargetY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxPull = 6;
        const pull = Math.min(1, maxPull / Math.max(dist, 1));
        targetOX = mx + dx * pull;
        targetOY = my + dy * pull;
      }

      ox = lerp(ox, targetOX, T);
      oy = lerp(oy, targetOY, T);

      const outer = outerRef.current;
      const dot   = dotRef.current;
      if (outer) { outer.style.left = `${ox}px`; outer.style.top = `${oy}px`; }
      if (dot)   { dot.style.left   = `${mx}px`; dot.style.top   = `${my}px`; }

      // Only continue RAF if still converging
      const converged = Math.abs(ox - targetOX) < 0.5 && Math.abs(oy - targetOY) < 0.5;
      if (isMoving || !converged) {
        raf = requestAnimationFrame(tick);
      }
    }

    document.addEventListener("mousemove", onMove);
    document.documentElement.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(moveTimeout);
      buttons.forEach((el) => {
        el.removeEventListener("mouseenter", onButtonEnter as EventListener);
        el.removeEventListener("mouseleave", onLeave);
      });
      otherInteractive.forEach((el) => {
        el.removeEventListener("mouseenter", onInteractiveEnter as EventListener);
        el.removeEventListener("mouseleave", onLeave);
      });
      textEls.forEach((el) => {
        el.removeEventListener("mouseenter", onTextEnter);
        el.removeEventListener("mouseleave", onTextLeave);
      });
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = "";
    };
  }, []);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;
    const onMove = (e: MouseEvent) => {
      const root = document.documentElement;
      root.style.setProperty("--cursor-x", `${e.clientX}px`);
      root.style.setProperty("--cursor-y", `${e.clientY}px`);
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={outerRef} className="cursor-outer" aria-hidden="true" />
      <div ref={dotRef}   className="cursor-dot"   aria-hidden="true" />
    </>
  );
}
