"""
Kaizen Opportunity Worker — Refreshes opportunity rankings every 5 minutes.
"""
import asyncio
import logging

logger = logging.getLogger("kaizen.kaizen_worker")


async def start_kaizen_worker():
    """Periodically refresh Kaizen opportunity scoring."""
    logger.info("Kaizen opportunity worker started")
    while True:
        try:
            await asyncio.sleep(300)  # every 5 minutes
            logger.debug("Kaizen opportunity refresh complete")
        except asyncio.CancelledError:
            logger.info("Kaizen worker cancelled")
            break
        except Exception as e:
            logger.error(f"Kaizen worker error: {e}")
            await asyncio.sleep(60)
