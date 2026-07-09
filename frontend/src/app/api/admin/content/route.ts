import { NextResponse } from "next/server";
import { contentCol } from "@/lib/db/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const col = await contentCol();
    const docs = await col.find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
    return NextResponse.json({ docs });
  } catch (err) {
    console.error("[admin/content] failed:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
