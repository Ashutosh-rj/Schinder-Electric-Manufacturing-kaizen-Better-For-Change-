import redis
import json
import structlog
from app.config import settings

logger = structlog.get_logger()


class RedisPublisher:
    def __init__(self):
        self.r = None
        if settings.REDIS_ENABLED:
            try:
                self.r = redis.Redis(
                    host=settings.REDIS_HOST,
                    port=settings.REDIS_PORT,
                    db=0,
                    decode_responses=True,
                )
                self.r.ping()
                logger.info("Redis publisher connected", host=settings.REDIS_HOST)
            except Exception as e:
                logger.error("Failed to connect to Redis", error=str(e))

    def publish(self, payload: dict):
        if not self.r:
            return
        try:
            pipe = self.r.pipeline()
            for reading in payload.get("readings", []):
                tag = reading.get("tag", "")
                if tag:
                    pipe.setex(f"sensor:{tag}", 60, json.dumps(reading))
            pipe.execute()
        except Exception as e:
            logger.error("Redis publish error", error=str(e))
