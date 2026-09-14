from pydantic import BaseModel
from typing import Dict, Any

class SimulationRequest(BaseModel):
    name: str
    parameters: Dict[str, float]

class SimulationResponse(BaseModel):
    id: int
    baseline: Dict[str, float]
    simulated: Dict[str, float]
    delta: Dict[str, float]
    quality_risk: str
    equipment_risk: str
    confidence: float
    disclaimer: str
