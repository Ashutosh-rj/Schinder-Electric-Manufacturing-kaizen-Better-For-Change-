import React, { useState, useEffect } from 'react';

const ScadaKiln = () => {
  const [fluc, setFluc] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFluc(Math.random() * 2 - 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const val = (base: number, volatility = 0.02) => (base + fluc * (base * volatility)).toFixed(1);
  const valInt = (base: number, volatility = 0.02) => Math.round(base + fluc * (base * volatility));

  // Classic SCADA Data Box
  const DataBox = ({ title, mv, sp, unit, left = 0, top = 0 }: any) => (
    <div className="absolute bg-black border border-gray-500 p-0.5 text-[8px] font-mono shadow-md z-20" style={{ left, top, minWidth: '80px' }}>
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

  const Tag = ({ val, unit, left, top, color = "#00ff00" }: any) => (
    <div className="absolute font-mono text-[9px] font-bold z-20" style={{ left, top, color }}>
      {val} <span className="text-[7px] text-gray-300">{unit}</span>
    </div>
  );

  return (
    <div className="relative w-full h-[700px] bg-[#545b63] text-white font-sans overflow-hidden border-2 border-gray-700 select-none rounded">
      
      {/* Top Navigation (Classic Green Bar) */}
      <div className="h-6 bg-[#39ff14] flex items-center text-black text-[10px] font-bold overflow-x-auto px-1 gap-1">
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">CR</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">RM1</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">RM2</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KM1</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KM2</div>
        <div className="px-2 py-0.5 bg-white border border-black cursor-pointer">KILN</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">KILN FEED</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">COOLER</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">CM1</div>
        <div className="px-2 py-0.5 hover:bg-white cursor-pointer">CM2</div>
        <div className="flex-1 text-center text-sm font-black tracking-wider text-black bg-white mx-4 rounded-sm">PREHEATER & KILN</div>
        <div className="flex gap-2 bg-gray-300 px-2 rounded-sm border border-gray-500">
           <span>PLANT <span className="text-green-700">22.52 MW</span></span>
           <span>CPP <span className="text-green-700">12.03 MW</span></span>
        </div>
      </div>

      {/* Main SCADA Area */}
      <div className="flex-1 relative w-full h-full p-2">
         
         <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1200 650" preserveAspectRatio="xMidYMid slice">
            <defs>
               <linearGradient id="kiln-green" x1="0%" y1="0%" x2="0%" y2="100%">
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
               <linearGradient id="pipe-gray" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#64748b" />
               </linearGradient>
            </defs>

            {/* --- Pipes (Background) --- */}
            <g stroke="#94a3b8" strokeWidth="6" fill="none" strokeLinejoin="round">
               <path d="M 180 150 L 180 200 L 220 200 L 220 250" />
               <path d="M 280 150 L 280 200 L 240 200 L 240 250" />
               <path d="M 380 90 L 380 130 L 440 130 L 440 250" />
               <path d="M 520 90 L 520 130 L 460 130 L 460 250" />
               
               <path d="M 220 320 L 220 400 L 270 400 L 270 450" />
               <path d="M 450 320 L 450 400 L 380 400 L 380 450" />
            </g>

            <g stroke="#3b82f6" strokeWidth="4" fill="none">
               {/* Gas ducts */}
               <path d="M 220 250 L 220 220 L 350 220 L 350 170" />
               <path d="M 450 250 L 450 220 L 320 220 L 320 170" />
            </g>

            {/* --- Cyclones (Top Left) --- */}
            {/* Row 1 */}
            <g transform="translate(150, 80)">
               <polygon points="0,0 60,0 45,70 15,70" fill="url(#gray-cyl)" stroke="#475569" />
               <rect x="0" y="0" width="60" height="20" fill="url(#gray-cyl)" stroke="#475569" />
               <text x="20" y="15" fill="black" fontSize="10" fontWeight="bold">A51</text>
            </g>
            <g transform="translate(250, 80)">
               <polygon points="0,0 60,0 45,70 15,70" fill="url(#gray-cyl)" stroke="#475569" />
               <rect x="0" y="0" width="60" height="20" fill="url(#gray-cyl)" stroke="#475569" />
               <text x="20" y="15" fill="black" fontSize="10" fontWeight="bold">A61</text>
            </g>
            <g transform="translate(350, 40)">
               <polygon points="0,0 60,0 45,70 15,70" fill="url(#gray-cyl)" stroke="#475569" />
               <rect x="0" y="0" width="60" height="20" fill="url(#gray-cyl)" stroke="#475569" />
               <text x="20" y="15" fill="black" fontSize="10" fontWeight="bold">B51</text>
            </g>
            <g transform="translate(450, 40)">
               <polygon points="0,0 60,0 45,70 15,70" fill="url(#gray-cyl)" stroke="#475569" />
               <rect x="0" y="0" width="60" height="20" fill="url(#gray-cyl)" stroke="#475569" />
               <text x="20" y="15" fill="black" fontSize="10" fontWeight="bold">B61</text>
            </g>

            {/* Row 2 */}
            <g transform="translate(190, 250)">
               <polygon points="0,0 60,0 45,70 15,70" fill="url(#gray-cyl)" stroke="#475569" />
               <rect x="0" y="0" width="60" height="20" fill="url(#gray-cyl)" stroke="#475569" />
               <text x="20" y="15" fill="black" fontSize="10" fontWeight="bold">A52</text>
            </g>
            <g transform="translate(390, 250)">
               <polygon points="0,0 60,0 45,70 15,70" fill="url(#gray-cyl)" stroke="#475569" />
               <rect x="0" y="0" width="60" height="20" fill="url(#gray-cyl)" stroke="#475569" />
               <text x="20" y="15" fill="black" fontSize="10" fontWeight="bold">B52</text>
            </g>
            
            {/* Calciner */}
            <g transform="translate(600, 200)">
               <polygon points="0,0 80,0 60,80 20,80" fill="url(#gray-cyl)" />
               <rect x="0" y="0" width="80" height="40" fill="url(#gray-cyl)" />
               <polygon points="20,80 60,80 80,140 0,140" fill="url(#gray-cyl)" />
               <rect x="-10" y="140" width="100" height="30" fill="url(#gray-cyl)" />
            </g>
            
            <g transform="translate(780, 280)">
               <polygon points="0,0 80,0 60,60 20,60" fill="url(#gray-cyl)" />
               <rect x="0" y="0" width="80" height="20" fill="url(#gray-cyl)" />
               <polygon points="20,60 60,60 70,90 10,90" fill="url(#gray-cyl)" />
               <rect x="10" y="90" width="60" height="40" fill="url(#gray-cyl)" />
            </g>

            {/* --- Kiln Cylinder (Bright Green with Flames) --- */}
            <g transform="translate(280, 480)">
               <rect x="0" y="0" width="460" height="60" fill="url(#kiln-green)" stroke="#064e3b" strokeWidth="2" />
               
               {/* Riding Rings */}
               <rect x="40" y="-10" width="25" height="80" fill="#3b82f6" rx="2" />
               <rect x="200" y="-10" width="25" height="80" fill="#3b82f6" rx="2" />
               <rect x="360" y="-10" width="25" height="80" fill="#3b82f6" rx="2" />

               {/* Section labels */}
               <text x="180" y="30" fill="black" fontSize="9" fontWeight="bold">Rotary Kiln</text>
               <text x="280" y="20" fill="black" fontSize="8">Kiln Burning</text>
               <text x="280" y="30" fill="black" fontSize="8">Zone Temp</text>
               
               <rect x="280" y="35" width="45" height="15" fill="#ef4444" stroke="black" />
               <text x="282" y="46" fill="white" fontSize="10" fontWeight="bold">{val(756.7, 0.01)} °C</text>

               {/* Hood Temp */}
               <rect x="370" y="35" width="45" height="15" fill="#ef4444" stroke="black" />
               <text x="372" y="46" fill="white" fontSize="10" fontWeight="bold">{val(1047.1, 0.01)} °C</text>

               {/* Flame SVG */}
               <path d="M 460 20 Q 420 20, 390 30 T 360 30 Q 380 40, 420 40 Q 450 40, 460 20 Z" fill="#facc15" />
               <path d="M 460 25 Q 430 25, 400 30 Q 430 35, 460 25 Z" fill="#ef4444" />
            </g>

            {/* Kiln Hood (Right) */}
            <rect x="740" y="460" width="40" height="100" fill="url(#gray-cyl)" stroke="#475569" />
            <path d="M 780 500 L 780 550 L 880 550 L 880 520 Z" fill="url(#gray-cyl)" stroke="#475569" />

            {/* IKN Cooler (Left bottom block) */}
            <rect x="10" y="450" width="120" height="100" fill="url(#kiln-green)" stroke="#064e3b" />
            <text x="20" y="470" fill="black" fontSize="10" fontWeight="bold">IKN COOLER</text>
            <rect x="20" y="480" width="60" height="20" fill="black" />
            <text x="22" y="492" fill="#00ff00" fontSize="10" fontFamily="monospace">12.7 SPM</text>

            {/* Fans & Motors (Small circles) */}
            <circle cx="100" cy="90" r="12" fill="#3b82f6" />
            <text x="96" y="94" fill="white" fontSize="10" fontWeight="bold">M</text>
            
            <circle cx="490" cy="50" r="12" fill="#3b82f6" />
            <text x="486" y="54" fill="white" fontSize="10" fontWeight="bold">M</text>
            
            <circle cx="460" cy="460" r="12" fill="#3b82f6" />
            <text x="456" y="464" fill="white" fontSize="10" fontWeight="bold">M</text>

            <circle cx="260" cy="460" r="12" fill="#3b82f6" />
            <text x="256" y="464" fill="white" fontSize="10" fontWeight="bold">M</text>

         </svg>

         {/* --- HTML Overlay Data Tags & Boxes --- */}

         {/* PC FEED */}
         <DataBox title="PC FEED" mv={val(313.1)} sp={val(310.0)} unit="TPH" left={170} top={80} />
         
         <Tag val={val(22.17)} unit="mmWC" left={30} top={50} />
         <Tag val={val(1345.1)} unit="kW" left={60} top={80} />
         <Tag val={val(273.3)} unit="kW" left={70} top={160} />
         <Tag val={val(157.8)} unit="TPH" left={130} top={190} color="#00d4ff" />
         
         <Tag val={val(307.8)} unit="mmWC" left={200} top={210} color="#00ff00" />
         <Tag val={val(250.0)} unit="mmWC" left={270} top={210} color="#00ff00" />
         
         <DataBox title="TOTAL FEED" mv={val(337.3)} unit="TPH" left={10} top={350} />

         {/* Top Right Graph area mock */}
         <div className="absolute top-[30px] left-[550px] w-[350px] h-[70px] bg-black border-2 border-gray-500 overflow-hidden p-1">
             <div className="text-white text-[8px] flex justify-between">
                <span>KILN TORQUE</span>
                <span>STARTUP BYPASS</span>
                <span>TREND</span>
             </div>
             {/* Fake zigzag line for chart */}
             <svg width="100%" height="40" className="mt-1">
                 <polyline points="0,20 10,5 20,35 30,10 40,30 50,15 60,25 70,5 80,35 90,15 100,25 110,10 120,30 130,5 140,35 150,15 160,25 170,10 180,30 190,5 200,35 210,15 220,25 230,10 240,30 250,5 260,35 270,15 280,25 290,10 300,30 310,5 320,35 330,15 340,25" fill="none" stroke="#00ff00" strokeWidth="1" />
             </svg>
         </div>

         {/* Kiln Parameters Panel (Right side) */}
         <div className="absolute top-[30px] left-[920px] w-[250px] bg-[#42494f] border border-gray-500 p-1 text-[9px] font-mono shadow-lg">
             <div className="bg-gray-300 text-black text-center font-bold mb-1">KILN PARAMETERS</div>
             <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                <div className="flex justify-between"><span className="text-gray-300">A51T1</span><span className="text-[#00ff00]">{val(306.1)} °C</span></div>
                <div className="flex justify-between"><span className="text-gray-300">GCT1</span><span className="text-[#00ff00]">{val(169.6)} °C</span></div>
                <div className="flex justify-between"><span className="text-gray-300">A52T1</span><span className="text-[#00ff00]">{val(334.6)} °C</span></div>
                <div className="flex justify-between"><span className="text-gray-300">GCT2</span><span className="text-[#00ff00]">{val(162.2)} °C</span></div>
                <div className="flex justify-between"><span className="text-gray-300">A53T1</span><span className="text-[#00ff00]">{val(496.2)} °C</span></div>
                <div className="flex justify-between"><span className="text-gray-300">A5P1</span><span className="text-[#00d4ff]">{val(23.5)} mmWC</span></div>
                <div className="flex justify-between"><span className="text-gray-300">A54T1</span><span className="text-red-400 font-bold bg-black px-1">{val(790.5)} °C</span></div>
                <div className="flex justify-between"><span className="text-gray-300">A5P3</span><span className="text-[#00d4ff]">{val(196.7)} mmWC</span></div>
                <div className="flex justify-between"><span className="text-gray-300">B51T1</span><span className="text-[#00ff00]">{val(581.9)} °C</span></div>
                <div className="flex justify-between"><span className="text-gray-300">A54P1</span><span className="text-red-400 font-bold bg-black px-1">{val(137.5)} mmWC</span></div>
                <div className="flex justify-between"><span className="text-gray-300">B52T1</span><span className="text-[#00ff00]">{val(722.0)} °C</span></div>
                <div className="flex justify-between"><span className="text-gray-300">B5P3</span><span className="text-[#00d4ff]">{val(198.8)} mmWC</span></div>
             </div>
             <div className="bg-gray-300 text-black text-center font-bold mt-2 mb-1">KILN COAL ROTOR</div>
             <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                <div className="flex justify-between"><span className="text-gray-300">WF</span><span className="text-[#00ff00]">{val(10.1)} TPH</span></div>
                <div className="flex justify-between"><span className="text-gray-300">SP</span><span className="text-[#00d4ff]">{val(10.0)} TPH</span></div>
             </div>
         </div>

         {/* PC ROTOR WF */}
         <DataBox title="PC ROTOR WF" mv={val(24.4)} sp={val(24.5)} unit="TPH" left={600} top={270} />

         {/* BLOWER PIDS and Boxes (Bottom right) */}
         <DataBox title="START_AERATION" mv={val(158.8)} sp={val(370.0)} unit="RPM" left={920} top={550} />
         <DataBox title="BLOWER SEL" mv={val(3203.07)} sp={val(3200.00)} unit="RPM" left={920} top={500} />

         {/* Kiln parameters around kiln */}
         <Tag val={val(4358.0)} unit="A" left={240} top={420} />
         <Tag val={val(1.5)} unit="MM" left={350} top={420} />
         <Tag val={val(2.9)} unit="BAR" left={350} top={440} />
         
         <Tag val={val(15.6)} unit="%" left={450} top={420} color="#00ff00" />
         <Tag val={val(49.3)} unit="°C" left={450} top={440} color="#00ff00" />
         
         <Tag val={val(46.1)} unit="°C" left={500} top={370} />
         <Tag val={val(42.4)} unit="°C" left={500} top={390} />

         <DataBox mv={val(3.6)} sp={val(3.6)} unit="RPM" left={250} top={500} />
         <div className="absolute top-[540px] left-[250px] bg-[#00ff00] text-black px-1 font-bold text-[8px]">KILN STDBY NEW DRIVE</div>

         <div className="absolute bottom-[20px] left-[20px] border border-gray-500 bg-black p-1 text-[8px] w-[120px]">
            <div className="text-green-500 mb-1">PCF GRP2</div>
            <div className="text-green-500 mb-1">KILNFIRING GRP</div>
            <div className="text-green-500">GRP_KILN_MM_GRP3</div>
         </div>

      </div>
    </div>
  );
};

export default ScadaKiln;
