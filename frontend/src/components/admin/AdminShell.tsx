"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Inbox, BarChart3, Settings, LogOut, ExternalLink } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Boshqaruv", icon: LayoutDashboard },
  { href: "/admin/content", label: "Kontent", icon: FileText },
  { href: "/admin/leads", label: "Arizalar", icon: Inbox },
  { href: "/admin/analytics", label: "Statistika", icon: BarChart3 },
  { href: "/admin/settings", label: "Sozlamalar", icon: Settings },
];

const CRUMB: Record<string, string> = {
  "/admin": "Boshqaruv", "/admin/content": "Kontent", "/admin/leads": "Arizalar",
  "/admin/analytics": "Statistika", "/admin/settings": "Sozlamalar",
};

export function AdminShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState("admin");

  useEffect(() => {
    fetch("/api/admin/me").then((r) => (r.ok ? r.json() : null)).then((d) => d?.user?.sub && setUser(d.user.sub)).catch(() => {});
  }, []);

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const crumb = title ?? (pathname.startsWith("/admin/content/") ? "Kontent" : CRUMB[pathname]) ?? "";

  return (
    <div className="a-shell">
      <aside className="a-sidebar">
        <div className="a-brand">
          <div className="a-brand-logo">
            <svg viewBox="0 0 64 64" width="30" height="30" aria-hidden>
              <defs>
                <linearGradient id="a-bg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00C2FF" /><stop offset="100%" stopColor="#0050FF" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="28" fill="none" stroke="url(#a-bg)" strokeWidth="2" />
              <path d="M20 22h24M20 32h18M20 42h14" stroke="url(#a-bg)" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="a-brand-name">FAZO</div>
            <div className="a-brand-sub">admin console</div>
          </div>
        </div>

        <nav className="a-nav">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={`a-nav-item${active ? " active" : ""}`}>
                <Icon width={18} height={18} strokeWidth={1.9} />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="a-foot">
          <div className="a-userchip">
            <div className="a-avatar">{user.slice(0, 1).toUpperCase()}</div>
            <div style={{ minWidth: 0 }}>
              <div className="a-username">{user}</div>
              <div className="a-userrole">superadmin</div>
            </div>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="a-iconbtn" title="Saytni ochish">
            <ExternalLink width={16} height={16} strokeWidth={1.9} />
          </a>
          <button onClick={logout} className="a-iconbtn" title="Chiqish">
            <LogOut width={16} height={16} strokeWidth={1.9} />
          </button>
        </div>
      </aside>

      <main className="a-main">
        <header className="a-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="a-crumb">FAZO</span>
            <span className="a-crumb">/</span>
            <span className="a-crumb-active">{crumb}</span>
          </div>
        </header>
        <div className="a-content">{children}</div>
      </main>
    </div>
  );
}

// Compatibility helpers mapped to the cosmic admin.css classes.
export const adminInput = "a-input";
export const adminCard = "a-card a-panel";
export const adminBtn = "a-btn primary";
export const adminBtnStyle = {} as const;
