import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useScadaStore } from '../../../store/scadaStore';

const TopNav = ({ activeArea, setActiveArea }: { activeArea: string, setActiveArea: (a: string) => void }) => {
  const [time, setTime] = useState(new Date());
  const systemHealth = useScadaStore(s => s.systemHealth);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const areas = ['HOME', 'CRUSHER', 'RAW MILL', 'KILN', 'COOLER', 'CEMENT MILL', 'PACKING', 'POWER', 'HISTORIAN', 'REPORTS', 'ALARMS'];

  return (
    <div className="bg-[#0f172a] text-white flex flex-col border-b border-gray-700 select-none">
      <div className="flex items-center justify-between px-4 py-1 text-xs border-b border-gray-800 bg-[#020617]">
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-300">PLANT: MINI CEMENT PLANT</span>
          <span className="text-gray-400">USER: <span className="text-white">OPERATOR</span></span>
          <span className="text-gray-400">MODE: <span className="text-[#ffa726] px-2 py-0.5 bg-[#ffa726]/10 rounded border border-[#ffa726]/30 font-bold">SIMULATION MODE: DIGITAL TWIN</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[#00ff00]">{format(time, 'dd-MMM-yyyy HH:mm:ss')}</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">SYSTEM HEALTH</span>
            <span className="text-[#00ff00] font-bold">ALL OK</span>
            <div className="w-3 h-3 rounded-full bg-[#00ff00] shadow-[0_0_5px_#00ff00] animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex overflow-x-auto text-xs font-bold">
        {areas.map(a => (
          <div 
            key={a} 
            onClick={() => setActiveArea(a)}
            className={`px-4 py-2 cursor-pointer border-r border-gray-700 transition-colors ${
              activeArea === a 
                ? 'bg-[#1e293b] text-[#00ff00] border-b-2 border-b-[#00ff00]' 
                : 'hover:bg-[#1e293b] text-gray-400'
            }`}
          >
            {a}
          </div>
        ))}
      </div>
    </div>
  );
};

const BottomPanel = () => {
  const alarms = useScadaStore(s => s.alarms);
  const activeAlarms = alarms.filter(a => a.active);

  return (
    <div className="h-8 bg-[#0f172a] border-t border-gray-700 flex items-center justify-between px-4 text-[10px] select-none">
      <div className="flex items-center gap-2 text-gray-400">
        <div className={`w-3 h-3 rounded-full ${activeAlarms.length > 0 ? 'bg-red-500 animate-pulse shadow-[0_0_5px_red]' : 'bg-[#00ff00]'}`} />
        <span>{activeAlarms.length > 0 ? `${activeAlarms.length} UNACKNOWLEDGED CRITICAL ALARMS` : 'NO UNACKNOWLEDGED CRITICAL ALARMS'}</span>
      </div>
      <div className="flex items-center gap-4 text-gray-400">
        <span>SCADA ENGINE v2.0</span>
        <span>WS: CONNECTED</span>
        <span>DB: CONNECTED</span>
      </div>
    </div>
  );
};

export const ScadaShell = ({ children, activeArea, setActiveArea }: any) => {
  return (
    <div className="flex flex-col w-screen h-screen bg-[#1e293b] overflow-hidden font-sans">
      <TopNav activeArea={activeArea} setActiveArea={setActiveArea} />
      <div className="flex-1 relative overflow-hidden bg-[#0f172a] m-1 rounded border border-gray-700 shadow-inner">
        {children}
      </div>
      <BottomPanel />
    </div>
  );
};
