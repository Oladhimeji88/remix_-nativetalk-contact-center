/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Shield, 
  ShieldAlert, 
  CheckCircle, 
  Smartphone, 
  Terminal, 
  Activity, 
  HelpCircle,
  User, 
  UserCheck, 
  Lock, 
  Mail, 
  Key, 
  Layers, 
  Eye, 
  EyeOff, 
  ChevronRight,
  Headphones,
  LineChart,
  Settings
} from 'lucide-react';

const loginLogoSrc = new URL('../../logo/nativetalksvg.svg', import.meta.url).href;

export default function LoginScreen() {
  const { setCurrentUser, users, addUser } = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Selected Role (Agent, Supervisor, Admin) to pre-configure forms & highlights
  const [selectedRole, setSelectedRole] = useState<'agent' | 'supervisor' | 'admin'>('agent');

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Prefill credentials helper for Demo roles
  const handleRoleSelect = (role: 'agent' | 'supervisor' | 'admin') => {
    setSelectedRole(role);
    setError('');
    
    if (!isRegister) {
      // Find the corresponding pre-seeded user in store to facilitate fast demo testing
      const matchedUser = users.find(u => u.role === role);
      if (matchedUser) {
        setEmail(matchedUser.email);
        setPassword('password123'); // seed fake password
      }
    }
  };

  // Pre-seed correct email on first mount or toggle
  React.useEffect(() => {
    const matchedUser = users.find(u => u.role === selectedRole);
    if (matchedUser && !isRegister) {
      setEmail(matchedUser.email);
    } else {
      setEmail('');
    }
  }, [selectedRole, isRegister, users]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide your agency email address.');
      return;
    }

    const matchedUser = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matchedUser) {
      // Set current logged-in user
      setCurrentUser(matchedUser);
    } else {
      setError(`No account found with the email "${email}". Please sign up first using the "Create Account" tab above.`);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!regName.trim() || !regEmail.trim()) {
      setError('Full name and email address are required.');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase())) {
      setError('An account with this email address already exists.');
      return;
    }

    // Provision user in global store state
    addUser({
      name: regName,
      email: regEmail,
      role: selectedRole,
      status: 'Active'
    });

    setRegSuccess(true);
    
    setTimeout(() => {
      // Find the newly added user to set as active session
      const newestUser = useStore.getState().users.find(
        u => u.email.toLowerCase() === regEmail.trim().toLowerCase()
      );
      if (newestUser) {
        setCurrentUser(newestUser);
      } else {
        // Fallback
        setCurrentUser({
          id: `usr-${Date.now()}`,
          name: regName,
          email: regEmail,
          role: selectedRole,
          status: 'Active',
          lastActive: 'Just now'
        });
      }
    }, 1200);
  };

  const roleMeta = {
    agent: {
      title: 'Agent',
      colorClass: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
      activeColorClass: 'border-emerald-500 ring-1 ring-emerald-500/25 bg-emerald-500/10 text-emerald-300',
      icon: Headphones,
      desc: 'Browser voice workspace & autodialers.',
      permissions: ['Inbound queues', 'Progressive dialing', 'Call dispositions', 'WebRTC Softphone']
    },
    supervisor: {
      title: 'Supervisor',
      colorClass: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
      activeColorClass: 'border-amber-500 ring-1 ring-amber-500/25 bg-amber-500/10 text-amber-300',
      icon: LineChart,
      desc: 'Dialer monitor, metrics & recordings.',
      permissions: ['Live performance widgets', 'Campaign creation wizard', 'Audio recordings review', 'Agent active state deck']
    },
    admin: {
      title: 'Administrator',
      colorClass: 'border-rose-500/30 text-rose-400 bg-rose-500/5',
      activeColorClass: 'border-rose-500 ring-1 ring-rose-500/25 bg-rose-500/10 text-rose-300',
      icon: Settings,
      desc: 'Full carrier nodes & PBX config.',
      permissions: ['Manage physical SIP trunks', 'Assign browser extension lines', 'System user role configuration', 'Core carrier parameters']
    }
  };

  return (
    <div id="screen-login-auth" className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans select-none relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_50%)]" />

      {/* Main SaaS Frame */}
      <div className="w-full max-w-5xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 animate-fadeIn">
        
        {/* Left Brand Showcase Column */}
        <div className="md:w-[42%] bg-[#0B0F19] border-r border-slate-800/60 p-8 flex flex-col justify-between text-xs text-slate-400">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <img src={loginLogoSrc} alt="NativeTalk logo" className="w-16 h-16 rounded-lg bg-slate-900 p-2 object-contain shadow-md shadow-blue-900/30" />
              <div>
                <span className="font-black text-slate-100 tracking-wider uppercase text-xs block">NativeTalk SaaS</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Telephony Cloud</span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-extrabold text-slate-200 tracking-tight leading-snug">
                Unified Telecom Gateway
              </h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Nigerian cloud-native telecommunication suite providing scalable virtual PBX solutions, live progressive dialing campaigns, and packet-level call data records.
              </p>
            </div>

            {/* Platform benefits list */}
            <div className="space-y-4 pt-6 border-t border-slate-800/50">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Unified Carrier Capabilities:</span>
              
              {[
                { label: 'Secure WebRTC Gateway', desc: 'Dial over encrypted TLS directly within your browser without external installers.' },
                { label: 'Nigerian Telecom Bridges', desc: 'Direct SIP trunks integrated with MTN, Airtel, and Glo gateways.' },
                { label: 'SaaS Multi-Role Architecture', desc: 'Granular access control optimized for Agents, Supervisors, and IT Admins.' }
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle size={12} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-300 text-[11px]">{benefit.label}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 text-[10px] text-slate-600 font-mono flex items-center gap-1.5 border-t border-slate-800/30">
            <Terminal size={12} className="text-slate-500 animate-pulse" />
            <span>NATIVETALK HOST: CLOUD-NG-LAGOS-01</span>
          </div>
        </div>

        {/* Right Input Form Column */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between bg-[#0F172A]/40 min-h-[580px]">
          
          {/* Form Header */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-800">
                <button
                  id="tab-select-login"
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                    setRegSuccess(false);
                  }}
                  className={`px-4 py-1.5 rounded-md font-bold text-xs transition-all ${
                    !isRegister 
                      ? 'bg-blue-600 text-white shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Log In
                </button>
                <button
                  id="tab-select-signup"
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError('');
                    setRegSuccess(false);
                  }}
                  className={`px-4 py-1.5 rounded-md font-bold text-xs transition-all ${
                    isRegister 
                      ? 'bg-blue-600 text-white shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                Secure SSL Handshake
              </span>
            </div>

            {/* Error Notifications */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400 flex items-center gap-2.5 mb-5 animate-fadeIn">
                <ShieldAlert size={14} className="shrink-0 text-rose-400" />
                <p>{error}</p>
              </div>
            )}

            {/* Success Notifications */}
            {regSuccess && (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center flex flex-col items-center gap-3 mb-5 animate-fadeIn">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle size={24} className="text-emerald-400 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">Provisioning SaaS Tenant Success!</h4>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-sm leading-relaxed">
                    Setting up dedicated WebRTC extension lines, caching credential salts, and configuring your unified {selectedRole.toUpperCase()} console workspace...
                  </p>
                </div>
              </div>
            )}

            {!regSuccess && (
              <div className="space-y-6">
                
                {/* 1. VISUAL ROLE MATRIX (The 3 roles) */}
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Choose Your Access Tier Role:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['agent', 'supervisor', 'admin'] as const).map((role) => {
                      const meta = roleMeta[role];
                      const IconComponent = meta.icon;
                      const isSelected = selectedRole === role;
                      
                      return (
                        <button
                          id={`role-card-${role}`}
                          key={role}
                          type="button"
                          onClick={() => handleRoleSelect(role)}
                          className={`p-3 rounded-xl border text-left transition-all relative ${
                            isSelected ? meta.activeColorClass : meta.colorClass + ' hover:border-slate-700/80'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-[11px] uppercase tracking-wide">
                              {meta.title}
                            </span>
                            <IconComponent size={14} className={isSelected ? 'text-blue-400' : 'text-slate-400'} />
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight">
                            {meta.desc}
                          </p>
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. DYNAMIC ACCESS HIGHLIGHT */}
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 text-[11px]">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[9px] bg-blue-500/15 text-blue-400 font-bold px-1.5 py-0.5 rounded uppercase">
                      {roleMeta[selectedRole].title} Capabilities
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-400 font-mono">
                    {roleMeta[selectedRole].permissions.map((p, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-blue-500/80">▸</span>
                        <span className="truncate">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. CORE INPUTS */}
                {!isRegister ? (
                  /* LOGIN FORM */
                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                          Agency Email *
                        </label>
                        <span className="text-[9px] text-slate-500 font-mono">demo accounts available</span>
                      </div>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-2.5 text-slate-600" />
                        <input
                          id="login-email-input"
                          type="email"
                          required
                          placeholder="yourname@nativetalk.ng"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                        Secret Password *
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-2.5 text-slate-600" />
                        <input
                          id="login-pass-input"
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg pl-9 pr-10 py-2 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-600 hover:text-slate-400"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <button
                      id="login-submit-btn"
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-center shadow-lg shadow-blue-950/40 hover:shadow-blue-500/10 transition-all flex items-center justify-center gap-2 group cursor-pointer mt-2"
                    >
                      <span>Enter {roleMeta[selectedRole].title} Workspace</span>
                      <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </form>
                ) : (
                  /* REGISTER / SIGN UP FORM */
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                        Agency Full Name *
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-2.5 text-slate-600" />
                        <input
                          id="reg-name-input"
                          type="text"
                          required
                          placeholder="e.g. Babatunde Alao"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                        Work Email Address *
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-2.5 text-slate-600" />
                        <input
                          id="reg-email-input"
                          type="email"
                          required
                          placeholder="e.g. b.alao@telecoms.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                        Secure Password *
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-2.5 text-slate-600" />
                        <input
                          id="reg-pass-input"
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Create strong password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg pl-9 pr-10 py-2 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-600 hover:text-slate-400"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <button
                      id="reg-submit-btn"
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-center shadow-lg shadow-blue-950/40 hover:shadow-blue-500/10 transition-all flex items-center justify-center gap-2 group cursor-pointer mt-2"
                    >
                      <span>Provision {roleMeta[selectedRole].title} Agency Account</span>
                      <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </form>
                )}

              </div>
            )}
          </div>

          {/* Quick Interactive Selector Helpers */}
          {!regSuccess && (
            <div className="pt-6 border-t border-slate-800/80 text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2.5">
                Quick Demo Accounts (Sandbox Instant Links):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'agent', label: 'Agent Workspace', mail: 'b.alao@nativetalk.ng', color: 'bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                  { role: 'supervisor', label: 'Supervisor Desk', mail: 't.ojo@nativetalk.ng', color: 'bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 border-amber-500/20' },
                  { role: 'admin', label: 'System Admin', mail: 'k.amadi@nativetalk.ng', color: 'bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 border-rose-500/20' }
                ].map((demo) => (
                  <button
                    id={`quick-login-${demo.role}`}
                    key={demo.role}
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
                      setSelectedRole(demo.role as any);
                      setEmail(demo.mail);
                      setPassword('password123');
                    }}
                    className={`py-2 px-1.5 rounded-lg border font-semibold text-center text-[10px] transition-all hover:scale-[1.01] ${demo.color}`}
                  >
                    <span className="block font-bold">{demo.label}</span>
                    <span className="block text-[8px] text-slate-500 truncate mt-0.5">{demo.mail}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
