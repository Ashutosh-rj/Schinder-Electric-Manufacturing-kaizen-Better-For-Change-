import os
from pathlib import Path

BASE_DIR = Path(r"D:\Hackthaon\Scnider\Kaizen Changer for Better\kaizen\backend")

def write_file(rel_path, content):
    full_path = BASE_DIR / rel_path
    full_path.parent.mkdir(parents=True, exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

write_file("app/__init__.py", "")
write_file("app/main.py", """
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from app.api.v1.router import api_router
from app.config import settings

app = FastAPI(title="KAIZEN Cement Plant Intelligence", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to settings.ALLOWED_ORIGINS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Instrumentator().instrument(app).expose(app)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
""")

write_file("app/config.py", """
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "KAIZEN"
    POSTGRES_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/kaizen"
    REDIS_URL: str = "redis://localhost:6379/0"
    KAFKA_ENABLED: bool = False
    SECRET_KEY: str = "kaizen123"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()
""")

write_file("app/database.py", """
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

engine = create_async_engine(settings.POSTGRES_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()
""")

write_file("app/dependencies.py", """
from app.database import AsyncSessionLocal
from fastapi import Depends, HTTPException, status

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

def get_current_user():
    return {"username": "admin", "role": "admin"}
""")

print("App setup done.")
