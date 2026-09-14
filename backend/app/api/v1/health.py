from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

def get_base_response():
    return {
        "timestamp": datetime.now().isoformat(),
        "data_source": "SIMULATOR",
        "disclaimer": "[SIMULATED DATA] Equipment health predictions are advisory."
    }

@router.get("/summary")
async def get_health_summary():
    base = get_base_response()
    base.update({
        "fleet_health": [
            {"equipment_id": 1, "code": "KILN1_MAIN", "name": "Kiln main drive", "health_score": 88, "status": "NORMAL"},
            {"equipment_id": 2, "code": "RM1_SEP", "name": "Raw mill separator", "health_score": 82, "status": "NORMAL"},
            {"equipment_id": 3, "code": "CM1_FAN", "name": "Cement mill 1 fan", "health_score": 71, "status": "DEGRADING"},
            {"equipment_id": 4, "code": "COOLER1_FAN", "name": "Cooler fan CF-1003", "health_score": 65, "status": "HIGH_RISK"}
        ]
    })
    return base

@router.get("/equipment/{id}")
async def get_equipment_health(id: int):
    base = get_base_response()
    base.update({
        "equipment_id": id,
        "health_score": 65,
        "status": "HIGH_RISK",
        "components": {
            "vibration": {"score": 60, "weight": 0.3},
            "thermal": {"score": 45, "weight": 0.25, "issue": "Bearing temp rising"},
            "electrical": {"score": 85, "weight": 0.25},
            "lubrication": {"score": 75, "weight": 0.2}
        },
        "recommendation": "Schedule bearing inspection within 48 hours."
    })
    return base

@router.get("/predictions")
async def get_predictions():
    base = get_base_response()
    base.update({
        "predictions": [
            {"equipment_code": "COOLER1_FAN", "predicted_failure_days": 12, "confidence_pct": 85, "failure_mode": "Bearing failure"}
        ]
    })
    return base

@router.get("/critical")
async def get_critical_equipment():
    base = get_base_response()
    base.update({
        "critical_equipment": [
            {"equipment_id": 4, "code": "COOLER1_FAN", "name": "Cooler fan CF-1003", "health_score": 65, "status": "HIGH_RISK"}
        ]
    })
    return base
