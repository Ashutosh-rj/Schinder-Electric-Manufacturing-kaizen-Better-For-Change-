from fastapi import APIRouter
from app.schemas.energy import SECResponse
import random
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/sec", response_model=SECResponse)
async def get_sec():
    return {
        "current_sec_kwh_ton_clinker": 64.2,
        "current_sec_kwh_ton_cement": 38.5,
        "target_sec": 62.0,
        "best_sec": 59.1,
        "benchmark_sec": 63.0,
        "deviation_pct": 3.5,
        "potential_saving_kwh": 850.0,
        "trend": "increasing",
        "by_department": [
            {"department": "Raw Mill", "sec": 18.5, "target": 17.0},
            {"department": "Kiln", "sec": 28.3, "target": 27.0},
            {"department": "Cement Mill", "sec": 38.5, "target": 36.0}
        ]
    }

@router.get("/breakdown")
async def get_energy_breakdown():
    return {
        "breakdown": [
            {"department": "Raw Mill", "consumption_kwh": 18500, "deviation_pct": 8.8},
            {"department": "Kiln", "consumption_kwh": 28300, "deviation_pct": 4.8},
            {"department": "Cement Mill", "consumption_kwh": 38500, "deviation_pct": 6.9}
        ]
    }

@router.get("/trend")
async def get_energy_trend():
    base_time = datetime.now() - timedelta(hours=24)
    trend = []
    for i in range(24):
        trend.append({
            "time": (base_time + timedelta(hours=i)).isoformat(),
            "sec_kwh_ton": 62.0 + random.uniform(-2, 3)
        })
    return {"trend_24h": trend}

@router.get("/opportunities")
async def get_energy_opportunities():
    return {
        "opportunities": [
            {"id": "KAI-001", "description": "Reduce Raw Mill DP to save fan power", "savings_kwh_day": 1200},
            {"id": "KAI-002", "description": "Optimize Cement Mill Separator speed", "savings_kwh_day": 850}
        ]
    }

@router.get("/whrs")
async def get_whrs_metrics():
    return {
        "generation_kw": 4500,
        "potential_kw": 5200,
        "efficiency_pct": 86.5,
        "boiler_status": "NORMAL",
        "savings_usd_day": 6500
    }
