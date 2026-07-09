"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Kirishda xatolik");
        setLoading(false);
      }
    } catch {
      setError("Ulanishda xatolik");
      setLoading(false);
    }
  };

  return (
    <div className="a-login-body">
      <div className="a-login-stage">
        <div className="a-orbit o1" aria-hidden />
        <div className="a-orbit o2" aria-hidden />
        <div className="a-orbit o3" aria-hidden />

        <form onSubmit={submit} className="a-login-card">
          <div className="a-login-glow" aria-hidden />
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div className="a-brand-logo" style={{ width: 60, height: 60, margin: "0 auto 14px", borderRadius: 18 }}>
              <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden>
                <defs>
                  <linearGradient id="l-bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00C2FF" /><stop offset="100%" stopColor="#0050FF" />
                  </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="28" fill="none" stroke="url(#l-bg)" strokeWidth="2" />
                <path d="M20 22h24M20 32h18M20 42h14" stroke="url(#l-bg)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="a-login-title">FAZO</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, margin: 0 }}>Boshqaruv paneliga kirish</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="a-label" style={{ display: "block", marginBottom: 6 }}>Login</label>
              <input className="a-input" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus />
            </div>
            <div>
              <label className="a-label" style={{ display: "block", marginBottom: 6 }}>Parol</label>
              <input type="password" className="a-input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>

            {error ? <div className="a-alert err">{error}</div> : null}

            <button type="submit" disabled={loading} className="a-btn primary" style={{ marginTop: 4, padding: 14 }}>
              {loading ? "..." : "Kirish"}
            </button>
          </div>

          <div style={{ marginTop: 24, textAlign: "center", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            FAZO admin console
          </div>
        </form>
      </div>
    </div>
  );
}
