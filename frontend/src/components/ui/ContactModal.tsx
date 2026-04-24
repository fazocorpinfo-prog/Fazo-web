"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { CosmicButton } from "@/components/ui/CosmicButton";
import { CosmicInput } from "@/components/ui/CosmicInput";
import { CosmicLoader } from "@/components/ui/CosmicLoader";
import { useContactModal } from "@/contexts/ContactModalContext";

const EASE = [0.4, 0, 0.2, 1] as const;
const PHONE_PREFIX = "+998 ";

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(3);
  const d = digits.slice(0, 9);
  let out = PHONE_PREFIX;
  if (d.length > 0) out += d.slice(0, 2);
  if (d.length > 2) out += ` ${d.slice(2, 5)}`;
  if (d.length > 5) out += ` ${d.slice(5, 7)}`;
  if (d.length > 7) out += ` ${d.slice(7, 9)}`;
  return out;
}

function stripPhone(val: string) {
  return val.replace(/\D/g, "");
}

export function ContactModal() {
  const tContact = useTranslations("contact");
  const tModal = useTranslations("modal");
  const { isContactOpen, closeContactModal, openSuccessModal } = useContactModal();

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [form, setForm] = useState({ name: "", phone: PHONE_PREFIX, message: "" });
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; message?: boolean }>({});

  const canSubmit = useMemo(() => status !== "loading", [status]);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!form.name.trim()) nextErrors.name = true;
    if (stripPhone(form.phone).length < 12) nextErrors.phone = true;
    if (!form.message.trim()) nextErrors.message = true;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    const honeypot = String(new FormData(e.currentTarget).get("website") ?? "");
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: stripPhone(form.phone),
          message: form.message.trim(),
          service: "quick-contact",
          website: honeypot,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("idle");
      setForm({ name: "", phone: PHONE_PREFIX, message: "" });
      closeContactModal();
      openSuccessModal({
        title: tModal("successTitle"),
        message: tModal("successMessage"),
      });
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isContactOpen ? (
        <motion.div
          className="fixed inset-0 z-[115] flex items-center justify-center bg-black/55 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-2xl border border-[var(--border-accent)] p-6 md:p-8"
            style={{
              background: "rgba(11,3,36,0.78)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: "0 0 44px rgba(0,194,255,0.14)",
            }}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.45, ease: EASE }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full p-1 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-cyan)]"
              onClick={closeContactModal}
              aria-label={tModal("close")}
            >
              <X className="h-4 w-4" />
            </button>

            <h3 id="contact-modal-title" className="font-orbitron text-2xl font-semibold text-[var(--text-primary)]">
              {tContact("title")}
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{tContact("trustLine")}</p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
              />
              <CosmicInput
                id="modal-name"
                label={tContact("name")}
                value={form.name}
                onChange={(v) => setField("name", v)}
                error={errors.name}
              />
              <CosmicInput
                id="modal-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                label={tContact("phone")}
                value={form.phone}
                onChange={(v) => setField("phone", v.startsWith("+998") ? formatPhone(v) : PHONE_PREFIX)}
                error={errors.phone}
              />
              <CosmicInput
                id="modal-message"
                label={tContact("message")}
                value={form.message}
                onChange={(v) => setField("message", v)}
                error={errors.message}
                multiline
              />

              {status === "error" ? (
                <p className="text-sm text-red-400">{tContact("error")}</p>
              ) : null}

              <CosmicButton type="submit" disabled={!canSubmit} className="w-full" ariaLabel={tContact("submit")}>
                {status === "loading" ? (
                  <span className="inline-flex items-center gap-2">
                    <CosmicLoader size={22} />
                    {tContact("submit")}
                  </span>
                ) : (
                  tContact("submit")
                )}
              </CosmicButton>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
