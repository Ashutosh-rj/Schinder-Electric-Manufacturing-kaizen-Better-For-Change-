import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Maximize, Sun, Search,
  Activity, Wind, Zap, AlertTriangle, FileText, Settings, Layers, Stethoscope, Clock, Hexagon, ChevronDown, Bell, CheckCircle2,
  LayoutDashboard, GitBranch, LineChart, Leaf, HeartPulse, History, LayoutTemplate, Box, Component
} from 'lucide-react';

const navSections = [
  {
    title: "COMMAND CENTER",
    items: [
      { to: "/overview", icon: <LayoutDashboard size={18} strokeWidth={2} />, label: "Plant Overview" },
      { to: "/digital-twin", icon: <Component size={18} strokeWidth={2} />, label: "Plant Digital Twin" },
      { to: "/process", icon: <GitBranch size={18} strokeWidth={2} />, label: "Process Flow" },
      { to: "/process-analysis", icon: <LineChart size={18} strokeWidth={2} />, label: "Process Analysis" },
    ]
  },
  {
    title: "ENERGY & SUSTAINABILITY",
    items: [
      { to: "/energy", icon: <Zap size={18} strokeWidth={2} />, label: "Energy Management" },
      { to: "/energy-loss", icon: <AlertTriangle size={18} strokeWidth={2} />, label: "Energy Loss Analysis" },
      { to: "/emissions", icon: <Leaf size={18} strokeWidth={2} />, label: "Emissions & Environment" },
      { to: "/whrs", icon: <Wind size={18} strokeWidth={2} />, label: "WHRS" },
      { to: "/captive-power", icon: <Zap size={18} strokeWidth={2} />, label: "Captive Power" },
    ]
  },
  {
    title: "ASSET INTELLIGENCE",
    items: [
      { to: "/equipment-health", icon: <HeartPulse size={18} strokeWidth={2} />, label: "Equipment Health" },
      { to: "/predictive-maintenance", icon: <History size={18} strokeWidth={2} />, label: "Predictive Maintenance" },
      { to: "/alarms", icon: <Bell size={18} strokeWidth={2} />, label: "Alarm Management" },
      { to: "/abnormalities", icon: <AlertTriangle size={18} strokeWidth={2} />, label: "Abnormality Management" },
    ]
  },
  {
    title: "KAIZEN INTELLIGENCE",
    items: [
      { to: "/loss-tree", icon: <Layers size={18} strokeWidth={2} />, label: "Loss Tree" },
      { to: "/oee", icon: <Activity size={18} strokeWidth={2} />, label: "OEE Analysis" },
      { to: "/kaizen", icon: <CheckCircle2 size={18} strokeWidth={2} />, label: "Improvement Opportunities" },
      { to: "/rca", icon: <Hexagon size={18} strokeWidth={2} />, label: "Root Cause Analysis" },
      { to: "/kaizen-projects", icon: <LayoutTemplate size={18} strokeWidth={2} />, label: "Kaizen Projects" },
      { to: "/verification", icon: <CheckCircle2 size={18} strokeWidth={2} />, label: "Improvement Verification" },
      { to: "/kaizen-db", icon: <Box size={18} strokeWidth={2} />, label: "Kaizen Database" },
      { to: "/opl", icon: <FileText size={18} strokeWidth={2} />, label: "One Point Lessons" },
    ]
  },
  {
    title: "ANALYTICS",
    items: [
      { to: "/reports", icon: <FileText size={18} strokeWidth={2} />, label: "Reports" },
      { to: "/trends", icon: <LineChart size={18} strokeWidth={2} />, label: "Trends" },
      { to: "/performance", icon: <Activity size={18} strokeWidth={2} />, label: "Performance Analytics" },
    ]
  },
  {
    title: "ADMIN",
    items: [
      { to: "/admin", icon: <Settings size={18} strokeWidth={2} />, label: "Administration" },
      { to: "/users", icon: <Settings size={18} strokeWidth={2} />, label: "Users" },
      { to: "/settings", icon: <Settings size={18} strokeWidth={2} />, label: "Settings" },
    ]
  }
];

const Layout: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-[#041116] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-[260px] bg-[#091b24] flex flex-col border-r border-[#15303f] flex-shrink-0 z-20">
        {/* Logo */}
        <div className="h-[72px] flex items-center px-6 border-b border-[#15303f]">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Three mountain peaks */}
              <path d="M12 2L2 22h7l3-6 3 6h7L12 2z" fill="#00e676" />
              <path d="M12 11l-3 6h6l-3-6z" fill="#041116" />
            </svg>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-[22px] tracking-wide leading-none">KAIZEN</span>
              <span className="text-[#8899aa] text-[9px] mt-0.5">Smarter Cement, Greener Tomorrow</span>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-4 space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              <div className="text-[10px] font-bold text-[#5a7384] mb-2 px-4 uppercase tracking-wider">{section.title}</div>
              <div className="space-y-1">
                {section.items.map((item, i) => {
                  const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
                  return (
                    <NavLink
                      key={i}
                      to={item.to}
                      className={`flex items-center px-4 py-2.5 rounded-lg transition-colors text-[13px] font-medium ${
                        isActive 
                        ? 'bg-[#00e676]/10 text-[#00e676] border border-[#00e676]' 
                        : 'text-[#8899aa] hover:text-white hover:bg-[#15303f]/50 border border-transparent'
                      }`}
                    >
                      <span className={`mr-3 ${isActive ? 'opacity-100' : 'opacity-80'}`}>{item.icon}</span>
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-[#15303f] flex items-center h-[72px]">
          <div className="flex flex-col justify-center">
            <span className="text-white font-bold text-[17px] leading-none">Schneider</span>
            <span className="text-[#00e676] text-xs leading-none mt-1">Electric</span>
          </div>
          <div className="h-6 border-l border-[#2a4555] mx-3"></div>
          <span className="text-[11px] text-[#8899aa]">Life Is On</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#041116] z-10">
        {/* Topbar */}
        <header className="h-[72px] bg-[#091b24] flex items-center justify-between px-6 border-b border-[#15303f] shrink-0">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <h1 className="text-[17px] font-bold text-white tracking-wide">Integrated Cement Plant</h1>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#00e676]/10 border border-[#00e676]/30 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse"></div>
                <span className="text-[10px] text-[#00e676] font-bold tracking-wider uppercase">LIVE</span>
              </div>
            </div>
            <div className="text-[11px] text-[#8899aa] mt-0.5">Command Center | KAIZEN Intelligence Platform</div>
          </div>

          <div className="flex-1 max-w-[480px] mx-10 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a7384]">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Search equipment, parameter, or alarm..." 
              className="w-full bg-[#0d2532] border border-[#1c3a4a] rounded-full py-2.5 pl-11 pr-16 text-[13px] text-[#e8eaf6] focus:outline-none focus:border-[#00e676]/50 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="bg-[#15303f] text-[#8899aa] text-[10px] font-medium px-2 py-0.5 rounded border border-[#2a4555]">Ctrl</kbd>
              <span className="text-[#5a7384] text-xs">+</span>
              <kbd className="bg-[#15303f] text-[#8899aa] text-[10px] font-medium px-2 py-0.5 rounded border border-[#2a4555]">K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end justify-center">
              <span className="text-[11px] text-[#8899aa]">{formatDate(time)}</span>
              <span className="text-[13px] font-bold text-white mt-0.5">{formatTime(time)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0d2532] text-[#8899aa] hover:text-white transition-colors"><Sun size={15} /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0d2532] text-[#8899aa] hover:text-white transition-colors"><Maximize size={15} /></button>
            </div>

            <div className="flex items-center gap-3 border-l border-[#1c3a4a] pl-6 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#b388ff] flex items-center justify-center text-[#1a0033] font-bold text-sm">
                AP
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-white group-hover:text-[#00d4ff] transition-colors">Process Engineer</span>
                <span className="text-[11px] text-[#8899aa]">Plant - Unit 1</span>
              </div>
              <ChevronDown size={16} className="text-[#5a7384] ml-1" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 custom-scrollbar relative">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="h-8 flex items-center justify-between px-6 bg-[#041116] text-[10px] text-[#5a7384] border-t border-[#15303f] shrink-0">
          <div className="flex items-center gap-1.5 text-[#00e676]">
            <Leaf size={12} fill="currentColor" className="text-[#00e676]" />
            <span>Building a Cleaner, More Efficient Tomorrow</span>
          </div>
          <div>
            KAIZEN Intelligence Platform v1.0.0
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
