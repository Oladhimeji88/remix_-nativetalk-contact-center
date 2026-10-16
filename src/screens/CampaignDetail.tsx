/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  ArrowLeft, Users, Settings, Database, BarChart2, Shield, Play, Pause, Trash2, Plus, Info 
} from 'lucide-react';

export default function CampaignDetail() {
  const { 
    selectedCampaignId, 
    campaigns, 
    contacts, 
    agents, 
    setActiveTab,
    deleteContact,
    addContact,
    updateCampaign
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'contacts' | 'agents' | 'settings'>('overview');

  // Find active campaign
  const campaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  // Filter contacts by campaign
  const campaignContacts = contacts.filter(c => c.campaignId === campaign.id);

  // Settings states
  const [retryDelay, setRetryDelay] = useState(campaign?.retryDelay || 5);
  const [maxAttempts, setMaxAttempts] = useState(campaign?.maxAttempts || 3);
  const [wrapUp, setWrapUp] = useState(campaign?.wrapUpTime || 30);
  const [goal, setGoal] = useState(campaign?.goal || '');

  // Add Contact Form inline
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactCompany, setNewContactCompany] = useState('');

  if (!campaign) {
    return <div className="p-8 text-center text-slate-500">No campaign loaded.</div>;
  }

  // Outcome statistics calculations
  const connectedCount = campaignContacts.filter(c => c.status === 'connected').length;
  const pendingCount = campaignContacts.filter(c => c.status === 'pending').length;
  const busyCount = campaignContacts.filter(c => c.status === 'busy').length;
  const noAnswerCount = campaignContacts.filter(c => c.status === 'no_answer').length;
  const callbackCount = campaignContacts.filter(c => c.status === 'callback').length;
  const dncCount = campaignContacts.filter(c => c.status === 'dnc').length;

  const totalContacts = campaignContacts.length;
  const dialedCount = totalContacts - pendingCount;

  // Chart data
  const lineChartData = [
    { day: 'Mon', Rate: 45 },
    { day: 'Tue', Rate: 52 },
    { day: 'Wed', Rate: 68 },
    { day: 'Thu', Rate: 59 },
    { day: 'Fri', Rate: 64 },
    { day: 'Sat', Rate: 72 },
    { day: 'Sun', Rate: 61 }
  ];

  const pieChartData = [
    { name: 'Connected', value: connectedCount || 10, color: '#22c55e' },
    { name: 'Busy Retry', value: busyCount || 5, color: '#f59e0b' },
    { name: 'No Answer', value: noAnswerCount || 8, color: '#ef4444' },
    { name: 'Callbacks', value: callbackCount || 3, color: '#3b82f6' },
    { name: 'Do Not Call', value: dncCount || 1, color: '#64748b' }
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateCampaign(campaign.id, {
      retryDelay,
      maxAttempts,
      wrapUpTime: wrapUp,
      goal
    });
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    addContact({
      name: newContactName,
      phoneNumber: newContactPhone,
      company: newContactCompany,
      email: '',
      notes: 'Manually appended',
      lastContactDate: 'Never',
      campaignId: campaign.id,
      status: 'pending'
    });

    setNewContactName('');
    setNewContactPhone('');
    setNewContactCompany('');
  };

  return (
    <div id="screen-campaign-detail" className="space-y-6 animate-fadeIn select-none">
      
      {/* Detail Header & Action */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button 
            id="campaign-detail-back"
            onClick={() => setActiveTab('campaigns')}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 hover:text-white rounded text-slate-400 transition-colors"
          >
            <ArrowLeft size={14} />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-100">{campaign.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">CAMPAIGN ID: {campaign.id}</p>
          </div>
        </div>

        {/* Campaign Sub-Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-800/40 p-1 rounded border border-slate-700/60 text-xs">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart2 },
            { id: 'contacts', label: 'Contacts', icon: Database },
            { id: 'agents', label: 'Agents Assigned', icon: Users },
            { id: 'settings', label: 'Configurations', icon: Settings }
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                id={`subtab-${t.id}`}
                key={t.id}
                onClick={() => setActiveSubTab(t.id as any)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded font-semibold transition-all ${
                  activeSubTab === t.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={12} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB CONTENTS */}

      {/* OVERVIEW TAB */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Stat metrics cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Total Contacts', value: totalContacts },
              { label: 'Dialed', value: dialedCount },
              { label: 'Connected', value: connectedCount },
              { label: 'Callbacks Set', value: callbackCount },
              { label: 'DNC Pool', value: dncCount }
            ].map((stat, i) => (
              <div key={i} className="bg-[#111827] border border-slate-800 rounded p-4 text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{stat.label}</span>
                <span className="text-xl font-extrabold text-slate-100 font-mono block mt-1.5">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Visual Recharts breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Contact rate line chart */}
            <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-lg p-5">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4">Daily Contact Rate Timeline (%)</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Line type="monotone" dataKey="Rate" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Outcome pie chart */}
            <div className="bg-[#111827] border border-slate-800 rounded-lg p-5">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4">Call Outcome Partition</h3>
              <div className="h-56 flex flex-col justify-between items-center">
                <ResponsiveContainer width="100%" height="70%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-400 font-mono w-full px-4">
                  {pieChartData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                      <span>{d.name}: {d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* CONTACTS TAB */}
      {activeSubTab === 'contacts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* Left panel: Paginated lists of contacts */}
          <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Queue Contacts List</h3>
              <button
                id="btn-trigger-import-modal"
                onClick={() => setActiveTab('contacts')} // directs them back to central contact upload
                className="text-xs text-blue-400 hover:underline"
              >
                Go to Sheet Import
              </button>
            </div>

            <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-mono text-[9px] uppercase">
                    <th className="p-2">Name</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Company</th>
                    <th className="p-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {campaignContacts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-500">No contacts assigned.</td>
                    </tr>
                  ) : (
                    campaignContacts.map((contact) => (
                      <tr key={contact.id}>
                        <td className="p-2 font-bold text-slate-200">{contact.name}</td>
                        <td className="p-2 font-mono text-slate-400">{contact.phoneNumber}</td>
                        <td className="p-2 text-slate-400">{contact.company || 'Individual'}</td>
                        <td className="p-2 text-right">
                          <button
                            id={`contact-detail-delete-${contact.id}`}
                            onClick={() => deleteContact(contact.id)}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-500 rounded"
                            title="Prune Record"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right panel: Add Contact Form */}
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 h-fit">
            <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">Add Lead Manually</h3>
            <form onSubmit={handleAddContact} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 block font-bold uppercase text-[9px]">Contact Name</label>
                <input
                  id="detail-contact-name"
                  type="text"
                  required
                  placeholder="e.g. Kolawole Davies"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block font-bold uppercase text-[9px]">Phone Number</label>
                <input
                  id="detail-contact-phone"
                  type="text"
                  required
                  placeholder="e.g. +234 803 555 1234"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block font-bold uppercase text-[9px]">Company / Business</label>
                <input
                  id="detail-contact-company"
                  type="text"
                  placeholder="e.g. Davies Logistics"
                  value={newContactCompany}
                  onChange={(e) => setNewContactCompany(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <button
                id="detail-contact-submit"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1"
              >
                <Plus size={12} />
                <span>Append Lead</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* AGENTS TAB */}
      {activeSubTab === 'agents' && (
        <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 animate-fadeIn">
          <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">Assigned Operational Agents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.slice(0, 4).map((agent) => (
              <div key={agent.id} className="p-4 rounded border border-slate-800 bg-[#0f172a] flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700/60 text-xs font-extrabold flex items-center justify-center text-slate-300">
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-xs">{agent.name}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Role: {agent.role}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    agent.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400' :
                    agent.status === 'On Call' ? 'bg-rose-500/10 text-rose-400' :
                    'bg-slate-800 text-slate-500'
                  }`}>
                    {agent.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Conversion: <strong className="text-emerald-400">{agent.conversionRate}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONFIGURATIONS / SETTINGS TAB */}
      {activeSubTab === 'settings' && (
        <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 animate-fadeIn">
          <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">Dialer Configuration Parameters</h3>
          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-lg text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-slate-400 block font-bold uppercase text-[9px]">Retry Delay (Mins)</label>
                <input
                  id="detail-settings-retry"
                  type="number"
                  min="1"
                  value={retryDelay}
                  onChange={(e) => setRetryDelay(parseInt(e.target.value) || 5)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block font-bold uppercase text-[9px]">Max Dial Attempts</label>
                <input
                  id="detail-settings-attempts"
                  type="number"
                  min="1"
                  max="10"
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 3)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block font-bold uppercase text-[9px]">Wrap-Up Time (Secs)</label>
                <input
                  id="detail-settings-wrapup"
                  type="number"
                  min="5"
                  value={wrapUp}
                  onChange={(e) => setWrapUp(parseInt(e.target.value) || 30)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 block font-bold uppercase text-[9px]">Target Milestone Goal</label>
              <input
                id="detail-settings-goal"
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                id="detail-settings-submit"
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Save Campaign Parameters
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
