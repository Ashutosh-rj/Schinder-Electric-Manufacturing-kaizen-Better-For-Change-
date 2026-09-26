import React from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { 
  ReinforcedSiloUnit, PulseJetBaghouseUnit, 
  IndustrialPipe, ISAInstrumentTag 
} from '../../components/scada/Equipment/IndustrialPlantComponents';

interface ScreenProps {
  onOpenFaceplate?: (eqId: string) => void;
}

export const ClinkerTransportScreen: React.FC<ScreenProps> = ({ onOpenFaceplate }) => {
  const tags = useScadaStore((s) => s.tags);

  return (
    <div className="w-full h-full relative bg-[#0b1320] text-white overflow-hidden select-none font-sans">
      
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="flex items-center justify-between px-6 py-2 bg-[#070b14] border-b border-gray-800 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-amber-400 font-bold px-2 py-0.5 bg-black/60 rounded border border-amber-500/30">
              AREA-550
            </span>
            <span className="text-sm font-extrabold text-white">CLINKER CONVEYING & STORAGE SILOS</span>
          </div>
          <span className="text-gray-400 font-mono text-[11px]">DEEP PAN CONVEYOR • DOUBLE-CHAIN ELEVATOR • 50,000 TON SILO CAPACITY</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <div>CONVEYOR LOAD: <span className="text-[#00ff00] font-bold">{(tags['CT1-PAN-CVY-LOAD'] || 182).toFixed(0)} t/h</span></div>
          <div>CONVEYOR SPEED: <span className="text-[#00d4ff] font-bold">{(tags['CT1-PAN-CVY-SPD'] || 0.35).toFixed(2)} m/s</span></div>
          <div>SILO 1 LEVEL: <span className="text-emerald-400 font-bold">{(tags['CT1-SILO-LVL'] || 65.4).toFixed(1)} %</span></div>
          <div>TOTAL STOCK: <span className="text-amber-400 font-bold">42,500 tons</span></div>
        </div>
      </div>

      {/* SVG SCHEMATIC */}
      <svg className="w-full h-full" viewBox="0 0 1600 780" preserveAspectRatio="xMidYMid meet">
        
        {/* Conveyor path from Cooler */}
        <IndustrialPipe d="M 60 520 L 520 220" media="CLINKER" strokeWidth="16" />
        <IndustrialPipe d="M 520 220 L 1380 220" media="CLINKER" strokeWidth="12" />

        {/* 1. DEEP PAN CONVEYOR (HEAD DRIVE & TAKE-UP) */}
        <g transform="translate(60, 520)">
          <rect x="-10" y="-15" width="80" height="30" fill="#334155" stroke="#64748b" rx="2" />
          <text x="30" y="5" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">COOLER DROP</text>
        </g>

        {/* Heavy Double-Chain Bucket Elevator at Transfer Tower */}
        <g transform="translate(500, 160)">
          <rect x="0" y="0" width="35" height="380" fill="#0f172a" stroke="#475569" strokeWidth="2.5" rx="3" />
          <line x1="17" y1="10" x2="17" y2="370" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 6">
            <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.6s" repeatCount="indefinite" />
          </line>
          <text x="17" y="-8" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">CHAIN ELEVATOR</text>
        </g>

        {/* 2. REINFORCED CLINKER SILOS (SILO 1 & SILO 2 & OFF-SPEC) */}
        <ReinforcedSiloUnit 
          x={640} 
          y={230} 
          width={160} 
          height={380} 
          tagLvl="CT1-SILO-LVL" 
          name="MAIN CLINKER SILO 1" 
          material="OPC CLINKER" 
        />

        <ReinforcedSiloUnit 
          x={880} 
          y={230} 
          width={160} 
          height={380} 
          tagLvl="CT1-SILO-LVL" 
          name="MAIN CLINKER SILO 2" 
          material="SPECIAL CLINKER" 
        />

        <ReinforcedSiloUnit 
          x={1120} 
          y={330} 
          width={120} 
          height={280} 
          tagLvl="CT1-SILO-LVL" 
          name="OFF-SPEC SILO" 
          material="RE-CYCLE" 
        />

        {/* 3. DUST COLLECTOR BAG FILTER */}
        <PulseJetBaghouseUnit id="CT1-DC-01" x={460} y={40} scale={0.9} />

        {/* ISA TAGS */}
        <ISAInstrumentTag tag="CT1-PAN-CVY-LOAD" isaCode="WI" unit="t/h" x={340} y={320} />
        <ISAInstrumentTag tag="CT1-SILO-LVL" isaCode="LI" unit="%" x={720} y={200} />

      </svg>
    </div>
  );
};
