"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ?? "";

const SESSION_KEY = "fazo.session";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = `s_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
    window.sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return "";
  }
}

function guessLocale(pathname: string): string | null {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg && /^[a-z]{2}$/i.test(seg) ? seg.toLowerCase() : null;
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!API_BASE || !pathname || lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const payload = {
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      locale: guessLocale(pathname),
      session_id: getSessionId(),
    };

    const url = `${API_BASE}/api/analytics/pageview`;
    try {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      if (navigator.sendBeacon && navigator.sendBeacon(url, blob)) return;
    } catch {
      /* fallthrough to fetch */
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
  }, [pathname]);

  return null;
}
