/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { 
  Phone, PhoneOff, Play, Pause, Volume2, VolumeX, 
  CornerUpRight, CheckCircle2, AlertCircle, Calendar, 
  Clock, Hash, FileText, Smartphone 
} from 'lucide-react';

export default function Softphone() {
  const {
    softphoneState,
    softphoneContact,
    softphoneTimer,
    softphoneMuted,
    softphoneOnHold,
    softphoneRecording,
    answerCall,
    holdCall,
    muteCall,
    hangUpCall,
    submitDisposition,
    incrementSoftphoneTimer,
    contacts,
    triggerIncomingCall,
    triggerOutgoingCall
  } = useStore();

  const [dialNumber, setDialNumber] = useState('');
  const [dispNotes, setDispNotes] = useState('');
  const [dispStatus, setDispStatus] = useState<'connected' | 'no_answer' | 'busy' | 'dnc' | 'callback'>('connected');
  const [callbackDate, setCallbackDate] = useState('');
  const [validationError, setValidationError] = useState('');

  // Call timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (softphoneState === 'Connected' || softphoneState === 'On Hold') {
      interval = setInterval(() => {
        incrementSoftphoneTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [softphoneState]);

  // Format call duration (e.g. 02:45)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleDialPadClick = (val: string) => {
    // play soft dual tone beep
    setDialNumber(prev => prev + val);
  };

  const handleDialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dialNumber) {
      setValidationError('Please enter a valid number or select a contact.');
      return;
    }
    setValidationError('');
    
    // Look up contact or create a temporary one
    const existing = contacts.find(c => c.phoneNumber.replace(/\s+/g, '') === dialNumber.replace(/\s+/g, ''));
    if (existing) {
      triggerOutgoingCall(existing);
    } else {
      const tempContact = {
        id: 'c-temp',
        name: 'Manual Call: ' + dialNumber,
        phoneNumber: dialNumber,
        email: 'manual@nativetalk.ng',
        company: 'Individual Customer',
        notes: 'Manual outbound dial from softphone pad.',
        lastContactDate: 'Never',
        campaignId: 'camp-1',
        status: 'pending' as const
      };
      triggerOutgoingCall(tempContact);
    }
    setDialNumber('');
  };

  const handleManualIncomingTrigger = () => {
    // Select a random pending contact for convenience testing
    const pendingContacts = contacts.filter(c => c.status === 'pending');
    if (pendingContacts.length > 0) {
      triggerIncomingCall(pendingContacts[0]);
    } else if (contacts.length > 0) {
      triggerIncomingCall(contacts[0]);
    }
  };

  const handleDispSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dispStatus === 'callback' && !callbackDate) {
      setValidationError('Callback date and time is required.');
      return;
    }
    setValidationError('');
    submitDisposition(dispStatus, dispNotes, callbackDate);
    // Reset local fields
    setDispNotes('');
    setCallbackDate('');
  };

  return (
    <div id="agent-softphone-ui" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* COLUMN 1: CUSTOMER PANEL */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Hash className="text-blue-500" size={16} />
            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wide">Customer Profile</h3>
          </div>

          {softphoneContact ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-slate-800/80 pb-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Full Name</span>
                <span className="text-base font-bold text-slate-200">{softphoneContact.name}</span>
              </div>

              <div className="border-b border-slate-800/80 pb-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Phone Number</span>
                <span className="text-sm font-mono text-slate-300 font-semibold">{softphoneContact.phoneNumber}</span>
              </div>

              <div className="border-b border-slate-800/80 pb-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Company / Business</span>
                <span className="text-sm text-slate-300">{softphoneContact.company || 'N/A'}</span>
              </div>

              <div className="border-b border-slate-800/80 pb-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Active Campaign</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-block mt-1">
                  Lagos Fiber Promo
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Prior Interaction Notes</span>
                <p className="text-xs text-slate-400 mt-1 italic leading-relaxed">
                  "{softphoneContact.notes || 'No notes on record.'}"
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 space-y-3">
              <Smartphone size={32} className="text-slate-600 animate-pulse" />
              <div>
                <p className="text-xs font-semibold text-slate-400">Lines Standby</p>
                <p className="text-[11px] text-slate-500 mt-1">Ready for incoming queue routing or manual dial.</p>
              </div>
              <button
                id="btn-trigger-test-call"
                onClick={handleManualIncomingTrigger}
                className="mt-4 px-3 py-1.5 rounded text-xs font-semibold bg-blue-600/15 text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
              >
                Simulate Queue Call
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
          <span>IP CLOUD INTERFACE (WebRTC V2)</span>
        </div>
      </div>

      {/* COLUMN 2: SOFTPHONE TELEPHONY */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Phone className="text-blue-500" size={16} />
              <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wide">Softphone V3</h3>
            </div>
            {/* Softphone State Badge */}
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
              softphoneState === 'Connected' ? 'bg-emerald-500/15 text-emerald-400 animate-pulse' :
              softphoneState === 'Ringing' ? 'bg-amber-500/15 text-amber-400 animate-bounce' :
              softphoneState === 'On Hold' ? 'bg-blue-500/15 text-blue-400' :
              softphoneState === 'Wrap-Up' ? 'bg-purple-500/15 text-purple-400' :
              'bg-slate-800 text-slate-400'
            }`}>
              {softphoneState}
            </span>
          </div>

          {/* TIMER CARD */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-6 text-center mb-5 flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
            {softphoneRecording && (
              <span className="absolute top-3 right-3 flex items-center gap-1 text-[9px] text-rose-500 font-mono font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                REC LIVE
              </span>
            )}
            
            {softphoneState === 'Idle' ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-400">Ready to Dial</p>
                <p className="text-xs text-slate-500">Input number below or click a contact</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {softphoneContact?.name || 'Unknown Channel'}
                </p>
                <p className="text-4xl font-extrabold font-mono text-slate-100 tracking-tight">
                  {formatTime(softphoneTimer)}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {softphoneContact?.phoneNumber}
                </p>
              </div>
            )}
          </div>

          {/* DIAL PAD / CONTROLS GRID */}
          {softphoneState === 'Idle' ? (
            <form onSubmit={handleDialSubmit} className="space-y-4">
              <div className="relative">
                <input
                  id="softphone-dial-input"
                  type="text"
                  placeholder="Enter phone number..."
                  value={dialNumber}
                  onChange={(e) => setDialNumber(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>

              {/* Standard dial button matrix */}
              <div className="grid grid-cols-3 gap-2 max-w-[210px] mx-auto select-none">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((char) => (
                  <button
                    id={`dialpad-btn-${char === '*' ? 'star' : char === '#' ? 'hash' : char}`}
                    key={char}
                    type="button"
                    onClick={() => handleDialPadClick(char)}
                    className="h-10 text-xs font-bold text-slate-300 bg-slate-800/50 hover:bg-slate-800 rounded flex items-center justify-center hover:text-white border border-slate-800 active:scale-95 transition-all"
                  >
                    {char}
                  </button>
                ))}
              </div>

              {validationError && (
                <p className="text-xs text-rose-500 flex items-center gap-1 justify-center">
                  <AlertCircle size={12} />
                  {validationError}
                </p>
              )}

              <button
                id="softphone-dial-submit"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded text-xs font-bold flex items-center justify-center gap-2 transition-all shadow"
              >
                <Phone size={14} />
                <span>Place Call</span>
              </button>
            </form>
          ) : (
            /* CONTROL BUTTONS FOR ACTIVE CALL */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="softphone-mute-btn"
                  onClick={muteCall}
                  className={`py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    softphoneMuted 
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {softphoneMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{softphoneMuted ? 'Muted' : 'Mute'}</span>
                </button>

                <button
                  id="softphone-hold-btn"
                  onClick={holdCall}
                  disabled={softphoneState === 'Ringing' || softphoneState === 'Wrap-Up'}
                  className={`py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    softphoneOnHold 
                      ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' 
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 disabled:opacity-50'
                  }`}
                >
                  {softphoneOnHold ? <Play size={14} /> : <Pause size={14} />}
                  <span>{softphoneOnHold ? 'Resume' : 'Hold'}</span>
                </button>
              </div>

              <button
                id="softphone-transfer-btn"
                className="w-full py-2 px-3 rounded text-xs font-bold bg-slate-800/40 border border-slate-700/60 text-slate-300 hover:bg-slate-800 flex items-center justify-center gap-2"
              >
                <CornerUpRight size={14} />
                <span>Transfer Call</span>
              </button>

              <div className="pt-2 border-t border-slate-800/60 flex gap-2">
                {softphoneState === 'Ringing' ? (
                  <button
                    id="softphone-answer-btn"
                    onClick={answerCall}
                    className="flex-1 py-2.5 px-4 rounded text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all shadow"
                  >
                    <Phone size={14} />
                    <span>Answer Call</span>
                  </button>
                ) : null}

                <button
                  id="softphone-hangup-btn"
                  onClick={hangUpCall}
                  disabled={softphoneState === 'Wrap-Up'}
                  className="flex-1 py-2.5 px-4 rounded text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-2 transition-all shadow disabled:opacity-50"
                >
                  <PhoneOff size={14} />
                  <span>Hang Up</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono text-center">
          <span>SECURE ENCRYPTED AUDIO LINE</span>
        </div>
      </div>

      {/* COLUMN 3: DISPOSITION FORM PANEL */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="text-blue-500" size={16} />
            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wide">Call Disposition</h3>
          </div>

          {softphoneState === 'Wrap-Up' ? (
            <form onSubmit={handleDispSubmit} className="space-y-4 animate-fadeIn">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Outcome</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'connected', label: 'Answered' },
                    { key: 'no_answer', label: 'No Answer' },
                    { key: 'busy', label: 'Busy' },
                    { key: 'dnc', label: 'Do Not Call' },
                    { key: 'callback', label: 'Callback Req.' }
                  ].map((opt) => (
                    <label 
                      key={opt.key}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer select-none transition-colors ${
                        dispStatus === opt.key 
                          ? 'bg-blue-600/10 border-blue-500/40 text-blue-400 font-semibold' 
                          : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <input
                        id={`disposition-opt-${opt.key}`}
                        type="radio"
                        name="disp-outcome"
                        checked={dispStatus === opt.key}
                        onChange={() => setDispStatus(opt.key as any)}
                        className="sr-only"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional Callback Pickers */}
              {dispStatus === 'callback' && (
                <div className="bg-[#0f172a] border border-slate-800 rounded p-3 space-y-3 animate-fadeIn">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Callback Reservation</span>
                  <div className="space-y-2 text-xs">
                    <div className="relative">
                      <input
                        id="disposition-callback-date"
                        type="datetime-local"
                        value={callbackDate}
                        onChange={(e) => setCallbackDate(e.target.value)}
                        className="w-full bg-slate-800/60 border border-slate-700/60 rounded px-2.5 py-1.5 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Call Notes / Actions</span>
                <textarea
                  id="disposition-notes"
                  rows={4}
                  placeholder="Describe details of conversation, next steps, feedback..."
                  value={dispNotes}
                  onChange={(e) => setDispNotes(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded p-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-600 leading-relaxed"
                />
              </div>

              {validationError && (
                <p className="text-xs text-rose-500 flex items-center gap-1 justify-center">
                  <AlertCircle size={12} />
                  {validationError}
                </p>
              )}

              <button
                id="disposition-submit-btn"
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded text-xs font-bold flex items-center justify-center gap-2 transition-all shadow"
              >
                <CheckCircle2 size={14} />
                <span>Submit Disposition</span>
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 space-y-3">
              <FileText size={32} className="text-slate-600" />
              <div>
                <p className="text-xs font-semibold text-slate-400">Disposition Panel Locked</p>
                <p className="text-[11px] text-slate-500 mt-1">Submit disposition forms once active calls are hung up.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
          <span>COMPLIANCE & CDR DIRECTIVE</span>
        </div>
      </div>
    </div>
  );
}
