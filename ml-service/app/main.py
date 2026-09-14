from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
from app.api.router import api_router
from app.training.trainer import auto_train

app = FastAPI(title="KAIZEN ML Service")

@app.on_event("startup")
async def startup_event():
    import asyncio
    asyncio.create_task(auto_train())

app.include_router(api_router, prefix="/api/v1")

Instrumentator().instrument(app).expose(app)

@app.get("/health")
def health_check():
    return {"status": "healthy"}
