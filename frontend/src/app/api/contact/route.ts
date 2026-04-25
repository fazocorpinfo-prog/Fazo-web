import { NextRequest, NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  phone?: string;
  service?: string;
  message?: string;
  website?: string;
};

const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload;
    const { name, phone, service, message, website } = body;

    if (!name || !phone || !service) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const fwd = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "";

    const response = await fetch(`${BACKEND_URL}/api/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(fwd ? { "x-forwarded-for": fwd } : {}),
        "user-agent": req.headers.get("user-agent") ?? "fazo-web",
      },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        service: service.trim(),
        message: message?.trim() || null,
        source: "fazo.uz",
        website: website ?? "",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Backend rejected contact:", response.status, detail);
      return NextResponse.json(
        { error: "Backend error", debug: { backend: BACKEND_URL, status: response.status, detail } },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact proxy failed:", error);
    return NextResponse.json(
      {
        error: "Failed to submit",
        debug: {
          backend: BACKEND_URL,
          message: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : undefined,
        },
      },
      { status: 500 },
    );
  }
}
