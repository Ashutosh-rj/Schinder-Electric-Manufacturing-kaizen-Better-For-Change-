"""
KAIZEN Backend — FastAPI Application
"""
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from app.api.v1.router import api_router
from app.config import settings

logger = logging.getLogger("kaizen")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("KAIZEN Backend starting up...")
    # Startup: import and start background workers
    try:
        from app.workers.kafka_consumer import start_kafka_consumer
        from app.workers.alarm_worker import start_alarm_worker
        from app.workers.anomaly_worker import start_anomaly_worker
        from app.workers.kaizen_worker import start_kaizen_worker
        from app.services.opcua_client import opcua_manager
        
        # Connect to DCS
        await opcua_manager.connect()
        
        tasks = []
        if getattr(settings, "KAFKA_ENABLED", True):
            tasks.append(asyncio.create_task(start_kafka_consumer()))
        tasks.append(asyncio.create_task(start_alarm_worker()))
        tasks.append(asyncio.create_task(start_anomaly_worker()))
        tasks.append(asyncio.create_task(start_kaizen_worker()))
        logger.info(f"Started {len(tasks)} background workers")
    except Exception as e:
        logger.warning(f"Some workers failed to start: {e}")
        tasks = []
    yield
    for t in tasks:
        t.cancel()
    
    try:
        from app.services.opcua_client import opcua_manager
        await opcua_manager.disconnect()
    except Exception as e:
        logger.warning(f"Failed to disconnect from DCS: {e}")
        
    logger.info("KAIZEN Backend shut down")


app = FastAPI(
    title="KAIZEN — Change for Better",
    description="AI-Powered Integrated Cement Plant Intelligence Platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production via settings
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Instrumentator().instrument(app).expose(app)

app.include_router(api_router, prefix="/api/v1")

# Include WebSocket router if available
try:
    from app.websocket.telemetry_ws import websocket_router
    app.include_router(websocket_router)
except ImportError:
    pass


@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "ok", "service": "kaizen-backend", "version": "1.0.0"}


@app.get("/ready", tags=["System"])
async def readiness():
    return {"status": "ready"}
