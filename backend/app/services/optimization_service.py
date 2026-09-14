"""
Optimization Service
Optimizes the entire plant minimizing cost while respecting constraints.
"""
import numpy as np
from scipy.optimize import minimize

def objective_function(x, costs):
    """
    Minimizes: Electricity Cost + Fuel Cost + CO2 Cost
    x = [kiln_feed, kiln_speed, fuel_rate, cm_fan_speed, whrs_efficiency]
    """
    kiln_feed, kiln_speed, fuel_rate, cm_fan_speed, whrs_efficiency = x
    
    # Simple correlated plant model for optimization
    kiln_power = 2800 + kiln_feed * 1.5 + kiln_speed * 200
    cm_power = 5200 * (cm_fan_speed / 100)**3 # affinity laws
    total_power = kiln_power + cm_power + 2800 # + aux
    
    # WHRS generation based on cooler exhaust (which depends on feed/fuel)
    cooler_temp = 1380 * 0.35
    whrs_power = (cooler_temp * kiln_feed * 0.0015) * 0.35 * whrs_efficiency
    
    grid_import = max(0, total_power - whrs_power - 8500) # assuming 8.5MW CPP
    
    elec_cost = grid_import * costs['elec']
    fuel_cost = fuel_rate * costs['fuel']
    
    # CO2 calculation
    co2_fuel = fuel_rate * costs['co2_factor_coal']
    co2_elec = grid_import * costs['co2_factor_grid']
    co2_cost = (co2_fuel + co2_elec) * costs['co2_price']
    
    return elec_cost + fuel_cost + co2_cost

def run_plant_optimization(current_state, constraints, costs):
    """
    Runs the global plant optimization.
    """
    # Initial guess
    x0 = np.array([
        current_state.get('kiln_feed', 280),
        current_state.get('kiln_speed', 3.2),
        current_state.get('fuel_rate', 12),
        current_state.get('cm_fan_speed', 100),
        current_state.get('whrs_efficiency', 0.8)
    ])
    
    # Bounds
    bounds = [
        (250, 320),    # kiln_feed
        (2.5, 4.0),    # kiln_speed
        (10, 15),      # fuel_rate
        (70, 100),     # cm_fan_speed
        (0.6, 0.95)    # whrs_efficiency (can be improved via soot blowing etc)
    ]
    
    # Production constraint
    def prod_constraint(x):
        return (x[0] * 0.655) - constraints.get('min_production', 170)
        
    # Quality constraint (rough proxy via temp)
    def quality_constraint(x):
        bzt = 1380 + x[0]*0.15 + x[2]*5
        return bzt - constraints.get('min_bzt', 1400)
        
    cons = [
        {'type': 'ineq', 'fun': prod_constraint},
        {'type': 'ineq', 'fun': quality_constraint}
    ]
    
    res = minimize(
        objective_function,
        x0,
        args=(costs,),
        method='SLSQP',
        bounds=bounds,
        constraints=cons
    )
    
    return {
        "success": res.success,
        "objective_value": float(res.fun),
        "optimized_params": {
            "kiln_feed": float(res.x[0]),
            "kiln_speed": float(res.x[1]),
            "fuel_rate": float(res.x[2]),
            "cm_fan_speed": float(res.x[3]),
            "whrs_efficiency": float(res.x[4])
        }
    }
