"use client";
import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";

const LOCALES = [
  { code: "uz", label: "UZ" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1 rounded-full border border-[var(--border-subtle)] px-3 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-accent)] hover:text-[var(--accent-cyan)]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.label}
        <span className="text-[10px] opacity-50">▾</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-11 z-50 min-w-[64px] overflow-hidden rounded-xl border border-[var(--border-subtle)] py-1 shadow-lg"
            style={{ background: "var(--bg-secondary)", backdropFilter: "blur(16px)" }}
          >
                    {LOCALES.map((loc) => (
                      <li key={loc.code} role="option" aria-selected={locale === loc.code}>
                        <button
                          type="button"
                          onClick={() => {
                            router.replace(pathname, { locale: loc.code });
                            setOpen(false);
                          }}
                          className={`w-full cursor-pointer px-4 py-2 text-left text-xs font-medium transition-colors hover:text-[var(--accent-cyan)] ${
                            locale === loc.code ? "text-[var(--accent-cyan)]" : "text-[var(--text-secondary)]"
                          }`}
                          aria-label={`Switch language to ${loc.label}`}
                        >
                          {loc.label}
                        </button>
                      </li>
                    ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
