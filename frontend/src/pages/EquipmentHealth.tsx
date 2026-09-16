import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const mockEquipments = [
  { id: 'KLN-901', name: 'Kiln Drive', area: 'Pyro', health: 88, status: 'Normal', risk: 'Vibration normal', last: '2 days ago', next: '28 days', mtbf: '120 days', mttr: '8 hours' },
  { id: 'VRM-501', name: 'Raw Mill', area: 'Raw Grinding', health: 84, status: 'Normal', risk: 'Diff pressure slight inc', last: '5 days ago', next: '14 days', mtbf: '90 days', mttr: '12 hours' },
  { id: 'CM-1201', name: 'Cement Mill 1', area: 'Cement Grinding', health: 79, status: 'Warning', risk: 'Temp elevated', last: '1 day ago', next: '10 days', mtbf: '60 days', mttr: '10 hours' },
  { id: 'CF-1003', name: 'Cooler Fan 3', area: 'Pyro', health: 62, status: 'High Risk', risk: 'Bearing Temp rising 15°C', last: '7 days ago', next: 'Immediate', mtbf: '30 days', mttr: '24 hours' },
  { id: 'FAN-1201', name: 'CM Fan 1', area: 'Cement Grinding', health: 68, status: 'Degrading', risk: 'Vibration 5.8 mm/s', last: '3 days ago', next: '3 days', mtbf: '45 days', mttr: '6 hours' },
  { id: 'SEP-501', name: 'RM Separator', area: 'Raw Grinding', health: 82, status: 'Normal', risk: 'Normal wear', last: '14 days ago', next: '45 days', mtbf: '150 days', mttr: '4 hours' },
  { id: 'CR-401', name: 'Crusher', area: 'Crushing', health: 91, status: 'Normal', risk: 'None', last: '1 day ago', next: '30 days', mtbf: '200 days', mttr: '5 hours' },
];

const EquipmentHealth = () => {
  const [selectedEq, setSelectedEq] = useState(mockEquipments[3]);

  const radarOptions = {
    radar: {
      indicator: [
        { name: 'Vibration', max: 100 },
        { name: 'Thermal', max: 100 },
        { name: 'Electrical', max: 100 },
        { name: 'Lubrication', max: 100 },
        { name: 'Mechanical', max: 100 }
      ],
      splitArea: { show: false },
      axisName: { color: '#a0aec0' }
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [40, 30, 80, 90, 60],
          name: 'Health Score',
          itemStyle: { color: '#ef5350' },
          areaStyle: { opacity: 0.3 }
        }
      ]
    }],
    backgroundColor: 'transparent'
  };

  const getHealthColor = (score: number) => score >= 80 ? 'text-[#00e676]' : score >= 65 ? 'text-[#ffa726]' : 'text-[#ef5350]';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Equipment Health</h1>
        <div className="px-3 py-1 bg-[#1a2540] rounded border border-gray-700 text-sm">
          Fleet Health: <span className="font-bold text-[#00e676]">88.5/100</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Normal', count: 42, color: 'text-[#00e676]' },
          { label: 'Warning', count: 8, color: 'text-[#ffa726]' },
          { label: 'Degrading', count: 4, color: 'text-[#ffa726]' },
          { label: 'High Risk', count: 2, color: 'text-[#ef5350]' },
          { label: 'Critical', count: 1, color: 'text-[#ef5350]' },
        ].map(s => (
          <div key={s.label} className="bg-[#1a2540] p-4 rounded-lg border border-gray-800 text-center">
            <div className="text-gray-400 text-sm">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#1a2540] rounded-lg border border-gray-800 p-4">
          <h2 className="text-lg font-bold mb-4">Equipment List</h2>
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
              <tr>
                <th className="px-4 py-2">Code</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Health</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Top Risk</th>
                <th className="px-4 py-2">MTBF</th>
                <th className="px-4 py-2">MTTR</th>
              </tr>
            </thead>
            <tbody>
              {mockEquipments.map(eq => (
                <tr key={eq.id} onClick={() => setSelectedEq(eq)} className={`border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 ${selectedEq.id === eq.id ? 'bg-gray-800/80' : ''}`}>
                  <td className="px-4 py-3 font-medium">{eq.id}</td>
                  <td className="px-4 py-3">{eq.name}</td>
                  <td className={`px-4 py-3 font-bold ${getHealthColor(eq.health)}`}>{eq.health}</td>
                  <td className="px-4 py-3">{eq.status}</td>
                  <td className="px-4 py-3 text-gray-400 truncate max-w-[150px]">{eq.risk}</td>
                  <td className="px-4 py-3 text-gray-400">{eq.mtbf}</td>
                  <td className="px-4 py-3 text-gray-400">{eq.mttr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-1 bg-[#1a2540] rounded-lg border border-gray-800 p-4 flex flex-col">
          <h2 className="text-lg font-bold mb-2">{selectedEq.name} Details</h2>
          <div className="text-sm text-gray-400 mb-4">{selectedEq.id} | {selectedEq.area}</div>
          
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="text-xs text-gray-500">Overall Health</div>
              <div className={`text-4xl font-bold ${getHealthColor(selectedEq.health)}`}>{selectedEq.health}/100</div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-bold ${selectedEq.health < 65 ? 'bg-[#ef5350]/20 text-[#ef5350]' : 'bg-[#00e676]/20 text-[#00e676]'}`}>
              {selectedEq.status.toUpperCase()}
            </div>
          </div>

          <div className="h-48">
            <ReactECharts option={radarOptions} style={{ height: '100%', width: '100%' }} />
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-800 pb-1">
              <span className="text-gray-400">Top Concern</span>
              <span className="text-[#ef5350]">{selectedEq.risk}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-1">
              <span className="text-gray-400">Last Inspection</span>
              <span>{selectedEq.last}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-1">
              <span className="text-gray-400">Next Maint.</span>
              <span>{selectedEq.next}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-1">
              <span className="text-gray-400">MTBF</span>
              <span>{selectedEq.mtbf}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-1">
              <span className="text-gray-400">MTTR</span>
              <span>{selectedEq.mttr}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EquipmentHealth;
