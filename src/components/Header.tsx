/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Bell, User, ChevronDown, Shield, RefreshCw, LogOut, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const { 
    currentRole, 
    setRole, 
    currentUser, 
    notifications, 
    markNotificationsAsRead,
    softphoneState
  } = useStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleChange = (role: 'agent' | 'supervisor' | 'admin' | 'superadmin') => {
    setRole(role);
    setIsProfileOpen(false);
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={14} className="text-emerald-500" />;
      case 'warning':
        return <AlertTriangle size={14} className="text-amber-500" />;
      case 'error':
        return <X size={14} className="text-rose-500" />;
      default:
        return <Info size={14} className="text-blue-500" />;
    }
  };

  return (
    <header 
      id="app-header"
      className="bg-[#0F172A]/50 backdrop-blur-md border-b border-slate-800 h-16 px-6 flex items-center justify-between z-20 shrink-0 select-none"
    >
      {/* Search / Context Status bar */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-slate-100 tracking-tight hidden md:block">
          NativeTalk Console
        </h1>
        {softphoneState !== 'Idle' && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            ACTIVE CALL: {softphoneState}
          </div>
        )}
      </div>

      {/* Right control utilities */}
      <div className="flex items-center gap-4 text-sm text-slate-300">
        {/* Nigerian Time Display (WAT - West Africa Time) */}
        <div className="text-xs text-slate-400 font-mono hidden sm:flex flex-col items-end">
          <span className="font-semibold text-slate-300">
            {time.toLocaleTimeString('en-US', { hour12: false })} WAT
          </span>
          <span>Lagos, Nigeria</span>
        </div>

        {/* Quick Role Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/60 p-1.5 rounded border border-slate-700/60">
          <span className="text-[11px] text-slate-400 font-bold uppercase pl-1.5 pr-1 hidden lg:inline">Role:</span>
          <button
            id="role-badge-agent"
            onClick={() => handleRoleChange('agent')}
            className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
              currentRole === 'agent' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            Agent
          </button>
          <button
            id="role-badge-supervisor"
            onClick={() => handleRoleChange('supervisor')}
            className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
              currentRole === 'supervisor' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            Supervisor
          </button>
          <button
            id="role-badge-admin"
            onClick={() => handleRoleChange('admin')}
            className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
              currentRole === 'admin' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin
          </button>
          <button
            id="role-badge-superadmin"
            onClick={() => handleRoleChange('superadmin')}
            className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
              currentRole === 'superadmin' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            Super Admin
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            id="notifications-bell"
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
              if (!isNotifOpen) markNotificationsAsRead();
            }}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded border border-transparent hover:border-slate-700/60 transition-all relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold font-mono">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111827] border border-slate-800 rounded-lg shadow-xl py-2 z-50 text-slate-200 animate-fadeIn">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-xs tracking-wider uppercase text-slate-400">Notifications</span>
                <button 
                  onClick={() => setIsNotifOpen(false)} 
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  Close
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-500">No alerts found</p>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`px-4 py-3 border-b border-slate-800/50 hover:bg-slate-800/30 flex gap-3 ${
                        !notif.read ? 'bg-blue-600/5' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">{getNotifIcon(notif.type)}</div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                        <span className="text-[9px] text-slate-500 font-mono block mt-1">{notif.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info & Dropdown */}
        <div className="relative">
          <button 
            id="profile-dropdown-btn"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 pr-2.5 hover:bg-slate-800/60 rounded border border-transparent hover:border-slate-700/60 transition-all text-left"
          >
            <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm border border-blue-500/30">
              {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'NT'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-200 leading-tight">{currentUser?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide leading-none">{currentUser?.email || 'admin@nativetalk.ng'}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#111827] border border-slate-800 rounded-lg shadow-xl py-1 z-50 text-slate-200 animate-fadeIn">
              <div className="p-3 border-b border-slate-800">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">Access Credentials</span>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <Shield size={12} className="text-emerald-400 shrink-0" />
                  <span className="capitalize font-semibold">{currentRole} account</span>
                </div>
              </div>
              
              <div className="p-1.5 border-b border-slate-800/60 space-y-0.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2.5 py-1">Quick Switch Profile</p>
                <button 
                  onClick={() => handleRoleChange('agent')}
                  className={`w-full flex items-center justify-between text-xs px-2.5 py-1.5 rounded text-left transition-colors ${
                    currentRole === 'agent' ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-slate-800/50 text-slate-400'
                  }`}
                >
                  <span>Agent Workspace</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 rounded text-slate-400">Ext 101</span>
                </button>
                <button 
                  onClick={() => handleRoleChange('supervisor')}
                  className={`w-full flex items-center justify-between text-xs px-2.5 py-1.5 rounded text-left transition-colors ${
                    currentRole === 'supervisor' ? 'bg-purple-600/10 text-purple-400' : 'hover:bg-slate-800/50 text-slate-400'
                  }`}
                >
                  <span>Supervisor Dashboard</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 rounded text-slate-400">Ext 201</span>
                </button>
                <button 
                  onClick={() => handleRoleChange('admin')}
                  className={`w-full flex items-center justify-between text-xs px-2.5 py-1.5 rounded text-left transition-colors ${
                    currentRole === 'admin' ? 'bg-emerald-600/10 text-emerald-400' : 'hover:bg-slate-800/50 text-slate-400'
                  }`}
                >
                  <span>Systems Admin</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 rounded text-slate-400">Global</span>
                </button>
                <button 
                  onClick={() => handleRoleChange('superadmin')}
                  className={`w-full flex items-center justify-between text-xs px-2.5 py-1.5 rounded text-left transition-colors ${
                    currentRole === 'superadmin' ? 'bg-rose-600/10 text-rose-400' : 'hover:bg-slate-800/50 text-slate-400'
                  }`}
                >
                  <span>Super Admin Platform</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 rounded text-slate-400">Infra</span>
                </button>
              </div>

              <div className="p-1">
                <button 
                  id="profile-logout-btn"
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 text-xs px-2.5 py-2 rounded text-left text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={12} />
                  <span>Log Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
