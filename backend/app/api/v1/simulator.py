from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class SimulatorRequest(BaseModel):
    scenario: str

@router.post("/scenario")
async def set_simulator_scenario(req: SimulatorRequest):
    return {"status": "ok", "scenario": req.scenario}
