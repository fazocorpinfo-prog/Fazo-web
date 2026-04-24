"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { usePointerCapable } from "@/hooks/usePointerCapable";

export function ScrollIndicator() {
  const pointerFine = usePointerCapable();
  const { scrollYProgress } = useScroll();
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (!pointerFine) return null;

  return (
    <div className="pointer-events-none fixed left-4 top-1/2 z-[90] hidden h-[220px] w-[8px] -translate-y-1/2 md:block" aria-hidden>
      <div className="absolute inset-x-[3px] inset-y-0 rounded-full bg-white/10" />
      <motion.div
        className="absolute inset-x-[3px] top-0 origin-top rounded-full bg-gradient-to-b from-[var(--accent-cyan)] to-transparent"
        style={{ scaleY: fillScale, height: "100%" }}
      />
      <motion.div
        className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[var(--accent-cyan)]"
        style={{ top: orbY, boxShadow: "0 0 12px rgba(0,194,255,0.45)" }}
      />
    </div>
  );
}
