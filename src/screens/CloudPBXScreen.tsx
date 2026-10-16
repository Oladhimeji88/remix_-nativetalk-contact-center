/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Phone, Network, Plus, Trash2, KeyRound, Radio, Compass, Clock, MapPin, 
  HelpCircle, Settings, Layers, Calendar, Volume2, GitMerge, FileAudio, 
  Play, ShieldCheck, Cpu, ArrowRight, Save, PlayCircle, Eye, AlertCircle
} from 'lucide-react';
import ExtensionsManagement from './ExtensionsManagement';
import SIPTrunksManagement from './SIPTrunksManagement';

type PBXTab = 'extensions' | 'trunks' | 'numbers' | 'ring-groups' | 'routing' | 'hours' | 'ivr';

export default function CloudPBXScreen() {
  const [activeSubTab, setActiveSubTab] = useState<PBXTab>('extensions');
  const { extensions, trunks, queues } = useStore();

  // Mock data for Phone Numbers
  const [phoneNumbers, setPhoneNumbers] = useState([
    { id: 'num-1', number: '+234 1 227 8890', region: 'Lagos DID', assignedRoute: 'Lagos Main IVR Node', status: 'Active' },
    { id: 'num-2', number: '+234 9 460 3000', region: 'Abuja DID', assignedRoute: 'Sales Support Queue', status: 'Active' },
    { id: 'num-3', number: '+234 84 800 112', region: 'Port Harcourt DID', assignedRoute: 'Direct Agent Ext 104', status: 'Active' },
    { id: 'num-4', number: '+1 800 890 1200', region: 'US Toll-Free', assignedRoute: 'Backup After-Hours Voicemail', status: 'Active' }
  ]);
  const [isAddNumberOpen, setIsAddNumberOpen] = useState(false);
  const [newNum, setNewNum] = useState({ number: '', region: 'Lagos DID', assignedRoute: 'Lagos Main IVR Node' });

  // Mock data for Ring Groups
  const [ringGroups, setRingGroups] = useState([
    { id: 'rg-1', name: 'Sales Ring All', strategy: 'Simultaneous (Ring All)', extensions: ['101', '102', '103'], ringTime: 25, status: 'Active' },
    { id: 'rg-2', name: 'Support Turn-Based', strategy: 'Round Robin (Turn)', extensions: ['104', '105'], ringTime: 30, status: 'Active' }
  ]);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', strategy: 'Simultaneous (Ring All)', ringTime: 20 });

  // Visual Call Routing Builder States
  const [routingBlocks, setRoutingBlocks] = useState([
    { id: 'r-1', type: 'DID Number', label: '+234 1 227 8890 (Lagos Main)', x: 40, y: 110, nextId: 'r-2' },
    { id: 'r-2', type: 'IVR Auto-Attendant', label: 'Lagos Main IVR Menu', x: 280, y: 110, nextId: 'r-3' },
    { id: 'r-3', type: 'Skill Queue', label: 'Sales Support Queue', x: 520, y: 60, nextId: 'r-5' },
    { id: 'r-4', type: 'Failover Routing', label: 'Backup Voicemail Node', x: 520, y: 180, nextId: 'r-6' },
    { id: 'r-5', type: 'Live Agent', label: 'Active Group Agents', x: 760, y: 60, nextId: null },
    { id: 'r-6', type: 'Voicemail Node', label: 'Lagos Voicemail Box', x: 760, y: 180, nextId: null }
  ]);

  // Node-based IVR Designer States
  const [ivrNodes, setIvrNodes] = useState([
    { id: 'ivr-root', name: 'Welcome Message Menu', text: 'Thank you for calling NativeTalk. Press 1 for Sales, 2 for Support, or 0 for the Operator.', press1: 'Route to Sales Queue', press2: 'Route to Support Queue', press0: 'Route to Operator' }
  ]);

  // Business Hours Scheduler States
  const [businessHours, setBusinessHours] = useState({
    timezone: 'Africa/Lagos (GMT+1)',
    days: [
      { day: 'Monday', active: true, start: '08:00', end: '17:00' },
      { day: 'Tuesday', active: true, start: '08:00', end: '17:00' },
      { day: 'Wednesday', active: true, start: '08:00', end: '17:00' },
      { day: 'Thursday', active: true, start: '08:00', end: '17:00' },
      { day: 'Friday', active: true, start: '08:00', end: '16:30' },
      { day: 'Saturday', active: false, start: '09:00', end: '13:00' },
      { day: 'Sunday', active: false, start: '00:00', end: '00:00' }
    ],
    afterHoursRoute: 'Lagos Voicemail Box Node'
  });

  const handleAddNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNum.number) return;
    setPhoneNumbers([
      ...phoneNumbers,
      { id: `num-${phoneNumbers.length + 1}`, ...newNum, status: 'Active' }
    ]);
    setIsAddNumberOpen(false);
    setNewNum({ number: '', region: 'Lagos DID', assignedRoute: 'Lagos Main IVR Node' });
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name) return;
    setRingGroups([
      ...ringGroups,
      { id: `rg-${ringGroups.length + 1}`, ...newGroup, extensions: ['101', '104'], status: 'Active' }
    ]);
    setIsAddGroupOpen(false);
    setNewGroup({ name: '', strategy: 'Simultaneous (Ring All)', ringTime: 20 });
  };

  return (
    <div id="screen-cloud-pbx" className="space-y-6 animate-fadeIn select-none font-sans text-xs text-slate-300">
      
      {/* Top PBX Menu Tabs */}
      <div className="flex justify-between items-center bg-[#111827] border border-slate-800 p-3.5 rounded-lg">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'extensions', label: 'Extensions', icon: Phone },
            { id: 'trunks', label: 'SIP Trunks', icon: Network },
            { id: 'numbers', label: 'Phone Numbers', icon: Compass },
            { id: 'ring-groups', label: 'Ring Groups', icon: Layers },
            { id: 'routing', label: 'Visual Call Routing', icon: GitMerge },
            { id: 'ivr', label: 'IVR Auto-Attendant', icon: FileAudio },
            { id: 'hours', label: 'Business Hours', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as PBXTab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded font-bold transition-all ${
                  activeSubTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="text-right hidden md:block">
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            PBX Engine Online
          </span>
        </div>
      </div>

      {/* Render sub-tab views */}
      <div className="bg-[#0f172a]/20">
        {activeSubTab === 'extensions' && (
          <ExtensionsManagement />
        )}

        {activeSubTab === 'trunks' && (
          <SIPTrunksManagement />
        )}

        {activeSubTab === 'numbers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-200">DID Phone Numbers</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Rent and route global inbound trunk telephone numbers</p>
              </div>
              <button
                onClick={() => setIsAddNumberOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              >
                <Plus size={14} />
                <span>Rent Number</span>
              </button>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-mono text-[9px] uppercase tracking-wider">
                    <th className="p-3">Phone Number</th>
                    <th className="p-3">DID Location Region</th>
                    <th className="p-3">Inbound Route Target</th>
                    <th className="p-3">Operational Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {phoneNumbers.map((num) => (
                    <tr key={num.id} className="hover:bg-slate-800/10">
                      <td className="p-3 font-mono font-bold text-blue-400 text-sm">{num.number}</td>
                      <td className="p-3 font-semibold text-slate-200">{num.region}</td>
                      <td className="p-3">
                        <span className="bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded font-mono text-[10px]">
                          {num.assignedRoute}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {num.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setPhoneNumbers(phoneNumbers.filter(n => n.id !== num.id))}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded"
                          title="Release Number"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Rent Number Modal */}
            {isAddNumberOpen && (
              <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4">
                <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 w-full max-w-sm space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-slate-200 text-sm">Rent Global DID Line</h4>
                    <button onClick={() => setIsAddNumberOpen(false)} className="text-slate-500 hover:text-white">X</button>
                  </div>
                  <form onSubmit={handleAddNumber} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase block text-[9px]">Desired Line Number</label>
                      <input
                        type="text"
                        required
                        placeholder="+234 1 200 1234"
                        value={newNum.number}
                        onChange={(e) => setNewNum({ ...newNum, number: e.target.value })}
                        className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase block text-[9px]">DID Region</label>
                      <select
                        value={newNum.region}
                        onChange={(e) => setNewNum({ ...newNum, region: e.target.value })}
                        className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                      >
                        <option value="Lagos DID">Lagos Region (01)</option>
                        <option value="Abuja DID">Abuja Region (09)</option>
                        <option value="Port Harcourt DID">Port Harcourt (084)</option>
                        <option value="US Toll-Free">US Toll-Free (1-800)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase block text-[9px]">Initial Routing target</label>
                      <select
                        value={newNum.assignedRoute}
                        onChange={(e) => setNewNum({ ...newNum, assignedRoute: e.target.value })}
                        className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                      >
                        <option value="Lagos Main IVR Node">Lagos Main IVR Node</option>
                        <option value="Sales Support Queue">Sales Support Queue</option>
                        <option value="Backup After-Hours Voicemail">Backup After-Hours Voicemail</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded">
                      Rent & Configure Route
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'ring-groups' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-200">Ring Groups</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Group multiple extensions under a single dial alias</p>
              </div>
              <button
                onClick={() => setIsAddGroupOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              >
                <Plus size={14} />
                <span>Create Ring Group</span>
              </button>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-mono text-[9px] uppercase tracking-wider">
                    <th className="p-3">Ring Group Name</th>
                    <th className="p-3">Distribution Strategy</th>
                    <th className="p-3">Assigned Extensions</th>
                    <th className="p-3 font-mono">Ring Duration Limit</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {ringGroups.map((rg) => (
                    <tr key={rg.id} className="hover:bg-slate-800/10">
                      <td className="p-3 font-bold text-slate-200">{rg.name}</td>
                      <td className="p-3 text-slate-400">{rg.strategy}</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {rg.extensions.map((ext, i) => (
                            <span key={i} className="bg-slate-800 border border-slate-700 text-blue-400 font-bold px-1.5 py-0.5 rounded text-[10px] font-mono">
                              #{ext}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{rg.ringTime} Seconds</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setRingGroups(ringGroups.filter(g => g.id !== rg.id))}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded"
                          title="Disband Group"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isAddGroupOpen && (
              <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4">
                <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 w-full max-w-sm space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-slate-200 text-sm">Create Inbound Ring Group</h4>
                    <button onClick={() => setIsAddGroupOpen(false)} className="text-slate-500 hover:text-white">X</button>
                  </div>
                  <form onSubmit={handleAddGroup} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase block text-[9px]">Group Tag Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sales Team Lagos"
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                        className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase block text-[9px]">Ring Distribution Strategy</label>
                      <select
                        value={newGroup.strategy}
                        onChange={(e) => setNewGroup({ ...newGroup, strategy: e.target.value })}
                        className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                      >
                        <option value="Simultaneous (Ring All)">Simultaneous (Ring All)</option>
                        <option value="Round Robin (Turn)">Round Robin (Turn)</option>
                        <option value="Linear Cascade">Linear Cascade (Order-based)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase block text-[9px]">Ring Duration Limit (Secs)</label>
                      <input
                        type="number"
                        value={newGroup.ringTime}
                        onChange={(e) => setNewGroup({ ...newGroup, ringTime: parseInt(e.target.value) || 20 })}
                        className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                      />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded">
                      Assemble Ring Group
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'routing' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Visual Call Routing Flow Builder</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Drag-and-drop live flow configuration detailing DID ingress path routing to endpoints</p>
            </div>

            {/* Route Board Canvas representation */}
            <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 h-96 relative overflow-hidden flex flex-col justify-between">
              
              <div className="absolute top-2 left-2 bg-slate-900 border border-slate-800 p-2 rounded text-[10px] text-slate-400 flex items-center gap-1">
                <Cpu size={12} className="text-blue-500 shrink-0" />
                <span>Node Designer • Draft Version 1.0 (Lagos Router)</span>
              </div>

              {/* Graphical connector representation lines */}
              <svg className="absolute inset-0 pointer-events-none w-full h-full">
                <path d="M 180 130 L 280 130" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                <path d="M 430 130 L 460 130 L 460 80 L 520 80" stroke="#10b981" strokeWidth="2" fill="none" />
                <path d="M 430 130 L 460 130 L 460 200 L 520 200" stroke="#f59e0b" strokeWidth="2" fill="none" />
                <path d="M 670 80 L 760 80" stroke="#10b981" strokeWidth="2" strokeDasharray="4" fill="none" />
                <path d="M 670 200 L 760 200" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4" fill="none" />
              </svg>

              {/* Render visual blocks */}
              <div className="relative flex-1 w-full h-full mt-8">
                {routingBlocks.map((blk) => (
                  <div
                    key={blk.id}
                    className="absolute bg-[#1c2436] border border-slate-700/80 hover:border-blue-500/80 p-3 rounded-lg shadow-xl text-[10px] w-44 select-none cursor-pointer group transition-all"
                    style={{ left: `${blk.x}px`, top: `${blk.y}px` }}
                    onClick={() => alert(`Active Routing Node Details:\nID: ${blk.id}\nType: ${blk.type}\nLabel: ${blk.label}`)}
                  >
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1 mb-1.5 font-bold uppercase tracking-wider text-[8px]">
                      <span className="text-slate-400">{blk.type}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="font-bold text-slate-100 font-mono tracking-tight truncate">{blk.label}</p>
                    
                    <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-slate-800/80 text-[8px] text-slate-500 font-bold uppercase">
                      <span>Inlet</span>
                      <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        <span>Outlet</span>
                        <ArrowRight size={8} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions panel on builder */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-800/80 bg-slate-900/40 p-2.5 rounded">
                <p className="text-[10px] text-slate-500">Click any flow node to edit, define callbacks, or manage failover rules.</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => alert('New block added to workspace. Drag to position.')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded font-bold"
                  >
                    + Add Block Node
                  </button>
                  <button 
                    onClick={() => alert('Call routing flow schema saved successfully.')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded font-bold"
                  >
                    Save Routing Flow
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeSubTab === 'ivr' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-200">IVR Interactive Auto-Attendant Designer</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Build multi-tiered DTMF auto-receptionist logic networks</p>
              </div>
              <button
                onClick={() => alert('Adding new tier menu levels...')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              >
                <Plus size={14} />
                <span>Configure Sub-Menu Tier</span>
              </button>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 max-w-2xl mx-auto space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono font-bold uppercase">Root IVR Directory</span>
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-slate-800 text-slate-400 rounded"><Play size={10} /></button>
                    <button className="p-1 hover:bg-slate-800 text-slate-400 rounded"><Settings size={10} /></button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase block text-[8px] font-mono">Synthesized Welcome Script</label>
                    <textarea
                      value={ivrNodes[0].text}
                      onChange={(e) => {
                        const updated = [...ivrNodes];
                        updated[0].text = e.target.value;
                        setIvrNodes(updated);
                      }}
                      className="w-full bg-[#0d1321] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500 text-[11px] h-16 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-[#161f30]/60 p-2.5 rounded border border-slate-800 space-y-1">
                      <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider block">DTMF Key [1]</span>
                      <input
                        type="text"
                        value={ivrNodes[0].press1}
                        onChange={(e) => {
                          const updated = [...ivrNodes];
                          updated[0].press1 = e.target.value;
                          setIvrNodes(updated);
                        }}
                        className="w-full bg-[#0f172a] border border-slate-800 rounded px-2 py-1 text-slate-200 text-[10px] focus:outline-none"
                      />
                    </div>

                    <div className="bg-[#161f30]/60 p-2.5 rounded border border-slate-800 space-y-1">
                      <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider block">DTMF Key [2]</span>
                      <input
                        type="text"
                        value={ivrNodes[0].press2}
                        onChange={(e) => {
                          const updated = [...ivrNodes];
                          updated[0].press2 = e.target.value;
                          setIvrNodes(updated);
                        }}
                        className="w-full bg-[#0f172a] border border-slate-800 rounded px-2 py-1 text-slate-200 text-[10px] focus:outline-none"
                      />
                    </div>

                    <div className="bg-[#161f30]/60 p-2.5 rounded border border-slate-800 space-y-1">
                      <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider block">DTMF Key [0]</span>
                      <input
                        type="text"
                        value={ivrNodes[0].press0}
                        onChange={(e) => {
                          const updated = [...ivrNodes];
                          updated[0].press0 = e.target.value;
                          setIvrNodes(updated);
                        }}
                        className="w-full bg-[#0f172a] border border-slate-800 rounded px-2 py-1 text-slate-200 text-[10px] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-[9px] text-slate-500">
                  <span>Synthesizer Accent: English (Nigeria, Babatunde Voice)</span>
                  <button 
                    type="button"
                    onClick={() => alert('IVR Voice Attendant saved and deployed to primary trunk.')}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded"
                  >
                    Deploy Attendant Logic
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'hours' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Business Hours Configuration</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Control call distribution based on localized timezone schedules</p>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase font-mono">Localized Office Timezone</p>
                  <select
                    value={businessHours.timezone}
                    onChange={(e) => setBusinessHours({ ...businessHours, timezone: e.target.value })}
                    className="bg-[#0f172a] border border-slate-800 rounded px-3 py-1.5 text-slate-200 font-mono text-xs focus:outline-none"
                  >
                    <option value="Africa/Lagos (GMT+1)">Africa/Lagos (GMT+1) - Nigeria</option>
                    <option value="Africa/Johannesburg (GMT+2)">Africa/Johannesburg (GMT+2)</option>
                    <option value="Europe/London (GMT+0)">Europe/London (GMT+0)</option>
                    <option value="America/New_York (GMT-5)">America/New_York (GMT-5)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase font-mono">After Hours Failover Route</p>
                  <select
                    value={businessHours.afterHoursRoute}
                    onChange={(e) => setBusinessHours({ ...businessHours, afterHoursRoute: e.target.value })}
                    className="bg-[#0f172a] border border-slate-800 rounded px-3 py-1.5 text-slate-200 font-semibold text-xs focus:outline-none"
                  >
                    <option value="Lagos Voicemail Box Node">Lagos Voicemail Box Node</option>
                    <option value="Support On-Call Ring Group">Support On-Call Ring Group</option>
                    <option value="Hangup (Immediate termination)">Hangup (Immediate termination)</option>
                  </select>
                </div>
              </div>

              {/* Day Scheduling List */}
              <div className="space-y-2.5 max-w-2xl mx-auto">
                {businessHours.days.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#0f172a] p-3 rounded border border-slate-800/80">
                    <div className="flex items-center gap-3 w-32">
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={(e) => {
                          const updated = [...businessHours.days];
                          updated[index].active = e.target.checked;
                          setBusinessHours({ ...businessHours, days: updated });
                        }}
                        className="rounded border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0 bg-slate-900"
                      />
                      <span className="font-bold text-slate-200 text-xs">{item.day}</span>
                    </div>

                    {item.active ? (
                      <div className="flex items-center gap-2 font-mono">
                        <input
                          type="text"
                          value={item.start}
                          onChange={(e) => {
                            const updated = [...businessHours.days];
                            updated[index].start = e.target.value;
                            setBusinessHours({ ...businessHours, days: updated });
                          }}
                          className="w-16 bg-[#161f30] border border-slate-800 rounded text-center py-1 text-xs text-slate-200 focus:outline-none"
                        />
                        <span className="text-slate-500">to</span>
                        <input
                          type="text"
                          value={item.end}
                          onChange={(e) => {
                            const updated = [...businessHours.days];
                            updated[index].end = e.target.value;
                            setBusinessHours({ ...businessHours, days: updated });
                          }}
                          className="w-16 bg-[#161f30] border border-slate-800 rounded text-center py-1 text-xs text-slate-200 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono font-bold uppercase bg-slate-800/40 px-2 py-0.5 rounded border border-slate-850">
                        Office Closed
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-right pt-3">
                <button
                  onClick={() => alert('Business hour schedule policies have been synchronized with the call routing engine.')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded transition-all shadow"
                >
                  Apply Scheduling Policies
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
