import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Battery, Flame, Zap, AlertCircle, ArrowUpRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

const WHRS: React.FC = () => {
  const [whrsData, setWhrsData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [wRes, dRes] = await Promise.all([
        api.get('/energy/whrs'),
        api.get('/dashboard/overview')
      ]);
      setWhrsData(wRes.data);
      setDashboardData(dRes.data);
    } catch (err) {
      console.error("Failed to fetch WHRS data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 6000);
    return () => clearInterval(interval);
  }, []);

  const genMw = whrsData?.generation_kw ? +(whrsData.generation_kw / 1000).toFixed(2) : (dashboardData?.energy?.whrs_generation_mw || 4.2);
  const targetMw = 5.2;
  const devMw = +(genMw - targetMw).toFixed(2);
  const effPct = whrsData?.efficiency_pct || 81.5;
  const avoidedCo2 = dashboardData?.emissions?.co2_avoided_today || 42.5;
  const boilerStatus = whrsData?.boiler_status || (genMw > 3.5 ? 'NORMAL' : 'DEGRADED');

  const lineOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: '#64748b', fontSize: 11 }, top: 0 },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '35px', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', 'Now'], 
      axisLabel: { color: '#64748b', fontSize: 11 },
      axisLine: { lineStyle: { color: '#e2e8f0' } }
    },
    yAxis: { 
      type: 'value', 
      name: 'MW', 
      splitLine: { lineStyle: { color: '#f1f5f9' } }, 
      axisLabel: { color: '#64748b', fontSize: 11 },
      nameTextStyle: { color: '#64748b' }
    },
    series: [
      { 
        name: 'Actual WHRS Generation', 
        type: 'line', 
        data: [3.8, 3.9, 4.0, 4.1, 4.2, 4.1, 4.3, 4.2, genMw], 
        itemStyle: { color: '#10b981' }, 
        smooth: true, 
        areaStyle: { opacity: 0.15, color: '#10b981' },
        lineStyle: { width: 3 }
      },
      { 
        name: 'Design Target (5.2 MW)', 
        type: 'line', 
        data: [5.2, 5.2, 5.2, 5.2, 5.2, 5.2, 5.2, 5.2, 5.2], 
        itemStyle: { color: '#94a3b8' }, 
        lineStyle: { type: 'dashed', width: 2 } 
      }
    ]
  };

  const sankeyOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [
      {
        type: 'sankey',
        data: [
          { name: 'Kiln Cooler Exhaust' },
          { name: 'Preheater Exit Gas' },
          { name: 'AQC Boiler (Cooler)' },
          { name: 'PH Boiler (Preheater)' },
          { name: 'Common Steam Header' },
          { name: 'Multi-Stage Turbine' },
          { name: 'Alternator / Bus (MW)' }
        ],
        links: [
          { source: 'Kiln Cooler Exhaust', target: 'AQC Boiler (Cooler)', value: 45 },
          { source: 'Preheater Exit Gas', target: 'PH Boiler (Preheater)', value: 55 },
          { source: 'AQC Boiler (Cooler)', target: 'Common Steam Header', value: 42 },
          { source: 'PH Boiler (Preheater)', target: 'Common Steam Header', value: 52 },
          { source: 'Common Steam Header', target: 'Multi-Stage Turbine', value: 94 },
          { source: 'Multi-Stage Turbine', target: 'Alternator / Bus (MW)', value: 88 }
        ],
        lineStyle: { color: 'gradient', curveness: 0.5 },
        itemStyle: { color: '#10b981', borderColor: '#e2e8f0', borderWidth: 1 },
        label: { color: '#1e293b', fontSize: 11, fontWeight: 'bold' }
      }
    ]
  };

  if (loading && !whrsData) {
    return (
      <div className="flex h-full items-center justify-center text-emerald-600">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading Waste Heat Recovery System...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="text-emerald-600" size={24} /> Waste Heat Recovery System (WHRS)
            </h1>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              boilerStatus === 'NORMAL' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              BOILERS: {boilerStatus}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dual boiler waste heat extraction from Kiln Cooler exhaust (AQC) and Preheater tower top gas (PH).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/captive-power"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-all shadow-xs"
          >
            Substation Balance <ArrowUpRight size={13} />
          </Link>
          <Link
            to="/emissions"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
          >
            Emissions Savings <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Generation</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">
            {genMw.toFixed(2)} <span className="text-base font-normal text-slate-500">MW</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-semibold flex items-center gap-1">
            <CheckCircle2 size={12} /> {((genMw / targetMw) * 100).toFixed(0)}% of rated capacity
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thermal Heat Efficiency</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {effPct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Target: &gt; 80.0%</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Design Max Target</div>
          <div className="text-3xl font-extrabold text-slate-700 mt-2">
            {targetMw.toFixed(1)} <span className="text-base font-normal text-slate-500">MW</span>
          </div>
          <div className="text-[11px] text-amber-600 mt-1 font-semibold">
            Deviation: {devMw} MW ({((devMw / targetMw) * 100).toFixed(1)}%)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avoided CO₂ Today</div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-2">
            {avoidedCo2} <span className="text-base font-normal text-slate-500">t CO₂</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">
            ₹{((whrsData?.savings_inr_day) || 312000).toLocaleString()} cost offset
          </div>
        </div>
      </div>

      {/* SANKEY & BOILER TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Zap size={16} className="text-emerald-600" /> Waste Heat Energy Flow & Cogeneration Path
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Sensible Heat Balance</span>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ReactECharts option={sankeyOpts} style={{ height: '300px', width: '100%' }} />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <Flame size={16} className="text-amber-500" /> AQC Boiler (Cooler Exhaust)
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Inlet Gas Temp:</span>
                <span className="font-bold font-mono text-slate-800">328 °C</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Outlet Stack Temp:</span>
                <span className="font-bold font-mono text-slate-800">108 °C</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Steam Evaporation:</span>
                <span className="font-bold font-mono text-emerald-600">12.8 TPH</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Boiler Heat Transfer:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">79.2% OPTIMAL</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <Flame size={16} className="text-sky-500" /> PH Boiler (Preheater Top Gas)
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Inlet Gas Temp:</span>
                <span className="font-bold font-mono text-slate-800">345 °C</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Outlet Exit Gas Temp:</span>
                <span className="font-bold font-mono text-slate-800">205 °C</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Steam Evaporation:</span>
                <span className="font-bold font-mono text-sky-600">15.6 TPH</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Superheated Steam:</span>
                <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">1.8 MPa @ 380°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TREND & ADVISORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Zap size={16} className="text-emerald-600" /> 24-Hour Generation Profile
            </h3>
            <span className="text-[11px] text-slate-400">Turbine Gross Output</span>
          </div>
          <ReactECharts option={lineOpts} style={{ height: '260px', width: '100%' }} />
        </div>

        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-500" /> Lost Generation & Optimization Kaizen
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Currently generating <strong className="text-slate-900">{genMw} MW</strong> vs benchmark achievable <strong className="text-slate-900">{targetMw} MW</strong>. Recoverable variance:
            </p>

            <ul className="text-xs text-slate-600 space-y-2 mt-3 pl-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                <span><strong>Cooler exhaust air balance (-0.6 MW):</strong> Secondary air damper leakage reduces AQC boiler inlet temperature by ~18°C.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                <span><strong>AQC boiler soot deposit (-0.4 MW):</strong> Increase acoustic cleaner cycle frequency to restore heat transfer.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
            <div className="text-[11px] font-bold text-emerald-800">RECOMMENDED KAIZEN ACTION</div>
            <div className="text-xs text-emerald-900 mt-1">
              Trigger soot blow cycle on AQC boiler and trim tertiary air damper to recover ~0.7 MW (₹52,000/day savings).
            </div>
            <Link
              to="/kaizen"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 mt-2"
            >
              Inspect Active Kaizen Opportunities <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WHRS;
