import React from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { 
  GrateCoolerUnit, CentrifugalFanUnit, PulseJetBaghouseUnit, 
  IndustrialPipe, ISAInstrumentTag 
} from '../../components/scada/Equipment/IndustrialPlantComponents';

interface ScreenProps {
  onOpenFaceplate?: (eqId: string) => void;
}

export const CoolerScreen: React.FC<ScreenProps> = ({ onOpenFaceplate }) => {
  const tags = useScadaStore((s) => s.tags);

  const handleEqClick = (id: string) => {
    if (onOpenFaceplate) onOpenFaceplate(id);
  };

  return (
    <div className="w-full h-full relative bg-[#0b1320] text-white overflow-hidden select-none font-sans">
      
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="flex items-center justify-between px-6 py-2 bg-[#070b14] border-b border-gray-800 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold px-2 py-0.5 bg-black/60 rounded border border-cyan-500/30">
              AREA-500
            </span>
            <span className="text-sm font-extrabold text-white">RECIPROCATING GRATE COOLER & HEAT RECUPERATION</span>
          </div>
          <span className="text-gray-400 font-mono text-[11px]">HYDRAULIC CROSS-BAR • 6 INDEPENDENT FANS • ROLL CRUSHER</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <div>SEC AIR: <span className="text-rose-500 font-bold">{(tags['CLR1-SEC-AIR'] || 1045).toFixed(0)} °C</span></div>
          <div>TERT AIR: <span className="text-amber-400 font-bold">{(tags['CLR1-TER-AIR'] || 895).toFixed(0)} °C</span></div>
          <div>DISCHARGE TEMP: <span className="text-[#00ff00] font-bold">{(tags['CLR1-CLINK-OUT'] || 92).toFixed(0)} °C</span></div>
          <div>GRATE SPEED: <span className="text-cyan-400 font-bold">{(tags['CLR1-GRATE-SPD'] || 14.2).toFixed(1)} SPM</span></div>
          <div>BREAKER PWR: <span className="text-purple-400 font-bold">{(tags['CLR1-BRK-PWR'] || 62).toFixed(0)} kW</span></div>
        </div>
      </div>

      {/* SVG SCHEMATIC - REAL GRATE COOLER PLANT WORKING PARTS */}
      <svg className="w-full h-full" viewBox="0 0 1600 780" preserveAspectRatio="xMidYMid meet">
        
        {/* 1. Hot Clinker Drop Chute from Kiln Discharge */}
        <IndustrialPipe d="M 120 120 L 120 320" media="CLINKER" strokeWidth="24" />
        <rect x="90" y="80" width="60" height="50" fill="#334155" stroke="#475569" strokeWidth="2" rx="3" />
        <text x="120" y="110" fill="#ef4444" fontSize="10" fontWeight="extrabold" textAnchor="middle">FROM KILN</text>

        {/* 2. Secondary Air Duct to Kiln Burner (1050°C) */}
        <IndustrialPipe d="M 170 330 L 170 180 L 50 180" media="HOT_GAS" strokeWidth="18" />
        <text x="110" y="170" fill="#ef4444" fontSize="9" fontWeight="bold">SECONDARY AIR (1045°C)</text>

        {/* 3. Tertiary Air Duct to Precalciner (895°C) */}
        <IndustrialPipe d="M 280 330 L 280 140 L 50 140" media="HOT_GAS" strokeWidth="16" />
        <text x="170" y="130" fill="#f97316" fontSize="9" fontWeight="bold">TERTIARY AIR (895°C)</text>

        {/* 4. Cooler Exhaust Flue Gas to WHRS AQC Boiler & Baghouse */}
        <IndustrialPipe d="M 520 330 L 520 220 L 980 220 L 980 290" media="HOT_GAS" strokeWidth="16" />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* GRATE COOLER ASSEMBLY (CLR1-COOL-01) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <GrateCoolerUnit 
          id="CLR1-COOL-01" 
          x={140} 
          y={330} 
          scale={1.3} 
          onClick={handleEqClick} 
        />

        {/* Deep Pan Clinker Conveyor (Heat-Resistant Articulated Steel Pans) */}
        <g transform="translate(620, 520)">
          {/* Inclined pan conveyor structure */}
          <polygon points="0,0 350,70 345,95 -5,25" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          {/* Moving overlapping clinker buckets */}
          {Array.from({ length: 14 }).map((_, i) => (
            <rect 
              key={i} 
              x={i * 25} 
              y={i * 5} 
              width="24" 
              height="18" 
              fill="#475569" 
              stroke="#0f172a" 
              strokeWidth="1.5" 
              rx="2" 
            />
          ))}
          <path d="M 0 10 L 340 78" stroke="#f59e0b" strokeWidth="3" strokeDasharray="10 8">
            <animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.8s" repeatCount="indefinite" />
          </path>
          <text x="180" y="115" fill="#cbd5e1" fontSize="11" fontWeight="extrabold" textAnchor="middle">
            HEAT-RESISTANT DEEP PAN CONVEYOR (CT1-PAN-01)
          </text>
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* COOLER EXHAUST PROCESS BAGHOUSE & EXHAUST FAN */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <PulseJetBaghouseUnit 
          id="CLR1-DC-01" 
          x={940} 
          y={280} 
          scale={1.0} 
        />

        <CentrifugalFanUnit 
          id="CLR1-EXH-FAN" 
          x={1180} 
          y={440} 
          scale={1.1} 
          onClick={handleEqClick} 
        />

        {/* Cooler Exhaust Chimney Stack */}
        <g transform="translate(1360, 420)">
          <polygon points="40,20 65,20 60,-160 45,-160" fill="#334155" stroke="#475569" strokeWidth="2" />
          <path d="M 52 -160 Q 60 -190 75 -220" stroke="#cbd5e1" strokeWidth="8" fill="none" opacity="0.3" strokeLinecap="round" />
          <text x="52" y="35" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">COOLER STACK</text>
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* REAL-TIME ISA INSTRUMENTATION BUBBLE TAGS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <ISAInstrumentTag tag="CLR1-SEC-AIR" isaCode="TI" unit="°C" x={240} y={190} alarm="NORMAL" />
        <ISAInstrumentTag tag="CLR1-TER-AIR" isaCode="TI" unit="°C" x={380} y={150} />
        <ISAInstrumentTag tag="CLR1-GRATE-SPD" isaCode="SI" unit="SPM" x={420} y={320} />
        <ISAInstrumentTag tag="CLR1-F1-PR" isaCode="PI" unit="mbar" x={210} y={540} />
        <ISAInstrumentTag tag="CLR1-F2-PR" isaCode="PI" unit="mbar" x={340} y={540} />
        <ISAInstrumentTag tag="CLR1-F3-PR" isaCode="PI" unit="mbar" x={470} y={540} />
        <ISAInstrumentTag tag="CLR1-CLINK-OUT" isaCode="TI" unit="°C" x={670} y={480} />
        <ISAInstrumentTag tag="CLR1-BRK-PWR" isaCode="II" unit="kW" x={620} y={370} />

      </svg>

      {/* QUICK STATUS OVERLAY CARDS */}
      <div className="absolute bottom-3 left-4 flex gap-3">
        <div className="bg-[#0f172a]/95 border border-gray-700 p-2.5 rounded-lg text-xs font-mono">
          <div className="text-[10px] text-gray-400 uppercase font-bold font-sans">UNDERGRATE PRESSURE CHAMBERS</div>
          <div className="flex gap-4 mt-1">
            <span>CH1: <span className="text-cyan-400 font-bold">{(tags['CLR1-F1-PR'] || 68).toFixed(0)} mbar</span></span>
            <span>CH2: <span className="text-cyan-400 font-bold">{(tags['CLR1-F2-PR'] || 54).toFixed(0)} mbar</span></span>
            <span>CH3: <span className="text-cyan-400 font-bold">{(tags['CLR1-F3-PR'] || 42).toFixed(0)} mbar</span></span>
            <span>HYDRAULIC PR: <span className="text-[#00ff00]">160 bar</span></span>
          </div>
        </div>

        <div className="bg-[#0f172a]/95 border border-gray-700 p-2.5 rounded-lg text-xs font-mono">
          <div className="text-[10px] text-gray-400 uppercase font-bold font-sans">HEAT RECUPERATION EFFICIENCY</div>
          <div className="flex gap-4 mt-1">
            <span>THERMAL RECUP: <span className="text-emerald-400 font-bold">76.4 %</span></span>
            <span>AQC EXHAUST: <span className="text-white">{(tags['CLR1-EXH-TEMP'] || 240).toFixed(0)} °C</span></span>
            <span>WHRS STEAM TAPPING: <span className="text-[#00ff00]">18.5 t/h</span></span>
          </div>
        </div>
      </div>

    </div>
  );
};
