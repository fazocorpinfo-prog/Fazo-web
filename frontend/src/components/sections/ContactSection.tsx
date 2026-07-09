"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Instagram, MessageSquare, Phone, Send, User } from "lucide-react";
import { CosmicInput } from "@/components/ui/CosmicInput";
import { CosmicLoader } from "@/components/ui/CosmicLoader";
import { CosmicSelect } from "@/components/ui/CosmicSelect";
import { useContactModal } from "@/contexts/ContactModalContext";
import { useGSAPScrollTrigger } from "@/hooks/useGSAP";

const SERVICE_KEYS = ["web", "backend", "android", "ios", "smm"] as const;
const TRUST_KEYS = ["transparent", "milestones", "clarity", "support"] as const;
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
  const tTrust = useTranslations("trust");
  const tFooter = useTranslations("footer");
  const { openSuccessModal } = useContactModal();
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const interactive = useRef(false);

  useEffect(() => {
    interactive.current =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (formRef.current) {
      formRef.current.style.transition = "transform 0.3s cubic-bezier(0.4,0,0.2,1)";
    }
  }, []);

  const onFormMove = (e: React.MouseEvent<HTMLFormElement>) => {
    if (!interactive.current) return;
    const el = formRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translateY(-4px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg)`;
    el.style.setProperty("--cursor-x", String(px + 0.5));
    el.style.setProperty("--cursor-y", String(py + 0.5));
  };

  const onFormLeave = () => {
    const el = formRef.current;
    if (el) el.style.transform = "translateY(0) rotateX(0) rotateY(0)";
  };

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

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const honeypot = String(new FormData(event.currentTarget).get("website") ?? "");

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
          website: honeypot,
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Title character reveal
    gsap.from(".contact-title-char", {
      y: "120%", opacity: 0, rotateX: -60,
      duration: 1, ease: "expo.out",
      stagger: 0.025,
      scrollTrigger: { trigger: ".contact-title-wrap", start: "top 85%", toggleActions: "play none none none" },
    });

    // Left-column content staggers in
    gsap.from(".contact-intro-item", {
      y: 26, opacity: 0,
      duration: 0.8, ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: ".contact-intro", start: "top 78%", toggleActions: "play none none none" },
    });

    // Form entrance — scale up from center with blur (on the perspective wrapper)
    gsap.from(".contact-form-wrap", {
      y: 80, opacity: 0, scale: 0.94,
      filter: "blur(12px)",
      duration: 1.2, ease: "expo.out",
      scrollTrigger: { trigger: ".contact-form-wrap", start: "top 85%", toggleActions: "play none none none" },
    });

    // Depth parallax — left column and form drift at different speeds on scroll
    gsap.to(".contact-intro", {
      yPercent: -9, ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.to(".contact-form-outer", {
      yPercent: 7, ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
    });

    // Background orbs — layered parallax at contrasting rates
    gsap.to(".contact-orb-a", {
      yPercent: -34, rotation: 24, ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.to(".contact-orb-b", {
      yPercent: 26, rotation: -18, ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.4 },
    });
  });

  const titleWords = t("title").split(" ");
  const phones = [tFooter("phone1"), tFooter("phone2")];

  // Live field validity → drives icons + completion bar
  const nameValid = form.name.trim().length > 1;
  const phoneValid = stripPhone(form.phone).length >= 12;
  const messageValid = form.message.trim().length > 0;
  const serviceValid = Boolean(form.service);
  const completed = [nameValid, phoneValid, serviceValid, messageValid].filter(Boolean).length;
  const progress = (completed / 4) * 100;
  const EASE = [0.4, 0, 0.2, 1] as const;

  return (
    <section ref={sectionRef} id="contact" data-ambient="contact" className="section-ambient relative overflow-hidden px-4 py-28 md:px-8 md:py-36">
      {/* Background orbs — layered depth */}
      <div className="contact-orb-a pointer-events-none absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, rgba(0,194,255,0.4) 0%, transparent 70%)", filter: "blur(80px)" }} aria-hidden />
      <div className="contact-orb-b pointer-events-none absolute left-[-10%] bottom-[10%] h-[400px] w-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, rgba(123,97,255,0.3) 0%, transparent 70%)", filter: "blur(60px)" }} aria-hidden />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* LEFT — invitation, trust, direct contact */}
        <div className="contact-intro">
          <div className="contact-title-wrap" style={{ perspective: "800px" }}>
            <h2 className="font-orbitron text-3xl font-bold leading-[1.05] tracking-wide text-[var(--text-primary)] md:text-4xl lg:text-[3.25rem]">
              {titleWords.map((word, wi) => (
                <span key={wi} className="mr-[0.3em] inline-block overflow-hidden last:mr-0">
                  {word.split("").map((char, ci) => (
                    <span key={ci} className="contact-title-char inline-block" style={{ transformStyle: "preserve-3d" }}>
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h2>
          </div>

          <p className="contact-intro-item mt-5 max-w-md text-base leading-relaxed text-[var(--text-secondary)]">
            {tFooter("ctaText")}
          </p>

          <ul className="mt-8 space-y-3.5">
            {TRUST_KEYS.map((key) => (
              <li key={key} className="contact-intro-item flex items-center gap-3 text-sm text-[var(--text-primary)]">
                <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-[var(--accent-cyan)]" strokeWidth={1.75} />
                {tTrust(key)}
              </li>
            ))}
          </ul>

          <div className="contact-intro-item mt-9 space-y-3 border-t border-[var(--border-subtle)] pt-7">
            {phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="group flex w-fit items-center gap-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--accent-cyan)]"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--accent-cyan)] transition-colors group-hover:border-[var(--border-accent)]">
                  <Phone className="h-4 w-4" strokeWidth={1.75} />
                </span>
                {phone}
              </a>
            ))}
          </div>

          <div className="contact-intro-item mt-6 flex items-center gap-3">
            <a
              href={tFooter("telegram")}
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-accent)] hover:text-[var(--accent-cyan)]"
            >
              <Send className="h-4 w-4" strokeWidth={1.75} />
            </a>
            <a
              href={tFooter("instagram")}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-accent)] hover:text-[var(--accent-cyan)]"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>

        {/* RIGHT — the form (parallax → perspective → tilt) */}
        <div className="contact-form-outer">
        <div className="contact-form-wrap" style={{ perspective: "1100px" }}>
        <form
          ref={formRef}
          onSubmit={onSubmit}
          onMouseMove={onFormMove}
          onMouseLeave={onFormLeave}
          className="contact-form-card group glass-card-premium relative space-y-5 p-8 md:p-10 [transform-style:preserve-3d]"
          noValidate
        >
          {/* cursor-tracking spotlight */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "radial-gradient(circle at calc(var(--cursor-x,0.5)*100%) calc(var(--cursor-y,0.5)*100%), rgba(0,194,255,0.10), transparent 55%)" }}
            aria-hidden
          />
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
          />

          {/* Completion progress — fills as fields are filled */}
          <div className="relative mb-1 h-1 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} aria-hidden>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #00C2FF, #0060FF)", boxShadow: "0 0 12px rgba(0,194,255,0.4)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>

          <CosmicInput
            id="contact-name"
            label={t("name")}
            value={form.name}
            onChange={(value) => setField("name", value)}
            error={errors.name}
            icon={<User className="h-4 w-4" strokeWidth={1.75} />}
            valid={nameValid}
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
            icon={<Phone className="h-4 w-4" strokeWidth={1.75} />}
            valid={phoneValid}
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
            icon={<MessageSquare className="h-4 w-4" strokeWidth={1.75} />}
            valid={messageValid}
            multiline
          />

          {status === "error" ? <p className="relative text-sm text-red-400">{t("error")}</p> : null}

          <motion.button
            type="submit"
            disabled={status === "loading"}
            aria-label={t("submit")}
            whileHover={status === "loading" ? undefined : { scale: 1.02, boxShadow: "0 10px 38px rgba(0,150,255,0.45)" }}
            whileTap={status === "loading" ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={`group relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-sm font-semibold text-[#04121f] ${status === "loading" ? "opacity-80" : ""}`}
            style={{ background: "linear-gradient(135deg, #00E0FF 0%, #00A6FF 55%, #0060FF 100%)", boxShadow: "0 8px 30px rgba(0,150,255,0.32)" }}
          >
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              aria-hidden
            />
            <span className="relative inline-flex items-center gap-2">
              {status === "loading" ? (
                <>
                  <CosmicLoader size={20} />
                  {t("submit")}
                </>
              ) : (
                <>
                  {t("submit")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.25} />
                </>
              )}
            </span>
          </motion.button>

          <p className="relative mt-2 text-center text-xs tracking-wide text-[var(--text-secondary)] opacity-50">
            {t("trustLine")}
          </p>
        </form>
        </div>
        </div>
      </div>
    </section>
  );
}
