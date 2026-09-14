from fastapi import APIRouter

router = APIRouter()

@router.get("")
async def get_emissions():
    return {
        "co2_intensity_kg_ton_clinker": 820.5,
        "co2_intensity_kg_ton_cement": 720.3,
        "target_kg_ton": 800.0,
        "electricity_co2_today": 45.2,
        "fuel_co2_today": 285.3,
        "total_co2_today": 330.5,
        "avoided_co2_whrs": 12.3,
        "avoided_co2_efficiency": 8.5,
        "renewable_contribution_pct": 22.8
    }
