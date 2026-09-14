export interface DashboardOverview {
  timestamp: string;
  plant_status: 'NORMAL' | 'ATTENTION' | 'CRITICAL';
  kaizen_score: number;
  production: {
    clinker_tph: number;
    cement_tph: number;
    today_clinker_tons: number;
    today_cement_tons: number;
    target_tph: number;
    efficiency_pct: number;
  };
  energy: {
    total_power_mw: number;
    sec_kwh_ton_clinker: number;
    sec_kwh_ton_cement: number;
    target_sec: number;
    whrs_generation_mw: number;
    cpp_generation_mw: number;
    grid_import_mw: number;
    fuel_rate_tph: number;
    energy_cost_today: number;
  };
  emissions: {
    co2_intensity_kg_ton: number;
    co2_avoided_today: number;
    target_co2_intensity: number;
  };
  equipment_health: {
    overall_health: number;
    critical_equipment_count: number;
    at_risk_equipment_count: number;
  };
  alarms: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total_active: number;
  };
  kaizen: {
    open_opportunities: number;
    total_potential_saving_today: number;
    top_opportunity: KaizenOpportunity | null;
  };
  departments: DepartmentStatus[];
}

export interface DepartmentStatus {
  code: string;
  name: string;
  status: 'NORMAL' | 'ATTENTION' | 'CRITICAL';
  production_tph: number;
  power_kw: number;
  health: number;
  active_alarms: number;
  efficiency_pct: number;
}

export interface SensorReading {
  sensor_id: number;
  tag: string;
  name: string;
  value: number;
  unit: string;
  quality: 'GOOD' | 'STALE' | 'MISSING' | 'SUSPECT' | 'OUT_OF_RANGE';
  timestamp: string;
  equipment_code: string;
  department_code: string;
}

export interface SECData {
  current_sec_kwh_ton_clinker: number;
  current_sec_kwh_ton_cement: number;
  target_sec: number;
  best_sec: number;
  benchmark_sec: number;
  deviation_pct: number;
  potential_saving_kwh: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  by_department: Array<{ department: string; sec: number; target: number }>;
}

export interface KaizenOpportunity {
  id: number;
  opp_id: string;
  department_code: string;
  equipment_code?: string;
  title: string;
  problem: string;
  root_cause: string;
  potential_energy_saving_kwh_day: number;
  potential_cost_saving_day: number;
  potential_co2_reduction_tday: number;
  implementation_difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
  estimated_roi_days: number;
  confidence: number;
  priority_score: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'DISMISSED';
  created_at: string;
}

export interface Alarm {
  id: number;
  alarm_tag: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: string;
  value: number;
  limit_value: number;
  state: 'ACTIVE' | 'ACKNOWLEDGED' | 'CLEARED';
  raised_at: string;
  acknowledged_at?: string;
  department_code: string;
  equipment_code?: string;
}

export interface OptimizationResult {
  id: number;
  status: string;
  objective_value: number;
  iterations: number;
  recommendations: Array<{
    parameter: string;
    current: number;
    recommended: number;
    unit: string;
  }>;
  expected_savings: {
    energy_kwh_day: number;
    cost_day: number;
    co2_tday: number;
  };
}

export interface SimulationResult {
  id: number;
  baseline: { production_tph: number; power_kw: number; sec: number; co2: number };
  simulated: { production_tph: number; power_kw: number; sec: number; co2: number };
  delta: { power_kw: number; sec: number; co2: number; production_tph: number };
  quality_risk: 'LOW' | 'MEDIUM' | 'HIGH';
  equipment_risk: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  disclaimer: string;
}

export interface CopilotResponse {
  query: string;
  answer: string;
  data_sources: string[];
  data_timestamp: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  related_kaizen: string[];
  disclaimer: string;
}

export interface WHRSData {
  generation_mw: number;
  efficiency_pct: number;
  target_mw: number;
  deviation_pct: number;
  available_heat_gj_h: number;
  recovered_heat_gj_h: number;
  co2_avoided_today: number;
  lost_generation_mw: number;
  trend: Array<{ time: string; value: number }>;
}

export interface EmissionsData {
  co2_intensity_kg_ton_clinker: number;
  co2_intensity_kg_ton_cement: number;
  target_kg_ton: number;
  electricity_co2_today: number;
  fuel_co2_today: number;
  total_co2_today: number;
  avoided_co2_whrs: number;
  avoided_co2_efficiency: number;
  renewable_contribution_pct: number;
}

export interface WebSocketMessage {
  type: string;
  timestamp: string;
  readings: SensorReading[];
  kpis: { production_tph: number; power_mw: number; sec: number };
  active_alarms: number;
  scenario: string;
}
