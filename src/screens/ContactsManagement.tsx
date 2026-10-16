/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { Contact } from '../types';
import { 
  Search, Filter, Plus, ArrowLeft, Mail, Phone, Building, Calendar, 
  CheckCircle, Clock, AlertCircle, FileText, Play, Disc, History, ShieldAlert,
  Save, X, User, Edit3, Trash2, FolderPlus, Download, Check
} from 'lucide-react';

export default function ContactsManagement() {
  const { 
    contacts, 
    campaigns, 
    addContact, 
    updateContact, 
    deleteContact, 
    callLogs, 
    recordings,
    currentRole,
    rolePermissions
  } = useStore();

  const canEditContacts = rolePermissions?.[currentRole]?.editContacts ?? true;
  
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  
  // Edit & Add Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    company: '',
    campaignId: 'camp-1',
    status: 'pending' as Contact['status'],
    notes: ''
  });
  
  const [newNoteText, setNewNoteText] = useState('');
  const [contactNotes, setContactNotes] = useState<Record<string, string[]>>({
    'c-1': ['Customer wants follow-up regarding fiber speed options in Lagos.', 'Expressed interest in the premium enterprise bundle.'],
    'c-2': ['Busy tone on first attempt, called back and spoke with secretary.', 'Scheduled secondary demonstration.'],
    'c-3': ['Wrong number provided or customer changed lines. Flagged as bad number.'],
    'c-4': ['Strict refusal. Asked to be registered in Do Not Call list permanently.']
  });

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'pending': return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'dialing': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'connected': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'callback': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'busy': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'no_answer': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'dnc': return 'bg-rose-500/20 text-rose-500 border-rose-500/30 font-bold';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getStatusLabel = (status: Contact['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'dialing': return 'Dialing';
      case 'connected': return 'Connected';
      case 'callback': return 'Callback';
      case 'busy': return 'Busy Line';
      case 'no_answer': return 'No Answer';
      case 'dnc': return 'Do Not Call';
      default: return status;
    }
  };

  // Filtered contacts list
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phoneNumber.includes(searchQuery) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCampaign = campaignFilter === 'all' || c.campaignId === campaignFilter;
    return matchesSearch && matchesStatus && matchesCampaign;
  });

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phoneNumber) {
      alert('Name and Phone are required.');
      return;
    }
    
    addContact({
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      company: formData.company,
      campaignId: formData.campaignId,
      status: formData.status,
      notes: formData.notes,
      lastContactDate: 'Never'
    });
    
    setIsAddOpen(false);
    resetForm();
  };

  const handleEditContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    
    updateContact(selectedContact.id, {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      company: formData.company,
      campaignId: formData.campaignId,
      status: formData.status
    });
    
    // Refresh selected view details
    setSelectedContact(prev => prev ? {
      ...prev,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      company: formData.company,
      campaignId: formData.campaignId,
      status: formData.status
    } : null);

    setIsEditOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      deleteContact(id);
      setSelectedContact(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phoneNumber: '',
      email: '',
      company: '',
      campaignId: 'camp-1',
      status: 'pending',
      notes: ''
    });
  };

  const handleAddNote = () => {
    if (!selectedContact || !newNoteText.trim()) return;
    const cid = selectedContact.id;
    setContactNotes(prev => ({
      ...prev,
      [cid]: [newNoteText.trim(), ...(prev[cid] || [])]
    }));
    setNewNoteText('');
  };

  const getContactHistory = (phone: string) => {
    return callLogs.filter(log => log.caller === phone);
  };

  const getContactRecordings = (phone: string) => {
    return recordings.filter(rec => rec.caller === phone);
  };

  return (
    <div id="screen-contacts" className="space-y-6 animate-fadeIn select-none font-sans text-xs text-slate-300">
      
      {/* If a specific contact is selected, show Contact Profile Page */}
      {selectedContact ? (
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex justify-between items-center bg-[#111827] border border-slate-800 p-4 rounded-lg">
            <button 
              onClick={() => setSelectedContact(null)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white font-bold transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Contacts</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!canEditContacts) {
                    alert('Forbidden: Your role does not have authorization to edit contact details.');
                    return;
                  }
                  setFormData({
                    name: selectedContact.name,
                    phoneNumber: selectedContact.phoneNumber,
                    email: selectedContact.email,
                    company: selectedContact.company || '',
                    campaignId: selectedContact.campaignId,
                    status: selectedContact.status,
                    notes: selectedContact.notes || ''
                  });
                  setIsEditOpen(true);
                }}
                className={`bg-slate-800 border text-slate-200 px-3 py-1.5 rounded font-bold flex items-center gap-1 transition-all ${
                  !canEditContacts ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500' : 'hover:bg-slate-700 border-slate-700'
                }`}
              >
                <Edit3 size={12} />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => {
                  if (!canEditContacts) {
                    alert('Forbidden: Your role does not have authorization to delete contacts.');
                    return;
                  }
                  handleDelete(selectedContact.id);
                }}
                className={`bg-rose-950/40 border text-rose-400 px-3 py-1.5 rounded font-bold flex items-center gap-1 transition-all ${
                  !canEditContacts ? 'opacity-40 cursor-not-allowed border-rose-950/20 text-rose-600' : 'hover:bg-rose-900/60 border-rose-500/20'
                }`}
              >
                <Trash2 size={12} />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Customer details */}
            <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 space-y-6">
              <div className="flex flex-col items-center text-center space-y-3 pb-5 border-b border-slate-800">
                <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xl">
                  {selectedContact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{selectedContact.name}</h3>
                  <p className="text-slate-500 font-mono mt-0.5">{selectedContact.company || 'Private Customer'}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(selectedContact.status)}`}>
                  {getStatusLabel(selectedContact.status)}
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Contact Coordinates</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Phone size={13} className="text-slate-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-mono">Mobile Line</p>
                      <p className="font-bold text-slate-200 font-mono">{selectedContact.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail size={13} className="text-slate-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-mono">E-Mail Address</p>
                      <p className="font-bold text-slate-200 font-mono">{selectedContact.email || 'N/A'}</p>
                    </div>
                  </div>

                  {selectedContact.company && (
                    <div className="flex items-center gap-2.5">
                      <Building size={13} className="text-slate-500 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-mono">Corporate Client</p>
                        <p className="font-bold text-slate-200">{selectedContact.company}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5">
                    <Calendar size={13} className="text-slate-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-mono">Assigned Campaign ID</p>
                      <p className="font-bold text-slate-200 bg-slate-800/40 border border-slate-800 px-1.5 py-0.5 rounded inline-block font-mono">
                        {selectedContact.campaignId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle and Right Column: Call History, Recordings & Notes */}
            <div className="lg:col-span-2 space-y-6">
              {/* Campaign Membership */}
              <div className="bg-[#111827] border border-slate-800 rounded-lg p-5">
                <h4 className="font-bold text-slate-200 text-xs mb-3 flex items-center gap-2">
                  <CheckCircle size={14} className="text-blue-500" />
                  <span>Campaign Memberships</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {campaigns.slice(0, 2).map((camp) => (
                    <div key={camp.id} className="bg-[#1c2436]/40 border border-slate-800 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-200">{camp.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Scheduler: {camp.startDate} to {camp.endDate}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wide ${
                        camp.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {camp.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes Editor */}
              <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 space-y-4">
                <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                  <FileText size={14} className="text-blue-500" />
                  <span>Disposition & Agent Notes Archive</span>
                </h4>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type an active note regarding this contact..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  />
                  <button 
                    onClick={handleAddNote}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1 rounded transition-colors"
                  >
                    Add Note
                  </button>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {(contactNotes[selectedContact.id] || []).map((note, index) => (
                    <div key={index} className="bg-[#0f172a]/80 border border-slate-800/80 p-3 rounded-md relative group">
                      <p className="text-slate-300 font-semibold leading-relaxed">{note}</p>
                      <span className="absolute bottom-1 right-2 text-[9px] text-slate-600 font-mono">Babatunde Alao • Just now</span>
                    </div>
                  ))}
                  {(!contactNotes[selectedContact.id] || contactNotes[selectedContact.id].length === 0) && (
                    <p className="text-slate-500 italic py-2 text-center">No historic logs recorded.</p>
                  )}
                </div>
              </div>

              {/* CRM Call Logs & Recordings List */}
              <div className="bg-[#111827] border border-slate-800 rounded-lg p-5">
                <h4 className="font-bold text-slate-200 text-xs mb-3 flex items-center gap-2">
                  <History size={14} className="text-blue-500" />
                  <span>Interactive Call Connection & Audio History</span>
                </h4>
                
                <div className="space-y-3">
                  {getContactHistory(selectedContact.phoneNumber).length > 0 ? (
                    getContactHistory(selectedContact.phoneNumber).map((log) => (
                      <div key={log.id} className="bg-[#0f172a] border border-slate-800/80 p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-400">
                            <Phone size={14} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-200">Outbound Dial Attempt</span>
                              <span className="text-[10px] text-slate-500 font-mono">{log.callTime}</span>
                            </div>
                            <p className="text-slate-400 text-[10px] mt-0.5 font-mono">Agent: {log.agentName} • Outcome: {log.outcome}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right font-mono">
                            <p className="font-bold text-slate-300">{log.duration}s</p>
                            <span className="text-[9px] text-slate-500 uppercase tracking-wider">Duration</span>
                          </div>
                          
                          {/* Audio player simulator for recordings associated with this call */}
                          {getContactRecordings(selectedContact.phoneNumber).length > 0 && (
                            <button
                              onClick={() => alert(`Streaming call log audio session ${log.id} directly from PBX secure vault...`)}
                              className="bg-slate-800 hover:bg-slate-700 p-2 rounded text-blue-400 hover:text-blue-300 transition-colors border border-slate-700"
                              title="Play Call Recording"
                            >
                              <Play size={12} fill="currentColor" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-[#0f172a]/40 border border-slate-800/40 rounded-lg">
                      <p className="text-slate-500 italic">No dial logs recorded for this phone coordinate.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Contacts Listing View */
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-100">Contacts Database (CRM)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Centralized communications customer ledger and campaigns targeting pool</p>
            </div>
            <button
              onClick={() => {
                if (!canEditContacts) {
                  alert('Forbidden: Your role does not have authorization to create contacts.');
                  return;
                }
                resetForm();
                setIsAddOpen(true);
              }}
              className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow ${
                !canEditContacts 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <Plus size={14} />
              <span>Create Contact Record</span>
            </button>
          </div>

          {/* Search, Filter, & Group Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#111827] border border-slate-800 p-3.5 rounded-lg">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={13} />
              <input
                type="text"
                placeholder="Search by name, phone, email, or company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-800/80 rounded pl-8 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-xs"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-800/80 rounded px-3 py-2 text-slate-300 focus:outline-none text-xs"
              >
                <option value="all">Filter by Dialing Status (All)</option>
                <option value="pending">Pending</option>
                <option value="dialing">Dialing</option>
                <option value="connected">Connected</option>
                <option value="callback">Callback</option>
                <option value="busy">Busy Line</option>
                <option value="no_answer">No Answer</option>
                <option value="dnc">Do Not Call</option>
              </select>
            </div>
            <div>
              <select
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-800/80 rounded px-3 py-2 text-slate-300 focus:outline-none text-xs font-mono"
              >
                <option value="all">Filter by Campaign ID (All)</option>
                {campaigns.map(camp => (
                  <option key={camp.id} value={camp.id}>{camp.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-mono text-[9px] uppercase tracking-wider">
                    <th className="p-3">Customer Name</th>
                    <th className="p-3 font-mono">Phone Number</th>
                    <th className="p-3">Email Coordinates</th>
                    <th className="p-3">Company Client</th>
                    <th className="p-3 font-mono">Campaign ID</th>
                    <th className="p-3">Targeting Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredContacts.map((contact) => (
                    <tr 
                      key={contact.id} 
                      className="hover:bg-slate-800/15 cursor-pointer transition-colors"
                      onClick={() => setSelectedContact(contact)}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400 text-[10px]">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <span className="font-bold text-slate-200 block">{contact.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-200">{contact.phoneNumber}</td>
                      <td className="p-3 font-mono text-slate-400">{contact.email || 'N/A'}</td>
                      <td className="p-3 text-slate-300 font-semibold">{contact.company || 'Private'}</td>
                      <td className="p-3 font-mono">
                        <span className="bg-slate-800/60 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
                          {contact.campaignId}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${getStatusColor(contact.status)}`}>
                          {getStatusLabel(contact.status)}
                        </span>
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-[10px] text-blue-400 border border-slate-700 transition-all font-semibold"
                          >
                            Open Profile
                          </button>
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded transition-colors"
                            title="Delete contact"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredContacts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-500 italic">No customer records match your filter constraints.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE RECORD MODAL POPUP */}
      {isAddOpen && (
        <div id="contact-add-overlay" className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 w-full max-w-md space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="font-bold text-slate-200 text-sm">Create Contact Profile</h4>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleAddContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block text-[9px]">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Chinedu Okafor"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block text-[9px]">Phone Coordinate *</label>
                  <input
                    type="text"
                    required
                    placeholder="+234 803 111 2222"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block text-[9px]">Email Coordinates</label>
                  <input
                    type="email"
                    placeholder="c.okafor@lagos.ng"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block text-[9px]">Company Client</label>
                  <input
                    type="text"
                    placeholder="Lagos Fiber Inc."
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block text-[9px]">Campaign Target ID</label>
                  <select
                    value={formData.campaignId}
                    onChange={(e) => setFormData(prev => ({ ...prev, campaignId: e.target.value }))}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    {campaigns.map(camp => (
                      <option key={camp.id} value={camp.id}>{camp.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block text-[9px]">Dialing Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="dialing">Dialing</option>
                    <option value="connected">Connected</option>
                    <option value="callback">Callback</option>
                    <option value="busy">Busy Line</option>
                    <option value="no_answer">No Answer</option>
                    <option value="dnc">Do Not Call</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-center shadow transition-all"
              >
                Assemble Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL POPUP */}
      {isEditOpen && selectedContact && (
        <div id="contact-edit-overlay" className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 w-full max-w-md space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="font-bold text-slate-200 text-sm">Amend Contact Record</h4>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleEditContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block text-[9px]">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block text-[9px]">Phone Coordinate *</label>
                  <input
                    type="text"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block text-[9px]">Email Coordinates</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block text-[9px]">Company Client</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block text-[9px]">Campaign Target ID</label>
                  <select
                    value={formData.campaignId}
                    onChange={(e) => setFormData(prev => ({ ...prev, campaignId: e.target.value }))}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    {campaigns.map(camp => (
                      <option key={camp.id} value={camp.id}>{camp.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block text-[9px]">Dialing Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="dialing">Dialing</option>
                    <option value="connected">Connected</option>
                    <option value="callback">Callback</option>
                    <option value="busy">Busy Line</option>
                    <option value="no_answer">No Answer</option>
                    <option value="dnc">Do Not Call</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded text-center shadow transition-all"
              >
                Commit Adjustments
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
