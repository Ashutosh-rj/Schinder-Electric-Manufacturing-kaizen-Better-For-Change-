import React from 'react';
import { AlertTriangle, AlertCircle, Info, Search, ShieldAlert, CheckCircle } from 'lucide-react';

const Alarms: React.FC = () => {
  const alarms = [
    { id: 1, prio: 'CRITICAL', tag: 'CM1_MOT_TEMP_HI', desc: 'CM1 Mill Motor Bearing Temp High', val: '95°C', limit: '90°C', area: 'Cement Mill', dur: '12m', state: 'ACTIVE' },
    { id: 2, prio: 'HIGH', tag: 'CF1003_VIB_HI', desc: 'Cooler Fan CF-1003 Vibration High', val: '7.5 mm/s', limit: '5.0 mm/s', area: 'Cooler', dur: '45m', state: 'ACTIVE' },
    { id: 3, prio: 'HIGH', tag: 'KLN_NOX_HI', desc: 'Kiln NOx Emission Elevated', val: '850 mg', limit: '800 mg', area: 'Pyro', dur: '1h 10m', state: 'ACKNOWLEDGED' },
    { id: 4, prio: 'MEDIUM', tag: 'RM_DP_HI', desc: 'Raw Mill DP High', val: '625 mmWC', limit: '600 mmWC', area: 'Raw Mill', dur: '5m', state: 'ACTIVE' },
    { id: 5, prio: 'LOW', tag: 'WHRS_LVL_LO', desc: 'Steam Drum Level Low', val: '35%', limit: '40%', area: 'WHRS', dur: '2h', state: 'ACTIVE' },
  ];

  const getPrioColor = (prio: string) => {
    switch(prio) {
      case 'CRITICAL': return 'bg-[#ef5350] text-white';
      case 'HIGH': return 'bg-[#ffa726] text-black';
      case 'MEDIUM': return 'bg-yellow-400 text-black';
      default: return 'bg-[#00d4ff] text-black';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 relative">
      <div className="absolute top-2 right-2 text-[#ffa726] border border-[#ffa726] px-2 py-1 text-xs rounded opacity-70 z-50">
        [SIMULATED DATA]
      </div>

      {/* Header Summary */}
      <div className="flex gap-4 mb-6">
         <div className="bg-[#1a2540] p-4 rounded-lg flex-1 flex items-center justify-between shadow-lg">
            <h1 className="text-xl font-bold flex items-center gap-2"><AlertTriangle className="text-[#ffa726]" /> ALARM MANAGEMENT</h1>
            <div className="flex gap-4 text-sm font-bold">
               <span className="text-[#ef5350]">CRITICAL: 1</span>
               <span className="text-[#ffa726]">HIGH: 2</span>
               <span className="text-yellow-400">MEDIUM: 7</span>
               <span className="text-[#00d4ff]">LOW: 11</span>
               <span className="text-gray-400">TOTAL: 21</span>
            </div>
         </div>
      </div>

      {/* Intelligence Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
         <div className="bg-[#1a2540] p-4 rounded-lg border-l-4 border-[#00e676]">
            <div className="text-xs text-gray-400">Alarm Flood Status</div>
            <div className="font-bold flex items-center gap-2 mt-1"><CheckCircle size={16} className="text-[#00e676]" /> No Flood Active</div>
         </div>
         <div className="bg-[#1a2540] p-4 rounded-lg border-l-4 border-[#ffa726]">
            <div className="text-xs text-gray-400">Chattering Alarms</div>
            <div className="font-bold text-xl text-[#ffa726]">2</div>
            <div className="text-[10px] text-gray-500 mt-1">RM1_VIB_HI, KLN_O2_LO</div>
         </div>
         <div className="bg-[#1a2540] p-4 rounded-lg border-l-4 border-yellow-400">
            <div className="text-xs text-gray-400">Standing &gt; 24h</div>
            <div className="font-bold text-xl">4</div>
         </div>
         <div className="bg-[#1a2540] p-4 rounded-lg border-l-4 border-[#00d4ff]">
            <div className="text-xs text-gray-400">Nuisance Identified</div>
            <div className="font-bold text-xl">8</div>
         </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-4">
         <select className="bg-[#1a2540] border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none"><option>All Departments</option></select>
         <select className="bg-[#1a2540] border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none"><option>All Priorities</option></select>
         <select className="bg-[#1a2540] border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none"><option>ACTIVE</option></select>
         <div className="relative flex-1">
            <Search className="absolute left-3 top-2 text-gray-500" size={16} />
            <input type="text" placeholder="Search alarms..." className="w-full bg-[#1a2540] border border-gray-700 rounded pl-10 pr-4 py-2 text-sm focus:outline-none" />
         </div>
      </div>

      {/* Alarm Table */}
      <div className="bg-[#1a2540] rounded-lg overflow-hidden mb-6">
         <table className="w-full text-left text-sm">
            <thead className="bg-[#0a0e1a] text-gray-400 border-b border-gray-800">
               <tr>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Tag / Area</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Val / Limit</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Actions</th>
               </tr>
            </thead>
            <tbody>
               {alarms.map((al, i) => (
                  <React.Fragment key={al.id}>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                     <td className="p-3"><span className={`px-2 py-1 text-[10px] font-bold rounded ${getPrioColor(al.prio)}`}>{al.prio}</span></td>
                     <td className="p-3"><div className="font-mono text-xs">{al.tag}</div><div className="text-[10px] text-gray-500">{al.area}</div></td>
                     <td className="p-3 font-bold">{al.desc}</td>
                     <td className="p-3"><span className="text-[#ef5350]">{al.val}</span> <span className="text-gray-500 text-xs">/ {al.limit}</span></td>
                     <td className="p-3">{al.dur}</td>
                     <td className="p-3"><span className={al.state === 'ACTIVE' ? 'text-[#ef5350]' : 'text-gray-400'}>{al.state}</span></td>
                     <td className="p-3 flex gap-2">
                        {al.state === 'ACTIVE' && <button className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs">ACK</button>}
                        <button className="text-[#00d4ff] text-xs hover:underline">Details ▼</button>
                     </td>
                  </tr>
                  {/* Expanded Row for first item */}
                  {i === 0 && (
                     <tr className="bg-[#0a0e1a] border-b border-gray-800">
                        <td colSpan={7} className="p-4">
                           <div className="grid grid-cols-2 gap-6 text-sm">
                              <div>
                                 <h4 className="font-bold text-[#ffa726] mb-1">WHY DID IT OCCUR?</h4>
                                 <p className="text-gray-300 mb-3">Bearing temperature on Drive End has exceeded normal operating range rapidly over the last 15 minutes.</p>
                                 <h4 className="font-bold text-[#ffa726] mb-1">WHAT CAUSED IT?</h4>
                                 <ul className="list-disc pl-4 text-gray-300 mb-3 space-y-1">
                                    <li>Lube oil flow reduction (Check FT-201)</li>
                                    <li>Cooling water failure to heat exchanger</li>
                                    <li>Mechanical bearing degradation</li>
                                 </ul>
                              </div>
                              <div>
                                 <h4 className="font-bold text-[#ef5350] mb-1">WHAT IS THE CONSEQUENCE?</h4>
                                 <p className="text-gray-300 mb-3">Potential motor damage and catastrophic failure leading to 48+ hours downtime.</p>
                                 <h4 className="font-bold text-[#00d4ff] mb-1">OPERATOR ACTION</h4>
                                 <ol className="list-decimal pl-4 text-gray-300 mb-3 space-y-1">
                                    <li>Verify lube oil pressure locally</li>
                                    <li>Check cooling water return temperature</li>
                                    <li>Prepare to stop mill if temp reaches 100°C</li>
                                 </ol>
                                 <div className="flex gap-4 mt-4">
                                    <span className="text-xs text-gray-500">Occurrences (7d): 0</span>
                                    <button className="text-xs bg-[#1a2540] border border-[#00d4ff] text-[#00d4ff] px-2 py-1 rounded">View RCA Report</button>
                                 </div>
                              </div>
                           </div>
                        </td>
                     </tr>
                  )}
                  </React.Fragment>
               ))}
            </tbody>
         </table>
      </div>
      
      {/* Event Timeline */}
      <div className="bg-[#1a2540] p-4 rounded-lg">
         <h3 className="font-bold mb-4">Event Chain Timeline</h3>
         <div className="flex items-center gap-2 overflow-x-auto text-xs pb-2">
            <div className="bg-[#0a0e1a] border border-gray-700 p-2 rounded whitespace-nowrap"><span className="text-gray-500">10:45:00</span> CM1 Load Increased</div>
            <span className="text-gray-600">→</span>
            <div className="bg-[#0a0e1a] border border-gray-700 p-2 rounded whitespace-nowrap"><span className="text-gray-500">10:48:12</span> Lube Oil Flow Fluctuation</div>
            <span className="text-gray-600">→</span>
            <div className="bg-[#0a0e1a] border border-[#ffa726] p-2 rounded whitespace-nowrap"><span className="text-gray-500">10:52:30</span> Bearing Temp Warning (85°C)</div>
            <span className="text-gray-600">→</span>
            <div className="bg-[#0a0e1a] border border-[#ef5350] p-2 rounded whitespace-nowrap shadow-[0_0_10px_rgba(239,83,80,0.5)]"><span className="text-gray-500">10:55:00</span> Bearing Temp HIGH (95°C)</div>
         </div>
      </div>

    </div>
  );
};

export default Alarms;
