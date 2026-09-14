import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Activity, AlertTriangle, CheckCircle, Info, Settings } from 'lucide-react';

// Helper Components
const SIM_BADGE = () => (
  <div className="absolute top-2 right-2 text-[#ffa726] border border-[#ffa726] px-2 py-1 text-xs rounded opacity-70 z-50 pointer-events-none">
    [SIMULATED DATA]
  </div>
);

const ADVISORY_BADGE = () => (
  <span className="text-[10px] text-[#ffa726] border border-[#ffa726] px-1 py-0.5 rounded">ADVISORY ONLY</span>
);

const Banner = ({ name, status, items }: { name: string, status: 'NORMAL' | 'WARN' | 'CRIT', items: { label: string, value: string }[] }) => {
  const color = status === 'NORMAL' ? 'border-[#00e676]' : status === 'WARN' ? 'border-[#ffa726]' : 'border-[#ef5350]';
  return (
    <div className={`bg-[#1a2540] p-4 rounded-lg flex justify-between items-center border-l-4 ${color}`}>
      <h2 className="text-lg font-bold">{name}</h2>
      <div className="flex gap-6 text-sm">
        {items.map((item, i) => (
          <div key={i}>
            <span className="text-gray-400">{item.label}:</span> <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OW = ({ label, cur, lo, hi, tgt, unit, warn }: { label: string, cur: number, lo: number, hi: number, tgt: number, unit: string, warn?: boolean }) => {
  const percent = ((cur - lo) / (hi - lo)) * 100;
  const color = warn ? '#ffa726' : '#00e676';
  return (
    <div className="bg-[#0a0e1a] p-3 rounded border border-gray-800">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold">{label}</span>
        <span className="text-xs text-gray-400">{cur} {unit}</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded relative overflow-hidden">
        <div className="h-full absolute left-0 top-0 rounded" style={{ width: `${Math.max(0, Math.min(100, percent))}%`, backgroundColor: color }} />
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-gray-500">
        <span>Min: {lo}</span>
        <span>Tgt: {tgt}</span>
        <span>Max: {hi}</span>
      </div>
    </div>
  );
};

const Rec = ({ action, reason, conf, priority }: { action: string, reason: string, conf: number, priority: 'HIGH' | 'MEDIUM' | 'LOW' }) => {
  const color = priority === 'HIGH' ? '#ef5350' : priority === 'MEDIUM' ? '#ffa726' : '#00d4ff';
  return (
    <div className="bg-[#0a0e1a] p-3 rounded border-l-2" style={{ borderColor: color }}>
      <div className="text-sm font-bold text-[#00d4ff] mb-1">{action}</div>
      <div className="text-xs text-gray-400 mb-2">{reason}</div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-300">Conf: {conf}%</span>
        <ADVISORY_BADGE />
      </div>
    </div>
  );
};

const Trend = ({ height = '250px' }) => {
  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1h','2h','3h','4h','5h','6h','7h','8h'] },
    yAxis: { type: 'value' },
    series: [
      { name: 'Trend A', type: 'line', data: [12, 14, 13, 16, 15, 17, 16, 18], smooth: true, itemStyle: { color: '#00d4ff' } },
      { name: 'Trend B', type: 'line', data: [22, 24, 21, 26, 25, 27, 24, 28], smooth: true, itemStyle: { color: '#00e676' } }
    ]
  };
  return <ReactECharts option={option} style={{ height }} />;
};

const Process: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Raw Mill');
  const tabs = ['Raw Mill', 'Kiln', 'Cooler', 'Cement Mill', 'Preheater'];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 relative">
      <SIM_BADGE />
      
      <div className="flex border-b border-gray-800 mb-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-3 font-bold ${activeTab === t ? 'text-[#00d4ff] border-b-2 border-[#00d4ff]' : 'text-gray-500 hover:text-gray-300'}`}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Raw Mill' && (
        <div className="space-y-6">
          <Banner name="RAW MILL 1 — OPERATING" status="WARN" items={[
            { label: 'Feed', value: '285.3 TPH' }, { label: 'Target', value: '300 TPH' }, { label: 'SEC', value: '18.5 kWh/t' }
          ]} />
          
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 space-y-6">
              <div className="bg-[#1a2540] p-4 rounded-lg">
                <h3 className="font-bold mb-4">Operating Window</h3>
                <div className="grid grid-cols-3 gap-4">
                  <OW label="Mill DP" cur={625} lo={500} hi={800} tgt={600} unit="mmWC" warn={true} />
                  <OW label="Outlet Temp" cur={87.5} lo={70} hi={100} tgt={85} unit="°C" />
                  <OW label="Vibration" cur={3.8} lo={0} hi={8} tgt={4} unit="mm/s" />
                  <OW label="Separator Spd" cur={85} lo={50} hi={120} tgt={90} unit="RPM" />
                  <OW label="Mill Power" cur={3200} lo={2500} hi={3800} tgt={3000} unit="kW" />
                  <OW label="Fan Power" cur={1250} lo={800} hi={1500} tgt={1200} unit="kW" />
                </div>
              </div>
              <div className="bg-[#1a2540] p-4 rounded-lg">
                <h3 className="font-bold mb-4">Multi-Parameter Trend (8h)</h3>
                <Trend height="300px" />
              </div>
            </div>
            
            <div className="col-span-4 space-y-6">
              <div className="bg-[#1a2540] p-4 rounded-lg">
                <h3 className="font-bold mb-4">Detected Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#ffa726]/20 border border-[#ffa726] text-[#ffa726] text-xs px-2 py-1 rounded">FEED_INSTABILITY</span>
                  <span className="bg-[#ffa726]/20 border border-[#ffa726] text-[#ffa726] text-xs px-2 py-1 rounded">DP_APPROACHING_HIGH</span>
                </div>
              </div>
              <div className="bg-[#1a2540] p-4 rounded-lg">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Activity size={18}/> AI Recommendations</h3>
                <div className="space-y-3">
                  <Rec action="Stabilize Feed Rate" reason="Feed fluctuation is causing DP variations." conf={88} priority="HIGH" />
                  <Rec action="Monitor Mill DP" reason="DP is trending towards high limit." conf={75} priority="MEDIUM" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Kiln' && (
        <div className="space-y-6">
          <Banner name="KILN — OPERATING" status="NORMAL" items={[
            { label: 'Feed', value: '285 TPH' }, { label: 'Clinker', value: '285.3 TPH' }, { label: 'Heat Cons', value: '715 kcal/kg' }, { label: 'Speed', value: '3.2 RPM' }
          ]} />
          
          <div className="grid grid-cols-12 gap-6">
             <div className="col-span-8 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                 <div className="bg-[#1a2540] p-4 rounded-lg">
                    <h3 className="font-bold mb-4">Combustion Panel</h3>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center"><span className="text-sm">O2</span> <span className="font-bold text-[#00e676]">2.8%</span></div>
                       <div className="flex justify-between items-center"><span className="text-sm">CO</span> <span className="font-bold text-[#00e676]">180 ppm</span></div>
                       <div className="flex justify-between items-center"><span className="text-sm">NOx</span> <span className="font-bold text-[#ffa726]">850 mg/Nm³</span></div>
                    </div>
                 </div>
                 <div className="bg-[#1a2540] p-4 rounded-lg">
                    <h3 className="font-bold mb-4">Thermal Panel</h3>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center"><span className="text-sm">Burning Zone</span> <span className="font-bold">1420 / 1450°C</span></div>
                       <div className="flex justify-between items-center"><span className="text-sm">Secondary Air</span> <span className="font-bold">1050°C</span></div>
                    </div>
                 </div>
               </div>
               <div className="bg-[#1a2540] p-4 rounded-lg">
                 <h3 className="font-bold mb-4">Multi-Parameter Trend (8h)</h3>
                 <Trend height="300px" />
               </div>
             </div>
             
             <div className="col-span-4 space-y-6">
                <div className="bg-[#1a2540] p-4 rounded-lg">
                   <h3 className="font-bold mb-4">Detected Conditions</h3>
                   <div className="flex flex-wrap gap-2">
                     <span className="bg-[#00e676]/20 border border-[#00e676] text-[#00e676] text-xs px-2 py-1 rounded">STABLE_OPERATION</span>
                   </div>
                </div>
                <div className="bg-[#1a2540] p-4 rounded-lg">
                   <h3 className="font-bold mb-4 flex items-center gap-2"><Activity size={18}/> AI Recommendations</h3>
                   <div className="space-y-3">
                      <Rec action="Optimize Primary Air" reason="Potential for slight SEC reduction." conf={82} priority="LOW" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'Cooler' && (
        <div className="space-y-6">
          <Banner name="CLINKER COOLER" status="WARN" items={[
            { label: 'Efficiency', value: '72.3%' }, { label: 'Sec. Air', value: '1050°C' }, { label: 'Exhaust', value: '285°C' }
          ]} />
          
          <div className="grid grid-cols-12 gap-6">
             <div className="col-span-8 space-y-6">
               <div className="bg-[#1a2540] p-4 rounded-lg">
                 <h3 className="font-bold mb-4">Heat Balance</h3>
                 <ReactECharts option={{
                   xAxis: { type: 'value', show: false },
                   yAxis: { type: 'category', data: ['Loss', 'WHRS', 'Sec Air', 'Input'] },
                   series: [{ type: 'bar', data: [15, 25, 60, 100], itemStyle: { color: '#00d4ff' } }]
                 }} style={{ height: '200px' }} />
               </div>
               <div className="bg-[#1a2540] p-4 rounded-lg">
                 <h3 className="font-bold mb-4">Fan Status Grid</h3>
                 <div className="grid grid-cols-6 gap-2">
                   {Array.from({length: 12}).map((_, i) => (
                     <div key={i} className={`p-2 text-center text-xs rounded border ${i===2 ? 'border-[#ef5350] text-[#ef5350]' : 'border-gray-700'}`}>
                       CF-100{i+1}
                       <div className="font-bold mt-1">{i===2 ? 'VIB_HI' : 'OK'}</div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
             <div className="col-span-4 space-y-6">
                <div className="bg-[#1a2540] p-4 rounded-lg">
                   <h3 className="font-bold mb-4">Detected Conditions</h3>
                   <div className="flex flex-wrap gap-2">
                     <span className="bg-[#ffa726]/20 border border-[#ffa726] text-[#ffa726] text-xs px-2 py-1 rounded">EFF_BELOW_TARGET</span>
                     <span className="bg-[#ef5350]/20 border border-[#ef5350] text-[#ef5350] text-xs px-2 py-1 rounded">CF-1003_VIB_HIGH</span>
                   </div>
                </div>
                <div className="bg-[#1a2540] p-4 rounded-lg">
                   <h3 className="font-bold mb-4">AI Recommendations</h3>
                   <div className="space-y-3">
                      <Rec action="Inspect CF-1003 Bearing" reason="Critical vibration levels detected." conf={99} priority="HIGH" />
                      <Rec action="Adjust Grate Speed" reason="Improve cooling efficiency." conf={72} priority="MEDIUM" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'Cement Mill' && (
        <div className="space-y-6">
          <Banner name="CEMENT MILL 1" status="WARN" items={[
            { label: 'Feed', value: '280 TPH' }, { label: 'Blaine', value: '3650 cm²/g' }, { label: 'Motor Power', value: '2800 kW' }, { label: 'Separator', value: '78 RPM' }
          ]} />
          <div className="grid grid-cols-12 gap-6">
             <div className="col-span-8 space-y-6">
               <div className="bg-[#1a2540] p-4 rounded-lg">
                 <h3 className="font-bold mb-4">Operating Window</h3>
                 <div className="grid grid-cols-3 gap-4">
                  <OW label="Blaine" cur={3650} lo={3200} hi={4200} tgt={3800} unit="cm²/g" warn={true} />
                  <OW label="Mill DP" cur={38} lo={20} hi={60} tgt={40} unit="mmWC" />
                  <OW label="Outlet Temp" cur={105} lo={80} hi={130} tgt={110} unit="°C" />
                  <OW label="Residue 45µm" cur={8.5} lo={2} hi={15} tgt={8} unit="%" />
                 </div>
               </div>
               <div className="bg-[#1a2540] p-4 rounded-lg">
                  <h3 className="font-bold mb-4">Blaine Prediction (Next 30m)</h3>
                  <div className="flex items-center gap-6 p-4 bg-[#0a0e1a] rounded">
                     <div className="text-center"><div className="text-sm text-gray-400">Current</div><div className="text-2xl font-bold">3650</div></div>
                     <span className="text-[#00d4ff]">→</span>
                     <div className="text-center"><div className="text-sm text-gray-400">Predicted</div><div className="text-2xl font-bold text-[#00d4ff]">3680</div></div>
                     <div className="text-xs bg-[#1a2540] px-2 py-1 rounded">Conf: 78%</div>
                  </div>
               </div>
             </div>
             <div className="col-span-4 space-y-6">
                <div className="bg-[#1a2540] p-4 rounded-lg">
                   <h3 className="font-bold mb-4">Detected Conditions</h3>
                   <div className="flex flex-wrap gap-2">
                     <span className="bg-[#ffa726]/20 border border-[#ffa726] text-[#ffa726] text-xs px-2 py-1 rounded">BLAINE_BELOW_TARGET</span>
                     <span className="bg-[#ffa726]/20 border border-[#ffa726] text-[#ffa726] text-xs px-2 py-1 rounded">SEC_ABOVE_TARGET</span>
                   </div>
                </div>
                <div className="bg-[#1a2540] p-4 rounded-lg">
                   <h3 className="font-bold mb-4">AI Recommendations</h3>
                   <div className="space-y-3">
                      <Rec action="Increase Separator Speed" reason="To achieve target Blaine." conf={85} priority="MEDIUM" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'Preheater' && (
        <div className="space-y-6">
          <Banner name="PREHEATER TOWER" status="WARN" items={[
            { label: 'False Air', value: '8.2%' }, { label: 'Target', value: '<5%' }
          ]} />
          <div className="grid grid-cols-12 gap-6">
             <div className="col-span-8 space-y-6">
               <div className="bg-[#1a2540] p-4 rounded-lg flex justify-center">
                  <div className="w-1/2">
                    <h3 className="font-bold mb-4 text-center">Temperature Profile</h3>
                    <ReactECharts option={{
                      xAxis: { type: 'value', min: 200, max: 1000 },
                      yAxis: { type: 'category', data: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'], inverse: true },
                      series: [{ type: 'bar', data: [320, 480, 640, 770, 858], label: {show: true, position: 'right'}, itemStyle: { color: '#ffa726' } }]
                    }} style={{ height: '300px' }} />
                  </div>
               </div>
               <div className="bg-[#1a2540] p-4 rounded-lg">
                 <h3 className="font-bold mb-4">Draft Profile</h3>
                 <Trend height="200px" />
               </div>
             </div>
             <div className="col-span-4 space-y-6">
                <div className="bg-[#1a2540] p-4 rounded-lg">
                   <h3 className="font-bold mb-4">Cyclone Efficiency</h3>
                   <div className="space-y-3">
                     {[92, 94, 91, 88, 96].map((eff, i) => (
                       <div key={i}>
                         <div className="flex justify-between text-xs mb-1"><span>Stage {i+1}</span><span>{eff}%</span></div>
                         <div className="h-1.5 w-full bg-gray-800 rounded"><div className="h-full bg-[#00d4ff] rounded" style={{width: `${eff}%`}}></div></div>
                       </div>
                     ))}
                   </div>
                </div>
                <div className="bg-[#1a2540] p-4 rounded-lg">
                   <h3 className="font-bold mb-4">Detected Conditions</h3>
                   <div className="flex flex-wrap gap-2">
                     <span className="bg-[#ffa726]/20 border border-[#ffa726] text-[#ffa726] text-xs px-2 py-1 rounded">HIGH_FALSE_AIR</span>
                   </div>
                </div>
                <div className="bg-[#1a2540] p-4 rounded-lg">
                   <h3 className="font-bold mb-4">AI Recommendations</h3>
                   <div className="space-y-3">
                      <Rec action="Inspect Stage 4 Flaps" reason="Efficiency drop detected." conf={81} priority="MEDIUM" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Process;
