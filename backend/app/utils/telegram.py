import re
from typing import List

import httpx

from app.config import settings

_MD_ESCAPE_RE = re.compile(r"([_*`\[])")


def escape_markdown(value: str) -> str:
    return _MD_ESCAPE_RE.sub(r"\\\1", value)


def format_phone(raw: str) -> str:
    digits = re.sub(r"\D", "", raw)
    if not digits.startswith("998") or len(digits) < 12:
        return raw
    local = digits[3:12]
    return f"+998 {local[0:2]} {local[2:5]} {local[5:7]} {local[7:9]}"


async def send_contact_to_telegram(
    name: str, phone: str, service: str, message: str | None, source: str | None = None
) -> List[str]:
    token = settings.telegram_bot_token
    admin_ids = settings.telegram_admin_ids
    if not token or not admin_ids:
        return []

    safe = {
        "name": escape_markdown(name.strip()),
        "phone": escape_markdown(format_phone(phone)),
        "service": escape_markdown(service.strip()),
        "message": escape_markdown((message or "No message").strip()),
        "source": escape_markdown(source or "fazo.uz"),
    }
    text = (
        "*New Lead*\n"
        f"*Name:* {safe['name']}\n"
        f"*Phone:* {safe['phone']}\n"
        f"*Service:* {safe['service']}\n"
        f"*Source:* {safe['source']}\n"
        f"*Message:* {safe['message']}"
    )

    delivered: List[str] = []
    async with httpx.AsyncClient(timeout=10.0) as client:
        for chat_id in admin_ids:
            try:
                r = await client.post(
                    f"https://api.telegram.org/bot{token}/sendMessage",
                    json={"chat_id": chat_id, "text": text, "parse_mode": "Markdown"},
                )
                if r.status_code == 200 and r.json().get("ok"):
                    delivered.append(chat_id)
            except httpx.HTTPError:
                continue
    return delivered
