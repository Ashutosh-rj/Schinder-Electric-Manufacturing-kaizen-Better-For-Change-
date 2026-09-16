"""
Simulator Control API — Allows switching between fault scenarios for demo purposes.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from app.services.redis_store import set_active_scenario, get_active_scenario

router = APIRouter()

VALID_SCENARIOS = [
    "normal",
    "fan_degradation",
    "energy_inefficiency",
    "kiln_disturbance",
    "mill_instability",
    "whrs_degradation",
    "cpp_issue",
    "sensor_failure",
]


class ScenarioRequest(BaseModel):
    scenario: str


@router.post("/scenario")
async def set_scenario(req: ScenarioRequest):
    """Switch the simulator to a different fault scenario."""
    if req.scenario not in VALID_SCENARIOS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown scenario '{req.scenario}'. Valid: {VALID_SCENARIOS}"
        )
    await set_active_scenario(req.scenario)

    # Also update the WebSocket state for immediate frontend update
    try:
        from app.websocket.telemetry_ws import update_telemetry_state, SCENARIO_STATES
        if req.scenario in SCENARIO_STATES:
            update_telemetry_state({"scenario": req.scenario, **SCENARIO_STATES[req.scenario]})
        else:
            update_telemetry_state({"scenario": req.scenario})
    except Exception:
        pass

    return {
        "status": "ok",
        "scenario": req.scenario,
        "message": f"Simulator scenario switched to '{req.scenario}'. Changes will appear in ~5 seconds.",
    }


@router.get("/scenario")
async def get_scenario():
    """Get the currently active simulator scenario."""
    scenario = await get_active_scenario()
    return {
        "current_scenario": scenario,
        "available_scenarios": VALID_SCENARIOS,
    }


@router.get("/scenarios")
async def list_scenarios() -> List[dict]:
    """List all available scenarios with descriptions."""
    return [
        {"name": "normal", "label": "Normal Operation", "description": "All systems operating within spec", "severity": "NONE"},
        {"name": "fan_degradation", "label": "Fan Bearing Degradation", "description": "CM fan vibration rising — bearing failure in 2 weeks", "severity": "HIGH"},
        {"name": "energy_inefficiency", "label": "Energy Inefficiency Event", "description": "Total plant power 12% above BAT — SEC alarm active", "severity": "MEDIUM"},
        {"name": "kiln_disturbance", "label": "Kiln Process Disturbance", "description": "BZT instability, CO elevated — fuel adjustments needed", "severity": "HIGH"},
        {"name": "mill_instability", "label": "Mill Instability", "description": "Raw mill DP oscillating — choking risk", "severity": "MEDIUM"},
        {"name": "whrs_degradation", "label": "WHRS Performance Drop", "description": "WHRS generation -25% due to boiler fouling", "severity": "MEDIUM"},
        {"name": "cpp_issue", "label": "Captive Power Issue", "description": "CPP output reduced, increased grid import", "severity": "MEDIUM"},
        {"name": "sensor_failure", "label": "Sensor Failure", "description": "Multiple sensors reporting bad quality data", "severity": "LOW"},
    ]
