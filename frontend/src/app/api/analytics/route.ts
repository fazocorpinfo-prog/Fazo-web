import { NextRequest, NextResponse } from "next/server";
import { analyticsCol } from "@/lib/db/collections";
import { getIp, parseDevice, normalizeProject } from "@/lib/request";
import { preflight, withCors } from "@/lib/cors";
import type { AnalyticsEvent } from "@/lib/types/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnalyticsPayload = {
  type?: string;
  project?: string;
  path?: string;
  referrer?: string;
  locale?: string;
  sessionId?: string;
  name?: string;
  props?: Record<string, unknown>;
};

export function OPTIONS(req: NextRequest) {
  return preflight(req);
}

export async function POST(req: NextRequest) {
  return withCors(req, await handle(req));
}

async function handle(req: NextRequest): Promise<NextResponse> {
  // Body may be application/json (same-origin) or text/plain (cross-origin beacon).
  let body: AnalyticsPayload;
  try {
    const raw = await req.text();
    body = raw ? (JSON.parse(raw) as AnalyticsPayload) : {};
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const path = (body.path || "").slice(0, 512);
  if (!path) return NextResponse.json({ error: "Missing path" }, { status: 400 });

  const type: AnalyticsEvent["type"] = body.type === "event" ? "event" : "pageview";
  const ua = req.headers.get("user-agent");

  const event: AnalyticsEvent = {
    type,
    project: normalizeProject(body.project),
    path,
    referrer: body.referrer ? String(body.referrer).slice(0, 512) : null,
    locale: body.locale ? String(body.locale).slice(0, 5) : null,
    sessionId: body.sessionId ? String(body.sessionId).slice(0, 64) : null,
    device: parseDevice(ua),
    country: req.headers.get("x-country") || req.headers.get("x-nf-geo-country") || null,
    name: type === "event" && body.name ? String(body.name).slice(0, 64) : null,
    props: type === "event" && body.props && typeof body.props === "object" ? body.props : null,
    ip: getIp(req),
    userAgent: ua,
    createdAt: new Date(),
  };

  try {
    await (await analyticsCol()).insertOne(event);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[analytics] failed:", err);
    // Analytics must never break the page — respond ok even on failure.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
