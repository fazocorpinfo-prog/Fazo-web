"use client";
import { useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Globe, Server, Smartphone, Apple, Share2 } from "lucide-react";
import { usePointerCapable } from "@/hooks/usePointerCapable";
import { useGSAPScrollTrigger } from "@/hooks/useGSAP";

const PANELS = [
  { key: "web",     Icon: Globe,      num: "01", accent: "#00C2FF" },
  { key: "backend", Icon: Server,     num: "02", accent: "#7B61FF" },
  { key: "android", Icon: Smartphone, num: "03", accent: "#00FF88" },
  { key: "ios",     Icon: Apple,      num: "04", accent: "#FF6B35" },
  { key: "smm",     Icon: Share2,     num: "05", accent: "#FF3D7F" },
] as const;

interface PanelProps {
  Icon: React.ElementType; num: string; title: string;
  intro: string; bullets: string[]; pointerFine: boolean;
  accent: string;
}

function ServicePanel({ Icon, num, title, intro, bullets, pointerFine, accent }: PanelProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendRef = useRef<{ dx: number; dy: number } | null>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!pointerFine || !outerRef.current) return;
    const r = outerRef.current.getBoundingClientRect();
    pendRef.current = {
      dx: (e.clientX - r.left - r.width / 2) / r.width,
      dy: (e.clientY - r.top - r.height / 2) / r.height,
    };
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        const p = pendRef.current;
        if (p && innerRef.current) {
          innerRef.current.style.transform = `perspective(1000px) rotateY(${(p.dx * 8).toFixed(2)}deg) rotateX(${(-p.dy * 8).toFixed(2)}deg) translateZ(20px)`;
        }
        rafRef.current = null; pendRef.current = null;
      });
    }
  }, [pointerFine]);

  const onLeave = useCallback(() => {
    if (innerRef.current) innerRef.current.style.transform = "";
  }, []);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <div
      ref={outerRef}
      className="service-panel flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[35vw] h-full"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        ref={innerRef}
        className="relative flex h-full min-h-[400px] md:min-h-[480px] flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] p-8 md:p-10 transition-all duration-500 hover:border-[var(--border-accent)] group"
        style={{
          background: "var(--surface)",
          backdropFilter: "blur(16px)",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle at 50% 0%, ${accent}15, transparent 70%)` }}
        />

        {/* Number watermark */}
        <span
          className="absolute top-6 right-8 font-orbitron text-7xl font-bold opacity-[0.04] select-none"
          style={{ color: accent }}
        >
          {num}
        </span>

        <span className="font-orbitron text-xs tracking-[0.3em] text-[var(--text-secondary)] opacity-40 select-none">{num}</span>

        <div className="service-icon mt-6 mb-6 relative">
          <div className="absolute -inset-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `${accent}15`, filter: "blur(20px)" }} />
          <Icon className="relative h-10 w-10 md:h-12 md:w-12 transition-all duration-500 group-hover:scale-110" style={{ color: accent }} strokeWidth={1.5} aria-hidden />
        </div>

        <h3 className="font-orbitron text-xl md:text-2xl font-semibold leading-snug text-[var(--text-primary)]">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">{intro}</p>

        <ul className="mt-6 space-y-2.5 flex-1">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: accent, opacity: 0.7 }} />
              {b}
            </li>
          ))}
        </ul>

        {/* Bottom accent line */}
        <div
          className="mt-6 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out rounded-full"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />
      </div>
    </div>
  );
}

export function ServicesSection() {
  const t = useTranslations("services");
  const pointerFine = usePointerCapable();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAPScrollTrigger(({ gsap }) => {
    if (!sectionRef.current || !trackRef.current) return;

    // Title entrance
    gsap.from(".services-title-word", {
      y: "100%", opacity: 0, rotateX: -60,
      duration: 1.2, ease: "expo.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Horizontal scroll pinned section
    const totalWidth = trackRef.current.scrollWidth - window.innerWidth;

    gsap.to(trackRef.current, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  });

  const titleWords = t("title").split(" ");

  return (
    <section
      ref={sectionRef}
      id="services"
      data-ambient="services"
      className="relative overflow-hidden"
    >
      {/* Title — fixed above horizontal scroll */}
      <div className="pt-28 pb-12 px-4 md:px-8 md:pt-36 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <h2
            className="font-orbitron text-center text-3xl font-bold tracking-wide text-[var(--text-primary)] md:text-5xl lg:text-6xl"
            style={{ perspective: "1000px" }}
          >
            {titleWords.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
                <span className="services-title-word inline-block" style={{ transformStyle: "preserve-3d" }}>
                  {word}
                </span>
              </span>
            ))}
          </h2>
          <p className="mt-4 text-center text-sm tracking-[0.15em] text-[var(--text-secondary)] md:text-base opacity-60">
            Scroll to explore &rarr;
          </p>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div ref={trackRef} className="flex gap-6 md:gap-8 pl-[10vw] pr-[10vw] pb-28 items-stretch">
        {PANELS.map((panel) => (
          <ServicePanel
            key={panel.key}
            Icon={panel.Icon}
            num={panel.num}
            accent={panel.accent}
            title={t(`${panel.key}.title`)}
            intro={t(`${panel.key}.intro`)}
            bullets={[t(`${panel.key}.bullet1`), t(`${panel.key}.bullet2`), t(`${panel.key}.bullet3`)]}
            pointerFine={pointerFine}
          />
        ))}
      </div>
    </section>
  );
}
