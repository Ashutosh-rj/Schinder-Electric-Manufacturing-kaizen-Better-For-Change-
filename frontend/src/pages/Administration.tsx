import React, { useState } from 'react';
import { Shield, Users, Database, Settings, Tag, Target } from 'lucide-react';

const Administration = () => {
  const [activeTab, setActiveTab] = useState('users');
  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-800">
        {[
            { id: 'users', label: 'User Management', icon: <Users size={16}/> },
            { id: 'tags', label: 'Tag Configuration', icon: <Tag size={16}/> },
            { id: 'windows', label: 'Operating Windows', icon: <Target size={16}/> },
            { id: 'settings', label: 'System Settings', icon: <Settings size={16}/> }
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 flex items-center gap-2 text-sm font-medium ${activeTab===tab.id ? 'text-[#00d4ff] border-b-2 border-[#00d4ff]' : 'text-gray-400 hover:text-white'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
      <div className="bg-[#1a2540] rounded-lg border border-gray-800 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">Users</h2>
          <button className="bg-[#00d4ff] text-[#0a0e1a] font-bold px-3 py-1 rounded text-sm hover:bg-[#00b4d8]">Add User</button>
        </div>
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
            <tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Role</th><th className="px-4 py-2">Department</th><th className="px-4 py-2">Status</th></tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800"><td className="px-4 py-3">Rajesh Kumar</td><td className="px-4 py-3">Process Engineer</td><td className="px-4 py-3">Production</td><td className="px-4 py-3 text-[#00e676]">Active</td></tr>
            <tr className="border-b border-gray-800"><td className="px-4 py-3">Amit Singh</td><td className="px-4 py-3">Maintenance Head</td><td className="px-4 py-3">Mechanical</td><td className="px-4 py-3 text-[#00e676]">Active</td></tr>
            <tr><td className="px-4 py-3">Priya Sharma</td><td className="px-4 py-3">Plant Head</td><td className="px-4 py-3">Management</td><td className="px-4 py-3 text-[#00e676]">Active</td></tr>
          </tbody>
        </table>
      </div>
      )}

      {activeTab === 'settings' && (
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-3 flex items-center gap-2"><Settings size={18}/> Simulator Control</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Current Scenario</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white">
                <option>Normal Operation</option>
                <option>Raw Mill Degradation</option>
                <option>High Moisture Feed</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Energy Costs</label>
              <div className="flex gap-2">
                  <input type="text" defaultValue="7.5" className="w-1/2 bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white" placeholder="₹/kWh" />
                  <input type="text" defaultValue="1850" className="w-1/2 bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white" placeholder="₹/t Coal" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#1a2540] p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-3 flex items-center gap-2"><Database size={18}/> System Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">API Backend</span><span className="text-[#00e676] font-bold">ONLINE</span></div>
            <div className="flex justify-between"><span className="text-gray-400">ML Engine</span><span className="text-[#00e676] font-bold">ONLINE</span></div>
            <div className="flex justify-between"><span className="text-gray-400">OPC UA Client</span><span className="text-[#ffa726] font-bold">SIMULATED</span></div>
          </div>
        </div>
      </div>
      )}
      
      {activeTab === 'windows' && (
         <div className="bg-[#1a2540] rounded-lg border border-gray-800 p-4">
             <div className="bg-[#ffa726]/10 text-[#ffa726] p-2 text-sm rounded mb-4">
                 Note: Operating windows must be based on OEM documentation, plant operating procedures, and engineering standards.
             </div>
             <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
                <tr><th className="px-4 py-2">Equipment</th><th className="px-4 py-2">Parameter</th><th className="px-4 py-2">Op Low</th><th className="px-4 py-2">Op High</th><th className="px-4 py-2">Target</th><th className="px-4 py-2">Action</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800"><td className="px-4 py-3">Kiln</td><td className="px-4 py-3">Feed Rate (TPH)</td><td className="px-4 py-3">250</td><td className="px-4 py-3">350</td><td className="px-4 py-3">300</td><td className="px-4 py-3"><button className="text-[#00d4ff]">Edit</button></td></tr>
              </tbody>
            </table>
         </div>
      )}
    </div>
  );
};
export default Administration;
