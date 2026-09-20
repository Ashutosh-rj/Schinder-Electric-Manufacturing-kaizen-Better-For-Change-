from fastapi import APIRouter
from app.schemas.simulation import SimulationRequest, SimulationResponse
from app.services.redis_store import get_current_state
import random

router = APIRouter()

@router.post("/run", response_model=SimulationResponse)
async def run_simulation(req: SimulationRequest):
    state = await get_current_state()
    
    # Base real values
    base_feed = state.get("KILN-FEED", 280.0)
    base_speed = state.get("KILN-SPEED", 3.2)
    base_fuel = state.get("KILN-FUEL", 12.0)
    
    def simulate_state(feed, speed, fuel):
        clinker = feed * 0.655
        power = 2800 + (feed * 1.5) + (speed * 200)
        sec = power / clinker if clinker > 0 else 0
        co2 = (clinker * 0.52) + (fuel * 2.6) + (power * 0.00082) # Simplified CO2 calc
        return {
            "production_tph": round(clinker, 1),
            "power_kw": round(power, 1),
            "sec": round(sec, 2),
            "co2": round(co2, 1)
        }
        
    baseline_metrics = simulate_state(base_feed, base_speed, base_fuel)
    
    # Apply requested overrides
    sim_feed = req.parameters.get("kiln_feed_tph", base_feed)
    sim_speed = req.parameters.get("kiln_speed_rpm", base_speed)
    sim_fuel = req.parameters.get("kiln_fuel_tph", base_fuel)
    
    simulated_metrics = simulate_state(sim_feed, sim_speed, sim_fuel)
    
    delta = {
        k: round(simulated_metrics[k] - baseline_metrics[k], 2)
        for k in baseline_metrics.keys()
    }
    
    # Assess Risk
    bzt_sim = 1380 + (sim_feed * 0.15) + (sim_fuel * 5)
    quality_risk = "HIGH" if bzt_sim < 1350 or bzt_sim > 1500 else "LOW"
    equipment_risk = "HIGH" if sim_speed > 4.5 or sim_feed > 320 else "LOW"

    return {
        "id": random.randint(1000, 9999),
        "baseline": baseline_metrics,
        "simulated": simulated_metrics,
        "delta": delta,
        "quality_risk": quality_risk,
        "equipment_risk": equipment_risk,
        "confidence": 0.88 if quality_risk == "LOW" else 0.45,
        "disclaimer": "SIMULATED DATA"
    }
