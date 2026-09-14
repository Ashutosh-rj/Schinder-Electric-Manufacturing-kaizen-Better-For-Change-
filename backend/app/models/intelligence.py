from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from app.database import Base
from datetime import datetime

class KaizenOpportunity(Base):
    __tablename__ = "kaizen_opportunities"
    id = Column(Integer, primary_key=True, index=True)
    opp_id = Column(String, unique=True, index=True)
    department_code = Column(String)
    equipment_code = Column(String)
    title = Column(String)
    problem = Column(String)
    root_cause = Column(String)
    potential_energy_saving_kwh_day = Column(Float)
    potential_cost_saving_day = Column(Float)
    potential_co2_reduction_tday = Column(Float)
    implementation_difficulty = Column(String)
    estimated_roi_days = Column(Integer)
    confidence = Column(Float)
    priority_score = Column(Float)
    priority = Column(String)
    status = Column(String) # OPEN, APPROVED, IMPLEMENTED
    created_at = Column(DateTime, default=datetime.utcnow)
