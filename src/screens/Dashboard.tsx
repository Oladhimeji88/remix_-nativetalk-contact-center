/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../store';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  PhoneCall, Users, PhoneIncoming, TrendingUp, Clock, AlertTriangle, ArrowUpRight,
  Shield, Server, HardDrive, Database, Landmark, UserCheck, Play, ArrowRight, Activity, Zap
} from 'lucide-react';

export default function Dashboard() {
  const { 
    campaigns, 
    agents, 
    callLogs, 
    setActiveTab, 
    softphoneState, 
    softphoneContact,
    currentRole,
    currentUser,
    tenants,
    infraNodes
  } = useStore();

  // Basic operational metrics
  const totalCallsToday = callLogs.length + 84;
  const avgHandleTime = '2m 15s';
  const availableAgentsCount = agents.filter(a => a.status === 'Available').length;
  const activeCallsCount = agents.filter(a => a.status === 'On Call').length + (softphoneState === 'Connected' ? 1 : 0);

  // Recharts data
  const chartData = campaigns.map(c => ({
    name: c.name.length > 15 ? c.name.substring(0, 12) + '...' : c.name,
    Dialed: Math.round(c.contactsCount * 0.7),
    Connected: Math.round(c.contactsCount * 0.7 * (c.contactRate / 100)),
    Pending: Math.round(c.contactsCount * 0.3)
  }));

  // Render different dashboard contents based on user roles
  if (currentRole === 'superadmin') {
    return (
      <div id="superadmin-dashboard-view" className="space-y-6 animate-fadeIn select-none text-xs text-slate-300">
        
        {/* Row 1: Super Admin Widgets */}
        <div className="flex justify-between items-center bg-[#111827] border border-slate-800 p-4 rounded-lg">
          <div>
            <h2 className="text-base font-extrabold text-slate-100 font-sans">Super Admin Platform Control Deck</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Global multitenancy boundaries and FreeSWITCH cluster orchestration metrics</p>
          </div>
          <span className="px-2.5 py-1 text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold uppercase tracking-wider rounded">
            Role: Super Admin
          </span>
        </div>

        {/* Global Multi-tenant metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Tenant Ratios</span>
            <p className="text-xl font-extrabold text-slate-100 font-mono">{tenants.length} Tenants</p>
            <p className="text-[10px] text-emerald-400 font-semibold">{tenants.filter(t => t.status === 'Active').length} Active Client clusters</p>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Infrastructure Clustering</span>
            <p className="text-xl font-extrabold text-slate-100 font-mono">{infraNodes.length} FreeSWITCH Nodes</p>
            <p className="text-[10px] text-emerald-400 font-semibold">{infraNodes.filter(n => n.status === 'Online').length} Registered Online</p>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Aggregate Calls</span>
            <p className="text-xl font-extrabold text-slate-100 font-mono">{activeCallsCount + 44} Calls</p>
            <p className="text-[10px] text-slate-500">Distributed across cluster</p>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Load Capacity</span>
            <p className="text-xl font-extrabold text-slate-100 font-mono">4.3% Limit</p>
            <p className="text-[10px] text-slate-500">Out of 2000 session max limit</p>
          </div>
        </div>

        {/* Quick action maps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
              <h3 className="font-bold text-slate-200">Active Tenant Profiles</h3>
              <button onClick={() => setActiveTab('superadmin-platform')} className="text-blue-400 hover:underline">Manage Tenants &rarr;</button>
            </div>
            <div className="space-y-2.5">
              {tenants.map(t => (
                <div key={t.id} className="flex justify-between items-center p-2.5 rounded bg-[#111827] border border-slate-850">
                  <div>
                    <p className="font-bold text-slate-200">{t.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{t.plan} tier • {t.usersCount} Seats</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
              <h3 className="font-bold text-slate-200">Clustered Infrastructure Nodes</h3>
              <button onClick={() => setActiveTab('superadmin-platform')} className="text-blue-400 hover:underline">View Node Hardware &rarr;</button>
            </div>
            <div className="space-y-2.5">
              {infraNodes.map(n => (
                <div key={n.id} className="flex justify-between items-center p-2.5 rounded bg-[#111827] border border-slate-850">
                  <div className="flex items-center gap-2">
                    <Server size={14} className="text-blue-400" />
                    <div>
                      <p className="font-bold text-slate-200 font-mono">{n.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{n.ip} • CPU {n.cpu}%</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {n.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    );
  }

  if (currentRole === 'admin') {
    return (
      <div id="admin-dashboard-view" className="space-y-6 animate-fadeIn select-none text-xs text-slate-300">
        
        {/* Row 1: Admin header */}
        <div className="flex justify-between items-center bg-[#111827] border border-slate-800 p-4 rounded-lg">
          <div>
            <h2 className="text-base font-extrabold text-slate-100 font-sans">Tenant Administration Dashboard</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Control company PBX parameters, user roles, extensions, and licensing</p>
          </div>
          <span className="px-2.5 py-1 text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold uppercase tracking-wider rounded">
            Role: Admin
          </span>
        </div>

        {/* Operational cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Registered Users</span>
            <p className="text-xl font-extrabold text-slate-100 font-mono">{agents.length} Profiles</p>
            <p className="text-[10px] text-slate-500">Across agent and supervisor roles</p>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Company SIP Trunks</span>
            <p className="text-xl font-extrabold text-slate-100 font-mono">3 Active Trunks</p>
            <p className="text-[10px] text-emerald-400 font-semibold">100% SLA uptime</p>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Inbound Queues</span>
            <p className="text-xl font-extrabold text-slate-100 font-mono">4 ACD Queues</p>
            <p className="text-[10px] text-slate-500">Skill-based routing online</p>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Licensed Seats</span>
            <p className="text-xl font-extrabold text-slate-100 font-mono">15 Seats Max</p>
            <p className="text-[10px] text-slate-500">Growth Plan allocation</p>
          </div>
        </div>

        {/* Administrative Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] border-b border-slate-800/60 pb-2">PBX Utilities</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('cloudpbx')}
                className="w-full text-left bg-[#111827] hover:bg-slate-800 border border-slate-800/80 p-3 rounded font-bold flex items-center justify-between"
              >
                <span>Edit Interactive IVR Attendants</span>
                <ArrowRight size={12} className="text-slate-500" />
              </button>
              <button 
                onClick={() => setActiveTab('cloudpbx')}
                className="w-full text-left bg-[#111827] hover:bg-slate-800 border border-slate-800/80 p-3 rounded font-bold flex items-center justify-between"
              >
                <span>Manage Global Inbound DIDs</span>
                <ArrowRight size={12} className="text-slate-500" />
              </button>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] border-b border-slate-800/60 pb-2">User Access Control</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('users')}
                className="w-full text-left bg-[#111827] hover:bg-slate-800 border border-slate-800/80 p-3 rounded font-bold flex items-center justify-between"
              >
                <span>Invite New Staff / Agent Members</span>
                <ArrowRight size={12} className="text-slate-500" />
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className="w-full text-left bg-[#111827] hover:bg-slate-800 border border-slate-800/80 p-3 rounded font-bold flex items-center justify-between"
              >
                <span>Audit Team Role Assignments</span>
                <ArrowRight size={12} className="text-slate-500" />
              </button>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] border-b border-slate-800/60 pb-2">System Analytics</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('analytics')}
                className="w-full text-left bg-[#111827] hover:bg-slate-800 border border-slate-800/80 p-3 rounded font-bold flex items-center justify-between"
              >
                <span>SLA Response Rate Reports</span>
                <ArrowRight size={12} className="text-slate-500" />
              </button>
              <button 
                onClick={() => setActiveTab('recordings')}
                className="w-full text-left bg-[#111827] hover:bg-slate-800 border border-slate-800/80 p-3 rounded font-bold flex items-center justify-between"
              >
                <span>Historical Recording Library</span>
                <ArrowRight size={12} className="text-slate-500" />
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }

  if (currentRole === 'supervisor') {
    return (
      <div id="supervisor-dashboard-view" className="space-y-6 animate-fadeIn select-none text-xs text-slate-300">
        
        {/* Row 1: Supervisor header */}
        <div className="flex justify-between items-center bg-[#111827] border border-slate-800 p-4 rounded-lg">
          <div>
            <h2 className="text-base font-extrabold text-slate-100 font-sans">Supervisor Active Command Center</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Live monitoring, service level response limits, agent status deck, and campaign trends</p>
          </div>
          <span className="px-2.5 py-1 text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold uppercase tracking-wider rounded">
            Role: Supervisor
          </span>
        </div>

        {/* Row 2: Basic KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">On Call</span>
            <p className="text-xl font-extrabold text-slate-100 font-mono">{activeCallsCount} Agents</p>
          </div>
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Available</span>
            <p className="text-xl font-extrabold text-slate-100 font-mono">{availableAgentsCount} Agents</p>
          </div>
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Avg Wait Time</span>
            <p className="text-xl font-extrabold text-slate-100 font-mono">14 Seconds</p>
          </div>
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Daily Calls</span>
            <p className="text-xl font-extrabold text-slate-100 font-mono">{totalCallsToday}</p>
          </div>
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Uptime SLA</span>
            <p className="text-xl font-extrabold text-emerald-400 font-mono">98.2%</p>
          </div>
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Calls Waiting</span>
            <p className="text-xl font-extrabold text-rose-400 font-mono">2</p>
          </div>
        </div>

        {/* Row 3: Command Center Table & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0F172A] border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
              <h3 className="font-bold text-slate-200">Live Agent Sessions</h3>
              <button onClick={() => setActiveTab('supervisor')} className="text-blue-400 hover:underline">Launch Command Center &rarr;</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800">
                    <th className="p-2.5 font-semibold">Staff Name</th>
                    <th className="p-2.5 font-semibold">State</th>
                    <th className="p-2.5 font-semibold font-mono">Ext ID</th>
                    <th className="p-2.5 font-semibold">Session Active Campaign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {agents.slice(0, 4).map((agent) => (
                    <tr key={agent.id} className="hover:bg-slate-800/20">
                      <td className="p-2.5 font-medium text-slate-200">{agent.name}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          agent.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {agent.status}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono text-slate-400">10{agent.id === 'u-1' ? '1' : '2'}</td>
                      <td className="p-2.5 text-slate-400">Lagos Outbound Fiber Expansion</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] border-b border-slate-800/60 pb-2">Active Campaign Trends</h3>
            <div className="space-y-2.5 font-mono text-[11px]">
              {campaigns.slice(0, 3).map((camp, idx) => (
                <div key={idx} className="p-2.5 bg-[#111827] rounded border border-slate-850">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-200 truncate pr-2">{camp.name}</span>
                    <span className="text-emerald-400 font-bold">{camp.contactRate}%</span>
                  </div>
                  <div className="bg-slate-900 h-2 rounded overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${camp.contactRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Agent Dashboard (Default)
  return (
    <div id="screen-dashboard-agent" className="space-y-6 animate-fadeIn select-none text-xs text-slate-300">
      
      {/* Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/10 to-indigo-900/15 border border-slate-800 p-5 rounded-lg">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-slate-100 font-sans">Welcome Back, {currentUser ? currentUser.name : 'Agent'}!</h2>
          <p className="text-[11px] text-slate-500">Your extension #101 is registered. Ready to receive ACD calls.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('workspace')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded font-bold shadow"
          >
            Launch Workspace
          </button>
          <button 
            onClick={() => setActiveTab('dialer')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-1.5 rounded font-bold"
          >
            Outbound Dialer
          </button>
        </div>
      </div>

      {/* Row 2: Agent Personal KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Talk Time Today</span>
          <p className="text-xl font-extrabold text-slate-100 font-mono">1h 44m</p>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Completed Contacts</span>
          <p className="text-xl font-extrabold text-slate-100 font-mono">42 Leads</p>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Wrap-Up Time Avg</span>
          <p className="text-xl font-extrabold text-slate-100 font-mono">24 Seconds</p>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Daily Success Rate</span>
          <p className="text-xl font-extrabold text-emerald-400 font-mono">74.5%</p>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Idle State Ratio</span>
          <p className="text-xl font-extrabold text-slate-100 font-mono">8.3%</p>
        </div>
      </div>

      {/* Row 3: Call Logs Overview */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
          <h3 className="font-bold text-slate-200">Your Recent Call History</h3>
          <button onClick={() => setActiveTab('logs')} className="text-blue-400 hover:underline">View All Logs &rarr;</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800">
                <th className="p-2.5 font-semibold">Caller Number</th>
                <th className="p-2.5 font-semibold font-mono">Dialed Time</th>
                <th className="p-2.5 font-semibold">Talk duration</th>
                <th className="p-2.5 font-semibold">Disposition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {callLogs.slice(0, 3).map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/20">
                  <td className="p-2.5 font-mono text-slate-200">{log.caller}</td>
                  <td className="p-2.5 font-mono text-slate-400">{log.callTime}</td>
                  <td className="p-2.5 font-mono text-blue-400">{log.duration}s</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      {log.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
