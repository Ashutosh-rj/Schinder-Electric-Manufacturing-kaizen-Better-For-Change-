import React from 'react';
import { ProcessValue } from '../../components/scada/Tags/ProcessValue';
import { Motor, BallMill, Hopper, BagFilter, Silo, ConveyorBelt, BucketElevator } from '../../components/scada/Equipment/EquipmentComponents';

export const CementMillScreen = () => {
  return (
    <div className="w-full h-full relative">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        
        {/* --- FEED HOPPERS --- */}
        <Hopper x="100" y="100" width="100" height="150" label="CLINKER" />
        <Hopper x="250" y="100" width="80" height="120" label="GYPSUM" />
        <Hopper x="380" y="100" width="80" height="120" label="SLAG" />

        {/* --- WEIGH FEEDERS --- */}
        <ConveyorBelt id="CM2-WF-01" x="80" y="270" length="120" />
        <ConveyorBelt id="CM2-WF-02" x="230" y="270" length="100" />
        <ConveyorBelt id="CM2-WF-03" x="360" y="270" length="100" />

        {/* --- COLLECTING BELT --- */}
        <ConveyorBelt id="CM2-BC-01" x="60" y="320" length="450" angle={10} />

        {/* --- BALL MILL --- */}
        <path d="M 490 400 L 510 400 L 510 450 L 550 450" fill="none" stroke="#475569" strokeWidth="20" />
        <BallMill id="CM2-MILL-01" x="550" y="450" scale={1.5} />
        <Motor id="CM2-MILL-01" x="480" y="480" scale={1.5} />

        {/* --- BUCKET ELEVATOR --- */}
        <path d="M 850 490 L 920 490" fill="none" stroke="#475569" strokeWidth="20" />
        <BucketElevator id="CM2-ELEV-01" x="900" y="150" height="360" />

        {/* --- O-SEPA SEPARATOR --- */}
        <path d="M 910 150 L 980 150 L 980 200" fill="none" stroke="#475569" strokeWidth="20" />
        
        {/* Separator body */}
        <polygon points="950,200 1050,200 1020,300 980,300" fill="#334155" stroke="#0f172a" strokeWidth="2" />
        <rect x="980" y="170" width="40" height="30" fill="#1e293b" />
        <Motor id="CM2-SEP-01" x="1000" y="160" scale={1.2} />

        {/* Returns to Mill */}
        <path d="M 1000 300 L 1000 350 L 650 350 L 650 450" fill="none" stroke="#64748b" strokeWidth="12" opacity="0.8" />
        
        {/* Fines to Filter */}
        <path d="M 1050 220 L 1150 220" fill="none" stroke="#94a3b8" strokeWidth="20" opacity="0.6" />

        {/* --- BAG FILTER --- */}
        <BagFilter id="CM2-DC-01" x="1150" y="180" />

        {/* --- CEMENT SILOS --- */}
        <Silo x="1350" y="250" width="180" height="400" levelTag="CM2-SILO1-LVL" label="OPC CEMENT" />
        
        {/* Air Slide */}
        <path d="M 1200 280 L 1200 350 L 1400 350 L 1400 250" fill="none" stroke="#94a3b8" strokeWidth="10" />

      </svg>

      {/* --- DATA BOXES --- */}
      
      <div className="absolute top-[380px] left-[50px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[160px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">PROPORTIONING</div>
         <div className="flex justify-between"><span className="text-gray-400">Clinker</span><ProcessValue tag="CM2-CLINK-FEED" unit="t/h" /></div>
         <div className="flex justify-between"><span className="text-gray-400">Gypsum</span><ProcessValue tag="CM2-GYP-FEED" unit="t/h" /></div>
         <div className="flex justify-between"><span className="text-gray-400">Slag</span><ProcessValue tag="CM2-SLAG-FEED" unit="t/h" /></div>
      </div>

      <div className="absolute top-[580px] left-[550px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-3 text-[11px] w-[200px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">BALL MILL 2 (CM2)</div>
         <div className="flex justify-between"><span className="text-gray-400">Main Drive Power</span><ProcessValue tag="CM2-MILL-PWR" unit="kW" fractionDigits={0} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Main Drive Curr</span><ProcessValue tag="CM2-MILL-CUR" unit="A" fractionDigits={0} /></div>
         <div className="flex justify-between mt-1 pt-1 border-t border-gray-700"><span className="text-gray-400">Acoustic Ear (Ch1)</span><ProcessValue tag="CM2-SOUND" unit="dB" color="#fb923c" fractionDigits={1} /></div>
      </div>

      <div className="absolute top-[100px] left-[1050px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[160px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">O-SEPA SEPARATOR</div>
         <div className="flex justify-between"><span className="text-gray-400">Speed</span><ProcessValue tag="CM2-SEP-SPD" unit="RPM" fractionDigits={1} /></div>
      </div>

      <div className="absolute top-[350px] left-[1100px] bg-[#0a0f1c]/90 border-2 border-green-900 rounded p-2 text-[11px] w-[180px]">
         <div className="text-green-500 font-bold border-b border-green-900 pb-1 mb-1">PRODUCT QUALITY</div>
         <div className="flex justify-between"><span className="text-gray-400">Blaine</span><ProcessValue tag="CM2-BLAINE" unit="cm²/g" color="#00ff00" fractionDigits={0} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Cement Temp</span><ProcessValue tag="CM2-CEM-TEMP" unit="°C" /></div>
      </div>

      <div className="absolute top-[670px] left-[1350px] bg-[#0a0f1c]/90 border border-gray-600 rounded p-2 text-[11px] w-[180px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">SILO LEVEL</div>
         <div className="flex justify-between"><span className="text-gray-400">Level</span><ProcessValue tag="CM2-SILO1-LVL" unit="%" color="#00ff00" /></div>
      </div>
      
    </div>
  );
};
