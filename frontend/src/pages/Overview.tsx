import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Activity, AlertTriangle, CheckCircle, Zap, Factory, BarChart3, TrendingUp, Settings, Wind } from 'lucide-react';

const Overview: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const gaugeOption = {
    series: [
      {
        type: 'gauge',
        progress: { show: true, width: 18, itemStyle: { color: '#00d4ff' } },
        axisLine: { lineStyle: { width: 18 } },
        axisTick: { show: false },
        splitLine: { length: 15, lineStyle: { width: 2, color: '#999' } },
        axisLabel: { distance: 25, color: '#999', fontSize: 12 },
        anchor: { show: true, showAbove: true, size: 24, itemStyle: { borderWidth: 10 } },
        title: { show: false },
        detail: { valueAnimation: true, fontSize: 30, offsetCenter: [0, '70%'], color: '#fff', formatter: '{value} TPH' },
        data: [{ value: 285.3, name: 'Clinker' }]
      }
    ]
  };

  const pieOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Energy',
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 10, borderColor: '#1a2540', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: 18.5, name: 'Raw Mill', itemStyle: { color: '#00d4ff' } },
          { value: 4.2, name: 'Coal Mill', itemStyle: { color: '#00e676' } },
          { value: 28.3, name: 'Pyro', itemStyle: { color: '#ffa726' } },
          { value: 38.5, name: 'Cement Mill', itemStyle: { color: '#ef5350' } }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 relative font-sans">
      <div className="absolute top-2 right-2 text-[#ffa726] border border-[#ffa726] px-2 py-1 text-xs rounded opacity-70 z-50">
        [SIMULATED DATA]
      </div>

      {/* Header Row */}
      <div className="flex justify-between items-center bg-[#1a2540] p-4 rounded-lg mb-6 shadow-lg">
        <h1 className="text-xl font-bold tracking-wider">COMMAND CENTER | KAIZEN INTELLIGENCE PLATFORM</h1>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">PLANT STATUS:</span>
            <span className="bg-[#ffa726] text-black px-3 py-1 rounded font-bold text-sm flex items-center gap-1">
              <AlertTriangle size={16} /> ATTENTION
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">KAIZEN SCORE:</span>
            <span className="text-[#00e676] font-bold text-xl">84/100</span>
          </div>
          <div className="text-[#00d4ff] font-mono text-xl">{time}</div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {[
          { label: 'Clinker Prod', value: '285.3', unit: 'TPH', icon: Factory, color: '#00d4ff' },
          { label: 'Cement Prod', value: '312.5', unit: 'TPH', icon: Factory, color: '#00e676' },
          { label: 'Total Power', value: '18.4', unit: 'MW', icon: Zap, color: '#ffa726' },
          { label: 'SEC', value: '64.2', unit: 'kWh/t', icon: BarChart3, color: '#00d4ff' },
          { label: 'WHRS', value: '4.2', unit: 'MW', icon: Activity, color: '#00e676' },
          { label: 'Active Alarms', value: '21', unit: '', icon: AlertTriangle, color: '#ef5350' }
        ].map((kpi, i) => (
          <div key={i} className="bg-[#1a2540] p-4 rounded-lg border-l-4" style={{ borderColor: kpi.color }}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-gray-400 text-xs uppercase">{kpi.label}</span>
              <kpi.icon size={16} style={{ color: kpi.color }} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{kpi.value}</span>
              <span className="text-sm text-gray-500">{kpi.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Animated Process Flow */}
        <div className="col-span-8 bg-[#1a2540] p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Settings size={18} /> Plant Process Flow</h2>
          <div className="flex items-center justify-between overflow-x-auto pb-4 pt-2">
            {[
              { name: 'Mine', status: '#00e676', val: '500 TPH', health: 95 },
              { name: 'Crusher', status: '#00e676', val: '450 TPH', health: 92 },
              { name: 'Raw Mill', status: '#ffa726', val: '285 TPH', health: 78 },
              { name: 'Kiln', status: '#00e676', val: '285 TPH', health: 88 },
              { name: 'Cooler', status: '#00e676', val: '285 TPH', health: 90 },
              { name: 'Cement Mill', status: '#ef5350', val: '312 TPH', health: 65 },
              { name: 'Packing', status: '#00e676', val: '310 TPH', health: 98 }
            ].map((node, i, arr) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center bg-[#0a0e1a] p-3 rounded border border-gray-700 min-w-[100px]">
                  <div className="w-3 h-3 rounded-full mb-2 shadow-[0_0_8px] animate-pulse" style={{ backgroundColor: node.status, color: node.status }}></div>
                  <span className="text-xs font-bold whitespace-nowrap">{node.name}</span>
                  <span className="text-[10px] text-gray-400 mt-1">{node.val}</span>
                  <div className="w-full bg-gray-800 h-1 mt-2 rounded">
                    <div className="h-full rounded" style={{ width: `${node.health}%`, backgroundColor: node.status }}></div>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex-1 flex items-center justify-center min-w-[30px] px-2 text-gray-500 overflow-hidden">
                    <span className="animate-[pulse_1s_infinite] text-xl">→</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Alerts & Insights */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="bg-[#1a2540] p-4 rounded-lg flex-1">
            <h2 className="text-lg font-bold mb-3 text-[#ef5350] flex items-center gap-2"><AlertTriangle size={18} /> Critical Alerts</h2>
            <div className="space-y-3">
              <div className="bg-[#0a0e1a] p-2 rounded border border-[#ef5350] flex justify-between items-center">
                <span className="text-sm">CM1 Motor Temp High</span>
                <span className="bg-[#ef5350] text-xs px-2 py-0.5 rounded">P1</span>
              </div>
              <div className="bg-[#0a0e1a] p-2 rounded border border-[#ffa726] flex justify-between items-center">
                <span className="text-sm">Raw Mill DP Limit</span>
                <span className="bg-[#ffa726] text-xs px-2 py-0.5 rounded text-black">P2</span>
              </div>
              <div className="bg-[#0a0e1a] p-2 rounded border border-[#ffa726] flex justify-between items-center">
                <span className="text-sm">Kiln CO Elevated</span>
                <span className="bg-[#ffa726] text-xs px-2 py-0.5 rounded text-black">P2</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dept Grid & Charts */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-8 bg-[#1a2540] p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Department Status</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { name: 'Mine', status: 'NORMAL', prod: '500', pwr: '1.2', hlt: 95, al: 0 },
              { name: 'Raw Mill', status: 'ATTENTION', prod: '285.3', pwr: '3.2', hlt: 78, al: 4 },
              { name: 'Coal Mill', status: 'NORMAL', prod: '25.5', pwr: '0.8', hlt: 92, al: 0 },
              { name: 'Pyroprocessing', status: 'NORMAL', prod: '285', pwr: '4.5', hlt: 88, al: 2 },
              { name: 'Clinker Cooler', status: 'NORMAL', prod: '285', pwr: '1.5', hlt: 90, al: 1 },
              { name: 'Cement Mill', status: 'CRITICAL', prod: '312.5', pwr: '2.8', hlt: 65, al: 8 },
              { name: 'WHRS', status: 'NORMAL', prod: '4.2', pwr: '-', hlt: 96, al: 0 },
              { name: 'CPP', status: 'NORMAL', prod: '8.5', pwr: '-', hlt: 94, al: 0 }
            ].map((d, i) => (
              <div key={i} className="bg-[#0a0e1a] p-3 rounded border border-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">{d.name}</span>
                  <div className={`w-2 h-2 rounded-full ${d.status==='NORMAL'?'bg-[#00e676]':d.status==='ATTENTION'?'bg-[#ffa726]':'bg-[#ef5350]'}`}></div>
                </div>
                <div className="text-xs text-gray-400 flex justify-between"><span>Prod:</span> <span>{d.prod}</span></div>
                <div className="text-xs text-gray-400 flex justify-between"><span>Pwr:</span> <span>{d.pwr} MW</span></div>
                <div className="mt-2 w-full bg-gray-800 h-1 rounded"><div className={`h-full rounded ${d.hlt>80?'bg-[#00e676]':d.hlt>70?'bg-[#ffa726]':'bg-[#ef5350]'}`} style={{width:`${d.hlt}%`}}></div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 bg-[#1a2540] p-4 rounded-lg flex flex-col">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2"><TrendingUp size={18}/> AI Insights</h2>
          <div className="space-y-2 mb-4">
            <div className="bg-[#0a0e1a] p-3 rounded border-l-2 border-[#00d4ff]">
              <div className="text-sm font-bold">Optimize CM1 Fan Speed</div>
              <div className="text-xs text-[#00e676]">Saving: ₹12,500/day</div>
            </div>
            <div className="bg-[#0a0e1a] p-3 rounded border-l-2 border-[#00d4ff]">
              <div className="text-sm font-bold">Reduce Cooler False Air</div>
              <div className="text-xs text-[#00e676]">Saving: ₹8,200/day</div>
            </div>
            <div className="bg-[#0a0e1a] p-3 rounded border-l-2 border-[#00d4ff]">
              <div className="text-sm font-bold">Raw Mill Feed Stability</div>
              <div className="text-xs text-[#00e676]">Yield: +2.5 TPH</div>
            </div>
          </div>
          <div className="flex gap-2 flex-1">
             <div className="flex-1 bg-[#0a0e1a] rounded p-2">
                <div className="text-xs text-center text-gray-400">Prod vs Target</div>
                <ReactECharts option={gaugeOption} style={{ height: '120px' }} />
             </div>
             <div className="flex-1 bg-[#0a0e1a] rounded p-2">
                <div className="text-xs text-center text-gray-400">Energy Breakdown</div>
                <ReactECharts option={pieOption} style={{ height: '120px' }} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
