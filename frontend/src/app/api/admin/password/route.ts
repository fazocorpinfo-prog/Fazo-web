import { NextRequest, NextResponse } from "next/server";
import { adminsCol } from "@/lib/db/collections";
import { getSession, verifyPassword, hashPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { currentPassword, newPassword } = (await req.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Yangi parol kamida 6 belgi bo'lsin" }, { status: 400 });
    }

    const admins = await adminsCol();
    const admin = await admins.findOne({ username: session.sub });
    if (!admin || !(await verifyPassword(currentPassword, admin.passwordHash))) {
      return NextResponse.json({ error: "Joriy parol noto'g'ri" }, { status: 401 });
    }
    await admins.updateOne({ _id: admin._id }, { $set: { passwordHash: await hashPassword(newPassword) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/password] failed:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
