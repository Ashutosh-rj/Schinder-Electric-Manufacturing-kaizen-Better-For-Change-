from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from app.inference.predictor import get_anomaly

router = APIRouter()

class Reading(BaseModel):
    tag: str
    value: float

class AnomalyRequest(BaseModel):
    equipment_id: int
    readings: List[Reading]

@router.post("/predict/anomaly")
async def predict_anomaly(request: AnomalyRequest):
    return get_anomaly(request.equipment_id, [r.model_dump() for r in request.readings])
