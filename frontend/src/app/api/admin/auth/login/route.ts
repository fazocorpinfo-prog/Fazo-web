import { NextRequest, NextResponse } from "next/server";
import { adminsCol } from "@/lib/db/collections";
import { verifyPassword, signSessionToken, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const username = body.username?.trim();
  const password = body.password;
  if (!username || !password) {
    return NextResponse.json({ error: "Login va parol kerak" }, { status: 400 });
  }

  try {
    const admins = await adminsCol();
    const admin = await admins.findOne({ username });
    if (!admin || !admin.isActive || !(await verifyPassword(password, admin.passwordHash))) {
      return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 });
    }
    await admins.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } });

    const token = await signSessionToken({ sub: admin.username, role: admin.role });
    const res = NextResponse.json({ ok: true, user: { username: admin.username, role: admin.role } });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    console.error("[admin/login] failed:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
