from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

def get_base_response():
    return {
        "timestamp": datetime.now().isoformat(),
        "data_source": "SIMULATOR",
        "disclaimer": "[SIMULATED DATA] Quality predictions."
    }

@router.get("/rawmeal")
async def get_rawmeal_quality():
    base = get_base_response()
    base.update({
        "chemistry": {"lsf": 98.5, "sm": 2.4, "am": 1.5, "residue_90um_pct": 12.5},
        "status": "ON_TARGET"
    })
    return base

@router.get("/clinker")
async def get_clinker_quality():
    base = get_base_response()
    base.update({
        "quality": {"free_lime_pct": 1.2, "c3s_pct": 58.5, "c2s_pct": 18.2},
        "status": "NORMAL"
    })
    return base

@router.get("/cement")
async def get_cement_quality():
    base = get_base_response()
    base.update({
        "quality": {"blaine_cm2g": 3850, "residue_45um_pct": 8.5, "strength_1d_mpa_pred": 15.5},
        "status": "NORMAL"
    })
    return base

@router.get("/trend")
async def get_quality_trend():
    base = get_base_response()
    base.update({
        "trend_7d": [
            {"date": "2023-09-25", "free_lime_pct": 1.1, "blaine_cm2g": 3820},
            {"date": "2023-09-26", "free_lime_pct": 1.3, "blaine_cm2g": 3840}
        ]
    })
    return base
