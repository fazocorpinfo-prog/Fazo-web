import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { leadsCol } from "@/lib/db/collections";
import { getSession } from "@/lib/auth";
import type { LeadStatus } from "@/lib/types/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES: LeadStatus[] = ["new", "in_review", "contacted", "closed", "spam"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (session?.role === "viewer") {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }
    let oid: ObjectId;
    try {
      oid = new ObjectId(params.id);
    } catch {
      return NextResponse.json({ error: "Bad id" }, { status: 400 });
    }
    const body = (await req.json()) as { status?: LeadStatus; notes?: string };
    const $set: Record<string, unknown> = { updatedAt: new Date() };
    if (body.status && STATUSES.includes(body.status)) $set.status = body.status;
    if (body.notes !== undefined) $set.notes = String(body.notes);

    const col = await leadsCol();
    const r = await col.updateOne({ _id: oid }, { $set });
    if (!r.matchedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/leads/patch] failed:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
