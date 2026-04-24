"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAPScrollTrigger } from "@/hooks/useGSAP";

export function FloatingContentSection() {
  const t = useTranslations("floating");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPScrollTrigger(({ gsap, ScrollTrigger }) => {
    if (!sectionRef.current) return;

    // Title character reveal
    gsap.from(".float-title-char", {
      y: "120%", opacity: 0, rotateX: -60,
      duration: 1, ease: "expo.out",
      stagger: 0.025,
      scrollTrigger: { trigger: ".float-title-wrap", start: "top 80%", toggleActions: "play none none none" },
    });

    // Animated line
    gsap.from(".float-line", {
      scaleX: 0, duration: 1.5, ease: "expo.out",
      scrollTrigger: { trigger: ".float-line", start: "top 85%", toggleActions: "play none none none" },
    });

    // Content cards — stagger with alternating directions + scrub parallax
    const leftCards = gsap.utils.toArray<HTMLElement>(".float-card-left");
    const rightCards = gsap.utils.toArray<HTMLElement>(".float-card-right");

    leftCards.forEach((card, i) => {
      gsap.from(card, {
        x: -100, opacity: 0, rotateY: 15, filter: "blur(10px)",
        duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
      });

      // Subtle parallax
      gsap.to(card, {
        y: -30 - i * 10, ease: "none",
        scrollTrigger: { trigger: sectionRef.current!, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    rightCards.forEach((card, i) => {
      gsap.from(card, {
        x: 100, opacity: 0, rotateY: -15, filter: "blur(10px)",
        duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
      });

      gsap.to(card, {
        y: -40 - i * 15, ease: "none",
        scrollTrigger: { trigger: sectionRef.current!, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // Stats — stagger + count up effect
    ScrollTrigger.batch(".float-stat", {
      onEnter: (batch) => {
        gsap.from(batch, {
          y: 60, opacity: 0, scale: 0.7, rotateX: -20,
          duration: 0.9, ease: "back.out(1.7)", stagger: 0.1,
        });
      },
      start: "top 88%",
      once: true,
    });

    // Background orbs
    gsap.to(".float-orb", {
      yPercent: -35, rotation: 30, ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  const titleChars = t("title");

  return (
    <section
      ref={sectionRef}
      data-ambient="floating"
      className="section-ambient relative overflow-hidden px-4 py-28 md:px-8 md:py-40"
    >
      <div className="float-orb pointer-events-none absolute left-[-8%] top-[20%] h-[400px] w-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,194,255,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} aria-hidden />
      <div className="float-orb pointer-events-none absolute right-[-5%] bottom-[15%] h-[300px] w-[300px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,80,255,0.06) 0%, transparent 70%)", filter: "blur(50px)" }} aria-hidden />

      <div className="mx-auto max-w-7xl">
        <div className="float-title-wrap text-center mb-20">
          <span className="font-orbitron text-xs tracking-[0.3em] uppercase text-[var(--accent-cyan)] opacity-70">{t("label")}</span>
          <h2
            className="mt-3 font-orbitron text-3xl font-bold tracking-wide text-[var(--text-primary)] md:text-4xl lg:text-5xl text-balance"
            style={{ perspective: "800px" }}
          >
            {titleChars.split(" ").map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
                {word.split("").map((char, ci) => (
                  <span key={ci} className="float-title-char inline-block" style={{ transformStyle: "preserve-3d" }}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <div className="float-line mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent" style={{ transformOrigin: "center" }} />
        </div>

        <div className="float-cards grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24" style={{ perspective: "1200px" }}>
          <div className="flex flex-col gap-8">
            <div className="float-card-left glass-card shimmer-on-hover p-8" style={{ transformStyle: "preserve-3d" }}>
              <div className="mb-4 h-0.5 w-16" style={{ background: "linear-gradient(90deg, var(--accent-cyan), transparent)" }} />
              <h3 className="font-orbitron text-xl font-semibold text-[var(--text-primary)]">{t("block1.title")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">{t("block1.text")}</p>
            </div>
            <div className="float-card-left glass-card shimmer-on-hover p-8" style={{ transformStyle: "preserve-3d" }}>
              <div className="mb-4 h-0.5 w-16" style={{ background: "linear-gradient(90deg, var(--accent-cyan), transparent)" }} />
              <h3 className="font-orbitron text-xl font-semibold text-[var(--text-primary)]">{t("block3.title")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">{t("block3.text")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-8 md:mt-20">
            <div className="float-card-right glass-card shimmer-on-hover p-8" style={{ transformStyle: "preserve-3d" }}>
              <div className="mb-4 h-0.5 w-16" style={{ background: "linear-gradient(90deg, var(--accent-blue), transparent)" }} />
              <h3 className="font-orbitron text-xl font-semibold text-[var(--text-primary)]">{t("block2.title")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">{t("block2.text")}</p>
            </div>
            <div className="float-card-right glass-card shimmer-on-hover p-8" style={{ transformStyle: "preserve-3d" }}>
              <div className="mb-4 h-0.5 w-16" style={{ background: "linear-gradient(90deg, var(--accent-blue), transparent)" }} />
              <h3 className="font-orbitron text-xl font-semibold text-[var(--text-primary)]">{t("block4.title")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">{t("block4.text")}</p>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {(["stat1", "stat2", "stat3", "stat4"] as const).map((key) => (
            <div key={key} className="float-stat glass-card flex flex-col items-center justify-center p-6 text-center" style={{ transformStyle: "preserve-3d" }}>
              <span className="font-orbitron text-3xl font-bold text-[var(--accent-cyan)] md:text-4xl">{t(`${key}.value`)}</span>
              <span className="mt-2 text-xs text-[var(--text-secondary)] md:text-sm">{t(`${key}.label`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
