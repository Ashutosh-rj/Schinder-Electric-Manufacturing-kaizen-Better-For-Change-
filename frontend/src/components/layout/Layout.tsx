import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Activity, Zap, AlertTriangle, Hexagon, Component, 
  LayoutDashboard, GitBranch, HeartPulse, History,
  CheckCircle2, Search, Bell, Settings, User, LogOut,
  ChevronDown, ShieldCheck, Factory, Sparkles
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const navSections = [
  {
    title: "COMMAND CENTER",
    items: [
      { to: "/overview", icon: <LayoutDashboard size={18} strokeWidth={2} />, label: "Plant Overview" },
      { to: "/digital-twin", icon: <Component size={18} strokeWidth={2} />, label: "Digital Twin" },
      { to: "/process", icon: <GitBranch size={18} strokeWidth={2} />, label: "Process Flow" },
    ]
  },
  {
    title: "SUSTAINABILITY & ENERGY",
    items: [
      { to: "/energy", icon: <Zap size={18} strokeWidth={2} />, label: "Energy Optimization" },
      { to: "/whrs", icon: <Activity size={18} strokeWidth={2} />, label: "WHRS Heat Recovery" },
    ]
  },
  {
    title: "PREDICTIVE ASSET AI",
    items: [
      { to: "/equipment-health", icon: <HeartPulse size={18} strokeWidth={2} />, label: "Equipment Health" },
      { to: "/predictive-maintenance", icon: <History size={18} strokeWidth={2} />, label: "Predictive Maintenance" },
      { to: "/alarms", icon: <AlertTriangle size={18} strokeWidth={2} />, label: "Alarms & Anomalies", badge: "3" },
    ]
  },
  {
    title: "KAIZEN INTELLIGENCE",
    items: [
      { to: "/kaizen", icon: <CheckCircle2 size={18} strokeWidth={2} />, label: "AI Opportunities", badge: "1 New" },
      { to: "/rca", icon: <Hexagon size={18} strokeWidth={2} />, label: "Root Cause Analysis" },
      { to: "/kaizen-projects", icon: <Sparkles size={18} strokeWidth={2} />, label: "Kaizen Projects" },
    ]
  }
];

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col flex-shrink-0 z-20 shadow-sm transition-all duration-300">
        
        {/* BRANDING */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 bg-white">
          <Link to="/overview" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#106c35] to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <Factory size={20} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-gray-900 leading-tight">
                KAIZEN <span className="text-[#106c35]">AI</span>
              </span>
              <span className="text-[9px] text-gray-400 font-semibold tracking-wider uppercase">
                EcoStruxure Powered
              </span>
            </div>
          </Link>
        </div>
        
        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6 custom-scrollbar">
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              <h3 className="text-[10px] font-bold text-gray-400 mb-2 px-3 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, i) => {
                  const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
                  return (
                    <NavLink
                      key={i}
                      to={item.to}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                        isActive 
                        ? 'bg-emerald-50 text-[#106c35] shadow-sm border border-emerald-200/80 font-extrabold' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`${isActive ? 'text-[#106c35]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive 
                            ? 'bg-[#106c35] text-white' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* BOTTOM DCS STATUS */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="border border-emerald-200/60 rounded-xl p-3 flex items-center justify-between bg-white shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-gray-900 leading-tight">DCS Gateway Live</span>
                <span className="text-[9px] text-emerald-700 font-semibold">1,420 tags streaming</span>
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200/90 flex items-center justify-between px-6 sticky top-0 z-10 shrink-0 shadow-xs">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Plant:</span>
              <span className="text-sm font-extrabold text-gray-900">Integrated Cement Facility</span>
              <span className="text-gray-300">/</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Unit 1
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative group hidden md:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#106c35] transition-colors" />
              <input 
                type="text" 
                placeholder="Search tags, assets, alarms..." 
                className="w-64 bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-9 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#106c35] focus:ring-1 focus:ring-[#106c35] transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded px-1">
                ⌘K
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <Link to="/alarms" className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell size={17} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              </Link>

              <Link to="/admin" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-slate-100 rounded-lg transition-colors">
                <Settings size={17} />
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#106c35] to-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'E'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-900 leading-tight">
                      {user?.full_name || 'Vikram Sharma'}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {user?.role === 'plant_manager' ? 'Plant Manager' : 'Lead Process Engineer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-gray-900">{user?.full_name || 'Vikram Sharma'}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user?.email || 'admin@kaizen.io'}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50"
                      >
                        <Factory className="w-4 h-4 text-gray-400" /> Kaizen Home Page
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50"
                      >
                        <Settings className="w-4 h-4 text-gray-400" /> Plant Configuration
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default Layout;
