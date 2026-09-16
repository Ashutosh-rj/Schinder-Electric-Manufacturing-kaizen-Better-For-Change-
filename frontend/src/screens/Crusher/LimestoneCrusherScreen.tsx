import React from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { ProcessValue, DataBox } from '../../components/scada/Tags/ProcessValue';
import { Motor, CrusherCore, ConveyorBelt, Hopper, BagFilter } from '../../components/scada/Equipment/EquipmentComponents';

export const LimestoneCrusherScreen = () => {
  return (
    <div className="w-full h-full relative">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        
        {/* --- DUST DUCTING --- */}
        <path d="M 680 400 L 980 400 L 980 280 L 1050 280" fill="none" stroke="#38bdf8" strokeWidth="12" opacity="0.8" />
        <path d="M 1250 350 L 1250 280 L 1170 280" fill="none" stroke="#38bdf8" strokeWidth="12" opacity="0.8" />
        
        {/* --- STACKER / RECLAIMER --- */}
        {/* Rail base */}
        <rect x="50" y="550" width="200" height="10" fill="#475569" />
        {/* Boom */}
        <path d="M 150 500 L 350 550" stroke="#94a3b8" strokeWidth="10" />
        <circle cx="350" cy="550" r="20" fill="#334155" stroke="#94a3b8" strokeWidth="4" />
        {/* Pile */}
        <path d="M 20 600 Q 150 400, 300 600 Z" fill="#64748b" />

        {/* --- HOPPER & APRON FEEDER --- */}
        <Hopper x="550" y="150" width="160" height="140" levelTag="CR-HOP-LVL" />
        <g transform="translate(570, 310)">
           <rect x="0" y="0" width="120" height="30" fill="#1e293b" stroke="#334155" strokeWidth="2" />
           <circle cx="20" cy="15" r="10" fill="#64748b" />
           <circle cx="100" cy="15" r="10" fill="#64748b" />
           <Motor id="CR-AF-01" x="-10" y="15" />
        </g>
        <path d="M 630 340 L 630 370" stroke="#64748b" strokeWidth="40" strokeDasharray="10 10" />

        {/* --- CRUSHER --- */}
        <CrusherCore id="CR-CR-01" x="630" y="440" scale={1.2} />

        {/* --- CONVEYORS --- */}
        <ConveyorBelt id="CR-BC-101" x="250" y="580" length="280" />
        <ConveyorBelt id="CR-BC-102" x="550" y="580" length="350" />
        <ConveyorBelt id="CR-BC-103" x="900" y="580" length="250" angle={-10} />
        <ConveyorBelt id="CR-BC-104" x="1140" y="535" length="300" angle={-5} />

        {/* Transfer Chutes */}
        <rect x="530" y="570" width="20" height="30" fill="#475569" />
        <rect x="900" y="540" width="30" height="60" fill="#475569" />
        <rect x="1140" y="500" width="30" height="50" fill="#475569" />

        {/* --- DUST COLLECTOR (Bag Filter) --- */}
        <BagFilter id="CR-DC-01" x="1050" y="150" />
        <Motor id="CR-DC-01" x="1200" y="350" scale={1.5} />

        {/* --- STACK --- */}
        <polygon points="1350,450 1400,450 1390,150 1360,150" fill="url(#gray-cyl)" />
        <path d="M 1250 350 L 1360 350" fill="none" stroke="#64748b" strokeWidth="16" />

      </svg>

      {/* --- HTML OVERLAYS (Data & Info Boxes) --- */}

      {/* LIMESTONE YARD Panel */}
      <div className="absolute top-10 left-10 bg-[#0a0f1c]/90 border border-gray-600 rounded p-3 text-[11px] w-[250px] shadow-lg">
         <div className="text-[#00d4ff] font-bold mb-2 border-b border-gray-700 pb-1">LIMESTONE YARD</div>
         <div className="flex justify-between mb-1"><span className="text-gray-400">Total Stock</span><span className="text-white font-mono">325,680 t</span></div>
         <div className="flex justify-between mb-1"><span className="text-gray-400">Available Stock</span><span className="text-[#00ff00] font-mono">310,420 t</span></div>
         <div className="flex justify-between mb-1"><span className="text-gray-400">Reclaim Rate</span><ProcessValue tag="CR-AF-FEED" unit="t/h" /></div>
      </div>

      {/* PRIMARY HOPPER Data */}
      <div className="absolute top-20 left-[400px] text-[11px] text-right">
        <div className="font-bold text-white mb-1">PRIMARY HOPPER</div>
        <div className="text-gray-400 mb-1">CR-HOP-01</div>
        <div className="bg-[#0a0f1c] border border-gray-600 p-2">
          <div className="flex gap-4 justify-between"><span className="text-gray-400">Level</span><ProcessValue tag="CR-HOP-LVL" unit="%" color="#00ff00" /></div>
          <div className="flex gap-4 justify-between"><span className="text-gray-400">High</span><span className="text-white">90 %</span></div>
          <div className="flex gap-4 justify-between"><span className="text-gray-400">Low</span><span className="text-white">20 %</span></div>
        </div>
      </div>

      {/* APRON FEEDER Data */}
      <div className="absolute top-[280px] left-[380px] text-[11px] text-right">
        <div className="font-bold text-white">APRON FEEDER</div>
        <div className="text-gray-400 mb-1">CR-AF-01</div>
        <div className="bg-[#00ff00] text-black px-2 py-0.5 rounded text-center inline-block mb-1 font-bold">RUN</div>
      </div>
      <div className="absolute top-[280px] left-[700px] bg-[#0a0f1c] border border-gray-600 p-2 text-[11px]">
         <div className="flex gap-4 justify-between"><span className="text-gray-400">Speed</span><ProcessValue tag="CR-AF-SPD" unit="Hz" /></div>
         <div className="flex gap-4 justify-between"><span className="text-gray-400">Current</span><ProcessValue tag="CR-AF-CUR" unit="A" /></div>
         <div className="flex gap-4 justify-between"><span className="text-gray-400">Feed Rate</span><ProcessValue tag="CR-AF-FEED" unit="t/h" fractionDigits={0} /></div>
      </div>

      {/* PRIMARY CRUSHER Data */}
      <div className="absolute top-[420px] left-[700px] text-[11px]">
        <div className="font-bold text-white">PRIMARY CRUSHER</div>
        <div className="text-gray-400 mb-1 text-center">CR-CR-01</div>
        <div className="bg-[#00ff00] text-black px-4 py-0.5 rounded text-center mb-1 font-bold w-16 mx-auto">RUN</div>
      </div>
      <div className="absolute top-[480px] left-[400px] bg-[#0a0f1c] border border-gray-600 p-2 text-[11px] w-[180px]">
         <div className="flex gap-4 justify-between"><span className="text-gray-400">Motor Power</span><ProcessValue tag="CR-CR-PWR" unit="kW" fractionDigits={0} /></div>
         <div className="flex gap-4 justify-between"><span className="text-gray-400">Motor Current</span><ProcessValue tag="CR-CR-CUR" unit="A" fractionDigits={0} /></div>
         <div className="flex gap-4 justify-between"><span className="text-gray-400">Inlet Size</span><span className="text-white">&lt; 800 mm</span></div>
         <div className="flex gap-4 justify-between"><span className="text-gray-400">Crushing Load</span><ProcessValue tag="CR-CR-LOAD" unit="%" /></div>
      </div>

      {/* BC-101 Data */}
      <div className="absolute top-[600px] left-[50px] bg-[#0a0f1c] border border-gray-600 p-2 text-[11px] w-[180px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 mb-1">BC-101</div>
         <div className="flex justify-between"><span className="text-gray-400">Speed</span><ProcessValue tag="CR-BC101-SPD" unit="m/s" /></div>
         <div className="flex justify-between"><span className="text-gray-400">Belt Load</span><ProcessValue tag="CR-BC101-LOAD" unit="t/h" fractionDigits={0} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-[#00ff00] font-bold">RUN</span></div>
      </div>

      {/* BC-102 Data */}
      <div className="absolute top-[620px] left-[350px] bg-[#0a0f1c] border border-gray-600 p-2 text-[11px] w-[180px]">
         <div className="text-[#00d4ff] font-bold border-b border-gray-700 mb-1">BC-102</div>
         <div className="flex justify-between"><span className="text-gray-400">Speed</span><ProcessValue tag="CR-BC102-SPD" unit="m/s" /></div>
         <div className="flex justify-between"><span className="text-gray-400">Belt Load</span><ProcessValue tag="CR-BC102-LOAD" unit="t/h" fractionDigits={0} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-[#00ff00] font-bold">RUN</span></div>
      </div>

      {/* DUST COLLECTOR Data */}
      <div className="absolute top-[100px] left-[1050px] text-[11px] text-center w-[120px]">
         <div className="font-bold text-white">DUST COLLECTOR</div>
         <div className="text-gray-400">CR-DC-01</div>
      </div>
      <div className="absolute top-[150px] left-[1180px] bg-[#0a0f1c] border border-gray-600 p-2 text-[11px] w-[160px]">
         <div className="flex justify-between"><span className="text-gray-400">DP</span><ProcessValue tag="CR-DC-DP" unit="Pa" fractionDigits={0} /></div>
         <div className="flex justify-between"><span className="text-gray-400">Inlet Temp</span><span className="text-white">68 °C</span></div>
         <div className="flex justify-between"><span className="text-gray-400">Fan Current</span><span className="text-[#00ff00]">82 A</span></div>
      </div>

      {/* STACK Data */}
      <div className="absolute top-[120px] left-[1380px] text-[11px]">
         <div className="font-bold text-white">STACK</div>
         <div className="flex gap-2"><span className="text-gray-400">Emission</span><span className="text-white">8.5 mg/Nm³</span></div>
      </div>

      {/* BOTTOM PANELS */}
      <div className="absolute bottom-2 left-2 right-2 h-[120px] grid grid-cols-4 gap-2">
         {/* Process Overview */}
         <div className="bg-[#0a0f1c]/90 border border-gray-700 p-2 text-[11px]">
            <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">PROCESS OVERVIEW</div>
            <div className="flex justify-between"><span className="text-gray-400">Limestone Feed Rate</span><ProcessValue tag="CR-AF-FEED" unit="t/h" fractionDigits={0} /></div>
            <div className="flex justify-between"><span className="text-gray-400">Crusher Throughput</span><ProcessValue tag="CR-AF-FEED" unit="t/h" fractionDigits={0} /></div>
            <div className="flex justify-between mt-2"><span className="text-gray-400">Today Production</span><span className="text-white">21,450 t</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Availability</span><span className="text-[#00ff00]">96.8 %</span></div>
         </div>
         {/* Energy Consumption */}
         <div className="bg-[#0a0f1c]/90 border border-gray-700 p-2 text-[11px]">
            <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">ENERGY CONSUMPTION (TODAY)</div>
            <div className="flex justify-between"><span className="text-gray-400">Reclaimer</span><span className="text-white">1,250 kWh</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Crusher</span><span className="text-white">4,820 kWh</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Conveyors</span><span className="text-white">3,640 kWh</span></div>
            <div className="flex justify-between border-t border-gray-700 mt-1 pt-1"><span className="text-white font-bold">Total</span><span className="text-white font-bold">11,810 kWh</span></div>
         </div>
         {/* System Status */}
         <div className="bg-[#0a0f1c]/90 border border-gray-700 p-2 text-[11px]">
            <div className="text-[#00d4ff] font-bold border-b border-gray-700 pb-1 mb-1">SYSTEM STATUS</div>
            <div className="grid grid-cols-2 gap-2 mt-2">
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00ff00]" /> <span className="text-gray-300">Crusher Ready</span></div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00ff00]" /> <span className="text-gray-300">Auto Mode</span></div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00ff00]" /> <span className="text-gray-300">Conveying System</span></div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00ff00]" /> <span className="text-gray-300">Interlocks OK</span></div>
            </div>
         </div>
         {/* Placeholder for Alarms in bottom panel layout (Actual AlarmPanel is separate, but we mimic the screenshot) */}
         <div className="bg-[#0a0f1c]/90 border border-red-900/50 p-2 text-[11px]">
            <div className="text-red-500 font-bold border-b border-gray-700 pb-1 mb-1 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
               ACTIVE ALARMS
            </div>
            {/* We will let the global alarm panel handle real alarms, this is just for layout completeness if needed */}
         </div>
      </div>

    </div>
  );
};
