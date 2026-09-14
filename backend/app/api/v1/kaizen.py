from fastapi import APIRouter
from app.schemas.kaizen import KaizenResponse
from datetime import datetime

router = APIRouter()

@router.get("", response_model=KaizenResponse)
async def get_kaizen_opportunities():
    return {
        "opportunities": [
            {
                "id": 1,
                "opp_id": "KAI-001",
                "department_code": "CEMENT_MILL",
                "equipment_code": "CM-02",
                "title": "Cement Mill 2 Fan Optimization",
                "problem": "Fan operating at suboptimal efficiency point",
                "root_cause": "Fan speed not matched to current process load",
                "potential_energy_saving_kwh_day": 185.0,
                "potential_cost_saving_day": 1387.5,
                "potential_co2_reduction_tday": 0.152,
                "implementation_difficulty": "LOW",
                "estimated_roi_days": 1,
                "confidence": 0.91,
                "priority_score": 8.7,
                "priority": "HIGH",
                "status": "OPEN",
                "created_at": datetime.utcnow()
            },
            {
                "id": 2,
                "opp_id": "KAI-002",
                "department_code": "CRUSHER",
                "equipment_code": "CR-401",
                "title": "Limestone Crusher Feed Optimization",
                "problem": "Variable limestone quality causing raw mix instability",
                "root_cause": "Feed rate not dynamically adjusted to crusher motor load and silo level",
                "potential_energy_saving_kwh_day": 320.0,
                "potential_cost_saving_day": 2400.0,
                "potential_co2_reduction_tday": 0.26,
                "implementation_difficulty": "MEDIUM",
                "estimated_roi_days": 2,
                "confidence": 0.85,
                "priority_score": 8.2,
                "priority": "HIGH",
                "status": "OPEN",
                "created_at": datetime.utcnow()
            }
        ],
        "total": 14,
        "kaizen_score": 87.4
    }
