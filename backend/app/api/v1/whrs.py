from fastapi import APIRouter

router = APIRouter()

@router.get("")
async def get_whrs():
    return {
        "generation_mw": 4.2,
        "efficiency_pct": 78.3,
        "target_mw": 5.0,
        "deviation_pct": -16.0,
        "available_heat_gj_h": 28.5,
        "recovered_heat_gj_h": 22.3,
        "co2_avoided_today": 12.3,
        "lost_generation_mw": 0.8,
        "trend": [{"time": "2024-01-01T00:00:00Z", "value": 4.2}]
    }
