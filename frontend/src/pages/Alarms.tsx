import React, { useEffect, useState } from 'react';
import { AlertTriangle, Search, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../lib/api';

const Alarms: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const res = await api.get('/alarms');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch alarms", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlarms();
    const interval = setInterval(fetchAlarms, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleAck = async (id: number) => {
    try {
      await api.post(`/alarms/${id}/acknowledge`, { acknowledged_by: 'Operator' });
      // Refresh after ack
      const res = await api.get('/alarms');
      setData(res.data);
    } catch (err) {
      console.error("Failed to ack alarm", err);
    }
  };

  const getPrioColor = (prio: string) => {
    switch(prio) {
      case 'CRITICAL': return 'bg-[#ef5350] text-white';
      case 'HIGH': return 'bg-[#ffa726] text-black';
      case 'MEDIUM': return 'bg-yellow-400 text-black';
      default: return 'bg-[#00d4ff] text-black';
    }
  };

  if (loading && !data) {
    return <div className="p-6 text-[#00e676]">Loading Alarms...</div>;
  }

  const alarms = data?.active_alarms || [];
  const stats = data?.statistics || { critical: 0, high: 0, medium: 0, low: 0, total_active: 0 };
  const analysis = data?.alarm_analysis || { flood_active: false, chattering: [], standing: [], nuisance: [] };
  const anomalies = data?.recent_anomalies || [];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 relative">
      <div className="absolute top-2 right-2 text-[#ffa726] border border-[#ffa726] px-2 py-1 text-xs rounded opacity-70 z-50">
        [SIMULATED DATA]
      </div>

      {/* Header Summary */}
      <div className="flex gap-4 mb-6">
         <div className="bg-[#1a2540] p-4 rounded-lg flex-1 flex items-center justify-between shadow-lg">
            <h1 className="text-xl font-bold flex items-center gap-2"><AlertTriangle className="text-[#ffa726]" /> ALARM MANAGEMENT</h1>
            <div className="flex gap-4 text-sm font-bold">
               <span className="text-[#ef5350]">CRITICAL: {stats.critical}</span>
               <span className="text-[#ffa726]">HIGH: {stats.high}</span>
               <span className="text-yellow-400">MEDIUM: {stats.medium}</span>
               <span className="text-[#00d4ff]">LOW: {stats.low}</span>
               <span className="text-gray-400">TOTAL: {stats.total_active}</span>
            </div>
         </div>
      </div>

      {/* Intelligence Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
         <div className={`bg-[#1a2540] p-4 rounded-lg border-l-4 ${analysis.flood_active ? 'border-[#ef5350]' : 'border-[#00e676]'}`}>
            <div className="text-xs text-gray-400">Alarm Flood Status</div>
            <div className="font-bold flex items-center gap-2 mt-1">
              {analysis.flood_active ? <AlertTriangle size={16} className="text-[#ef5350]" /> : <CheckCircle size={16} className="text-[#00e676]" />} 
              {analysis.flood_active ? 'Flood Active' : 'No Flood Active'}
            </div>
         </div>
         <div className="bg-[#1a2540] p-4 rounded-lg border-l-4 border-[#ffa726]">
            <div className="text-xs text-gray-400">Chattering Alarms</div>
            <div className="font-bold text-xl text-[#ffa726]">{analysis.chattering.length}</div>
         </div>
         <div className="bg-[#1a2540] p-4 rounded-lg border-l-4 border-yellow-400">
            <div className="text-xs text-gray-400">Standing &gt; 24h</div>
            <div className="font-bold text-xl">{analysis.standing.length}</div>
         </div>
         <div className="bg-[#1a2540] p-4 rounded-lg border-l-4 border-[#00d4ff]">
            <div className="text-xs text-gray-400">Nuisance Identified</div>
            <div className="font-bold text-xl">{analysis.nuisance.length}</div>
         </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-4">
         <select className="bg-[#1a2540] border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none"><option>All Departments</option></select>
         <select className="bg-[#1a2540] border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none"><option>All Priorities</option></select>
         <select className="bg-[#1a2540] border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none"><option>ACTIVE</option></select>
         <div className="relative flex-1">
            <Search className="absolute left-3 top-2 text-gray-500" size={16} />
            <input type="text" placeholder="Search alarms..." className="w-full bg-[#1a2540] border border-gray-700 rounded pl-10 pr-4 py-2 text-sm focus:outline-none" />
         </div>
      </div>

      {/* Alarm Table */}
      <div className="bg-[#1a2540] rounded-lg overflow-hidden mb-6">
         <table className="w-full text-left text-sm">
            <thead className="bg-[#0a0e1a] text-gray-400 border-b border-gray-800">
               <tr>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Tag / Area</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Val / Limit</th>
                  <th className="p-3">Raised At</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Actions</th>
               </tr>
            </thead>
            <tbody>
               {alarms.map((al: any) => (
                  <React.Fragment key={al.id}>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                     <td className="p-3"><span className={`px-2 py-1 text-[10px] font-bold rounded ${getPrioColor(al.priority || al.category)}`}>{al.priority || al.category}</span></td>
                     <td className="p-3"><div className="font-mono text-xs">{al.alarm_tag}</div><div className="text-[10px] text-gray-500">{al.department_code}</div></td>
                     <td className="p-3 font-bold">{al.description}</td>
                     <td className="p-3"><span className="text-[#ef5350]">{al.value?.toFixed ? al.value.toFixed(2) : al.value}</span> <span className="text-gray-500 text-xs">/ {al.limit_value}</span></td>
                     <td className="p-3">{new Date(al.raised_at).toLocaleTimeString()}</td>
                     <td className="p-3"><span className={al.state === 'ACTIVE' ? 'text-[#ef5350]' : 'text-gray-400'}>{al.state}</span></td>
                     <td className="p-3 flex gap-2">
                        {al.state === 'ACTIVE' && <button onClick={() => handleAck(al.id)} className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs">ACK</button>}
                        <button onClick={() => setExpandedId(expandedId === al.id ? null : al.id)} className="text-[#00d4ff] text-xs hover:underline flex items-center">Details {expandedId === al.id ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}</button>
                     </td>
                  </tr>
                  {/* Expanded Row */}
                  {expandedId === al.id && (
                     <tr className="bg-[#0a0e1a] border-b border-gray-800">
                        <td colSpan={7} className="p-4">
                           <div className="grid grid-cols-2 gap-6 text-sm">
                              <div>
                                 <h4 className="font-bold text-[#ffa726] mb-1">WHY DID IT OCCUR?</h4>
                                 <p className="text-gray-300 mb-3">{al.why_occurred || 'Monitoring process deviation.'}</p>
                                 <h4 className="font-bold text-[#ffa726] mb-1">WHAT CAUSED IT?</h4>
                                 <ul className="list-disc pl-4 text-gray-300 mb-3 space-y-1">
                                    {(al.possible_causes || []).map((cause: string, i: number) => <li key={i}>{cause}</li>)}
                                 </ul>
                              </div>
                              <div>
                                 <h4 className="font-bold text-[#ef5350] mb-1">WHAT IS THE CONSEQUENCE?</h4>
                                 <p className="text-gray-300 mb-3">{al.consequence || 'Potential process instability.'}</p>
                                 <h4 className="font-bold text-[#00d4ff] mb-1">OPERATOR ACTION</h4>
                                 <ol className="list-decimal pl-4 text-gray-300 mb-3 space-y-1">
                                    {(al.operator_checks || []).map((chk: string, i: number) => <li key={i}>{chk}</li>)}
                                 </ol>
                                 <div className="flex gap-4 mt-4 items-center">
                                    <span className="text-xs text-gray-500">Occurrences (7d): {al.occurrence_count_7d || 0}</span>
                                    <a href="/rca" className="text-xs bg-[#1a2540] border border-[#00d4ff] text-[#00d4ff] px-2 py-1 rounded">View RCA</a>
                                 </div>
                              </div>
                           </div>
                        </td>
                     </tr>
                  )}
                  </React.Fragment>
               ))}
               {alarms.length === 0 && (
                 <tr><td colSpan={7} className="p-6 text-center text-gray-500">No active alarms</td></tr>
               )}
            </tbody>
         </table>
      </div>
      
      {/* Event Timeline */}
      <div className="bg-[#1a2540] p-4 rounded-lg">
         <h3 className="font-bold mb-4">Anomaly Event Timeline (Last 2 Hours)</h3>
         <div className="flex items-center gap-2 overflow-x-auto text-xs pb-2">
            {anomalies.map((an: any, i: number) => (
              <React.Fragment key={i}>
                <div className={`bg-[#0a0e1a] border ${an.is_anomaly ? 'border-[#ef5350] shadow-[0_0_10px_rgba(239,83,80,0.5)]' : 'border-gray-700'} p-2 rounded whitespace-nowrap`}>
                  <span className="text-gray-500">{new Date(an.timestamp).toLocaleTimeString()}</span> {an.tag}: {an.value?.toFixed(2)}
                </div>
                {i < anomalies.length - 1 && <span className="text-gray-600">→</span>}
              </React.Fragment>
            ))}
            {anomalies.length === 0 && <span className="text-gray-500">No recent anomalies detected.</span>}
         </div>
      </div>
    </div>
  );
};

export default Alarms;
