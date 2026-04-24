"use client";
import { useEffect } from "react";

const SECTION_AMBIENT: Record<string, { intensity: number; y: number }> = {
  hero:      { intensity: 0.04,  y: 30 },
  manifesto: { intensity: 0.045, y: 28 },
  services:  { intensity: 0.05,  y: 25 },
  process:   { intensity: 0.055, y: 35 },
  approach:  { intensity: 0.05,  y: 30 },
  team:      { intensity: 0.045, y: 30 },
  floating:  { intensity: 0.05,  y: 28 },
  portfolio: { intensity: 0.05,  y: 32 },
  gallery:   { intensity: 0.055, y: 30 },
  contact:   { intensity: 0.04,  y: 30 },
  cta:       { intensity: 0.06,  y: 40 },
};

const PARALLAX_INTENSITY: Record<string, number> = { "1": 0.02, "2": 0.04, "3": 0.06 };

export function ScrollAmbientProvider() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const scale = isCoarse || isMobile ? 0.5 : 1;
    const disableParallax = prefersReduced || isCoarse || isMobile;

    let curI = 0.04, curY = 30, tgtI = 0.04, tgtY = 30;
    let raf = 0, live = true;
    let isHidden = false;
    const T = 0.025;
    const DELTA_THRESHOLD = 0.0005;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Collect parallax elements once
    const parallaxEls = disableParallax
      ? []
      : Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));

    // Track last scroll position to skip work when not scrolling
    let lastScrollY = window.scrollY;
    let scrollDirty = true;

    const onScroll = () => { scrollDirty = true; };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Pause when tab is hidden
    const onVisibility = () => {
      isHidden = document.hidden;
      if (!isHidden && live) {
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    function tick() {
      if (!live || isHidden) return;

      // Ambient lerp — skip if converged
      const dI = Math.abs(curI - tgtI);
      const dY = Math.abs(curY - tgtY);
      const needsAmbientUpdate = dI > DELTA_THRESHOLD || dY > DELTA_THRESHOLD;

      if (needsAmbientUpdate) {
        curI = lerp(curI, tgtI, T);
        curY = lerp(curY, tgtY, T);
        const root = document.documentElement;
        root.style.setProperty("--ambient-y", `${curY.toFixed(2)}%`);
        root.style.setProperty("--ambient-intensity", (curI * (prefersReduced ? 0 : 1)).toFixed(4));
      }

      // Parallax — only update when actually scrolling
      if (scrollDirty && !disableParallax && parallaxEls.length > 0) {
        scrollDirty = false;
        const currentScrollY = window.scrollY;
        if (currentScrollY !== lastScrollY) {
          lastScrollY = currentScrollY;
          const scrollH = (document.scrollingElement?.scrollHeight ?? document.body.scrollHeight) - window.innerHeight;
          const progress = scrollH > 0 ? currentScrollY / scrollH : 0;
          for (const el of parallaxEls) {
            const lvl = el.dataset.parallax ?? "1";
            const intensity = PARALLAX_INTENSITY[lvl] ?? 0.02;
            const shift = progress * intensity * 100;
            el.style.transform = `translateY(${shift.toFixed(2)}vh)`;
          }
        }
      }

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    // Section ambient observer — reduced thresholds for performance
    const ratios = new Map<string, number>();
    const els = document.querySelectorAll<HTMLElement>("[data-ambient]");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = (entry.target as HTMLElement).dataset.ambient ?? "";
          ratios.set(key, entry.intersectionRatio);
        }
        let bestKey = "hero", bestRatio = 0;
        ratios.forEach((r, k) => { if (r > bestRatio) { bestRatio = r; bestKey = k; } });
        const cfg = SECTION_AMBIENT[bestKey] ?? SECTION_AMBIENT.hero;
        tgtI = cfg.intensity * scale;
        tgtY = cfg.y;
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1] } // 7 instead of 21
    );

    els.forEach((el) => io.observe(el));
    return () => {
      live = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <div aria-hidden="true" className="ambient-overlay" />;
}
