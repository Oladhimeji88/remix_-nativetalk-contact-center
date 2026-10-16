/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { 
  Upload, Check, AlertCircle, FileSpreadsheet, ArrowRight, Table, Loader2 
} from 'lucide-react';

interface ContactImportModalProps {
  onClose: () => void;
}

const MOCK_MAPPED_ROWS = [
  { rawPhone: '+2348035052912', rawName: 'Gideon Chukwuma', rawCompany: 'Chukwuma & Sons', rawEmail: 'g.chukwuma@gmail.com', rawNotes: 'Promotional outreach' },
  { rawPhone: '+2348123049182', rawName: 'Zainab Balogun', rawCompany: 'Balogun Textiles', rawEmail: 'z.balogun@baloguntextiles.com', rawNotes: 'Enquired about fiber' },
  { rawPhone: '+2347051938201', rawName: 'Tunde Bakare', rawCompany: 'Bakare Logistics', rawEmail: 'tunde@bakarelogistics.com', rawNotes: 'Abuja lead' },
  { rawPhone: '+2349091938102', rawName: 'Amara Nnaji', rawCompany: 'Nnaji Ventures', rawEmail: 'amara.nnaji@nnajigroup.ng', rawNotes: 'Retail banking target' },
  { rawPhone: '+2348021948372', rawName: 'Kabiru Yusuf', rawCompany: 'Yusuf Agro', rawEmail: 'kabiru@yusufagro.com', rawNotes: 'Consultation request' }
];

export default function ContactImportModal({ onClose }: ContactImportModalProps) {
  const { importContacts, campaigns } = useStore();
  const [step, setStep] = useState(1); // 1: Upload, 2: Mapping, 3: Success
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || 'camp-1');

  // Mapping states
  const [mapPhone, setMapPhone] = useState('phone_number');
  const [mapName, setMapName] = useState('contact_name');
  const [mapCompany, setMapCompany] = useState('company_name');
  const [mapEmail, setMapEmail] = useState('email_address');
  const [mapNotes, setMapNotes] = useState('notes');

  const startUploadSimulation = () => {
    setIsUploading(true);
    setUploadProgress(0);
  };

  useEffect(() => {
    if (!isUploading) return;
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Auto advance to Step 2
          setStep(2);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isUploading]);

  const handleImportSubmit = () => {
    // Generate contacts based on mapped mock data and selected campaign
    const formattedContacts = MOCK_MAPPED_ROWS.map(row => ({
      name: row.rawName,
      phoneNumber: row.rawPhone,
      email: row.rawEmail,
      company: row.rawCompany,
      notes: row.rawNotes,
      lastContactDate: 'Never',
      campaignId: selectedCampaignId,
      status: 'pending' as const
    }));

    importContacts(formattedContacts);
    setStep(3); // success view
  };

  return (
    <div id="import-modal-overlay" className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        id="import-modal-container" 
        className="bg-[#111827] border border-slate-800 rounded-lg shadow-2xl w-full max-w-xl overflow-hidden animate-fadeIn flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0f172a]">
          <div>
            <h3 className="text-base font-bold text-slate-200">Import Contacts Database</h3>
            <p className="text-xs text-slate-500 mt-0.5">Bulk upload contact sheets into active dialer queues</p>
          </div>
          <button 
            id="import-close-btn"
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* STEP 1: Upload Dropzone */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase block">Assign to Campaign</label>
                <select
                  id="import-select-campaign"
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-600 font-mono"
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {!isUploading && uploadProgress === 0 ? (
                <div 
                  id="dropzone"
                  onClick={startUploadSimulation}
                  className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-lg py-12 px-6 text-center cursor-pointer hover:bg-slate-800/20 transition-all select-none space-y-3"
                >
                  <Upload size={36} className="text-slate-500 mx-auto animate-pulse" />
                  <div>
                    <p className="text-xs font-semibold text-slate-300">Drag & Drop Contacts Sheet (.csv / .xlsx)</p>
                    <p className="text-[10px] text-slate-500 mt-1">or click to browse local filesystem</p>
                  </div>
                  <div className="text-[10px] text-slate-600 bg-[#0f172a] py-1 px-2.5 rounded inline-block">
                    Format Guide: Phone column must contain +234 or local mobile prefixes.
                  </div>
                </div>
              ) : (
                <div className="border border-slate-800 bg-[#0f172a] rounded-lg p-6 space-y-4 text-center">
                  <FileSpreadsheet size={32} className="text-blue-500 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-300">Uploading lagos_sme_leads.csv</p>
                    <p className="text-[10px] text-slate-500 font-mono">{uploadProgress}% complete</p>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-150" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Field Mapping & Preview */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-[#0f172a] border border-slate-800 rounded p-4 space-y-3">
                <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Table size={12} className="text-blue-500" />
                  <span>Column Field Mapping</span>
                </h4>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">NativeTalk DB Fields</label>
                    <div className="space-y-2.5 py-1 text-slate-300 font-semibold font-mono">
                      <div>Phone Number *</div>
                      <div>Contact Name</div>
                      <div>Company</div>
                      <div>Email Address</div>
                      <div>Notes</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">CSV Header Match</label>
                    <div className="space-y-1">
                      <select value={mapPhone} onChange={(e) => setMapPhone(e.target.value)} className="w-full bg-slate-800 border border-slate-700/60 rounded px-2 py-1 text-[11px] focus:outline-none">
                        <option value="phone_number">phone_number</option>
                        <option value="msisdn">msisdn</option>
                      </select>
                      <select value={mapName} onChange={(e) => setMapName(e.target.value)} className="w-full bg-slate-800 border border-slate-700/60 rounded px-2 py-1 text-[11px] focus:outline-none">
                        <option value="contact_name">contact_name</option>
                        <option value="full_name">full_name</option>
                      </select>
                      <select value={mapCompany} onChange={(e) => setMapCompany(e.target.value)} className="w-full bg-slate-800 border border-slate-700/60 rounded px-2 py-1 text-[11px] focus:outline-none">
                        <option value="company_name">company_name</option>
                        <option value="business_name">business_name</option>
                      </select>
                      <select value={mapEmail} onChange={(e) => setMapEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700/60 rounded px-2 py-1 text-[11px] focus:outline-none">
                        <option value="email_address">email_address</option>
                        <option value="customer_email">customer_email</option>
                      </select>
                      <select value={mapNotes} onChange={(e) => setMapNotes(e.target.value)} className="w-full bg-slate-800 border border-slate-700/60 rounded px-2 py-1 text-[11px] focus:outline-none">
                        <option value="notes">notes</option>
                        <option value="description">description</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Table */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Import Preview (5 records)</span>
                <div className="border border-slate-800 rounded bg-[#0f172a] overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[10px] font-mono">
                    <thead>
                      <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800">
                        <th className="p-2 border-r border-slate-800">Phone</th>
                        <th className="p-2 border-r border-slate-800">Name</th>
                        <th className="p-2 border-r border-slate-800">Company</th>
                        <th className="p-2">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {MOCK_MAPPED_ROWS.map((row, i) => (
                        <tr key={i}>
                          <td className="p-2 border-r border-slate-800 text-slate-400">{row.rawPhone}</td>
                          <td className="p-2 border-r border-slate-800 font-semibold">{row.rawName}</td>
                          <td className="p-2 border-r border-slate-800 truncate max-w-[100px]">{row.rawCompany}</td>
                          <td className="p-2 truncate max-w-[100px]">{row.rawEmail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                id="import-submit-btn"
                onClick={handleImportSubmit}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded text-xs font-bold flex items-center justify-center gap-2 transition-all shadow"
              >
                <Check size={14} />
                <span>Execute Sheet Import</span>
              </button>
            </div>
          )}

          {/* STEP 3: Success Summary */}
          {step === 3 && (
            <div className="space-y-4 py-4 text-center animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto text-xl font-bold">
                <Check size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-200 text-sm">Database Sync Complete</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  5 contact records have been parsed, validated, and successfully loaded to the selected campaign queue.
                </p>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded p-4 text-left font-mono text-xs max-w-sm mx-auto space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Target Campaign:</span>
                  <span className="text-slate-200">Lagos Fiber Promo</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Processed Rows:</span>
                  <span className="text-slate-200">5 of 5</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Format Matches:</span>
                  <span className="text-emerald-500">100% OK</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Duplicates Purged:</span>
                  <span className="text-slate-500">0</span>
                </div>
              </div>

              <button
                id="import-success-done"
                onClick={onClose}
                className="px-6 py-2 rounded text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all border border-slate-700/60"
              >
                Return to Database
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
