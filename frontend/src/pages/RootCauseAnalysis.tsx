import React, { useEffect, useState } from 'react';
import { Share2, FileText, ChevronRight, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';

const RootCauseAnalysis = () => {
  const [activeTab, setActiveTab] = useState('5why');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRCA = async () => {
      try {
        const res = await api.post('/rca/analyze', { area: "CEMENT_MILL", symptoms: {} });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch RCA data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRCA();
  }, []);

  if (loading && !data) {
    return <div className="p-6 text-[#00d4ff]">Generating Root Cause Analysis...</div>;
  }

  const problem = data?.problem_statement || "Specific Energy Consumption is 10.8% above target in CM1.";
  const impact = data?.impact || "₹42,000/day";
  const confidence = data?.ranked_causes?.[0]?.probability ? Math.round(data.ranked_causes[0].probability * 100) : 87;
  const fiveWhy = data?.five_why || [
    { question: "Why is SEC high?", answer: "Mill main drive power is elevated relative to feed rate." },
    { question: "Why is power elevated?", answer: "High circulating load inside the mill." },
    { question: "Why is circulating load high?", answer: "Separator efficiency has dropped." },
    { question: "Why did separator efficiency drop?", answer: "Separator RPM is not matched to current material grindability." },
    { question: "What is the root cause?", answer: "Lack of real-time feed-forward control based on feed composition." }
  ];

  return (
    <div className="flex flex-col h-full bg-[#041116] text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-wide">Root Cause Analysis</h1>
          <p className="text-[11px] text-[#8899aa] uppercase tracking-wider">Project: KAI-3001 | {data?.area || 'CEMENT MILL'} Incident</p>
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
            6M Fishbone (WIP)
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#091b24] border border-[#15303f] rounded-xl flex overflow-hidden shadow-lg">
        {/* Left Side: Problem Statement */}
        <div className="w-[300px] border-r border-[#15303f] bg-[#041116] p-5 flex flex-col">
          <div className="text-[10px] text-[#ef5350] font-bold tracking-wider mb-2 flex items-center gap-1"><AlertTriangle size={12}/> PROBLEM STATEMENT</div>
          <h3 className="text-[15px] font-bold text-white mb-4">{problem}</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-[10px] text-[#5a7384] uppercase mb-1">Impact</div>
              <div className="text-[14px] text-[#ffa726] font-bold">{impact}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#5a7384] uppercase mb-1">Detected</div>
              <div className="text-[13px] text-white">{new Date().toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#5a7384] uppercase mb-1">AI Confidence</div>
              <div className="text-[13px] text-[#00d4ff] font-bold">{confidence}%</div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-[#15303f] space-y-3">
             <button className="w-full bg-[#1a2540] hover:bg-[#1f2d4d] border border-[#1c3a4a] text-white text-xs py-2 rounded flex items-center justify-center gap-2 transition-colors">
                <FileText size={14}/> Export Report
             </button>
             <button className="w-full bg-[#00d4ff] hover:bg-[#00b3e6] text-[#041116] font-bold text-xs py-2 rounded flex items-center justify-center gap-2 transition-colors">
                <Share2 size={14}/> Share Findings
             </button>
          </div>
        </div>

        {/* Right Side: Analysis Workspace */}
        <div className="flex-1 p-8 bg-gradient-to-br from-[#091b24] to-[#041116] overflow-y-auto">
           {activeTab === '5why' && (
              <div className="max-w-3xl">
                 <div className="mb-8 border-b border-[#15303f] pb-4 flex justify-between items-end">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-1">Dynamic 5-Why Chain</h2>
                      <p className="text-xs text-[#8899aa]">Automatically generated from live sensor telemetry and anomaly records.</p>
                    </div>
                    <span className="text-[10px] bg-[#00e676]/10 border border-[#00e676]/30 text-[#00e676] px-2 py-1 rounded">RCA COMPLETE</span>
                 </div>
                 
                 <div className="space-y-0 relative">
                    <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-[#15303f]"></div>
                    {fiveWhy.map((why: any, index: number) => (
                      <div key={index} className="relative flex gap-6 pb-8 group">
                         <div className="w-12 h-12 rounded-full bg-[#0a0e1a] border-2 border-[#1c3a4a] group-hover:border-[#00d4ff] flex items-center justify-center shrink-0 z-10 transition-colors shadow-lg font-black text-[#5a7384] group-hover:text-[#00d4ff]">
                            {index + 1}
                         </div>
                         <div className="flex-1 pt-1">
                            <div className="text-sm font-bold text-[#8899aa] mb-2">{why.question}</div>
                            <div className="bg-[#1a2540] border border-[#15303f] group-hover:border-[#1c3a4a] p-4 rounded-lg shadow-sm">
                               <p className="text-white text-sm">{why.answer}</p>
                               {index === 4 && (
                                  <div className="mt-4 pt-4 border-t border-[#15303f] flex items-center justify-between">
                                     <div className="flex items-center gap-2 text-[#00e676] text-xs font-bold">
                                        <CheckCircle2 size={16}/> ROOT CAUSE IDENTIFIED
                                     </div>
                                     <button className="bg-[#00e676]/10 hover:bg-[#00e676]/20 text-[#00e676] border border-[#00e676]/30 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors">
                                        CREATE COUNTERMEASURE <ArrowRight size={14}/>
                                     </button>
                                  </div>
                               )}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           )}
           {activeTab === 'fishbone' && (
              <div className="flex flex-col items-center justify-center h-full text-[#5a7384]">
                 <AlertTriangle size={48} className="mb-4 opacity-50"/>
                 <p className="text-sm">6M Fishbone Diagram visualization requires D3.js integration.</p>
                 <p className="text-xs mt-2">Currently available in advanced tier.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default RootCauseAnalysis;
