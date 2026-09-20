from fastapi import APIRouter
from app.services.redis_store import get_current_state, get_kaizen_opportunities
from app.config import settings

router = APIRouter()

@router.get("/roi")
async def get_business_case():
    state = await get_current_state()
    kaizen_opps = await get_kaizen_opportunities()
    
    # 1. CapEx: Hardware Cost for SME
    sensor_cost = settings.CAPEX_SENSOR_COST
    gateway_cost = settings.CAPEX_GATEWAY_COST
    misc_install = settings.CAPEX_INSTALL_COST
    total_capex = sensor_cost + gateway_cost + misc_install
    
    # 2. OpEx: SaaS Software
    saas_monthly_cost = settings.OPEX_SAAS_MONTHLY
    saas_annual_cost = saas_monthly_cost * 12
    
    # 3. Energy Savings
    # Use ACTUAL identified Kaizen opportunities from the optimizer rather than a flat 10% assumption
    daily_saving_inr = sum(o.get("saving_inr_day", 0) for o in kaizen_opps)
    
    monthly_saving_inr = daily_saving_inr * 30
    annual_saving_inr = monthly_saving_inr * 12
    
    # 4. Payback Period Calculation
    # Monthly cash flow = Monthly savings - Monthly SaaS
    net_monthly_cash_flow = monthly_saving_inr - saas_monthly_cost
    
    payback_months = total_capex / net_monthly_cash_flow if net_monthly_cash_flow > 0 else 999
    
    return {
        "deployment_model": "Edge-to-Cloud SME Retrofit",
        "capex_inr": total_capex,
        "capex_breakdown": {
            "sensors": sensor_cost,
            "edge_gateway": gateway_cost,
            "installation": misc_install
        },
        "opex_annual_inr": saas_annual_cost,
        "energy_savings_annual_inr": round(annual_saving_inr, 2),
        "net_annual_cash_flow_inr": round(annual_saving_inr - saas_annual_cost, 2),
        "payback_period_months": round(payback_months, 1),
        "roi_1_year_pct": round(((annual_saving_inr - saas_annual_cost - total_capex) / total_capex) * 100, 1)
    }
