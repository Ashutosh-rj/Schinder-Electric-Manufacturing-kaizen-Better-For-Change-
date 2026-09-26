import React, { useState, useEffect } from 'react';
import { Shield, Users, Database, Settings, Tag, Target, RefreshCw, CheckCircle2, AlertTriangle, Play, Cpu, Server, Activity } from 'lucide-react';
import { api } from '../lib/api';

const SCENARIO_LABELS: Record<string, { label: string; desc: string }> = {
  normal: { label: "Normal Baseline Operation", desc: "Stable production with all equipment operating within BAT efficiency benchmarks." },
  fan_degradation: { label: "Separator / ID Fan Aerodynamic Loss", desc: "Simulates fan blade fouling and excess damper throttling, elevating SEC by ~8 kWh/t." },
  energy_inefficiency: { label: "Cross-Department Energy Inefficiency", desc: "Thermal heat rate increases above 760 kcal/kg and grinding media wear is simulated." },
  kiln_disturbance: { label: "Kiln Burning Zone Thermal Fluctuation", desc: "Burning zone temperature dips below 1400°C triggering fuel trim advisory." },
  mill_instability: { label: "Raw Mill Vibration & Grinding Surges", desc: "Simulates feed moisture surges causing mill bed instability and elevated RMS vibration." },
  whrs_degradation: { label: "WHRS Heat Exchanger Fouling", desc: "AQC boiler heat transfer drops by 20%, reducing waste heat generation by ~0.8 MW." },
  cpp_issue: { label: "Captive Power Plant Turbine Derating", desc: "CPP generation constrained, forcing higher 33kV State Grid power import." },
  sensor_failure: { label: "Optical Pyrometer / Oxygen Sensor Drift", desc: "Simulates noisy analog sensor signal requiring DCS signal validation." }
};

const Administration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'system' | 'windows' | 'users'>('simulator');
  const [currentScenario, setCurrentScenario] = useState<string>('normal');
  const [switching, setSwitching] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // System ping states
  const [apiOnline, setApiOnline] = useState(true);
  const [dcsOnline, setDcsOnline] = useState(true);
  const [redisPingMs, setRedisPingMs] = useState<number>(4);

  // Operating windows state
  const [windows, setWindows] = useState([
    { eq: "Kiln 1", param: "Feed Rate", min: 16.0, max: 22.0, target: 18.5, unit: "TPH" },
    { eq: "Kiln 1", param: "Burning Zone Temp", min: 1400, max: 1480, target: 1450, unit: "°C" },
    { eq: "Raw Mill 1", param: "ID Fan Speed", min: 750, max: 960, target: 845, unit: "RPM" },
    { eq: "Cement Mill 1", param: "Specific Energy (SEC)", min: 28.0, max: 34.0, target: 30.5, unit: "kWh/t" },
    { eq: "WHRS Boiler", param: "AQC Inlet Temp", min: 300, max: 360, target: 330, unit: "°C" }
  ]);
  const [savedWindows, setSavedWindows] = useState(false);

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const start = performance.now();
        const res = await api.get('/simulator/scenario');
        const elapsed = Math.round(performance.now() - start);
        setRedisPingMs(elapsed);
        if (res.data?.current_scenario) {
          setCurrentScenario(res.data.current_scenario);
        }
        setApiOnline(true);
      } catch (err) {
        console.error("Failed to load scenario", err);
        setApiOnline(false);
      }
    };
    fetchScenario();
  }, []);

  const handleScenarioChange = async (scenario: string) => {
    setSwitching(true);
    setStatusMessage(null);
    try {
      const res = await api.post('/simulator/scenario', { scenario });
      setCurrentScenario(scenario);
      setStatusMessage(res.data?.message || `Simulator switched to ${scenario}. Telemetry will update in ~5 seconds.`);
      setTimeout(() => setStatusMessage(null), 6000);
    } catch (err) {
      console.error("Failed to switch scenario", err);
    } finally {
      setSwitching(false);
    }
  };

  const handleSaveWindows = () => {
    setSavedWindows(true);
    setTimeout(() => setSavedWindows(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Settings className="text-emerald-600" size={24} /> Plant System Administration & Digital Twin Control
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
              CORE PLATFORM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Control the real-time simulation engine, configure operating envelopes, inspect gateway health, and manage operator roles.
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 gap-2">
        {[
          { id: 'simulator', label: 'Simulator Control & Scenarios', icon: <Play size={15} /> },
          { id: 'system', label: 'System Health & DCS Gateway', icon: <Server size={15} /> },
          { id: 'windows', label: 'Target Operating Windows', icon: <Target size={15} /> },
          { id: 'users', label: 'Authorized Operators & Roles', icon: <Users size={15} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-emerald-700 border-emerald-600 bg-white rounded-t-xl'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TOAST MESSAGE */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          {statusMessage}
        </div>
      )}

      {/* TAB 1: SIMULATOR CONTROL */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Play size={16} className="text-emerald-600" /> Active Operating Scenario
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Switching scenarios dynamically modifies real-time physics feeds across Kiln, Mills, WHRS, and Captive Power.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(SCENARIO_LABELS).map(([key, info]) => {
                const isActive = currentScenario === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleScenarioChange(key)}
                    disabled={switching}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isActive 
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs' 
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-bold ${isActive ? 'text-emerald-800' : 'text-slate-800'}`}>
                          {info.label}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {info.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/50 flex justify-between items-center text-[10px]">
                      <span className="font-mono text-slate-400">code: {key}</span>
                      <span className={`font-bold ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {isActive ? 'ACTIVE IN REDIS' : 'CLICK TO INJECT'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Economic & Energy Tariff Settings
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1 font-medium">Electricity Grid Tariff Rate</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue="7.50"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                    />
                    <span className="text-slate-500 font-bold shrink-0">₹ / kWh</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-medium">Imported / Petcoke Fuel Cost</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue="12,400"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                    />
                    <span className="text-slate-500 font-bold shrink-0">₹ / Ton</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-medium">Clinker BAT SEC Target</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue="62.0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold text-emerald-600"
                    />
                    <span className="text-slate-500 font-bold shrink-0">kWh / t</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSaveWindows}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all"
              >
                Apply Energy Parameters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM HEALTH */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Infrastructure & Communications Status</h3>
              <p className="text-xs text-slate-500">Live operational status of backend services, messaging buses, and DCS gateways.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> ALL SERVICES HEALTHY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">FastAPI REST Core</span>
                <span className="font-bold text-emerald-600 font-mono">ONLINE ({redisPingMs}ms)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">Redis In-Memory State Store</span>
                <span className="font-bold text-emerald-600 font-mono">CONNECTED (port 6379)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">PostgreSQL Relational DB</span>
                <span className="font-bold text-emerald-600 font-mono">HEALTHY (port 5432)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">Apache Kafka Event Stream</span>
                <span className="font-bold text-emerald-600 font-mono">STREAMING (port 9092)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">DCS Gateway Simulator</span>
                <span className="font-bold text-emerald-600 font-mono">1,420 TAGS STREAMING</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">Physics & AI Kaizen Worker</span>
                <span className="font-bold text-emerald-600 font-mono">ACTIVE (CYCLE: 5s)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">Anomaly Detection Autoencoder</span>
                <span className="font-bold text-emerald-600 font-mono">INFERENCE ONLINE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">OPC-UA Protocol Bridge</span>
                <span className="font-bold text-emerald-600 font-mono">OPC.TCP://DCS:4840</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OPERATING WINDOWS */}
      {activeTab === 'windows' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Target Operating Envelope Specifications</h3>
              <p className="text-xs text-slate-500">Limits governing automatic alarm generation and optimal Kaizen operating zones.</p>
            </div>
            <button
              onClick={handleSaveWindows}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              {savedWindows ? 'Saved Successfully!' : 'Save Envelopes'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                <tr>
                  <th className="py-3 px-4">Equipment Unit</th>
                  <th className="py-3 px-4">Parameter Name</th>
                  <th className="py-3 px-4 text-right">Min Allowable</th>
                  <th className="py-3 px-4 text-right">BAT Target</th>
                  <th className="py-3 px-4 text-right">Max Allowable</th>
                  <th className="py-3 px-4 text-right">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {windows.map((w, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{w.eq}</td>
                    <td className="py-3 px-4">{w.param}</td>
                    <td className="py-3 px-4 text-right font-mono">{w.min}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">{w.target}</td>
                    <td className="py-3 px-4 text-right font-mono">{w.max}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-400">{w.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: OPERATORS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Certified Operations & Engineering Personnel</h3>
              <p className="text-xs text-slate-500">Role-based access control (RBAC) governing setpoint modifications and Kaizen standardization.</p>
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm">
              Add Authorized User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                <tr>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Authorized Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">DCS Write Access</th>
                  <th className="py-3 px-4 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Vikram Sharma</td>
                  <td className="py-3 px-4 font-medium">Plant General Manager</td>
                  <td className="py-3 px-4">Executive Management</td>
                  <td className="py-3 px-4"><span className="text-emerald-700 font-bold">Authorized (Full)</span></td>
                  <td className="py-3 px-4 text-right"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Active</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Rajesh Verma</td>
                  <td className="py-3 px-4 font-medium">Lead Process Optimization Engineer</td>
                  <td className="py-3 px-4">Pyroprocessing / Kiln</td>
                  <td className="py-3 px-4"><span className="text-emerald-700 font-bold">Authorized (Setpoints)</span></td>
                  <td className="py-3 px-4 text-right"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Active</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Anil Patel</td>
                  <td className="py-3 px-4 font-medium">Mechanical Maintenance Lead</td>
                  <td className="py-3 px-4">Asset Reliability</td>
                  <td className="py-3 px-4"><span className="text-slate-500">Read-Only</span></td>
                  <td className="py-3 px-4 text-right"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administration;
