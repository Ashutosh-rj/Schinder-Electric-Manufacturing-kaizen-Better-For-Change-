"""
Anomaly Detection Worker — Runs every 60 seconds.
Performs statistical anomaly detection (Z-score / 3-sigma) on live sensor readings.
Also calls the ML service for IsolationForest-based anomaly scoring on critical equipment.
"""
import asyncio
import logging
from datetime import datetime, timezone
from collections import defaultdict, deque
from typing import Dict, Deque

import httpx

from app.services.redis_store import (
    get_all_latest_readings,
    get_current_state,
    push_anomaly,
    ALL_TAGS,
)
from app.config import settings

logger = logging.getLogger("kaizen.anomaly_worker")

# Rolling history window per tag (last 30 readings = 2.5 minutes at 5s interval)
_history: Dict[str, Deque[float]] = defaultdict(lambda: deque(maxlen=30))

_anomaly_counter = 2000


def _next_id() -> int:
    global _anomaly_counter
    _anomaly_counter += 1
    return _anomaly_counter


async def _statistical_anomaly_check(readings: dict):
    """3-sigma anomaly detection across all tags."""
    now = datetime.now(timezone.utc).isoformat()
    anomalies = []

    for tag, reading in readings.items():
        value = float(reading.get("value", 0.0))
        hist = _history[tag]
        hist.append(value)

        if len(hist) < 10:
            continue  # Not enough history yet

        values = list(hist)
        n = len(values)
        mean = sum(values) / n
        variance = sum((x - mean) ** 2 for x in values) / n
        std = variance ** 0.5

        if std < 0.001:
            continue  # No variance (sensor might be constant)

        z_score = abs(value - mean) / std

        if z_score > 3.0:
            anomalies.append({
                "id": _next_id(),
                "type": "STATISTICAL_3SIGMA",
                "tag": tag,
                "value": round(value, 2),
                "mean": round(mean, 2),
                "std": round(std, 2),
                "z_score": round(z_score, 2),
                "severity": "HIGH" if z_score > 4.0 else "MEDIUM",
                "message": f"{tag}: {value:.1f} deviates {z_score:.1f}σ from mean ({mean:.1f}±{std:.1f})",
                "detected_at": now,
                "department": _tag_to_dept(tag),
            })
            logger.info(f"3σ anomaly: {tag} z={z_score:.2f}, value={value:.1f}")

    for anomaly in anomalies:
        await push_anomaly(anomaly)


async def _ml_anomaly_check(state: Dict[str, float]):
    """Call ML service for IsolationForest anomaly detection on kiln readings."""
    kiln_readings = [
        {"tag": "KILN-POWER",  "value": state.get("KILN-POWER", 2800)},
        {"tag": "KILN-BZT",   "value": state.get("KILN-BZT", 1420)},
        {"tag": "KILN-FEED",  "value": state.get("KILN-FEED", 280)},
    ]

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(
                f"{settings.ML_SERVICE_URL}/api/v1/predict/anomaly",
                json={"equipment_id": 1, "readings": kiln_readings},
            )
            if resp.status_code == 200:
                result = resp.json()
                if result.get("is_anomaly"):
                    anomaly = {
                        "id": _next_id(),
                        "type": "ML_ISOLATION_FOREST",
                        "tag": "KILN-SYSTEM",
                        "anomaly_score": result.get("anomaly_score", 0),
                        "severity": "HIGH",
                        "message": f"ML model detected kiln anomaly (score={result.get('anomaly_score', 0):.3f})",
                        "detected_at": datetime.now(timezone.utc).isoformat(),
                        "department": "PYROPROCESS",
                        "contributing_features": result.get("contributing_features", []),
                    }
                    await push_anomaly(anomaly)
                    logger.info(f"ML anomaly detected: score={result.get('anomaly_score')}")
    except Exception as e:
        logger.debug(f"ML service anomaly check skipped: {e}")


async def _ml_health_check(state: Dict[str, float]):
    """Call ML service to compute equipment health scores and flag degraded equipment."""
    # Fan health features (CM vibration + power)
    features = {
        "vibration_rms": state.get("CM-VIBRATION", 1.5),
        "power_deviation_pct": (state.get("CM-POWER", 5200) - 5200) / 52,
        "temperature_delta": 10.0,
        "current_deviation": 0.0,
        "operating_hours": 5000.0,
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(
                f"{settings.ML_SERVICE_URL}/api/v1/predict/health-score",
                json={"equipment_id": 1, "features": features},
            )
            if resp.status_code == 200:
                result = resp.json()
                health = result.get("health_score", 100)
                risk = result.get("risk_level", "LOW")
                # Store in Redis for dashboard to read
                import redis.asyncio as redis_lib
                r = redis_lib.from_url(settings.REDIS_URL, decode_responses=True)
                import json
                await r.set("equipment:cm_fan:health", json.dumps({
                    "health_score": health,
                    "risk_level": risk,
                    "shap_values": result.get("shap_values", {}),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }))
                await r.aclose()

                if risk in ("HIGH", "MEDIUM"):
                    anomaly = {
                        "id": _next_id(),
                        "type": "ML_HEALTH_DEGRADATION",
                        "tag": "CM-FAN",
                        "health_score": health,
                        "severity": risk,
                        "message": f"Cement Mill Fan health degraded: score={health:.1f} ({risk} risk)",
                        "detected_at": datetime.now(timezone.utc).isoformat(),
                        "department": "CEMENT_MILL",
                        "shap_values": result.get("shap_values", {}),
                    }
                    await push_anomaly(anomaly)
                    logger.info(f"Health degradation: CM-FAN score={health:.1f} risk={risk}")
    except Exception as e:
        logger.debug(f"ML health check skipped: {e}")


def _tag_to_dept(tag: str) -> str:
    if tag.startswith("KILN"):
        return "PYROPROCESS"
    if tag.startswith("RM"):
        return "RAW_MILL"
    if tag.startswith("CM"):
        return "CEMENT_MILL"
    if tag.startswith("WHRS"):
        return "WHRS"
    return "PLANT"


async def start_anomaly_worker():
    """Periodically run anomaly detection across all departments. Runs every 60s."""
    logger.info("Anomaly worker started")
    await asyncio.sleep(20)  # Let Redis populate first

    while True:
        try:
            readings = await get_all_latest_readings()
            state = await get_current_state()

            if readings:
                await _statistical_anomaly_check(readings)
                await _ml_anomaly_check(state)
                await _ml_health_check(state)
                logger.debug(f"Anomaly detection cycle complete. Tags checked: {len(readings)}")
            else:
                logger.debug("No readings in Redis yet, skipping anomaly check")

            await asyncio.sleep(60)
        except asyncio.CancelledError:
            logger.info("Anomaly worker cancelled")
            break
        except Exception as e:
            logger.error(f"Anomaly worker error: {e}")
            await asyncio.sleep(30)
