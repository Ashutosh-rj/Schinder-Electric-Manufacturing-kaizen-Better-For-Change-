from fastapi import APIRouter
from app.schemas.simulation import SimulationRequest, SimulationResponse

router = APIRouter()

@router.post("/run", response_model=SimulationResponse)
async def run_simulation(req: SimulationRequest):
    return {
        "id": 1,
        "baseline": {"production_tph": 285.0, "power_kw": 18400.0, "sec": 64.2, "co2": 820.5},
        "simulated": {"production_tph": 285.0, "power_kw": 17850.0, "sec": 62.3, "co2": 808.2},
        "delta": {"power_kw": -550.0, "sec": -1.9, "co2": -12.3, "production_tph": 0.0},
        "quality_risk": "LOW",
        "equipment_risk": "LOW",
        "confidence": 0.88,
        "disclaimer": "SIMULATED"
    }
