import React, { useState } from 'react';
import { Send, Sparkles, AlertTriangle, ChevronRight, Activity } from 'lucide-react';
import { api } from '../lib/api';

const KaizenCopilot = () => {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'ai',
      content: 'I am your Kaizen Copilot. I can analyze process deviations, energy inefficiencies, and equipment health based on real-time plant telemetry. How can I help you today?',
      evidence: [], causes: [], recs: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if(!input.trim() || loading) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/copilot/query', { query: input });
      const data = res.data;
      
      const aiMsg = {
        role: 'ai',
        content: data.answer,
        evidence: data.evidence || [],
        causes: data.root_causes || [],
        recs: data.recommendations || []
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Error communicating with Kaizen AI Engine.',
        evidence: [], causes: [], recs: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full gap-4">
      {/* Chat Area */}
      <div className="w-3/5 flex flex-col bg-[#1a2540] rounded-lg border border-[#1c3a4a] overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[#1c3a4a] bg-[#0a0e1a] flex items-center gap-2">
          <Sparkles className="text-[#00d4ff]" />
          <h2 className="font-bold">Kaizen Copilot</h2>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-4 ${m.role === 'user' ? 'bg-[#00d4ff]/10 text-white border border-[#00d4ff]/30' : 'bg-[#0a0e1a] text-gray-200 border border-[#1c3a4a]'}`}>
                {m.role === 'ai' && <div className="font-bold text-[#00d4ff] mb-2 flex items-center gap-2"><Sparkles size={16}/> Kaizen AI</div>}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>
                
                {m.causes && m.causes.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm font-bold text-gray-400">Probable Causes:</div>
                    {m.causes.map((c: any, j: number) => (
                      <div key={j} className="text-sm">
                        <div className="flex justify-between text-xs mb-1 text-gray-300"><span>{j+1}. {c.cause}</span><span>{Math.round(c.probability * 100)}%</span></div>
                        <div className="w-full bg-gray-900 rounded-full h-1"><div className="bg-[#00d4ff] h-1 rounded-full" style={{width: `${c.probability * 100}%`}}></div></div>
                      </div>
                    ))}
                  </div>
                )}
                
                {m.recs && m.recs.length > 0 && (
                  <div className="mt-4 bg-[#ffa726]/10 border border-[#ffa726]/30 p-3 rounded">
                    <div className="text-xs font-bold text-[#ffa726] mb-2 flex items-center gap-1"><AlertTriangle size={12}/> ADVISORY RECOMMENDATIONS</div>
                    <ul className="text-sm list-disc pl-4 text-gray-300 space-y-1">
                      {m.recs.map((r: any, j: number) => <li key={j}>{r.action}</li>)}
                    </ul>
                  </div>
                )}
                
                {m.role === 'ai' && m.evidence && m.evidence.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                     {m.evidence.map((ev: any, j: number) => (
                        <div key={j} className="bg-[#1a2540] border border-[#15303f] px-2 py-1 rounded text-xs flex flex-col">
                           <span className="text-gray-500">{ev.tag}</span>
                           <span className={ev.status === 'HIGH' ? 'text-[#ef5350]' : ev.status === 'LOW' ? 'text-[#ffa726]' : 'text-[#00e676]'}>{ev.current} (Norm: {ev.normal})</span>
                        </div>
                     ))}
                  </div>
                )}
                
                {m.role === 'ai' && <div className="text-[10px] text-gray-500 mt-3 text-right">⚠️ All recommendations are advisory. Validation required.<br/>[SIMULATED DATA]</div>}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex items-start">
               <div className="bg-[#0a0e1a] border border-[#1c3a4a] text-[#00d4ff] rounded-lg p-3 text-sm flex items-center gap-2">
                 <Activity size={16} className="animate-spin" /> Analyzing telemetry...
               </div>
             </div>
          )}
        </div>

        <div className="p-4 bg-[#0a0e1a] border-t border-[#1c3a4a]">
          <div className="flex gap-2 mb-2 overflow-x-auto custom-scrollbar pb-2">
            {["Why is Raw Mill production low?", "What is current energy SEC?", "Which equipment may fail?"].map(q => (
              <button key={q} onClick={() => setInput(q)} className="whitespace-nowrap px-3 py-1 bg-[#1a2540] hover:bg-[#1c3a4a] text-xs text-gray-300 rounded-full border border-gray-700 transition-colors">
                {q}
              </button>
            ))}
          </div>
          <div className="relative">
            <textarea 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Kaizen Copilot about plant performance..."
              className="w-full bg-[#1a2540] border border-gray-700 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-[#00d4ff] resize-none h-12"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 bg-[#00d4ff] text-[#041116] p-1.5 rounded hover:bg-[#00b3e6] transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Context */}
      <div className="w-2/5 flex flex-col gap-4">
        <div className="bg-[#1a2540] rounded-lg border border-[#1c3a4a] p-4 flex-1 shadow-lg">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-300">
            <Activity size={18} className="text-[#ffa726]" /> Active Context
          </h3>
          <div className="space-y-4">
            <div className="bg-[#0a0e1a] p-3 rounded border border-gray-800">
              <div className="text-xs text-gray-500 mb-1">Time Horizon</div>
              <div className="font-bold">Last 2 Hours (Live Telemetry)</div>
            </div>
            <div className="bg-[#0a0e1a] p-3 rounded border border-gray-800">
              <div className="text-xs text-gray-500 mb-1">Data Sources</div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-[#00d4ff]/10 text-[#00d4ff] px-2 py-1 rounded">Process Telemetry</span>
                <span className="text-xs bg-[#00e676]/10 text-[#00e676] px-2 py-1 rounded">Alarm History</span>
                <span className="text-xs bg-[#ffa726]/10 text-[#ffa726] px-2 py-1 rounded">Equipment Health</span>
              </div>
            </div>
            <div className="bg-[#0a0e1a] p-3 rounded border border-[#ef5350]/30 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-12 h-12 bg-[#ef5350]/10 rounded-bl-full flex items-start justify-end pr-2 pt-2"><AlertTriangle size={16} className="text-[#ef5350]" /></div>
              <div className="text-xs text-gray-500 mb-1">Active Alerts in Context</div>
              <div className="font-bold text-sm mb-1 text-white">CM1 Mill Motor Bearing Temp High</div>
              <div className="text-xs text-[#ef5350]">95°C / 90°C</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaizenCopilot;
