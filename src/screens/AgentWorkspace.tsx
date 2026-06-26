/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../store';
import Softphone from '../components/Softphone';
import { Phone, Users, ShieldAlert, CheckCircle, Database } from 'lucide-react';

export default function AgentWorkspace() {
  const { contacts, triggerOutgoingCall, softphoneState, currentUser } = useStore();

  const assignedContacts = contacts.filter(c => c.campaignId === 'camp-1');

  const handleDialContact = (contact: any) => {
    if (softphoneState !== 'Idle') return;
    triggerOutgoingCall(contact);
  };

  return (
    <div id="screen-agent-workspace" className="space-y-6 animate-fadeIn select-none">
      
      {/* Top Welcome & Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-lg">
        <div>
          <h2 className="text-base font-bold text-slate-100">Welcome, {currentUser.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">SIP Extension: <span className="font-mono text-blue-400 font-bold">101</span> | Status: <span className="text-emerald-400 font-semibold">Registered & Ready</span></p>
        </div>
        
        {/* Personal Session Stats */}
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-blue-500" />
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Talk-Time Today</span>
              <span className="text-slate-200 font-mono font-semibold">1h 22m</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-500" />
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Dispositions Saved</span>
              <span className="text-slate-200 font-mono font-semibold">42</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Softphone Grid */}
      <Softphone />

      {/* Assigned Contacts Selector List */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
          <Database className="text-blue-500" size={16} />
          <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wide">Assigned Lead Pool (Campaign: Lagos Fiber Promo)</h3>
        </div>

        <div className="overflow-x-auto max-h-56 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-mono text-[10px]">
                <th className="p-2.5">Name</th>
                <th className="p-2.5">Phone Number</th>
                <th className="p-2.5">Company</th>
                <th className="p-2.5">Last Call Date</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {assignedContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-800/20">
                  <td className="p-2.5 font-bold text-slate-200">{contact.name}</td>
                  <td className="p-2.5 font-mono text-slate-400">{contact.phoneNumber}</td>
                  <td className="p-2.5 text-slate-400">{contact.company || 'N/A'}</td>
                  <td className="p-2.5 font-mono text-slate-500">{contact.lastContactDate}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      contact.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      contact.status === 'callback' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      contact.status === 'busy' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      contact.status === 'no_answer' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      id={`workspace-btn-dial-${contact.id}`}
                      disabled={softphoneState !== 'Idle'}
                      onClick={() => handleDialContact(contact)}
                      className="px-2.5 py-1 rounded text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-all shadow"
                    >
                      Instant Dial
                    </button>
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
