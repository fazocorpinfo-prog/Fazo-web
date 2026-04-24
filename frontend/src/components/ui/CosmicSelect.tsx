"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const EASE = [0.4, 0, 0.2, 1] as const;

type Option = { value: string; label: string };

type CosmicSelectProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  error?: boolean;
};

export function CosmicSelect({ label, value, options, onChange, error }: CosmicSelectProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);
  const floated = open || value.length > 0;

  useEffect(() => {
    const onOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <label
        className="pointer-events-none absolute left-4 z-10 origin-left transition-all duration-300"
        style={{
          top: floated ? "8px" : "50%",
          transform: floated ? "translateY(0) scale(0.78)" : "translateY(-50%) scale(1)",
          color: focused || open ? "var(--accent-cyan)" : "var(--text-secondary)",
          fontSize: "0.875rem",
        }}
      >
        {label}
      </label>

      <button
        type="button"
        className="w-full rounded-xl px-4 pb-2 pt-6 text-left text-[var(--text-primary)]"
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: error
            ? "rgba(248,113,113,0.6)"
            : open
            ? "var(--border-accent)"
            : "var(--border-subtle)",
          boxShadow: open ? "0 0 0 2px rgba(0,194,255,0.22)" : "none",
          background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        onClick={() => {
          setOpen((prev) => !prev);
          setFocused(true);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "opacity-100" : "opacity-0"}>{selected?.label ?? "placeholder"}</span>
        <motion.span
          className="absolute right-4 top-1/2 -translate-y-1/2"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <ChevronDown className="h-4 w-4 text-[var(--text-secondary)]" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-[var(--border-subtle)] py-1"
            style={{
              background: "rgba(20,10,58,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              transformOrigin: "top",
            }}
            initial={{ opacity: 0, scaleY: 0.92, y: -4 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.92, y: -4 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setFocused(false);
                }}
                className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors hover:text-[var(--text-primary)]"
                style={{
                  color: value === option.value ? "var(--accent-cyan)" : "var(--text-secondary)",
                  background: value === option.value ? "rgba(0,194,255,0.06)" : "transparent",
                }}
              >
                <span>{option.label}</span>
                {value === option.value ? <Check className="h-3.5 w-3.5" /> : null}
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
