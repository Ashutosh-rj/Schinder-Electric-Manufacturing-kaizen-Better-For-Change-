from fastapi import APIRouter
from app.schemas.optimization import OptimizationRequest, OptimizationResponse
from app.services.redis_store import get_current_state
from app.config import settings
from scipy.optimize import minimize
import random

router = APIRouter()

@router.post("/run", response_model=OptimizationResponse)
async def run_optimization(req: OptimizationRequest):
    state = await get_current_state()
    
    # Current values
    current_feed = state.get("KILN-FEED", 280.0)
    current_speed = state.get("KILN-SPEED", 3.2)
    current_fuel = state.get("KILN-FUEL", 12.0)
    current_clinker = current_feed * 0.655
    
    # Physics model function to calculate Power and BZT
    def calc_metrics(x):
        feed, speed, fuel = x
        bzt = 1380 + (feed * 0.15) + (fuel * 5)
        power = 2800 + (feed * 1.5) + (speed * 200)
        return power, bzt

    # Objective function: Minimize total power
    def objective(x):
        power, bzt = calc_metrics(x)
        return power

    # Constraints
    def constraint_bzt_min(x):
        # BZT must be >= 1350
        _, bzt = calc_metrics(x)
        return bzt - 1350
        
    def constraint_bzt_max(x):
        # BZT must be <= 1450
        _, bzt = calc_metrics(x)
        return 1450 - bzt
        
    def constraint_production(x):
        # Clinker production must be >= current
        feed = x[0]
        clinker = feed * 0.655
        return clinker - current_clinker

    # Initial guess
    x0 = [current_feed, current_speed, current_fuel]
    
    # Bounds for feed, speed, fuel
    bounds = (
        (current_feed * 0.9, current_feed * 1.1),
        (2.0, 4.5),
        (8.0, 15.0)
    )
    
    constraints = [
        {'type': 'ineq', 'fun': constraint_bzt_min},
        {'type': 'ineq', 'fun': constraint_bzt_max},
        {'type': 'ineq', 'fun': constraint_production}
    ]
    
    # Run optimization
    res = minimize(objective, x0, method='SLSQP', bounds=bounds, constraints=constraints)
    
    opt_feed, opt_speed, opt_fuel = res.x
    opt_power, _ = calc_metrics(res.x)
    current_power, _ = calc_metrics(x0)
    
    # Calculate savings
    power_savings_kw = max(0, current_power - opt_power)
    savings_kwh_day = power_savings_kw * 24
    
    return {
        "id": random.randint(100, 999),
        "status": "converged" if res.success else "failed",
        "objective_value": opt_power,
        "iterations": res.nit,
        "recommendations": [
            {"parameter": "kiln_speed_rpm", "current": round(current_speed, 2), "recommended": round(opt_speed, 2), "unit": "rpm"},
            {"parameter": "kiln_feed_tph", "current": round(current_feed, 2), "recommended": round(opt_feed, 2), "unit": "tph"},
            {"parameter": "kiln_fuel_tph", "current": round(current_fuel, 2), "recommended": round(opt_fuel, 2), "unit": "tph"}
        ],
        "expected_savings": {
            "energy_kwh_day": round(savings_kwh_day, 1),
            "cost_day": round(savings_kwh_day * settings.ENERGY_COST_PER_KWH, 1),
            "co2_tday": round((savings_kwh_day * 0.82) / 1000, 3) # Using CEA baseline 0.82 tCO2/MWh
        }
    }
