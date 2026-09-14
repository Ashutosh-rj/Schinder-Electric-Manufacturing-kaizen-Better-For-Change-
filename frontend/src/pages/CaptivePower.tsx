import React from 'react';
import { Power, Activity } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const CaptivePower = () => {
  const pieOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 5, borderColor: '#1a2540', borderWidth: 2 },
        label: { show: true, color: '#fff' },
        data: [
          { value: 8.5, name: 'CPP', itemStyle: { color: '#3b82f6' } },
          { value: 4.2, name: 'WHRS', itemStyle: { color: '#00e676' } },
          { value: 5.7, name: 'Grid', itemStyle: { color: '#ffa726' } }
        ]
      }
    ]
  };

  const lineOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['00:00','04:00','08:00','12:00','16:00','20:00'], axisLabel: { color: '#aaa' } },
    yAxis: { type: 'value', name: 'MW', splitLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#aaa' } },
    series: [
      { name: 'Total Load', type: 'line', data: [18.1, 18.2, 18.5, 18.4, 18.3, 18.4], itemStyle: { color: '#fff' } },
      { name: 'Grid', type: 'line', data: [5.4, 5.5, 5.9, 5.7, 5.6, 5.7], itemStyle: { color: '#ffa726' } },
      { name: 'CPP', type: 'line', data: [8.5, 8.5, 8.5, 8.5, 8.5, 8.5], itemStyle: { color: '#3b82f6' } },
      { name: 'WHRS', type: 'line', data: [4.2, 4.2, 4.1, 4.2, 4.2, 4.2], itemStyle: { color: '#00e676' } }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800 text-center flex justify-between items-center px-10">
        <div><div className="text-gray-400 text-sm">CPP Gen</div><div className="text-2xl font-bold text-[#3b82f6]">8.5 MW</div></div>
        <div className="text-xl text-gray-600">+</div>
        <div><div className="text-gray-400 text-sm">WHRS Gen</div><div className="text-2xl font-bold text-[#00e676]">4.2 MW</div></div>
        <div className="text-xl text-gray-600">+</div>
        <div><div className="text-gray-400 text-sm">Grid Import</div><div className="text-2xl font-bold text-[#ffa726]">5.7 MW</div></div>
        <div className="text-xl text-gray-600">=</div>
        <div><div className="text-gray-400 text-sm">Total Consumption</div><div className="text-2xl font-bold">18.4 MW</div></div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Power size={18}/> Power Source Balance</h3>
          <ReactECharts option={pieOpts} style={{ height: '300px' }} />
        </div>
        
        <div className="space-y-4">
          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-3">Power Factor</h3>
            <div className="flex justify-between items-center">
              <div className="text-4xl font-bold text-[#00d4ff]">0.92</div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Target: 0.95</div>
                <div className="text-xs text-[#ffa726] mt-1">Compensation active</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-3">Boiler & Turbine Parameters</h3>
            <table className="w-full text-sm text-left text-gray-300">
              <tbody>
                <tr className="border-b border-gray-800"><td className="py-2">Steam Pressure</td><td className="py-2 text-right font-mono">65 ata</td></tr>
                <tr className="border-b border-gray-800"><td className="py-2">Steam Temp</td><td className="py-2 text-right font-mono">485 °C</td></tr>
                <tr className="border-b border-gray-800"><td className="py-2">Boiler Efficiency</td><td className="py-2 text-right font-mono text-[#00e676]">82.4 %</td></tr>
                <tr><td className="py-2">Turbine Speed</td><td className="py-2 text-right font-mono text-white">3000 RPM</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
         <h3 className="font-bold mb-4 flex items-center gap-2"><Activity size={18}/> 24h Load Curve</h3>
         <ReactECharts option={lineOpts} style={{ height: '300px' }} />
      </div>
    </div>
  );
};
export default CaptivePower;
