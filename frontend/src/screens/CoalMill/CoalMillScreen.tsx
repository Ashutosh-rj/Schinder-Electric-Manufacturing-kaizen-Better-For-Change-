import React from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { 
  VerticalRollerMillUnit, PulseJetBaghouseUnit, CentrifugalFanUnit, 
  IndustrialPipe, ISAInstrumentTag 
} from '../../components/scada/Equipment/IndustrialPlantComponents';

interface ScreenProps {
  onOpenFaceplate?: (eqId: string) => void;
}

export const CoalMillScreen: React.FC<ScreenProps> = ({ onOpenFaceplate }) => {
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
              AREA-300
            </span>
            <span className="text-sm font-extrabold text-white">COAL GRINDING & PULVERIZED FUEL INJECTION (ATEX ZONE 20/21)</span>
          </div>
          <span className="text-gray-400 font-mono text-[11px]">INERT ATMOSPHERE • CO/O2 ANALYZER • PFISTER ROTOR WEIGH FEEDER</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <div>COAL FEED: <span className="text-[#00ff00] font-bold">{(tags['CM1-FEED'] || 28.5).toFixed(1)} t/h</span></div>
          <div>KILN INJECTION: <span className="text-amber-400 font-bold">{(tags['CM1-INJ-KILN'] || 11.8).toFixed(1)} t/h</span></div>
          <div>CALCINER INJECTION: <span className="text-orange-400 font-bold">{(tags['CM1-INJ-CALC'] || 16.2).toFixed(1)} t/h</span></div>
          <div>O2 CONC: <span className="text-[#00ff00] font-bold">{(tags['CM1-O2-CONC'] || 5.2).toFixed(1)} % vol</span></div>
          <div>CO CONC: <span className="text-[#00d4ff] font-bold">{(tags['CM1-CO-CONC'] || 85).toFixed(0)} ppm</span></div>
        </div>
      </div>

      {/* SVG SCHEMATIC - REAL COAL MILL PLANT WORKING PARTS */}
      <svg className="w-full h-full" viewBox="0 0 1600 780" preserveAspectRatio="xMidYMid meet">
        
        {/* DUCTING & MATERIAL PIPES */}
        {/* Hot Inert Gas from Kiln Smoke Chamber */}
        <IndustrialPipe d="M 60 520 L 320 520 L 320 460" media="HOT_GAS" strokeWidth="14" />
        
        {/* Mill Outlet to Coal Baghouse */}
        <IndustrialPipe d="M 440 210 L 440 140 L 780 140 L 780 220" media="PULVERIZED_COAL" strokeWidth="14" />

        {/* Pneumatic Injection Pipe to Kiln Main Burner */}
        <IndustrialPipe d="M 1250 540 L 1450 540" media="PULVERIZED_COAL" strokeWidth="10" />
        <text x="1350" y="530" fill="#f97316" fontSize="9" fontWeight="bold">TO KILN BURNER PIPE</text>

        {/* Pneumatic Injection Pipe to Calciner Burners */}
        <IndustrialPipe d="M 1250 565 L 1450 565" media="PULVERIZED_COAL" strokeWidth="10" />
        <text x="1350" y="585" fill="#f97316" fontSize="9" fontWeight="bold">TO CALCINER BURNERS</text>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 1. RAW COAL BUNKER & EXPLOSION-PROOF WEIGH FEEDER */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <g transform="translate(100, 120)">
          {/* Reinforced Coal Bunker with ultrasonic level */}
          <polygon points="0,0 90,0 75,90 15,90" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
          <rect x="0" y="-18" width="90" height="18" fill="#334155" stroke="#f59e0b" />
          <text x="45" y="-6" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">RAW COAL BUNKER</text>

          {/* Coal Fill level */}
          <polygon points="18,30 72,30 65,85 25,85" fill="#0f172a" />
          <circle cx="45" cy="50" r="5" fill="#475569" />

          {/* Explosion Proof Gravimetric Belt Feeder Enclosure */}
          <g transform="translate(10, 95)">
            <rect x="0" y="0" width="70" height="30" fill="#0b1320" stroke="#f59e0b" strokeWidth="1.5" rx="3" />
            <text x="35" y="14" fill="#facc15" fontSize="7" fontWeight="bold" textAnchor="middle">EXP-PROOF FEEDER</text>
            <text x="35" y="24" fill="#00ff00" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              {(tags['CM1-FEED'] || 28.5).toFixed(1)} t/h
            </text>
          </g>

          {/* Triple-Gate Inerting Flap Chute into Mill */}
          <line x1="45" y1="125" x2="220" y2="240" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 2. COAL VRM WITH EXPLOSION RELIEF VENTS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <g transform="translate(440, 360)">
          <VerticalRollerMillUnit 
            id="CM1-VRM-01" 
            x={0} 
            y={0} 
            scale={1.05} 
            onClick={handleEqClick} 
          />
          {/* ATEX Explosion Rupture Disc / Relief Door on Mill Top */}
          <g transform="translate(55, -45)">
            <rect x="0" y="0" width="20" height="12" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" rx="1" />
            <text x="10" y="8" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">RUPTURE</text>
          </g>
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 3. COAL PROCESS BAGHOUSE (INERTED ATMOSPHERE) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <PulseJetBaghouseUnit 
          id="CM1-DC-01" 
          x={740} 
          y={200} 
          scale={1.0} 
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 4. FINE COAL BIN & PFISTER ROTOR WEIGH FEEDERS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <g transform="translate(1080, 240)">
          {/* Cylindrical fine coal storage bin with load cells */}
          <rect x="0" y="0" width="100" height="140" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" rx="4" />
          <polygon points="0,140 100,140 75,190 25,190" fill="#334155" stroke="#f59e0b" strokeWidth="2" />
          <text x="50" y="30" fill="#facc15" fontSize="10" fontWeight="extrabold" textAnchor="middle">FINE COAL BIN</text>
          <text x="50" y="50" fill="#ffffff" fontSize="12" fontWeight="black" fontFamily="monospace" textAnchor="middle">
            {(tags['CM1-BUNKER-LVL'] || 62).toFixed(1)}%
          </text>
          <text x="50" y="70" fill="#00ff00" fontSize="8" fontFamily="monospace" textAnchor="middle">
            INERT N2 PURGED
          </text>

          {/* Pfister Rotor Weigh Feeder 1 (to Kiln Burner) */}
          <g transform="translate(10, 205)">
            <circle cx="15" cy="15" r="14" fill="#0b1320" stroke="#38bdf8" strokeWidth="2" />
            <text x="15" y="18" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">PFISTER 1</text>
          </g>

          {/* Pfister Rotor Weigh Feeder 2 (to Calciner) */}
          <g transform="translate(60, 205)">
            <circle cx="15" cy="15" r="14" fill="#0b1320" stroke="#f59e0b" strokeWidth="2" />
            <text x="15" y="18" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">PFISTER 2</text>
          </g>
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 5. EMERGENCY CO2 / N2 INERTING FIRE SUPPRESSION MANIFOLD */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <g transform="translate(650, 520)">
          <rect x="0" y="0" width="160" height="50" fill="#0f172a" stroke="#ef4444" strokeWidth="2" rx="4" />
          <text x="80" y="16" fill="#ef4444" fontSize="9" fontWeight="extrabold" textAnchor="middle">
            CO2/N2 INERTING FIRE SYSTEM
          </text>
          <div className="flex gap-4">
            <text x="35" y="32" fill="#38bdf8" fontSize="8" fontFamily="monospace">STATUS: ARMED</text>
            <text x="110" y="32" fill="#00ff00" fontSize="8" fontFamily="monospace">MANIFOLD: 180 BAR</text>
          </div>
          <circle cx="20" cy="30" r="4" fill="#00ff00" />
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 6. REAL-TIME ISA INSTRUMENTATION BUBBLE TAGS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <ISAInstrumentTag tag="CM1-IN-TEMP" isaCode="TI" unit="°C" x={240} y={480} />
        <ISAInstrumentTag tag="CM1-OUT-TEMP" isaCode="TI" unit="°C" x={440} y={150} />
        <ISAInstrumentTag tag="CM1-O2-CONC" isaCode="AI" unit="%" x={900} y={170} alarm="NORMAL" />
        <ISAInstrumentTag tag="CM1-CO-CONC" isaCode="AI" unit="ppm" x={900} y={230} />
        <ISAInstrumentTag tag="CM1-PWR" isaCode="II" unit="kW" x={340} y={380} />
        <ISAInstrumentTag tag="CM1-INJ-KILN" isaCode="FI" unit="t/h" x={1260} y={470} />
        <ISAInstrumentTag tag="CM1-INJ-CALC" isaCode="FI" unit="t/h" x={1260} y={630} />

      </svg>

      {/* ATEX SAFETY BARRIER OVERLAY */}
      <div className="absolute bottom-3 left-4 flex gap-3">
        <div className="bg-[#0f172a]/95 border border-red-500/50 p-2.5 rounded-lg text-xs font-mono">
          <div className="text-[10px] text-red-400 uppercase font-bold font-sans flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            ATEX ZONE 20/21 EXPLOSION PROTECTION INTERLOCKS
          </div>
          <div className="flex gap-4 mt-1">
            <span>O2 CONCENTRATION: <span className="text-[#00ff00] font-bold">{(tags['CM1-O2-CONC'] || 5.2).toFixed(1)} % (TRIP &gt; 8.0%)</span></span>
            <span>CO LEVEL: <span className="text-[#00ff00] font-bold">{(tags['CM1-CO-CONC'] || 85).toFixed(0)} ppm (TRIP &gt; 300)</span></span>
            <span>OUTLET TEMP: <span className="text-[#00ff00] font-bold">{(tags['CM1-OUT-TEMP'] || 68.5).toFixed(1)} °C (TRIP &gt; 75°C)</span></span>
          </div>
        </div>
      </div>

    </div>
  );
};
