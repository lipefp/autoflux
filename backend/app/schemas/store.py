from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class StoreCreate(BaseModel):
    name: str
    cnpj: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    delivery_radius_km: float = 10.0
    open_hours: Optional[str] = None


class StoreUpdate(StoreCreate):
    name: Optional[str] = None


class StoreOut(BaseModel):
    id: int
    name: str
    cnpj: Optional[str]
    description: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    lat: Optional[float]
    lng: Optional[float]
    delivery_radius_km: float
    open_hours: Optional[str]
    is_approved: bool
    is_active: bool
    avg_rating: float
    total_reviews: int
    created_at: datetime

    model_config = {"from_attributes": True}


class StoreStats(BaseModel):
    total_orders: int
    pending_orders: int
    revenue_today: float
    total_parts: int
