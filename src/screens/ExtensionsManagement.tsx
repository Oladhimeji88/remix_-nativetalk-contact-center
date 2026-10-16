/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Phone, Plus, ShieldCheck, HelpCircle, X, Edit3, Trash2, KeyRound, AlertTriangle 
} from 'lucide-react';

export default function ExtensionsManagement() {
  const { 
    extensions, 
    addExtension, 
    updateExtension, 
    deleteExtension, 
    toggleExtensionStatus 
  } = useStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [extNumber, setExtNumber] = useState('');
  const [extName, setExtName] = useState('');
  const [extDevice, setExtDevice] = useState<'Browser WebRTC' | 'SIP Softphone' | 'Desk Phone'>('Browser WebRTC');
  const [extUser, setExtUser] = useState('');
  const [extPass, setExtPass] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extNumber.trim() || !extName.trim() || !extUser.trim()) {
      setValidationError('All fields are required.');
      return;
    }
    if (extensions.some(e => e.number === extNumber)) {
      setValidationError('Extension number already exists.');
      return;
    }

    addExtension({
      number: extNumber,
      displayName: extName,
      assignedUser: extUser,
      deviceType: extDevice
    });

    // Reset
    setIsCreateOpen(false);
    setExtNumber('');
    setExtName('');
    setExtUser('');
    setExtPass('');
    setValidationError('');
  };

  const handleResetPassword = (num: string) => {
    alert(`SIP password has been reset. A secure, random hash has been provisioned and dispatched to Extension ${num}.`);
  };

  return (
    <div id="screen-extensions-management" className="space-y-6 animate-fadeIn select-none font-sans">
      
      {/* Header action panel */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-100">Extensions Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Provision secure WebRTC and hardphone client extensions</p>
        </div>
        <button
          id="btn-create-extension"
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow"
        >
          <Plus size={14} />
          <span>Provision Extension</span>
        </button>
      </div>

      {/* Extensions Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-mono text-[9px] uppercase">
                <th className="p-3">Extension Number</th>
                <th className="p-3">Display Label Name</th>
                <th className="p-3">Registration Status</th>
                <th className="p-3">Device Interface</th>
                <th className="p-3 font-mono">Last Signal Contact</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {extensions.map((ext) => (
                <tr key={ext.id} className="hover:bg-slate-800/10">
                  <td className="p-3 font-mono font-bold text-blue-400 text-sm">#{ext.number}</td>
                  <td className="p-3 font-bold text-slate-200">{ext.displayName}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      ext.registrationStatus === 'Registered' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {ext.registrationStatus}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 font-semibold">{ext.deviceType}</td>
                  <td className="p-3 font-mono text-slate-500">{ext.lastRegistration}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleResetPassword(ext.number)}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded"
                        title="Reset Pass"
                      >
                        <KeyRound size={13} />
                      </button>
                      <button
                        onClick={() => toggleExtensionStatus(ext.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                          ext.registrationStatus === 'Registered'
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                            : 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25'
                        }`}
                      >
                        {ext.registrationStatus === 'Registered' ? 'Disconnect' : 'Connect'}
                      </button>
                      <button
                        id={`extension-delete-btn-${ext.id}`}
                        onClick={() => deleteExtension(ext.id)}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL POPUP */}
      {isCreateOpen && (
        <div id="extension-create-overlay" className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 w-full max-w-md space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="font-bold text-slate-200 text-sm">Provision Client Extension</h4>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            </div>

            {validationError && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
                <AlertTriangle size={12} />
                {validationError}
              </p>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block">Extension *</label>
                  <input
                    id="ext-input-number"
                    type="text"
                    required
                    placeholder="e.g. 106"
                    value={extNumber}
                    onChange={(e) => setExtNumber(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block">Display Label *</label>
                  <input
                    id="ext-input-label"
                    type="text"
                    required
                    placeholder="e.g. Kola Davies"
                    value={extName}
                    onChange={(e) => setExtName(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">SIP Registration Device</label>
                <select
                  value={extDevice}
                  onChange={(e) => setExtDevice(e.target.value as any)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                >
                  <option value="Browser WebRTC">Browser WebRTC (Port 443)</option>
                  <option value="SIP Softphone">SIP Softphone (Port 5060 TLS)</option>
                  <option value="Desk Phone">Desk Phone (UDP 5060)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Assigned User Name</label>
                <input
                  id="ext-input-user"
                  type="text"
                  required
                  placeholder="e.g. Kolawole Davies"
                  value={extUser}
                  onChange={(e) => setExtUser(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Secret Password Pass</label>
                <input
                  type="password"
                  placeholder="Leave blank to auto-generate"
                  value={extPass}
                  onChange={(e) => setExtPass(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                />
              </div>

              <button
                id="ext-submit-btn"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-center shadow"
              >
                Launch Extension
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
