import React from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { 
  BallMillUnit, PulseJetBaghouseUnit, CentrifugalFanUnit, 
  ReinforcedSiloUnit, IndustrialPipe, ISAInstrumentTag 
} from '../../components/scada/Equipment/IndustrialPlantComponents';

interface ScreenProps {
  onOpenFaceplate?: (eqId: string) => void;
}

export const CementMillScreen: React.FC<ScreenProps> = ({ onOpenFaceplate }) => {
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
              AREA-600
            </span>
            <span className="text-sm font-extrabold text-white">CEMENT FINISH GRINDING: TWO-COMPARTMENT BALL MILL & O-SEPA</span>
          </div>
          <span className="text-gray-400 font-mono text-[11px]">Ø 3.8m × 12m • 4,800 kW DRIVE • HYDRODYNAMIC SLIDE SHOE BEARINGS</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <div>TOTAL FEED: <span className="text-[#00ff00] font-bold">{(tags['CM2-FEED-TOT'] || 195).toFixed(0)} t/h</span></div>
          <div>MILL POWER: <span className="text-[#00d4ff] font-bold">{(tags['CM2-PWR'] || 4280).toFixed(0)} kW</span></div>
          <div>BLAINE FINENESS: <span className="text-amber-400 font-bold">{(tags['CM2-BLAINE'] || 385).toFixed(0)} m²/kg</span></div>
          <div>JACKING OIL PR: <span className="text-cyan-400 font-bold">{(tags['CM2-JACKING-PR'] || 118).toFixed(0)} bar</span></div>
          <div>O-SEPA SPEED: <span className="text-white font-bold">{(tags['CM2-SEP-SPD'] || 245).toFixed(0)} RPM</span></div>
        </div>
      </div>

      {/* SVG SCHEMATIC - REAL CEMENT MILL PLANT WORKING PARTS */}
      <svg className="w-full h-full" viewBox="0 0 1600 780" preserveAspectRatio="xMidYMid meet">
        
        {/* MATERIAL FLOW PIPES & DUCTING */}
        {/* Mill Discharge & Pneumatic Lift to O-Sepa Separator */}
        <IndustrialPipe d="M 670 410 L 730 410 L 730 200 L 780 200" media="RAW_MEAL" strokeWidth="14" />
        
        {/* O-Sepa Rejects Chute returning coarse particles to Chamber 1 */}
        <IndustrialPipe d="M 820 280 L 820 330 L 400 330 L 400 380" media="RAW_MEAL" strokeWidth="8" />
        <text x="610" y="322" fill="#facc15" fontSize="8" fontWeight="bold">REJECTS RETURN AIR SLIDE</text>

        {/* Finished Cement to Bag Filter & Transport Air Slides */}
        <IndustrialPipe d="M 870 190 L 980 190 L 980 240" media="RAW_MEAL" strokeWidth="12" />

        {/* Finished Cement to Storage Silos */}
        <IndustrialPipe d="M 1040 450 L 1260 450 L 1260 210 L 1320 210" media="RAW_MEAL" strokeWidth="12" />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 1. CLINKER, GYPSUM & FLYASH PROPORTIONING FEEDERS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <g transform="translate(60, 110)">
          {[
            { name: 'CLINKER (75%)', val: (tags['CM2-FEED-CLINKER'] || 148), tag: 'CM2-FEED-CLINKER', color: '#d97706' },
            { name: 'GYPSUM (5%)', val: (tags['CM2-FEED-GYPSUM'] || 8.2), tag: 'CM2-FEED-GYPSUM', color: '#cbd5e1' },
            { name: 'FLYASH (20%)', val: (tags['CM2-FEED-FLYASH'] || 38.8), tag: 'CM2-FEED-FLYASH', color: '#94a3b8' },
          ].map((h, i) => (
            <g key={i} transform={`translate(${i * 85}, 0)`}>
              <polygon points="0,0 75,0 60,60 15,60" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <rect x="0" y="-16" width="75" height="16" fill="#334155" />
              <text x="37" y="-5" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">{h.name}</text>
              
              <rect x="8" y="60" width="58" height="24" fill="#0f172a" stroke="#00d4ff" rx="2" />
              <text x="37" y="76" fill="#00ff00" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {h.val.toFixed(1)} t/h
              </text>
            </g>
          ))}

          {/* Collection Conveyor Belt into Mill */}
          <rect x="-10" y="94" width="270" height="12" fill="#1e293b" stroke="#334155" rx="2" />
          <path d="M 0 100 L 250 100" stroke="#00ff00" strokeWidth="3" strokeDasharray="8 6">
            <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.8s" repeatCount="indefinite" />
          </path>
          <line x1="250" y1="100" x2="330" y2="280" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round" />
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 2. TWO-COMPARTMENT BALL MILL ASSEMBLY (CM2-MILL-01) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <BallMillUnit 
          id="CM2-MILL-01" 
          x={390} 
          y={410} 
          scale={1.2} 
          onClick={handleEqClick} 
        />

        {/* High-Pressure Hydrodynamic Jacking Oil Unit */}
        <g transform="translate(380, 560)">
          <rect x="0" y="0" width="130" height="42" fill="#0b1320" stroke="#0284c7" strokeWidth="2" rx="3" />
          <text x="65" y="15" fill="#38bdf8" fontSize="8" fontWeight="extrabold" textAnchor="middle">
            JACKING PUMP (120 BAR)
          </text>
          <text x="65" y="30" fill="#00ff00" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            {(tags['CM2-JACKING-PR'] || 118).toFixed(0)} BAR • 48.5°C
          </text>
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 3. DYNAMIC O-SEPA SEPARATOR CLASSIFIER */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <g transform="translate(780, 150)">
          <polygon points="0,0 90,0 75,70 15,70" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <rect x="15" y="15" width="60" height="35" fill="#0f172a" stroke="#00d4ff" strokeWidth="1.5" rx="2" />
          {/* Guide vanes */}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={i} x1={22 + i * 7.5} y1="18" x2={22 + i * 7.5} y2="46" stroke="#38bdf8" strokeWidth="2" />
          ))}
          {/* VFD Motor */}
          <rect x="30" y="-20" width="30" height="20" fill="#334155" stroke="#64748b" rx="2" />
          <circle cx="45" cy="-10" r="7" fill="#10b981" />
          <text x="45" y="-7" fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle">SEP</text>
          
          <text x="45" y="90" fill="#f8fafc" fontSize="10" fontWeight="extrabold" textAnchor="middle">
            O-SEPA SEPARATOR
          </text>
          <text x="45" y="102" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
            {(tags['CM2-SEP-SPD'] || 245).toFixed(0)} RPM • 250 kW
          </text>
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 4. PROCESS PULSE-JET BAG FILTER & ID FAN */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <PulseJetBaghouseUnit 
          id="CM2-DC-01" 
          x={940} 
          y={220} 
          scale={1.0} 
        />

        <CentrifugalFanUnit 
          id="CM2-FAN-01" 
          x={1160} 
          y={440} 
          scale={1.1} 
          onClick={handleEqClick} 
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 5. CEMENT STORAGE SILOS (SILO 1 & 2) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <ReinforcedSiloUnit 
          x={1340} 
          y={190} 
          width={110} 
          height={330} 
          tagLvl="CM2-SILO1-LVL" 
          name="SILO 1 (OPC 53)" 
          material="OPC CEMENT" 
        />

        <ReinforcedSiloUnit 
          x={1470} 
          y={190} 
          width={110} 
          height={330} 
          tagLvl="CM2-SILO2-LVL" 
          name="SILO 2 (PPC)" 
          material="PPC CEMENT" 
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 6. REAL-TIME ISA INSTRUMENTATION BUBBLE TAGS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <ISAInstrumentTag tag="CM2-PWR" isaCode="II" unit="kW" x={570} y={490} />
        <ISAInstrumentTag tag="CM2-JACKING-PR" isaCode="PI" unit="bar" x={350} y={350} />
        <ISAInstrumentTag tag="CM2-OUT-TEMP" isaCode="TI" unit="°C" x={710} y={360} />
        <ISAInstrumentTag tag="CM2-BLAINE" isaCode="AI" unit="m²/kg" x={890} y={130} />
        <ISAInstrumentTag tag="CM2-SEP-SPD" isaCode="SI" unit="RPM" x={750} y={100} />
        <ISAInstrumentTag tag="CM2-FAN-PWR" isaCode="II" unit="kW" x={1280} y={400} />

      </svg>

      {/* QUICK STATUS OVERLAY CARDS */}
      <div className="absolute bottom-3 left-4 flex gap-3">
        <div className="bg-[#0f172a]/95 border border-gray-700 p-2.5 rounded-lg text-xs font-mono">
          <div className="text-[10px] text-gray-400 uppercase font-bold font-sans">BALL CHARGE & SOUND LEVEL</div>
          <div className="flex gap-4 mt-1">
            <span>CH1 FILLING DEGREE: <span className="text-[#00ff00] font-bold">29.5 %</span></span>
            <span>CH2 FILLING DEGREE: <span className="text-[#00ff00] font-bold">31.2 %</span></span>
            <span>ELECTRONIC EAR (SOUND): <span className="text-cyan-400">76 dB</span></span>
          </div>
        </div>

        <div className="bg-[#0f172a]/95 border border-gray-700 p-2.5 rounded-lg text-xs font-mono">
          <div className="text-[10px] text-gray-400 uppercase font-bold font-sans">PRODUCT QUALITY & FINENESS</div>
          <div className="flex gap-4 mt-1">
            <span>BLAINE: <span className="text-[#00ff00] font-bold">{(tags['CM2-BLAINE'] || 385).toFixed(0)} m²/kg</span></span>
            <span>RESIDUE &gt; 45µm: <span className="text-white">6.2 %</span></span>
            <span>1-DAY STRENGTH: <span className="text-emerald-400 font-bold">24.5 MPa</span></span>
          </div>
        </div>
      </div>

    </div>
  );
};
