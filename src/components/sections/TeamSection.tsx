"use client";
import { useRef, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePointerCapable } from "@/hooks/usePointerCapable";
import { Megaphone, Smartphone, ShieldCheck, Code2 } from "lucide-react";
import { useGSAPScrollTrigger } from "@/hooks/useGSAP";

const TEAM = [
  { key: "diyorbek", initial: "JD", Icon: Megaphone, color: "#00C2FF" },
  { key: "oybek", initial: "JO", Icon: Smartphone, color: "#7B61FF" },
  { key: "tursunjon", initial: "HT", Icon: ShieldCheck, color: "#00FF88" },
  { key: "muhammadali", initial: "JM", Icon: Code2, color: "#FFD700" },
] as const;

function MemberCard({
  memberKey, initial, Icon, color,
  isHovered, isSiblingFocused,
  onEnter, onLeave, pointerFine,
}: {
  memberKey: string; initial: string;
  Icon: React.ElementType; color: string;
  isHovered: boolean; isSiblingFocused: boolean;
  onEnter: () => void; onLeave: () => void;
  pointerFine: boolean;
}) {
  const t = useTranslations("team");
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!pointerFine || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / r.width;
    const dy = (e.clientY - r.top - r.height / 2) / r.height;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (innerRef.current)
        innerRef.current.style.transform = `perspective(800px) rotateY(${(dx * 10).toFixed(2)}deg) rotateX(${(-dy * 10).toFixed(2)}deg) translateZ(20px)`;
      rafRef.current = null;
    });
  }, [pointerFine]);

  const handleLeave = useCallback(() => {
    if (innerRef.current) innerRef.current.style.transform = "";
    onLeave();
  }, [onLeave]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <div
      className="team-card flex-1 min-w-[260px] max-w-[340px]"
      style={{
        filter: isSiblingFocused ? "blur(2px)" : "blur(0px)",
        opacity: isSiblingFocused ? 0.5 : 1,
        transform: isSiblingFocused ? "scale(0.97)" : "scale(1)",
        transition: "filter 0.5s, opacity 0.5s, transform 0.5s",
      }}
    >
      <div
        ref={cardRef}
        className="cursor-default"
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={handleLeave}
      >
        <div
          ref={innerRef}
          className="glass-card shimmer-on-hover relative overflow-hidden p-7 md:p-8 group"
          style={{ transformStyle: "preserve-3d", transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)", willChange: "transform" }}
        >
          {/* Color glow */}
          <div
            className="absolute -top-16 -right-16 h-48 w-48 rounded-full pointer-events-none transition-all duration-700"
            style={{ background: `radial-gradient(circle, ${color}25, transparent 70%)`, opacity: isHovered ? 1 : 0.2, filter: isHovered ? "blur(40px)" : "blur(60px)" }}
          />

          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full border transition-all duration-500" style={{ borderColor: `${color}30`, opacity: isHovered ? 1 : 0.4, transform: isHovered ? "scale(1.1)" : "scale(1)" }} />
              <div
                className="relative h-16 w-16 rounded-full border flex items-center justify-center transition-all duration-500"
                style={{ borderColor: `${color}50`, background: `${color}10`, boxShadow: isHovered ? `0 0 40px ${color}40` : `0 0 12px ${color}15` }}
              >
                <span className="font-orbitron text-lg font-bold" style={{ color }}>{initial}</span>
              </div>
            </div>
            <div>
              <h3 className="font-orbitron font-semibold text-[var(--text-primary)] text-base">{t(`${memberKey}.name`)}</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{t(`${memberKey}.role`)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.5} />
            <span className="text-xs font-medium tracking-wider uppercase" style={{ color, opacity: 0.8 }}>{t(`${memberKey}.specialty`)}</span>
          </div>
          <div className="rounded-lg p-3 mb-4 border transition-colors duration-300" style={{ background: `${color}06`, borderColor: isHovered ? `${color}30` : `${color}15` }}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)]">{t(`${memberKey}.workplace`)}</span>
              <span className="font-orbitron text-xs font-semibold" style={{ color }}>{t(`${memberKey}.experience`)}</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{t(`${memberKey}.about`)}</p>
          <p className="mt-3 text-xs italic opacity-70" style={{ color }}>&ldquo;{t(`${memberKey}.quote`)}&rdquo;</p>

          {/* Bottom accent */}
          <div
            className="mt-5 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
          />
        </div>
      </div>
    </div>
  );
}

export function TeamSection() {
  const t = useTranslations("team");
  const pointerFine = usePointerCapable();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPScrollTrigger(({ gsap }) => {
    if (!sectionRef.current) return;

    // Title character reveal
    gsap.from(".team-title-char", {
      y: "120%", opacity: 0, rotateX: -60,
      duration: 1, ease: "expo.out",
      stagger: 0.025,
      scrollTrigger: { trigger: ".team-title-wrap", start: "top 82%", toggleActions: "play none none none" },
    });

    gsap.from(".team-sub", {
      y: 20, opacity: 0, filter: "blur(6px)",
      duration: 0.8, ease: "expo.out",
      scrollTrigger: { trigger: ".team-sub", start: "top 85%", toggleActions: "play none none none" },
    });

    // Cards — 3D entrance from different angles
    const cards = gsap.utils.toArray<HTMLElement>(".team-card");
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 80, opacity: 0,
        rotateY: i === 0 ? -20 : i === 2 ? 20 : 0,
        scale: 0.85,
        duration: 1.2, ease: "expo.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });
  });

  const titleWords = t("title").split(" ");

  return (
    <section ref={sectionRef} id="team" data-ambient="team" className="section-ambient px-4 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="team-title-wrap text-center" style={{ perspective: "800px" }}>
          <h2 className="font-orbitron text-3xl font-bold tracking-wide text-[var(--text-primary)] md:text-4xl lg:text-5xl">
            {titleWords.map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
                {word.split("").map((char, ci) => (
                  <span key={ci} className="team-title-char inline-block" style={{ transformStyle: "preserve-3d" }}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>
        <p className="team-sub mt-3 text-center text-[var(--text-secondary)]">{t("subtitle")}</p>

        <div className="mt-16 flex flex-wrap justify-center gap-6 md:gap-8" style={{ perspective: "1200px" }}>
          {TEAM.map(({ key, initial, Icon, color }, i) => (
            <MemberCard
              key={key}
              memberKey={key}
              initial={initial}
              Icon={Icon}
              color={color}
              isHovered={hoveredIdx === i}
              isSiblingFocused={hoveredIdx !== null && hoveredIdx !== i}
              onEnter={() => setHoveredIdx(i)}
              onLeave={() => setHoveredIdx(null)}
              pointerFine={pointerFine}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
