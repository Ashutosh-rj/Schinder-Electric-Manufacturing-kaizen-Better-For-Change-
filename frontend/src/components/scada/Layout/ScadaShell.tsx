import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useScadaStore } from '../../../store/scadaStore';
import { normalizeArea } from '../../../pages/DigitalTwin';

const TopNav = ({ activeArea, setActiveArea }: { activeArea: string, setActiveArea: (a: string) => void }) => {
  const [time, setTime] = useState(new Date());
  const systemHealth = useScadaStore(s => s.systemHealth);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const areas = [
    { label: 'PLANT OVERVIEW (P&ID)', id: 'HOME' },
    { label: '1. CRUSHER', id: 'CR' },
    { label: '2. RAW MILL (VRM)', id: 'RM1' },
    { label: '3. COAL MILL', id: 'CM1' },
    { label: '4. PREHEATER & KILN', id: 'KILN' },
    { label: '5. GRATE COOLER', id: 'COOLER' },
    { label: '6. CLINKER TRANSPORT', id: 'CT1' },
    { label: '7. CEMENT BALL MILL', id: 'CM2' },
    { label: '8. WHRS POWER', id: 'POWER' },
    { label: '9. PACKING & DISPATCH', id: 'PACKING' },
    { label: 'HISTORIAN', id: 'HISTORIAN' },
    { label: 'ALARMS & EVENTS', id: 'ALARMS' },
  ];

  return (
    <div className="bg-[#0f172a] text-white flex flex-col border-b border-gray-700 select-none">
      <div className="flex items-center justify-between px-4 py-1.5 text-xs border-b border-gray-800 bg-[#020617]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#106c35]" />
            <span className="font-extrabold text-white">SCHNEIDER EcoStruxure™ PLANT SCADA</span>
          </div>
          <span className="text-gray-400">UNIT: <span className="text-white font-bold">3,000 TPD CEMENT PLANT</span></span>
          <span className="text-gray-400">OPERATOR: <span className="text-white">CCR LEAD CHIEF</span></span>
          <span className="text-gray-400">MODE: <span className="text-[#00e676] px-2 py-0.5 bg-[#00e676]/10 rounded border border-[#00e676]/30 font-bold">INDUSTRIAL DIGITAL TWIN • CLOSED LOOP</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[#00ff00] font-bold">{format(time, 'dd-MMM-yyyy HH:mm:ss')}</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">SYSTEM HEALTH:</span>
            <span className="text-[#00ff00] font-bold">OPTIMAL</span>
            <div className="w-2.5 h-2.5 rounded-full bg-[#00ff00] shadow-[0_0_8px_#00ff00] animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* AREA NAVIGATION TABS */}
      <div className="flex overflow-x-auto text-xs font-bold bg-[#090d16] border-b border-gray-800 custom-scrollbar">
        {areas.map(a => {
          const isSelected = activeArea === a.id || normalizeArea(activeArea) === normalizeArea(a.id);
          return (
            <div 
              key={a.id} 
              onClick={() => setActiveArea(a.id)}
              className={`px-4 py-2 cursor-pointer border-r border-gray-800 whitespace-nowrap transition-colors ${
                isSelected 
                  ? 'bg-[#1e293b] text-[#00ff00] border-b-2 border-b-[#00ff00] shadow-sm font-extrabold' 
                  : 'hover:bg-[#1e293b]/70 text-gray-400 hover:text-gray-200'
              }`}
            >
              {a.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BottomPanel = () => {
  const alarms = useScadaStore(s => s.alarms);
  const activeAlarms = alarms.filter(a => a.active);

  return (
    <div className="h-8 bg-[#070b14] border-t border-gray-800 flex items-center justify-between px-4 text-[10px] select-none text-gray-400">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${activeAlarms.length > 0 ? 'bg-red-500 animate-pulse shadow-[0_0_8px_red]' : 'bg-[#00ff00]'}`} />
        <span className={activeAlarms.length > 0 ? 'text-red-400 font-bold' : 'text-gray-400'}>
          {activeAlarms.length > 0 ? `${activeAlarms.length} ACTIVE PROCESS ALARMS / SAFETY INTERLOCKS PENDING` : 'ALL SAFETY INTERLOCKS SATISFIED • NO UNACKNOWLEDGED CRITICAL ALARMS'}
        </span>
      </div>
      <div className="flex items-center gap-5 font-mono">
        <span>ISA-101 / IEC-62443 HMI</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff00]" /> DCS WS: ONLINE</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff00]" /> KAFKA: HEALTHY</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff00]" /> TIMESCALE: CONNECTED</span>
      </div>
    </div>
  );
};

export const ScadaShell = ({ children, activeArea, setActiveArea }: any) => {
  return (
    <div className="flex flex-col w-full h-full bg-[#0f172a] overflow-hidden font-sans">
      <TopNav activeArea={activeArea} setActiveArea={setActiveArea} />
      <div className="flex-1 relative overflow-hidden bg-[#0b1320]">
        {children}
      </div>
      <BottomPanel />
    </div>
  );
};
