from pydantic import BaseModel
from typing import List
from datetime import datetime

class KaizenOpportunitySchema(BaseModel):
    id: int
    opp_id: str
    department_code: str
    equipment_code: str
    title: str
    problem: str
    root_cause: str
    potential_energy_saving_kwh_day: float
    potential_cost_saving_day: float
    potential_co2_reduction_tday: float
    implementation_difficulty: str
    estimated_roi_days: int
    confidence: float
    priority_score: float
    priority: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class KaizenResponse(BaseModel):
    opportunities: List[KaizenOpportunitySchema]
    total: int
    kaizen_score: float
