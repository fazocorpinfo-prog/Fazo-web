from pathlib import Path

from fastapi import APIRouter, Depends, Form, HTTPException, Query, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.deps import get_optional_user
from app.models.contact import Contact, ContactStatus
from app.models.user import User
from app.security import create_access_token, verify_password
from app.services.analytics import dashboard_payload

BASE = Path(__file__).parent
templates = Jinja2Templates(directory=str(BASE / "templates"))

router = APIRouter(prefix="/admin", tags=["admin-ui"], include_in_schema=False)


def _require_user_redirect(user: User | None) -> RedirectResponse | None:
    if not user:
        return RedirectResponse(url="/admin/login", status_code=status.HTTP_303_SEE_OTHER)
    return None


@router.get("/", response_class=HTMLResponse)
def root_redirect():
    return RedirectResponse(url="/admin/dashboard", status_code=302)


@router.get("/login", response_class=HTMLResponse)
def login_page(request: Request, user: User | None = Depends(get_optional_user)):
    if user:
        return RedirectResponse(url="/admin/dashboard", status_code=302)
    return templates.TemplateResponse(
        request,
        "login.html",
        {"app_name": settings.app_name, "error": None},
    )


@router.post("/login", response_class=HTMLResponse)
def login_submit(
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.username == username).one_or_none()
    if not user or not verify_password(password, user.hashed_password) or not user.is_active:
        return templates.TemplateResponse(
            request,
            "login.html",
            {
                "app_name": settings.app_name,
                "error": "Login yoki parol noto'g'ri",
            },
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    token = create_access_token(user.username)
    response = RedirectResponse(url="/admin/dashboard", status_code=status.HTTP_303_SEE_OTHER)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )
    return response


@router.post("/logout")
def logout():
    response = RedirectResponse(url="/admin/login", status_code=status.HTTP_303_SEE_OTHER)
    response.delete_cookie("access_token", path="/")
    return response


@router.get("/dashboard", response_class=HTMLResponse)
def dashboard(
    request: Request,
    days: int = Query(30, ge=1, le=365),
    user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    redirect = _require_user_redirect(user)
    if redirect:
        return redirect

    data = dashboard_payload(db, days)
    return templates.TemplateResponse(
        request,
        "dashboard.html",
        {
            "app_name": settings.app_name,
            "user": user,
            "active": "dashboard",
            "days": days,
            "data": data,
        },
    )


@router.get("/contacts", response_class=HTMLResponse)
def contacts_page(
    request: Request,
    q: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    redirect = _require_user_redirect(user)
    if redirect:
        return redirect

    stmt = select(Contact)
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(
            (Contact.name.ilike(like))
            | (Contact.phone.ilike(like))
            | (Contact.service.ilike(like))
            | (Contact.message.ilike(like))
        )
    if status_filter:
        try:
            stmt = stmt.where(Contact.status == ContactStatus(status_filter))
        except ValueError:
            pass
    stmt = stmt.order_by(Contact.created_at.desc()).limit(200)
    contacts = db.execute(stmt).scalars().all()

    return templates.TemplateResponse(
        request,
        "contacts.html",
        {
            "app_name": settings.app_name,
            "user": user,
            "active": "contacts",
            "contacts": contacts,
            "q": q or "",
            "status_filter": status_filter or "",
            "statuses": [s.value for s in ContactStatus],
        },
    )


@router.get("/contacts/{contact_id}", response_class=HTMLResponse)
def contact_detail(
    contact_id: int,
    request: Request,
    user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    redirect = _require_user_redirect(user)
    if redirect:
        return redirect

    contact = db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return templates.TemplateResponse(
        request,
        "contact_detail.html",
        {
            "app_name": settings.app_name,
            "user": user,
            "active": "contacts",
            "contact": contact,
            "statuses": [s.value for s in ContactStatus],
        },
    )


@router.post("/contacts/{contact_id}")
def contact_update(
    contact_id: int,
    status_value: str = Form(..., alias="status"),
    notes: str = Form(""),
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    redirect = _require_user_redirect(user)
    if redirect:
        return redirect

    contact = db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    try:
        contact.status = ContactStatus(status_value)
    except ValueError:
        pass
    contact.notes = notes or None
    db.commit()
    return RedirectResponse(url=f"/admin/contacts/{contact_id}", status_code=303)


@router.post("/contacts/{contact_id}/delete")
def contact_delete(
    contact_id: int,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    redirect = _require_user_redirect(user)
    if redirect:
        return redirect

    contact = db.get(Contact, contact_id)
    if contact:
        db.delete(contact)
        db.commit()
    return RedirectResponse(url="/admin/contacts", status_code=303)


@router.get("/analytics", response_class=HTMLResponse)
def analytics_page(
    request: Request,
    days: int = Query(30, ge=1, le=365),
    user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    redirect = _require_user_redirect(user)
    if redirect:
        return redirect

    data = dashboard_payload(db, days)
    return templates.TemplateResponse(
        request,
        "analytics.html",
        {
            "app_name": settings.app_name,
            "user": user,
            "active": "analytics",
            "days": days,
            "data": data,
        },
    )


@router.get("/settings", response_class=HTMLResponse)
def settings_page(
    request: Request,
    user: User | None = Depends(get_optional_user),
):
    redirect = _require_user_redirect(user)
    if redirect:
        return redirect
    return templates.TemplateResponse(
        request,
        "settings.html",
        {
            "app_name": settings.app_name,
            "user": user,
            "active": "settings",
            "message": None,
            "error": None,
        },
    )


@router.post("/settings/password", response_class=HTMLResponse)
def change_password_submit(
    request: Request,
    current_password: str = Form(...),
    new_password: str = Form(...),
    confirm_password: str = Form(...),
    user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    redirect = _require_user_redirect(user)
    if redirect:
        return redirect

    from app.security import hash_password

    error = None
    message = None
    if new_password != confirm_password:
        error = "Yangi parol va tasdiqlash mos kelmadi"
    elif len(new_password) < 8:
        error = "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak"
    elif not verify_password(current_password, user.hashed_password):
        error = "Joriy parol noto'g'ri"
    else:
        user.hashed_password = hash_password(new_password)
        db.commit()
        message = "Parol muvaffaqiyatli yangilandi"

    return templates.TemplateResponse(
        request,
        "settings.html",
        {
            "app_name": settings.app_name,
            "user": user,
            "active": "settings",
            "message": message,
            "error": error,
        },
    )
