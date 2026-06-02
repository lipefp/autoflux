from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.order import OrderStatus, DeliveryType


class OrderItemCreate(BaseModel):
    part_id: int
    quantity: int = 1


class OrderCreate(BaseModel):
    store_id: int
    delivery_type: DeliveryType
    address: Optional[str] = None
    notes: Optional[str] = None
    items: List[OrderItemCreate]


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderItemOut(BaseModel):
    id: int
    part_id: int
    quantity: int
    unit_price: float

    model_config = {"from_attributes": True}


class StoreBasic(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class ClientBasic(BaseModel):
    id: int
    name: str
    phone: Optional[str]

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: int
    client_id: int
    store_id: int
    status: OrderStatus
    delivery_type: DeliveryType
    address: Optional[str]
    total: float
    notes: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    items: List[OrderItemOut]
    store: StoreBasic
    client: ClientBasic

    model_config = {"from_attributes": True}
