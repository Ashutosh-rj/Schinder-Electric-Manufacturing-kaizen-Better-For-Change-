from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict
from app.inference.predictor import get_health_score

router = APIRouter()

class HealthRequest(BaseModel):
    equipment_id: int
    features: Dict[str, float]

@router.post("/predict/health-score")
async def predict_health_score(request: HealthRequest):
    return get_health_score(request.equipment_id, request.features)
