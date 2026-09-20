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

    # ── Scale Down factor for Mini SME Plant ──────────────────────────────
    SME_SCALE_FACTOR = 0.1

    # ── Production ────────────────────────────────────────────────────────
    clinker_tph = state.get("KILN-CLINKER-PROD", 185.3) * SME_SCALE_FACTOR
    cement_tph = state.get("CM-FEED", 145.0) * 1.02 * SME_SCALE_FACTOR

    # ── Energy ────────────────────────────────────────────────────────────
    total_power_kw = state.get("PLANT-TOTAL-POWER", 18400.0) * SME_SCALE_FACTOR
    total_power_mw = total_power_kw / 1000.0
    whrs_kw = state.get("WHRS-GENERATION", 4200.0) * SME_SCALE_FACTOR
    cpp_kw = state.get("CPP-POWER", 8500.0) * SME_SCALE_FACTOR
    grid_kw = state.get("PLANT-GRID-IMPORT", 5700.0) * SME_SCALE_FACTOR
    fuel_rate = state.get("KILN-FUEL", 12.3) * SME_SCALE_FACTOR

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
    kiln_power = state.get("KILN-POWER", 3200.0) * SME_SCALE_FACTOR
    kiln_health = max(60, 100 - abs(kiln_power - 320.0) / 5)
    overall_health = (cm_health + rm_health + kiln_health) / 3

    critical_count = sum(1 for a in alarms if a.get("priority") in ("HIGH", "CRITICAL"))
    at_risk_count = sum(1 for a in alarms if a.get("priority") == "MEDIUM")

    # ── Alarm stats ───────────────────────────────────────────────────────
    alarm_critical = sum(1 for a in alarms if a.get("category") == "CRITICAL")
    alarm_high = sum(1 for a in alarms if a.get("priority") == "HIGH")
    alarm_medium = sum(1 for a in alarms if a.get("priority") == "MEDIUM")
    alarm_low = sum(1 for a in alarms if a.get("priority") == "LOW")

    # ── Kaizen ────────────────────────────────────────────────────────────
    total_saving = sum(o.get("saving_inr_day", 0) for o in kaizen_opps) * SME_SCALE_FACTOR
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

    # ── Dynamic Departments from config ───────────────────────────────────
    import json
    import os
    departments_list = []
    config_path = os.path.join(os.path.dirname(__file__), "../../../plant_config.json")
    try:
        with open(config_path, "r") as f:
            config = json.load(f)
            
        for dept in config.get("departments", []):
            prod_val = state.get(dept["production_tag"], 0.0) * SME_SCALE_FACTOR
            power_val = state.get(dept["power_tag"], 0.0) * SME_SCALE_FACTOR
            dept_alarms = sum(1 for a in alarms if a.get("department_code", "").upper() == dept["code"])
            
            # Basic status logic
            d_status = "NORMAL"
            if dept_alarms > 2:
                d_status = "CRITICAL"
            elif dept_alarms > 0:
                d_status = "ATTENTION"
                
            departments_list.append({
                "code": dept["code"],
                "name": dept["name"],
                "status": d_status,
                "production_tph": round(prod_val, 1),
                "power_kw": round(power_val, 0),
                "health": round(overall_health, 1), # Simplified for demo
                "active_alarms": dept_alarms,
                "efficiency_pct": round(min(100, (prod_val / max(dept["max_capacity"], 1)) * 100), 1),
            })
    except Exception as e:
        departments_list = [{"name": "Error Loading Config", "status": "CRITICAL", "production_tph": 0}]

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
            "target_tph": 20.0, # scaled target
            "efficiency_pct": round(min(100, (clinker_tph / 20.0) * 100), 1),
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
                "saving_inr_day": top_opp.get("saving_inr_day", 0) * SME_SCALE_FACTOR,
                "priority": top_opp.get("priority", "LOW"),
                "status": "Active Optimization Opportunity" if top_opp.get("id") else "Operating Optimally",
            },
        },
        "kpis": [
            { "label": 'CLINKER PROD', "value": round(clinker_tph, 1), "unit": 'TPH', "trend": f"{'↑' if clinker_tph >= 18.0 else '↓'} {abs(round((clinker_tph - 18.0)/18.0*100, 1))}%", "up": clinker_tph >= 18.0, "icon": 'activity', "color": '#00e676', "data": [] },
            { "label": 'CEMENT PROD', "value": round(cement_tph, 1), "unit": 'TPH', "trend": f"{'↑' if cement_tph >= 15.0 else '↓'} {abs(round((cement_tph - 15.0)/15.0*100, 1))}%", "up": cement_tph >= 15.0, "icon": 'activity', "color": '#00d4ff', "data": [] },
            { "label": 'TOTAL POWER', "value": round(total_power_mw, 2), "unit": 'MW', "trend": f"{'↓' if total_power_mw <= 2.0 else '↑'} {abs(round((total_power_mw - 2.0)/2.0*100, 1))}%", "up": total_power_mw <= 2.0, "icon": 'zap', "color": '#ffa726', "data": [] },
            { "label": 'SPECIFIC ENERGY', "value": round(sec, 1), "unit": 'kWh/t', "trend": f"{'↓' if sec <= BAT_SEC_KWH_T_CLINKER else '↑'} {abs(round(sec_deviation, 1))}%", "up": sec <= BAT_SEC_KWH_T_CLINKER, "icon": 'zap', "color": '#3b82f6', "data": [] },
            { "label": 'WHRS GEN', "value": round(whrs_kw / 1000, 2), "unit": 'MW', "trend": f"{'↑' if whrs_kw > 0 else '↓'} {abs(round((whrs_kw - 400)/400*100, 1)) if whrs_kw > 0 else 0}%", "up": whrs_kw > 0, "icon": 'wind', "color": '#00e676', "data": [] },
        ],
        "power_sources": [
            {"label": "WHRS", "value": round(whrs_kw / 1000, 2), "color": "#00e676"},
            {"label": "GRID", "value": round(grid_kw / 1000, 2), "color": "#3b82f6"},
            {"label": "CPP", "value": round(cpp_kw / 1000, 2), "color": "#ffa726"}
        ],
        "departments": departments_list,
        "disclaimer": "[SIMULATED DATA] Advisory recommendations only. Existing safety systems remain in full authority.",
    }
