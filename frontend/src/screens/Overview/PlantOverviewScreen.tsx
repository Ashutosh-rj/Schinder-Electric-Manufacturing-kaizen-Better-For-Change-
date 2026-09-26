import React from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { IndustrialPipe } from '../../components/scada/Equipment/IndustrialPlantComponents';
import { 
  Factory, Zap, Flame, Activity, ArrowRight, 
  Layers, Gauge, ShieldAlert, Cpu
} from 'lucide-react';

interface OverviewProps {
  onNavigateArea?: (area: string) => void;
  onOpenFaceplate?: (eqId: string) => void;
}

export const PlantOverviewScreen: React.FC<OverviewProps> = ({ onNavigateArea, onOpenFaceplate }) => {
  const tags = useScadaStore((s) => s.tags);
  const equipment = useScadaStore((s) => s.equipment);

  const getStatus = (id: string) => equipment[id]?.status || 'RUNNING';

  return (
    <div className="w-full h-full flex flex-col bg-[#0b1320] text-white overflow-hidden select-none font-sans">
      
      {/* TOP PLANT KPI OVERVIEW BANNER */}
      <div className="grid grid-cols-6 gap-3 p-3 bg-[#070b14] border-b border-gray-800 text-xs">
        <div className="bg-[#131b2e] border border-gray-800 p-2.5 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">TOTAL PLANT POWER</div>
            <div className="text-lg font-black text-[#00ff00] font-mono mt-0.5">
              {(tags['PLANT-TOTAL-POWER'] || 22400) > 1000 ? ((tags['PLANT-TOTAL-POWER'] || 22400) / 1000).toFixed(2) : tags['PLANT-TOTAL-POWER']} <span className="text-xs text-gray-400 font-normal">MW</span>
            </div>
          </div>
          <Zap size={22} className="text-[#00ff00] opacity-80" />
        </div>

        <div className="bg-[#131b2e] border border-gray-800 p-2.5 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">CLINKER PRODUCTION</div>
            <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
              {(tags['KLN1-CLINKER-PROD'] || 183.5).toFixed(1)} <span className="text-xs text-gray-400 font-normal">t/h</span>
            </div>
          </div>
          <Flame size={22} className="text-amber-500 opacity-80" />
        </div>

        <div className="bg-[#131b2e] border border-gray-800 p-2.5 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SPECIFIC ENERGY (SEC)</div>
            <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
              {(tags['PLANT-SEC-KWH'] || 63.8).toFixed(1)} <span className="text-xs text-gray-400 font-normal">kWh/t</span>
            </div>
          </div>
          <Gauge size={22} className="text-cyan-400 opacity-80" />
        </div>

        <div className="bg-[#131b2e] border border-gray-800 p-2.5 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">WHRS GREEN POWER</div>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              {(tags['WHRS-TURBINE-MW'] || 6.45).toFixed(2)} <span className="text-xs text-gray-400 font-normal">MW</span>
            </div>
          </div>
          <Activity size={22} className="text-emerald-400 opacity-80" />
        </div>

        <div className="bg-[#131b2e] border border-gray-800 p-2.5 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">BURNING ZONE TEMP</div>
            <div className="text-lg font-black text-rose-500 font-mono mt-0.5">
              {(tags['KLN1-BZ-TEMP'] || 1448).toFixed(0)} <span className="text-xs text-gray-400 font-normal">°C</span>
            </div>
          </div>
          <Flame size={22} className="text-rose-500 opacity-80" />
        </div>

        <div className="bg-[#131b2e] border border-gray-800 p-2.5 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">CEMENT FINISH RATE</div>
            <div className="text-lg font-black text-purple-400 font-mono mt-0.5">
              {(tags['CM2-FEED-TOT'] || 195.0).toFixed(1)} <span className="text-xs text-gray-400 font-normal">t/h</span>
            </div>
          </div>
          <Factory size={22} className="text-purple-400 opacity-80" />
        </div>
      </div>

      {/* MAIN END-TO-END PROCESS FLOW SCHEMATIC (P&ID) */}
      <div className="flex-1 relative w-full h-full p-2">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1600 780" preserveAspectRatio="xMidYMid meet">
          
          {/* DEFINITIONS FOR GRADIENTS */}
          <defs>
            <linearGradient id="flow-card-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* INTERCONNECTING PROCESS FLOW PIPES & GAS LOOPS */}
          {/* ═══════════════════════════════════════════════════════════ */}

          {/* 1. Crusher to Stacker & Reclaimer (Crushed Limestone) */}
          <IndustrialPipe d="M 230 180 L 290 180" media="RAW_MEAL" strokeWidth="8" />

          {/* 2. Reclaimer to Raw Mill Feeders */}
          <IndustrialPipe d="M 430 180 L 490 180" media="RAW_MEAL" strokeWidth="8" />

          {/* 3. Raw Mill to Homogenizing Silo (Fluidized Raw Meal) */}
          <IndustrialPipe d="M 670 180 L 730 180" media="RAW_MEAL" strokeWidth="8" />

          {/* 4. Homogenizing Silo to Kiln Preheater Tower (Kiln Feed Meal) */}
          <IndustrialPipe d="M 870 180 L 930 180" media="RAW_MEAL" strokeWidth="8" />

          {/* 5. Preheater down to Kiln & Cooler */}
          <IndustrialPipe d="M 1030 260 L 1030 380 L 1070 380" media="HOT_GAS" strokeWidth="10" />

          {/* 6. Kiln to Grate Cooler (Hot Clinker 1450°C) */}
          <IndustrialPipe d="M 1270 420 L 1330 420" media="CLINKER" strokeWidth="12" />

          {/* 7. Cooler Secondary Air to Kiln (1050°C) */}
          <IndustrialPipe d="M 1330 400 L 1270 400" media="HOT_GAS" strokeWidth="10" />

          {/* 8. Cooler to Clinker Silo (Deep Pan Conveyor) */}
          <IndustrialPipe d="M 1430 490 L 1430 600 L 1290 600" media="CLINKER" strokeWidth="10" />

          {/* 9. Clinker Silo to Cement Ball Mill Feeders */}
          <IndustrialPipe d="M 1150 600 L 1090 600" media="CLINKER" strokeWidth="10" />

          {/* 10. Cement Mill to Packing Silos & Dispatch */}
          <IndustrialPipe d="M 890 600 L 830 600" media="RAW_MEAL" strokeWidth="10" />

          {/* 11. HOT GAS RECIRCULATION LOOP (Kiln Flue Gas -> Raw Mill Drying -> Main Baghouse -> Stack) */}
          <IndustrialPipe d="M 970 130 L 970 80 L 610 80 L 610 120" media="HOT_GAS" strokeWidth="10" />

          {/* 12. WHRS SP & AQC STEAM TAPPINGS (Preheater & Cooler -> WHRS Turbine) */}
          <IndustrialPipe d="M 1010 110 L 1010 40 L 400 40 L 400 370 L 490 370" media="WATER" strokeWidth="6" />
          <IndustrialPipe d="M 1380 370 L 1380 340 L 680 340 L 680 370" media="WATER" strokeWidth="6" />

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 1: QUARRY & PRIMARY CRUSHER (CR) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(50, 120)" 
            className="cursor-pointer group" 
            onClick={() => onNavigateArea && onNavigateArea('CR')}
          >
            <rect x="0" y="0" width="180" height="130" rx="8" fill="url(#flow-card-grad)" stroke="#334155" strokeWidth="2" filter="url(#card-shadow)" className="group-hover:stroke-cyan-400 transition-colors" />
            <rect x="0" y="0" width="180" height="26" rx="8" fill="#1e293b" />
            <rect x="10" y="7" width="10" height="10" rx="2" fill={getStatus('CR-CR-01') === 'RUNNING' ? '#10b981' : '#ef4444'} />
            <text x="26" y="16" fill="#cbd5e1" fontSize="10" fontWeight="extrabold">1. LIMESTONE CRUSHER</text>
            
            {/* Schematic Icon */}
            <g transform="translate(20, 45)">
              <polygon points="0,0 40,0 30,25 10,25" fill="#475569" stroke="#94a3b8" />
              <rect x="5" y="25" width="30" height="18" fill="#334155" stroke="#64748b" />
              <circle cx="20" cy="34" r="5" fill="#10b981" />
            </g>

            {/* Live Data Rows */}
            <g transform="translate(85, 45)" className="font-mono text-[9px]">
              <text x="0" y="10" fill="#94a3b8">FEED: <tspan fill="#00ff00" fontWeight="bold">{(tags['CR-AF-FEED'] || 480).toFixed(0)} t/h</tspan></text>
              <text x="0" y="24" fill="#94a3b8">PWR: <tspan fill="#00d4ff" fontWeight="bold">{(tags['CR-CR-PWR'] || 485).toFixed(0)} kW</tspan></text>
              <text x="0" y="38" fill="#94a3b8">CSS: <tspan fill="#facc15">28.5 mm</tspan></text>
              <text x="0" y="52" fill="#94a3b8">VIB: <tspan fill="#a3e635">{(tags['CR-CR-VIB'] || 2.4).toFixed(1)} mm/s</tspan></text>
            </g>

            <text x="90" y="118" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" className="group-hover:underline">
              CLICK TO VIEW CRUSHER →
            </text>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 2: BLENDING BED & RECLAIMER */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g transform="translate(290, 120)" className="cursor-pointer group" onClick={() => onNavigateArea && onNavigateArea('CR')}>
            <rect x="0" y="0" width="140" height="130" rx="8" fill="url(#flow-card-grad)" stroke="#334155" strokeWidth="2" filter="url(#card-shadow)" className="group-hover:stroke-cyan-400 transition-colors" />
            <rect x="0" y="0" width="140" height="26" rx="8" fill="#1e293b" />
            <text x="14" y="16" fill="#cbd5e1" fontSize="10" fontWeight="extrabold">BLENDING & XRF</text>
            
            <g transform="translate(20, 50)">
              {/* Chevron stock pile */}
              <polygon points="0,35 50,0 100,35" fill="#475569" stroke="#64748b" />
              <rect x="10" y="35" width="80" height="8" fill="#334155" />
            </g>

            <g transform="translate(15, 60)" className="font-mono text-[9px]">
              <text x="0" y="15" fill="#94a3b8">LSF: <tspan fill="#00ff00" fontWeight="bold">96.8</tspan></text>
              <text x="0" y="28" fill="#94a3b8">STOCK: <tspan fill="#ffffff">325,000 t</tspan></text>
            </g>

            <text x="70" y="118" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
              CHEVRON BED
            </text>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 3: RAW MILL GRINDING (VRM CIRCUIT) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(490, 120)" 
            className="cursor-pointer group" 
            onClick={() => onNavigateArea && onNavigateArea('RM1')}
          >
            <rect x="0" y="0" width="180" height="130" rx="8" fill="url(#flow-card-grad)" stroke="#334155" strokeWidth="2" filter="url(#card-shadow)" className="group-hover:stroke-cyan-400 transition-colors" />
            <rect x="0" y="0" width="180" height="26" rx="8" fill="#1e293b" />
            <rect x="10" y="7" width="10" height="10" rx="2" fill={getStatus('RM1-VRM-01') === 'RUNNING' ? '#10b981' : '#ef4444'} />
            <text x="26" y="16" fill="#cbd5e1" fontSize="10" fontWeight="extrabold">2. RAW MILL (VRM)</text>

            {/* VRM Icon */}
            <g transform="translate(25, 45)">
              <polygon points="5,0 35,0 38,30 2,30" fill="#334155" stroke="#94a3b8" />
              <rect x="0" y="30" width="40" height="15" fill="#1e293b" stroke="#64748b" />
              <circle cx="10" cy="20" r="5" fill="#64748b" />
              <circle cx="30" cy="20" r="5" fill="#64748b" />
            </g>

            <g transform="translate(85, 45)" className="font-mono text-[9px]">
              <text x="0" y="10" fill="#94a3b8">FEED: <tspan fill="#00ff00" fontWeight="bold">{(tags['RM1-FEED'] || 285).toFixed(0)} t/h</tspan></text>
              <text x="0" y="24" fill="#94a3b8">PWR: <tspan fill="#00d4ff" fontWeight="bold">{(tags['RM1-PWR'] || 3240).toFixed(0)} kW</tspan></text>
              <text x="0" y="38" fill="#94a3b8">dP: <tspan fill="#facc15">{(tags['RM1-DP'] || 620).toFixed(0)} mm</tspan></text>
              <text x="0" y="52" fill="#94a3b8">HYD: <tspan fill="#38bdf8">136 bar</tspan></text>
            </g>

            <text x="90" y="118" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" className="group-hover:underline">
              CLICK TO VIEW RAW MILL →
            </text>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 4: RAW MEAL HOMOGENIZING SILO (CF SILO) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g transform="translate(730, 120)" className="cursor-pointer group" onClick={() => onNavigateArea && onNavigateArea('RM1')}>
            <rect x="0" y="0" width="140" height="130" rx="8" fill="url(#flow-card-grad)" stroke="#334155" strokeWidth="2" filter="url(#card-shadow)" className="group-hover:stroke-cyan-400 transition-colors" />
            <rect x="0" y="0" width="140" height="26" rx="8" fill="#1e293b" />
            <text x="14" y="16" fill="#cbd5e1" fontSize="10" fontWeight="extrabold">RAW MEAL SILO</text>

            <g transform="translate(20, 40)">
              <rect x="0" y="0" width="35" height="50" fill="#1e293b" stroke="#64748b" rx="2" />
              <polygon points="0,50 35,50 25,65 10,65" fill="#334155" stroke="#64748b" />
              <rect x="2" y="18" width="31" height="32" fill="#94a3b8" opacity="0.8" />
            </g>

            <g transform="translate(68, 50)" className="font-mono text-[9px]">
              <text x="0" y="15" fill="#94a3b8">LEVEL:</text>
              <text x="0" y="30" fill="#00ff00" fontSize="12" fontWeight="bold">{(tags['RM1-SILO-LVL'] || 74.2).toFixed(1)}%</text>
              <text x="0" y="48" fill="#94a3b8">AERATION: <tspan fill="#38bdf8">OK</tspan></text>
            </g>

            <text x="70" y="118" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
              CF SILO (8-SECTOR)
            </text>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 5: PREHEATER TOWER & IN-LINE CALCINER */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(930, 90)" 
            className="cursor-pointer group" 
            onClick={() => onNavigateArea && onNavigateArea('KILN')}
          >
            <rect x="0" y="0" width="180" height="160" rx="8" fill="url(#flow-card-grad)" stroke="#334155" strokeWidth="2" filter="url(#card-shadow)" className="group-hover:stroke-cyan-400 transition-colors" />
            <rect x="0" y="0" width="180" height="26" rx="8" fill="#1e293b" />
            <rect x="10" y="7" width="10" height="10" rx="2" fill={getStatus('KLN1-ID-FAN') === 'RUNNING' ? '#10b981' : '#ef4444'} />
            <text x="26" y="16" fill="#cbd5e1" fontSize="10" fontWeight="extrabold">3. PREHEATER & CALCINER</text>

            {/* Tower icon */}
            <g transform="translate(15, 35)">
              <rect x="0" y="0" width="30" height="75" fill="#0b1320" stroke="#64748b" />
              <polygon points="5,15 25,15 15,30" fill="#ef4444" />
              <polygon points="5,40 25,40 15,55" fill="#ea580c" />
            </g>

            <g transform="translate(60, 42)" className="font-mono text-[9px]">
              <text x="0" y="10" fill="#94a3b8">C1 EXIT: <tspan fill="#facc15">{(tags['KLN1-C1-TEMP'] || 335).toFixed(0)} °C</tspan></text>
              <text x="0" y="24" fill="#94a3b8">CALC TEMP: <tspan fill="#ef4444" fontWeight="bold">{(tags['KLN1-CALC-TEMP'] || 885).toFixed(0)} °C</tspan></text>
              <text x="0" y="38" fill="#94a3b8">KILN FEED: <tspan fill="#00ff00">{(tags['KLN1-FEED'] || 280).toFixed(0)} t/h</tspan></text>
              <text x="0" y="52" fill="#94a3b8">SNCR NH3: <tspan fill="#38bdf8">{(tags['KLN1-SNCR-FLOW'] || 240).toFixed(0)} L/h</tspan></text>
              <text x="0" y="66" fill="#94a3b8">ID FAN PWR: <tspan fill="#00d4ff">{(tags['KLN1-ID-FAN-PWR'] || 2780).toFixed(0)} kW</tspan></text>
            </g>

            <text x="90" y="148" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" className="group-hover:underline">
              CLICK TO VIEW PREHEATER →
            </text>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 6: 3-PIER ROTARY KILN & BURNER */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(1070, 320)" 
            className="cursor-pointer group" 
            onClick={() => onNavigateArea && onNavigateArea('KILN')}
          >
            <rect x="0" y="0" width="200" height="150" rx="8" fill="url(#flow-card-grad)" stroke="#334155" strokeWidth="2" filter="url(#card-shadow)" className="group-hover:stroke-cyan-400 transition-colors" />
            <rect x="0" y="0" width="200" height="26" rx="8" fill="#1e293b" />
            <rect x="10" y="7" width="10" height="10" rx="2" fill={getStatus('KLN1-KILN-01') === 'RUNNING' ? '#10b981' : '#ef4444'} />
            <text x="26" y="16" fill="#cbd5e1" fontSize="10" fontWeight="extrabold">4. ROTARY KILN (3-PIER)</text>

            {/* Kiln Graphic */}
            <g transform="translate(15, 38)">
              <rect x="0" y="0" width="80" height="20" rx="2" fill="#ea580c" stroke="#dc2626" />
              <rect x="15" y="-3" width="6" height="26" fill="#334155" />
              <rect x="45" y="-3" width="6" height="26" fill="#334155" />
              <rect x="70" y="-3" width="6" height="26" fill="#334155" />
              {/* Flame */}
              <polygon points="80,10 95,5 92,10 95,15" fill="#fef08a" />
            </g>

            <g transform="translate(15, 75)" className="font-mono text-[9px]">
              <div className="flex justify-between">
                <text x="0" y="10" fill="#94a3b8">BZT TEMP: <tspan fill="#ef4444" fontWeight="bold">{(tags['KLN1-BZ-TEMP'] || 1448).toFixed(0)} °C</tspan></text>
                <text x="100" y="10" fill="#94a3b8">SPEED: <tspan fill="#ffffff">{(tags['KLN1-SPD'] || 3.85).toFixed(2)} RPM</tspan></text>
              </div>
              <text x="0" y="24" fill="#94a3b8">BACK-END: <tspan fill="#f97316">{(tags['KLN1-BE-TEMP'] || 1042).toFixed(0)} °C</tspan></text>
              <text x="0" y="38" fill="#94a3b8">IR SCANNER MAX: <tspan fill="#facc15">{(tags['KLN1-SHELL-SCAN-MAX'] || 342).toFixed(0)} °C</tspan></text>
              <text x="0" y="52" fill="#94a3b8">NOx: <tspan fill="#fb923c">{(tags['KLN1-NOX'] || 410).toFixed(0)} mg</tspan> | O2: <tspan fill="#38bdf8">{(tags['KLN1-O2'] || 2.45).toFixed(1)}%</tspan></text>
            </g>

            <text x="100" y="140" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" className="group-hover:underline">
              CLICK TO VIEW KILN DETAILS →
            </text>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 7: RECIPROCATING GRATE COOLER */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(1330, 320)" 
            className="cursor-pointer group" 
            onClick={() => onNavigateArea && onNavigateArea('COOLER')}
          >
            <rect x="0" y="0" width="180" height="150" rx="8" fill="url(#flow-card-grad)" stroke="#334155" strokeWidth="2" filter="url(#card-shadow)" className="group-hover:stroke-cyan-400 transition-colors" />
            <rect x="0" y="0" width="180" height="26" rx="8" fill="#1e293b" />
            <rect x="10" y="7" width="10" height="10" rx="2" fill={getStatus('CLR1-COOL-01') === 'RUNNING' ? '#10b981' : '#ef4444'} />
            <text x="26" y="16" fill="#cbd5e1" fontSize="10" fontWeight="extrabold">5. GRATE COOLER</text>

            <g transform="translate(20, 40)">
              <polygon points="0,0 60,0 50,25 5,25" fill="#334155" stroke="#64748b" />
              <rect x="55" y="10" width="15" height="15" fill="#475569" />
              <circle cx="62" cy="17" r="4" fill="#f59e0b" />
            </g>

            <g transform="translate(15, 75)" className="font-mono text-[9px]">
              <text x="0" y="10" fill="#94a3b8">SEC AIR: <tspan fill="#ef4444" fontWeight="bold">{(tags['CLR1-SEC-AIR'] || 1045).toFixed(0)} °C</tspan></text>
              <text x="0" y="24" fill="#94a3b8">TERT AIR: <tspan fill="#f97316">{(tags['CLR1-TER-AIR'] || 895).toFixed(0)} °C</tspan></text>
              <text x="0" y="38" fill="#94a3b8">CLINK OUT: <tspan fill="#00ff00">{(tags['CLR1-CLINK-OUT'] || 92).toFixed(0)} °C</tspan></text>
              <text x="0" y="52" fill="#94a3b8">STROKE: <tspan fill="#00d4ff">{(tags['CLR1-GRATE-SPD'] || 14.2).toFixed(1)} SPM</tspan></text>
            </g>

            <text x="90" y="140" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" className="group-hover:underline">
              CLICK TO VIEW COOLER →
            </text>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 8: CLINKER STORAGE DOME / SILO */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g transform="translate(1150, 530)" className="cursor-pointer group" onClick={() => onNavigateArea && onNavigateArea('CT1')}>
            <rect x="0" y="0" width="140" height="140" rx="8" fill="url(#flow-card-grad)" stroke="#334155" strokeWidth="2" filter="url(#card-shadow)" className="group-hover:stroke-cyan-400 transition-colors" />
            <rect x="0" y="0" width="140" height="26" rx="8" fill="#1e293b" />
            <text x="14" y="16" fill="#cbd5e1" fontSize="10" fontWeight="extrabold">CLINKER STORAGE</text>

            <g transform="translate(20, 45)">
              <path d="M 0 35 Q 25 0 50 35 Z" fill="#334155" stroke="#64748b" />
              <rect x="5" y="35" width="40" height="10" fill="#1e293b" stroke="#64748b" />
            </g>

            <g transform="translate(15, 95)" className="font-mono text-[9px]">
              <text x="0" y="0" fill="#94a3b8">DOME LEVEL: <tspan fill="#00ff00" fontWeight="bold">{(tags['CT1-SILO-LVL'] || 65.4).toFixed(1)}%</tspan></text>
              <text x="0" y="15" fill="#94a3b8">STOCK: <tspan fill="#ffffff">42,500 tons</tspan></text>
            </g>

            <text x="70" y="128" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
              DEEP PAN CONVEYOR
            </text>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 9: CEMENT MILL FINISH GRINDING (BALL MILL) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(890, 530)" 
            className="cursor-pointer group" 
            onClick={() => onNavigateArea && onNavigateArea('CM2')}
          >
            <rect x="0" y="0" width="200" height="140" rx="8" fill="url(#flow-card-grad)" stroke="#334155" strokeWidth="2" filter="url(#card-shadow)" className="group-hover:stroke-cyan-400 transition-colors" />
            <rect x="0" y="0" width="200" height="26" rx="8" fill="#1e293b" />
            <rect x="10" y="7" width="10" height="10" rx="2" fill={getStatus('CM2-MILL-01') === 'RUNNING' ? '#10b981' : '#ef4444'} />
            <text x="26" y="16" fill="#cbd5e1" fontSize="10" fontWeight="extrabold">6. CEMENT BALL MILL</text>

            <g transform="translate(20, 38)">
              <rect x="0" y="0" width="60" height="20" rx="2" fill="#334155" stroke="#94a3b8" />
              <line x1="25" y1="0" x2="25" y2="20" stroke="#eab308" strokeWidth="2" />
              <circle cx="10" cy="10" r="3" fill="#64748b" />
              <circle cx="45" cy="10" r="2" fill="#cbd5e1" />
            </g>

            <g transform="translate(15, 75)" className="font-mono text-[9px]">
              <text x="0" y="0" fill="#94a3b8">FEED: <tspan fill="#00ff00" fontWeight="bold">{(tags['CM2-FEED-TOT'] || 195).toFixed(0)} t/h</tspan></text>
              <text x="0" y="14" fill="#94a3b8">MILL PWR: <tspan fill="#00d4ff" fontWeight="bold">{(tags['CM2-PWR'] || 4280).toFixed(0)} kW</tspan></text>
              <text x="0" y="28" fill="#94a3b8">BLAINE: <tspan fill="#a3e635">{(tags['CM2-BLAINE'] || 385).toFixed(0)} m²/kg</tspan></text>
              <text x="0" y="42" fill="#94a3b8">JACKING: <tspan fill="#38bdf8">118 bar</tspan> | O-SEPA: <tspan fill="#ffffff">245 RPM</tspan></text>
            </g>

            <text x="100" y="130" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" className="group-hover:underline">
              CLICK TO VIEW CEMENT MILL →
            </text>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 10: CEMENT SILOS & PACKING / DISPATCH */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(630, 530)" 
            className="cursor-pointer group" 
            onClick={() => onNavigateArea && onNavigateArea('PACKING')}
          >
            <rect x="0" y="0" width="200" height="140" rx="8" fill="url(#flow-card-grad)" stroke="#334155" strokeWidth="2" filter="url(#card-shadow)" className="group-hover:stroke-cyan-400 transition-colors" />
            <rect x="0" y="0" width="200" height="26" rx="8" fill="#1e293b" />
            <text x="14" y="16" fill="#cbd5e1" fontSize="10" fontWeight="extrabold">7. PACKING & DISPATCH</text>

            <g transform="translate(20, 38)">
              {/* Twin Silos */}
              <rect x="0" y="0" width="22" height="30" fill="#1e293b" stroke="#64748b" rx="2" />
              <rect x="26" y="0" width="22" height="30" fill="#1e293b" stroke="#64748b" rx="2" />
              {/* Rotary packer wheel */}
              <circle cx="65" cy="15" r="10" fill="#334155" stroke="#10b981" />
            </g>

            <g transform="translate(15, 80)" className="font-mono text-[9px]">
              <text x="0" y="0" fill="#94a3b8">ROTARY PACKER: <tspan fill="#00ff00" fontWeight="bold">85 bags/min</tspan></text>
              <text x="0" y="14" fill="#94a3b8">BAG WEIGHT: <tspan fill="#ffffff">50.1 kg</tspan></text>
              <text x="0" y="28" fill="#94a3b8">BULK TANKER: <tspan fill="#00d4ff">180 t/h</tspan></text>
              <text x="0" y="42" fill="#94a3b8">SILO 1/2: <tspan fill="#facc15">82% / 58%</tspan></text>
            </g>

            <text x="100" y="130" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" className="group-hover:underline">
              CLICK TO VIEW PACKING →
            </text>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 11: WHRS (WASTE HEAT RECOVERY STEAM TURBINE) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(450, 340)" 
            className="cursor-pointer group" 
            onClick={() => onNavigateArea && onNavigateArea('POWER')}
          >
            <rect x="0" y="0" width="220" height="130" rx="8" fill="url(#flow-card-grad)" stroke="#10b981" strokeWidth="2" filter="url(#card-shadow)" className="group-hover:stroke-emerald-400 transition-colors" />
            <rect x="0" y="0" width="220" height="26" rx="8" fill="#064e3b" />
            <rect x="10" y="7" width="10" height="10" rx="2" fill={getStatus('WHRS-GEN-01') === 'RUNNING' ? '#10b981' : '#ef4444'} />
            <text x="26" y="16" fill="#ecfdf5" fontSize="10" fontWeight="extrabold">WHRS HEAT RECOVERY (GREEN POWER)</text>

            <g transform="translate(15, 38)">
              {/* Steam Turbine Generator icon */}
              <rect x="0" y="0" width="30" height="24" fill="#0f172a" stroke="#10b981" rx="2" />
              <polygon points="5,5 25,12 5,19" fill="#10b981" />
              <circle cx="45" cy="12" r="10" fill="#334155" stroke="#38bdf8" />
              <text x="45" y="15" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">GEN</text>
            </g>

            <g transform="translate(75, 40)" className="font-mono text-[9px]">
              <text x="0" y="10" fill="#cbd5e1">OUTPUT: <tspan fill="#00ff00" fontWeight="extrabold">{(tags['WHRS-TURBINE-MW'] || 6.45).toFixed(2)} MW</tspan></text>
              <text x="0" y="24" fill="#94a3b8">SP STEAM: <tspan fill="#ffffff">325°C • 18.5 bar</tspan></text>
              <text x="0" y="38" fill="#94a3b8">AQC STEAM: <tspan fill="#ffffff">340°C • 14 t/h</tspan></text>
              <text x="0" y="52" fill="#94a3b8">VACUUM: <tspan fill="#38bdf8">0.91 bar</tspan></text>
            </g>

            <text x="110" y="118" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle" className="group-hover:underline">
              CLICK TO VIEW WHRS POWER →
            </text>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 12: COAL MILL & ATEX EXPLOSION PROTECTION */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(150, 340)" 
            className="cursor-pointer group" 
            onClick={() => onNavigateArea && onNavigateArea('CM1')}
          >
            <rect x="0" y="0" width="220" height="130" rx="8" fill="url(#flow-card-grad)" stroke="#334155" strokeWidth="2" filter="url(#card-shadow)" className="group-hover:stroke-cyan-400 transition-colors" />
            <rect x="0" y="0" width="220" height="26" rx="8" fill="#1e293b" />
            <rect x="10" y="7" width="10" height="10" rx="2" fill={getStatus('CM1-VRM-01') === 'RUNNING' ? '#10b981' : '#ef4444'} />
            <text x="26" y="16" fill="#cbd5e1" fontSize="10" fontWeight="extrabold">COAL MILL (ATEX SAFE)</text>

            <g transform="translate(15, 40)">
              <rect x="0" y="0" width="30" height="35" fill="#1e293b" stroke="#f97316" rx="2" />
              <text x="15" y="20" fill="#f97316" fontSize="7" fontWeight="bold" textAnchor="middle">COAL</text>
            </g>

            <g transform="translate(60, 42)" className="font-mono text-[9px]">
              <text x="0" y="10" fill="#94a3b8">FEED: <tspan fill="#00ff00">{(tags['CM1-FEED'] || 28.5).toFixed(1)} t/h</tspan></text>
              <text x="0" y="24" fill="#94a3b8">KILN COAL: <tspan fill="#f97316">{(tags['CM1-INJ-KILN'] || 11.8).toFixed(1)} t/h</tspan></text>
              <text x="0" y="38" fill="#94a3b8">CALC COAL: <tspan fill="#f97316">{(tags['CM1-INJ-CALC'] || 16.2).toFixed(1)} t/h</tspan></text>
              <text x="0" y="52" fill="#94a3b8">O2 / CO: <tspan fill="#00ff00">5.2% / 85 ppm</tspan></text>
            </g>

            <text x="110" y="118" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" className="group-hover:underline">
              CLICK TO VIEW COAL MILL →
            </text>
          </g>

        </svg>
      </div>

      {/* BOTTOM PLANT LEGEND BAR */}
      <div className="flex items-center justify-between px-5 py-2 bg-[#070b14] border-t border-gray-800 text-[11px] text-gray-400">
        <div className="flex items-center gap-6">
          <span className="font-bold text-gray-300">MEDIA COLOR CODING (ISA-101):</span>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#ef4444]" /><span>Hot Flue Gas (1000°C)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#0284c7]" /><span>Cooling / Ambient Air</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#94a3b8]" /><span>Raw Meal / Feed</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#d97706]" /><span>Hot Clinker (1450°C)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#0ea5e9]" /><span>WHRS High Pressure Steam</span></div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-400">STATUS:</span>
          <span className="flex items-center gap-1 text-[#00ff00] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
            CONTINUOUS CLOSED-LOOP SIMULATION RUNNING
          </span>
        </div>
      </div>

    </div>
  );
};
