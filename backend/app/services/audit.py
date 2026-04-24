import json
from typing import Any

from fastapi import Request
from sqlalchemy.orm import Session

from app.models.audit import AuditLog


def _client_ip(req: Request | None) -> str | None:
    if not req:
        return None
    fwd = req.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return req.client.host if req.client else None


def log_event(
    db: Session,
    action: str,
    *,
    actor_id: int | None = None,
    actor_username: str | None = None,
    target_type: str | None = None,
    target_id: Any | None = None,
    meta: dict | None = None,
    request: Request | None = None,
) -> None:
    entry = AuditLog(
        actor_id=actor_id,
        actor_username=actor_username,
        action=action,
        target_type=target_type,
        target_id=str(target_id) if target_id is not None else None,
        meta=json.dumps(meta, ensure_ascii=False, default=str) if meta else None,
        ip_address=_client_ip(request),
    )
    db.add(entry)
    db.commit()
