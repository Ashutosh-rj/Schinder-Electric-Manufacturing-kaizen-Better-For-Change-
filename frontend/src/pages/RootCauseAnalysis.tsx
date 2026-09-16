import React, { useState } from 'react';
import { Share2, FileText, ChevronRight, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

const RootCauseAnalysis = () => {
  const [activeTab, setActiveTab] = useState('5why');

  return (
    <div className="flex flex-col h-full bg-[#041116] text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-wide">Root Cause Analysis</h1>
          <p className="text-[11px] text-[#8899aa] uppercase tracking-wider">Project: KAI-3001 | Cement Mill 1 Energy Loss</p>
        </div>
        <div className="flex bg-[#091b24] p-1 rounded-lg border border-[#15303f]">
          <button 
            onClick={() => setActiveTab('5why')}
            className={`px-4 py-1.5 text-[12px] font-bold rounded ${activeTab === '5why' ? 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30' : 'text-[#5a7384] hover:text-white'}`}
          >
            5-Why Analysis
          </button>
          <button 
            onClick={() => setActiveTab('fishbone')}
            className={`px-4 py-1.5 text-[12px] font-bold rounded ${activeTab === 'fishbone' ? 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30' : 'text-[#5a7384] hover:text-white'}`}
          >
            6M Fishbone
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#091b24] border border-[#15303f] rounded-xl flex overflow-hidden shadow-lg">
        {/* Left Side: Problem Statement */}
        <div className="w-[300px] border-r border-[#15303f] bg-[#041116] p-5 flex flex-col">
          <div className="text-[10px] text-[#ef5350] font-bold tracking-wider mb-2 flex items-center gap-1"><AlertTriangle size={12}/> PROBLEM STATEMENT</div>
          <h3 className="text-[15px] font-bold text-white mb-4">Specific Energy Consumption is 10.8% above target in CM1.</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-[10px] text-[#5a7384] uppercase mb-1">Impact</div>
              <div className="text-[14px] text-[#ffa726] font-bold">₹42,000/day</div>
            </div>
            <div>
              <div className="text-[10px] text-[#5a7384] uppercase mb-1">Detected</div>
              <div className="text-[13px] text-white">2026-09-14 08:30</div>
            </div>
            <div>
              <div className="text-[10px] text-[#5a7384] uppercase mb-1">AI Confidence</div>
              <div className="text-[13px] text-[#00d4ff] font-bold">87%</div>
            </div>
          </div>

          <div className="mt-auto">
             <button className="w-full bg-[#00e676] hover:bg-[#00c853] text-[#041116] py-2.5 rounded-lg text-[12px] font-bold flex justify-center items-center gap-2 transition-colors">
               PROCEED TO COUNTERMEASURE <ArrowRight size={14}/>
             </button>
          </div>
        </div>

        {/* Right Side: Analysis */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === '5why' ? (
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#15303f] flex items-center justify-center font-bold text-[#8899aa]">1</div>
                <div className="flex-1 bg-[#041116] border border-[#1c3a4a] p-3 rounded-lg flex items-center justify-between">
                  <span className="text-[13px]">Higher fan power consumption than design.</span>
                </div>
              </div>
              <div className="flex justify-center w-8 text-[#5a7384]"><ChevronRight className="rotate-90" size={16}/></div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#15303f] flex items-center justify-center font-bold text-[#8899aa]">2</div>
                <div className="flex-1 bg-[#041116] border border-[#1c3a4a] p-3 rounded-lg flex items-center justify-between">
                  <span className="text-[13px]">Airflow is higher than required for current production rate.</span>
                </div>
              </div>
              <div className="flex justify-center w-8 text-[#5a7384]"><ChevronRight className="rotate-90" size={16}/></div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#15303f] flex items-center justify-center font-bold text-[#8899aa]">3</div>
                <div className="flex-1 bg-[#041116] border border-[#1c3a4a] p-3 rounded-lg flex items-center justify-between">
                  <span className="text-[13px]">Operating point is inefficient on the fan curve.</span>
                </div>
              </div>
              <div className="flex justify-center w-8 text-[#5a7384]"><ChevronRight className="rotate-90" size={16}/></div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#00d4ff]/20 text-[#00d4ff] flex items-center justify-center font-bold border border-[#00d4ff]/30">4</div>
                <div className="flex-1 bg-[#00d4ff]/5 border border-[#00d4ff]/30 p-3 rounded-lg flex items-center justify-between relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00d4ff]"></div>
                  <div className="flex flex-col ml-2">
                    <span className="text-[10px] text-[#00d4ff] font-bold tracking-wider mb-1">ROOT CAUSE</span>
                    <span className="text-[14px] text-white font-bold">Process condition mismatch (Fan speed vs Feed rate).</span>
                  </div>
                  <CheckCircle2 size={20} className="text-[#00d4ff]"/>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#15303f]">
                <button className="text-[12px] text-[#8899aa] border border-[#2a4555] hover:bg-[#15303f] px-4 py-2 rounded-lg transition-colors">
                  + Add 'Why'
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
               <div className="text-center text-[#5a7384]">
                 <Share2 size={48} className="mx-auto mb-4 opacity-50" />
                 <p className="text-[14px]">6M Fishbone Diagram Visualization</p>
                 <p className="text-[11px] mt-2">Diagram renders here using D3/SVG based on RCA backend data.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RootCauseAnalysis;
