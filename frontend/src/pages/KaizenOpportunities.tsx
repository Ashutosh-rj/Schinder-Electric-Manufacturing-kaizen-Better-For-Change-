import React from 'react';
import { Lightbulb, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const opps = [
  { id: 'KAI-001', title: 'Cement Mill 2 Fan Speed Optimization', saving: '185 kWh/day', val: '₹1,400', diff: 'LOW', stat: 'Open', dept: 'Production' },
  { id: 'KAI-002', title: 'Limestone Crusher Feed Optimization', saving: '320 kWh/day', val: '₹2,400', diff: 'MEDIUM', stat: 'In Progress', dept: 'Production' },
  { id: 'KAI-003', title: 'Kiln Primary Air Reduction', saving: '420 kWh/day', val: '₹3,150', diff: 'LOW', stat: 'Open', dept: 'Process' },
  { id: 'KAI-004', title: 'Raw Mill Separator Speed Optimization', saving: '280 kWh/day', val: '₹2,100', diff: 'LOW', stat: 'Open', dept: 'Process' },
  { id: 'KAI-005', title: 'WHRS AQC Boiler Cleaning', saving: '890 kWh/day', val: '₹6,675', diff: 'MEDIUM', stat: 'Open', dept: 'Maintenance' },
  { id: 'KAI-006', title: 'Cooler Fan Profile Optimization', saving: '350 kWh/day', val: '₹2,625', diff: 'LOW', stat: 'Open', dept: 'Process' },
  { id: 'KAI-007', title: 'Preheater False Air Sealing', saving: '580 kWh/day', val: '₹4,350', diff: 'HIGH', stat: 'Closed', dept: 'Maintenance' },
  { id: 'KAI-008', title: 'VFD Installation on RM Fan', saving: '1200 kWh/day', val: '₹9,000', diff: 'HIGH', stat: 'Open', dept: 'Projects' }
];

const KaizenOpportunities = () => {
  const scatterOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{b}' },
    xAxis: { name: 'Difficulty (1=Low, 3=High)', type: 'value', min: 0, max: 4, splitLine: { show: false }, axisLabel: { color: '#aaa' } },
    yAxis: { name: 'Savings Potential (₹/day)', type: 'value', splitLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#aaa' } },
    series: [
      {
        type: 'scatter',
        symbolSize: (data: any) => data[2] * 5,
        itemStyle: { color: '#00d4ff', opacity: 0.8 },
        data: [
          { value: [1, 1400, 8, 'KAI-001'], name: 'KAI-001' },
          { value: [2, 2400, 7, 'KAI-002'], name: 'KAI-002' },
          { value: [1, 3150, 9, 'KAI-003'], name: 'KAI-003' },
          { value: [1, 2100, 8, 'KAI-004'], name: 'KAI-004' },
          { value: [2, 6675, 6, 'KAI-005'], name: 'KAI-005' },
          { value: [1, 2625, 8, 'KAI-006'], name: 'KAI-006' },
          { value: [3, 4350, 5, 'KAI-007'], name: 'KAI-007' },
          { value: [3, 9000, 9, 'KAI-008'], name: 'KAI-008' }
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800"><div className="text-sm text-gray-400">Total Potential</div><div className="text-2xl font-bold text-[#00e676]">₹48,500/day</div></div>
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800"><div className="text-sm text-gray-400">Open</div><div className="text-2xl font-bold text-[#00d4ff]">14</div></div>
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800"><div className="text-sm text-gray-400">In Progress</div><div className="text-2xl font-bold text-[#ffa726]">3</div></div>
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800"><div className="text-sm text-gray-400">Closed (Verified)</div><div className="text-2xl font-bold text-gray-300">8</div></div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-1 bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-4">Priority Matrix</h3>
            <ReactECharts option={scatterOpts} style={{ height: '300px' }} />
         </div>
         <div className="col-span-2 bg-[#1a2540] rounded-lg border border-gray-800 p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><Lightbulb size={18}/> Opportunity List</h2>
                <select className="bg-gray-800 text-sm text-white p-1 rounded border border-gray-700">
                    <option>All Status</option>
                    <option>Open</option>
                    <option>In Progress</option>
                </select>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {opps.map(o => (
                <div key={o.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#00d4ff] font-mono">{o.id}</span>
                        <span className="text-xs bg-gray-700 px-1 rounded">{o.dept}</span>
                    </div>
                    <div className="font-bold text-white text-sm">{o.title}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <div className="text-xs text-gray-400">Potential</div>
                      <div className="font-bold text-[#00e676] text-sm">{o.saving}</div>
                    </div>
                    <div className="text-right w-20">
                      <div className="text-xs text-gray-400">Difficulty</div>
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block ${o.diff==='LOW'?'bg-[#00e676]/20 text-[#00e676]':o.diff==='MEDIUM'?'bg-[#ffa726]/20 text-[#ffa726]':'bg-[#ef5350]/20 text-[#ef5350]'}`}>{o.diff}</div>
                    </div>
                    <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded text-xs text-white transition-colors">View PDCA</button>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};
export default KaizenOpportunities;
