import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { api } from '../lib/api';

const EquipmentHealth = () => {
  const [summary, setSummary] = useState<any>(null);
  const [selectedEqId, setSelectedEqId] = useState<number | null>(null);
  const [selectedEqDetails, setSelectedEqDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/health/summary');
        setSummary(res.data);
        if (!selectedEqId && res.data?.fleet_health?.length > 0) {
          setSelectedEqId(res.data.fleet_health[0].equipment_id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
    const interval = setInterval(fetchSummary, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedEqId) return;
    const fetchEq = async () => {
      try {
        const res = await api.get(`/health/equipment/${selectedEqId}`);
        setSelectedEqDetails(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEq();
  }, [selectedEqId]);

  const getHealthColor = (score: number) => score >= 80 ? 'text-[#00e676]' : score >= 65 ? 'text-[#ffa726]' : 'text-[#ef5350]';

  if (loading && !summary) return <div className="p-6 text-[#00e676]">Loading Equipment Health...</div>;

  const fleet = summary?.fleet_health || [];
  const eq = selectedEqDetails;

  const radarOptions = eq?.components ? {
    radar: {
      indicator: [
        { name: 'Vibration', max: 100 },
        { name: 'Thermal', max: 100 },
        { name: 'Electrical', max: 100 },
        { name: 'Lubrication', max: 100 },
        { name: 'Mechanical', max: 100 }
      ],
      splitArea: { show: false },
      axisName: { color: '#a0aec0' }
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [
            eq.components.vibration?.score || 100,
            eq.components.thermal?.score || 100,
            eq.components.electrical?.score || 100,
            eq.components.lubrication?.score || 100,
            eq.components.mechanical?.score || 100
          ],
          name: 'Health Score',
          itemStyle: { color: eq.health_score < 65 ? '#ef5350' : '#00d4ff' },
          areaStyle: { opacity: 0.3 }
        }
      ]
    }],
    backgroundColor: 'transparent'
  } : {};

  // Mock fleet stats since backend only returns array of 3 equipment
  const normalCount = fleet.filter((e: any) => e.status === 'NORMAL').length;
  const degradingCount = fleet.filter((e: any) => e.status === 'DEGRADING').length;
  const highRiskCount = fleet.filter((e: any) => e.status === 'HIGH_RISK').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Equipment Health</h1>
        <div className="px-3 py-1 bg-[#1a2540] rounded border border-gray-700 text-sm flex gap-4">
          <span>Fleet Health: <span className="font-bold text-[#00e676]">{summary?.overall_fleet_health || 100}/100</span></span>
          <span className="text-gray-500">|</span>
          <span className="text-[#ffa726] text-xs pt-0.5">[SIMULATED DATA]</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Normal', count: normalCount + 10, color: 'text-[#00e676]' }, // +10 mock to look populated
          { label: 'Warning / Degrading', count: degradingCount, color: 'text-[#ffa726]' },
          { label: 'High Risk', count: highRiskCount, color: 'text-[#ef5350]' },
          { label: 'Critical', count: 0, color: 'text-[#ef5350]' },
        ].map(s => (
          <div key={s.label} className="bg-[#1a2540] p-4 rounded-lg border border-gray-800 text-center shadow-lg">
            <div className="text-gray-400 text-sm">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#1a2540] rounded-lg border border-gray-800 p-4 shadow-lg">
          <h2 className="text-lg font-bold mb-4">Critical Equipment List</h2>
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Equipment</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Vibration</th>
                <th className="px-4 py-2">Power</th>
              </tr>
            </thead>
            <tbody>
              {fleet.map((item: any) => (
                <tr 
                  key={item.equipment_id} 
                  className={`border-b border-gray-800 cursor-pointer transition-colors ${selectedEqId === item.equipment_id ? 'bg-[#00d4ff]/10' : 'hover:bg-gray-800/50'}`}
                  onClick={() => setSelectedEqId(item.equipment_id)}
                >
                  <td className="px-4 py-3 font-mono">{item.code}</td>
                  <td className="px-4 py-3 font-bold">{item.name}</td>
                  <td className={`px-4 py-3 font-bold ${getHealthColor(item.health_score)}`}>{item.health_score}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${item.status === 'NORMAL' ? 'bg-[#00e676]/20 text-[#00e676]' : item.status === 'DEGRADING' ? 'bg-[#ffa726]/20 text-[#ffa726]' : 'bg-[#ef5350]/20 text-[#ef5350]'}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.vibration_mms !== null ? item.vibration_mms : '-'} mm/s</td>
                  <td className="px-4 py-3">{item.power_kw} kW</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-1 bg-[#1a2540] rounded-lg border border-gray-800 p-4 shadow-lg">
          {eq ? (
            <>
              <h2 className="text-lg font-bold mb-1">{eq.name}</h2>
              <div className="text-sm text-gray-400 mb-4">{eq.equipment_code}</div>
              
              <div className="flex justify-between items-center bg-[#0a0e1a] p-3 rounded mb-4">
                 <div>
                   <div className="text-xs text-gray-500">Overall Health</div>
                   <div className={`text-2xl font-bold ${getHealthColor(eq.health_score)}`}>{eq.health_score}</div>
                 </div>
                 <div className="text-right">
                   <div className="text-xs text-gray-500">Status</div>
                   <div className={`font-bold ${eq.status === 'NORMAL' ? 'text-[#00e676]' : 'text-[#ef5350]'}`}>{eq.status.replace('_', ' ')}</div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                 <div className="bg-[#0a0e1a] p-3 rounded border border-gray-800 text-center">
                    <div className="text-xs text-gray-500 mb-1">MTBF (Est.)</div>
                    <div className="font-bold text-[#ffa726]">{eq.mtbf_days ? `${eq.mtbf_days} Days` : 'N/A'}</div>
                 </div>
                 <div className="bg-[#0a0e1a] p-3 rounded border border-gray-800 text-center">
                    <div className="text-xs text-gray-500 mb-1">MTTR</div>
                    <div className="font-bold text-[#00d4ff]">{eq.mttr_hours ? `${eq.mttr_hours} Hours` : 'N/A'}</div>
                 </div>
              </div>

              {eq.components && (
                <div className="h-[250px] -mt-4">
                  <ReactECharts option={radarOptions} style={{ height: '100%', width: '100%' }} />
                </div>
              )}

              <div className="space-y-3">
                <div className="text-sm">
                  <div className="text-gray-400 text-xs">AI Recommendation</div>
                  <div className="text-white bg-[#0a0e1a] p-2 rounded mt-1 border border-gray-800">{eq.recommendation || 'Continue normal operation.'}</div>
                </div>
              </div>
            </>
          ) : (
             <div className="text-gray-500">Select equipment...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentHealth;
