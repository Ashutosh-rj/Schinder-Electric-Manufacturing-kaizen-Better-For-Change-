"""
Kaizen Opportunity Worker — Refreshes opportunity rankings every 5 minutes.
Reads live plant state from Redis, runs the SLSQP optimizer, computes energy savings,
and writes ranked Kaizen opportunities back to Redis.
"""
import asyncio
import logging
from datetime import datetime, timezone

from app.services.redis_store import (
    get_current_state,
    set_kaizen_opportunities,
)
from app.services.optimization_service import run_plant_optimization
from app.config import settings

logger = logging.getLogger("kaizen.kaizen_worker")

_opp_counter = 3000


def _next_id() -> int:
    global _opp_counter
    _opp_counter += 1
    return _opp_counter


def _compute_opportunities(state: dict, opt_result: dict) -> list:
    """Compare current state to optimized state, produce opportunity list."""
    costs = {
        "elec": settings.ENERGY_COST_PER_KWH,
        "fuel": settings.FUEL_COST_PER_GJ,
        "co2_factor_coal": settings.CO2_EMISSION_FACTOR_COAL,
        "co2_factor_grid": settings.CO2_EMISSION_FACTOR_GRID,
        "co2_price": 1.0,
    }

    opportunities = []
    now = datetime.now(timezone.utc).isoformat()

    if not opt_result.get("success"):
        logger.warning("Optimizer did not converge, skipping Kaizen update")
        return []

    opt_params = opt_result.get("optimized_params", {})

    # ── 1. Cement Mill Fan Speed Optimization ──────────────────────────────
    current_fan = state.get("CM-FAN-SPEED", 100.0)
    opt_fan = opt_params.get("cm_fan_speed", current_fan)
    if opt_fan < current_fan - 2.0:  # meaningful improvement
        # Fan power scales with cube of speed (affinity law)
        current_power_cm = state.get("CM-POWER", 5200)
        opt_power_cm = current_power_cm * (opt_fan / current_fan) ** 3
        power_saved_kw = current_power_cm - opt_power_cm
        saving_kwh_day = power_saved_kw * 24
        saving_inr_day = saving_kwh_day * costs["elec"]
        opportunities.append({
            "id": f"KAI-{_next_id()}",
            "title": "Cement Mill Fan Speed Optimization",
            "department": "CEMENT_MILL",
            "description": (
                f"Reduce CM fan speed from {current_fan:.0f}% to {opt_fan:.0f}%. "
                f"Fan power reduces by cube law (affinity law)."
            ),
            "current_value": f"Fan Speed: {current_fan:.0f}%",
            "target_value": f"Fan Speed: {opt_fan:.0f}%",
            "action": f"Set CM fan speed setpoint to {opt_fan:.0f}%",
            "saving_kw": round(power_saved_kw, 1),
            "saving_kwh_day": round(saving_kwh_day, 0),
            "saving_inr_day": round(saving_inr_day, 0),
            "co2_reduction_t_day": round(saving_kwh_day * costs["co2_factor_grid"] / 1000, 2),
            "priority": "HIGH" if saving_inr_day > 5000 else "MEDIUM",
            "effort": "LOW",
            "payback_days": 0,  # Software only
            "advisory": True,
            "created_at": now,
        })

    # ── 2. Fuel Rate Optimization ───────────────────────────────────────────
    current_fuel = state.get("KILN-FUEL", 12.0)
    opt_fuel = opt_params.get("fuel_rate", current_fuel)
    if opt_fuel < current_fuel - 0.3:
        fuel_saved_tph = current_fuel - opt_fuel
        # ~4000 kcal/kg for coal, cost in INR/GJ
        fuel_gj_day = fuel_saved_tph * 24 * 27.5  # ~27.5 GJ/ton coal
        saving_inr_day = fuel_gj_day * costs["fuel"]
        opportunities.append({
            "id": f"KAI-{_next_id()}",
            "title": "Kiln Fuel Rate Optimization",
            "department": "PYROPROCESS",
            "description": (
                f"Reduce kiln fuel rate from {current_fuel:.1f} to {opt_fuel:.1f} t/h "
                f"while maintaining clinker quality (BZT within spec)."
            ),
            "current_value": f"Fuel Rate: {current_fuel:.1f} t/h",
            "target_value": f"Fuel Rate: {opt_fuel:.1f} t/h",
            "action": f"Trim fuel flow setpoint to {opt_fuel:.1f} t/h — monitor BZT and O2",
            "saving_kw": 0,
            "saving_kwh_day": 0,
            "saving_inr_day": round(saving_inr_day, 0),
            "co2_reduction_t_day": round(fuel_saved_tph * 24 * costs["co2_factor_coal"] / 1000, 2),
            "priority": "HIGH" if saving_inr_day > 10000 else "MEDIUM",
            "effort": "MEDIUM",
            "payback_days": 0,
            "advisory": True,
            "created_at": now,
        })

    # ── 3. WHRS Efficiency Improvement ─────────────────────────────────────
    current_whrs_gen = state.get("WHRS-GENERATION", 4200.0)
    current_whrs_eff = state.get("WHRS-EFFICIENCY", 0.80)
    opt_whrs_eff = opt_params.get("whrs_efficiency", current_whrs_eff)
    if opt_whrs_eff > current_whrs_eff + 0.02:
        potential_gen_kw = current_whrs_gen * (opt_whrs_eff / max(current_whrs_eff, 0.01))
        extra_kw = potential_gen_kw - current_whrs_gen
        saving_inr_day = extra_kw * 24 * costs["elec"]
        opportunities.append({
            "id": f"KAI-{_next_id()}",
            "title": "WHRS Generation Improvement",
            "department": "WHRS",
            "description": (
                f"Improve WHRS boiler efficiency from {current_whrs_eff*100:.0f}% to "
                f"{opt_whrs_eff*100:.0f}% via soot blowing and heat exchanger maintenance."
            ),
            "current_value": f"WHRS Gen: {current_whrs_gen/1000:.2f} MW",
            "target_value": f"WHRS Gen: {potential_gen_kw/1000:.2f} MW",
            "action": "Schedule boiler soot blowing and inspect heat exchangers",
            "saving_kw": round(extra_kw, 1),
            "saving_kwh_day": round(extra_kw * 24, 0),
            "saving_inr_day": round(saving_inr_day, 0),
            "co2_reduction_t_day": round(extra_kw * 24 * costs["co2_factor_grid"] / 1000, 2),
            "priority": "MEDIUM",
            "effort": "MEDIUM",
            "payback_days": 30,
            "advisory": True,
            "created_at": now,
        })

    # ── 4. SEC Alert ────────────────────────────────────────────────────────
    total_power = state.get("PLANT-TOTAL-POWER", 18400)
    clinker_prod = state.get("KILN-CLINKER-PROD", 185)
    if clinker_prod > 0:
        sec = total_power / clinker_prod
        if sec > 65.0:  # BAT benchmark
            excess_kwh = (sec - 62.0) * clinker_prod
            saving_inr_day = excess_kwh * 24 * costs["elec"]
            opportunities.append({
                "id": f"KAI-{_next_id()}",
                "title": "Specific Energy Consumption Above BAT Benchmark",
                "department": "PLANT",
                "description": (
                    f"Plant SEC is {sec:.1f} kWh/t vs BAT benchmark of 62.0 kWh/t. "
                    f"Combined cross-department optimization needed."
                ),
                "current_value": f"SEC: {sec:.1f} kWh/t clinker",
                "target_value": "SEC: 62.0 kWh/t clinker",
                "action": "Implement combined fan + kiln + mill optimizations above",
                "saving_kw": round(excess_kwh, 1),
                "saving_kwh_day": round(excess_kwh * 24, 0),
                "saving_inr_day": round(saving_inr_day, 0),
                "co2_reduction_t_day": round(excess_kwh * 24 * costs["co2_factor_grid"] / 1000, 2),
                "priority": "HIGH",
                "effort": "HIGH",
                "payback_days": 0,
                "advisory": True,
                "created_at": now,
            })

    # Sort by saving_inr_day descending
    opportunities.sort(key=lambda x: x.get("saving_inr_day", 0), reverse=True)
    return opportunities


async def start_kaizen_worker():
    """Periodically refresh Kaizen opportunity scoring. Runs every 5 minutes."""
    logger.info("Kaizen opportunity worker started")
    await asyncio.sleep(30)  # Let Redis populate first

    costs = {
        "elec": settings.ENERGY_COST_PER_KWH,
        "fuel": settings.FUEL_COST_PER_GJ,
        "co2_factor_coal": settings.CO2_EMISSION_FACTOR_COAL,
        "co2_factor_grid": settings.CO2_EMISSION_FACTOR_GRID,
        "co2_price": 1.0,
    }

    while True:
        try:
            state = await get_current_state()

            if not state:
                logger.debug("No plant state available yet, skipping Kaizen refresh")
                await asyncio.sleep(60)
                continue

            # Build current_state for optimizer
            current = {
                "kiln_feed": state.get("KILN-FEED", 280.0),
                "kiln_speed": state.get("KILN-SPEED", 3.2),
                "fuel_rate": state.get("KILN-FUEL", 12.0),
                "cm_fan_speed": state.get("CM-FAN-SPEED", 100.0),
                "whrs_efficiency": state.get("WHRS-EFFICIENCY", 0.80),
            }

            constraints = {
                "min_production": max(state.get("KILN-CLINKER-PROD", 170.0) * 0.95, 160.0),
                "min_bzt": 1400.0,
            }

            opt_result = run_plant_optimization(current, constraints, costs)
            opportunities = _compute_opportunities(state, opt_result)

            if opportunities:
                await set_kaizen_opportunities(opportunities)
                total_saving = sum(o.get("saving_inr_day", 0) for o in opportunities)
                logger.info(
                    f"Kaizen refresh: {len(opportunities)} opportunities, "
                    f"total potential saving ₹{total_saving:.0f}/day"
                )
            else:
                logger.debug("No Kaizen opportunities identified in this cycle")

            await asyncio.sleep(300)  # 5 minutes

        except asyncio.CancelledError:
            logger.info("Kaizen worker cancelled")
            break
        except Exception as e:
            logger.error(f"Kaizen worker error: {e}")
            await asyncio.sleep(60)
