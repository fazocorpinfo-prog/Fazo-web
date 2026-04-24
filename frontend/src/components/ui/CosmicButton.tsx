"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.4, 0, 0.2, 1] as const;

type CosmicButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
};

const baseClass =
  "group relative inline-flex items-center justify-center overflow-hidden rounded-xl border px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-[border-color,box-shadow,transform] duration-500";

const baseStyle = {
  background: "var(--surface)",
  borderColor: "rgba(0,194,255,0.4)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
} as const;

export function CosmicButton({
  children,
  className,
  disabled,
  href,
  onClick,
  type = "button",
  ariaLabel,
}: CosmicButtonProps) {
  const content = (
    <>
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        aria-hidden
      />
      <span className="relative">{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        aria-label={ariaLabel}
        className={`${baseClass} ${className ?? ""}`}
        style={baseStyle}
        whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(0,194,255,0.25)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className ?? ""} ${disabled ? "opacity-50" : ""}`}
      style={baseStyle}
      whileHover={disabled ? undefined : { scale: 1.03, boxShadow: "0 0 24px rgba(0,194,255,0.25)" }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {content}
    </motion.button>
  );
}
