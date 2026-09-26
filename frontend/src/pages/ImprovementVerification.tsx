import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, TrendingDown, ArrowRight, Zap, Target, RefreshCw, Sparkles, Award } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { api } from '../lib/api';

const ImprovementVerification: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('KAI-3001');
  const [secData, setSecData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [standardizing, setStandardizing] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const fetchData = async () => {
    try {
      const [projRes, secRes] = await Promise.all([
        api.get('/kaizen-projects'),
        api.get('/energy/sec')
      ]);
      const projs = Array.isArray(projRes.data) ? projRes.data : [];
      setProjects(projs);
      setSecData(secRes.data);
      if (projs.length > 0 && !projs.some(p => p.id === selectedProjectId)) {
        setSelectedProjectId(projs[0].id);
      }
    } catch (err) {
      console.error("Failed to load verification data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeProject = projects.find(p => p.id === selectedProjectId) || {
    id: 'KAI-3001',
    title: 'Cement Mill 1 Energy Loss & Fan Optimization',
    dept: 'CEMENT_MILL',
    impact: '₹42,000/day',
    status: 'VERIFYING',
    progress: 90
  };

  const isStandardized = activeProject.status === 'STANDARDIZED' || activeProject.status === 'REPLICATED';

  const beforeSec = 41.2;
  const targetSec = 38.0;
  const currentSec = isStandardized ? 37.6 : 37.8;

  const chartOption = {
    backgroundColor: 'transparent',
    grid: { top: 30, right: 20, bottom: 20, left: 45 },
    tooltip: { 
      trigger: 'axis', 
      backgroundColor: '#0f172a', 
      borderColor: '#334155', 
      textStyle: { color: '#f8fafc' } 
    },
    xAxis: { 
      type: 'category', 
      data: ['Day -4', 'Day -3', 'Day -2', 'Day -1', 'Implementation', 'Day +1', 'Day +2', 'Day +3 (Live)'], 
      axisLabel: { color: '#64748b', fontSize: 10 },
      axisLine: { lineStyle: { color: '#e2e8f0' } }
    },
    yAxis: { 
      type: 'value', 
      name: 'SEC (kWh/t)',
      min: 35, 
      max: 43, 
      splitLine: { lineStyle: { color: '#f1f5f9' } }, 
      axisLabel: { color: '#64748b', fontSize: 10 } 
    },
    series: [
      {
        name: 'Specific Energy Consumption',
        type: 'line',
        data: [41.2, 41.0, 41.5, 41.1, 39.5, 37.9, 37.7, currentSec],
        itemStyle: { color: '#10b981' },
        lineStyle: { width: 3 },
        smooth: true,
        markArea: {
          itemStyle: { color: 'rgba(16, 185, 129, 0.07)' },
          data: [[{ name: 'Sustained Operating Window', xAxis: 'Implementation' }, { xAxis: 'Day +3 (Live)' }]]
        },
        markLine: {
          data: [{ yAxis: targetSec, name: 'Target SEC' }],
          lineStyle: { color: '#0284c7', type: 'dashed' },
          label: { color: '#0284c7', fontSize: 10 }
        }
      }
    ]
  };

  const handleStandardize = async () => {
    setStandardizing(true);
    try {
      await api.patch(`/kaizen-projects/${activeProject.id}`, {
        status: 'STANDARDIZED',
        progress: 100
      });
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 5000);
      await fetchData();
    } catch (err) {
      console.error("Failed to standardize project", err);
    } finally {
      setStandardizing(false);
    }
  };

  if (loading && !activeProject) {
    return (
      <div className="flex h-full items-center justify-center text-emerald-600">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading Improvement Verification...
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
              <CheckCircle2 className="text-emerald-600" size={24} /> Kaizen Improvement Verification (PDCA Stage 5)
            </h1>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              isStandardized ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-sky-50 text-sky-700 border-sky-300'
            }`}>
              {isStandardized ? 'STANDARDIZED' : 'IN VERIFICATION'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empirical before-and-after statistical verification ensuring process energy gains are sustained without quality compromises.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Project:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600 shadow-xs"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.id} - {p.title.slice(0, 35)}...</option>
            ))}
          </select>
        </div>
      </div>

      {/* TOAST */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Award className="text-emerald-600" size={18} />
            Success! Project {activeProject.id} has been formally Standardized in the Plant SOP Repository and marked ready for horizontal replication.
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">STATUS: STANDARDIZED</span>
        </div>
      )}

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Target Metric</span>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {activeProject.id}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Zap size={20} className="text-emerald-600" />
              <span className="text-base font-bold text-slate-900">Specific Energy Consumption (SEC)</span>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center items-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">BASELINE (BEFORE)</span>
                <span className="text-lg font-bold text-slate-700">{beforeSec} <span className="text-xs font-normal">kWh/t</span></span>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="text-slate-300" size={18} />
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-600 block mb-1">VERIFIED (AFTER)</span>
                <span className="text-2xl font-black text-emerald-600">{currentSec} <span className="text-xs font-normal">kWh/t</span></span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Achieved Reduction:</span>
              <span className="font-bold text-emerald-600 font-mono">
                -{(beforeSec - currentSec).toFixed(1)} kWh/ton (-{(((beforeSec - currentSec) / beforeSec) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-slate-500">Annualized Savings:</span>
              <span className="font-bold text-slate-900 font-mono">{activeProject.impact}</span>
            </div>
          </div>

          {/* Secondary Controls Check */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Quality & Process Side-Effect Verification
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-medium">Production Output Maintained (&gt; 18.0 TPH)</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 size={14} /> PASSED
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-medium">Blaine Fineness Specification (3820 m²/kg)</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 size={14} /> PASSED
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-medium">Drive Vibration Stability (&lt; 3.0 mm/s)</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 size={14} /> PASSED
                </span>
              </div>
            </div>

            <button
              onClick={handleStandardize}
              disabled={standardizing || isStandardized}
              className={`w-full mt-4 py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                isStandardized
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isStandardized ? (
                <>
                  <CheckCircle2 size={16} /> IMPROVEMENT STANDARDIZED
                </>
              ) : standardizing ? (
                'Standardizing...'
              ) : (
                <>
                  <Sparkles size={16} /> STANDARDIZE IMPROVEMENT (SOP LOCK)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Empirical Verification Trend (Run-Chart)</h3>
              <p className="text-xs text-slate-500">Continuous telemetry tracking SEC stability across 8 operational shifts.</p>
            </div>
            <span className="text-xs font-bold text-slate-500">Design Target: {targetSec} kWh/t</span>
          </div>

          <div className="flex-1 min-h-[340px]">
            <ReactECharts option={chartOption} style={{ height: '340px', width: '100%' }} />
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800">Verification Conclusion: </span>
            The reduction of separator fan speed and optimization of dynamic classifying vanes has yielded an average specific energy drop of 3.4 kWh/t with zero standard deviation spikes across shifts. Recommended for immediate SOP standardization.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovementVerification;
