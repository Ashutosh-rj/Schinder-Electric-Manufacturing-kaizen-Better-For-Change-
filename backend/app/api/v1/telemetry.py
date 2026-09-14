from fastapi import APIRouter
from app.schemas.telemetry import TelemetryResponse
from datetime import datetime

router = APIRouter()

@router.get("", response_model=TelemetryResponse)
async def get_telemetry(department_code: str = None, from_time: str = None, to_time: str = None, limit: int = 100):
    return {
        "readings": [
            {
                "sensor_id": 1,
                "tag": "KILN-BZT-001",
                "name": "Burning Zone Temperature",
                "value": 1420.5,
                "unit": "°C",
                "quality": "GOOD",
                "timestamp": datetime.utcnow(),
                "equipment_code": "KILN-01",
                "department_code": "PYRO"
            }
        ]
    }
