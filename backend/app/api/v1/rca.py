from fastapi import APIRouter
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

class AnalyzeRequest(BaseModel):
    area: str
    symptoms: dict

def get_base_response():
    return {
        "timestamp": datetime.now().isoformat(),
        "data_source": "SIMULATOR",
        "disclaimer": "[SIMULATED DATA] RCA results are advisory."
    }

@router.post("/analyze")
async def analyze_symptoms(req: AnalyzeRequest):
    base = get_base_response()
    # Mock response based on input
    base.update({
        "area": req.area,
        "ranked_causes": [
            {"cause": "Elevated mill DP indicating high circulating load", "probability": 0.82, "evidence": "DP trend rising for 90 min"},
            {"cause": "Moisture in feed", "probability": 0.15, "evidence": "Outlet temp dropping"}
        ]
    })
    return base

@router.get("/history")
async def get_rca_history():
    base = get_base_response()
    base.update({
        "history": [
            {"id": 1, "date": "2023-10-01", "area": "RAW_MILL", "top_cause": "Separator blockage", "status": "RESOLVED"}
        ]
    })
    return base

@router.get("/active")
async def get_active_rca():
    base = get_base_response()
    base.update({
        "active": [
            {"id": 2, "date": "2023-10-02", "area": "KILN", "top_cause": "Coal quality variation", "status": "OPEN"}
        ]
    })
    return base
