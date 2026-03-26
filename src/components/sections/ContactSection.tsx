"use client";

import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import { CosmicButton } from "@/components/ui/CosmicButton";
import { CosmicInput } from "@/components/ui/CosmicInput";
import { CosmicLoader } from "@/components/ui/CosmicLoader";
import { CosmicSelect } from "@/components/ui/CosmicSelect";
import { useContactModal } from "@/contexts/ContactModalContext";
import { useGSAPScrollTrigger } from "@/hooks/useGSAP";

const SERVICE_KEYS = ["web", "backend", "android", "ios", "smm"] as const;
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

function stripPhone(value: string) {
  return value.replace(/\D/g, "");
}

export function ContactSection() {
  const t = useTranslations("contact");
  const tServices = useTranslations("services");
  const tModal = useTranslations("modal");
  const { openSuccessModal } = useContactModal();
  const sectionRef = useRef<HTMLElement>(null);

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [form, setForm] = useState({ name: "", phone: PHONE_PREFIX, service: "", message: "" });
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; service?: boolean; message?: boolean }>({});

  const options = useMemo(
    () => SERVICE_KEYS.map((key) => ({ value: key, label: tServices(`${key}.title`) })),
    [tServices]
  );

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!form.name.trim()) nextErrors.name = true;
    if (stripPhone(form.phone).length < 12) nextErrors.phone = true;
    if (!form.service) nextErrors.service = true;
    if (!form.message.trim()) nextErrors.message = true;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          message: form.message.trim(),
          phone: stripPhone(form.phone),
        }),
      });

      if (!response.ok) throw new Error("Failed to send");

      setForm({ name: "", phone: PHONE_PREFIX, service: "", message: "" });
      setStatus("idle");
      openSuccessModal({
        title: tModal("successTitle"),
        message: tModal("successMessage"),
      });
    } catch {
      setStatus("error");
    }
  };

  useGSAPScrollTrigger(({ gsap }) => {
    if (!sectionRef.current) return;

    // Title character reveal
    gsap.from(".contact-title-char", {
      y: "120%", opacity: 0, rotateX: -60,
      duration: 1, ease: "expo.out",
      stagger: 0.025,
      scrollTrigger: { trigger: ".contact-title-wrap", start: "top 82%", toggleActions: "play none none none" },
    });

    // Form entrance — scale up from center with blur
    gsap.from(".contact-form", {
      y: 80, opacity: 0, scale: 0.9,
      filter: "blur(12px)",
      duration: 1.2, ease: "expo.out",
      scrollTrigger: { trigger: ".contact-form", start: "top 85%", toggleActions: "play none none none" },
    });

    // Background orbs parallax
    gsap.to(".contact-orb", {
      yPercent: -30, rotation: 20,
      ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  const titleWords = t("title").split(" ");

  return (
    <section ref={sectionRef} id="contact" data-ambient="contact" className="section-ambient relative overflow-hidden px-4 py-28 md:px-8 md:py-36">
      {/* Background orbs */}
      <div className="contact-orb pointer-events-none absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, rgba(0,194,255,0.4) 0%, transparent 70%)", filter: "blur(80px)" }} aria-hidden />
      <div className="contact-orb pointer-events-none absolute left-[-10%] bottom-[10%] h-[400px] w-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, rgba(123,97,255,0.3) 0%, transparent 70%)", filter: "blur(60px)" }} aria-hidden />

      <div className="mx-auto max-w-2xl relative z-10">
        <div className="contact-title-wrap text-center" style={{ perspective: "800px" }}>
          <h2 className="font-orbitron text-3xl font-bold tracking-wide text-[var(--text-primary)] md:text-4xl lg:text-5xl">
            {titleWords.map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
                {word.split("").map((char, ci) => (
                  <span key={ci} className="contact-title-char inline-block" style={{ transformStyle: "preserve-3d" }}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        <form
          onSubmit={onSubmit}
          className="contact-form glass-card-premium mt-12 space-y-5 p-8 md:p-10"
          noValidate
        >
          <CosmicInput
            id="contact-name"
            label={t("name")}
            value={form.name}
            onChange={(value) => setField("name", value)}
            error={errors.name}
          />
          <CosmicInput
            id="contact-phone"
            type="tel"
            label={t("phone")}
            inputMode="numeric"
            autoComplete="tel"
            value={form.phone}
            onChange={(value) => setField("phone", value.startsWith("+998") ? formatPhone(value) : PHONE_PREFIX)}
            error={errors.phone}
          />
          <CosmicSelect
            label={t("service")}
            value={form.service}
            options={options}
            onChange={(value) => setField("service", value)}
            error={errors.service}
          />
          <CosmicInput
            id="contact-message"
            label={t("message")}
            value={form.message}
            onChange={(value) => setField("message", value)}
            error={errors.message}
            multiline
          />

          {status === "error" ? <p className="text-sm text-red-400">{t("error")}</p> : null}

          <CosmicButton type="submit" disabled={status === "loading"} className="w-full" ariaLabel={t("submit")}>
            {status === "loading" ? (
              <span className="inline-flex items-center gap-2">
                <CosmicLoader size={22} />
                {t("submit")}
              </span>
            ) : (
              t("submit")
            )}
          </CosmicButton>

          <p className="mt-2 text-center text-xs tracking-wide text-[var(--text-secondary)] opacity-50">
            {t("trustLine")}
          </p>
        </form>
      </div>
    </section>
  );
}
