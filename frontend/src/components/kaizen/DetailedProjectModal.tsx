import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, ChevronRight, AlertTriangle, Zap, DollarSign, 
  Calendar, User, FileText, Printer, ArrowRight, ShieldCheck, 
  Sparkles, Layers, Activity, TrendingDown, Clock, MessageSquare, Send, Plus
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { api } from '../../lib/api';

const KANBAN_COLS = ["DETECTED", "ANALYZING", "PLANNED", "IMPLEMENTING", "VERIFYING", "STANDARDIZED", "REPLICATED"];

interface DetailedProjectModalProps {
  projectId: string;
  onClose: () => void;
  onProjectUpdated?: () => void;
}

export const DetailedProjectModal: React.FC<DetailedProjectModalProps> = ({
  projectId,
  onClose,
  onProjectUpdated
}) => {
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'charter' | 'rca' | 'actions' | 'finance' | 'verification' | 'sop' | 'notes'>('charter');
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  
  // Note creation
  const [newNoteText, setNewNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      const res = await api.get(`/kaizen-projects/${projectId}`);
      if (res.data && !res.data.error) {
        setProject(res.data);
      }
    } catch (err) {
      console.error("Failed to load project dossier", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const handleAdvancePhase = async () => {
    if (!project) return;
    const currentIndex = KANBAN_COLS.indexOf(project.status);
    if (currentIndex === -1 || currentIndex >= KANBAN_COLS.length - 1) return;

    const nextStatus = KANBAN_COLS[currentIndex + 1];
    const newProgress = Math.round(((currentIndex + 1) / (KANBAN_COLS.length - 1)) * 100);

    setAdvancing(true);
    try {
      await api.patch(`/kaizen-projects/${project.id}`, {
        status: nextStatus,
        progress: newProgress
      });
      await fetchProjectDetails();
      if (onProjectUpdated) onProjectUpdated();
    } catch (err) {
      console.error("Failed to advance phase", err);
    } finally {
      setAdvancing(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentDone: boolean) => {
    if (!project) return;
    try {
      // Optimistic update
      const updatedPlan = (project.action_plan || []).map((t: any) => 
        t.id === taskId ? { ...t, done: !currentDone } : t
      );
      setProject({ ...project, action_plan: updatedPlan });

      await api.post(`/kaizen-projects/${project.id}/tasks`, {
        task_id: taskId,
        done: !currentDone
      });
      if (onProjectUpdated) onProjectUpdated();
    } catch (err) {
      console.error("Failed to update task", err);
      fetchProjectDetails();
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || submittingNote) return;

    setSubmittingNote(true);
    try {
      await api.post(`/kaizen-projects/${project.id}/notes`, {
        author: "V. Sharma (Operations)",
        text: newNoteText.trim()
      });
      setNewNoteText('');
      await fetchProjectDetails();
    } catch (err) {
      console.error("Failed to add note", err);
    } finally {
      setSubmittingNote(false);
    }
  };

  if (loading || !project) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="font-bold text-slate-800 text-sm">Opening Engineering Project Dossier...</h3>
          <p className="text-xs text-slate-500 mt-1">Retrieving root cause, telemetry, and business case data.</p>
        </div>
      </div>
    );
  }

  const charter = project.charter || {};
  const rootCause = project.root_cause || {};
  const businessCase = project.business_case || {};
  const verification = project.verification || {};
  const actionPlan = project.action_plan || [];
  const notes = project.notes || [];

  // Chart
  const trendPoints = verification.trend_points || [41.2, 41.0, 41.5, 41.1, 39.5, 37.9, 37.7, 37.8];
  const runChartOpts = {
    backgroundColor: 'transparent',
    grid: { top: 30, right: 20, bottom: 20, left: 45 },
    tooltip: { trigger: 'axis', backgroundColor: '#0f172a', textStyle: { color: '#f8fafc' } },
    xAxis: { 
      type: 'category', 
      data: trendPoints.map((_: any, i: number) => `Shift ${i + 1}`),
      axisLabel: { color: '#64748b', fontSize: 10 },
      axisLine: { lineStyle: { color: '#e2e8f0' } }
    },
    yAxis: { 
      type: 'value', 
      min: 'dataMin', 
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748b', fontSize: 10 }
    },
    series: [
      {
        name: 'Actual Telemetry',
        type: 'line',
        data: trendPoints,
        itemStyle: { color: '#10b981' },
        lineStyle: { width: 3 },
        smooth: true,
        markLine: verification.target_sec ? {
          data: [{ yAxis: verification.target_sec, name: 'Target' }],
          lineStyle: { color: '#0284c7', type: 'dashed' },
          label: { color: '#0284c7', fontSize: 10 }
        } : undefined
      }
    ]
  };

  const isCompleted = project.status === 'STANDARDIZED' || project.status === 'REPLICATED';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 lg:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* HEADER */}
        <div className="p-6 bg-slate-900 text-white flex flex-col gap-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
                {project.id}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                {project.dept}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                project.priority === 'HIGH' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {project.priority} PRIORITY
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                title="Print A3 Project Dossier"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <Printer size={16} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight leading-snug text-white">
                {project.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1 font-medium">
                <span>Lead: <strong className="text-slate-200">{project.owner}</strong></span>
                <span>Sponsor: <strong className="text-slate-200">{project.sponsor || 'Plant GM'}</strong></span>
                <span>Created: <strong className="text-slate-200">{project.created_at}</strong></span>
                <span>Target Lock: <strong className="text-slate-200">{project.target_date || '2026-10-15'}</strong></span>
              </div>
            </div>

            {/* Stage & Advance Button */}
            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 p-2 rounded-2xl shrink-0">
              <div className="px-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Current PDCA Phase</span>
                <span className="text-xs font-black text-emerald-400 tracking-wide">{project.status}</span>
              </div>

              {!isCompleted && (
                <button
                  onClick={handleAdvancePhase}
                  disabled={advancing}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  {advancing ? 'Advancing...' : (
                    <>
                      <span>Advance Phase</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Workflow Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {KANBAN_COLS.map((col, idx) => {
                const currentIdx = KANBAN_COLS.indexOf(project.status);
                const isPast = idx <= currentIdx;
                return (
                  <span key={col} className={isPast ? 'text-emerald-400' : 'text-slate-600'}>
                    {col}
                  </span>
                );
              })}
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-1 overflow-x-auto custom-scrollbar shrink-0">
          {[
            { id: 'charter', label: '1. Project Charter', icon: <FileText size={14} /> },
            { id: 'rca', label: '2. 5-Why & Root Cause', icon: <AlertTriangle size={14} /> },
            { id: 'actions', label: '3. Action Plan & Tasks', icon: <CheckCircle2 size={14} /> },
            { id: 'finance', label: '4. Financial ROI & Payback', icon: <DollarSign size={14} /> },
            { id: 'verification', label: '5. Empirical Verification', icon: <Activity size={14} /> },
            { id: 'sop', label: '6. Standardization & OPL', icon: <ShieldCheck size={14} /> },
            { id: 'notes', label: `7. Engineering Log (${notes.length})`, icon: <MessageSquare size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold transition-all border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-emerald-700 border-emerald-600 bg-white'
                  : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT BODY */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar text-xs text-slate-700 space-y-6">

          {/* TAB 1: CHARTER */}
          {activeTab === 'charter' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={15} className="text-emerald-600" /> Operational Problem Statement
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-medium bg-white p-4 rounded-xl border border-slate-200">
                    {charter.problem_statement || 'Process parameter deviation detected above optimal best available technology envelope.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
                  <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600" /> Target Condition & KPI Goal
                  </h4>
                  <p className="text-emerald-900 leading-relaxed font-medium bg-white p-4 rounded-xl border border-emerald-200">
                    {charter.target_condition || 'Reduce Specific Energy Consumption while maintaining cement Blaine and kiln stability.'}
                  </p>
                </div>
              </div>

              {/* RACI Matrix & Team */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Project Governance & RACI Team
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Project Leader (Accountable)</span>
                    <span className="font-bold text-slate-900 text-xs mt-1 block">{charter.lead_engineer || project.owner}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Executive Sponsor</span>
                    <span className="font-bold text-slate-900 text-xs mt-1 block">{project.sponsor || 'Vikram Sharma (Plant GM)'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Electrical & Controls</span>
                    <span className="font-bold text-slate-900 text-xs mt-1 block">{charter.electrical_lead || 'A. Verma'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Plant Reliability Head</span>
                    <span className="font-bold text-slate-900 text-xs mt-1 block">Anil Patel</span>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Key Project Milestones & Gate Deliverables
                </h4>
                <div className="space-y-2">
                  {(charter.milestones || []).map((m: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                          m.completed ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}>
                          {m.completed ? '✓' : idx + 1}
                        </div>
                        <span className={`font-bold text-xs ${m.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                          {m.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-400 text-[11px]">{m.date}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {m.completed ? 'COMPLETED' : 'PLANNED'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROOT CAUSE (5-WHY & ISHIKAWA) */}
          {activeTab === 'rca' && (
            <div className="space-y-6">
              {/* 5-Why Chain */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Layers size={15} className="text-emerald-600" /> Empirical 5-Why Analysis Progression
                  </h4>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded border border-emerald-200">
                    VERIFIED VIA NEURAL DIGITAL TWIN
                  </span>
                </div>

                <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 ml-2">
                  {(rootCause.five_why || []).map((step: any, idx: number) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-slate-900 border-2 border-white"></div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <div className="text-[11px] font-bold text-slate-500">Why #{idx + 1}: {step.question}</div>
                        <div className="text-xs font-bold text-slate-900 leading-relaxed">{step.answer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Telemetry Evidence Tags */}
              {rootCause.telemetry_tags && rootCause.telemetry_tags.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Correlated DCS Telemetry Evidence Tags
                  </h4>
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">DCS Tag</th>
                        <th className="py-2.5 px-4">Description</th>
                        <th className="py-2.5 px-4 text-right">Observed Value</th>
                        <th className="py-2.5 px-4 text-right">Normal Operating Setpoint</th>
                        <th className="py-2.5 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {rootCause.telemetry_tags.map((t: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{t.tag}</td>
                          <td className="py-2.5 px-4">{t.desc}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{t.value}</td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-500">{t.normal}</td>
                          <td className="py-2.5 px-4 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.status === 'HIGH' ? 'bg-red-50 text-red-600 border border-red-200' :
                              t.status === 'LOW' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Ishikawa Fishbone Categories */}
              {rootCause.ishikawa && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Ishikawa 6M Cause Categorization
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(rootCause.ishikawa).map(([cat, causes]: [string, any]) => (
                      <div key={cat} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                        <span className="font-bold text-xs text-slate-800 uppercase tracking-wider block border-b border-slate-200 pb-1">
                          {cat}
                        </span>
                        <ul className="space-y-1 pl-3 list-disc text-[11px] text-slate-600">
                          {causes.map((c: string, j: number) => (
                            <li key={j}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACTION PLAN & TASKS */}
          {activeTab === 'actions' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Countermeasures Implementation Tasks
                  </h4>
                  <p className="text-[11px] text-slate-500">Check off completed engineering tasks to automatically advance project progress.</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {actionPlan.filter((t: any) => t.done).length} of {actionPlan.length} Tasks Executed
                </span>
              </div>

              <div className="space-y-2.5">
                {actionPlan.map((task: any) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.done)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      task.done 
                        ? 'bg-emerald-50/40 border-emerald-200 text-slate-700' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => {}}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                      <div>
                        <div className={`text-xs font-bold ${task.done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.task}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Task ID: {task.id}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] shrink-0">
                      <span className="text-slate-600 font-medium flex items-center gap-1">
                        <User size={12} className="text-slate-400" /> {task.owner}
                      </span>
                      <span className="text-slate-400 font-mono">Due: {task.due}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.done ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {task.done ? 'DONE' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FINANCIAL BUSINESS CASE & ROI */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              {/* Financial Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">CapEx Investment</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    ₹{(businessCase.capex_inr || 850000).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500">Hardware & VFD tuning</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Annualized Savings</span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    ₹{((businessCase.annual_savings_inr || 15330000) / 10000000).toFixed(2)} Cr
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">{project.impact} verified</span>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                  <span className="text-[10px] font-bold text-sky-700 uppercase">Payback Horizon</span>
                  <div className="text-2xl font-black text-sky-600 mt-1">
                    {businessCase.payback_months || 2.1} <span className="text-xs font-normal">Months</span>
                  </div>
                  <span className="text-[10px] text-sky-700 font-semibold">Immediate return</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">1-Year Project ROI</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {businessCase.roi_pct || 170.4}%
                  </div>
                  <span className="text-[10px] text-slate-400">Avoids {businessCase.co2_avoided_tons_year || 1240} t CO₂/yr</span>
                </div>
              </div>

              {/* Detailed Financial Cash Flow Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Discounted Cash Flow & Energy Savings Schedule
                </h4>
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2.5 font-medium">Daily Net Electrical Savings (100 TPH basis)</td>
                      <td className="py-2.5 text-right font-mono font-bold text-emerald-600">₹{(businessCase.daily_savings_inr || 42000).toLocaleString()} / day</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Monthly Cost Reduction (30 Operating Days)</td>
                      <td className="py-2.5 text-right font-mono font-bold text-emerald-600">₹{((businessCase.daily_savings_inr || 42000) * 30).toLocaleString()} / month</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Annualized Gross Savings (365 Days)</td>
                      <td className="py-2.5 text-right font-mono font-bold text-slate-900">₹{(businessCase.annual_savings_inr || 15330000).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Annual SaaS & Maintenance OpEx</td>
                      <td className="py-2.5 text-right font-mono text-slate-500">₹{(businessCase.opex_annual_inr || 120000).toLocaleString()}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="py-2.5 px-2">Net 1st Year Economic Benefit (Savings - CapEx - OpEx)</td>
                      <td className="py-2.5 px-2 text-right font-mono text-emerald-700 font-black">
                        ₹{((businessCase.annual_savings_inr || 15330000) - (businessCase.capex_inr || 850000) - (businessCase.opex_annual_inr || 120000)).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: EMPIRICAL VERIFICATION */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Baseline Metric</span>
                  <span className="text-xl font-bold text-slate-700 mt-1 block font-mono">{verification.baseline_sec} kWh/t</span>
                </div>
                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                  <span className="text-[10px] font-bold text-sky-700 block uppercase">BAT Target</span>
                  <span className="text-xl font-bold text-sky-600 mt-1 block font-mono">{verification.target_sec} kWh/t</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 block uppercase">Verified Value (Live)</span>
                  <span className="text-2xl font-black text-emerald-600 mt-1 block font-mono">{verification.current_sec} kWh/t</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
                  Telemetry Run-Chart (Multi-Shift Verification)
                </h4>
                <div className="h-[280px]">
                  <ReactECharts option={runChartOpts} style={{ height: '100%', width: '100%' }} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SOP & STANDARDIZATION */}
          {activeTab === 'sop' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
                <ShieldCheck size={28} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-emerald-900">Standard Operating Procedure Certified</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Countermeasures for project {project.id} have been documented and standardized into the plant repository as 
                    <strong className="font-mono ml-1 text-emerald-950">{project.opl_id || 'OPL-208: Separator Speed Tuning'}</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Horizontal Plant Replication Candidates
                </h4>
                <p className="text-xs text-slate-500">
                  This Kaizen improvement has been validated for horizontal deployment across additional plant departments:
                </p>
                <div className="space-y-2 mt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-xs text-slate-900">Unit 2 Finish Grinding Mill (CM2)</span>
                      <p className="text-[11px] text-slate-500">Identical 5,000 kW ball mill circuit and static separator fan.</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
                      Ready for Rollout (Est. ₹38k/day)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-xs text-slate-900">Coal Mill Circuit ID Fan (CM1)</span>
                      <p className="text-[11px] text-slate-500">Dynamic classifier speed trimming based on petcoke grindability.</p>
                    </div>
                    <span className="text-xs font-bold text-sky-700 bg-sky-100/60 px-3 py-1 rounded-full">
                      Candidate for Q4
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ENGINEERING NOTES & LOG */}
          {activeTab === 'notes' && (
            <div className="space-y-5">
              {/* Note Submission */}
              <form onSubmit={handleAddNote} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Add Engineering Remark or Audit Log
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Log DCS trial result, setpoint changes, or observation..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    disabled={submittingNote || !newNoteText.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Send size={14} /> Log Note
                  </button>
                </div>
              </form>

              {/* Note History */}
              <div className="space-y-3">
                {notes.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 font-medium">No engineering notes recorded yet.</div>
                ) : (
                  notes.map((note: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <User size={13} className="text-emerald-600" /> {note.author}
                        </span>
                        <span className="font-mono text-slate-400">{note.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                        {note.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            EcoStruxure Kaizen AI Engine • Document ID: {project.id}-A3
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
