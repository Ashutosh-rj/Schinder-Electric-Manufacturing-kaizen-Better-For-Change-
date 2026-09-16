import React from 'react';
import { AlarmPanel } from '../../components/scada/Layout/Panels';
import { useScadaStore } from '../../store/scadaStore';

export const AlarmsScreen = () => {
  const alarms = useScadaStore(s => s.alarms);
  const ackAlarm = useScadaStore(s => s.ackAlarm);
  const clearInactiveAlarms = useScadaStore(s => s.clearInactiveAlarms);

  return (
    <div className="flex w-full h-full bg-[#1e293b] text-white p-4 gap-4">
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-red-500">ALARM & EVENT SUMMARY</h2>
            <div className="flex gap-2">
               <button 
                  onClick={() => alarms.forEach(a => ackAlarm(a.id))}
                  className="px-4 py-2 bg-blue-900 border border-blue-700 hover:bg-blue-800 rounded font-bold"
               >
                  ACKNOWLEDGE ALL
               </button>
               <button 
                  onClick={clearInactiveAlarms}
                  className="px-4 py-2 bg-[#0f172a] border border-gray-600 hover:bg-gray-800 rounded font-bold"
               >
                  CLEAR INACTIVE
               </button>
            </div>
         </div>
         <div className="flex-1">
            <AlarmPanel />
         </div>
      </div>
      
      <div className="w-[300px] flex flex-col gap-4">
         <div className="bg-[#0f172a] border border-gray-700 rounded p-4">
            <h3 className="font-bold text-[#00d4ff] mb-2 border-b border-gray-700 pb-2">ALARM STATISTICS</h3>
            <div className="flex justify-between mb-1"><span className="text-gray-400">Total Unack:</span><span className="text-white font-bold">{alarms.filter(a => !a.acknowledged).length}</span></div>
            <div className="flex justify-between mb-1"><span className="text-gray-400">Critical:</span><span className="text-red-500 font-bold">{alarms.filter(a => a.priority === 'CRITICAL' && a.active).length}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">High:</span><span className="text-orange-500 font-bold">{alarms.filter(a => a.priority === 'HIGH' && a.active).length}</span></div>
         </div>

         <div className="bg-[#0f172a] border border-gray-700 rounded p-4 flex-1">
            <h3 className="font-bold text-[#00d4ff] mb-2 border-b border-gray-700 pb-2">INTERLOCK STATUS</h3>
            <div className="text-sm text-gray-400 space-y-2">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#00ff00]" />
                  <span>KILN FED INTERLOCK</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#00ff00]" />
                  <span>RAW MILL VIBRATION</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_5px_red]" />
                  <span className="text-red-500 font-bold">COAL MILL ATEX O2</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
