"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState, type ReactNode } from "react";

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
  icon?: ReactNode;
  valid?: boolean;
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
  icon,
  valid,
}: CosmicInputProps) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const hasSlot = Boolean(icon);

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
          className={`w-full resize-none rounded-xl px-4 pb-3 pt-7 text-[var(--text-primary)] ${hasSlot ? "pr-11" : ""}`}
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
          className={`w-full rounded-xl px-4 pb-2 pt-6 text-[var(--text-primary)] ${hasSlot ? "pr-11" : ""}`}
          style={style}
        />
      )}

      {hasSlot ? (
        <div
          className={`pointer-events-none absolute right-3.5 ${multiline ? "top-4" : "top-1/2 -translate-y-1/2"}`}
          aria-hidden
        >
          <AnimatePresence mode="wait" initial={false}>
            {valid ? (
              <motion.span
                key="valid"
                className="flex h-5 w-5 items-center justify-center rounded-full text-[var(--accent-cyan)]"
                style={{ boxShadow: "0 0 12px rgba(0,194,255,0.35)", background: "rgba(0,194,255,0.12)" }}
                initial={{ scale: 0, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </motion.span>
            ) : (
              <motion.span
                key="icon"
                className="text-[var(--text-secondary)] opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
              >
                {icon}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      ) : null}
    </motion.div>
  );
}
