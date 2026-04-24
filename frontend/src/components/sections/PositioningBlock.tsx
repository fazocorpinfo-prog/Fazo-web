"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { useGSAPScrollTrigger } from "@/hooks/useGSAP";

const TRUST_KEYS = ["transparent", "milestones", "clarity", "support"] as const;

export function PositioningBlock() {
  const t = useTranslations("positioning");
  const tTrust = useTranslations("trust");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPScrollTrigger(({ gsap, ScrollTrigger }) => {
    if (!sectionRef.current) return;

    // Line 1 — character by character reveal
    gsap.from(".pos-char", {
      y: "110%", opacity: 0, rotateX: -60,
      duration: 1, ease: "expo.out",
      stagger: 0.02,
      scrollTrigger: { trigger: ".pos-line1", start: "top 80%", toggleActions: "play none none none" },
    });

    // Line 2
    gsap.from(".pos-line2", {
      y: 30, opacity: 0, filter: "blur(8px)",
      duration: 1, ease: "expo.out",
      scrollTrigger: { trigger: ".pos-line2", start: "top 85%", toggleActions: "play none none none" },
    });

    // Trust items — stagger with scale bounce
    ScrollTrigger.batch(".trust-item", {
      onEnter: (batch) => {
        gsap.from(batch, {
          y: 40, opacity: 0, scale: 0.6, rotateY: 20,
          duration: 0.8, ease: "back.out(2)", stagger: 0.1,
        });
      },
      start: "top 88%",
      once: true,
    });

    // Trust icons spin in
    ScrollTrigger.batch(".trust-icon", {
      onEnter: (batch) => {
        gsap.from(batch, {
          scale: 0, rotation: -180,
          duration: 0.7, ease: "back.out(1.7)", stagger: 0.08,
        });
      },
      start: "top 85%",
      once: true,
    });
  });

  const line1Words = t("line1").split(" ");

  return (
    <section ref={sectionRef} className="section-ambient px-4 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-5xl text-center">
        <p
          className="pos-line1 font-orbitron text-2xl font-semibold tracking-widest text-[var(--text-secondary)] md:text-3xl lg:text-5xl"
          style={{ perspective: "1000px" }}
        >
          {line1Words.map((word, wi) => (
            <span key={wi} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
              {word.split("").map((char, ci) => (
                <span key={ci} className="pos-char inline-block" style={{ transformStyle: "preserve-3d" }}>
                  {char}
                </span>
              ))}
            </span>
          ))}
        </p>
        <p className="pos-line2 mt-4 text-sm tracking-[0.2em] text-[var(--text-secondary)] opacity-50 md:text-base">
          {t("line2")}
        </p>

        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          {TRUST_KEYS.map((key) => (
            <div key={key} className="trust-item flex flex-col items-center gap-3">
              <div className="trust-icon relative">
                <div className="absolute -inset-2 rounded-full bg-[var(--accent-cyan)]/10 blur-md" />
                <CheckCircle2 className="relative h-6 w-6 text-[var(--accent-cyan)]" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-medium tracking-wider text-[var(--text-secondary)]">{tTrust(key)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
