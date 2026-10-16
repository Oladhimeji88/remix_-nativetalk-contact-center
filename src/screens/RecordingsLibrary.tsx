/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Disc, Play, Pause, Search, Calendar, ChevronRight, X, Copy, Download, 
  Clock, Volume2, ShieldAlert, CheckSquare, Layers 
} from 'lucide-react';

export default function RecordingsLibrary() {
  const { recordings, deleteRecording, currentRole, rolePermissions } = useStore();
  const canDeleteRecordings = rolePermissions?.[currentRole]?.deleteRecordings ?? true;
  const [search, setSearch] = useState('');
  const [filterAgent, setFilterAgent] = useState('');
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(45); // simulated percent

  const selectedRec = recordings.find(r => r.id === selectedRecId);

  const filteredRecs = recordings.filter(r => 
    r.caller.includes(search) || 
    r.agentName.toLowerCase().includes(search.toLowerCase()) ||
    r.campaignName.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlayRec = (id: string) => {
    setSelectedRecId(id);
    setIsPlaying(true);
    setPlaybackProgress(Math.floor(Math.random() * 40) + 10);
  };

  const handleCopyLink = (id: string) => {
    // show brief visual confirmation
    alert(`Mock Recording URL copied to clipboard for audit ID: ${id}`);
  };

  const handleDownload = (id: string) => {
    alert(`Mock Audio Download (MP3 stereo format) initialized for: NT_REC_${id}.mp3`);
  };

  return (
    <div id="screen-recordings-library" className="space-y-6 animate-fadeIn select-none font-sans relative">
      
      {/* Filters Area */}
      <div className="bg-[#111827] border border-slate-800 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="recording-search-input"
            type="text"
            placeholder="Search phone, agent, campaign..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f172a] border border-slate-800 rounded pl-9 pr-4 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 shrink-0 uppercase font-bold text-[10px]">Staff Sort:</span>
          <select 
            value={filterAgent} 
            onChange={(e) => setFilterAgent(e.target.value)} 
            className="w-full bg-[#0f172a] border border-slate-800 rounded px-2.5 py-2 text-slate-300 focus:outline-none"
          >
            <option value="">All Active Agents</option>
            <option value="Babatunde">Babatunde Alao</option>
            <option value="Ngozi">Ngozi Nkemdilim</option>
            <option value="Emeka">Emeka Nwosu</option>
          </select>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <span className="text-slate-500 text-[10px] uppercase font-mono font-bold">TOTAL RECORDINGS: {recordings.length} ARCHIVES</span>
        </div>
      </div>

      {/* Recordings Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-mono text-[9px] uppercase">
                <th className="p-3">Date / Timestamp</th>
                <th className="p-3">Customer Caller</th>
                <th className="p-3">Staff Agent</th>
                <th className="p-3 font-mono">Duration</th>
                <th className="p-3">Campaign Group</th>
                <th className="p-3">Disposition Outcome</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRecs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">No recordings stored for current session</td>
                </tr>
              ) : (
                filteredRecs.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/10">
                    <td className="p-3 font-mono text-slate-400">{rec.date}</td>
                    <td className="p-3 font-mono text-slate-200 font-bold">{rec.caller}</td>
                    <td className="p-3 text-slate-300 font-semibold">{rec.agentName}</td>
                    <td className="p-3 font-mono text-blue-400 font-bold">{Math.floor(rec.duration / 60)}m {rec.duration % 60}s</td>
                    <td className="p-3 text-slate-400">{rec.campaignName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">
                        {rec.disposition}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          id={`play-rec-${rec.id}`}
                          onClick={() => handlePlayRec(rec.id)}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded"
                          title="Play Tape"
                        >
                          <Play size={13} />
                        </button>
                        <button
                          onClick={() => handleDownload(rec.id)}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded"
                          title="Download Audio"
                        >
                          <Download size={13} />
                        </button>
                        <button
                          onClick={() => handleCopyLink(rec.id)}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
                          title="Copy Link"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          id={`delete-rec-${rec.id}`}
                          onClick={() => {
                            if (!canDeleteRecordings) {
                              alert('Forbidden: Your role does not have authorization to delete recordings.');
                              return;
                            }
                            if (confirm('Permanently purge this call recording from disk?')) {
                              deleteRecording(rec.id);
                            }
                          }}
                          className={`p-1 rounded ${!canDeleteRecordings ? 'opacity-40 cursor-not-allowed text-slate-600' : 'hover:bg-slate-800 text-slate-400 hover:text-rose-400'}`}
                          title="Delete"
                        >
                          <X size={13} />
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

      {/* AUDIO PLAYER PLAYBACK SIDE DRAWER (SHEET) */}
      {selectedRec && (
        <div id="recording-drawer-overlay" className="fixed inset-0 bg-[#020617]/70 backdrop-blur-sm flex justify-end z-50">
          <div 
            id="recording-drawer-container" 
            className="bg-[#111827] border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto animate-slideInRight"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-full animate-pulse">
                    <Disc size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm">SECURE AUDIO PLAYER</h3>
                    <p className="text-[10px] text-slate-500 font-mono">ENCRYPTED SHIFT STORAGE ID: NT-{selectedRec.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRecId(null)} 
                  className="text-slate-400 hover:text-white p-1 bg-slate-800/40 rounded border border-transparent hover:border-slate-700/60 transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Tape Metadata Cards */}
              <div className="bg-[#0f172a] border border-slate-800 rounded p-4 space-y-2.5 text-xs text-slate-400 mb-6 font-mono">
                <div className="flex justify-between">
                  <span>Caller/MSISDN:</span>
                  <span className="text-slate-200 font-bold">{selectedRec.caller}</span>
                </div>
                <div className="flex justify-between">
                  <span>Handling Agent:</span>
                  <span className="text-slate-200">{selectedRec.agentName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Campaign Source:</span>
                  <span className="text-slate-200">{selectedRec.campaignName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timestamp Date:</span>
                  <span className="text-slate-200">{selectedRec.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Disposition Outcome:</span>
                  <span className="text-blue-400 font-bold">{selectedRec.disposition}</span>
                </div>
              </div>

              {/* INTEGRATED WAVEFORM AUDIO PLAYBACK COMPONENT */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Playback Console Stream</span>
                
                {/* Audio Wave Visualizer Simulation */}
                <div className="flex items-end justify-between h-12 px-2 gap-[3px]">
                  {[
                    40, 60, 20, 80, 50, 90, 30, 40, 70, 80, 50, 40, 90, 70, 30, 45, 65, 85, 35, 25, 45, 75, 95, 30, 50, 80, 60
                  ].map((height, i) => {
                    const isActive = (i / 27) * 100 <= playbackProgress;
                    return (
                      <div 
                        key={i} 
                        className={`w-[6px] rounded-full transition-all duration-150 ${
                          isActive 
                            ? isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-600' 
                            : 'bg-slate-800'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>

                {/* Progress bar controller slider */}
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      id="recording-playback-slider"
                      type="range"
                      min="0"
                      max="100"
                      value={playbackProgress}
                      onChange={(e) => setPlaybackProgress(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>{Math.floor((selectedRec.duration * (playbackProgress / 100)) / 60)}:{(Math.floor((selectedRec.duration * (playbackProgress / 100)) % 60)).toString().padStart(2, '0')}</span>
                    <span>{Math.floor(selectedRec.duration / 60)}:{selectedRec.duration % 60}</span>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    id="playback-btn-toggle"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all shadow"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                </div>
              </div>

              {/* Disposition Notes review */}
              <div className="mt-6 space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Agent Call Notes</span>
                <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 italic">
                  "{selectedRec.notes || 'No agent notes recorded.'}"
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleDownload(selectedRec.id)}
                className="py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 font-semibold text-center transition-all"
              >
                Download MP3 File
              </button>
              <button
                onClick={() => handleCopyLink(selectedRec.id)}
                className="py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-center transition-all shadow"
              >
                Copy Secure Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
