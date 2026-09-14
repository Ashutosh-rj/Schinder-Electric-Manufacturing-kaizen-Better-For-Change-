from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict
from app.inference.predictor import get_failure_risk

router = APIRouter()

class FailureRiskRequest(BaseModel):
    equipment_id: int
    features: Dict[str, float]

@router.post("/predict/failure-risk")
async def predict_failure_risk(request: FailureRiskRequest):
    return get_failure_risk(request.equipment_id, request.features)
