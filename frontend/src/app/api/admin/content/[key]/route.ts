import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { contentCol } from "@/lib/db/collections";
import { getSession } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/content/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { key: string } }) {
  try {
    const col = await contentCol();
    const doc = await col.findOne({ key: params.key }, { projection: { _id: 0 } });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ doc });
  } catch (err) {
    console.error("[admin/content/get] failed:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { key: string } }) {
  try {
    const session = await getSession();
    if (session?.role === "viewer") {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }
    const body = await req.json();
    const $set: Record<string, unknown> = { updatedAt: new Date(), updatedBy: session?.sub ?? "admin" };
    if (body.fields !== undefined) $set.fields = body.fields;
    if (body.items !== undefined) $set.items = body.items;
    if (body.stats !== undefined) $set.stats = body.stats;
    if (body.extra !== undefined) $set.extra = body.extra;
    if (body.enabled !== undefined) $set.enabled = Boolean(body.enabled);
    if (body.order !== undefined) $set.order = Number(body.order);

    const col = await contentCol();
    const r = await col.updateOne({ key: params.key }, { $set });
    if (!r.matchedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });

    revalidateTag(CONTENT_TAG);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/content/put] failed:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
