import React, { useState, useEffect } from 'react';

const ScadaCrusher = () => {
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
        <div className="px-2 py-0.5 bg-white border border-black cursor-pointer">CRUSHER</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">RAW MILL</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KILN</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">COOLER</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">CEMENT MILL</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">PACKING</div>
        <div className="flex-1 text-center text-sm font-black tracking-wider text-black bg-white mx-4 rounded-sm">LIMESTONE CRUSHER</div>
        <div className="flex gap-2 bg-gray-300 px-2 rounded-sm border border-gray-500">
           <span>PLANT <span className="text-green-700">23.27 MW</span></span>
        </div>
      </div>

      <div className="flex-1 relative w-full h-full p-2">
         
         <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1200 650" preserveAspectRatio="xMidYMid slice">
            <defs>
               <linearGradient id="machine-green" x1="0%" y1="0%" x2="0%" y2="100%">
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

            {/* Limestone Yard */}
            <path d="M 50 350 L 150 200 L 250 350 Z" fill="#64748b" />

            {/* Reclaimer */}
            <line x1="150" y1="200" x2="350" y2="150" stroke="#facc15" strokeWidth="8" />

            {/* Hopper */}
            <g transform="translate(450, 100)">
               <polygon points="0,0 120,0 90,80 30,80" fill="url(#gray-cyl)" />
               <rect x="-10" y="0" width="140" height="10" fill="#475569" />
               <text x="35" y="45" fill="black" fontSize="14" fontWeight="bold">HOPPER</text>
            </g>

            {/* Crusher */}
            <g transform="translate(470, 220)">
               <polygon points="0,0 80,0 90,60 -10,60" fill="url(#machine-green)" />
               <rect x="-10" y="60" width="100" height="40" fill="url(#machine-green)" stroke="#064e3b" strokeWidth="2" />
               <polygon points="-10,100 90,100 70,160 10,160" fill="url(#machine-green)" />
               <text x="5" y="85" fill="black" fontSize="14" fontWeight="bold">CRUSHER</text>

               <circle cx="90" cy="80" r="15" fill="#3b82f6" />
               <text x="86" y="84" fill="white" fontSize="10" fontWeight="bold">M</text>
            </g>

            {/* Belts */}
            <path d="M 510 400 L 800 400" fill="none" stroke="#cbd5e1" strokeWidth="8" />
            
            {/* Bag Filter */}
            <g transform="translate(850, 100)">
               <rect x="0" y="0" width="120" height="80" fill="url(#machine-green)" stroke="#064e3b" strokeWidth="2" />
               <polygon points="0,80 60,80 45,120 15,120" fill="url(#machine-green)" stroke="#064e3b" />
               <polygon points="60,80 120,80 105,120 75,120" fill="url(#machine-green)" stroke="#064e3b" />
               <text x="25" y="45" fill="black" fontSize="12" fontWeight="bold">BAG FILTER</text>
            </g>

            <path d="M 580 300 L 750 300 L 750 140 L 850 140" fill="none" stroke="#cbd5e1" strokeWidth="12" />

         </svg>

         {/* --- HTML Overlay Data Tags & Boxes --- */}
         <DataBox title="RECLAIM RATE" mv={val(1150)} sp={val(1150)} unit="TPH" left={180} top={80} />
         
         <DataBox title="CRUSHER_PWR" mv={val(420)} sp={val(450)} unit="KW" left={600} top={280} />
         
         <DataBox title="BELT_SPEED" mv={val(3.0)} sp={val(3.0)} unit="M/S" left={600} top={420} />

         <div className="absolute top-[30px] right-[20px] bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white w-[250px]">
            <div className="bg-gray-300 text-black text-center font-bold mb-1">CRUSHER PARAMETERS</div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">FEED RATE</span><span className="text-[#00ff00]">{val(1045)} TPH</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">CRUSHER LOAD</span><span className="text-[#00ff00]">{val(72)} %</span></div>
            <div className="flex justify-between mb-0.5 border-t border-gray-600 pt-0.5 mt-0.5"><span className="text-gray-300">TOTAL ENERGY</span><span className="text-[#00ff00]">{val(11810)} kWh</span></div>
         </div>

      </div>
    </div>
  );
};

export default ScadaCrusher;
