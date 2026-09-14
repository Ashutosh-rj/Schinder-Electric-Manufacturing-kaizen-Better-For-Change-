from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class AcknowledgeRequest(BaseModel):
    acknowledged_by: str
    notes: str = ""

@router.post("/{id}/acknowledge")
async def acknowledge_alarm(id: int, req: AcknowledgeRequest):
    return {"status": "ACKNOWLEDGED", "id": id}

@router.get("")
async def get_alarms():
    return {
        "active_alarms": [
            {
                "id": 1,
                "alarm_tag": "KAIZEN.RAWMILL1.VRM501.MILL.DP_HH",
                "description": "Raw Mill 1 - Mill Differential Pressure Very High",
                "priority": "HIGH",
                "category": "PROCESS",
                "value": 820.5,
                "limit_value": 800.0,
                "state": "ACTIVE",
                "raised_at": datetime.now().isoformat(),
                "department_code": "RAW_MILL",
                "why_occurred": "Mill DP has exceeded High-High limit, indicating potential mill choking or high circulating load.",
                "possible_causes": ["Excessive feed rate", "Moisture in feed", "Low separator speed", "Fan capacity limitation"],
                "consequence": "Risk of mill trip, production loss, possible damage to bag filter.",
                "operator_checks": ["1. Verify feed rate and reduce if >target", "2. Check mill outlet temperature", "3. Check separator speed", "4. Check fan operating point"],
                "has_occurred_before": True,
                "occurrence_count_7d": 3
            }
        ],
        "alarm_analysis": {
            "chattering": [],
            "standing": [],
            "nuisance": [],
            "flood_active": False
        },
        "statistics": {
            "total_active": 1,
            "critical": 0,
            "high": 1,
            "medium": 0
        }
    }
