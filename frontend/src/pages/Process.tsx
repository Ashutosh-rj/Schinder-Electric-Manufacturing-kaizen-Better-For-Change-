import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Activity, AlertTriangle, CheckCircle, Info, Settings } from 'lucide-react';
import { api } from '../lib/api';

// Helper Components
const SIM_BADGE = () => (
  <div className="absolute top-2 right-2 text-[#ffa726] border border-[#ffa726] px-2 py-1 text-xs rounded opacity-70 z-50 pointer-events-none">
    [SIMULATED DATA]
  </div>
);

const ADVISORY_BADGE = () => (
  <span className="text-[10px] text-[#ffa726] border border-[#ffa726] px-1 py-0.5 rounded">ADVISORY ONLY</span>
);

const Banner = ({ name, status, items }: { name: string, status: 'NORMAL' | 'WARN' | 'CRIT' | 'ATTENTION' | 'OK' | 'HIGH' | 'LOW', items: { label: string, value: string }[] }) => {
  const isWarn = ['WARN', 'ATTENTION', 'HIGH', 'LOW'].includes(status);
  const color = ['NORMAL', 'OK'].includes(status) ? 'border-[#00e676]' : isWarn ? 'border-[#ffa726]' : 'border-[#ef5350]';
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

const Process: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Raw Mill');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let endpoint = '/process/rawmill/1';
    if (activeTab === 'Kiln') endpoint = '/process/kiln';
    if (activeTab === 'Cement Mill') endpoint = '/process/cementmill/1';
    if (activeTab === 'Cooler') endpoint = '/process/cooler';

    const fetchData = async () => {
      try {
        const res = await api.get(endpoint);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch process data", err);
      } finally {
        setLoading(false);
      }
    };
    
    setLoading(true);
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 relative">
      <SIM_BADGE />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800 pb-2">
        {['Raw Mill', 'Kiln', 'Cement Mill', 'Cooler'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded text-sm font-bold transition-colors ${
              activeTab === tab ? 'bg-[#1a2540] text-[#00d4ff] border border-[#1c3a4a]' : 'text-gray-500 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && !data ? (
        <div className="text-[#00d4ff]">Loading {activeTab} Data...</div>
      ) : (
        <div className="space-y-6">
          <Banner 
             name={`${activeTab.toUpperCase()} — OPERATING`} 
             status={data?.detected_conditions?.[0] === 'NORMAL' ? 'NORMAL' : 'WARN'} 
             items={[
               { label: 'Feed', value: `${data?.production?.feed_tph || 0} TPH` },
               { label: 'Target', value: `${data?.production?.target_tph || 0} TPH` }
             ]} 
          />
          
          <div className="grid grid-cols-12 gap-6">
             <div className="col-span-8 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                 {data?.operating_parameters && (
                   <div className="bg-[#1a2540] p-4 rounded-lg col-span-2">
                      <h3 className="font-bold mb-4">Operating Parameters</h3>
                      <div className="grid grid-cols-2 gap-4">
                         {Object.entries(data.operating_parameters).map(([k, v]: [string, any]) => (
                            <OW key={k} label={k.replace(/_/g, ' ').toUpperCase()} cur={v} lo={0} hi={v * 1.5} tgt={v * 0.9} unit="" />
                         ))}
                      </div>
                   </div>
                 )}
                 {data?.burning_zone && (
                   <div className="bg-[#1a2540] p-4 rounded-lg">
                      <h3 className="font-bold mb-4">Burning Zone</h3>
                      <OW label="TEMP" cur={data.burning_zone.temp_c} lo={1200} hi={1600} tgt={1450} unit="°C" warn={data.burning_zone.temp_c < 1380 || data.burning_zone.temp_c > 1490} />
                   </div>
                 )}
                 {data?.gas_analysis && (
                   <div className="bg-[#1a2540] p-4 rounded-lg">
                      <h3 className="font-bold mb-4">Gas Analysis</h3>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center"><span className="text-sm">O2</span> <span className="font-bold text-[#00e676]">{data.gas_analysis.o2_pct}%</span></div>
                         <div className="flex justify-between items-center"><span className="text-sm">NOx</span> <span className="font-bold text-[#ffa726]">{data.gas_analysis.nox_mg_nm3} mg</span></div>
                      </div>
                   </div>
                 )}
               </div>
               
               {data?.efficiency && (
                 <div className="bg-[#1a2540] p-4 rounded-lg">
                    <h3 className="font-bold mb-4">Efficiency</h3>
                    <OW label="SEC" cur={data.efficiency.specific_energy_kwh_t || data.efficiency.eff_pct} lo={0} hi={data.efficiency.target_kwh_t * 1.5 || 100} tgt={data.efficiency.target_kwh_t || data.efficiency.target_pct} unit={data.efficiency.specific_energy_kwh_t ? 'kWh/t' : '%'} warn={false} />
                 </div>
               )}
               {data?.temperatures && (
                 <div className="bg-[#1a2540] p-4 rounded-lg">
                    <h3 className="font-bold mb-4">Temperatures</h3>
                    <div className="grid grid-cols-2 gap-4">
                       {Object.entries(data.temperatures).map(([k, v]: [string, any]) => (
                          <div key={k} className="flex justify-between items-center"><span className="text-sm">{k.replace(/_/g, ' ').toUpperCase()}</span> <span className="font-bold text-[#00e676]">{v} °C</span></div>
                       ))}
                    </div>
                 </div>
               )}
             </div>
             
             <div className="col-span-4 space-y-6">
               <div className="bg-[#1a2540] p-4 rounded-lg">
                 <h3 className="font-bold mb-4">Detected Conditions</h3>
                 <div className="flex flex-wrap gap-2">
                   {(data?.detected_conditions || []).map((cond: string, i: number) => (
                      <span key={i} className={`text-xs px-2 py-1 rounded border ${cond === 'NORMAL' ? 'bg-[#00e676]/20 border-[#00e676] text-[#00e676]' : 'bg-[#ffa726]/20 border-[#ffa726] text-[#ffa726]'}`}>{cond}</span>
                   ))}
                 </div>
               </div>
               <div className="bg-[#1a2540] p-4 rounded-lg">
                 <h3 className="font-bold mb-4 flex items-center gap-2"><Activity size={18}/> AI Recommendations</h3>
                 <div className="space-y-3">
                   {(data?.recommendations || []).map((rec: any, i: number) => (
                      <Rec key={i} action={rec.action} reason={rec.reason} conf={rec.priority === 'HIGH' ? 88 : 75} priority={rec.priority} />
                   ))}
                   {(!data?.recommendations || data.recommendations.length === 0) && (
                      <div className="text-gray-500 text-sm italic">No active recommendations.</div>
                   )}
                 </div>
               </div>
               <div className="bg-[#1a2540] p-4 rounded-lg">
                 <h3 className="font-bold mb-4">RCA Hints</h3>
                 <ul className="list-disc pl-4 space-y-2 text-sm text-gray-400">
                    {(data?.rca_hints || []).map((hint: string, i: number) => (
                       <li key={i}>{hint}</li>
                    ))}
                    {(!data?.rca_hints || data.rca_hints.length === 0) && (
                       <li>Monitoring process telemetry...</li>
                    )}
                 </ul>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Process;
