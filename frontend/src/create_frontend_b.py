import os

base_dir = r"d:\Hackthaon\Scnider\Kaizen Changer for Better\kaizen\frontend\src"

files = {
    r"components\layout\Layout.tsx": """import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Factory, Activity, Zap, Wind, Stethoscope, Clock, Bell, 
  Sparkles, Lightbulb, Settings, Sliders, Battery, 
  FileText, Shield, Menu, ChevronLeft, LogOut, Power
} from 'lucide-react';

const navGroups = [
  {
    title: "🏭 PLANT OVERVIEW",
    items: [
      { to: "/overview", icon: <Factory size={18} />, label: "Command Center" },
      { to: "/digital-twin", icon: <Activity size={18} />, label: "Plant Digital Twin" },
    ]
  },
  {
    title: "📊 PROCESS INTELLIGENCE",
    items: [
      { to: "/process", icon: <Activity size={18} />, label: "Process Analysis" },
      { to: "/energy", icon: <Zap size={18} />, label: "Energy Management" },
      { to: "/emissions", icon: <Wind size={18} />, label: "Emissions & Environment" },
    ]
  },
  {
    title: "⚙️ EQUIPMENT",
    items: [
      { to: "/equipment-health", icon: <Stethoscope size={18} />, label: "Equipment Health" },
      { to: "/predictive-maintenance", icon: <Clock size={18} />, label: "Predictive Maintenance" },
    ]
  },
  {
    title: "🔔 ALARMS & EVENTS",
    items: [
      { to: "/alarms", icon: <Bell size={18} />, label: "Alarm Management" },
    ]
  },
  {
    title: "🤖 INTELLIGENCE",
    items: [
      { to: "/copilot", icon: <Sparkles size={18} className="text-[#00d4ff]" />, label: "Kaizen Copilot AI" },
      { to: "/kaizen", icon: <Lightbulb size={18} />, label: "Kaizen Opportunities" },
      { to: "/optimization", icon: <Settings size={18} />, label: "Optimization" },
      { to: "/what-if", icon: <Sliders size={18} />, label: "What-If Simulator" },
    ]
  },
  {
    title: "⚡ POWER",
    items: [
      { to: "/whrs", icon: <Battery size={18} />, label: "WHRS" },
      { to: "/captive-power", icon: <Power size={18} />, label: "Captive Power" },
    ]
  },
  {
    title: "📋 REPORTS",
    items: [
      { to: "/reports", icon: <FileText size={18} />, label: "Reports & Analytics" },
    ]
  },
  {
    title: "🔧 ADMIN",
    items: [
      { to: "/admin", icon: <Shield size={18} />, label: "Administration" },
    ]
  }
];

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0e1a] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className={`${collapsed ? 'w-16' : 'w-64'} bg-[#1a2540] flex flex-col transition-all duration-300 border-r border-gray-800`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {!collapsed && <span className="font-bold text-lg text-[#00d4ff] tracking-wider">KAIZEN Platform</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-white">
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-6">
          {navGroups.map((group, i) => (
            <div key={i} className="px-3">
              {!collapsed && <div className="text-xs font-semibold text-gray-500 mb-2 px-3">{group.title}</div>}
              <div className="space-y-1">
                {group.items.map((item, j) => (
                  <NavLink
                    key={j}
                    to={item.to}
                    className={({isActive}) => `flex items-center px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                    title={collapsed ? item.label : ''}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && <span className="ml-3 text-sm truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-[#1a2540] flex items-center justify-between px-6 border-b border-gray-800 z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00e676] animate-pulse"></div>
              <span className="text-sm text-gray-300">LIVE</span>
            </div>
            <span className="text-sm font-mono text-gray-400">|</span>
            <span className="text-sm font-mono">{time.toLocaleTimeString()}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-2 py-1 bg-[#ffa726]/20 text-[#ffa726] text-xs font-bold rounded border border-[#ffa726]/50">
              [SIMULATION MODE]
            </div>
            <div className="relative cursor-pointer" onClick={() => navigate('/alarms')}>
              <Bell size={20} className="text-gray-300" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef5350] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ef5350] text-[10px] items-center justify-center font-bold">3</span>
              </span>
            </div>
            <div className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 border border-gray-700">
              Process Engineer
            </div>
            <button className="text-gray-400 hover:text-white">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#0a0e1a] p-6 relative">
          <div className="absolute top-4 right-4 pointer-events-none opacity-20 z-50">
            <span className="text-4xl font-black text-white transform rotate-12 inline-block">[SIMULATED DATA]</span>
          </div>
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="h-8 flex items-center justify-center bg-[#1a2540] text-[10px] text-gray-500 border-t border-gray-800">
          KAIZEN — Change for Better | Cement Plant Intelligence Platform | ⚠️ Advisory System Only — Safety systems remain in full authority
        </footer>
      </div>
    </div>
  );
};

export default Layout;
""",
    r"pages\EquipmentHealth.tsx": """import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const mockEquipments = [
  { id: 'KLN-901', name: 'Kiln Drive', area: 'Pyro', health: 88, status: 'Normal', risk: 'Vibration normal', last: '2 days ago', next: '28 days' },
  { id: 'VRM-501', name: 'Raw Mill', area: 'Raw Grinding', health: 84, status: 'Normal', risk: 'Diff pressure slight inc', last: '5 days ago', next: '14 days' },
  { id: 'CM-1201', name: 'Cement Mill 1', area: 'Cement Grinding', health: 79, status: 'Warning', risk: 'Temp elevated', last: '1 day ago', next: '10 days' },
  { id: 'CF-1003', name: 'Cooler Fan 3', area: 'Pyro', health: 62, status: 'High Risk', risk: 'Bearing Temp rising 15°C', last: '7 days ago', next: 'Immediate' },
  { id: 'FAN-1201', name: 'CM Fan 1', area: 'Cement Grinding', health: 68, status: 'Degrading', risk: 'Vibration 5.8 mm/s', last: '3 days ago', next: '3 days' },
  { id: 'SEP-501', name: 'RM Separator', area: 'Raw Grinding', health: 82, status: 'Normal', risk: 'Normal wear', last: '14 days ago', next: '45 days' },
  { id: 'CR-401', name: 'Crusher', area: 'Crushing', health: 91, status: 'Normal', risk: 'None', last: '1 day ago', next: '30 days' },
];

const EquipmentHealth = () => {
  const [selectedEq, setSelectedEq] = useState(mockEquipments[3]);

  const radarOptions = {
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
          value: [40, 30, 80, 90, 60],
          name: 'Health Score',
          itemStyle: { color: '#ef5350' },
          areaStyle: { opacity: 0.3 }
        }
      ]
    }],
    backgroundColor: 'transparent'
  };

  const getHealthColor = (score: number) => score >= 80 ? 'text-[#00e676]' : score >= 65 ? 'text-[#ffa726]' : 'text-[#ef5350]';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Equipment Health</h1>
        <div className="px-3 py-1 bg-[#1a2540] rounded border border-gray-700 text-sm">
          Fleet Health: <span className="font-bold text-[#00e676]">88.5/100</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Normal', count: 42, color: 'text-[#00e676]' },
          { label: 'Warning', count: 8, color: 'text-[#ffa726]' },
          { label: 'Degrading', count: 4, color: 'text-[#ffa726]' },
          { label: 'High Risk', count: 2, color: 'text-[#ef5350]' },
          { label: 'Critical', count: 1, color: 'text-[#ef5350]' },
        ].map(s => (
          <div key={s.label} className="bg-[#1a2540] p-4 rounded-lg border border-gray-800 text-center">
            <div className="text-gray-400 text-sm">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#1a2540] rounded-lg border border-gray-800 p-4">
          <h2 className="text-lg font-bold mb-4">Equipment List</h2>
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
              <tr>
                <th className="px-4 py-2">Code</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Health</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Top Risk</th>
              </tr>
            </thead>
            <tbody>
              {mockEquipments.map(eq => (
                <tr key={eq.id} onClick={() => setSelectedEq(eq)} className={`border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 ${selectedEq.id === eq.id ? 'bg-gray-800/80' : ''}`}>
                  <td className="px-4 py-3 font-medium">{eq.id}</td>
                  <td className="px-4 py-3">{eq.name}</td>
                  <td className={`px-4 py-3 font-bold ${getHealthColor(eq.health)}`}>{eq.health}</td>
                  <td className="px-4 py-3">{eq.status}</td>
                  <td className="px-4 py-3 text-gray-400 truncate max-w-[150px]">{eq.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-1 bg-[#1a2540] rounded-lg border border-gray-800 p-4 flex flex-col">
          <h2 className="text-lg font-bold mb-2">{selectedEq.name} Details</h2>
          <div className="text-sm text-gray-400 mb-4">{selectedEq.id} | {selectedEq.area}</div>
          
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="text-xs text-gray-500">Overall Health</div>
              <div className={`text-4xl font-bold ${getHealthColor(selectedEq.health)}`}>{selectedEq.health}/100</div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-bold ${selectedEq.health < 65 ? 'bg-[#ef5350]/20 text-[#ef5350]' : 'bg-[#00e676]/20 text-[#00e676]'}`}>
              {selectedEq.status.toUpperCase()}
            </div>
          </div>

          <div className="h-48">
            <ReactECharts option={radarOptions} style={{ height: '100%', width: '100%' }} />
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-800 pb-1">
              <span className="text-gray-400">Top Concern</span>
              <span className="text-[#ef5350]">{selectedEq.risk}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-1">
              <span className="text-gray-400">Last Inspection</span>
              <span>{selectedEq.last}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-1">
              <span className="text-gray-400">Next Maint.</span>
              <span>{selectedEq.next}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EquipmentHealth;
""",
    r"pages\PredictiveMaintenance.tsx": """import React from 'react';
import ReactECharts from 'echarts-for-react';
import { AlertTriangle, Clock, Activity, Calendar } from 'lucide-react';

const PredictiveMaintenance = () => {
  const riskTimelineOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: Array.from({length: 30}, (_, i) => `Day ${i+1}`), axisLabel: {color: '#888'} },
    yAxis: { type: 'value', axisLabel: {color: '#888'} },
    series: [
      {
        name: 'Risk Score',
        type: 'line',
        smooth: true,
        data: Array.from({length: 30}, (_, i) => 20 + i * 2.5 + Math.random() * 5),
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: '#ef5350' }, { offset: 1, color: 'rgba(239,83,80,0.1)' }]
          }
        },
        itemStyle: { color: '#ef5350' }
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#ffa726]/10 border border-[#ffa726]/30 p-4 rounded-lg flex items-start gap-3">
        <AlertTriangle className="text-[#ffa726] flex-shrink-0" />
        <div>
          <h3 className="text-[#ffa726] font-bold">PREDICTIVE MAINTENANCE ADVISORY</h3>
          <p className="text-sm text-gray-300 mt-1">These are statistical estimates based on sensor trends. Actual failure timing varies significantly. Do not defer planned maintenance based solely on these predictions. All maintenance decisions must be validated by qualified engineers.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#1a2540] rounded-lg border border-gray-800 p-4">
          <h2 className="text-lg font-bold mb-4">Risk Timeline (30 Days) - CF-1003 Cooler Fan 3</h2>
          <ReactECharts option={riskTimelineOpts} style={{ height: '300px' }} />
        </div>
        
        <div className="col-span-1 space-y-4">
          <h2 className="text-lg font-bold">Top At-Risk Equipment</h2>
          
          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-bold">CF-1003 Cooler Fan 3</div>
                <div className="text-xs text-gray-400">Pyro Area</div>
              </div>
              <span className="bg-[#ef5350]/20 text-[#ef5350] text-xs px-2 py-1 rounded font-bold">HIGH RISK</span>
            </div>
            
            <div className="space-y-2 mt-4 text-sm">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Bearing Temp</span><span>85%</span></div>
                <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-[#ef5350] h-1.5 rounded-full" style={{width: '85%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Vibration</span><span>72%</span></div>
                <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-[#ffa726] h-1.5 rounded-full" style={{width: '72%'}}></div></div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 bg-gray-900/50 p-2 rounded">Based on current degradation trend, bearing inspection recommended within 15-21 days.</p>
            
            <button className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 rounded transition-colors">
              Schedule Inspection
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1a2540] rounded-lg border border-gray-800 p-4">
        <h2 className="text-lg font-bold mb-4">MTBF / MTTR Statistics</h2>
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
            <tr>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">MTBF (hours)</th>
              <th className="px-4 py-2">MTTR (hours)</th>
              <th className="px-4 py-2">Availability %</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800"><td className="px-4 py-2">Fans</td><td className="px-4 py-2">2850</td><td className="px-4 py-2">4.2</td><td className="px-4 py-2">99.85</td></tr>
            <tr className="border-b border-gray-800"><td className="px-4 py-2">Motors</td><td className="px-4 py-2">8500</td><td className="px-4 py-2">2.8</td><td className="px-4 py-2">99.97</td></tr>
            <tr className="border-b border-gray-800"><td className="px-4 py-2">Pumps</td><td className="px-4 py-2">4200</td><td className="px-4 py-2">3.5</td><td className="px-4 py-2">99.91</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PredictiveMaintenance;
""",
    r"pages\KaizenCopilot.tsx": """import React, { useState } from 'react';
import { Send, Sparkles, AlertTriangle, ChevronRight, Activity } from 'lucide-react';

const KaizenCopilot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'user',
      content: 'Why is Raw Mill 1 production below target?'
    },
    {
      role: 'ai',
      content: 'Raw Mill 1 is currently producing 285.3 TPH against a target of 300 TPH (-4.9% deviation). Analysis of the last 2 hours reveals the following findings:\\n\\n**Primary finding:** Mill differential pressure has been trending upward (520→625 mmWC over 90 minutes), indicating increasing circulating load within the grinding circuit.',
      evidence: [
        { param: 'Mill DP', cur: '625 mmWC', norm: '500-750', stat: '⚠️ APPROACHING HIGH' },
        { param: 'Feed Rate', cur: '285 TPH', norm: '290-320', stat: '⬇️ BELOW TARGET' }
      ],
      causes: [
        { text: 'Feed instability / moisture variation', conf: 74 },
        { text: 'Increased circulating load', conf: 68 }
      ],
      recs: [
        'Stabilize feed rate — reduce variation, target ±5 TPH',
        'Monitor mill outlet temperature — verify drying capacity'
      ]
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if(!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'This is a simulated AI response. The integration with the backend copilot engine is pending.',
        evidence: [], causes: [], recs: []
      }]);
    }, 1000);
  };

  return (
    <div className="flex h-full gap-4">
      {/* Chat Area */}
      <div className="w-3/5 flex flex-col bg-[#1a2540] rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex items-center gap-2">
          <Sparkles className="text-[#00d4ff]" />
          <h2 className="font-bold">Kaizen Copilot</h2>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-4 ${m.role === 'user' ? 'bg-[#00d4ff]/10 text-white border border-[#00d4ff]/20' : 'bg-gray-800/50 text-gray-200 border border-gray-700'}`}>
                {m.role === 'ai' && <div className="font-bold text-[#00d4ff] mb-2 flex items-center gap-2"><Sparkles size={16}/> Kaizen AI</div>}
                <div className="whitespace-pre-wrap text-sm">{m.content}</div>
                
                {m.causes && m.causes.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm font-bold text-gray-400">Probable Causes:</div>
                    {m.causes.map((c, j) => (
                      <div key={j} className="text-sm">
                        <div className="flex justify-between text-xs mb-1 text-gray-300"><span>{j+1}. {c.text}</span><span>{c.conf}%</span></div>
                        <div className="w-full bg-gray-900 rounded-full h-1"><div className="bg-[#00d4ff] h-1 rounded-full" style={{width: `${c.conf}%`}}></div></div>
                      </div>
                    ))}
                  </div>
                )}
                
                {m.recs && m.recs.length > 0 && (
                  <div className="mt-4 bg-[#ffa726]/10 border border-[#ffa726]/30 p-3 rounded">
                    <div className="text-xs font-bold text-[#ffa726] mb-2 flex items-center gap-1"><AlertTriangle size={12}/> ADVISORY RECOMMENDATIONS</div>
                    <ul className="text-sm list-disc pl-4 text-gray-300 space-y-1">
                      {m.recs.map((r, j) => <li key={j}>{r}</li>)}
                    </ul>
                  </div>
                )}
                {m.role === 'ai' && <div className="text-[10px] text-gray-500 mt-3 text-right">*Data source: sensor_readings | [SIMULATED DATA]</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-900/50 border-t border-gray-800">
          <div className="flex gap-2 mb-2 overflow-x-auto custom-scrollbar pb-2">
            {["Why is Raw Mill production low?", "Top energy saving opportunities", "Which equipment may fail?"].map(q => (
              <button key={q} onClick={() => setInput(q)} className="whitespace-nowrap px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 rounded-full border border-gray-700 transition-colors">
                {q}
              </button>
            ))}
          </div>
          <div className="relative">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask Copilot..." 
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:border-[#00d4ff]"
            />
            <button onClick={handleSend} className="absolute right-2 top-2 p-1 text-gray-400 hover:text-[#00d4ff]">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Panel */}
      <div className="w-2/5 bg-[#1a2540] rounded-lg border border-gray-800 p-4 flex flex-col">
        <h3 className="font-bold border-b border-gray-800 pb-2 mb-4 flex items-center gap-2"><Activity size={18}/> Context & Evidence</h3>
        <div className="text-xs text-gray-400 mb-4 bg-gray-800 p-2 rounded">Analyzing last 2 hours of data</div>
        
        {messages[messages.length-1]?.evidence?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="text-gray-500 bg-gray-800/50">
                <tr><th className="p-2">Parameter</th><th className="p-2">Current</th><th className="p-2">Normal</th><th className="p-2">Status</th></tr>
              </thead>
              <tbody>
                {messages[messages.length-1].evidence.map((e, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="p-2">{e.param}</td><td className="p-2 font-mono">{e.cur}</td><td className="p-2 text-gray-500">{e.norm}</td><td className="p-2">{e.stat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center py-8">Ask a question to see related evidence.</div>
        )}
      </div>
    </div>
  );
};
export default KaizenCopilot;
""",
    r"pages\Optimization.tsx": """import React from 'react';
import { AlertTriangle, TrendingUp, Settings, CheckCircle } from 'lucide-react';

const Optimization = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#ffa726]/10 border border-[#ffa726]/30 p-4 rounded-lg flex items-start gap-3">
        <AlertTriangle className="text-[#ffa726] flex-shrink-0" />
        <div>
          <h3 className="text-[#ffa726] font-bold">⚠️ OPTIMIZATION ADVISORY MODE</h3>
          <p className="text-sm text-gray-300 mt-1">All recommendations require human review and approval before implementation. Existing DCS/PLC safety logic remains in full authority.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Settings size={18}/> Objective Function</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-800/50 p-3 rounded border border-[#00e676]/30">
              <div className="text-[#00e676] font-bold mb-2">MAXIMIZE</div>
              <ul className="text-gray-300 space-y-1"><li>• Clinker Production</li><li>• Cement Quality</li></ul>
            </div>
            <div className="bg-gray-800/50 p-3 rounded border border-[#00d4ff]/30">
              <div className="text-[#00d4ff] font-bold mb-2">MINIMIZE</div>
              <ul className="text-gray-300 space-y-1"><li>• Heat Consumption</li><li>• Electrical Energy</li><li>• CO2 Emissions</li></ul>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18}/> Expected Benefits</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <span className="text-gray-400">Energy Savings</span>
              <span className="text-lg font-bold text-[#00e676]">2,450 kWh/day</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <span className="text-gray-400">Cost Reduction</span>
              <span className="text-lg font-bold text-[#00e676]">₹ 18,500/day</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">CO2 Reduction</span>
              <span className="text-lg font-bold text-[#00d4ff]">4.2 t/day</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a2540] rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-lg font-bold">Current vs Optimized</h2>
          <button className="bg-[#00d4ff] hover:bg-[#00b4d8] text-[#0a0e1a] px-4 py-2 rounded text-sm font-bold transition-colors">
            Run Optimization
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
            <tr>
              <th className="px-4 py-3">Parameter</th>
              <th className="px-4 py-3">Current</th>
              <th className="px-4 py-3">Optimized</th>
              <th className="px-4 py-3">Delta</th>
              <th className="px-4 py-3">Unit</th>
            </tr>
          </thead>
          <tbody>
            {[
              { p: 'Clinker Production', c: '285.3', o: '298.5', d: '+13.2', u: 'TPH', good: true },
              { p: 'Heat Consumption', c: '745.2', o: '728.5', d: '-16.7', u: 'kcal/kg', good: true },
              { p: 'SEC Clinker', c: '64.2', o: '61.8', d: '-2.4', u: 'kWh/t', good: true },
              { p: 'Primary Air', c: '12.5', o: '11.8', d: '-0.7', u: '%', good: true }
            ].map(r => (
              <tr key={r.p} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="px-4 py-3 font-medium">{r.p}</td>
                <td className="px-4 py-3 font-mono">{r.c}</td>
                <td className="px-4 py-3 font-mono text-white">{r.o}</td>
                <td className={`px-4 py-3 font-bold ${r.good ? 'text-[#00e676]' : 'text-[#ef5350]'}`}>{r.d}</td>
                <td className="px-4 py-3 text-gray-500">{r.u}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Optimization;
""",
    r"pages\WhatIfSimulator.tsx": """import React, { useState } from 'react';
import { Sliders, Activity, Save } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const WhatIfSimulator = () => {
  const [feed, setFeed] = useState(285);
  const [speed, setSpeed] = useState(3.2);

  const barOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { textStyle: { color: '#fff' } },
    xAxis: { type: 'category', data: ['Production', 'Heat', 'Power', 'CO2'], axisLabel: { color: '#aaa' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#aaa' } },
    series: [
      { name: 'Baseline', type: 'bar', data: [100, 100, 100, 100], itemStyle: { color: '#3b82f6' } },
      { name: 'Simulated', type: 'bar', data: [104.6, 98.3, 97.8, 98.3], itemStyle: { color: '#00d4ff' } }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#00d4ff]/10 border border-[#00d4ff]/30 p-4 rounded-lg flex items-start gap-3">
        <Sliders className="text-[#00d4ff] flex-shrink-0" />
        <div>
          <h3 className="text-[#00d4ff] font-bold">🔬 SIMULATION MODE</h3>
          <p className="text-sm text-gray-300 mt-1">Changes here do NOT affect actual plant controls. This is a mathematical model for advisory purposes only.</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Controls */}
        <div className="w-1/3 space-y-4">
          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-4">Scenario Parameters</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">Kiln Feed Rate (TPH)</span><span className="font-mono text-[#00d4ff]">{feed}</span></div>
                <input type="range" min="250" max="350" value={feed} onChange={(e) => setFeed(Number(e.target.value))} className="w-full accent-[#00d4ff]" />
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>250</span><span>Baseline: 285</span><span>350</span></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">Kiln Speed (RPM)</span><span className="font-mono text-[#00d4ff]">{speed}</span></div>
                <input type="range" min="2.5" max="4.0" step="0.1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-[#00d4ff]" />
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>2.5</span><span>Baseline: 3.2</span><span>4.0</span></div>
              </div>
            </div>
            <button className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 rounded flex items-center justify-center gap-2 transition-colors">
              <Save size={16} /> Save Scenario
            </button>
          </div>
        </div>

        {/* Outcomes */}
        <div className="w-2/3 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
              <div className="text-sm text-gray-400 mb-1">Production</div>
              <div className="text-2xl font-bold">285 <span className="text-sm font-normal text-gray-500">→</span> <span className="text-[#00e676]">298 TPH</span></div>
              <div className="text-xs text-[#00e676] mt-1">+4.6% Improvement</div>
            </div>
            <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
              <div className="text-sm text-gray-400 mb-1">Heat Consumption</div>
              <div className="text-2xl font-bold">745 <span className="text-sm font-normal text-gray-500">→</span> <span className="text-[#00e676]">732 kcal/kg</span></div>
              <div className="text-xs text-[#00e676] mt-1">-1.7% Reduction</div>
            </div>
          </div>
          
          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Activity size={18}/> Relative Comparison (Baseline = 100%)</h3>
            <ReactECharts option={barOpts} style={{ height: '250px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default WhatIfSimulator;
""",
    r"pages\WHRS.tsx": """import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Battery, Flame, Zap } from 'lucide-react';

const WHRS = () => {
  const lineOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['00:00','04:00','08:00','12:00','16:00','20:00'], axisLabel: { color: '#aaa' } },
    yAxis: { type: 'value', name: 'MW', splitLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#aaa' } },
    series: [
      { name: 'Generation', type: 'line', data: [3.8, 3.9, 4.1, 4.2, 4.1, 4.2], itemStyle: { color: '#00e676' }, smooth: true, areaStyle: { opacity: 0.1 } },
      { name: 'Target', type: 'line', data: [5.5, 5.5, 5.5, 5.5, 5.5, 5.5], itemStyle: { color: '#aaa' }, lineStyle: { type: 'dashed' } }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: 'Generation', v: '4.2 MW', c: 'text-[#00e676]' },
          { l: 'Efficiency', v: '78.5%', c: 'text-white' },
          { l: 'Target', v: '5.5 MW', c: 'text-gray-400' },
          { l: 'Deviation', v: '-1.3 MW', c: 'text-[#ef5350]' },
        ].map(k => (
          <div key={k.l} className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">{k.l}</div>
            <div className={`text-2xl font-bold ${k.c}`}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Zap size={18}/> 24h Generation Trend</h3>
          <ReactECharts option={lineOpts} style={{ height: '300px' }} />
        </div>
        
        <div className="col-span-1 space-y-4">
          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Flame size={18} className="text-[#ffa726]"/> AQC Boiler</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Inlet Temp</span><span>320 °C</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Outlet Temp</span><span>110 °C</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Steam Flow</span><span>12.5 TPH</span></div>
            </div>
          </div>
          
          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-3 text-[#ef5350]">Lost Generation Analysis</h3>
            <p className="text-sm text-gray-300">Currently generating 4.2 MW vs maximum achievable 5.5 MW. Lost 1.3 MW due to:</p>
            <ul className="text-sm text-gray-400 list-disc pl-4 mt-2 space-y-1">
              <li>Low cooler exhaust heat (0.8 MW)</li>
              <li>AQC boiler fouling (0.5 MW)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WHRS;
""",
    r"pages\CaptivePower.tsx": """import React from 'react';
import { Power, Activity } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const CaptivePower = () => {
  const pieOpts = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 5, borderColor: '#1a2540', borderWidth: 2 },
        label: { show: true, color: '#fff' },
        data: [
          { value: 8.5, name: 'CPP', itemStyle: { color: '#3b82f6' } },
          { value: 4.2, name: 'WHRS', itemStyle: { color: '#00e676' } },
          { value: 5.7, name: 'Grid', itemStyle: { color: '#ffa726' } }
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800 text-center flex justify-between items-center px-10">
        <div><div className="text-gray-400 text-sm">CPP Gen</div><div className="text-2xl font-bold text-[#3b82f6]">8.5 MW</div></div>
        <div className="text-xl text-gray-600">+</div>
        <div><div className="text-gray-400 text-sm">WHRS Gen</div><div className="text-2xl font-bold text-[#00e676]">4.2 MW</div></div>
        <div className="text-xl text-gray-600">+</div>
        <div><div className="text-gray-400 text-sm">Grid Import</div><div className="text-2xl font-bold text-[#ffa726]">5.7 MW</div></div>
        <div className="text-xl text-gray-600">=</div>
        <div><div className="text-gray-400 text-sm">Total Load</div><div className="text-2xl font-bold">18.4 MW</div></div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Power size={18}/> Power Source Balance</h3>
          <ReactECharts option={pieOpts} style={{ height: '300px' }} />
        </div>
        
        <div className="space-y-4">
          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-3">Power Factor</h3>
            <div className="flex justify-between items-center">
              <div className="text-4xl font-bold text-[#00d4ff]">0.92</div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Target: 0.95</div>
                <div className="text-xs text-[#ffa726] mt-1">Penalty risk if < 0.90</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-3">Boiler Parameters</h3>
            <table className="w-full text-sm text-left text-gray-300">
              <tbody>
                <tr className="border-b border-gray-800"><td className="py-2">Steam Pressure</td><td className="py-2 text-right font-mono">65 ata</td></tr>
                <tr className="border-b border-gray-800"><td className="py-2">Steam Temp</td><td className="py-2 text-right font-mono">485 °C</td></tr>
                <tr><td className="py-2">Boiler Efficiency</td><td className="py-2 text-right font-mono text-[#00e676]">82.4 %</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CaptivePower;
""",
    r"pages\Emissions.tsx": """import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Wind, Leaf } from 'lucide-react';

const Emissions = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: 'CO2 Intensity', v: '820', u: 'kg/t', target: '800' },
          { l: 'NOx', v: '850', u: 'mg/Nm³', target: '1200' },
          { l: 'SO2', v: '180', u: 'mg/Nm³', target: '600' },
          { l: 'Dust', v: '28', u: 'mg/Nm³', target: '50' },
        ].map(k => (
          <div key={k.l} className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">{k.l}</div>
            <div className="text-2xl font-bold">{k.v} <span className="text-sm text-gray-500 font-normal">{k.u}</span></div>
            <div className="text-xs text-gray-500 mt-2">Limit/Target: {k.target}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Leaf size={18} className="text-[#00e676]"/> CO2 Avoided Today</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">From WHRS</span><span className="font-bold">12.3 t</span></div>
              <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-[#00e676] h-2 rounded-full" style={{width: '70%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">From Efficiency</span><span className="font-bold">4.5 t</span></div>
              <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-[#00d4ff] h-2 rounded-full" style={{width: '30%'}}></div></div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Wind size={18}/> Emission Sources (CO2)</h3>
          <table className="w-full text-sm text-left text-gray-300">
            <tbody>
              <tr className="border-b border-gray-800"><td className="py-3">Process (Calcination)</td><td className="py-3 text-right">520 kg/t</td><td className="py-3 text-right text-gray-500">63%</td></tr>
              <tr className="border-b border-gray-800"><td className="py-3">Fuel (Coal)</td><td className="py-3 text-right">240 kg/t</td><td className="py-3 text-right text-gray-500">29%</td></tr>
              <tr><td className="py-3">Electricity (Grid)</td><td className="py-3 text-right">60 kg/t</td><td className="py-3 text-right text-gray-500">8%</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Emissions;
""",
    r"pages\KaizenOpportunities.tsx": """import React from 'react';
import { Lightbulb, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const opps = [
  { id: 'KAI-001', title: 'Cement Mill 2 Fan Speed Optimization', saving: '185 kWh/day', diff: 'LOW', stat: 'Open' },
  { id: 'KAI-002', title: 'Limestone Crusher Feed Optimization', saving: '320 kWh/day', diff: 'MEDIUM', stat: 'In Progress' },
  { id: 'KAI-003', title: 'Kiln Primary Air Reduction', saving: '420 kWh/day', diff: 'LOW', stat: 'Open' },
  { id: 'KAI-007', title: 'Preheater False Air Sealing', saving: '580 kWh/day', diff: 'HIGH', stat: 'Closed' }
];

const KaizenOpportunities = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800"><div className="text-sm text-gray-400">Total Potential</div><div className="text-2xl font-bold text-[#00e676]">₹48,500/day</div></div>
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800"><div className="text-sm text-gray-400">Open</div><div className="text-2xl font-bold text-[#00d4ff]">14</div></div>
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800"><div className="text-sm text-gray-400">In Progress</div><div className="text-2xl font-bold text-[#ffa726]">3</div></div>
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800"><div className="text-sm text-gray-400">Closed (Verified)</div><div className="text-2xl font-bold">8</div></div>
      </div>

      <div className="bg-[#1a2540] rounded-lg border border-gray-800 p-4">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Lightbulb size={18}/> Top Opportunities</h2>
        <div className="space-y-4">
          {opps.map(o => (
            <div key={o.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
              <div>
                <div className="text-xs text-[#00d4ff] font-mono mb-1">{o.id}</div>
                <div className="font-bold text-white">{o.title}</div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-gray-400">Potential Savings</div>
                  <div className="font-bold text-[#00e676]">{o.saving}</div>
                </div>
                <div className="text-right w-20">
                  <div className="text-xs text-gray-400">Difficulty</div>
                  <div className={`text-xs font-bold px-2 py-1 rounded mt-1 inline-block ${o.diff==='LOW'?'bg-[#00e676]/20 text-[#00e676]':o.diff==='MEDIUM'?'bg-[#ffa726]/20 text-[#ffa726]':'bg-[#ef5350]/20 text-[#ef5350]'}`}>{o.diff}</div>
                </div>
                <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm text-white transition-colors">View PDCA</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default KaizenOpportunities;
""",
    r"pages\Reports.tsx": """import React from 'react';
import { FileText, Download } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FileText /> Reports & Analytics</h1>
        <div className="flex gap-2">
          <input type="date" className="bg-[#1a2540] border border-gray-800 text-white rounded px-3 py-1 text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
          <button className="bg-[#00d4ff] text-[#0a0e1a] px-3 py-1 rounded text-sm font-bold flex items-center gap-1"><Download size={16}/> PDF</button>
        </div>
      </div>

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
        </div>
      </div>
    </div>
  );
};
export default Reports;
""",
    r"pages\Administration.tsx": """import React from 'react';
import { Shield, Users, Database, Settings } from 'lucide-react';

const Administration = () => {
  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-800">
        {['User Management', 'Tag Configuration', 'Operating Windows', 'System Settings'].map((tab, i) => (
          <button key={tab} className={`px-4 py-3 text-sm font-medium ${i===0 ? 'text-[#00d4ff] border-b-2 border-[#00d4ff]' : 'text-gray-400 hover:text-white'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#1a2540] rounded-lg border border-gray-800 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><Users size={18}/> Users</h2>
          <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">Add User</button>
        </div>
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
            <tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Role</th><th className="px-4 py-2">Department</th><th className="px-4 py-2">Status</th></tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800"><td className="px-4 py-3">Rajesh Kumar</td><td className="px-4 py-3">Process Engineer</td><td className="px-4 py-3">Production</td><td className="px-4 py-3 text-[#00e676]">Active</td></tr>
            <tr className="border-b border-gray-800"><td className="px-4 py-3">Amit Singh</td><td className="px-4 py-3">Maintenance Head</td><td className="px-4 py-3">Mechanical</td><td className="px-4 py-3 text-[#00e676]">Active</td></tr>
            <tr><td className="px-4 py-3">Priya Sharma</td><td className="px-4 py-3">Plant Head</td><td className="px-4 py-3">Management</td><td className="px-4 py-3 text-[#00e676]">Active</td></tr>
          </tbody>
        </table>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-3 flex items-center gap-2"><Settings size={18}/> Simulator Control</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Current Scenario</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white">
                <option>Normal Operation</option>
                <option>Raw Mill Degradation</option>
                <option>High Moisture Feed</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-3 flex items-center gap-2"><Database size={18}/> System Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">API Backend</span><span className="text-[#00e676] font-bold">ONLINE</span></div>
            <div className="flex justify-between"><span className="text-gray-400">ML Engine</span><span className="text-[#00e676] font-bold">ONLINE</span></div>
            <div className="flex justify-between"><span className="text-gray-400">OPC UA Client</span><span className="text-[#ffa726] font-bold">SIMULATED</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Administration;
"""
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Written: {full_path}")
