import React, { useEffect, useState } from 'react';
import { Activity, Zap, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { api } from '../lib/api';

const OEEAnalysis = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/overview');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading && !data) return <div className="p-6 text-[#00d4ff]">Loading OEE...</div>;

  // Estimate OEE from API production efficiency
  const perf = data?.production?.efficiency_pct || 90.0;
  const avail = data?.plant_status === 'CRITICAL' ? 85.0 : 96.5; 
  const qual = 98.2;
  const oee = (perf / 100) * (avail / 100) * (qual / 100) * 100;

  const totalTime = 24;
  const availTime = totalTime * (avail/100);
  const planDown = totalTime - availTime;
  const operTime = availTime * (perf/100);
  const unplanDown = availTime - operTime;
  const netOper = operTime * (qual/100);
  const speedLoss = operTime - netOper;

  const cascadeOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 30, right: 30, bottom: 20, left: 50 },
    xAxis: { type: 'category', data: ['Total Time', 'Planned Down', 'Available', 'Unplanned Down', 'Operating', 'Speed Loss', 'Fully Prod.'], axisLabel: { color: '#5a7384', fontSize: 10, interval: 0, rotate: 30 } },
    yAxis: { type: 'value', name: 'Hours', axisLabel: { color: '#5a7384', fontSize: 10 }, splitLine: { lineStyle: { color: '#15303f' } } },
    series: [
      {
        type: 'bar',
        stack: 'Total',
        itemStyle: { color: 'rgba(0,0,0,0)' },
        data: [0, availTime, 0, operTime, 0, netOper, 0] // Bottom of floating bars
      },
      {
        type: 'bar',
        stack: 'Total',
        label: { show: true, position: 'top', color: '#fff', fontSize: 10, formatter: (p:any) => p.value.toFixed(1) },
        itemStyle: { color: (params:any) => {
          const colors = ['#3b82f6', '#5a7384', '#00d4ff', '#ef5350', '#00e676', '#ffa726', '#00e676'];
          return colors[params.dataIndex];
        }},
        data: [totalTime, planDown, availTime, unplanDown, operTime, speedLoss, netOper] // Values
      }
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#041116] text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-wide">Plant OEE Analysis</h1>
          <p className="text-[11px] text-[#8899aa] uppercase tracking-wider">Overall Equipment Effectiveness (Live Estimate)</p>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="bg-[#091b24] border border-[#15303f] rounded-xl p-4 flex-1 flex flex-col items-center justify-center shadow-sm">
           <div className="text-[11px] text-[#8899aa] font-bold uppercase tracking-wider mb-2">Availability (A)</div>
           <div className="text-[28px] font-bold text-[#00d4ff]">{avail.toFixed(1)}%</div>
        </div>
        <div className="flex items-center text-[#5a7384]"><ArrowRight size={20}/></div>
        <div className="bg-[#091b24] border border-[#15303f] rounded-xl p-4 flex-1 flex flex-col items-center justify-center shadow-sm">
           <div className="text-[11px] text-[#8899aa] font-bold uppercase tracking-wider mb-2">Performance (P)</div>
           <div className="text-[28px] font-bold text-[#ffa726]">{perf.toFixed(1)}%</div>
        </div>
        <div className="flex items-center text-[#5a7384]"><ArrowRight size={20}/></div>
        <div className="bg-[#091b24] border border-[#15303f] rounded-xl p-4 flex-1 flex flex-col items-center justify-center shadow-sm">
           <div className="text-[11px] text-[#8899aa] font-bold uppercase tracking-wider mb-2">Quality (Q)</div>
           <div className="text-[28px] font-bold text-[#00e676]">{qual.toFixed(1)}%</div>
        </div>
        <div className="flex items-center text-[#5a7384]"><ArrowRight size={20}/></div>
        <div className="bg-[#1a2540] border-2 border-[#00e676]/30 rounded-xl p-4 flex-1 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 bg-[#00e676]/20 px-2 py-1 rounded-bl-lg text-[9px] font-bold text-[#00e676]">LIVE</div>
           <div className="text-[11px] text-[#8899aa] font-bold uppercase tracking-wider mb-2">Overall OEE</div>
           <div className="text-[36px] font-black text-white">{oee.toFixed(1)}%</div>
        </div>
      </div>

      <div className="flex-1 bg-[#091b24] border border-[#15303f] rounded-xl p-4 shadow-lg flex flex-col">
         <h3 className="text-[13px] font-bold text-white mb-2">OEE Loss Cascade (24h Estimate)</h3>
         <div className="flex-1 min-h-0">
            <ReactECharts option={cascadeOption} style={{ height: '100%', width: '100%' }} />
         </div>
      </div>
    </div>
  );
};

export default OEEAnalysis;
