"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminShell, adminCard } from "@/components/admin/AdminShell";

type Row = { _id: string; count: number };
type Data = {
  pageviews: number; events: number; leads: number; conversion: number;
  byDay: Row[]; topPaths: Row[]; devices: Row[]; locales: Row[];
};

function Bars({ rows, title }: { rows: Row[]; title: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className={adminCard}>
      <div className="mb-3 text-sm font-semibold text-white">{title}</div>
      {rows.length === 0 ? (
        <p className="text-xs text-[#A0AEC0]">Ma'lumot yo'q</p>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r._id} className="flex items-center gap-2 text-xs">
              <span className="w-28 shrink-0 truncate text-[#A0AEC0]">{r._id || "—"}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full" style={{ width: `${(r.count / max) * 100}%`, background: "linear-gradient(90deg,#00C2FF,#0060FF)" }} />
              </div>
              <span className="w-8 shrink-0 text-right text-white">{r.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const [project, setProject] = useState("fazo");
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Data | null>(null);

  const load = useCallback(() => {
    fetch(`/api/admin/analytics?project=${project}&days=${days}`).then((r) => r.json()).then(setData).catch(() => {});
  }, [project, days]);
  useEffect(() => { load(); }, [load]);

  const sel = "rounded-lg border border-[rgba(0,194,255,0.15)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-sm text-white outline-none";

  return (
    <AdminShell>
      <h1 className="mb-1 font-orbitron text-2xl font-bold text-white">Statistika</h1>
      <p className="mb-6 text-sm text-[#A0AEC0]">Tashriflar va konversiya</p>

      <div className="mb-6 flex gap-3">
        <select className={sel} value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="fazo">FAZO sayti</option>
          <option value="mudarris">Mudarris landing</option>
        </select>
        <select className={sel} value={days} onChange={(e) => setDays(Number(e.target.value))}>
          <option value={7}>7 kun</option>
          <option value={30}>30 kun</option>
          <option value={90}>90 kun</option>
        </select>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { l: "Tashriflar", v: data?.pageviews ?? "—" },
          { l: "Arizalar", v: data?.leads ?? "—" },
          { l: "Konversiya", v: data ? `${data.conversion}%` : "—" },
          { l: "Hodisalar", v: data?.events ?? "—" },
        ].map((s) => (
          <div key={s.l} className={adminCard}>
            <div className="text-xs uppercase tracking-wider text-[#A0AEC0]">{s.l}</div>
            <div className="mt-2 font-orbitron text-3xl font-bold text-white">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Bars rows={data?.byDay ?? []} title="Kunlik tashriflar" />
        <Bars rows={data?.topPaths ?? []} title="Top sahifalar" />
        <Bars rows={data?.devices ?? []} title="Qurilmalar" />
        <Bars rows={data?.locales ?? []} title="Tillar" />
      </div>
    </AdminShell>
  );
}
