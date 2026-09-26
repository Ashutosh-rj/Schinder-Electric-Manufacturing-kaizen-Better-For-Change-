import React, { useState, useEffect } from 'react';
import { Search, Filter, Share2, Eye, Download, CheckCircle2, Zap, Tag, X, Calendar, User } from 'lucide-react';
import { api } from '../lib/api';

const DEFAULT_HISTORICAL_KAIZENS = [
  { id: 'KAI-1045', title: 'Cooler Grate Fan Profile Optimization', dept: 'COOLER', date: '2026-07-12', saving: '350 kWh/day (₹2,625/day)', owner: 'M. Kumar', replicate: 'Yes', category: 'Electrical Energy' },
  { id: 'KAI-1042', title: 'Raw Mill Dynamic Separator Speed Tuning', dept: 'RAW_MILL', date: '2026-06-28', saving: '280 kWh/day (₹2,100/day)', owner: 'S. Gupta', replicate: 'No', category: 'Process Quality' },
  { id: 'KAI-0988', title: 'Kiln Burner Primary Air Ratio Reduction', dept: 'PYROPROCESS', date: '2026-05-15', saving: '420 kWh/day (₹3,150/day)', owner: 'R. Sharma', replicate: 'Yes', category: 'Thermal Energy' },
  { id: 'KAI-0912', title: 'Preheater Top Stage Flap Seal False Air Elimination', dept: 'MAINTENANCE', date: '2026-04-02', saving: '580 kWh/day (₹4,350/day)', owner: 'A. Patel', replicate: 'Yes', category: 'Thermal Energy' },
  { id: 'KAI-0880', title: 'Cement Mill Ball Charge Profiling & Grinding Media Sort', dept: 'CEMENT_MILL', date: '2026-03-10', saving: '750 kWh/day (₹5,625/day)', owner: 'V. Nair', replicate: 'Yes', category: 'Throughput' },
  { id: 'KAI-0845', title: 'AQC Boiler Soot Blow Optimization', dept: 'WHRS', date: '2026-02-18', saving: '620 kWh/day (₹4,650/day)', owner: 'R. Sharma', replicate: 'Yes', category: 'Cogeneration' },
];

const KaizenDatabase: React.FC = () => {
  const [records, setRecords] = useState<any[]>(DEFAULT_HISTORICAL_KAIZENS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveOpportunities = async () => {
      try {
        const [kaizenRes, projectsRes] = await Promise.all([
          api.get('/kaizen'),
          api.get('/kaizen-projects')
        ]);

        const liveOpps = (kaizenRes.data?.opportunities || []).map((o: any) => ({
          id: o.id,
          title: o.title,
          dept: o.department || 'PLANT',
          date: o.created_at ? o.created_at.split('T')[0] : '2026-09-20',
          saving: o.saving_inr_day ? `₹${Math.round(o.saving_inr_day).toLocaleString()}/day` : `${o.saving_kwh_day || 0} kWh/day`,
          owner: 'AI Kaizen Worker',
          replicate: 'Yes',
          category: 'AI Recommended',
          description: o.description,
          action: o.action
        }));

        const projectRecords = (Array.isArray(projectsRes.data) ? projectsRes.data : []).map((p: any) => ({
          id: p.id,
          title: p.title,
          dept: p.dept,
          date: p.created_at || '2026-09-15',
          saving: p.impact,
          owner: p.owner,
          replicate: p.status === 'STANDARDIZED' || p.status === 'REPLICATED' ? 'Yes' : 'Pending',
          category: 'Project Workflow',
          description: `Active initiative currently in ${p.status} stage with ${p.progress}% progress.`
        }));

        // Merge without duplicate IDs
        const combined = [...projectRecords, ...liveOpps, ...DEFAULT_HISTORICAL_KAIZENS];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        setRecords(unique);
      } catch (err) {
        console.error("Failed to load Kaizen Database records", err);
      }
    };
    fetchLiveOpportunities();
  }, []);

  const filteredRecords = records.filter((r) => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || r.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleExportCSV = () => {
    const headers = ['Kaizen ID', 'Title', 'Department', 'Date', 'Savings', 'Lead Owner', 'Replicable', 'Category'];
    const rows = filteredRecords.map(r => [
      `"${r.id}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.dept}"`,
      `"${r.date}"`,
      `"${r.saving}"`,
      `"${r.owner}"`,
      `"${r.replicate}"`,
      `"${r.category || 'General'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kaizen_knowledge_base_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (rec: any) => {
    navigator.clipboard.writeText(`[Kaizen ${rec.id}] ${rec.title} | Department: ${rec.dept} | Savings: ${rec.saving}`);
    setCopiedId(rec.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Kaizen Knowledge Database</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              REPOSITORIES & BENCHMARKS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Searchable repository of past continuous improvement projects, standardized best practices, and horizontal replication candidates.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs hover:text-emerald-700"
        >
          <Download size={15} /> EXPORT CSV
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search improvements e.g. 'fan speed', 'false air', 'SEC', 'separator'..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-slate-400" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            <option value="RAW_MILL">Raw Mill</option>
            <option value="PYROPROCESS">Pyroprocess</option>
            <option value="COOLER">Cooler</option>
            <option value="CEMENT_MILL">Cement Mill</option>
            <option value="WHRS">WHRS</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Kaizen ID</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Date Logged</th>
                <th className="py-3 px-4">Impact / Savings</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Replicable</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No improvement records match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      {row.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{row.title}</div>
                      {row.category && (
                        <div className="text-[10px] text-slate-400 font-medium">{row.category}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {row.dept}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {row.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">
                      {row.saving}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {row.owner}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.replicate === 'Yes' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {row.replicate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setSelectedRecord(row)}
                          title="Inspect details"
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleShare(row)}
                          title="Copy summary"
                          className="p-1.5 text-slate-400 hover:text-sky-700 hover:bg-slate-100 rounded-lg transition-colors relative"
                        >
                          <Share2 size={15} />
                          {copiedId === row.id && (
                            <span className="absolute -top-7 right-0 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow-md whitespace-nowrap">
                              Copied!
                            </span>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedRecord.id}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-2">
                  {selectedRecord.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 block font-medium">Department</span>
                  <span className="font-bold text-slate-800">{selectedRecord.dept}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Recorded Date</span>
                  <span className="font-bold text-slate-800">{selectedRecord.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Annualized Savings</span>
                  <span className="font-bold text-emerald-600">{selectedRecord.saving}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Lead Responsible</span>
                  <span className="font-bold text-slate-800">{selectedRecord.owner}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">Context & Summary</h4>
                <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  {selectedRecord.description || 'Continuous improvement implemented to stabilize process parameters and reduce specific energy consumption in accordance with ISO 50001 energy standards.'}
                </p>
              </div>

              {selectedRecord.action && (
                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">Standardized Countermeasure</h4>
                  <p className="text-emerald-900 bg-emerald-50 p-3 rounded-xl border border-emerald-200 leading-relaxed font-medium">
                    {selectedRecord.action}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaizenDatabase;
