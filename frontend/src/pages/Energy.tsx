import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Zap, Target, TrendingDown, Clock, Lightbulb } from 'lucide-react';

const Energy: React.FC = () => {
  const lineOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['00:00','04:00','08:00','12:00','16:00','20:00','24:00'] },
    yAxis: { type: 'value', min: 60, max: 70 },
    series: [
      { name: 'SEC', type: 'line', data: [65.2, 64.8, 63.5, 66.1, 64.2, 63.9, 64.2], smooth: true, itemStyle: { color: '#00d4ff' } },
      { name: 'Target', type: 'line', data: [64, 64, 64, 64, 64, 64, 64], lineStyle: { type: 'dashed', color: '#00e676' } }
    ]
  };

  const barOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { textStyle: { color: '#fff' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: ['Packing', 'Cement Mill', 'Clinker Trans', 'Pyroprocessing', 'Coal Mill', 'Raw Mill'] },
    series: [
      { name: 'Actual', type: 'bar', data: [
          { value: 3.2, itemStyle: { color: '#ffa726' } },
          { value: 38.5, itemStyle: { color: '#ef5350' } },
          { value: 2.1, itemStyle: { color: '#ffa726' } },
          { value: 28.3, itemStyle: { color: '#ffa726' } },
          { value: 4.2, itemStyle: { color: '#ffa726' } },
          { value: 18.5, itemStyle: { color: '#ffa726' } }
      ] },
      { name: 'Target', type: 'bar', data: [3.0, 36.0, 2.0, 27.0, 4.0, 17.0], itemStyle: { color: '#00e676' } }
    ]
  };

  const donutOption = {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['50%', '70%'],
      data: [
        { value: 4.2, name: 'WHRS', itemStyle: { color: '#00e676' } },
        { value: 8.5, name: 'CPP', itemStyle: { color: '#00d4ff' } },
        { value: 5.7, name: 'Grid', itemStyle: { color: '#ffa726' } }
      ],
      label: { color: '#fff' }
    }]
  };

  const waterfallOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['Total Demand', 'Grid', 'CPP', 'WHRS'] },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar', stack: 'Total', itemStyle: { color: 'rgba(0,0,0,0)' },
        data: [0, 12.7, 4.2, 0]
      },
      {
        type: 'bar', stack: 'Total', label: { show: true, position: 'top', color: '#fff' },
        data: [
          { value: 18.4, itemStyle: { color: '#ef5350' } },
          { value: 5.7, itemStyle: { color: '#ffa726' } },
          { value: 8.5, itemStyle: { color: '#00d4ff' } },
          { value: 4.2, itemStyle: { color: '#00e676' } }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 relative">
      <div className="absolute top-2 right-2 text-[#ffa726] border border-[#ffa726] px-2 py-1 text-xs rounded opacity-70 z-50">
        [SIMULATED DATA]
      </div>

      <div className="flex justify-between items-center bg-[#1a2540] p-4 rounded-lg mb-6 shadow-lg">
        <h1 className="text-xl font-bold tracking-wider">ENERGY MANAGEMENT</h1>
        <div className="flex bg-[#0a0e1a] rounded p-1">
          {['Today', 'This Week', 'This Month'].map((t, i) => (
             <button key={i} className={`px-4 py-1 text-sm rounded ${i === 0 ? 'bg-[#00d4ff] text-black font-bold' : 'text-gray-400'}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Power', value: '18.4', unit: 'MW', color: '#00d4ff' },
          { label: 'Plant SEC', value: '64.2', unit: 'kWh/t', color: '#ef5350' },
          { label: 'WHRS Gen', value: '4.2', unit: 'MW', color: '#00e676' },
          { label: 'CPP Gen', value: '8.5', unit: 'MW', color: '#00d4ff' },
          { label: 'Grid Import', value: '5.7', unit: 'MW', color: '#ffa726' }
        ].map((kpi, i) => (
          <div key={i} className="bg-[#1a2540] p-4 rounded-lg border-t-2" style={{ borderColor: kpi.color }}>
            <div className="text-gray-400 text-xs mb-1">{kpi.label}</div>
            <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value} <span className="text-sm font-normal text-gray-500">{kpi.unit}</span></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-7 space-y-6">
          <div className="bg-[#1a2540] p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">SEC Performance</h2>
            <div className="flex gap-8 mb-4">
               <div>
                  <div className="text-sm text-gray-400">Current</div>
                  <div className="text-3xl font-bold text-[#ef5350]">64.2</div>
               </div>
               <div>
                  <div className="text-sm text-gray-400">Target</div>
                  <div className="text-3xl font-bold text-[#00e676]">64.0</div>
               </div>
               <div>
                  <div className="text-sm text-gray-400">Best</div>
                  <div className="text-3xl font-bold text-[#00d4ff]">62.5</div>
               </div>
            </div>
            <ReactECharts option={lineOption} style={{ height: '250px' }} />
          </div>

          <div className="bg-[#1a2540] p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Energy Breakdown by Department</h2>
            <ReactECharts option={barOption} style={{ height: '300px' }} />
          </div>
        </div>

        <div className="col-span-5 space-y-6">
          <div className="bg-[#1a2540] p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Power Balance</h2>
            <ReactECharts option={waterfallOption} style={{ height: '250px' }} />
          </div>

          <div className="bg-[#1a2540] p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Generation Mix</h2>
            <ReactECharts option={donutOption} style={{ height: '200px' }} />
          </div>

          <div className="bg-[#1a2540] p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Lightbulb className="text-[#ffa726]" /> Saving Opportunities</h2>
            <div className="space-y-3">
               <div className="bg-[#0a0e1a] p-3 rounded border border-gray-700">
                  <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-sm text-[#00d4ff]">Cement Mill 1 Fan</span>
                     <span className="bg-[#0a0e1a] border border-[#ef5350] text-[#ef5350] text-xs px-2 py-0.5 rounded">HIGH CONFIDENCE</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">Consuming 2.4 kWh/t more than 30-day best.</p>
                  <div className="text-sm text-[#00e676] font-bold">Opportunity: ₹12,500/day</div>
               </div>
               <div className="bg-[#0a0e1a] p-3 rounded border border-gray-700">
                  <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-sm text-[#00d4ff]">Raw Mill Classifier</span>
                     <span className="bg-[#0a0e1a] border border-[#ffa726] text-[#ffa726] text-xs px-2 py-0.5 rounded">MED CONFIDENCE</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">Speed optimization possible based on current feed.</p>
                  <div className="text-sm text-[#00e676] font-bold">Opportunity: ₹5,400/day</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Energy;
