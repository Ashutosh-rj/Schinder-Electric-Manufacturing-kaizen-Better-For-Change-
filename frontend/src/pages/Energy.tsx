import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Zap, Target, TrendingDown, Clock, Lightbulb } from 'lucide-react';
import { api } from '../lib/api';

const Energy: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        const [trendRes, breakdownRes, secRes, whrsRes] = await Promise.all([
          api.get('/energy/trend'),
          api.get('/energy/breakdown'),
          api.get('/energy/sec'),
          api.get('/energy/whrs')
        ]);
        
        setData({
          trend: trendRes.data,
          breakdown: breakdownRes.data,
          sec: secRes.data,
          whrs: whrsRes.data
        });
      } catch (err) {
        console.error("Failed to fetch energy data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEnergyData();
    const interval = setInterval(fetchEnergyData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return <div className="p-6 text-[#00e676]">Loading Energy Analytics...</div>;
  }

  const sec = data.sec?.sec_kwh_ton_clinker || 0;
  const targetSec = data.sec?.target_sec || 62.0;

  const times = (data.trend?.trend_24h || []).map((t: any) => new Date(t.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const secs = (data.trend?.trend_24h || []).map((t: any) => t.sec_kwh_ton);
  const targets = (data.trend?.trend_24h || []).map(() => targetSec);

  const lineOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: times },
    yAxis: { type: 'value', min: 'dataMin' },
    series: [
      { name: 'SEC', type: 'line', data: secs, smooth: true, itemStyle: { color: '#00d4ff' } },
      { name: 'Target', type: 'line', data: targets, lineStyle: { type: 'dashed', color: '#00e676' }, symbol: 'none' }
    ]
  };

  const depts = (data.breakdown?.breakdown || []).map((d: any) => d.department);
  const actuals = (data.breakdown?.breakdown || []).map((d: any) => ({
    value: Math.round(d.consumption_kw / 100) / 10, // Assuming target charts want MW approx or thousands of kW
    itemStyle: { color: d.deviation_pct > 10 ? '#ef5350' : '#ffa726' }
  }));
  // Mock target logic just for visual mapping
  const targetsBar = (data.breakdown?.breakdown || []).map((d: any) => Math.round((d.consumption_kw * 0.9) / 100) / 10);

  const barOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { textStyle: { color: '#fff' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: depts },
    series: [
      { name: 'Actual (100kW)', type: 'bar', data: actuals },
      { name: 'Target (100kW)', type: 'bar', data: targetsBar, itemStyle: { color: '#00e676' } }
    ]
  };

  const whrsMW = (data.whrs?.generation_kw || 0) / 1000;
  const totalMW = (data.breakdown?.total_kw || 0) / 1000;
  const gridMW = totalMW * 0.6; // Mock distribution since breakdown doesn't strictly have grid in some APIs
  const cppMW = totalMW - gridMW - whrsMW;

  const donutOption = {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['50%', '70%'],
      data: [
        { value: whrsMW.toFixed(1), name: 'WHRS', itemStyle: { color: '#00e676' } },
        { value: cppMW.toFixed(1), name: 'CPP', itemStyle: { color: '#00d4ff' } },
        { value: gridMW.toFixed(1), name: 'Grid', itemStyle: { color: '#ffa726' } }
      ],
      label: { color: '#fff' }
    }]
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6">
      <div className="flex gap-4 mb-6">
         <div className="bg-[#1a2540] p-4 rounded-lg flex-1 flex items-center justify-between shadow-lg">
            <h1 className="text-xl font-bold flex items-center gap-2"><Zap className="text-[#00e676]" /> ENERGY ANALYTICS</h1>
            <div className="flex gap-4 text-sm font-bold">
               <span className="text-[#00e676]">SEC: {sec.toFixed(1)} kWh/t</span>
               <span className="text-gray-400">TARGET: {targetSec.toFixed(1)}</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
         <div className="bg-[#1a2540] p-4 rounded-lg border-l-4 border-[#00d4ff]">
            <div className="text-xs text-gray-400">Current SEC</div>
            <div className="font-bold text-xl text-[#00d4ff]">{sec.toFixed(1)} <span className="text-sm">kWh/t</span></div>
         </div>
         <div className="bg-[#1a2540] p-4 rounded-lg border-l-4 border-[#00e676]">
            <div className="text-xs text-gray-400">Total Power Demand</div>
            <div className="font-bold text-xl text-[#00e676]">{totalMW.toFixed(2)} <span className="text-sm">MW</span></div>
         </div>
         <div className="bg-[#1a2540] p-4 rounded-lg border-l-4 border-[#ffa726]">
            <div className="text-xs text-gray-400">WHRS Generation</div>
            <div className="font-bold text-xl text-[#ffa726]">{whrsMW.toFixed(2)} <span className="text-sm">MW</span></div>
         </div>
         <div className="bg-[#1a2540] p-4 rounded-lg border-l-4 border-[#ef5350]">
            <div className="text-xs text-gray-400">Deviation Cost (Estimated)</div>
            <div className="font-bold text-xl text-[#ef5350]">₹{data.sec?.energy_cost_today?.toLocaleString() || 0}</div>
         </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-6">
         <div className="col-span-8 bg-[#1a2540] p-4 rounded-lg">
            <h3 className="font-bold mb-4">Plant SEC Trend (Last 24h)</h3>
            <ReactECharts option={lineOption} style={{ height: '300px' }} />
         </div>
         <div className="col-span-4 bg-[#1a2540] p-4 rounded-lg">
            <h3 className="font-bold mb-4">Power Source Mix</h3>
            <ReactECharts option={donutOption} style={{ height: '300px' }} />
         </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
         <div className="col-span-6 bg-[#1a2540] p-4 rounded-lg">
            <h3 className="font-bold mb-4">Department Consumption vs Target</h3>
            <ReactECharts option={barOption} style={{ height: '350px' }} />
         </div>
         <div className="col-span-6 bg-[#1a2540] p-4 rounded-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Lightbulb className="text-[#ffa726]"/> Recommended Optimizations</h3>
            <div className="space-y-4">
               <div className="bg-[#0a0e1a] p-4 border border-[#ef5350]/30 rounded">
                  <div className="font-bold text-[#ef5350]">Cement Mill 1 - Reduce Separator Speed</div>
                  <div className="text-sm text-gray-300 mt-1">Fineness is 150 cm2/g above target. Potential saving: 1.2 kWh/t.</div>
               </div>
               <div className="bg-[#0a0e1a] p-4 border border-[#ffa726]/30 rounded">
                  <div className="font-bold text-[#ffa726]">Kiln - Optimize ID Fan Draft</div>
                  <div className="text-sm text-gray-300 mt-1">Excess O2 detected. Reducing fan speed by 15 RPM saves ~85 kW.</div>
               </div>
               <div className="bg-[#0a0e1a] p-4 border border-[#00d4ff]/30 rounded">
                  <div className="font-bold text-[#00d4ff]">WHRS Boiler Cleaning</div>
                  <div className="text-sm text-gray-300 mt-1">Efficiency dropped by 2%. Soot blowing recommended.</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Energy;
