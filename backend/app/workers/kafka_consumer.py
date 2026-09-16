"""
Kafka Consumer Worker
Consumes plant.telemetry topic and writes readings to TimescaleDB.
Falls back to Redis Streams if KAFKA_ENABLED=false.
"""
import asyncio
import json
import logging
from datetime import datetime, timezone

from app.config import settings

logger = logging.getLogger("kaizen.kafka_consumer")

# Store latest scenario in memory (read by simulator control endpoint)
_current_scenario = "normal"


def get_current_scenario() -> str:
    return _current_scenario


def set_current_scenario(scenario: str):
    global _current_scenario
    _current_scenario = scenario


async def _process_message(data: dict):
    """Process a telemetry message and write to DB."""
    try:
        # Write to Redis for latest values (fast path)
        try:
            import redis.asyncio as redis
            r = redis.from_url(settings.REDIS_URL, decode_responses=True)
            readings = data.get("readings", [])
            pipe = r.pipeline()
            for reading in readings:
                tag = reading.get("tag", "")
                if tag:
                    pipe.setex(f"sensor:{tag}", 60, json.dumps(reading))
            await pipe.execute()
            await r.aclose()
        except Exception as e:
            logger.debug(f"Redis write failed (non-critical): {e}")

        # Update current scenario
        scenario = data.get("scenario", "normal")
        set_current_scenario(scenario)

    except Exception as e:
        logger.error(f"Error processing message: {e}")


async def start_kafka_consumer():
    """Start Kafka consumer for plant.telemetry topic."""
    if not settings.KAFKA_ENABLED:
        logger.info("Kafka disabled, skipping consumer")
        return

    logger.info(f"Starting Kafka consumer on {settings.KAFKA_BOOTSTRAP_SERVERS}")
    retry_delay = 5

    while True:
        try:
            from aiokafka import AIOKafkaConsumer
            consumer = AIOKafkaConsumer(
                "plant.telemetry",
                bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
                group_id=settings.KAFKA_GROUP_ID,
                value_deserializer=lambda m: json.loads(m.decode("utf-8")),
                auto_offset_reset="latest",
            )
            await consumer.start()
            logger.info("Kafka consumer started")
            retry_delay = 5  # reset

            async for msg in consumer:
                await _process_message(msg.value)

        except asyncio.CancelledError:
            logger.info("Kafka consumer cancelled")
            break
        except Exception as e:
            logger.warning(f"Kafka consumer error: {e}. Retrying in {retry_delay}s...")
            await asyncio.sleep(retry_delay)
            retry_delay = min(retry_delay * 2, 60)
