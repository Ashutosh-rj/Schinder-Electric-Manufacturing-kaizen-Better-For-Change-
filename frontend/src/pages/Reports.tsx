import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('daily');
  
  const paretoOpts = {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      xAxis: { type: 'category', data: ['Mech. Fail', 'Power Trip', 'Belt Snap', 'Process Int.', 'Sensor Fail'], axisLabel: { color: '#aaa', interval: 0 } },
      yAxis: [
          { type: 'value', name: 'Minutes', axisLabel: { color: '#aaa' }, splitLine: { lineStyle: { color: '#333' } } },
          { type: 'value', name: '%', min: 0, max: 100, axisLabel: { color: '#aaa' }, splitLine: { show: false } }
      ],
      series: [
          { name: 'Duration', type: 'bar', data: [120, 45, 30, 20, 10], itemStyle: { color: '#ef5350' } },
          { name: 'Cumulative %', type: 'line', yAxisIndex: 1, data: [53, 73, 86, 95, 100], itemStyle: { color: '#00d4ff' } }
      ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FileText /> Reports & Analytics</h1>
        <div className="flex gap-2">
          <input type="date" className="bg-[#1a2540] border border-gray-800 text-white rounded px-3 py-1 text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
          <button className="bg-[#00d4ff] text-[#0a0e1a] px-3 py-1 rounded text-sm font-bold flex items-center gap-1"><Download size={16}/> PDF</button>
        </div>
      </div>
      
      <div className="flex border-b border-gray-800">
        {['Daily Report', 'Shift Report', 'Downtime Analysis', 'Monthly Summary'].map((tab, i) => {
            const id = tab.split(' ')[0].toLowerCase();
            return (
              <button key={tab} onClick={() => setActiveTab(id)} className={`px-4 py-3 text-sm font-medium ${activeTab===id ? 'text-[#00d4ff] border-b-2 border-[#00d4ff]' : 'text-gray-400 hover:text-white'}`}>
                {tab}
              </button>
            )
        })}
      </div>

      {activeTab === 'daily' && (
      <div className="bg-[#1a2540] rounded-lg border border-gray-800 p-6">
        <div className="text-center mb-6 border-b border-gray-800 pb-4">
          <h2 className="text-xl font-bold">KAIZEN CEMENT PLANT</h2>
          <h3 className="text-lg text-gray-400">Daily Production & Performance Report</h3>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-[#00d4ff] mb-3 border-b border-gray-800 pb-1">Production Summary (Tons)</h4>
            <table className="w-full text-sm text-left text-gray-300">
              <tbody>
                <tr className="border-b border-gray-800"><td className="py-2">Clinker</td><td className="py-2 text-right">6,845</td><td className="py-2 text-right text-gray-500">Target: 7,000</td></tr>
                <tr className="border-b border-gray-800"><td className="py-2">Cement</td><td className="py-2 text-right">8,120</td><td className="py-2 text-right text-gray-500">Target: 8,000</td></tr>
                <tr><td className="py-2">Raw Meal</td><td className="py-2 text-right">10,540</td><td className="py-2 text-right text-gray-500">Target: 11,000</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <h4 className="font-bold text-[#00e676] mb-3 border-b border-gray-800 pb-1">Energy KPI</h4>
            <table className="w-full text-sm text-left text-gray-300">
              <tbody>
                <tr className="border-b border-gray-800"><td className="py-2">Heat Cons. (kcal/kg)</td><td className="py-2 text-right">745</td><td className="py-2 text-right text-gray-500">Target: 735</td></tr>
                <tr className="border-b border-gray-800"><td className="py-2">Clinker SEC (kWh/t)</td><td className="py-2 text-right">64.2</td><td className="py-2 text-right text-gray-500">Target: 62.0</td></tr>
                <tr><td className="py-2">Cement SEC (kWh/t)</td><td className="py-2 text-right">32.5</td><td className="py-2 text-right text-gray-500">Target: 33.0</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <h4 className="font-bold text-[#ffa726] mb-3 border-b border-gray-800 pb-1">Quality</h4>
            <table className="w-full text-sm text-left text-gray-300">
              <tbody>
                <tr className="border-b border-gray-800"><td className="py-2">Free Lime avg</td><td className="py-2 text-right">0.8%</td></tr>
                <tr className="border-b border-gray-800"><td className="py-2">Blaine avg</td><td className="py-2 text-right">3200</td></tr>
                <tr><td className="py-2">LSF avg</td><td className="py-2 text-right">98.5</td></tr>
              </tbody>
            </table>
          </div>
          <div>
             <h4 className="font-bold text-[#ef5350] mb-3 border-b border-gray-800 pb-1">Availability & Downtime</h4>
             <table className="w-full text-sm text-left text-gray-300">
              <tbody>
                <tr className="border-b border-gray-800"><td className="py-2">Kiln Run Factor</td><td className="py-2 text-right text-[#00e676]">98.5%</td></tr>
                <tr className="border-b border-gray-800"><td className="py-2">Total Downtime</td><td className="py-2 text-right text-[#ef5350]">22 mins</td></tr>
                <tr><td className="py-2">Top Cause</td><td className="py-2 text-right">Sensor Trip (CM1)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}
      
      {activeTab === 'downtime' && (
          <div className="bg-[#1a2540] rounded-lg border border-gray-800 p-6">
              <h3 className="font-bold mb-4">Downtime Pareto Analysis</h3>
              <ReactECharts option={paretoOpts} style={{ height: '400px' }} />
          </div>
      )}
    </div>
  );
};
export default Reports;
