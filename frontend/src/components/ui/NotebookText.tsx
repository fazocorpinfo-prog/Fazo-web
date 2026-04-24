"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type NotebookTextProps = {
  text: string;
  className?: string;
  speed?: number;
  delayMs?: number;
};

export function NotebookText({ text, className, speed = 34, delayMs = 0 }: NotebookTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (index >= text.length) return;
    const timeout = setTimeout(() => setIndex((prev) => prev + 1), index === 0 ? delayMs || speed : speed);
    return () => clearTimeout(timeout);
  }, [inView, index, text.length, speed, delayMs]);

  const done = index >= text.length;

  return (
    <motion.p
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {text.slice(0, index)}
      <span
        className={`ml-0.5 inline-block text-[var(--accent-cyan)] ${done ? "opacity-0" : "animate-pulse"}`}
        aria-hidden
      >
        |
      </span>
    </motion.p>
  );
}
