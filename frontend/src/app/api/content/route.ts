import { NextResponse } from "next/server";
import { contentCol, settingsCol } from "@/lib/db/collections";
import type { ContentDoc } from "@/lib/types/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [content, settings] = await Promise.all([contentCol(), settingsCol()]);
    const [docs, site] = await Promise.all([
      content.find({}).sort({ order: 1 }).toArray(),
      settings.findOne({ _id: "global" }),
    ]);

    const sections = docs.filter((d) => d.type === "section" && d.enabled);
    const singletons: Record<string, ContentDoc> = {};
    for (const d of docs) if (d.type === "singleton") singletons[d.key] = d;

    return NextResponse.json({ sections, singletons, settings: site });
  } catch (err) {
    console.error("[content] failed:", err);
    return NextResponse.json({ error: "Content unavailable" }, { status: 503 });
  }
}
