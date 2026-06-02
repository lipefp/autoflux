from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class PartCreate(BaseModel):
    name: str
    code: Optional[str] = None
    description: Optional[str] = None
    brand: Optional[str] = None
    compatibility: List[Any] = []
    price: float
    stock: int = 0
    images: List[str] = []


class PartUpdate(PartCreate):
    name: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None


class StoreBasic(BaseModel):
    id: int
    name: str
    city: Optional[str]
    avg_rating: float

    model_config = {"from_attributes": True}


class PartOut(BaseModel):
    id: int
    store_id: int
    name: str
    code: Optional[str]
    description: Optional[str]
    brand: Optional[str]
    compatibility: List[Any]
    price: float
    stock: int
    images: List[str]
    is_active: bool
    created_at: datetime
    store: StoreBasic

    model_config = {"from_attributes": True}
