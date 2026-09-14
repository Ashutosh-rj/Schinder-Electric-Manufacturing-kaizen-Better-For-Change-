import React, { useState } from 'react';
import { Sliders, Activity, Save } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const WhatIfSimulator = () => {
  const [feed, setFeed] = useState(285);
  const [speed, setSpeed] = useState(3.2);

  const barOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { textStyle: { color: '#fff' } },
    xAxis: { type: 'category', data: ['Production', 'Heat', 'Power', 'CO2'], axisLabel: { color: '#aaa' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#aaa' } },
    series: [
      { name: 'Baseline', type: 'bar', data: [100, 100, 100, 100], itemStyle: { color: '#3b82f6' } },
      { name: 'Simulated', type: 'bar', data: [104.6, 98.3, 97.8, 98.3], itemStyle: { color: '#00d4ff' } }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#00d4ff]/10 border border-[#00d4ff]/30 p-4 rounded-lg flex items-start gap-3">
        <Sliders className="text-[#00d4ff] flex-shrink-0" />
        <div>
          <h3 className="text-[#00d4ff] font-bold">🔬 SIMULATION MODE</h3>
          <p className="text-sm text-gray-300 mt-1">Changes here do NOT affect actual plant controls. This is a mathematical model for advisory purposes only.</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Controls */}
        <div className="w-1/3 space-y-4">
          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-4">Scenario Parameters</h3>
            <div className="mb-4">
              <label className="text-xs text-gray-400 block mb-1">Preset Scenario</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:outline-none focus:border-[#00d4ff]">
                <option>Custom</option>
                <option>Raw Mill Optimization</option>
                <option selected>Kiln Stability</option>
                <option>Cooler Efficiency</option>
                <option>Cement Mill Blaine Adjustment</option>
                <option>Energy Peak Shaving</option>
              </select>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">Kiln Feed Rate (TPH)</span><span className="font-mono text-[#00d4ff]">{feed}</span></div>
                <input type="range" min="250" max="350" value={feed} onChange={(e) => setFeed(Number(e.target.value))} className="w-full accent-[#00d4ff]" />
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>250</span><span>Baseline: 285</span><span>350</span></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">Kiln Speed (RPM)</span><span className="font-mono text-[#00d4ff]">{speed}</span></div>
                <input type="range" min="2.5" max="4.0" step="0.1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-[#00d4ff]" />
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>2.5</span><span>Baseline: 3.2</span><span>4.0</span></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">Primary Air Flow (%)</span><span className="font-mono text-[#00d4ff]">12.5</span></div>
                <input type="range" min="8" max="18" step="0.1" defaultValue={12.5} className="w-full accent-[#00d4ff]" />
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>8</span><span>Baseline: 12.5</span><span>18</span></div>
              </div>
            </div>
            <button className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 rounded flex items-center justify-center gap-2 transition-colors">
              <Save size={16} /> Save Scenario
            </button>
          </div>
        </div>

        {/* Outcomes */}
        <div className="w-2/3 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
              <div className="text-sm text-gray-400 mb-1">Production</div>
              <div className="text-2xl font-bold">285 <span className="text-sm font-normal text-gray-500">→</span> <span className="text-[#00e676]">298 TPH</span></div>
              <div className="text-xs text-[#00e676] mt-1">+4.6% Improvement ✅</div>
            </div>
            <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
              <div className="text-sm text-gray-400 mb-1">Heat Consumption</div>
              <div className="text-2xl font-bold">745 <span className="text-sm font-normal text-gray-500">→</span> <span className="text-[#00e676]">732 kcal/kg</span></div>
              <div className="text-xs text-[#00e676] mt-1">-1.7% Reduction ✅</div>
            </div>
            <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
              <div className="text-sm text-gray-400 mb-1">Electrical SEC</div>
              <div className="text-2xl font-bold">64.2 <span className="text-sm font-normal text-gray-500">→</span> <span className="text-[#00e676]">62.8 kWh/t</span></div>
              <div className="text-xs text-[#00e676] mt-1">-2.2% Reduction ✅</div>
            </div>
            <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
              <div className="text-sm text-gray-400 mb-1">CO2 Emissions</div>
              <div className="text-2xl font-bold">820 <span className="text-sm font-normal text-gray-500">→</span> <span className="text-[#00e676]">806 kg/t</span></div>
              <div className="text-xs text-[#00e676] mt-1">-1.7% Reduction ✅</div>
            </div>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-[#1a2540] p-3 rounded-lg border border-gray-800 flex-1 flex justify-between items-center">
                <span className="text-sm text-gray-400">Quality Risk</span>
                <span className="text-[#00e676] font-bold text-sm">LOW</span>
             </div>
             <div className="bg-[#1a2540] p-3 rounded-lg border border-gray-800 flex-1 flex justify-between items-center">
                <span className="text-sm text-gray-400">Equipment Risk</span>
                <span className="text-[#ffa726] font-bold text-sm">MEDIUM</span>
             </div>
             <div className="bg-[#1a2540] p-3 rounded-lg border border-gray-800 flex-1 flex justify-between items-center">
                <span className="text-sm text-gray-400">Confidence</span>
                <span className="text-white font-bold text-sm">72%</span>
             </div>
          </div>

          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Activity size={18}/> Relative Comparison (Baseline = 100%)</h3>
            <ReactECharts option={barOpts} style={{ height: '250px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default WhatIfSimulator;
