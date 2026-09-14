import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Wind, Leaf } from 'lucide-react';

const Emissions = () => {
  const lineOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1', '2', '3', '4', '5', '6', '7'], axisLabel: { color: '#aaa' } },
    yAxis: { type: 'value', min: 780, max: 850, splitLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#aaa' } },
    series: [
      { name: 'CO2 Intensity', type: 'line', data: [825, 822, 818, 815, 820, 819, 820], itemStyle: { color: '#00d4ff' }, smooth: true },
      { name: 'Target', type: 'line', data: [800, 800, 800, 800, 800, 800, 800], itemStyle: { color: '#00e676' }, lineStyle: { type: 'dashed' } }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: 'CO2 Intensity', v: '820', u: 'kg/t clinker', target: '800' },
          { l: 'NOx', v: '850', u: 'mg/Nm³', target: '1200' },
          { l: 'SO2', v: '180', u: 'mg/Nm³', target: '600' },
          { l: 'Dust / PM', v: '28', u: 'mg/Nm³', target: '50' },
        ].map(k => (
          <div key={k.l} className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">{k.l}</div>
            <div className="text-2xl font-bold">{k.v} <span className="text-sm text-gray-500 font-normal">{k.u}</span></div>
            <div className="text-xs text-gray-500 mt-2">Limit/Target: {k.target}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Leaf size={18} className="text-[#00e676]"/> CO2 Avoided Today</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">From WHRS</span><span className="font-bold">12.3 t</span></div>
              <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-[#00e676] h-2 rounded-full" style={{width: '70%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">From Efficiency</span><span className="font-bold">4.5 t</span></div>
              <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-[#00d4ff] h-2 rounded-full" style={{width: '30%'}}></div></div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Alternative Fuel (AF) Sub. Rate</span>
                  <span className="font-bold text-[#00e676]">14.2%</span>
              </div>
          </div>
        </div>

        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Wind size={18}/> Emission Sources (CO2)</h3>
          <table className="w-full text-sm text-left text-gray-300">
            <tbody>
              <tr className="border-b border-gray-800"><td className="py-3">Process (Calcination)</td><td className="py-3 text-right">520 kg/t</td><td className="py-3 text-right text-gray-500">63%</td></tr>
              <tr className="border-b border-gray-800"><td className="py-3">Fuel (Coal)</td><td className="py-3 text-right">240 kg/t</td><td className="py-3 text-right text-gray-500">29%</td></tr>
              <tr><td className="py-3">Electricity (Grid)</td><td className="py-3 text-right">60 kg/t</td><td className="py-3 text-right text-gray-500">8%</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2">CO2 Intensity Trend (Last 7 Days)</h3>
          <ReactECharts option={lineOpts} style={{ height: '300px' }} />
      </div>
    </div>
  );
};
export default Emissions;
