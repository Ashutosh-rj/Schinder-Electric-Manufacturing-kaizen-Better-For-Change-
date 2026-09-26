import React, { useState } from 'react';
import { 
  Send, Sparkles, AlertTriangle, ChevronRight, Activity, 
  CheckCircle2, Copy, Check, ArrowUpRight, Zap, RefreshCw, 
  ShieldCheck, BrainCircuit, ExternalLink, Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

const QUICK_PROMPTS = [
  "Why is Raw Mill production low?",
  "What is current energy SEC?",
  "Which equipment may fail next?",
  "How to optimize Kiln burning zone & cooler?",
  "Summarize plant executive performance"
];

const KaizenCopilot: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'ai',
      content: 'I am your Kaizen AI Copilot powered by Schneider Electric EcoStruxure. I continuously monitor 1,420 streaming DCS telemetry tags, active equipment health, and energy models to assist with real-time root-cause analysis, SEC optimization, and DMAIC project execution. How can I assist you today?',
      evidence: [],
      causes: [],
      recs: [],
      related_kaizen: ["KAI-3001", "KAI-3002"]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;
    
    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/copilot/query', { query });
      const data = res.data;
      
      const aiMsg = {
        role: 'ai',
        content: data.answer || 'Analysis complete.',
        evidence: data.evidence || [],
        causes: data.root_causes || [],
        recs: data.recommendations || [],
        related_kaizen: data.related_kaizen || [],
        confidence: data.confidence || '95%',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Copilot query failed", err);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Experienced a communication timeout with the Kaizen Telemetry Reasoning Engine. Please retry in a few seconds.',
        evidence: [], 
        causes: [], 
        recs: [],
        related_kaizen: []
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

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] gap-6 p-6 bg-slate-100 text-slate-800">
      
      {/* MAIN CHAT CONSOLE */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-w-0">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#106c35] to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/10">
              <BrainCircuit size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base text-gray-900 leading-tight">Kaizen AI Copilot</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  EcoStruxure Reasoning
                </span>
              </div>
              <p className="text-xs text-gray-500">Autonomous Cement Process & Telemetry Engineering Diagnostics</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live DCS Stream
            </span>
          </div>
        </div>
        
        {/* MESSAGES VIEWPORT */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {m.role === 'user' ? (
                /* USER MESSAGE */
                <div className="max-w-[80%] bg-[#106c35] text-white rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-sm text-sm font-medium leading-relaxed">
                  {m.content}
                </div>
              ) : (
                /* AI COPILOT CARD */
                <div className="max-w-[92%] bg-white rounded-2xl rounded-tl-sm p-5 border border-slate-200/90 shadow-sm text-slate-800 space-y-4">
                  
                  {/* AI Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        <Sparkles size={14} />
                      </div>
                      <span className="font-extrabold text-xs text-gray-900">Kaizen Industrial AI</span>
                      {m.confidence && (
                        <span className="text-[10px] text-gray-500 font-semibold">
                          • Confidence: <strong className="text-emerald-700">{m.confidence}</strong>
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => copyToClipboard(m.content, i)}
                      className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
                      title="Copy Answer"
                    >
                      {copiedIndex === i ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Main Answer Prose */}
                  <div className="text-sm leading-relaxed text-gray-800 font-normal whitespace-pre-wrap">
                    {m.content}
                  </div>

                  {/* Telemetry Evidence Tags */}
                  {m.evidence && m.evidence.length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Activity size={13} className="text-emerald-600" /> DCS Telemetry Observations
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {m.evidence.map((ev: any, j: number) => {
                          const isHigh = ev.status === 'HIGH';
                          const isLow = ev.status === 'LOW';
                          const isWarn = ev.status === 'WARNING';
                          return (
                            <div key={j} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono font-bold text-gray-500 truncate" title={ev.tag}>
                                  {ev.tag}
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  isHigh ? 'bg-rose-100 text-rose-700' :
                                  isLow ? 'bg-amber-100 text-amber-700' :
                                  isWarn ? 'bg-orange-100 text-orange-700' :
                                  'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {ev.status}
                                </span>
                              </div>
                              <div className="flex items-baseline justify-between mt-1">
                                <span className="text-xs font-extrabold text-gray-900">{ev.current}</span>
                                <span className="text-[10px] text-gray-400">Norm: {ev.normal}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Probable Root Causes */}
                  {m.causes && m.causes.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Ranked Root Cause Hypotheses
                      </div>
                      <div className="space-y-2">
                        {m.causes.map((c: any, j: number) => {
                          const probPct = Math.round((c.probability || 0) * 100);
                          return (
                            <div key={j} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                              <div className="flex justify-between items-center text-xs font-semibold text-gray-800 mb-1.5">
                                <span className="truncate pr-2">{j + 1}. {c.cause}</span>
                                <span className="font-mono font-bold text-emerald-700">{probPct}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-[#106c35] h-1.5 rounded-full transition-all duration-500" 
                                  style={{ width: `${probPct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Advisory Recommendations */}
                  {m.recs && m.recs.length > 0 && (
                    <div className="pt-2">
                      <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5">
                        <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <AlertTriangle size={14} className="text-amber-600" /> Actionable Engineering Recommendations
                        </div>
                        <ul className="space-y-1.5">
                          {m.recs.map((r: any, j: number) => (
                            <li key={j} className="text-xs text-amber-950 font-medium flex items-start gap-2">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{r.action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Related Kaizen Dossier Links */}
                  {m.related_kaizen && m.related_kaizen.length > 0 && (
                    <div className="pt-2 flex items-center gap-2 flex-wrap border-t border-slate-100">
                      <span className="text-[11px] font-bold text-gray-500">Related Kaizen Projects:</span>
                      {m.related_kaizen.map((kId: string, idx: number) => (
                        <Link
                          key={idx}
                          to={`/kaizen-projects?id=${kId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold text-[#106c35] transition-colors"
                        >
                          <span>{kId} Dossier</span>
                          <ArrowUpRight size={13} />
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-gray-400 pt-1 text-right italic">
                    Schneider Electric EcoStruxure™ Industrial AI Advisory
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs font-bold text-emerald-800 flex items-center gap-2.5 shadow-sm">
                <RefreshCw size={15} className="animate-spin text-emerald-600" />
                Querying live telemetry tags & computing engineering root causes...
              </div>
            </div>
          )}
        </div>

        {/* INPUT BOX & QUICK PROMPTS */}
        <div className="p-4 bg-white border-t border-slate-200">
          {/* Quick Prompts */}
          <div className="flex gap-2 mb-3 overflow-x-auto custom-scrollbar pb-1">
            {QUICK_PROMPTS.map((q, idx) => (
              <button 
                key={idx} 
                onClick={() => handleSend(q)} 
                className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-xs font-semibold text-gray-600 rounded-full border border-slate-200 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="relative flex items-center">
            <textarea 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Ask Kaizen Copilot about plant bottlenecks, fan power, SEC targets, or equipment health..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-14 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#106c35] focus:ring-1 focus:ring-[#106c35] transition-all resize-none"
            />
            <button 
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-[#106c35] hover:bg-emerald-700 text-white p-2 rounded-xl shadow-sm transition-all disabled:opacity-40"
              title="Send Query"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: LIVE CONTEXT & HEALTH */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        
        {/* Plant Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-[#106c35]" />
              Plant Active Context
            </h3>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Unit 1
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-gray-400 uppercase">DCS Telemetry Horizon</span>
              <div className="text-xs font-bold text-gray-900 mt-0.5">Live Streaming (1,420 Tags)</div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Modbus TCP & Kafka Ingest Active</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Total Power</span>
                <div className="text-sm font-extrabold text-gray-900 mt-0.5">38.2 MW</div>
                <div className="text-[10px] text-amber-700 font-bold mt-0.5">+1.7 MW over BAT</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Clinker SEC</span>
                <div className="text-sm font-extrabold text-gray-900 mt-0.5">64.2 <span className="text-[9px]">kWh/t</span></div>
                <div className="text-[10px] text-gray-500 font-medium mt-0.5">BAT: 62.0 kWh/t</div>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/90 p-3 rounded-xl">
              <div className="flex items-center justify-between text-amber-900 text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5"><AlertTriangle size={13} className="text-amber-600" /> Active Alerts in Context</span>
                <span className="bg-amber-200/80 px-1.5 py-0.2 rounded text-[10px]">2</span>
              </div>
              <div className="text-xs font-extrabold text-gray-900">CM1 Mill Bearing Temp High</div>
              <div className="text-[11px] text-amber-800 font-medium">74.5°C (Warn limit: 68.0°C)</div>
            </div>
          </div>
        </div>

        {/* Priority Kaizen Dossiers Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-[#106c35]" />
              Active Kaizen Dossiers
            </h3>
            <Link to="/kaizen-projects" className="text-[10px] font-bold text-[#106c35] hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2">
            {[
              { id: "KAI-3001", title: "Raw Mill Fan Affinity Speed Trim", phase: "IMPLEMENTING", savings: "$98,400/yr" },
              { id: "KAI-3002", title: "Cement Mill 1 Dynamic Grinding Media", phase: "ANALYZING", savings: "$118,500/yr" },
              { id: "KAI-3003", title: "Trunnion Bearing Lube Conditioning", phase: "DETECTED", savings: "$45,000/yr" },
              { id: "KAI-3004", title: "WHRS Heat Recovery Maximization", phase: "PLANNED", savings: "$82,000/yr" }
            ].map((k, idx) => (
              <Link
                key={idx}
                to={`/kaizen-projects?id=${k.id}`}
                className="block p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-extrabold text-[#106c35]">{k.id}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-gray-600 border border-slate-200">
                    {k.phase}
                  </span>
                </div>
                <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-950 truncate">
                  {k.title}
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className="text-emerald-700 font-extrabold">{k.savings}</span>
                  <span className="text-gray-400 group-hover:text-[#106c35] flex items-center gap-0.5">
                    Open Dossier <ChevronRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default KaizenCopilot;

