"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

const EASE = [0.4, 0, 0.2, 1] as const;

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="section-ambient relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-24">
      {/* Ambient orbs */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.10]"
        style={{ background: "radial-gradient(circle, rgba(0,194,255,0.5) 0%, transparent 70%)", filter: "blur(90px)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.16, 0.1] }}
        transition={{ duration: 9, repeat: Infinity, ease: EASE }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 28%, rgba(255,255,255,0.9) 0 1.4px, transparent 1.5px), radial-gradient(circle at 82% 20%, rgba(255,255,255,0.8) 0 1.2px, transparent 1.3px), radial-gradient(circle at 68% 72%, rgba(255,255,255,0.7) 0 1.2px, transparent 1.3px), radial-gradient(circle at 30% 82%, rgba(255,255,255,0.7) 0 1.2px, transparent 1.3px)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Floating 404 */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: EASE }}
          className="relative"
        >
          <motion.h1
            className="gradient-text font-orbitron text-[26vw] font-bold leading-none tracking-tighter sm:text-[18vw] md:text-[13rem]"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: EASE }}
            style={{ filter: "drop-shadow(0 0 40px rgba(0,194,255,0.25))" }}
          >
            {t("code")}
          </motion.h1>

          {/* Orbiting accent dot */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--border-subtle)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            aria-hidden
          >
            <span
              className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
              style={{ background: "var(--accent-cyan)", boxShadow: "0 0 14px rgba(0,194,255,0.7)" }}
            />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="mt-2 font-orbitron text-2xl font-bold tracking-wide text-[var(--text-primary)] md:text-3xl"
        >
          {t("title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          className="mt-4 max-w-md text-sm leading-relaxed text-[var(--text-secondary)] md:text-base"
        >
          {t("text")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          className="mt-9"
        >
          <Link href="/" aria-label={t("home")}>
            <motion.span
              whileHover={{ scale: 1.03, boxShadow: "0 10px 38px rgba(0,150,255,0.45)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-7 py-3.5 text-sm font-semibold text-[#04121f]"
              style={{ background: "linear-gradient(135deg, #00E0FF 0%, #00A6FF 55%, #0060FF 100%)", boxShadow: "0 8px 30px rgba(0,150,255,0.32)" }}
            >
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                aria-hidden
              />
              <ArrowLeft className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2.25} />
              <span className="relative">{t("home")}</span>
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
