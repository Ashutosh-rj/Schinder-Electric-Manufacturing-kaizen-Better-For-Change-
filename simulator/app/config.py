from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SIMULATOR_INTERVAL_SECONDS: int = 5
    SIMULATOR_SCENARIO: str = "normal"
    KAFKA_ENABLED: bool = True
    KAFKA_BOOTSTRAP_SERVERS: str = "kafka:9092"
    KAFKA_TOPIC: str = "plant.telemetry"
    REDIS_ENABLED: bool = True
    REDIS_URL: str = "redis://redis:6379/0"
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379
    SCENARIO_API_URL: str = "http://backend:8000/api/v1/simulator/scenario"
    DATABASE_URL: str = "postgresql+asyncpg://kaizen:kaizen_secret@postgres:5432/kaizen"

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

settings = Settings()

