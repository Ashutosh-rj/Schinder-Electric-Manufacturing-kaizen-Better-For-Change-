from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/daily")
async def get_daily_report():
    return {
        "report_date": datetime.now().strftime("%Y-%m-%d"),
        "production": {"clinker_tph": 285.3, "cement_tph": 312.5, "raw_meal_tph": 400.0},
        "energy": {"sec_kwh_ton_clinker": 64.2, "thermal_kcal_kg": 740.0},
        "quality": {"free_lime_avg": 1.1, "blaine_avg": 3820},
        "downtime": {"total_minutes": 120, "top_issues": ["Grid Failure"]},
        "kpis_met": True
    }

@router.get("/shift")
async def get_shift_reports():
    return {
        "shifts": [
            {"shift": "A", "production_tons": 1500, "energy_kwh": 45000, "downtime_minutes": 0},
            {"shift": "B", "production_tons": 1450, "energy_kwh": 44500, "downtime_minutes": 30},
            {"shift": "C", "production_tons": 1480, "energy_kwh": 44800, "downtime_minutes": 15}
        ]
    }

@router.get("/downtime/pareto")
async def get_downtime_pareto():
    return {
        "pareto": [
            {"cause": "Raw Mill Trip", "duration_min": 120, "loss_tons": 500},
            {"cause": "Grid Failure", "duration_min": 45, "loss_tons": 150}
        ]
    }
