import React from 'react';
import { Layers, ChevronRight, Activity, Zap, AlertTriangle, Settings } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const LossTree = () => {
  const paretoOption = {
    grid: { top: 30, right: 30, bottom: 20, left: 50 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: ['Energy (CM1)', 'Thermal (Kiln)', 'Stoppage (RM1)', 'Quality (CM2)', 'Idling (Kiln)'], axisLabel: { color: '#5a7384', fontSize: 10 } },
    yAxis: [
      { type: 'value', name: 'Loss (₹)', axisLabel: { color: '#5a7384', fontSize: 10 }, splitLine: { lineStyle: { color: '#15303f' } } },
      { type: 'value', name: 'Cumulative %', min: 0, max: 100, axisLabel: { formatter: '{value} %', color: '#5a7384', fontSize: 10 }, splitLine: { show: false } }
    ],
    series: [
      { name: 'Loss', type: 'bar', itemStyle: { color: '#ef5350' }, data: [42000, 28500, 15200, 9500, 4800] },
      { name: 'Cumulative', type: 'line', yAxisIndex: 1, itemStyle: { color: '#ffa726' }, data: [42, 70.5, 85.7, 95.2, 100] }
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#041116] text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-wide">Loss Tree Analysis</h1>
          <p className="text-[11px] text-[#8899aa] uppercase tracking-wider">16 Major Losses Methodology</p>
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
               <span>Total Plant Losses</span>
               <span className="ml-auto text-[#ef5350]">₹1,00,000/day</span>
             </div>
             
             <div className="ml-6 space-y-1 border-l border-[#15303f] pl-2">
               <div className="flex items-center gap-2 p-2 rounded bg-[#15303f]/30 cursor-pointer text-[12px] font-medium border-l-2 border-[#ef5350]">
                 <ChevronRight size={14} className="text-[#8899aa] rotate-90" />
                 <Zap size={14} className="text-[#ef5350]"/>
                 <span>Energy Losses</span>
                 <span className="ml-auto text-[#ef5350]">₹70,500</span>
               </div>

               <div className="ml-6 space-y-1 border-l border-[#15303f] pl-2">
                 <div className="flex items-center gap-2 p-2 rounded hover:bg-[#15303f]/50 cursor-pointer text-[11px] text-[#e8eaf6] bg-[#ef5350]/10 border border-[#ef5350]/30">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#ef5350]"></div>
                   <span>Specific Energy Deviation (CM1)</span>
                   <span className="ml-auto font-bold text-[#ef5350]">₹42,000</span>
                 </div>
                 <div className="flex items-center gap-2 p-2 rounded hover:bg-[#15303f]/50 cursor-pointer text-[11px] text-[#e8eaf6]">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#ffa726]"></div>
                   <span>Thermal Inefficiency (Kiln)</span>
                   <span className="ml-auto">₹28,500</span>
                 </div>
               </div>

               <div className="flex items-center gap-2 p-2 rounded hover:bg-[#15303f]/50 cursor-pointer text-[12px] font-medium">
                 <ChevronRight size={14} className="text-[#8899aa]" />
                 <Settings size={14} className="text-[#ffa726]"/>
                 <span>Equipment & Production Losses</span>
                 <span className="ml-auto text-[#ffa726]">₹20,000</span>
               </div>
               
               <div className="flex items-center gap-2 p-2 rounded hover:bg-[#15303f]/50 cursor-pointer text-[12px] font-medium">
                 <ChevronRight size={14} className="text-[#8899aa]" />
                 <AlertTriangle size={14} className="text-[#00e676]"/>
                 <span>Defect & Quality Losses</span>
                 <span className="ml-auto">₹9,500</span>
               </div>
             </div>
           </div>
        </div>

        {/* Details & Chart Column */}
        <div className="flex-1 flex flex-col gap-4">
           {/* Selected Node Details */}
           <div className="bg-[#091b24] border border-[#ef5350]/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Zap size={100} />
              </div>
              <h3 className="text-[12px] text-[#ef5350] font-bold uppercase tracking-wider mb-2">Selected Loss Profile</h3>
              <div className="text-[20px] font-bold text-white mb-4">Specific Energy Deviation (CM1)</div>
              
              <div className="grid grid-cols-3 gap-6 mb-4">
                 <div>
                   <div className="text-[10px] text-[#8899aa] uppercase mb-1">Equipment</div>
                   <div className="text-[13px] text-white">Cement Mill 1 Fan</div>
                 </div>
                 <div>
                   <div className="text-[10px] text-[#8899aa] uppercase mb-1">Daily Impact</div>
                   <div className="text-[15px] text-[#ef5350] font-bold">₹42,000</div>
                 </div>
                 <div>
                   <div className="text-[10px] text-[#8899aa] uppercase mb-1">Frequency</div>
                   <div className="text-[13px] text-white">Continuous</div>
                 </div>
              </div>
              
              <button className="bg-[#ef5350] hover:bg-[#d32f2f] text-white py-2 px-6 rounded-lg text-[12px] font-bold transition-colors">
                CREATE KAIZEN PROJECT
              </button>
           </div>

           {/* Pareto Chart */}
           <div className="bg-[#091b24] border border-[#15303f] rounded-xl p-5 shadow-lg flex-1 flex flex-col">
              <h3 className="text-[12px] text-[#5a7384] font-bold uppercase tracking-wider mb-4">Loss Prioritization (Pareto)</h3>
              <div className="flex-1">
                 <ReactECharts option={paretoOption} style={{ height: '100%', width: '100%' }} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LossTree;
