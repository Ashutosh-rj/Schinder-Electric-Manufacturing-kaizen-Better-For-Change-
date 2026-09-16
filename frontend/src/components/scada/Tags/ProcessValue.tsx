import React from 'react';
import { useScadaStore } from '../../../store/scadaStore';

interface ProcessValueProps {
  tag: string;
  unit?: string;
  label?: string;
  color?: string;
  className?: string;
  fractionDigits?: number;
}

export const ProcessValue: React.FC<ProcessValueProps> = ({ 
  tag, 
  unit = '', 
  label, 
  color = '#00ff00',
  className = '',
  fractionDigits = 1
}) => {
  // Subscribe ONLY to the specific tag to prevent full re-renders
  const value = useScadaStore(state => state.tags[tag]);

  const displayValue = value !== undefined ? value.toFixed(fractionDigits) : '---.-';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-gray-400 text-[10px] uppercase">{label}</span>}
      <div className="font-mono font-bold" style={{ color }}>
        {displayValue} <span className="text-[10px] text-gray-400">{unit}</span>
      </div>
    </div>
  );
};

interface DataBoxProps {
  title?: string;
  tagMv: string;
  tagSp?: string;
  unit: string;
  left: number;
  top: number;
}

export const DataBox: React.FC<DataBoxProps> = ({ title, tagMv, tagSp, unit, left, top }) => {
  return (
    <div className="absolute bg-[#0a0f1c] border border-gray-600 p-1 text-[9px] font-mono shadow-md z-20 min-w-[80px]" style={{ left, top }}>
      {title && <div className="text-white border-b border-gray-700 mb-0.5 px-1 bg-[#1e293b]">{title}</div>}
      <div className="flex justify-between px-1 gap-3">
        <span className="text-gray-400">MV</span>
        <ProcessValue tag={tagMv} unit={unit} fractionDigits={1} />
      </div>
      {tagSp && (
        <div className="flex justify-between px-1 gap-3 mt-0.5">
          <span className="text-gray-400">SP</span>
          <ProcessValue tag={tagSp} unit={unit} fractionDigits={1} color="#00d4ff" />
        </div>
      )}
    </div>
  );
};
