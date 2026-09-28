import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useScadaStore } from '../../../store/scadaStore';
import { normalizeArea } from '../../../pages/DigitalTwin';
import { scadaAudio } from '../../../engine/scadaAudio';
import { 
  Volume2, VolumeX, AlertOctagon, CheckCircle2, 
  FastForward, ShieldAlert, BellRing, Sparkles 
} from 'lucide-react';

const TopNav = ({ activeArea, setActiveArea }: { activeArea: string; setActiveArea: (a: string) => void }) => {
  const [time, setTime] = useState(new Date());
  const systemHealth = useScadaStore(s => s.systemHealth);
  const isAudioEnabled = useScadaStore(s => s.isAudioEnabled);
  const toggleAudio = useScadaStore(s => s.toggleAudio);
  const activeScenario = useScadaStore(s => s.activeScenario);
  const triggerScenario = useScadaStore(s => s.triggerScenario);
  const resetScenario = useScadaStore(s => s.resetScenario);
  const simSpeed = useScadaStore(s => s.simSpeed || 1);
  const setSimSpeed = useScadaStore(s => s.setSimSpeed);
  const alarms = useScadaStore(s => s.alarms);
  const ackAlarm = useScadaStore(s => s.ackAlarm);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unackedCritical = alarms.filter(a => a.active && !a.acknowledged && (a.priority === 'CRITICAL' || a.priority === 'HIGH'));

  const areas = [
    { label: 'PLANT OVERVIEW (3D / P&ID)', id: 'HOME' },
    { label: '1. CRUSHER & RECLAIMER', id: 'CR' },
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

  const handleTabClick = (id: string) => {
    scadaAudio.playClick();
    setActiveArea(id);
  };

  const handleAckAll = () => {
    unackedCritical.forEach(a => ackAlarm(a.id));
  };

  return (
    <div className="bg-[#0f172a] text-white flex flex-col border-b border-gray-700 select-none">
      
      {/* ── TOP DCS BANNER ─────────────────────────────────────────── */}
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

        <div className="flex items-center gap-3">
          
          {/* SIMULATION SPEED */}
          <div className="flex items-center bg-[#111927] border border-gray-700 rounded px-1.5 py-0.5 text-[10px] font-mono">
            <span className="text-gray-400 mr-1">SPEED:</span>
            {[1, 2, 5].map(spd => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`px-1.5 py-0.5 rounded ${
                  simSpeed === spd 
                    ? 'bg-emerald-600 text-white font-bold' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* PLANT INCIDENT DRILL */}
          <div className="flex items-center bg-[#111927] border border-gray-700 rounded px-2 py-0.5 text-[10px]">
            <span className="text-gray-400 mr-1.5 font-bold uppercase">DRILL:</span>
            <select
              value={activeScenario || 'NORMAL'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'NORMAL') resetScenario();
                else triggerScenario(val);
              }}
              className="bg-transparent font-mono text-cyan-400 focus:outline-none cursor-pointer"
            >
              <option value="NORMAL" className="bg-[#111927] text-white">Normal Steady-State</option>
              <option value="TRAMP_METAL" className="bg-[#111927] text-amber-400">Tramp Metal Detected (Crusher)</option>
              <option value="MILL_OVERLOAD" className="bg-[#111927] text-rose-400">Ball Mill 1 Choked Overload</option>
              <option value="KILN_OVERHEAT" className="bg-[#111927] text-purple-400">Kiln Burning Zone High Temp</option>
            </select>
          </div>

          {/* AUDIO ENGINE TOGGLE */}
          <button
            onClick={toggleAudio}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-mono text-[10px] font-bold border transition-all ${
              isAudioEnabled 
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Procedural Plant Acoustics & DCS Alarms"
          >
            {isAudioEnabled ? (
              <>
                <Volume2 size={13} className="animate-pulse" />
                <span>SOUND ON</span>
              </>
            ) : (
              <>
                <VolumeX size={13} />
                <span>SOUND OFF</span>
              </>
            )}
          </button>

          {/* CLOCK & HEALTH */}
          <span className="font-mono text-[#00ff00] font-bold">{format(time, 'dd-MMM-yyyy HH:mm:ss')}</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${
              unackedCritical.length > 0 
                ? 'bg-red-500 shadow-[0_0_8px_red] animate-pulse' 
                : 'bg-[#00ff00] shadow-[0_0_8px_#00ff00] animate-pulse'
            }`} />
            <span className={`font-bold ${unackedCritical.length > 0 ? 'text-red-400' : 'text-[#00ff00]'}`}>
              {unackedCritical.length > 0 ? 'ALARM' : 'OPTIMAL'}
            </span>
          </div>

        </div>
      </div>

      {/* ── CRITICAL UNACKNOWLEDGED ALARM BANNER (ISA-18.2) ────────── */}
      {unackedCritical.length > 0 && (
        <div className="bg-red-950/90 border-b border-red-500/80 px-4 py-1.5 flex items-center justify-between text-xs text-red-200 animate-pulse">
          <div className="flex items-center gap-3">
            <BellRing size={16} className="text-red-400 animate-bounce" />
            <span className="font-black text-white">
              {unackedCritical.length} UNACKNOWLEDGED CRITICAL ALARM{unackedCritical.length > 1 ? 'S' : ''}:
            </span>
            <span className="font-mono text-red-300">
              {unackedCritical[0].tag} — {unackedCritical[0].description}
            </span>
          </div>
          <button
            onClick={handleAckAll}
            className="px-3 py-0.5 bg-red-600 hover:bg-red-500 text-white font-black rounded text-[10px] uppercase tracking-wider transition-colors shadow"
          >
            ACKNOWLEDGE ALL
          </button>
        </div>
      )}
      
      {/* ── AREA NAVIGATION TABS ────────────────────────────────────── */}
      <div className="flex overflow-x-auto text-xs font-bold bg-[#090d16] border-b border-gray-800 custom-scrollbar">
        {areas.map(a => {
          const isSelected = activeArea === a.id || normalizeArea(activeArea) === normalizeArea(a.id);
          return (
            <div 
              key={a.id} 
              onClick={() => handleTabClick(a.id)}
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
