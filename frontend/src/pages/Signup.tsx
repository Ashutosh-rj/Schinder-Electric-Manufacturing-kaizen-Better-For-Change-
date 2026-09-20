import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { 
  Eye, 
  Brain, 
  Leaf, 
  TrendingUp, 
  Pickaxe, 
  Factory, 
  Thermometer, 
  Settings, 
  Truck, 
  Zap, 
  Mail, 
  Lock, 
  EyeOff, 
  Globe, 
  Building2, 
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  User,
  CheckCircle2,
  Cpu,
  Sparkles
} from 'lucide-react';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [plantName, setPlantName] = useState('UltraTech Cement / Unit 1');
  const [role, setRole] = useState('Lead Process Engineer');
  const [plantType, setPlantType] = useState('Integrated Cement Plant');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const setToken = useAuthStore(s => s.setToken);
  const setUser = useAuthStore(s => s.setUser);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // Simulate registration and auto-login
      await new Promise(r => setTimeout(r, 600));
      const dummyToken = 'demo-jwt-token-' + Date.now();
      const dummyUser = {
        id: Math.floor(Math.random() * 1000) + 10,
        email: email || 'engineer@cementplant.com',
        username: fullName.toLowerCase().replace(/\s+/g, '_') || 'engineer_user',
        full_name: fullName || 'Process Engineer',
        role: role.toLowerCase().includes('manager') ? 'plant_manager' : 'operator',
        plant: plantName,
        plant_type: plantType
      };

      setToken(dummyToken);
      setUser(dummyUser);
      navigate('/overview');
    } catch (err: any) {
      setError('Registration could not be completed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-900 font-sans text-white relative overflow-hidden">
      
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Cement Plant" 
          className="w-full h-full object-cover opacity-30 mix-blend-overlay filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-green-950/20 mix-blend-color"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row h-full min-h-screen p-6 lg:p-12">
        
        {/* LEFT SIDE: Branding & Value Proposition */}
        <div className="flex-1 flex flex-col justify-between max-w-3xl pr-8">
          
          {/* Header */}
          <div className="flex items-start justify-between w-full">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-bold text-2xl tracking-tight">Schneider</span>
              <span className="font-light text-2xl tracking-tight">Electric</span>
              <div className="w-px h-6 bg-white/30 mx-2"></div>
              <span className="text-lg text-emerald-400 font-medium">Life Is On</span>
            </Link>
          </div>

          {/* Hero Text */}
          <div className="mt-12 lg:mt-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Cement Optimization AI
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-4">
              Deploy Autonomous <br/>
              Plant <span className="text-[#38b259]">Kaizen Intelligence</span>
            </h1>
            <p className="text-lg text-gray-300 font-medium max-w-xl">
              Connect your DCS telemetry in minutes. Reduce thermal and electrical specific energy with verified, closed-loop AI recommendations.
            </p>
          </div>

          {/* Features Badges */}
          <div className="flex flex-wrap items-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Eye className="w-5 h-5 text-emerald-400" /> DCS Live Telemetry
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Brain className="w-5 h-5 text-emerald-400" /> Root Cause AI
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Leaf className="w-5 h-5 text-emerald-400" /> -12% Specific Energy
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> High-Yield Clinker
            </div>
          </div>

          {/* Abstract Plant Diagram (Badges) */}
          <div className="relative h-56 mt-8 hidden lg:block">
            <svg className="absolute inset-0 w-full h-full" style={{zIndex: -1}}>
               <path d="M 50 120 L 160 120 L 270 60 L 380 120 L 480 60 L 580 120" fill="none" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="2" strokeDasharray="5,5" />
               <circle cx="50" cy="120" r="4" fill="#34d399" />
               <circle cx="160" cy="120" r="4" fill="#34d399" />
               <circle cx="270" cy="60" r="4" fill="#34d399" />
               <circle cx="380" cy="120" r="4" fill="#34d399" />
               <circle cx="480" cy="60" r="4" fill="#34d399" />
               <circle cx="580" cy="120" r="4" fill="#34d399" />
            </svg>

            <div className="absolute top-[90px] left-[10px] bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400"><Pickaxe className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold leading-none mb-1">Mine & Crusher</p><p className="text-[10px] text-gray-400 leading-none">Optimal Particle Size</p></div>
            </div>

            <div className="absolute top-[90px] left-[160px] bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400"><Factory className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold leading-none mb-1">Raw Mill</p><p className="text-[10px] text-gray-400 leading-none">Blaine & Grinding Load</p></div>
            </div>

            <div className="absolute top-[30px] left-[260px] bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400"><Thermometer className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold leading-none mb-1">Rotary Kiln</p><p className="text-[10px] text-gray-400 leading-none">Fuel Rate & Calcination</p></div>
            </div>
            
            <div className="absolute top-[90px] left-[370px] bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400"><Settings className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold leading-none mb-1">Cement Mill</p><p className="text-[10px] text-gray-400 leading-none">Separator Speed & SEC</p></div>
            </div>

            <div className="absolute top-[30px] left-[470px] bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400"><Zap className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold leading-none mb-1">WHRS Recovery</p><p className="text-[10px] text-gray-400 leading-none">Free Waste Heat Power</p></div>
            </div>

            <div className="absolute top-[90px] left-[570px] bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400"><Truck className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold leading-none mb-1">Dispatch</p><p className="text-[10px] text-gray-400 leading-none">Weighbridge Sync</p></div>
            </div>
          </div>

          {/* Enterprise SLA & Security Bar */}
          <div className="mt-auto mb-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6 max-w-4xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#38b259] to-transparent"></div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              <div>
                <div className="text-sm font-bold text-white">ISO 50001 & ISA-95 Compliant</div>
                <div className="text-xs text-gray-400">Enterprise Industrial Cybersecurity</div>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20 hidden lg:block"></div>
            <div className="flex items-center gap-3">
              <Cpu className="w-7 h-7 text-emerald-400" />
              <div>
                <div className="text-sm font-bold text-white">OPC-UA / MQTT Native</div>
                <div className="text-xs text-gray-400">5-minute zero-code DCS link</div>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20 hidden lg:block"></div>
            <div className="flex items-center gap-3">
              <Leaf className="w-7 h-7 text-emerald-400" />
              <div>
                <div className="text-sm font-bold text-white">Direct Carbon Credits</div>
                <div className="text-xs text-gray-400">Automated PAT & CBAM ledger</div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link> |
            <Link to="/login" className="hover:text-emerald-400 transition-colors">Sign In</Link> |
            <a href="#" className="hover:text-white transition-colors">Security Architecture</a> |
            <a href="#" className="hover:text-white transition-colors">DCS Connectors</a>
          </div>
        </div>

        {/* RIGHT SIDE: Interactive Sign Up Card */}
        <div className="w-full lg:w-[500px] mt-10 lg:mt-0 flex flex-col justify-center relative">
          
          <div className="bg-white text-gray-900 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(34,197,94,0.18)] border border-emerald-100 flex flex-col z-10 relative">
            
            <div className="p-8 pb-6 flex-1 relative">
              
              {/* Language Selector */}
              <div className="absolute top-6 right-6">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <Globe className="w-3.5 h-3.5" /> EN <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-2 mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#106c35] uppercase tracking-wider mb-2">
                  <Factory className="w-4 h-4" /> Plant Onboarding
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Start Your <span className="text-[#106c35]">Kaizen Journey</span>
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Connect your plant telemetry to begin autonomous optimization.
                </p>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                <button 
                  onClick={() => setStep(1)} 
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                    step === 1 ? 'bg-[#106c35] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  1. Credentials
                </button>
                <button 
                  onClick={() => setStep(2)} 
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                    step === 2 ? 'bg-[#106c35] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  2. Plant Details
                </button>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                
                {step === 1 ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <User className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#106c35] focus:border-transparent outline-none transition-all"
                          placeholder="e.g. Vikram Sharma"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Corporate / Plant Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Mail className="h-4 w-4" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#106c35] focus:border-transparent outline-none transition-all"
                          placeholder="v.sharma@cementgroup.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#106c35] focus:border-transparent outline-none transition-all"
                          placeholder="Create strong password"
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#106c35] focus:border-transparent outline-none transition-all"
                          placeholder="Re-enter password"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!fullName || !email || !password) {
                          setError('Please fill in your name, email, and password.');
                          return;
                        }
                        setError('');
                        setStep(2);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-[#106c35] hover:bg-[#0d592c] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-900/10 mt-2"
                    >
                      Next: Plant Details <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Plant Organization / Unit</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          value={plantName}
                          onChange={e => setPlantName(e.target.value)}
                          className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#106c35] focus:border-transparent outline-none transition-all"
                          placeholder="e.g. UltraTech Cement / Unit 1"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Your Operational Role</label>
                      <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#106c35] focus:border-transparent outline-none transition-all font-medium"
                      >
                        <option value="Lead Process Engineer">Lead Process Engineer</option>
                        <option value="Plant General Manager">Plant General Manager / Director</option>
                        <option value="Energy & Sustainability Head">Energy & Sustainability Lead</option>
                        <option value="DCS Automation Operator">DCS Automation Operator</option>
                        <option value="Reliability & Maintenance Head">Reliability & Maintenance Lead</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Plant Facility Configuration</label>
                      <select
                        value={plantType}
                        onChange={e => setPlantType(e.target.value)}
                        className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#106c35] focus:border-transparent outline-none transition-all font-medium"
                      >
                        <option value="Integrated Cement Plant">Integrated Cement Plant (Kiln + Mills + WHRS)</option>
                        <option value="Standalone Grinding Unit">Standalone Grinding Unit (VRM / Ball Mill)</option>
                        <option value="Clinkerization Facility">Clinkerization Only Unit</option>
                      </select>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-emerald-800 leading-snug">
                        Immediate access configured with full telemetry sandbox and AI Kaizen optimization templates.
                      </p>
                    </div>

                    <div className="flex gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-sm transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#106c35] hover:bg-[#0d592c] text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-900/10 disabled:opacity-60"
                      >
                        {loading ? 'Setting Up Plant...' : 'Launch Kaizen Command Center'} <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}

                {error && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Enterprise SSO</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setToken('demo-azure-sso-token');
                    setUser({
                      id: 99,
                      email: 'enterprise@schneider-partner.com',
                      full_name: 'Enterprise Engineer',
                      role: 'plant_manager',
                      plant: 'Schneider Partner Integrated Unit'
                    });
                    navigate('/overview');
                  }}
                  className="w-full flex items-center justify-center gap-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  Register with Microsoft Azure AD
                </button>

              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 font-medium">
                  Already registered for Kaizen?{' '}
                  <Link to="/login" className="text-[#106c35] font-bold hover:underline">
                    Sign in to your account
                  </Link>
                </p>
              </div>

            </div>

            {/* Bottom Card Graphic Area */}
            <div className="bg-[#f0f8f4] border-t border-emerald-100 p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Schneider Electric</span>
                <span className="text-[9px] font-semibold text-emerald-800">EcoStruxure Plant Integration</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">DCS Gateway Active</span>
              </div>
            </div>

          </div>

          {/* Green glow behind the card */}
          <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] z-0 rounded-full"></div>

          <div className="mt-6 text-center text-xs text-gray-400 font-medium">
            © 2025 Schneider Electric. Kaizen Intelligence Platform. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
}
