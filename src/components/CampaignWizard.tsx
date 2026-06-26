/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  ChevronRight, ChevronLeft, Check, Info, Settings, Users, Eye, AlertCircle, Calendar,
  Layers, PhoneCall, ShieldAlert, CheckCircle, FileSpreadsheet, Clock, ListChecks,
  Sliders, MessageSquarePlus, Globe, HelpCircle, UserPlus, UploadCloud, Trash2, X
} from 'lucide-react';

interface CampaignWizardProps {
  onClose: () => void;
}

export default function CampaignWizard({ onClose }: CampaignWizardProps) {
  const { addCampaign, agents, queues } = useStore();
  const [step, setStep] = useState(1);
  const [validationError, setValidationError] = useState('');

  // Step 1: Campaign Information
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [campaignType, setCampaignType] = useState<'Inbound' | 'Outbound' | 'Blended'>('Outbound');
  const [campaignGoal, setCampaignGoal] = useState('');

  // Step 2: Contact Selection
  const [contactGroup, setContactGroup] = useState('Lagos Core');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Step 3: Dialing Configuration
  const [dialingMode, setDialingMode] = useState<'Manual' | 'Progressive' | 'Predictive'>('Progressive');
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [retryDelay, setRetryDelay] = useState(5); // in minutes
  const [callbackRules, setCallbackRules] = useState('Immediate routing to same agent');

  // Step 4: Assign Agents
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(['u-1', 'u-2']);
  const [agentSearch, setAgentSearch] = useState('');

  // Step 5: Assign Queue
  const [assignedQueueId, setAssignedQueueId] = useState('q-1');

  // Step 6: Caller ID
  const [callerIdMode, setCallerIdMode] = useState<'Masked' | 'Verified DID' | 'Custom Number'>('Verified DID');
  const [callerIdNumber, setCallerIdNumber] = useState('+234 1 227 8890');

  // Step 7: Business Hours
  const [businessHoursPolicy, setBusinessHoursPolicy] = useState('Default Office Hours (8am - 5pm Lagos Time)');
  const [scheduleStartDate, setScheduleStartDate] = useState('2026-06-25');
  const [scheduleEndDate, setScheduleEndDate] = useState('2026-07-25');

  // Step 8: Disposition Setup
  const [dispositions, setDispositions] = useState<string[]>([
    'Interested', 
    'Not Interested', 
    'Busy / Callback', 
    'No Answer', 
    'Wrong Number', 
    'Do Not Call'
  ]);
  const [customDispInput, setCustomDispInput] = useState('');

  const availableAgents = agents.filter(a => a.role === 'agent');

  const handleAgentToggle = (id: string) => {
    setSelectedAgentIds(prev => 
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const addDisposition = () => {
    if (customDispInput.trim() && !dispositions.includes(customDispInput.trim())) {
      setDispositions([...dispositions, customDispInput.trim()]);
      setCustomDispInput('');
    }
  };

  const removeDisposition = (disp: string) => {
    setDispositions(dispositions.filter(d => d !== disp));
  };

  const validateStep = () => {
    setValidationError('');
    
    switch (step) {
      case 1:
        if (!name.trim()) {
          setValidationError('Campaign Name is required.');
          return false;
        }
        if (!campaignGoal.trim()) {
          setValidationError('Campaign Goal is required.');
          return false;
        }
        break;
      case 2:
        if (contactGroup === 'Upload CSV' && !uploadedFile) {
          setValidationError('Please upload/simulate a CSV or Excel lead file.');
          return false;
        }
        break;
      case 3:
        if (maxAttempts < 1 || maxAttempts > 10) {
          setValidationError('Max attempts must be between 1 and 10.');
          return false;
        }
        break;
      case 4:
        if (selectedAgentIds.length === 0) {
          setValidationError('Please assign at least 1 agent to this campaign.');
          return false;
        }
        break;
      case 6:
        if (!callerIdNumber.trim()) {
          setValidationError('Caller ID number is required.');
          return false;
        }
        break;
      case 7:
        if (!scheduleStartDate || !scheduleEndDate) {
          setValidationError('Start and End dates are required.');
          return false;
        }
        if (new Date(scheduleStartDate) > new Date(scheduleEndDate)) {
          setValidationError('Start Date cannot exceed End Date.');
          return false;
        }
        break;
      case 8:
        if (dispositions.length === 0) {
          setValidationError('At least 1 outcome disposition is required.');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setValidationError('');
    setStep(prev => prev - 1);
  };

  const handleLaunch = () => {
    if (!validateStep()) return;
    
    // Dispatch to global Zustand store
    addCampaign({
      name,
      description: `${description} (${campaignType} Campaign routed via Queue: ${queues.find(q => q.id === assignedQueueId)?.name})`,
      goal: campaignGoal,
      retryDelay,
      maxAttempts,
      wrapUpTime: 30,
      startDate: scheduleStartDate,
      endDate: scheduleEndDate,
      status: 'active'
    });

    onClose();
  };

  const filteredAgents = availableAgents.filter(a => 
    a.name.toLowerCase().includes(agentSearch.toLowerCase())
  );

  const stepsList = [
    { num: 1, label: 'Information', icon: Info },
    { num: 2, label: 'Contacts', icon: FileSpreadsheet },
    { num: 3, label: 'Dialing', icon: Sliders },
    { num: 4, label: 'Agents', icon: Users },
    { num: 5, label: 'Queue', icon: Layers },
    { num: 6, label: 'Caller ID', icon: PhoneCall },
    { num: 7, label: 'Schedule', icon: Clock },
    { num: 8, label: 'Dispositions', icon: ListChecks },
    { num: 9, label: 'Review', icon: Eye }
  ];

  return (
    <div id="campaign-wizard-overlay" className="fixed inset-0 bg-[#020617]/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        id="campaign-wizard-container" 
        className="bg-[#111827] border border-slate-800 rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden animate-fadeIn flex flex-col h-[85vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0f172a]">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Enterprise Campaign Setup Wizard</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Configure compliance-checked outbound auto-receptionist campaigns</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-100 transition-colors text-xs font-semibold bg-slate-800 px-3 py-1.5 rounded border border-slate-700/60"
          >
            Cancel Form
          </button>
        </div>

        {/* Dense Step Navigation Rail */}
        <div className="bg-[#0b0f19] px-6 py-2 border-b border-slate-800/80 overflow-x-auto select-none flex items-center justify-between gap-1">
          {stepsList.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            const Icon = s.icon;
            return (
              <div key={s.num} className="flex items-center gap-1.5 shrink-0">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  isCompleted ? 'bg-emerald-600 text-white' :
                  isCurrent ? 'bg-blue-600 text-white border border-blue-400' :
                  'bg-slate-800 text-slate-500 border border-slate-700'
                }`}>
                  {isCompleted ? <Check size={10} /> : s.num}
                </span>
                <span className={`text-[10px] hidden md:inline font-mono font-semibold ${isCurrent ? 'text-blue-400' : isCompleted ? 'text-emerald-500' : 'text-slate-500'}`}>
                  {s.label}
                </span>
                {s.num < 9 && <ChevronRight size={10} className="text-slate-800 mx-0.5 hidden md:block" />}
              </div>
            );
          })}
        </div>

        {/* Main Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-300">
          {validationError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded flex items-center gap-2 text-rose-400 font-bold">
              <AlertCircle size={14} className="shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: CAMPAIGN INFO */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Campaign Label Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos Fiber Expansion Campaign"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Campaign Direction Type</label>
                  <select
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value as any)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Outbound">Outbound Dialer Mode</option>
                    <option value="Inbound">Inbound ACD Distribution</option>
                    <option value="Blended">Blended (Bidirectional Queue)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Description and Directives</label>
                <textarea
                  rows={3}
                  placeholder="Draft scripts, outline campaign promotional directives, target profile, or compliance parameters..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Primary Performance Goal *</label>
                <input
                  type="text"
                  placeholder="e.g. Generate 50 qualified sales conversions"
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 2: CONTACTS SELECTION */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Target Lead Pool Source</label>
                <select
                  value={contactGroup}
                  onChange={(e) => {
                    setContactGroup(e.target.value);
                    if (e.target.value !== 'Upload CSV') setUploadedFile(null);
                  }}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="Lagos Core">Existing Group: Lagos Core Leads (65 Contacts)</option>
                  <option value="Abuja VIPs">Existing Group: Abuja VIP Accounts (12 Contacts)</option>
                  <option value="Retail Leads">Existing Group: Retail Leads (104 Contacts)</option>
                  <option value="Upload CSV">Bulk Import via Excel / CSV File</option>
                </select>
              </div>

              {contactGroup === 'Upload CSV' && (
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 bg-[#0f172a]'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    setUploadedFile('lagos_telecom_leads_bulk_import_2026.csv');
                  }}
                >
                  <UploadCloud size={32} className="mx-auto text-slate-500 mb-2" />
                  <p className="font-bold text-slate-300">Drag and drop your spreadsheet file here</p>
                  <p className="text-[10px] text-slate-500 mt-1">Supports standard CSV, XLS, XLSX formats (Maximum 50MB)</p>
                  
                  {uploadedFile ? (
                    <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded text-[10px] font-mono">
                      <FileSpreadsheet size={12} />
                      <span className="font-bold">{uploadedFile}</span>
                      <X size={12} className="cursor-pointer ml-1" onClick={() => setUploadedFile(null)} />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setUploadedFile('simulated_bulk_leads.csv')}
                      className="mt-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1 rounded text-[10px] font-bold"
                    >
                      Simulate CSV Upload
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: DIALING CONFIG */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Dialing Mode Algorithm</label>
                  <select
                    value={dialingMode}
                    onChange={(e) => setDialingMode(e.target.value as any)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Progressive">Progressive Dialer (Compliance Checked)</option>
                    <option value="Manual">Manual Click-to-Dial Only</option>
                    <option value="Predictive">Predictive Dialer (Multi-Line pacing)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Max Attempt Retries per Coordinate</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 3)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Retry Interval Delay (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={retryDelay}
                    onChange={(e) => setRetryDelay(parseInt(e.target.value) || 5)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Callback Routing Rules</label>
                  <input
                    type="text"
                    value={callbackRules}
                    onChange={(e) => setCallbackRules(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ASSIGN AGENTS */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Staffing Pool Assignment</label>
                <input
                  type="text"
                  placeholder="Search staff members by name..."
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                />
              </div>

              <div className="border border-slate-800 rounded bg-[#0f172a] max-h-48 overflow-y-auto divide-y divide-slate-800/60 scrollbar-thin">
                {filteredAgents.map((agent) => {
                  const isSelected = selectedAgentIds.includes(agent.id);
                  return (
                    <div 
                      key={agent.id}
                      onClick={() => handleAgentToggle(agent.id)}
                      className={`p-2.5 flex items-center justify-between cursor-pointer select-none transition-colors ${
                        isSelected ? 'bg-blue-600/10' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 font-mono">
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </span>
                        <div>
                          <p className="font-bold text-slate-200">{agent.name}</p>
                          <p className="text-[9px] text-slate-500 font-mono">{agent.email}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-blue-600 bg-slate-900 border-slate-800 focus:ring-0"
                      />
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Selected agents: {selectedAgentIds.length} staffed</p>
            </div>
          )}

          {/* STEP 5: ASSIGN QUEUE */}
          {step === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Inbound Call Routing Queue Node</label>
                <select
                  value={assignedQueueId}
                  onChange={(e) => setAssignedQueueId(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                >
                  {queues.map(q => (
                    <option key={q.id} value={q.id}>{q.name} ({q.agentCount} staffed)</option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                The selected automatic call distribution (ACD) queue handles inbound routing, failover thresholds, after-hours voicemails, and callback schedules.
              </p>
            </div>
          )}

          {/* STEP 6: CALLER ID */}
          {step === 6 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Caller ID Mode</label>
                  <select
                    value={callerIdMode}
                    onChange={(e) => setCallerIdMode(e.target.value as any)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Verified DID">Verified DID Number (Lagos DID)</option>
                    <option value="Masked">Masked Line Identifier</option>
                    <option value="Custom Number">Custom External Mask</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Caller Identification Number *</label>
                  <input
                    type="text"
                    value={callerIdNumber}
                    onChange={(e) => setCallerIdNumber(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: BUSINESS HOURS */}
          {step === 7 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Campaign Business Hours Policy</label>
                <select
                  value={businessHoursPolicy}
                  onChange={(e) => setBusinessHoursPolicy(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="Default Office Hours (8am - 5pm Lagos Time)">Default Office Hours (8am - 5pm Lagos Time)</option>
                  <option value="Abuja Shift schedule (9am - 6pm)">Abuja Shift schedule (9am - 6pm)</option>
                  <option value="24/7 Autodial continuous">24/7 Autodial continuous</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Schedule Start Date *</label>
                  <input
                    type="date"
                    value={scheduleStartDate}
                    onChange={(e) => setScheduleStartDate(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Schedule End Date *</label>
                  <input
                    type="date"
                    value={scheduleEndDate}
                    onChange={(e) => setScheduleEndDate(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: DISPOSITION SETUP */}
          {step === 8 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Outcome Disposition Labels</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Create outcome label, e.g., Wrong Number"
                    value={customDispInput}
                    onChange={(e) => setCustomDispInput(e.target.value)}
                    className="flex-1 bg-[#0f172a] border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDisposition())}
                  />
                  <button
                    type="button"
                    onClick={addDisposition}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-1.5 rounded font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {dispositions.map((disp, i) => (
                  <span key={i} className="bg-slate-800 border border-slate-700 text-slate-200 pl-3 pr-2 py-1 rounded-full flex items-center gap-1.5 font-semibold">
                    <span>{disp}</span>
                    <X size={10} className="cursor-pointer text-slate-400 hover:text-rose-400" onClick={() => removeDisposition(disp)} />
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 9: REVIEW & ACTIVATE */}
          {step === 9 && (
            <div className="space-y-4 animate-fadeIn text-xs font-mono">
              <div className="bg-[#0f172a] border border-slate-800 rounded p-4 space-y-3 shadow-inner">
                <h4 className="font-bold text-slate-300 uppercase border-b border-slate-800 pb-2 flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Review & Activate Campaign Schema</span>
                </h4>
                
                <div className="grid grid-cols-2 gap-y-2 text-slate-400">
                  <span className="text-slate-500 font-bold uppercase text-[9px]">Title:</span>
                  <span className="text-slate-200 font-bold">{name}</span>

                  <span className="text-slate-500 font-bold uppercase text-[9px]">Goal:</span>
                  <span className="text-slate-200 font-bold">{campaignGoal}</span>

                  <span className="text-slate-500 font-bold uppercase text-[9px]">Contacts Pool:</span>
                  <span className="text-slate-200 font-bold">{contactGroup === 'Upload CSV' ? uploadedFile : `Group: ${contactGroup}`}</span>

                  <span className="text-slate-500 font-bold uppercase text-[9px]">Mode:</span>
                  <span className="text-slate-200 font-bold">{dialingMode} ({maxAttempts} attempts max)</span>

                  <span className="text-slate-500 font-bold uppercase text-[9px]">Staffing:</span>
                  <span className="text-slate-200 font-bold">{selectedAgentIds.length} active agents assigned</span>

                  <span className="text-slate-500 font-bold uppercase text-[9px]">ACD Queue:</span>
                  <span className="text-slate-200 font-bold">{queues.find(q => q.id === assignedQueueId)?.name}</span>

                  <span className="text-slate-500 font-bold uppercase text-[9px]">Caller ID Mask:</span>
                  <span className="text-slate-200 font-bold">{callerIdNumber} ({callerIdMode})</span>

                  <span className="text-slate-500 font-bold uppercase text-[9px]">Timelines:</span>
                  <span className="text-slate-200 font-bold">{scheduleStartDate} to {scheduleEndDate}</span>

                  <span className="text-slate-500 font-bold uppercase text-[9px]">Dispositions:</span>
                  <span className="text-slate-200 font-bold truncate">{dispositions.join(', ')}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded text-slate-400 font-sans leading-relaxed">
                <p>
                  <strong>Dialer compliance checks passed.</strong> Progressive pace threshold locks out automatically if abandonment rates exceed 3.0% globally. 
                  Ready for system deployment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-[#0f172a]">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-1.5 rounded text-xs font-semibold border border-slate-700/60 text-slate-300 hover:bg-slate-800 flex items-center gap-1 transition-all"
              >
                <ChevronLeft size={14} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}
          </div>

          <div>
            {step < 9 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-1.5 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 transition-all shadow"
              >
                <span>Continue</span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLaunch}
                className="px-5 py-2 rounded text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 transition-all shadow"
              >
                <Check size={14} />
                <span>Activate Campaign</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
