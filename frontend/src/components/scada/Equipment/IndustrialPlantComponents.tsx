import React from 'react';
import { useScadaStore } from '../../../store/scadaStore';

interface ComponentProps {
  id?: string;
  x?: number;
  y?: number;
  scale?: number;
  onClick?: (id: string) => void;
}

export const getEquipmentStatusColor = (status?: string) => {
  switch (status) {
    case 'RUNNING': return '#10b981'; // Green
    case 'STOPPED': return '#64748b'; // Slate Gray
    case 'FAULT':
    case 'TRIPPED': return '#ef4444'; // Red
    case 'STARTING': return '#f59e0b'; // Amber
    default: return '#10b981';
  }
};

/**
 * Authentic ISA-5.1 SCADA Instrument Bubble Tag
 */
export const ISAInstrumentTag: React.FC<{
  tag: string;
  isaCode: 'TI' | 'PI' | 'FI' | 'VI' | 'SI' | 'II' | 'WI' | 'AI' | 'LI';
  unit: string;
  fractionDigits?: number;
  x: number;
  y: number;
  alarm?: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
}> = ({ tag, isaCode, unit, fractionDigits = 1, x, y, alarm = 'NORMAL' }) => {
  const val = useScadaStore((s) => s.tags[tag]);
  const displayVal = val !== undefined ? val.toFixed(fractionDigits) : '---.-';

  const alarmColor = 
    alarm === 'CRITICAL' ? '#ef4444' :
    alarm === 'HIGH' ? '#f97316' :
    alarm === 'LOW' ? '#38bdf8' : '#00ff00';

  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer group select-none">
      {/* Lead line */}
      <line x1="0" y1="0" x2="0" y2="18" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2 2" />
      
      {/* Outer circle with glow on alarm */}
      <circle 
        cx="0" 
        cy="0" 
        r="14" 
        fill="#0b1320" 
        stroke={alarm !== 'NORMAL' ? alarmColor : '#38bdf8'} 
        strokeWidth="2" 
        className={alarm !== 'NORMAL' ? 'animate-pulse' : ''}
      />
      {/* Horizontal divider */}
      <line x1="-14" y1="0" x2="14" y2="0" stroke="#334155" strokeWidth="1.5" />
      
      {/* ISA Code */}
      <text x="0" y="-3" fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        {isaCode}
      </text>
      
      {/* Instrument Tag suffix */}
      <text x="0" y="8" fill="#94a3b8" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        {tag.split('-').pop()?.slice(0, 4) || '501'}
      </text>

      {/* Floating Readout Label Box */}
      <g transform="translate(18, -12)">
        <rect x="0" y="0" width="70" height="24" rx="3" fill="#090d16" stroke="#475569" strokeWidth="1" />
        <text x="5" y="10" fill="#94a3b8" fontSize="7" fontFamily="monospace" fontWeight="bold">
          {tag}
        </text>
        <text x="5" y="20" fill={alarmColor} fontSize="9" fontFamily="monospace" fontWeight="extrabold">
          {displayVal} <tspan fill="#64748b" fontSize="7">{unit}</tspan>
        </text>
      </g>
    </g>
  );
};

/**
 * Animated Flow Pipe with Media Color
 */
export const IndustrialPipe: React.FC<{
  d: string;
  strokeWidth?: number;
  media: 'HOT_GAS' | 'COOLING_AIR' | 'RAW_MEAL' | 'CLINKER' | 'PULVERIZED_COAL' | 'WATER' | 'EXHAUST';
  animated?: boolean;
}> = ({ d, strokeWidth = 12, media, animated = true }) => {
  const getMediaColor = () => {
    switch (media) {
      case 'HOT_GAS': return '#ef4444'; // Red
      case 'COOLING_AIR': return '#0284c7'; // Cyan/Blue
      case 'RAW_MEAL': return '#94a3b8'; // Light Slate
      case 'CLINKER': return '#d97706'; // Amber
      case 'PULVERIZED_COAL': return '#475569'; // Dark Charcoal
      case 'WATER': return '#0ea5e9'; // Blue
      case 'EXHAUST': return '#64748b'; // Gray
    }
  };

  const color = getMediaColor();

  return (
    <g>
      {/* Outer pipe casing / insulation */}
      <path d={d} fill="none" stroke="#1e293b" strokeWidth={strokeWidth + 4} strokeLinecap="round" strokeLinejoin="round" />
      {/* Inner fluid core */}
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      {/* Moving flow particles */}
      {animated && (
        <path 
          d={d} 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth={Math.max(2, strokeWidth * 0.3)} 
          strokeDasharray="12 24" 
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        >
          <animate attributeName="stroke-dashoffset" from="36" to="0" dur="1s" repeatCount="indefinite" />
        </path>
      )}
    </g>
  );
};

/**
 * Heavy Duty Apron Feeder with Hydraulic Drive
 */
export const ApronFeederUnit: React.FC<ComponentProps> = ({ id = 'CR-AF-01', x = 0, y = 0, scale = 1, onClick }) => {
  const eq = useScadaStore((s) => s.equipment[id]);
  const isRunning = eq?.status === 'RUNNING' || eq?.status === undefined;
  const statusColor = getEquipmentStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} className="cursor-pointer" onClick={() => onClick && onClick(id)}>
      {/* Steel structural frame */}
      <rect x="0" y="25" width="220" height="40" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="4" />
      
      {/* Upper carry pans (overlapping manganese steel flights) */}
      <g>
        {Array.from({ length: 11 }).map((_, i) => (
          <rect 
            key={i} 
            x={10 + i * 18} 
            y="20" 
            width="22" 
            height="14" 
            fill="#475569" 
            stroke="#0f172a" 
            strokeWidth="1.5" 
            rx="1" 
          />
        ))}
      </g>

      {/* Head drive sprocket */}
      <circle cx="205" cy="45" r="18" fill="#334155" stroke="#64748b" strokeWidth="2" />
      <circle cx="205" cy="45" r="8" fill="#0f172a" />
      {/* Tail return sprocket */}
      <circle cx="15" cy="45" r="18" fill="#334155" stroke="#64748b" strokeWidth="2" />
      <circle cx="15" cy="45" r="8" fill="#0f172a" />

      {/* Drive chain / flights motion indicator */}
      {isRunning && (
        <path d="M 20 23 L 200 23" stroke={statusColor} strokeWidth="3" strokeDasharray="8 6">
          <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.8s" repeatCount="indefinite" />
        </path>
      )}

      {/* Hydraulic Drive Motor & Gearbox */}
      <rect x="185" y="70" width="40" height="25" fill="#334155" stroke="#64748b" rx="2" />
      <circle cx="205" cy="82" r="10" fill={statusColor} stroke="#0f172a" strokeWidth="1.5" />
      <text x="205" y="85" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">HYD</text>
      <line x1="205" y1="63" x2="205" y2="70" stroke="#94a3b8" strokeWidth="4" />

      {/* Skirt board plates */}
      <path d="M 0 10 L 220 10 L 220 22 L 0 22 Z" fill="#334155" opacity="0.6" stroke="#475569" />
      <text x="110" y="50" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        HEAVY DUTY APRON FEEDER (AF-01)
      </text>
    </g>
  );
};

/**
 * Primary Reversible Impact Hammer Crusher Assembly
 */
export const ImpactCrusherUnit: React.FC<ComponentProps> = ({ id = 'CR-CR-01', x = 0, y = 0, scale = 1, onClick }) => {
  const eq = useScadaStore((s) => s.equipment[id]);
  const isRunning = eq?.status === 'RUNNING' || eq?.status === undefined;
  const statusColor = getEquipmentStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} className="cursor-pointer" onClick={() => onClick && onClick(id)}>
      {/* Heavy cast-steel crusher housing */}
      <path 
        d="M -70 -60 L 70 -60 L 95 10 L 80 80 L -80 80 L -95 10 Z" 
        fill="#1e293b" 
        stroke="#475569" 
        strokeWidth="3" 
      />

      {/* Front inspection hinged doors */}
      <rect x="-60" y="-45" width="120" height="40" fill="#0f172a" stroke="#334155" strokeWidth="1.5" rx="3" />
      <circle cx="-50" cy="-25" r="3" fill="#94a3b8" />
      <circle cx="50" cy="-25" r="3" fill="#94a3b8" />

      {/* Hydraulic Gap Adjuster (CSS) Cylinders */}
      <rect x="75" y="-10" width="22" height="60" fill="#334155" stroke="#64748b" rx="2" />
      <rect x="-97" y="-10" width="22" height="60" fill="#334155" stroke="#64748b" rx="2" />
      <line x1="86" y1="10" x2="86" y2="40" stroke="#00d4ff" strokeWidth="3" />
      <line x1="-86" y1="10" x2="-86" y2="40" stroke="#00d4ff" strokeWidth="3" />

      {/* Massive Flywheel with safety cage */}
      <g transform="translate(100, 30)">
        <circle cx="0" cy="0" r="34" fill="#334155" stroke="#475569" strokeWidth="3" />
        <circle cx="0" cy="0" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
        {/* Rotating spokes */}
        <g>
          {isRunning && (
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.4s" repeatCount="indefinite" />
          )}
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#94a3b8" strokeWidth="4" />
          <line x1="0" y1="-30" x2="0" y2="30" stroke="#94a3b8" strokeWidth="4" />
        </g>
      </g>

      {/* Center Rotor & High-Manganese Hammer Heads */}
      <g transform="translate(0, 30)">
        <circle cx="0" cy="0" r="36" fill="#0b1320" stroke="#334155" strokeWidth="2" />
        
        {/* Spinning hammer assembly */}
        <g>
          {isRunning && (
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.3s" repeatCount="indefinite" />
          )}
          {/* 4 pivoting hammers */}
          {[0, 90, 180, 270].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <rect x="-4" y="-32" width="8" height="24" fill="#64748b" stroke="#0f172a" />
              <rect x="-8" y="-36" width="16" height="10" fill="#94a3b8" stroke="#0f172a" rx="2" />
            </g>
          ))}
          <circle cx="0" cy="0" r="12" fill={statusColor} stroke="#0f172a" strokeWidth="2" />
        </g>
      </g>

      {/* Bearing Pedestals with Vibration & Temp sensors */}
      <rect x="-105" y="20" width="16" height="20" fill="#334155" stroke="#64748b" rx="2" />
      <circle cx="-97" cy="30" r="3" fill="#00ff00" />

      {/* Heavy Baseplate */}
      <rect x="-85" y="80" width="170" height="14" fill="#334155" stroke="#0f172a" strokeWidth="2" />

      {/* Equipment Label */}
      <text x="0" y="110" fill="#f8fafc" fontSize="11" fontWeight="extrabold" textAnchor="middle">
        PRIMARY IMPACT CRUSHER (CR-01)
      </text>
      <text x="0" y="122" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
        650 kW • 740 RPM • CSS: 28mm
      </text>
    </g>
  );
};

/**
 * Vertical Roller Mill (VRM) Detailed Engineering Cross-Section
 * Realistic working parts: Planetary gearbox, wear-lined table, 4 hydraulic tensioned rollers,
 * nitrogen accumulators, louver ring, dynamic cage separator, water injection.
 */
export const VerticalRollerMillUnit: React.FC<ComponentProps> = ({ id = 'RM1-VRM-01', x = 0, y = 0, scale = 1, onClick }) => {
  const eq = useScadaStore((s) => s.equipment[id]);
  const isRunning = eq?.status === 'RUNNING' || eq?.status === undefined;
  const statusColor = getEquipmentStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} className="cursor-pointer" onClick={() => onClick && onClick(id)}>
      {/* Mill Main Cylindrical Body Shell */}
      <path 
        d="M -75 -60 L 75 -60 L 85 90 L -85 90 Z" 
        fill="#1e293b" 
        stroke="#475569" 
        strokeWidth="3" 
      />

      {/* Tangential Louver / Gas Nozzle Ring */}
      <rect x="-83" y="60" width="166" height="15" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={-70 + i * 20} y1="62" x2={-60 + i * 20} y2="73" stroke="#ef4444" strokeWidth="2" />
      ))}

      {/* Rotating Grinding Table with Segmented Wear Liners */}
      <rect x="-65" y="75" width="130" height="18" fill="#334155" stroke="#64748b" strokeWidth="2" rx="2" />
      <rect x="-60" y="73" width="120" height="5" fill="#94a3b8" />
      <rect x="-68" y="70" width="6" height="15" fill="#64748b" /> {/* Dam ring left */}
      <rect x="62" y="70" width="6" height="15" fill="#64748b" /> {/* Dam ring right */}

      {/* Heavy Planetary Bevel Gearbox & Thrust Bearing Base */}
      <polygon points="-55,93 55,93 65,145 -65,145" fill="#0f172a" stroke="#334155" strokeWidth="2" />
      <rect x="-75" y="145" width="150" height="20" fill="#334155" stroke="#1e293b" strokeWidth="2" rx="2" />
      <text x="0" y="125" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        PLANETARY REDUCER (3.8 MW)
      </text>

      {/* Main Drive Slip-Ring Motor */}
      <g transform="translate(-115, 125)">
        <rect x="-25" y="-18" width="50" height="36" fill="#334155" stroke="#475569" rx="3" />
        <circle cx="0" cy="0" r="12" fill={statusColor} stroke="#0f172a" strokeWidth="2" />
        <text x="0" y="3" fill="#0f172a" fontSize="9" fontWeight="extrabold" textAnchor="middle">M</text>
        <line x1="25" y1="0" x2="45" y2="0" stroke="#64748b" strokeWidth="6" />
      </g>

      {/* 2 Grinding Rollers with Heavy Pull Rods & Hydraulic Accumulators */}
      {/* Left Roller */}
      <g transform="translate(-38, 52)">
        {/* Tilted conical roller body */}
        <ellipse cx="0" cy="0" rx="24" ry="16" fill="#475569" stroke="#94a3b8" strokeWidth="2" transform="rotate(-15)" />
        <ellipse cx="0" cy="0" rx="10" ry="6" fill="#1e293b" transform="rotate(-15)" />
        {/* Roller swing arm */}
        <path d="M 0 0 L -40 -15" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
        {/* Hydraulic pull rod to accumulator (135 bar) */}
        <line x1="-40" y1="-15" x2="-40" y2="60" stroke="#0284c7" strokeWidth="4" />
        {/* Nitrogen Accumulator Cylinder */}
        <rect x="-46" y="20" width="12" height="30" fill="#0369a1" stroke="#38bdf8" rx="3" />
      </g>

      {/* Right Roller */}
      <g transform="translate(38, 52)">
        <ellipse cx="0" cy="0" rx="24" ry="16" fill="#475569" stroke="#94a3b8" strokeWidth="2" transform="rotate(15)" />
        <ellipse cx="0" cy="0" rx="10" ry="6" fill="#1e293b" transform="rotate(15)" />
        <path d="M 0 0 L 40 -15" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
        <line x1="40" y1="-15" x2="40" y2="60" stroke="#0284c7" strokeWidth="4" />
        <rect x="34" y="20" width="12" height="30" fill="#0369a1" stroke="#38bdf8" rx="3" />
      </g>

      {/* Dynamic Cage Separator on top */}
      <g transform="translate(0, -60)">
        <polygon points="-75,0 75,0 60,-50 -60,-50" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        
        {/* Spinning cage rotor blades */}
        <g transform="translate(0, -25)">
          <rect x="-45" y="-12" width="90" height="24" fill="#0f172a" stroke="#00d4ff" strokeWidth="1.5" rx="2" />
          {/* Animated guide vanes */}
          {Array.from({ length: 9 }).map((_, i) => (
            <line 
              key={i} 
              x1={-38 + i * 9.5} 
              y1="-10" 
              x2={-38 + i * 9.5} 
              y2="10" 
              stroke="#38bdf8" 
              strokeWidth="2" 
            />
          ))}
          {isRunning && (
            <circle cx="0" cy="0" r="16" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="6 4">
              <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.8s" repeatCount="indefinite" />
            </circle>
          )}
        </g>

        {/* Separator VFD Drive Motor on Top */}
        <rect x="-18" y="-72" width="36" height="22" fill="#334155" stroke="#64748b" rx="2" />
        <circle cx="0" cy="-61" r="8" fill={statusColor} />
        <text x="0" y="-58" fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle">SEP</text>
        <line x1="0" y1="-50" x2="0" y2="-25" stroke="#94a3b8" strokeWidth="4" />
      </g>

      {/* Water Spray Stabilization Lances */}
      <line x1="-30" y1="20" x2="-30" y2="65" stroke="#38bdf8" strokeWidth="2" />
      <circle cx="-30" cy="65" r="2" fill="#38bdf8" />
      <line x1="30" y1="20" x2="30" y2="65" stroke="#38bdf8" strokeWidth="2" />
      <circle cx="30" cy="65" r="2" fill="#38bdf8" />

      {/* Equipment Tag Label */}
      <text x="0" y="180" fill="#f8fafc" fontSize="12" fontWeight="extrabold" textAnchor="middle">
        VERTICAL ROLLER MILL (RM-01)
      </text>
      <text x="0" y="193" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
        4-ROLL HYDROPNEUMATIC • 3,800 kW • 135 BAR
      </text>
    </g>
  );
};

/**
 * 3-Pier Rotary Kiln Assembly
 * Realistic working parts: Incline shell, 3 Riding Rings (Tyres), 3 pairs of Trunnion rollers,
 * Girth gear & drive pinion, graphite leaf seals, multi-channel burner pipe with flame.
 */
export const RotaryKilnUnit: React.FC<ComponentProps & { length?: number }> = ({ 
  id = 'KLN1-KILN-01', 
  x = 0, 
  y = 0, 
  scale = 1, 
  length = 680, 
  onClick 
}) => {
  const eq = useScadaStore((s) => s.equipment[id]);
  const isRunning = eq?.status === 'RUNNING' || eq?.status === undefined;
  const statusColor = getEquipmentStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} className="cursor-pointer" onClick={() => onClick && onClick(id)}>
      {/* Kiln is inclined at ~3.5% (approx -3 degrees in SVG) */}
      <g transform="rotate(-3.2)">
        
        {/* Main Steel Kiln Shell (Segmented Refractory Lining) */}
        <defs>
          <linearGradient id="kiln-thermal-shell" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" />   {/* Inlet / Calcining Zone ~900°C */}
            <stop offset="40%" stopColor="#64748b" />  {/* Transition Zone ~1200°C */}
            <stop offset="75%" stopColor="#dc2626" />  {/* Burning / Sintering Zone ~1450°C */}
            <stop offset="90%" stopColor="#ea580c" />  {/* Clinkering Zone */}
            <stop offset="100%" stopColor="#78716c" /> {/* Discharge Nose Ring */}
          </linearGradient>
        </defs>

        <rect 
          x="0" 
          y="-30" 
          width={length} 
          height="60" 
          fill="url(#kiln-thermal-shell)" 
          stroke="#1e293b" 
          strokeWidth="3" 
          rx="3" 
        />

        {/* Refractory Brick Ring lines (Internal cross-section appearance) */}
        {Array.from({ length: 18 }).map((_, i) => (
          <line 
            key={i} 
            x1={i * 38} 
            y1="-29" 
            x2={i * 38} 
            y2="29" 
            stroke="#0f172a" 
            strokeWidth="1.5" 
            opacity="0.35" 
          />
        ))}

        {/* Shell rotation animation lines */}
        {isRunning && (
          <line x1="20" y1="0" x2={length - 20} y2="0" stroke="#fef08a" strokeWidth="2" strokeDasharray="14 14" opacity="0.4">
            <animate attributeName="stroke-dashoffset" from="28" to="0" dur="1.2s" repeatCount="indefinite" />
          </line>
        )}

        {/* TYRE 1 (Inlet Pier) */}
        <rect x={length * 0.18} y="-38" width="26" height="76" fill="#334155" stroke="#94a3b8" strokeWidth="2" rx="3" />
        {/* TYRE 2 (Center Pier with Girth Gear) */}
        <rect x={length * 0.52} y="-38" width="28" height="76" fill="#334155" stroke="#94a3b8" strokeWidth="2" rx="3" />
        {/* TYRE 3 (Burning Zone Pier) */}
        <rect x={length * 0.82} y="-38" width="30" height="76" fill="#334155" stroke="#94a3b8" strokeWidth="2" rx="3" />

        {/* Heavy Girth Gear (Bull Gear) & Dual Drive Pinions */}
        <rect x={length * 0.46} y="-43" width="22" height="86" fill="#0f172a" stroke="#eab308" strokeWidth="2" rx="2" />
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={length * 0.46} y1={-40 + i * 11} x2={length * 0.46 + 22} y2={-40 + i * 11} stroke="#eab308" strokeWidth="2" />
        ))}

        {/* Kiln Drive Motor & Auxiliary Engine */}
        <g transform={`translate(${length * 0.47}, 52)`}>
          <rect x="-18" y="0" width="36" height="24" fill="#334155" stroke="#64748b" rx="2" />
          <circle cx="0" cy="12" r="8" fill={statusColor} />
          <text x="0" y="15" fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle">M</text>
        </g>

        {/* Multi-Channel Burner Pipe & Flame (at Kiln Discharge / Right End) */}
        <g transform={`translate(${length}, 0)`}>
          {/* Burner Carriage & Pipe */}
          <rect x="0" y="-8" width="60" height="16" fill="#334155" stroke="#64748b" rx="2" />
          <line x1="0" y1="0" x2="-80" y2="0" stroke="#475569" strokeWidth="8" />
          
          {/* Primary air & coal swirl channels */}
          <line x1="-10" y1="-4" x2="-80" y2="-4" stroke="#f97316" strokeWidth="2" />
          <line x1="-10" y1="4" x2="-80" y2="4" stroke="#f97316" strokeWidth="2" />

          {/* Dynamic 1450°C Sintering Flame Geometry */}
          {isRunning && (
            <g transform="translate(-85, 0)">
              {/* Outer flame envelope */}
              <path d="M 0 -18 Q -100 -24 -220 0 Q -100 24 0 18 Z" fill="#ef4444" opacity="0.85">
                <animate attributeName="d" 
                  values="M 0 -18 Q -100 -24 -220 0 Q -100 24 0 18 Z; M 0 -16 Q -110 -22 -235 0 Q -95 26 0 16 Z; M 0 -18 Q -100 -24 -220 0 Q -100 24 0 18 Z" 
                  dur="0.4s" 
                  repeatCount="indefinite" 
                />
              </path>
              {/* Inner core flame */}
              <path d="M 0 -10 Q -60 -12 -140 0 Q -60 12 0 10 Z" fill="#fbbf24" opacity="0.95">
                <animate attributeName="d" 
                  values="M 0 -10 Q -60 -12 -140 0 Q -60 12 0 10 Z; M 0 -8 Q -65 -14 -150 0 Q -55 14 0 8 Z; M 0 -10 Q -60 -12 -140 0 Q -60 12 0 10 Z" 
                  dur="0.3s" 
                  repeatCount="indefinite" 
                />
              </path>
            </g>
          )}
        </g>

        {/* PIER 1 SUPPORT ROLLERS (TRUNNIONS) */}
        <g transform={`translate(${length * 0.18 + 13}, 44)`}>
          <rect x="-18" y="0" width="36" height="18" fill="#1e293b" stroke="#64748b" rx="2" />
          <circle cx="-10" cy="9" r="6" fill="#475569" />
          <circle cx="10" cy="9" r="6" fill="#475569" />
          <rect x="-24" y="18" width="48" height="8" fill="#334155" />
        </g>

        {/* PIER 2 SUPPORT ROLLERS & HYDRAULIC THRUST ROLLER */}
        <g transform={`translate(${length * 0.52 + 14}, 44)`}>
          <rect x="-18" y="0" width="36" height="18" fill="#1e293b" stroke="#64748b" rx="2" />
          <circle cx="-10" cy="9" r="6" fill="#475569" />
          <circle cx="10" cy="9" r="6" fill="#475569" />
          <rect x="-24" y="18" width="48" height="8" fill="#334155" />
          {/* Hydraulic thrust roller cylinder */}
          <circle cx="22" cy="0" r="9" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
        </g>

        {/* PIER 3 SUPPORT ROLLERS */}
        <g transform={`translate(${length * 0.82 + 15}, 44)`}>
          <rect x="-18" y="0" width="36" height="18" fill="#1e293b" stroke="#64748b" rx="2" />
          <circle cx="-10" cy="9" r="6" fill="#475569" />
          <circle cx="10" cy="9" r="6" fill="#475569" />
          <rect x="-24" y="18" width="48" height="8" fill="#334155" />
        </g>

        {/* Continuous Infrared Shell Temperature Scanner Bar */}
        <g transform="translate(40, -50)">
          <line x1="0" y1="0" x2={length - 80} y2="0" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 6" />
          <rect x={length * 0.65} y="-6" width="30" height="12" fill="#0f172a" stroke="#f59e0b" rx="2" />
          <text x={length * 0.65 + 15} y="2" fill="#f59e0b" fontSize="7" fontFamily="monospace" textAnchor="middle">IR SCAN</text>
        </g>

        {/* Inlet Graphite Leaf Seal (Left) */}
        <rect x="-12" y="-36" width="12" height="72" fill="#334155" stroke="#64748b" rx="1" />
        {/* Discharge Hood Seal (Right) */}
        <rect x={length} y="-36" width="12" height="72" fill="#334155" stroke="#64748b" rx="1" />
      </g>

      {/* Label */}
      <text x={length / 2} y="110" fill="#f8fafc" fontSize="13" fontWeight="extrabold" textAnchor="middle">
        3-PIER ROTARY KILN (KLN-01)
      </text>
      <text x={length / 2} y="125" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
        Ø 4.2m × 65m • 3.5% INCLINE • 1450°C BURNING ZONE • 750 kW DRIVE
      </text>
    </g>
  );
};

/**
 * 5-Stage Twin-String Low-NOx Preheater Tower Assembly
 * Cyclones C1A/B, C2, C3, C4, C5, Calciner with Tertiary Air Duct & SNCR Ammonia Lances
 */
export const PreheaterTowerUnit: React.FC<ComponentProps> = ({ x = 0, y = 0, scale = 1, onClick }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Reinforced Structural Steel Tower Frame */}
      <rect x="0" y="0" width="130" height="380" fill="#0b1320" stroke="#334155" strokeWidth="2.5" rx="3" />
      
      {/* Tower Cross Bracings */}
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <line x1="0" y1={i * 75} x2="130" y2={(i + 1) * 75} stroke="#1e293b" strokeWidth="2" />
          <line x1="130" y1={i * 75} x2="0" y2={(i + 1) * 75} stroke="#1e293b" strokeWidth="2" />
          <line x1="0" y1={i * 75} x2="130" y2={i * 75} stroke="#334155" strokeWidth="2" />
        </g>
      ))}

      {/* 5-STAGE CYCLONES */}
      {/* STAGE 1 (Twin Cyclones at top ~330°C) */}
      <g transform="translate(25, 20)">
        <polygon points="0,0 35,0 26,40 9,40" fill="#334155" stroke="#64748b" />
        <rect x="5" y="-12" width="25" height="12" fill="#475569" />
        <text x="17" y="18" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">C1A</text>
      </g>
      <g transform="translate(70, 20)">
        <polygon points="0,0 35,0 26,40 9,40" fill="#334155" stroke="#64748b" />
        <rect x="5" y="-12" width="25" height="12" fill="#475569" />
        <text x="17" y="18" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">C1B</text>
      </g>

      {/* STAGE 2 Cyclone (~540°C) */}
      <g transform="translate(45, 95)">
        <polygon points="0,0 42,0 32,45 10,45" fill="#334155" stroke="#64748b" />
        <rect x="6" y="-12" width="30" height="12" fill="#475569" />
        <text x="21" y="22" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">C2</text>
      </g>

      {/* STAGE 3 Cyclone (~710°C) */}
      <g transform="translate(45, 165)">
        <polygon points="0,0 44,0 34,48 10,48" fill="#334155" stroke="#ea580c" />
        <rect x="7" y="-12" width="30" height="12" fill="#475569" />
        <text x="22" y="24" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">C3</text>
      </g>

      {/* STAGE 4 Cyclone (~820°C) */}
      <g transform="translate(45, 235)">
        <polygon points="0,0 46,0 36,50 10,50" fill="#334155" stroke="#ea580c" />
        <rect x="8" y="-12" width="30" height="12" fill="#475569" />
        <text x="23" y="26" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">C4</text>
      </g>

      {/* STAGE 5 Bottom Cyclone (~885°C) */}
      <g transform="translate(45, 305)">
        <polygon points="0,0 48,0 38,55 10,55" fill="#334155" stroke="#dc2626" strokeWidth="2" />
        <rect x="9" y="-12" width="30" height="12" fill="#475569" />
        <text x="24" y="28" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">C5</text>
      </g>

      {/* IN-LINE PRECALCINER (ILC) on Side */}
      <g transform="translate(130, 240)">
        <rect x="0" y="0" width="45" height="110" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" rx="4" />
        <text x="22" y="45" fill="#ffffff" fontSize="9" fontWeight="extrabold" textAnchor="middle">
          ILC
        </text>
        <text x="22" y="60" fill="#fca5a5" fontSize="7" fontWeight="bold" textAnchor="middle">
          CALCINER
        </text>
        <text x="22" y="75" fill="#fef08a" fontSize="8" fontFamily="monospace" textAnchor="middle">
          885°C
        </text>
        {/* SNCR De-NOx Ammonia Injection Nozzles */}
        <line x1="-10" y1="25" x2="0" y2="25" stroke="#38bdf8" strokeWidth="3" />
        <text x="-12" y="27" fill="#38bdf8" fontSize="6" fontWeight="bold" textAnchor="end">SNCR</text>
      </g>

      {/* Tower Label */}
      <text x="65" y="405" fill="#f8fafc" fontSize="11" fontWeight="extrabold" textAnchor="middle">
        5-STAGE PREHEATER TOWER
      </text>
      <text x="65" y="418" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
        TWIN STRING • IN-LINE CALCINER (ILC)
      </text>
    </g>
  );
};

/**
 * Reciprocating Grate Cooler Assembly
 * Realistic working parts: Static inlet horseshoe beam, 3 hydraulic grate sections,
 * 6 undergrate aeration fan chambers, clinker breaker roll crusher, secondary/tertiary air ducts.
 */
export const GrateCoolerUnit: React.FC<ComponentProps> = ({ id = 'CLR1-COOL-01', x = 0, y = 0, scale = 1, onClick }) => {
  const eq = useScadaStore((s) => s.equipment[id]);
  const isRunning = eq?.status === 'RUNNING' || eq?.status === undefined;
  const statusColor = getEquipmentStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} className="cursor-pointer" onClick={() => onClick && onClick(id)}>
      {/* Heavy insulated cooler upper housing */}
      <polygon 
        points="0,0 360,0 340,90 20,90" 
        fill="#1e293b" 
        stroke="#475569" 
        strokeWidth="3" 
      />

      {/* Static Inlet Aeration Beam Grate (Horseshoe ~1100°C) */}
      <g transform="translate(25, 20)">
        <polygon points="0,0 55,0 45,45 10,45" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
        <text x="27" y="26" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">STATIC</text>
      </g>

      {/* 3 Moving Grate Sections with Reciprocating Cross-bars */}
      <g transform="translate(85, 30)">
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i} transform={`translate(${i * 26}, 0)`}>
            <rect x="0" y="0" width="22" height="15" fill="#475569" stroke="#94a3b8" rx="2" />
            <line x1="4" y1="7" x2="18" y2="7" stroke="#0f172a" strokeWidth="2" />
          </g>
        ))}

        {/* Animated Stroke motion */}
        {isRunning && (
          <path d="M 0 40 L 230 40" stroke={statusColor} strokeWidth="3" strokeDasharray="10 8">
            <animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.9s" repeatCount="indefinite" />
          </path>
        )}
      </g>

      {/* Hydraulic Stepping Drive Cylinders under cooler */}
      <g transform="translate(180, 75)">
        <rect x="-35" y="0" width="70" height="20" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" rx="3" />
        <text x="0" y="14" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          HYDR DRIVE 160 BAR
        </text>
      </g>

      {/* 6 Individual Undergrate Aeration Fan Compartments */}
      <g transform="translate(30, 90)">
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`translate(${i * 48}, 0)`}>
            <rect x="0" y="0" width="44" height="40" fill="#0b1320" stroke="#334155" strokeWidth="1.5" />
            {/* Cooling Fan */}
            <circle cx="22" cy="20" r="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="22" cy="20" r="4" fill="#38bdf8" />
            <text x="22" y="36" fill="#94a3b8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              CF-{i + 1}
            </text>
          </g>
        ))}
      </g>

      {/* Clinker Roll Crusher / Breaker at discharge */}
      <g transform="translate(350, 40)">
        <rect x="0" y="0" width="55" height="60" fill="#334155" stroke="#64748b" strokeWidth="2" rx="3" />
        <circle cx="27" cy="25" r="16" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="27" cy="25" r="6" fill={statusColor} />
        {isRunning && (
          <g transform="translate(27, 25)">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.6s" repeatCount="indefinite" />
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#f59e0b" strokeWidth="3" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="#f59e0b" strokeWidth="3" />
          </g>
        )}
        <text x="27" y="52" fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="middle">BREAKER</text>
      </g>

      {/* Secondary & Tertiary Air Recouping Hoods on top */}
      <path d="M 40 0 L 40 -35 L 90 -35 L 90 0" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
      <text x="65" y="-20" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">SEC AIR</text>

      <path d="M 120 0 L 120 -45 L 180 -45 L 180 0" fill="#ea580c" stroke="#f97316" strokeWidth="2" />
      <text x="150" y="-25" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">TERT AIR</text>

      {/* Equipment Label */}
      <text x="180" y="155" fill="#f8fafc" fontSize="12" fontWeight="extrabold" textAnchor="middle">
        RECIPROCATING GRATE COOLER (CLR-01)
      </text>
      <text x="180" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
        CROSS-BAR AERATION • 6 INDEPENDENT FANS • ROLL CRUSHER
      </text>
    </g>
  );
};

/**
 * Two-Compartment Ball Mill (Slide Shoe Hydrodynamic Bearings)
 */
export const BallMillUnit: React.FC<ComponentProps> = ({ id = 'CM2-MILL-01', x = 0, y = 0, scale = 1, onClick }) => {
  const eq = useScadaStore((s) => s.equipment[id]);
  const isRunning = eq?.status === 'RUNNING' || eq?.status === undefined;
  const statusColor = getEquipmentStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} className="cursor-pointer" onClick={() => onClick && onClick(id)}>
      {/* Cylindrical Grinding Drum Shell */}
      <rect x="0" y="-35" width="280" height="70" fill="#1e293b" stroke="#475569" strokeWidth="3" rx="4" />

      {/* CHAMBER 1: Coarse Grinding (Wave Liners & 90-60mm balls) */}
      <rect x="8" y="-32" width="105" height="64" fill="#0f172a" stroke="#334155" opacity="0.8" />
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx={25 + (i % 3) * 30} cy={-12 + Math.floor(i / 3) * 24} r="8" fill="#64748b" stroke="#94a3b8" />
      ))}
      <text x="58" y="24" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">CHAMBER 1 (COARSE)</text>

      {/* DIAPHRAGM PARTITION SCREEN */}
      <rect x="113" y="-34" width="16" height="68" fill="#334155" stroke="#eab308" strokeWidth="2" />
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1="115" y1={-25 + i * 10} x2="127" y2={-25 + i * 10} stroke="#eab308" strokeWidth="2" />
      ))}

      {/* CHAMBER 2: Fine Grinding (Classifying Liners & 40-17mm micro-balls) */}
      <rect x="129" y="-32" width="142" height="64" fill="#0f172a" stroke="#334155" opacity="0.8" />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={145 + (i % 4) * 30} cy={-15 + Math.floor(i / 4) * 15} r="4" fill="#94a3b8" stroke="#cbd5e1" />
      ))}
      <text x="200" y="24" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">CHAMBER 2 (FINE)</text>

      {/* SLIDE SHOE HYDRODYNAMIC BEARINGS (Inlet & Outlet) */}
      <g transform="translate(18, 35)">
        <rect x="-14" y="0" width="28" height="24" fill="#334155" stroke="#64748b" rx="2" />
        <circle cx="0" cy="10" r="4" fill="#0284c7" />
        <text x="0" y="20" fill="#38bdf8" fontSize="6" fontWeight="bold" textAnchor="middle">JACKING 120B</text>
      </g>
      <g transform="translate(262, 35)">
        <rect x="-14" y="0" width="28" height="24" fill="#334155" stroke="#64748b" rx="2" />
        <circle cx="0" cy="10" r="4" fill="#0284c7" />
        <text x="0" y="20" fill="#38bdf8" fontSize="6" fontWeight="bold" textAnchor="middle">JACKING 120B</text>
      </g>

      {/* Main Drive Girth Gear & Motor */}
      <rect x="135" y="-42" width="20" height="84" fill="#0f172a" stroke="#eab308" strokeWidth="2" rx="2" />
      <g transform="translate(145, 52)">
        <rect x="-20" y="0" width="40" height="26" fill="#334155" stroke="#64748b" rx="2" />
        <circle cx="0" cy="13" r="8" fill={statusColor} />
        <text x="0" y="16" fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle">M</text>
      </g>

      {/* Rotation animation */}
      {isRunning && (
        <line x1="20" y1="0" x2="260" y2="0" stroke="#fef08a" strokeWidth="2" strokeDasharray="10 10" opacity="0.4">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />
        </line>
      )}

      {/* Label */}
      <text x="140" y="95" fill="#f8fafc" fontSize="12" fontWeight="extrabold" textAnchor="middle">
        CEMENT BALL MILL (CM-01)
      </text>
      <text x="140" y="108" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
        Ø 3.8m × 12m • TWO COMPARTMENTS • 4,800 kW • SLIDE SHOE BEARINGS
      </text>
    </g>
  );
};

/**
 * High-Efficiency Pulse-Jet Process Bag Filter
 */
export const PulseJetBaghouseUnit: React.FC<ComponentProps> = ({ id = 'RM1-DC-01', x = 0, y = 0, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Clean Air Upper Plenum */}
      <rect x="0" y="0" width="140" height="35" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="3" />
      
      {/* Pulse valves manifold & blowpipes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i} transform={`translate(${18 + i * 20}, 10)`}>
          <circle cx="0" cy="0" r="4" fill="#00d4ff" />
          <line x1="0" y1="4" x2="0" y2="25" stroke="#38bdf8" strokeWidth="2" />
        </g>
      ))}

      {/* Filter Bag Cages Chamber */}
      <rect x="0" y="35" width="140" height="85" fill="#0f172a" stroke="#334155" strokeWidth="2" />
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i} transform={`translate(${15 + i * 16}, 35)`}>
          <line x1="0" y1="5" x2="0" y2="75" stroke="#64748b" strokeWidth="4" strokeDasharray="3 3" opacity="0.6" />
        </g>
      ))}

      {/* Dust Collection Hoppers (Pyramidal hoppers) */}
      <polygon points="0,120 70,120 55,160 15,160" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <polygon points="70,120 140,120 125,160 85,160" fill="#1e293b" stroke="#334155" strokeWidth="2" />

      {/* Rotary Airlock Valves */}
      <circle cx="35" cy="170" r="10" fill="#334155" stroke="#64748b" />
      <circle cx="105" cy="170" r="10" fill="#334155" stroke="#64748b" />

      {/* Screw Conveyor Trough */}
      <rect x="10" y="180" width="120" height="15" fill="#0f172a" stroke="#475569" rx="2" />

      {/* Label */}
      <text x="70" y="210" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        PULSE-JET BAG FILTER
      </text>
      <text x="70" y="222" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
        PTFE MEMBRANE • dP: 142 mmWC
      </text>
    </g>
  );
};

/**
 * Centrifugal Process ID Fan
 */
export const CentrifugalFanUnit: React.FC<ComponentProps> = ({ id = 'RM1-FAN-01', x = 0, y = 0, scale = 1, onClick }) => {
  const eq = useScadaStore((s) => s.equipment[id]);
  const isRunning = eq?.status === 'RUNNING' || eq?.status === undefined;
  const statusColor = getEquipmentStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} className="cursor-pointer" onClick={() => onClick && onClick(id)}>
      {/* Scroll Housing */}
      <path 
        d="M 0 -35 C 35 -35 55 -15 55 15 C 55 45 25 55 -10 55 C -45 55 -55 25 -55 -10 C -55 -35 -30 -35 0 -35 Z" 
        fill="#1e293b" 
        stroke="#475569" 
        strokeWidth="3" 
      />
      {/* Discharge flange */}
      <rect x="35" y="-55" width="20" height="25" fill="#334155" stroke="#64748b" />

      {/* Impeller Wheel with Blades */}
      <circle cx="0" cy="10" r="28" fill="#0f172a" stroke="#334155" strokeWidth="2" />
      <g transform="translate(0, 10)">
        {isRunning && (
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.25s" repeatCount="indefinite" />
        )}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1="0" y1="0" x2={22 * Math.cos(i * Math.PI / 4)} y2={22 * Math.sin(i * Math.PI / 4)} stroke="#94a3b8" strokeWidth="3" />
        ))}
      </g>

      {/* Shaft Hub */}
      <circle cx="0" cy="10" r="8" fill="#334155" stroke="#64748b" />

      {/* Drive Motor */}
      <g transform="translate(-75, 10)">
        <rect x="-18" y="-14" width="36" height="28" fill="#334155" stroke="#64748b" rx="2" />
        <circle cx="0" cy="0" r="8" fill={statusColor} />
        <text x="0" y="3" fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle">M</text>
        <line x1="18" y1="0" x2="35" y2="0" stroke="#64748b" strokeWidth="6" />
      </g>

      {/* Label */}
      <text x="0" y="75" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        PROCESS ID FAN
      </text>
      <text x="0" y="87" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
        RADIAL DOUBLE SUCTION • 2,600 kW
      </text>
    </g>
  );
};

/**
 * Reinforced Concrete Homogenizing / Storage Silo
 */
export const ReinforcedSiloUnit: React.FC<{
  x: number;
  y: number;
  width?: number;
  height?: number;
  tagLvl?: string;
  name?: string;
  material?: string;
}> = ({ x, y, width = 120, height = 240, tagLvl = 'RM1-SILO-LVL', name = 'RAW MEAL SILO', material = 'RAW MEAL' }) => {
  const lvl = useScadaStore((s) => s.tags[tagLvl] || 65);
  const fillH = Math.max(10, (lvl / 100) * (height - 60));

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Silo Top Penthouse */}
      <rect x="15" y="-20" width={width - 30} height="20" fill="#1e293b" stroke="#475569" rx="2" />
      {/* Silo Main Cylindrical Concrete Barrel */}
      <rect x="0" y="0" width={width} height={height - 40} fill="#1e293b" stroke="#475569" strokeWidth="3" rx="4" />

      {/* Material Level Fill */}
      <g transform={`translate(4, ${height - 40 - fillH})`}>
        <rect x="0" y="0" width={width - 8} height={fillH} fill="#64748b" opacity="0.85" />
        {/* Material heap curve */}
        <path d={`M 0 0 Q ${(width - 8) / 2} -14 ${width - 8} 0 Z`} fill="#94a3b8" />
      </g>

      {/* Radar Level Transmitter Gauge at top */}
      <circle cx={width / 2} cy="-10" r="4" fill="#00d4ff" />
      <line x1={width / 2} y1="-6" x2={width / 2} y2={height - 40 - fillH} stroke="#00d4ff" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

      {/* Inverted Discharge Cone with Aeration Pads */}
      <polygon 
        points={`0,${height - 40} ${width},${height - 40} ${width * 0.65},${height} ${width * 0.35},${height}`} 
        fill="#334155" 
        stroke="#475569" 
        strokeWidth="2" 
      />
      {/* Aeration sectors indicator */}
      <circle cx={width / 2} cy={height - 18} r="6" fill="#0284c7" />

      {/* Flow Control Slide Gate */}
      <rect x={width * 0.4} y={height} width={width * 0.2} height="12" fill="#0f172a" stroke="#64748b" />

      {/* Readout Overlay */}
      <rect x="10" y={height / 2 - 25} width={width - 20} height="50" rx="4" fill="#0b1320" stroke="#334155" opacity="0.9" />
      <text x={width / 2} y={height / 2 - 10} fill="#cbd5e1" fontSize="9" fontWeight="extrabold" textAnchor="middle">
        {name}
      </text>
      <text x={width / 2} y={height / 2 + 5} fill="#00ff00" fontSize="13" fontWeight="black" fontFamily="monospace" textAnchor="middle">
        {lvl.toFixed(1)}%
      </text>
      <text x={width / 2} y={height / 2 + 18} fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
        {material}
      </text>
    </g>
  );
};
