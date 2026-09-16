import React from 'react';
import { ProcessValue } from '../../components/scada/Tags/ProcessValue';
import { Motor, VRM, Hopper, BagFilter, Fan, Silo, ConveyorBelt } from '../../components/scada/Equipment/EquipmentComponents';

export const CoalMillScreen = () => {
  return (
    <div className="w-full h-full relative">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        
        {/* --- HOT GAS DUCTING --- */}
        <path d="M 0 600 L 400 600 L 400 500" fill="none" stroke="#ef4444" strokeWidth="16" opacity="0.8" />
        
        {/* --- MILL DUCTING TO FILTER --- */}
        <path d="M 400 300 L 400 200 L 800 200 L 800 350" fill="none" stroke="#334155" strokeWidth="20" opacity="0.9" />

        {/* --- FILTER TO FAN DUCTING --- */}
        <path d="M 920 390 L 1050 390 L 1050 500" fill="none" stroke="#334155" strokeWidth="16" opacity="0.8" />
        <path d="M 1050 550 L 1050 650 L 1600 650" fill="none" stroke="#334155" strokeWidth="16" opacity="0.8" />

        {/* --- COAL BUNKER & WEIGH FEEDER --- */}
        <Hopper x="250" y="100" width="120" height="150" label="RAW COAL" />
        <ConveyorBelt id="CM1-WF-01" x="220" y="270" length="180" />

        {/* --- VERTICAL ROLLER MILL (COAL MILL) --- */}
        <VRM id="CM1-VRM-01" x="400" y="400" scale={1.5} />
        <Motor id="CM1-VRM-01" x="320" y="520" scale={1.5} />

        {/* --- BAG FILTER (ATEX DESIGN) --- */}
        <BagFilter id="CM1-DC-01" x="800" y="350" />
        {/* Explosion Vent indicator */}
        <polygon points="850,340 870,340 860,320" fill="#ef4444" />
        
        {/* --- ID FAN --- */}
        <Fan id="CM1-FAN-01" x="1050" y="525" scale={1.5} />
        <Motor id="CM1-FAN-01" x="1100" y="525" scale={1.2} />

        {/* --- FINE COAL SILO (ATEX) --- */}
        <Silo x="1250" y="150" width="150" height="300" levelTag="CM1-SILO-LVL" label="FINE COAL" />
        <path d="M 860 470 L 860 550 L 1200 550 L 1200 100 L 1325 100 L 1325 150" fill="none" stroke="#334155" strokeWidth="8" />

        {/* --- INJECTION LINES --- */}
        <path d="M 1325 450 L 1325 700 L 1600 700" fill="none" stroke="#0f172a" strokeWidth="8" />
        <path d="M 1325 450 L 1325 800 L 1600 800" fill="none" stroke="#0f172a" strokeWidth="8" />
        
        {/* Blowers */}
        <Fan id="CM1-BLW-01" x="1450" y="700" scale={0.8} />
        <Fan id="CM1-BLW-02" x="1450" y="800" scale={0.8} />

      </svg>

      {/* --- DATA BOXES --- */}
      
      {/* COAL FEED */}
      <div className="absolute top-[280px] left-[50px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-3 text-[11px] w-[180px]">
         <div className="text-[#00d4ff] font-bold mb-2 border-b border-gray-700 pb-1">WEIGH FEEDER</div>
         <div className="flex justify-between"><span className="text-gray-400">Feed Rate</span><ProcessValue tag="CM1-FEED" unit="t/h" /></div>
      </div>

      {/* VRM DATA */}
      <div className="absolute top-[500px] left-[150px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-3 text-[11px] w-[200px]">
         <div className="text-[#00d4ff] font-bold mb-2 border-b border-gray-700 pb-1">COAL MILL</div>
         <div className="flex justify-between"><span className="text-gray-400">Power</span><ProcessValue tag="CM1-PWR" unit="kW" fractionDigits={0} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Diff Press</span><ProcessValue tag="CM1-DP" unit="Pa" fractionDigits={0} /></div>
      </div>

      {/* GAS DATA */}
      <div className="absolute top-[600px] left-[450px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[150px]">
         <div className="text-red-400 font-bold border-b border-gray-700 pb-1 mb-1">HOT GAS INLET</div>
         <div className="flex justify-between"><span className="text-gray-400">Temp</span><ProcessValue tag="CM1-IN-TEMP" unit="°C" color="#ef4444" /></div>
      </div>
      
      <div className="absolute top-[150px] left-[450px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[150px]">
         <div className="text-green-400 font-bold border-b border-gray-700 pb-1 mb-1">GAS OUTLET</div>
         <div className="flex justify-between"><span className="text-gray-400">Temp</span><ProcessValue tag="CM1-OUT-TEMP" unit="°C" /></div>
      </div>

      {/* ATEX SAFETY PANEL */}
      <div className="absolute top-[280px] left-[950px] bg-[#0a0f1c]/90 border-2 border-red-900 rounded p-3 text-[11px] w-[200px] shadow-[0_0_10px_rgba(239,68,68,0.2)]">
         <div className="text-red-500 font-bold mb-2 border-b border-red-900 pb-1 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            ATEX SAFETY MONITOR
         </div>
         <div className="flex justify-between"><span className="text-gray-400">CO Conc.</span><ProcessValue tag="CM1-CO-PPM" unit="ppm" color="#ef4444" /></div>
         <div className="flex justify-between"><span className="text-gray-400">O2 Conc.</span><ProcessValue tag="CM1-O2-PCT" unit="%" /></div>
      </div>

      {/* SILO LEVEL */}
      <div className="absolute top-[100px] left-[1420px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[140px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">SILO LEVEL</div>
         <div className="flex justify-between"><span className="text-gray-400">Level</span><ProcessValue tag="CM1-SILO-LVL" unit="%" color="#00ff00" /></div>
      </div>

      {/* INJECTION */}
      <div className="absolute top-[650px] left-[1450px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[140px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">KILN BURNER</div>
         <div className="flex justify-between"><span className="text-gray-400">Feed</span><ProcessValue tag="CM1-INJ-KILN" unit="t/h" /></div>
      </div>
      <div className="absolute top-[750px] left-[1450px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[140px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">CALCINER</div>
         <div className="flex justify-between"><span className="text-gray-400">Feed</span><ProcessValue tag="CM1-INJ-CALC" unit="t/h" /></div>
      </div>
      
    </div>
  );
};
