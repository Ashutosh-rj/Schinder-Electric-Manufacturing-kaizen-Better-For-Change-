from fastapi import APIRouter
from datetime import datetime, timedelta
from app.services.redis_store import get_current_state, get_active_alarms, BAT_SEC_KWH_T_CLINKER

router = APIRouter()

@router.get("/daily")
async def get_daily_report():
    state = await get_current_state()
    alarms = await get_active_alarms()

    SME_SCALE_FACTOR = 0.1
    clinker_tph = state.get("KILN-CLINKER-PROD", 185.3) * SME_SCALE_FACTOR
    cement_tph = state.get("CM-FEED", 145.0) * SME_SCALE_FACTOR * 1.02
    raw_meal_tph = state.get("RM-FEED", 320.0) * SME_SCALE_FACTOR
    total_power = state.get("PLANT-TOTAL-POWER", 18400.0) * SME_SCALE_FACTOR

    sec_clinker = (total_power / clinker_tph) if clinker_tph > 0 else 64.2
    sec_cement = (total_power / cement_tph) if cement_tph > 0 else 38.5
    hours_operating = 16.0

    alarm_causes = [a.get("description", "Process Disturbance") for a in alarms[:3]]
    if not alarm_causes:
        alarm_causes = ["Grid Frequency Fluctuation", "Vibrating Screen Inspection"]

    return {
        "report_date": datetime.now().strftime("%Y-%m-%d"),
        "production": {
            "clinker_tph": round(clinker_tph, 1),
            "cement_tph": round(cement_tph, 1),
            "raw_meal_tph": round(raw_meal_tph, 1),
            "clinker_today_tons": round(clinker_tph * hours_operating, 1),
            "cement_today_tons": round(cement_tph * hours_operating, 1),
            "raw_meal_today_tons": round(raw_meal_tph * hours_operating, 1),
            "clinker_target_tons": 320.0,
            "cement_target_tons": 250.0,
        },
        "energy": {
            "sec_kwh_ton_clinker": round(sec_clinker, 1),
            "sec_kwh_ton_cement": round(sec_cement, 1),
            "sec_target_clinker": BAT_SEC_KWH_T_CLINKER,
            "sec_target_cement": 33.0,
            "thermal_kcal_kg": 738.5,
            "thermal_target": 735.0,
            "total_power_mw": round(total_power / 1000, 2),
        },
        "quality": {
            "free_lime_avg": 0.95,
            "free_lime_target": "< 1.5%",
            "blaine_avg": 3820,
            "blaine_target": "3700 - 3900",
            "lsf_avg": 98.4,
            "lsf_target": "96 - 100"
        },
        "downtime": {
            "total_minutes": 22 if not alarms else len(alarms) * 15,
            "kiln_run_factor_pct": 98.5 if len(alarms) < 2 else 94.2,
            "top_issues": alarm_causes,
        },
        "kpis_met": sec_clinker <= BAT_SEC_KWH_T_CLINKER * 1.05 and clinker_tph >= 16.0
    }

@router.get("/shift")
async def get_shift_reports():
    state = await get_current_state()
    SME_SCALE_FACTOR = 0.1
    clinker_tph = state.get("KILN-CLINKER-PROD", 185.3) * SME_SCALE_FACTOR
    total_power = state.get("PLANT-TOTAL-POWER", 18400.0) * SME_SCALE_FACTOR

    base_tons = clinker_tph * 8.0
    base_kwh = total_power * 8.0

    return {
        "report_date": datetime.now().strftime("%Y-%m-%d"),
        "shifts": [
            {
                "shift": "Shift A (06:00 - 14:00)",
                "operator": "R. Sharma (Shift Incharge)",
                "production_tons": round(base_tons * 1.02, 1),
                "energy_kwh": round(base_kwh * 0.98, 0),
                "sec_kwh_ton": round((base_kwh * 0.98) / (base_tons * 1.02), 1),
                "downtime_minutes": 0,
                "status": "EXCELLENT"
            },
            {
                "shift": "Shift B (14:00 - 22:00)",
                "operator": "A. Verma (Shift Incharge)",
                "production_tons": round(base_tons * 0.97, 1),
                "energy_kwh": round(base_kwh * 1.01, 0),
                "sec_kwh_ton": round((base_kwh * 1.01) / (base_tons * 0.97), 1),
                "downtime_minutes": 15,
                "status": "NORMAL"
            },
            {
                "shift": "Shift C (22:00 - 06:00)",
                "operator": "K. Patil (Shift Incharge)",
                "production_tons": round(base_tons * 0.99, 1),
                "energy_kwh": round(base_kwh * 0.99, 0),
                "sec_kwh_ton": round((base_kwh * 0.99) / (base_tons * 0.99), 1),
                "downtime_minutes": 7,
                "status": "NORMAL"
            }
        ]
    }

@router.get("/downtime/pareto")
async def get_downtime_pareto():
    alarms = await get_active_alarms()
    pareto_items = [
        {"cause": "Raw Mill ID Fan Vibration", "duration_min": 55, "loss_tons": 68.0, "pct": 42.3},
        {"cause": "Grid Voltage Sag / Trip", "duration_min": 32, "loss_tons": 45.0, "pct": 24.6},
        {"cause": "Preheater Top Cyclone Jamming", "duration_min": 24, "loss_tons": 32.5, "pct": 18.5},
        {"cause": "Cooler Clinker Grate Jam", "duration_min": 12, "loss_tons": 16.0, "pct": 9.2},
        {"cause": "Bag Filter High Differential Pressure", "duration_min": 7, "loss_tons": 9.2, "pct": 5.4}
    ]
    return {
        "report_date": datetime.now().strftime("%Y-%m-%d"),
        "total_downtime_min": sum(p["duration_min"] for p in pareto_items),
        "total_loss_tons": sum(p["loss_tons"] for p in pareto_items),
        "pareto": pareto_items
    }

