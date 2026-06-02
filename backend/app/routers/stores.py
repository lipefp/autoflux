from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.database import get_db
from app.models.store import Store
from app.models.order import Order, OrderStatus
from app.models.part import Part
from app.models.user import User
from app.schemas.store import StoreCreate, StoreUpdate, StoreOut, StoreStats
from app.core.dependencies import get_current_user, require_role

router = APIRouter(prefix="/stores", tags=["stores"])


@router.get("", response_model=List[StoreOut])
def list_stores(
    city: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Store).filter(Store.is_approved == True, Store.is_active == True)
    if city:
        query = query.filter(Store.city.ilike(f"%{city}%"))
    return query.all()


@router.post("", response_model=StoreOut, status_code=status.HTTP_201_CREATED)
def create_store(
    data: StoreCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("lojista")),
):
    if db.query(Store).filter(Store.owner_id == current_user.id).first():
        raise HTTPException(status_code=400, detail="Você já possui uma loja cadastrada")
    store = Store(owner_id=current_user.id, **data.model_dump())
    db.add(store)
    db.commit()
    db.refresh(store)
    return store


@router.get("/me", response_model=StoreOut)
def get_my_store(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("lojista")),
):
    store = db.query(Store).filter(Store.owner_id == current_user.id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")
    return store


@router.get("/me/stats", response_model=StoreStats)
def get_my_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("lojista")),
):
    store = db.query(Store).filter(Store.owner_id == current_user.id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")

    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    total_orders = db.query(Order).filter(
        Order.store_id == store.id, Order.created_at >= today_start
    ).count()
    pending_orders = db.query(Order).filter(
        Order.store_id == store.id, Order.status == OrderStatus.pending
    ).count()
    delivered_today = db.query(Order).filter(
        Order.store_id == store.id,
        Order.status == OrderStatus.delivered,
        Order.created_at >= today_start,
    ).all()
    total_parts = db.query(Part).filter(Part.store_id == store.id, Part.is_active == True).count()

    return StoreStats(
        total_orders=total_orders,
        pending_orders=pending_orders,
        revenue_today=sum(o.total for o in delivered_today),
        total_parts=total_parts,
    )


@router.get("/{store_id}", response_model=StoreOut)
def get_store(store_id: int, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.id == store_id, Store.is_approved == True).first()
    if not store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")
    return store


@router.put("/{store_id}", response_model=StoreOut)
def update_store(
    store_id: int,
    data: StoreUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("lojista")),
):
    store = db.query(Store).filter(Store.id == store_id, Store.owner_id == current_user.id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(store, field, value)
    db.commit()
    db.refresh(store)
    return store
