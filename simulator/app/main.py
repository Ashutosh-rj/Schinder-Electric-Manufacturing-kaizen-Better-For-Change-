import asyncio
import datetime
import httpx
import structlog
from app.config import settings
from app.scenarios import get_scenario
from app.publisher.kafka_publisher import KafkaPublisher
from app.publisher.redis_publisher import RedisPublisher

logger = structlog.get_logger()

async def report_scenario(client, current_scenario):
    try:
        await client.post(settings.SCENARIO_API_URL, json={"scenario": current_scenario})
    except Exception:
        pass # Ignore API errors

async def main():
    logger.info("Starting Simulator")
    
    kafka_pub = KafkaPublisher()
    await kafka_pub.connect()
    
    redis_pub = RedisPublisher()
    
    current_scenario_name = "normal"
    scenario = get_scenario(current_scenario_name)
    
    client = httpx.AsyncClient()
    last_report_time = datetime.datetime.min
    
    try:
        while True:
            # Here we could poll a config file or API to change scenario dynamically
            now = datetime.datetime.utcnow()
            
            readings = scenario.step()
            
            payload = {
                "timestamp": now.isoformat() + "Z",
                "scenario": current_scenario_name,
                "readings": readings
            }
            
            await kafka_pub.publish(payload)
            redis_pub.publish(payload)
            
            logger.info("Published readings", scenario=current_scenario_name, count=len(readings))
            
            if (now - last_report_time).total_seconds() >= 60:
                await report_scenario(client, current_scenario_name)
                last_report_time = now
                
            await asyncio.sleep(settings.SIMULATOR_INTERVAL_SECONDS)
            
    except asyncio.CancelledError:
        pass
    finally:
        await kafka_pub.disconnect()
        await client.aclose()

if __name__ == "__main__":
    asyncio.run(main())
