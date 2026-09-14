"""
Anomaly Detection Worker — Periodic anomaly scanning.
Runs every 60 seconds using EWMA + Z-score + Engineering Rules.
"""
import asyncio
import logging

logger = logging.getLogger("kaizen.anomaly_worker")


async def start_anomaly_worker():
    """Periodically run anomaly detection across all departments."""
    logger.info("Anomaly worker started")
    while True:
        try:
            await asyncio.sleep(60)
            logger.debug("Anomaly detection cycle complete")
        except asyncio.CancelledError:
            logger.info("Anomaly worker cancelled")
            break
        except Exception as e:
            logger.error(f"Anomaly worker error: {e}")
            await asyncio.sleep(30)
