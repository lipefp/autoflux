from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sqlite3, json

app = FastAPI(title="AutoFlux API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB = "autoflux.db"  # SQLite local

# ─── DB ────────────────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS parts (
            id         TEXT PRIMARY KEY,
            name       TEXT NOT NULL,
            store      TEXT NOT NULL,
            distance   TEXT,
            price      REAL NOT NULL,
            brand      TEXT NOT NULL,
            compatible TEXT,
            code       TEXT,
            stock      INTEGER DEFAULT 0,
            emoji      TEXT DEFAULT '🔧'
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            items      TEXT NOT NULL,
            total      REAL NOT NULL,
            delivery   INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    if conn.execute("SELECT COUNT(*) FROM parts").fetchone()[0] == 0:
        conn.executemany("INSERT INTO parts VALUES (?,?,?,?,?,?,?,?,?,?)", [
            ('1', 'Filtro de óleo Bosch',      'AutoCenter SP',    '2,3 km', 45.90,  'Honda',     'Honda Civic 2018-2023',    'BOX-3330',  12, '⚙️'),
            ('2', 'Pastilha de freio Fras-le', 'Peças Rápidas RJ', '3,1 km', 89.00,  'Toyota',    'Toyota Corolla 2019-2023', 'FRS-441',    5, '🛞'),
            ('3', 'Vela de ignição NGK',        'MotoPartes NIT',   '1,8 km', 32.00,  'VW',        'VW Gol 2015-2022',         'NGK-BKR6',  20, '🔩'),
            ('4', 'Correia dentada Gates',      'AutoCenter SP',    '2,3 km', 120.00, 'Ford',      'Ford Ka 2018-2021',        'GAT-5521',   8, '🔧'),
            ('5', 'Amortecedor Monroe',         'Peças Rápidas RJ', '3,1 km', 210.00, 'Chevrolet', 'Chevrolet Onix 2019-2023', 'MNR-032',    4, '🚗'),
            ('6', 'Filtro de ar Mann',          'MotoPartes NIT',   '1,8 km', 38.50,  'Honda',     'Honda HRV 2017-2022',      'MNN-C2840', 15, '💨'),
        ])
    conn.commit()
    conn.close()

# ─── Schemas ────────────────────────────────────────────────────────────────

class Part(BaseModel):
    id: str
    name: str
    store: str
    distance: str
    price: float
    brand: str
    compatible: str
    code: str
    stock: int
    emoji: str

class OrderItem(BaseModel):
    partId: str
    quantity: int

class OrderIn(BaseModel):
    items: List[OrderItem]
    total: float
    delivery: bool = True

class OrderOut(BaseModel):
    id: int
    total: float
    delivery: bool
    created_at: str

# ─── Rotas ──────────────────────────────────────────────────────────────────

@app.get("/parts", response_model=List[Part])
def list_parts(brand: Optional[str] = None, search: Optional[str] = None):
    conn = get_db()
    query = "SELECT * FROM parts WHERE 1=1"
    params = []
    if brand and brand != "Todas":
        query += " AND brand = ?"
        params.append(brand)
    if search:
        query += " AND (name LIKE ? OR store LIKE ?)"
        params += [f"%{search}%", f"%{search}%"]
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/parts/{part_id}", response_model=Part)
def get_part(part_id: str):
    conn = get_db()
    row = conn.execute("SELECT * FROM parts WHERE id = ?", (part_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Peça não encontrada")
    return dict(row)

@app.post("/orders", response_model=OrderOut, status_code=201)
def create_order(order: OrderIn):
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO orders (items, total, delivery) VALUES (?, ?, ?)",
        (json.dumps([i.dict() for i in order.items]), order.total, int(order.delivery))
    )
    row = conn.execute("SELECT * FROM orders WHERE id = ?", (cur.lastrowid,)).fetchone()
    conn.commit()
    conn.close()
    d = dict(row)
    d['delivery'] = bool(d['delivery'])
    return d

@app.get("/orders", response_model=List[OrderOut])
def list_orders():
    conn = get_db()
    rows = conn.execute("SELECT * FROM orders ORDER BY created_at DESC").fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d['delivery'] = bool(d['delivery'])
        result.append(d)
    return result

# ─── Startup ─────────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup():
    init_db()
