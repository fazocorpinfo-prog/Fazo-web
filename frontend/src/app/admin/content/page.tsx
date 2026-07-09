"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, GripVertical } from "lucide-react";
import { AdminShell, adminCard } from "@/components/admin/AdminShell";

type Doc = { key: string; type: string; enabled: boolean; order: number; toggleable?: boolean };

const LABELS: Record<string, string> = {
  hero: "Bosh sahifa (Hero)", manifesto: "Manifest", services: "Xizmatlar", floating: "Nima uchun biz",
  positioning: "Pozitsiya", why: "Nega FAZO", portfolio: "Portfolio", techstack: "Texnologiyalar",
  process: "Jarayon", approach: "Yondashuv", team: "Jamoa", contact: "Aloqa", gallery: "Galereya", footer: "Footer",
  nav: "Navigatsiya", trust: "Ishonch belgilari", modal: "Modal oyna", notFound: "404 sahifa", cta: "CTA matn",
};
// hero/contact/footer are always-on (not toggleable)
const ALWAYS_ON = new Set(["hero", "contact", "footer"]);

export default function ContentListPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const load = () => fetch("/api/admin/content").then((r) => r.json()).then((d) => setDocs(d.docs || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const toggle = async (key: string, enabled: boolean) => {
    setSaving(key);
    setDocs((prev) => prev.map((d) => (d.key === key ? { ...d, enabled } : d)));
    await fetch("/api/admin/content/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ key, enabled }] }),
    }).catch(() => {});
    setSaving(null);
  };

  const sections = docs.filter((d) => d.type === "section").sort((a, b) => a.order - b.order);
  const singletons = docs.filter((d) => d.type === "singleton");

  return (
    <AdminShell>
      <h1 className="mb-1 font-orbitron text-2xl font-bold text-white">Kontent</h1>
      <p className="mb-8 text-sm text-[#A0AEC0]">Sahifa bo'limlarini yoqing/o'chiring va matn·rasmlarni tahrirlang</p>

      <h2 className="mb-3 text-sm font-semibold text-[#00C2FF]">Sahifa bo'limlari</h2>
      <div className={`${adminCard} mb-8 !p-0`}>
        <div className="divide-y divide-white/5">
          {sections.map((d) => (
            <div key={d.key} className="flex items-center gap-4 px-5 py-3.5">
              <GripVertical className="h-4 w-4 text-[#A0AEC0]/40" />
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{LABELS[d.key] ?? d.key}</div>
                <div className="text-xs text-[#A0AEC0]">#{d.order} · {d.key}</div>
              </div>

              {ALWAYS_ON.has(d.key) ? (
                <span className="text-xs text-[#A0AEC0]">doim yoqiq</span>
              ) : (
                <button
                  onClick={() => toggle(d.key, !d.enabled)}
                  disabled={saving === d.key}
                  aria-label="toggle"
                  className={`relative h-6 w-11 rounded-full transition-colors ${d.enabled ? "bg-[#00C2FF]" : "bg-white/15"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${d.enabled ? "left-[22px]" : "left-0.5"}`} />
                </button>
              )}

              <Link
                href={`/admin/content/${d.key}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,194,255,0.2)] px-3 py-1.5 text-xs text-white hover:bg-white/5"
              >
                <Pencil className="h-3.5 w-3.5" /> Tahrirlash
              </Link>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mb-3 text-sm font-semibold text-[#7B61FF]">Umumiy matnlar</h2>
      <div className={`${adminCard} !p-0`}>
        <div className="divide-y divide-white/5">
          {singletons.map((d) => (
            <div key={d.key} className="flex items-center gap-4 px-5 py-3.5">
              <div className="flex-1 text-sm font-medium text-white">{LABELS[d.key] ?? d.key}</div>
              <Link
                href={`/admin/content/${d.key}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,194,255,0.2)] px-3 py-1.5 text-xs text-white hover:bg-white/5"
              >
                <Pencil className="h-3.5 w-3.5" /> Tahrirlash
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
