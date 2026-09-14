from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from app.database import Base
from datetime import datetime

class Alarm(Base):
    __tablename__ = "alarms"
    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id"))
    severity = Column(String) # critical, high, medium, low
    message = Column(String)
    status = Column(String) # active, acknowledged, cleared
    created_at = Column(DateTime, default=datetime.utcnow)
    acknowledged_by = Column(String, nullable=True)
