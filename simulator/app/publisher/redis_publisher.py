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
                self.r = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)
            except Exception as e:
                logger.error("Failed to connect to Redis", error=str(e))
                
    def publish(self, payload: dict):
        if self.r:
            try:
                for reading in payload.get('readings', []):
                    tag = reading['tag']
                    self.r.setex(f"sensor:{tag}", 30, json.dumps(reading))
            except Exception as e:
                logger.error("Redis error", error=str(e))
