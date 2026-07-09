/**
 * Telegram — OUTBOUND ONLY.
 *
 * This module must NEVER call setWebhook, deleteWebhook, or getUpdates.
 * The same bot token drives the Mudarris CRM via a webhook; a second
 * consumer of updates would break it. Sending messages is safe to share.
 */
import type { Lead } from "@/lib/types/content";

const TELEGRAM_API = "https://api.telegram.org";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function formatLeadMessage(lead: Pick<Lead, "name" | "phone" | "service" | "message" | "source" | "project" | "locale">): string {
  const tag = lead.project === "mudarris" ? "🎓 MUDARRIS" : "🚀 FAZO";
  const lines = [
    `<b>${tag} — yangi ariza</b>`,
    "",
    `👤 <b>Ism:</b> ${escapeHtml(lead.name)}`,
    `📞 <b>Telefon:</b> ${escapeHtml(lead.phone)}`,
    `🛠 <b>Xizmat:</b> ${escapeHtml(lead.service || "-")}`,
  ];
  if (lead.message) lines.push(`💬 <b>Xabar:</b> ${escapeHtml(lead.message)}`);
  lines.push(`🌐 <b>Manba:</b> ${escapeHtml(lead.source || "-")} (${lead.locale})`);
  return lines.join("\n");
}

/** Send a message to the configured group. Returns true on success, never throws. */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing — skipping send");
    return false;
  }
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      cache: "no-store",
    });
    if (!res.ok) console.error("[telegram] sendMessage failed:", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (err) {
    console.error("[telegram] sendMessage error:", err);
    return false;
  }
}
