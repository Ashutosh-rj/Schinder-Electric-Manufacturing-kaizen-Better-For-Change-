from fastapi import APIRouter
from app.api import health_score, anomaly, failure_risk, training

api_router = APIRouter()
api_router.include_router(health_score.router, tags=["health"])
api_router.include_router(anomaly.router, tags=["anomaly"])
api_router.include_router(failure_risk.router, tags=["failure"])
api_router.include_router(training.router, tags=["training"])
