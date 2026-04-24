"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Instagram, Send, Youtube } from "lucide-react";
import type { ReactNode } from "react";
import { CosmicButton } from "@/components/ui/CosmicButton";
import { useContactModal } from "@/contexts/ContactModalContext";

const EASE = [0.4, 0, 0.2, 1] as const;

const quickNav = [
  { href: "#services", key: "services" },
  { href: "#process", key: "process" },
  { href: "#team", key: "team" },
  { href: "#contact", key: "contact" },
] as const;

export function CosmicFooter() {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const { openContactModal } = useContactModal();

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border-subtle)] px-4 py-16 md:px-8 md:py-20">
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(0,120,255,0.15) 0%, rgba(0,194,255,0.06) 35%, transparent 72%)",
        }}
        animate={{ backgroundPosition: ["50% 20%", "55% 26%", "50% 20%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: EASE }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 30%, rgba(255,255,255,0.8) 0 1px, transparent 1px), radial-gradient(circle at 80% 22%, rgba(255,255,255,0.8) 0 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.7) 0 1px, transparent 1px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/fazo-logo.svg" alt="FAZO" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="font-orbitron text-base font-bold tracking-widest text-[var(--text-primary)]">FAZO</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">{tFooter("tagline")}</p>

          <div className="mt-6 flex items-center gap-3">
            <SocialLink href={tFooter("telegram")} label="Telegram" icon={<Send className="h-4 w-4" />} />
            <SocialLink href={tFooter("instagram")} label="Instagram" icon={<Instagram className="h-4 w-4" />} />
            <SocialLink href={tFooter("youtube")} label="YouTube" icon={<Youtube className="h-4 w-4" />} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-orbitron text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">Contact</h3>
          <a className="block text-sm text-[var(--text-primary)] transition-colors hover:text-[var(--accent-cyan)]" href={`tel:${tFooter("phone1").replace(/\s+/g, "")}`}>
            {tFooter("phone1")}
          </a>
          <a className="block text-sm text-[var(--text-primary)] transition-colors hover:text-[var(--accent-cyan)]" href={`tel:${tFooter("phone2").replace(/\s+/g, "")}`}>
            {tFooter("phone2")}
          </a>
          <div className="pt-2 space-y-2">
            {quickNav.map((item) => (
              <a key={item.key} href={item.href} className="block text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-cyan)]">
                {tNav(item.key)}
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] p-5" style={{ background: "var(--surface)", backdropFilter: "blur(14px)" }}>
          <p className="text-sm text-[var(--text-secondary)]">{tFooter("ctaText")}</p>
          <div className="mt-4">
            <CosmicButton onClick={openContactModal} ariaLabel={tFooter("ctaButton")} className="w-full">
              {tFooter("ctaButton")}
            </CosmicButton>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-7xl border-t border-[var(--border-subtle)] pt-6">
        <p className="text-xs text-[var(--text-secondary)]">{tFooter("rights")}</p>
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
      whileHover={{ scale: 1.08, color: "var(--accent-cyan)", boxShadow: "0 0 16px rgba(0,194,255,0.25)" }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {icon}
    </motion.a>
  );
}
