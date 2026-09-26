import React from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { 
  ApronFeederUnit, ImpactCrusherUnit, PulseJetBaghouseUnit, 
  IndustrialPipe, ISAInstrumentTag 
} from '../../components/scada/Equipment/IndustrialPlantComponents';

interface ScreenProps {
  onOpenFaceplate?: (eqId: string) => void;
}

export const LimestoneCrusherScreen: React.FC<ScreenProps> = ({ onOpenFaceplate }) => {
  const tags = useScadaStore((s) => s.tags);
  const eq = useScadaStore((s) => s.equipment);

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
              AREA-100
            </span>
            <span className="text-sm font-extrabold text-white">PRIMARY LIMESTONE CRUSHING & BLENDING BED</span>
          </div>
          <span className="text-gray-400 font-mono text-[11px]">CAPACITY: 600 t/h | MAX FEED SIZE: 1,200 mm | CSS: 28 mm</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <div>TOTAL FEED: <span className="text-[#00ff00] font-bold">{(tags['CR-AF-FEED'] || 480).toFixed(0)} t/h</span></div>
          <div>CRUSHER PWR: <span className="text-[#00d4ff] font-bold">{(tags['CR-CR-PWR'] || 485).toFixed(0)} kW</span></div>
          <div>VIBRATION: <span className="text-amber-400 font-bold">{(tags['CR-CR-VIB'] || 2.4).toFixed(2)} mm/s</span></div>
          <div>BAG FILTER dP: <span className="text-purple-400 font-bold">{(tags['CR-DC-DP'] || 115).toFixed(0)} mmWC</span></div>
        </div>
      </div>

      {/* SVG SCHEMATIC - REAL PLANT WORKING PARTS */}
      <svg className="w-full h-full" viewBox="0 0 1600 780" preserveAspectRatio="xMidYMid meet">
        
        {/* INTERCONNECTING CONVEYOR BELTS & CHUTES */}
        {/* 1. Crusher Discharge Chute to BC-101 */}
        <IndustrialPipe d="M 600 520 L 600 590 L 980 590" media="RAW_MEAL" strokeWidth="12" />
        {/* 2. Dust Extraction Ducts to Bag Filter */}
        <IndustrialPipe d="M 600 370 L 600 310 L 1150 310 L 1150 360" media="EXHAUST" strokeWidth="8" />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 1. QUARRY HAUL TRUCK TIPPING RAMP & DUMP HOPPER */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <g transform="translate(120, 100)">
          {/* Tipping ramp road */}
          <polygon points="-80,70 0,70 60,110 -80,110" fill="#334155" stroke="#475569" />
          <line x1="-80" y1="70" x2="0" y2="70" stroke="#facc15" strokeWidth="2" strokeDasharray="6 4" />
          
          {/* Quarry 50-ton Dump Truck illustration */}
          <g transform="translate(-60, 20)">
            <rect x="0" y="20" width="35" height="25" fill="#eab308" stroke="#0f172a" rx="2" />
            <polygon points="35,45 35,28 48,35 48,45" fill="#ca8a04" stroke="#0f172a" />
            {/* Tipped Dump Bed */}
            <polygon points="0,20 30,5 34,22 4,37" fill="#ca8a04" stroke="#0f172a" />
            <circle cx="10" cy="45" r="7" fill="#0f172a" />
            <circle cx="40" cy="45" r="7" fill="#0f172a" />
            {/* Rock boulder falling */}
            <circle cx="36" cy="35" r="5" fill="#64748b" />
            <circle cx="44" cy="42" r="4" fill="#94a3b8" />
          </g>

          {/* Heavy Dump Hopper (120 ton capacity) */}
          <polygon points="40,90 180,90 160,190 60,190" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
          {/* Material Level in Hopper */}
          <g transform="translate(60, 140)">
            <polygon points="-10,0 90,0 80,50 0,50" fill="#475569" opacity="0.8" />
            {/* Boulders */}
            <circle cx="20" cy="15" r="8" fill="#64748b" />
            <circle cx="45" cy="25" r="10" fill="#64748b" />
            <circle cx="70" cy="18" r="7" fill="#94a3b8" />
          </g>

          {/* Hydraulic Rock Breaker Boom (Pedestal Mounted) */}
          <g transform="translate(195, 80)">
            <rect x="-8" y="0" width="16" height="20" fill="#334155" stroke="#94a3b8" rx="2" />
            {/* Articulating boom arms */}
            <line x1="0" y1="0" x2="-45" y2="40" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
            <circle cx="-45" cy="40" r="4" fill="#0f172a" />
            <line x1="-45" y1="40" x2="-65" y2="85" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
            {/* Hydraulic Hammer Chisel */}
            <polygon points="-65,85 -60,105 -70,105" fill="#475569" stroke="#0f172a" />
            <text x="0" y="-8" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">HYD ROCK BREAKER</text>
          </g>

          <text x="110" y="210" fill="#cbd5e1" fontSize="11" fontWeight="extrabold" textAnchor="middle">
            DUMP HOPPER (CR-HOP-01)
          </text>
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 2. HEAVY DUTY APRON FEEDER (CR-AF-01) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <ApronFeederUnit 
          id="CR-AF-01" 
          x={180} 
          y={310} 
          scale={1.2} 
          onClick={handleEqClick} 
        />

        {/* Vibrating Grizzly Screen (Scalper) under Apron Feeder */}
        <g transform="translate(470, 340)">
          <polygon points="0,0 80,40 75,55 -5,15" fill="#334155" stroke="#64748b" strokeWidth="2" />
          {/* Grizzly bars */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={10 + i * 14} y1={5 + i * 7} x2={10 + i * 14} y2={25 + i * 7} stroke="#94a3b8" strokeWidth="2" />
          ))}
          <text x="40" y="-8" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">GRIZZLY SCALPER</text>
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 3. PRIMARY IMPACT HAMMER CRUSHER (CR-CR-01) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <ImpactCrusherUnit 
          id="CR-CR-01" 
          x={600} 
          y={440} 
          scale={1.15} 
          onClick={handleEqClick} 
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 4. DISCHARGE BELT CONVEYOR & WEIGHOMETER */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <g transform="translate(680, 580)">
          {/* Belt scale / weighometer load cell */}
          <rect x="80" y="-12" width="40" height="24" fill="#0f172a" stroke="#00d4ff" strokeWidth="1.5" rx="2" />
          <text x="100" y="2" fill="#00d4ff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            BELT SCALE
          </text>
          <text x="100" y="10" fill="#00ff00" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            {(tags['CR-AF-FEED'] || 480).toFixed(0)} t/h
          </text>

          {/* Overband Tramp Metal Electromagnetic Separator */}
          <g transform="translate(180, -35)">
            <rect x="0" y="0" width="50" height="28" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="2" />
            <circle cx="10" cy="14" r="7" fill="#334155" />
            <circle cx="40" cy="14" r="7" fill="#334155" />
            <text x="25" y="18" fill="#facc15" fontSize="7" fontWeight="extrabold" textAnchor="middle">MAGNET</text>
            {/* Magnetic field lines */}
            <line x1="25" y1="28" x2="25" y2="40" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
          </g>

          {/* Cross-Belt PGNAA Online Elemental Analyzer (XRF Analyzer) */}
          <g transform="translate(260, -35)">
            <rect x="0" y="0" width="65" height="42" fill="#0b1320" stroke="#a855f7" strokeWidth="2" rx="3" />
            <text x="32" y="12" fill="#c084fc" fontSize="8" fontWeight="bold" textAnchor="middle">PGNAA ANALYZER</text>
            <text x="32" y="24" fill="#00ff00" fontSize="8" fontFamily="monospace" textAnchor="middle">
              LSF: 96.8
            </text>
            <text x="32" y="34" fill="#cbd5e1" fontSize="7" fontFamily="monospace" textAnchor="middle">
              Ca 44.2 | Si 13.5
            </text>
          </g>

          <text x="200" y="45" fill="#f8fafc" fontSize="11" fontWeight="extrabold" textAnchor="middle">
            MAIN DISCHARGE BELT CONVEYOR (CR-BC-101)
          </text>
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 5. DUST COLLECTION PULSE-JET BAGHOUSE (CR-DC-01) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <PulseJetBaghouseUnit 
          id="CR-DC-01" 
          x={1100} 
          y={200} 
          scale={0.9} 
        />

        {/* Baghouse Exhaust Fan & Chimney Stack */}
        <g transform="translate(1320, 260)">
          {/* Fan */}
          <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <circle cx="0" cy="0" r="8" fill="#10b981" />
          {/* Chimney Stack */}
          <polygon points="40,20 65,20 60,-120 45,-120" fill="#334155" stroke="#475569" strokeWidth="2" />
          {/* Clean air plume */}
          <path d="M 52 -120 Q 60 -150 75 -180" stroke="#cbd5e1" strokeWidth="8" fill="none" opacity="0.4" strokeLinecap="round" />
          <text x="52" y="35" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">DC STACK</text>
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 6. REAL-TIME ISA INSTRUMENTATION BUBBLE TAGS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* Hopper Level Radar */}
        <ISAInstrumentTag tag="CR-HOP-LVL" isaCode="LI" unit="%" x={170} y={150} />
        {/* Apron Feeder Feed Rate */}
        <ISAInstrumentTag tag="CR-AF-FEED" isaCode="WI" unit="t/h" x={380} y={300} />
        {/* Crusher Motor Active Power */}
        <ISAInstrumentTag tag="CR-CR-PWR" isaCode="II" unit="kW" x={730} y={390} />
        {/* Crusher Rotor Vibration */}
        <ISAInstrumentTag tag="CR-CR-VIB" isaCode="VI" unit="mm/s" x={730} y={470} />
        {/* Baghouse Differential Pressure */}
        <ISAInstrumentTag tag="CR-DC-DP" isaCode="PI" unit="mmWC" x={1260} y={230} />
        {/* Cross-Belt Elemental LSF */}
        <ISAInstrumentTag tag="CR-XRF-LSF" isaCode="AI" unit="LSF" x={1020} y={510} />

      </svg>

      {/* QUICK STATUS OVERLAY CARDS */}
      <div className="absolute bottom-3 left-4 flex gap-3">
        <div className="bg-[#0f172a]/95 border border-gray-700 p-2.5 rounded-lg text-xs font-mono">
          <div className="text-[10px] text-gray-400 uppercase font-bold font-sans">LUBRICATION STATION</div>
          <div className="flex gap-4 mt-1">
            <span>HEADER PR: <span className="text-[#00ff00] font-bold">{(tags['CR-CR-LUBE-PR'] || 3.8).toFixed(1)} bar</span></span>
            <span>DE TEMP: <span className="text-white">{(tags['CR-CR-DE-TEMP'] || 58.2).toFixed(1)}°C</span></span>
            <span>NDE TEMP: <span className="text-white">{(tags['CR-CR-NDE-TEMP'] || 56.4).toFixed(1)}°C</span></span>
          </div>
        </div>

        <div className="bg-[#0f172a]/95 border border-gray-700 p-2.5 rounded-lg text-xs font-mono">
          <div className="text-[10px] text-gray-400 uppercase font-bold font-sans">HYDRAULIC CSS GAP</div>
          <div className="flex gap-4 mt-1">
            <span>SETTING: <span className="text-cyan-400 font-bold">28.5 mm</span></span>
            <span>CYLINDER PR: <span className="text-white">142 bar</span></span>
            <span>SAFETY RELIEF: <span className="text-[#00ff00]">ARMED</span></span>
          </div>
        </div>
      </div>

    </div>
  );
};
