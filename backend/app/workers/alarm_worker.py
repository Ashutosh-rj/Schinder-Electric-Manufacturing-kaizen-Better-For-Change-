"""
Alarm Worker — Checks sensor thresholds every 30 seconds and fires real alarms.
Reads live sensor values from Redis, compares against THRESHOLDS, writes alarms back to Redis.
"""
import asyncio
import logging
from datetime import datetime, timezone

from app.services.redis_store import (
    get_all_latest_readings,
    get_active_alarms,
    push_alarm,
    clear_resolved_alarms,
    THRESHOLDS,
)

logger = logging.getLogger("kaizen.alarm_worker")

# Track which tags are currently alarmed so we don't flood duplicates
_alarmed_tags: set = set()

# Alarm ID counter
_alarm_counter = 1000


def _next_id() -> int:
    global _alarm_counter
    _alarm_counter += 1
    return _alarm_counter


def _priority_to_category(priority: str) -> str:
    mapping = {"HIGH": "CRITICAL", "MEDIUM": "HIGH", "LOW": "MEDIUM"}
    return mapping.get(priority, "LOW")


async def _check_thresholds():
    """Read latest sensor readings and compare against thresholds."""
    global _alarmed_tags

    readings = await get_all_latest_readings()
    if not readings:
        logger.debug("No sensor readings available in Redis yet")
        return

    new_alarmed = set()
    now = datetime.now(timezone.utc).isoformat()

    for tag, threshold in THRESHOLDS.items():
        reading = readings.get(tag)
        if not reading:
            continue

        value = float(reading.get("value", 0.0))
        low = threshold["low"]
        high = threshold["high"]
        unit = threshold.get("unit", "")
        priority = threshold.get("priority", "MEDIUM")

        violated = False
        violation_msg = ""
        direction = ""

        if value > high:
            violated = True
            direction = "HIGH"
            violation_msg = f"{tag} = {value:.1f} {unit} (limit: {high:.1f} {unit})"
        elif value < low and low > 0:  # only check low if meaningful
            violated = True
            direction = "LOW"
            violation_msg = f"{tag} = {value:.1f} {unit} (limit: {low:.1f} {unit})"

        if violated:
            new_alarmed.add(tag)
            # Only push if this is a new alarm (avoid duplicates in same cycle)
            if tag not in _alarmed_tags:
                alarm = {
                    "id": _next_id(),
                    "alarm_tag": f"KAIZEN.{tag.replace('-', '_')}.{direction}",
                    "description": f"{tag} out of range: {violation_msg}",
                    "priority": priority,
                    "category": _priority_to_category(priority),
                    "value": round(value, 2),
                    "limit_value": high if direction == "HIGH" else low,
                    "state": "ACTIVE",
                    "raised_at": now,
                    "department_code": _tag_to_dept(tag),
                    "why_occurred": f"{tag} has exceeded its {direction} operating limit.",
                    "possible_causes": _get_causes(tag, direction),
                    "consequence": _get_consequence(tag),
                    "operator_checks": _get_checks(tag, direction),
                    "has_occurred_before": True,
                    "occurrence_count_7d": 1,
                }
                await push_alarm(alarm)
                logger.info(f"ALARM raised: {alarm['alarm_tag']} | value={value:.1f}")

    _alarmed_tags = new_alarmed
    await clear_resolved_alarms()


def _tag_to_dept(tag: str) -> str:
    if tag.startswith("KILN"):
        return "PYROPROCESS"
    if tag.startswith("RM"):
        return "RAW_MILL"
    if tag.startswith("CM"):
        return "CEMENT_MILL"
    if tag.startswith("WHRS"):
        return "WHRS"
    if tag.startswith("CPP"):
        return "CPP"
    return "PLANT"


def _get_causes(tag: str, direction: str) -> list:
    causes = {
        "KILN-BZT": ["Fuel rate too high/low", "Feed rate variation", "Coal quality change", "O2 control issue"],
        "KILN-O2": ["Fan speed deviation", "Fuel rate change", "Air leakage", "Calciner issue"],
        "RM-VIBRATION": ["Bearing wear", "Mill overload", "Foreign material", "Unbalanced grinding media"],
        "CM-VIBRATION": ["Bearing degradation", "Separator imbalance", "Foreign body in mill", "Misalignment"],
        "CM-POWER": ["Over-grinding", "Separator speed issue", "Material buildup", "High feed rate"],
        "PLANT-TOTAL-POWER": ["Multiple equipment issues", "Energy inefficiency", "Auxiliaries overloaded"],
    }
    return causes.get(tag, ["Process deviation", "Sensor drift", "Operational change"])


def _get_consequence(tag: str) -> str:
    consequences = {
        "KILN-BZT": "Poor clinker quality, refractory damage, increased fuel consumption.",
        "KILN-O2": "Incomplete combustion (low O2) or heat loss (high O2).",
        "RM-VIBRATION": "Bearing failure risk, unplanned mill shutdown.",
        "CM-VIBRATION": "Bearing failure, production loss, emergency maintenance.",
        "CM-POWER": "Excess energy consumption, possible equipment overload.",
        "PLANT-TOTAL-POWER": "High energy cost, exceeds contracted demand.",
    }
    return consequences.get(tag, "Risk of production disruption and energy waste.")


def _get_checks(tag: str, direction: str) -> list:
    if "VIBRATION" in tag:
        return [
            "1. Check bearing temperature trend",
            "2. Inspect lubrication system",
            "3. Schedule vibration analysis",
            "4. Review recent maintenance history",
        ]
    if "BZT" in tag:
        return [
            "1. Check fuel rate setpoint vs actual",
            "2. Verify feed rate stability",
            "3. Check coal quality report",
            "4. Review O2 analyzer calibration",
        ]
    if "O2" in tag:
        return [
            "1. Check fan speed control loop",
            "2. Inspect air leakage points",
            "3. Verify O2 analyzer calibration",
            "4. Check calciner damper position",
        ]
    return [
        "1. Verify sensor reading is correct",
        "2. Check process parameters",
        "3. Consult shift supervisor",
        "4. Review recent operational changes",
    ]


async def start_alarm_worker():
    """Periodically check sensor readings and create alarms. Runs every 30 seconds."""
    logger.info("Alarm worker started")
    # Wait for simulator to populate Redis first
    await asyncio.sleep(15)

    while True:
        try:
            await _check_thresholds()
            await asyncio.sleep(30)
        except asyncio.CancelledError:
            logger.info("Alarm worker cancelled")
            break
        except Exception as e:
            logger.error(f"Alarm worker error: {e}")
            await asyncio.sleep(10)
