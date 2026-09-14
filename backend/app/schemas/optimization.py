from pydantic import BaseModel
from typing import Dict, List, Any

class OptimizationRequest(BaseModel):
    target: str
    constraints: Dict[str, Any]
    objective: str

class RecommendationParam(BaseModel):
    parameter: str
    current: float
    recommended: float
    unit: str

class OptimizationResponse(BaseModel):
    id: int
    status: str
    objective_value: float
    iterations: int
    recommendations: List[RecommendationParam]
    expected_savings: Dict[str, float]
