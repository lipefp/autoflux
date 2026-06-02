from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.database import get_db
from app.models.store import Store
from app.models.user import User, UserRole
from app.models.order import Order, OrderStatus
from app.models.part import Part
from app.schemas.store import StoreOut
from app.core.dependencies import require_role

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stores/pending", response_model=List[StoreOut])
def get_pending_stores(
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    return db.query(Store).filter(Store.is_approved == False, Store.is_active == True).all()


@router.patch("/stores/{store_id}/approve")
def approve_store(
    store_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")
    store.is_approved = True
    db.commit()
    return {"message": "Loja aprovada com sucesso"}


@router.patch("/stores/{store_id}/reject")
def reject_store(
    store_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")
    store.is_active = False
    db.commit()
    return {"message": "Loja rejeitada"}


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    delivered_today = db.query(Order).filter(
        Order.status == OrderStatus.delivered,
        Order.created_at >= today_start,
    ).all()
    return {
        "total_clients": db.query(User).filter(User.role == UserRole.cliente).count(),
        "total_stores": db.query(Store).filter(Store.is_approved == True).count(),
        "pending_stores": db.query(Store).filter(Store.is_approved == False, Store.is_active == True).count(),
        "orders_today": db.query(Order).filter(Order.created_at >= today_start).count(),
        "revenue_today": sum(o.total for o in delivered_today),
        "total_parts": db.query(Part).filter(Part.is_active == True).count(),
    }
