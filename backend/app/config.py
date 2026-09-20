"""
KAIZEN — Application Configuration
Reads from environment variables (set by docker-compose.yml)
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "KAIZEN"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"

    # Security
    SECRET_KEY: str = "changeme-use-a-long-random-string-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 480
    ALGORITHM: str = "HS256"  # alias

    # Database (matches docker-compose env vars)
    DATABASE_URL: str = "postgresql+asyncpg://kaizen:kaizen_secret@postgres:5432/kaizen"
    DATABASE_URL_SYNC: str = "postgresql://kaizen:kaizen_secret@postgres:5432/kaizen"
    POSTGRES_URL: str = "postgresql+asyncpg://kaizen:kaizen_secret@postgres:5432/kaizen"

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # Kafka
    KAFKA_ENABLED: bool = True
    KAFKA_BOOTSTRAP_SERVERS: str = "kafka:9092"
    KAFKA_GROUP_ID: str = "kaizen-backend"

    # MinIO
    MINIO_ENDPOINT: str = "minio:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET_MODELS: str = "kaizen-models"
    MINIO_BUCKET_REPORTS: str = "kaizen-reports"

    # ML Service
    ML_SERVICE_URL: str = "http://ml-service:8001"
    MODEL_PATH: str = "/app/models"

    # Energy Cost Config
    ENERGY_COST_PER_KWH: float = 7.5
    FUEL_COST_PER_GJ: float = 850.0
    CO2_EMISSION_FACTOR_GRID: float = 0.82
    CO2_EMISSION_FACTOR_COAL: float = 95.0

    # Business Case & ROI Config (Default values for SME)
    CAPEX_SENSOR_COST: float = 60000.0       # 5 sensors @ 12k
    CAPEX_GATEWAY_COST: float = 45000.0      # Edge IPC
    CAPEX_INSTALL_COST: float = 25000.0      # Misc installation
    OPEX_SAAS_MONTHLY: float = 35000.0       # Monthly SaaS subscription

    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    # Monitoring
    PROMETHEUS_ENABLED: bool = True

    # Access token expire
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()

