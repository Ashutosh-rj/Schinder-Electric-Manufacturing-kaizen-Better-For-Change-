import React, { useEffect, useState } from 'react';
import { Layers, ChevronRight, Activity, Zap, AlertTriangle, Settings } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { api } from '../lib/api';

const LossTree = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKaizen = async () => {
      try {
        const res = await api.get('/kaizen');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch Kaizen data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchKaizen();
  }, []);

  if (loading && !data) {
    return <div className="p-6 text-[#00d4ff]">Loading Loss Tree Analysis...</div>;
  }

  const opps = data?.opportunities || [];
  
  // Sort by savings desc
  const sortedOpps = [...opps].sort((a: any, b: any) => b.saving_inr_day - a.saving_inr_day);
  const topOpps = sortedOpps.slice(0, 5); // top 5 for chart

  const chartCategories = topOpps.map((o: any) => `${o.department} Loss`);
  const chartValues = topOpps.map((o: any) => o.saving_inr_day);
  
  let cumulative = 0;
  const totalLoss = chartValues.reduce((a, b) => a + b, 0) || 1;
  const chartCumulative = chartValues.map((v) => {
    cumulative += v;
    return Math.round((cumulative / totalLoss) * 100);
  });

  const paretoOption = {
    grid: { top: 30, right: 30, bottom: 20, left: 50 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: chartCategories, axisLabel: { color: '#5a7384', fontSize: 10, interval: 0, rotate: 15 } },
    yAxis: [
      { type: 'value', name: 'Loss (₹)', axisLabel: { color: '#5a7384', fontSize: 10 }, splitLine: { lineStyle: { color: '#15303f' } } },
      { type: 'value', name: 'Cumulative %', min: 0, max: 100, axisLabel: { formatter: '{value} %', color: '#5a7384', fontSize: 10 }, splitLine: { show: false } }
    ],
    series: [
      { name: 'Loss', type: 'bar', itemStyle: { color: '#ef5350' }, data: chartValues },
      { name: 'Cumulative', type: 'line', yAxisIndex: 1, itemStyle: { color: '#ffa726' }, data: chartCumulative }
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#041116] text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-wide">Loss Tree Analysis</h1>
          <p className="text-[11px] text-[#8899aa] uppercase tracking-wider">Dynamic Opportunities based on Live Data</p>
        </div>
      </div>

      <div className="flex gap-4 flex-1 overflow-hidden">
        {/* Tree Column */}
        <div className="w-[450px] bg-[#091b24] border border-[#15303f] rounded-xl p-4 shadow-lg overflow-y-auto custom-scrollbar">
           <div className="text-[12px] text-[#5a7384] font-bold uppercase tracking-wider mb-4">Plant Losses Hierarchy</div>
           
           <div className="space-y-1">
             <div className="flex items-center gap-2 p-2 rounded hover:bg-[#15303f]/50 cursor-pointer text-[13px] font-bold">
               <ChevronRight size={14} className="text-[#8899aa] rotate-90" />
               <Activity size={14} className="text-[#00d4ff]"/>
               <span>Total Plant Identified Losses</span>
               <span className="ml-auto text-[#ef5350]">₹{data?.total_potential_saving_inr_day?.toLocaleString() || 0}/day</span>
             </div>
             
             <div className="ml-6 space-y-1 border-l border-[#15303f] pl-2">
               <div className="flex items-center gap-2 p-2 rounded bg-[#15303f]/30 cursor-pointer text-[12px] font-medium border-l-2 border-[#ef5350]">
                 <ChevronRight size={14} className="text-[#8899aa] rotate-90" />
                 <Zap size={14} className="text-[#ef5350]"/>
                 <span>Identified Opportunities</span>
                 <span className="ml-auto text-[#ef5350]">₹{data?.total_potential_saving_inr_day?.toLocaleString() || 0}</span>
               </div>

               <div className="ml-6 space-y-1 border-l border-[#15303f] pl-2">
                 {sortedOpps.map((opp: any, i: number) => (
                    <div key={i} className={`flex flex-col gap-1 p-2 rounded cursor-pointer text-[11px] ${i === 0 ? 'bg-[#ef5350]/10 border border-[#ef5350]/30 text-[#e8eaf6]' : 'hover:bg-[#15303f]/50 text-[#8899aa]'}`}>
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#ef5350]' : 'bg-[#ffa726]'}`}></div>
                         <span className={i === 0 ? 'font-bold' : ''}>{opp.title}</span>
                         <span className={`ml-auto ${i === 0 ? 'font-bold text-[#ef5350]' : 'text-gray-300'}`}>₹{Math.round(opp.saving_inr_day).toLocaleString()}</span>
                      </div>
                      {i === 0 && (
                         <div className="pl-3 mt-1 text-[10px] text-gray-400">
                           {opp.description}
                         </div>
                      )}
                    </div>
                 ))}
                 {sortedOpps.length === 0 && (
                    <div className="p-2 text-xs text-gray-500">No losses identified by Kaizen worker.</div>
                 )}
               </div>
             </div>
           </div>
        </div>

        {/* Right Detail Pane */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
           {/* Pareto Chart */}
           <div className="bg-[#091b24] border border-[#15303f] rounded-xl p-4 shadow-lg h-[250px] shrink-0">
              <h3 className="text-[13px] font-bold text-white mb-2">Pareto Analysis (Top Losses)</h3>
              <ReactECharts option={paretoOption} style={{ height: '100%', width: '100%' }} />
           </div>

           {/* Detail View of Selected Loss */}
           {sortedOpps.length > 0 && (
             <div className="flex-1 bg-[#091b24] border border-[#15303f] rounded-xl p-6 shadow-lg overflow-y-auto">
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-[#15303f]">
                   <div>
                      <div className="text-[11px] text-[#ef5350] font-bold tracking-wider mb-2 flex items-center gap-1"><AlertTriangle size={12}/> #1 KAIZEN PRIORITY</div>
                      <h2 className="text-[20px] font-bold text-white mb-2">{sortedOpps[0].title}</h2>
                      <div className="text-[13px] text-[#8899aa] max-w-2xl">{sortedOpps[0].description}</div>
                   </div>
                   <div className="text-right bg-[#15303f]/30 p-3 rounded-lg border border-[#15303f]">
                      <div className="text-[11px] text-[#8899aa] uppercase font-bold tracking-wider mb-1">Financial Impact</div>
                      <div className="text-[24px] font-bold text-[#ef5350]">₹{Math.round(sortedOpps[0].saving_inr_day).toLocaleString()} <span className="text-[12px] text-[#5a7384] font-normal">/day</span></div>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <h4 className="text-[13px] font-bold text-white mb-4 flex items-center gap-2"><Settings size={14} className="text-[#00d4ff]"/> Recommendation Action</h4>
                      <div className="bg-[#041116] border border-[#15303f] p-4 rounded-lg">
                         <div className="text-sm text-gray-300">
                           Implement Kaizen opportunity to optimize {sortedOpps[0].department} parameters. {sortedOpps[0].description}
                         </div>
                         <div className="mt-4 pt-4 border-t border-[#15303f] flex items-center justify-between">
                            <span className="text-xs text-gray-500">Savings: {Math.round(sortedOpps[0].saving_kwh_day)} kWh/day</span>
                            <button className="bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                               EXECUTE RECOMMENDATION
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}
           {sortedOpps.length === 0 && (
             <div className="flex-1 bg-[#091b24] border border-[#15303f] rounded-xl flex items-center justify-center text-gray-500">
               No opportunities detected. Process is optimal.
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default LossTree;
