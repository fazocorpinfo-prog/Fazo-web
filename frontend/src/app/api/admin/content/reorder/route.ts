import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { contentCol } from "@/lib/db/collections";
import { getSession } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/content/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Item = { key: string; order?: number; enabled?: boolean };

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (session?.role === "viewer") {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }
    const body = (await req.json()) as { items?: Item[] };
    const items = body.items ?? [];
    const col = await contentCol();
    await Promise.all(
      items.map((it) => {
        const $set: Record<string, unknown> = { updatedAt: new Date() };
        if (it.order !== undefined) $set.order = Number(it.order);
        if (it.enabled !== undefined) $set.enabled = Boolean(it.enabled);
        return col.updateOne({ key: it.key }, { $set });
      })
    );
    revalidateTag(CONTENT_TAG);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/content/reorder] failed:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
