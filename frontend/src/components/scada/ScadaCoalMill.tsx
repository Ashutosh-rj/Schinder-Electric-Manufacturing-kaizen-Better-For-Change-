import React, { useState, useEffect } from 'react';

const ScadaCoalMill = () => {
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
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">CR</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">RM1</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">RM2</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KM1</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KM2</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KILN</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KILN FEED</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">COOLER</div>
        <div className="px-2 py-0.5 bg-white border border-black cursor-pointer">CM1</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">CM2</div>
        <div className="flex-1 text-center text-sm font-black tracking-wider text-black bg-white mx-4 rounded-sm">COAL MILL 1</div>
        <div className="flex gap-2 bg-gray-300 px-2 rounded-sm border border-gray-500">
           <span>PLANT <span className="text-green-700">23.27 MW</span></span>
           <span>CPP <span className="text-green-700">12.03 MW</span></span>
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
               <linearGradient id="flame" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="30%" stopColor="#f59e0b" />
                  <stop offset="80%" stopColor="#ef4444" stopOpacity="0.8" />
               </linearGradient>
            </defs>

            {/* --- PIPES --- */}
            {/* Duct from Mill to Separator */}
            <path d="M 600 300 L 600 120 L 530 120" fill="none" stroke="#cbd5e1" strokeWidth="12" />
            
            {/* Duct from Separator to Dust Collector */}
            <path d="M 450 60 L 500 60" fill="none" stroke="#cbd5e1" strokeWidth="8" />

            {/* Stack duct */}
            <path d="M 680 80 L 760 80 L 760 30" fill="none" stroke="#cbd5e1" strokeWidth="8" />

            {/* Raw Coal Feeder path */}
            <path d="M 230 400 L 230 450 L 300 450 L 300 380 L 400 380" fill="none" stroke="#60a5fa" strokeWidth="6" />

            {/* --- VENT BAG FILTER (Left) --- */}
            <g transform="translate(40, 100)">
               <rect x="0" y="0" width="80" height="60" fill="url(#mill-green)" stroke="#064e3b" strokeWidth="2" />
               <polygon points="0,60 80,60 60,110 20,110" fill="url(#mill-green)" stroke="#064e3b" />
               <text x="15" y="30" fill="black" fontSize="9" fontWeight="bold">VENT BAG</text>
               <text x="25" y="45" fill="black" fontSize="9" fontWeight="bold">FILTER</text>
            </g>

            {/* --- SEPARATOR K1S05 --- */}
            <g transform="translate(370, 120)">
               <polygon points="10,0 70,0 80,40 0,40" fill="url(#mill-green)" stroke="#064e3b" />
               <rect x="0" y="40" width="80" height="40" fill="url(#mill-green)" />
               <polygon points="0,80 80,80 60,120 20,120" fill="url(#mill-green)" />
               <circle cx="40" cy="60" r="15" fill="#3b82f6" />
               <text x="36" y="64" fill="white" fontSize="10" fontWeight="bold">M</text>
            </g>

            {/* --- MAIN DUST COLLECTOR K1P11 --- */}
            <g transform="translate(500, 40)">
               <polygon points="20,0 160,0 180,40 0,40" fill="url(#mill-green)" />
               <rect x="0" y="40" width="180" height="60" fill="url(#mill-green)" stroke="#064e3b" />
               {/* Hoppers */}
               <polygon points="0,100 80,100 60,150 20,150" fill="url(#mill-green)" stroke="#064e3b" />
               <polygon points="100,100 180,100 160,150 120,150" fill="url(#mill-green)" stroke="#064e3b" />
            </g>

            {/* Stack Fan */}
            <g transform="translate(700, 60)">
               <circle cx="20" cy="20" r="20" fill="url(#mill-green)" stroke="#064e3b" />
               <circle cx="20" cy="20" r="10" fill="#3b82f6" />
            </g>

            {/* Stack */}
            <g transform="translate(750, 0)">
               <polygon points="0,30 20,30 15,0 5,0" fill="url(#gray-cyl)" />
            </g>

            {/* --- RAW COAL HOPPER --- */}
            <g transform="translate(180, 280)">
               <polygon points="0,0 100,0 80,80 20,80" fill="#e2e8f0" stroke="#94a3b8" />
               <rect x="0" y="-10" width="100" height="10" fill="#cbd5e1" />
            </g>
            <text x="210" y="320" fill="black" fontSize="14" fontWeight="bold">RAW</text>

            <g transform="translate(200, 370)">
               <polygon points="0,0 60,0 45,30 15,30" fill="url(#mill-green)" />
            </g>
            <rect x="210" y="430" width="40" height="20" fill="url(#gray-cyl)" />

            {/* --- COAL MILL 1 (Main cylinder) --- */}
            <g transform="translate(420, 320)">
               {/* Cones on edges */}
               <polygon points="0,30 40,0 40,120 0,90" fill="url(#mill-green)" stroke="#064e3b" />
               
               {/* Main body */}
               <rect x="40" y="0" width="220" height="120" fill="url(#mill-green)" stroke="#064e3b" strokeWidth="2" />
               
               <polygon points="260,0 300,30 300,90 260,120" fill="url(#mill-green)" stroke="#064e3b" />

               {/* Grid pattern on mill body */}
               <line x1="120" y1="0" x2="120" y2="120" stroke="#064e3b" strokeWidth="1" />
               <line x1="160" y1="0" x2="160" y2="120" stroke="#064e3b" strokeWidth="1" />
               <line x1="200" y1="0" x2="200" y2="120" stroke="#064e3b" strokeWidth="1" />
               <line x1="40" y1="40" x2="260" y2="40" stroke="#064e3b" strokeWidth="1" />
               <line x1="40" y1="80" x2="260" y2="80" stroke="#064e3b" strokeWidth="1" />

               {/* Center text box */}
               <rect x="90" y="45" width="120" height="30" fill="white" stroke="black" />
               <text x="100" y="65" fill="black" fontSize="14" fontWeight="bold">COAL MILL - 1</text>

               {/* Motors underneath */}
               <rect x="10" y="130" width="40" height="20" fill="url(#gray-cyl)" />
               <rect x="60" y="130" width="40" height="20" fill="url(#gray-cyl)" />
               <circle cx="110" cy="140" r="15" fill="#3b82f6" />
               <text x="106" y="144" fill="white" fontSize="10" fontWeight="bold">M</text>
            </g>

            {/* Furnace bottom right */}
            <g transform="translate(800, 350)">
               <path d="M 0 50 Q 20 0, 40 0 Q 60 0, 80 50 Z" fill="url(#gray-cyl)" stroke="#475569" strokeWidth="2" />
               <rect x="0" y="50" width="80" height="40" fill="url(#gray-cyl)" stroke="#475569" strokeWidth="2" />
               <rect x="10" y="60" width="60" height="20" fill="url(#flame)" stroke="black" />
               <text x="20" y="105" fill="white" fontSize="10" fontWeight="bold">FURNACE</text>
            </g>

         </svg>

         {/* --- HTML Overlay Data Tags & Boxes --- */}
         
         <DataBox title="316FA48" mv={val(4.7)} sp={val(4.7)} unit="Bar" left={20} top={40} />
         <DataBox title="PCB1_SLG" mv={val(68.9)} sp={val(67.2)} unit="°C" left={20} top={240} />
         
         <DataBox title="K1S05" mv={val(1093.7)} sp={val(1125.0)} unit="RPM" left={320} top={200} />
         <Tag val={val(68.25)} unit="°C" left={400} top={300} />
         <Tag val={val(393.4)} unit="mmWC" left={400} top={280} color="#00d4ff" />

         <DataBox title="K1P11PD1" mv={val(96.7)} sp={val(96.7)} unit="mmWC" left={560} top={120} />
         
         <DataBox title="K1P01" mv={val(937.1)} sp={val(931.8)} unit="RPM" left={700} top={140} />

         {/* Right Side Tables */}
         <div className="absolute top-[20px] right-[20px] flex flex-col gap-2 w-[220px]">
             
             {/* BF TEMP */}
             <div className="bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white">
                <div className="bg-gray-300 text-black text-center font-bold mb-1">BF TEMP</div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">1</span><span className="text-[#00ff00]">{val(67.9)} °C</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">2</span><span className="text-[#00ff00]">{val(64.4)} °C</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">3</span><span className="text-[#00ff00]">{val(66.1)} °C</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">4</span><span className="text-[#00ff00]">{val(66.3)} °C</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">5</span><span className="text-[#00ff00]">{val(67.1)} °C</span></div>
             </div>

             {/* COAL MILL N2 PLANT */}
             <div className="bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white">
                <div className="bg-gray-300 text-black text-center font-bold mb-1">COAL MILL N2 PLANT</div>
                <div className="flex justify-between mb-1">
                   <span className="text-gray-300">YESTERDAY</span>
                   <span className="text-gray-300">TODAY</span>
                </div>
                <div className="flex justify-between mb-1 text-[#00ff00]">
                   <span>8h 26m 22s 100ms</span>
                   <span>3h 50m 18s 350ms</span>
                </div>
                <div className="text-gray-300 mb-1">COMPRESSOR RUNNING HOURS</div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">N2 TANK 1 PRS</span><span className="text-[#00ff00]">{val(4.0)} KG/CM2</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">N2 TANK 2 PRS</span><span className="text-[#00ff00]">{val(3.0)} KG/CM2</span></div>
             </div>

             {/* COAL MILL-1 MOTOR TEMPERATURE */}
             <div className="bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white">
                <div className="bg-gray-300 text-black text-center font-bold mb-1">COAL MILL-1 MOTOR TEMPERATURE</div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">1 Bearing DE Temp</span><span className="text-yellow-400">{val(70.8)} °C</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">2 Bearing NDE Temp</span><span className="text-[#00ff00]">{val(62.6)} °C</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">3 Winding R Temp</span><span className="text-[#00ff00]">{val(62.9)} °C</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">4 Winding Y Temp</span><span className="text-[#00ff00]">{val(60.1)} °C</span></div>
             </div>
         </div>

         {/* Left Side PCB TEMP Table */}
         <div className="absolute top-[280px] left-[20px] w-[120px]">
             <div className="bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white">
                <div className="bg-gray-300 text-black text-center font-bold mb-1">PCB TEMP</div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">1</span><span className="text-[#00ff00]">{val(54.2)} °C</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">2</span><span className="text-[#00ff00]">{val(50.8)} °C</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">3</span><span className="text-[#00ff00]">{val(42.5)} °C</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">4</span><span className="text-[#00ff00]">{val(51.8)} °C</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">5</span><span className="text-[#00ff00]">{val(49.9)} °C</span></div>
             </div>
             
             {/* KILN ROTOR W/F Box */}
             <div className="bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white mt-2">
                <div className="bg-gray-300 text-black text-center font-bold mb-1">KILN ROTOR W/F</div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">SP</span><span className="text-[#00d4ff] bg-black px-1 font-bold">{val(10.0)}</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">MV</span><span className="text-[#00ff00]">{val(10.1)} TPH</span></div>
                <div className="flex justify-between mb-0.5"><span className="text-gray-300">RPM</span><span className="text-[#00ff00]">{val(839.4)} RPM</span></div>
             </div>
         </div>

      </div>
    </div>
  );
};

export default ScadaCoalMill;
