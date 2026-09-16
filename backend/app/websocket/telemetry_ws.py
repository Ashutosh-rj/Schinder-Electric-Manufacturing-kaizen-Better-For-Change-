"""
WebSocket — Real-time Plant Telemetry
Streams live sensor readings to connected frontend clients every 5 seconds.
Reads from Redis (populated by Kafka consumer) for actual live values.
Falls back to scenario-based simulation if Redis is not available.
"""
import asyncio
import json
import logging
import random
from datetime import datetime, timezone
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

logger = logging.getLogger("kaizen.ws")

websocket_router = APIRouter()

# Connected clients
_clients: list[WebSocket] = []

# Fallback state (used if Redis not available or during startup)
_telemetry_state = {
    "scenario": "normal",
    "kiln_bzt": 1420.0,
    "kiln_o2": 2.5,
    "kiln_feed": 280.0,
    "clinker_tph": 185.0,
    "cement_tph": 312.5,
    "total_power_mw": 18.4,
    "whrs_mw": 4.2,
    "cpp_mw": 8.5,
    "grid_mw": 5.7,
    "sec_kwh_ton": 64.2,
    "co2_intensity": 820.5,
    "raw_mill_feed": 200.0,
    "cement_mill_power": 5200.0,
    "fan_vibration": 1.2,
}


async def _get_live_state() -> dict:
    """Try to read live values from Redis; fall back to scenario state."""
    try:
        from app.services.redis_store import get_current_state, get_active_scenario
        state = await get_current_state()
        scenario = await get_active_scenario()

        if state:
            clinker_tph = state.get("KILN-CLINKER-PROD", 185.0)
            total_power_kw = state.get("PLANT-TOTAL-POWER", 18400.0)
            sec = (total_power_kw / clinker_tph) if clinker_tph > 0 else 64.2

            return {
                "scenario": scenario,
                "clinker_tph": clinker_tph,
                "total_power_mw": total_power_kw / 1000,
                "whrs_mw": state.get("WHRS-GENERATION", 4200) / 1000,
                "cpp_mw": state.get("CPP-POWER", 8500) / 1000,
                "grid_mw": state.get("PLANT-GRID-IMPORT", 5700) / 1000,
                "sec_kwh_ton": sec,
                "kiln_bzt": state.get("KILN-BZT", 1420.0),
                "kiln_o2": state.get("KILN-O2", 2.5),
                "kiln_feed": state.get("KILN-FEED", 280.0),
                "cement_mill_power": state.get("CM-POWER", 5200.0),
                "fan_vibration": state.get("CM-VIBRATION", 1.2),
                "co2_intensity": 820.5,
                "source": "LIVE",
            }
    except Exception as e:
        logger.debug(f"Redis read failed in WS, using fallback: {e}")

    return {**_telemetry_state, "source": "FALLBACK"}


def _generate_live_reading(state: dict) -> dict:
    """Generate a live telemetry snapshot with realistic noise."""
    noise = lambda x, pct=0.01: x * (1 + random.gauss(0, pct))

    # Compute active alarms count from scenario
    alarm_count = 3
    scenario = state.get("scenario", "normal")
    if scenario != "normal":
        alarm_count = 8 if "degradation" in scenario or "disturbance" in scenario else 5

    return {
        "type": "telemetry",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "scenario": scenario,
        "source": state.get("source", "LIVE"),
        "kpis": {
            "production_tph": round(noise(state.get("clinker_tph", 185.0), 0.02), 1),
            "power_mw": round(noise(state.get("total_power_mw", 18.4), 0.015), 2),
            "sec": round(noise(state.get("sec_kwh_ton", 64.2), 0.02), 1),
            "whrs_mw": round(noise(state.get("whrs_mw", 4.2), 0.02), 2),
            "co2_intensity": round(noise(state.get("co2_intensity", 820.5), 0.01), 1),
        },
        "readings": [
            {"tag": "KILN-BZT-001", "name": "Burning Zone Temp", "value": round(noise(state.get("kiln_bzt", 1420.0), 0.005), 1), "unit": "°C", "quality": "GOOD"},
            {"tag": "KILN-O2-001", "name": "Kiln Outlet O2", "value": round(noise(state.get("kiln_o2", 2.5), 0.04), 2), "unit": "%", "quality": "GOOD"},
            {"tag": "KILN-FEED-001", "name": "Kiln Feed Rate", "value": round(noise(state.get("kiln_feed", 280.0), 0.02), 1), "unit": "tph", "quality": "GOOD"},
            {"tag": "CM-PWR-001", "name": "Cement Mill Power", "value": round(noise(state.get("cement_mill_power", 5200.0), 0.02), 0), "unit": "kW", "quality": "GOOD"},
            {"tag": "CM-FAN-VIB-001", "name": "CM Fan Vibration", "value": round(noise(state.get("fan_vibration", 1.2), 0.05), 2), "unit": "mm/s", "quality": "GOOD"},
            {"tag": "WHRS-GEN-001", "name": "WHRS Generation", "value": round(noise(state.get("whrs_mw", 4.2), 0.02), 2), "unit": "MW", "quality": "GOOD"},
            {"tag": "CPP-GEN-001", "name": "CPP Generation", "value": round(noise(state.get("cpp_mw", 8.5), 0.01), 2), "unit": "MW", "quality": "GOOD"},
            {"tag": "GRID-IMP-001", "name": "Grid Import", "value": round(noise(state.get("grid_mw", 5.7), 0.02), 2), "unit": "MW", "quality": "GOOD"},
        ],
        "active_alarms": alarm_count,
    }


@websocket_router.websocket("/ws/telemetry")
async def telemetry_websocket(websocket: WebSocket):
    """WebSocket endpoint for real-time plant telemetry."""
    await websocket.accept()
    _clients.append(websocket)
    logger.info(f"WebSocket client connected. Total: {len(_clients)}")

    try:
        while True:
            state = await _get_live_state()
            data = _generate_live_reading(state)
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(5)  # 5-second intervals
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        if websocket in _clients:
            _clients.remove(websocket)


def update_telemetry_state(updates: dict):
    """Called by scenario change to update fallback state immediately."""
    _telemetry_state.update(updates)


# Scenario state maps (for fallback/immediate update on scenario switch)
SCENARIO_STATES = {
    "normal": {
        "kiln_bzt": 1420.0, "cement_mill_power": 5200.0, "fan_vibration": 1.2,
        "total_power_mw": 18.4, "sec_kwh_ton": 64.2, "whrs_mw": 4.2,
    },
    "fan_degradation": {
        "cement_mill_power": 5980.0,
        "fan_vibration": 3.8,
        "sec_kwh_ton": 69.6,
        "total_power_mw": 19.6,
    },
    "energy_inefficiency": {
        "total_power_mw": 20.6,
        "sec_kwh_ton": 71.9,
    },
    "kiln_disturbance": {
        "kiln_bzt": 1355.0,
        "kiln_o2": 0.8,
        "fan_vibration": 1.7,
    },
    "mill_instability": {
        "kiln_feed": 265.0,
        "fan_vibration": 1.7,
    },
    "whrs_degradation": {
        "whrs_mw": 3.15,
        "grid_mw": 7.05,
    },
    "cpp_issue": {
        "cpp_mw": 7.2,
        "grid_mw": 7.0,
    },
}
