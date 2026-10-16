/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Tenant, FSNode } from '../store';
import { 
  Database, Plus, ShieldCheck, X, Trash2, Cpu, HardDrive, RefreshCw, AlertCircle, 
  Terminal, ShieldAlert, Activity, CheckCircle, Zap, TrendingUp, Users, Server
} from 'lucide-react';

export default function SuperAdminPlatform() {
  const { tenants, infraNodes } = useStore();
  const [activeSegment, setActiveSegment] = useState<'tenants' | 'infra' | 'capacity' | 'esl'>('tenants');

  // Local state for Tenant CRUD simulation
  const [localTenants, setLocalTenants] = useState<Tenant[]>(tenants);
  const [localNodes, setLocalNodes] = useState<FSNode[]>(infraNodes);

  // Form states for tenant creation
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [tenantPlan, setTenantPlan] = useState<'Growth' | 'Enterprise' | 'Scale'>('Growth');
  const [tenantUsers, setTenantUsers] = useState(10);

  // ESL Log streams simulation
  const [eslLogs, setEslLogs] = useState<Array<{ id: string; time: string; type: string; message: string; node: string }>>([
    { id: '1', time: '15:32:01', type: 'EVENT_HEARTBEAT', message: 'fs-core-lagos-01: Heartbeat event dispatched. Session count: 65, Idle CPU: 76%', node: 'fs-core-lagos-01' },
    { id: '2', time: '15:32:05', type: 'CHANNEL_CREATE', message: 'glo-gateway: Call channel established. ID: ddf8c2a4-fc6a-493a-865f', node: 'fs-core-lagos-01' },
    { id: '3', time: '15:32:05', type: 'CHANNEL_ANSWER', message: 'glo-gateway: Routing inbound call (DID: +23412278890) to lagos-ivr', node: 'fs-core-lagos-01' },
    { id: '4', time: '15:32:12', type: 'EVENT_HEARTBEAT', message: 'fs-core-abuja-02: Heartbeat event dispatched. Session count: 22, Idle CPU: 82%', node: 'fs-core-abuja-02' },
    { id: '5', time: '15:32:14', type: 'REGISTRATION_SUCCESS', message: 'WebRTC client b.alao@nativetalk.ng from 197.210.8.44:34522', node: 'fs-core-lagos-01' },
    { id: '6', time: '15:32:20', type: 'CHANNEL_DESTROY', message: 'glo-gateway: Call cleared. Cause: NORMAL_CLEARING. Duration: 14s', node: 'fs-core-lagos-01' }
  ]);

  // Append logs periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['EVENT_HEARTBEAT', 'CHANNEL_CREATE', 'CHANNEL_ANSWER', 'REGISTRATION_SUCCESS', 'CHANNEL_DESTROY'];
      const messages = [
        'Heartbeat event dispatched. Sessions clear, health nominal.',
        'Call channel established. Routing to dialer cluster...',
        'Inbound call answered. Connecting with live agent endpoint...',
        'SIP user registered successfully from TLS 5061 port.',
        'Call cleared. Status: NORMAL_CLEARING. Code: 200.'
      ];
      const selectedIndex = Math.floor(Math.random() * types.length);
      const randomNode = Math.random() > 0.4 ? 'fs-core-lagos-01' : 'fs-core-abuja-02';
      
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      const newLog = {
        id: Math.random().toString(),
        time: timeStr,
        type: types[selectedIndex],
        message: `${randomNode}: ${messages[selectedIndex]}`,
        node: randomNode
      };

      setEslLogs(prev => [newLog, ...prev.slice(0, 18)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleAddTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim()) return;

    const newTenant: Tenant = {
      id: `t-${localTenants.length + 1}`,
      name: tenantName,
      plan: tenantPlan,
      usersCount: tenantUsers,
      activeCalls: 0,
      status: 'Active'
    };

    setLocalTenants([...localTenants, newTenant]);
    setIsAddTenantOpen(false);
    setTenantName('');
    setTenantPlan('Growth');
    setTenantUsers(10);
  };

  const toggleTenantStatus = (id: string) => {
    setLocalTenants(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return t;
    }));
  };

  const totalConcurrentCalls = localTenants.reduce((acc, curr) => acc + curr.activeCalls, 0);
  const totalUsers = localTenants.reduce((acc, curr) => acc + curr.usersCount, 0);
  const maxConcurrentCapacity = 2000;
  const capacityUtilization = ((totalConcurrentCalls / maxConcurrentCapacity) * 100).toFixed(1);

  return (
    <div id="screen-superadmin-platform" className="space-y-6 animate-fadeIn select-none font-sans text-xs text-slate-300">
      
      {/* Super Admin KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Platform Tenants</p>
            <p className="text-xl font-bold text-slate-100 font-mono">{localTenants.length} Companies</p>
            <p className="text-[9px] text-slate-500 mt-0.5">{localTenants.filter(t => t.status === 'Active').length} Active tenants</p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/20 w-9 h-9 rounded-full flex items-center justify-center text-blue-400">
            <Users size={16} />
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Active Infrastructure Nodes</p>
            <p className="text-xl font-bold text-slate-100 font-mono">{localNodes.filter(n => n.status === 'Online').length} / {localNodes.length} Online</p>
            <p className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Clustering Active</span>
            </p>
          </div>
          <div className="bg-emerald-600/10 border border-emerald-500/20 w-9 h-9 rounded-full flex items-center justify-center text-emerald-400">
            <Server size={16} />
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Total Active Calls (Inbound + Outbound)</p>
            <p className="text-xl font-bold text-slate-100 font-mono">{totalConcurrentCalls} Calls</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Through 12 concurrent SIP gateways</p>
          </div>
          <div className="bg-purple-600/10 border border-purple-500/20 w-9 h-9 rounded-full flex items-center justify-center text-purple-400">
            <Activity size={16} />
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Capacity Utilization Ratio</p>
            <p className="text-xl font-bold text-slate-100 font-mono">{capacityUtilization}%</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Threshold: {maxConcurrentCapacity} concurrent calls max</p>
          </div>
          <div className="bg-amber-600/10 border border-amber-500/20 w-9 h-9 rounded-full flex items-center justify-center text-amber-400">
            <TrendingUp size={16} />
          </div>
        </div>
      </div>

      {/* Segment Navigation */}
      <div className="flex gap-2 border-b border-slate-800 pb-px">
        {[
          { id: 'tenants', label: 'Multi-Tenant Management', icon: Database },
          { id: 'infra', label: 'Clustering & FreeSWITCH Nodes', icon: Server },
          { id: 'capacity', label: 'Capacity & Load Balancing', icon: Activity },
          { id: 'esl', label: 'ESL Event Streams', icon: Terminal }
        ].map((seg) => {
          const Icon = seg.icon;
          return (
            <button
              key={seg.id}
              onClick={() => setActiveSegment(seg.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold transition-all text-xs ${
                activeSegment === seg.id 
                  ? 'border-rose-500 text-slate-200' 
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-800'
              }`}
            >
              <Icon size={12} />
              <span>{seg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Segment Contents */}
      <div className="pt-2">
        {activeSegment === 'tenants' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-200">Tenant Billing & Resource Boundaries</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Provision and toggle multi-tenant software boundaries</p>
              </div>
              <button
                onClick={() => setIsAddTenantOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              >
                <Plus size={14} />
                <span>Provision Tenant Account</span>
              </button>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-mono text-[9px] uppercase tracking-wider">
                    <th className="p-3">Tenant Client Name</th>
                    <th className="p-3">Subscription tier Plan</th>
                    <th className="p-3 font-mono">Provisioned Seats</th>
                    <th className="p-3 font-mono">Active Calls Ratio</th>
                    <th className="p-3">Operational Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {localTenants.map((ten) => (
                    <tr key={ten.id} className="hover:bg-slate-800/10">
                      <td className="p-3 font-bold text-slate-200">{ten.name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                          ten.plan === 'Enterprise' 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                            : ten.plan === 'Scale' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                            : 'bg-slate-800 text-slate-400 border-slate-700/60'
                        }`}>
                          {ten.plan}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-300">{ten.usersCount} Seats</td>
                      <td className="p-3 font-mono text-slate-400">{ten.activeCalls} Active sessions</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                          ten.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {ten.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleTenantStatus(ten.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                              ten.status === 'Active'
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                                : 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25'
                            }`}
                          >
                            {ten.status === 'Active' ? 'Suspend' : 'Re-Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isAddTenantOpen && (
              <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4">
                <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 w-full max-w-sm space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-slate-200 text-sm">Provision Client Boundary</h4>
                    <button onClick={() => setIsAddTenantOpen(false)} className="text-slate-500 hover:text-white">X</button>
                  </div>
                  <form onSubmit={handleAddTenantSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase block text-[9px]">Company Account Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. United Bank for Africa"
                        value={tenantName}
                        onChange={(e) => setTenantName(e.target.value)}
                        className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase block text-[9px]">Subscription Tier</label>
                        <select
                          value={tenantPlan}
                          onChange={(e) => setTenantPlan(e.target.value as any)}
                          className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                        >
                          <option value="Growth">Growth SLA</option>
                          <option value="Scale">Scale SLA</option>
                          <option value="Enterprise">Enterprise Premium</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase block text-[9px]">Maximum Seat Count</label>
                        <input
                          type="number"
                          value={tenantUsers}
                          onChange={(e) => setTenantUsers(parseInt(e.target.value) || 10)}
                          className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded">
                      Deploy Tenant Cluster
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSegment === 'infra' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Clustered FreeSWITCH Server Nodes</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Real-time status tracking of distributed hardware server clusters hosting the WebRTC signaling engine</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localNodes.map((node) => (
                <div key={node.id} className="bg-[#111827] border border-slate-800 rounded-lg p-5 space-y-4 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-800/60 border border-slate-800 rounded text-rose-400">
                        <Cpu size={14} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 font-mono">{node.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">{node.ip}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      node.status === 'Online' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {node.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#0f172a] p-2.5 rounded border border-slate-850 space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase font-mono">CPU Usage</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-200">{node.cpu}%</span>
                        <div className="flex-1 bg-slate-800 h-1 rounded overflow-hidden">
                          <div className="bg-rose-500 h-full" style={{ width: `${node.cpu}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0f172a] p-2.5 rounded border border-slate-850 space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase font-mono">RAM Utilization</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-200">{node.memory}%</span>
                        <div className="flex-1 bg-slate-800 h-1 rounded overflow-hidden">
                          <div className="bg-purple-500 h-full" style={{ width: `${node.memory}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0f172a] p-2.5 rounded border border-slate-850 space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase font-mono">Registered Accounts</span>
                      <p className="font-mono font-bold text-slate-200 text-sm mt-0.5">{node.registrations}</p>
                    </div>

                    <div className="bg-[#0f172a] p-2.5 rounded border border-slate-850 space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase font-mono">Active Concurrent Calls</span>
                      <p className="font-mono font-bold text-blue-400 text-sm mt-0.5">{node.activeCalls} Sessions</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSegment === 'capacity' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Load balancing & Gateway capacities</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Statistical graphing representing multi-node session capacities and active balancing ratios</p>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 space-y-5">
              <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Clustered Balancing Ratio</p>
                  <p className="text-sm font-bold text-slate-100">Round-Robin Node Distribution (Default)</p>
                </div>
                <button 
                  onClick={() => alert('Balancing algorithm refreshed. Distributed load ratio updated.')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-1.5 rounded font-bold"
                >
                  Force Re-Balance Nodes
                </button>
              </div>

              {/* Graphical simulation container representing capacity mapping */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase font-mono">Clustered Node Weights</p>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-slate-300">fs-core-lagos-01 (Capacity 1000 max calls)</span>
                      <span className="font-mono text-slate-400">65% active utilization (65 calls in progress)</span>
                    </div>
                    <div className="bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: '6.5%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-slate-300">fs-core-abuja-02 (Capacity 1000 max calls)</span>
                      <span className="font-mono text-slate-400">22% active utilization (22 calls in progress)</span>
                    </div>
                    <div className="bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: '2.2%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSegment === 'esl' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-200">Event Socket Layer (ESL) Live stream</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Real-time asynchronous socket event stream output directly from FreeSWITCH clustered sockets</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] text-slate-400">Socket connected to loopback</span>
              </div>
            </div>

            {/* ESL Terminal Box */}
            <div className="bg-[#0b0f19] border border-slate-800 rounded-lg overflow-hidden flex flex-col font-mono text-[11px] leading-relaxed shadow-lg">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider pl-1.5">Socket Console</span>
                </div>
                <span className="text-[9px] text-slate-600 font-mono">Ctrl+C to clear buffer</span>
              </div>
              <div className="p-4 h-80 overflow-y-auto space-y-2 select-text selection:bg-rose-500 selection:text-white scrollbar-thin">
                {eslLogs.map((log) => (
                  <div key={log.id} className="hover:bg-slate-900/40 py-0.5 px-1.5 rounded transition-colors flex items-start gap-4">
                    <span className="text-slate-600 shrink-0 font-bold">{log.time}</span>
                    <span className={`shrink-0 font-bold text-[9px] tracking-wide px-1.5 rounded ${
                      log.type === 'EVENT_HEARTBEAT' ? 'bg-slate-800 text-slate-400' :
                      log.type === 'CHANNEL_CREATE' ? 'bg-blue-950 text-blue-400 border border-blue-500/20' :
                      log.type === 'CHANNEL_ANSWER' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' :
                      log.type === 'REGISTRATION_SUCCESS' ? 'bg-purple-950 text-purple-400 border border-purple-500/20' :
                      'bg-slate-900 text-slate-500'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-slate-300 select-text break-all">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
