import React from 'react';
import { ProcessValue } from '../../components/scada/Tags/ProcessValue';
import { Motor, ConveyorBelt, Silo, BucketElevator, BagFilter } from '../../components/scada/Equipment/EquipmentComponents';

export const ClinkerTransportScreen = () => {
  return (
    <div className="w-full h-full relative">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        
        {/* --- FROM COOLER --- */}
        <rect x="50" y="550" width="100" height="40" fill="#475569" />
        <text x="100" y="575" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle">FROM CLR1</text>
        
        {/* --- DEEP PAN CONVEYOR --- */}
        <ConveyorBelt id="CT1-DPC-01" x="150" y="550" length="500" angle={-15} />

        {/* --- BUCKET ELEVATOR --- */}
        <BucketElevator id="CT1-ELEV-01" x="650" y="200" height="220" />
        
        {/* Transfer chute */}
        <path d="M 630 420 L 680 420 L 680 440" fill="none" stroke="#475569" strokeWidth="20" />

        {/* --- DISTRIBUTION CONVEYOR --- */}
        <ConveyorBelt id="CT1-DPC-02" x="680" y="220" length="700" />
        <path d="M 660 210 L 680 210" fill="none" stroke="#475569" strokeWidth="20" />

        {/* --- SILOS --- */}
        <Silo x="750" y="300" width="180" height="350" levelTag="CT1-SILO1-LVL" label="CLINKER SILO 1" />
        <Silo x="1000" y="300" width="180" height="350" levelTag="CT1-SILO2-LVL" label="CLINKER SILO 2" />
        <Silo x="1250" y="450" width="120" height="200" levelTag="CT1-SILO3-LVL" label="OFF-SPEC" />

        {/* --- SILO DROPS --- */}
        <path d="M 840 230 L 840 300" fill="none" stroke="#475569" strokeWidth="20" />
        <path d="M 1090 230 L 1090 300" fill="none" stroke="#475569" strokeWidth="20" />
        <path d="M 1310 230 L 1310 450" fill="none" stroke="#475569" strokeWidth="20" />

        {/* --- DUST COLLECTOR --- */}
        <BagFilter id="CT1-DC-01" x="600" y="50" />
        <path d="M 680 200 L 700 90" fill="none" stroke="#64748b" strokeWidth="10" />

      </svg>

      {/* --- DATA BOXES --- */}
      
      <div className="absolute top-[600px] left-[150px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[180px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">DEEP PAN CONVEYOR</div>
         <div className="flex justify-between"><span className="text-gray-400">Speed</span><ProcessValue tag="CT1-DPC-SPD" unit="m/s" fractionDigits={2} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Current</span><ProcessValue tag="CT1-DPC-CUR" unit="A" fractionDigits={0} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Load</span><ProcessValue tag="CT1-DPC-LOAD" unit="t/h" fractionDigits={0} /></div>
      </div>

      <div className="absolute top-[50px] left-[750px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[150px]">
         <div className="text-blue-400 font-bold border-b border-gray-700 pb-1 mb-1">TRANSFER FILTER</div>
         <div className="flex justify-between"><span className="text-gray-400">Diff Press</span><ProcessValue tag="CT1-DC-DP" unit="Pa" fractionDigits={0} /></div>
      </div>

      <div className="absolute top-[670px] left-[750px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[180px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">SILO 1 (RADAR)</div>
         <div className="flex justify-between"><span className="text-gray-400">Level</span><ProcessValue tag="CT1-SILO1-LVL" unit="%" color="#00ff00" /></div>
      </div>

      <div className="absolute top-[670px] left-[1000px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[180px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">SILO 2 (RADAR)</div>
         <div className="flex justify-between"><span className="text-gray-400">Level</span><ProcessValue tag="CT1-SILO2-LVL" unit="%" color="#00ff00" /></div>
      </div>

      <div className="absolute top-[670px] left-[1250px] bg-[#0a0f1c]/90 border-2 border-orange-900 rounded p-2 text-[11px] w-[120px]">
         <div className="text-orange-500 font-bold border-b border-orange-900 pb-1 mb-1">OFF-SPEC</div>
         <div className="flex justify-between"><span className="text-gray-400">Level</span><ProcessValue tag="CT1-SILO3-LVL" unit="%" color="#fb923c" /></div>
      </div>
      
    </div>
  );
};
