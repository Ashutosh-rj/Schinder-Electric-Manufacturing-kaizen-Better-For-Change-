import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Settings, CheckCircle } from 'lucide-react';

const Optimization = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runOptimization = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/optimization/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'plant',
          constraints: {},
          objective: 'minimize_energy'
        })
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (err) {
      console.error("Optimization failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#ffa726]/10 border border-[#ffa726]/30 p-4 rounded-lg flex items-start gap-3">
        <AlertTriangle className="text-[#ffa726] flex-shrink-0" />
        <div>
          <h3 className="text-[#ffa726] font-bold">⚠️ OPTIMIZATION ADVISORY MODE (SIMULATED)</h3>
          <p className="text-sm text-gray-300 mt-1">Recommendations are generated using a simplified linear physics proxy model of the kiln. All recommendations require human review and approval before implementation. Existing DCS/PLC safety logic remains in full authority.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Settings size={18}/> Objective Function</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-800/50 p-3 rounded border border-[#00e676]/30">
              <div className="text-[#00e676] font-bold mb-2">MAXIMIZE</div>
              <ul className="text-gray-300 space-y-1"><li>• Clinker Production</li><li>• Cement Quality</li></ul>
            </div>
            <div className="bg-gray-800/50 p-3 rounded border border-[#00d4ff]/30">
              <div className="text-[#00d4ff] font-bold mb-2">MINIMIZE</div>
              <ul className="text-gray-300 space-y-1"><li>• Heat Consumption</li><li>• Electrical Energy</li><li>• CO2 Emissions</li><li>• Equipment Stress</li></ul>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            SUBJECT TO: Safety constraints <span className="text-[#00e676]">✅</span> | Quality constraints <span className="text-[#00e676]">✅</span> | Equipment limits <span className="text-[#00e676]">✅</span> | Environmental limits <span className="text-[#00e676]">✅</span>
          </div>
        </div>
        
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18}/> Expected Benefits</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <span className="text-gray-400">Energy Savings</span>
              <span className="text-lg font-bold text-[#00e676]">
                {data ? `${data.expected_savings?.energy_kwh_day} kWh/day (₹ ${data.expected_savings?.cost_day}/day)` : '---'}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <span className="text-gray-400">Production Gain</span>
              <span className="text-lg font-bold text-[#00e676]">---</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">CO2 Reduction</span>
              <span className="text-lg font-bold text-[#00d4ff]">
                {data ? `${data.expected_savings?.co2_tday} t/day` : '---'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a2540] rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-lg font-bold">Current vs Optimized</h2>
          <button 
            className="bg-[#00d4ff] hover:bg-[#00b4d8] text-[#0a0e1a] px-4 py-2 rounded text-sm font-bold transition-colors disabled:opacity-50" 
            onClick={runOptimization}
            disabled={loading}
          >
            {loading ? 'Running...' : 'Run Optimization'}
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
            <tr>
              <th className="px-4 py-3">Parameter</th>
              <th className="px-4 py-3">Current</th>
              <th className="px-4 py-3">Optimized</th>
              <th className="px-4 py-3">Delta</th>
              <th className="px-4 py-3">Unit</th>
            </tr>
          </thead>
          <tbody>
            {data ? data.recommendations.map((r: any) => {
              const delta = (r.recommended - r.current).toFixed(2);
              const isPositive = Number(delta) > 0;
              return (
                <tr key={r.parameter} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-medium capitalize">{r.parameter.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 font-mono">{r.current}</td>
                  <td className="px-4 py-3 font-mono text-white">{r.recommended}</td>
                  <td className={`px-4 py-3 font-bold ${isPositive ? 'text-[#00e676]' : 'text-[#ef5350]'}`}>
                    {isPositive ? '+' : ''}{delta}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{r.unit}</td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Run optimization to view parameters</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Optimization;
