const fs = require('fs');
const path = require('path');

const baseDir = "d:\\Hackthaon\\Scnider\\Kaizen Changer for Better\\kaizen\\frontend";

const files = {};

files["src/App.tsx"] = `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Overview from './pages/Overview';
import DigitalTwin from './pages/DigitalTwin';
import Energy from './pages/Energy';
import Process from './pages/Process';
import EquipmentHealth from './pages/EquipmentHealth';
import PredictiveMaintenance from './pages/PredictiveMaintenance';
import Optimization from './pages/Optimization';
import WhatIfSimulator from './pages/WhatIfSimulator';
import WHRS from './pages/WHRS';
import CaptivePower from './pages/CaptivePower';
import Emissions from './pages/Emissions';
import Alarms from './pages/Alarms';
import KaizenOpportunities from './pages/KaizenOpportunities';
import Reports from './pages/Reports';
import KaizenCopilot from './pages/KaizenCopilot';
import Administration from './pages/Administration';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore(state => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="digital-twin" element={<DigitalTwin />} />
            <Route path="energy" element={<Energy />} />
            <Route path="process" element={<Process />} />
            <Route path="equipment-health" element={<EquipmentHealth />} />
            <Route path="predictive-maintenance" element={<PredictiveMaintenance />} />
            <Route path="optimization" element={<Optimization />} />
            <Route path="what-if" element={<WhatIfSimulator />} />
            <Route path="whrs" element={<WHRS />} />
            <Route path="captive-power" element={<CaptivePower />} />
            <Route path="emissions" element={<Emissions />} />
            <Route path="alarms" element={<Alarms />} />
            <Route path="kaizen" element={<KaizenOpportunities />} />
            <Route path="reports" element={<Reports />} />
            <Route path="copilot" element={<KaizenCopilot />} />
            <Route path="admin" element={<Administration />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
`;

files["src/types/api.ts"] = `export interface DashboardOverview {
  timestamp: string;
  plant_status: 'NORMAL' | 'ATTENTION' | 'CRITICAL';
  kaizen_score: number;
  production: {
    clinker_tph: number;
    cement_tph: number;
    today_clinker_tons: number;
    today_cement_tons: number;
    target_tph: number;
    efficiency_pct: number;
  };
  energy: {
    total_power_mw: number;
    sec_kwh_ton_clinker: number;
    sec_kwh_ton_cement: number;
    target_sec: number;
    whrs_generation_mw: number;
    cpp_generation_mw: number;
    grid_import_mw: number;
    fuel_rate_tph: number;
    energy_cost_today: number;
  };
  emissions: {
    co2_intensity_kg_ton: number;
    co2_avoided_today: number;
    target_co2_intensity: number;
  };
  equipment_health: {
    overall_health: number;
    critical_equipment_count: number;
    at_risk_equipment_count: number;
  };
  alarms: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total_active: number;
  };
  kaizen: {
    open_opportunities: number;
    total_potential_saving_today: number;
    top_opportunity: KaizenOpportunity | null;
  };
  departments: DepartmentStatus[];
}

export interface DepartmentStatus {
  code: string;
  name: string;
  status: 'NORMAL' | 'ATTENTION' | 'CRITICAL';
  production_tph: number;
  power_kw: number;
  health: number;
  active_alarms: number;
  efficiency_pct: number;
}

export interface SensorReading {
  sensor_id: number;
  tag: string;
  name: string;
  value: number;
  unit: string;
  quality: 'GOOD' | 'STALE' | 'MISSING' | 'SUSPECT' | 'OUT_OF_RANGE';
  timestamp: string;
  equipment_code: string;
  department_code: string;
}

export interface SECData {
  current_sec_kwh_ton_clinker: number;
  current_sec_kwh_ton_cement: number;
  target_sec: number;
  best_sec: number;
  benchmark_sec: number;
  deviation_pct: number;
  potential_saving_kwh: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  by_department: Array<{ department: string; sec: number; target: number }>;
}

export interface KaizenOpportunity {
  id: number;
  opp_id: string;
  department_code: string;
  equipment_code?: string;
  title: string;
  problem: string;
  root_cause: string;
  potential_energy_saving_kwh_day: number;
  potential_cost_saving_day: number;
  potential_co2_reduction_tday: number;
  implementation_difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
  estimated_roi_days: number;
  confidence: number;
  priority_score: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'DISMISSED';
  created_at: string;
}

export interface Alarm {
  id: number;
  alarm_tag: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: string;
  value: number;
  limit_value: number;
  state: 'ACTIVE' | 'ACKNOWLEDGED' | 'CLEARED';
  raised_at: string;
  acknowledged_at?: string;
  department_code: string;
  equipment_code?: string;
}

export interface OptimizationResult {
  id: number;
  status: string;
  objective_value: number;
  iterations: number;
  recommendations: Array<{
    parameter: string;
    current: number;
    recommended: number;
    unit: string;
  }>;
  expected_savings: {
    energy_kwh_day: number;
    cost_day: number;
    co2_tday: number;
  };
}

export interface SimulationResult {
  id: number;
  baseline: { production_tph: number; power_kw: number; sec: number; co2: number };
  simulated: { production_tph: number; power_kw: number; sec: number; co2: number };
  delta: { power_kw: number; sec: number; co2: number; production_tph: number };
  quality_risk: 'LOW' | 'MEDIUM' | 'HIGH';
  equipment_risk: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  disclaimer: string;
}

export interface CopilotResponse {
  query: string;
  answer: string;
  data_sources: string[];
  data_timestamp: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  related_kaizen: string[];
  disclaimer: string;
}

export interface WHRSData {
  generation_mw: number;
  efficiency_pct: number;
  target_mw: number;
  deviation_pct: number;
  available_heat_gj_h: number;
  recovered_heat_gj_h: number;
  co2_avoided_today: number;
  lost_generation_mw: number;
  trend: Array<{ time: string; value: number }>;
}

export interface EmissionsData {
  co2_intensity_kg_ton_clinker: number;
  co2_intensity_kg_ton_cement: number;
  target_kg_ton: number;
  electricity_co2_today: number;
  fuel_co2_today: number;
  total_co2_today: number;
  avoided_co2_whrs: number;
  avoided_co2_efficiency: number;
  renewable_contribution_pct: number;
}

export interface WebSocketMessage {
  type: string;
  timestamp: string;
  readings: SensorReading[];
  kpis: { production_tph: number; power_mw: number; sec: number };
  active_alarms: number;
  scenario: string;
}
`;

files["src/lib/api.ts"] = `import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/v1',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
`;

files["src/lib/websocket.ts"] = `import { useTelemetryStore } from '../stores/telemetryStore';

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  
  connect() {
    if (this.ws) return;
    const url = import.meta.env.VITE_WS_BASE_URL + '/ws/telemetry';
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      useTelemetryStore.getState().setConnected(true);
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      useTelemetryStore.getState().updateTelemetry(data);
    };
    
    this.ws.onclose = () => {
      useTelemetryStore.getState().setConnected(false);
      this.ws = null;
      this.reconnectTimer = window.setTimeout(() => this.connect(), 3000);
    };
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsClient = new WebSocketClient();
`;

files["src/lib/utils.ts"] = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, decimals = 1) {
  if (num === undefined || num === null) return '-';
  return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
`;

files["src/stores/authStore.ts"] = `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: any | null;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
);
`;

files["src/stores/telemetryStore.ts"] = `import { create } from 'zustand';
import { WebSocketMessage } from '../types/api';

interface TelemetryState {
  connected: boolean;
  latest: WebSocketMessage | null;
  setConnected: (status: boolean) => void;
  updateTelemetry: (data: WebSocketMessage) => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  connected: false,
  latest: null,
  setConnected: (connected) => set({ connected }),
  updateTelemetry: (data) => set({ latest: data }),
}));
`;

files["src/pages/Overview.tsx"] = `import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { DashboardOverview } from '../types/api';
import { Activity, Zap, TrendingDown, ThermometerSun, Wind, Bell } from 'lucide-react';

export default function Overview() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      try {
        const res = await api.get<DashboardOverview>('/overview');
        return res.data;
      } catch (e) {
        // Mock fallback for UI rendering when no backend
        return {
          timestamp: new Date().toISOString(),
          plant_status: 'NORMAL',
          kaizen_score: 92,
          production: { clinker_tph: 450, cement_tph: 300, efficiency_pct: 95 },
          energy: { total_power_mw: 24.5, sec_kwh_ton_clinker: 82, whrs_generation_mw: 4.2 },
          emissions: { co2_intensity_kg_ton: 800 },
          alarms: { total_active: 3 },
          departments: [
            { name: 'Mine', status: 'NORMAL', production_tph: 500, power_kw: 1000, health: 95, active_alarms: 0 },
            { name: 'Raw Mill', status: 'NORMAL', production_tph: 480, power_kw: 1500, health: 90, active_alarms: 0 },
            { name: 'Kiln', status: 'NORMAL', production_tph: 450, power_kw: 1200, health: 95, active_alarms: 0 },
            { name: 'Clinker', status: 'NORMAL', production_tph: 450, power_kw: 1100, health: 88, active_alarms: 0 },
            { name: 'Cement Mill', status: 'ATTENTION', production_tph: 300, power_kw: 800, health: 82, active_alarms: 1 },
            { name: 'Packing', status: 'NORMAL', production_tph: 300, power_kw: 400, health: 99, active_alarms: 0 },
            { name: 'CPP', status: 'NORMAL', production_tph: 0, power_kw: 0, health: 100, active_alarms: 0 },
            { name: 'WHRS', status: 'NORMAL', production_tph: 0, power_kw: 0, health: 95, active_alarms: 0 },
          ]
        } as unknown as DashboardOverview;
      }
    },
    refetchInterval: 5000,
  });

  if (isLoading || !overview) return <div className="p-8 text-foreground">Loading COMMAND CENTER...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">COMMAND CENTER</h1>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-card rounded-md border border-border">
            <span className="text-sm text-secondary">KAIZEN SCORE</span>
            <div className="text-2xl font-mono font-bold text-accent">{overview.kaizen_score}</div>
          </div>
          <div className={\`px-4 py-2 rounded-md font-bold \${
            overview.plant_status === 'NORMAL' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
          }\`}>
            {overview.plant_status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard title="Production" value={overview.production.clinker_tph} unit="TPH" icon={<Activity />} />
        <KPICard title="Total Power" value={overview.energy.total_power_mw} unit="MW" icon={<Zap />} />
        <KPICard title="SEC" value={overview.energy.sec_kwh_ton_clinker} unit="kWh/t" icon={<TrendingDown />} />
        <KPICard title="WHRS" value={overview.energy.whrs_generation_mw} unit="MW" icon={<ThermometerSun />} />
        <KPICard title="CO2" value={overview.emissions.co2_intensity_kg_ton} unit="kg/t" icon={<Wind />} />
        <KPICard title="Alarms" value={overview.alarms.total_active} unit="" icon={<Bell />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {overview.departments.map((d: any) => (
          <div key={d.name} className="bg-card p-4 rounded-lg border border-border">
            <h3 className="font-bold mb-2">{d.name}</h3>
            <div className="text-sm text-secondary">Status: <span className={d.status === 'NORMAL' ? 'text-success' : 'text-warning'}>{d.status}</span></div>
            <div className="font-mono">{d.production_tph} TPH | {d.power_kw} kW</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KPICard({ title, value, unit, icon }: { title: string, value: number, unit: string, icon: React.ReactNode }) {
  return (
    <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-4">
      <div className="p-3 bg-background rounded-full text-accent">{icon}</div>
      <div>
        <div className="text-sm text-secondary">{title}</div>
        <div className="text-xl font-mono font-bold">{value} <span className="text-sm">{unit}</span></div>
      </div>
    </div>
  );
}
`;

files["src/pages/Login.tsx"] = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const login = useAuthStore(s => s.setToken);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('dummy-token');
    navigate('/overview');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full border border-border">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">KAIZEN</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-secondary mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-input text-foreground px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>
          <div>
            <label className="block text-sm text-secondary mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-input text-foreground px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded font-bold hover:bg-primary/90 transition">
            LOGIN TO COMMAND CENTER
          </button>
        </form>
      </div>
    </div>
  );
}
`;

files["src/components/layout/Layout.tsx"] = `import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, Activity, ShieldAlert, BrainCircuit, Sliders, Settings } from 'lucide-react';
import { wsClient } from '../../lib/websocket';
import { useTelemetryStore } from '../../stores/telemetryStore';

export default function Layout() {
  const location = useLocation();
  const connected = useTelemetryStore(s => s.connected);

  useEffect(() => {
    wsClient.connect();
    return () => wsClient.disconnect();
  }, []);

  const navs = [
    { name: 'Overview', path: '/overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Digital Twin', path: '/digital-twin', icon: <Activity className="w-5 h-5" /> },
    { name: 'Energy', path: '/energy', icon: <Zap className="w-5 h-5" /> },
    { name: 'What-If Simulator', path: '/what-if', icon: <Sliders className="w-5 h-5" /> },
    { name: 'Kaizen Copilot', path: '/copilot', icon: <BrainCircuit className="w-5 h-5" /> },
    { name: 'Alarms', path: '/alarms', icon: <ShieldAlert className="w-5 h-5" /> },
    { name: 'Optimization', path: '/optimization', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold text-primary tracking-wider">KAIZEN</h1>
          <div className="text-xs text-secondary">INTELLIGENCE PLATFORM</div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navs.map(nav => (
              <Link 
                key={nav.path} 
                to={nav.path}
                className={\`flex items-center gap-3 px-3 py-2 rounded-md transition \${
                  location.pathname.startsWith(nav.path) 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-secondary hover:bg-muted hover:text-foreground'
                }\`}
              >
                {nav.icon}
                {nav.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={\`w-2.5 h-2.5 rounded-full \${connected ? 'bg-success' : 'bg-danger'}\`}></div>
              <span className="text-xs text-secondary">{connected ? 'LIVE' : 'OFFLINE'}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-bold border border-primary text-primary px-3 py-1 rounded hover:bg-primary/10">
              HACKATHON DEMO MODE
            </button>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              A
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
`;

const otherPages = ["DigitalTwin", "Energy", "Process", "EquipmentHealth", "PredictiveMaintenance", "Optimization", "WhatIfSimulator", "WHRS", "CaptivePower", "Emissions", "Alarms", "KaizenOpportunities", "Reports", "KaizenCopilot", "Administration"];
for (const p of otherPages) {
    if (!files["src/pages/" + p + ".tsx"]) {
        files["src/pages/" + p + ".tsx"] = `import React from 'react';

export default function ${p}() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground">${p}</h1>
      <p className="text-secondary mt-4">This module provides advanced insights and controls for ${p}. Simulated for demo.</p>
    </div>
  );
}
`;
    }
}


files["Dockerfile"] = `# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_API_BASE_URL=http://localhost:8000
ARG VITE_WS_BASE_URL=ws://localhost:8000
ARG VITE_APP_TITLE=KAIZEN
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_BASE_URL=$VITE_WS_BASE_URL
ENV VITE_APP_TITLE=$VITE_APP_TITLE
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`;

files["Dockerfile.dev"] = `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]
`;

files["nginx.conf"] = `server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
    }
    location /ws {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    gzip on;
    gzip_types text/plain application/javascript text/css application/json;
}
`;

for (const [f, content] of Object.entries(files)) {
    const p = path.join(baseDir, f.split('/').join(path.sep));
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content, 'utf8');
}
console.log("Generated source files.");
