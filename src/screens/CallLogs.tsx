/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  FileText, Search, Filter, X, ChevronRight, Play, Server, Clock, Database 
} from 'lucide-react';

export default function CallLogs() {
  const { callLogs } = useStore();
  const [search, setSearch] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('');
  const [selectedCdrId, setSelectedCdrId] = useState<string | null>(null);

  const selectedCdr = callLogs.find(log => log.id === selectedCdrId);

  const filteredLogs = callLogs.filter(log => {
    const matchesSearch = log.caller.includes(search) || 
                          log.agentName.toLowerCase().includes(search.toLowerCase());
    const matchesOutcome = filterOutcome ? log.outcome.toLowerCase().includes(filterOutcome.toLowerCase()) : true;
    return matchesSearch && matchesOutcome;
  });

  return (
    <div id="screen-call-logs" className="space-y-6 animate-fadeIn select-none font-sans relative">
      
      {/* CDR Search filters */}
      <div className="bg-[#111827] border border-slate-800 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="cdr-search-input"
            type="text"
            placeholder="Search phone or agent name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f172a] border border-slate-800 rounded pl-9 pr-4 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 shrink-0 font-bold uppercase text-[10px]">Outcome Filter:</span>
          <select 
            value={filterOutcome} 
            onChange={(e) => setFilterOutcome(e.target.value)} 
            className="w-full bg-[#0f172a] border border-slate-800 rounded px-2.5 py-2 text-slate-300 focus:outline-none"
          >
            <option value="">All Call Outcomes</option>
            <option value="connected">Connected / Spoke</option>
            <option value="busy">Busy Retry</option>
            <option value="no answer">No Answer</option>
          </select>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <span className="text-slate-500 text-[10px] uppercase font-mono font-bold">TOTAL REGISTERED STREAM PACKETS: {callLogs.length} CDR</span>
        </div>
      </div>

      {/* CDR Data Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-mono text-[9px] uppercase">
                <th className="p-3">Call Start Time</th>
                <th className="p-3">Caller MSISDN</th>
                <th className="p-3">Staff Agent</th>
                <th className="p-3 font-mono">Duration</th>
                <th className="p-3">Outcome Flag</th>
                <th className="p-3">Recording State</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">No matching CDR traces found</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr 
                    id={`cdr-row-${log.id}`}
                    key={log.id} 
                    onClick={() => setSelectedCdrId(log.id)}
                    className="hover:bg-slate-800/20 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-mono text-slate-400">{log.callTime}</td>
                    <td className="p-3 font-mono text-slate-100 font-bold">{log.caller}</td>
                    <td className="p-3 text-slate-200 font-semibold">{log.agentName}</td>
                    <td className="p-3 font-mono text-blue-400 font-bold">{log.duration}s</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        log.outcome.includes('Connected') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        log.outcome.includes('Busy') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {log.outcome}
                      </span>
                    </td>
                    <td className="p-3 font-mono">
                      <span className={log.recordingStatus === 'Available' ? 'text-emerald-400' : 'text-slate-500'}>
                        {log.recordingStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <ChevronRight size={14} className="text-slate-500 inline" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CDR SIGNAL TIMELINE DRAWER */}
      {selectedCdr && (
        <div id="cdr-drawer-overlay" className="fixed inset-0 bg-[#020617]/70 backdrop-blur-sm flex justify-end z-50 animate-fadeIn">
          <div 
            id="cdr-drawer-container" 
            className="bg-[#111827] border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto animate-slideInRight"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-full">
                    <Server size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm">TELEPHONY SIGNAL CDR</h3>
                    <p className="text-[10px] text-slate-500 font-mono">CHANNEL HASH: {selectedCdr.id.toUpperCase()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCdrId(null)} 
                  className="text-slate-400 hover:text-white p-1 bg-slate-800/40 rounded border border-transparent hover:border-slate-700/60 transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Call detail overview list */}
              <div className="bg-[#0f172a] border border-slate-800 rounded p-4 space-y-2 text-xs text-slate-400 mb-6 font-mono">
                <div className="flex justify-between">
                  <span>Caller/Number:</span>
                  <span className="text-slate-200 font-bold">{selectedCdr.caller}</span>
                </div>
                <div className="flex justify-between">
                  <span>Agent Extension:</span>
                  <span className="text-slate-200">101 ({selectedCdr.agentName})</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Duration:</span>
                  <span className="text-blue-400 font-bold">{selectedCdr.duration} Seconds</span>
                </div>
              </div>

              {/* SIGNAL CHANNEL TIMELINE EVENTS */}
              <div className="space-y-4">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-800/60 pb-1.5 flex items-center gap-1">
                  <Clock size={11} className="text-blue-500" />
                  <span>Interactive Channel Event Trace</span>
                </h4>

                <div className="relative border-l border-slate-800 pl-4 space-y-5 ml-2.5">
                  {selectedCdr.timeline.map((event, idx) => (
                    <div key={idx} className="relative text-xs">
                      {/* Event Dot */}
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#111827]"></div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-blue-400">[{event.event}]</span>
                          <span className="text-[10px] text-slate-500 font-mono">{event.timestamp}</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          {event.event === 'CHANNEL_CREATE' && 'Gateway successfully initialized the trunk stream session.'}
                          {event.event === 'CHANNEL_ANSWER' && `Call answered. Connection bridged successfully after ${event.duration || 0}s delay.`}
                          {event.event === 'CHANNEL_HANGUP' && `Agent triggered hangup command. Disconnection packet broadcast completed.`}
                          {event.event === 'RECORD_STOP' && `Secure audio encryption recording shut down and transferred to database archives.`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono text-center">
              <span>CDR PACKET TRACE COMPLIANT BY NATIVETALK SERVER</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
