import React, { useState } from 'react';
import { BookOpen, AlertCircle, Sparkles, Plus, Image as ImageIcon, CheckCircle2, X, Search, Filter, ShieldCheck, Wrench, Eye } from 'lucide-react';

interface OPLItem {
  id: string;
  title: string;
  category: 'BASIC KNOWLEDGE' | 'TROUBLE CASE' | 'SAFETY' | 'KAIZEN STANDARD';
  date: string;
  author: string;
  trainedCount: number;
  summary: string;
  steps: string[];
  dos: string;
  donts: string;
}

const INITIAL_OPLS: OPLItem[] = [
  {
    id: 'OPL-205',
    title: 'Process Fan Bearing Lubrication & Grease Discharge Inspection',
    category: 'BASIC KNOWLEDGE',
    date: '2026-08-10',
    author: 'M. Kumar (Mechanical Lead)',
    trainedCount: 42,
    summary: 'Standard visual guide on correct lubricant quantity and grease purging technique for CM1 and Kiln ID fan spherical roller bearings to prevent high temperature trips.',
    steps: [
      'Clean the grease nipple surface thoroughly with solvent rag before attaching gun.',
      'Check bearing housing temperature with thermal gun (must be below 70°C).',
      'Inject exactly 45 grams of ISO VG 460 synthetic lithium grease per lubrication schedule.',
      'Inspect grease relief valve to ensure expelled grease is discharging without pressure buildup.'
    ],
    dos: 'Always wipe grease nipple clean and inspect relief valve freely moving.',
    donts: 'Do NOT over-grease; excess grease churns and causes acute bearing overheating.'
  },
  {
    id: 'OPL-206',
    title: 'Kiln Coating Fall & Burning Zone Shell Temperature Spike Response',
    category: 'TROUBLE CASE',
    date: '2026-08-15',
    author: 'R. Sharma (Process Incharge)',
    trainedCount: 38,
    summary: 'Standard operating response protocol when kiln optical pyrometer detects sudden localized shell temperature spike exceeding 380°C.',
    steps: [
      'Immediately verify localized shell spot temperature using secondary handheld IR pyrometer.',
      'Direct auxiliary kiln cooling shell fans at the hot spot coordinates.',
      'Trim kiln speed by 0.2 RPM to allow coating reformation over refractory brick.',
      'Stabilize burning zone secondary air temperature and check flame shape centering.'
    ],
    dos: 'Increase auxiliary shell fan cooling immediately and verify flame centering.',
    donts: 'Do NOT abruptly stop kiln rotation; keep kiln on auxiliary inching drive to prevent shaft bow.'
  },
  {
    id: 'OPL-207',
    title: 'Raw Mill & Roller Press Lockout / Tagout (LOTO) Protocol',
    category: 'SAFETY',
    date: '2026-09-01',
    author: 'S. Gupta (Safety Engineer)',
    trainedCount: 56,
    summary: 'Mandatory zero-energy isolation points, breaker padlocking, and hydraulic depressurization prior to mill manhole opening.',
    steps: [
      'Notify Central Control Room (CCR) operator and obtain signed entry permit.',
      'Open 6.6kV vacuum circuit breaker for mill main motor and rack out breaker truck.',
      'Apply individual safety padlock and danger tag on isolating knife switch.',
      'Dump hydraulic roll accumulator nitrogen pressure to zero gauge reading before opening inspection door.'
    ],
    dos: 'Perform zero-voltage verification test on terminals after breaker isolation.',
    donts: 'Never enter mill grinding chamber without trying start button at local push-button station.'
  },
  {
    id: 'OPL-208',
    title: 'Dynamic Separator Speed Tuning for Cement Blaine Control',
    category: 'KAIZEN STANDARD',
    date: '2026-09-12',
    author: 'A. Patel (Process Lead)',
    trainedCount: 29,
    summary: 'Standard procedure derived from Kaizen KAI-3001 for setting VFD guide vane frequency to achieve 3820 Blaine at minimum kWh/t.',
    steps: [
      'Check current separator rotor speed feedback on DCS screen (nominal: 850 RPM).',
      'If hourly lab Blaine is below 3700 m²/kg, increment rotor speed setpoint by +15 RPM.',
      'Wait 30 minutes for circuit steady state before sampling air-slide discharge.',
      'Ensure ID fan damper is coordinated to prevent airflow choking.'
    ],
    dos: 'Make setpoint adjustments in smooth increments of 15 RPM to avoid recirculating surges.',
    donts: 'Do not adjust separator RPM during feed rate transitions.'
  }
];

const OnePointLessons: React.FC = () => {
  const [opls, setOpls] = useState<OPLItem[]>(INITIAL_OPLS);
  const [selectedOpl, setSelectedOpl] = useState<OPLItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('BASIC KNOWLEDGE');
  const [author, setAuthor] = useState('V. Sharma');
  const [summary, setSummary] = useState('');
  const [step1, setStep1] = useState('');
  const [step2, setStep2] = useState('');
  const [dos, setDos] = useState('');
  const [donts, setDonts] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newOpl: OPLItem = {
      id: `OPL-${200 + opls.length + 5}`,
      title,
      category,
      date: new Date().toISOString().split('T')[0],
      author,
      trainedCount: 1,
      summary: summary || 'Standard operating visual guideline developed for continuous shopfloor quality.',
      steps: [step1 || 'Inspect operating zone.', step2 || 'Verify parameter compliance.'],
      dos: dos || 'Follow standard operating parameters.',
      donts: donts || 'Never bypass DCS interlocks.'
    };

    setOpls([newOpl, ...opls]);
    setShowCreateModal(false);
    setTitle('');
    setSummary('');
  };

  const filteredOpls = opls.filter(o => {
    const matchesSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || o.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'BASIC KNOWLEDGE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'TROUBLE CASE':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'SAFETY':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'KAIZEN STANDARD':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="text-emerald-600" size={24} /> One Point Lessons (OPL) & Visual SOPs
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              LEAN STANDARDIZATION
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Single-page visual Standard Operating Procedures (SOPs) teaching critical maintenance, safety isolation, and energy best practices.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Plus size={16} /> CREATE OPL
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
            placeholder="Search lessons e.g. 'lubrication', 'LOTO', 'coating fall', 'separator'..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="BASIC KNOWLEDGE">Basic Knowledge</option>
            <option value="TROUBLE CASE">Trouble Case</option>
            <option value="SAFETY">Safety</option>
            <option value="KAIZEN STANDARD">Kaizen Standard</option>
          </select>
        </div>
      </div>

      {/* OPL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto custom-scrollbar pb-6">
        {filteredOpls.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedOpl(item)}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-400/80 transition-all cursor-pointer flex flex-col group"
          >
            {/* Thumbnail Header */}
            <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-200 relative flex items-center justify-center p-4 border-b border-slate-100">
              <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${getCategoryBadge(item.category)}`}>
                {item.category}
              </span>
              <Wrench size={38} className="text-slate-400 group-hover:text-emerald-600 transition-colors group-hover:scale-110 duration-200" />
              <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] text-slate-500 font-mono">
                <span className="bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200/60 font-bold">{item.id}</span>
                <span className="bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200/60">{item.date}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug group-hover:text-emerald-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-3 mb-4 flex-1 leading-relaxed">
                {item.summary}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500 font-medium">By: {item.author.split('(')[0]}</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck size={13} /> {item.trainedCount} Certified
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW MODAL */}
      {selectedOpl && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedOpl.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadge(selectedOpl.category)}`}>
                    {selectedOpl.category}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 mt-2 leading-snug">
                  {selectedOpl.title}
                </h3>
                <div className="text-xs text-slate-500 mt-1">Author: {selectedOpl.author} | Date: {selectedOpl.date}</div>
              </div>
              <button
                onClick={() => setSelectedOpl(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed font-medium">
                {selectedOpl.summary}
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-600" /> Mandatory Step-by-Step Procedure
                </h4>
                <ol className="space-y-2 list-decimal pl-4 text-slate-700">
                  {selectedOpl.steps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed pl-1">{step}</li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="font-bold text-emerald-800 block mb-1">DO (Standard Practice):</span>
                  <p className="text-emerald-900 leading-relaxed">{selectedOpl.dos}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  <span className="font-bold text-red-800 block mb-1">DON'T (Forbidden Practice):</span>
                  <p className="text-red-900 leading-relaxed">{selectedOpl.donts}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">
                {selectedOpl.trainedCount} technicians trained on this SOP
              </span>
              <button
                onClick={() => setSelectedOpl(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all"
              >
                Close SOP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Plus size={18} className="text-emerald-600" /> Create New One Point Lesson
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tertiary Air Damper Calibration Procedure"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="BASIC KNOWLEDGE">Basic Knowledge</option>
                    <option value="TROUBLE CASE">Trouble Case</option>
                    <option value="SAFETY">Safety</option>
                    <option value="KAIZEN STANDARD">Kaizen Standard</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Overview / Summary</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief summary of why this visual SOP is needed."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Key Step 1</label>
                <input
                  type="text"
                  placeholder="e.g. Isolate damper actuator power supply."
                  value={step1}
                  onChange={(e) => setStep1(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Key Step 2</label>
                <input
                  type="text"
                  placeholder="e.g. Verify mechanical pointer matches 4-20mA feedback."
                  value={step2}
                  onChange={(e) => setStep2(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-emerald-700 uppercase mb-1">Standard DO</label>
                  <input
                    type="text"
                    value={dos}
                    onChange={(e) => setDos(e.target.value)}
                    placeholder="e.g. Always check mechanical stop."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-red-700 uppercase mb-1">Forbidden DON'T</label>
                  <input
                    type="text"
                    value={donts}
                    onChange={(e) => setDonts(e.target.value)}
                    placeholder="e.g. Never force seized damper linkage."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
                >
                  Publish OPL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnePointLessons;
