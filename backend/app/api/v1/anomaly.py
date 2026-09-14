from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

def get_base_response():
    return {
        "timestamp": datetime.now().isoformat(),
        "data_source": "SIMULATOR",
        "disclaimer": "[SIMULATED DATA]"
    }

@router.get("/active")
async def get_active_anomalies():
    base = get_base_response()
    base.update({
        "active_anomalies": [
            {"id": 1, "department": "RAW_MILL", "sensor_tag": "KAIZEN.RM1.VIB", "type": "STATISTICAL", "severity": "HIGH"}
        ]
    })
    return base

@router.get("/history")
async def get_anomaly_history():
    base = get_base_response()
    base.update({
        "history_7d": [
            {"id": 2, "date": "2023-09-30", "department": "KILN", "type": "ENVELOPE", "severity": "MEDIUM"}
        ]
    })
    return base

@router.get("/sensor")
async def get_sensor_health():
    base = get_base_response()
    base.update({
        "sensor_health": [
            {"sensor_tag": "KAIZEN.KILN1.O2", "status": "FROZEN", "frozen_duration_minutes": 45}
        ]
    })
    return base
