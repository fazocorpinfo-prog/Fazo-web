import { NextRequest, NextResponse } from "next/server";
import { leadsCol } from "@/lib/db/collections";
import { getIp, normalizeProject } from "@/lib/request";
import { sendTelegramMessage, formatLeadMessage } from "@/lib/telegram";
import { preflight, withCors } from "@/lib/cors";
import type { Lead } from "@/lib/types/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactPayload = {
  name?: string;
  phone?: string;
  service?: string;
  message?: string;
  website?: string; // honeypot
  project?: string;
  locale?: string;
  source?: string;
};

const RATE_LIMIT = 3; // per window per ip
const RATE_WINDOW_MS = 60_000;

export function OPTIONS(req: NextRequest) {
  return preflight(req);
}

export async function POST(req: NextRequest) {
  return withCors(req, await handle(req));
}

async function handle(req: NextRequest): Promise<NextResponse> {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const phone = (body.phone ?? "").replace(/\D/g, "");
  const service = body.service?.trim() ?? "";
  const message = body.message?.trim() || null;
  const project = normalizeProject(body.project);
  const locale = (body.locale || "uz").slice(0, 5);
  const source = body.source?.trim() || (project === "mudarris" ? "mudarris" : "fazo.uz");
  const isSpam = Boolean(body.website && body.website.length > 0); // honeypot filled

  if (!name || phone.length < 9 || !service) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const ip = getIp(req);
  const userAgent = req.headers.get("user-agent");

  try {
    const leads = await leadsCol();

    // Rate limit: max RATE_LIMIT submissions per ip per window.
    if (ip) {
      const recent = await leads.countDocuments({
        ip,
        createdAt: { $gte: new Date(Date.now() - RATE_WINDOW_MS) },
      });
      if (recent >= RATE_LIMIT) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
      }
    }

    const now = new Date();
    const lead: Lead = {
      project,
      name,
      phone,
      service,
      message,
      source,
      status: isSpam ? "spam" : "new",
      notes: null,
      locale,
      ip,
      userAgent,
      telegramDelivered: false,
      createdAt: now,
      updatedAt: now,
    };

    const { insertedId } = await leads.insertOne(lead);

    // Outbound Telegram only for real (non-spam) leads.
    if (!isSpam) {
      const delivered = await sendTelegramMessage(formatLeadMessage(lead));
      if (delivered) {
        await leads.updateOne({ _id: insertedId }, { $set: { telegramDelivered: true } });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] failed:", err);
    return NextResponse.json({ error: "Xabarni yuborib bo'lmadi" }, { status: 500 });
  }
}
