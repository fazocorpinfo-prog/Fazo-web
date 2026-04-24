from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class PageViewCreate(BaseModel):
    path: str = Field(min_length=1, max_length=512)
    referrer: Optional[str] = Field(default=None, max_length=512)
    locale: Optional[str] = Field(default=None, max_length=16)
    session_id: Optional[str] = Field(default=None, max_length=64)


class EventCreate(BaseModel):
    name: str = Field(min_length=1, max_length=128)
    path: Optional[str] = Field(default=None, max_length=512)
    session_id: Optional[str] = Field(default=None, max_length=64)
    props: Optional[Dict[str, Any]] = None


class TimeSeriesPoint(BaseModel):
    date: str
    value: int


class TopPath(BaseModel):
    path: str
    count: int


class StatsOverview(BaseModel):
    total_views: int
    unique_sessions: int
    total_events: int
    total_contacts: int
    new_contacts: int
    conversion_rate: float
    views_delta_pct: float
    contacts_delta_pct: float


class DashboardData(BaseModel):
    overview: StatsOverview
    views_series: List[TimeSeriesPoint]
    contacts_series: List[TimeSeriesPoint]
    top_paths: List[TopPath]
    top_locales: List[Dict[str, Any]]
    top_devices: List[Dict[str, Any]]
    recent_contacts: List[Dict[str, Any]]
