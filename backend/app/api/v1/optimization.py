from fastapi import APIRouter
from app.schemas.optimization import OptimizationRequest, OptimizationResponse

router = APIRouter()

@router.post("/run", response_model=OptimizationResponse)
async def run_optimization(req: OptimizationRequest):
    return {
        "id": 1,
        "status": "converged",
        "objective_value": 27.8,
        "iterations": 45,
        "recommendations": [
            {"parameter": "kiln_speed_rpm", "current": 3.2, "recommended": 3.35, "unit": "rpm"},
            {"parameter": "id_fan_speed_pct", "current": 82.0, "recommended": 79.5, "unit": "%"}
        ],
        "expected_savings": {
            "energy_kwh_day": 1250.0,
            "cost_day": 9375.0,
            "co2_tday": 1.025
        }
    }
