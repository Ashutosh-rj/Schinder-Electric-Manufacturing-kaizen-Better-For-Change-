import React, { useState, useEffect } from 'react';

const ScadaClinkerTransport = () => {
  const [fluc, setFluc] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFluc(Math.random() * 2 - 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const val = (base: number, volatility = 0.02) => (base + fluc * (base * volatility)).toFixed(1);

  const DataBox = ({ title, mv, sp, unit, left = 0, top = 0 }: any) => (
    <div className="absolute bg-black border border-[#00d4ff] p-0.5 text-[8px] font-mono shadow-md z-20" style={{ left, top, minWidth: '70px' }}>
      {title && <div className="text-white border-b border-gray-600 mb-0.5 px-1 bg-[#1e293b]">{title}</div>}
      {mv !== undefined && (
        <div className="flex justify-between px-1">
          <span className="text-gray-300">MV</span>
          <span className="text-[#00ff00] font-bold">{mv} {unit}</span>
        </div>
      )}
      {sp !== undefined && (
        <div className="flex justify-between px-1">
          <span className="text-gray-300">SP</span>
          <span className="text-[#00d4ff] font-bold">{sp} {unit}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative w-full h-[700px] bg-[#545b63] text-white font-sans overflow-hidden border-2 border-gray-700 select-none rounded">
      
      {/* Top Navigation */}
      <div className="h-6 bg-[#39ff14] flex items-center text-black text-[10px] font-bold overflow-x-auto px-1 gap-1">
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">CR</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">RM1</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">RM2</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KM1</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KM2</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KILN</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KILN FEED</div>
        <div className="px-2 py-0.5 bg-white border border-black cursor-pointer">COOLER</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">CM1</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">CM2</div>
        <div className="flex-1 text-center text-sm font-black tracking-wider text-black bg-white mx-4 rounded-sm">CLINKER TRANSPORT</div>
        <div className="flex gap-2 bg-gray-300 px-2 rounded-sm border border-gray-500">
           <span>PLANT <span className="text-green-700">23.27 MW</span></span>
           <span>CPP <span className="text-green-700">12.06 MW</span></span>
        </div>
      </div>

      <div className="flex-1 relative w-full h-full p-2">
         
         <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1200 650" preserveAspectRatio="xMidYMid slice">
            <defs>
               <linearGradient id="mill-green" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="20%" stopColor="#bbf7d0" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="80%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#14532d" />
               </linearGradient>
               <linearGradient id="gray-cyl" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="50%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#64748b" />
               </linearGradient>
            </defs>

            {/* --- Conveyors (Green Lines with dots representing buckets/pans) --- */}
            <g stroke="#22c55e" strokeWidth="4" fill="none">
               {/* Conveyor 1 */}
               <path d="M 60 200 L 250 200 L 320 150" />
               <path d="M 320 150 L 400 150 L 450 350 L 580 350" />
               {/* Angled elevators */}
               <path d="M 320 380 L 450 200 L 550 200 L 680 380" />
               <path d="M 520 400 L 650 220 L 750 220 L 880 400" />
            </g>

            <g fill="#22c55e">
               {/* Dots for pans/buckets */}
               <circle cx="100" cy="200" r="3" />
               <circle cx="150" cy="200" r="3" />
               <circle cx="200" cy="200" r="3" />
               <circle cx="280" cy="170" r="3" />
               
               <circle cx="350" cy="340" r="3" />
               <circle cx="380" cy="300" r="3" />
               <circle cx="410" cy="255" r="3" />
            </g>

            {/* --- PENT HOUSE CHAMBER (Top Left) --- */}
            <g transform="translate(20, 60)">
               <polygon points="20,0 200,0 220,40 0,40" fill="url(#mill-green)" stroke="#064e3b" strokeWidth="2" />
               <rect x="0" y="40" width="220" height="20" fill="url(#mill-green)" stroke="#064e3b" strokeWidth="2" />
               <text x="50" y="25" fill="black" fontSize="10" fontWeight="bold">PENT HOUSE CHAMBER</text>
            </g>

            {/* --- Small Hoppers --- */}
            <g transform="translate(50, 130)">
               <polygon points="0,0 30,0 20,40 10,40" fill="url(#gray-cyl)" stroke="#475569" />
               <rect x="10" y="40" width="10" height="30" fill="url(#gray-cyl)" />
            </g>
            <g transform="translate(100, 130)">
               <polygon points="0,0 30,0 20,40 10,40" fill="url(#gray-cyl)" stroke="#475569" />
               <rect x="10" y="40" width="10" height="30" fill="url(#gray-cyl)" />
            </g>
            <g transform="translate(150, 130)">
               <polygon points="0,0 30,0 20,40 10,40" fill="url(#gray-cyl)" stroke="#475569" />
               <rect x="10" y="40" width="10" height="30" fill="url(#gray-cyl)" />
            </g>

            {/* --- Big Silos (CM1, CM2, Clinker) --- */}
            <g transform="translate(500, 320)">
               <rect x="0" y="0" width="80" height="60" fill="url(#gray-cyl)" stroke="#475569" />
               <polygon points="0,60 80,60 50,100 30,100" fill="url(#gray-cyl)" stroke="#475569" />
               <text x="30" y="30" fill="black" fontSize="12" fontWeight="bold">CM1</text>
            </g>
            
            <g transform="translate(700, 320)">
               <rect x="0" y="0" width="80" height="60" fill="url(#gray-cyl)" stroke="#475569" />
               <polygon points="0,60 80,60 50,100 30,100" fill="url(#gray-cyl)" stroke="#475569" />
               <text x="30" y="30" fill="black" fontSize="12" fontWeight="bold">CM2</text>
            </g>
            
            <g transform="translate(900, 320)">
               <rect x="0" y="0" width="120" height="60" fill="url(#gray-cyl)" stroke="#475569" />
               <polygon points="0,60 120,60 80,100 40,100" fill="url(#gray-cyl)" stroke="#475569" />
               <text x="15" y="25" fill="black" fontSize="10" fontWeight="bold">CLINKER HOPPER</text>
            </g>

            {/* Water Spray Truck Graphic (Bottom center) */}
            <g transform="translate(580, 520)">
               <rect x="0" y="0" width="40" height="20" fill="url(#gray-cyl)" />
               <polygon points="0,20 40,20 30,50 10,50" fill="url(#gray-cyl)" />
               {/* Truck */}
               <rect x="10" y="70" width="60" height="20" fill="white" stroke="black" />
               <rect x="70" y="75" width="20" height="15" fill="red" />
               <circle cx="20" cy="90" r="5" fill="black" />
               <circle cx="40" cy="90" r="5" fill="black" />
               <circle cx="80" cy="90" r="5" fill="black" />
            </g>

         </svg>

         {/* --- HTML Overlay Data Tags & Boxes --- */}
         <div className="absolute top-[30px] left-[20px] bg-black text-[#00ff00] px-1 font-mono text-[9px] border border-gray-600">
            27.9 KV <span className="text-white ml-2 text-red-500 font-bold bg-white/20 px-0.5 rounded">24.5 MA</span>
         </div>
         
         <DataBox title="ESPFAN_RPM_VS_DRAFT" mv={val(3.26)} sp={val(3.0)} unit="mmwc" left={260} top={120} />
         <DataBox title="DBC1B" mv={val(0)} sp={val(0)} unit="A" left={260} top={320} />

         <div className="absolute top-[400px] left-[20px] bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white w-[180px]">
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">FAN V1</span><span className="text-[#00ff00]">{val(0.48)} MM/S</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">FAN V2</span><span className="text-[#00ff00]">{val(0.29)} MM/S</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">BRG T1</span><span className="text-[#00ff00]">{val(50.2)} °C</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">BRG T2</span><span className="text-[#00ff00]">{val(53.6)} °C</span></div>
         </div>

         {/* CM1 & CM2 Levels */}
         <div className="absolute top-[380px] left-[520px] bg-black border border-green-500 text-[#00ff00] font-mono text-[9px] px-1 shadow-[0_0_5px_#00ff00]">{val(6.5)} MTR</div>
         <div className="absolute top-[380px] left-[720px] bg-black border border-green-500 text-[#00ff00] font-mono text-[9px] px-1 shadow-[0_0_5px_#00ff00]">{val(8.1)} MTR</div>
         <div className="absolute top-[380px] left-[920px] bg-black border border-green-500 text-[#00ff00] font-mono text-[9px] px-1 shadow-[0_0_5px_#00ff00]">{val(4.9)} MTR</div>

         {/* Clinker Silo Tonnage */}
         <div className="absolute top-[480px] left-[780px] bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white text-center">
            <div className="text-gray-300 mb-0.5">7.09 M</div>
            <div className="font-bold mb-0.5">CLINKER SILO</div>
            <div className="text-[#00ff00] bg-black px-1 border border-green-500">{val(12487.7)} T</div>
         </div>

         {/* Right Side Control Panel */}
         <div className="absolute top-[30px] right-[20px] flex flex-col gap-1 w-[200px]">
             <div className="bg-black border border-gray-500 text-[#00d4ff] text-center font-bold py-1 text-[9px]">GRP1 DBC1</div>
             <div className="bg-black border border-gray-500 text-[#00d4ff] text-center font-bold py-1 text-[9px]">GRP1_RBC_GRP</div>
             <div className="bg-black border border-gray-500 text-[#00d4ff] text-center font-bold py-1 text-[9px]">CLINKER SILO EXT GROUP</div>
             <div className="bg-black border border-gray-500 text-[#00d4ff] text-center font-bold py-1 text-[9px]">GRP4 ESP</div>
         </div>

      </div>
    </div>
  );
};

export default ScadaClinkerTransport;
