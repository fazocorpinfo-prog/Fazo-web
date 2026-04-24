from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.contact import ContactStatus


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    phone: str = Field(min_length=5, max_length=64)
    service: str = Field(min_length=1, max_length=200)
    message: Optional[str] = Field(default=None, max_length=4000)
    source: Optional[str] = Field(default=None, max_length=100)


class ContactUpdate(BaseModel):
    status: Optional[ContactStatus] = None
    notes: Optional[str] = Field(default=None, max_length=4000)


class ContactOut(BaseModel):
    id: int
    name: str
    phone: str
    service: str
    message: Optional[str]
    source: Optional[str]
    status: ContactStatus
    notes: Optional[str]
    ip_address: Optional[str]
    user_agent: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
