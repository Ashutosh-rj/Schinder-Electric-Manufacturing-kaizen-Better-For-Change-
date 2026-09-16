import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';
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
  QrCode, 
  Cloud, 
  ShieldCheck,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@kaizen.io');
  const [password, setPassword] = useState('kaizen123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('password');
  
  const setToken = useAuthStore(s => s.setToken);
  const setUser = useAuthStore(s => s.setUser);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.access_token);
      setUser(res.data.user);
      navigate('/overview');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed. Please check credentials.');
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        {/* Subtle green glow for background */}
        <div className="absolute inset-0 bg-green-900/10 mix-blend-color"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row h-full min-h-screen p-6 lg:p-12">
        
        {/* LEFT SIDE: Branding & Info */}
        <div className="flex-1 flex flex-col justify-between max-w-3xl pr-8">
          
          {/* Header */}
          <div className="flex items-start justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="font-bold text-2xl tracking-tight">Schneider</span>
              <span className="font-light text-2xl tracking-tight">Electric</span>
              <div className="w-px h-6 bg-white/30 mx-2"></div>
              <span className="text-lg">Life Is On</span>
            </div>
          </div>

          {/* Hero Text */}
          <div className="mt-16 lg:mt-24">
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-4">
              From Rock <br/>
              to a <span className="text-[#38b259]">Better Tomorrow</span>
            </h1>
            <p className="text-xl text-gray-300 font-medium">
              One Platform. A More Efficient Cement Plant.
            </p>
          </div>

          {/* Features Row */}
          <div className="flex flex-wrap items-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Eye className="w-5 h-5 text-green-400" /> Real-time Visibility
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Brain className="w-5 h-5 text-green-400" /> AI-driven Insights
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Leaf className="w-5 h-5 text-green-400" /> Lower Energy Use
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <TrendingUp className="w-5 h-5 text-green-400" /> Sustainable Growth
            </div>
          </div>

          {/* Abstract Plant Diagram (Badges) */}
          <div className="relative h-64 mt-12 hidden lg:block">
            {/* Glowing lines representation */}
            <svg className="absolute inset-0 w-full h-full" style={{zIndex: -1}}>
               <path d="M 50 150 L 150 150 L 250 80 L 400 80 L 500 150 L 600 150" fill="none" stroke="rgba(74, 222, 128, 0.4)" strokeWidth="2" strokeDasharray="5,5" />
               <circle cx="50" cy="150" r="4" fill="#4ade80" />
               <circle cx="150" cy="150" r="4" fill="#4ade80" />
               <circle cx="250" cy="80" r="4" fill="#4ade80" />
               <circle cx="400" cy="80" r="4" fill="#4ade80" />
               <circle cx="500" cy="150" r="4" fill="#4ade80" />
               <circle cx="600" cy="150" r="4" fill="#4ade80" />
            </svg>

            <div className="absolute top-[120px] left-[10px] bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2.5 flex items-center gap-3">
              <div className="bg-green-500/20 p-1.5 rounded text-green-400"><Pickaxe className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold leading-none mb-1">Mine</p><p className="text-[10px] text-gray-400 leading-none">Optimal Extraction</p></div>
            </div>

            <div className="absolute top-[120px] left-[160px] bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2.5 flex items-center gap-3">
              <div className="bg-green-500/20 p-1.5 rounded text-green-400"><Factory className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold leading-none mb-1">Raw Mill</p><p className="text-[10px] text-gray-400 leading-none">Energy Optimized</p></div>
            </div>

            <div className="absolute top-[50px] left-[270px] bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2.5 flex items-center gap-3">
              <div className="bg-green-500/20 p-1.5 rounded text-green-400"><Thermometer className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold leading-none mb-1">Kiln</p><p className="text-[10px] text-gray-400 leading-none">Stable & Efficient</p></div>
            </div>
            
            <div className="absolute top-[120px] left-[380px] bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2.5 flex items-center gap-3">
              <div className="bg-green-500/20 p-1.5 rounded text-green-400"><Settings className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold leading-none mb-1">Cement Mill</p><p className="text-[10px] text-gray-400 leading-none">Higher Productivity</p></div>
            </div>

            <div className="absolute top-[40px] left-[460px] bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2.5 flex items-center gap-3">
              <div className="bg-green-500/20 p-1.5 rounded text-green-400"><Zap className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold leading-none mb-1">WHRS</p><p className="text-[10px] text-gray-400 leading-none">Recovering Energy</p></div>
            </div>

            <div className="absolute top-[140px] left-[550px] bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2.5 flex items-center gap-3">
              <div className="bg-green-500/20 p-1.5 rounded text-green-400"><Truck className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold leading-none mb-1">Packaging</p><p className="text-[10px] text-gray-400 leading-none">On-time Dispatch</p></div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-auto mb-8 bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6 max-w-4xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#38b259] to-transparent"></div>
            <div className="flex items-center gap-4">
              <Leaf className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-xl font-bold">12%</div>
                <div className="text-xs text-gray-400">Lower Energy Use</div>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20 hidden lg:block"></div>
            <div className="flex items-center gap-4">
              <Cloud className="w-8 h-8 text-white" />
              <div>
                <div className="text-xl font-bold">18%</div>
                <div className="text-xs text-gray-400">Lower Emissions</div>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20 hidden lg:block"></div>
            <div className="flex items-center gap-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-xl font-bold">Higher</div>
                <div className="text-xs text-gray-400">Plant Productivity</div>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20 hidden lg:block"></div>
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-xl font-bold">More Reliable</div>
                <div className="text-xs text-gray-400">Operations</div>
              </div>
            </div>
          </div>

          {/* Quote & Footer */}
          <div>
            <p className="text-xl italic font-serif text-gray-300 mb-8">
              "Efficient today. Sustainable tomorrow."
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
              <a href="#" className="hover:text-white transition-colors">Help</a> |
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a> |
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a> |
              <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Login Card */}
        <div className="w-full lg:w-[480px] mt-12 lg:mt-0 flex flex-col justify-center relative">
          
          {/* Top Right Header for large screens */}
          <div className="absolute -top-6 right-0 text-right hidden lg:block">
             <p className="text-sm font-semibold text-gray-300">Smarter Plants.</p>
             <p className="text-sm font-semibold text-gray-300">Greener Tomorrow.</p>
             <div className="w-12 h-0.5 bg-green-500 ml-auto mt-2"></div>
          </div>

          <div className="bg-white text-gray-900 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(34,197,94,0.15)] flex flex-col z-10 relative">
            <div className="p-8 pb-6 flex-1 relative">
              
              {/* Language Selector */}
              <div className="absolute top-6 right-6">
                <button className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <Globe className="w-3.5 h-3.5" /> English <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-8 mb-8 text-center">
                <h2 className="text-3xl font-extrabold mb-2">Welcome <span className="text-[#138a43]">Back</span></h2>
                <p className="text-sm text-gray-500 font-medium">Login to your Kaizen account to continue</p>
              </div>

              {/* Login Tabs */}
              <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                <button 
                  onClick={() => setActiveTab('password')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'password' ? 'bg-[#106c35] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <Lock className="w-4 h-4" /> Password Login
                </button>
                <button 
                  onClick={() => setActiveTab('sso')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'sso' ? 'bg-[#106c35] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <Building2 className="w-4 h-4" /> SSO
                </button>
                <button 
                  onClick={() => setActiveTab('qr')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'qr' ? 'bg-[#106c35] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <QrCode className="w-4 h-4" /> QR Login
                </button>
              </div>

              {activeTab === 'password' && (
                <form onSubmit={handleLogin} className="space-y-5">
                  
                  {/* Demo Creds Note (Only visible to help user) */}
                  <div className="text-[10px] text-gray-400 text-center -mt-4 mb-2">
                    Using demo credentials (admin@kaizen.io)
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email / Employee ID</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#138a43] focus:border-transparent outline-none transition-all"
                        placeholder="Enter your email or employee ID"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="block w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#138a43] focus:border-transparent outline-none transition-all"
                        placeholder="Enter your password"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600">
                        <EyeOff className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="text-right mt-2">
                      <a href="#" className="text-xs font-bold text-[#138a43] hover:underline">Forgot Password?</a>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#106c35] hover:bg-[#0c5328] text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 shadow-lg shadow-green-900/20 mt-2"
                  >
                    {loading ? 'Authenticating...' : 'Login'} <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase">OR</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold transition-all"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#f35325" d="M1 1h10v10H1z"/>
                      <path fill="#81bc06" d="M12 1h10v10H12z"/>
                      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                      <path fill="#ffba08" d="M12 12h10v10H12z"/>
                    </svg>
                    Continue with Microsoft
                  </button>

                </form>
              )}

              {activeTab !== 'password' && (
                <div className="py-12 text-center text-gray-500 font-medium">
                  This login method is currently mocked for demo purposes. Please use Password Login.
                </div>
              )}
            </div>

            {/* Bottom Card Footer Graphic Area */}
            <div className="bg-[#f0f8f4] border-t border-green-100 p-6 flex flex-col relative overflow-hidden">
              {/* Abstract decorative plant background via SVG or classes */}
              <div className="absolute bottom-0 left-0 w-full opacity-30 pointer-events-none">
                 <svg viewBox="0 0 400 100" className="w-full h-auto text-green-800" fill="currentColor">
                   <path d="M0,100 L0,70 L20,70 L20,50 L40,50 L40,70 L60,70 L60,30 L80,30 L80,70 L120,70 L120,40 L150,40 L150,70 L200,70 L200,20 L220,20 L220,70 L280,70 L280,45 L320,45 L320,70 L400,70 L400,100 Z" opacity="0.1"/>
                   <path d="M0,100 L0,80 L30,80 L30,60 L50,60 L50,80 L90,80 L90,50 L110,50 L110,80 L160,80 L160,35 L190,35 L190,80 L250,80 L250,60 L290,60 L290,80 L400,80 L400,100 Z" opacity="0.2"/>
                 </svg>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Powering</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sustainable Industry</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5 text-[#106c35]">
                    <Factory className="w-6 h-6 fill-current" />
                    <Leaf className="w-5 h-5 fill-current opacity-90 relative top-1.5" />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-extrabold text-sm leading-none tracking-tight text-gray-900">KAIZEN</span>
                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Change for Better</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Green glow behind the card */}
          <div className="absolute inset-0 bg-green-500/20 blur-[100px] z-0 rounded-full"></div>

          <div className="mt-8 text-center lg:text-right text-xs text-gray-500 font-medium hidden lg:block z-10">
            © 2025 Schneider Electric. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
}
