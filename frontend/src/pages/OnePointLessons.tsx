import React from 'react';
import { BookOpen, AlertCircle, Sparkles, Plus, Image as ImageIcon } from 'lucide-react';

const OnePointLessons = () => {
  return (
    <div className="flex flex-col h-full bg-[#041116] text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-wide">One Point Lessons (OPL)</h1>
          <p className="text-[11px] text-[#8899aa] uppercase tracking-wider">Visual Standard Operating Procedures</p>
        </div>
        <button className="flex items-center gap-2 bg-[#00e676] hover:bg-[#00c853] text-[#041116] px-4 py-2 rounded-lg text-sm font-bold transition-colors">
          <Plus size={16} /> CREATE OPL
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 overflow-y-auto custom-scrollbar pb-4">
         {/* OPL Card 1 */}
         <div className="bg-[#091b24] border border-[#15303f] rounded-xl overflow-hidden shadow-lg flex flex-col cursor-pointer hover:border-[#00d4ff]/50 transition-colors">
            <div className="h-[200px] bg-[#15303f] flex items-center justify-center relative">
               <div className="absolute top-2 right-2 bg-[#00e676] text-[#041116] text-[9px] font-bold px-2 py-1 rounded">BASIC KNOWLEDGE</div>
               <ImageIcon size={48} className="text-[#5a7384]" />
               <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                 <span className="text-[9px] bg-black/50 px-2 py-0.5 rounded">OPL-205</span>
                 <span className="text-[9px] bg-black/50 px-2 py-0.5 rounded">Created: 2026-08-10</span>
               </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
               <h3 className="text-[14px] font-bold text-white mb-2 leading-tight">Proper Fan Bearing Lubrication Procedure</h3>
               <p className="text-[11px] text-[#8899aa] mb-4 flex-1">Visual guide on the correct quantity and technique for applying grease to the CM1 fan bearings to prevent over-heating.</p>
               <div className="flex items-center justify-between pt-3 border-t border-[#15303f]">
                 <span className="text-[10px] text-[#5a7384]">By: M. Kumar</span>
                 <span className="text-[10px] text-[#00d4ff]">42 Trained</span>
               </div>
            </div>
         </div>

         {/* OPL Card 2 */}
         <div className="bg-[#091b24] border border-[#15303f] rounded-xl overflow-hidden shadow-lg flex flex-col cursor-pointer hover:border-[#00d4ff]/50 transition-colors">
            <div className="h-[200px] bg-[#15303f] flex items-center justify-center relative">
               <div className="absolute top-2 right-2 bg-[#ef5350] text-white text-[9px] font-bold px-2 py-1 rounded">TROUBLE CASE</div>
               <ImageIcon size={48} className="text-[#5a7384]" />
               <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                 <span className="text-[9px] bg-black/50 px-2 py-0.5 rounded">OPL-206</span>
                 <span className="text-[9px] bg-black/50 px-2 py-0.5 rounded">Created: 2026-08-15</span>
               </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
               <h3 className="text-[14px] font-bold text-white mb-2 leading-tight">Kiln Coating Fall - Immediate Response</h3>
               <p className="text-[11px] text-[#8899aa] mb-4 flex-1">Standard response protocol when kiln shell temperature spikes suddenly due to coating fall.</p>
               <div className="flex items-center justify-between pt-3 border-t border-[#15303f]">
                 <span className="text-[10px] text-[#5a7384]">By: R. Sharma</span>
                 <span className="text-[10px] text-[#00d4ff]">18 Trained</span>
               </div>
            </div>
         </div>

         {/* OPL Card 3 */}
         <div className="bg-[#091b24] border border-[#15303f] rounded-xl overflow-hidden shadow-lg flex flex-col cursor-pointer hover:border-[#00d4ff]/50 transition-colors">
            <div className="h-[200px] bg-[#15303f] flex items-center justify-center relative">
               <div className="absolute top-2 right-2 bg-[#ffa726] text-[#041116] text-[9px] font-bold px-2 py-1 rounded">SAFETY</div>
               <ImageIcon size={48} className="text-[#5a7384]" />
               <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                 <span className="text-[9px] bg-black/50 px-2 py-0.5 rounded">OPL-207</span>
                 <span className="text-[9px] bg-black/50 px-2 py-0.5 rounded">Created: 2026-09-01</span>
               </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
               <h3 className="text-[14px] font-bold text-white mb-2 leading-tight">LOTO (Lock Out Tag Out) for Raw Mill</h3>
               <p className="text-[11px] text-[#8899aa] mb-4 flex-1">Mandatory isolation points and visual tagging requirements before entering the Raw Mill for inspection.</p>
               <div className="flex items-center justify-between pt-3 border-t border-[#15303f]">
                 <span className="text-[10px] text-[#5a7384]">By: S. Gupta</span>
                 <span className="text-[10px] text-[#00d4ff]">56 Trained</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OnePointLessons;
