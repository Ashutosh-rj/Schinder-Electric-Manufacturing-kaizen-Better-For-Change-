import React from 'react';
import { ProcessValue } from '../../components/scada/Tags/ProcessValue';
import { Motor, VRM, Hopper, BagFilter, Fan, BucketElevator, Silo, ConveyorBelt } from '../../components/scada/Equipment/EquipmentComponents';

export const RawMillScreen = () => {
  return (
    <div className="w-full h-full relative">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        
        {/* --- HOT GAS DUCTING --- */}
        <path d="M 0 600 L 400 600 L 400 500" fill="none" stroke="#ef4444" strokeWidth="16" opacity="0.8" />
        
        {/* --- MILL DUCTING TO FILTER --- */}
        <path d="M 400 300 L 400 200 L 800 200 L 800 350" fill="none" stroke="#64748b" strokeWidth="20" opacity="0.9" />

        {/* --- FILTER TO FAN DUCTING --- */}
        <path d="M 920 390 L 1050 390 L 1050 500" fill="none" stroke="#64748b" strokeWidth="16" opacity="0.8" />
        <path d="M 1050 550 L 1050 650 L 1600 650" fill="none" stroke="#64748b" strokeWidth="16" opacity="0.8" />

        {/* --- HOPPERS & BELT --- */}
        <Hopper x="150" y="100" width="100" height="120" />
        <Hopper x="280" y="100" width="100" height="120" />
        <ConveyorBelt id="RM1-FEED-CVY" x="120" y="250" length="300" angle={15} />

        {/* --- VERTICAL ROLLER MILL --- */}
        <VRM id="RM1-VRM-01" x="400" y="400" scale={1.5} />
        <Motor id="RM1-VRM-01" x="320" y="520" scale={1.5} />

        {/* --- BUCKET ELEVATOR (REJECTS) --- */}
        <BucketElevator id="RM1-ELEV-01" x="520" y="250" height="250" />
        <path d="M 500 500 L 520 480" fill="none" stroke="#94a3b8" strokeWidth="6" />
        <path d="M 535 250 L 580 200 L 450 150 L 400 300" fill="none" stroke="#94a3b8" strokeWidth="6" />

        {/* --- BAG FILTER --- */}
        <BagFilter id="RM1-DC-01" x="800" y="350" />
        
        {/* --- ID FAN --- */}
        <Fan id="RM1-FAN-01" x="1050" y="525" scale={1.5} />
        <Motor id="RM1-FAN-01" x="1100" y="525" scale={1.2} />

        {/* --- SILO --- */}
        <Silo x="1250" y="150" width="150" height="300" levelTag="RM1-SILO-LVL" label="RAW MEAL SILO" />
        <path d="M 860 470 L 860 550 L 1200 550 L 1200 100 L 1325 100 L 1325 150" fill="none" stroke="#94a3b8" strokeWidth="8" />

      </svg>

      {/* --- DATA BOXES --- */}
      
      {/* RAW MATERIAL FEED */}
      <div className="absolute top-10 left-10 bg-[#0a0f1c]/90 border border-gray-600 rounded p-3 text-[11px] w-[200px]">
         <div className="text-[#00d4ff] font-bold mb-2 border-b border-gray-700 pb-1">RAW MILL FEED</div>
         <div className="flex justify-between"><span className="text-gray-400">Total Feed</span><ProcessValue tag="RM1-FEED" unit="t/h" /></div>
      </div>

      {/* VRM DATA */}
      <div className="absolute top-[500px] left-[150px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-3 text-[11px] w-[200px]">
         <div className="text-[#00d4ff] font-bold mb-2 border-b border-gray-700 pb-1">MILL STATUS</div>
         <div className="flex justify-between"><span className="text-gray-400">Power</span><ProcessValue tag="RM1-PWR" unit="kW" fractionDigits={0} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Current</span><ProcessValue tag="RM1-CUR" unit="A" fractionDigits={0} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Diff Press</span><ProcessValue tag="RM1-DP" unit="Pa" fractionDigits={0} /></div>
      </div>

      {/* SEPARATOR DATA */}
      <div className="absolute top-[280px] left-[250px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[140px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">SEPARATOR</div>
         <div className="flex justify-between"><span className="text-gray-400">Speed</span><ProcessValue tag="RM1-SEP-SPD" unit="RPM" /></div>
      </div>

      {/* GAS DATA */}
      <div className="absolute top-[600px] left-[450px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[150px]">
         <div className="text-red-400 font-bold border-b border-gray-700 pb-1 mb-1">HOT GAS INLET</div>
         <div className="flex justify-between"><span className="text-gray-400">Temp</span><ProcessValue tag="RM1-IN-TEMP" unit="°C" color="#ef4444" /></div>
      </div>
      
      <div className="absolute top-[150px] left-[450px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[150px]">
         <div className="text-green-400 font-bold border-b border-gray-700 pb-1 mb-1">GAS OUTLET</div>
         <div className="flex justify-between"><span className="text-gray-400">Temp</span><ProcessValue tag="RM1-OUT-TEMP" unit="°C" /></div>
      </div>

      {/* FAN DATA */}
      <div className="absolute top-[580px] left-[980px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[160px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">ID FAN</div>
         <div className="flex justify-between"><span className="text-gray-400">Speed</span><ProcessValue tag="RM1-FAN-SPD" unit="RPM" fractionDigits={0} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Current</span><ProcessValue tag="RM1-FAN-CUR" unit="A" fractionDigits={0} /></div>
      </div>

      {/* SILO LEVEL */}
      <div className="absolute top-[280px] left-[1420px] bg-[#0a0f1c]/90 border border-gray-600 p-2 text-[11px] w-[140px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">SILO LEVEL</div>
         <div className="flex justify-between"><span className="text-gray-400">Level</span><ProcessValue tag="RM1-SILO-LVL" unit="%" color="#00ff00" /></div>
      </div>
      
    </div>
  );
};
