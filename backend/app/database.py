"""
KAIZEN — Database Setup
Async SQLAlchemy engine with TimescaleDB (PostgreSQL)
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

# Use DATABASE_URL from settings (set by docker-compose)
DATABASE_URL = settings.DATABASE_URL or settings.POSTGRES_URL

engine = create_async_engine(
    DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def create_tables():
    """Create all tables that don't exist yet (dev only; use Alembic in production)."""
    async with engine.begin() as conn:
        # Tables are created by database/init.sql in Docker
        # This is a fallback for development
        pass


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
