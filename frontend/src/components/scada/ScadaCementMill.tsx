import React, { useState, useEffect } from 'react';

const ScadaCementMill = () => {
  const [fluc, setFluc] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFluc(Math.random() * 2 - 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const val = (base: number, volatility = 0.02) => (base + fluc * (base * volatility)).toFixed(1);

  // Classic SCADA Data Box
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
      
      {/* Top Navigation (Classic Green Bar) */}
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
        <div className="flex-1"></div>
        <div className="flex gap-2 bg-gray-300 px-2 rounded-sm border border-gray-500">
           <span>PLANT <span className="text-green-700">23.27 MW</span></span>
           <span>CPP <span className="text-green-700">12.06 MW</span></span>
        </div>
      </div>

      {/* Main SCADA Area */}
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

            {/* --- Conveyors & Pipes (Background) --- */}
            {/* Elevator to Separator line */}
            <path d="M 120 280 L 120 60 L 220 60" fill="none" stroke="#64748b" strokeWidth="12" />
            
            {/* Gas Ducts */}
            <path d="M 330 200 L 330 160 L 580 160 L 580 80 L 640 80" fill="none" stroke="#cbd5e1" strokeWidth="8" />
            <path d="M 720 100 L 800 100" fill="none" stroke="#cbd5e1" strokeWidth="8" />
            
            {/* Reject Pipe */}
            <path d="M 270 200 L 270 380 L 340 380 L 340 450" fill="none" stroke="#ef4444" strokeWidth="4" />
            <polygon points="270,360 275,355 265,355" fill="#ef4444" />
            
            {/* Feed Conveyor */}
            <path d="M 1080 320 L 730 320 L 730 400" fill="none" stroke="#cbd5e1" strokeWidth="6" />

            {/* --- Bucket Elevator (Left) --- */}
            <g transform="translate(40, 60)">
               <rect x="0" y="0" width="30" height="450" fill="none" stroke="#00ff00" strokeWidth="2" strokeDasharray="4 4" />
               {/* Elevator buckets */}
               <circle cx="15" cy="50" r="5" fill="#00ff00" />
               <circle cx="15" cy="100" r="5" fill="#00ff00" />
               <circle cx="15" cy="150" r="5" fill="#00ff00" />
               <circle cx="15" cy="200" r="5" fill="#00ff00" />
               <circle cx="15" cy="250" r="5" fill="#00ff00" />
               <circle cx="15" cy="300" r="5" fill="#00ff00" />
               <circle cx="15" cy="350" r="5" fill="#00ff00" />
               <circle cx="15" cy="400" r="5" fill="#00ff00" />
            </g>

            {/* --- Separators / Cyclones (Top Left) --- */}
            <g transform="translate(200, 150)">
               <polygon points="0,0 80,0 60,50 20,50" fill="url(#gray-cyl)" stroke="#475569" />
               <rect x="0" y="0" width="80" height="30" fill="url(#gray-cyl)" stroke="#475569" />
               <text x="25" y="20" fill="black" fontSize="10" fontWeight="bold">Z1S01</text>
               <circle cx="40" cy="-15" r="10" fill="#3b82f6" />
               <text x="36" y="-12" fill="white" fontSize="9" fontWeight="bold">M</text>
            </g>
            <g transform="translate(350, 200)">
               <polygon points="0,0 60,0 45,40 15,40" fill="url(#gray-cyl)" stroke="#475569" />
               <rect x="0" y="0" width="60" height="20" fill="url(#gray-cyl)" stroke="#475569" />
               <text x="20" y="15" fill="black" fontSize="10" fontWeight="bold">Z1S04</text>
            </g>

            {/* --- Bag Filter --- */}
            <g transform="translate(640, 60)">
               <polygon points="10,0 110,0 120,40 0,40" fill="url(#mill-green)" />
               <rect x="0" y="40" width="120" height="40" fill="url(#mill-green)" />
               <text x="35" y="65" fill="black" fontSize="10" fontWeight="bold">BAG FILTER</text>
            </g>

            {/* --- Cement Mill (Center Bottom) --- */}
            <g transform="translate(380, 420)">
               {/* Mill Body */}
               <rect x="0" y="0" width="300" height="100" rx="5" fill="url(#mill-green)" stroke="#064e3b" strokeWidth="2" />
               
               <rect x="30" y="-10" width="15" height="120" fill="#64748b" stroke="#0f172a" />
               <rect x="250" y="-10" width="15" height="120" fill="#64748b" stroke="#0f172a" />
               
               <text x="80" y="50" fill="black" fontSize="18" fontWeight="bold" letterSpacing="1">CEMENT MILL - 1</text>
               <rect x="130" y="70" width="50" height="15" fill="#22c55e" stroke="black" />
               <text x="145" y="81" fill="black" fontSize="9" fontWeight="bold">80.6 %</text>
            </g>

            {/* Mill Discharge */}
            <g transform="translate(680, 420)">
               <polygon points="0,0 40,0 30,50 10,50" fill="url(#gray-cyl)" />
            </g>
            <path d="M 700 470 L 700 520 L 60 520 L 60 510" fill="none" stroke="#f59e0b" strokeWidth="6" />

            {/* --- Silos / Hoppers (Right) --- */}
            <g transform="translate(850, 200)">
               {/* CLINKER */}
               <polygon points="0,0 60,0 45,60 15,60" fill="url(#hopper-gray)" stroke="#475569" />
               <rect x="0" y="-20" width="60" height="20" fill="url(#hopper-gray)" stroke="#475569" />
               <text x="10" y="-5" fill="black" fontSize="10" fontWeight="bold">CLINKER</text>
               <rect x="15" y="60" width="30" height="10" fill="#22c55e" />
            </g>
            <g transform="translate(930, 200)">
               {/* LIME STONE */}
               <polygon points="0,0 60,0 45,60 15,60" fill="url(#hopper-gray)" stroke="#475569" />
               <rect x="0" y="-20" width="60" height="20" fill="url(#hopper-gray)" stroke="#475569" />
               <text x="5" y="-5" fill="black" fontSize="10" fontWeight="bold">LIME STONE</text>
               <rect x="15" y="60" width="30" height="10" fill="#22c55e" />
            </g>
            <g transform="translate(1010, 200)">
               {/* FLYASH */}
               <polygon points="0,0 60,0 45,60 15,60" fill="url(#hopper-gray)" stroke="#475569" />
               <rect x="0" y="-20" width="60" height="20" fill="url(#hopper-gray)" stroke="#475569" />
               <text x="15" y="-5" fill="black" fontSize="10" fontWeight="bold">FLYASH</text>
               <rect x="15" y="60" width="30" height="10" fill="#22c55e" />
            </g>
            <g transform="translate(1090, 200)">
               {/* N.GYP */}
               <polygon points="0,0 60,0 45,60 15,60" fill="url(#hopper-gray)" stroke="#475569" />
               <rect x="0" y="-20" width="60" height="20" fill="url(#hopper-gray)" stroke="#475569" />
               <text x="15" y="-5" fill="black" fontSize="10" fontWeight="bold">N.GYP</text>
               <rect x="15" y="60" width="30" height="10" fill="#22c55e" />
            </g>

            {/* Fans & Motors */}
            <circle cx="820" cy="90" r="15" fill="#3b82f6" />
            <text x="816" y="94" fill="white" fontSize="12" fontWeight="bold">M</text>

            <circle cx="340" cy="400" r="12" fill="#3b82f6" />
            <text x="336" y="404" fill="white" fontSize="10" fontWeight="bold">M</text>

            <circle cx="340" cy="510" r="12" fill="#3b82f6" />
            <text x="336" y="514" fill="white" fontSize="10" fontWeight="bold">M</text>
            
         </svg>

         {/* --- HTML Overlay Data Tags & Boxes --- */}

         {/* Main Fan */}
         <DataBox title="Z1P05" mv={val(914.4)} sp={val(900.0)} unit="RPM" left={240} top={80} />
         <Tag val={val(122.0)} unit="A" left={240} top={125} bg="black" />
         
         {/* Bag Filter Fan */}
         <DataBox title="Z1P05" mv={val(1191.0)} sp={val(1195.0)} unit="RPM" left={730} top={120} />
         <Tag val={val(208.7)} unit="A" left={730} top={165} bg="black" />
         
         <DataBox mv={val(80.4)} sp={val(82.0)} unit="%" left={110} top={350} />

         {/* Feeder Data Boxes */}
         <DataBox title="Z1C01" mv={val(67.8)} sp={val(67.8)} unit="TPH" left={840} top={340} />
         <DataBox title="Z1A01" mv={val(0.2)} sp={val(0.0)} unit="TPH" left={920} top={340} />
         <DataBox title="D1L70" mv={val(40.3)} sp={val(40.3)} unit="TPH" left={1000} top={340} />
         <DataBox title="Z1B01" mv={val(6.8)} sp={val(6.8)} unit="TPH" left={1080} top={340} />

         {/* Mill parameters */}
         <Tag val={val(208.7)} unit="" left={220} top={410} color="black" />
         <Tag val={val(54.4)} unit="°C" left={260} top={430} bg="black" />
         <Tag val={val(54.0)} unit="°C" left={260} top={450} bg="black" />
         
         <Tag val={val(1453.3)} unit="kW" left={480} top={390} />
         <Tag val={val(1014.4)} unit="kW" left={480} top={410} />
         
         <Tag val={val(-1.1)} unit="mmWC" left={660} top={410} />
         <Tag val={val(56.7)} unit="°C" left={660} top={430} />

         {/* Tables at bottom right */}
         <div className="absolute bottom-[20px] right-[20px] flex flex-col gap-1 w-[400px]">
             
             {/* Feed / Setpoint Table */}
             <div className="bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white">
                <div className="flex justify-between border-b border-gray-600 mb-1">
                   <div className="w-[80px]"></div>
                   <div className="w-[50px] text-center">SP %</div>
                   <div className="w-[50px] text-center">SP T</div>
                   <div className="w-[50px] text-center">MV T</div>
                </div>
                <div className="flex justify-between mb-0.5">
                   <div className="w-[80px]">CLINKER</div>
                   <div className="w-[50px] text-center text-[#00ff00] font-bold">59.0</div>
                   <div className="w-[50px] text-center text-[#00d4ff]">67.8 TPH</div>
                   <div className="w-[50px] text-center text-[#00ff00]">67.8 TPH</div>
                </div>
                <div className="flex justify-between mb-0.5">
                   <div className="w-[80px]">LIME STONE</div>
                   <div className="w-[50px] text-center text-[#00ff00] font-bold">0.0</div>
                   <div className="w-[50px] text-center text-[#00d4ff]">0.0 TPH</div>
                   <div className="w-[50px] text-center text-[#00ff00]">0.2 TPH</div>
                </div>
                <div className="flex justify-between mb-0.5">
                   <div className="w-[80px]">FLYASH</div>
                   <div className="w-[50px] text-center text-[#00ff00] font-bold">35.0</div>
                   <div className="w-[50px] text-center text-[#00d4ff]">40.3 TPH</div>
                   <div className="w-[50px] text-center text-[#00ff00]">40.3 TPH</div>
                </div>
                <div className="flex justify-between">
                   <div className="w-[80px]">N.GYP</div>
                   <div className="w-[50px] text-center text-[#00ff00] font-bold">6.0</div>
                   <div className="w-[50px] text-center text-[#00d4ff]">6.9 TPH</div>
                   <div className="w-[50px] text-center text-[#00ff00]">6.8 TPH</div>
                </div>
                <div className="flex justify-between border-t border-gray-600 mt-1 pt-1">
                   <div className="w-[80px] font-bold">TOT FEED</div>
                   <div className="text-[#00ff00] font-bold text-center w-[150px]">{val(115.0)} TPH</div>
                </div>
             </div>

             {/* Production Table */}
             <div className="bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white">
                <div className="flex justify-between mb-0.5">
                   <div className="w-[100px]">CM1 MAIN MOTOR</div>
                   <div className="w-[100px] text-gray-300">22h 53m 22s</div>
                   <div className="w-[100px] text-gray-300">15h 51m 3s</div>
                </div>
                <div className="flex justify-between mb-0.5">
                   <div className="w-[100px]">CLINKER WF</div>
                   <div className="w-[100px] text-gray-300">21h 33m 27s</div>
                   <div className="w-[100px] text-gray-300">15h 46m 34s</div>
                </div>
             </div>
         </div>

         {/* Top Right parameters */}
         <div className="absolute top-[30px] right-[20px] bg-[#1e293b] border border-gray-500 p-1 text-[8px] font-mono shadow-lg text-white w-[250px]">
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">TOT FEED</span><span className="text-[#00ff00]">{val(110.6)} TPH</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">CLK WF</span><span className="text-[#00ff00]">{val(77.8)} TPH</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">GYP WF</span><span className="text-[#00ff00]">{val(0.1)} TPH</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-300">FLY WF</span><span className="text-[#00ff00]">{val(24.8)} TPH</span></div>
            <div className="flex justify-between mb-0.5 border-t border-gray-600 pt-0.5 mt-0.5"><span className="text-gray-300">MM KW</span><span className="text-[#00ff00]">{val(1536.8)} KW</span></div>
         </div>

      </div>
    </div>
  );
};

export default ScadaCementMill;
