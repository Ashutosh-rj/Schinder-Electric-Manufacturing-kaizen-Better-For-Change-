from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

def get_base_response():
    return {
        "timestamp": datetime.now().isoformat(),
        "data_source": "SIMULATOR",
        "disclaimer": "[SIMULATED DATA]"
    }

@router.get("/daily")
async def get_daily_production():
    base = get_base_response()
    base.update({
        "summary": {
            "clinker_tons": 4500,
            "cement_tons": 5200,
            "availability_pct": 98.5
        }
    })
    return base

@router.get("/shift")
async def get_shift_production():
    base = get_base_response()
    base.update({
        "current_shift": {"name": "A", "clinker_tons": 1500},
        "last_3_shifts": [
            {"name": "C", "date": "yesterday", "clinker_tons": 1450},
            {"name": "B", "date": "yesterday", "clinker_tons": 1480},
            {"name": "A", "date": "yesterday", "clinker_tons": 1520}
        ]
    })
    return base

@router.get("/oee")
async def get_oee():
    base = get_base_response()
    base.update({
        "oee": 82.5,
        "availability": 95.0,
        "performance": 90.0,
        "quality": 96.5
    })
    return base

@router.get("/downtime")
async def get_downtime_pareto():
    base = get_base_response()
    base.update({
        "pareto": [
            {"cause": "Raw Mill Trip", "duration_min": 120, "loss_tons": 500},
            {"cause": "Grid Failure", "duration_min": 45, "loss_tons": 150}
        ]
    })
    return base

@router.get("/report/daily")
async def get_daily_report():
    base = get_base_response()
    base.update({
        "report": {
            "date": "2023-10-02",
            "production": {"clinker": 4500, "cement": 5200},
            "energy": {"sec_clinker": 72.5, "thermal": 745.0}
        }
    })
    return base
