from fastapi import APIRouter
from app.schemas.dashboard import DashboardResponse
from datetime import datetime

router = APIRouter()

@router.get("/overview", response_model=DashboardResponse)
async def get_dashboard_overview():
    return {
        "timestamp": datetime.utcnow(),
        "plant_status": "NORMAL",
        "kaizen_score": 87.4,
        "production": {
            "clinker_tph": 285.3,
            "cement_tph": 312.5,
            "today_clinker_tons": 4823.0,
            "today_cement_tons": 5210.0,
            "target_tph": 300.0,
            "efficiency_pct": 95.1
        },
        "energy": {
            "total_power_mw": 18.4,
            "sec_kwh_ton_clinker": 64.2,
            "sec_kwh_ton_cement": 38.5,
            "target_sec": 62.0,
            "whrs_generation_mw": 4.2,
            "cpp_generation_mw": 8.5,
            "grid_import_mw": 5.7,
            "fuel_rate_tph": 12.3,
            "energy_cost_today": 145230.0
        },
        "emissions": {
            "co2_intensity_kg_ton": 820.5,
            "co2_avoided_today": 12.3,
            "target_co2_intensity": 800.0
        },
        "equipment_health": {
            "overall_health": 91.2,
            "critical_equipment_count": 2,
            "at_risk_equipment_count": 5
        },
        "alarms": {
            "critical": 0,
            "high": 2,
            "medium": 7,
            "low": 12,
            "total_active": 21
        },
        "kaizen": {
            "open_opportunities": 14,
            "total_potential_saving_today": 48500.0,
            "top_opportunity": {
                "opp_id": "KAI-001",
                "title": "Cement Mill 2 Fan Optimization",
                "saving_kwh_day": 185.0,
                "priority": "HIGH"
            }
        },
        "departments": [
            {
                "code": "KILN",
                "name": "Pyroprocessing",
                "status": "NORMAL",
                "production_tph": 285.3,
                "power_kw": 3200.0,
                "health": 93.5,
                "active_alarms": 1,
                "efficiency_pct": 94.2
            }
        ]
    }
