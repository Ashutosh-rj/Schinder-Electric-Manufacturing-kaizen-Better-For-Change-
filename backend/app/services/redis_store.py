"""
Redis State Store — Shared helper for all backend components.
Provides typed get/set for sensor tags, alarms, anomalies, and Kaizen opportunities.
"""
import json
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime

logger = logging.getLogger("kaizen.redis_store")

# All known sensor tags from the simulator (plant_model outputs)
ALL_TAGS = [
    "KILN-BZT", "KILN-O2", "KILN-NOX", "KILN-COOLER-TEMP",
    "KILN-PH-EXIT-TEMP", "KILN-CLINKER-PROD", "KILN-POWER",
    "KILN-FEED", "KILN-FUEL", "KILN-SPEED",
    "RM-POWER", "RM-FEED", "RM-VIBRATION", "RM-OUTLET-TEMP",
    "CM-POWER", "CM-FEED", "CM-VIBRATION", "CM-FINENESS", "CM-FAN-SPEED",
    "WHRS-GENERATION", "WHRS-EFFICIENCY",
    "CPP-POWER", "CPP-HEAT-RATE",
    "UTIL-AUX-POWER",
    "PLANT-TOTAL-POWER", "PLANT-GRID-IMPORT",
]

# Operating envelopes for alarm detection
THRESHOLDS = {
    "KILN-BZT":          {"low": 1350.0, "high": 1500.0, "unit": "°C",    "priority": "HIGH"},
    "KILN-O2":           {"low": 1.0,    "high": 4.5,    "unit": "%",     "priority": "MEDIUM"},
    "KILN-NOX":          {"low": 0.0,    "high": 1200.0, "unit": "mg/Nm3","priority": "MEDIUM"},
    "KILN-COOLER-TEMP":  {"low": 0.0,    "high": 600.0,  "unit": "°C",    "priority": "HIGH"},
    "KILN-PH-EXIT-TEMP": {"low": 280.0,  "high": 380.0,  "unit": "°C",    "priority": "MEDIUM"},
    "RM-VIBRATION":      {"low": 0.0,    "high": 7.0,    "unit": "mm/s",  "priority": "HIGH"},
    "CM-VIBRATION":      {"low": 0.0,    "high": 7.0,    "unit": "mm/s",  "priority": "HIGH"},
    "CM-POWER":          {"low": 0.0,    "high": 7000.0, "unit": "kW",    "priority": "MEDIUM"},
    "PLANT-TOTAL-POWER": {"low": 0.0,    "high": 25000.0,"unit": "kW",    "priority": "MEDIUM"},
    "WHRS-GENERATION":   {"low": 500.0,  "high": 99999.0,"unit": "kW",    "priority": "LOW"},
    "KILN-POWER":        {"low": 0.0,    "high": 5000.0, "unit": "kW",    "priority": "MEDIUM"},
}

# BAT target benchmarks for SEC
BAT_SEC_KWH_T_CLINKER = 62.0
BAT_SEC_KWH_T_CEMENT = 36.0


async def get_redis():
    """Return an async Redis client."""
    try:
        import redis.asyncio as redis
        from app.config import settings
        r = redis.from_url(settings.REDIS_URL, decode_responses=True)
        return r
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}")
        return None


async def get_latest_reading(tag: str) -> Optional[Dict[str, Any]]:
    """Return the latest reading for a sensor tag."""
    r = await get_redis()
    if not r:
        return None
    try:
        raw = await r.get(f"sensor:{tag}")
        await r.aclose()
        if raw:
            return json.loads(raw)
    except Exception as e:
        logger.debug(f"Redis get {tag}: {e}")
    return None


async def get_all_latest_readings() -> Dict[str, Dict[str, Any]]:
    """Return dict of {tag: reading} for all known tags."""
    r = await get_redis()
    if not r:
        return {}
    results = {}
    try:
        pipe = r.pipeline()
        for tag in ALL_TAGS:
            pipe.get(f"sensor:{tag}")
        values = await pipe.execute()
        await r.aclose()
        for tag, raw in zip(ALL_TAGS, values):
            if raw:
                try:
                    results[tag] = json.loads(raw)
                except Exception:
                    pass
    except Exception as e:
        logger.debug(f"Redis get_all: {e}")
    return results


async def get_tag_value(tag: str, default: float = 0.0) -> float:
    """Convenience: get just the numeric value for a tag."""
    reading = await get_latest_reading(tag)
    if reading:
        return float(reading.get("value", default))
    return default


async def get_current_state() -> Dict[str, float]:
    """Return a flat dict of {tag: value} for all known tags."""
    readings = await get_all_latest_readings()
    return {tag: float(r.get("value", 0.0)) for tag, r in readings.items()}


# ── Alarms ────────────────────────────────────────────────────────────────────

async def push_alarm(alarm: Dict[str, Any]):
    """Push a new alarm to the active alarms list (capped at 50)."""
    r = await get_redis()
    if not r:
        return
    try:
        await r.lpush("alarms:active", json.dumps(alarm))
        await r.ltrim("alarms:active", 0, 49)
        await r.aclose()
    except Exception as e:
        logger.debug(f"Redis push_alarm: {e}")


async def get_active_alarms() -> List[Dict[str, Any]]:
    """Return all active alarms."""
    r = await get_redis()
    if not r:
        return []
    try:
        raw_list = await r.lrange("alarms:active", 0, -1)
        await r.aclose()
        alarms = []
        for raw in raw_list:
            try:
                alarms.append(json.loads(raw))
            except Exception:
                pass
        return alarms
    except Exception as e:
        logger.debug(f"Redis get_alarms: {e}")
        return []


async def clear_resolved_alarms():
    """Clear alarms older than 10 minutes (simple cleanup)."""
    r = await get_redis()
    if not r:
        return
    try:
        raw_list = await r.lrange("alarms:active", 0, -1)
        now = datetime.utcnow()
        active = []
        for raw in raw_list:
            try:
                alarm = json.loads(raw)
                raised_at = datetime.fromisoformat(alarm.get("raised_at", "2000-01-01"))
                age_seconds = (now - raised_at).total_seconds()
                if age_seconds < 600:  # keep if < 10 minutes old
                    active.append(raw)
            except Exception:
                active.append(raw)  # keep if can't parse
        await r.delete("alarms:active")
        if active:
            await r.rpush("alarms:active", *active)
        await r.aclose()
    except Exception as e:
        logger.debug(f"Redis clear_alarms: {e}")


# ── Anomalies ─────────────────────────────────────────────────────────────────

async def push_anomaly(anomaly: Dict[str, Any]):
    """Push an anomaly event (capped at 20)."""
    r = await get_redis()
    if not r:
        return
    try:
        await r.lpush("anomalies:recent", json.dumps(anomaly))
        await r.ltrim("anomalies:recent", 0, 19)
        await r.aclose()
    except Exception as e:
        logger.debug(f"Redis push_anomaly: {e}")


async def get_recent_anomalies() -> List[Dict[str, Any]]:
    """Return recent anomalies."""
    r = await get_redis()
    if not r:
        return []
    try:
        raw_list = await r.lrange("anomalies:recent", 0, -1)
        await r.aclose()
        return [json.loads(raw) for raw in raw_list if raw]
    except Exception as e:
        logger.debug(f"Redis get_anomalies: {e}")
        return []


# ── Kaizen Opportunities ──────────────────────────────────────────────────────

async def set_kaizen_opportunities(opportunities: List[Dict[str, Any]]):
    """Store Kaizen opportunities (replace all)."""
    r = await get_redis()
    if not r:
        return
    try:
        await r.set("kaizen:opportunities", json.dumps(opportunities))
        await r.aclose()
    except Exception as e:
        logger.debug(f"Redis set_kaizen: {e}")


async def get_kaizen_opportunities() -> List[Dict[str, Any]]:
    """Return stored Kaizen opportunities."""
    r = await get_redis()
    if not r:
        return []
    try:
        raw = await r.get("kaizen:opportunities")
        await r.aclose()
        if raw:
            return json.loads(raw)
    except Exception as e:
        logger.debug(f"Redis get_kaizen: {e}")
    return []


# ── Scenario Control ──────────────────────────────────────────────────────────

async def set_active_scenario(scenario: str):
    """Write the active scenario name for the simulator to pick up."""
    r = await get_redis()
    if not r:
        return
    try:
        await r.set("simulator:scenario", scenario)
        await r.aclose()
    except Exception as e:
        logger.debug(f"Redis set_scenario: {e}")


async def get_active_scenario() -> str:
    """Read the current scenario from Redis."""
    r = await get_redis()
    if not r:
        return "normal"
    try:
        val = await r.get("simulator:scenario")
        await r.aclose()
        return val or "normal"
    except Exception:
        return "normal"
