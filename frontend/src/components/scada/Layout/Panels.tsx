import React from 'react';
import { useScadaStore } from '../../../store/scadaStore';
import { format } from 'date-fns';

export const AlarmPanel = () => {
  const alarms = useScadaStore(s => s.alarms);
  const activeAlarms = alarms.filter(a => a.active);

  return (
    <div className="bg-[#0f172a] border border-gray-700 rounded p-2 flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 mb-2 border-b border-gray-700 pb-1">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_red]" />
        <span className="text-red-500 text-xs font-bold">ACTIVE ALARMS ({activeAlarms.length})</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-[10px] text-left">
          <thead className="text-gray-400 sticky top-0 bg-[#0f172a]">
            <tr>
              <th className="pb-1">Time</th>
              <th className="pb-1">Tag</th>
              <th className="pb-1">Description</th>
              <th className="pb-1">Priority</th>
            </tr>
          </thead>
          <tbody>
            {activeAlarms.length === 0 ? (
              <tr><td colSpan={4} className="text-gray-500 text-center py-4">No Active Alarms</td></tr>
            ) : (
              activeAlarms.map(a => (
                <tr key={a.id} className="border-t border-gray-800 text-gray-300">
                  <td className="py-1 pr-2">{format(a.timestamp, 'HH:mm:ss')}</td>
                  <td className="py-1 pr-2 font-mono text-[#00d4ff]">{a.tag}</td>
                  <td className="py-1 pr-2">{a.description}</td>
                  <td className={`py-1 font-bold ${a.priority === 'HIGH' || a.priority === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {a.priority}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
