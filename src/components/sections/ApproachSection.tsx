"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Zap, Code2, Handshake } from "lucide-react";
import { useGSAPScrollTrigger } from "@/hooks/useGSAP";

const VALUES = [
  { key: "innovation", Icon: Zap, accent: "#00C2FF" },
  { key: "precision", Icon: Code2, accent: "#7B61FF" },
  { key: "partnership", Icon: Handshake, accent: "#00FF88" },
] as const;

export function ApproachSection() {
  const t = useTranslations("approach");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPScrollTrigger(({ gsap, ScrollTrigger }) => {
    if (!sectionRef.current) return;

    // Title character reveal
    gsap.from(".approach-title-char", {
      y: "120%", opacity: 0, rotateX: -60,
      duration: 1, ease: "expo.out",
      stagger: 0.025,
      scrollTrigger: { trigger: ".approach-title-wrap", start: "top 82%", toggleActions: "play none none none" },
    });

    // Cards — stagger with 3D rotation
    const cards = gsap.utils.toArray<HTMLElement>(".approach-card");
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 80, opacity: 0, rotateY: i === 0 ? -15 : i === 2 ? 15 : 0,
        rotateX: -10, scale: 0.9,
        duration: 1.2, ease: "expo.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Subtle parallax per card
      gsap.to(card, {
        y: -(i + 1) * 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // Icons spin in
    ScrollTrigger.batch(".approach-icon", {
      onEnter: (batch) => {
        gsap.from(batch, {
          scale: 0, rotate: -180, opacity: 0,
          duration: 0.8, ease: "back.out(2)", stagger: 0.15,
        });
      },
      start: "top 85%",
      once: true,
    });
  });

  const titleWords = t("title").split(" ");

  return (
    <section ref={sectionRef} id="approach" data-ambient="approach" className="section-ambient px-4 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="approach-title-wrap text-center" style={{ perspective: "800px" }}>
          <h2 className="font-orbitron text-3xl font-bold tracking-wide text-[var(--text-primary)] md:text-4xl lg:text-5xl">
            {titleWords.map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
                {word.split("").map((char, ci) => (
                  <span key={ci} className="approach-title-char inline-block" style={{ transformStyle: "preserve-3d" }}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3" style={{ perspective: "1200px" }}>
          {VALUES.map(({ key, Icon, accent }) => (
            <div
              key={key}
              className="approach-card glass-card-premium shimmer-on-hover p-9 group relative overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Background glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: `radial-gradient(circle at 50% 0%, ${accent}12, transparent 70%)` }}
              />

              <div className="approach-icon relative z-10">
                <div className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `${accent}15`, filter: "blur(20px)" }} />
                <Icon className="relative h-10 w-10 transition-all duration-500 group-hover:scale-110" style={{ color: accent }} strokeWidth={1.5} aria-hidden />
              </div>
              <h3 className="relative z-10 mt-6 font-orbitron text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors duration-300">
                {t(`${key}.title`)}
              </h3>
              <p className="relative z-10 mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{t(`${key}.body`)}</p>

              {/* Bottom accent line */}
              <div
                className="relative z-10 mt-6 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out rounded-full"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
