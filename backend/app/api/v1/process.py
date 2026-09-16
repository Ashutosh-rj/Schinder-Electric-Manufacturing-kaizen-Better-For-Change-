"""
Process Intelligence API — Returns live process data from Redis for each plant area.
"""
from fastapi import APIRouter
from datetime import datetime

from app.services.redis_store import get_current_state

router = APIRouter()


def _base():
    return {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "data_source": "LIVE_SIMULATOR",
        "disclaimer": "[SIMULATED DATA] Advisory recommendations only. Existing safety systems remain in full authority.",
    }


def _status(value: float, target: float, tolerance: float = 0.05) -> str:
    if value < target * (1 - tolerance):
        return "LOW"
    if value > target * (1 + tolerance):
        return "HIGH"
    return "OK"


@router.get("/rawmill/{id}")
async def get_rawmill(id: int):
    state = await get_current_state()
    base = _base()

    feed = state.get("RM-FEED", 285.0)
    power = state.get("RM-POWER", 3500.0)
    vib = state.get("RM-VIBRATION", 2.0)

    sec = power / max(feed, 1)
    conditions = []
    recs = []

    if vib > 5.0:
        conditions.append("HIGH_VIBRATION")
        recs.append({"action": "Reduce mill feed rate by 10%", "reason": "Vibration exceeds 5 mm/s", "priority": "HIGH", "advisory": True})
    if sec > 20.0:
        conditions.append("HIGH_SPECIFIC_ENERGY")
        recs.append({"action": "Check separator speed and mill air flow", "reason": f"SEC {sec:.1f} kWh/t above 20 target", "priority": "MEDIUM", "advisory": True})
    if not conditions:
        conditions.append("NORMAL")

    base.update({
        "equipment_id": id,
        "production": {"feed_tph": round(feed, 1), "target_tph": 300.0, "status": _status(feed, 300.0)},
        "efficiency": {"specific_energy_kwh_t": round(sec, 1), "target_kwh_t": 17.5},
        "operating_parameters": {
            "mill_power_kw": round(power, 0),
            "vibration_mms": round(vib, 2),
            "outlet_temp_c": state.get("RM-OUTLET-TEMP", 82.0),
        },
        "detected_conditions": conditions,
        "recommendations": recs,
        "rca_hints": ["Check feed moisture", "Verify separator speed", "Check mill wear pattern"],
    })
    return base


@router.get("/kiln")
async def get_kiln():
    state = await get_current_state()
    base = _base()

    feed = state.get("KILN-FEED", 280.0)
    clinker = state.get("KILN-CLINKER-PROD", 185.0)
    fuel = state.get("KILN-FUEL", 12.0)
    bzt = state.get("KILN-BZT", 1420.0)
    o2 = state.get("KILN-O2", 2.5)
    nox = state.get("KILN-NOX", 850.0)
    ph_temp = state.get("KILN-PH-EXIT-TEMP", 320.0)
    cooler_temp = state.get("KILN-COOLER-TEMP", 497.0)
    power = state.get("KILN-POWER", 3200.0)
    speed = state.get("KILN-SPEED", 3.2)

    # Specific heat consumption: kcal/kg (coal HV ~5500 kcal/kg)
    shc = (fuel * 5500) / max(clinker, 0.01) if clinker > 0 else 745.0

    conditions = []
    recs = []

    if bzt < 1380:
        conditions.append("BURNING_ZONE_LOW")
        recs.append({"action": "Increase fuel rate by 2-3%", "reason": f"BZT {bzt:.0f}°C below 1380°C target", "priority": "HIGH", "advisory": True})
    if bzt > 1490:
        conditions.append("BURNING_ZONE_HIGH")
        recs.append({"action": "Reduce fuel rate by 2%", "reason": f"BZT {bzt:.0f}°C above 1490°C", "priority": "HIGH", "advisory": True})
    if o2 > 3.5:
        conditions.append("HIGH_O2_EXCESS_AIR")
        recs.append({"action": "Reduce ID fan speed by 2%", "reason": f"O2 {o2:.1f}% — excess air causing heat loss", "priority": "MEDIUM", "advisory": True})
    if not conditions:
        conditions.append("NORMAL")

    base.update({
        "production": {"feed_tph": round(feed, 1), "clinker_tph": round(clinker, 1), "target_tph": 200.0},
        "thermal": {"heat_consumption_kcal_kg": round(shc, 0), "target_kcal_kg": 730.0, "fuel_rate_tph": round(fuel, 1)},
        "burning_zone": {"temp_c": round(bzt, 0), "target_c": 1450.0, "status": _status(bzt, 1430, 0.04)},
        "gas_analysis": {"o2_pct": round(o2, 1), "nox_mg_nm3": round(nox, 0)},
        "kiln_mechanical": {"speed_rpm": round(speed, 1), "power_kw": round(power, 0)},
        "preheater": {"exit_temp_c": round(ph_temp, 0)},
        "cooler": {"exhaust_temp_c": round(cooler_temp, 0)},
        "detected_conditions": conditions,
        "recommendations": recs,
        "rca_hints": ["Monitor calciner O2 trend", "Check coal quality", "Verify preheater bypass status"],
    })
    return base


@router.get("/cooler")
async def get_cooler():
    state = await get_current_state()
    base = _base()

    cooler_temp = state.get("KILN-COOLER-TEMP", 497.0)
    # Cooler efficiency: higher BZT → more heat to recover → better potential
    bzt = state.get("KILN-BZT", 1420.0)
    estimated_eff = max(60, min(80, 72.0 + (bzt - 1420) * 0.02))

    base.update({
        "efficiency": {"eff_pct": round(estimated_eff, 1), "target_pct": 75.0},
        "temperatures": {"exhaust_temp_c": round(cooler_temp, 0)},
        "detected_conditions": ["HIGH_EXHAUST_TEMP"] if cooler_temp > 580 else ["NORMAL"],
        "recommendations": [
            {"action": "Check cooler grate speed and fan pressures", "reason": "Exhaust temp elevated", "priority": "MEDIUM", "advisory": True}
        ] if cooler_temp > 580 else [],
    })
    return base


@router.get("/cementmill/{id}")
async def get_cementmill(id: int):
    state = await get_current_state()
    base = _base()

    feed = state.get("CM-FEED", 145.0)
    power = state.get("CM-POWER", 5200.0)
    vib = state.get("CM-VIBRATION", 1.5)
    fineness = state.get("CM-FINENESS", 3800.0)
    fan_speed = state.get("CM-FAN-SPEED", 100.0)

    sec = power / max(feed, 1)
    conditions = []
    recs = []

    if vib > 4.5:
        conditions.append("HIGH_VIBRATION")
        recs.append({"action": "Inspect bearing and separator", "reason": f"Vibration {vib:.1f} mm/s > 4.5 limit", "priority": "HIGH", "advisory": True})
    if sec > 35.0:
        conditions.append("HIGH_SPECIFIC_ENERGY")
        recs.append({"action": f"Reduce fan speed from {fan_speed:.0f}% to {fan_speed*0.95:.0f}%", "reason": f"SEC {sec:.1f} kWh/t above 30 kWh/t target", "priority": "MEDIUM", "advisory": True})
    if not conditions:
        conditions.append("NORMAL")

    base.update({
        "equipment_id": id,
        "production": {"feed_tph": round(feed, 1), "target_tph": 150.0},
        "efficiency": {"specific_energy_kwh_t": round(sec, 1), "target_kwh_t": 30.0},
        "quality": {"predicted_blaine_cm2g": round(fineness, 0), "target_blaine_cm2g": 3800},
        "mechanical": {"vibration_mms": round(vib, 2), "fan_speed_pct": round(fan_speed, 1), "power_kw": round(power, 0)},
        "detected_conditions": conditions,
        "recommendations": recs,
    })
    return base


@router.get("/preheater")
async def get_preheater():
    state = await get_current_state()
    base = _base()

    ph_temp = state.get("KILN-PH-EXIT-TEMP", 320.0)
    base.update({
        "temperatures": {"top_stage_exit_c": round(ph_temp, 0)},
        "detected_conditions": ["HIGH_EXIT_TEMP"] if ph_temp > 360 else ["NORMAL"],
        "recommendations": [],
    })
    return base
