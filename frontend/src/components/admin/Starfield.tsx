"use client";

import { useEffect, useRef } from "react";

// Cyan/blue starfield matching website tokens. Ported from the legacy admin.
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0, height = 0, raf = 0;
    const stars: { x: number; y: number; r: number; baseA: number; phase: number; speed: number; drift: number; hue: string }[] = [];
    const COUNT = 90;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const pointer = { x: 0.5, y: 0.5 };

    function resize() {
      width = window.innerWidth; height = window.innerHeight;
      canvas!.width = width * DPR; canvas!.height = height * DPR;
      canvas!.style.width = width + "px"; canvas!.style.height = height + "px";
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function seed() {
      stars.length = 0;
      for (let i = 0; i < COUNT; i++) {
        stars.push({
          x: Math.random() * width, y: Math.random() * height,
          r: rnd(0.4, 1.8), baseA: rnd(0.25, 0.8), phase: rnd(0, Math.PI * 2),
          speed: rnd(0.002, 0.006), drift: rnd(0.02, 0.08),
          hue: Math.random() > 0.75 ? "cyan" : "white",
        });
      }
    }
    const onMove = (e: MouseEvent) => { pointer.x = e.clientX / window.innerWidth; pointer.y = e.clientY / window.innerHeight; };
    const onResize = () => { resize(); seed(); };

    function draw(now: number) {
      ctx!.clearRect(0, 0, width, height);
      const t = now * 0.001;
      const sx = (pointer.x - 0.5) * 14, sy = (pointer.y - 0.5) * 14;
      for (const s of stars) {
        const twinkle = Math.sin(t * 2 + s.phase) * 0.35 + 0.65;
        const alpha = Math.max(0.05, s.baseA * twinkle);
        const x = s.x + sx * s.drift * 6, y = s.y + sy * s.drift * 6;
        if (s.hue === "cyan") { ctx!.shadowColor = "rgba(0,194,255,0.8)"; ctx!.shadowBlur = 6; ctx!.fillStyle = `rgba(0,194,255,${alpha})`; }
        else { ctx!.shadowColor = "rgba(255,255,255,0.5)"; ctx!.shadowBlur = 3; ctx!.fillStyle = `rgba(255,255,255,${alpha * 0.9})`; }
        ctx!.beginPath(); ctx!.arc(x, y, s.r, 0, Math.PI * 2); ctx!.fill();
        s.y += s.speed * 30;
        if (s.y > height + 4) { s.y = -4; s.x = Math.random() * width; }
      }
      ctx!.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resize(); seed();
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove, { passive: true });

    if (reduce) {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        ctx.fillStyle = s.hue === "cyan" ? `rgba(0,194,255,${s.baseA})` : `rgba(255,255,255,${s.baseA})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="admin-starfield" aria-hidden />;
}
