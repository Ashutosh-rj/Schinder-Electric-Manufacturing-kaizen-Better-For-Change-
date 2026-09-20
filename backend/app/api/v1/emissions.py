from fastapi import APIRouter
from app.services.redis_store import get_current_state

router = APIRouter()

@router.get("")
async def get_emissions():
    state = await get_current_state()
    
    # CEA Baseline 2023 for Indian Grid: 0.82 kg CO2 / kWh
    GRID_EMISSION_FACTOR = 0.82 
    # IPCC factor for Coal (approx): 2.6 kg CO2 / kg Coal
    FUEL_EMISSION_FACTOR = 2.6
    # Calcination (Process) Emissions: ~0.525 ton CO2 / ton clinker
    PROCESS_EMISSION_FACTOR = 0.525
    
    power_kw = state.get("PLANT-TOTAL-POWER", 18400.0)
    fuel_tph = state.get("KILN-FUEL", 12.0)
    clinker_tph = state.get("KILN-CLINKER-PROD", 185.0)
    whrs_kw = state.get("WHRS-GENERATION", 4200.0)
    
    # Hourly rates
    electricity_co2_ton_h = (power_kw * GRID_EMISSION_FACTOR) / 1000
    fuel_co2_ton_h = fuel_tph * FUEL_EMISSION_FACTOR
    process_co2_ton_h = clinker_tph * PROCESS_EMISSION_FACTOR
    
    total_co2_ton_h = electricity_co2_ton_h + fuel_co2_ton_h + process_co2_ton_h
    
    # Intensity
    intensity_clinker = (total_co2_ton_h / clinker_tph * 1000) if clinker_tph > 0 else 820.0
    intensity_cement = intensity_clinker * 0.85 # Assume 85% clinker factor
    
    # Avoided CO2
    avoided_co2_whrs_ton_h = (whrs_kw * GRID_EMISSION_FACTOR) / 1000

    return {
        "co2_intensity_kg_ton_clinker": round(intensity_clinker, 1),
        "co2_intensity_kg_ton_cement": round(intensity_cement, 1),
        "target_kg_ton": 800.0,
        "electricity_co2_ton_h": round(electricity_co2_ton_h, 2),
        "fuel_co2_ton_h": round(fuel_co2_ton_h, 2),
        "process_co2_ton_h": round(process_co2_ton_h, 2),
        "total_co2_ton_h": round(total_co2_ton_h, 2),
        "avoided_co2_whrs_ton_h": round(avoided_co2_whrs_ton_h, 2),
        "avoided_co2_efficiency": 8.5, # Placeholder for optimization impact
        "renewable_contribution_pct": round((whrs_kw / power_kw * 100) if power_kw > 0 else 0, 1),
        "factors_used": {
            "grid_electricity": f"{GRID_EMISSION_FACTOR} kgCO2/kWh (Source: CEA)",
            "fuel_coal": f"{FUEL_EMISSION_FACTOR} kgCO2/kg (Source: IPCC)",
            "calcination": f"{PROCESS_EMISSION_FACTOR} tCO2/tClinker"
        }
    }
