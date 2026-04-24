"use client";
import { motion } from "framer-motion";

interface ParallaxDividerProps {
  variant?: "dots" | "lines" | "orbs" | "grid";
  className?: string;
  flip?: boolean;
}

/**
 * Optimized ParallaxDivider — uses pure CSS animations
 * instead of useScroll + useTransform per instance.
 */
export function ParallaxDivider({
  variant = "orbs",
  className = "",
  flip = false,
}: ParallaxDividerProps) {

  if (variant === "orbs") {
    return (
      <div
        className={`relative h-32 md:h-48 overflow-hidden pointer-events-none ${className}`}
        aria-hidden
      >
        <div
          className="absolute h-40 w-40 md:h-56 md:w-56 rounded-full float-y"
          style={{
            left: flip ? "70%" : "15%",
            top: "-20%",
            background: "radial-gradient(circle, rgba(0,194,255,0.12) 0%, rgba(0,80,255,0.04) 50%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute h-3 w-3 md:h-4 md:w-4 rounded-full"
          style={{
            left: flip ? "40%" : "50%",
            top: "50%",
            background: "var(--accent-cyan)",
            opacity: 0.15,
            boxShadow: "0 0 20px rgba(0,194,255,0.3)",
          }}
        />
        <div
          className="absolute h-px w-32 md:w-48"
          style={{
            left: flip ? "10%" : "55%",
            top: "60%",
            background: "linear-gradient(90deg, transparent, var(--accent-cyan), transparent)",
            opacity: 0.12,
          }}
        />
      </div>
    );
  }

  if (variant === "lines") {
    return (
      <div
        className={`relative h-24 md:h-32 overflow-hidden pointer-events-none ${className}`}
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute h-px"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: `${20 + i * 12}%`,
              left: `${10 + i * 8}%`,
              top: `${15 + i * 18}%`,
              transformOrigin: flip ? "right" : "left",
              background: `linear-gradient(90deg, transparent, rgba(0,194,255,${0.06 + i * 0.02}), transparent)`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div
        className={`relative h-20 md:h-28 overflow-hidden pointer-events-none ${className}`}
        aria-hidden
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.1 + (i % 4) * 0.05 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 2 + (i % 3) * 2,
              height: 2 + (i % 3) * 2,
              left: `${8 + i * 12}%`,
              top: `${20 + ((i * 17) % 60)}%`,
              background: "var(--accent-cyan)",
              boxShadow: i % 3 === 0 ? "0 0 8px rgba(0,194,255,0.2)" : "none",
            }}
          />
        ))}
      </div>
    );
  }

  // grid
  return (
    <div
      className={`relative h-24 md:h-36 overflow-hidden pointer-events-none ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--accent-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--accent-cyan) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute h-20 w-20 rounded-full"
        style={{
          left: "50%",
          top: "10%",
          background: "radial-gradient(circle, rgba(0,194,255,0.08) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}
