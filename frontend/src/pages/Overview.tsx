import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Activity, 
  Wind, 
  ArrowRight, 
  TrendingUp,
  Radio,
  Sparkles,
  Sliders,
  Layers,
  Leaf,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Flame,
  Hammer,
  Factory,
  Settings,
  Truck,
  Building2,
  ChevronRight,
  Gauge,
  Clock,
  ExternalLink
} from 'lucide-react';
import { api } from '../lib/api';

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('UNIT-01');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  // Live rolling sparkline telemetry buffers
  const [historicalSeries, setHistoricalSeries] = useState<{
    clinker: number[];
    cement: number[];
    power: number[];
    sec: number[];
  }>({
    clinker: [],
    cement: [],
    power: [],
    sec: []
  });

  // Calculate current active shift dynamically
  const getActiveShift = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return 'Shift A (06:00 - 14:00)';
    if (hour >= 14 && hour < 22) return 'Shift B (14:00 - 22:00)';
    return 'Shift C (22:00 - 06:00)';
  };

  const fetchData = async (unit = selectedUnit) => {
    const t0 = performance.now();
    try {
      const res = await api.get(`/dashboard/overview?unit=${unit}`);
      const t1 = performance.now();
      setLatencyMs(Math.round(t1 - t0));
      setData(res.data);

      // Append live data points to rolling history buffer
      if (res.data?.production && res.data?.energy) {
        setHistoricalSeries(prev => {
          const maxPoints = 12;
          const newClinker = res.data.production.clinker_tph;
          const newCement = res.data.production.cement_tph;
          const newPower = res.data.energy.total_power_mw;
          const newSec = res.data.energy.sec_kwh_ton_clinker;

          const baseClinker = prev.clinker.length > 0 ? prev.clinker : (res.data.kpis?.[0]?.data || [newClinker]);
          const baseCement = prev.cement.length > 0 ? prev.cement : (res.data.kpis?.[1]?.data || [newCement]);
          const basePower = prev.power.length > 0 ? prev.power : (res.data.kpis?.[2]?.data || [newPower]);
          const baseSec = prev.sec.length > 0 ? prev.sec : (res.data.kpis?.[3]?.data || [newSec]);

          return {
            clinker: [...baseClinker.slice(-(maxPoints - 1)), newClinker],
            cement: [...baseCement.slice(-(maxPoints - 1)), newCement],
            power: [...basePower.slice(-(maxPoints - 1)), newPower],
            sec: [...baseSec.slice(-(maxPoints - 1)), newSec],
          };
        });
      }
    } catch (err) {
      console.error("Failed to fetch overview data", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(selectedUnit);
    const interval = setInterval(() => fetchData(selectedUnit), 5000);
    return () => clearInterval(interval);
  }, [selectedUnit]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchData(selectedUnit);
  };

  const handleUnitChange = (unit: string) => {
    setSelectedUnit(unit);
    setIsRefreshing(true);
    fetchData(unit);
  };

  const getSparklineOption = (points: number[], color: string, areaColor: string) => ({
    grid: { top: 2, bottom: 2, left: 0, right: 0 },
    xAxis: { show: false, type: 'category' },
    yAxis: { show: false, type: 'value', min: 'dataMin' },
    series: [{
      data: points && points.length > 0 ? points : [1, 1],
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: { color, width: 2.5 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: areaColor },
            { offset: 1, color: 'transparent' }
          ]
        }
      }
    }]
  });

  if (loading && !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-emerald-100 shadow-xl">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-900 font-extrabold text-sm tracking-wide">Syncing DCS Telemetry</span>
            <span className="text-gray-400 text-xs">Connecting to OPC-UA Gateway...</span>
          </div>
        </div>
      </div>
    );
  }

  const clinkerTph = data?.production?.clinker_tph ?? 18.4;
  const cementTph = data?.production?.cement_tph ?? 18.2;
  const totalPowerMw = data?.energy?.total_power_mw ?? 1.59;
  const secKwhTon = data?.energy?.sec_kwh_ton_clinker ?? 86.3;
  const efficiency = data?.production?.efficiency_pct || 91.9;
  const plantStatus = data?.plant_status || "NORMAL";
  const potentialSavings = data?.kaizen?.total_potential_saving_today ?? 254970;
  const kaizenScore = data?.kaizen_score ?? 84;
  const topOpp = data?.kaizen?.top_opportunity || {
    opp_id: 'KAI-3008',
    title: 'Kiln Fuel Rate Optimization',
    department: 'PYROPROCESS',
    description: 'High secondary air temperature with elevated specific fuel consumption detected at burning zone. Adjust coal firing rate and tertiary air damper.',
    action: 'Trim coal firing rate by 0.4 t/h and stabilize calciner damper setpoint.',
    saving_inr_day: 112200,
    annualized_inr_cr: 4.10,
    confidence: 94,
    priority: 'HIGH'
  };

  // Map departments from live backend
  const deptMap = (data?.departments || []).reduce((acc: any, d: any) => {
    acc[d.code] = d;
    return acc;
  }, {});

  // Plant nodes with rich metadata and direct SCADA twin routing
  const nodes = [
    { 
      name: "Limestone Crusher", 
      displayName: "Crusher & Feeder",
      code: "CRUSHER", 
      scadaArea: "CRUSHER",
      defaultTph: 0.0, 
      icon: Hammer, 
      desc: "Jaw Crusher • Apron Feeder • Baghouse",
      connectedAssets: [
        { label: "Crusher Core", area: "CRUSHER" },
        { label: "Apron Feeder", area: "CRUSHER" },
        { label: "Dust Collector Fan", area: "CRUSHER", isFan: true }
      ]
    },
    { 
      name: "Raw Mill & ID Fan", 
      displayName: "Raw Mill & Fan",
      code: "RAW_MILL", 
      scadaArea: "RAW MILL",
      defaultTph: 19.8, 
      icon: Factory, 
      desc: "VRM Grinding Mill • Process ID Fan",
      connectedAssets: [
        { label: "VRM Drive", area: "RAW MILL" },
        { label: "Process ID Fan", area: "RAW MILL", isFan: true },
        { label: "Meal Silo", area: "RAW MILL" }
      ]
    },
    { 
      name: "Rotary Kiln", 
      displayName: "Kiln & Preheater",
      code: "KILN", 
      scadaArea: "KILN",
      defaultTph: 18.4, 
      icon: Flame, 
      desc: "5-Stage Preheater • Pyroprocess Line",
      connectedAssets: [
        { label: "Preheater Tower", area: "KILN" },
        { label: "Main Kiln Drive", area: "KILN" },
        { label: "Firing Burner", area: "KILN" }
      ]
    },
    { 
      name: "Clinker Cooler", 
      displayName: "Cooler & Fans",
      code: "COOLER", 
      scadaArea: "COOLER",
      defaultTph: 18.4, 
      icon: Wind, 
      desc: "Cross-bar Cooler • Aeration Fans",
      connectedAssets: [
        { label: "Cooler Grates", area: "COOLER" },
        { label: "6x Cooling Fans", area: "COOLER", isFan: true },
        { label: "WHRS Boiler", area: "COOLER", isWhrs: true }
      ]
    },
    { 
      name: "Cement Mill & Fan", 
      displayName: "Cement Mill & Fan",
      code: "CEMENT_MILL", 
      scadaArea: "CEMENT MILL",
      defaultTph: 17.8, 
      icon: Settings, 
      desc: "5,000 kW Ball Mill • Separator Fan",
      connectedAssets: [
        { label: "5,000 kW Ball Mill", area: "CEMENT MILL" },
        { label: "Dynamic Separator", area: "CEMENT MILL" },
        { label: "Process Fan (VFD)", area: "CEMENT MILL", isFan: true }
      ]
    },
    { 
      name: "Packing & Dispatch", 
      displayName: "Packing Plant",
      code: "PACKING", 
      scadaArea: "PACKING",
      defaultTph: 17.8, 
      icon: Truck, 
      desc: "Rotary Electronic Packer & Loading",
      connectedAssets: [
        { label: "Rotary Packer", area: "PACKING" },
        { label: "Bulk Loader", area: "PACKING" }
      ]
    },
  ];

  const powerSources = data?.power_sources || [
    { label: "WHRS Heat Recovery", value: data?.energy?.whrs_generation_mw ?? 0.01, unit: "MW", pct: "1%", color: "#10b981", bg: "bg-emerald-500" },
    { label: "Grid Import", value: data?.energy?.grid_import_mw ?? 0.72, unit: "MW", pct: "46%", color: "#06b6d4", bg: "bg-cyan-500" },
    { label: "Captive Power (CPP)", value: data?.energy?.cpp_generation_mw ?? 0.85, unit: "MW", pct: "53%", color: "#f59e0b", bg: "bg-amber-500" }
  ];

  const recentAnomalies = data?.anomalies?.recent || [];

  return (
    <div className="flex flex-col gap-6 max-w-[1920px] mx-auto pb-12 font-sans">
      
      {/* ── TOP HERO BANNER & CONTROL BAR ────────────────────────── */}
      <div className="bg-gradient-to-r from-gray-900 via-[#0a2318] to-gray-900 text-white rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden border border-emerald-900/30">
        
        {/* Subtle ambient glowing spots */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full"></div>
        <div className="absolute -bottom-10 right-10 w-64 h-64 bg-cyan-500/10 blur-[80px] pointer-events-none rounded-full"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                DCS SYNCED • {latencyMs !== null ? `${latencyMs}ms LATENCY` : 'LIVE'}
              </span>
              <span className="text-gray-400 text-xs font-medium">|</span>
              <span className="text-xs font-semibold text-gray-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {getActiveShift()}
              </span>
              <span className="text-gray-400 text-xs font-medium">|</span>
              <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5" /> Schneider EcoStruxure Connected
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Plant Command Center
              </h1>
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/15">
                {['UNIT-01', 'UNIT-02'].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => handleUnitChange(unit)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedUnit === unit 
                      ? 'bg-emerald-500 text-gray-950 shadow-sm' 
                      : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mt-1 max-w-2xl">
              Continuous thermal & electrical energy optimization across integrated pyroprocessing, grinding, and captive utilities.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => navigate('/digital-twin?area=RAW MILL', { state: { activeArea: 'RAW MILL' } })}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-sm shadow-sm"
              title="Directly open Raw Mill & Process Fan SCADA Screen"
            >
              <Factory className="w-3.5 h-3.5 text-emerald-400" />
              <span>Raw Mill & Fan SCADA</span>
            </button>

            <button 
              onClick={() => navigate('/digital-twin?area=CRUSHER', { state: { activeArea: 'CRUSHER' } })}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-sm shadow-sm"
              title="Directly open Limestone Crusher & Apron Feeder SCADA Screen"
            >
              <Hammer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Crusher SCADA</span>
            </button>

            <button 
              onClick={handleManualRefresh}
              className="bg-white/10 hover:bg-white/15 border border-white/20 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-sm"
              title="Poll latest telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Live Sync'}</span>
            </button>

            <button 
              onClick={() => navigate('/optimization')}
              className="bg-[#00d4ff]/20 hover:bg-[#00d4ff]/30 border border-[#00d4ff]/40 text-[#00d4ff] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-sm"
            >
              <Zap className="w-3.5 h-3.5 text-[#00d4ff]" />
              <span>Speed Optimizer</span>
            </button>

            <button 
              onClick={() => navigate('/kaizen')}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-gray-950 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>View AI Kaizens</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── TOP KPI METRICS GRID ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* KPI 1: Clinker Production */}
        <div 
          onClick={() => navigate('/digital-twin?area=KILN', { state: { activeArea: 'KILN' } })}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group cursor-pointer"
          title="Click to view Kiln Digital Twin"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> {data?.kpis?.[0]?.trend || '+2.1%'}
            </span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Clinker Production</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-gray-900 tracking-tight">{clinkerTph}</span>
              <span className="text-xs font-bold text-gray-400">TPH</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-1 font-medium">
              Target: {data?.production?.target_tph || 20.0} TPH (Kiln Line 1)
            </div>
          </div>
          <div className="h-10 mt-3 -mx-2">
            <ReactECharts 
              option={getSparklineOption(historicalSeries.clinker, '#10b981', 'rgba(16, 185, 129, 0.25)')} 
              style={{ height: '100%', width: '100%' }} 
            />
          </div>
        </div>

        {/* KPI 2: Cement Production */}
        <div 
          onClick={() => navigate('/digital-twin?area=CEMENT MILL', { state: { activeArea: 'CEMENT MILL' } })}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all flex flex-col justify-between group cursor-pointer"
          title="Click to view Cement Mill Digital Twin"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> {data?.kpis?.[1]?.trend || '+21.2%'}
            </span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Cement Production</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-gray-900 tracking-tight">{cementTph}</span>
              <span className="text-xs font-bold text-gray-400">TPH</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-1 font-medium">OPC 53 Grade / Mill 2</div>
          </div>
          <div className="h-10 mt-3 -mx-2">
            <ReactECharts 
              option={getSparklineOption(historicalSeries.cement, '#06b6d4', 'rgba(6, 182, 212, 0.25)')} 
              style={{ height: '100%', width: '100%' }} 
            />
          </div>
        </div>

        {/* KPI 3: Total Power */}
        <div 
          onClick={() => navigate('/energy')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group cursor-pointer"
          title="Click to view Energy Breakdown & WHRS"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 rotate-180" /> {data?.kpis?.[2]?.trend || '↓ 20.7%'}
            </span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Plant Power</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-gray-900 tracking-tight">{totalPowerMw}</span>
              <span className="text-xs font-bold text-gray-400">MW</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-1 font-medium">
              WHRS ({data?.energy?.whrs_generation_mw ?? 0.01} MW) + Grid + CPP
            </div>
          </div>
          <div className="h-10 mt-3 -mx-2">
            <ReactECharts 
              option={getSparklineOption(historicalSeries.power, '#f59e0b', 'rgba(245, 158, 11, 0.25)')} 
              style={{ height: '100%', width: '100%' }} 
            />
          </div>
        </div>

        {/* KPI 4: Specific Energy (SEC) */}
        <div 
          onClick={() => navigate('/optimization')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-violet-300 transition-all flex flex-col justify-between group cursor-pointer"
          title="Click to open Speed Optimizer & Affinity Laws"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
              <Gauge className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> {data?.kpis?.[3]?.trend || '↑ 39.2%'}
            </span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Specific Energy</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-gray-900 tracking-tight">{secKwhTon}</span>
              <span className="text-xs font-bold text-gray-400">kWh/t</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-1 font-medium">
              BAT Target: {data?.energy?.target_sec || 62.0} kWh/t
            </div>
          </div>
          <div className="h-10 mt-3 -mx-2">
            <ReactECharts 
              option={getSparklineOption(historicalSeries.sec, '#8b5cf6', 'rgba(139, 92, 246, 0.25)')} 
              style={{ height: '100%', width: '100%' }} 
            />
          </div>
        </div>

        {/* KPI 5: Plant Efficiency */}
        <div 
          onClick={() => navigate('/oee')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between cursor-pointer group"
          title="Click to view OEE Analytics"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Plant Efficiency</span>
            <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
              efficiency >= 85 
              ? 'text-emerald-700 bg-emerald-50' 
              : efficiency >= 70 
              ? 'text-amber-700 bg-amber-50' 
              : 'text-red-700 bg-red-50'
            }`}>
              {efficiency >= 85 ? 'Optimal' : efficiency >= 70 ? 'Suboptimal' : 'Degraded'}
            </span>
          </div>
          
          <div className="my-auto py-2">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-gray-900 tracking-tight">{efficiency}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full mt-3 overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  efficiency >= 85 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                  : efficiency >= 70 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-400' 
                  : 'bg-gradient-to-r from-red-500 to-rose-400'
                }`}
                style={{ width: `${Math.min(100, efficiency)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold mt-1.5">
              <span>Benchmark 85%</span>
              <span className="text-emerald-700 font-bold">Target 95%</span>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 font-medium">
            Overall Equipment Effectiveness (OEE)
          </div>
        </div>

        {/* KPI 6: Kaizen System Status */}
        <div className="bg-gradient-to-br from-[#0c2518] to-gray-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between border border-emerald-800/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">System Status</span>
              <span className="text-xs font-semibold text-gray-300">Continuous AI Guard</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white leading-none">{kaizenScore}</div>
              <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Kaizen Score</div>
            </div>
          </div>

          <div className="my-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-amber-300 uppercase tracking-wide">
                {plantStatus === 'CRITICAL' ? 'Critical Action' : 'Action Required'}
              </div>
              <div className="text-[11px] text-gray-300">
                Recoverable: <span className="text-white font-bold">₹{potentialSavings.toLocaleString()}/day</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/kaizen')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold py-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Resolve {data?.kaizen?.open_opportunities ?? 1} Opportunity</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ── MAIN INTELLIGENCE ROW: DIGITAL FLOW + ACTION REQUIRED ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: LIVE DIGITAL FLOW PIPELINE */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">Live Digital Flow</h3>
                <p className="text-[11px] text-gray-500 font-medium">Click any unit or connected fan below to directly open its SCADA Digital Twin</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Clickable SCADA Links
              </span>
              <span className="flex items-center gap-1.5 ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Optimal
              </span>
              <span className="flex items-center gap-1.5 ml-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Attention
              </span>
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="p-6 lg:p-8 flex flex-col justify-center relative min-h-[340px] overflow-x-auto">
            
            {/* Animated SVG Connector Pipeline */}
            <div className="absolute top-[35%] left-10 right-10 h-1.5 hidden md:block -z-0">
              <div className="w-full h-full bg-slate-100 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 opacity-60 rounded-full"></div>
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 min-w-[760px] relative z-10">
              {nodes.map((node, i) => {
                const liveDept = deptMap[node.code] || {};
                const nodeTph = liveDept.production_tph !== undefined ? liveDept.production_tph : node.defaultTph;
                const nodePower = liveDept.power_kw !== undefined ? liveDept.power_kw : 0;
                const nodeStatus = liveDept.status || "NORMAL";
                const isWarn = nodeStatus === 'ATTENTION' || nodeStatus === 'CRITICAL';
                const IconComponent = node.icon;
                
                return (
                  <div
                    key={i}
                    onClick={() => {
                      navigate(`/digital-twin?area=${node.scadaArea}`, { state: { activeArea: node.scadaArea } });
                    }}
                    className="flex flex-col items-center group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 max-w-[135px]"
                  >
                    {/* Dept Code & Name */}
                    <div className="text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-2 group-hover:text-emerald-700 transition-colors text-center leading-tight">
                      {node.displayName || node.name}
                    </div>

                    {/* Circular Node Icon Container */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md relative ${
                      isWarn 
                      ? 'bg-amber-500 text-white shadow-amber-500/20 ring-4 ring-amber-100 animate-pulse group-hover:bg-amber-600' 
                      : 'bg-emerald-600 text-white shadow-emerald-600/20 ring-4 ring-emerald-50 group-hover:bg-emerald-700 group-hover:scale-105'
                    }`}>
                      <IconComponent className="w-7 h-7" />
                      {liveDept.active_alarms > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                          {liveDept.active_alarms}
                        </span>
                      )}
                    </div>

                    {/* Production Metric Badge */}
                    <div className="mt-2.5 bg-slate-100/80 group-hover:bg-emerald-50 group-hover:border-emerald-200 border border-slate-200 px-3 py-1 rounded-xl text-center transition-colors">
                      <span className="text-xs font-black text-gray-900 group-hover:text-emerald-800">
                        {nodeTph} <span className="text-[10px] text-gray-500">TPH</span>
                      </span>
                      {nodePower > 0 && (
                        <div className="text-[9px] text-gray-500 font-bold">
                          {nodePower} kW
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="mt-1 text-center">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isWarn 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isWarn ? 'Attention' : 'Running'}
                      </span>
                    </div>

                    {/* Connected Assets Pill Chips */}
                    <div className="mt-2 flex flex-wrap justify-center gap-1 w-full">
                      {node.connectedAssets?.map((asset: any, aIdx: number) => (
                        <button
                          key={aIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (asset.isFan) {
                              navigate('/optimization');
                            } else if (asset.isWhrs) {
                              navigate('/whrs');
                            } else {
                              navigate(`/digital-twin?area=${asset.area}`, { state: { activeArea: asset.area } });
                            }
                          }}
                          title={`Click to directly move to ${asset.label}`}
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-all border text-center ${
                            asset.isFan 
                              ? 'bg-cyan-50 text-cyan-800 border-cyan-300 hover:bg-cyan-200 hover:scale-105' 
                              : asset.isWhrs
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-200 hover:scale-105'
                              : 'bg-slate-50 text-gray-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300'
                          }`}
                        >
                          {asset.isFan ? '💨 ' : asset.isWhrs ? '⚡ ' : ''}{asset.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                      Open SCADA →
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* POWER LAYER & ENERGY MATRIX FOOTER */}
          <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">Live Power Mix</span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {powerSources.map((src: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${src.bg || 'bg-emerald-500'}`}></span>
                  <span className="text-xs font-semibold text-gray-600">{src.label}:</span>
                  <span className="text-xs font-extrabold text-gray-900">{src.value} {src.unit || 'MW'}</span>
                  <span className="text-[10px] font-bold text-gray-400">({src.pct})</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate('/whrs')}
              className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 hover:bg-emerald-200/80 px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open WHRS Heat Recovery Analytics"
            >
              <Leaf className="w-3 h-3" /> WHRS Heat Recovery Active →
            </button>

          </div>

        </div>

        {/* RIGHT COL: HIGH-IMPACT ACTION REQUIRED CARD */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 lg:p-7 border border-slate-200/80 shadow-md relative overflow-hidden flex flex-col justify-between group hover:border-emerald-300 transition-all">
            
            {/* Top ambient highlight */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-100/60 via-transparent to-transparent pointer-events-none rounded-tr-3xl"></div>

            <div className="relative z-10 flex flex-col h-full">
              
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  ACTION REQUIRED • AI ADVISORY
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  PID: {topOpp?.opp_id || 'KAI-3008'}
                </span>
              </div>

              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-snug mb-3">
                {topOpp?.title || 'Kiln Fuel Rate Optimization'}
              </h2>

              <p className="text-xs text-gray-600 leading-relaxed mb-6 font-medium">
                {topOpp?.description || 'High secondary air temperature with elevated specific fuel consumption detected at burning zone. Adjust coal firing rate and tertiary air damper.'}
              </p>

              {/* Impact and Confidence Box */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-gradient-to-r from-slate-50 to-emerald-50/50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
                    Recoverable Impact
                  </span>
                  <div className="text-2xl font-black text-[#106c35]">
                    ₹{(topOpp?.saving_inr_day || 112200).toLocaleString()}
                    <span className="text-[10px] font-bold text-gray-500 ml-1">/DAY</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700">
                    ~₹{topOpp?.annualized_inr_cr ? `${topOpp.annualized_inr_cr} Cr` : `${(((topOpp?.saving_inr_day || 112200) * 365) / 10000000).toFixed(2)} Cr`} Annualized
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
                    AI Confidence
                  </span>
                  <div className="text-2xl font-black text-gray-900 flex items-center gap-1">
                    <span>{topOpp?.confidence || 94}%</span>
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500">Verified via Neural Twin</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex flex-col gap-2.5">
                <button 
                  onClick={() => navigate('/rca', { state: { opportunity: topOpp } })}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-gray-800 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-300 shadow-sm"
                  title="Open 5-Why and Fishbone RCA on this opportunity"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Analyze Root Cause (RCA)</span>
                </button>
                <button 
                  onClick={() => navigate(`/kaizen-projects?id=${topOpp?.opp_id || 'KAI-3002'}`)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 hover:scale-[1.01]"
                  title="Open detailed engineering dossier and action plan for this Kaizen initiative"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Execute Kaizen (Open Project Dossier)</span>
                </button>

              </div>

            </div>
          </div>
        </div>

      </div>

      {/* ── LIVE RECENT ML ANOMALIES & TELEMETRY STREAM ──────────── */}
      {recentAnomalies.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">Live ML Anomaly Stream</h3>
              <span className="text-[11px] text-gray-500 font-medium">(Real-time Isolation Forest & Degradation Predictor)</span>
            </div>
            <button 
              onClick={() => navigate('/predictive-maintenance')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View Predictive Maintenance</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAnomalies.map((anom: any, idx: number) => {
              const isHigh = anom.severity === 'HIGH' || anom.severity === 'CRITICAL';
              return (
                <div 
                  key={idx}
                  onClick={() => navigate('/predictive-maintenance')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-gray-800 font-mono">{anom.tag || 'SYSTEM'}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isHigh ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {anom.severity || 'ATTENTION'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2 font-medium">
                    {anom.message || 'Telemetry anomaly detected'}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold pt-2 border-t border-slate-200/50">
                    <span>{anom.department || 'PLANT'}</span>
                    <span className="text-emerald-600 group-hover:underline flex items-center gap-0.5">
                      Investigate <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default Overview;
