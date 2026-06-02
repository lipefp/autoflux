from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.part import Part
from app.models.store import Store
from app.models.user import User
from app.schemas.part import PartCreate, PartUpdate, PartOut
from app.core.dependencies import get_current_user, require_role

router = APIRouter(prefix="/parts", tags=["parts"])


@router.get("", response_model=List[PartOut])
def search_parts(
    q: Optional[str] = None,
    store_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    limit: int = 30,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    query = (
        db.query(Part)
        .join(Part.store)
        .filter(Part.is_active == True, Store.is_approved == True, Store.is_active == True)
    )
    if q:
        query = query.filter(
            Part.name.ilike(f"%{q}%") | Part.code.ilike(f"%{q}%") | Part.brand.ilike(f"%{q}%")
        )
    if store_id:
        query = query.filter(Part.store_id == store_id)
    if min_price is not None:
        query = query.filter(Part.price >= min_price)
    if max_price is not None:
        query = query.filter(Part.price <= max_price)
    return query.offset(offset).limit(limit).all()


@router.get("/mine", response_model=List[PartOut])
def get_my_parts(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("lojista")),
):
    store = db.query(Store).filter(Store.owner_id == current_user.id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")
    return db.query(Part).filter(Part.store_id == store.id).all()


@router.post("", response_model=PartOut, status_code=status.HTTP_201_CREATED)
def create_part(
    data: PartCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("lojista")),
):
    store = db.query(Store).filter(Store.owner_id == current_user.id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Crie uma loja primeiro")
    part = Part(store_id=store.id, **data.model_dump())
    db.add(part)
    db.commit()
    db.refresh(part)
    return part


@router.get("/{part_id}", response_model=PartOut)
def get_part(part_id: int, db: Session = Depends(get_db)):
    part = db.query(Part).filter(Part.id == part_id, Part.is_active == True).first()
    if not part:
        raise HTTPException(status_code=404, detail="Peça não encontrada")
    return part


@router.put("/{part_id}", response_model=PartOut)
def update_part(
    part_id: int,
    data: PartUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("lojista")),
):
    store = db.query(Store).filter(Store.owner_id == current_user.id).first()
    part = db.query(Part).filter(Part.id == part_id, Part.store_id == store.id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Peça não encontrada")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(part, field, value)
    db.commit()
    db.refresh(part)
    return part


@router.delete("/{part_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_part(
    part_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("lojista")),
):
    store = db.query(Store).filter(Store.owner_id == current_user.id).first()
    part = db.query(Part).filter(Part.id == part_id, Part.store_id == store.id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Peça não encontrada")
    part.is_active = False
    db.commit()
