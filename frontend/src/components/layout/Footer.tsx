"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="border-t border-[var(--border-subtle)] px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-2.5">
          <Image src="/fazo-logo.svg" alt="FAZO" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="font-orbitron text-xs font-bold tracking-widest text-[var(--text-secondary)]">FAZO</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">{t("rights")}</p>
      </div>
    </footer>
  );
}
