from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://kaizen:kaizen_secret@postgres:5432/kaizen"
    REDIS_URL: str = "redis://redis:6379/0"
    MODEL_DIR: str = "/app/models/"
    MINIO_ENDPOINT: str = "minio:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

settings = Settings()
