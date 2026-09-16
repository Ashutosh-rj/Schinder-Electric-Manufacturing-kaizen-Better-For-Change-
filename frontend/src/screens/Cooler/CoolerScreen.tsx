import React from 'react';
import { ProcessValue } from '../../components/scada/Tags/ProcessValue';
import { Motor, GrateCooler, Fan, ConveyorBelt } from '../../components/scada/Equipment/EquipmentComponents';

export const CoolerScreen = () => {
  return (
    <div className="w-full h-full relative">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        
        {/* --- KILN DROP (From left) --- */}
        <path d="M 100 200 L 100 350" fill="none" stroke="#ef4444" strokeWidth="40" strokeDasharray="20 10">
           <animate attributeName="stroke-dashoffset" from="0" to="30" dur="1s" repeatCount="indefinite" />
        </path>
        <rect x="80" y="100" width="40" height="100" fill="#334155" />
        <text x="100" y="90" fill="#ef4444" fontSize="14" fontWeight="bold" textAnchor="middle">FROM KILN</text>

        {/* --- GRATE COOLER --- */}
        <GrateCooler id="CLR1-COOL-01" x="100" y="350" />

        {/* --- COOLING FANS --- */}
        <Fan id="CLR1-F1" x="150" y="600" scale={1.2} />
        <path d="M 150 570 L 150 450" fill="none" stroke="#38bdf8" strokeWidth="12" />
        
        <Fan id="CLR1-F2" x="250" y="600" scale={1.2} />
        <path d="M 250 570 L 250 450" fill="none" stroke="#38bdf8" strokeWidth="12" />
        
        <Fan id="CLR1-F3" x="350" y="600" scale={1.2} />
        <path d="M 350 570 L 350 450" fill="none" stroke="#38bdf8" strokeWidth="12" />

        {/* --- CLINKER BREAKER --- */}
        <rect x="400" y="400" width="60" height="60" fill="#475569" stroke="#0f172a" strokeWidth="2" />
        <circle cx="430" cy="430" r="20" fill="#1e293b" />
        <Motor id="CLR1-BRK-01" x="430" y="490" scale={1.2} />
        <line x1="430" y1="430" x2="430" y2="470" stroke="#94a3b8" strokeWidth="4" />

        {/* --- DEEP PAN CONVEYOR --- */}
        <ConveyorBelt id="CLR1-CVY-01" x="430" y="550" length="500" angle={5} />

        {/* --- HEAT RECUPERATION DUCTS --- */}
        <path d="M 120 350 L 120 200 L 400 200" fill="none" stroke="#ef4444" strokeWidth="20" opacity="0.8" />
        <text x="410" y="205" fill="#ef4444" fontSize="14" fontWeight="bold">SECONDARY AIR TO KILN</text>
        
        <path d="M 200 350 L 200 250 L 400 250" fill="none" stroke="#fb923c" strokeWidth="16" opacity="0.8" />
        <text x="410" y="255" fill="#fb923c" fontSize="14" fontWeight="bold">TERTIARY AIR TO CALCINER</text>

      </svg>

      {/* --- DATA BOXES --- */}
      
      <div className="absolute top-[280px] left-[50px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[140px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">GRATE DRIVE</div>
         <div className="flex justify-between"><span className="text-gray-400">Speed</span><ProcessValue tag="CLR1-GRATE-SPD" unit="Strokes/min" fractionDigits={1} /></div>
      </div>

      <div className="absolute top-[480px] left-[50px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[140px]">
         <div className="text-blue-400 font-bold border-b border-gray-700 pb-1 mb-1">FAN 1 (HOT ZONE)</div>
         <div className="flex justify-between"><span className="text-gray-400">Pressure</span><ProcessValue tag="CLR1-F1-PR" unit="mbar" color="#38bdf8" fractionDigits={0} /></div>
      </div>
      
      <div className="absolute top-[480px] left-[200px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[140px]">
         <div className="text-blue-400 font-bold border-b border-gray-700 pb-1 mb-1">FAN 2 (MID ZONE)</div>
         <div className="flex justify-between"><span className="text-gray-400">Pressure</span><ProcessValue tag="CLR1-F2-PR" unit="mbar" color="#38bdf8" fractionDigits={0} /></div>
      </div>

      <div className="absolute top-[480px] left-[350px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[140px]">
         <div className="text-blue-400 font-bold border-b border-gray-700 pb-1 mb-1">FAN 3 (COLD ZONE)</div>
         <div className="flex justify-between"><span className="text-gray-400">Pressure</span><ProcessValue tag="CLR1-F3-PR" unit="mbar" color="#38bdf8" fractionDigits={0} /></div>
      </div>

      <div className="absolute top-[350px] left-[480px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[160px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">CLINKER BREAKER</div>
         <div className="flex justify-between"><span className="text-gray-400">Power</span><ProcessValue tag="CLR1-BRK-PWR" unit="kW" fractionDigits={0} /></div>
      </div>

      <div className="absolute top-[160px] left-[450px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[180px]">
         <div className="text-red-400 font-bold border-b border-gray-700 pb-1 mb-1">RECUPERATION</div>
         <div className="flex justify-between"><span className="text-gray-400">Sec Air Temp</span><ProcessValue tag="CLR1-SEC-AIR" unit="°C" color="#ef4444" fractionDigits={0} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Ter Air Temp</span><ProcessValue tag="CLR1-TER-AIR" unit="°C" color="#fb923c" fractionDigits={0} /></div>
      </div>

      <div className="absolute top-[620px] left-[550px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[180px]">
         <div className="text-white font-bold border-b border-gray-700 pb-1 mb-1">CLINKER OUTPUT</div>
         <div className="flex justify-between"><span className="text-gray-400">Temperature</span><ProcessValue tag="CLR1-CLINK-OUT" unit="°C" color="#00ff00" fractionDigits={0} /></div>
      </div>
      
    </div>
  );
};
