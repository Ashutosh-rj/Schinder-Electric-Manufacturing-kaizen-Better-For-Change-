import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, CheckCircle2, Zap, Activity, Wind, ArrowRight, 
  TrendingUp, TrendingDown, Layers, Gauge, Leaf, Cpu, Flame, Hammer, 
  Factory, Settings, Truck, ChevronRight, Compass, ShieldAlert,
  Share2, Eye, Bell, ExternalLink, Power, BarChart3, AlertOctagon,
  Info, Sparkles
} from 'lucide-react';
import { api } from '../lib/api';

export const Overview: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'3D' | 'SCHEMATIC'>('3D');
  const [activeTrendTab, setActiveTrendTab] = useState<'PRODUCTION' | 'POWER' | 'SEC' | 'EMISSIONS'>('PRODUCTION');
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);

  // Live telemetry polling
  const fetchData = async () => {
    try {
      const res = await api.get('/dashboard/overview');
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch overview data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Telemetry variables matching reference
  const clinkerTph = (data?.production?.clinker_tph || 285.3).toFixed(1);
  const cementTph = (data?.production?.cement_tph || 312.5).toFixed(1);
  const totalPowerMw = (data?.energy?.total_power_mw || 18.4).toFixed(1);
  const secKwhTon = (data?.energy?.sec_kwh_ton_clinker || 64.2).toFixed(1);
  const whrsMw = (data?.energy?.whrs_generation_mw || 4.2).toFixed(1);
  const activeAlarmsCount = data?.alarms?.total_active || 21;
  const plantStatusScore = data?.equipment_health?.overall_health ? Math.round(data.equipment_health.overall_health) : 84;

  // 10 Interactive Hotspots precisely mapped to the 3D plant model in plant-3d-hd.png
  const plantUnits = [
    { id: 'MINE', num: '1', title: 'Mine', val: '520 TPH', area: 'CR', x: '1%', y: '16%', w: '9%', h: '48%' },
    { id: 'CRUSHER', num: '2', title: 'Crusher', val: '430 TPH', area: 'CR', x: '10%', y: '26%', w: '9%', h: '46%' },
    { id: 'RAW_MILL', num: '3', title: 'Raw Mill', val: '265 TPH', area: 'RM1', x: '19.5%', y: '32%', w: '11.5%', h: '46%' },
    { id: 'KILN', num: '4', title: 'Preheater & Kiln', val: '3,210 TPH', area: 'KILN', x: '31.5%', y: '8%', w: '17%', h: '70%' },
    { id: 'COOLER', num: '5', title: 'Cooler', val: '265 TPH', area: 'COOLER', x: '49%', y: '28%', w: '9.5%', h: '46%' },
    { id: 'CLINKER_STORAGE', num: '6', title: 'Clinker Storage', val: '25,000 T', area: 'CT1', x: '59%', y: '32%', w: '11%', h: '46%' },
    { id: 'CEMENT_MILL', num: '7', title: 'Cement Mill', val: '312.5 TPH', area: 'CM2', x: '70.5%', y: '45%', w: '12%', h: '45%' },
    { id: 'PACKING', num: '8', title: 'Packing', val: '240 TPH', area: 'PACKING', x: '83%', y: '48%', w: '12%', h: '45%' },
    { id: 'CPP', num: '9', title: 'Captive Power Plant', val: '8.5 MW', area: 'POWER', x: '68%', y: '8%', w: '14%', h: '38%' },
    { id: 'WHRS', num: '10', title: 'WHRS', val: '4.2 MW', area: 'POWER', x: '84%', y: '12%', w: '13%', h: '40%' },
  ];

  // Sparkline configuration matching kpi1-ref.png
  const getKpiSparkline = (dataPoints: number[], strokeColor: string) => ({
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false, min: 'dataMin' },
    series: [{
      data: dataPoints,
      type: 'line',
      smooth: 0.35,
      showSymbol: false,
      lineStyle: { width: 2, color: strokeColor },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: strokeColor },
            { offset: 1, color: 'rgba(0,0,0,0)' }
          ]
        },
        opacity: 0.25
      }
    }]
  });

  // Mini Bar Chart for Active Alarms
  const getAlarmBarChart = () => ({
    grid: { left: 0, right: 0, top: 2, bottom: 0 },
    xAxis: { type: 'category', show: false, data: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
    yAxis: { type: 'value', show: false },
    series: [{
      data: [12, 18, 14, 22, 19, 25, 20, 24, 21],
      type: 'bar',
      barWidth: 3.5,
      itemStyle: {
        color: '#f43f5e',
        borderRadius: [2, 2, 0, 0]
      }
    }]
  });

  // Trends (Last 24 Hours) matching bottom-row-ref.png
  const get24hTrendOption = () => {
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
    
    let series1 = [250, 255, 260, 240, 310, 250, 285];
    let series2 = [170, 180, 220, 235, 210, 190, 220];
    let name1 = 'Clinker (TPH)';
    let name2 = 'Cement (TPH)';
    let color1 = '#10b981';
    let color2 = '#06b6d4';

    if (activeTrendTab === 'POWER') {
      series1 = [17.8, 18.1, 18.5, 18.9, 18.4, 18.2, 18.4];
      series2 = [3.8, 4.0, 4.2, 4.4, 4.2, 4.1, 4.2];
      name1 = 'Total Power (MW)';
      name2 = 'WHRS Gen (MW)';
      color1 = '#f59e0b';
      color2 = '#10b981';
    } else if (activeTrendTab === 'SEC') {
      series1 = [65.2, 64.8, 64.1, 63.5, 64.2, 64.4, 64.2];
      series2 = [32.5, 32.1, 31.5, 30.8, 31.4, 31.6, 31.2];
      name1 = 'Clinker SEC';
      name2 = 'Cement SEC';
      color1 = '#38bdf8';
      color2 = '#a855f7';
    } else if (activeTrendTab === 'EMISSIONS') {
      series1 = [0.655, 0.650, 0.645, 0.638, 0.642, 0.644, 0.642];
      series2 = [420, 415, 405, 390, 405, 410, 400];
      name1 = 'CO₂ Factor';
      name2 = 'Stack NOx';
      color1 = '#34d399';
      color2 = '#f97316';
    }

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#0a1420',
        borderColor: '#1e293b',
        textStyle: { color: '#f8fafc', fontSize: 11 }
      },
      grid: { left: '3%', right: '3%', top: '15%', bottom: '12%', containLabel: true },
      xAxis: {
        type: 'category',
        data: hours,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#142538' } },
        axisLabel: { color: '#566e85', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 400,
        interval: 100,
        splitLine: { lineStyle: { color: '#0f1c2b', type: 'dashed' } },
        axisLabel: { color: '#566e85', fontSize: 10 }
      },
      series: [
        {
          name: name1,
          type: 'line',
          smooth: 0.35,
          showSymbol: true,
          symbolSize: 5,
          data: series1,
          lineStyle: { width: 2.2, color: color1 },
          itemStyle: { color: color1 }
        },
        {
          name: name2,
          type: 'line',
          smooth: 0.35,
          showSymbol: true,
          symbolSize: 5,
          data: series2,
          lineStyle: { width: 2.2, color: color2 },
          itemStyle: { color: color2 }
        }
      ]
    };
  };

  // Power Mix Donut Option matching bottom-row-ref.png
  const getPowerMixOption = () => ({
    tooltip: {
      trigger: 'item',
      backgroundColor: '#0a1420',
      borderColor: '#1e293b',
      textStyle: { color: '#ffffff', fontSize: 10 }
    },
    series: [
      {
        type: 'pie',
        radius: ['68%', '90%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { scale: true, scaleSize: 3 },
        data: [
          { value: 18, name: 'Grid 18%', itemStyle: { color: '#38bdf8' } },
          { value: 59, name: 'CPP 59%', itemStyle: { color: '#10b981' } },
          { value: 23, name: 'WHRS 23%', itemStyle: { color: '#f59e0b' } }
        ]
      }
    ]
  });

  return (
    <div className="flex flex-col gap-3.5 max-w-[1920px] mx-auto select-none font-sans text-white">
      
      {/* ── ROW 1: TOP 6 METRIC CARDS + PLANT STATUS (EXACT plant overview.png) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        
        {/* KPI 1: Clinker Production */}
        <div 
          onClick={() => navigate('/digital-twin?area=KILN')}
          className="bg-[#081724] border border-[#102436] rounded-xl p-3 flex items-center gap-3 hover:border-emerald-500/50 hover:bg-[#0b1e30] transition-all cursor-pointer group shadow-lg"
        >
          <div className="w-11 h-11 rounded-xl bg-[#092e21] border border-[#106c35]/40 flex items-center justify-center text-[#00ff88] group-hover:scale-105 transition-transform shrink-0">
            <Activity size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">
              CLINKER PRODUCTION
            </div>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-xl font-extrabold text-white leading-tight">{clinkerTph}</span>
              <span className="text-[10px] font-bold text-gray-400">TPH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#00ff88]">↑ 2.4%</span>
              <div className="w-16 h-5">
                <ReactECharts option={getKpiSparkline([275, 278, 281, 283, 282, 284, 285.3], '#00ff88')} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* KPI 2: Cement Production */}
        <div 
          onClick={() => navigate('/digital-twin?area=CM2')}
          className="bg-[#081724] border border-[#102436] rounded-xl p-3 flex items-center gap-3 hover:border-cyan-500/50 hover:bg-[#0b1e30] transition-all cursor-pointer group shadow-lg"
        >
          <div className="w-11 h-11 rounded-xl bg-[#062635] border border-[#0891b2]/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
            <Layers size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">
              CEMENT PRODUCTION
            </div>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-xl font-extrabold text-white leading-tight">{cementTph}</span>
              <span className="text-[10px] font-bold text-gray-400">TPH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-400">↑ 1.8%</span>
              <div className="w-16 h-5">
                <ReactECharts option={getKpiSparkline([302, 305, 308, 310, 309, 311, 312.5], '#06b6d4')} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* KPI 3: Total Power */}
        <div 
          onClick={() => navigate('/energy')}
          className="bg-[#081724] border border-[#102436] rounded-xl p-3 flex items-center gap-3 hover:border-amber-500/50 hover:bg-[#0b1e30] transition-all cursor-pointer group shadow-lg"
        >
          <div className="w-11 h-11 rounded-xl bg-[#32230a] border border-[#b45309]/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
            <Zap size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">
              TOTAL POWER
            </div>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-xl font-extrabold text-white leading-tight">{totalPowerMw}</span>
              <span className="text-[10px] font-bold text-gray-400">MW</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400">↓ 3.1%</span>
              <div className="w-16 h-5">
                <ReactECharts option={getKpiSparkline([19.2, 19.0, 18.8, 18.6, 18.5, 18.4, 18.4], '#f59e0b')} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* KPI 4: Specific Energy */}
        <div 
          onClick={() => navigate('/optimization')}
          className="bg-[#081724] border border-[#102436] rounded-xl p-3 flex items-center gap-3 hover:border-blue-500/50 hover:bg-[#0b1e30] transition-all cursor-pointer group shadow-lg"
        >
          <div className="w-11 h-11 rounded-xl bg-[#0a2038] border border-[#0284c7]/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shrink-0">
            <Gauge size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">
              SPECIFIC ENERGY
            </div>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-xl font-extrabold text-white leading-tight">{secKwhTon}</span>
              <span className="text-[10px] font-bold text-gray-400">kWh/t</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-400">↓ 4.5%</span>
              <div className="w-16 h-5">
                <ReactECharts option={getKpiSparkline([67.2, 66.8, 66.0, 65.4, 64.9, 64.5, 64.2], '#38bdf8')} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* KPI 5: WHRS Generation */}
        <div 
          onClick={() => navigate('/whrs')}
          className="bg-[#081724] border border-[#102436] rounded-xl p-3 flex items-center gap-3 hover:border-emerald-500/50 hover:bg-[#0b1e30] transition-all cursor-pointer group shadow-lg"
        >
          <div className="w-11 h-11 rounded-xl bg-[#092e21] border border-[#106c35]/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
            <Leaf size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">
              WHRS GENERATION
            </div>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-xl font-extrabold text-white leading-tight">{whrsMw}</span>
              <span className="text-[10px] font-bold text-gray-400">MW</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400">↑ 6.7%</span>
              <div className="w-16 h-5">
                <ReactECharts option={getKpiSparkline([3.8, 3.9, 4.0, 4.0, 4.1, 4.15, 4.2], '#10b981')} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* KPI 6: Active Alarms */}
        <div 
          onClick={() => navigate('/alarms')}
          className="bg-[#081724] border border-[#102436] rounded-xl p-3 flex items-center gap-3 hover:border-red-500/50 hover:bg-[#0b1e30] transition-all cursor-pointer group shadow-lg"
        >
          <div className="w-11 h-11 rounded-xl bg-[#351016] border border-[#e11d48]/40 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform shrink-0">
            <ShieldAlert size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">
              ACTIVE ALARMS
            </div>
            <div className="flex items-baseline justify-between my-0.5">
              <span className="text-xl font-extrabold text-white leading-tight">{activeAlarmsCount}</span>
            </div>
            <div className="h-5 -mx-1">
              <ReactECharts option={getAlarmBarChart()} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
        </div>

        {/* KPI 7: Plant Status Widget matching status-ref.png */}
        <div className="bg-[#052016] border border-[#0f593b] rounded-xl p-3 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#00ff88] flex items-center justify-center text-[#060b13] font-black shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider leading-none">PLANT</span>
                <span className="text-xs font-bold text-white leading-tight mt-0.5">Running Stable</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider block leading-none">PLANT STATUS</span>
              <div className="text-sm font-black text-white leading-tight mt-0.5">
                {plantStatusScore}<span className="text-xs font-normal text-gray-400">/100</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-[#032115] h-2 rounded-full overflow-hidden border border-[#0d4f33] mt-2">
            <div className="bg-gradient-to-r from-emerald-400 to-[#00ff88] h-full rounded-full" style={{ width: `${plantStatusScore}%` }} />
          </div>
        </div>

      </div>

      {/* ── ROW 2: PLANT PROCESS FLOW + CRITICAL ALERTS & AI INSIGHTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3.5">
        
        {/* LEFT 3 COLS: PLANT PROCESS FLOW HERO */}
        <div className="lg:col-span-3 bg-[#081522] border border-[#122436] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
          
          {/* Header Bar strictly matching hero-header-ref.png */}
          <div className="px-4 py-2.5 bg-[#091826] border-b border-[#122436] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0b2438] border border-[#0ea5e9]/40 flex items-center justify-center text-cyan-400">
                <Cpu size={16} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white tracking-wide leading-tight">
                  Plant Process Flow
                </h2>
                <p className="text-[11px] text-gray-400 font-medium">From Mines to a Greener Tomorrow</p>
              </div>
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex bg-[#07131e] p-0.5 rounded-lg border border-[#162a3e]">
              <button
                onClick={() => setViewMode('3D')}
                className={`px-3.5 py-1 rounded-md text-xs font-bold transition-all ${
                  viewMode === '3D'
                    ? 'bg-[#043c25] text-[#00ff88] border border-[#00ff88]/60 shadow-sm'
                    : 'text-gray-400 hover:text-white border border-transparent'
                }`}
              >
                3D View
              </button>
              <button
                onClick={() => setViewMode('SCHEMATIC')}
                className={`px-3.5 py-1 rounded-md text-xs font-bold transition-all ${
                  viewMode === 'SCHEMATIC'
                    ? 'bg-[#043c25] text-[#00ff88] border border-[#00ff88]/60 shadow-sm'
                    : 'text-gray-400 hover:text-white border border-transparent'
                }`}
              >
                Schematic View
              </button>
            </div>
          </div>

          {/* Process Flow Viewport */}
          <div className="relative w-full aspect-[1219/325] bg-[#050e18] overflow-hidden flex items-center justify-center">
            
            {viewMode === '3D' ? (
              /* ── 3D ISOMETRIC AERIAL WITH HIGH-RESOLUTION RENDERING & INVISIBLE CLICKABLE HOTSPOTS ── */
              <div className="relative w-full h-full">
                
                {/* Native High-Resolution 3D Model Render */}
                <img 
                  src="/plant-3d-hd.png" 
                  alt="3D Plant Model"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {/* 10 Interactive Hotspots mapped directly over the 10 plant structures */}
                {plantUnits.map((u) => (
                  <div
                    key={u.id}
                    style={{ left: u.x, top: u.y, width: u.w, height: u.h }}
                    className="absolute z-20 cursor-pointer rounded-xl border border-transparent hover:border-[#00ff88]/60 hover:bg-[#00ff88]/10 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all group"
                    onClick={() => navigate(`/digital-twin?area=${u.area}`)}
                    onMouseEnter={() => setHoveredUnit(u.id)}
                    onMouseLeave={() => setHoveredUnit(null)}
                    title={`Click to open ${u.title} (${u.val}) DCS SCADA Digital Twin`}
                  >
                    {/* Floating Hover Indicator Badge */}
                    <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/85 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-[#00ff88] border border-[#00ff88]/50 flex items-center gap-1 shadow-md">
                      <span>OPEN DCS</span>
                      <ExternalLink size={9} />
                    </div>
                  </div>
                ))}

              </div>
            ) : (
              /* ── SCHEMATIC DCS DIGITAL TWIN FLOW ── */
              <div className="w-full h-full p-3 flex flex-col justify-center items-center bg-[#070e17]">
                <div className="grid grid-cols-6 gap-2 w-full max-w-5xl">
                  {[
                    { title: "1. Limestone Crusher", rate: "430 TPH", pwr: "420 kW", area: "CR", icon: Hammer },
                    { title: "2. Raw Mill VRM", rate: "265 TPH", pwr: "3,240 kW", area: "RM1", icon: Factory },
                    { title: "3. Preheater & Kiln", rate: "3,210 TPH", pwr: "750 kW", area: "KILN", icon: Flame },
                    { title: "4. Grate Cooler", rate: "265 TPH", pwr: "580 kW", area: "COOLER", icon: Wind },
                    { title: "5. Cement Ball Mill", rate: "312 TPH", pwr: "4,280 kW", area: "CM2", icon: Settings },
                    { title: "6. Packing & Dispatch", rate: "240 TPH", pwr: "180 kW", area: "PACKING", icon: Truck },
                  ].map((blk, idx) => (
                    <div 
                      key={idx}
                      onClick={() => navigate(`/digital-twin?area=${blk.area}`)}
                      className="bg-[#0a1827] border border-[#14283d] rounded-xl p-2.5 flex flex-col justify-between hover:border-[#00ff88] cursor-pointer group transition-all"
                    >
                      <div className="flex items-center justify-between text-gray-400 group-hover:text-white">
                        <blk.icon size={15} className="text-[#00ff88]" />
                        <span className="text-[9px] font-mono text-gray-500">UNIT {idx + 1}</span>
                      </div>
                      <div className="my-1.5">
                        <div className="text-[11px] font-bold text-white group-hover:text-[#00ff88]">{blk.title}</div>
                        <div className="text-xs font-black text-[#00ff88] font-mono mt-0.5">{blk.rate}</div>
                        <div className="text-[9px] text-gray-400 font-mono">{blk.pwr}</div>
                      </div>
                      <span className="text-[9px] font-bold text-cyan-400 flex items-center justify-end gap-1">
                        DCS <ChevronRight size={11} />
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/digital-twin?area=HOME')}
                  className="mt-3 px-4 py-1.5 bg-[#106c35] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md"
                >
                  <ExternalLink size={13} />
                  <span>Open Full Engineering Digital Twin Studio</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT 1 COL: CRITICAL ALERTS + AI INSIGHTS MATCHING middle-row-ref.png */}
        <div className="flex flex-col gap-3">
          
          {/* Card 1: Critical Alerts */}
          <div className="bg-[#081522] border border-[#122436] rounded-2xl p-3 flex flex-col justify-between shadow-xl flex-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                  <AlertTriangle size={14} />
                  <span>Critical Alerts</span>
                </div>
                <button 
                  onClick={() => navigate('/alarms')}
                  className="text-[10px] font-bold text-rose-400/90 hover:text-rose-300 hover:underline"
                >
                  View All
                </button>
              </div>

              {/* Alerts List */}
              <div className="space-y-1.5">
                {[
                  { title: "CM1 Motor Temp High", loc: "Cement Mill 1 | 42 minutes ago", pri: "P1", bg: "bg-red-500/20 text-red-400 border-red-500/40", area: "CM2" },
                  { title: "Raw Mill DP Limit", loc: "Raw Mill | 1 hour ago", pri: "P2", bg: "bg-amber-500/20 text-amber-400 border-amber-500/40", area: "RM1" },
                  { title: "Kiln CO Elevated", loc: "Kiln | 2 hours ago", pri: "P2", bg: "bg-amber-500/20 text-amber-400 border-amber-500/40", area: "KILN" },
                  { title: "WHRS Steam Flow Low", loc: "WHRS | 3 hours ago", pri: "P3", bg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40", area: "POWER" },
                ].map((alt, i) => (
                  <div 
                    key={i}
                    onClick={() => navigate(`/digital-twin?area=${alt.area}`)}
                    className="p-2 bg-[#0a1827] hover:bg-[#0e2136] border border-[#13283e] rounded-xl flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div className="flex flex-col pr-2">
                      <span className="text-[11px] font-bold text-white group-hover:text-rose-300 transition-colors">
                        {alt.title}
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono">
                        {alt.loc}
                      </span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${alt.bg} shrink-0 font-mono`}>
                      {alt.pri}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: AI Insights */}
          <div className="bg-[#081522] border border-[#122436] rounded-2xl p-3 flex flex-col justify-between shadow-xl flex-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                  <Sparkles size={14} />
                  <span>AI Insights</span>
                </div>
                <button 
                  onClick={() => navigate('/kaizen')}
                  className="text-[10px] font-bold text-purple-400/90 hover:text-purple-300 hover:underline"
                >
                  View All
                </button>
              </div>

              {/* Insights List */}
              <div className="space-y-1.5">
                {[
                  { title: "Optimize CM1 Fan Speed", desc: "Potential saving: 612 kWh/day", icon: Zap, color: "text-[#00ff88]", link: "/optimization" },
                  { title: "Reduce Cooler False Air", desc: "Potential saving: 85 tCO₂/day", icon: Settings, color: "text-cyan-400", link: "/whrs" },
                  { title: "Raw Mill Feed Stability", desc: "Yield improvement: +2.5 TPH", icon: BarChart3, color: "text-emerald-400", link: "/kaizen" },
                ].map((ins, i) => (
                  <div 
                    key={i}
                    onClick={() => navigate(ins.link)}
                    className="p-2 bg-[#0a1827] hover:bg-[#0e2136] border border-[#13283e] rounded-xl flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#102438] flex items-center justify-center shrink-0">
                        <ins.icon size={13} className={ins.color} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-white group-hover:text-purple-300 transition-colors">
                          {ins.title}
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium">
                          {ins.desc}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={13} className="text-gray-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── ROW 3: DEPARTMENT STATUS + TRENDS 24H + ENERGY & EMISSIONS (EXACT bottom-row-ref.png) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* COL 1: DEPARTMENT STATUS (3 Cols) */}
        <div className="lg:col-span-3 bg-[#081522] border border-[#122436] rounded-2xl p-3 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xs font-bold text-white">Department Status</h3>
            <button 
              onClick={() => navigate('/equipment-health')}
              className="text-[10px] font-bold text-cyan-400 hover:underline"
            >
              View Details
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 my-auto">
            {[
              { name: "Mine", val: "500 TPH", area: "CR", color: "border-[#14283d] text-white", bar: "bg-[#00ff88]" },
              { name: "Crusher", val: "430 TPH", area: "CR", color: "border-[#14283d] text-cyan-400", bar: "bg-[#00ff88]" },
              { name: "Raw Mill", val: "265 TPH", area: "RM1", color: "border-amber-500/60 text-white", bar: "bg-amber-400" },
              { name: "Kiln", val: "3,210 TPH", area: "KILN", color: "border-[#14283d] text-white", bar: "bg-[#00ff88]" },
              { name: "Cooler", val: "265 TPH", area: "COOLER", color: "border-[#14283d] text-cyan-400", bar: "bg-[#00ff88]" },
              { name: "Cement Mill", val: "312.5 TPH", area: "CM2", color: "border-red-500/60 text-white", bar: "bg-red-400" },
              { name: "WHRS", val: "4.2 MW", area: "POWER", color: "border-[#14283d] text-white", bar: "bg-[#00ff88]" },
              { name: "CPP", val: "8.5 MW", area: "POWER", color: "border-[#14283d] text-white", bar: "bg-[#00ff88]" },
            ].map((d, i) => (
              <div 
                key={i}
                onClick={() => navigate(`/digital-twin?area=${d.area}`)}
                className={`bg-[#0a1827] border ${d.color} p-2 rounded-xl flex flex-col cursor-pointer transition-all hover:border-[#00ff88]`}
              >
                <span className="text-[10px] text-gray-400 font-medium">{d.name}</span>
                <span className={`text-xs font-black font-mono mt-0.5 ${d.color.includes('text-cyan') ? 'text-cyan-400' : 'text-white'}`}>{d.val}</span>
                <div className="w-full bg-[#122436] h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className={`${d.bar} h-full rounded-full w-4/5`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COL 2: TRENDS (LAST 24 HOURS) (5 Cols) */}
        <div className="lg:col-span-5 bg-[#081522] border border-[#122436] rounded-2xl p-3 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold text-white">Trends (Last 24 Hours)</h3>
            
            {/* Filter Pills */}
            <div className="flex bg-[#07131e] p-0.5 rounded-lg border border-[#14283b] text-[10px]">
              {(['PRODUCTION', 'POWER', 'SEC', 'EMISSIONS'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTrendTab(tab)}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${
                    activeTrendTab === tab
                      ? 'bg-[#106c35] text-white shadow-xs'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Legend row */}
          <div className="flex items-center gap-4 text-[10px] font-mono mb-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-gray-400">
                {activeTrendTab === 'PRODUCTION' ? 'Clinker (TPH)' : activeTrendTab === 'POWER' ? 'Total Power (MW)' : activeTrendTab === 'SEC' ? 'Clinker SEC' : 'CO₂ Factor'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
              <span className="text-gray-400">
                {activeTrendTab === 'PRODUCTION' ? 'Cement (TPH)' : activeTrendTab === 'POWER' ? 'WHRS Gen (MW)' : activeTrendTab === 'SEC' ? 'Cement SEC' : 'NOx Stack'}
              </span>
            </div>
          </div>

          <div className="h-32 w-full -mx-2">
            <ReactECharts option={get24hTrendOption()} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* COL 3: ENERGY & EMISSIONS (4 Cols) */}
        <div className="lg:col-span-4 bg-[#081522] border border-[#122436] rounded-2xl p-3 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xs font-bold text-white">Energy & Emissions</h3>
            <button 
              onClick={() => navigate('/energy')}
              className="text-[10px] font-bold text-cyan-400 hover:underline"
            >
              View Details
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 my-auto">
            
            {/* Dial 1: Plant SEC matching bottom-row-ref.png */}
            <div 
              onClick={() => navigate('/optimization')}
              className="bg-[#0a1827] border border-[#14283d] p-2 rounded-xl flex flex-col items-center justify-between text-center cursor-pointer hover:border-emerald-500/50 transition-all"
            >
              <span className="text-[10px] text-gray-400 font-bold">Plant SEC</span>
              
              {/* Radial Arc Ring */}
              <div className="relative w-14 h-14 my-1 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#122436" strokeWidth="3.2" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="75, 100" fill="none" stroke="#00ff88" strokeWidth="3.2" strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xs font-black text-white font-mono leading-none">64.2</span>
                  <span className="text-[7px] text-gray-400">kWh/t</span>
                </div>
              </div>

              <span className="text-[9px] font-bold text-[#00ff88]">↓ 4.5%</span>
              <span className="text-[8px] text-gray-500">vs last week</span>
            </div>

            {/* Dial 2: Power Mix matching bottom-row-ref.png */}
            <div 
              onClick={() => navigate('/captive-power')}
              className="bg-[#0a1827] border border-[#14283d] p-2 rounded-xl flex flex-col items-center justify-between text-center cursor-pointer hover:border-cyan-500/50 transition-all"
            >
              <span className="text-[10px] text-gray-400 font-bold">Power Mix</span>
              
              <div className="relative w-14 h-14 my-1 flex items-center justify-center">
                <ReactECharts option={getPowerMixOption()} style={{ height: '100%', width: '100%' }} />
                <div className="absolute flex flex-col items-center pointer-events-none">
                  <span className="text-xs font-black text-white font-mono leading-none">18.4</span>
                  <span className="text-[7px] text-gray-400">MW</span>
                </div>
              </div>

              <div className="flex flex-col text-[8px] text-gray-400 leading-tight">
                <span>■ Grid 18%</span>
                <span>■ CPP 59% • ■ WHRS 23%</span>
              </div>
            </div>

            {/* Dial 3: CO2 Emissions matching bottom-row-ref.png */}
            <div 
              onClick={() => navigate('/emissions')}
              className="bg-[#0a1827] border border-[#14283d] p-2 rounded-xl flex flex-col items-center justify-between text-center cursor-pointer hover:border-emerald-500/50 transition-all"
            >
              <span className="text-[10px] text-gray-400 font-bold">CO₂ Emissions</span>
              
              <div className="relative w-14 h-14 my-1 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#122436" strokeWidth="3.2" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="62, 100" fill="none" stroke="#10b981" strokeWidth="3.2" strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xs font-black text-white font-mono leading-none">0.642</span>
                  <span className="text-[7px] text-gray-400">tCO₂/t</span>
                </div>
              </div>

              <span className="text-[9px] font-bold text-[#00ff88]">↓ 12.3%</span>
              <span className="text-[8px] text-gray-500">vs last month</span>
            </div>

          </div>
        </div>

      </div>

      {/* ── ROW 4: AUTHENTIC SCHNEIDER FOOTER ───────────────────────── */}
      <div className="py-2 px-4 bg-[#07121b] border border-[#101e2c] rounded-xl flex items-center justify-between text-[11px] text-gray-400 font-sans">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white flex items-center gap-1">
            <span className="text-[#00ff88]">Schneider</span> Electric
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400">Life Is On</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
          <span>🌱 Building a Cleaner, More Efficient Tomorrow</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-gray-500">
          <span>KAIZEN Intelligence Platform v1.0.0</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">DCS SYNCED</span>
        </div>
      </div>

    </div>
  );
};

export default Overview;
