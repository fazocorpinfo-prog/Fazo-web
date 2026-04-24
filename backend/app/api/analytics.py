import json

from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models.analytics import AnalyticsEvent, PageView
from app.models.user import User
from app.schemas.analytics import DashboardData, EventCreate, PageViewCreate
from app.services.analytics import dashboard_payload, parse_device

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


def _client_ip(req: Request) -> str | None:
    fwd = req.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return req.client.host if req.client else None


@router.post("/pageview", status_code=status.HTTP_202_ACCEPTED)
def track_pageview(payload: PageViewCreate, request: Request, db: Session = Depends(get_db)):
    ua = request.headers.get("user-agent")
    view = PageView(
        path=payload.path,
        referrer=payload.referrer,
        locale=payload.locale,
        session_id=payload.session_id,
        country=request.headers.get("cf-ipcountry") or request.headers.get("x-country"),
        device=parse_device(ua),
        ip_address=_client_ip(request),
        user_agent=ua,
    )
    db.add(view)
    db.commit()
    return {"status": "ok"}


@router.post("/event", status_code=status.HTTP_202_ACCEPTED)
def track_event(payload: EventCreate, db: Session = Depends(get_db)):
    event = AnalyticsEvent(
        name=payload.name,
        path=payload.path,
        session_id=payload.session_id,
        props=json.dumps(payload.props) if payload.props else None,
    )
    db.add(event)
    db.commit()
    return {"status": "ok"}


@router.get("/dashboard", response_model=DashboardData)
def get_dashboard(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return dashboard_payload(db, days)
