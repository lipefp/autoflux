from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
import json
from app.database import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.models.part import Part
from app.models.store import Store
from app.models.user import User
from app.schemas.order import OrderCreate, OrderOut, OrderStatusUpdate
from app.core.dependencies import get_current_user, require_role
from app.core.security import decode_token

router = APIRouter(prefix="/orders", tags=["orders"])

# order_id -> list of connected websockets
_connections: dict[int, list[WebSocket]] = {}


@router.get("", response_model=List[OrderOut])
def get_client_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("cliente")),
):
    return (
        db.query(Order)
        .filter(Order.client_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get("/store", response_model=List[OrderOut])
def get_store_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("lojista")),
):
    store = db.query(Store).filter(Store.owner_id == current_user.id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")
    return (
        db.query(Order)
        .filter(Order.store_id == store.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("cliente")),
):
    store = db.query(Store).filter(Store.id == data.store_id, Store.is_approved == True).first()
    if not store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")

    total = 0.0
    items_data = []
    for item in data.items:
        part = db.query(Part).filter(
            Part.id == item.part_id, Part.store_id == store.id, Part.is_active == True
        ).first()
        if not part:
            raise HTTPException(status_code=404, detail=f"Peça {item.part_id} não encontrada")
        if part.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Estoque insuficiente para {part.name}")
        part.stock -= item.quantity
        total += part.price * item.quantity
        items_data.append(OrderItem(part_id=part.id, quantity=item.quantity, unit_price=part.price))

    order = Order(
        client_id=current_user.id,
        store_id=store.id,
        delivery_type=data.delivery_type,
        address=data.address,
        notes=data.notes,
        total=total,
    )
    db.add(order)
    db.flush()
    for item in items_data:
        item.order_id = order.id
        db.add(item)
    db.commit()
    db.refresh(order)
    return order


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    if current_user.role == "cliente" and order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    return order


@router.patch("/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("lojista")),
):
    store = db.query(Store).filter(Store.owner_id == current_user.id).first()
    order = db.query(Order).filter(Order.id == order_id, Order.store_id == store.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    order.status = data.status
    db.commit()
    db.refresh(order)
    await _broadcast(order_id, data.status)
    return order


async def _broadcast(order_id: int, new_status: str):
    for ws in _connections.get(order_id, []):
        try:
            await ws.send_text(json.dumps({"order_id": order_id, "status": new_status}))
        except Exception:
            pass


@router.websocket("/ws/{order_id}")
async def order_ws(websocket: WebSocket, order_id: int):
    token = websocket.query_params.get("token")
    if not token or not decode_token(token):
        await websocket.close(code=1008)
        return
    await websocket.accept()
    _connections.setdefault(order_id, []).append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        _connections[order_id].remove(websocket)
