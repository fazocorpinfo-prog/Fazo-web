"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAPScrollTrigger } from "@/hooks/useGSAP";

const GALLERY_ITEMS = [
  { key: "item1", speed: -0.2, gradient: "from-[#00C2FF]/30 via-[#0050FF]/20 to-[#7B61FF]/10", size: "large", accent: "#00C2FF" },
  { key: "item2", speed: 0.15, gradient: "from-[#7B61FF]/25 via-[#00C2FF]/15 to-[#0050FF]/10", size: "medium", accent: "#7B61FF" },
  { key: "item3", speed: -0.1, gradient: "from-[#0050FF]/25 via-[#00C2FF]/20 to-transparent", size: "medium", accent: "#0050FF" },
  { key: "item4", speed: 0.25, gradient: "from-[#00C2FF]/20 via-[#7B61FF]/15 to-[#0050FF]/10", size: "large", accent: "#00C2FF" },
  { key: "item5", speed: -0.18, gradient: "from-[#7B61FF]/20 via-[#0050FF]/15 to-transparent", size: "small", accent: "#7B61FF" },
  { key: "item6", speed: 0.08, gradient: "from-[#0050FF]/20 via-[#00C2FF]/10 to-transparent", size: "small", accent: "#0050FF" },
] as const;

export function ParallaxGallerySection() {
  const t = useTranslations("gallery");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPScrollTrigger(({ gsap }) => {
    if (!sectionRef.current) return;

    // Title character reveal
    gsap.from(".gallery-title-char", {
      y: "120%", opacity: 0, rotateX: -60,
      duration: 1, ease: "expo.out",
      stagger: 0.025,
      scrollTrigger: { trigger: ".gallery-title-wrap", start: "top 82%", toggleActions: "play none none none" },
    });

    // Cards entrance — stagger with 3D rotation
    const cards = gsap.utils.toArray<HTMLElement>(".gallery-card");
    cards.forEach((card) => {
      gsap.from(card, {
        y: 100, opacity: 0, scale: 0.85, rotateX: -8,
        filter: "blur(6px)",
        duration: 1.2, ease: "expo.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    });

    // Parallax per card — enhanced with GSAP scrub
    cards.forEach((card) => {
      const speed = parseFloat((card as HTMLElement).dataset.speed || "0");
      gsap.to(card, {
        y: speed * -250,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });
  });

  const imgHeight = (size: string) =>
    size === "large" ? "h-72 md:h-96" : size === "medium" ? "h-56 md:h-72" : "h-48 md:h-60";

  const renderCard = (idx: number) => {
    const item = GALLERY_ITEMS[idx];
    return (
      <div key={item.key} className="gallery-card" data-speed={item.speed}>
        <div
          className={`group relative ${imgHeight(item.size)} overflow-hidden rounded-2xl border border-[var(--border-subtle)] transition-all duration-700 hover:border-[var(--border-accent)] hover:shadow-[0_0_50px_var(--glow)]`}
          style={{ background: "var(--surface)", backdropFilter: "blur(8px)" }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-60 transition-opacity duration-500 group-hover:opacity-80`} />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `radial-gradient(circle at 50% 50%, ${item.accent}20, transparent 70%)` }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div className="rounded-xl p-4 md:p-5" style={{ background: "rgba(11,3,36,0.7)", backdropFilter: "blur(20px)", border: `1px solid ${item.accent}20` }}>
              <span className="font-orbitron text-[10px] font-medium tracking-[0.2em] uppercase md:text-xs" style={{ color: item.accent }}>{t(`${item.key}.category`)}</span>
              <h3 className="mt-1.5 font-orbitron text-base font-semibold leading-snug text-[var(--text-primary)] md:text-lg">{t(`${item.key}.title`)}</h3>
            </div>
          </div>
          <div className="absolute top-4 left-5">
            <span className="font-orbitron text-5xl font-bold opacity-[0.06] md:text-6xl group-hover:opacity-10 transition-opacity duration-500" style={{ color: item.accent }}>{String(idx + 1).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    );
  };

  const titleWords = t("title").split(" ");

  return (
    <section ref={sectionRef} id="gallery" data-ambient="gallery" className="section-ambient relative overflow-hidden px-4 py-28 md:px-8 md:py-40">
      <div className="pointer-events-none absolute left-[-10%] top-[10%] h-[500px] w-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, rgba(0,194,255,0.4) 0%, rgba(0,80,255,0.15) 50%, transparent 70%)", filter: "blur(80px)" }} aria-hidden />

      <div className="mx-auto max-w-7xl">
        <div className="gallery-title-wrap text-center mb-16 md:mb-20" style={{ perspective: "800px" }}>
          <span className="font-orbitron text-xs tracking-[0.3em] uppercase text-[var(--accent-cyan)] opacity-70">{t("label")}</span>
          <h2 className="mt-3 font-orbitron text-3xl font-bold tracking-wide text-[var(--text-primary)] md:text-4xl lg:text-5xl">
            {titleWords.map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
                {word.split("").map((char, ci) => (
                  <span key={ci} className="gallery-title-char inline-block" style={{ transformStyle: "preserve-3d" }}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-sm text-[var(--text-secondary)] md:text-base">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          <div className="flex flex-col gap-5 md:gap-6">{[0, 3].map(renderCard)}</div>
          <div className="flex flex-col gap-5 md:gap-6 md:-mt-16 lg:-mt-24">{[1, 4].map(renderCard)}</div>
          <div className="flex flex-col gap-5 md:gap-6 lg:mt-12">{[2, 5].map(renderCard)}</div>
        </div>
      </div>
    </section>
  );
}
