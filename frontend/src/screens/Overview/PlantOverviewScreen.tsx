import React, { useState } from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { scadaAudio } from '../../engine/scadaAudio';
import { 
  Factory, Zap, Flame, Activity, ArrowRight, 
  Layers, Gauge, ShieldAlert, Cpu, Eye, Volume2, VolumeX,
  AlertTriangle, CheckCircle2, RotateCcw, Compass, Crosshair,
  TrendingUp, Sliders, ExternalLink, RefreshCw
} from 'lucide-react';
import { 
  ImpactCrusherUnit,
  ApronFeederUnit,
  VerticalRollerMillUnit,
  RotaryKilnUnit,
  PreheaterTowerUnit,
  GrateCoolerUnit,
  BallMillUnit,
  PulseJetBaghouseUnit,
  CentrifugalFanUnit,
  ReinforcedSiloUnit,
  IndustrialPipe,
  ISAInstrumentTag
} from '../../components/scada/Equipment/IndustrialPlantComponents';

interface OverviewProps {
  onNavigateArea?: (area: string) => void;
  onOpenFaceplate?: (eqId: string) => void;
}

export const PlantOverviewScreen: React.FC<OverviewProps> = ({ onNavigateArea, onOpenFaceplate }) => {
  const [viewMode, setViewMode] = useState<'3D' | 'SCHEMATIC'>('3D');
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const tags = useScadaStore((s) => s.tags);
  const equipment = useScadaStore((s) => s.equipment);
  const isAudioEnabled = useScadaStore((s) => s.isAudioEnabled);
  const toggleAudio = useScadaStore((s) => s.toggleAudio);
  const activeScenario = useScadaStore((s) => s.activeScenario);
  const triggerScenario = useScadaStore((s) => s.triggerScenario);
  const resetScenario = useScadaStore((s) => s.resetScenario);

  const getStatus = (id: string) => equipment[id]?.status || 'RUNNING';

  const handleAreaClick = (areaCode: string) => {
    scadaAudio.playClick();
    if (onNavigateArea) {
      onNavigateArea(areaCode);
    }
  };

  // Live dynamic telemetry variables
  const plantPower = ((tags['PLANT-TOTAL-POWER'] || 18400) / 1000).toFixed(1);
  const clinkerProd = (tags['KLN1-CLINKER-PROD'] || 285.3).toFixed(1);
  const plantSec = (tags['PLANT-SEC-KWH'] || 64.2).toFixed(1);
  const whrsMw = (tags['WHRS-TURBINE-MW'] || 4.2).toFixed(2);
  const bzTemp = (tags['KLN1-BZ-TEMP'] || 1448).toFixed(0);
  const cementTph = (tags['CM2-FEED-TOT'] || 312.5).toFixed(1);

  const crusherFeed = (tags['CR-AF-FEED'] || 430).toFixed(0);
  const rawMillFeed = (tags['RM1-FEED-TOT'] || 265).toFixed(0);
  const rawMillPwr = (tags['RM1-PWR'] || 3240).toFixed(0);
  const kilnFeed = (tags['KLN1-FEED'] || 3210).toFixed(0);
  const kilnRpm = (tags['KLN1-SPD'] || 3.85).toFixed(2);
  const coolerSecAir = (tags['CLR1-SEC-AIR'] || 1045).toFixed(0);
  const clinkerStock = (tags['CT1-SILO-TONS'] || 25000).toLocaleString();
  const cementMillPwr = (tags['CM2-PWR'] || 4280).toFixed(0);
  const cementBlaine = (tags['CM2-BLAINE'] || 385).toFixed(0);

  const isTrampMetal = activeScenario === 'TRAMP_METAL';
  const isMillOverload = activeScenario === 'MILL_OVERLOAD';
  const isKilnOverheat = activeScenario === 'KILN_OVERHEAT';

  // 10 Interactive 3D Callout Hotspots calibrated to plant-3d-clean.png
  const plant3DPins = [
    { id: 'MINE', num: '1', title: 'Mine', val: '520 TPH', x: 2.2, y: 26, area: 'CR' },
    { id: 'CRUSHER', num: '2', title: 'Crusher', val: '430 TPH', x: 12.8, y: 34, area: 'CR' },
    { id: 'RAW_MILL', num: '3', title: 'Raw Mill', val: '265 TPH', x: 24.8, y: 44, area: 'RM1' },
    { id: 'KILN', num: '4', title: 'Preheater & Kiln', val: '3,210 TPH', x: 40.5, y: 12, area: 'KILN' },
    { id: 'COOLER', num: '5', title: 'Cooler', val: '265 TPH', x: 54.0, y: 38, area: 'COOLER' },
    { id: 'CLINKER_STORAGE', num: '6', title: 'Clinker Storage', val: '25,000 T', x: 63.5, y: 44, area: 'CT1' },
    { id: 'CEMENT_MILL', num: '7', title: 'Cement Mill', val: '312.5 TPH', x: 77.0, y: 56, area: 'CM2' },
    { id: 'PACKING', num: '8', title: 'Packing', val: '240 TPH', x: 88.5, y: 58, area: 'PACKING' },
    { id: 'CPP', num: '9', title: 'Captive Power Plant', val: '8.5 MW', x: 72.0, y: 15, area: 'POWER' },
    { id: 'WHRS', num: '10', title: 'WHRS', val: '4.2 MW', x: 89.2, y: 21, area: 'POWER' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#060b13] text-white overflow-hidden select-none font-sans">
      
      {/* ── TOP INDUSTRIAL PROCESS BANNER ─────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-2 bg-[#08121c] border-b border-[#142337] text-xs shrink-0">
        
        {/* Plant Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="font-black text-white tracking-wide">INTEGRATED CEMENT FACILITY</span>
          </div>
          <span className="text-gray-400 font-mono text-[11px]">| LINE 1 • 3,000 TPD PYROPROCESSING LINE</span>
        </div>

        {/* Live Top KPIs Strip */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-[#0b1725] border border-[#18293d] px-2.5 py-1 rounded">
            <Zap size={13} className="text-[#00ff88]" />
            <span className="text-gray-400">TOTAL POWER:</span>
            <span className="text-[#00ff88] font-black">{plantPower} MW</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0b1725] border border-[#18293d] px-2.5 py-1 rounded">
            <Flame size={13} className="text-amber-400" />
            <span className="text-gray-400">CLINKER:</span>
            <span className="text-amber-400 font-black">{clinkerProd} t/h</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0b1725] border border-[#18293d] px-2.5 py-1 rounded">
            <Gauge size={13} className="text-cyan-400" />
            <span className="text-gray-400">SEC:</span>
            <span className="text-cyan-400 font-black">{plantSec} kWh/t</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0b1725] border border-[#18293d] px-2.5 py-1 rounded">
            <Activity size={13} className="text-emerald-400" />
            <span className="text-gray-400">WHRS:</span>
            <span className="text-emerald-400 font-black">{whrsMw} MW</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0b1725] border border-[#18293d] px-2.5 py-1 rounded">
            <Layers size={13} className="text-purple-400" />
            <span className="text-gray-400">CEMENT:</span>
            <span className="text-purple-400 font-black">{cementTph} t/h</span>
          </div>
        </div>

        {/* View Mode Toggle & Scenarios */}
        <div className="flex items-center gap-2">
          
          {/* Audio Synthesizer */}
          <button
            onClick={() => {
              toggleAudio();
              scadaAudio.playClick();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold border transition-all ${
              isAudioEnabled 
                ? 'bg-emerald-950/60 border-emerald-500/50 text-[#00ff88]' 
                : 'bg-[#0c1825] border-gray-700 text-gray-400 hover:text-white'
            }`}
            title="Toggle authentic SCADA industrial acoustics"
          >
            {isAudioEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{isAudioEnabled ? 'AUDIO ON' : 'MUTE'}</span>
          </button>

          {/* View Toggle */}
          <div className="flex bg-[#0b1725] p-0.5 rounded border border-[#1b2e47]">
            <button
              onClick={() => {
                setViewMode('3D');
                scadaAudio.playClick();
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all ${
                viewMode === '3D'
                  ? 'bg-[#0f4d30] text-[#00ff88] border border-[#106c35] shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Compass size={13} />
              <span>3D Aerial View</span>
            </button>
            <button
              onClick={() => {
                setViewMode('SCHEMATIC');
                scadaAudio.playClick();
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all ${
                viewMode === 'SCHEMATIC'
                  ? 'bg-[#0f4d30] text-[#00ff88] border border-[#106c35] shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>DCS Engineering CAD</span>
            </button>
          </div>

        </div>
      </div>

      {/* ── MAIN INDUSTRIAL VIEWPORT ────────────────────────────────── */}
      <div className="flex-1 relative w-full h-full bg-[#050a12] overflow-hidden">
        
        {viewMode === '3D' ? (
          /* ═══════════════════════════════════════════════════════════ */
          /* 3D ISOMETRIC AERIAL HERO VIEW WITH SEAMLESS BLEND           */
          /* ═══════════════════════════════════════════════════════════ */
          <div className="relative w-full h-full flex items-center justify-center p-2 bg-[#050a12]">
            
            {/* Full-bleed 3D Container with Seamless Vignette (Zero external background look) */}
            <div className="relative w-full h-full max-w-7xl max-h-[820px] rounded-2xl overflow-hidden border border-[#142337] shadow-2xl bg-[#060c16]">
              
              {/* Clean 3D Plant Model Image */}
              <img 
                src="/plant-3d-clean.png" 
                alt="3D Plant Model"
                className="w-full h-full object-cover select-none filter brightness-95 contrast-105"
              />

              {/* Edge Gradient Vignette for seamless dark blend */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#060c16] via-transparent to-transparent opacity-50" />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#060c16]/50 via-transparent to-[#060c16]/50" />

              {/* CAD Reticle HUD Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[10px] text-[#00ff88] bg-[#05111b]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-[#1c3652]">
                <Crosshair size={12} className="animate-spin" />
                <span className="font-extrabold tracking-wide">3D ISOMETRIC PLANT FLOW • UNIT-01 ACTIVE MESH</span>
              </div>

              {/* 10 Interactive Hotspot Callout Pins */}
              {plant3DPins.map((pin) => (
                <div 
                  key={pin.id}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className="absolute z-20 cursor-pointer group -translate-x-2 -translate-y-2"
                  onClick={() => handleAreaClick(pin.area)}
                  title={`Click to open ${pin.title} DCS Engineering Screen`}
                >
                  <div className="flex items-center gap-1.5 bg-[#05111b]/95 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#1c3652] group-hover:border-[#00ff88] group-hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all transform group-hover:-translate-y-1">
                    <span className="w-2 h-2 rounded-full bg-[#00ff88] group-hover:animate-ping" />
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-black text-white group-hover:text-[#00ff88] transition-colors leading-none">
                        {pin.num}. {pin.title}
                      </span>
                      <span className="text-[9px] font-mono text-[#00ff88] font-bold leading-tight mt-0.5">
                        {pin.val}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bottom Instructions HUD */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#05111b]/90 backdrop-blur-md px-5 py-1 rounded-full border border-[#1c3652] text-[11px] text-gray-300 flex items-center gap-2 shadow-xl">
                <span className="text-[#00ff88] font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  SCHNEIDER ECOSTRUXURE DCS:
                </span>
                <span>Click any facility node above to inspect its real-time engineering SCADA screen</span>
              </div>

            </div>
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════ */
          /* NATIVE REAL-WORLD INDUSTRIAL SCADA DIGITAL TWIN (ISA-101)   */
          /* ═══════════════════════════════════════════════════════════ */
          <div className="relative w-full h-full p-2 bg-[#070d17] overflow-auto custom-scrollbar">
            <svg 
              className="w-full h-full min-w-[1750px] min-h-[750px]" 
              viewBox="0 0 1920 850" 
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* CAD Grid */}
                <pattern id="cad-grid-heavy" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#101928" strokeWidth="0.8" />
                  <circle cx="30" cy="30" r="0.8" fill="#172338" />
                </pattern>

                <linearGradient id="pipe-raw-meal" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="50%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>

                <linearGradient id="pipe-hot-gas" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#991b1b" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>

                <linearGradient id="pipe-clinker" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>

                <filter id="glow-flame" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Background */}
              <rect width="100%" height="100%" fill="url(#cad-grid-heavy)" />

              {/* ── CONTINUOUS INTERCONNECTING PROCESS FLOW PIPES ── */}
              {/* Crusher to Raw Mill Feeder Conveyor */}
              <IndustrialPipe d="M 240 560 L 380 560 L 380 480 L 450 480" strokeWidth={10} media="RAW_MEAL" />

              {/* Raw Mill to Homogenizing Silo Pneumatic Airlift */}
              <IndustrialPipe d="M 520 420 L 590 420 L 590 280 L 660 280" strokeWidth={10} media="RAW_MEAL" />

              {/* Blending Silo to Top Preheater Stage C1 */}
              <IndustrialPipe d="M 720 280 L 780 280 L 780 160 L 810 160" strokeWidth={8} media="RAW_MEAL" />

              {/* Tertiary Air Duct (TAD): Cooler Hood to Calciner */}
              <IndustrialPipe d="M 1480 430 L 1480 320 L 980 320 L 980 380" strokeWidth={12} media="HOT_GAS" />
              <text x="1230" y="310" fill="#f97316" fontSize="9" fontWeight="extrabold" textAnchor="middle" fontFamily="monospace">
                TERTIARY AIR DUCT (895°C HOT AIR RETURN)
              </text>

              {/* Preheater SP & Cooler AQC Steam Pipe to WHRS Turbine */}
              <path d="M 860 140 L 860 70 L 1750 70 L 1750 180" fill="none" stroke="#38bdf8" strokeWidth="6" strokeDasharray="10 6" />
              <text x="1305" y="60" fill="#38bdf8" fontSize="9" fontWeight="extrabold" textAnchor="middle" fontFamily="monospace">
                WHRS HIGH PRESSURE SUPERHEATED STEAM PIPELINE (18.5 BAR • 320°C)
              </text>

              {/* Kiln Flue Gas Recirculation to Raw Mill Drying */}
              <IndustrialPipe d="M 800 120 L 480 120 L 480 410" strokeWidth={10} media="HOT_GAS" />
              <text x="640" y="110" fill="#ef4444" fontSize="9" fontWeight="extrabold" textAnchor="middle" fontFamily="monospace">
                KILN OFF-GAS TO RAW MILL DRYING (315°C)
              </text>

              {/* Cooler to Clinker Silos (Deep Pan Conveyor) */}
              <IndustrialPipe d="M 1580 560 L 1630 560 L 1630 380 L 1660 380" strokeWidth={12} media="CLINKER" />

              {/* Clinker Silos to Cement Ball Mill Feeders */}
              <IndustrialPipe d="M 1720 400 L 1720 620 L 1520 620 L 1520 680" strokeWidth={10} media="CLINKER" />

              {/* ── 1. PRIMARY CRUSHER & APRON FEEDER (CR) ── */}
              <g 
                className="cursor-pointer group"
                onClick={() => handleAreaClick('CR')}
                onMouseEnter={() => setHoveredArea('CR')}
                onMouseLeave={() => setHoveredArea(null)}
              >
                {/* Section Halo Card */}
                <rect x="30" y="440" width="320" height="230" rx="10" fill="#091322" stroke={hoveredArea === 'CR' ? '#00ff88' : '#17273d'} strokeWidth="1.5" />
                <rect x="30" y="440" width="320" height="28" rx="10" fill="#0f1d33" />
                <circle cx="45" cy="454" r="5" fill={getStatus('CR-CR-01') === 'RUNNING' ? '#00ff88' : '#ef4444'} />
                <text x="60" y="458" fill="#ffffff" fontSize="11" fontWeight="black">1. QUARRY & PRIMARY CRUSHER</text>
                <text x="335" y="458" fill="#00ff88" fontSize="10" fontWeight="bold" textAnchor="end">CR</text>

                {/* Heavy Apron Feeder */}
                <ApronFeederUnit id="CR-AF-01" x={45} y={490} scale={0.7} onClick={() => handleAreaClick('CR')} />

                {/* Primary Reversible Impact Crusher */}
                <ImpactCrusherUnit id="CR-CR-01" x={240} y={530} scale={0.75} onClick={() => handleAreaClick('CR')} />

                {/* ISA Instrument Tags */}
                <ISAInstrumentTag tag="CR-AF-FEED" isaCode="WI" unit="t/h" x={150} y={485} />
                <ISAInstrumentTag tag="CR-CR-VIB" isaCode="VI" unit="mm/s" x={260} y={635} />
              </g>

              {/* ── 2. RAW MATERIAL GRINDING VRM & BLENDING SILO (RM1) ── */}
              <g 
                className="cursor-pointer group"
                onClick={() => handleAreaClick('RM1')}
                onMouseEnter={() => setHoveredArea('RM1')}
                onMouseLeave={() => setHoveredArea(null)}
              >
                <rect x="390" y="240" width="330" height="430" rx="10" fill="#091322" stroke={hoveredArea === 'RM1' ? '#00ff88' : '#17273d'} strokeWidth="1.5" />
                <rect x="390" y="240" width="330" height="28" rx="10" fill="#0f1d33" />
                <circle cx="405" cy="254" r="5" fill={getStatus('RM1-VRM-01') === 'RUNNING' ? '#00ff88' : '#ef4444'} />
                <text x="420" y="258" fill="#ffffff" fontSize="11" fontWeight="black">2. RAW MILL (VRM) & SILO</text>
                <text x="705" y="258" fill="#00ff88" fontSize="10" fontWeight="bold" textAnchor="end">RM1</text>

                {/* Vertical Roller Mill Cross Section */}
                <VerticalRollerMillUnit id="RM1-VRM-01" x={480} y={430} scale={0.8} onClick={() => handleAreaClick('RM1')} />

                {/* Process Centrifugal Fan */}
                <CentrifugalFanUnit id="RM1-FAN-01" x={630} y={540} scale={0.65} onClick={() => handleAreaClick('RM1')} />

                {/* Homogenizing Raw Meal Silo */}
                <ReinforcedSiloUnit x={650} y={320} width={60} height={150} name="MEAL SILO" tagLvl="RM1-SILO-LVL" material="RAW MEAL" />

                {/* ISA Tags */}
                <ISAInstrumentTag tag="RM1-FEED-TOT" isaCode="WI" unit="t/h" x={430} y={350} />
                <ISAInstrumentTag tag="RM1-DP" isaCode="PI" unit="mmWC" x={530} y={350} />
              </g>

              {/* ── 3. PREHEATER TOWER & ROTARY KILN (KILN) ── */}
              <g 
                className="cursor-pointer group"
                onClick={() => handleAreaClick('KILN')}
                onMouseEnter={() => setHoveredArea('KILN')}
                onMouseLeave={() => setHoveredArea(null)}
              >
                <rect x="760" y="80" width="560" height="590" rx="10" fill="#091322" stroke={hoveredArea === 'KILN' ? '#00ff88' : '#17273d'} strokeWidth="1.5" />
                <rect x="760" y="80" width="560" height="28" rx="10" fill="#0f1d33" />
                <circle cx="775" cy="94" r="5" fill={getStatus('KLN1-KILN-01') === 'RUNNING' ? '#00ff88' : '#ef4444'} />
                <text x="790" y="98" fill="#ffffff" fontSize="11" fontWeight="black">3. 5-STAGE PREHEATER & ROTARY KILN</text>
                <text x="1305" y="98" fill="#00ff88" fontSize="10" fontWeight="bold" textAnchor="end">KILN</text>

                {/* 5-Stage Twin-String Preheater Tower Unit */}
                <PreheaterTowerUnit x={780} y={130} scale={0.85} onClick={() => handleAreaClick('KILN')} />

                {/* 3-Pier Inclined Rotary Kiln with Burning Flame */}
                <RotaryKilnUnit id="KLN1-KILN-01" x={930} y={540} length={380} scale={0.88} onClick={() => handleAreaClick('KILN')} />

                {/* ISA Tags */}
                <ISAInstrumentTag tag="KLN1-BZ-TEMP" isaCode="TI" unit="°C" x={1240} y={490} alarm="NORMAL" />
                <ISAInstrumentTag tag="KLN1-FEED" isaCode="WI" unit="t/h" x={940} y={460} />
                <ISAInstrumentTag tag="KLN1-O2" isaCode="AI" unit="%" x={960} y={220} />
              </g>

              {/* ── 4. RECIPROCATING GRATE COOLER (COOLER) ── */}
              <g 
                className="cursor-pointer group"
                onClick={() => handleAreaClick('COOLER')}
                onMouseEnter={() => setHoveredArea('COOLER')}
                onMouseLeave={() => setHoveredArea(null)}
              >
                <rect x="1360" y="380" width="310" height="290" rx="10" fill="#091322" stroke={hoveredArea === 'COOLER' ? '#00ff88' : '#17273d'} strokeWidth="1.5" />
                <rect x="1360" y="380" width="310" height="28" rx="10" fill="#0f1d33" />
                <circle cx="1375" cy="394" r="5" fill={getStatus('CLR1-COOL-01') === 'RUNNING' ? '#00ff88' : '#ef4444'} />
                <text x="1390" y="398" fill="#ffffff" fontSize="11" fontWeight="black">4. CLINKER GRATE COOLER</text>
                <text x="1655" y="398" fill="#00ff88" fontSize="10" fontWeight="bold" textAnchor="end">COOLER</text>

                {/* Grate Cooler with 6 Undergrate Fans & Clinker Breaker */}
                <GrateCoolerUnit id="CLR1-COOL-01" x={1375} y={470} scale={0.65} onClick={() => handleAreaClick('COOLER')} />

                {/* ISA Tags */}
                <ISAInstrumentTag tag="CLR1-SEC-AIR" isaCode="TI" unit="°C" x={1430} y={430} />
                <ISAInstrumentTag tag="CLR1-DISCH-T" isaCode="TI" unit="°C" x={1600} y={490} />
              </g>

              {/* ── 5. CEMENT BALL MILL & FINISH GRINDING (CM2) ── */}
              <g 
                className="cursor-pointer group"
                onClick={() => handleAreaClick('CM2')}
                onMouseEnter={() => setHoveredArea('CM2')}
                onMouseLeave={() => setHoveredArea(null)}
              >
                <rect x="1360" y="690" width="460" height="150" rx="10" fill="#091322" stroke={hoveredArea === 'CM2' ? '#00ff88' : '#17273d'} strokeWidth="1.5" />
                <rect x="1360" y="690" width="460" height="26" rx="10" fill="#0f1d33" />
                <circle cx="1375" cy="703" r="5" fill={getStatus('CM2-MILL-01') === 'RUNNING' ? '#00ff88' : '#ef4444'} />
                <text x="1390" y="707" fill="#ffffff" fontSize="11" fontWeight="black">5. CEMENT BALL MILL (TWO COMPARTMENTS)</text>
                <text x="1805" y="707" fill="#00ff88" fontSize="10" fontWeight="bold" textAnchor="end">CM2</text>

                {/* Dual-Compartment Ball Mill */}
                <BallMillUnit id="CM2-MILL-01" x={1380} y={755} scale={0.7} onClick={() => handleAreaClick('CM2')} />

                {/* Process Filter */}
                <PulseJetBaghouseUnit id="CM2-DC-01" x={1640} y={725} scale={0.45} />

                {/* ISA Tags */}
                <ISAInstrumentTag tag="CM2-FEED-TOT" isaCode="WI" unit="t/h" x={1580} y={715} />
                <ISAInstrumentTag tag="CM2-EAR" isaCode="II" unit="%" x={1470} y={715} />
              </g>

              {/* ── 6. WHRS POWER GENERATION (POWER) ── */}
              <g 
                className="cursor-pointer group"
                onClick={() => handleAreaClick('POWER')}
                onMouseEnter={() => setHoveredArea('POWER')}
                onMouseLeave={() => setHoveredArea(null)}
              >
                <rect x="1700" y="80" width="200" height="260" rx="10" fill="#091322" stroke={hoveredArea === 'POWER' ? '#00ff88' : '#17273d'} strokeWidth="1.5" />
                <rect x="1700" y="80" width="200" height="28" rx="10" fill="#0f1d33" />
                <circle cx="1715" cy="94" r="5" fill={getStatus('WHRS-GEN-01') === 'RUNNING' ? '#00ff88' : '#ef4444'} />
                <text x="1730" y="98" fill="#ffffff" fontSize="11" fontWeight="black">6. WHRS & CPP</text>
                <text x="1885" y="98" fill="#00ff88" fontSize="10" fontWeight="bold" textAnchor="end">POWER</text>

                {/* Steam Turbine & Generator Graphic */}
                <g transform="translate(1720, 150)">
                  <polygon points="0,15 45,0 45,60 0,45" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="22" cy="30" r="10" fill="#10b981" />
                  <rect x="55" y="10" width="40" height="40" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="3" />
                  <text x="75" y="35" fill="#f59e0b" fontSize="12" fontWeight="black" textAnchor="middle">G</text>
                  <line x1="45" y1="30" x2="55" y2="30" stroke="#94a3b8" strokeWidth="6" />
                </g>

                <ISAInstrumentTag tag="WHRS-TURBINE-MW" isaCode="II" unit="MW" x={1770} y={230} />
                <ISAInstrumentTag tag="WHRS-SP-STEAM" isaCode="TI" unit="°C" x={1770} y={280} />
              </g>

              {/* ── 7. CLINKER STORAGE DOME & SILO (CT1) ── */}
              <g 
                className="cursor-pointer group"
                onClick={() => handleAreaClick('CT1')}
                onMouseEnter={() => setHoveredArea('CT1')}
                onMouseLeave={() => setHoveredArea(null)}
              >
                <ReinforcedSiloUnit x={1690} y={380} width={90} height={190} name="CLINKER SILO" tagLvl="CT1-SILO-LVL" material="CLINKER" />
              </g>

            </svg>
          </div>
        )}

      </div>

      {/* ── BOTTOM ENTERPRISE SCADA STATUS FOOTER ──────────────────── */}
      <div className="h-9 bg-[#071018] border-t border-[#121f2f] flex items-center justify-between px-6 text-[11px] font-mono text-gray-400 shrink-0">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
            DCS NETWORK: SYNCHRONIZED
          </span>
          <span>CYCLE TIME: 1000 ms</span>
          <span>NODES ONLINE: 10/10</span>
        </div>

        <div className="flex items-center gap-4 text-gray-300">
          <span>MASS BALANCE RESIDUAL: <span className="text-[#00ff88] font-bold">+0.4%</span></span>
          <span className="text-gray-600">|</span>
          <span>SPECIFIC EMISSION: <span className="text-cyan-400 font-bold">0.642 tCO₂/t</span></span>
        </div>
      </div>

    </div>
  );
};

export default PlantOverviewScreen;
