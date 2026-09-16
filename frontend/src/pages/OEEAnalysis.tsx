import React from 'react';
import { Activity, Zap, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const OEEAnalysis = () => {
  const cascadeOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 30, right: 30, bottom: 20, left: 50 },
    xAxis: { type: 'category', data: ['Total Time', 'Planned Down', 'Available', 'Unplanned Down', 'Operating', 'Speed Loss', 'Net Oper.', 'Quality Loss', 'Fully Prod.'], axisLabel: { color: '#5a7384', fontSize: 10, interval: 0, rotate: 30 } },
    yAxis: { type: 'value', name: 'Hours', axisLabel: { color: '#5a7384', fontSize: 10 }, splitLine: { lineStyle: { color: '#15303f' } } },
    series: [
      {
        type: 'bar',
        stack: 'Total',
        itemStyle: { color: 'rgba(0,0,0,0)' },
        data: [0, 21.6, 0, 18.2, 0, 16.5, 0, 15.8, 0] // Bottom of floating bars
      },
      {
        type: 'bar',
        stack: 'Total',
        label: { show: true, position: 'top', color: '#fff', fontSize: 10 },
        itemStyle: { color: (params) => {
          const colors = ['#3b82f6', '#5a7384', '#00d4ff', '#ef5350', '#00e676', '#ffa726', '#00e676', '#ef5350', '#00e676'];
          return colors[params.dataIndex];
        }},
        data: [24, 2.4, 21.6, 3.4, 18.2, 1.7, 16.5, 0.7, 15.8] // Values
      }
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#041116] text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-wide">OEE Analysis</h1>
          <p className="text-[11px] text-[#8899aa] uppercase tracking-wider">Overall Equipment Effectiveness (Cement Mill 1)</p>
        </div>
        <div className="flex bg-[#091b24] p-1 rounded-lg border border-[#15303f]">
          <button className="px-4 py-1.5 text-[12px] font-bold rounded bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30">Today</button>
          <button className="px-4 py-1.5 text-[12px] font-bold rounded text-[#5a7384] hover:text-white">Week</button>
          <button className="px-4 py-1.5 text-[12px] font-bold rounded text-[#5a7384] hover:text-white">Month</button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="bg-[#091b24] border border-[#15303f] rounded-xl p-4 flex-1 flex flex-col items-center justify-center shadow-sm">
           <div className="text-[11px] text-[#8899aa] font-bold uppercase tracking-wider mb-2">Availability (A)</div>
           <div className="text-[28px] font-bold text-[#00d4ff]">84.2%</div>
        </div>
        <div className="flex items-center text-[#5a7384]"><ArrowRight size={20}/></div>
        <div className="bg-[#091b24] border border-[#15303f] rounded-xl p-4 flex-1 flex flex-col items-center justify-center shadow-sm">
           <div className="text-[11px] text-[#8899aa] font-bold uppercase tracking-wider mb-2">Performance (P)</div>
           <div className="text-[28px] font-bold text-[#ffa726]">90.6%</div>
        </div>
        <div className="flex items-center text-[#5a7384]"><ArrowRight size={20}/></div>
        <div className="bg-[#091b24] border border-[#15303f] rounded-xl p-4 flex-1 flex flex-col items-center justify-center shadow-sm">
           <div className="text-[11px] text-[#8899aa] font-bold uppercase tracking-wider mb-2">Quality (Q)</div>
           <div className="text-[28px] font-bold text-[#00e676]">95.7%</div>
        </div>
        <div className="flex items-center text-[#5a7384]"><ArrowRight size={20}/></div>
        <div className="bg-[#091b24] border border-[#00e676]/30 rounded-xl p-4 flex-1 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-[#00e676]/10 to-transparent"></div>
           <div className="text-[12px] text-[#00e676] font-bold uppercase tracking-wider mb-2 relative z-10">Total OEE</div>
           <div className="text-[32px] font-bold text-white relative z-10">73.0%</div>
        </div>
      </div>

      <div className="bg-[#091b24] border border-[#15303f] rounded-xl p-5 shadow-lg flex-1 flex flex-col">
         <h3 className="text-[12px] text-[#5a7384] font-bold uppercase tracking-wider mb-4">OEE Time Cascade (Hours)</h3>
         <div className="flex-1">
           <ReactECharts option={cascadeOption} style={{ height: '100%', width: '100%' }} />
         </div>
      </div>
    </div>
  );
};

export default OEEAnalysis;
