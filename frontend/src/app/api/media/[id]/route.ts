import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { Readable } from "node:stream";
import { getDb } from "@/lib/db/mongo";
import { mediaBucket, MEDIA_BUCKET } from "@/lib/db/gridfs";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  let oid: ObjectId;
  try {
    oid = new ObjectId(params.id);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const db = await getDb();
    const file = await db
      .collection(`${MEDIA_BUCKET}.files`)
      .findOne({ _id: oid });
    if (!file) return new NextResponse("Not found", { status: 404 });

    const bucket = await mediaBucket();
    const webStream = Readable.toWeb(bucket.openDownloadStream(oid)) as ReadableStream;
    const contentType =
      (file.metadata as { contentType?: string } | undefined)?.contentType ||
      "application/octet-stream";

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(file.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("[media] failed:", err);
    return new NextResponse("Error", { status: 500 });
  }
}
