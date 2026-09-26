import React, { useState } from 'react';
import { useScadaStore } from '../../../store/scadaStore';
import { EQUIPMENT_CATALOG, scadaEngine } from '../../../engine/scadaEngine';
import { 
  X, Play, Square, AlertOctagon, RotateCcw, 
  Activity, Zap, ShieldCheck, Gauge, Sliders, CheckCircle2, XCircle
} from 'lucide-react';

interface FaceplateProps {
  equipmentId: string | null;
  onClose: () => void;
}

export const EquipmentFaceplateModal: React.FC<FaceplateProps> = ({ equipmentId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'control' | 'electrical' | 'condition' | 'interlocks'>('control');
  const [targetSp, setTargetSp] = useState<number>(100);

  const eq = useScadaStore((s) => equipmentId ? s.equipment[equipmentId] : null);
  const tags = useScadaStore((s) => s.tags);
  const setEquipmentState = useScadaStore((s) => s.setEquipmentState);

  if (!equipmentId || !eq) return null;

  const meta = EQUIPMENT_CATALOG[equipmentId] || {
    id: equipmentId,
    tag: `TAG-${equipmentId}`,
    name: eq.name || equipmentId,
    type: eq.type || 'Industrial Drive',
    area: 'PLANT',
    ratedPowerKw: 1000,
    ratedCurrentA: 500,
    ratedSpeedRpm: 1000,
    interlocks: [
      { id: 'INT-01', desc: 'Downstream Process Ready', satisfied: true },
      { id: 'INT-02', desc: 'Bearing Lube Pressure OK (> 2.5 bar)', satisfied: true },
      { id: 'INT-03', desc: 'Emergency Pull-Wire Intact', satisfied: true },
    ]
  };

  const isRunning = eq.status === 'RUNNING';
  const isFault = eq.status === 'FAULT' || eq.status === 'TRIPPED';

  // Extract dynamic values for this equipment or fallback to sensible physics
  const powerVal = tags[`${equipmentId}-PWR`] ?? tags[`RM1-PWR`] ?? (isRunning ? meta.ratedPowerKw * 0.88 : 0);
  const currentVal = tags[`${equipmentId}-CUR`] ?? tags[`RM1-CUR`] ?? (isRunning ? meta.ratedCurrentA * 0.85 : 0);
  const speedVal = tags[`${equipmentId}-SPD`] ?? (isRunning ? meta.ratedSpeedRpm : 0);
  const vibVal = tags[`${equipmentId}-VIB`] ?? tags[`RM1-VRM-VIB`] ?? (isRunning ? 2.4 : 0.2);
  const deTemp = tags[`${equipmentId}-DE-TEMP`] ?? (isRunning ? 62.4 : 32.0);
  const ndeTemp = tags[`${equipmentId}-NDE-TEMP`] ?? (isRunning ? 58.1 : 31.5);
  const lubePr = tags[`${equipmentId}-LUBE-PR`] ?? (isRunning ? 3.8 : 0.5);

  const handleStart = () => {
    scadaEngine.controlEquipment(equipmentId, 'START');
  };

  const handleStop = () => {
    scadaEngine.controlEquipment(equipmentId, 'STOP');
  };

  const handleReset = () => {
    scadaEngine.controlEquipment(equipmentId, 'RESET');
  };

  const handleModeToggle = (mode: 'AUTO' | 'MANUAL' | 'LOCAL') => {
    setEquipmentState(equipmentId, { mode });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border-2 border-gray-600 rounded-xl shadow-2xl text-white overflow-hidden font-sans">
        
        {/* HEADER - ISA-101 DCS Standard */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#1e293b] border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${isRunning ? 'bg-[#00ff00] shadow-[0_0_8px_#00ff00] animate-pulse' : isFault ? 'bg-red-500 shadow-[0_0_8px_red] animate-pulse' : 'bg-gray-500'}`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-black/60 rounded text-[#00d4ff] border border-cyan-500/30">
                  {meta.tag}
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{meta.area}</span>
              </div>
              <h2 className="text-base font-extrabold text-white mt-0.5">{meta.name}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-2.5 py-1 text-xs font-black rounded tracking-widest border ${
              isRunning 
                ? 'bg-emerald-950 text-emerald-400 border-emerald-600/50' 
                : isFault 
                ? 'bg-rose-950 text-rose-400 border-rose-600/50' 
                : 'bg-slate-800 text-slate-400 border-slate-600'
            }`}>
              {eq.status}
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* MODE SELECTOR BAR */}
        <div className="flex items-center justify-between px-5 py-2 bg-[#0b1320] border-b border-gray-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">CONTROL MODE:</span>
            {(['AUTO', 'MANUAL', 'LOCAL'] as const).map((m) => (
              <button
                key={m}
                onClick={() => handleModeToggle(m)}
                className={`px-3 py-1 rounded text-[11px] font-bold tracking-wider transition-all ${
                  eq.mode === m 
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400' 
                    : 'bg-[#1e293b] text-gray-400 hover:text-gray-200 border border-gray-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-[11px]">HEALTH INDEX:</span>
            <span className="font-mono font-bold text-[#00ff00] text-xs">{eq.health}%</span>
            <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${eq.health}%` }} 
              />
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex border-b border-gray-800 bg-[#131b2e] px-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('control')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === 'control' 
                ? 'border-[#00d4ff] text-[#00d4ff] bg-[#1e293b]/60' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sliders size={14} /> COMMAND & SETPOINT
          </button>
          <button
            onClick={() => setActiveTab('electrical')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === 'electrical' 
                ? 'border-[#00d4ff] text-[#00d4ff] bg-[#1e293b]/60' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Zap size={14} /> ELECTRICAL ({meta.ratedPowerKw} kW)
          </button>
          <button
            onClick={() => setActiveTab('condition')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === 'condition' 
                ? 'border-[#00d4ff] text-[#00d4ff] bg-[#1e293b]/60' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Activity size={14} /> MECHANICAL & VIBRATION
          </button>
          <button
            onClick={() => setActiveTab('interlocks')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === 'interlocks' 
                ? 'border-[#00d4ff] text-[#00d4ff] bg-[#1e293b]/60' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShieldCheck size={14} /> PERMISSIVES ({meta.interlocks.length})
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-5 min-h-[260px] bg-[#090d16]">
          {activeTab === 'control' && (
            <div className="space-y-5">
              {/* PRIMARY ACTION BUTTONS */}
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={handleStart}
                  disabled={isRunning}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border font-bold transition-all ${
                    isRunning 
                      ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-700 cursor-not-allowed opacity-50' 
                      : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-600/30'
                  }`}
                >
                  <Play size={20} className="mb-1" />
                  <span className="text-xs">START</span>
                </button>

                <button
                  onClick={handleStop}
                  disabled={!isRunning}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border font-bold transition-all ${
                    !isRunning 
                      ? 'bg-slate-800/40 border-slate-700/50 text-slate-600 cursor-not-allowed opacity-50' 
                      : 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-600/30'
                  }`}
                >
                  <Square size={20} className="mb-1" />
                  <span className="text-xs">STOP</span>
                </button>

                <button
                  onClick={handleReset}
                  className="flex flex-col items-center justify-center p-3 rounded-lg border bg-blue-900/70 hover:bg-blue-800 border-blue-600 text-blue-200 font-bold transition-all"
                >
                  <RotateCcw size={20} className="mb-1" />
                  <span className="text-xs">RESET FAULT</span>
                </button>

                <button
                  onClick={handleStop}
                  className="flex flex-col items-center justify-center p-3 rounded-lg border bg-rose-700 hover:bg-rose-600 border-rose-500 text-white font-black shadow-lg shadow-rose-700/40 transition-all"
                >
                  <AlertOctagon size={20} className="mb-1" />
                  <span className="text-xs">E-STOP</span>
                </button>
              </div>

              {/* SETPOINT & FEEDBACK CONTROLS */}
              <div className="bg-[#131b2e] border border-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-300">PROCESS SETPOINT (SP)</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-gray-400">CURRENT SP: <span className="text-[#00d4ff] font-bold">{targetSp.toFixed(1)}%</span></span>
                    <span className="text-gray-400">MEASURED PV: <span className="text-[#00ff00] font-bold">{(isRunning ? targetSp * 0.98 : 0).toFixed(1)}%</span></span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={targetSp} 
                  onChange={(e) => setTargetSp(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>0% (0.0 kW)</span>
                  <span>50% ({(meta.ratedPowerKw * 0.5).toFixed(0)} kW)</span>
                  <span>100% ({meta.ratedPowerKw.toFixed(0)} kW)</span>
                </div>
              </div>

              {/* QUICK TELEMETRY GRID */}
              <div className="grid grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-[#131b2e] border border-gray-700 p-2.5 rounded">
                  <div className="text-[10px] text-gray-400 uppercase">ACTIVE POWER</div>
                  <div className="text-[#00ff00] text-sm font-bold mt-1">{powerVal.toFixed(1)} kW</div>
                </div>
                <div className="bg-[#131b2e] border border-gray-700 p-2.5 rounded">
                  <div className="text-[10px] text-gray-400 uppercase">MOTOR CURRENT</div>
                  <div className="text-[#00d4ff] text-sm font-bold mt-1">{currentVal.toFixed(1)} A</div>
                </div>
                <div className="bg-[#131b2e] border border-gray-700 p-2.5 rounded">
                  <div className="text-[10px] text-gray-400 uppercase">SPEED / TACHO</div>
                  <div className="text-white text-sm font-bold mt-1">{speedVal.toFixed(1)} RPM</div>
                </div>
                <div className="bg-[#131b2e] border border-gray-700 p-2.5 rounded">
                  <div className="text-[10px] text-gray-400 uppercase">RMS VIBRATION</div>
                  <div className={`text-sm font-bold mt-1 ${vibVal > 4.0 ? 'text-rose-400' : 'text-amber-400'}`}>{vibVal.toFixed(2)} mm/s</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'electrical' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#131b2e] border border-gray-700 rounded-lg p-4 space-y-2.5 text-xs font-mono">
                <div className="font-bold text-[#00d4ff] border-b border-gray-700 pb-1 mb-2 font-sans flex items-center gap-2">
                  <Zap size={14} /> MOTOR DRIVE SPECIFICATIONS
                </div>
                <div className="flex justify-between"><span className="text-gray-400">RATED POWER:</span><span className="text-white font-bold">{meta.ratedPowerKw} kW</span></div>
                <div className="flex justify-between"><span className="text-gray-400">RATED CURRENT:</span><span className="text-white font-bold">{meta.ratedCurrentA} A</span></div>
                <div className="flex justify-between"><span className="text-gray-400">RATED SPEED:</span><span className="text-white font-bold">{meta.ratedSpeedRpm} RPM</span></div>
                <div className="flex justify-between"><span className="text-gray-400">SUPPLY VOLTAGE:</span><span className="text-white font-bold">6,600 V (MV)</span></div>
                <div className="flex justify-between"><span className="text-gray-400">POWER FACTOR (cos φ):</span><span className="text-[#00ff00] font-bold">0.89</span></div>
              </div>

              <div className="bg-[#131b2e] border border-gray-700 rounded-lg p-4 space-y-2.5 text-xs font-mono">
                <div className="font-bold text-[#00d4ff] border-b border-gray-700 pb-1 mb-2 font-sans flex items-center gap-2">
                  <Gauge size={14} /> REAL-TIME MEASUREMENTS
                </div>
                <div className="flex justify-between"><span className="text-gray-400">CURRENT L1 / L2 / L3:</span><span className="text-[#00ff00] font-bold">{currentVal.toFixed(0)} / {currentVal.toFixed(0)} / {currentVal.toFixed(0)} A</span></div>
                <div className="flex justify-between"><span className="text-gray-400">ACTIVE POWER (kW):</span><span className="text-[#00ff00] font-bold">{powerVal.toFixed(1)} kW</span></div>
                <div className="flex justify-between"><span className="text-gray-400">REACTIVE POWER (kVAR):</span><span className="text-gray-300">{(powerVal * 0.42).toFixed(1)} kVAR</span></div>
                <div className="flex justify-between"><span className="text-gray-400">MOTOR LOAD FACTOR:</span><span className="text-cyan-400 font-bold">{((powerVal / meta.ratedPowerKw) * 100).toFixed(1)} %</span></div>
                <div className="flex justify-between"><span className="text-gray-400">WINDING TEMP U/V/W:</span><span className="text-amber-400 font-bold">78°C / 79°C / 77°C</span></div>
              </div>
            </div>
          )}

          {activeTab === 'condition' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#131b2e] border border-gray-700 rounded-lg p-4 space-y-2.5 text-xs font-mono">
                <div className="font-bold text-[#00d4ff] border-b border-gray-700 pb-1 mb-2 font-sans flex items-center gap-2">
                  <Activity size={14} /> BEARING TEMPERATURES (RTD Pt100)
                </div>
                <div className="flex justify-between"><span className="text-gray-400">DRIVE END (DE) BEARING:</span><span className="text-[#00ff00] font-bold">{deTemp.toFixed(1)} °C</span></div>
                <div className="flex justify-between"><span className="text-gray-400">NON-DRIVE END (NDE):</span><span className="text-[#00ff00] font-bold">{ndeTemp.toFixed(1)} °C</span></div>
                <div className="flex justify-between"><span className="text-gray-400">ALARM THRESHOLD (HIGH):</span><span className="text-amber-400">75.0 °C</span></div>
                <div className="flex justify-between"><span className="text-gray-400">TRIP THRESHOLD (HH):</span><span className="text-rose-400 font-bold">85.0 °C</span></div>
              </div>

              <div className="bg-[#131b2e] border border-gray-700 rounded-lg p-4 space-y-2.5 text-xs font-mono">
                <div className="font-bold text-[#00d4ff] border-b border-gray-700 pb-1 mb-2 font-sans flex items-center gap-2">
                  <Gauge size={14} /> VIBRATION & LUBRICATION
                </div>
                <div className="flex justify-between"><span className="text-gray-400">VIBRATION VELOCITY RMS:</span><span className="text-amber-400 font-bold">{vibVal.toFixed(2)} mm/s</span></div>
                <div className="flex justify-between"><span className="text-gray-400">ISO 10816-3 SEVERITY:</span><span className="text-[#00ff00] font-bold">ZONE A (GOOD)</span></div>
                <div className="flex justify-between"><span className="text-gray-400">LUBE OIL HEADER PRESSURE:</span><span className="text-[#00ff00] font-bold">{lubePr.toFixed(2)} bar</span></div>
                <div className="flex justify-between"><span className="text-gray-400">OIL FILTER DIFFERENTIAL dP:</span><span className="text-gray-300">0.42 bar</span></div>
              </div>
            </div>
          )}

          {activeTab === 'interlocks' && (
            <div className="bg-[#131b2e] border border-gray-700 rounded-lg p-4 space-y-2.5 text-xs">
              <div className="font-bold text-[#00d4ff] border-b border-gray-700 pb-1 mb-3 font-sans flex items-center justify-between">
                <span>SAFETY INTERLOCKS & START PERMISSIVES</span>
                <span className="text-[10px] text-gray-400 font-mono">ALL CONDITIONS MUST BE TRUE</span>
              </div>
              <div className="space-y-2">
                {meta.interlocks.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#090d16] border border-gray-800">
                    <div className="flex items-center gap-3">
                      {item.satisfied ? (
                        <CheckCircle2 size={16} className="text-[#00ff00]" />
                      ) : (
                        <XCircle size={16} className="text-rose-500" />
                      )}
                      <span className="font-mono text-cyan-400 font-bold">{item.id}</span>
                      <span className="text-gray-200">{item.desc}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      item.satisfied ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {item.satisfied ? 'SATISFIED' : 'TRIP ACTIVE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#1e293b] border-t border-gray-700 text-xs">
          <div className="flex items-center gap-3 text-gray-400 font-mono text-[11px]">
            <span>EQUIPMENT ID: <span className="text-white">{equipmentId}</span></span>
            <span>TYPE: <span className="text-white">{meta.type}</span></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors"
          >
            DISMISS FACEPLATE
          </button>
        </div>

      </div>
    </div>
  );
};
