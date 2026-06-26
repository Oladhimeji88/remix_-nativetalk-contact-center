/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { 
  Radio, Play, Pause, Square, AlertCircle, RefreshCw, 
  Layers, ChevronRight, Activity, TrendingUp, Info 
} from 'lucide-react';

export default function ProgressiveDialer() {
  const {
    dialerStatus,
    dialerEvents,
    queueHealth,
    startDialer,
    stopDialer,
    pauseDialer,
    simulateDialerActivity,
    contacts,
    agents
  } = useStore();

  const feedRef = useRef<HTMLDivElement>(null);

  // Setup live activity simulator loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (dialerStatus === 'running') {
      interval = setInterval(() => {
        simulateDialerActivity();
      }, 4000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dialerStatus]);

  // Auto-scroll feed panel to top/bottom
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0; // Keep newest logs at the top
    }
  }, [dialerEvents]);

  // Helper values
  const totalAgentsOnCall = agents.filter(a => a.status === 'On Call').length;
  const totalAgentsAvailable = agents.filter(a => a.status === 'Available').length;
  const totalLeadsLeft = contacts.filter(c => c.status === 'pending').length;

  return (
    <div id="screen-progressive-dialer" className="space-y-6 animate-fadeIn select-none font-sans">
      
      {/* Top Dialer Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-slate-800 p-5 rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-full ${
            dialerStatus === 'running' ? 'bg-emerald-500/15 text-emerald-400 animate-pulse' :
            dialerStatus === 'paused' ? 'bg-amber-500/15 text-amber-400' :
            'bg-slate-800 text-slate-500'
          }`}>
            <Radio size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Progressive Dialer Controller</h2>
            <p className="text-xs text-slate-500 mt-0.5">Campaign: <strong className="text-blue-400">Lagos Fiber Promo</strong> | Outbound Throttle Rate: <span className="font-mono">1.5x pacing</span></p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="dialer-btn-start"
            disabled={dialerStatus === 'running'}
            onClick={startDialer}
            className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow ${
              dialerStatus === 'running'
                ? 'bg-emerald-700/30 text-emerald-500 cursor-not-allowed border border-emerald-800/60'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <Play size={12} />
            <span>Start Dialer</span>
          </button>

          <button
            id="dialer-btn-pause"
            disabled={dialerStatus === 'paused' || dialerStatus === 'stopped'}
            onClick={pauseDialer}
            className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all border ${
              dialerStatus === 'paused' || dialerStatus === 'stopped'
                ? 'bg-slate-800/20 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
            }`}
          >
            <Pause size={12} />
            <span>Pause</span>
          </button>

          <button
            id="dialer-btn-stop"
            disabled={dialerStatus === 'stopped'}
            onClick={stopDialer}
            className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all border ${
              dialerStatus === 'stopped'
                ? 'bg-slate-800/20 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-[#1e1e2d] hover:bg-rose-900/10 text-rose-400 border-rose-500/20'
            }`}
          >
            <Square size={12} />
            <span>Stop Engine</span>
          </button>
        </div>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Agents Available', value: totalAgentsAvailable, color: 'text-emerald-400' },
          { label: 'Agents On Call', value: totalAgentsOnCall, color: 'text-rose-400' },
          { label: 'Unreached Leads Left', value: totalLeadsLeft, color: 'text-blue-400' },
          { label: 'Dialer State', value: dialerStatus.toUpperCase(), color: dialerStatus === 'running' ? 'text-emerald-400' : 'text-slate-500' },
          { label: 'Dialer Contact Rate', value: '64.5%', color: 'text-purple-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#111827] border border-slate-800 rounded p-4 text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{stat.label}</span>
            <span className={`text-lg font-extrabold font-mono block mt-1.5 ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Bottom Layout - Live Console Feed & Queue Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Terminal Events Feed */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-lg p-5 flex flex-col justify-between min-h-[380px]">
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={12} className="text-blue-500" />
                <span>Live Telephony Trace Logs</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">
                {dialerStatus === 'running' ? 'SYSTEM STREAMING ACTIVE' : 'DIALER IDLE'}
              </span>
            </div>

            {/* Scrolling logs panel */}
            <div 
              ref={feedRef}
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded p-4 overflow-y-auto max-h-72 font-mono text-[11px] leading-relaxed space-y-3 custom-scrollbar"
            >
              {dialerEvents.map((evt) => (
                <div key={evt.id} className="flex gap-3 border-b border-slate-900/50 pb-2 hover:bg-slate-900/20 transition-all">
                  <span className="text-slate-500 select-none shrink-0">{evt.timestamp}</span>
                  <div className="flex-1">
                    <span className={`font-bold mr-1.5 ${
                      evt.event === 'Call Connected' ? 'text-emerald-400' :
                      evt.event === 'Dial Started' ? 'text-blue-400' :
                      evt.event === 'Call Ended' ? 'text-amber-400' :
                      'text-purple-400'
                    }`}>
                      [{evt.event.toUpperCase()}]
                    </span>
                    <span className="text-slate-300">{evt.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-600 font-mono mt-4 pt-3 border-t border-slate-800/50">
            <span>PACKET PROTOCOL MATCHING ALGORITHM ACTIVE (v2.4)</span>
          </div>
        </div>

        {/* Right Column: Queue Health panel */}
        <div className="space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 flex flex-col justify-between h-full">
            <div>
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-800/80 flex items-center gap-1.5">
                <Layers size={12} className="text-blue-500" />
                <span>Queue Health Allocation</span>
              </h3>

              <div className="space-y-4">
                {[
                  { name: 'Awaiting Dialer', count: totalLeadsLeft, color: 'bg-blue-600', max: 50 },
                  { name: 'Busy Retry Queue', count: queueHealth.retry, color: 'bg-amber-500', max: 20 },
                  { name: 'Callbacks Reservation', count: queueHealth.callback, color: 'bg-purple-500', max: 30 }
                ].map((q, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-semibold">{q.name}</span>
                      <span className="font-mono text-slate-400">{q.count} Records</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`${q.color} h-full transition-all duration-300`} 
                        style={{ width: `${Math.min(100, (q.count / q.max) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-500/5 border border-blue-500/15 rounded mt-6 text-[11px] text-slate-400 leading-relaxed">
              <p>
                <strong>Pacing Control:</strong> System automatically monitors live agent statuses. 
                Calls are initiated only when available queue agent slots are detected.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
