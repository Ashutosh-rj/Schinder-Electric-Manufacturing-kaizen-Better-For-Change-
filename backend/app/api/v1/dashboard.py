"""
Dashboard Overview API — Returns live plant KPIs from Redis.
Falls back to representative demo values if Redis data isn't available yet.
"""
from fastapi import APIRouter
from datetime import datetime

from app.services.redis_store import (
    get_current_state,
    get_active_alarms,
    get_recent_anomalies,
    get_kaizen_opportunities,
    BAT_SEC_KWH_T_CLINKER,
)

router = APIRouter()


@router.get("/overview")
async def get_dashboard_overview():
    # Fetch live data from Redis
    state = await get_current_state()
    alarms = await get_active_alarms()
    anomalies = await get_recent_anomalies()
    kaizen_opps = await get_kaizen_opportunities()

    # ── Production ────────────────────────────────────────────────────────
    clinker_tph = state.get("KILN-CLINKER-PROD", 185.3)
    cement_tph = state.get("CM-FEED", 145.0) * 1.02  # approximate

    # ── Energy ────────────────────────────────────────────────────────────
    total_power_kw = state.get("PLANT-TOTAL-POWER", 18400.0)
    total_power_mw = total_power_kw / 1000.0
    whrs_kw = state.get("WHRS-GENERATION", 4200.0)
    cpp_kw = state.get("CPP-POWER", 8500.0)
    grid_kw = state.get("PLANT-GRID-IMPORT", 5700.0)
    fuel_rate = state.get("KILN-FUEL", 12.3)

    sec = (total_power_kw / clinker_tph) if clinker_tph > 0 else 64.2
    sec_deviation = ((sec - BAT_SEC_KWH_T_CLINKER) / BAT_SEC_KWH_T_CLINKER) * 100

    # Energy cost (INR)
    from app.config import settings
    energy_cost_today = grid_kw * 24 * settings.ENERGY_COST_PER_KWH

    # ── Emissions ─────────────────────────────────────────────────────────
    co2_fuel = fuel_rate * 24 * settings.CO2_EMISSION_FACTOR_COAL  # kg/day
    co2_elec = grid_kw * 24 * settings.CO2_EMISSION_FACTOR_GRID / 1000  # tons/day
    co2_intensity = (co2_fuel / 1000 + co2_elec) / (clinker_tph * 24) * 1000 if clinker_tph > 0 else 820.0

    # ── Equipment health ──────────────────────────────────────────────────
    cm_vib = state.get("CM-VIBRATION", 1.5)
    rm_vib = state.get("RM-VIBRATION", 2.0)
    # Simple proxy health: degrade as vibration rises
    cm_health = max(0, 100 - (cm_vib / 7.0) * 60)
    rm_health = max(0, 100 - (rm_vib / 7.0) * 60)
    overall_health = (cm_health + rm_health + 95) / 3  # kiln assumed 95

    critical_count = sum(1 for a in alarms if a.get("priority") in ("HIGH", "CRITICAL"))
    at_risk_count = sum(1 for a in alarms if a.get("priority") == "MEDIUM")

    # ── Alarm stats ───────────────────────────────────────────────────────
    alarm_critical = sum(1 for a in alarms if a.get("category") == "CRITICAL")
    alarm_high = sum(1 for a in alarms if a.get("priority") == "HIGH")
    alarm_medium = sum(1 for a in alarms if a.get("priority") == "MEDIUM")
    alarm_low = sum(1 for a in alarms if a.get("priority") == "LOW")

    # ── Kaizen ────────────────────────────────────────────────────────────
    total_saving = sum(o.get("saving_inr_day", 0) for o in kaizen_opps)
    top_opp = kaizen_opps[0] if kaizen_opps else {
        "id": "KAI-000", "title": "Analysing opportunities...",
        "saving_kwh_day": 0, "priority": "LOW"
    }

    # ── Plant status ──────────────────────────────────────────────────────
    plant_status = "NORMAL"
    if alarm_critical > 0:
        plant_status = "CRITICAL"
    elif alarm_high > 0 or sec > BAT_SEC_KWH_T_CLINKER * 1.05:
        plant_status = "ATTENTION"

    # Kaizen Score (0-100)
    kaizen_score = max(0, 100 - sec_deviation * 3 - len(alarms) * 1.5 - (100 - overall_health) * 0.3)

    return {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "data_source": "LIVE" if state else "DEMO",
        "plant_status": plant_status,
        "kaizen_score": round(kaizen_score, 1),
        "production": {
            "clinker_tph": round(clinker_tph, 1),
            "cement_tph": round(cement_tph, 1),
            "today_clinker_tons": round(clinker_tph * 16, 0),
            "today_cement_tons": round(cement_tph * 16, 0),
            "target_tph": 200.0,
            "efficiency_pct": round(min(100, (clinker_tph / 200.0) * 100), 1),
        },
        "energy": {
            "total_power_mw": round(total_power_mw, 2),
            "sec_kwh_ton_clinker": round(sec, 1),
            "sec_kwh_ton_cement": round(sec * 0.6, 1),
            "target_sec": BAT_SEC_KWH_T_CLINKER,
            "whrs_generation_mw": round(whrs_kw / 1000, 2),
            "cpp_generation_mw": round(cpp_kw / 1000, 2),
            "grid_import_mw": round(grid_kw / 1000, 2),
            "fuel_rate_tph": round(fuel_rate, 1),
            "energy_cost_today": round(energy_cost_today, 0),
        },
        "emissions": {
            "co2_intensity_kg_ton": round(co2_intensity, 1),
            "co2_avoided_today": round(whrs_kw * 24 * settings.CO2_EMISSION_FACTOR_GRID / 1e6, 1),
            "target_co2_intensity": 800.0,
        },
        "equipment_health": {
            "overall_health": round(overall_health, 1),
            "critical_equipment_count": critical_count,
            "at_risk_equipment_count": at_risk_count,
        },
        "alarms": {
            "critical": alarm_critical,
            "high": alarm_high,
            "medium": alarm_medium,
            "low": alarm_low,
            "total_active": len(alarms),
        },
        "anomalies": {
            "total_recent": len(anomalies),
            "recent": anomalies[:3],
        },
        "kaizen": {
            "open_opportunities": len(kaizen_opps),
            "total_potential_saving_today": round(total_saving, 0),
            "top_opportunity": {
                "opp_id": top_opp.get("id", ""),
                "title": top_opp.get("title", ""),
                "saving_kwh_day": top_opp.get("saving_kwh_day", 0),
                "priority": top_opp.get("priority", "LOW"),
            },
        },
        "departments": [
            {
                "code": "KILN",
                "name": "Pyroprocessing",
                "status": "ATTENTION" if state.get("KILN-BZT", 1420) < 1380 else "NORMAL",
                "production_tph": round(clinker_tph, 1),
                "power_kw": round(state.get("KILN-POWER", 3200), 0),
                "health": 93.5,
                "active_alarms": sum(1 for a in alarms if a.get("department_code") == "PYROPROCESS"),
                "efficiency_pct": round(min(100, (clinker_tph / 200) * 100), 1),
            },
            {
                "code": "RAW_MILL",
                "name": "Raw Mill",
                "status": "ATTENTION" if rm_vib > 5.0 else "NORMAL",
                "production_tph": round(state.get("RM-FEED", 285.0), 1),
                "power_kw": round(state.get("RM-POWER", 3200), 0),
                "health": round(rm_health, 1),
                "active_alarms": sum(1 for a in alarms if a.get("department_code") == "RAW_MILL"),
                "efficiency_pct": 91.0,
            },
            {
                "code": "CEMENT_MILL",
                "name": "Cement Mill",
                "status": "ATTENTION" if cm_vib > 5.0 else "NORMAL",
                "production_tph": round(state.get("CM-FEED", 145.0), 1),
                "power_kw": round(state.get("CM-POWER", 5200), 0),
                "health": round(cm_health, 1),
                "active_alarms": sum(1 for a in alarms if a.get("department_code") == "CEMENT_MILL"),
                "efficiency_pct": 92.0,
            },
        ],
        "disclaimer": "[SIMULATED DATA] Advisory recommendations only. Existing safety systems remain in full authority.",
    }
