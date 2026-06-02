from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    name = Column(String(200), nullable=False)
    cnpj = Column(String(18), unique=True)
    description = Column(Text)
    address = Column(String(300))
    city = Column(String(100))
    state = Column(String(2))
    zip_code = Column(String(10))
    lat = Column(Float)
    lng = Column(Float)
    delivery_radius_km = Column(Float, default=10.0)
    open_hours = Column(String(100))
    is_approved = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    avg_rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="store")
    parts = relationship("Part", back_populates="store")
    orders = relationship("Order", back_populates="store")
    reviews = relationship("Review", back_populates="store")
