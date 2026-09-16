import asyncio
import datetime
import httpx
import structlog
from app.config import settings
from app.scenarios import get_scenario
from app.publisher.kafka_publisher import KafkaPublisher
from app.publisher.redis_publisher import RedisPublisher

logger = structlog.get_logger()


async def get_scenario_from_redis(redis_pub: "RedisPublisher") -> str:
    """Poll Redis for the active scenario set by the backend API."""
    try:
        import redis.asyncio as redis_lib
        r = redis_lib.from_url(settings.REDIS_URL, decode_responses=True)
        val = await r.get("simulator:scenario")
        await r.aclose()
        return val or "normal"
    except Exception:
        return "normal"


async def main():
    logger.info("Starting Simulator")

    kafka_pub = KafkaPublisher()
    await kafka_pub.connect()

    redis_pub = RedisPublisher()

    current_scenario_name = settings.SIMULATOR_SCENARIO or "normal"
    scenario = get_scenario(current_scenario_name)

    client = httpx.AsyncClient()

    try:
        while True:
            now = datetime.datetime.utcnow()

            # Poll Redis for scenario change every cycle
            try:
                redis_scenario = await get_scenario_from_redis(redis_pub)
                if redis_scenario != current_scenario_name:
                    logger.info(
                        "Scenario changed",
                        old=current_scenario_name,
                        new=redis_scenario,
                    )
                    current_scenario_name = redis_scenario
                    scenario = get_scenario(current_scenario_name)
            except Exception as e:
                logger.warning("Failed to poll scenario from Redis", error=str(e))

            readings = scenario.step()

            payload = {
                "timestamp": now.isoformat() + "Z",
                "scenario": current_scenario_name,
                "readings": readings,
            }

            await kafka_pub.publish(payload)
            redis_pub.publish(payload)

            logger.info(
                "Published readings",
                scenario=current_scenario_name,
                count=len(readings),
            )

            await asyncio.sleep(settings.SIMULATOR_INTERVAL_SECONDS)

    except asyncio.CancelledError:
        pass
    finally:
        await kafka_pub.disconnect()
        await client.aclose()


if __name__ == "__main__":
    asyncio.run(main())
