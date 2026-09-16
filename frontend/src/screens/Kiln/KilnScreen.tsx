import React from 'react';
import { ProcessValue } from '../../components/scada/Tags/ProcessValue';
import { Motor, RotaryKiln, PreheaterTower, Fan } from '../../components/scada/Equipment/EquipmentComponents';

export const KilnScreen = () => {
  return (
    <div className="w-full h-full relative">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        
        {/* --- TERTIARY AIR DUCT --- */}
        <path d="M 1200 450 L 1200 150 L 550 150 L 550 400" fill="none" stroke="#ef4444" strokeWidth="20" opacity="0.6" />
        <text x="800" y="140" fill="#ef4444" fontSize="14" fontWeight="bold">TERTIARY AIR DUCT</text>

        {/* --- PREHEATER TOWER --- */}
        <PreheaterTower x="200" y="150" />
        
        {/* Connection to Kiln */}
        <path d="M 300 500 L 400 500" fill="none" stroke="#64748b" strokeWidth="40" />

        {/* --- ROTARY KILN --- */}
        <RotaryKiln id="KLN1-KILN-01" x="400" y="550" length="700" />
        
        {/* Kiln Drive Motor */}
        <Motor id="KLN1-KILN-01" x="650" y="650" scale={1.5} />
        <path d="M 650 630 L 650 580" fill="none" stroke="#94a3b8" strokeWidth="4" />

        {/* --- BURNER FLAME EFFECT --- */}
        {/* (Built into RotaryKiln component) */}
        <line x1="1100" y1="500" x2="1140" y2="500" stroke="#0f172a" strokeWidth="8" />

        {/* --- ID FAN --- */}
        <Fan id="KLN1-ID-FAN" x="150" y="100" scale={1.5} />
        
        {/* Gas to ID Fan */}
        <path d="M 250 150 L 250 100 L 180 100" fill="none" stroke="#64748b" strokeWidth="16" />
        <path d="M 120 100 L 50 100 L 50 0" fill="none" stroke="#64748b" strokeWidth="16" />

      </svg>

      {/* --- DATA BOXES --- */}
      
      <div className="absolute top-[50px] left-[50px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-3 text-[11px] w-[180px]">
         <div className="text-[#00d4ff] font-bold mb-2 border-b border-gray-700 pb-1">KILN FEED</div>
         <div className="flex justify-between"><span className="text-gray-400">Rate</span><ProcessValue tag="KLN1-FEED" unit="t/h" /></div>
      </div>

      <div className="absolute top-[20px] left-[300px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-3 text-[11px] w-[180px]">
         <div className="text-[#00d4ff] font-bold mb-2 border-b border-gray-700 pb-1">PREHEATER ID FAN</div>
         <div className="flex justify-between"><span className="text-gray-400">Speed</span><ProcessValue tag="KLN1-ID-FAN-SPD" unit="RPM" fractionDigits={0} /></div>
      </div>

      <div className="absolute top-[200px] left-[350px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[180px]">
         <div className="text-orange-400 font-bold mb-1 border-b border-gray-700 pb-1">CALCINER</div>
         <div className="flex justify-between"><span className="text-gray-400">Temp</span><ProcessValue tag="KLN1-CALC-TEMP" unit="°C" color="#fb923c" fractionDigits={0} /></div>
      </div>

      <div className="absolute top-[650px] left-[450px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-3 text-[11px] w-[200px]">
         <div className="text-[#00d4ff] font-bold mb-2 border-b border-gray-700 pb-1">KILN DRIVE</div>
         <div className="flex justify-between"><span className="text-gray-400">Speed</span><ProcessValue tag="KLN1-SPD" unit="RPM" fractionDigits={2} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Current</span><ProcessValue tag="KLN1-CUR" unit="A" fractionDigits={0} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Power</span><ProcessValue tag="KLN1-PWR" unit="kW" fractionDigits={0} /></div>
      </div>

      <div className="absolute top-[600px] left-[800px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[150px]">
         <div className="text-red-400 font-bold border-b border-gray-700 pb-1 mb-1">BACK END</div>
         <div className="flex justify-between"><span className="text-gray-400">Temp</span><ProcessValue tag="KLN1-BE-TEMP" unit="°C" color="#ef4444" fractionDigits={0} /></div>
      </div>
      
      <div className="absolute top-[600px] left-[1100px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[150px]">
         <div className="text-red-500 font-bold border-b border-gray-700 pb-1 mb-1">BURNING ZONE</div>
         <div className="flex justify-between"><span className="text-gray-400">Temp</span><ProcessValue tag="KLN1-BZ-TEMP" unit="°C" color="#ef4444" fractionDigits={0} /></div>
      </div>

      <div className="absolute top-[450px] left-[1250px] bg-[#0a0f1c]/90 border-2 border-orange-900 rounded p-3 text-[11px] w-[200px]">
         <div className="text-orange-500 font-bold mb-2 border-b border-orange-900 pb-1">EMISSIONS (CEMS)</div>
         <div className="flex justify-between"><span className="text-gray-400">NOx</span><ProcessValue tag="KLN1-NOX" unit="mg/Nm³" color="#fb923c" fractionDigits={0} /></div>
         <div className="flex justify-between"><span className="text-gray-400">O2</span><ProcessValue tag="KLN1-O2" unit="%" /></div>
      </div>

      <div className="absolute top-[700px] left-[1200px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[200px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">BURNER FIRING</div>
         <div className="flex justify-between"><span className="text-gray-400">Coal Flow</span><ProcessValue tag="CM1-INJ-KILN" unit="t/h" /></div>
      </div>
      
    </div>
  );
};
