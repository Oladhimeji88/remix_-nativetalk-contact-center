/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { User, RoleType, PermissionConfig } from '../types';
import { 
  Users, Plus, ShieldAlert, KeyRound, CheckSquare, X, Edit, Trash2, 
  ShieldCheck, Mail, Info, Settings, Lock, Radio, Database, Network, 
  Eye, Check, CircleAlert, HelpCircle, ToggleLeft, ToggleRight, ShieldAlert as AlertIcon
} from 'lucide-react';

export default function UsersRoles() {
  const { 
    users, 
    addUser, 
    deleteUser, 
    updateUser, 
    currentRole,
    rolePermissions, 
    updateRolePermission 
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'permissions'>('users');
  const [selectedRole, setSelectedRole] = useState<RoleType>('agent');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'agent' | 'supervisor' | 'admin' | 'superadmin'>('agent');
  const [pass, setPass] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setValidationError('Name and Email are required.');
      return;
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setValidationError('User with this email already exists.');
      return;
    }

    addUser({
      name,
      email,
      role,
      status: 'Active'
    });

    setIsCreateOpen(false);
    setName('');
    setEmail('');
    setRole('agent');
    setPass('');
    setValidationError('');
  };

  const handleRoleChange = (id: string, newRole: 'agent' | 'supervisor' | 'admin' | 'superadmin') => {
    updateUser(id, { role: newRole });
  };

  const getRoleBadgeColor = (role: RoleType) => {
    switch (role) {
      case 'superadmin': return 'bg-purple-500/15 text-purple-400 border-purple-500/25';
      case 'admin': return 'bg-rose-500/15 text-rose-400 border-rose-500/25';
      case 'supervisor': return 'bg-amber-500/15 text-amber-400 border-amber-500/25';
      case 'agent': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const NAVIGATION_PERMISSIONS: { key: keyof PermissionConfig; label: string; desc: string }[] = [
    { key: 'dashboard', label: 'Dashboard Main', desc: 'Allows access to the general center KPIs and performance summaries.' },
    { key: 'workspace', label: 'Agent Workspace', desc: 'Enables active softphone panel, outbound scripts, and queue dispatching.' },
    { key: 'recordings', label: 'Recordings Library', desc: 'Grants access to stream, download, and review audio voice recordings.' },
    { key: 'contacts', label: 'Contacts Database (CRM)', desc: 'Allows browsing, creating, and profiling general customer coordinate lists.' },
    { key: 'logs', label: 'Call Logs (CDR)', desc: 'Inspects and exports complete detailed histories of Call Detail Records.' },
    { key: 'queues', label: 'Queues Manager', desc: 'Enables configuring inbound queue ringing strategies and general parameters.' },
    { key: 'supervisor', label: 'Agents Status Feed', desc: 'Provides supervisor monitoring of agent channels, state transitions, and metrics.' },
    { key: 'campaigns', label: 'Campaigns Builder', desc: 'Permits listing and managing active outbound calling dialer campaigns.' },
    { key: 'dialer', label: 'Progressive Dialer', desc: 'Enables controls to trigger, pause, and simulate automated progressive dial loops.' },
    { key: 'cloudpbx', label: 'PBX Routing Engine', desc: 'Allows modifying physical trunks, extensions, and softphone server configs.' },
    { key: 'analytics', label: 'Performance Suite', desc: 'Comprehensive graphical dashboard tracking response rates and trends.' },
    { key: 'users', label: 'Users & Roles Settings', desc: 'Deploys new login profiles and manages access authorization toggle switches.' },
    { key: 'superadminPlatform', label: 'Tenants & Nodes Cluster', desc: 'Root partition dashboard inspecting tenant channels and FreeSWITCH clusters.' }
  ];

  const ACTION_PERMISSIONS: { key: keyof PermissionConfig; label: string; desc: string }[] = [
    { key: 'editCampaigns', label: 'Campaign Administrations', desc: 'Allows creating, editing, and permanently deleting dialer campaigns.' },
    { key: 'editContacts', label: 'Modify CRM Records', desc: 'Permits adding new contacts, importing CSV spreadsheets, and deleting coordinates.' },
    { key: 'deleteRecordings', label: 'Purge Audio Backups', desc: 'Permits deleting or archiving call session audio recordings.' },
    { key: 'deleteUsers', label: 'Decommission Staff Logins', desc: 'Allows deactivating or permanently deleting active staff profiles.' },
    { key: 'managePBX', label: 'SIP Channel Management', desc: 'Permits modifying live SIP trunks, codecs, registration details, and PBX routes.' }
  ];

  // Helper check to prevent admin from locking themselves out of the current view
  const isProtectedPermission = (role: RoleType, key: keyof PermissionConfig) => {
    // Prevent locking admin/superadmin out of users screen or setting permissions
    if ((role === 'admin' || role === 'superadmin') && (key === 'users')) {
      return true;
    }
    return false;
  };

  return (
    <div id="screen-users-roles" className="space-y-6 animate-fadeIn select-none font-sans text-slate-300 text-xs">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111827] border border-slate-800 p-4 rounded-lg">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-500" />
            <span>Users & Access Control</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage login credentials and configure real-time role-based access control toggles</p>
        </div>
        
        {/* Navigation tabs for Users and Permissions */}
        <div className="flex gap-2 bg-[#0f172a] border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'users' 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users size={13} />
            <span>Staff Directory</span>
          </button>
          <button
            onClick={() => setActiveSubTab('permissions')}
            className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'permissions' 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings size={13} />
            <span>Access Control Toggles</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'users' ? (
        /* TAB 1: USER LISTING & CREATION */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Users Table List */}
          <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-lg p-5">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800/80">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Active Staff Accounts</h3>
              <button
                id="btn-add-user"
                onClick={() => setIsCreateOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all shadow"
              >
                <Plus size={12} />
                <span>Provision User</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-mono text-[9px] uppercase">
                    <th className="p-2.5">Name Details</th>
                    <th className="p-2.5">Role Designation</th>
                    <th className="p-2.5 text-right">Delete Account</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/10">
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-blue-600/15 text-blue-400 font-extrabold flex items-center justify-center text-[10px]">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-200">{user.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2.5">
                        <select
                          id={`user-role-select-${user.id}`}
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                          className="bg-[#0f172a] border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none font-semibold text-[11px]"
                        >
                          <option value="agent">Agent Workspace Only</option>
                          <option value="supervisor">Supervisor Analytics</option>
                          <option value="admin">System Administrator</option>
                          <option value="superadmin">Global Superadmin</option>
                        </select>
                      </td>
                      <td className="p-2.5 text-right">
                        {user.email === 'tokedeoluwafisayomi1@gmail.com' ? (
                          <span className="text-[9px] text-slate-500 font-mono italic">Primary Owner</span>
                        ) : (
                          <button
                            id={`user-delete-${user.id}`}
                            onClick={() => {
                              // Check permission first
                              if (rolePermissions && !rolePermissions[currentRole]?.deleteUsers) {
                                alert('Forbidden: Your role does not have authorization to delete users.');
                                return;
                              }
                              if (confirm(`Are you sure you want to deactivate ${user.name}?`)) {
                                deleteUser(user.id);
                              }
                            }}
                            className={`p-1 rounded transition-colors ${
                              rolePermissions && !rolePermissions[currentRole]?.deleteUsers
                                ? 'opacity-40 cursor-not-allowed text-slate-600'
                                : 'hover:bg-slate-800 text-slate-400 hover:text-rose-400'
                            }`}
                            title="Purge Account"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Roles & Permission Guide card */}
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 h-fit space-y-4">
            <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider pb-2 border-b border-slate-800/80 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-blue-500" />
              <span>Authorization Overviews</span>
            </h3>

            <div className="space-y-4">
              {[
                { role: 'Global Superadmin', desc: 'Access to physical core clustering, infrastructure nodes, partitioned multi-tenants, and absolute root configs.', color: 'text-purple-400', key: 'superadmin' as RoleType },
                { role: 'System Administrator', desc: 'Configures external VoIP carriers, trunk routes, active dialplan rules, extension pools, and staff access permissions.', color: 'text-rose-400', key: 'admin' as RoleType },
                { role: 'Supervisor', desc: 'Assigns contacts database, provisions campaigns, manages performance analytics, audio recording logs, and agent live channels.', color: 'text-amber-400', key: 'supervisor' as RoleType },
                { role: 'Agent', desc: 'Restricted purely to inbound/outbound interactive dialing, queue dispatching, call disposition notes, and client profiles.', color: 'text-emerald-400', key: 'agent' as RoleType }
              ].map((p, i) => (
                <div key={i} className="p-3 bg-[#0f172a] border border-slate-800 rounded space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`font-extrabold uppercase text-[10px] ${p.color}`}>{p.role} Profile</span>
                    <button 
                      onClick={() => {
                        setSelectedRole(p.key);
                        setActiveSubTab('permissions');
                      }}
                      className="text-[10px] text-blue-400 hover:text-blue-300 underline font-mono cursor-pointer"
                    >
                      Configure
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: INTERACTIVE ROLE PERMISSIONS CONFIGURATION (TOGGLES) */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn">
          {/* Left Column: Role Profiles Switcher */}
          <div className="lg:col-span-1 space-y-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Select Security Role</p>
            <div className="flex flex-col gap-2">
              {[
                { key: 'agent' as RoleType, label: 'Agent Workspace', count: users.filter(u => u.role === 'agent').length, desc: 'Restricted workspace for queue dialing' },
                { key: 'supervisor' as RoleType, label: 'Supervisor Suite', count: users.filter(u => u.role === 'supervisor').length, desc: 'Quality audits, analytics & routing monitor' },
                { key: 'admin' as RoleType, label: 'Administrator', count: users.filter(u => u.role === 'admin').length, desc: 'SIP configurations & staff deployment' },
                { key: 'superadmin' as RoleType, label: 'Global Superadmin', count: users.filter(u => u.role === 'superadmin').length, desc: 'Infrastructure partitions & cluster nodes' }
              ].map((roleItem) => {
                const isSelected = selectedRole === roleItem.key;
                return (
                  <button
                    key={roleItem.key}
                    onClick={() => setSelectedRole(roleItem.key)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all duration-150 relative overflow-hidden ${
                      isSelected 
                        ? 'bg-blue-600/10 border-blue-500 text-white shadow shadow-blue-500/5' 
                        : 'bg-[#111827] border-slate-800 text-slate-300 hover:bg-[#111827]/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-xs tracking-wide">{roleItem.label}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${getRoleBadgeColor(roleItem.key)}`}>
                        {roleItem.count} {roleItem.count === 1 ? 'user' : 'users'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-mono">{roleItem.desc}</p>
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-[#111827] border border-slate-800 p-4 rounded-lg mt-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-blue-400">
                <Info size={14} />
                <span className="font-bold">Real-time Apply</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Toggling permissions modifies system access rules instantly. Connected users with the corresponding role will find their sidebars and operational privileges adjusted in real-time.
              </p>
            </div>
          </div>

          {/* Right Columns: Permission Matrix Lists (Grouped Toggles) */}
          <div className="lg:col-span-3 space-y-6 bg-[#111827] border border-slate-800 p-6 rounded-lg">
            
            {/* Header info showing which role we are editing */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Lock size={15} className="text-blue-500" />
                  <span>Interactive Permissions Matrix for:</span>
                  <span className="capitalize text-blue-400 bg-blue-600/10 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider">
                    {selectedRole}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Select exactly what modules and critical operations to allow for this profile</p>
              </div>

              {/* Reset to system default link */}
              <button
                onClick={() => {
                  if (confirm(`Restore system defaults for the ${selectedRole} profile?`)) {
                    // Reset selected role by copying system-wide permissions
                    const defaultMapping: Record<RoleType, Partial<PermissionConfig>> = {
                      agent: { dashboard: true, workspace: true, queues: false, supervisor: false, recordings: true, campaigns: false, contacts: true, dialer: false, cloudpbx: false, analytics: false, logs: true, users: false, superadminPlatform: false, editCampaigns: false, editContacts: false, deleteRecordings: false, deleteUsers: false, managePBX: false },
                      supervisor: { dashboard: true, workspace: true, queues: true, supervisor: true, recordings: true, campaigns: true, contacts: true, dialer: true, cloudpbx: false, analytics: true, logs: true, users: false, superadminPlatform: false, editCampaigns: true, editContacts: true, deleteRecordings: false, deleteUsers: false, managePBX: false },
                      admin: { dashboard: true, workspace: true, queues: true, supervisor: true, recordings: true, campaigns: true, contacts: true, dialer: true, cloudpbx: true, analytics: true, logs: true, users: true, superadminPlatform: false, editCampaigns: true, editContacts: true, deleteRecordings: true, deleteUsers: true, managePBX: true },
                      superadmin: { dashboard: true, workspace: true, queues: true, supervisor: true, recordings: true, campaigns: true, contacts: true, dialer: true, cloudpbx: true, analytics: true, logs: true, users: true, superadminPlatform: true, editCampaigns: true, editContacts: true, deleteRecordings: true, deleteUsers: true, managePBX: true }
                    };
                    const roleDefaults = defaultMapping[selectedRole];
                    Object.entries(roleDefaults).forEach(([k, v]) => {
                      updateRolePermission(selectedRole, k as any, !!v);
                    });
                  }
                }}
                className="text-[10px] text-slate-400 hover:text-white bg-slate-800 border border-slate-700 px-2.5 py-1 rounded transition-all font-mono font-bold"
              >
                Reset Defaults
              </button>
            </div>

            {/* SECTION A: NAV MODULES */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/60 pb-1 flex items-center gap-1.5 font-mono">
                <Network size={13} className="text-blue-500" />
                <span>1. Navigation Tab & Screen Access</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {NAVIGATION_PERMISSIONS.map((perm) => {
                  const currentPermissionsForRole = rolePermissions?.[selectedRole] || {};
                  const isEnabled = !!(currentPermissionsForRole as any)[perm.key];
                  const isProtected = isProtectedPermission(selectedRole, perm.key);

                  return (
                    <div 
                      key={perm.key}
                      onClick={() => {
                        if (isProtected) return;
                        updateRolePermission(selectedRole, perm.key, !isEnabled);
                      }}
                      className={`p-3 rounded-lg border transition-all duration-150 flex justify-between items-center select-none cursor-pointer group ${
                        isEnabled 
                          ? 'bg-[#1e293b]/20 border-slate-800/80 hover:border-slate-700' 
                          : 'bg-[#111827] border-slate-800 opacity-60 hover:opacity-80'
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                            {perm.label}
                          </span>
                          {isProtected && (
                            <span className="bg-rose-950/40 text-rose-400 border border-rose-900/60 text-[8px] font-bold uppercase px-1 rounded-sm font-mono tracking-wider">
                              Protected
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono leading-normal">
                          {perm.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isProtected}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isProtected) return;
                          updateRolePermission(selectedRole, perm.key, !isEnabled);
                        }}
                        className={`w-10 h-5 rounded-full shrink-0 relative transition-colors focus:outline-none ${
                          isEnabled ? 'bg-blue-600' : 'bg-slate-800'
                        } ${isProtected ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-transform ${
                          isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION B: SYSTEM ACTIONS */}
            <div className="space-y-4 pt-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/60 pb-1 flex items-center gap-1.5 font-mono">
                <AlertIcon size={13} className="text-blue-500" />
                <span>2. Administrative & Critical System Actions</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ACTION_PERMISSIONS.map((perm) => {
                  const currentPermissionsForRole = rolePermissions?.[selectedRole] || {};
                  const isEnabled = !!(currentPermissionsForRole as any)[perm.key];

                  return (
                    <div 
                      key={perm.key}
                      onClick={() => updateRolePermission(selectedRole, perm.key, !isEnabled)}
                      className={`p-3 rounded-lg border transition-all duration-150 flex justify-between items-center select-none cursor-pointer group ${
                        isEnabled 
                          ? 'bg-[#1e293b]/20 border-slate-800/80 hover:border-slate-700' 
                          : 'bg-[#111827] border-slate-800 opacity-60 hover:opacity-80'
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <span className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                          {perm.label}
                        </span>
                        <p className="text-[10px] text-slate-500 font-mono leading-normal">
                          {perm.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateRolePermission(selectedRole, perm.key, !isEnabled);
                        }}
                        className={`w-10 h-5 rounded-full shrink-0 relative transition-colors focus:outline-none ${
                          isEnabled ? 'bg-blue-600' : 'bg-slate-800'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-transform ${
                          isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {isCreateOpen && (
        <div id="user-create-overlay" className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 w-full max-w-sm space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="font-bold text-slate-200 text-sm">Provision System User</h4>
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
                <label className="text-slate-400 font-bold uppercase block">Full Name *</label>
                <input
                  id="user-input-name"
                  type="text"
                  required
                  placeholder="e.g. Babatunde Alao"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Email Address *</label>
                <input
                  id="user-input-email"
                  type="email"
                  required
                  placeholder="e.g. babatunde@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Initial Access Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-semibold"
                >
                  <option value="agent">Agent Workspace Only</option>
                  <option value="supervisor">Supervisor Analytics</option>
                  <option value="admin">System Administrator</option>
                  <option value="superadmin">Global Superadmin</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Initial Password Pass</label>
                <input
                  type="password"
                  placeholder="Leave blank to auto-generate"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none font-mono"
                />
              </div>

              <button
                id="user-submit-btn"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-center shadow"
              >
                Provision Account
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
