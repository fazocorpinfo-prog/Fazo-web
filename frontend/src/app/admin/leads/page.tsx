"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminShell, adminCard } from "@/components/admin/AdminShell";

type Lead = {
  _id: string; project: string; name: string; phone: string; service: string;
  message: string | null; status: string; notes: string | null; source: string;
  locale: string; createdAt: string; telegramDelivered: boolean;
};

const STATUSES = ["new", "in_review", "contacted", "closed", "spam"] as const;
const STATUS_LABEL: Record<string, string> = {
  new: "Yangi", in_review: "Ko'rilmoqda", contacted: "Bog'lanildi", closed: "Yopildi", spam: "Spam",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [project, setProject] = useState("");
  const [status, setStatus] = useState("");
  const [active, setActive] = useState<Lead | null>(null);

  const load = useCallback(() => {
    const p = new URLSearchParams();
    if (project) p.set("project", project);
    if (status) p.set("status", status);
    fetch(`/api/admin/leads?${p}`).then((r) => r.json()).then((d) => setLeads(d.leads || [])).catch(() => {});
  }, [project, status]);

  useEffect(() => { load(); }, [load]);

  const update = async (id: string, patch: { status?: string; notes?: string }) => {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).catch(() => {});
    load();
    if (active?._id === id) setActive((a) => (a ? { ...a, ...patch } : a));
  };

  const sel = "rounded-lg border border-[rgba(0,194,255,0.15)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-sm text-white outline-none";

  return (
    <AdminShell>
      <h1 className="mb-1 font-orbitron text-2xl font-bold text-white">Arizalar</h1>
      <p className="mb-6 text-sm text-[#A0AEC0]">Saytdan kelgan barcha arizalar</p>

      <div className="mb-4 flex flex-wrap gap-3">
        <select className={sel} value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="">Barcha loyihalar</option>
          <option value="fazo">FAZO</option>
          <option value="mudarris">Mudarris</option>
        </select>
        <select className={sel} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Barcha holatlar</option>
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <span className="self-center text-sm text-[#A0AEC0]">{leads.length} ta</span>
      </div>

      <div className={`${adminCard} !p-0`}>
        {leads.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#A0AEC0]">Ariza yo'q</p>
        ) : (
          <div className="divide-y divide-white/5">
            {leads.map((l) => (
              <button
                key={l._id}
                onClick={() => setActive(l)}
                className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left hover:bg-white/5"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">{l.name}</div>
                  <div className="text-xs text-[#A0AEC0]">{l.phone} · {l.service} · {new Date(l.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs">
                  <span className={l.project === "mudarris" ? "text-[#7B61FF]" : "text-[#00C2FF]"}>{l.project}</span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[#A0AEC0]">{STATUS_LABEL[l.status] ?? l.status}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setActive(null)}>
          <div className={`${adminCard} w-full max-w-lg`} onClick={(e) => e.stopPropagation()} style={{ background: "#140a3a" }}>
            <h3 className="mb-4 font-orbitron text-lg font-bold text-white">{active.name}</h3>
            <div className="space-y-2 text-sm">
              <Row k="Telefon" v={active.phone} />
              <Row k="Xizmat" v={active.service} />
              <Row k="Loyiha" v={active.project} />
              <Row k="Manba" v={`${active.source} (${active.locale})`} />
              <Row k="Telegram" v={active.telegramDelivered ? "yuborildi ✓" : "yo'q"} />
              {active.message ? <Row k="Xabar" v={active.message} /> : null}
            </div>
            <div className="mt-4">
              <div className="mb-1.5 text-xs text-[#A0AEC0]">Holat</div>
              <select className={`${sel} w-full`} value={active.status} onChange={(e) => update(active._id, { status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </div>
            <div className="mt-3">
              <div className="mb-1.5 text-xs text-[#A0AEC0]">Izoh</div>
              <textarea
                rows={3}
                defaultValue={active.notes || ""}
                onBlur={(e) => update(active._id, { notes: e.target.value })}
                className="w-full rounded-lg border border-[rgba(0,194,255,0.15)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-white outline-none focus:border-[rgba(0,194,255,0.5)]"
              />
            </div>
            <button onClick={() => setActive(null)} className="mt-4 w-full rounded-lg border border-white/10 py-2 text-sm text-[#A0AEC0] hover:bg-white/5">
              Yopish
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-24 shrink-0 text-[#A0AEC0]">{k}:</span>
      <span className="text-white">{v}</span>
    </div>
  );
}
