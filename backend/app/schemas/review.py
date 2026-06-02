from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    order_id: int
    rating: float = Field(..., ge=1.0, le=5.0)
    comment: Optional[str] = None


class ReviewOut(BaseModel):
    id: int
    client_id: int
    store_id: int
    order_id: int
    rating: float
    comment: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}
