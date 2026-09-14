from fastapi import APIRouter
from datetime import datetime, timedelta
import random

router = APIRouter()

def get_base_response():
    return {
        "timestamp": datetime.now().isoformat(),
        "data_source": "SIMULATOR",
        "disclaimer": "[SIMULATED DATA] Advisory recommendations only. Existing safety systems remain in full authority."
    }

@router.get("/rawmill/{id}")
async def get_rawmill(id: int):
    base = get_base_response()
    base.update({
        "production": {"feed_tph": 285.3, "target_tph": 300.0, "status": "LOW"},
        "efficiency": {"specific_energy_kwh_t": 18.2, "target_kwh_t": 17.5},
        "operating_parameters": {
            "mill_dp_mmwc": 820.5,
            "outlet_temp_c": 82.0,
            "vibration_mms": 4.2
        },
        "detected_conditions": ["HIGH_DP", "CHOKING_RISK"],
        "recommendations": [
            {"action": "Reduce feed by 10 TPH temporarily", "reason": "Mill DP is high indicating choking risk", "priority": "HIGH", "advisory": True}
        ],
        "rca_hints": ["Check feed moisture", "Verify separator speed"]
    })
    return base

@router.get("/kiln")
async def get_kiln():
    base = get_base_response()
    base.update({
        "production": {"feed_tph": 285.3, "clinker_tph": 191.4, "target_tph": 200.0},
        "thermal": {"heat_consumption_kcal_kg": 745.2, "target_kcal_kg": 730.0, "fuel_rate_tph": 12.3},
        "burning_zone": {"temp_c": 1420.5, "target_c": 1450.0, "status": "LOW_SIDE"},
        "gas_analysis": {"o2_pct": 2.8, "co_ppm": 180, "nox_mg_nm3": 850},
        "kiln_mechanical": {"speed_rpm": 3.2, "torque_pct": 78.5, "shell_max_temp_c": 285.0},
        "preheater": {"stage5_exit_temp_c": 858.0, "cyclone_eff_pct": 92.5},
        "cooler": {"secondary_air_temp_c": 1050.0, "exhaust_temp_c": 285.0, "eff_pct": 72.3},
        "detected_conditions": ["BURNING_ZONE_SLIGHTLY_LOW", "CO_ELEVATED"],
        "recommendations": [
            {"action": "Increase primary air by 5%", "reason": "CO elevation indicates incomplete combustion", "priority": "MEDIUM", "advisory": True}
        ],
        "rca_hints": ["Monitor calciner O2 trend", "Check coal quality variation"]
    })
    return base

@router.get("/cooler")
async def get_cooler():
    base = get_base_response()
    base.update({
        "efficiency": {"eff_pct": 72.3, "target_pct": 75.0},
        "temperatures": {"secondary_air_temp_c": 1050.0, "tertiary_air_temp_c": 890.0},
        "mechanical": {"grate_speed_spm": 12.5, "under_grate_pressure_mmwc": 450},
        "detected_conditions": ["NORMAL"],
        "recommendations": []
    })
    return base

@router.get("/cementmill/{id}")
async def get_cementmill(id: int):
    base = get_base_response()
    base.update({
        "production": {"feed_tph": 145.2, "target_tph": 150.0},
        "efficiency": {"specific_energy_kwh_t": 32.5, "target_kwh_t": 30.0},
        "quality": {"predicted_blaine_cm2g": 3850, "target_blaine_cm2g": 3800},
        "detected_conditions": ["HIGH_SPECIFIC_ENERGY"],
        "recommendations": [
            {"action": "Optimize separator speed", "reason": "Specific energy is above target for current Blaine", "priority": "MEDIUM", "advisory": True}
        ]
    })
    return base

@router.get("/preheater")
async def get_preheater():
    base = get_base_response()
    base.update({
        "temperatures": {"top_stage_exit_c": 320, "bottom_stage_exit_c": 858},
        "pressures": {"top_stage_dp_mmwc": 450, "bottom_stage_dp_mmwc": 120},
        "detected_conditions": ["NORMAL"],
        "recommendations": []
    })
    return base
