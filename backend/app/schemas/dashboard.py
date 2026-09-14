from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class DepartmentKPI(BaseModel):
    code: str
    name: str
    status: str
    production_tph: float
    power_kw: float
    health: float
    active_alarms: int
    efficiency_pct: float

class ProductionOverview(BaseModel):
    clinker_tph: float
    cement_tph: float
    today_clinker_tons: float
    today_cement_tons: float
    target_tph: float
    efficiency_pct: float

class EnergyOverview(BaseModel):
    total_power_mw: float
    sec_kwh_ton_clinker: float
    sec_kwh_ton_cement: float
    target_sec: float
    whrs_generation_mw: float
    cpp_generation_mw: float
    grid_import_mw: float
    fuel_rate_tph: float
    energy_cost_today: float

class EmissionsOverview(BaseModel):
    co2_intensity_kg_ton: float
    co2_avoided_today: float
    target_co2_intensity: float

class HealthOverview(BaseModel):
    overall_health: float
    critical_equipment_count: int
    at_risk_equipment_count: int

class AlarmsOverview(BaseModel):
    critical: int
    high: int
    medium: int
    low: int
    total_active: int

class TopOpportunity(BaseModel):
    opp_id: str
    title: str
    saving_kwh_day: float
    priority: str

class KaizenOverview(BaseModel):
    open_opportunities: int
    total_potential_saving_today: float
    top_opportunity: TopOpportunity

class DashboardResponse(BaseModel):
    timestamp: datetime
    plant_status: str
    kaizen_score: float
    production: ProductionOverview
    energy: EnergyOverview
    emissions: EmissionsOverview
    equipment_health: HealthOverview
    alarms: AlarmsOverview
    kaizen: KaizenOverview
    departments: List[DepartmentKPI]
