/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Users, UserCheck, ShieldAlert, Clock, ArrowRight, X, Phone, CheckCircle, 
  Settings, ChevronRight, BarChart2 
} from 'lucide-react';

export default function SupervisorDashboard() {
  const { agents, callLogs, setAgentStatus } = useStore();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Find selected agent
  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  // Filter call logs for this agent to show in timeline
  const agentLogs = selectedAgent 
    ? callLogs.filter(log => log.agentName.toLowerCase().includes(selectedAgent.name.split(' ')[0].toLowerCase()))
    : [];

  const handleRowClick = (id: string) => {
    setSelectedAgentId(id);
  };

  const handleCloseDrawer = () => {
    setSelectedAgentId(null);
  };

  return (
    <div id="screen-supervisor-dashboard" className="space-y-6 animate-fadeIn select-none relative">
      
      {/* Top operational metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Supervisors', value: '2', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Staff Agents Active', value: agents.filter(a => a.status !== 'Offline').length, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Avg Hold Time Queue', value: '42s', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'SL% Target (20s)', value: '88.4%', icon: ShieldAlert, color: 'text-amber-500', bg: 'bg-amber-500/10' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#111827] border border-slate-800 rounded p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{stat.label}</span>
                <span className="text-xl font-extrabold text-slate-100 font-mono block mt-1">{stat.value}</span>
              </div>
              <div className={`p-2 rounded ${stat.bg}`}>
                <Icon size={14} className={stat.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Agents Performance Data Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wide">Live Agent Staff Deck</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Click any agent row to slide out call history timeline logs.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-mono text-[10px] uppercase">
                <th className="p-2.5">Agent Details</th>
                <th className="p-2.5">Status State</th>
                <th className="p-2.5 font-mono text-center">Calls Made</th>
                <th className="p-2.5 font-mono text-center">Connections</th>
                <th className="p-2.5 font-mono text-center">Avg AHT</th>
                <th className="p-2.5 font-mono text-center">Conversion</th>
                <th className="p-2.5 text-right">Interactive Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {agents.map((agent) => (
                <tr 
                  id={`supervisor-agent-row-${agent.id}`}
                  key={agent.id} 
                  onClick={() => handleRowClick(agent.id)}
                  className="hover:bg-slate-800/30 cursor-pointer transition-colors"
                >
                  <td className="p-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700/60 flex items-center justify-center font-bold text-[10px] text-slate-300">
                        {agent.avatar}
                      </div>
                      <div>
                        <span className="font-bold text-slate-200">{agent.name}</span>
                        <p className="text-[10px] text-slate-500 font-mono">{agent.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      agent.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      agent.status === 'On Call' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse' :
                      agent.status === 'Wrap-Up' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-slate-800 text-slate-500'
                    }`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-center font-mono text-slate-400">{agent.callsMade}</td>
                  <td className="p-2.5 text-center font-mono text-slate-400">{agent.connections}</td>
                  <td className="p-2.5 text-center font-mono text-slate-400">{agent.avgHandleTime}s</td>
                  <td className="p-2.5 text-center font-mono font-bold text-emerald-400">{agent.conversionRate}%</td>
                  <td className="p-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5 text-[10px]">
                      {agent.status === 'Offline' ? (
                        <button 
                          onClick={() => setAgentStatus(agent.id, 'Available')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold border border-slate-700/60"
                        >
                          Enable Standby
                        </button>
                      ) : (
                        <button 
                          onClick={() => setAgentStatus(agent.id, 'Offline')}
                          className="px-2 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded font-semibold border border-rose-500/20"
                        >
                          Force Offline
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AGENT DETAIL SIDE DRAWER (SHEET) */}
      {selectedAgent && (
        <div id="agent-side-drawer-overlay" className="fixed inset-0 bg-[#020617]/70 backdrop-blur-sm flex justify-end z-50">
          <div 
            id="agent-side-drawer-container" 
            className="bg-[#111827] border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto animate-slideInRight"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">
                    {selectedAgent.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm">{selectedAgent.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono">{selectedAgent.email}</p>
                  </div>
                </div>
                <button 
                  id="drawer-close-btn"
                  onClick={handleCloseDrawer} 
                  className="text-slate-400 hover:text-white p-1 bg-slate-800/40 rounded border border-transparent hover:border-slate-700/60 transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Stats card inside drawer */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#0f172a] border border-slate-800 rounded p-3 text-center">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Conversion %</span>
                  <span className="text-sm font-bold font-mono text-emerald-400 block mt-1">{selectedAgent.conversionRate}%</span>
                </div>
                <div className="bg-[#0f172a] border border-slate-800 rounded p-3 text-center">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Avg Handle Time</span>
                  <span className="text-sm font-bold font-mono text-blue-400 block mt-1">{selectedAgent.avgHandleTime}s</span>
                </div>
              </div>

              {/* Call History / Timeline log */}
              <div className="space-y-4">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-800/60 pb-1.5">Interactive Call Timeline</h4>
                
                {agentLogs.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">No active CDR logs registered for this shift.</p>
                ) : (
                  <div className="relative border-l border-slate-800 pl-4 space-y-4 ml-2">
                    {agentLogs.map((log) => (
                      <div key={log.id} className="relative text-xs">
                        {/* Bullet node dot */}
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#111827]"></div>
                        
                        <div className="p-3 rounded border border-slate-800 bg-[#0f172a]/60 space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span className="font-mono">{log.callTime}</span>
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-bold">{log.duration}s</span>
                          </div>
                          <div>
                            <p className="font-bold text-slate-300">Customer: {log.caller}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Outcome: <strong className="text-blue-400">{log.outcome}</strong></p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex gap-2">
              <button 
                id="drawer-force-offline"
                onClick={() => {
                  setAgentStatus(selectedAgent.id, 'Offline');
                  handleCloseDrawer();
                }}
                className="flex-1 py-1.5 text-xs font-bold bg-rose-500/15 hover:bg-rose-500/20 text-rose-400 rounded border border-rose-500/30 text-center transition-colors"
              >
                Log Agent Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
