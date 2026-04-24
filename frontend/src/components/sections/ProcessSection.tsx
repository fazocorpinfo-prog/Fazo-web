"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAPScrollTrigger } from "@/hooks/useGSAP";

const STEPS = ["idea", "design", "development", "launch"] as const;
const S_PATH = "M 100 0 C 40 200, 160 400, 100 500 C 40 600, 160 700, 100 800";

export function ProcessSection() {
  const t = useTranslations("process");
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const particleRef = useRef<SVGCircleElement>(null);
  const glowDotRef = useRef<SVGCircleElement>(null);

  useGSAPScrollTrigger(({ gsap }) => {
    if (!sectionRef.current) return;

    // Title character reveal
    gsap.from(".process-title-char", {
      y: "120%", opacity: 0, rotateX: -60,
      duration: 1, ease: "expo.out",
      stagger: 0.025,
      scrollTrigger: { trigger: ".process-title-wrap", start: "top 82%", toggleActions: "play none none none" },
    });

    // SVG path draw — scrub-based (tied to scroll!)
    const path = svgPathRef.current;
    const glowPath = glowPathRef.current;
    if (path && glowPath) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      glowPath.style.strokeDasharray = `${len}`;
      glowPath.style.strokeDashoffset = `${len}`;

      // Scrub-based path drawing
      gsap.to([path, glowPath], {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 1,
        },
      });

      // Particle follows path on scroll
      gsap.to({}, {
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const pt = path.getPointAtLength(progress * len);
            particleRef.current?.setAttribute("cx", pt.x.toFixed(1));
            particleRef.current?.setAttribute("cy", pt.y.toFixed(1));
            glowDotRef.current?.setAttribute("cx", pt.x.toFixed(1));
            glowDotRef.current?.setAttribute("cy", pt.y.toFixed(1));
            const op = progress > 0.01 ? "1" : "0";
            particleRef.current?.setAttribute("opacity", op);
            glowDotRef.current?.setAttribute("opacity", op);
          },
        },
      });
    }

    // Step cards — stagger with 3D entrance
    const cards = gsap.utils.toArray<HTMLElement>(".process-card");
    cards.forEach((card) => {
      gsap.from(card, {
        y: 60, opacity: 0, rotateX: -10, scale: 0.95,
        filter: "blur(6px)",
        duration: 1, ease: "expo.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    // Mobile line
    gsap.from(".process-mobile-line", {
      scaleY: 0, opacity: 0,
      duration: 1.4, ease: "expo.out",
      scrollTrigger: { trigger: ".process-mobile-line", start: "top 80%", toggleActions: "play none none none" },
    });
  });

  const titleWords = t("title").split(" ");

  return (
    <section id="process" data-ambient="process" className="section-ambient px-4 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-5xl">
        <div className="process-title-wrap text-center" style={{ perspective: "800px" }}>
          <h2 className="font-orbitron text-3xl font-bold tracking-wide text-[var(--text-primary)] md:text-4xl lg:text-5xl">
            {titleWords.map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
                {word.split("").map((char, ci) => (
                  <span key={ci} className="process-title-char inline-block" style={{ transformStyle: "preserve-3d" }}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        <div ref={sectionRef} className="relative mt-20">
          {/* SVG arc — desktop */}
          <div className="absolute inset-0 hidden md:block pointer-events-none" aria-hidden>
            <svg className="absolute left-1/2 top-0 -translate-x-1/2 overflow-visible" width="200" height="100%" viewBox="0 0 200 800" preserveAspectRatio="none">
              <defs>
                <filter id="proc-glow" filterUnits="userSpaceOnUse" x="-30" y="-30" width="260" height="860">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="dot-glow" filterUnits="userSpaceOnUse" x="-30" y="-30" width="260" height="860">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path d={S_PATH} stroke="rgba(0,194,255,0.06)" strokeWidth="1" fill="none" />
              <path ref={glowPathRef} d={S_PATH} stroke="rgba(0,194,255,0.25)" strokeWidth="12" fill="none" filter="url(#proc-glow)" />
              <path ref={svgPathRef} d={S_PATH} stroke="rgba(0,194,255,0.9)" strokeWidth="2" fill="none" />
              <circle ref={glowDotRef} r="12" fill="rgba(0,194,255,0.3)" cx="100" cy="0" opacity="0" filter="url(#dot-glow)" />
              <circle ref={particleRef} r="4" fill="#00C2FF" cx="100" cy="0" opacity="0" />
            </svg>
          </div>

          {/* Mobile line */}
          <div className="process-mobile-line absolute left-1/2 top-2 h-[calc(100%-1rem)] w-px -translate-x-1/2 overflow-hidden md:hidden" aria-hidden style={{ transformOrigin: "top" }}>
            <div className="h-full w-full" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,194,255,0.5) 40%, rgba(0,194,255,0.5) 60%, transparent)" }} />
          </div>

          {/* Step cards */}
          <div className="flex flex-col gap-16 md:gap-24">
            {STEPS.map((step, i) => (
              <div
                key={step}
                className={`process-card flex flex-col md:flex-row items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                style={{ perspective: "800px" }}
              >
                <div className={`w-full md:flex-1 flex ${i % 2 === 0 ? "justify-center md:justify-end md:pr-10" : "justify-center md:justify-start md:pl-10"}`}>
                  <div className="glass-card inline-flex flex-col gap-3 px-8 py-7 max-w-sm group hover:shadow-[0_0_40px_var(--glow)] transition-shadow duration-500">
                    <span className="font-orbitron text-xs tracking-[0.3em] text-[var(--text-secondary)] opacity-40">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-orbitron text-xl font-bold text-[var(--accent-cyan)] group-hover:drop-shadow-[0_0_8px_rgba(0,194,255,0.4)] transition-all duration-300">{t(`${step}.title`)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{t(`${step}.desc`)}</p>
                  </div>
                </div>
                <div className="hidden md:block md:w-[200px] flex-shrink-0" />
                <div className="hidden md:block md:flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
