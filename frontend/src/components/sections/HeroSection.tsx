"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useGSAPScrollTrigger, useGSAPTimeline } from "@/hooks/useGSAP";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => ({ default: m.HeroScene })),
  { ssr: false, loading: () => <div className="absolute inset-0 -z-10 bg-[#0B0324]" /> }
);

function GlassButton({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <a
      href={href}
      className={`hero-cta group relative inline-flex items-center justify-center overflow-hidden rounded-xl border px-8 py-4 text-sm font-medium tracking-wider uppercase text-[var(--text-primary)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,194,255,0.3)]`}
      style={{
        background: "var(--surface)",
        backdropFilter: "blur(16px)",
        borderColor: primary ? "rgba(0,194,255,0.5)" : "rgba(0,194,255,0.2)",
      }}
    >
      <span className="absolute inset-0 -translate-x-full rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
      <span className="relative">{children}</span>
    </a>
  );
}

export function HeroSection() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Entrance animation timeline
  useGSAPTimeline((tl) => {
    // Set initial states
    tl.set(".hero-char", { y: "120%", opacity: 0, rotateX: -90 })
      .set(".hero-sub-word", { y: 30, opacity: 0, filter: "blur(8px)" })
      .set(".hero-cta", { y: 40, opacity: 0, scale: 0.9 })
      .set(".hero-logo", { scale: 1.5, opacity: 0, filter: "blur(20px)" })
      .set(".hero-scroll-indicator", { opacity: 0, y: 20 })
      .set(".hero-line-left", { scaleX: 0 })
      .set(".hero-line-right", { scaleX: 0 });

    // Logo - cinematic entrance
    tl.to(".hero-logo", {
      scale: 1, opacity: 1, filter: "blur(0px)",
      duration: 1.8, ease: "expo.out",
    }, 0.3);

    // Decorative lines sweep in
    tl.to(".hero-line-left", {
      scaleX: 1, duration: 1.2, ease: "expo.out",
    }, 0.8);
    tl.to(".hero-line-right", {
      scaleX: 1, duration: 1.2, ease: "expo.out",
    }, 0.9);

    // Characters stagger reveal - the money shot
    tl.to(".hero-char", {
      y: "0%", opacity: 1, rotateX: 0,
      duration: 1.2, ease: "expo.out",
      stagger: { amount: 0.6, from: "random" },
    }, 0.7);

    // Subheadline words
    tl.to(".hero-sub-word", {
      y: 0, opacity: 1, filter: "blur(0px)",
      duration: 0.8, ease: "expo.out",
      stagger: 0.04,
    }, 1.5);

    // CTA buttons
    tl.to(".hero-cta", {
      y: 0, opacity: 1, scale: 1,
      duration: 1, ease: "expo.out", stagger: 0.15,
    }, 1.8);

    // Scroll indicator
    tl.to(".hero-scroll-indicator", {
      opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
    }, 2.5);
  });

  // Scroll-driven pinned zoom-out effect
  useGSAPScrollTrigger(({ gsap }) => {
    if (!sectionRef.current || !pinRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=100%",
        pin: pinRef.current,
        scrub: 1,
        pinSpacing: true,
      },
    });

    // Content scales down and fades as user scrolls
    if (contentRef.current) {
      tl.to(contentRef.current, {
        scale: 0.8, opacity: 0, y: -80,
        filter: "blur(12px)",
        ease: "none",
      }, 0);
    }

    // Logo zooms out and fades
    if (logoRef.current) {
      tl.to(logoRef.current, {
        scale: 0.6, opacity: 0, y: -120,
        ease: "none",
      }, 0);
    }

    // Background zooms in dramatically
    if (bgRef.current) {
      tl.to(bgRef.current, {
        scale: 1.3, opacity: 0.2,
        ease: "none",
      }, 0);
    }
  });

  const headline = t("headline");
  const words = headline.split(" ");
  const subWords = t("subheadline").split(" ");

  return (
    <section
      ref={sectionRef}
      data-ambient="hero"
      className="relative"
    >
      <div ref={pinRef} className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div ref={bgRef} className="absolute inset-0 -z-10">
          <HeroScene />
        </div>

        {/* Decorative lines */}
        <div className="absolute left-0 top-1/2 w-[30%] pointer-events-none z-10">
          <div className="hero-line-left h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/30 to-transparent" style={{ transformOrigin: "left" }} />
        </div>
        <div className="absolute right-0 top-1/2 w-[30%] pointer-events-none z-10">
          <div className="hero-line-right h-px bg-gradient-to-l from-transparent via-[var(--accent-cyan)]/30 to-transparent" style={{ transformOrigin: "right" }} />
        </div>

        {/* Logo */}
        <div ref={logoRef} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="hero-logo">
            <Image
              src="/fazo-logo.svg"
              alt="FAZO"
              width={280}
              height={280}
              className="w-[140px] md:w-[200px] lg:w-[280px] h-auto drop-shadow-[0_0_40px_rgba(0,194,255,0.4)]"
              priority
            />
          </div>
        </div>

        {/* Text content */}
        <div ref={contentRef} className="relative z-20 mt-48 flex flex-col items-center text-center md:mt-56 lg:mt-64 px-4">
          <h1
            className="font-orbitron max-w-5xl text-4xl font-bold tracking-wide text-[var(--text-primary)] md:text-6xl lg:text-7xl"
            aria-label={headline}
            style={{ perspective: "1200px" }}
          >
            {words.map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
                {word.split("").map((char, ci) => (
                  <span
                    key={ci}
                    className="hero-char inline-block"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-xl text-base tracking-[0.15em] text-[var(--text-secondary)] md:text-lg" style={{ perspective: "600px" }}>
            {subWords.map((word, i) => (
              <span key={i} className="hero-sub-word inline-block mr-[0.3em] last:mr-0">
                {word}
              </span>
            ))}
          </p>

          <div className="mt-14 flex flex-col gap-4 sm:flex-row">
            <GlassButton href="#contact" primary>{t("ctaStart")}</GlassButton>
            <GlassButton href="#portfolio">{t("ctaContact")}</GlassButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--text-secondary)] opacity-50">Scroll</span>
          <div className="relative h-12 w-px">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-cyan)] to-transparent animate-scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
