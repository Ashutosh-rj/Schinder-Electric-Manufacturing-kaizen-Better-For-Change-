"""
Alarms API — Returns live alarms from Redis written by alarm_worker.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

from app.services.redis_store import get_active_alarms, get_recent_anomalies

router = APIRouter()


class AcknowledgeRequest(BaseModel):
    acknowledged_by: str
    notes: str = ""


@router.post("/{id}/acknowledge")
async def acknowledge_alarm(id: int, req: AcknowledgeRequest):
    # In production: mark alarm as acknowledged in DB
    return {
        "status": "ACKNOWLEDGED",
        "id": id,
        "acknowledged_by": req.acknowledged_by,
        "acknowledged_at": datetime.utcnow().isoformat() + "Z",
    }


@router.get("")
async def get_alarms():
    """Return live alarms from Redis (written by alarm_worker)."""
    alarms = await get_active_alarms()
    anomalies = await get_recent_anomalies()

    # Count by priority
    critical = sum(1 for a in alarms if a.get("category") == "CRITICAL")
    high = sum(1 for a in alarms if a.get("priority") == "HIGH")
    medium = sum(1 for a in alarms if a.get("priority") == "MEDIUM")
    low = sum(1 for a in alarms if a.get("priority") == "LOW")

    # If Redis is empty (system just started), return a placeholder
    if not alarms:
        alarms = [{
            "id": 0,
            "alarm_tag": "KAIZEN.SYSTEM.INITIALISING",
            "description": "System initialising — alarm monitoring active. Awaiting sensor data.",
            "priority": "LOW",
            "category": "SYSTEM",
            "value": 0,
            "limit_value": 0,
            "state": "ACTIVE",
            "raised_at": datetime.utcnow().isoformat() + "Z",
            "department_code": "SYSTEM",
            "why_occurred": "System startup — waiting for simulator data to flow through Kafka.",
            "possible_causes": ["System just started"],
            "consequence": "No impact — informational only.",
            "operator_checks": ["Wait 30 seconds for data pipeline to warm up."],
            "has_occurred_before": False,
            "occurrence_count_7d": 0,
        }]

    return {
        "active_alarms": alarms,
        "recent_anomalies": anomalies[:5],
        "alarm_analysis": {
            "chattering": [],
            "standing": [a for a in alarms if a.get("occurrence_count_7d", 0) > 3],
            "nuisance": [],
            "flood_active": len(alarms) > 20,
        },
        "statistics": {
            "total_active": len(alarms),
            "critical": critical,
            "high": high,
            "medium": medium,
            "low": low,
        },
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


@router.get("/summary")
async def get_alarm_summary():
    """Quick alarm count summary."""
    alarms = await get_active_alarms()
    return {
        "total": len(alarms),
        "critical": sum(1 for a in alarms if a.get("category") == "CRITICAL"),
        "high": sum(1 for a in alarms if a.get("priority") == "HIGH"),
        "medium": sum(1 for a in alarms if a.get("priority") == "MEDIUM"),
        "low": sum(1 for a in alarms if a.get("priority") == "LOW"),
    }
