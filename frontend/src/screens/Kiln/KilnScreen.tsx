import React, { useState } from 'react';
import { useScadaStore } from '../../store/scadaStore';
import { 
  RotaryKilnUnit, PreheaterTowerUnit, CentrifugalFanUnit, 
  IndustrialPipe, ISAInstrumentTag 
} from '../../components/scada/Equipment/IndustrialPlantComponents';

interface ScreenProps {
  onOpenFaceplate?: (eqId: string) => void;
}

export const KilnScreen: React.FC<ScreenProps> = ({ onOpenFaceplate }) => {
  const tags = useScadaStore((s) => s.tags);
  const [selectedScannerRing, setSelectedScannerRing] = useState<number>(24);

  const handleEqClick = (id: string) => {
    if (onOpenFaceplate) onOpenFaceplate(id);
  };

  // Generate 36-point infrared shell profile (meters 0 to 65 along kiln length)
  const shellProfile = Array.from({ length: 36 }).map((_, i) => {
    const meter = ((i + 1) * 65 / 36).toFixed(0);
    // Profile peaks in burning zone (meters 45 to 55)
    let temp = 220 + Math.sin(i * 0.15) * 40;
    if (i >= 22 && i <= 30) {
      temp = 320 + Math.sin((i - 22) * 0.4) * 45;
    }
    return { ring: i + 1, meter, temp: temp + (tags['KLN1-SHELL-SCAN-MAX'] ? tags['KLN1-SHELL-SCAN-MAX'] - 340 : 0) };
  });

  return (
    <div className="w-full h-full relative bg-[#0b1320] text-white overflow-hidden select-none font-sans">
      
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="flex items-center justify-between px-6 py-2 bg-[#070b14] border-b border-gray-800 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold px-2 py-0.5 bg-black/60 rounded border border-cyan-500/30">
              AREA-400
            </span>
            <span className="text-sm font-extrabold text-white">PYROPROCESSING: PREHEATER TOWER, CALCINER & ROTARY KILN</span>
          </div>
          <span className="text-gray-400 font-mono text-[11px]">Ø 4.2m × 65m • 3000 TPD CLINKER • 5-STAGE TWIN PREHEATER</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <div>BURNING ZONE: <span className="text-rose-500 font-bold">{(tags['KLN1-BZ-TEMP'] || 1448).toFixed(0)} °C</span></div>
          <div>KILN SPEED: <span className="text-white font-bold">{(tags['KLN1-SPD'] || 3.85).toFixed(2)} RPM</span></div>
          <div>KILN FEED: <span className="text-[#00ff00] font-bold">{(tags['KLN1-FEED'] || 280).toFixed(0)} t/h</span></div>
          <div>NOx / O2: <span className="text-amber-400 font-bold">{(tags['KLN1-NOX'] || 410).toFixed(0)} mg</span> | <span className="text-cyan-400 font-bold">{(tags['KLN1-O2'] || 2.45).toFixed(1)}%</span></div>
          <div>SHELL SCAN MAX: <span className="text-yellow-400 font-bold">{(tags['KLN1-SHELL-SCAN-MAX'] || 342).toFixed(0)} °C</span></div>
        </div>
      </div>

      {/* SVG SCHEMATIC - REAL PYROPROCESSING PLANT WORKING PARTS */}
      <svg className="w-full h-full" viewBox="0 0 1600 780" preserveAspectRatio="xMidYMid meet">
        
        {/* TERTIARY AIR DUCT (TAD) - Recouping 880°C hot air from cooler to calciner */}
        <IndustrialPipe d="M 1240 500 L 1240 220 L 400 220 L 400 370" media="HOT_GAS" strokeWidth="18" />
        <text x="820" y="210" fill="#f97316" fontSize="11" fontWeight="bold" textAnchor="middle">
          TERTIARY AIR DUCT (TAD) • 895°C HOT AIR FROM COOLER HOOD
        </text>

        {/* FLUE GAS DOWNCOMER DUCT TO PREHEATER ID FAN */}
        <IndustrialPipe d="M 310 90 L 310 50 L 160 50 L 160 110" media="EXHAUST" strokeWidth="16" />

        {/* 1. 5-STAGE TWIN STRING PREHEATER TOWER */}
        <PreheaterTowerUnit 
          x={240} 
          y={80} 
          scale={1.15} 
          onClick={handleEqClick} 
        />

        {/* Preheater ID Fan */}
        <CentrifugalFanUnit 
          id="KLN1-ID-FAN" 
          x={140} 
          y={150} 
          scale={1.1} 
          onClick={handleEqClick} 
        />

        {/* Kiln Feed Air Lift Pipe from Silo */}
        <IndustrialPipe d="M 180 500 L 180 120 L 260 120" media="RAW_MEAL" strokeWidth="8" />
        <text x="170" y="320" fill="#cbd5e1" fontSize="9" fontWeight="bold" transform="rotate(-90 170 320)">
          RAW MEAL FEED PIPE (AIR LIFT)
        </text>

        {/* Kiln Smoke Chamber (Transition from Kiln to Preheater) */}
        <g transform="translate(390, 480)">
          <polygon points="0,0 70,0 60,60 0,60" fill="#334155" stroke="#475569" strokeWidth="3" />
          <text x="35" y="35" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">SMOKE CHAMBER</text>
        </g>

        {/* 2. 3-PIER ROTARY KILN ASSEMBLY (Ø 4.2m x 65m) */}
        <RotaryKilnUnit 
          id="KLN1-KILN-01" 
          x={460} 
          y={520} 
          scale={1.1} 
          length={720} 
          onClick={handleEqClick} 
        />

        {/* Kiln Discharge Hood (Entering Cooler) */}
        <g transform="translate(1250, 475)">
          <rect x="0" y="0" width="70" height="90" fill="#1e293b" stroke="#475569" strokeWidth="3" rx="3" />
          <text x="35" y="45" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">KILN HOOD</text>
          <text x="35" y="60" fill="#fef08a" fontSize="8" fontFamily="monospace" textAnchor="middle">
            {(tags['KLN1-HOOD-TEMP'] || 1120).toFixed(0)} °C
          </text>
        </g>

        {/* 3. BURNING ZONE VIDEO CAMERA / PYROMETER */}
        <g transform="translate(1325, 490)">
          <rect x="0" y="0" width="30" height="20" fill="#0f172a" stroke="#00d4ff" rx="2" />
          <circle cx="15" cy="10" r="4" fill="#00ff00" />
          <text x="15" y="-5" fill="#00d4ff" fontSize="7" fontWeight="bold" textAnchor="middle">BZT CAM</text>
        </g>

        {/* 4. REAL-TIME ISA INSTRUMENTATION BUBBLE TAGS */}
        {/* Preheater Exit Gas Temperature */}
        <ISAInstrumentTag tag="KLN1-C1-TEMP" isaCode="TI" unit="°C" x={150} y={60} />
        {/* Calciner Bed Temperature */}
        <ISAInstrumentTag tag="KLN1-CALC-TEMP" isaCode="TI" unit="°C" x={430} y={320} />
        {/* Kiln Burning Zone Temperature */}
        <ISAInstrumentTag tag="KLN1-BZ-TEMP" isaCode="TI" unit="°C" x={1180} y={430} alarm="HIGH" />
        {/* Kiln Back-End Temperature */}
        <ISAInstrumentTag tag="KLN1-BE-TEMP" isaCode="TI" unit="°C" x={470} y={430} />
        {/* Kiln Drive Motor Power */}
        <ISAInstrumentTag tag="KLN1-PWR" isaCode="II" unit="kW" x={860} y={630} />
        {/* Kiln Optical Shell Max Temperature */}
        <ISAInstrumentTag tag="KLN1-SHELL-SCAN-MAX" isaCode="TI" unit="°C" x={950} y={430} />
        {/* Continuous Emissions CEMS (NOx) */}
        <ISAInstrumentTag tag="KLN1-NOX" isaCode="AI" unit="mg/Nm³" x={80} y={230} />

      </svg>

      {/* CONTINUOUS INFRARED SHELL SCANNER THERMAL PROFILE (ISA-101 DETAIL) */}
      <div className="absolute bottom-3 left-4 right-4 bg-[#0f172a]/95 border border-gray-700 p-3 rounded-xl shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-xs text-[#00d4ff] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00d4ff] animate-ping" />
              OPTICAL INFRARED SHELL SCANNER (36-POINT THERMAL PROFILE ACROSS 65 METERS)
            </span>
            <span className="text-[10px] text-gray-400 font-mono">SCAN FREQUENCY: 1.2 Hz • DETECTS BRICK LOSS / HOT SPOTS</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-gray-400">BURNING ZONE PEAK: <span className="text-rose-500 font-bold">{(tags['KLN1-SHELL-SCAN-MAX'] || 342).toFixed(1)} °C</span></span>
            <span className="text-gray-400">ALARM THRESHOLD: <span className="text-amber-400">380 °C</span></span>
            <span className="text-gray-400">TRIP LIMIT: <span className="text-rose-400">420 °C</span></span>
          </div>
        </div>

        {/* 36-Point Bar Graph */}
        <div className="flex items-end gap-1 h-14 w-full bg-[#070b14] p-1.5 rounded-lg border border-gray-800">
          {shellProfile.map((p) => {
            const heightPct = Math.min(100, Math.max(10, ((p.temp - 150) / 250) * 100));
            const isHotSpot = p.temp > 330;
            return (
              <div 
                key={p.ring}
                onClick={() => setSelectedScannerRing(p.ring)}
                className={`flex-1 rounded-t transition-all cursor-pointer group relative ${
                  isHotSpot ? 'bg-gradient-to-t from-orange-600 to-rose-500' : 'bg-gradient-to-t from-cyan-900 to-cyan-500'
                }`}
                style={{ height: `${heightPct}%` }}
                title={`Ring ${p.ring} (${p.meter}m): ${p.temp.toFixed(1)}°C`}
              >
                {selectedScannerRing === p.ring && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-black text-[9px] font-mono text-yellow-300 rounded border border-yellow-500/50 whitespace-nowrap z-30">
                    {p.temp.toFixed(0)}°C
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-1 px-1">
          <span>0m (INLET TYRE 1)</span>
          <span>25m (TRANSITION ZONE)</span>
          <span>45m (SINTERING TYRE 2)</span>
          <span>55m (BURNING ZONE PEAK)</span>
          <span>65m (NOSE RING TYRE 3)</span>
        </div>
      </div>

    </div>
  );
};
