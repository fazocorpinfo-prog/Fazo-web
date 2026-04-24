from datetime import datetime, timedelta, timezone
from typing import List

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analytics import AnalyticsEvent, PageView
from app.models.contact import Contact, ContactStatus


def _day_bounds(days: int) -> tuple[datetime, datetime]:
    end = datetime.now(timezone.utc)
    start = end - timedelta(days=days)
    return start, end


def _prev_window(days: int) -> tuple[datetime, datetime]:
    now = datetime.now(timezone.utc)
    return now - timedelta(days=days * 2), now - timedelta(days=days)


def _pct_change(current: int, previous: int) -> float:
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return round(((current - previous) / previous) * 100, 1)


def build_daily_series(db: Session, model, start: datetime, end: datetime) -> List[dict]:
    rows = db.execute(
        select(func.date(model.created_at).label("d"), func.count().label("c"))
        .where(model.created_at >= start, model.created_at <= end)
        .group_by("d")
        .order_by("d")
    ).all()
    by_date = {str(r.d): r.c for r in rows}

    series: List[dict] = []
    cursor = start.date()
    last = end.date()
    while cursor <= last:
        key = cursor.isoformat()
        series.append({"date": key, "value": int(by_date.get(key, 0))})
        cursor += timedelta(days=1)
    return series


def overview_stats(db: Session, days: int = 30) -> dict:
    start, end = _day_bounds(days)
    prev_start, prev_end = _prev_window(days)

    total_views = db.scalar(
        select(func.count(PageView.id)).where(PageView.created_at >= start, PageView.created_at <= end)
    ) or 0
    prev_views = db.scalar(
        select(func.count(PageView.id)).where(PageView.created_at >= prev_start, PageView.created_at <= prev_end)
    ) or 0

    unique_sessions = db.scalar(
        select(func.count(func.distinct(PageView.session_id))).where(
            PageView.created_at >= start, PageView.created_at <= end, PageView.session_id.is_not(None)
        )
    ) or 0

    total_events = db.scalar(
        select(func.count(AnalyticsEvent.id)).where(
            AnalyticsEvent.created_at >= start, AnalyticsEvent.created_at <= end
        )
    ) or 0

    total_contacts = db.scalar(
        select(func.count(Contact.id)).where(Contact.created_at >= start, Contact.created_at <= end)
    ) or 0
    prev_contacts = db.scalar(
        select(func.count(Contact.id)).where(Contact.created_at >= prev_start, Contact.created_at <= prev_end)
    ) or 0
    new_contacts = db.scalar(
        select(func.count(Contact.id)).where(Contact.status == ContactStatus.new)
    ) or 0

    conversion = round((total_contacts / total_views) * 100, 2) if total_views else 0.0

    return {
        "total_views": int(total_views),
        "unique_sessions": int(unique_sessions),
        "total_events": int(total_events),
        "total_contacts": int(total_contacts),
        "new_contacts": int(new_contacts),
        "conversion_rate": conversion,
        "views_delta_pct": _pct_change(total_views, prev_views),
        "contacts_delta_pct": _pct_change(total_contacts, prev_contacts),
    }


def top_paths(db: Session, days: int = 30, limit: int = 8) -> List[dict]:
    start, end = _day_bounds(days)
    rows = db.execute(
        select(PageView.path, func.count().label("c"))
        .where(PageView.created_at >= start, PageView.created_at <= end)
        .group_by(PageView.path)
        .order_by(func.count().desc())
        .limit(limit)
    ).all()
    return [{"path": r.path, "count": int(r.c)} for r in rows]


def top_locales(db: Session, days: int = 30, limit: int = 6) -> List[dict]:
    start, end = _day_bounds(days)
    rows = db.execute(
        select(PageView.locale, func.count().label("c"))
        .where(PageView.created_at >= start, PageView.created_at <= end, PageView.locale.is_not(None))
        .group_by(PageView.locale)
        .order_by(func.count().desc())
        .limit(limit)
    ).all()
    return [{"locale": r.locale, "count": int(r.c)} for r in rows]


def top_devices(db: Session, days: int = 30) -> List[dict]:
    start, end = _day_bounds(days)
    rows = db.execute(
        select(PageView.device, func.count().label("c"))
        .where(PageView.created_at >= start, PageView.created_at <= end, PageView.device.is_not(None))
        .group_by(PageView.device)
        .order_by(func.count().desc())
    ).all()
    return [{"device": r.device, "count": int(r.c)} for r in rows]


def recent_contacts(db: Session, limit: int = 6) -> List[dict]:
    rows = db.execute(select(Contact).order_by(Contact.created_at.desc()).limit(limit)).scalars().all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "phone": c.phone,
            "service": c.service,
            "status": c.status.value,
            "created_at": c.created_at.isoformat(),
        }
        for c in rows
    ]


def dashboard_payload(db: Session, days: int = 30) -> dict:
    start, end = _day_bounds(days)
    return {
        "overview": overview_stats(db, days),
        "views_series": build_daily_series(db, PageView, start, end),
        "contacts_series": build_daily_series(db, Contact, start, end),
        "top_paths": top_paths(db, days),
        "top_locales": top_locales(db, days),
        "top_devices": top_devices(db, days),
        "recent_contacts": recent_contacts(db),
    }


def parse_device(user_agent: str | None) -> str:
    if not user_agent:
        return "unknown"
    ua = user_agent.lower()
    if any(k in ua for k in ("iphone", "android", "ipad", "mobile")):
        if "ipad" in ua or "tablet" in ua:
            return "tablet"
        return "mobile"
    return "desktop"
