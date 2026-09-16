import React, { useState } from 'react';
import { Plus, MoreVertical, Calendar, User, Zap, Activity } from 'lucide-react';

const KANBAN_COLS = ["DETECTED", "ANALYZING", "PLANNED", "IMPLEMENTING", "VERIFYING", "STANDARDIZED", "REPLICATED"];

const mockProjects = [
  { id: 'KAI-3001', title: 'Cement Mill 1 Energy Loss', dept: 'CEMENT_MILL', impact: '₹42,000/day', owner: 'R. Sharma', progress: 40, status: 'ANALYZING', priority: 'HIGH' },
  { id: 'KAI-3002', title: 'Kiln Thermal Inefficiency', dept: 'PYROPROCESS', impact: '₹28,500/day', owner: 'S. Gupta', progress: 20, status: 'DETECTED', priority: 'HIGH' },
  { id: 'KAI-3003', title: 'Preheater False Air Sealing', dept: 'MAINTENANCE', impact: '₹4,350/day', owner: 'M. Kumar', progress: 90, status: 'VERIFYING', priority: 'MEDIUM' },
  { id: 'KAI-3004', title: 'Raw Mill VFD Installation', dept: 'PROJECTS', impact: '₹9,000/day', owner: 'A. Patel', progress: 100, status: 'STANDARDIZED', priority: 'MEDIUM' },
];

const KaizenProjects = () => {
  const [projects, setProjects] = useState(mockProjects);

  return (
    <div className="flex flex-col h-full bg-[#041116] text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-wide">Kaizen Project Board</h1>
          <p className="text-[11px] text-[#8899aa] uppercase tracking-wider">Continuous Improvement Workflow</p>
        </div>
        <button className="flex items-center gap-2 bg-[#00e676] hover:bg-[#00c853] text-[#041116] px-4 py-2 rounded-lg text-sm font-bold transition-colors">
          <Plus size={16} /> NEW KAIZEN
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
        <div className="flex h-full gap-4 items-start min-w-[1200px] pb-4">
          {KANBAN_COLS.map((col) => {
            const colProjects = projects.filter(p => p.status === col);
            return (
              <div key={col} className="w-[300px] flex-shrink-0 flex flex-col h-full bg-[#091b24] border border-[#15303f] rounded-xl overflow-hidden">
                <div className="p-3 border-b border-[#15303f] flex items-center justify-between bg-[#041116]/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00d4ff]"></div>
                    <span className="text-[11px] font-bold tracking-wider text-[#8899aa]">{col}</span>
                  </div>
                  <span className="text-[10px] bg-[#15303f] text-[#8899aa] px-2 py-0.5 rounded-full">{colProjects.length}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                  {colProjects.map(proj => (
                    <div key={proj.id} className="bg-[#041116] border border-[#1c3a4a] rounded-lg p-3 cursor-pointer hover:border-[#00d4ff]/50 transition-colors group relative shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-[#00d4ff] font-mono bg-[#00d4ff]/10 px-1.5 py-0.5 rounded">{proj.id}</span>
                        <button className="text-[#5a7384] hover:text-white"><MoreVertical size={14}/></button>
                      </div>
                      <h4 className="text-[13px] font-bold text-white mb-3 leading-tight">{proj.title}</h4>
                      
                      <div className="flex flex-col gap-2 mb-3">
                        <div className="flex items-center gap-1.5 text-[10px] text-[#8899aa]">
                           <Activity size={12} className="text-[#ffa726]" /> 
                           <span>{proj.dept}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#8899aa]">
                           <Zap size={12} className="text-[#00e676]" /> 
                           <span className="text-[#00e676] font-bold">{proj.impact}</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-[9px] text-[#5a7384] mb-1">
                          <span>Progress</span>
                          <span>{proj.progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-[#15303f] rounded-full overflow-hidden">
                          <div className="h-full bg-[#00d4ff]" style={{width: `${proj.progress}%`}}></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#15303f]">
                         <div className="flex items-center gap-1 text-[10px] text-[#5a7384]">
                           <User size={12}/> {proj.owner}
                         </div>
                         <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${proj.priority === 'HIGH' ? 'bg-[#ef5350]/10 text-[#ef5350]' : 'bg-[#ffa726]/10 text-[#ffa726]'}`}>
                            {proj.priority}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KaizenProjects;
