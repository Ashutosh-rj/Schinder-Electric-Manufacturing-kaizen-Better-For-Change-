import React from 'react';
import ReactECharts from 'echarts-for-react';
import { AlertTriangle, Clock, Activity, Calendar } from 'lucide-react';

const PredictiveMaintenance = () => {
  const riskTimelineOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: Array.from({length: 30}, (_, i) => `Day ${i+1}`), axisLabel: {color: '#888'} },
    yAxis: { type: 'value', axisLabel: {color: '#888'} },
    series: [
      {
        name: 'Risk Score',
        type: 'line',
        smooth: true,
        data: Array.from({length: 30}, (_, i) => 20 + i * 2.5 + Math.random() * 5),
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: '#ef5350' }, { offset: 1, color: 'rgba(239,83,80,0.1)' }]
          }
        },
        itemStyle: { color: '#ef5350' }
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#ffa726]/10 border border-[#ffa726]/30 p-4 rounded-lg flex items-start gap-3">
        <AlertTriangle className="text-[#ffa726] flex-shrink-0" />
        <div>
          <h3 className="text-[#ffa726] font-bold">PREDICTIVE MAINTENANCE ADVISORY</h3>
          <p className="text-sm text-gray-300 mt-1">These are statistical estimates based on sensor trends. Actual failure timing varies significantly. Do not defer planned maintenance based solely on these predictions. All maintenance decisions must be validated by qualified engineers.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#1a2540] rounded-lg border border-gray-800 p-4">
          <h2 className="text-lg font-bold mb-4">Risk Timeline (30 Days) - CF-1003 Cooler Fan 3</h2>
          <ReactECharts option={riskTimelineOpts} style={{ height: '300px' }} />
        </div>
        
        <div className="col-span-1 space-y-4">
          <h2 className="text-lg font-bold">Top At-Risk Equipment</h2>
          
          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-bold">CF-1003 Cooler Fan 3</div>
                <div className="text-xs text-gray-400">Pyro Area</div>
              </div>
              <span className="bg-[#ef5350]/20 text-[#ef5350] text-xs px-2 py-1 rounded font-bold">HIGH RISK</span>
            </div>
            
            <div className="space-y-2 mt-4 text-sm">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Bearing Temp</span><span>85%</span></div>
                <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-[#ef5350] h-1.5 rounded-full" style={{width: '85%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Vibration</span><span>72%</span></div>
                <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-[#ffa726] h-1.5 rounded-full" style={{width: '72%'}}></div></div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 bg-gray-900/50 p-2 rounded">Based on current degradation trend, bearing inspection recommended within 15-21 days.</p>
            
            <button className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 rounded transition-colors">
              Schedule Inspection
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1a2540] rounded-lg border border-gray-800 p-4">
        <h2 className="text-lg font-bold mb-4">MTBF / MTTR Statistics</h2>
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
            <tr>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">MTBF (hours)</th>
              <th className="px-4 py-2">MTTR (hours)</th>
              <th className="px-4 py-2">Availability %</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800"><td className="px-4 py-2">Fans</td><td className="px-4 py-2">2850</td><td className="px-4 py-2">4.2</td><td className="px-4 py-2">99.85</td></tr>
            <tr className="border-b border-gray-800"><td className="px-4 py-2">Motors</td><td className="px-4 py-2">8500</td><td className="px-4 py-2">2.8</td><td className="px-4 py-2">99.97</td></tr>
            <tr className="border-b border-gray-800"><td className="px-4 py-2">Pumps</td><td className="px-4 py-2">4200</td><td className="px-4 py-2">3.5</td><td className="px-4 py-2">99.91</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PredictiveMaintenance;
