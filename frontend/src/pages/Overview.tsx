import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  AlertTriangle, CheckCircle2, Settings, ChevronRight, Zap, Info, ArrowRight, Play, Server, ServerCrash, 
  Activity, ArrowUpRight, ArrowDownRight, Wind, Component
} from 'lucide-react';
import { api } from '../lib/api';

const Overview: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const sparklineOption = (data: number[], color: string) => ({
    grid: { top: 5, bottom: 5, left: 5, right: 5 },
    xAxis: { show: false, type: 'category' },
    yAxis: { show: false, type: 'value', min: 'dataMin' },
    series: [{
      data,
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: { color, width: 2 },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: color }, { offset: 1, color: 'transparent' }]
        },
        opacity: 0.4
      }
    }]
  });

  if (loading && !data) {
    return <div className="p-6 text-[#00e676]">Loading Command Center...</div>;
  }

  // Safely extract data
  const clinkerTph = data?.production?.clinker_tph || 0;
  const cementTph = data?.production?.cement_tph || 0;
  const totalPower = data?.energy?.total_power_mw || 0;
  const sec = data?.energy?.sec_kwh_ton_clinker || 0;
  const whrs = data?.energy?.whrs_generation_mw || 0;
  const efficiency = data?.production?.efficiency_pct || 0;
  const activeCritical = data?.alarms?.critical || 0;
  const activeAlarms = data?.alarms?.total_active || 0;
  const plantStatus = data?.plant_status || "NORMAL";
  const potentialSavings = data?.kaizen?.total_potential_saving_today || 0;

  const kpis = [
    { label: 'CLINKER PROD', value: clinkerTph, unit: 'TPH', trend: '↑ 2.4%', up: true, icon: <Activity size={18} fill="currentColor" opacity={0.8}/>, color: '#00e676', data: [12, 14, 15, 14, 16, 18, 17] },
    { label: 'CEMENT PROD', value: cementTph, unit: 'TPH', trend: '↑ 1.8%', up: true, icon: <Activity size={18} fill="currentColor" opacity={0.8}/>, color: '#00d4ff', data: [15, 16, 14, 18, 17, 19, 20] },
    { label: 'TOTAL POWER', value: totalPower, unit: 'MW', trend: '↓ 3.1%', up: false, icon: <Zap size={18} fill="currentColor"/>, color: '#ffa726', data: [20, 19, 21, 18, 17, 18, 16] },
    { label: 'SPECIFIC ENERGY', value: sec, unit: 'kWh/t', trend: '↓ 4.5%', up: false, icon: <Zap size={18} fill="currentColor"/>, color: '#3b82f6', data: [68, 67, 65, 66, 64, 63, 62] },
    { label: 'WHRS GEN', value: whrs, unit: 'MW', trend: '↑ 6.7%', up: true, icon: <Wind size={18} fill="currentColor"/>, color: '#00e676', data: [3.8, 3.9, 4.0, 4.1, 4.0, 4.2, 4.3] },
  ];

  return (
    <div className="flex flex-col gap-4 max-w-[1920px] mx-auto pb-4">
      {/* Top KPIs */}
      <div className="flex gap-4 h-[94px]">
        {kpis.map((kpi, i) => (
          <div key={i} className="flex-1 bg-[#091b24] border border-[#15303f] rounded-xl p-3 flex items-center justify-between min-w-[160px] shadow-sm">
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 rounded-md" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
                  {kpi.icon}
                </div>
                <div className="text-[9px] text-[#8899aa] font-bold uppercase tracking-wider">{kpi.label}</div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[24px] font-bold text-white leading-none tracking-tight">{kpi.value}</span>
                <span className="text-[11px] font-medium text-[#5a7384]">{kpi.unit}</span>
              </div>
              <div className={`text-[10px] font-bold mt-1.5 ${kpi.up ? 'text-[#00e676]' : 'text-[#ffa726]'}`}>
                {kpi.trend}
              </div>
            </div>
            <div className="w-[60px] h-[45px] ml-1 mt-6">
              <ReactECharts option={sparklineOption(kpi.data, kpi.color)} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
        ))}

        {/* Efficiency Score */}
        <div className="w-[160px] bg-[#091b24] border border-[#15303f] rounded-xl p-3 flex items-center justify-between shrink-0 shadow-sm">
           <div className="flex flex-col h-full justify-between w-full">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-[9px] text-[#8899aa] font-bold uppercase tracking-wider">PLANT EFFICIENCY</div>
              </div>
              <div className="text-[24px] font-bold text-[#00e676] leading-none mt-1 tracking-tight">{efficiency}%</div>
              <div className="w-full h-1.5 bg-[#15303f] rounded-full mt-3 overflow-hidden">
                 <div className="h-full bg-[#00e676]" style={{width: `${efficiency}%`}}></div>
              </div>
           </div>
        </div>

        {/* Plant Status & Avoidable Loss */}
        <div className={`w-[220px] border rounded-xl p-3 flex flex-col justify-between shrink-0 relative overflow-hidden shadow-sm ${plantStatus === 'NORMAL' ? 'bg-[#00e676]/5 border-[#00e676]/30' : 'bg-[#ef5350]/5 border-[#ef5350]/30'}`}>
           <div className={`absolute bottom-0 left-0 h-[5px] rounded-r-full ${plantStatus === 'NORMAL' ? 'bg-[#00e676]' : 'bg-[#ef5350]'}`} style={{width: '84%'}}></div>
           <div className="flex items-center justify-between mb-2">
             <div className={`text-[9px] font-bold uppercase tracking-wider ${plantStatus === 'NORMAL' ? 'text-[#00e676]' : 'text-[#ef5350]'}`}>PLANT STATUS</div>
             <div className="text-[13px] font-bold text-white">{data?.kaizen_score || 84}<span className="text-[#5a7384] text-[10px] font-medium ml-0.5">/100 Kaizen</span></div>
           </div>
           <div className="flex items-center gap-2">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${plantStatus === 'NORMAL' ? 'bg-[#00e676]' : 'bg-[#ef5350]'}`}>
                {plantStatus === 'NORMAL' ? <CheckCircle2 size={20} className="text-[#091b24]" strokeWidth={3} /> : <AlertTriangle size={20} className="text-[#091b24]" strokeWidth={3} />}
             </div>
             <div className="flex flex-col">
               <span className="text-[13px] font-bold text-white tracking-wide">{plantStatus === 'NORMAL' ? 'Running Stable' : 'Attention Required'}</span>
               <span className="text-[10px] text-[#8899aa]">Avoidable Loss: <span className="text-[#ffa726] font-bold">₹{potentialSavings}/day</span></span>
             </div>
           </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex gap-4">
        {/* TOP 3 LOSSES */}
        <div className="flex-[1] flex flex-col gap-4">
          <div className="bg-gradient-to-br from-[#1a0f14] to-[#0a0508] border border-[#ef5350]/40 rounded-xl p-5 shadow-lg relative overflow-hidden h-[240px]">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <AlertTriangle size={120} className="text-[#ef5350]" />
             </div>
             <div className="relative z-10 flex flex-col h-full">
               <div className="flex items-center gap-2 mb-4">
                 <div className="w-2 h-2 rounded-full bg-[#ef5350] animate-pulse"></div>
                 <h2 className="text-[18px] font-extrabold text-[#ef5350] tracking-wider uppercase">TOP #1 LOSS TO FIX NOW</h2>
               </div>
               
               <div className="flex-1 flex flex-col">
                 <h3 className="text-[24px] font-bold text-white mb-2 leading-tight">{data?.kaizen?.top_opportunity?.title || 'No major losses detected'}</h3>
                 
                 <div className="flex items-center gap-6 mb-4 mt-2">
                   <div className="flex flex-col">
                     <span className="text-[11px] text-[#8899aa] uppercase font-bold tracking-wider mb-1">Impact</span>
                     <span className="text-[20px] font-bold text-[#ffa726]">₹{data?.kaizen?.top_opportunity?.saving_kwh_day ? (data.kaizen.top_opportunity.saving_kwh_day * 7.5).toLocaleString() : '0'}<span className="text-[12px] text-[#5a7384] ml-1">/day</span></span>
                   </div>
                   <div className="w-[1px] h-8 bg-[#ef5350]/30"></div>
                   <div className="flex flex-col">
                     <span className="text-[11px] text-[#8899aa] uppercase font-bold tracking-wider mb-1">Status</span>
                     <span className="text-[14px] font-bold text-white">Loss detected by Kaizen worker</span>
                   </div>
                 </div>

                 <div className="flex items-center gap-2 mt-auto">
                    <span className="text-[12px] text-[#8899aa]">Priority:</span>
                    <span className="text-[12px] font-bold text-[#00d4ff]">{data?.kaizen?.top_opportunity?.priority || 'LOW'}</span>
                 </div>
               </div>

               <div className="absolute bottom-4 right-4 flex gap-2">
                  <button className="bg-transparent border border-[#ef5350] text-[#ef5350] hover:bg-[#ef5350]/10 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                    ANALYZE
                  </button>
                  <button className="bg-[#ef5350] hover:bg-[#d32f2f] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                    CREATE KAIZEN <ArrowRight size={14}/>
                  </button>
               </div>
             </div>
          </div>

          <div className="bg-[#091b24] border border-[#15303f] rounded-xl p-4 flex-1 shadow-sm">
             <div className="flex justify-between items-center mb-3">
                <h3 className="text-[14px] font-bold text-white tracking-wide uppercase">Other Priority Losses</h3>
             </div>
             <div className="space-y-3">
                <div className="bg-[#041116] border border-[#15303f] rounded-lg p-3 flex justify-between items-center">
                   <div>
                     <div className="text-[13px] font-bold text-white mb-1">Active Opportunities: {data?.kaizen?.open_opportunities || 0}</div>
                     <div className="text-[11px] text-[#8899aa]">Total Potential Savings</div>
                   </div>
                   <div className="text-right">
                     <div className="text-[14px] font-bold text-[#ffa726]">₹{data?.kaizen?.total_potential_saving_today ? data.kaizen.total_potential_saving_today.toLocaleString() : '0'}/day</div>
                     <a href="/kaizen" className="text-[10px] text-[#00d4ff] font-medium mt-1 hover:underline">View All</a>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* PLANT DIGITAL FLOW */}
        <div className="flex-[2] bg-[#091b24] border border-[#15303f] rounded-xl p-4 flex flex-col overflow-hidden shadow-sm relative">
           <div className="flex justify-between items-center mb-4 relative z-20">
             <div className="flex items-center gap-2">
               <Component size={18} className="text-[#00d4ff]"/>
               <h2 className="text-[16px] font-bold text-white leading-tight uppercase">Integrated Plant Digital Flow</h2>
             </div>
           </div>

           <div className="flex-1 bg-[#041116] rounded-lg border border-[#1c3a4a] p-4 flex flex-col justify-center items-center relative overflow-hidden">
             
             {/* Flow Diagram */}
             <div className="w-full flex items-center justify-between relative px-8 z-10 py-12">
                {/* Connecting Line */}
                <div className="absolute top-[35%] left-16 right-16 h-1 bg-[#15303f] -z-10 rounded-full"></div>
                <div className="absolute top-[35%] left-16 w-3/4 h-1 bg-gradient-to-r from-[#00e676] to-[#ffa726] -z-10 rounded-full"></div>

                {(data?.departments || [
                  { name: 'Mine', production_tph: 500, status: 'NORMAL' },
                  { name: 'Crusher', production_tph: 430, status: 'NORMAL' },
                  { name: 'Raw Mill', production_tph: 265, status: 'ATTENTION' },
                  { name: 'Kiln', production_tph: 185, status: 'NORMAL' },
                  { name: 'Cooler', production_tph: 185, status: 'NORMAL' },
                  { name: 'Cement Mill', production_tph: 145, status: 'CRITICAL' },
                  { name: 'Packing', production_tph: 145, status: 'NORMAL' },
                ]).map((node: any, i: number) => {
                  const statusLabel = node.status === 'NORMAL' ? 'ok' : node.status === 'ATTENTION' ? 'warn' : 'err';
                  return (
                  <div key={i} className="flex flex-col items-center group cursor-pointer">
                    <div className="mb-2 text-[10px] text-[#8899aa] font-bold uppercase">{node.name}</div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#041116] z-10 transition-transform group-hover:scale-110 shadow-lg
                      ${statusLabel === 'ok' ? 'bg-[#00e676]' : statusLabel === 'warn' ? 'bg-[#ffa726]' : 'bg-[#ef5350]'}
                    `}>
                      {statusLabel === 'ok' && <CheckCircle2 size={24} className="text-[#041116]" />}
                      {statusLabel === 'warn' && <AlertTriangle size={20} className="text-[#041116]" />}
                      {statusLabel === 'err' && <AlertTriangle size={20} className="text-[#041116]" />}
                    </div>
                    <div className="mt-2 text-[11px] font-bold text-white bg-[#091b24] px-2 py-1 rounded border border-[#15303f]">{node.production_tph} T</div>
                    
                    {statusLabel === 'err' && (
                      <div className="absolute -bottom-8 bg-[#ef5350]/10 border border-[#ef5350]/30 px-2 py-1 rounded text-[#ef5350] text-[9px] font-bold whitespace-nowrap">
                        Loss Detected
                      </div>
                    )}
                  </div>
                )})}
             </div>
             
             {/* Power Layer beneath */}
             <div className="w-full mt-auto pt-4 border-t border-[#1c3a4a] flex justify-center gap-12 text-[11px] text-[#5a7384]">
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00e676]"></div> WHRS: {whrs} MW</div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div> GRID: {data?.energy?.grid_import_mw || 0} MW</div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ffa726]"></div> CPP: {data?.energy?.cpp_generation_mw || 0} MW</div>
             </div>

           </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
