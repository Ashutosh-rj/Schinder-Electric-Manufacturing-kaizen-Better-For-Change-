"""
Energy API — Returns live energy KPIs computed from Redis sensor state.
"""
from fastapi import APIRouter
from datetime import datetime, timedelta

from app.services.redis_store import (
    get_current_state,
    get_tag_value,
    BAT_SEC_KWH_T_CLINKER,
    BAT_SEC_KWH_T_CEMENT,
)
from app.config import settings

router = APIRouter()


@router.get("/sec")
async def get_sec():
    """Live Specific Energy Consumption."""
    state = await get_current_state()

    total_power = state.get("PLANT-TOTAL-POWER", 18400.0)
    clinker_tph = state.get("KILN-CLINKER-PROD", 185.0)
    cement_tph = state.get("CM-FEED", 145.0)

    sec_clinker = (total_power / clinker_tph) if clinker_tph > 0 else 64.2
    sec_cement = (total_power / cement_tph) if cement_tph > 0 else 38.5
    deviation = ((sec_clinker - BAT_SEC_KWH_T_CLINKER) / BAT_SEC_KWH_T_CLINKER) * 100

    # Compute per-department SEC
    kiln_power = state.get("KILN-POWER", 3200.0)
    rm_power = state.get("RM-POWER", 3500.0)
    cm_power = state.get("CM-POWER", 5200.0)
    aux_power = state.get("UTIL-AUX-POWER", 3000.0)

    by_dept = [
        {"department": "Raw Mill", "sec": round(rm_power / max(clinker_tph, 1), 1), "target": 17.0, "power_kw": round(rm_power, 0)},
        {"department": "Kiln", "sec": round(kiln_power / max(clinker_tph, 1), 1), "target": 27.0, "power_kw": round(kiln_power, 0)},
        {"department": "Cement Mill", "sec": round(cm_power / max(cement_tph, 1), 1), "target": 30.0, "power_kw": round(cm_power, 0)},
        {"department": "Auxiliaries", "sec": round(aux_power / max(clinker_tph, 1), 1), "target": 8.0, "power_kw": round(aux_power, 0)},
    ]

    # Potential saving if we hit BAT
    potential_saving_kw = max(0, (sec_clinker - BAT_SEC_KWH_T_CLINKER) * clinker_tph)

    return {
        "current_sec_kwh_ton_clinker": round(sec_clinker, 1),
        "current_sec_kwh_ton_cement": round(sec_cement, 1),
        "target_sec": BAT_SEC_KWH_T_CLINKER,
        "best_sec": 59.1,
        "benchmark_sec": 63.0,
        "deviation_pct": round(deviation, 1),
        "potential_saving_kw": round(potential_saving_kw, 1),
        "potential_saving_kwh_day": round(potential_saving_kw * 24, 0),
        "potential_saving_inr_day": round(potential_saving_kw * 24 * settings.ENERGY_COST_PER_KWH, 0),
        "trend": "increasing" if deviation > 2 else "stable" if deviation > -2 else "decreasing",
        "by_department": by_dept,
        "data_source": "LIVE" if state else "DEMO",
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


@router.get("/breakdown")
async def get_energy_breakdown():
    """Live energy breakdown by department."""
    state = await get_current_state()
    clinker_tph = state.get("KILN-CLINKER-PROD", 185.0)

    kiln_power = state.get("KILN-POWER", 3200.0)
    rm_power = state.get("RM-POWER", 3500.0)
    cm_power = state.get("CM-POWER", 5200.0)
    aux_power = state.get("UTIL-AUX-POWER", 3000.0)
    total = kiln_power + rm_power + cm_power + aux_power

    def dev(actual, target_pct):
        return round(((actual - target_pct * total) / (target_pct * total)) * 100, 1) if total > 0 else 0

    return {
        "breakdown": [
            {"department": "Raw Mill", "consumption_kw": round(rm_power, 0), "pct_of_total": round(rm_power/total*100, 1), "deviation_pct": dev(rm_power, 0.19)},
            {"department": "Kiln", "consumption_kw": round(kiln_power, 0), "pct_of_total": round(kiln_power/total*100, 1), "deviation_pct": dev(kiln_power, 0.20)},
            {"department": "Cement Mill", "consumption_kw": round(cm_power, 0), "pct_of_total": round(cm_power/total*100, 1), "deviation_pct": dev(cm_power, 0.36)},
            {"department": "Auxiliaries", "consumption_kw": round(aux_power, 0), "pct_of_total": round(aux_power/total*100, 1), "deviation_pct": dev(aux_power, 0.17)},
        ],
        "total_kw": round(total, 0),
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


@router.get("/trend")
async def get_energy_trend():
    """24h SEC trend (live point + simulated history)."""
    import random
    state = await get_current_state()
    total_power = state.get("PLANT-TOTAL-POWER", 18400.0)
    clinker_tph = state.get("KILN-CLINKER-PROD", 185.0)
    current_sec = (total_power / clinker_tph) if clinker_tph > 0 else 64.2

    base_time = datetime.now() - timedelta(hours=24)
    trend = []
    for i in range(24):
        # Build historical trend converging to current value
        noise = random.uniform(-1.5, 2.5)
        historical_sec = 62.0 + noise + (i / 24) * (current_sec - 62.0)
        trend.append({
            "time": (base_time + timedelta(hours=i)).isoformat(),
            "sec_kwh_ton": round(historical_sec, 1),
            "is_live": i == 23,
        })
    # Replace last point with real current reading
    trend[-1]["sec_kwh_ton"] = round(current_sec, 1)
    trend[-1]["is_live"] = True

    return {"trend_24h": trend, "current_sec": round(current_sec, 1)}


@router.get("/opportunities")
async def get_energy_opportunities():
    """Live energy saving opportunities from Kaizen worker."""
    from app.services.redis_store import get_kaizen_opportunities
    opps = await get_kaizen_opportunities()
    # Filter for energy-type opportunities
    energy_opps = [o for o in opps if o.get("saving_kw", 0) > 0 or "Energy" in o.get("title", "")]
    return {
        "opportunities": energy_opps or [
            {"id": "KAI-000", "description": "Calculating opportunities...", "savings_kwh_day": 0}
        ]
    }


@router.get("/whrs")
async def get_whrs_metrics():
    """Live WHRS metrics."""
    state = await get_current_state()
    gen_kw = state.get("WHRS-GENERATION", 4200.0)
    eff = state.get("WHRS-EFFICIENCY", 0.85)
    potential_kw = gen_kw / max(eff, 0.01)

    return {
        "generation_kw": round(gen_kw, 0),
        "potential_kw": round(potential_kw, 0),
        "efficiency_pct": round(eff * 100, 1),
        "boiler_status": "NORMAL" if gen_kw > 3000 else "DEGRADED",
        "savings_inr_day": round(gen_kw * 24 * settings.ENERGY_COST_PER_KWH, 0),
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
