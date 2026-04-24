"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const EASE = [0.4, 0, 0.2, 1] as const;

type CosmicInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  type?: "text" | "tel" | "email";
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "email";
  multiline?: boolean;
  rows?: number;
};

export function CosmicInput({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  inputMode,
  multiline,
  rows = 4,
}: CosmicInputProps) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  const style = {
    borderColor: error
      ? "rgba(248,113,113,0.6)"
      : focused
      ? "var(--border-accent)"
      : "var(--border-subtle)",
    boxShadow: focused
      ? "0 0 0 2px rgba(0,194,255,0.22)"
      : error
      ? "0 0 0 2px rgba(248,113,113,0.18)"
      : "none",
    background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  } as const;

  return (
    <motion.div
      className="relative"
      animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 z-10 origin-left transition-all duration-300"
        style={{
          top: floated ? "8px" : multiline ? "16px" : "50%",
          transform: floated ? "translateY(0) scale(0.78)" : multiline ? "scale(1)" : "translateY(-50%) scale(1)",
          color: focused ? "var(--accent-cyan)" : "var(--text-secondary)",
          fontSize: "0.875rem",
        }}
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full resize-none rounded-xl px-4 pb-3 pt-7 text-[var(--text-primary)]"
          style={style}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className="w-full rounded-xl px-4 pb-2 pt-6 text-[var(--text-primary)]"
          style={style}
        />
      )}
    </motion.div>
  );
}
