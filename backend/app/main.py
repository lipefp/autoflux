from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, stores, parts, orders, admin
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AutoFlux API",
    description="Marketplace de autopeças — API REST",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(stores.router)
app.include_router(parts.router)
app.include_router(orders.router)
app.include_router(admin.router)


@app.get("/", tags=["health"])
def health():
    return {"status": "ok", "service": "AutoFlux API"}
