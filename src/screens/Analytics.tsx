/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, LineChart, Line 
} from 'recharts';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, TrendingUp, Users, Clock } from 'lucide-react';

export default function Analytics() {
  const [activeSubTab, setActiveSubTab] = useState<'campaign' | 'agent' | 'call'>('campaign');

  // MOCK SEED DATA: Nigerian Communication Analytics
  const campaignAnalyticsData = [
    { name: 'Lagos Fiber Promo', Connected: 110, Busy: 20, NoAnswer: 15, DNC: 5 },
    { name: 'Retail Bank Upgrade', Connected: 250, Busy: 60, NoAnswer: 50, DNC: 20 },
    { name: 'Solar consultations', Connected: 45, Busy: 30, NoAnswer: 40, DNC: 5 },
    { name: 'DStv Premium Offer', Connected: 180, Busy: 15, NoAnswer: 20, DNC: 5 }
  ];

  const agentPerformanceData = [
    { name: 'Babatunde A.', Completed: 48, Connected: 32 },
    { name: 'Ngozi N.', Completed: 35, Connected: 22 },
    { name: 'Emeka N.', Completed: 42, Connected: 28 },
    { name: 'Halima M.', Completed: 29, Connected: 15 }
  ];

  const hourlyCallVolumeData = [
    { hour: '08:00', Vol: 45 },
    { hour: '10:00', Vol: 110 },
    { hour: '12:00', Vol: 185 },
    { hour: '14:00', Vol: 140 },
    { hour: '16:00', Vol: 95 },
    { hour: '18:00', Vol: 60 }
  ];

  return (
    <div id="screen-analytics" className="space-y-6 animate-fadeIn select-none font-sans">
      
      {/* Sub tabs navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100">Performance Intelligence</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">BI REPORTING GATEWAY v2.4</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/40 p-1 rounded border border-slate-700/60 text-xs">
          {[
            { id: 'campaign', label: 'Campaigns Outcomes', icon: BarChart3 },
            { id: 'agent', label: 'Agent Performance', icon: Users },
            { id: 'call', label: 'Traffic & Load', icon: LineIcon }
          ].map((sub) => {
            const Icon = sub.icon;
            return (
              <button
                id={`analytics-subtab-${sub.id}`}
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id as any)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded font-semibold transition-all ${
                  activeSubTab === sub.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={12} />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CORE ANALYTICS PANELS */}

      {/* 1. CAMPAIGN ANALYTICS */}
      {activeSubTab === 'campaign' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5">
            <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4">Outbound Campaign Dial Outcomes</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignAnalyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Connected" stackId="a" fill="#22c55e" />
                  <Bar dataKey="Busy" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="NoAnswer" stackId="a" fill="#ef4444" />
                  <Bar dataKey="DNC" stackId="a" fill="#64748b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed max-w-2xl">
            <p>
              <strong>Campaign Interpretation:</strong> The <em>Retail Banking Upgrade</em> campaign has delivered our highest density of completed calls, 
              while the <em>Lagos Fiber Promo</em> continues to register the highest ratio of connected speak time per dial attempt.
            </p>
          </div>
        </div>
      )}

      {/* 2. AGENT PERFORMANCE ANALYTICS */}
      {activeSubTab === 'agent' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5">
            <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4">Dial Attempts vs Successful Connections</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Connected" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 3. TRAFFIC & CALL LOAD ANALYTICS */}
      {activeSubTab === 'call' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5">
            <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4">Hourly Traffic Spikes (Total Concurrent Trunks)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyCallVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  <Area type="monotone" dataKey="Vol" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVol)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
