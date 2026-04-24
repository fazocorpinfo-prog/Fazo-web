"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CosmicButton } from "@/components/ui/CosmicButton";

const EASE = [0.4, 0, 0.2, 1] as const;

type CosmicModalProps = {
  open: boolean;
  title: string;
  message: string;
  closeLabel: string;
  onClose: () => void;
};

export function CosmicModal({ open, title, message, closeLabel, onClose }: CosmicModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <motion.div
            className="relative w-full max-w-md rounded-2xl border border-[var(--border-accent)] p-7"
            style={{
              background: "rgba(11,3,36,0.78)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: "0 0 44px rgba(0,194,255,0.14)",
            }}
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.45, ease: EASE }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cosmic-modal-title"
          >
            <motion.div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-accent)]"
              animate={{ boxShadow: ["0 0 8px rgba(0,194,255,0.2)", "0 0 18px rgba(0,194,255,0.35)", "0 0 8px rgba(0,194,255,0.2)"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: EASE }}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--accent-cyan)]" fill="none">
                <motion.path
                  d="M5 12.5l4.2 4.2L19 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.65, ease: EASE, delay: 0.2 }}
                />
              </svg>
            </motion.div>

            <h3 id="cosmic-modal-title" className="text-center font-orbitron text-xl font-semibold text-[var(--text-primary)]">
              {title}
            </h3>
            <p className="mt-3 text-center text-sm leading-relaxed text-[var(--text-secondary)]">{message}</p>

            <div className="mt-6 flex justify-center">
              <CosmicButton onClick={onClose} ariaLabel={closeLabel}>
                {closeLabel}
              </CosmicButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
