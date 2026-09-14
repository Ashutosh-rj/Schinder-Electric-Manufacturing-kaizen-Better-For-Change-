import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Battery, Flame, Zap } from 'lucide-react';

const WHRS = () => {
  const lineOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['00:00','04:00','08:00','12:00','16:00','20:00'], axisLabel: { color: '#aaa' } },
    yAxis: { type: 'value', name: 'MW', splitLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#aaa' } },
    series: [
      { name: 'Generation', type: 'line', data: [3.8, 3.9, 4.1, 4.2, 4.1, 4.2], itemStyle: { color: '#00e676' }, smooth: true, areaStyle: { opacity: 0.1 } },
      { name: 'Target', type: 'line', data: [5.5, 5.5, 5.5, 5.5, 5.5, 5.5], itemStyle: { color: '#aaa' }, lineStyle: { type: 'dashed' } }
    ]
  };

  const sankeyOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [
      {
        type: 'sankey',
        data: [
          { name: 'Kiln Exhaust' },
          { name: 'PH Exit' },
          { name: 'AQC Boiler' },
          { name: 'PH Boiler' },
          { name: 'Steam Header' },
          { name: 'Turbine' },
          { name: 'Generator' }
        ],
        links: [
          { source: 'Kiln Exhaust', target: 'AQC Boiler', value: 45 },
          { source: 'PH Exit', target: 'PH Boiler', value: 55 },
          { source: 'AQC Boiler', target: 'Steam Header', value: 40 },
          { source: 'PH Boiler', target: 'Steam Header', value: 50 },
          { source: 'Steam Header', target: 'Turbine', value: 90 },
          { source: 'Turbine', target: 'Generator', value: 85 }
        ],
        lineStyle: { color: 'source', curveness: 0.5 },
        itemStyle: { color: '#00d4ff', borderColor: '#1a2540' },
        label: { color: '#fff' }
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: 'Generation', v: '4.2 MW', c: 'text-[#00e676]' },
          { l: 'Efficiency', v: '78.5%', c: 'text-white' },
          { l: 'Target', v: '5.5 MW', c: 'text-gray-400' },
          { l: 'Deviation', v: '-1.3 MW', c: 'text-[#ef5350]', desc: '-23.6%' },
        ].map(k => (
          <div key={k.l} className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">{k.l}</div>
            <div className={`text-2xl font-bold ${k.c}`}>{k.v} <span className="text-sm font-normal">{k.desc}</span></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Zap size={18}/> Heat Flow & Generation</h3>
          <ReactECharts option={sankeyOpts} style={{ height: '300px' }} />
        </div>
        
        <div className="col-span-1 space-y-4">
          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Flame size={18} className="text-[#ffa726]"/> AQC Boiler</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Inlet Temp</span><span>320 °C</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Outlet Temp</span><span>110 °C</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Steam Gen</span><span>12.5 TPH</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Efficiency</span><span>72%</span></div>
            </div>
          </div>
          
          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Flame size={18} className="text-[#00d4ff]"/> PH Boiler</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Inlet Temp</span><span>340 °C</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Outlet Temp</span><span>210 °C</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Steam Gen</span><span>15.2 TPH</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Zap size={18}/> 24h Generation Trend</h3>
          <ReactECharts option={lineOpts} style={{ height: '250px' }} />
        </div>

        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-3 text-[#ef5350]">Lost Generation Analysis</h3>
            <p className="text-sm text-gray-300">Currently generating 4.2 MW vs maximum achievable 5.5 MW. Lost 1.3 MW due to:</p>
            <ul className="text-sm text-gray-400 list-disc pl-4 mt-2 space-y-1">
              <li>Low cooler exhaust heat (0.8 MW)</li>
              <li>AQC boiler fouling (0.5 MW)</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-800 text-sm">
                <div className="text-gray-400">CO2 Avoided Today</div>
                <div className="text-xl font-bold text-[#00e676]">42.5 tonnes</div>
            </div>
            <div className="mt-4 bg-[#00d4ff]/10 border border-[#00d4ff]/30 p-2 rounded text-xs text-[#00d4ff]">
               Advisory: Schedule AQC boiler cleaning to recover ~0.5 MW.
            </div>
        </div>
      </div>
    </div>
  );
};
export default WHRS;
