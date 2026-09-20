import React, { useState, useEffect } from 'react';

const ScadaRawMill = () => {
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
      
      {/* Top Navigation (Classic Green Bar) */}
      <div className="h-6 bg-[#39ff14] flex items-center text-black text-[10px] font-bold overflow-x-auto px-1 gap-1">
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">CRUSHER</div>
        <div className="px-2 py-0.5 bg-white border border-black cursor-pointer">RAW MILL</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KILN</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">COOLER</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">CEMENT MILL</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">PACKING</div>
        <div className="flex-1 text-center text-sm font-black tracking-wider text-black bg-white mx-4 rounded-sm">RAW MILL 1</div>
        <div className="flex gap-2 bg-gray-300 px-2 rounded-sm border border-gray-500">
           <span>PLANT <span className="text-green-700">23.27 MW</span></span>
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
               <linearGradient id="hopper-gray" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#64748b" />
               </linearGradient>
            </defs>

            {/* Hoppers */}
            <g transform="translate(150, 100)">
               <polygon points="0,0 60,0 45,60 15,60" fill="url(#hopper-gray)" stroke="#475569" />
               <rect x="0" y="-20" width="60" height="20" fill="url(#hopper-gray)" stroke="#475569" />
               <text x="5" y="-5" fill="black" fontSize="10" fontWeight="bold">LIMESTONE</text>
               <rect x="15" y="60" width="30" height="10" fill="#22c55e" />
            </g>
            <g transform="translate(250, 100)">
               <polygon points="0,0 60,0 45,60 15,60" fill="url(#hopper-gray)" stroke="#475569" />
               <rect x="0" y="-20" width="60" height="20" fill="url(#hopper-gray)" stroke="#475569" />
               <text x="5" y="-5" fill="black" fontSize="10" fontWeight="bold">ADDITIVE</text>
               <rect x="15" y="60" width="30" height="10" fill="#22c55e" />
            </g>

            {/* Conveyor */}
            <path d="M 120 200 L 320 200 L 400 300" fill="none" stroke="#cbd5e1" strokeWidth="6" />

            {/* VRM Mill (Center) */}
            <g transform="translate(350, 300)">
               <polygon points="10,0 110,0 120,60 0,60" fill="url(#mill-green)" />
               <rect x="0" y="60" width="120" height="100" fill="url(#mill-green)" stroke="#064e3b" strokeWidth="2" />
               {/* Separator on top */}
               <path d="M 20 0 C 20 -50, 100 -50, 100 0 Z" fill="url(#gray-cyl)" />
               <text x="30" y="110" fill="black" fontSize="14" fontWeight="bold">RAW MILL 1</text>
               
               <circle cx="60" cy="180" r="15" fill="#3b82f6" />
               <text x="56" y="184" fill="white" fontSize="10" fontWeight="bold">M</text>
            </g>

            {/* Gas Ducts */}
            <path d="M 320 400 L 250 400 L 250 500 L 60 500" fill="none" stroke="#ef4444" strokeWidth="8" opacity="0.8" />
            
            <path d="M 450 250 L 550 250 L 550 150 L 650 150" fill="none" stroke="#cbd5e1" strokeWidth="12" />

            {/* Bag Filter */}
            <g transform="translate(650, 100)">
               <rect x="0" y="0" width="160" height="100" fill="url(#mill-green)" stroke="#064e3b" strokeWidth="2" />
               <polygon points="0,100 53,100 43,140 10,140" fill="url(#mill-green)" stroke="#064e3b" />
               <polygon points="53,100 106,100 96,140 63,140" fill="url(#mill-green)" stroke="#064e3b" />
               <polygon points="106,100 160,100 150,140 116,140" fill="url(#mill-green)" stroke="#064e3b" />
               <text x="45" y="55" fill="black" fontSize="14" fontWeight="bold">BAG FILTER</text>
            </g>

            {/* Mill Fan */}
            <g transform="translate(900, 200)">
               <circle cx="40" cy="40" r="40" fill="url(#gray-cyl)" stroke="#475569" strokeWidth="2" />
               <rect x="30" y="-20" width="20" height="40" fill="url(#gray-cyl)" />
               <circle cx="40" cy="40" r="15" fill="#3b82f6" />
               <text x="36" y="44" fill="white" fontSize="10" fontWeight="bold">M</text>
            </g>

            <path d="M 810 180 L 900 180" fill="none" stroke="#cbd5e1" strokeWidth="12" />
            <path d="M 940 180 L 940 100 L 1050 100" fill="none" stroke="#cbd5e1" strokeWidth="12" />

         </svg>

         {/* --- HTML Overlay Data Tags & Boxes --- */}
         <DataBox title="RM_FEED" mv={val(285.3)} sp={val(290.0)} unit="TPH" left={200} top={220} />
         
         <DataBox title="MILL_MOTOR" mv={val(3200)} sp={val(3250)} unit="KW" left={280} top={480} />
         
         <DataBox title="SEP_SPEED" mv={val(85)} sp={val(85)} unit="RPM" left={480} top={260} />
         
         <DataBox title="FAN_SPEED" mv={val(1150)} sp={val(1150)} unit="RPM" left={960} top={220} />

         {/* Right Side Info Box */}
         <div className="absolute top-[30px] right-[20px] bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white w-[250px]">
            <div className="bg-gray-300 text-black text-center font-bold mb-1">RAW MILL PARAMETERS</div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">MILL DP</span><span className="text-[#00ff00]">{val(625)} mmWC</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">INLET TEMP</span><span className="text-red-400">{val(280)} °C</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">OUTLET TEMP</span><span className="text-[#00ff00]">{val(87.5)} °C</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">VIBRATION</span><span className="text-yellow-400">{val(3.8)} mm/s</span></div>
            <div className="flex justify-between mb-0.5 border-t border-gray-600 pt-0.5 mt-0.5"><span className="text-gray-300">MILL POWER</span><span className="text-[#00ff00]">{val(3200)} KW</span></div>
         </div>

      </div>
    </div>
  );
};

export default ScadaRawMill;
