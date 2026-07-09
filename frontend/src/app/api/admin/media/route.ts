import { NextRequest, NextResponse } from "next/server";
import { mediaBucket } from "@/lib/db/gridfs";
import { getSession } from "@/lib/auth";
import { normalizeProject } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (session?.role === "viewer") {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fayl yo'q" }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Faqat rasm (png/jpg/webp/svg/gif)" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Fayl 8MB dan katta" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const project = normalizeProject(form.get("project"));
    const bucket = await mediaBucket();

    const id = await new Promise<string>((resolve, reject) => {
      const up = bucket.openUploadStream(file.name || "upload", {
        metadata: { contentType: file.type, project, uploadedBy: session?.sub ?? "admin" },
      });
      up.on("error", reject);
      up.on("finish", () => resolve(String(up.id)));
      up.end(buf);
    });

    return NextResponse.json({ id, url: `/api/media/${id}` });
  } catch (err) {
    console.error("[admin/media] failed:", err);
    return NextResponse.json({ error: "Yuklab bo'lmadi" }, { status: 500 });
  }
}
