import React, { useState, useEffect } from 'react';

const ScadaCooler = () => {
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

  const Tag = ({ val, unit, left, top, color = "#00ff00", bg = "transparent" }: any) => (
    <div className="absolute font-mono text-[9px] font-bold z-20 px-0.5" style={{ left, top, color, backgroundColor: bg }}>
      {val} <span className="text-[7px] text-gray-300">{unit}</span>
    </div>
  );

  return (
    <div className="relative w-full h-[700px] bg-[#545b63] text-white font-sans overflow-hidden border-2 border-gray-700 select-none rounded">
      
      {/* Top Navigation */}
      <div className="h-6 bg-[#39ff14] flex items-center text-black text-[10px] font-bold overflow-x-auto px-1 gap-1">
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">CRUSHER</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">RAW MILL</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KILN</div>
        <div className="px-2 py-0.5 bg-white border border-black cursor-pointer">COOLER</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">CEMENT MILL</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">PACKING</div>
        <div className="flex-1 text-center text-sm font-black tracking-wider text-black bg-white mx-4 rounded-sm">COOLER</div>
        <div className="flex gap-2 bg-gray-300 px-2 rounded-sm border border-gray-500">
           <span>PLANT <span className="text-green-700">23.27 MW</span></span>
           <span>CPP <span className="text-green-700">12.04 MW</span></span>
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

            {/* --- Main Cooler Body --- */}
            <g transform="translate(150, 250)">
               <polygon points="0,0 800,0 780,100 0,80" fill="url(#mill-green)" stroke="#064e3b" strokeWidth="2" />
               {/* Grate line representation inside */}
               <path d="M 20 40 L 780 50" stroke="#16a34a" strokeWidth="4" strokeDasharray="10 5" />
            </g>
            <text x="70" y="270" fill="black" fontSize="10" fontWeight="bold">TO KILN</text>
            
            {/* Clinker entry from Kiln */}
            <rect x="50" y="220" width="100" height="60" fill="url(#gray-cyl)" stroke="#475569" strokeWidth="2" />
            <text x="60" y="240" fill="black" fontSize="16" fontWeight="bold">1047.5</text>

            {/* --- Cooling Fans (Bottom) --- */}
            <g fill="url(#gray-cyl)" stroke="#475569" strokeWidth="2">
               {/* Generate 8 fans under cooler */}
               {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <g key={i} transform={`translate(${180 + i * 90}, 350)`}>
                     {/* Hopper */}
                     <polygon points="0,0 60,0 45,40 15,40" />
                     {/* Pipe down */}
                     <rect x="25" y="40" width="10" height="40" />
                     {/* Fan spiral */}
                     <circle cx="30" cy="100" r="15" fill="url(#gray-cyl)" />
                     <circle cx="30" cy="100" r="5" fill="#3b82f6" />
                  </g>
               ))}
            </g>

            <path d="M 120 480 L 920 480" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="5 5" />
            
            {/* --- Heat Exchanger / ESP (Top) --- */}
            <g transform="translate(100, 50)">
               <polygon points="20,0 60,0 80,40 0,40" fill="url(#gray-cyl)" stroke="#475569" />
               <rect x="0" y="40" width="80" height="40" fill="url(#gray-cyl)" stroke="#475569" />
               <polygon points="0,80 80,80 50,130 30,130" fill="url(#gray-cyl)" stroke="#475569" />
            </g>
            <path d="M 140 180 L 140 250" fill="none" stroke="#60a5fa" strokeWidth="12" />

            {/* --- Oil Tank & Water Pumps (Top center) --- */}
            <rect x="350" y="60" width="80" height="30" fill="url(#gray-cyl)" stroke="#475569" />
            <text x="360" y="78" fill="black" fontSize="10" fontWeight="bold">OIL TANK</text>

            <g transform="translate(320, 120)" fill="url(#gray-cyl)" stroke="#475569">
               <rect x="0" y="0" width="30" height="30" />
               <circle cx="15" cy="-10" r="10" />
            </g>
            <g transform="translate(420, 120)" fill="url(#gray-cyl)" stroke="#475569">
               <rect x="0" y="0" width="30" height="30" />
               <circle cx="15" cy="-10" r="10" />
            </g>
            <g transform="translate(520, 120)" fill="url(#gray-cyl)" stroke="#475569">
               <rect x="0" y="0" width="30" height="30" />
               <circle cx="15" cy="-10" r="10" />
            </g>
            
            <g transform="translate(680, 80)" fill="url(#gray-cyl)" stroke="#475569">
               <rect x="0" y="0" width="40" height="40" />
               <text x="-5" y="55" fill="black" fontSize="8" fontWeight="bold">WATER PUMP-1</text>
            </g>

         </svg>

         {/* --- HTML Overlay Data Tags & Boxes --- */}
         
         <div className="absolute top-[20px] left-[150px] bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white w-[120px]">
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">COOLER ESP FAN</span><span className="text-[#00ff00]">{val(439.7)} RPM</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">KN FEED</span><span className="text-[#00ff00]">{val(337.7)} TPH</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">KN FIRING</span><span className="text-[#00ff00]">{val(10.1)} TPH</span></div>
         </div>

         {/* Oil tank data */}
         <Tag val={val(272.1)} unit="°C" left={300} top={50} color="#facc15" />
         <Tag val={val(374.0)} unit="°C" left={400} top={50} />
         <Tag val={val(128.9)} unit="BAR" left={370} top={180} />
         <Tag val={val(33.0)} unit="AMP" left={370} top={195} />

         <DataBox title="W1K05" mv={val(12.7)} sp={val(12.7)} unit="SPM" left={560} top={270} />

         {/* Fan Data Boxes (Bottom) */}
         {[1, 2, 3, 4, 5, 6, 7].map((fan, i) => (
            <DataBox key={fan} title={`W1K1${fan}_M`} mv={val(2980)} sp={val(2950)} unit="RPM" left={130 + i * 90} top={480} />
         ))}

         {/* WHR PARAMETER Box (Top Right) */}
         <div className="absolute top-[20px] right-[20px] bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white w-[300px]">
            <div className="bg-gray-300 text-black text-center font-bold mb-1">WHR PARAMETER</div>
            <div className="grid grid-cols-2 gap-x-2">
               <div>
                  <div className="flex justify-between mb-0.5"><span className="text-gray-300">BOILER I/L TEMP</span><span className="text-[#00ff00]">{val(399.1)} °C</span></div>
                  <div className="flex justify-between mb-0.5"><span className="text-gray-300">BOILER O/L DRGHT</span><span className="text-[#00ff00]">{val(144.5)} mmwc</span></div>
                  <div className="flex justify-between mb-0.5"><span className="text-gray-300">BOILER I/L DAMP</span><span className="text-[#00ff00]">{val(96.3)} %</span></div>
               </div>
               <div>
                  <div className="flex justify-between mb-0.5"><span className="text-gray-300">AQC I/L T</span><span className="text-[#00ff00]">{val(374.0)} °C</span></div>
                  <div className="flex justify-between mb-0.5"><span className="text-gray-300">BOILER I/L DRAFT</span><span className="text-[#00ff00]">{val(-22.1)} mmwc</span></div>
                  <div className="flex justify-between mb-0.5"><span className="text-gray-300">FRESH AIR DAMP</span><span className="text-[#00ff00]">{val(-1.2)} %</span></div>
               </div>
            </div>
         </div>

         {/* Flow / Temp Tables at bottom right */}
         <div className="absolute bottom-[20px] right-[20px] bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white w-[180px]">
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">W1K10_DE_TEMP</span><span className="text-[#00ff00]">{val(56.4)} °C</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">W1K10_NDE_TEMP</span><span className="text-[#00ff00]">{val(49.5)} °C</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">W1K11_DE_TEMP</span><span className="text-[#00ff00]">{val(59.1)} °C</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">W1K11_NDE_TEMP</span><span className="text-[#00ff00]">{val(54.6)} °C</span></div>
         </div>

      </div>
    </div>
  );
};

export default ScadaCooler;
