"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type CosmicCarouselProps = {
  children: ReactNode;
  className?: string;
};

export function CosmicCarousel({ children, className }: CosmicCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["-1.5%", "1.5%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ x: drift }}>{children}</motion.div>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-20"
        style={{ background: "linear-gradient(to right, var(--bg-secondary), transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-20"
        style={{ background: "linear-gradient(to left, var(--bg-secondary), transparent)" }}
        aria-hidden
      />
    </div>
  );
}
