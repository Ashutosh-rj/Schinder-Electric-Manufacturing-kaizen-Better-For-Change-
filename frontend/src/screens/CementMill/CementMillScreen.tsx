import React from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { scadaAudio } from '../../engine/scadaAudio';
import { 
  Factory, Zap, Gauge, Sliders, Activity, 
  ArrowRight, ShieldCheck, AlertCircle 
} from 'lucide-react';

interface ScreenProps {
  onOpenFaceplate?: (eqId: string) => void;
}

export const CementMillScreen: React.FC<ScreenProps> = ({ onOpenFaceplate }) => {
  const tags = useScadaStore((s) => s.tags);
  const equipment = useScadaStore((s) => s.equipment);
  const activeScenario = useScadaStore((s) => s.activeScenario);

  const handleEqClick = (id: string) => {
    scadaAudio.playClick();
    if (onOpenFaceplate) onOpenFaceplate(id);
  };

  const isMillOverload = activeScenario === 'MILL_OVERLOAD';

  // Live telemetry matching cement mill reference
  const totFeed = tags['CM2-FEED-TOT'] || 195.0;
  const millPwr = tags['CM2-PWR'] || 4280;
  const millCur = tags['CM2-CUR'] || 418;
  const blaine = tags['CM2-BLAINE'] || 385;
  const jackingPr = tags['CM2-JACKING-PR'] || 118;
  const sepSpd = tags['CM2-SEP-SPD'] || 245;
  const sepPwr = tags['CM2-SEP-PWR'] || 185;
  const fanSpd = tags['CM2-FAN-SPD'] || 980;
  const fanPwr = tags['CM2-FAN-PWR'] || 1650;
  const millEar = tags['CM2-MILL-EAR'] ?? (isMillOverload ? 42 : 80.6);

  const clkFeed = tags['CM2-FEED-CLINKER'] || 148.0;
  const gypFeed = tags['CM2-FEED-GYPSUM'] || 8.2;
  const flyFeed = tags['CM2-FEED-FLYASH'] || 38.8;

  return (
    <div className="w-full h-full flex flex-col bg-[#0b1320] text-white overflow-hidden select-none font-sans">
      
      {/* ── HEADER BANNER ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-2 bg-[#060a12] border-b border-gray-800 text-xs">
        <div>
          <h1 className="text-lg font-black tracking-wide text-white flex items-center gap-2">
            CEMENT MILL - 1 & O-SEPA SEPARATOR
          </h1>
          <div className="text-[11px] font-bold text-cyan-400 tracking-wider">
            CLOSED-CIRCUIT TWO-COMPARTMENT BALL MILL FINISH GRINDING
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-[#111927] border border-gray-700/80 px-3 py-1 rounded flex items-center gap-2">
            <span className="text-gray-400">TOTAL FEED:</span>
            <span className="text-[#00ff00] font-bold">{totFeed.toFixed(1)} TPH</span>
          </div>
          <div className="bg-[#111927] border border-gray-700/80 px-3 py-1 rounded flex items-center gap-2">
            <span className="text-gray-400">MILL POWER:</span>
            <span className="text-cyan-400 font-bold">{millPwr.toFixed(0)} KW</span>
          </div>
          <div className="bg-[#111927] border border-gray-700/80 px-3 py-1 rounded flex items-center gap-2">
            <span className="text-gray-400">MILL EAR:</span>
            <span className={`font-bold ${isMillOverload ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {millEar.toFixed(1)} %
            </span>
          </div>
          <div className="bg-[#111927] border border-gray-700/80 px-3 py-1 rounded flex items-center gap-2">
            <span className="text-gray-400">BLAINE:</span>
            <span className="text-purple-400 font-bold">{blaine.toFixed(0)} m²/kg</span>
          </div>
        </div>
      </div>

      {/* ── MAIN DCS SCHEMATIC (1600x680) ───────────────────────────── */}
      <div className="flex-1 relative w-full h-full bg-[#0d1627] overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1600 680" preserveAspectRatio="xMidYMid meet">
          
          <defs>
            {/* Tube Mill Cylinder Gradients */}
            <linearGradient id="mill-shell-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="30%" stopColor="#64748b" />
              <stop offset="70%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="mill-glow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* MATERIAL PIPES & SLIDES                                     */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* Mill discharge to bucket elevator & O-Sepa */}
          <path d="M 680 430 L 730 430 L 730 180 L 800 180" fill="none" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
          
          {/* O-Sepa reject coarse return air slide back to Mill Inlet */}
          <path d="M 850 250 L 850 320 L 320 320 L 320 400 L 340 400" fill="none" stroke="#eab308" strokeWidth="8" strokeDasharray="6 4" />
          <text x="560" y="312" fill="#facc15" fontSize="8" fontWeight="bold">REJECTS RETURN AIR SLIDE</text>

          {/* O-Sepa fines to Baghouse */}
          <path d="M 910 170 L 1020 170 L 1020 220" fill="none" stroke="#94a3b8" strokeWidth="12" />

          {/* Finished cement to Silos */}
          <path d="M 1120 420 L 1260 420 L 1260 210 L 1320 210" fill="none" stroke="#00ff00" strokeWidth="10" strokeDasharray="8 6" />

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 1. RAW MATERIAL FEED HOPPERS (CLINKER, GYPSUM, FLYASH)      */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g transform="translate(60, 60)">
            {[
              { title: 'CLINKER', sp: '59.0 %', mv: `${clkFeed.toFixed(1)} TPH`, tag: 'Z1C01', color: '#d97706' },
              { title: 'LIME STONE', sp: '0.0 %', mv: '0.0 TPH', tag: 'Z1A01', color: '#94a3b8' },
              { title: 'FLYASH', sp: '35.0 %', mv: `${flyFeed.toFixed(1)} TPH`, tag: 'D1L70', color: '#38bdf8' },
              { title: 'N.GYP', sp: '6.0 %', mv: `${gypFeed.toFixed(1)} TPH`, tag: 'Z1B01', color: '#cbd5e1' },
            ].map((h, i) => (
              <g key={i} transform={`translate(${i * 65}, 0)`}>
                {/* Hopper Cone */}
                <polygon points="0,0 55,0 42,65 13,65" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <rect x="0" y="-18" width="55" height="18" fill="#334155" />
                <text x="27" y="-6" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">{h.title}</text>

                {/* Weigh feeder belt */}
                <rect x="5" y="65" width="45" height="16" fill="#0f172a" stroke="#64748b" rx="2" />
                <circle cx="10" cy="73" r="5" fill="#10b981" />
                <circle cx="45" cy="73" r="5" fill="#10b981" />

                {/* Feed Table Box below */}
                <g transform="translate(-2, 90)">
                  <rect x="0" y="0" width="60" height="38" rx="2" fill="#090f1d" stroke="#334155" />
                  <g transform="translate(4, 11)" className="text-[7px] font-mono">
                    <text x="0" y="0" fill="#94a3b8">SP:</text><text x="52" y="0" fill="#00d4ff" textAnchor="end">{h.sp}</text>
                    <text x="0" y="11" fill="#94a3b8">MV:</text><text x="52" y="11" fill="#00ff00" fontWeight="bold" textAnchor="end">{h.mv}</text>
                    <text x="0" y="22" fill="#94a3b8">TAG:</text><text x="52" y="22" fill="#ffffff" textAnchor="end">{h.tag}</text>
                  </g>
                </g>
              </g>
            ))}

            {/* Common Gathering Conveyor Belt */}
            <g transform="translate(0, 200)">
              <line x1="0" y1="0" x2="270" y2="0" stroke="#475569" strokeWidth="8" />
              <path d="M 5 -4 L 265 -4" stroke="#94a3b8" strokeWidth="4" strokeDasharray="6 4">
                <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />
              </path>
              <circle cx="270" cy="0" r="10" fill="#10b981" />
              <text x="135" y="-12" fill="#00d4ff" fontSize="8" fontWeight="bold" textAnchor="middle">
                MAIN FEED BELT →
              </text>
              {/* Chute down to Mill Trunnion */}
              <line x1="270" y1="0" x2="310" y2="180" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
            </g>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 2. TWO-COMPARTMENT TUBE BALL MILL (CEMENT MILL - 1)          */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(370, 370)" 
            className="cursor-pointer group"
            onClick={() => handleEqClick('CM2-MILL-01')}
          >
            {/* Trunnion Bearings (Inlet & Outlet) */}
            <rect x="-30" y="40" width="30" height="40" fill="#475569" stroke="#1e293b" rx="3" />
            <rect x="310" y="40" width="30" height="40" fill="#475569" stroke="#1e293b" rx="3" />

            {/* Main Mill Cylindrical Shell */}
            <rect x="0" y="0" width="310" height="120" rx="12" fill="url(#mill-shell-grad)" stroke="#64748b" strokeWidth="3" />
            <rect x="0" y="0" width="310" height="120" rx="12" fill="url(#mill-glow)" />

            {/* Diaphragm Division Wall separating Chamber 1 and Chamber 2 */}
            <line x1="120" y1="0" x2="120" y2="120" stroke="#0f172a" strokeWidth="5" />
            <line x1="120" y1="0" x2="120" y2="120" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />

            {/* Chamber 1 Grinding Media (Large Steel Balls) */}
            {Array.from({ length: 12 }).map((_, i) => (
              <circle key={i} cx={25 + (i % 4) * 25} cy={35 + Math.floor(i / 4) * 25} r="7" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
            ))}
            <text x="60" y="105" fill="#cbd5e1" fontSize="9" fontWeight="extrabold" textAnchor="middle">CHAMBER 1</text>
            <text x="60" y="114" fill="#94a3b8" fontSize="7" textAnchor="middle">Coarse Media 60-90mm</text>

            {/* Chamber 2 Grinding Media (Small Cylpebs) */}
            {Array.from({ length: 24 }).map((_, i) => (
              <circle key={i} cx={145 + (i % 6) * 25} cy={30 + Math.floor(i / 6) * 18} r="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
            ))}
            <text x="215" y="105" fill="#cbd5e1" fontSize="9" fontWeight="extrabold" textAnchor="middle">CHAMBER 2</text>
            <text x="215" y="114" fill="#94a3b8" fontSize="7" textAnchor="middle">Fine Media 20-40mm</text>

            {/* Mill Label & Acoustic Ear Level */}
            <g transform="translate(155, -20)">
              <rect x="-80" y="0" width="160" height="24" rx="4" fill="#090f1d" stroke="#00ff00" strokeWidth="1.5" />
              <text x="0" y="16" fill="#ffffff" fontSize="11" fontWeight="black" textAnchor="middle">CEMENT MILL - 1</text>
            </g>

            {/* Mill Ear Sound Sensor Tag */}
            <g transform="translate(50, 135)">
              <rect x="0" y="0" width="100" height="30" rx="3" fill="#090f1d" stroke="#38bdf8" />
              <text x="8" y="12" fill="#94a3b8" fontSize="7" fontWeight="bold">MILL EAR ACOUSTIC</text>
              <text x="8" y="24" fill={isMillOverload ? '#ef4444' : '#00ff00'} fontSize="11" fontWeight="black" fontFamily="monospace">
                {millEar.toFixed(1)} % <tspan fill="#64748b" fontSize="8">{isMillOverload ? 'CHOKED' : 'NORMAL'}</tspan>
              </text>
            </g>

            {/* Main Motor & Girth Gear Drive */}
            <g transform="translate(180, 135)">
              <rect x="0" y="0" width="125" height="42" rx="3" fill="#090f1d" stroke="#334155" />
              <g transform="translate(6, 12)" className="text-[8px] font-mono">
                <text x="0" y="0" fill="#94a3b8">MAIN MOTOR:</text><text x="110" y="0" fill="#00ff00" fontWeight="bold" textAnchor="end">{millPwr.toFixed(0)} KW</text>
                <text x="0" y="11" fill="#94a3b8">CURRENT:</text><text x="110" y="11" fill="#00ff00" textAnchor="end">{millCur.toFixed(0)} A</text>
                <text x="0" y="22" fill="#94a3b8">JACKING PR:</text><text x="110" y="22" fill="#00d4ff" textAnchor="end">{jackingPr.toFixed(0)} BAR</text>
              </g>
            </g>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 3. DYNAMIC SEPARATOR (O-SEPA)                               */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(850, 140)" 
            className="cursor-pointer group"
            onClick={() => handleEqClick('CM2-SEP-01')}
          >
            {/* O-Sepa Classifier Cone & Rotor */}
            <polygon points="-30,0 30,0 20,70 -20,70" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="-20,70 20,70 0,110" fill="#334155" stroke="#64748b" />
            
            {/* Spinning cage rotor lines */}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={i} x1={-18 + i * 7} y1="10" x2={-18 + i * 7} y2="60" stroke="#38bdf8" strokeWidth="1.5" />
            ))}

            {/* Separator Drive Motor on top */}
            <rect x="-15" y="-30" width="30" height="30" rx="3" fill="#10b981" stroke="#047857" />
            <text x="0" y="-12" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">M</text>

            <text x="0" y="-36" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">O-SEPA SEPARATOR</text>

            {/* Separator Data Box */}
            <g transform="translate(40, -10)">
              <rect x="0" y="0" width="105" height="48" rx="3" fill="#090f1d" stroke="#334155" />
              <g transform="translate(6, 13)" className="text-[8px] font-mono">
                <text x="0" y="0" fill="#94a3b8">ROTOR SPEED:</text><text x="92" y="0" fill="#00ff00" textAnchor="end">{sepSpd.toFixed(0)} RPM</text>
                <text x="0" y="12" fill="#94a3b8">POWER:</text><text x="92" y="12" fill="#00ff00" textAnchor="end">{sepPwr.toFixed(0)} KW</text>
                <text x="0" y="24" fill="#94a3b8">FINENESS:</text><text x="92" y="24" fill="#00d4ff" textAnchor="end">{blaine.toFixed(0)} m²/kg</text>
              </g>
            </g>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 4. PULSE-JET BAG FILTER & MILL ID FAN                       */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g transform="translate(1040, 200)">
            <rect x="0" y="0" width="110" height="70" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <polygon points="10,70 100,70 55,110" fill="#334155" stroke="#475569" />
            <text x="55" y="-8" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">BAG FILTER</text>
            <text x="55" y="25" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">74.7 mmWC</text>

            {/* Extraction Fan */}
            <g transform="translate(140, 35)">
              <circle cx="0" cy="0" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="0" cy="0" r="7" fill="#10b981" />
              <text x="0" y="-24" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">MILL ID FAN</text>
              <g transform="translate(-40, 26)">
                <rect x="0" y="0" width="85" height="26" rx="2" fill="#090f1d" stroke="#334155" />
                <text x="42" y="10" fill="#94a3b8" fontSize="7" textAnchor="middle">SPEED: <tspan fill="#00ff00">{fanSpd.toFixed(0)} RPM</tspan></text>
                <text x="42" y="20" fill="#94a3b8" fontSize="7" textAnchor="middle">POWER: <tspan fill="#00ff00">{fanPwr.toFixed(0)} KW</tspan></text>
              </g>
            </g>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 5. CEMENT SILOS WITH RADAR LEVELS                           */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g transform="translate(1330, 180)">
            <text x="75" y="-12" fill="#ffffff" fontSize="9" fontWeight="extrabold" textAnchor="middle">CEMENT STORAGE SILOS</text>

            {[
              { id: '1', level: '19.3 MTR', stock: '6,944 T', pct: 82 },
              { id: '2', level: '15.5 MTR', stock: '5,530 T', pct: 65 },
            ].map((s, idx) => (
              <g key={idx} transform={`translate(${idx * 75}, 0)`}>
                {/* Silo body */}
                <rect x="0" y="0" width="65" height="110" fill="#1e293b" stroke="#64748b" strokeWidth="2" rx="3" />
                <polygon points="0,110 65,110 45,140 20,140" fill="#334155" stroke="#475569" />
                
                {/* Material level fill */}
                <rect 
                  x="3" 
                  y={107 - (s.pct * 1.0)} 
                  width="59" 
                  height={s.pct * 1.0} 
                  fill="#059669" 
                  opacity="0.8" 
                />

                <text x="32" y="45" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">SILO {s.id}</text>
                <text x="32" y="60" fill="#34d399" fontSize="9" fontWeight="black" textAnchor="middle">{s.level}</text>
                <text x="32" y="75" fill="#e2e8f0" fontSize="7" textAnchor="middle">{s.stock}</text>
              </g>
            ))}
          </g>

        </svg>
      </div>

      {/* ── BOTTOM OPERATOR METRICS BAR ────────────────────────────── */}
      <div className="h-16 bg-[#070b14] border-t border-gray-800 flex items-center justify-between px-6 text-xs">
        <div className="flex items-center gap-6">
          <div><span className="text-gray-400">CM1 MAIN MOTOR:</span> <span className="text-[#00ff00] font-bold">22h 53m RUNNING</span></div>
          <div><span className="text-gray-400">CLINKER WEIGH FEEDER:</span> <span className="text-white font-bold">{clkFeed.toFixed(1)} TPH</span></div>
          <div><span className="text-gray-400">CTPT ELEVATOR:</span> <span className="text-[#00ff00] font-bold">OK (HEALTHY)</span></div>
        </div>
        <div className="flex items-center gap-4 font-mono">
          <div>TODAY PROD: <span className="text-[#00ff00] font-bold">4,680 T</span></div>
          <div>SPECIFIC POWER: <span className="text-cyan-400 font-bold">28.1 kWh/t</span></div>
        </div>
      </div>

    </div>
  );
};
