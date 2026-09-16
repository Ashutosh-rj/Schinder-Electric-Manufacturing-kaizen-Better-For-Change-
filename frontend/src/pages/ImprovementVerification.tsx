import React from 'react';
import { Activity, CheckCircle2, TrendingDown, ArrowRight, Zap, Target } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const ImprovementVerification = () => {
  const chartOption = {
    grid: { top: 20, right: 20, bottom: 20, left: 40 },
    tooltip: { trigger: 'axis', backgroundColor: '#091b24', borderColor: '#15303f', textStyle: { color: '#e8eaf6' } },
    xAxis: { type: 'category', data: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Implementation', 'Day 6', 'Day 7', 'Day 8'], axisLabel: { color: '#5a7384', fontSize: 10 } },
    yAxis: { type: 'value', min: 35, max: 45, splitLine: { lineStyle: { color: '#15303f' } }, axisLabel: { color: '#5a7384', fontSize: 10 } },
    series: [
      {
        name: 'SEC (kWh/t)',
        type: 'line',
        data: [41.2, 41.0, 41.5, 41.1, 39.5, 37.8, 37.6, 37.8],
        itemStyle: { color: '#00e676' },
        lineStyle: { width: 3 },
        markArea: {
          itemStyle: { color: 'rgba(0, 212, 255, 0.1)' },
          data: [[ { name: 'After Implementation', xAxis: 'Implementation' }, { xAxis: 'Day 8' } ]]
        },
        markLine: {
          data: [{ yAxis: 38.0, name: 'Target' }],
          lineStyle: { color: '#00d4ff', type: 'dashed' },
          label: { color: '#00d4ff' }
        }
      }
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#041116] text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-wide">Improvement Verification</h1>
          <p className="text-[11px] text-[#8899aa] uppercase tracking-wider">Project: KAI-3001 | Cement Mill 1 Energy Loss</p>
        </div>
        <div className="flex items-center gap-3 bg-[#00e676]/10 border border-[#00e676]/30 px-4 py-2 rounded-lg">
          <CheckCircle2 size={20} className="text-[#00e676]" />
          <span className="text-[14px] font-bold text-[#00e676] tracking-wide">KAIZEN VERIFIED</span>
        </div>
      </div>

      <div className="flex gap-4 flex-1 overflow-hidden">
        {/* Metrics Column */}
        <div className="w-[350px] flex flex-col gap-4">
          <div className="bg-[#091b24] border border-[#15303f] rounded-xl p-5 shadow-lg">
            <h3 className="text-[12px] text-[#5a7384] font-bold uppercase tracking-wider mb-4">Primary Metric</h3>
            
            <div className="flex items-center gap-3 mb-2">
              <Zap size={20} className="text-[#00e676]" />
              <span className="text-[18px] font-bold text-white">Specific Energy (SEC)</span>
            </div>
            
            <div className="flex items-end gap-4 mt-6">
               <div className="flex flex-col">
                 <span className="text-[10px] text-[#8899aa] mb-1">BEFORE</span>
                 <span className="text-[20px] font-bold text-[#ef5350]">41.0<span className="text-[12px] font-normal ml-1">kWh/t</span></span>
               </div>
               <ArrowRight className="text-[#5a7384] mb-2" size={16} />
               <div className="flex flex-col">
                 <span className="text-[10px] text-[#8899aa] mb-1 flex items-center gap-1"><Target size={10}/> TARGET</span>
                 <span className="text-[14px] font-bold text-[#00d4ff]">38.0<span className="text-[10px] font-normal ml-1">kWh/t</span></span>
               </div>
               <ArrowRight className="text-[#5a7384] mb-2" size={16} />
               <div className="flex flex-col">
                 <span className="text-[10px] text-[#00e676] font-bold mb-1">AFTER</span>
                 <span className="text-[24px] font-bold text-[#00e676]">37.8<span className="text-[12px] font-normal ml-1">kWh/t</span></span>
               </div>
            </div>
          </div>

          <div className="bg-[#091b24] border border-[#15303f] rounded-xl p-5 shadow-lg flex-1">
            <h3 className="text-[12px] text-[#5a7384] font-bold uppercase tracking-wider mb-4">Secondary Metrics check</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center bg-[#041116] p-3 rounded-lg border border-[#15303f]">
                 <span className="text-[13px] text-white">Production Maintained</span>
                 <CheckCircle2 size={16} className="text-[#00e676]"/>
               </div>
               <div className="flex justify-between items-center bg-[#041116] p-3 rounded-lg border border-[#15303f]">
                 <span className="text-[13px] text-white">Quality (Blaine) Maintained</span>
                 <CheckCircle2 size={16} className="text-[#00e676]"/>
               </div>
               <div className="flex justify-between items-center bg-[#041116] p-3 rounded-lg border border-[#15303f]">
                 <span className="text-[13px] text-white">Equipment Vibration Normal</span>
                 <CheckCircle2 size={16} className="text-[#00e676]"/>
               </div>
            </div>
            
            <button className="w-full mt-6 bg-[#00d4ff] hover:bg-[#00b8e6] text-[#041116] py-2.5 rounded-lg text-[12px] font-bold transition-colors">
              STANDARDIZE IMPROVEMENT
            </button>
          </div>
        </div>

        {/* Chart Column */}
        <div className="flex-1 bg-[#091b24] border border-[#15303f] rounded-xl p-5 shadow-lg flex flex-col">
           <h3 className="text-[12px] text-[#5a7384] font-bold uppercase tracking-wider mb-4">Verification Trend</h3>
           <div className="flex-1">
             <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovementVerification;
