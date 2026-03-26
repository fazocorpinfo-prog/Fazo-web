"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Stethoscope, BarChart3, Shield } from "lucide-react";
import Image from "next/image";
import { useGSAPScrollTrigger } from "@/hooks/useGSAP";

const PROJECTS = [
  {
    key: "uzavtosavdo",
    tags: ["Mobile", "Flutter"],
    color: "from-[#0050FF]/30 to-[#00C2FF]/15",
    accent: "#0050FF",
    image: "/uzautosavdo.png",
  },
  {
    key: "crm_savdo",
    tags: ["CRM", "Sklad", "Savdo"],
    color: "from-[#7B61FF]/30 to-[#00C2FF]/15",
    accent: "#7B61FF",
    icon: BarChart3,
  },
  {
    key: "shashlik_house",
    tags: ["React", "Node.js", "MongoDB", "React Native"],
    color: "from-[#FF6B35]/30 to-[#FF3D00]/15",
    accent: "#FF6B35",
    image: "/shshlik_house.jpg",
  },
  {
    key: "medhome",
    tags: ["Mobile", "Online Service"],
    color: "from-[#00C2FF]/30 to-[#0050FF]/15",
    accent: "#00C2FF",
    icon: Stethoscope,
  },
  {
    key: "bug_bounty",
    tags: ["Web", "Cyber Security"],
    color: "from-[#00FF88]/25 to-[#00C2FF]/15",
    accent: "#00FF88",
    icon: Shield,
  },
  {
    key: "coffee_fresh",
    tags: ["React Native", "Expo", "Offline"],
    color: "from-[#6B4226]/30 to-[#A0522D]/15",
    accent: "#A0522D",
    image: "/coffe_fresh.jpg",
  },
] as const;

function ProjectCard({
  title, description, result, tags, color, accent, image, icon: Icon, index,
}: {
  title: string; description: string; result: string; tags: readonly string[];
  color: string; accent: string; image?: string; icon?: React.ElementType; index: number;
}) {
  return (
    <div className="portfolio-card flex-shrink-0 w-[85vw] md:w-[50vw] lg:w-[40vw] group">
      <div
        className="relative h-full overflow-hidden rounded-2xl border border-[var(--border-subtle)] transition-all duration-700 hover:border-[var(--border-accent)] hover:shadow-[0_0_60px_var(--glow)]"
        style={{ background: "var(--surface)", backdropFilter: "blur(16px)" }}
      >
        {/* Visual section */}
        <div className={`relative h-56 md:h-72 overflow-hidden bg-gradient-to-br ${color}`}>
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(${accent}40 1px, transparent 1px), linear-gradient(90deg, ${accent}40 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Parallax inner image */}
          <div className="absolute inset-0 flex items-center justify-center">
            {image ? (
              <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2">
                <Image src={image} alt={title} fill className="object-cover" sizes="160px" />
              </div>
            ) : Icon ? (
              <div
                className="flex items-center justify-center h-28 w-28 md:h-32 md:w-32 rounded-2xl border border-white/10 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3"
                style={{ background: `${accent}12` }}
              >
                <Icon className="h-14 w-14 md:h-16 md:w-16" style={{ color: accent }} strokeWidth={1.2} />
              </div>
            ) : null}
          </div>

          {/* Number watermark */}
          <div className="absolute bottom-4 right-6">
            <span className="font-orbitron text-5xl md:text-6xl font-bold opacity-10" style={{ color: accent }}>
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-7 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium tracking-wider uppercase"
                style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}25` }}
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-orbitron text-xl font-semibold leading-snug text-[var(--text-primary)]">{title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>

          <div className="mt-5 rounded-xl p-4 border transition-all duration-500 group-hover:border-opacity-50" style={{ background: `${accent}06`, borderColor: `${accent}20` }}>
            <p className="font-orbitron font-semibold text-sm" style={{ color: accent }}>{result}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PortfolioSection() {
  const t = useTranslations("portfolio");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAPScrollTrigger(({ gsap, ScrollTrigger }) => {
    if (!sectionRef.current || !trackRef.current) return;

    // Title character reveal
    gsap.from(".portfolio-title-char", {
      y: "110%", opacity: 0, rotateX: -60,
      duration: 1, ease: "expo.out",
      stagger: 0.03,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none none",
      },
    });

    // Subtitle
    gsap.from(".portfolio-subtitle", {
      y: 20, opacity: 0, filter: "blur(6px)",
      duration: 0.8, ease: "expo.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none none",
      },
    });

    // Horizontal scroll
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

    // Stats counter animation
    ScrollTrigger.batch(".portfolio-stat", {
      onEnter: (batch) => {
        gsap.from(batch, {
          y: 40, opacity: 0, scale: 0.8,
          duration: 0.8, ease: "back.out(1.7)", stagger: 0.1,
        });
      },
      start: "top 90%",
      once: true,
    });
  });

  const titleText = t("title");

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      data-ambient="portfolio"
      className="relative overflow-hidden"
    >
      {/* Title */}
      <div className="pt-28 pb-8 px-4 md:px-8 md:pt-36 md:pb-12">
        <div className="mx-auto max-w-7xl text-center">
          <span className="font-orbitron text-xs tracking-[0.4em] uppercase text-[var(--accent-cyan)] opacity-60">
            {t("label")}
          </span>
          <h2
            className="mt-3 font-orbitron text-3xl font-bold tracking-wide text-[var(--text-primary)] md:text-5xl lg:text-6xl"
            style={{ perspective: "1000px" }}
          >
            {titleText.split(" ").map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
                {word.split("").map((char, ci) => (
                  <span key={ci} className="portfolio-title-char inline-block" style={{ transformStyle: "preserve-3d" }}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p className="portfolio-subtitle mt-4 max-w-xl mx-auto text-sm text-[var(--text-secondary)] md:text-base opacity-60">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div ref={trackRef} className="flex gap-6 md:gap-8 pl-[10vw] pr-[10vw] pb-16 items-stretch">
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.key}
            title={t(`${project.key}.title`)}
            description={t(`${project.key}.description`)}
            result={t(`${project.key}.result`)}
            tags={project.tags}
            color={project.color}
            accent={project.accent}
            image={"image" in project ? project.image : undefined}
            icon={"icon" in project ? project.icon : undefined}
            index={i}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="px-4 pb-20 md:px-8">
        <div className="mx-auto max-w-5xl grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {(["stat1", "stat2", "stat3", "stat4"] as const).map((key) => (
            <div
              key={key}
              className="portfolio-stat glass-card flex flex-col items-center p-6 text-center"
            >
              <span className="font-orbitron text-3xl font-bold text-[var(--accent-cyan)] md:text-4xl">
                {t(`${key}.value`)}
              </span>
              <span className="mt-2 text-xs text-[var(--text-secondary)]">
                {t(`${key}.label`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
