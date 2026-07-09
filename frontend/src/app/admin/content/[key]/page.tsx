"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { AdminShell, adminCard, adminBtn, adminBtnStyle } from "@/components/admin/AdminShell";
import { ImageField } from "@/components/admin/ImageField";

type L10n = { uz: string; ru?: string; en?: string };
type Item = { id: string; order: number; enabled: boolean; image?: { mediaId: string | null; legacySrc?: string | null }; fields: Record<string, L10n>; meta?: Record<string, unknown> };
type Stat = { id: string; value: L10n; label: L10n };
type Doc = {
  key: string; type: string; enabled: boolean; order: number;
  fields: Record<string, L10n | L10n[]>; items: Item[]; stats: Stat[]; extra: Record<string, unknown>;
};

const LOCALES: ("uz" | "ru" | "en")[] = ["uz", "ru", "en"];
const LOCALE_LABEL = { uz: "O'zbek", ru: "Русский", en: "English" };

function L10nInput({ value, onChange, multiline }: { value: L10n; onChange: (v: L10n) => void; multiline?: boolean }) {
  const [tab, setTab] = useState<"uz" | "ru" | "en">("uz");
  const cls = "w-full rounded-lg border border-[rgba(0,194,255,0.15)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-white outline-none focus:border-[rgba(0,194,255,0.5)]";
  return (
    <div>
      <div className="mb-1.5 flex gap-1">
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setTab(l)}
            className={`rounded px-2 py-0.5 text-xs transition-colors ${tab === l ? "bg-[rgba(0,194,255,0.15)] text-white" : "text-[#A0AEC0] hover:text-white"}`}
          >
            {LOCALE_LABEL[l]}{!value[l] && l !== "uz" ? " ·" : ""}
          </button>
        ))}
      </div>
      {multiline ? (
        <textarea rows={3} className={`${cls} resize-y`} value={value[tab] || ""} onChange={(e) => onChange({ ...value, [tab]: e.target.value })} />
      ) : (
        <input className={cls} value={value[tab] || ""} onChange={(e) => onChange({ ...value, [tab]: e.target.value })} />
      )}
    </div>
  );
}

export default function ContentEditPage() {
  const { key } = useParams<{ key: string }>();
  const router = useRouter();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/content/${key}`).then((r) => r.json()).then((d) => setDoc(d.doc)).catch(() => {});
  }, [key]);

  const isMultiline = (name: string) => /message|about|text|body|desc|intro|paragraph|statement|subtitle|tagline|quote|trustLine/i.test(name);

  const setField = (name: string, v: L10n) => setDoc((p) => (p ? { ...p, fields: { ...p.fields, [name]: v } } : p));
  const setItemField = (idx: number, name: string, v: L10n) =>
    setDoc((p) => {
      if (!p) return p;
      const items = [...p.items];
      items[idx] = { ...items[idx], fields: { ...items[idx].fields, [name]: v } };
      return { ...p, items };
    });
  const setItemImage = (idx: number, img: { mediaId: string | null; legacySrc?: string | null }) =>
    setDoc((p) => {
      if (!p) return p;
      const items = [...p.items];
      items[idx] = { ...items[idx], image: img };
      return { ...p, items };
    });
  const setStat = (idx: number, part: "value" | "label", v: L10n) =>
    setDoc((p) => {
      if (!p) return p;
      const stats = [...p.stats];
      stats[idx] = { ...stats[idx], [part]: v };
      return { ...p, stats };
    });

  const save = async () => {
    if (!doc) return;
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/admin/content/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: doc.fields, items: doc.items, stats: doc.stats, extra: doc.extra }),
    }).catch(() => null);
    setSaving(false);
    if (res?.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const scalarFields = useMemo(
    () => (doc ? Object.entries(doc.fields).filter(([, v]) => !Array.isArray(v)) as [string, L10n][] : []),
    [doc]
  );
  const listFields = useMemo(
    () => (doc ? Object.entries(doc.fields).filter(([, v]) => Array.isArray(v)) as [string, L10n[]][] : []),
    [doc]
  );

  if (!doc) {
    return <AdminShell><p className="text-[#A0AEC0]">Yuklanmoqda...</p></AdminShell>;
  }

  return (
    <AdminShell>
      <button onClick={() => router.push("/admin/content")} className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#A0AEC0] hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Orqaga
      </button>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-orbitron text-2xl font-bold text-white">{key}</h1>
        <div className="flex items-center gap-3">
          {saved ? <span className="text-sm text-[#00FF88]">Saqlandi ✓</span> : null}
          <button onClick={save} disabled={saving} className={adminBtn} style={adminBtnStyle}>
            <Save className="h-4 w-4" /> {saving ? "..." : "Saqlash"}
          </button>
        </div>
      </div>

      {/* Section-level fields */}
      {scalarFields.length > 0 && (
        <div className={`${adminCard} mb-6`}>
          <h2 className="mb-4 text-sm font-semibold text-[#00C2FF]">Asosiy matnlar</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {scalarFields.map(([name, v]) => (
              <div key={name}>
                <div className="mb-1 text-xs font-medium text-white">{name}</div>
                <L10nInput value={v} onChange={(nv) => setField(name, nv)} multiline={isMultiline(name)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List fields (e.g. typewriterPhrases) */}
      {listFields.map(([name, arr]) => (
        <div key={name} className={`${adminCard} mb-6`}>
          <h2 className="mb-4 text-sm font-semibold text-[#00C2FF]">{name}</h2>
          <div className="space-y-3">
            {arr.map((v, i) => (
              <L10nInput
                key={i}
                value={v}
                onChange={(nv) =>
                  setDoc((p) => {
                    if (!p) return p;
                    const list = [...(p.fields[name] as L10n[])];
                    list[i] = nv;
                    return { ...p, fields: { ...p.fields, [name]: list } };
                  })
                }
              />
            ))}
          </div>
        </div>
      ))}

      {/* Repeatable items */}
      {doc.items.length > 0 && (
        <div className="mb-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#7B61FF]">Elementlar ({doc.items.length})</h2>
          {doc.items.map((item, idx) => (
            <div key={item.id} className={adminCard}>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A0AEC0]">{item.id}</div>
              {item.image !== undefined && (
                <div className="mb-4">
                  <ImageField value={item.image} onChange={(img) => setItemImage(idx, img)} />
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(item.fields).map(([name, v]) => (
                  <div key={name}>
                    <div className="mb-1 text-xs font-medium text-white">{name}</div>
                    <L10nInput value={v} onChange={(nv) => setItemField(idx, name, nv)} multiline={isMultiline(name)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {doc.stats.length > 0 && (
        <div className={`${adminCard} mb-6`}>
          <h2 className="mb-4 text-sm font-semibold text-[#00FF88]">Statistika</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {doc.stats.map((s, i) => (
              <div key={s.id} className="rounded-lg border border-white/5 p-3">
                <div className="mb-2 text-xs text-[#A0AEC0]">{s.id}</div>
                <div className="mb-1 text-xs text-white">Qiymat</div>
                <L10nInput value={s.value} onChange={(v) => setStat(i, "value", v)} />
                <div className="mb-1 mt-3 text-xs text-white">Izoh</div>
                <L10nInput value={s.label} onChange={(v) => setStat(i, "label", v)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* techstack extra.stack */}
      {Array.isArray((doc.extra as { stack?: string[] }).stack) && (
        <div className={`${adminCard} mb-6`}>
          <h2 className="mb-4 text-sm font-semibold text-[#00C2FF]">Texnologiyalar ro'yxati</h2>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-[rgba(0,194,255,0.15)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-white outline-none focus:border-[rgba(0,194,255,0.5)]"
            value={((doc.extra as { stack: string[] }).stack).join(", ")}
            onChange={(e) => setDoc((p) => (p ? { ...p, extra: { ...p.extra, stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } } : p))}
          />
          <p className="mt-1 text-xs text-[#A0AEC0]">Vergul bilan ajrating</p>
        </div>
      )}
    </AdminShell>
  );
}
