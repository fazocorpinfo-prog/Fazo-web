"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAPScrollTrigger } from "@/hooks/useGSAP";

export function WhyFazoSection() {
  const t = useTranslations("why");
  const sectionRef = useRef<HTMLElement>(null);

  const items = [0, 1, 2, 3, 4].map((i) => ({
    label: t(`items.${i}.label`),
    body: t(`items.${i}.body`),
  }));

  useGSAPScrollTrigger(({ gsap, ScrollTrigger }) => {
    if (!sectionRef.current) return;

    // Title character reveal
    gsap.from(".why-title-char", {
      y: "120%", opacity: 0, rotateX: -60,
      duration: 1, ease: "expo.out",
      stagger: 0.025,
      scrollTrigger: { trigger: ".why-title-wrap", start: "top 82%", toggleActions: "play none none none" },
    });

    // Cards — stagger with 3D flip
    const cards = gsap.utils.toArray<HTMLElement>(".why-card");
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 80, opacity: 0, rotateX: -15, scale: 0.9,
        duration: 1, ease: "expo.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      // Each card has subtle parallax
      gsap.to(card, {
        y: -(i % 3) * 15 - 10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // Card accent lines grow in
    ScrollTrigger.batch(".why-line", {
      onEnter: (batch) => {
        gsap.from(batch, {
          width: 0, duration: 0.8, ease: "expo.out", stagger: 0.1,
        });
      },
      start: "top 85%",
      once: true,
    });
  });

  const titleWords = t("title").split(" ");

  return (
    <section ref={sectionRef} data-ambient="approach" className="section-ambient px-4 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="why-title-wrap" style={{ perspective: "800px" }}>
          <h2 className="font-orbitron text-center text-2xl font-semibold tracking-wide text-[var(--text-primary)] md:text-3xl lg:text-4xl">
            {titleWords.map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
                {word.split("").map((char, ci) => (
                  <span key={ci} className="why-title-char inline-block" style={{ transformStyle: "preserve-3d" }}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1200px" }}>
          {items.map(({ label, body }, i) => (
            <div
              key={i}
              className="why-card glass-card-premium relative p-7 shimmer-on-hover group"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="why-line mb-5 h-[2px] w-10" style={{ background: "linear-gradient(90deg, var(--accent-cyan), transparent)" }} />
              <h3 className="font-orbitron text-sm font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors duration-300">{label}</h3>
              <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">{body}</p>
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,194,255,0.06), transparent 70%)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
