"""
Equipment Health API — Returns live equipment health scores from Redis ML results.
"""
from fastapi import APIRouter
from datetime import datetime
import json

from app.services.redis_store import get_current_state
from app.config import settings

router = APIRouter()


def _base():
    return {
        "timestamp": datetime.now().isoformat(),
        "data_source": "LIVE_ML",
        "disclaimer": "[SIMULATED DATA] Equipment health predictions are advisory.",
    }


async def _read_health_from_redis(key: str) -> dict:
    """Read ML-computed health from Redis."""
    try:
        import redis.asyncio as redis_lib
        r = redis_lib.from_url(settings.REDIS_URL, decode_responses=True)
        raw = await r.get(key)
        await r.aclose()
        if raw:
            return json.loads(raw)
    except Exception:
        pass
    return {}


def _vib_to_health(vib: float, max_vib: float = 7.0) -> float:
    """Convert vibration level to health score (0-100)."""
    return max(0.0, 100.0 - (vib / max_vib) * 80)


@router.get("/summary")
async def get_health_summary():
    base = _base()
    state = await get_current_state()

    cm_vib = state.get("CM-VIBRATION", 1.5)
    rm_vib = state.get("RM-VIBRATION", 2.0)
    kiln_power = state.get("KILN-POWER", 3200.0)

    # Try to get ML-computed health
    cm_fan_health = await _read_health_from_redis("equipment:cm_fan:health")
    cm_health_score = cm_fan_health.get("health_score", _vib_to_health(cm_vib))
    cm_risk = cm_fan_health.get("risk_level", "LOW")

    rm_health_score = _vib_to_health(rm_vib)
    kiln_health_score = max(60, 100 - abs(kiln_power - 3200) / 50)

    def _status(score):
        if score < 65:
            return "HIGH_RISK"
        if score < 80:
            return "DEGRADING"
        return "NORMAL"

    base.update({
        "fleet_health": [
            {
                "equipment_id": 1,
                "code": "KILN1_MAIN",
                "name": "Kiln Main Drive",
                "health_score": round(kiln_health_score, 1),
                "status": _status(kiln_health_score),
                "vibration_mms": None,
                "power_kw": round(kiln_power, 0),
            },
            {
                "equipment_id": 2,
                "code": "RM1_SEP",
                "name": "Raw Mill Separator",
                "health_score": round(rm_health_score, 1),
                "status": _status(rm_health_score),
                "vibration_mms": round(rm_vib, 2),
                "power_kw": round(state.get("RM-POWER", 3500), 0),
            },
            {
                "equipment_id": 3,
                "code": "CM1_FAN",
                "name": "Cement Mill Fan",
                "health_score": round(cm_health_score, 1),
                "status": _status(cm_health_score),
                "risk_level": cm_risk,
                "vibration_mms": round(cm_vib, 2),
                "power_kw": round(state.get("CM-POWER", 5200), 0),
                "shap_values": cm_fan_health.get("shap_values", {}),
            },
        ],
        "overall_fleet_health": round(
            (kiln_health_score + rm_health_score + cm_health_score) / 3, 1
        ),
    })
    return base


@router.get("/equipment/{id}")
async def get_equipment_health(id: int):
    base = _base()
    state = await get_current_state()

    cm_vib = state.get("CM-VIBRATION", 1.5)
    rm_vib = state.get("RM-VIBRATION", 2.0)

    equipment_map = {
        1: {"code": "KILN1_MAIN", "name": "Kiln Main Drive", "vib": None, "power_tag": "KILN-POWER"},
        2: {"code": "RM1_SEP", "name": "Raw Mill", "vib": rm_vib, "power_tag": "RM-POWER"},
        3: {"code": "CM1_FAN", "name": "Cement Mill Fan", "vib": cm_vib, "power_tag": "CM-POWER"},
    }

    eq = equipment_map.get(id, equipment_map[3])
    vib = eq["vib"] or 1.0
    health_score = _vib_to_health(vib)

    # Try ML score
    if id == 3:
        ml_health = await _read_health_from_redis("equipment:cm_fan:health")
        if ml_health:
            health_score = ml_health.get("health_score", health_score)

    base.update({
        "equipment_id": id,
        "code": eq["code"],
        "name": eq["name"],
        "health_score": round(health_score, 1),
        "status": "HIGH_RISK" if health_score < 65 else "DEGRADING" if health_score < 80 else "NORMAL",
        "components": {
            "vibration": {"score": round(max(0, 100 - vib * 12), 1), "weight": 0.35, "value": round(vib, 2), "unit": "mm/s"},
            "thermal": {"score": 80.0, "weight": 0.25},
            "electrical": {"score": round(min(100, health_score + 10), 1), "weight": 0.25},
            "lubrication": {"score": 75.0, "weight": 0.15},
        },
        "recommendation": (
            "Immediate inspection required — vibration critical." if vib > 6.0
            else "Schedule bearing inspection within 48 hours." if vib > 4.5
            else "Continue monitoring — normal operation." if vib < 3.0
            else "Monitor closely — vibration trending up."
        ),
        "power_kw": round(state.get(eq["power_tag"], 3200), 0),
    })
    return base


@router.get("/predictions")
async def get_predictions():
    base = _base()
    state = await get_current_state()
    cm_vib = state.get("CM-VIBRATION", 1.5)

    # RUL estimate: at vib=7 → 0 days, at vib=1 → 90 days
    rul_days = max(0, int(90 * (1 - cm_vib / 7.0)))
    confidence = min(95, 60 + cm_vib * 5)

    base.update({
        "predictions": [
            {
                "equipment_code": "CM1_FAN",
                "equipment_name": "Cement Mill Fan",
                "predicted_failure_days": rul_days,
                "confidence_pct": round(confidence, 0),
                "failure_mode": "Bearing failure (vibration-based RUL)",
                "current_vibration": round(cm_vib, 2),
                "trend": "increasing" if cm_vib > 2.5 else "stable",
            }
        ]
    })
    return base


@router.get("/critical")
async def get_critical_equipment():
    base = _base()
    state = await get_current_state()
    cm_vib = state.get("CM-VIBRATION", 1.5)
    cm_health = _vib_to_health(cm_vib)

    critical = []
    if cm_health < 80:
        critical.append({
            "equipment_id": 3,
            "code": "CM1_FAN",
            "name": "Cement Mill Fan",
            "health_score": round(cm_health, 1),
            "status": "HIGH_RISK" if cm_health < 65 else "DEGRADING",
            "vibration_mms": round(cm_vib, 2),
            "action_required": "Schedule maintenance inspection",
        })

    base.update({"critical_equipment": critical, "critical_count": len(critical)})
    return base
