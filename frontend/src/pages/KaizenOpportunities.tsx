import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { api } from '../lib/api';

const KaizenOpportunities = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/kaizen');
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch kaizen opportunities", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const opps = data?.opportunities || [];

  const scatterData = opps.map((o: any) => {
    // Map effort to difficulty (1=LOW, 2=MEDIUM, 3=HIGH)
    let diffVal = 1;
    if (o.effort === 'MEDIUM') diffVal = 2;
    if (o.effort === 'HIGH') diffVal = 3;
    
    // Bubble size
    let size = 5;
    if (o.saving_inr_day > 5000) size = 8;
    if (o.saving_inr_day > 10000) size = 10;

    return {
      value: [diffVal, o.saving_inr_day || 0, size, o.id],
      name: o.id
    };
  });

  const scatterOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{b}' },
    xAxis: { name: 'Difficulty (1=Low, 3=High)', type: 'value', min: 0, max: 4, splitLine: { show: false }, axisLabel: { color: '#aaa' } },
    yAxis: { name: 'Savings Potential (₹/day)', type: 'value', splitLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#aaa' } },
    series: [
      {
        type: 'scatter',
        symbolSize: (item: any) => item[2] * 4,
        itemStyle: { color: '#00d4ff', opacity: 0.8 },
        data: scatterData
      }
    ]
  };

  if (loading && !data) {
    return <div className="p-8 text-center text-gray-400">Loading Kaizen Opportunities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400">Total Potential</div>
          <div className="text-2xl font-bold text-[#00e676]">₹{data?.total_potential_saving_inr_day?.toLocaleString() || 0}/day</div>
        </div>
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400">Active Opportunities</div>
          <div className="text-2xl font-bold text-[#00d4ff]">{opps.length}</div>
        </div>
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400">Kaizen Score</div>
          <div className="text-2xl font-bold text-[#ffa726]">{data?.kaizen_score || 0}</div>
        </div>
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400">Current SEC</div>
          <div className="text-2xl font-bold text-gray-300">{data?.sec_current || 0} <span className="text-sm font-normal">kWh/t</span></div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-1 bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-4">Priority Matrix</h3>
            <ReactECharts option={scatterOpts} style={{ height: '300px' }} />
         </div>
         <div className="col-span-2 bg-[#1a2540] rounded-lg border border-gray-800 p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><Lightbulb size={18}/> Opportunity List</h2>
                <select className="bg-gray-800 text-sm text-white p-1 rounded border border-gray-700">
                    <option>All Status</option>
                    <option>Open</option>
                    <option>In Progress</option>
                </select>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {opps.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No opportunities detected.</div>
              ) : (
                opps.map((o: any) => (
                  <div key={o.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-[#00d4ff] font-mono">{o.id}</span>
                          <span className="text-xs bg-gray-700 px-1 rounded">{o.department}</span>
                      </div>
                      <div className="font-bold text-white text-sm">{o.title}</div>
                      <div className="text-xs text-gray-400 mt-1 max-w-md">{o.description}</div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <div className="text-xs text-gray-400">Potential</div>
                        <div className="font-bold text-[#00e676] text-sm">{o.saving_kwh_day} kWh/day</div>
                        <div className="text-xs text-gray-400">₹{o.saving_inr_day?.toLocaleString()}</div>
                      </div>
                      <div className="text-right w-20">
                        <div className="text-xs text-gray-400">Effort</div>
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block ${o.effort==='LOW'?'bg-[#00e676]/20 text-[#00e676]':o.effort==='MEDIUM'?'bg-[#ffa726]/20 text-[#ffa726]':'bg-[#ef5350]/20 text-[#ef5350]'}`}>{o.effort || 'UNKNOWN'}</div>
                      </div>
                      <button 
                        onClick={() => navigate(`/kaizen-projects?id=${o.id && o.id.startsWith('KAI-3') ? o.id : 'KAI-3001'}`)}
                        className="bg-emerald-600 hover:bg-emerald-700 font-bold px-3 py-1.5 rounded text-xs text-white transition-all shadow-sm"
                      >
                        View Project Dossier
                      </button>
                    </div>
                  </div>

                ))
              )}
            </div>
         </div>
      </div>
    </div>
  );
};
export default KaizenOpportunities;
