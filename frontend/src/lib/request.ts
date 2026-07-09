import type { NextRequest } from "next/server";
import type { DeviceKind, Project } from "@/lib/types/content";

export function getIp(req: NextRequest): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}

export function parseDevice(ua: string | null): DeviceKind {
  if (!ua) return "unknown";
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk|kindle/.test(s)) return "tablet";
  if (/mobi|iphone|ipod|windows phone|blackberry|opera mini/.test(s)) return "mobile";
  if (/android/.test(s)) return /mobile/.test(s) ? "mobile" : "tablet";
  if (/mozilla|chrome|safari|firefox|edg|opr/.test(s)) return "desktop";
  return "unknown";
}

export function normalizeProject(value: unknown): Project {
  return value === "mudarris" ? "mudarris" : "fazo";
}
