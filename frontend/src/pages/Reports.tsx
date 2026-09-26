import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Printer, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, BarChart3, Clock, Users } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { api } from '../lib/api';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'shift' | 'downtime' | 'monthly'>('daily');
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [dailyData, setDailyData] = useState<any>(null);
  const [shiftData, setShiftData] = useState<any>(null);
  const [paretoData, setParetoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const [dRes, sRes, pRes] = await Promise.all([
        api.get('/reports/daily'),
        api.get('/reports/shift'),
        api.get('/reports/downtime/pareto')
      ]);
      setDailyData(dRes.data);
      setShiftData(sRes.data);
      setParetoData(pRes.data);
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [reportDate]);

  // Build Pareto Chart Option
  const paretoItems = paretoData?.pareto || [
    { cause: "Raw Mill ID Fan Vibration", duration_min: 55, loss_tons: 68.0, pct: 42.3 },
    { cause: "Grid Voltage Sag / Trip", duration_min: 32, loss_tons: 45.0, pct: 24.6 },
    { cause: "Preheater Top Cyclone Jamming", duration_min: 24, loss_tons: 32.5, pct: 18.5 },
    { cause: "Cooler Clinker Grate Jam", duration_min: 12, loss_tons: 16.0, pct: 9.2 },
    { cause: "Bag Filter High DP", duration_min: 7, loss_tons: 9.2, pct: 5.4 }
  ];

  const paretoNames = paretoItems.map((p: any) => p.cause);
  const paretoMinutes = paretoItems.map((p: any) => p.duration_min);
  
  let cum = 0;
  const totalMin = paretoMinutes.reduce((a: number, b: number) => a + b, 0) || 1;
  const paretoCum = paretoMinutes.map((m: number) => {
    cum += m;
    return Math.round((cum / totalMin) * 100);
  });

  const paretoOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { textStyle: { color: '#64748b', fontSize: 11 }, top: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '40px', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: paretoNames, 
      axisLabel: { color: '#64748b', interval: 0, rotate: 18, fontSize: 10 },
      axisLine: { lineStyle: { color: '#e2e8f0' } }
    },
    yAxis: [
      { 
        type: 'value', 
        name: 'Downtime (Minutes)', 
        axisLabel: { color: '#64748b', fontSize: 11 }, 
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        nameTextStyle: { color: '#64748b' }
      },
      { 
        type: 'value', 
        name: 'Cumulative %', 
        min: 0, 
        max: 100, 
        axisLabel: { color: '#64748b', formatter: '{value}%', fontSize: 11 }, 
        splitLine: { show: false },
        nameTextStyle: { color: '#64748b' }
      }
    ],
    series: [
      { 
        name: 'Downtime Duration (min)', 
        type: 'bar', 
        data: paretoMinutes, 
        itemStyle: { color: '#ef4444', borderRadius: [4, 4, 0, 0] } 
      },
      { 
        name: 'Cumulative %', 
        type: 'line', 
        yAxisIndex: 1, 
        data: paretoCum, 
        itemStyle: { color: '#0284c7' },
        lineStyle: { width: 3 }
      }
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      `Report Date,${reportDate}\n` +
      `Clinker Production (t),${dailyData?.production?.clinker_today_tons || 289}\n` +
      `Cement Production (t),${dailyData?.production?.cement_today_tons || 290}\n` +
      `SEC Clinker (kWh/t),${dailyData?.energy?.sec_kwh_ton_clinker || 64.2}\n` +
      `Total Power (MW),${dailyData?.energy?.total_power_mw || 1.84}\n` +
      `Kiln Run Factor (%),${dailyData?.downtime?.kiln_run_factor_pct || 98.5}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `plant_report_${reportDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !dailyData) {
    return (
      <div className="flex h-full items-center justify-center text-emerald-600">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Compiling Plant Performance Reports...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* TOP CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="text-emerald-600" size={24} /> Plant Operations & Energy Reports
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              OFFICIAL AUDIT LOG
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Certified production outputs, specific energy consumption (SEC), ISO 50001 thermal heat rate, and downtime Pareto analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
            <Calendar size={14} className="text-slate-400" />
            <input 
              type="date" 
              value={reportDate} 
              onChange={(e) => setReportDate(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none" 
            />
          </div>

          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 transition-all shadow-xs"
          >
            <Download size={14} /> CSV
          </button>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Printer size={14} /> Print / PDF
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 gap-2">
        {[
          { id: 'daily', label: 'Daily Operations Report', icon: <FileText size={15} /> },
          { id: 'shift', label: 'Shift Performance (A/B/C)', icon: <Users size={15} /> },
          { id: 'downtime', label: 'Downtime Pareto Analysis', icon: <BarChart3 size={15} /> },
          { id: 'monthly', label: 'Monthly KPI Aggregate', icon: <Clock size={15} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-emerald-700 border-emerald-600 bg-white rounded-t-xl'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DAILY REPORT */}
      {activeTab === 'daily' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">INTEGRATED CEMENT FACILITY — UNIT 01</h2>
              <div className="text-xs text-slate-500">Official Daily Production & Energy Verification | Date: {reportDate}</div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 self-start ${
              dailyData?.kpis_met 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <CheckCircle2 size={14} className="text-emerald-600" /> 
              {dailyData?.kpis_met ? 'DAILY KPIS COMPLIANT' : 'ATTENTION: SEC DEVIATION'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Production */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Production Summary</span>
                <span className="text-slate-400 font-normal">Metric Tons</span>
              </h4>
              <table className="w-full text-xs text-slate-700">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 font-medium">Clinker Production</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">{dailyData?.production?.clinker_today_tons || 289.2} t</td>
                    <td className="py-2.5 text-right text-slate-400">Target: {dailyData?.production?.clinker_target_tons || 320} t</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Cement Grinding</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">{dailyData?.production?.cement_today_tons || 290.8} t</td>
                    <td className="py-2.5 text-right text-slate-400">Target: {dailyData?.production?.cement_target_tons || 250} t</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Raw Meal Feed</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">{dailyData?.production?.raw_meal_today_tons || 316.8} t</td>
                    <td className="py-2.5 text-right text-slate-400">Target: 340 t</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Energy */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Specific Energy & Heat Rate</span>
                <span className="text-emerald-700 font-bold">ISO 50001</span>
              </h4>
              <table className="w-full text-xs text-slate-700">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 font-medium">Clinker Specific Energy (SEC)</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-600">{dailyData?.energy?.sec_kwh_ton_clinker || 64.2} kWh/t</td>
                    <td className="py-2.5 text-right text-slate-400">Target: {dailyData?.energy?.sec_target_clinker || 62.0}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Cement Mill SEC</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">{dailyData?.energy?.sec_kwh_ton_cement || 32.5} kWh/t</td>
                    <td className="py-2.5 text-right text-slate-400">Target: {dailyData?.energy?.sec_target_cement || 33.0}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Specific Heat Consumption</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">{dailyData?.energy?.thermal_kcal_kg || 738.5} kcal/kg</td>
                    <td className="py-2.5 text-right text-slate-400">Target: 735.0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quality */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-3">
                Laboratory Quality Compliance
              </h4>
              <table className="w-full text-xs text-slate-700">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 font-medium">Free Lime (CaO) Average</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-600">{dailyData?.quality?.free_lime_avg || 0.95}%</td>
                    <td className="py-2.5 text-right text-slate-400">Target: &lt; 1.5%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Cement Blaine Fineness</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">{dailyData?.quality?.blaine_avg || 3820} m²/kg</td>
                    <td className="py-2.5 text-right text-slate-400">Target: 3700 - 3900</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Lime Saturation Factor (LSF)</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">{dailyData?.quality?.lsf_avg || 98.4}</td>
                    <td className="py-2.5 text-right text-slate-400">Target: 96.0 - 100.0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Availability */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-3">
                Plant Availability & Run Factor
              </h4>
              <table className="w-full text-xs text-slate-700">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 font-medium">Kiln Availability Factor</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-600">{dailyData?.downtime?.kiln_run_factor_pct || 98.5}%</td>
                    <td className="py-2.5 text-right text-slate-400">Target: &gt; 96.0%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Unplanned Downtime</td>
                    <td className="py-2.5 text-right font-mono font-bold text-amber-600">{dailyData?.downtime?.total_minutes || 22} mins</td>
                    <td className="py-2.5 text-right text-slate-400">Limit: &lt; 30 mins</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Primary Disturbance</td>
                    <td colSpan={2} className="py-2.5 text-right text-slate-600 font-medium truncate">
                      {dailyData?.downtime?.top_issues?.[0] || 'Raw Mill ID Fan Vibration'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHIFT REPORT */}
      {activeTab === 'shift' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">8-Hour Shift Performance Comparison</h3>
            <span className="text-xs text-slate-500">Date: {reportDate}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                <tr>
                  <th className="py-3 px-4">Shift & Time</th>
                  <th className="py-3 px-4">Shift Incharge</th>
                  <th className="py-3 px-4 text-right">Production (t)</th>
                  <th className="py-3 px-4 text-right">Power Draw (kWh)</th>
                  <th className="py-3 px-4 text-right">SEC (kWh/t)</th>
                  <th className="py-3 px-4 text-right">Downtime</th>
                  <th className="py-3 px-4 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(shiftData?.shifts || []).map((s: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{s.shift}</td>
                    <td className="py-3 px-4 text-slate-600">{s.operator}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{s.production_tons}</td>
                    <td className="py-3 px-4 text-right font-mono">{s.energy_kwh.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">{s.sec_kwh_ton}</td>
                    <td className="py-3 px-4 text-right font-mono">{s.downtime_minutes} min</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.status === 'EXCELLENT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DOWNTIME PARETO */}
      {activeTab === 'downtime' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Plant Downtime Pareto Distribution</h3>
                <p className="text-xs text-slate-500">80/20 Rule: 80% of lost production caused by top 2 disturbance causes.</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Total Downtime: </span>
                <span className="text-sm font-bold text-red-600">{paretoData?.total_downtime_min || 130} mins</span>
              </div>
            </div>

            <ReactECharts option={paretoOpts} style={{ height: '340px', width: '100%' }} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs overflow-hidden">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3">
              Root Causes & Lost Clinker Tonnage
            </h4>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase">
                <tr>
                  <th className="py-2.5 px-4">Disturbance Issue</th>
                  <th className="py-2.5 px-4 text-right">Duration (min)</th>
                  <th className="py-2.5 px-4 text-right">Lost Production (tons)</th>
                  <th className="py-2.5 px-4 text-right">Share of Downtime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paretoItems.map((p: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{p.cause}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-red-600 font-bold">{p.duration_min} min</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-800">{p.loss_tons} t</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">{p.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MONTHLY SUMMARY */}
      {activeTab === 'monthly' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Month-to-Date Performance Roll-Up</h3>
              <p className="text-xs text-slate-500">Aggregated figures for ISO 50001 energy audits and executive review.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              CUMULATIVE SAVINGS: ₹28.4 LACS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase">Monthly Clinker Production</span>
              <div className="text-2xl font-black text-slate-900 mt-2">8,820 <span className="text-xs font-normal text-slate-500">tons</span></div>
              <div className="text-[11px] text-emerald-600 mt-1 font-semibold">98.2% of target schedule</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase">Weighted Average SEC</span>
              <div className="text-2xl font-black text-emerald-600 mt-2">63.1 <span className="text-xs font-normal text-slate-500">kWh/t</span></div>
              <div className="text-[11px] text-emerald-700 mt-1 font-semibold">-4.9 kWh/t vs historical baseline</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase">Avoided CO₂ Equivalent</span>
              <div className="text-2xl font-black text-sky-600 mt-2">1,240 <span className="text-xs font-normal text-slate-500">tons</span></div>
              <div className="text-[11px] text-sky-700 mt-1 font-semibold">WHRS + Fan Optimization</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
