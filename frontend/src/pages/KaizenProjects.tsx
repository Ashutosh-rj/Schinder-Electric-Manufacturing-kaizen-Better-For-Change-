import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, MoreVertical, Calendar, User, Zap, Activity, ChevronRight, ChevronLeft, CheckCircle2, X, Filter, FileText } from 'lucide-react';
import { api } from '../lib/api';
import { DetailedProjectModal } from '../components/kaizen/DetailedProjectModal';

const KANBAN_COLS = ["DETECTED", "ANALYZING", "PLANNED", "IMPLEMENTING", "VERIFYING", "STANDARDIZED", "REPLICATED"];

const KaizenProjects: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedProjectForDossier, setSelectedProjectForDossier] = useState<string | null>(searchParams.get('id'));


  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('CEMENT_MILL');
  const [newImpact, setNewImpact] = useState('₹35,000/day');
  const [newOwner, setNewOwner] = useState('V. Sharma');
  const [newPriority, setNewPriority] = useState('HIGH');
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/kaizen-projects');
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load kaizen projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateKaizen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        title: newTitle,
        dept: newDept,
        impact: newImpact,
        owner: newOwner,
        priority: newPriority,
        status: "DETECTED",
        progress: 10
      };
      await api.post('/kaizen-projects', payload);
      setShowModal(false);
      setNewTitle('');
      await fetchProjects();
    } catch (err) {
      console.error("Failed to create project", err);
    } finally {
      setSubmitting(false);
    }
  };

  const moveProject = async (proj: any, direction: 'next' | 'prev') => {
    const currentIndex = KANBAN_COLS.indexOf(proj.status);
    if (currentIndex === -1) return;

    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex < 0 || targetIndex >= KANBAN_COLS.length) return;

    const nextStatus = KANBAN_COLS[targetIndex];
    const newProgress = Math.round((targetIndex / (KANBAN_COLS.length - 1)) * 100);

    // Optimistic update
    setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, status: nextStatus, progress: newProgress } : p));

    try {
      await api.patch(`/kaizen-projects/${proj.id}`, { status: nextStatus, progress: newProgress });
    } catch (err) {
      console.error("Failed to update status", err);
      fetchProjects(); // Revert on failure
    }
  };

  const filteredProjects = selectedDept === 'ALL' 
    ? projects 
    : projects.filter(p => p.dept === selectedDept);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Kaizen Continuous Improvement Board</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              KANBAN PDCA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track, prioritize, and verify continuous improvements from initial AI anomaly detection through standardization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Department Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              <option value="RAW_MILL">Raw Mill</option>
              <option value="PYROPROCESS">Pyroprocess</option>
              <option value="COOLER">Cooler</option>
              <option value="CEMENT_MILL">Cement Mill</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="PROJECTS">Projects</option>
            </select>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus size={16} /> NEW KAIZEN
          </button>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <div className="flex gap-4 items-start min-w-[1400px] pb-4">
          {KANBAN_COLS.map((col) => {
            const colProjects = filteredProjects.filter(p => p.status === col);
            return (
              <div key={col} className="w-[280px] shrink-0 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                {/* Column Header */}
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      col === 'STANDARDIZED' || col === 'REPLICATED' ? 'bg-emerald-500' :
                      col === 'IMPLEMENTING' || col === 'VERIFYING' ? 'bg-sky-500' : 'bg-amber-500'
                    }`}></div>
                    <span className="text-xs font-bold text-slate-800 tracking-wide">{col}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">
                    {colProjects.length}
                  </span>
                </div>
                
                {/* Column Cards */}
                <div className="p-3 space-y-3 min-h-[450px] max-h-[620px] overflow-y-auto custom-scrollbar">
                  {colProjects.length === 0 ? (
                    <div className="h-28 flex items-center justify-center border border-dashed border-slate-200 rounded-xl text-[11px] text-slate-400 font-medium">
                      No initiatives in {col.toLowerCase()}
                    </div>
                  ) : (
                    colProjects.map(proj => (
                      <div
                        key={proj.id}
                        onClick={() => setSelectedProjectForDossier(proj.id)}
                        className="bg-white border border-slate-200 rounded-xl p-3.5 hover:border-emerald-400/80 hover:shadow-md transition-all group relative flex flex-col gap-2.5 cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                            {proj.id}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            proj.priority === 'HIGH' ? 'bg-red-50 text-red-600 border border-red-200' :
                            proj.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {proj.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                          {proj.title}
                        </h4>
                        
                        <div className="flex flex-col gap-1 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Activity size={12} className="text-amber-500" /> 
                            <span>{proj.dept}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Zap size={12} className="text-emerald-600" /> 
                            <span className="text-emerald-600 font-bold">{proj.impact}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-medium">
                            <span>Stage Progress</span>
                            <span className="font-bold text-slate-600">{proj.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                              style={{ width: `${proj.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Owner & Controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                          <div className="flex items-center gap-1 text-slate-600 font-medium">
                            <User size={12} className="text-slate-400" /> {proj.owner}
                          </div>

                          <div className="flex items-center gap-1">
                            {col !== KANBAN_COLS[0] && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveProject(proj, 'prev');
                                }}
                                title="Move back"
                                className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                              >
                                <ChevronLeft size={14} />
                              </button>
                            )}
                            {col !== KANBAN_COLS[KANBAN_COLS.length - 1] && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveProject(proj, 'next');
                                }}
                                title="Advance to next stage"
                                className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50"
                              >
                                <ChevronRight size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Plus size={18} className="text-emerald-600" /> Register New Kaizen Initiative
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateKaizen} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Initiative Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raw Mill Separator Speed Adjustment for SEC"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Department
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="CEMENT_MILL">Cement Mill</option>
                    <option value="RAW_MILL">Raw Mill</option>
                    <option value="PYROPROCESS">Pyroprocess (Kiln)</option>
                    <option value="COOLER">Clinker Cooler</option>
                    <option value="MAINTENANCE">Mechanical / Electrical</option>
                    <option value="PROJECTS">Plant Projects</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Financial Impact
                  </label>
                  <input
                    type="text"
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value)}
                    placeholder="₹35,000/day"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Lead Owner
                  </label>
                  <input
                    type="text"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    placeholder="R. Sharma"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  {submitting ? 'Registering...' : 'Register Kaizen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED PROJECT DOSSIER MODAL */}
      {selectedProjectForDossier && (
        <DetailedProjectModal

          projectId={selectedProjectForDossier}
          onClose={() => {
            setSelectedProjectForDossier(null);
            setSearchParams({});
          }}
          onProjectUpdated={fetchProjects}
        />
      )}
    </div>
  );
};


export default KaizenProjects;
