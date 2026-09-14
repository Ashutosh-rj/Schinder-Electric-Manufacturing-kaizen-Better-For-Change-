import React, { useState, useEffect } from 'react';
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
