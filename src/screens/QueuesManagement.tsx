/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Users, Plus, X, Trash2, ShieldAlert, Layers, Clock, Settings 
} from 'lucide-react';

export default function QueuesManagement() {
  const { queues, addQueue, updateQueue, deleteQueue } = useStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [ringStrategy, setRingStrategy] = useState<'Round Robin' | 'Longest Idle' | 'Simultaneous'>('Round Robin');
  const [timeout, setTimeoutVal] = useState(30);
  const [overflowQueueId, setOverflowQueueId] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Queue Name is required.');
      return;
    }

    addQueue({
      name,
      ringStrategy,
      timeout,
      overflowQueueId: overflowQueueId || undefined
    });

    setIsCreateOpen(false);
    setName('');
    setRingStrategy('Round Robin');
    setTimeoutVal(30);
    setOverflowQueueId('');
    setValidationError('');
  };

  return (
    <div id="screen-queues-management" className="space-y-6 animate-fadeIn select-none font-sans">
      
      {/* Header action panel */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-100">Queues Configuration</h2>
          <p className="text-xs text-slate-500 mt-0.5">Define automatic call distribution ring nodes</p>
        </div>
        <button
          id="btn-create-queue"
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow"
        >
          <Plus size={14} />
          <span>Configure Queue Node</span>
        </button>
      </div>

      {/* Queues Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-mono text-[9px] uppercase">
                <th className="p-3">Queue Name</th>
                <th className="p-3">Agents Logged In</th>
                <th className="p-3">Ring strategy</th>
                <th className="p-3 font-mono">Ring Timeout</th>
                <th className="p-3">Overflow Destination</th>
                <th className="p-3 font-mono">Calls Waiting</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {queues.map((q) => (
                <tr key={q.id} className="hover:bg-slate-800/10">
                  <td className="p-3 font-bold text-slate-200 flex items-center gap-2">
                    <Layers size={13} className="text-blue-500" />
                    <span>{q.name}</span>
                  </td>
                  <td className="p-3 text-slate-300 font-semibold">{q.agentCount || '0'} Agents</td>
                  <td className="p-3 text-slate-400 font-mono">{q.ringStrategy}</td>
                  <td className="p-3 font-mono text-slate-400">{q.timeout} Seconds</td>
                  <td className="p-3 text-slate-400">
                    {q.overflowQueueId 
                      ? queues.find(uq => uq.id === q.overflowQueueId)?.name 
                      : 'Voicemail Node'}
                  </td>
                  <td className="p-3 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.waitingCalls > 0 ? 'bg-amber-500/15 text-amber-400 animate-pulse' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {q.waitingCalls} Waiting
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      id={`queue-delete-${q.id}`}
                      onClick={() => deleteQueue(q.id)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded"
                      title="Delete Queue"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE QUEUE MODAL */}
      {isCreateOpen && (
        <div id="queue-create-overlay" className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 w-full max-w-md space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="font-bold text-slate-200 text-sm">Configure Routing Queue</h4>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            </div>

            {validationError && (
              <p className="text-xs text-rose-500 flex items-center gap-1 font-semibold">
                <ShieldAlert size={12} />
                {validationError}
              </p>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Queue Node Name *</label>
                <input
                  id="queue-input-name"
                  type="text"
                  required
                  placeholder="e.g. Lagos Support Queue"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block">Ring Strategy</label>
                  <select
                    value={ringStrategy}
                    onChange={(e) => setRingStrategy(e.target.value as any)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Round Robin">Round Robin (Turn-based)</option>
                    <option value="Longest Idle">Longest Idle (Standby first)</option>
                    <option value="Simultaneous">Simultaneous (Ring all)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block">Timeout (Secs)</label>
                  <input
                    id="queue-input-timeout"
                    type="number"
                    min="10"
                    max="180"
                    value={timeout}
                    onChange={(e) => setTimeoutVal(parseInt(e.target.value) || 30)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Failover Overflow Node</label>
                <select
                  value={overflowQueueId}
                  onChange={(e) => setOverflowQueueId(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                >
                  <option value="">Voicemail Box Node (Standard)</option>
                  {queues.map(q => (
                    <option key={q.id} value={q.id}>{q.name}</option>
                  ))}
                </select>
              </div>

              <button
                id="queue-submit-btn"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-center shadow"
              >
                Provision Queue Node
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
