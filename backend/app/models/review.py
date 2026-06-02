from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, unique=True)
    rating = Column(Float, nullable=False)  # 1.0 - 5.0
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    client = relationship("User", back_populates="reviews")
    store = relationship("Store", back_populates="reviews")
    order = relationship("Order", back_populates="review")
