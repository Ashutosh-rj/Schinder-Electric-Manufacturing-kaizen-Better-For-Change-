"""
Alarm Worker — Checks sensor thresholds and raises alarms.
Runs every 30 seconds.
"""
import asyncio
import logging

logger = logging.getLogger("kaizen.alarm_worker")


async def start_alarm_worker():
    """Periodically check sensor readings and create alarms."""
    logger.info("Alarm worker started")
    while True:
        try:
            await asyncio.sleep(30)
            # TODO: Query latest sensor readings and check against alarm thresholds
            # For now, this is a placeholder that keeps the worker running
            logger.debug("Alarm check cycle complete")
        except asyncio.CancelledError:
            logger.info("Alarm worker cancelled")
            break
        except Exception as e:
            logger.error(f"Alarm worker error: {e}")
            await asyncio.sleep(10)
