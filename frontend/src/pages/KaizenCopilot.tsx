import React, { useState } from 'react';
import { Send, Sparkles, AlertTriangle, ChevronRight, Activity } from 'lucide-react';

const KaizenCopilot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'user',
      content: 'Why is Raw Mill 1 production below target?'
    },
    {
      role: 'ai',
      content: 'Raw Mill 1 is currently producing 285.3 TPH against a target of 300 TPH (-4.9% deviation). Analysis of the last 2 hours reveals the following findings:\\n\\n**Primary finding:** Mill differential pressure has been trending upward (520→625 mmWC over 90 minutes), indicating increasing circulating load within the grinding circuit.',
      evidence: [
        { param: 'Mill DP', cur: '625 mmWC', norm: '500-750', stat: '⚠️ APPROACHING HIGH' },
        { param: 'Feed Rate', cur: '285 TPH', norm: '290-320', stat: '⬇️ BELOW TARGET' }
      ],
      causes: [
        { text: 'Feed instability / moisture variation', conf: 74 },
        { text: 'Increased circulating load', conf: 68 }
      ],
      recs: [
        'Stabilize feed rate — reduce variation, target ±5 TPH',
        'Monitor mill outlet temperature — verify drying capacity'
      ]
    },
    {
      role: 'user',
      content: 'Which equipment is most likely to need attention soon?'
    },
    {
      role: 'ai',
      content: 'Based on current equipment health scores and trend analysis, the following 3 equipment require attention:\\n\\n1. **CF-1003 Cooler Fan 3** — Health: 62/100 (HIGH RISK)\\n   - Bearing temperature has increased 15°C over the last 7 days (trend: accelerating)\\n   - Vibration: 5.1 mm/s (limit: 6.0 mm/s — approaching limit)\\n   - Recommendation: Inspect bearing at earliest opportunity; ensure lubrication is adequate\\n   - Note: Statistical estimate only — actual timing may differ\\n\\n2. **CM1-FAN-1201 Cement Mill 1 Fan** — Health: 68/100 (DEGRADING)\\n   - Vibration has increased from 3.2 to 5.8 mm/s over 14 days\\n   - Current vibration exceeds normal limit (4.5 mm/s)\\n   - Recommendation: Vibration analysis recommended; check for imbalance or misalignment\\n\\n3. **KD-901 Kiln Auxiliary Drive** — Health: 74/100 (WARNING)\\n   - Motor current trending up 8% over 30 days while load unchanged\\n   - Gearbox oil temperature occasionally elevated\\n   - Recommendation: Check gearbox oil level and condition',
      evidence: [],
      causes: [],
      recs: []
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if(!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'This is a simulated AI response. The integration with the backend copilot engine is pending.',
        evidence: [], causes: [], recs: []
      }]);
    }, 1000);
  };

  return (
    <div className="flex h-full gap-4">
      {/* Chat Area */}
      <div className="w-3/5 flex flex-col bg-[#1a2540] rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex items-center gap-2">
          <Sparkles className="text-[#00d4ff]" />
          <h2 className="font-bold">Kaizen Copilot</h2>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-4 ${m.role === 'user' ? 'bg-[#00d4ff]/10 text-white border border-[#00d4ff]/20' : 'bg-gray-800/50 text-gray-200 border border-gray-700'}`}>
                {m.role === 'ai' && <div className="font-bold text-[#00d4ff] mb-2 flex items-center gap-2"><Sparkles size={16}/> Kaizen AI</div>}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>
                
                {m.causes && m.causes.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm font-bold text-gray-400">Probable Causes:</div>
                    {m.causes.map((c, j) => (
                      <div key={j} className="text-sm">
                        <div className="flex justify-between text-xs mb-1 text-gray-300"><span>{j+1}. {c.text}</span><span>{c.conf}%</span></div>
                        <div className="w-full bg-gray-900 rounded-full h-1"><div className="bg-[#00d4ff] h-1 rounded-full" style={{width: `${c.conf}%`}}></div></div>
                      </div>
                    ))}
                  </div>
                )}
                
                {m.recs && m.recs.length > 0 && (
                  <div className="mt-4 bg-[#ffa726]/10 border border-[#ffa726]/30 p-3 rounded">
                    <div className="text-xs font-bold text-[#ffa726] mb-2 flex items-center gap-1"><AlertTriangle size={12}/> ADVISORY RECOMMENDATIONS</div>
                    <ul className="text-sm list-disc pl-4 text-gray-300 space-y-1">
                      {m.recs.map((r, j) => <li key={j}>{r}</li>)}
                    </ul>
                  </div>
                )}
                {m.role === 'ai' && <div className="text-[10px] text-gray-500 mt-3 text-right">⚠️ All recommendations are advisory. Maintenance decisions must be validated by qualified engineers.<br/>*Data source: sensor_readings, equipment_health | Confidence: MEDIUM | [SIMULATED DATA]*</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-900/50 border-t border-gray-800">
          <div className="flex gap-2 mb-2 overflow-x-auto custom-scrollbar pb-2">
            {["Why is Raw Mill production low?", "Top energy saving opportunities", "Which equipment may fail?"].map(q => (
              <button key={q} onClick={() => setInput(q)} className="whitespace-nowrap px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 rounded-full border border-gray-700 transition-colors">
                {q}
              </button>
            ))}
          </div>
          <div className="relative">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask Copilot..." 
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:border-[#00d4ff]"
            />
            <button onClick={handleSend} className="absolute right-2 top-2 p-1 text-gray-400 hover:text-[#00d4ff]">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Panel */}
      <div className="w-2/5 bg-[#1a2540] rounded-lg border border-gray-800 p-4 flex flex-col">
        <h3 className="font-bold border-b border-gray-800 pb-2 mb-4 flex items-center gap-2"><Activity size={18}/> Context & Evidence</h3>
        <div className="text-xs text-gray-400 mb-4 bg-gray-800 p-2 rounded">Analyzing last 2 hours of data</div>
        
        {messages[messages.length-1]?.evidence?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="text-gray-500 bg-gray-800/50">
                <tr><th className="p-2">Parameter</th><th className="p-2">Current</th><th className="p-2">Normal</th><th className="p-2">Status</th></tr>
              </thead>
              <tbody>
                {messages[messages.length-1].evidence.map((e, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="p-2">{e.param}</td><td className="p-2 font-mono">{e.cur}</td><td className="p-2 text-gray-500">{e.norm}</td><td className="p-2">{e.stat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center py-8">Relevant tags from current query answer will appear here.</div>
        )}
      </div>
    </div>
  );
};
export default KaizenCopilot;
