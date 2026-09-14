import json
from aiokafka import AIOKafkaProducer
import structlog
from app.config import settings

logger = structlog.get_logger()

class KafkaPublisher:
    def __init__(self):
        self.producer = None
        if settings.KAFKA_ENABLED:
            self.producer = AIOKafkaProducer(
                bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            
    async def connect(self):
        if self.producer:
            await self.producer.start()
            logger.info("Connected to Kafka")
            
    async def disconnect(self):
        if self.producer:
            await self.producer.stop()
            
    async def publish(self, payload: dict):
        if self.producer:
            try:
                await self.producer.send_and_wait(settings.KAFKA_TOPIC, payload)
            except Exception as e:
                logger.error("Failed to publish to Kafka", error=str(e))
