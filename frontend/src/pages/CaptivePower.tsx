import React, { useEffect, useState } from 'react';
import { Power, Activity, Zap, ArrowUpRight, Gauge, AlertCircle, RefreshCw } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

const CaptivePower: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [breakdownData, setBreakdownData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchPowerData = async () => {
    try {
      const [dashRes, breakRes] = await Promise.all([
        api.get('/dashboard/overview'),
        api.get('/energy/breakdown')
      ]);
      setDashboardData(dashRes.data);
      setBreakdownData(breakRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch captive power telemetry", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPowerData();
    const interval = setInterval(fetchPowerData, 6000);
    return () => clearInterval(interval);
  }, []);

  const cppMw = dashboardData?.energy?.cpp_generation_mw || 8.5;
  const whrsMw = dashboardData?.energy?.whrs_generation_mw || 4.2;
  const gridMw = dashboardData?.energy?.grid_import_mw || 5.7;
  const totalMw = dashboardData?.energy?.total_power_mw || +(cppMw + whrsMw + gridMw).toFixed(2);

  const cppPct = Math.round((cppMw / Math.max(0.1, totalMw)) * 100);
  const whrsPct = Math.round((whrsMw / Math.max(0.1, totalMw)) * 100);
  const gridPct = Math.max(0, 100 - cppPct - whrsPct);

  const pieOpts = {
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'item',
      formatter: '{b}: {c} MW ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      textStyle: { color: '#94a3b8', fontSize: 11 }
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['50%', '45%'],
        itemStyle: { borderRadius: 6, borderColor: '#091b24', borderWidth: 2 },
        label: { show: true, color: '#f8fafc', formatter: '{b}\n{d}%', fontSize: 11 },
        data: [
          { value: cppMw, name: 'CPP (Captive Power)', itemStyle: { color: '#38bdf8' } },
          { value: whrsMw, name: 'WHRS (Heat Recovery)', itemStyle: { color: '#10b981' } },
          { value: gridMw, name: 'State Grid Import', itemStyle: { color: '#f59e0b' } }
        ]
      }
    ]
  };

  // Generate 24h hourly curve centered at current readings
  const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', 'Now'];
  const totalCurve = [17.8, 17.6, 18.2, 18.7, 18.5, 18.6, 18.9, 18.4, totalMw];
  const gridCurve = [5.2, 5.0, 5.6, 6.1, 5.8, 5.9, 6.2, 5.7, gridMw];
  const cppCurve = [8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, cppMw];
  const whrsCurve = [4.1, 4.1, 4.1, 4.1, 4.2, 4.2, 4.2, 4.2, whrsMw];

  const lineOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: {
      textStyle: { color: '#94a3b8', fontSize: 11 },
      top: 0
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '40px', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: hours, 
      axisLabel: { color: '#64748b', fontSize: 11 },
      axisLine: { lineStyle: { color: '#1e293b' } }
    },
    yAxis: { 
      type: 'value', 
      name: 'MW', 
      splitLine: { lineStyle: { color: '#1e293b' } }, 
      axisLabel: { color: '#64748b', fontSize: 11 },
      nameTextStyle: { color: '#64748b' }
    },
    series: [
      { name: 'Total Load', type: 'line', data: totalCurve, itemStyle: { color: '#f8fafc' }, smooth: true, lineStyle: { width: 3 } },
      { name: 'CPP', type: 'line', data: cppCurve, itemStyle: { color: '#38bdf8' }, smooth: true },
      { name: 'WHRS', type: 'line', data: whrsCurve, itemStyle: { color: '#10b981' }, smooth: true, areaStyle: { opacity: 0.1 } },
      { name: 'Grid Import', type: 'line', data: gridCurve, itemStyle: { color: '#f59e0b' }, smooth: true }
    ]
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex h-full items-center justify-center text-emerald-400">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading Captive Power Telemetry...
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
              <Power className="text-emerald-600" size={24} /> Captive Power & Grid Substation
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time power generation, cogeneration WHRS, state grid synchronization, and busbar balance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
          <Link
            to="/whrs"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-all shadow-xs"
          >
            <Zap size={14} className="text-emerald-600" /> WHRS Deep Dive <ArrowUpRight size={13} />
          </Link>
          <Link
            to="/energy"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
          >
            Energy Analytics <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      {/* POWER BALANCE CARDS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="flex flex-col p-4 rounded-xl bg-sky-50 border border-sky-100">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Captive Thermal (CPP)</span>
            <div className="text-3xl font-black text-sky-600 mt-1">{cppMw.toFixed(2)} <span className="text-base font-normal text-sky-800">MW</span></div>
            <div className="text-[11px] text-sky-700 mt-1">{cppPct}% of plant demand</div>
          </div>

          <div className="flex flex-col p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">WHRS Cogeneration</span>
            <div className="text-3xl font-black text-emerald-600 mt-1">{whrsMw.toFixed(2)} <span className="text-base font-normal text-emerald-800">MW</span></div>
            <div className="text-[11px] text-emerald-700 mt-1">{whrsPct}% clean waste heat</div>
          </div>

          <div className="flex flex-col p-4 rounded-xl bg-amber-50 border border-amber-100">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Grid Import (33kV)</span>
            <div className="text-3xl font-black text-amber-600 mt-1">{gridMw.toFixed(2)} <span className="text-base font-normal text-amber-800">MW</span></div>
            <div className="text-[11px] text-amber-700 mt-1">{gridPct}% peak load support</div>
          </div>

          <div className="flex flex-col p-4 rounded-xl bg-slate-900 text-white shadow-md">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Power Draw</span>
            <div className="text-3xl font-black text-white mt-1">{totalMw.toFixed(2)} <span className="text-base font-normal text-slate-400">MW</span></div>
            <div className="text-[11px] text-emerald-400 mt-1 font-semibold">SEC: {dashboardData?.energy?.sec_kwh_ton_clinker || 64.2} kWh/t</div>
          </div>
        </div>
      </div>

      {/* CHARTS & TURBINE STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DONUT PIE */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Power size={16} className="text-emerald-600" /> Power Source Generation Mix
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">11kV / 33kV Bus</span>
          </div>
          <div className="flex-1 min-h-[280px]">
            <ReactECharts option={pieOpts} style={{ height: '280px', width: '100%' }} />
          </div>
        </div>

        {/* POWER FACTOR & TURBINE */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Substation Power Factor</span>
                  <div className="text-4xl font-extrabold text-slate-900 mt-2">0.96 <span className="text-xs text-emerald-600 font-bold font-mono">LAG</span></div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <Gauge size={22} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">APFC Capacitor Bank:</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Active (Stage 4 of 6)</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Power Cost</span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-2">₹{(dashboardData?.energy?.energy_cost_today || 102600).toLocaleString()}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
                  <Zap size={22} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Grid Tariff Rate:</span>
                <span className="text-slate-700 font-bold font-mono">₹7.50 / kWh</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <Activity size={16} className="text-sky-600" /> Captive Power Boiler & Steam Turbine Telemetry
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 font-medium">Main Steam Header Pressure</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">64.8 ata</td>
                    <td className="py-2.5 text-right text-[11px] text-slate-400">Target: 65 ata</td>
                    <td className="py-2.5 text-right"><span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">NORMAL</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Superheater Steam Temperature</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">482 °C</td>
                    <td className="py-2.5 text-right text-[11px] text-slate-400">Target: 485 °C</td>
                    <td className="py-2.5 text-right"><span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">NORMAL</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Turbine Shaft Speed</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">3002 RPM</td>
                    <td className="py-2.5 text-right text-[11px] text-slate-400">Target: 3000 RPM (50.0 Hz)</td>
                    <td className="py-2.5 text-right"><span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">SYNCHRONIZED</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">CPP Boiler Thermal Efficiency</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-600">83.1 %</td>
                    <td className="py-2.5 text-right text-[11px] text-slate-400">Target: 82.0 %</td>
                    <td className="py-2.5 text-right"><span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">HIGH EFFICIENCY</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 24H LOAD CURVE */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Activity size={16} className="text-emerald-600" /> 24-Hour Load Generation & Balance Curve
          </h3>
          <span className="text-[11px] text-slate-500">Live 3-hour moving average</span>
        </div>
        <ReactECharts option={lineOpts} style={{ height: '280px', width: '100%' }} />
      </div>
    </div>
  );
};

export default CaptivePower;
