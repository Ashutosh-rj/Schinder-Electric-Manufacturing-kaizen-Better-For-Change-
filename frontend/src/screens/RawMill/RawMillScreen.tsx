import React from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { 
  VerticalRollerMillUnit, PulseJetBaghouseUnit, CentrifugalFanUnit, 
  ReinforcedSiloUnit, IndustrialPipe, ISAInstrumentTag 
} from '../../components/scada/Equipment/IndustrialPlantComponents';

interface ScreenProps {
  onOpenFaceplate?: (eqId: string) => void;
}

export const RawMillScreen: React.FC<ScreenProps> = ({ onOpenFaceplate }) => {
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
              AREA-200
            </span>
            <span className="text-sm font-extrabold text-white">RAW MATERIAL GRINDING & DRYING (VRM CIRCUIT)</span>
          </div>
          <span className="text-gray-400 font-mono text-[11px]">MILL TYPE: 4-ROLLER VRM • 3,800 kW • RATED: 300 t/h</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <div>TOTAL FEED: <span className="text-[#00ff00] font-bold">{(tags['RM1-FEED-TOT'] || 285).toFixed(0)} t/h</span></div>
          <div>VRM POWER: <span className="text-[#00d4ff] font-bold">{(tags['RM1-PWR'] || 3240).toFixed(0)} kW</span></div>
          <div>MILL dP: <span className="text-amber-400 font-bold">{(tags['RM1-DP'] || 620).toFixed(0)} mmWC</span></div>
          <div>HYDR PR: <span className="text-cyan-400 font-bold">{(tags['RM1-VRM-HYD-PR'] || 136).toFixed(0)} bar</span></div>
          <div>OUTLET TEMP: <span className="text-[#00ff00] font-bold">{(tags['RM1-OUT-TEMP'] || 88.5).toFixed(1)} °C</span></div>
        </div>
      </div>

      {/* SVG SCHEMATIC - REAL VRM PLANT WORKING PARTS */}
      <svg className="w-full h-full" viewBox="0 0 1600 780" preserveAspectRatio="xMidYMid meet">
        
        {/* DUCTING & MATERIAL TRANSPORT PIPES */}
        {/* 1. Hot Gas from Kiln Preheater to VRM Tangential Louver Ring */}
        <IndustrialPipe d="M 50 560 L 320 560 L 320 500" media="HOT_GAS" strokeWidth="16" />
        
        {/* 2. Mill Outlet Gas & Fine Raw Meal to Process Bag Filter */}
        <IndustrialPipe d="M 460 210 L 460 140 L 820 140 L 820 230" media="HOT_GAS" strokeWidth="18" />

        {/* 3. Process Bag Filter to Process ID Fan */}
        <IndustrialPipe d="M 940 320 L 1050 320 L 1050 420" media="HOT_GAS" strokeWidth="16" />

        {/* 4. Process ID Fan to Raw Meal Silo & Chimney */}
        <IndustrialPipe d="M 1120 460 L 1260 460 L 1260 220 L 1320 220" media="RAW_MEAL" strokeWidth="12" />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 1. RAW MATERIAL PROPORTIONING WEIGH FEEDERS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <g transform="translate(60, 100)">
          {/* 4 Hoppers: Limestone (82%), Clay (12%), Sand (3%), Iron Ore (3%) */}
          {[
            { name: 'LIMESTONE', pct: '82.5%', tag: 'RM1-FEED-LS', val: 235 },
            { name: 'CLAY/SHALE', pct: '12.0%', tag: 'RM1-FEED-CLAY', val: 34 },
            { name: 'SANDSTONE', pct: '3.0%', tag: 'RM1-FEED-SAND', val: 8.5 },
            { name: 'IRON ORE', pct: '2.5%', tag: 'RM1-FEED-IRON', val: 7.5 },
          ].map((h, i) => (
            <g key={i} transform={`translate(${i * 62}, 0)`}>
              {/* Hopper cone */}
              <polygon points="0,0 55,0 45,60 10,60" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <rect x="0" y="-14" width="55" height="14" fill="#334155" stroke="#475569" />
              <text x="27" y="-4" fill="#cbd5e1" fontSize="7" fontWeight="bold" textAnchor="middle">{h.name}</text>
              
              {/* Weigh Feeder enclosure */}
              <rect x="5" y="60" width="45" height="24" fill="#0f172a" stroke="#00d4ff" strokeWidth="1" rx="2" />
              <text x="27" y="72" fill="#00ff00" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {(tags[h.tag] || h.val).toFixed(1)} t/h
              </text>
              <text x="27" y="81" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="middle">{h.pct}</text>
            </g>
          ))}

          {/* Tripper Feed Conveyor collecting all 4 streams */}
          <rect x="-10" y="92" width="265" height="12" fill="#1e293b" stroke="#334155" rx="2" />
          <path d="M 0 98 L 240 98" stroke="#00ff00" strokeWidth="3" strokeDasharray="8 6">
            <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.8s" repeatCount="indefinite" />
          </path>

          {/* Rotary Airlock Triple Gate Feeder into Mill */}
          <g transform="translate(265, 88)">
            <circle cx="15" cy="15" r="14" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="15" cy="15" r="4" fill="#00d4ff" />
            <line x1="15" y1="29" x2="60" y2="120" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round" />
            <text x="15" y="45" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle">ROTARY AIRLOCK</text>
          </g>
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 2. VERTICAL ROLLER MILL UNIT (RM1-VRM-01) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <VerticalRollerMillUnit 
          id="RM1-VRM-01" 
          x={460} 
          y={360} 
          scale={1.2} 
          onClick={handleEqClick} 
        />

        {/* Coarse Grit Rejects Bucket Elevator */}
        <g transform="translate(610, 280)">
          <rect x="0" y="0" width="24" height="190" fill="#0f172a" stroke="#475569" strokeWidth="2" rx="2" />
          <line x1="12" y1="5" x2="12" y2="185" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4">
            <animate attributeName="stroke-dashoffset" from="10" to="0" dur="0.5s" repeatCount="indefinite" />
          </line>
          <text x="12" y="-8" fill="#eab308" fontSize="8" fontWeight="bold" textAnchor="middle">REJECTS ELEV</text>
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 3. PROCESS BAG FILTER (PULSE-JET) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <PulseJetBaghouseUnit 
          id="RM1-DC-01" 
          x={780} 
          y={210} 
          scale={1.1} 
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 4. PROCESS MAIN ID FAN (RM1-FAN-01) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <CentrifugalFanUnit 
          id="RM1-FAN-01" 
          x={1070} 
          y={440} 
          scale={1.2} 
          onClick={handleEqClick} 
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 5. RAW MEAL CONTINUOUS FLOW HOMOGENIZING SILO */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <ReinforcedSiloUnit 
          x={1340} 
          y={200} 
          width={130} 
          height={320} 
          tagLvl="RM1-SILO-LVL" 
          name="CF RAW MEAL SILO" 
          material="RAW MEAL (LSF 97)" 
        />

        {/* Fluidized Air Slide from Baghouse to Silo Elevator */}
        <line x1="880" y1="440" x2="1340" y2="440" stroke="#94a3b8" strokeWidth="8" strokeDasharray="10 4">
          <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.6s" repeatCount="indefinite" />
        </line>
        <text x="1100" y="432" fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="middle">
          FLUIDIZED GRAVITY AIR SLIDE (LOW PRESSURE AERATION)
        </text>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 6. REAL-TIME ISA INSTRUMENTATION BUBBLE TAGS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* Hot Gas Inlet Temperature */}
        <ISAInstrumentTag tag="RM1-IN-TEMP" isaCode="TI" unit="°C" x={240} y={510} />
        {/* Mill Differential Pressure dP */}
        <ISAInstrumentTag tag="RM1-DP" isaCode="PI" unit="mmWC" x={340} y={280} />
        {/* VRM Table Vibration */}
        <ISAInstrumentTag tag="RM1-VRM-VIB" isaCode="VI" unit="mm/s" x={330} y={420} />
        {/* Separator Rotor Speed */}
        <ISAInstrumentTag tag="RM1-SEP-SPD" isaCode="SI" unit="RPM" x={460} y={220} />
        {/* Gas Outlet Temperature */}
        <ISAInstrumentTag tag="RM1-OUT-TEMP" isaCode="TI" unit="°C" x={630} y={120} />
        {/* Baghouse dP */}
        <ISAInstrumentTag tag="RM1-DC-DP" isaCode="PI" unit="mmWC" x={960} y={210} />
        {/* Process ID Fan Motor Current */}
        <ISAInstrumentTag tag="RM1-FAN-CUR" isaCode="II" unit="A" x={1220} y={390} />

      </svg>

      {/* QUICK STATUS OVERLAY CARDS */}
      <div className="absolute bottom-3 left-4 flex gap-3">
        <div className="bg-[#0f172a]/95 border border-gray-700 p-2.5 rounded-lg text-xs font-mono">
          <div className="text-[10px] text-gray-400 uppercase font-bold font-sans">HYDROPNEUMATIC TENSIONING</div>
          <div className="flex gap-4 mt-1">
            <span>ROLLER PR: <span className="text-[#00ff00] font-bold">{(tags['RM1-VRM-HYD-PR'] || 136).toFixed(0)} bar</span></span>
            <span>N2 ACCUMULATORS: <span className="text-white">85 bar pre-charge</span></span>
            <span>BED WATER: <span className="text-cyan-400">{(tags['RM1-VRM-WATER'] || 2.8).toFixed(1)} m³/h</span></span>
          </div>
        </div>

        <div className="bg-[#0f172a]/95 border border-gray-700 p-2.5 rounded-lg text-xs font-mono">
          <div className="text-[10px] text-gray-400 uppercase font-bold font-sans">MAIN REDUCER JACKING LUBE</div>
          <div className="flex gap-4 mt-1">
            <span>HYDROSTATIC PR: <span className="text-[#00ff00] font-bold">185 bar</span></span>
            <span>LUBE OIL TEMP: <span className="text-white">48.2 °C</span></span>
            <span>OIL FLOW: <span className="text-emerald-400">142 L/min</span></span>
          </div>
        </div>
      </div>

    </div>
  );
};
