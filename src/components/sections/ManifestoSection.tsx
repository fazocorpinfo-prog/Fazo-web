"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAPScrollTrigger } from "@/hooks/useGSAP";

export function ManifestoSection() {
  const t = useTranslations("manifesto");
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useGSAPScrollTrigger(({ gsap }) => {
    if (!sectionRef.current || !pinRef.current) return;

    // Pin the section for a scroll-driven text reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: pinRef.current,
        scrub: 1,
        pinSpacing: true,
      },
    });

    // Reveal each word of the statement by changing opacity
    const words = pinRef.current.querySelectorAll(".manifesto-word");
    words.forEach((word, i) => {
      tl.to(word, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.3,
        ease: "power2.out",
      }, i * 0.08);
    });

    // After statement reveals, show the accent line
    tl.to(".manifesto-accent-line", {
      scaleX: 1,
      duration: 0.5,
      ease: "expo.out",
    }, ">");

    // Then reveal paragraphs one by one
    tl.to(".manifesto-p1", {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 0.5, ease: "expo.out",
    }, ">");

    tl.to(".manifesto-p2", {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 0.5, ease: "expo.out",
    }, ">-0.2");

    tl.to(".manifesto-p3", {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 0.5, ease: "expo.out",
    }, ">-0.2");

    // Decorative background movement
    gsap.to(".manifesto-bg-orb", {
      yPercent: -40,
      rotation: 45,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  const statementWords = t("statement").split(" ");

  return (
    <section
      ref={sectionRef}
      id="about"
      data-ambient="manifesto"
      className="relative"
    >
      <div ref={pinRef} className="relative flex min-h-screen items-center overflow-hidden px-4 md:px-8">
        {/* Background orb */}
        <div
          className="manifesto-bg-orb pointer-events-none absolute right-[-15%] top-[5%] h-[700px] w-[700px] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, rgba(0,194,255,0.5) 0%, rgba(0,80,255,0.2) 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          aria-hidden
        />
        <div
          className="manifesto-bg-orb pointer-events-none absolute left-[-10%] bottom-[10%] h-[400px] w-[400px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, rgba(123,97,255,0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          aria-hidden
        />

        <div className="mx-auto max-w-7xl w-full">
          <div className="grid gap-16 md:grid-cols-2 md:gap-24 lg:gap-32 items-center">
            {/* Left — Statement with word-by-word reveal */}
            <div>
              <h2
                className="font-orbitron text-4xl font-bold leading-tight tracking-wide text-[var(--text-primary)] md:text-5xl lg:text-6xl"
                style={{ perspective: "800px" }}
              >
                {statementWords.map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
                    <span
                      className="manifesto-word inline-block opacity-[0.15] translate-y-2"
                      style={{ filter: "blur(4px)", transition: "none" }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </h2>
              <div
                className="manifesto-accent-line mt-8 h-[2px] w-24 bg-gradient-to-r from-[var(--accent-cyan)] to-transparent"
                style={{ transformOrigin: "left", transform: "scaleX(0)" }}
              />
            </div>

            {/* Right — Paragraphs that fade in */}
            <div className="flex flex-col justify-center gap-8">
              <p
                className="manifesto-p1 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg opacity-0 translate-y-6"
                style={{ filter: "blur(8px)" }}
              >
                {t("paragraph1")}
              </p>
              <p
                className="manifesto-p2 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg opacity-0 translate-y-6"
                style={{ filter: "blur(8px)" }}
              >
                {t("paragraph2")}
              </p>
              <p
                className="manifesto-p3 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg opacity-0 translate-y-6"
                style={{ filter: "blur(8px)" }}
              >
                {t("paragraph3")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
