/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import CampaignWizard from '../components/CampaignWizard';
import { 
  Plus, Search, Pause, Play, Eye, Edit2, Trash2, Calendar, Users, Percent, AlertTriangle 
} from 'lucide-react';

export default function CampaignList() {
  const { 
    campaigns, 
    toggleCampaignStatus, 
    deleteCampaign, 
    updateCampaign,
    setActiveTab, 
    setSelectedCampaignId,
    currentRole,
    rolePermissions
  } = useStore();

  const canEditCampaigns = rolePermissions?.[currentRole]?.editCampaigns ?? true;

  const [search, setSearch] = useState('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  // Inline edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editGoal, setEditGoal] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Delete confirmation states
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.goal.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenWizard = () => {
    setIsWizardOpen(true);
  };

  const handleViewDetails = (id: string) => {
    setSelectedCampaignId(id);
    setActiveTab('campaign-detail');
  };

  const handleStartEdit = (camp: any) => {
    setEditingId(camp.id);
    setEditName(camp.name);
    setEditGoal(camp.goal);
    setEditDesc(camp.description);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editName.trim()) return;
    updateCampaign(editingId, {
      name: editName,
      goal: editGoal,
      description: editDesc
    });
    setEditingId(null);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteCampaign(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div id="screen-campaign-list" className="space-y-6 animate-fadeIn select-none">
      
      {/* Search and Wizard launch header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="campaign-search-input"
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-slate-800 rounded pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 font-mono"
          />
        </div>

        <button
          id="btn-create-campaign"
          onClick={() => {
            if (!canEditCampaigns) {
              alert('Forbidden: Your role does not have authorization to create campaigns.');
              return;
            }
            handleOpenWizard();
          }}
          className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow ${
            !canEditCampaigns 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          <Plus size={14} />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-mono text-[10px] uppercase">
                <th className="p-3">Campaign Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Contacts Count</th>
                <th className="p-3">Staff Agents</th>
                <th className="p-3">Contact Rate</th>
                <th className="p-3">Goal Objective</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">No campaigns found matching criteria</td>
                </tr>
              ) : (
                filteredCampaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/10">
                    <td className="p-3 font-bold text-slate-200">
                      <div>
                        <p>{c.name}</p>
                        <p className="text-[10px] text-slate-500 font-normal mt-0.5 line-clamp-1">{c.description}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        c.status === 'paused' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-800 text-slate-500'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{c.contactsCount}</td>
                    <td className="p-3 font-mono text-slate-400">{c.activeAgents || '0'} Assigned</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{c.contactRate}%</td>
                    <td className="p-3 text-slate-400 line-clamp-1 max-w-[150px] mt-2.5">{c.goal}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`campaign-btn-view-${c.id}`}
                          onClick={() => handleViewDetails(c.id)}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
                          title="View Details"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          id={`campaign-btn-edit-${c.id}`}
                          onClick={() => {
                            if (!canEditCampaigns) {
                              alert('Forbidden: Your role does not have authorization to edit campaigns.');
                              return;
                            }
                            handleStartEdit(c);
                          }}
                          className={`p-1 rounded ${!canEditCampaigns ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-800 text-slate-400 hover:text-blue-400'}`}
                          title="Quick Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          id={`campaign-btn-toggle-${c.id}`}
                          onClick={() => {
                            if (!canEditCampaigns) {
                              alert('Forbidden: Your role does not have authorization to toggle campaign status.');
                              return;
                            }
                            toggleCampaignStatus(c.id);
                          }}
                          className={`p-1 rounded ${!canEditCampaigns ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-800 text-slate-400 hover:text-amber-400'}`}
                          title={c.status === 'active' ? 'Pause Campaign' : 'Resume Campaign'}
                        >
                          {c.status === 'active' ? <Pause size={13} /> : <Play size={13} />}
                        </button>
                        <button
                          id={`campaign-btn-delete-${c.id}`}
                          onClick={() => {
                            if (!canEditCampaigns) {
                              alert('Forbidden: Your role does not have authorization to archive campaigns.');
                              return;
                            }
                            setDeletingId(c.id);
                          }}
                          className={`p-1 rounded ${!canEditCampaigns ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-800 text-slate-400 hover:text-rose-400'}`}
                          title="Archive"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WIZARD MODAL POPUP */}
      {isWizardOpen && (
        <CampaignWizard onClose={() => setIsWizardOpen(false)} />
      )}

      {/* INLINE EDIT MODAL */}
      {editingId && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 w-full max-w-md space-y-4">
            <h4 className="font-bold text-slate-200 text-sm">Quick Edit Campaign</h4>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 uppercase block font-bold text-[10px]">Campaign Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 uppercase block font-bold text-[10px]">Description</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 uppercase block font-bold text-[10px]">Success Goal</label>
                <input
                  type="text"
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setEditingId(null)}
                className="px-3 py-1.5 rounded border border-slate-800 hover:bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                id="edit-modal-save"
                onClick={handleSaveEdit}
                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: DELETE/ARCHIVE */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 w-full max-w-sm space-y-4 text-center">
            <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Archive Campaign?</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                This action is destructive. Deleting this campaign will purge it from active dialing screens.
              </p>
            </div>
            <div className="flex justify-center gap-2 text-xs">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 rounded border border-slate-800 hover:bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
