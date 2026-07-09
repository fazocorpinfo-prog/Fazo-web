import { NextRequest, NextResponse } from "next/server";
import { leadsCol } from "@/lib/db/collections";
import type { Filter } from "mongodb";
import type { Lead } from "@/lib/types/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const project = searchParams.get("project");
    const status = searchParams.get("status");
    const q: Filter<Lead> = {};
    if (project === "fazo" || project === "mudarris") q.project = project;
    if (status) q.status = status as Lead["status"];

    const col = await leadsCol();
    const leads = await col.find(q).sort({ createdAt: -1 }).limit(300).toArray();
    return NextResponse.json({ leads: leads.map((l) => ({ ...l, _id: String(l._id) })) });
  } catch (err) {
    console.error("[admin/leads] failed:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
