from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Part(Base):
    __tablename__ = "parts"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    name = Column(String(200), nullable=False, index=True)
    code = Column(String(100), index=True)
    description = Column(Text)
    brand = Column(String(100))
    compatibility = Column(JSON, default=list)  # [{make, model, year}]
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    images = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    store = relationship("Store", back_populates="parts")
    order_items = relationship("OrderItem", back_populates="part")
