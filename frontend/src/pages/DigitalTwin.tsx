import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Activity, Thermometer, Wind, Zap, Settings } from 'lucide-react';

const DigitalTwin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Raw Mill');
  const [fluc, setFluc] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setFluc(Math.random() * 2 - 1), 2000);
    return () => clearInterval(timer);
  }, []);

  const tabs = ['All Areas', 'Crushing', 'Raw Mill', 'Coal Mill', 'Pyroprocessing', 'Cooler', 'Cement Mill', 'WHRS', 'CPP', 'Packing'];

  const miniChart = {
    xAxis: { type: 'category', show: false, data: [1,2,3,4,5,6,7,8,9,10,11,12] },
    yAxis: { type: 'value', show: false },
    series: [{ data: [10, 12, 11, 14, 13, 16, 15, 18, 17, 19, 18, 20], type: 'line', smooth: true, lineStyle: { color: '#00d4ff' }, symbol: 'none' }],
    grid: { left: 0, right: 0, top: 0, bottom: 0 }
  };

  const renderTag = (label: string, value: number, unit: string, Icon: any, warning = false) => (
    <div className={`bg-[#0a0e1a] p-3 rounded border ${warning ? 'border-[#ffa726]' : 'border-gray-800'} flex items-center justify-between cursor-pointer hover:bg-gray-800 transition`}>
      <div className="flex items-center gap-2">
        <Icon size={16} className={warning ? 'text-[#ffa726]' : 'text-[#00d4ff]'} />
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400">{label}</span>
          <span className={`text-lg font-bold ${warning ? 'text-[#ffa726]' : 'text-white'}`}>{(value + (value > 10 ? fluc : fluc*0.1)).toFixed(1)} <span className="text-xs font-normal text-gray-500">{unit}</span></span>
        </div>
      </div>
      <div className="w-16 h-8"><ReactECharts option={miniChart} style={{height:'32px', width:'100%'}} /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 relative">
      <div className="absolute top-2 right-2 text-[#ffa726] border border-[#ffa726] px-2 py-1 text-xs rounded opacity-70 z-50">
        [SIMULATED DATA]
      </div>
      
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 border-b border-gray-800">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded whitespace-nowrap text-sm font-bold ${activeTab === t ? 'bg-[#00d4ff] text-black' : 'bg-[#1a2540] text-gray-400 hover:bg-gray-800'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-[#1a2540] p-6 rounded-lg min-h-[600px]">
        {activeTab === 'Raw Mill' && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">RAW MILL AREA (VRM-501)</h2>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 bg-[#0a0e1a] px-3 py-1 rounded text-sm"><div className="w-3 h-3 bg-[#00e676] rounded-full animate-pulse"></div> RUNNING</span>
                <span className="flex items-center gap-2 bg-[#0a0e1a] px-3 py-1 rounded text-sm text-[#00e676]">Health: 88/100</span>
              </div>
            </div>
            
            <div className="flex gap-8 flex-1">
              {/* P&ID Area */}
              <div className="w-1/2 bg-[#0a0e1a] rounded border border-gray-800 relative flex items-center justify-center p-8">
                <div className="w-48 h-64 border-4 border-gray-600 rounded-lg relative bg-gray-900 flex flex-col items-center justify-center shadow-xl">
                   <div className="text-gray-400 font-bold mb-4">VRM-501</div>
                   <div className="w-24 h-24 border-4 border-dashed border-gray-500 rounded-full animate-[spin_4s_linear_infinite] flex items-center justify-center">
                     <div className="w-4 h-4 bg-[#00e676] rounded-full"></div>
                   </div>
                </div>
              </div>
              
              {/* Tags Area */}
              <div className="w-1/2 grid grid-cols-2 gap-4 align-start content-start">
                {renderTag('Feed Rate', 285.3, 'TPH', Activity)}
                {renderTag('Mill DP', 625, 'mmWC', Wind, true)}
                {renderTag('Outlet Temp', 87.5, '°C', Thermometer)}
                {renderTag('Vibration', 3.8, 'mm/s', Activity)}
                {renderTag('Fan Speed', 1150, 'RPM', Wind)}
                {renderTag('Fan Power', 1250, 'kW', Zap)}
                {renderTag('Separator Speed', 85, 'RPM', Settings)}
                {renderTag('Motor Power', 3200, 'kW', Zap)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Pyroprocessing' && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">KILN AREA (KLN-901)</h2>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 bg-[#0a0e1a] px-3 py-1 rounded text-sm"><div className="w-3 h-3 bg-[#00e676] rounded-full animate-pulse"></div> RUNNING</span>
                <span className="flex items-center gap-2 bg-[#0a0e1a] px-3 py-1 rounded text-sm text-[#00e676]">Health: 92/100</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
               <div className="col-span-1 space-y-4">
                  <h3 className="font-bold text-gray-400">Kiln Tags</h3>
                  {renderTag('Feed', 285, 'TPH', Activity)}
                  {renderTag('Speed', 3.2, 'RPM', Settings)}
                  {renderTag('Burning Zone Temp', 1420, '°C', Thermometer)}
                  {renderTag('Torque', 78.5, '%', Zap)}
               </div>
               <div className="col-span-1 space-y-4">
                  <h3 className="font-bold text-gray-400">Emissions / Combustion</h3>
                  {renderTag('O2', 2.8, '%', Wind)}
                  {renderTag('CO', 180, 'ppm', Activity, true)}
                  {renderTag('NOx', 850, 'mg', Activity, true)}
               </div>
               <div className="col-span-1 space-y-4">
                  <h3 className="font-bold text-gray-400">Preheater / Cooler</h3>
                  {renderTag('Calciner Temp', 880, '°C', Thermometer)}
                  {renderTag('Sec. Air Temp', 1050, '°C', Thermometer)}
                  {renderTag('Exhaust Temp', 285, '°C', Thermometer)}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'Cement Mill' && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">CEMENT MILL AREA (CM-1201)</h2>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 bg-[#0a0e1a] px-3 py-1 rounded text-sm"><div className="w-3 h-3 bg-[#ffa726] rounded-full animate-pulse"></div> WARNING</span>
                <span className="flex items-center gap-2 bg-[#0a0e1a] px-3 py-1 rounded text-sm text-[#ef5350]">Health: 65/100</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {renderTag('Feed', 280, 'TPH', Activity)}
                {renderTag('Mill DP', 38, 'mmWC', Wind)}
                {renderTag('Motor Power', 2800, 'kW', Zap)}
                {renderTag('Separator Speed', 78, 'RPM', Settings)}
                {renderTag('Fan Power', 850, 'kW', Zap)}
                {renderTag('Outlet Temp', 105, '°C', Thermometer, true)}
                {renderTag('Blaine', 3650, 'cm²/g', Activity)}
                {renderTag('Residue 45µm', 8.5, '%', Activity)}
            </div>
          </div>
        )}

        {/* Fallback for other tabs */}
        {!['Raw Mill', 'Pyroprocessing', 'Cement Mill'].includes(activeTab) && (
          <div className="flex items-center justify-center h-[500px] text-gray-500">
             <div className="text-center">
                <Settings size={48} className="mx-auto mb-4 opacity-50" />
                <p>Simplified panel for {activeTab}</p>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DigitalTwin;
