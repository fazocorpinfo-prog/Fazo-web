"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Instagram, Phone, Send, Youtube } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { CosmicButton } from "@/components/ui/CosmicButton";
import { useGSAPScrollTrigger } from "@/hooks/useGSAP";

const EASE = [0.4, 0, 0.2, 1] as const;

const quickNav = [
  { href: "#services", key: "services" },
  { href: "#process", key: "process" },
  { href: "#team", key: "team" },
  { href: "#contact", key: "contact" },
] as const;

const MUDARRIS_URL = process.env.NEXT_PUBLIC_MUDARRIS_URL ?? "https://mudarris.fazo.uz";
const CRM_DEMO_URL = process.env.NEXT_PUBLIC_MUDARRIS_CRM_DEMO_URL ?? "#";

export function CosmicFooter() {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");

  const footerRef = useRef<HTMLElement>(null);
  const magnetRef = useRef<HTMLDivElement>(null);
  const interactive = useRef(false);

  const phones = [tFooter("phone1"), tFooter("phone2")];
  const ctaWords = tFooter("ctaText").split(" ");

  useEffect(() => {
    interactive.current =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (magnetRef.current) {
      magnetRef.current.style.transition = "transform 0.35s cubic-bezier(0.4,0,0.2,1)";
    }
  }, []);

  const onMagnetMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive.current) return;
    const el = magnetRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(x * 0.28).toFixed(1)}px, ${(y * 0.4).toFixed(1)}px)`;
  };

  const onMagnetLeave = () => {
    if (magnetRef.current) magnetRef.current.style.transform = "translate(0px, 0px)";
  };

  useGSAPScrollTrigger(({ gsap }) => {
    if (!footerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Invitation heading — word-by-word reveal
    gsap.from(".footer-cta-word", {
      y: 44, opacity: 0, filter: "blur(8px)",
      duration: 0.9, ease: "expo.out", stagger: 0.06,
      scrollTrigger: { trigger: ".footer-cta-heading", start: "top 92%", toggleActions: "play none none none" },
    });

    // Columns — staggered rise
    gsap.from(".footer-col", {
      y: 32, opacity: 0,
      duration: 0.8, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".footer-cols", start: "top 92%", toggleActions: "play none none none" },
    });

    // Parallax — starfield drifts down, watermark rises, at contrasting rates
    gsap.to(".footer-stars", {
      yPercent: 20, ease: "none",
      scrollTrigger: { trigger: footerRef.current, start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.to(".footer-watermark", {
      yPercent: -16, ease: "none",
      scrollTrigger: { trigger: footerRef.current, start: "top bottom", end: "bottom top", scrub: 1.3 },
    });
  });

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-[var(--border-subtle)] px-4 pb-10 pt-16 md:px-8 md:pt-20">
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 50% 12%, rgba(0,120,255,0.16) 0%, rgba(0,194,255,0.06) 34%, transparent 70%)",
        }}
        animate={{ backgroundPosition: ["50% 12%", "55% 18%", "50% 12%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: EASE }}
      />
      <div
        className="footer-stars pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 30%, rgba(255,255,255,0.8) 0 1px, transparent 1px), radial-gradient(circle at 80% 22%, rgba(255,255,255,0.8) 0 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.7) 0 1px, transparent 1px), radial-gradient(circle at 35% 85%, rgba(255,255,255,0.6) 0 1px, transparent 1px), radial-gradient(circle at 92% 60%, rgba(255,255,255,0.6) 0 1px, transparent 1px)",
        }}
        aria-hidden
      />

      {/* Giant brand watermark — parallax, very faint */}
      <div
        className="footer-watermark pointer-events-none absolute inset-x-0 bottom-[-6%] z-0 select-none text-center font-orbitron font-bold leading-none text-[var(--text-primary)] opacity-[0.03]"
        style={{ fontSize: "23vw" }}
        aria-hidden
      >
        FAZO
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Invitation band */}
        <div className="flex flex-col gap-8 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/fazo-logo.svg" alt="FAZO" width={40} height={40} className="fazo-logo h-10 w-10 object-contain" />
              <span className="font-orbitron text-base font-bold tracking-widest text-[var(--text-primary)]">FAZO</span>
            </div>
            <h2 className="footer-cta-heading mt-6 max-w-xl font-orbitron text-2xl font-bold leading-tight text-[var(--text-primary)] md:text-[2rem] md:leading-[1.15]">
              {ctaWords.map((word, i) => (
                <span key={i} className="mr-[0.28em] inline-block overflow-hidden pb-1 align-top last:mr-0">
                  <span className="footer-cta-word inline-block">{word}</span>
                </span>
              ))}
            </h2>
          </div>

          <div
            ref={magnetRef}
            onMouseMove={onMagnetMove}
            onMouseLeave={onMagnetLeave}
            className="shrink-0 will-change-transform"
          >
            <CosmicButton href="#contact" ariaLabel={tFooter("ctaButton")}>
              <span className="inline-flex items-center gap-2">
                {tFooter("ctaButton")}
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </CosmicButton>
          </div>
        </div>

        {/* Columns */}
        <div className="footer-cols grid gap-10 border-t border-[var(--border-subtle)] pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="footer-col">
            <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">{tFooter("tagline")}</p>
            <div className="mt-6 flex items-center gap-3">
              <SocialLink href={tFooter("telegram")} label="Telegram" icon={<Send className="h-4 w-4" strokeWidth={1.75} />} />
              <SocialLink href={tFooter("instagram")} label="Instagram" icon={<Instagram className="h-4 w-4" strokeWidth={1.75} />} />
              <SocialLink href={tFooter("youtube")} label="YouTube" icon={<Youtube className="h-4 w-4" strokeWidth={1.75} />} />
            </div>
          </div>

          <nav className="footer-col space-y-3.5" aria-label="Footer">
            <h3 className="font-orbitron text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              {tNav("services")}
            </h3>
            {quickNav.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="footer-link block w-fit text-sm text-[var(--text-primary)] transition-colors hover:text-[var(--accent-cyan)]"
              >
                {tNav(item.key)}
              </a>
            ))}
          </nav>

          <div className="footer-col space-y-3.5">
            <h3 className="font-orbitron text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              {tNav("contact")}
            </h3>
            {phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="group flex w-fit items-center gap-2.5 text-sm text-[var(--text-primary)] transition-colors hover:text-[var(--accent-cyan)]"
              >
                <Phone className="h-4 w-4 shrink-0 text-[var(--accent-cyan)] transition-transform duration-300 group-hover:scale-110" strokeWidth={1.75} />
                {phone}
              </a>
            ))}
          </div>

          <div className="footer-col space-y-3.5">
            <h3 className="font-orbitron text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              {tFooter("ecosystem")}
            </h3>
            <a
              href={MUDARRIS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-fit items-center gap-1.5 text-sm text-[var(--text-primary)] transition-colors hover:text-[var(--accent-cyan)]"
            >
              {tFooter("mudarris")}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" strokeWidth={2} />
            </a>
            <a
              href={CRM_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-fit items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-cyan)]"
            >
              {tFooter("crmDemo")}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" strokeWidth={2} />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col-reverse items-start gap-4 border-t border-[var(--border-subtle)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--text-secondary)]">{tFooter("rights")}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 text-xs font-medium tracking-wide text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-cyan)]"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-subtle)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[var(--border-accent)]">
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            FAZO
          </button>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)]"
      whileHover={{ scale: 1.12, y: -2, color: "var(--accent-cyan)", boxShadow: "0 0 18px rgba(0,194,255,0.3)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {icon}
    </motion.a>
  );
}
