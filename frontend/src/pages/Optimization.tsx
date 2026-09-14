import React from 'react';
import { AlertTriangle, TrendingUp, Settings, CheckCircle } from 'lucide-react';

const Optimization = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#ffa726]/10 border border-[#ffa726]/30 p-4 rounded-lg flex items-start gap-3">
        <AlertTriangle className="text-[#ffa726] flex-shrink-0" />
        <div>
          <h3 className="text-[#ffa726] font-bold">⚠️ OPTIMIZATION ADVISORY MODE</h3>
          <p className="text-sm text-gray-300 mt-1">All recommendations require human review and approval before implementation. Existing DCS/PLC safety logic remains in full authority.</p>
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
              <span className="text-lg font-bold text-[#00e676]">2,450 kWh/day (₹ 18,500/day)</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <span className="text-gray-400">Production Gain</span>
              <span className="text-lg font-bold text-[#00e676]">316.8 t/day</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">CO2 Reduction</span>
              <span className="text-lg font-bold text-[#00d4ff]">4.2 t/day</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a2540] rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-lg font-bold">Current vs Optimized</h2>
          <button className="bg-[#00d4ff] hover:bg-[#00b4d8] text-[#0a0e1a] px-4 py-2 rounded text-sm font-bold transition-colors" onClick={() => alert('This will generate new advisory recommendations. No automatic changes will be made to plant controls.')}>
            Run Optimization
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
            {[
              { p: 'Clinker Production', c: '285.3', o: '298.5', d: '+13.2', u: 'TPH', good: true },
              { p: 'Heat Consumption', c: '745.2', o: '728.5', d: '-16.7', u: 'kcal/kg', good: true },
              { p: 'SEC Clinker', c: '64.2', o: '61.8', d: '-2.4', u: 'kWh/t', good: true },
              { p: 'CO2 Intensity', c: '820', o: '802', d: '-18', u: 'kg/t', good: true },
              { p: 'Kiln Feed', c: '285', o: '295', d: '+10', u: 'TPH', good: false },
              { p: 'Kiln Speed', c: '3.20', o: '3.35', d: '+0.15', u: 'RPM', good: false },
              { p: 'Primary Air', c: '12.5', o: '11.8', d: '-0.7', u: '%', good: true }
            ].map(r => (
              <tr key={r.p} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="px-4 py-3 font-medium">{r.p}</td>
                <td className="px-4 py-3 font-mono">{r.c}</td>
                <td className="px-4 py-3 font-mono text-white">{r.o}</td>
                <td className={`px-4 py-3 font-bold ${r.good ? 'text-[#00e676]' : 'text-[#ef5350]'}`}>{r.d}</td>
                <td className="px-4 py-3 text-gray-500">{r.u}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Optimization;
