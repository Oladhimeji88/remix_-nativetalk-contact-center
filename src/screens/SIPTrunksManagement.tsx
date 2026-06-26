/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Network, Plus, Server, Activity, X, Trash2, ShieldAlert, Wifi, WifiOff 
} from 'lucide-react';

export default function SIPTrunksManagement() {
  const { trunks, addTrunk, updateTrunk, deleteTrunk, toggleTrunkStatus } = useStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Connection test loading state
  const [testingId, setTestingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [transport, setTransport] = useState<'UDP' | 'TCP' | 'TLS'>('TLS');
  const [codec, setCodec] = useState<'G711' | 'G729'>('G711');
  const [validationError, setValidationError] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !host.trim() || !username.trim()) {
      setValidationError('All fields are required.');
      return;
    }

    addTrunk({
      name,
      host,
      username,
      transport,
      codec
    });

    setIsCreateOpen(false);
    setName('');
    setHost('');
    setUsername('');
    setPassword('');
    setValidationError('');
  };

  const handleTestConnection = (id: string, name: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      // Glo (trk-3) is offline, make it fail, others succeed!
      if (id === 'trk-3') {
        alert(`Connection test failed for "${name}". Destination host glo.sip.com.ng unreachable (timeout 5000ms).`);
      } else {
        alert(`Connection test succeeded! SIP REGISTER handshake completed on ${name}. Response: 200 OK.`);
      }
    }, 1500);
  };

  return (
    <div id="screen-trunks-management" className="space-y-6 animate-fadeIn select-none font-sans">
      
      {/* Header actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-100">SIP Trunks Gateway</h2>
          <p className="text-xs text-slate-500 mt-0.5">Configure upstream carrier routing networks</p>
        </div>
        <button
          id="btn-create-trunk"
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow"
        >
          <Plus size={14} />
          <span>Provision Carrier Trunk</span>
        </button>
      </div>

      {/* Trunks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trunks.map((trunk) => {
          const isTesting = testingId === trunk.id;
          return (
            <div key={trunk.id} className="bg-[#111827] border border-slate-800 rounded-lg p-5 flex flex-col justify-between min-h-[180px] relative overflow-hidden">
              <div>
                {/* Connection Indicators */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    {trunk.status === 'Active' ? (
                      <>
                        <Wifi size={14} className="text-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">LIVE Handshake</span>
                      </>
                    ) : (
                      <>
                        <WifiOff size={14} className="text-rose-500" />
                        <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">DISCONNECTED</span>
                      </>
                    )}
                  </div>

                  <span className="text-[10px] bg-slate-800/60 px-2 py-0.5 rounded text-slate-400 font-mono font-bold uppercase">
                    {trunk.transport}
                  </span>
                </div>

                <h3 className="font-bold text-slate-200 text-sm">{trunk.name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-1">{trunk.host}</p>

                {/* Meta list */}
                <div className="mt-4 grid grid-cols-2 gap-y-1.5 text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-3">
                  <span>SIP USERNAME:</span>
                  <span className="text-slate-200 text-right">{trunk.username}</span>

                  <span>ACTIVE CHANNELS:</span>
                  <span className="text-blue-400 font-bold text-right">{trunk.activeCalls} Calls</span>
                </div>
              </div>

              {/* Action Buttons inside card */}
              <div className="flex items-center gap-2 pt-4 mt-2 border-t border-slate-800/40 text-xs">
                <button
                  id={`btn-test-trunk-${trunk.id}`}
                  disabled={isTesting}
                  onClick={() => handleTestConnection(trunk.id, trunk.name)}
                  className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700/60 transition-all text-center"
                >
                  {isTesting ? 'Testing...' : 'Test Sync'}
                </button>
                
                <button
                  onClick={() => toggleTrunkStatus(trunk.id)}
                  className={`px-3 py-1 rounded font-semibold transition-all border ${
                    trunk.status === 'Active'
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                      : 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25'
                  }`}
                >
                  {trunk.status === 'Active' ? 'Disable' : 'Enable'}
                </button>

                <button
                  id={`trunk-delete-btn-${trunk.id}`}
                  onClick={() => deleteTrunk(trunk.id)}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded"
                  title="Remove Gateway"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE TRUNK MODAL */}
      {isCreateOpen && (
        <div id="trunk-create-overlay" className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4 font-sans text-xs">
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 w-full max-w-md space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="font-bold text-slate-200 text-sm">Provision Carrier Gateway</h4>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            </div>

            {validationError && (
              <p className="text-rose-500 flex items-center gap-1 font-semibold">
                <ShieldAlert size={12} />
                {validationError}
              </p>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Carrier Name *</label>
                <input
                  id="trunk-input-name"
                  type="text"
                  required
                  placeholder="e.g. MTN Business SIP"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Gateway Proxy Host Domain *</label>
                <input
                  id="trunk-input-host"
                  type="text"
                  required
                  placeholder="e.g. sip.mtn.com.ng"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block">SIP Username *</label>
                  <input
                    id="trunk-input-user"
                    type="text"
                    required
                    placeholder="e.g. mt_user"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block">Secret Auth Token</label>
                  <input
                    type="password"
                    placeholder="Trunk password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block">Transport Protocol</label>
                  <select
                    value={transport}
                    onChange={(e) => setTransport(e.target.value as any)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  >
                    <option value="TLS">TLS Secure (Encrypted)</option>
                    <option value="TCP">TCP Connection</option>
                    <option value="UDP">UDP Connection</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase block">Preferred Codec</label>
                  <select
                    value={codec}
                    onChange={(e) => setCodec(e.target.value as any)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  >
                    <option value="G711">G.711 PCMU (Standard)</option>
                    <option value="G729">G.729 (Bandwidth compressed)</option>
                  </select>
                </div>
              </div>

              <button
                id="trunk-submit-btn"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-center shadow"
              >
                Launch SIP Gateway
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
