import React from 'react';
import { Search, Filter, Share2, Eye, Download } from 'lucide-react';

const KaizenDatabase = () => {
  const db = [
    { id: 'KAI-1045', title: 'Cooler Fan Profile Optimization', dept: 'PYROPROCESS', date: '2025-08-12', saving: '350 kWh/day', owner: 'M. Kumar', replicate: 'Yes' },
    { id: 'KAI-1042', title: 'Raw Mill Separator Speed', dept: 'RAW_MILL', date: '2025-07-28', saving: '280 kWh/day', owner: 'S. Gupta', replicate: 'No' },
    { id: 'KAI-0988', title: 'Kiln Primary Air Reduction', dept: 'PYROPROCESS', date: '2025-06-15', saving: '420 kWh/day', owner: 'R. Sharma', replicate: 'Yes' },
    { id: 'KAI-0912', title: 'Preheater False Air Sealing', dept: 'MAINTENANCE', date: '2025-04-02', saving: '580 kWh/day', owner: 'A. Patel', replicate: 'N/A' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#041116] text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-wide">Kaizen Database</h1>
          <p className="text-[11px] text-[#8899aa] uppercase tracking-wider">Searchable Knowledge Base of Past Improvements</p>
        </div>
        <button className="flex items-center gap-2 bg-[#15303f] hover:bg-[#2a4555] text-white border border-[#2a4555] px-4 py-2 rounded-lg text-sm font-bold transition-colors">
          <Download size={16} /> EXPORT
        </button>
      </div>

      <div className="bg-[#091b24] border border-[#15303f] rounded-xl p-5 shadow-lg flex flex-col flex-1">
         <div className="flex gap-4 mb-6">
           <div className="flex-1 relative">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a7384]" />
             <input type="text" placeholder="Search improvements e.g., 'fan energy' or 'SEC'..." className="w-full bg-[#041116] border border-[#1c3a4a] text-sm text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-[#00d4ff] focus:outline-none" />
           </div>
           <button className="flex items-center gap-2 bg-[#041116] border border-[#1c3a4a] text-[#8899aa] px-4 py-2 rounded-lg text-sm hover:text-white transition-colors">
             <Filter size={16} /> Filter
           </button>
         </div>

         <div className="flex-1 overflow-x-auto rounded-lg border border-[#15303f] bg-[#041116]">
           <table className="w-full text-left text-[12px]">
             <thead className="bg-[#15303f]/50 text-[#8899aa] uppercase tracking-wider">
               <tr>
                 <th className="p-3 font-medium">Kaizen ID</th>
                 <th className="p-3 font-medium">Title</th>
                 <th className="p-3 font-medium">Department</th>
                 <th className="p-3 font-medium">Completed</th>
                 <th className="p-3 font-medium">Savings</th>
                 <th className="p-3 font-medium">Owner</th>
                 <th className="p-3 font-medium">Replicable</th>
                 <th className="p-3 font-medium text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-[#15303f]">
               {db.map((row) => (
                 <tr key={row.id} className="hover:bg-[#15303f]/30 transition-colors group">
                   <td className="p-3 font-mono text-[#00d4ff]">{row.id}</td>
                   <td className="p-3 font-bold text-white">{row.title}</td>
                   <td className="p-3 text-[#5a7384]">{row.dept}</td>
                   <td className="p-3 text-[#8899aa]">{row.date}</td>
                   <td className="p-3 text-[#00e676] font-bold">{row.saving}</td>
                   <td className="p-3 text-[#8899aa]">{row.owner}</td>
                   <td className="p-3">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.replicate === 'Yes' ? 'bg-[#00e676]/10 text-[#00e676]' : 'bg-[#15303f] text-[#5a7384]'}`}>{row.replicate}</span>
                   </td>
                   <td className="p-3 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-1.5 text-[#5a7384] hover:text-[#00d4ff] rounded bg-[#091b24]"><Eye size={14}/></button>
                     <button className="p-1.5 text-[#5a7384] hover:text-[#00e676] rounded bg-[#091b24]"><Share2 size={14}/></button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};

export default KaizenDatabase;
