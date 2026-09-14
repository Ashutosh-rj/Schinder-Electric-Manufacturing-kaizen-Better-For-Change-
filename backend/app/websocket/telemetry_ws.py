"""
WebSocket — Real-time Plant Telemetry
Streams live sensor readings to connected frontend clients every 5 seconds.
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

# Demo telemetry data — updated by Kafka consumer via shared state
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


def _generate_live_reading() -> dict:
    """Generate a live telemetry snapshot with realistic noise."""
    state = _telemetry_state
    noise = lambda x, pct=0.01: x * (1 + random.gauss(0, pct))

    return {
        "type": "telemetry",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "scenario": state["scenario"],
        "kpis": {
            "production_tph": round(noise(state["clinker_tph"], 0.02), 1),
            "power_mw": round(noise(state["total_power_mw"], 0.015), 2),
            "sec": round(noise(state["sec_kwh_ton"], 0.02), 1),
            "whrs_mw": round(noise(state["whrs_mw"], 0.02), 2),
            "co2_intensity": round(noise(state["co2_intensity"], 0.01), 1),
        },
        "readings": [
            {"tag": "KILN-BZT-001", "name": "Burning Zone Temp", "value": round(noise(state["kiln_bzt"], 0.005), 1), "unit": "°C", "quality": "GOOD"},
            {"tag": "KILN-O2-001", "name": "Kiln Outlet O2", "value": round(noise(state["kiln_o2"], 0.04), 2), "unit": "%", "quality": "GOOD"},
            {"tag": "KILN-FEED-001", "name": "Kiln Feed Rate", "value": round(noise(state["kiln_feed"], 0.02), 1), "unit": "tph", "quality": "GOOD"},
            {"tag": "CM-PWR-001", "name": "Cement Mill Power", "value": round(noise(state["cement_mill_power"], 0.02), 0), "unit": "kW", "quality": "GOOD"},
            {"tag": "CM-FAN-VIB-001", "name": "CM Fan Vibration", "value": round(noise(state["fan_vibration"], 0.05), 2), "unit": "mm/s", "quality": "GOOD"},
            {"tag": "WHRS-GEN-001", "name": "WHRS Generation", "value": round(noise(state["whrs_mw"], 0.02), 2), "unit": "MW", "quality": "GOOD"},
            {"tag": "CPP-GEN-001", "name": "CPP Generation", "value": round(noise(state["cpp_mw"], 0.01), 2), "unit": "MW", "quality": "GOOD"},
            {"tag": "GRID-IMP-001", "name": "Grid Import", "value": round(noise(state["grid_mw"], 0.02), 2), "unit": "MW", "quality": "GOOD"},
        ],
        "active_alarms": 3 if state["scenario"] == "normal" else 8,
    }


@websocket_router.websocket("/ws/telemetry")
async def telemetry_websocket(websocket: WebSocket):
    """WebSocket endpoint for real-time plant telemetry."""
    await websocket.accept()
    _clients.append(websocket)
    logger.info(f"WebSocket client connected. Total: {len(_clients)}")

    try:
        while True:
            data = _generate_live_reading()
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
    """Called by scenario change or Kafka consumer to update state."""
    _telemetry_state.update(updates)


# Scenario state maps
SCENARIO_STATES = {
    "normal": {
        "kiln_bzt": 1420.0, "cement_mill_power": 5200.0, "fan_vibration": 1.2,
        "total_power_mw": 18.4, "sec_kwh_ton": 64.2, "whrs_mw": 4.2,
    },
    "fan_degradation": {
        "cement_mill_power": 5980.0,  # +15%
        "fan_vibration": 3.8,          # +300%
        "sec_kwh_ton": 69.6,           # +8%
        "total_power_mw": 19.6,
    },
    "energy_inefficiency": {
        "total_power_mw": 20.6,        # +12%
        "sec_kwh_ton": 71.9,
    },
    "mill_instability": {
        "kiln_feed": 265.0,            # oscillating
        "fan_vibration": 1.7,
    },
    "whrs_degradation": {
        "whrs_mw": 3.15,               # -25%
        "grid_mw": 7.05,
    },
    "cpp_issue": {
        "cpp_mw": 7.2,                 # -15%
        "grid_mw": 7.0,
    },
}
