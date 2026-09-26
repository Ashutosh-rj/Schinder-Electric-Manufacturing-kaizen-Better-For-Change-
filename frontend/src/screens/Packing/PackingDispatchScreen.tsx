import React from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { ReinforcedSiloUnit, IndustrialPipe, ISAInstrumentTag } from '../../components/scada/Equipment/IndustrialPlantComponents';

interface ScreenProps {
  onOpenFaceplate?: (eqId: string) => void;
}

export const PackingDispatchScreen: React.FC<ScreenProps> = ({ onOpenFaceplate }) => {
  const tags = useScadaStore((s) => s.tags);

  return (
    <div className="w-full h-full relative bg-[#0b1320] text-white overflow-hidden select-none font-sans">
      
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="flex items-center justify-between px-6 py-2 bg-[#070b14] border-b border-gray-800 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-purple-400 font-bold px-2 py-0.5 bg-black/60 rounded border border-purple-500/30">
              AREA-800
            </span>
            <span className="text-sm font-extrabold text-white">CEMENT PACKING PLANT & BULK DISPATCH TERMINAL</span>
          </div>
          <span className="text-gray-400 font-mono text-[11px]">12-SPOUT ROTARY PACKER • 2,400 BAGS/HR • BULK TANKER LOADING</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <div>PACKING RATE: <span className="text-[#00ff00] font-bold">{(tags['PACK-BAGS-MIN'] || 85).toFixed(0)} bags/min</span></div>
          <div>BAG WEIGHT: <span className="text-cyan-400 font-bold">{(tags['PACK-BAG-WEIGHT'] || 50.1).toFixed(2)} kg</span></div>
          <div>BULK LOADING: <span className="text-amber-400 font-bold">{(tags['PACK-BULK-FLOW'] || 180).toFixed(0)} t/h</span></div>
          <div>DISPATCH TONNAGE: <span className="text-purple-400 font-bold">3,850 t / day</span></div>
        </div>
      </div>

      {/* SVG SCHEMATIC - REAL PACKING & DISPATCH WORKING PARTS */}
      <svg className="w-full h-full" viewBox="0 0 1600 780" preserveAspectRatio="xMidYMid meet">
        
        {/* Conveyor Pipes */}
        <IndustrialPipe d="M 280 430 L 480 430 L 480 320 L 620 320" media="RAW_MEAL" strokeWidth="12" />
        <IndustrialPipe d="M 880 350 L 1150 350" media="RAW_MEAL" strokeWidth="10" />

        {/* 1. CEMENT STORAGE SILOS */}
        <ReinforcedSiloUnit x={80} y={150} width={95} height={320} tagLvl="CM2-SILO1-LVL" name="SILO 1" material="OPC 53" />
        <ReinforcedSiloUnit x={190} y={150} width={95} height={320} tagLvl="CM2-SILO2-LVL" name="SILO 2" material="PPC" />

        {/* 2. ROTARY CEMENT PACKER (12-SPOUT) */}
        <g transform="translate(680, 240)">
          {/* Main Rotary Turret Carrousel */}
          <circle cx="80" cy="80" r="70" fill="#1e293b" stroke="#a855f7" strokeWidth="3" />
          <circle cx="80" cy="80" r="30" fill="#0f172a" stroke="#64748b" />
          
          {/* 12 Spouts */}
          {Array.from({ length: 12 }).map((_, i) => (
            <g key={i} transform={`translate(80, 80) rotate(${i * 30})`}>
              <line x1="30" y1="0" x2="65" y2="0" stroke="#facc15" strokeWidth="4" />
              <rect x="62" y="-4" width="8" height="8" fill="#38bdf8" />
            </g>
          ))}

          {/* Automatic bag placer arm */}
          <line x1="80" y1="80" x2="160" y2="120" stroke="#00d4ff" strokeWidth="4" strokeLinecap="round" />
          
          <text x="80" y="175" fill="#f8fafc" fontSize="12" fontWeight="extrabold" textAnchor="middle">
            12-SPOUT ROTARY PACKER (RP-01)
          </text>
        </g>

        {/* 3. BAG CONVEYOR BELT & CHECKWEIGHER */}
        <g transform="translate(860, 340)">
          <rect x="0" y="0" width="280" height="20" fill="#1e293b" stroke="#475569" rx="2" />
          {/* Moving 50kg cement bags */}
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={20 + i * 45} y="-12" width="30" height="12" fill="#d97706" stroke="#0f172a" rx="2" />
          ))}
          
          {/* Checkweigher with Reject Diverter Flap */}
          <g transform="translate(180, -35)">
            <rect x="0" y="0" width="50" height="25" fill="#0b1320" stroke="#00ff00" rx="2" />
            <text x="25" y="12" fill="#00ff00" fontSize="7" fontWeight="bold" textAnchor="middle">CHECKWEIGHER</text>
            <text x="25" y="21" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle">50.10 kg</text>
          </g>

          <text x="140" y="45" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
            BAG DISPATCH CONVEYOR (TRUCK LOADING)
          </text>
        </g>

        {/* 4. TELESCOPIC BULK TANKER LOADING SPOUT */}
        <g transform="translate(1260, 220)">
          <rect x="0" y="0" width="60" height="40" fill="#1e293b" stroke="#38bdf8" rx="3" />
          {/* Telescopic Chute */}
          <polygon points="15,40 45,40 50,140 10,140" fill="#334155" stroke="#64748b" strokeWidth="2" />
          {/* Bulk Tanker Truck */}
          <g transform="translate(-40, 140)">
            <rect x="0" y="0" width="140" height="50" fill="#475569" stroke="#94a3b8" rx="8" />
            <circle cx="25" cy="55" r="14" fill="#0f172a" />
            <circle cx="55" cy="55" r="14" fill="#0f172a" />
            <circle cx="115" cy="55" r="14" fill="#0f172a" />
            <text x="70" y="30" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">BULK CEMENT TANKER</text>
          </g>
          <text x="30" y="210" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
            BULK LOADING (180 t/h)
          </text>
        </g>

        {/* ISA INSTRUMENTATION */}
        <ISAInstrumentTag tag="PACK-BAGS-MIN" isaCode="SI" unit="BPM" x={760} y={190} />
        <ISAInstrumentTag tag="PACK-BAG-WEIGHT" isaCode="WI" unit="kg" x={1080} y={290} />
        <ISAInstrumentTag tag="PACK-BULK-FLOW" isaCode="FI" unit="t/h" x={1380} y={180} />

      </svg>
    </div>
  );
};
