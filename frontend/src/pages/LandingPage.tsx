import React from 'react';
import { 
  Mountain, 
  Play, 
  ArrowRight, 
  Zap, 
  Leaf, 
  Settings, 
  TrendingUp, 
  AlertTriangle,
  Database,
  Brain,
  Lightbulb,
  MapPin,
  Pickaxe,
  Hammer,
  Factory,
  Thermometer,
  Wind,
  Container,
  Truck,
  Recycle,
  ShieldCheck,
  Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen font-sans text-gray-800 bg-white">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 text-green-700">
            <Mountain className="w-8 h-8 fill-current" />
            <Mountain className="w-6 h-6 fill-current opacity-75" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl leading-none tracking-tight text-gray-900">KAIZEN</span>
            <span className="text-[0.6rem] text-gray-500 font-medium">Change For Better.</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <a href="#" className="text-gray-900 border-b-2 border-green-600 pb-1">Home</a>
          <a href="#" className="hover:text-green-600 transition-colors">How It Works</a>
          <a href="#" className="hover:text-green-600 transition-colors">Plant Coverage</a>
          <a href="#" className="hover:text-green-600 transition-colors">Impact</a>
          <a href="#" className="hover:text-green-600 transition-colors">About</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-[#106c35] px-3 py-2 transition-colors">
            Sign In
          </Link>
          <Link to="/signup">
            <button className="bg-[#106c35] hover:bg-[#0c572b] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-green-900/10 flex items-center gap-1.5">
              <span>Register Plant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative w-full h-[600px] bg-gray-900 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Cement Plant" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full flex justify-between items-center">
          <div className="max-w-2xl">
            <p className="text-green-400 text-xs font-bold tracking-wider mb-4 uppercase flex items-center gap-2">
              <Zap size={14}/> KAIZEN Intelligence Platform • Schneider Electric
            </p>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Same Production.<br/>
              Less Energy.<br/>
              <span className="text-green-400">Smarter Improvement.</span>
            </h1>
            <p className="text-gray-300 text-xl font-medium mb-2 max-w-xl">
              See the Loss. Find the Cause. Improve the Process. Hold the Gain.
            </p>
            <p className="text-gray-400 text-md mb-8 max-w-xl leading-relaxed">
              Transform your cement plant with an AI-powered continuous improvement platform that bridges the gap between raw data and verified, sustainable savings.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <button className="bg-emerald-400 hover:bg-emerald-300 text-gray-950 px-7 py-3.5 rounded-xl font-extrabold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:scale-105">
                  Register Your Plant <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/login">
                <button className="border border-white/40 hover:bg-white/10 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all backdrop-blur-sm">
                  Sign In to Live DCS
                </button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative mr-8 mt-12">
            {/* Handwritten note */}
            <div className="absolute -top-12 -left-8 transform -rotate-6">
              <p className="font-caveat text-white text-xl">Turn plant data<br/>into real savings <span className="inline-block transform rotate-[120deg] translate-y-2">➔</span></p>
            </div>
            {/* Right side handwritten note */}
            <div className="absolute -top-16 -right-24 transform rotate-6">
               <p className="font-caveat text-green-300 text-2xl whitespace-nowrap">Efficient Today<br/><span className="text-white">Sustainable<br/>Tomorrow</span></p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-80 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-lg text-white">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">12%</div>
                    <div className="text-gray-300 text-sm">Lower Energy Use</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-lg text-white">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">18%</div>
                    <div className="text-gray-300 text-sm">Lower CO₂ Emissions</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-lg text-white">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">Higher</div>
                    <div className="text-gray-300 text-sm">Equipment Reliability</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-lg text-white">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">Same or Higher</div>
                    <div className="text-gray-300 text-sm">Production</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row overflow-hidden relative">
          
          <div className="p-10 flex-1 relative z-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-100 text-red-500 rounded-full flex-shrink-0">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">The Problem</h3>
                <p className="font-semibold text-gray-800 mb-4">Cement plants use more energy than necessary.</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  With thousands of machines and process parameters, it is hard for operators to quickly see where energy is being wasted, why it is happening, and what to do about it. This leads to higher electricity and fuel costs, more emissions, and unexpected equipment breakdowns.
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center -ml-6 z-20">
            <div className="bg-white border border-gray-100 shadow-sm p-3 rounded-full text-gray-400">
               <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          <div className="p-10 flex-1 bg-gray-50/50 border-l border-gray-100 relative z-10">
             <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full flex-shrink-0">
                <Leaf className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Solution</h3>
                <p className="font-semibold text-green-600 mb-4">An AI-powered plant co-pilot.</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Kaizen collects real-time data from across the plant, understands it using AI, finds inefficiencies, predicts problems, and recommends the best actions — in simple language that anyone can understand.
                </p>
              </div>
            </div>
          </div>

          <div className="p-10 lg:w-72 bg-green-50 flex items-center justify-center">
            <div className="relative">
              <Quote className="w-8 h-8 text-green-300 absolute -top-4 -left-4 transform rotate-180" />
              <p className="text-green-900 font-medium text-lg leading-snug relative z-10 italic">
                Make every ton of cement more efficient and more sustainable.
              </p>
              <Quote className="w-8 h-8 text-green-300 absolute -bottom-4 -right-4" />
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-8 max-w-7xl mx-auto border-t border-gray-100">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-[#1a2b3c] mb-2">How Kaizen Makes Your Plant More Efficient</h2>
          <p className="text-gray-600 text-lg">From data to action — in a way that's simple, visual and practical.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          <div className="flex-1 flex gap-4 md:gap-8 justify-between relative">
            <div className="absolute top-8 left-12 right-12 h-0.5 bg-gray-200 -z-10 hidden md:block"></div>
            
            <div className="flex-1 text-center group">
              <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform shadow-sm">
                <Database className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">1. Collects Real-Time Data</h4>
              <p className="text-gray-500 text-xs md:text-sm">Connects to your existing instruments, DCS/SCADA and sensors across the plant.</p>
            </div>

            <div className="hidden md:flex mt-8 text-gray-300"><ArrowRight className="w-5 h-5"/></div>

            <div className="flex-1 text-center group">
              <div className="w-16 h-16 mx-auto bg-purple-50 rounded-full flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform shadow-sm">
                <Brain className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">2. Finds What's Wrong</h4>
              <p className="text-gray-500 text-xs md:text-sm">AI analyzes the data to detect energy waste, process inefficiencies and early signs of equipment problems.</p>
            </div>

            <div className="hidden md:flex mt-8 text-gray-300"><ArrowRight className="w-5 h-5"/></div>

            <div className="flex-1 text-center group">
              <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-transform shadow-sm">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">3. Recommends Actions</h4>
              <p className="text-gray-500 text-xs md:text-sm">Gives clear, practical suggestions (e.g., adjust a fan speed, optimize a mill setting) to reduce energy use.</p>
            </div>

            <div className="hidden md:flex mt-8 text-gray-300"><ArrowRight className="w-5 h-5"/></div>

            <div className="flex-1 text-center group">
              <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform shadow-sm">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">4. Delivers Real Results</h4>
              <p className="text-gray-500 text-xs md:text-sm">Lower energy and fuel consumption, higher reliability, lower emissions — without reducing production or quality.</p>
            </div>
          </div>

          <div className="w-full lg:w-80 bg-gray-50 border border-gray-100 p-6 rounded-xl shadow-sm mt-8 lg:mt-0">
             <h4 className="font-bold text-[#1a2b3c] mb-4 text-lg">It's like a GPS for your plant</h4>
             <div className="flex gap-4 items-start">
               <div className="text-green-600 flex-shrink-0 mt-1">
                 <MapPin className="w-6 h-6 fill-current text-white stroke-green-600 stroke-2" />
               </div>
               <p className="text-sm text-gray-600 leading-relaxed">
                 Just like a GPS shows you the best route to reach your destination, Kaizen shows the best operating path to produce cement using <span className="font-semibold text-green-700">minimum energy and resources</span>.
               </p>
             </div>
          </div>

        </div>
      </section>

      {/* PLANT COVERAGE */}
      <section className="py-16 px-8 max-w-7xl mx-auto border-t border-gray-100">
        <div className="mb-16 relative">
          <h2 className="text-3xl font-extrabold text-[#1a2b3c] mb-2">Covers Your Entire Integrated Cement Plant</h2>
          <p className="text-gray-600 text-lg">One platform. Complete visibility. End-to-end optimization.</p>
          <div className="absolute right-0 bottom-0 transform translate-y-8 hidden md:block">
            <p className="font-caveat text-green-700 text-2xl -rotate-6">From Raw Materials<br/>to Real Impact <span className="inline-block transform rotate-45 translate-y-1">➔</span></p>
          </div>
        </div>

        <div className="bg-green-50/50 border border-green-100 rounded-full py-8 px-12 overflow-x-auto">
          <div className="min-w-max flex items-center justify-between gap-4">
            
            {[
              { icon: Pickaxe, label: "Mine" },
              { icon: Hammer, label: "Crusher" },
              { icon: Factory, label: "Raw Mill" },
              { icon: Thermometer, label: "Kiln & Preheater" },
              { icon: Wind, label: "Cooler" },
              { icon: Container, label: "Clinker Storage" },
              { icon: Settings, label: "Cement Mill" },
              { icon: Truck, label: "Packing & Dispatch" },
              { icon: Zap, label: "Captive Power Plant" },
              { icon: Recycle, label: "WHRS" },
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center group cursor-default">
                  <step.icon className="w-10 h-10 text-green-700 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-gray-800 text-center">{step.label}</span>
                </div>
                {idx < arr.length - 1 && (
                  <div className="text-green-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </React.Fragment>
            ))}

          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-[#1a2b3c] text-white py-16 px-8 rounded-t-3xl mt-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Build a More Efficient and Sustainable Tomorrow</h2>
          <p className="text-gray-300 text-lg mb-10">Turn your plant data into real savings — with Kaizen.</p>
          
          <div className="flex justify-center gap-6 mb-16 flex-wrap">
            <Link to="/signup">
              <button className="bg-emerald-400 hover:bg-emerald-300 text-gray-900 px-8 py-3.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:scale-105">
                Register Your Plant <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/login">
              <button className="border-2 border-gray-600 hover:border-emerald-400 text-white px-8 py-3.5 rounded-full font-semibold transition-colors">
                Sign In to DCS
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-gray-700 pt-12">
            <div className="flex flex-col items-center">
              <Leaf className="w-10 h-10 text-green-400 mb-3" />
              <span className="text-sm font-semibold text-gray-300 text-center">Lower<br/>Emissions</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-10 h-10 text-green-400 mb-3" />
              <span className="text-sm font-semibold text-gray-300 text-center">Lower<br/>Operating Cost</span>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="w-10 h-10 text-green-400 mb-3" />
              <span className="text-sm font-semibold text-gray-300 text-center">Higher<br/>Productivity</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-10 h-10 text-green-400 mb-3" />
              <span className="text-sm font-semibold text-gray-300 text-center">More Reliable<br/>Operations</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Required style for handwritten font */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
        .font-caveat { font-family: 'Caveat', cursive; }
      `}} />
    </div>
  );
};

export default LandingPage;
