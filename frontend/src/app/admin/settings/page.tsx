"use client";

import { useState } from "react";
import { AdminShell, adminCard, adminInput, adminBtn, adminBtnStyle } from "@/components/admin/AdminShell";

export default function SettingsPage() {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const change = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: cur, newPassword: next }),
    }).catch(() => null);
    setBusy(false);
    const d = await res?.json().catch(() => ({}));
    if (res?.ok) {
      setMsg({ ok: true, text: "Parol yangilandi ✓" });
      setCur(""); setNext("");
    } else {
      setMsg({ ok: false, text: d?.error || "Xatolik" });
    }
  };

  return (
    <AdminShell>
      <h1 className="mb-1 font-orbitron text-2xl font-bold text-white">Sozlamalar</h1>
      <p className="mb-8 text-sm text-[#A0AEC0]">Parolni yangilash</p>

      <form onSubmit={change} className={`${adminCard} max-w-md`}>
        <label className="mb-1.5 block text-xs text-[#A0AEC0]">Joriy parol</label>
        <input type="password" className={`${adminInput} mb-4`} value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" />
        <label className="mb-1.5 block text-xs text-[#A0AEC0]">Yangi parol</label>
        <input type="password" className={`${adminInput} mb-4`} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
        {msg ? <p className={`mb-4 text-sm ${msg.ok ? "text-[#00FF88]" : "text-red-400"}`}>{msg.text}</p> : null}
        <button type="submit" disabled={busy} className={adminBtn} style={adminBtnStyle}>{busy ? "..." : "Yangilash"}</button>
      </form>
    </AdminShell>
  );
}
