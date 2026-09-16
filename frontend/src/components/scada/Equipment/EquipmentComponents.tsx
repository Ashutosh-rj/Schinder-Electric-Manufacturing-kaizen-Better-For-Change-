import React from 'react';
import { useScadaStore } from '../../../store/scadaStore';

interface EquipmentProps {
  id: string;
  x: number;
  y: number;
  scale?: number;
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'RUNNING': return '#22c55e'; // Green
    case 'STOPPED': return '#64748b'; // Gray
    case 'FAULT': return '#ef4444'; // Red
    case 'STARTING': return '#f59e0b'; // Amber
    default: return '#64748b';
  }
};

export const Motor: React.FC<EquipmentProps> = ({ id, x, y, scale = 1 }) => {
  const eq = useScadaStore(s => s.equipment[id]);
  const color = getStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <circle cx="0" cy="0" r="12" fill={color} stroke="#0f172a" strokeWidth="2" />
      <text x="-4" y="4" fill="#0f172a" fontSize="10" fontWeight="bold">M</text>
    </g>
  );
};

export const CrusherCore: React.FC<EquipmentProps> = ({ id, x, y, scale = 1 }) => {
  const eq = useScadaStore(s => s.equipment[id]);
  const isRunning = eq?.status === 'RUNNING';
  const color = getStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Hopper Top */}
      <polygon points="-40,-50 40,-50 30,0 -30,0" fill="#475569" stroke="#0f172a" />
      {/* Main Crusher Body */}
      <path d="M -35,0 L 35,0 C 45,30 45,60 20,80 L -20,80 C -45,60 -45,30 -35,0 Z" fill={color} stroke="#0f172a" strokeWidth="2" />
      <rect x="-25" y="80" width="50" height="20" fill="#64748b" />
      
      {/* Rotor (spinning if running) */}
      <g transform="translate(0, 40)">
        {isRunning ? (
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.5s" repeatCount="indefinite" />
        ) : null}
        <circle cx="0" cy="0" r="15" fill="#1e293b" />
        <line x1="-15" y1="0" x2="15" y2="0" stroke="#94a3b8" strokeWidth="4" />
        <line x1="0" y1="-15" x2="0" y2="15" stroke="#94a3b8" strokeWidth="4" />
      </g>
      
      {/* Base */}
      <rect x="-30" y="100" width="60" height="10" fill="#334155" />
    </g>
  );
};

export const ConveyorBelt: React.FC<{ id: string, x: number, y: number, length: number, angle?: number }> = ({ id, x, y, length, angle = 0 }) => {
  const eq = useScadaStore(s => s.equipment[id]);
  const isRunning = eq?.status === 'RUNNING';
  const color = getStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
      {/* Belt structure */}
      <rect x="0" y="-5" width={length} height="10" fill="#1e293b" stroke="#334155" />
      <path d={`M 0,0 L ${length},0`} stroke={color} strokeWidth="4" strokeDasharray="10 5">
        {isRunning && <animate attributeName="stroke-dashoffset" from="15" to="0" dur="0.5s" repeatCount="indefinite" />}
      </path>
      {/* Rollers */}
      {Array.from({ length: Math.floor(length / 30) }).map((_, i) => (
         <circle key={i} cx={15 + i * 30} cy="7" r="3" fill="#64748b" />
      ))}
    </g>
  );
};

export const Hopper: React.FC<{ x: number, y: number, width: number, height: number, levelTag?: string }> = ({ x, y, width, height, levelTag }) => {
  const level = useScadaStore(s => levelTag ? s.tags[levelTag] : 0) || 0;
  
  // Calculate fill height based on level (0-100)
  const fillHeight = (level / 100) * height;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Outer shell */}
      <polygon points={`0,0 ${width},0 ${width * 0.75},${height} ${width * 0.25},${height}`} fill="#334155" stroke="#64748b" strokeWidth="2" />
      
      {/* Material Fill */}
      <clipPath id={`hopper-clip-${x}-${y}`}>
        <polygon points={`0,0 ${width},0 ${width * 0.75},${height} ${width * 0.25},${height}`} />
      </clipPath>
      
      <g clipPath={`url(#hopper-clip-${x}-${y})`}>
         <rect x="0" y={height - fillHeight} width={width} height={fillHeight} fill="#94a3b8" />
         {/* Top surface of material */}
         <ellipse cx={width/2} cy={height - fillHeight} rx={width/2 - (height-fillHeight)*0.25} ry="5" fill="#cbd5e1" opacity={level > 0 ? 1 : 0} />
      </g>
    </g>
  );
};

export const BagFilter: React.FC<{ id: string, x: number, y: number }> = ({ id, x, y }) => {
  const eq = useScadaStore(s => s.equipment[id]);
  const color = getStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="0" width="120" height="80" fill={color} stroke="#0f172a" strokeWidth="2" />
      <polygon points="0,80 40,80 30,120 10,120" fill={color} stroke="#0f172a" />
      <polygon points="40,80 80,80 70,120 50,120" fill={color} stroke="#0f172a" />
      <polygon points="80,80 120,80 110,120 90,120" fill={color} stroke="#0f172a" />
      
      {/* Internal bags illustration */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1={12 + i * 10} y1="10" x2={12 + i * 10} y2="70" stroke="#0f172a" strokeWidth="4" strokeDasharray="2 2" opacity="0.3" />
      ))}
      <text x="15" y="45" fill="#0f172a" fontSize="14" fontWeight="bold">BAG FILTER</text>
    </g>
  );
};

export const VRM: React.FC<EquipmentProps> = ({ id, x, y, scale = 1 }) => {
  const eq = useScadaStore(s => s.equipment[id]);
  const color = getStatusColor(eq?.status);
  
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Mill Body */}
      <polygon points="-40,-10 40,-10 50,60 -50,60" fill={color} stroke="#0f172a" strokeWidth="2" />
      <rect x="-50" y="60" width="100" height="40" fill={color} stroke="#0f172a" strokeWidth="2" />
      
      {/* Separator on top */}
      <polygon points="-30,-40 30,-40 40,-10 -40,-10" fill="#64748b" stroke="#0f172a" strokeWidth="2" />
      <rect x="-15" y="-60" width="30" height="20" fill="#64748b" stroke="#0f172a" />
      
      {/* Base */}
      <rect x="-60" y="100" width="120" height="15" fill="#334155" />
      <text x="-25" y="85" fill="#0f172a" fontSize="14" fontWeight="bold">VRM</text>
    </g>
  );
};

export const Silo: React.FC<{ x: number, y: number, width: number, height: number, levelTag?: string, label?: string }> = ({ x, y, width, height, levelTag, label }) => {
  const level = useScadaStore(s => levelTag ? s.tags[levelTag] : 0) || 0;
  const fillHeight = (level / 100) * height;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="0" width={width} height={height} fill="#334155" stroke="#64748b" strokeWidth="2" />
      <polygon points={`0,${height} ${width},${height} ${width * 0.7},${height + 40} ${width * 0.3},${height + 40}`} fill="#334155" stroke="#64748b" strokeWidth="2" />
      
      {/* Level Fill */}
      <rect x="2" y={height - fillHeight} width={width - 4} height={fillHeight} fill="#94a3b8" />
      
      {label && <text x={width/2} y={height/2} fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">{label}</text>}
    </g>
  );
};

export const Fan: React.FC<EquipmentProps> = ({ id, x, y, scale = 1 }) => {
  const eq = useScadaStore(s => s.equipment[id]);
  const color = getStatusColor(eq?.status);
  const isRunning = eq?.status === 'RUNNING';

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <circle cx="0" cy="0" r="25" fill="#334155" stroke="#0f172a" strokeWidth="2" />
      <g>
        {isRunning && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.2s" repeatCount="indefinite" />}
        <path d="M 0,-5 L 20,-20 L 25,0 Z" fill={color} />
        <path d="M 5,0 L 20,20 L 0,25 Z" fill={color} />
        <path d="M 0,5 L -20,20 L -25,0 Z" fill={color} />
        <path d="M -5,0 L -20,-20 L 0,-25 Z" fill={color} />
      </g>
      <circle cx="0" cy="0" r="6" fill="#0f172a" />
      <rect x="15" y="-20" width="15" height="40" fill="#334155" stroke="#0f172a" strokeWidth="2" />
    </g>
  );
};

export const BucketElevator: React.FC<{ id: string, x: number, y: number, height: number }> = ({ id, x, y, height }) => {
  const eq = useScadaStore(s => s.equipment[id]);
  const color = getStatusColor(eq?.status);
  const isRunning = eq?.status === 'RUNNING';

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="0" width="30" height={height} fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <line x1="15" y1="0" x2="15" y2={height} stroke={color} strokeWidth="2" strokeDasharray="6 4">
         {isRunning && <animate attributeName="stroke-dashoffset" from="10" to="0" dur="0.5s" repeatCount="indefinite" />}
      </line>
      <circle cx="15" cy="15" r="10" fill="#334155" stroke="#475569" />
      <circle cx="15" cy={height - 15} r="10" fill="#334155" stroke="#475569" />
    </g>
  );
};

export const RotaryKiln: React.FC<{ id: string, x: number, y: number, length: number }> = ({ id, x, y, length }) => {
  const eq = useScadaStore(s => s.equipment[id]);
  const isRunning = eq?.status === 'RUNNING';
  const color = getStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y}) rotate(-3)`}>
      <rect x="0" y="-30" width={length} height="60" fill={color} stroke="#0f172a" strokeWidth="2" />
      {/* Tyres */}
      <rect x={length * 0.25} y="-35" width="20" height="70" fill="#64748b" stroke="#0f172a" strokeWidth="2" />
      <rect x={length * 0.75} y="-35" width="20" height="70" fill="#64748b" stroke="#0f172a" strokeWidth="2" />
      
      {/* Burner Pipe */}
      <rect x="-40" y="-5" width="40" height="10" fill="#334155" />
      {isRunning && (
        <path d="M 0,-10 Q 50,0 0,10 Z" fill="#ef4444" opacity="0.8" />
      )}
      <text x={length/2} y="5" fill="#0f172a" fontSize="16" fontWeight="bold" textAnchor="middle">ROTARY KILN</text>
    </g>
  );
};

export const PreheaterTower: React.FC<{ x: number, y: number }> = ({ x, y }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 5-stage tower simplified */}
      <rect x="0" y="0" width="100" height="400" fill="#334155" stroke="#0f172a" strokeWidth="2" />
      
      {/* Cyclones */}
      {[0, 1, 2, 3, 4].map(i => (
        <g key={i} transform={`translate(100, ${i * 70 + 20})`}>
          <polygon points="0,0 40,0 20,40" fill="#475569" stroke="#0f172a" strokeWidth="2" />
          <path d="M 40,10 Q 80,40 20,60" fill="none" stroke="#64748b" strokeWidth="10" />
        </g>
      ))}
      <text x="-10" y="200" fill="white" fontSize="14" fontWeight="bold" transform="rotate(-90 -10 200)">PREHEATER</text>
    </g>
  );
};

export const GrateCooler: React.FC<{ id: string, x: number, y: number }> = ({ id, x, y }) => {
  const eq = useScadaStore(s => s.equipment[id]);
  const isRunning = eq?.status === 'RUNNING';
  const color = getStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <polygon points="0,0 300,0 280,100 20,100" fill={color} stroke="#0f172a" strokeWidth="2" />
      
      {/* Grate plates */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1={20 + i*40} y1="30" x2={50 + i*40} y2="30" stroke="#94a3b8" strokeWidth="4" />
      ))}
      
      <text x="150" y="60" fill="#0f172a" fontSize="14" fontWeight="bold" textAnchor="middle">GRATE COOLER</text>
    </g>
  );
};

export const BallMill: React.FC<{ id: string, x: number, y: number, scale?: number }> = ({ id, x, y, scale = 1 }) => {
  const eq = useScadaStore(s => s.equipment[id]);
  const isRunning = eq?.status === 'RUNNING';
  const color = getStatusColor(eq?.status);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x="0" y="0" width="200" height="80" rx="10" fill={color} stroke="#0f172a" strokeWidth="2" />
      {/* Tyres */}
      <rect x="40" y="-5" width="15" height="90" fill="#64748b" stroke="#0f172a" strokeWidth="2" />
      <rect x="145" y="-5" width="15" height="90" fill="#64748b" stroke="#0f172a" strokeWidth="2" />
      
      {isRunning && (
        <g opacity="0.3">
          <line x1="20" y1="40" x2="180" y2="40" stroke="#0f172a" strokeWidth="2" strokeDasharray="10 10">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.5s" repeatCount="indefinite" />
          </line>
        </g>
      )}
      
      <text x="100" y="45" fill="#0f172a" fontSize="16" fontWeight="bold" textAnchor="middle">BALL MILL</text>
    </g>
  );
};
