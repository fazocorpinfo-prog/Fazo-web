"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";

type Stats = { pageviews: number; events: number; leads: number; conversion: number };
type Lead = { _id: string; name: string; phone: string; service: string; status: string; project: string; createdAt: string };

const STATUS_LABEL: Record<string, string> = {
  new: "Yangi", in_review: "Ko'rilmoqda", contacted: "Bog'lanildi", closed: "Yopildi", spam: "Spam",
};

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="a-card a-stat">
      <div className="a-stat-label">{label}</div>
      <div className={`a-stat-value${accent ? " accent" : ""}`}>{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [fazo, setFazo] = useState<Stats | null>(null);
  const [mud, setMud] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetch("/api/admin/analytics?project=fazo&days=30").then((r) => r.json()).then(setFazo).catch(() => {});
    fetch("/api/admin/analytics?project=mudarris&days=30").then((r) => r.json()).then(setMud).catch(() => {});
    fetch("/api/admin/leads").then((r) => r.json()).then((d) => setLeads((d.leads || []).slice(0, 8))).catch(() => {});
  }, []);

  return (
    <AdminShell>
      <div>
        <div className="a-h" style={{ fontSize: 20, marginBottom: 4 }}>Boshqaruv</div>
        <div className="a-muted" style={{ fontSize: 13 }}>So'nggi 30 kun</div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: "#00C2FF", letterSpacing: "0.06em" }}>🚀 FAZO SAYTI</div>
      <div className="a-stat-grid">
        <StatCard label="Tashriflar" value={fazo?.pageviews ?? "—"} accent />
        <StatCard label="Arizalar" value={fazo?.leads ?? "—"} />
        <StatCard label="Konversiya" value={fazo ? `${fazo.conversion}%` : "—"} />
        <StatCard label="Hodisalar" value={fazo?.events ?? "—"} />
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: "#7B61FF", letterSpacing: "0.06em", marginTop: 6 }}>🎓 MUDARRIS LANDING</div>
      <div className="a-stat-grid">
        <StatCard label="Tashriflar" value={mud?.pageviews ?? "—"} />
        <StatCard label="Arizalar" value={mud?.leads ?? "—"} />
        <StatCard label="Konversiya" value={mud ? `${mud.conversion}%` : "—"} />
        <StatCard label="Hodisalar" value={mud?.events ?? "—"} />
      </div>

      <div className="a-card a-panel" style={{ marginTop: 6 }}>
        <div className="a-panel-head">
          <div className="a-h">So'nggi arizalar</div>
          <Link href="/admin/leads" className="a-btn ghost" style={{ padding: "7px 14px", fontSize: 12 }}>Barchasi →</Link>
        </div>
        {leads.length === 0 ? (
          <p className="a-muted" style={{ textAlign: "center", padding: "24px 0", fontSize: 13 }}>Hozircha ariza yo'q</p>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead><tr><th>Ism</th><th>Telefon</th><th>Loyiha</th><th>Holat</th></tr></thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l._id}>
                    <td style={{ fontWeight: 600 }}>{l.name}</td>
                    <td className="a-muted">{l.phone} · {l.service}</td>
                    <td style={{ color: l.project === "mudarris" ? "#7B61FF" : "#00C2FF" }}>{l.project}</td>
                    <td><span className={`a-badge st-${l.status}`}>{STATUS_LABEL[l.status] ?? l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
