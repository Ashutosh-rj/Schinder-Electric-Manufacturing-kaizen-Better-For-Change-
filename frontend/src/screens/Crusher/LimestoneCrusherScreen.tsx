import React, { useState } from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { scadaAudio } from '../../engine/scadaAudio';
import { 
  TrendingUp, Clock, Wrench, Shield, RotateCcw, 
  AlertTriangle, CheckCircle2, ChevronRight, Activity 
} from 'lucide-react';

interface ScreenProps {
  onOpenFaceplate?: (eqId: string) => void;
}

export const LimestoneCrusherScreen: React.FC<ScreenProps> = ({ onOpenFaceplate }) => {
  const tags = useScadaStore((s) => s.tags);
  const equipment = useScadaStore((s) => s.equipment);
  const alarms = useScadaStore((s) => s.alarms);
  const activeScenario = useScadaStore((s) => s.activeScenario);

  const getEq = (id: string) => equipment[id] || { status: 'RUNNING', mode: 'AUTO' };

  const handleEqClick = (id: string) => {
    scadaAudio.playClick();
    if (onOpenFaceplate) onOpenFaceplate(id);
  };

  const isTrampMetal = activeScenario === 'TRAMP_METAL';

  // Live telemetry values with realistic defaults matching reference
  const totalStock = tags['CR-STOCK-TOT'] || 325680;
  const availStock = tags['CR-STOCK-AVAIL'] || 310420;
  const reclaimRate = tags['CR-RECLAIM-RATE'] || 1150;
  const afFeed = tags['CR-AF-FEED'] || 1045;
  const afSpeed = tags['CR-AF-SPD'] || 32.0;
  const afCur = tags['CR-AF-CUR'] || 45.2;
  const afPwr = tags['CR-AF-PWR'] || 38.6;

  const crPwr = tags['CR-CR-PWR'] || 420;
  const crCur = tags['CR-CR-CUR'] || 612;
  const crLoad = tags['CR-CR-LOAD'] || 72;

  const bc101Spd = tags['CR-BC101-SPD'] || 2.5;
  const bc101Load = tags['CR-BC101-LOAD'] || 680;
  const bc101Cur = tags['CR-BC101-CUR'] || 52;
  const bc101Pwr = tags['CR-BC101-PWR'] || 37;

  const bc102Spd = tags['CR-BC102-SPD'] ?? 3.0;
  const bc102Load = tags['CR-BC102-LOAD'] ?? 1040;
  const bc102Cur = tags['CR-BC102-CUR'] ?? 88;
  const bc102Pwr = tags['CR-BC102-PWR'] ?? 75;

  const bc103Spd = tags['CR-BC103-SPD'] || 3.0;
  const bc103Load = tags['CR-BC103-LOAD'] || 1020;
  const bc103Cur = tags['CR-BC103-CUR'] || 82;
  const bc103Pwr = tags['CR-BC103-PWR'] || 71;

  const bc104Spd = tags['CR-BC104-SPD'] || 3.5;
  const bc104Load = tags['CR-BC104-LOAD'] || 990;
  const bc104Cur = tags['CR-BC104-CUR'] || 95;
  const bc104Pwr = tags['CR-BC104-PWR'] || 90;

  const dcDp = tags['CR-DC-DP'] || 1250;
  const dcInTemp = tags['CR-DC-IN-TEMP'] || 68;
  const dcOutTemp = tags['CR-DC-OUT-TEMP'] || 54;
  const dcCur = tags['CR-DC-CUR'] || 82;
  const dcPwr = tags['CR-DC-PWR'] || 45;

  const stEmission = tags['CR-ST-EMISSION'] || 8.5;
  const stFlow = tags['CR-ST-FLOW'] || 42300;
  const stTemp = tags['CR-ST-TEMP'] || 62;

  const acPr = tags['UT-AC-PR'] || 7.8;
  const acCur = tags['UT-AC-CUR'] || 68;

  const todayProd = tags['CR-PROD-TODAY'] || 21450;
  const yestProd = tags['CR-PROD-YEST'] || 20980;
  const availPct = tags['CR-AVAIL'] || 96.8;

  return (
    <div className="w-full h-full flex flex-col bg-[#09101b] text-white overflow-hidden select-none font-sans">
      
      {/* ── HEADER BANNER ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-2 bg-[#060a12] border-b border-gray-800">
        <div>
          <h1 className="text-lg font-black tracking-wide text-white flex items-center gap-2">
            LIMESTONE CRUSHER & RECLAIMER
          </h1>
          <div className="text-[11px] font-bold text-emerald-400 tracking-wider">
            CRUSHING TODAY FOR A SUSTAINABLE TOMORROW
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-[#111927] border border-gray-700/80 px-3 py-1 rounded flex items-center gap-2">
            <span className="text-gray-400">HOPPER LEVEL:</span>
            <span className="text-[#00ff00] font-bold">{(tags['CR-HOP-LVL'] || 68).toFixed(0)} %</span>
          </div>
          <div className="bg-[#111927] border border-gray-700/80 px-3 py-1 rounded flex items-center gap-2">
            <span className="text-gray-400">TOTAL FEED:</span>
            <span className="text-cyan-400 font-bold">{afFeed.toFixed(0)} t/h</span>
          </div>
          <div className="bg-[#111927] border border-gray-700/80 px-3 py-1 rounded flex items-center gap-2">
            <span className="text-gray-400">CRUSHER POWER:</span>
            <span className="text-amber-400 font-bold">{crPwr.toFixed(0)} kW</span>
          </div>
        </div>
      </div>

      {/* ── MAIN SCADA SCHEMATIC VIEWPORT (1600x680 coordinate space) ── */}
      <div className="flex-1 relative w-full h-full bg-[#0b1424] overflow-hidden">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1600 680" 
          preserveAspectRatio="xMidYMid meet"
        >
          {/* DEFINITIONS & TEXTURES */}
          <defs>
            {/* Rock texture pattern */}
            <pattern id="rock-pile" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#475569" />
              <polygon points="2,2 8,5 6,10 1,7" fill="#64748b" opacity="0.6" />
              <polygon points="12,4 18,2 19,9 11,8" fill="#334155" opacity="0.8" />
              <polygon points="4,12 10,14 8,19 2,17" fill="#94a3b8" opacity="0.5" />
              <polygon points="13,11 19,13 18,19 12,18" fill="#1e293b" opacity="0.7" />
            </pattern>

            {/* Industrial conveyor belt gradient */}
            <linearGradient id="belt-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Duct gradient */}
            <linearGradient id="duct-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 1. LIMESTONE YARD STOCKPILE & RECLAIMER (CR-RC-01)          */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g transform="translate(40, 90)">
            {/* Stockpile rock pile */}
            <polygon points="0,240 70,160 160,160 230,240" fill="url(#rock-pile)" stroke="#64748b" strokeWidth="2" />
            <line x1="-10" y1="240" x2="240" y2="240" stroke="#334155" strokeWidth="4" />

            {/* Bucket Wheel Reclaimer Arm */}
            <g 
              transform="translate(100, 100)" 
              className="cursor-pointer group"
              onClick={() => handleEqClick('CR-RC-01')}
            >
              {/* Lattice Mast */}
              <polygon points="20,140 35,50 45,50 60,140" fill="#334155" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="25" y1="120" x2="55" y2="70" stroke="#f59e0b" strokeWidth="1" />
              <line x1="25" y1="70" x2="55" y2="120" stroke="#f59e0b" strokeWidth="1" />
              
              {/* Boom Arm */}
              <line x1="40" y1="60" x2="170" y2="135" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
              <line x1="40" y1="60" x2="170" y2="135" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />

              {/* Bucket Wheel Rotating */}
              <g transform="translate(170, 135)">
                <circle cx="0" cy="0" r="24" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
                {Array.from({ length: 8 }).map((_, i) => (
                  <g key={i} transform={`rotate(${i * 45})`}>
                    <line x1="0" y1="0" x2="0" y2="-24" stroke="#f59e0b" strokeWidth="2" />
                    <path d="M -4 -24 L 4 -24 L 2 -18 L -2 -18 Z" fill="#94a3b8" />
                  </g>
                ))}
                <circle cx="0" cy="0" r="7" fill="#00ff00" />
              </g>

              {/* Label Badge */}
              <rect x="100" y="30" width="95" height="20" rx="3" fill="#090f1d" stroke="#334155" />
              <text x="147" y="43" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">LS RECLAIMER</text>
              <text x="147" y="52" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">CR-RC-01</text>
              <rect x="198" y="32" width="30" height="16" rx="2" fill="#065f46" stroke="#10b981" />
              <text x="213" y="44" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">RUN</text>
            </g>

            {/* Limestone Yard Info Card */}
            <g transform="translate(10, 20)">
              <rect x="0" y="0" width="165" height="110" rx="4" fill="#090f1d" stroke="#00d4ff" strokeWidth="1.5" />
              <rect x="0" y="0" width="165" height="20" rx="4" fill="#162338" />
              <text x="8" y="14" fill="#00d4ff" fontSize="10" fontWeight="extrabold">LIMESTONE YARD</text>

              <g transform="translate(8, 34)" className="text-[9px] font-mono">
                <text x="0" y="0" fill="#94a3b8">Total Stock:</text>
                <text x="150" y="0" fill="#00ff00" fontWeight="bold" textAnchor="end">{totalStock.toLocaleString()} t</text>
                
                <text x="0" y="16" fill="#94a3b8">Available Stock:</text>
                <text x="150" y="16" fill="#00ff00" fontWeight="bold" textAnchor="end">{availStock.toLocaleString()} t</text>
                
                <text x="0" y="32" fill="#94a3b8">Reclaim Rate:</text>
                <text x="150" y="32" fill="#00ff00" fontWeight="bold" textAnchor="end">{reclaimRate.toFixed(0)} t/h</text>
                
                <text x="0" y="48" fill="#94a3b8">Stacker Status:</text>
                <text x="150" y="48" fill="#ef4444" fontWeight="bold" textAnchor="end">STOP</text>
                
                <text x="0" y="64" fill="#94a3b8">Reclaimer Status:</text>
                <text x="150" y="64" fill="#00ff00" fontWeight="bold" textAnchor="end">RUN</text>
              </g>
            </g>

            {/* Reclaimer specs box */}
            <g transform="translate(10, 255)">
              <rect x="0" y="0" width="145" height="48" rx="3" fill="#090f1d" stroke="#334155" />
              <g transform="translate(8, 14)" className="text-[9px] font-mono">
                <text x="0" y="0" fill="#94a3b8">Travel:</text>
                <text x="130" y="0" fill="#00ff00" textAnchor="end">12.4 m/min</text>
                <text x="0" y="14" fill="#94a3b8">Bucket Wheel:</text>
                <text x="130" y="14" fill="#00ff00" textAnchor="end">5.8 rpm</text>
                <text x="0" y="28" fill="#94a3b8">Reclaim Rate:</text>
                <text x="130" y="28" fill="#00ff00" textAnchor="end">{reclaimRate.toFixed(0)} t/h</text>
              </g>
            </g>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* CONVEYOR BC-101                                             */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g transform="translate(280, 310)" className="cursor-pointer" onClick={() => handleEqClick('CR-BC-101')}>
            {/* Belt frame */}
            <line x1="0" y1="20" x2="160" y2="20" stroke="#475569" strokeWidth="6" />
            <circle cx="5" cy="20" r="10" fill="#1e293b" stroke="#64748b" />
            <circle cx="155" cy="20" r="10" fill="#1e293b" stroke="#64748b" />
            {/* Moving limestone on belt */}
            <path d="M 5 14 L 155 14" stroke="#94a3b8" strokeWidth="4" strokeDasharray="6 4">
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />
            </path>
            {/* Motor */}
            <circle cx="155" cy="35" r="8" fill="#10b981" />
            <text x="75" y="10" fill="#00d4ff" fontSize="8" fontWeight="bold">BC-101 →</text>

            {/* BC-101 Data Box */}
            <g transform="translate(-10, 48)">
              <rect x="0" y="0" width="130" height="72" rx="3" fill="#090f1d" stroke="#334155" />
              <rect x="0" y="0" width="130" height="15" rx="3" fill="#162338" />
              <text x="6" y="11" fill="#00d4ff" fontSize="8" fontWeight="extrabold">BC-101</text>
              <g transform="translate(6, 26)" className="text-[8px] font-mono">
                <text x="0" y="0" fill="#94a3b8">Speed:</text><text x="115" y="0" fill="#00ff00" textAnchor="end">{bc101Spd.toFixed(1)} m/s</text>
                <text x="0" y="11" fill="#94a3b8">Belt Load:</text><text x="115" y="11" fill="#00ff00" textAnchor="end">{bc101Load.toFixed(0)} t/h</text>
                <text x="0" y="22" fill="#94a3b8">Motor Current:</text><text x="115" y="22" fill="#00ff00" textAnchor="end">{bc101Cur.toFixed(0)} A</text>
                <text x="0" y="33" fill="#94a3b8">Power:</text><text x="115" y="33" fill="#00ff00" textAnchor="end">{bc101Pwr.toFixed(0)} kW</text>
                <text x="0" y="44" fill="#94a3b8">Status:</text><text x="115" y="44" fill="#00ff00" fontWeight="bold" textAnchor="end">RUN</text>
              </g>
            </g>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 2. PRIMARY HOPPER & APRON FEEDER (CR-HOP-01 & CR-AF-01)     */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g transform="translate(560, 40)">
            {/* Hopper Title */}
            <text x="90" y="12" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">PRIMARY HOPPER</text>
            <text x="90" y="22" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">CR-HOP-01</text>

            {/* Level box on left */}
            <g transform="translate(-75, 30)">
              <rect x="0" y="0" width="65" height="50" rx="3" fill="#090f1d" stroke="#334155" />
              <g transform="translate(6, 14)" className="text-[8px] font-mono">
                <text x="0" y="0" fill="#94a3b8">Level</text><text x="52" y="0" fill="#00ff00" fontWeight="bold" textAnchor="end">68 %</text>
                <text x="0" y="14" fill="#94a3b8">High</text><text x="52" y="14" fill="#ffffff" textAnchor="end">90 %</text>
                <text x="0" y="28" fill="#94a3b8">Low</text><text x="52" y="28" fill="#ffffff" textAnchor="end">20 %</text>
              </g>
            </g>

            {/* Primary Hopper Bin with rocks */}
            <polygon points="10,35 170,35 140,115 40,115" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
            <polygon points="15,40 165,40 138,112 42,112" fill="url(#rock-pile)" opacity="0.85" />

            {/* Apron Feeder unit below Hopper */}
            <g 
              transform="translate(25, 120)" 
              className="cursor-pointer group"
              onClick={() => handleEqClick('CR-AF-01')}
            >
              <rect x="0" y="0" width="130" height="35" rx="3" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
              {/* Moving apron pans */}
              {Array.from({ length: 8 }).map((_, i) => (
                <rect key={i} x={10 + i * 14} y="5" width="10" height="25" fill="#334155" stroke="#475569" />
              ))}
              <circle cx="10" cy="17" r="10" fill="#1e293b" stroke="#00ff00" />
              <circle cx="120" cy="17" r="10" fill="#1e293b" stroke="#00ff00" />
              
              {/* Hydraulic Drive Motor */}
              <rect x="-25" y="5" width="22" height="25" rx="2" fill="#10b981" stroke="#047857" />
              <text x="-14" y="21" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">M</text>

              {/* Title & Status */}
              <text x="65" y="-5" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">APRON FEEDER</text>
              <text x="65" y="48" fill="#94a3b8" fontSize="7" textAnchor="middle">CR-AF-01</text>
              <rect x="48" y="53" width="34" height="15" rx="2" fill="#065f46" stroke="#10b981" />
              <text x="65" y="64" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">RUN</text>
            </g>

            {/* Apron Feeder Parameters Data Box */}
            <g transform="translate(180, 90)">
              <rect x="0" y="0" width="120" height="60" rx="3" fill="#090f1d" stroke="#334155" />
              <g transform="translate(8, 14)" className="text-[8px] font-mono">
                <text x="0" y="0" fill="#94a3b8">Speed:</text><text x="105" y="0" fill="#00ff00" textAnchor="end">{afSpeed.toFixed(1)} Hz</text>
                <text x="0" y="12" fill="#94a3b8">Current:</text><text x="105" y="12" fill="#00ff00" textAnchor="end">{afCur.toFixed(1)} A</text>
                <text x="0" y="24" fill="#94a3b8">Power:</text><text x="105" y="24" fill="#00ff00" textAnchor="end">{afPwr.toFixed(1)} kW</text>
                <text x="0" y="36" fill="#94a3b8">Feed Rate:</text><text x="105" y="36" fill="#00ff00" fontWeight="bold" textAnchor="end">{afFeed.toFixed(0)} t/h</text>
              </g>
            </g>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 3. PRIMARY IMPACT CRUSHER (CR-CR-01)                        */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(630, 240)" 
            className="cursor-pointer group"
            onClick={() => handleEqClick('CR-CR-01')}
          >
            {/* Cutaway Crusher Body */}
            <polygon points="-50,0 50,0 60,60 40,110 -40,110 -60,60" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
            <line x1="-30" y1="20" x2="-45" y2="80" stroke="#f59e0b" strokeWidth="4" />
            <line x1="30" y1="20" x2="45" y2="80" stroke="#f59e0b" strokeWidth="4" />

            {/* Rotating Hammer Rotor */}
            <circle cx="0" cy="55" r="28" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
            <g transform="translate(0, 55)">
              <line x1="-28" y1="0" x2="28" y2="0" stroke="#f59e0b" strokeWidth="5" />
              <line x1="0" y1="-28" x2="0" y2="28" stroke="#f59e0b" strokeWidth="5" />
              <circle cx="0" cy="0" r="10" fill="#10b981" />
            </g>

            {/* Falling crushed stones */}
            <circle cx="-10" cy="85" r="3" fill="#94a3b8" />
            <circle cx="8" cy="95" r="4" fill="#cbd5e1" />
            <circle cx="0" cy="115" r="2.5" fill="#64748b" />

            {/* Label & Status */}
            <text x="80" y="40" fill="#ffffff" fontSize="9" fontWeight="bold">PRIMARY CRUSHER</text>
            <text x="80" y="52" fill="#94a3b8" fontSize="7" fontFamily="monospace">CR-CR-01</text>
            <rect x="80" y="58" width="34" height="15" rx="2" fill="#065f46" stroke="#10b981" />
            <text x="97" y="69" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">RUN</text>

            {/* Crusher Motor Power Box */}
            <g transform="translate(-160, 10)">
              <rect x="0" y="0" width="140" height="74" rx="3" fill="#090f1d" stroke="#334155" />
              <rect x="0" y="0" width="140" height="15" rx="3" fill="#162338" />
              <text x="6" y="11" fill="#cbd5e1" fontSize="8" fontWeight="bold">Motor Power CRUSHER</text>
              <g transform="translate(6, 26)" className="text-[8px] font-mono">
                <text x="0" y="0" fill="#94a3b8">Motor Power:</text><text x="125" y="0" fill="#00ff00" textAnchor="end">{crPwr.toFixed(0)} kW</text>
                <text x="0" y="11" fill="#94a3b8">Motor Current:</text><text x="125" y="11" fill="#00ff00" textAnchor="end">{crCur.toFixed(0)} A</text>
                <text x="0" y="22" fill="#94a3b8">Inlet Size:</text><text x="125" y="22" fill="#00d4ff" textAnchor="end">&lt; 800 mm</text>
                <text x="0" y="33" fill="#94a3b8">Outlet Size:</text><text x="125" y="33" fill="#00d4ff" textAnchor="end">&lt; 150 mm</text>
                <text x="0" y="44" fill="#94a3b8">Crushing Load:</text><text x="125" y="44" fill="#00ff00" textAnchor="end">{crLoad.toFixed(0)} %</text>
              </g>
            </g>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* CONVEYOR BC-102 & TRAMP METAL DETECTOR (CR-MD-01)           */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g transform="translate(580, 395)">
            {/* Belt Line */}
            <line x1="0" y1="20" x2="260" y2="20" stroke="#475569" strokeWidth="6" />
            <circle cx="5" cy="20" r="10" fill="#1e293b" stroke="#64748b" />
            <circle cx="255" cy="20" r="10" fill="#1e293b" stroke="#64748b" />
            
            {/* Material Moving */}
            <path d="M 5 14 L 255 14" stroke="#94a3b8" strokeWidth="4" strokeDasharray="6 4">
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />
            </path>
            <text x="90" y="35" fill="#00d4ff" fontSize="8" fontWeight="bold">BC-102 →</text>

            {/* In-Line Metal Detector */}
            <g 
              transform="translate(170, 0)" 
              className="cursor-pointer"
              onClick={() => handleEqClick('CR-MD-01')}
            >
              <rect x="-10" y="5" width="20" height="30" fill="#0f172a" stroke={isTrampMetal ? '#ef4444' : '#00d4ff'} strokeWidth="2" rx="2" />
              <text x="0" y="-8" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">METAL DETECTOR</text>
              <text x="0" y="2" fill="#94a3b8" fontSize="7" textAnchor="middle">CR-MD-01</text>
              <rect x="-18" y="38" width="36" height="15" rx="2" fill={isTrampMetal ? '#7f1d1d' : '#065f46'} stroke={isTrampMetal ? '#ef4444' : '#10b981'} />
              <text x="0" y="49" fill={isTrampMetal ? '#fca5a5' : '#34d399'} fontSize="8" fontWeight="bold" textAnchor="middle">
                {isTrampMetal ? 'TRIP' : 'NORMAL'}
              </text>

              {/* Tramp Metal Reject Chute */}
              <polygon points="-8,55 8,55 12,85 -12,85" fill="#1e293b" stroke="#475569" />
              <rect x="-18" y="85" width="36" height="18" fill="#334155" stroke="#64748b" rx="2" />
              <text x="0" y="97" fill="#cbd5e1" fontSize="6" fontWeight="bold" textAnchor="middle">TRAMP METAL</text>
            </g>

            {/* BC-102 Data Box */}
            <g transform="translate(-140, 20)">
              <rect x="0" y="0" width="130" height="72" rx="3" fill="#090f1d" stroke="#334155" />
              <rect x="0" y="0" width="130" height="15" rx="3" fill="#162338" />
              <text x="6" y="11" fill="#00d4ff" fontSize="8" fontWeight="extrabold">BC-102</text>
              <g transform="translate(6, 26)" className="text-[8px] font-mono">
                <text x="0" y="0" fill="#94a3b8">Speed:</text><text x="115" y="0" fill="#00ff00" textAnchor="end">{bc102Spd.toFixed(1)} m/s</text>
                <text x="0" y="11" fill="#94a3b8">Belt Load:</text><text x="115" y="11" fill="#00ff00" textAnchor="end">{bc102Load.toFixed(0)} t/h</text>
                <text x="0" y="22" fill="#94a3b8">Motor Current:</text><text x="115" y="22" fill="#00ff00" textAnchor="end">{bc102Cur.toFixed(0)} A</text>
                <text x="0" y="33" fill="#94a3b8">Power:</text><text x="115" y="33" fill="#00ff00" textAnchor="end">{bc102Pwr.toFixed(0)} kW</text>
                <text x="0" y="44" fill="#94a3b8">Status:</text><text x="115" y="44" fill={isTrampMetal ? '#ef4444' : '#00ff00'} fontWeight="bold" textAnchor="end">{isTrampMetal ? 'STOP' : 'RUN'}</text>
              </g>
            </g>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TRANSFER CHUTE (CR-TC-01) & DUST PIPING                     */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g transform="translate(860, 395)">
            <rect x="0" y="0" width="30" height="50" fill="#1e293b" stroke="#475569" rx="2" />
            <text x="40" y="15" fill="#ffffff" fontSize="8" fontWeight="bold">TRANSFER CHUTE</text>
            <text x="40" y="25" fill="#94a3b8" fontSize="7">CR-TC-01</text>

            {/* Dust extraction line going up to Bag Filter */}
            <path d="M 15 0 L 15 -180 L 120 -180" fill="none" stroke="url(#duct-grad)" strokeWidth="8" strokeLinecap="round" />
            <text x="25" y="-100" fill="#38bdf8" fontSize="7" fontWeight="bold">DUST</text>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 4. DUST COLLECTOR (BAG FILTER CR-DC-01) & STACK             */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(980, 90)" 
            className="cursor-pointer group"
            onClick={() => handleEqClick('CR-DC-01')}
          >
            {/* Baghouse Title */}
            <text x="90" y="0" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">DUST COLLECTOR (BAG FILTER)</text>
            <text x="90" y="10" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">CR-DC-01</text>

            {/* Filter Main Chamber with Pulse Valves */}
            <rect x="0" y="18" width="180" height="60" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            {/* Pulse Jet Solenoid Valves on top */}
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x={8 + i * 14} y="10" width="8" height="8" fill="#38bdf8" stroke="#0284c7" />
            ))}

            {/* 3 Hopper Cones below */}
            <polygon points="10,78 60,78 45,118 25,118" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <polygon points="65,78 115,78 100,118 80,118" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <polygon points="120,78 170,78 155,118 135,118" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            
            {/* Rotary airlocks below hoppers */}
            <circle cx="35" cy="124" r="5" fill="#334155" stroke="#10b981" />
            <circle cx="90" cy="124" r="5" fill="#334155" stroke="#10b981" />
            <circle cx="145" cy="124" r="5" fill="#334155" stroke="#10b981" />

            {/* Extraction Duct to ID Fan */}
            <path d="M 180 40 L 220 40 L 220 140 L 250 140" fill="none" stroke="url(#duct-grad)" strokeWidth="10" />

            {/* ID Fan */}
            <circle cx="265" cy="140" r="18" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
            <circle cx="265" cy="140" r="7" fill="#10b981" />

            {/* Chimney Stack (CR-ST-01) */}
            <polygon points="300,160 325,160 320,0 305,0" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <path d="M 312 0 Q 320 -30 335 -60" stroke="#cbd5e1" strokeWidth="6" fill="none" opacity="0.4" strokeLinecap="round" />
            
            <text x="350" y="2" fill="#ffffff" fontSize="8" fontWeight="bold">STACK</text>
            <text x="350" y="12" fill="#94a3b8" fontSize="7">CR-ST-01</text>

            {/* Stack Emission Data */}
            <g transform="translate(350, 22)" className="text-[8px] font-mono">
              <text x="0" y="0" fill="#94a3b8">Emission:</text><text x="75" y="0" fill="#00ff00" textAnchor="end">{stEmission.toFixed(1)} mg/Nm³</text>
              <text x="0" y="12" fill="#94a3b8">Flow:</text><text x="75" y="12" fill="#ffffff" textAnchor="end">{stFlow.toLocaleString()} Nm³/h</text>
              <text x="0" y="24" fill="#94a3b8">Temp:</text><text x="75" y="24" fill="#ffffff" textAnchor="end">{stTemp.toFixed(0)} °C</text>
            </g>

            {/* Bag Filter Data Box */}
            <g transform="translate(195, 20)">
              <rect x="0" y="0" width="105" height="74" rx="3" fill="#090f1d" stroke="#334155" />
              <g transform="translate(6, 14)" className="text-[8px] font-mono">
                <text x="0" y="0" fill="#94a3b8">DP:</text><text x="92" y="0" fill="#00ff00" fontWeight="bold" textAnchor="end">{dcDp.toFixed(0)} Pa</text>
                <text x="0" y="11" fill="#94a3b8">Inlet Temp:</text><text x="92" y="11" fill="#ffffff" textAnchor="end">{dcInTemp.toFixed(0)} °C</text>
                <text x="0" y="22" fill="#94a3b8">Outlet Temp:</text><text x="92" y="22" fill="#ffffff" textAnchor="end">{dcOutTemp.toFixed(0)} °C</text>
                <text x="0" y="33" fill="#94a3b8">Fan Current:</text><text x="92" y="33" fill="#00ff00" textAnchor="end">{dcCur.toFixed(0)} A</text>
                <text x="0" y="44" fill="#94a3b8">Fan Power:</text><text x="92" y="44" fill="#00ff00" textAnchor="end">{dcPwr.toFixed(0)} kW</text>
                <text x="0" y="55" fill="#94a3b8">Status:</text><text x="92" y="55" fill="#00ff00" fontWeight="bold" textAnchor="end">RUN</text>
              </g>
            </g>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* AIR COMPRESSOR (UT-AC-01)                                   */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g 
            transform="translate(1220, 270)" 
            className="cursor-pointer group"
            onClick={() => handleEqClick('UT-AC-01')}
          >
            <rect x="0" y="0" width="70" height="42" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="20" cy="21" r="12" fill="#0f172a" />
            <text x="20" y="25" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">M</text>
            <rect x="42" y="8" width="22" height="26" rx="2" fill="#1e293b" />

            <text x="80" y="12" fill="#ffffff" fontSize="8" fontWeight="bold">AIR COMPRESSOR</text>
            <text x="80" y="22" fill="#94a3b8" fontSize="7">UT-AC-01</text>
            <g transform="translate(80, 32)" className="text-[8px] font-mono">
              <text x="0" y="0" fill="#94a3b8">Discharge P:</text><text x="90" y="0" fill="#00ff00" textAnchor="end">{acPr.toFixed(1)} bar</text>
              <text x="0" y="10" fill="#94a3b8">Motor Current:</text><text x="90" y="10" fill="#00ff00" textAnchor="end">{acCur.toFixed(0)} A</text>
              <text x="0" y="20" fill="#94a3b8">Status:</text><text x="90" y="20" fill="#00ff00" fontWeight="bold" textAnchor="end">RUN</text>
            </g>
          </g>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* CONVEYOR BC-103 & BC-104 TO RAW HOPPER                      */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <g transform="translate(900, 420)">
            {/* BC-103 */}
            <line x1="0" y1="20" x2="180" y2="20" stroke="#475569" strokeWidth="6" />
            <circle cx="5" cy="20" r="10" fill="#1e293b" stroke="#64748b" />
            <circle cx="175" cy="20" r="10" fill="#1e293b" stroke="#64748b" />
            <path d="M 5 14 L 175 14" stroke="#94a3b8" strokeWidth="4" strokeDasharray="6 4">
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />
            </path>
            <text x="80" y="10" fill="#00d4ff" fontSize="8" fontWeight="bold">BC-103 →</text>

            {/* BC-103 Data Box */}
            <g transform="translate(5, 30)">
              <rect x="0" y="0" width="125" height="72" rx="3" fill="#090f1d" stroke="#334155" />
              <rect x="0" y="0" width="125" height="15" rx="3" fill="#162338" />
              <text x="6" y="11" fill="#00d4ff" fontSize="8" fontWeight="extrabold">BC-103</text>
              <g transform="translate(6, 26)" className="text-[8px] font-mono">
                <text x="0" y="0" fill="#94a3b8">Speed:</text><text x="110" y="0" fill="#00ff00" textAnchor="end">{bc103Spd.toFixed(1)} m/s</text>
                <text x="0" y="11" fill="#94a3b8">Belt Load:</text><text x="110" y="11" fill="#00ff00" textAnchor="end">{bc103Load.toFixed(0)} t/h</text>
                <text x="0" y="22" fill="#94a3b8">Motor Current:</text><text x="110" y="22" fill="#00ff00" textAnchor="end">{bc103Cur.toFixed(0)} A</text>
                <text x="0" y="33" fill="#94a3b8">Power:</text><text x="110" y="33" fill="#00ff00" textAnchor="end">{bc103Pwr.toFixed(0)} kW</text>
                <text x="0" y="44" fill="#94a3b8">Status:</text><text x="110" y="44" fill="#00ff00" fontWeight="bold" textAnchor="end">RUN</text>
              </g>
            </g>

            {/* BC-104 (Inclined conveyor up to Raw Mill Hopper) */}
            <g transform="translate(190, 0)">
              <line x1="0" y1="20" x2="280" y2="-40" stroke="#475569" strokeWidth="6" />
              <circle cx="5" cy="20" r="10" fill="#1e293b" stroke="#64748b" />
              <circle cx="275" cy="-40" r="10" fill="#1e293b" stroke="#64748b" />
              <path d="M 5 14 L 275 -46" stroke="#94a3b8" strokeWidth="4" strokeDasharray="6 4">
                <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />
              </path>
              <text x="130" y="-20" fill="#00d4ff" fontSize="8" fontWeight="bold">BC-104 →</text>

              {/* Destination Arrow Box */}
              <g transform="translate(260, -75)">
                <rect x="0" y="0" width="170" height="24" rx="3" fill="#090f1d" stroke="#10b981" strokeWidth="1.5" />
                <text x="85" y="15" fill="#34d399" fontSize="8" fontWeight="extrabold" textAnchor="middle">
                  TO RAW MATERIAL HOPPER RMH-01 →
                </text>
              </g>

              {/* BC-104 Data Box */}
              <g transform="translate(70, 30)">
                <rect x="0" y="0" width="125" height="72" rx="3" fill="#090f1d" stroke="#334155" />
                <rect x="0" y="0" width="125" height="15" rx="3" fill="#162338" />
                <text x="6" y="11" fill="#00d4ff" fontSize="8" fontWeight="extrabold">BC-104</text>
                <g transform="translate(6, 26)" className="text-[8px] font-mono">
                  <text x="0" y="0" fill="#94a3b8">Speed:</text><text x="110" y="0" fill="#00ff00" textAnchor="end">{bc104Spd.toFixed(1)} m/s</text>
                  <text x="0" y="11" fill="#94a3b8">Belt Load:</text><text x="110" y="11" fill="#00ff00" textAnchor="end">{bc104Load.toFixed(0)} t/h</text>
                  <text x="0" y="22" fill="#94a3b8">Motor Current:</text><text x="110" y="22" fill="#00ff00" textAnchor="end">{bc104Cur.toFixed(0)} A</text>
                  <text x="0" y="33" fill="#94a3b8">Power:</text><text x="110" y="33" fill="#00ff00" textAnchor="end">{bc104Pwr.toFixed(0)} kW</text>
                  <text x="0" y="44" fill="#94a3b8">Status:</text><text x="110" y="44" fill="#00ff00" fontWeight="bold" textAnchor="end">RUN</text>
                </g>
              </g>
            </g>
          </g>

        </svg>
      </div>

      {/* ── BOTTOM ANALYTICS & DCS STATUS ROW ───────────────────────── */}
      <div className="h-44 bg-[#070c16] border-t border-gray-800 grid grid-cols-5 gap-2 p-2 text-xs">
        
        {/* PANEL 1: PROCESS OVERVIEW */}
        <div className="bg-[#0b1424] border border-gray-800 rounded p-2.5 flex flex-col justify-between">
          <div className="text-[10px] font-extrabold text-cyan-400 border-b border-gray-800 pb-1 uppercase tracking-wider">
            PROCESS OVERVIEW
          </div>
          <div className="font-mono text-[10px] space-y-1 mt-1">
            <div className="flex justify-between"><span className="text-gray-400">Limestone Feed Rate</span><span className="text-white font-bold">{afFeed.toFixed(0)} t/h</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Crusher Throughput</span><span className="text-white font-bold">1,020 t/h</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Today Production</span><span className="text-[#00ff00] font-bold">{todayProd.toLocaleString()} t</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Yesterday Production</span><span className="text-gray-300 font-bold">{yestProd.toLocaleString()} t</span></div>
            <div className="flex justify-between border-t border-gray-800 pt-1"><span className="text-gray-400">Availability</span><span className="text-emerald-400 font-bold">{availPct}%</span></div>
          </div>
        </div>

        {/* PANEL 2: ENERGY CONSUMPTION (TODAY) */}
        <div className="bg-[#0b1424] border border-gray-800 rounded p-2.5 flex flex-col justify-between">
          <div className="text-[10px] font-extrabold text-cyan-400 border-b border-gray-800 pb-1 uppercase tracking-wider">
            ENERGY CONSUMPTION (TODAY)
          </div>
          <div className="font-mono text-[10px] space-y-1 mt-1">
            <div className="flex justify-between"><span className="text-gray-400">Reclaimer</span><span className="text-[#00ff00]">1,250 kWh</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Apron Feeder</span><span className="text-[#00ff00]">980 kWh</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Crusher</span><span className="text-[#00ff00]">4,820 kWh</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Belt Conveyors</span><span className="text-[#00ff00]">3,640 kWh</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Dust Collector</span><span className="text-[#00ff00]">1,120 kWh</span></div>
            <div className="flex justify-between border-t border-gray-800 pt-1 font-bold"><span className="text-gray-300">Total</span><span className="text-cyan-400">11,810 kWh</span></div>
          </div>
        </div>

        {/* PANEL 3: SYSTEM STATUS */}
        <div className="bg-[#0b1424] border border-gray-800 rounded p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-800 pb-1">
            <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider">SYSTEM STATUS</span>
            <div className="flex items-center gap-1 text-[9px] text-[#00ff00] font-bold">
              <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" /> Auto Mode
            </div>
          </div>
          <div className="grid grid-cols-1 gap-1 mt-1 text-[10px]">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00ff00]" /><span className="text-gray-300">Crusher Ready</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00ff00]" /><span className="text-gray-300">Feed Sequence Normal</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00ff00]" /><span className="text-gray-300">Conveying System Healthy</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00ff00]" /><span className="text-gray-300">Dust Collection Active</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00ff00]" /><span className="text-gray-300">Safety Interlocks Armed</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00ff00]" /><span className="text-gray-300">Emergency Stop Clear</span></div>
          </div>
        </div>

        {/* PANEL 4: ACTIVE ALARMS */}
        <div className="bg-[#0b1424] border border-gray-800 rounded p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-800 pb-1">
            <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle size={12} /> ACTIVE ALARMS ({isTrampMetal ? 3 : 2})
            </span>
          </div>
          <div className="space-y-1.5 mt-1 font-mono text-[9px] overflow-y-auto max-h-24">
            {isTrampMetal && (
              <div className="bg-red-950/60 border border-red-500/50 p-1 rounded flex items-center justify-between animate-pulse">
                <div>
                  <span className="text-red-400 font-bold">CR-MD-01</span>
                  <div className="text-[8px] text-gray-300">Tramp Metal Detected</div>
                </div>
                <span className="bg-red-600 text-white font-black px-1.5 py-0.5 rounded text-[7px]">CRIT</span>
              </div>
            )}
            <div className="bg-red-950/40 border border-red-900/60 p-1 rounded flex items-center justify-between">
              <div>
                <span className="text-amber-400 font-bold">10:18:43 CR-CR-01</span>
                <div className="text-[8px] text-gray-400">Crusher Bearing Temp High</div>
              </div>
              <span className="bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded text-[7px]">HIGH</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-1 rounded flex items-center justify-between">
              <div>
                <span className="text-yellow-400 font-bold">09:42:16 CR-BC-104</span>
                <div className="text-[8px] text-gray-400">Belt Misalignment Permissive</div>
              </div>
              <span className="bg-yellow-600 text-black font-bold px-1.5 py-0.5 rounded text-[7px]">MED</span>
            </div>
          </div>
        </div>

        {/* PANEL 5: QUICK LINKS & DCS ACTIONS */}
        <div className="bg-[#0b1424] border border-gray-800 rounded p-2.5 flex flex-col justify-between">
          <div className="text-[10px] font-extrabold text-cyan-400 border-b border-gray-800 pb-1 uppercase tracking-wider">
            QUICK LINKS
          </div>
          <div className="grid grid-cols-1 gap-1 mt-1 text-[10px] font-semibold">
            <button 
              onClick={() => handleEqClick('CR-CR-01')}
              className="flex items-center gap-2 p-1 rounded bg-white/5 hover:bg-emerald-600/30 text-gray-300 hover:text-white transition-colors"
            >
              <TrendingUp size={11} className="text-cyan-400" />
              <span>Real-Time Trends</span>
            </button>
            <button 
              onClick={() => handleEqClick('CR-CR-01')}
              className="flex items-center gap-2 p-1 rounded bg-white/5 hover:bg-emerald-600/30 text-gray-300 hover:text-white transition-colors"
            >
              <Clock size={11} className="text-amber-400" />
              <span>Alarm History</span>
            </button>
            <button 
              onClick={() => handleEqClick('CR-CR-01')}
              className="flex items-center gap-2 p-1 rounded bg-white/5 hover:bg-emerald-600/30 text-gray-300 hover:text-white transition-colors"
            >
              <Wrench size={11} className="text-purple-400" />
              <span>Preventive Maintenance</span>
            </button>
            <button 
              onClick={() => handleEqClick('CR-CR-01')}
              className="flex items-center gap-2 p-1 rounded bg-white/5 hover:bg-emerald-600/30 text-gray-300 hover:text-white transition-colors"
            >
              <Shield size={11} className="text-emerald-400" />
              <span>Interlock Matrix</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
