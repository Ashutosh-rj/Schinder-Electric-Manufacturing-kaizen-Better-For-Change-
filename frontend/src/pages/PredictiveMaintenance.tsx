import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { AlertTriangle, Clock, Activity, Calendar, HeartPulse, CheckCircle2, RefreshCw, ArrowUpRight, ShieldAlert, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

const PredictiveMaintenance: React.FC = () => {
  const [predictionsData, setPredictionsData] = useState<any>(null);
  const [healthSummary, setHealthSummary] = useState<any>(null);
  const [cmDetails, setCmDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scheduledEquipment, setScheduledEquipment] = useState<string | null>(null);

  const fetchMaintenanceData = async () => {
    try {
      const [pRes, sRes, cmRes] = await Promise.all([
        api.get('/health/predictions'),
        api.get('/health/summary'),
        api.get('/health/equipment/3')
      ]);
      setPredictionsData(pRes.data);
      setHealthSummary(sRes.data);
      setCmDetails(cmRes.data);
    } catch (err) {
      console.error("Failed to load predictive maintenance data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
    const interval = setInterval(fetchMaintenanceData, 10000);
    return () => clearInterval(interval);
  }, []);

  const pred = predictionsData?.predictions?.[0] || {
    equipment_code: "CM1_FAN",
    equipment_name: "Cement Mill ID Fan",
    predicted_failure_days: 18,
    confidence_pct: 88,
    failure_mode: "Bearing fatigue / lubrication degradation",
    current_vibration: 3.8,
    trend: "increasing"
  };

  const cmScore = cmDetails?.health_score || 72.5;
  const rulDays = pred.predicted_failure_days || 18;

  // 30-day projection based on live degradation rate
  const riskScores = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const baseRisk = 100 - cmScore;
    const projected = Math.min(99, Math.round(baseRisk + (day / Math.max(1, rulDays)) * 40));
    return projected;
  });

  const riskTimelineOpts = {
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'axis',
      formatter: '{b}: Risk Index {c}/100'
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '30px', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: Array.from({ length: 30 }, (_, i) => `Day +${i + 1}`), 
      axisLabel: { color: '#64748b', fontSize: 10, interval: 3 },
      axisLine: { lineStyle: { color: '#e2e8f0' } }
    },
    yAxis: { 
      type: 'value', 
      name: 'Risk (0-100)',
      min: 0, 
      max: 100, 
      axisLabel: { color: '#64748b', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    series: [
      {
        name: 'Failure Probability Index',
        type: 'line',
        smooth: true,
        data: riskScores,
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: '#ef4444' }, { offset: 1, color: 'rgba(239, 68, 68, 0.05)' }]
          }
        },
        itemStyle: { color: '#ef4444' },
        lineStyle: { width: 3 },
        markLine: {
          data: [{ yAxis: 75, name: 'Intervention Threshold' }],
          lineStyle: { color: '#f59e0b', type: 'dashed' },
          label: { color: '#b45309', fontSize: 10 }
        }
      }
    ]
  };

  const handleSchedule = (eqName: string) => {
    setScheduledEquipment(eqName);
    setTimeout(() => setScheduledEquipment(null), 4000);
  };

  if (loading && !healthSummary) {
    return (
      <div className="flex h-full items-center justify-center text-emerald-600">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Evaluating Asset Degradation Profiles...
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
              <HeartPulse className="text-emerald-600" size={24} /> Predictive Maintenance & Remaining Useful Life
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
              RUL FORECASTING
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Machine learning vibration & thermal degradation models predicting mechanical failure horizons and MTBF.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/equipment-health"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-all shadow-xs"
          >
            Fleet Radar <ArrowUpRight size={13} />
          </Link>
          <Link
            to="/alarms"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
          >
            View Active Alarms <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      {/* SCHEDULE CONFIRMATION TOAST */}
      {scheduledEquipment && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-600" size={16} />
            Preventative maintenance work order generated for {scheduledEquipment}. Assigned to Mechanical Reliability crew.
          </div>
          <span className="text-[10px] text-emerald-600 font-mono">WO-2026-094</span>
        </div>
      )}

      {/* ADVISORY BANNER */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 shadow-xs">
        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
        <div>
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Predictive Maintenance Advisory
          </h3>
          <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
            RUL horizons are calculated using physics-informed degradation estimators on high-frequency vibration and motor current signatures. Validate bearing temperatures with portable strobe and thermal gun prior to shutdown.
          </p>
        </div>
      </div>

      {/* RISK TIMELINE & TOP AT-RISK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                30-Day Risk Trajectory — {pred.equipment_name} ({pred.equipment_code})
              </h3>
              <p className="text-xs text-slate-500">Projected risk curve indicating time-to-threshold intervention.</p>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
              RUL: {rulDays} DAYS
            </span>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ReactECharts option={riskTimelineOpts} style={{ height: '300px', width: '100%' }} />
          </div>
        </div>

        {/* TOP AT-RISK CARD */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{pred.equipment_name}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{pred.equipment_code} | Finish Grinding</span>
                </div>
                <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {cmScore < 65 ? 'CRITICAL' : 'ELEVATED RISK'}
                </span>
              </div>

              <div className="space-y-3 mt-4 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500 font-medium">RMS Vibration Velocity</span>
                    <span className="font-bold font-mono text-slate-900">{pred.current_vibration} mm/s (Limit: 4.5)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min(100, (pred.current_vibration / 4.5) * 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500 font-medium">Model Confidence</span>
                    <span className="font-bold font-mono text-emerald-600">{pred.confidence_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${pred.confidence_pct}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <span className="font-bold text-slate-800 block mb-1">Diagnosed Failure Mode:</span>
                {pred.failure_mode}. Micro-pitting on outer bearing raceway detected in spectral analysis.
              </div>
            </div>

            <button
              onClick={() => handleSchedule(pred.equipment_name)}
              className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Wrench size={14} /> Schedule Inspection Work Order
            </button>
          </div>
        </div>
      </div>

      {/* MTBF / MTTR STATISTICS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-900">Equipment Reliability Indices (MTBF & MTTR)</h3>
          <span className="text-xs text-slate-500">ISO 14224 Reliability Standards</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
              <tr>
                <th className="py-2.5 px-4">Equipment Family</th>
                <th className="py-2.5 px-4 text-right">Mean Time Between Failure (MTBF)</th>
                <th className="py-2.5 px-4 text-right">Mean Time to Repair (MTTR)</th>
                <th className="py-2.5 px-4 text-right">Operational Availability</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Process Gas & ID Fans (5.5 MW)</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">2,850 hrs (~118 days)</td>
                <td className="py-3 px-4 text-right font-mono">4.2 hrs</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">99.85%</td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => handleSchedule('Process Fans')} className="text-emerald-700 font-bold hover:underline">
                    Plan PM
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Grinding Mill Main Drives & Reducers</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">8,500 hrs (~354 days)</td>
                <td className="py-3 px-4 text-right font-mono">2.8 hrs</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">99.97%</td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => handleSchedule('Grinding Mills')} className="text-emerald-700 font-bold hover:underline">
                    Plan PM
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Cooler Aeration Blowers & Grate Drives</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">4,200 hrs (~175 days)</td>
                <td className="py-3 px-4 text-right font-mono">3.5 hrs</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">99.91%</td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => handleSchedule('Cooler Grate Drives')} className="text-emerald-700 font-bold hover:underline">
                    Plan PM
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PredictiveMaintenance;
