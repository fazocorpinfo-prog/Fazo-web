from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, Request, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models.contact import Contact, ContactStatus
from app.models.user import User
from app.schemas.contact import ContactCreate, ContactOut, ContactUpdate
from app.utils.telegram import send_contact_to_telegram

router = APIRouter(prefix="/api/contacts", tags=["contacts"])


def _client_ip(req: Request) -> str | None:
    fwd = req.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return req.client.host if req.client else None


@router.post("", response_model=ContactOut, status_code=status.HTTP_201_CREATED)
async def create_contact(
    payload: ContactCreate,
    request: Request,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
):
    contact = Contact(
        name=payload.name.strip(),
        phone=payload.phone.strip(),
        service=payload.service.strip(),
        message=(payload.message or "").strip() or None,
        source=payload.source,
        ip_address=_client_ip(request),
        user_agent=request.headers.get("user-agent"),
        status=ContactStatus.new,
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)

    background.add_task(
        send_contact_to_telegram,
        contact.name,
        contact.phone,
        contact.service,
        contact.message,
        contact.source,
    )
    return contact


@router.get("", response_model=List[ContactOut])
def list_contacts(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
    q: Optional[str] = None,
    status_filter: Optional[ContactStatus] = Query(default=None, alias="status"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    stmt = select(Contact)
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(
            or_(
                Contact.name.ilike(like),
                Contact.phone.ilike(like),
                Contact.service.ilike(like),
                Contact.message.ilike(like),
            )
        )
    if status_filter:
        stmt = stmt.where(Contact.status == status_filter)
    stmt = stmt.order_by(Contact.created_at.desc()).limit(limit).offset(offset)
    return db.execute(stmt).scalars().all()


@router.get("/{contact_id}", response_model=ContactOut)
def get_contact(
    contact_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)
):
    contact = db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@router.patch("/{contact_id}", response_model=ContactOut)
def update_contact(
    contact_id: int,
    payload: ContactUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    contact = db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    if payload.status is not None:
        contact.status = payload.status
    if payload.notes is not None:
        contact.notes = payload.notes
    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    contact_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)
):
    contact = db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
