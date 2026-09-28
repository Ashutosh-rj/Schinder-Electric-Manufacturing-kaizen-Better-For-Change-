import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Activity, Zap, AlertTriangle, Hexagon, Component, 
  LayoutDashboard, GitBranch, HeartPulse, History,
  CheckCircle2, Search, Bell, Settings, User, LogOut,
  ChevronDown, ShieldCheck, Factory, Sparkles, Power,
  CloudRain, Sliders, Layers, BarChart3, Database, BookOpen, FileText,
  BrainCircuit, Compass, Hammer, Wind, Truck, Maximize2,
  PanelLeft, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

// Main navigation items strictly matching plant overview.png
const mainNavItems = [
  { to: "/overview", label: "Home", icon: LayoutDashboard },
  { to: "/digital-twin", label: "Plant Overview", icon: Component },
  { to: "/process", label: "Process Flow", icon: GitBranch },
  { to: "/optimization", label: "Process Analysis", icon: BarChart3 },
  { to: "/energy", label: "Energy Management", icon: Zap },
  { to: "/emissions", label: "Emissions & Environment", icon: CloudRain },
  { to: "/equipment-health", label: "Equipment Health", icon: HeartPulse },
  { to: "/predictive-maintenance", label: "Predictive Maintenance", icon: History },
  { to: "/alarms", label: "Alarm Management", icon: AlertTriangle },
  { to: "/reports", label: "Reports & Analytics", icon: FileText },
];

// Plant Modules shortcuts strictly matching plant overview.png
const plantModules = [
  { name: "Mine", area: "CR", icon: Compass },
  { name: "Crusher", area: "CR", icon: Hammer },
  { name: "Raw Mill", area: "RM1", icon: Factory },
  { name: "Kiln & Preheater", area: "KILN", icon: Activity },
  { name: "Cooler", area: "COOLER", icon: Wind },
  { name: "Cement Mill", area: "CM2", icon: Settings },
  { name: "Packing & Dispatch", area: "PACKING", icon: Truck },
  { name: "Captive Power", area: "POWER", icon: Power },
  { name: "WHRS", area: "POWER", icon: Zap },
];

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Professional enterprise collapsible sidebar state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('kaizen_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('kaizen_sidebar_collapsed', String(next));
      return next;
    });
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut: Ctrl + B toggles sidebar collapse/expand
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const isDigitalTwin = location.pathname.startsWith('/digital-twin');

  return (
    <div className="flex h-screen bg-[#071018] text-gray-200 font-sans overflow-hidden select-none">
      
      {/* ── ENTERPRISE COLLAPSIBLE SIDEBAR (SLIM RAIL ↔ FULL DRAWER) ── */}
      <aside className={`
        bg-[#07121b] border-r border-[#101e2c] flex flex-col flex-shrink-0 z-30 shadow-2xl transition-all duration-300 ease-in-out relative
        ${isCollapsed ? 'w-16' : 'w-56'}
      `}>
        
        {/* BRANDING: KAIZEN LOGO & TOGGLE BUTTON */}
        <div className={`h-14 flex items-center border-b border-[#101e2c] bg-[#07121b] transition-all ${
          isCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'
        }`}>
          <Link to="/overview" className="flex items-center gap-2.5 group">
            {/* Geometric emerald folded ribbon logo */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00ff88] via-[#059669] to-[#047857] flex items-center justify-center text-[#060b13] shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform font-black shrink-0">
              <span className="text-xs">▲</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-black text-sm tracking-wider text-white leading-tight truncate">
                  KAIZEN
                </span>
                <span className="text-[8px] text-gray-400 font-medium tracking-tight truncate">
                  Smarter Cement. Greener Tomorrow.
                </span>
              </div>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-[#0c1825] transition-colors"
              title="Collapse Sidebar to Icon Rail (Ctrl+B)"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>
        
        {/* NAVIGATION ITEMS */}
        <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-3 custom-scrollbar text-xs">
          
          {/* Main Navigation Links */}
          <div className="space-y-0.5">
            {mainNavItems.map((item, idx) => {
              const isActive = (item.to === '/overview' && location.pathname === '/overview') ||
                (item.to !== '/overview' && location.pathname.startsWith(item.to));
              const IconComp = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.to}
                  className={`flex items-center rounded-lg font-semibold transition-all duration-150 relative group ${
                    isCollapsed 
                      ? 'justify-center p-2.5' 
                      : 'gap-2.5 px-3 py-1.5 text-xs'
                  } ${
                    isActive 
                      ? 'bg-[#0c3222] text-[#00ff88] border border-[#106c35] font-extrabold shadow-sm' 
                      : 'text-gray-400 hover:text-white hover:bg-[#0c1825] border border-transparent'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <IconComp size={16} className={`shrink-0 ${isActive ? 'text-[#00ff88]' : 'text-gray-400'}`} />
                  
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}

                  {/* Floating tooltip when collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#091522] border border-[#182f48] rounded-md text-[11px] font-bold text-white shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Plant Modules Section strictly matching plant overview.png */}
          <div className="pt-2 border-t border-[#101e2c]">
            {!isCollapsed ? (
              <h3 className="text-[10px] font-bold text-gray-500 mb-1.5 px-3 uppercase tracking-wider">
                PLANT MODULES
              </h3>
            ) : (
              <div className="w-full h-1 bg-[#101e2c] my-1 rounded" />
            )}

            <div className="space-y-0.5">
              {plantModules.map((m, idx) => {
                const IconComp = m.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => navigate(`/digital-twin?area=${m.area}`)}
                    className={`w-full flex items-center rounded-md font-medium text-gray-400 hover:text-[#00ff88] hover:bg-[#0c1825] transition-all text-left group relative ${
                      isCollapsed 
                        ? 'justify-center p-2' 
                        : 'justify-between px-3 py-1 text-[11px]'
                    }`}
                    title={isCollapsed ? `${m.name} (${m.area})` : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <IconComp size={14} className="text-gray-500 group-hover:text-[#00ff88] transition-colors shrink-0" />
                      {!isCollapsed && <span className="truncate">{m.name}</span>}
                    </div>

                    {!isCollapsed && (
                      <span className="text-[8px] font-mono text-gray-600 group-hover:text-emerald-400">
                        {m.area}
                      </span>
                    )}

                    {/* Floating tooltip when collapsed */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#091522] border border-[#182f48] rounded-md text-[11px] font-bold text-white shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 flex items-center gap-1.5">
                        <span>{m.name}</span>
                        <span className="text-[9px] text-[#00ff88] font-mono font-bold">[{m.area}]</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* BOTTOM SCHNEIDER BRANDING & EXPAND TOGGLE */}
        <div className={`p-2.5 border-t border-[#101e2c] bg-[#050e17] flex items-center transition-all ${
          isCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between'
        }`}>
          {!isCollapsed ? (
            <div className="flex items-center justify-between w-full text-[11px] font-sans">
              <div className="flex flex-col">
                <span className="font-extrabold text-white tracking-wide flex items-center gap-1">
                  <span className="text-[#00ff88]">Schneider</span> Electric
                </span>
                <span className="text-gray-500 font-mono text-[9px]">Life Is On</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
            </div>
          ) : (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#00ff88] hover:bg-[#0c1825] transition-all"
              title="Expand Sidebar (Ctrl+B)"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#060c14] relative overflow-hidden">
        
        {/* TOP COMMAND CENTER HEADER STRICTLY MATCHING plant overview.png */}
        <header className="h-14 bg-[#07131e] border-b border-[#101e2c] flex items-center justify-between px-4 sticky top-0 z-20 shrink-0 shadow-md">
          
          {/* Left: Sidebar Toggle Button + Plant Name & Live Badge */}
          <div className="flex items-center gap-3">
            
            {/* Sleek Enterprise Sidebar Toggle */}
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg bg-[#0b1a28] hover:bg-[#102235] border border-[#14283b] text-gray-400 hover:text-[#00ff88] transition-colors"
              title={isCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar to Mini Rail (Ctrl+B)"}
            >
              <PanelLeft size={16} />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white tracking-wide">
                Integrated Cement Plant
              </span>
              <span className="text-[11px] text-gray-400 font-mono hidden md:inline">
                Command Center | KAIZEN Intelligence Platform
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-[#00ff88] border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                LIVE
              </span>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div className="relative group hidden lg:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00ff88] transition-colors" />
            <input 
              type="text" 
              placeholder="Search equipment, parameter, or alarm..." 
              className="w-80 bg-[#0b1a28] border border-[#14283b] rounded-lg py-1 pl-8 pr-14 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-gray-400 bg-[#102235] border border-[#182f48] rounded px-1.5 py-0.5">
              Ctrl + K
            </span>
          </div>

          {/* Right: Clock, Theme, Fullscreen, Profile */}
          <div className="flex items-center gap-3">
            
            {/* Live Synchronized Timestamp */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-gray-300 bg-[#0b1a28] border border-[#14283b] px-3 py-1 rounded-lg">
              <span className="text-emerald-400 font-bold">
                {currentTime.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-[#00ff88] font-bold">
                {currentTime.toLocaleTimeString('en-US', { hour12: true })}
              </span>
            </div>

            {/* Quick Actions (Fullscreen) */}
            <div className="flex items-center gap-1">
              <button 
                onClick={toggleFullScreen}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#0c1825] rounded-lg transition-colors"
                title="Toggle Fullscreen"
              >
                <Maximize2 size={15} />
              </button>
            </div>

            {/* User Profile strictly matching plant overview.png (AP - Process Engineer) */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 py-1 pr-1.5 rounded-lg hover:bg-[#0b1a28] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#106c35] to-[#047857] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'AP'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-200 leading-tight">
                    {user?.full_name || 'Process Engineer'}
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono">
                    Plant - Unit 1
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0a1522] border border-[#16293d] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-[#112030]">
                    <p className="text-xs font-bold text-white">{user?.full_name || 'Process Engineer'}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user?.email || 'engineer@kaizen.io'}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-[#102030]"
                    >
                      <Factory className="w-4 h-4 text-gray-500" /> Kaizen Home Page
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-[#102030]"
                    >
                      <Settings className="w-4 h-4 text-gray-500" /> Plant Configuration
                    </Link>
                  </div>

                  <div className="border-t border-[#112030] pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ── MAIN WORKSPACE VIEWPORT ────────────────────────────────── */}
        <main className={`flex-1 ${isDigitalTwin ? 'overflow-hidden p-0' : 'overflow-y-auto p-3.5 custom-scrollbar bg-[#060c14]'}`}>
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default Layout;
