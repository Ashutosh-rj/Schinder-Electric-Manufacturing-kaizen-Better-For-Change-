import React from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { IndustrialPipe, ISAInstrumentTag } from '../../components/scada/Equipment/IndustrialPlantComponents';

interface ScreenProps {
  onOpenFaceplate?: (eqId: string) => void;
}

export const WHRSPowerScreen: React.FC<ScreenProps> = ({ onOpenFaceplate }) => {
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
            <span className="font-mono text-emerald-400 font-bold px-2 py-0.5 bg-black/60 rounded border border-emerald-500/30">
              AREA-700
            </span>
            <span className="text-sm font-extrabold text-white">WASTE HEAT RECOVERY (WHRS) & CAPTIVE POWER SUBSTATION</span>
          </div>
          <span className="text-gray-400 font-mono text-[11px]">SP BOILER • AQC BOILER • MULTI-STAGE STEAM TURBINE • 7.5 MW RATED</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <div>WHRS POWER: <span className="text-[#00ff00] font-bold">{(tags['WHRS-TURBINE-MW'] || 6.45).toFixed(2)} MW</span></div>
          <div>CPP COAL POWER: <span className="text-[#00d4ff] font-bold">{((tags['CPP-POWER'] || 8500) / 1000).toFixed(2)} MW</span></div>
          <div>GRID IMPORT: <span className="text-amber-400 font-bold">{((tags['PLANT-GRID-IMPORT'] || 7450) / 1000).toFixed(2)} MW</span></div>
          <div>TOTAL CONSUMPTION: <span className="text-purple-400 font-bold">{((tags['PLANT-TOTAL-POWER'] || 22400) / 1000).toFixed(2)} MW</span></div>
        </div>
      </div>

      {/* SVG SCHEMATIC - REAL WHRS PLANT WORKING PARTS */}
      <svg className="w-full h-full" viewBox="0 0 1600 780" preserveAspectRatio="xMidYMid meet">
        
        {/* Steam Headers */}
        <IndustrialPipe d="M 280 260 L 520 260 L 520 370 L 680 370" media="WATER" strokeWidth="12" />
        <IndustrialPipe d="M 280 500 L 520 500 L 520 370" media="WATER" strokeWidth="12" />
        <IndustrialPipe d="M 940 370 L 1050 370 L 1050 510 L 1150 510" media="WATER" strokeWidth="14" />

        {/* 1. SUSPENSION PREHEATER (SP) BOILER */}
        <g transform="translate(140, 160)">
          <rect x="0" y="0" width="140" height="180" fill="#1e293b" stroke="#0ea5e9" strokeWidth="3" rx="4" />
          <text x="70" y="24" fill="#38bdf8" fontSize="11" fontWeight="extrabold" textAnchor="middle">SP BOILER</text>
          
          {/* Boiler Tubes bundle */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1="15" y1={45 + i * 14} x2="125" y2={45 + i * 14} stroke="#0284c7" strokeWidth="2.5" />
          ))}

          <g transform="translate(15, 120)" className="font-mono text-[9px]">
            <text x="0" y="10" fill="#cbd5e1">STEAM: <tspan fill="#00ff00" fontWeight="bold">{(tags['WHRS-SP-STEAM-FLOW'] || 14.2).toFixed(1)} t/h</tspan></text>
            <text x="0" y="24" fill="#cbd5e1">TEMP: <tspan fill="#facc15">{(tags['WHRS-SP-STEAM-TEMP'] || 325).toFixed(0)} °C</tspan></text>
            <text x="0" y="38" fill="#cbd5e1">PRESS: <tspan fill="#38bdf8">18.5 bar</tspan></text>
          </g>
        </g>

        {/* 2. AIR QUENCHING COOLER (AQC) BOILER */}
        <g transform="translate(140, 420)">
          <rect x="0" y="0" width="140" height="180" fill="#1e293b" stroke="#0ea5e9" strokeWidth="3" rx="4" />
          <text x="70" y="24" fill="#38bdf8" fontSize="11" fontWeight="extrabold" textAnchor="middle">AQC BOILER</text>

          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1="15" y1={45 + i * 14} x2="125" y2={45 + i * 14} stroke="#0284c7" strokeWidth="2.5" />
          ))}

          <g transform="translate(15, 120)" className="font-mono text-[9px]">
            <text x="0" y="10" fill="#cbd5e1">STEAM: <tspan fill="#00ff00" fontWeight="bold">{(tags['WHRS-AQC-STEAM-FLOW'] || 18.5).toFixed(1)} t/h</tspan></text>
            <text x="0" y="24" fill="#cbd5e1">TEMP: <tspan fill="#facc15">{(tags['WHRS-AQC-STEAM-TEMP'] || 340).toFixed(0)} °C</tspan></text>
            <text x="0" y="38" fill="#cbd5e1">PRESS: <tspan fill="#38bdf8">14.0 bar</tspan></text>
          </g>
        </g>

        {/* 3. MULTI-STAGE CONDENSING STEAM TURBINE & GENERATOR */}
        <g 
          transform="translate(680, 290)" 
          className="cursor-pointer group"
          onClick={() => handleEqClick('WHRS-GEN-01')}
        >
          {/* Turbine Casing */}
          <polygon points="0,30 110,10 110,110 0,90" fill="#0f172a" stroke="#10b981" strokeWidth="3" />
          <text x="50" y="65" fill="#34d399" fontSize="10" fontWeight="extrabold" textAnchor="middle">STEAM TURBINE</text>

          {/* Generator */}
          <rect x="130" y="20" width="110" height="80" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" rx="4" />
          <circle cx="185" cy="60" r="24" fill="#0f172a" stroke="#00ff00" strokeWidth="2" />
          <text x="185" y="64" fill="#00ff00" fontSize="11" fontWeight="extrabold" textAnchor="middle">7.5 MW</text>

          {/* Drive Shaft */}
          <line x1="110" y1="60" x2="130" y2="60" stroke="#94a3b8" strokeWidth="8" />

          {/* Label */}
          <text x="120" y="135" fill="#f8fafc" fontSize="12" fontWeight="extrabold" textAnchor="middle">
            WHRS TURBO-GENERATOR (WHRS-GEN-01)
          </text>
        </g>

        {/* 4. SURFACE CONDENSER & COOLING WATER CIRCULATION */}
        <g transform="translate(1150, 440)">
          <rect x="0" y="0" width="160" height="120" fill="#1e293b" stroke="#0284c7" strokeWidth="2" rx="4" />
          <text x="80" y="25" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">SURFACE CONDENSER</text>
          <text x="80" y="55" fill="#00ff00" fontSize="12" fontWeight="black" fontFamily="monospace" textAnchor="middle">
            VACUUM: 0.91 bar
          </text>
          <text x="80" y="80" fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="middle">
            CONDENSATE TEMP: 41.5 °C
          </text>
        </g>

        {/* 5. ELECTRICAL SUBSTATION / GRID SYNCHRONIZATION */}
        <g transform="translate(1080, 160)">
          <rect x="0" y="0" width="220" height="130" fill="#0b1320" stroke="#f59e0b" strokeWidth="2" rx="4" />
          <text x="110" y="24" fill="#facc15" fontSize="11" fontWeight="extrabold" textAnchor="middle">PLANT 33kV SUBSTATION</text>
          
          <g transform="translate(20, 45)" className="font-mono text-[10px]">
            <text x="0" y="10" fill="#cbd5e1">GRID IMPORT: <tspan fill="#38bdf8" fontWeight="bold">7.45 MW</tspan></text>
            <text x="0" y="26" fill="#cbd5e1">WHRS GREEN: <tspan fill="#00ff00" fontWeight="bold">{(tags['WHRS-TURBINE-MW'] || 6.45).toFixed(2)} MW</tspan></text>
            <text x="0" y="42" fill="#cbd5e1">CAPTIVE CPP: <tspan fill="#facc15" fontWeight="bold">8.50 MW</tspan></text>
            <text x="0" y="58" fill="#cbd5e1">POWER FACTOR: <tspan fill="#00ff00">0.985</tspan></text>
          </g>
        </g>

        {/* REAL-TIME ISA INSTRUMENTATION BUBBLE TAGS */}
        <ISAInstrumentTag tag="WHRS-TURBINE-MW" isaCode="II" unit="MW" x={930} y={320} />
        <ISAInstrumentTag tag="WHRS-SP-STEAM-TEMP" isaCode="TI" unit="°C" x={380} y={230} />
        <ISAInstrumentTag tag="WHRS-AQC-STEAM-TEMP" isaCode="TI" unit="°C" x={380} y={470} />

      </svg>
    </div>
  );
};
