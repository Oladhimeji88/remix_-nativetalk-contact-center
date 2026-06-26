/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  LayoutDashboard, PhoneCall, Users, Radio, Disc, 
  FolderHeart, Network, Phone, Settings, BarChart2, 
  ShieldCheck, Share2, HelpCircle, ChevronLeft, ChevronRight,
  Database, UserCheck, MessageSquareCode, FileText, PhoneForwarded
} from 'lucide-react';

const logoSrc = new URL('../../logo/nativetalksvg.svg', import.meta.url).href;

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  roles: Array<'agent' | 'supervisor' | 'admin' | 'superadmin'>;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export default function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    currentRole, 
    isSidebarCollapsed, 
    toggleSidebar,
    rolePermissions
  } = useStore();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Contact Center': true,
    'Campaigns': true,
    'Cloud PBX': true,
    'Analytics': true,
    'Settings': true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sections: SidebarSection[] = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['agent', 'supervisor', 'admin', 'superadmin'] },
        { id: 'workspace', label: 'Agent Workspace', icon: PhoneCall, roles: ['agent', 'supervisor', 'admin', 'superadmin'] }
      ]
    },
    {
      title: 'Contact Center',
      items: [
        { id: 'queues', label: 'Queues', icon: Users, roles: ['supervisor', 'admin', 'superadmin'] },
        { id: 'supervisor', label: 'Agents Status', icon: UserCheck, roles: ['supervisor', 'admin', 'superadmin'] },
        { id: 'recordings', label: 'Recordings Library', icon: Disc, roles: ['agent', 'supervisor', 'admin', 'superadmin'] }
      ]
    },
    {
      title: 'Campaigns',
      items: [
        { id: 'campaigns', label: 'All Campaigns', icon: FolderHeart, roles: ['supervisor', 'admin', 'superadmin'] },
        { id: 'contacts', label: 'Contacts Database', icon: Database, roles: ['agent', 'supervisor', 'admin', 'superadmin'] },
        { id: 'dialer', label: 'Progressive Dialer', icon: Radio, roles: ['supervisor', 'admin', 'superadmin'] }
      ]
    },
    {
      title: 'Cloud PBX',
      items: [
        { id: 'cloudpbx', label: 'PBX Workspace', icon: Network, roles: ['admin', 'superadmin'] }
      ]
    },
    {
      title: 'Analytics',
      items: [
        { id: 'analytics', label: 'Performance Suite', icon: BarChart2, roles: ['supervisor', 'admin', 'superadmin'] },
        { id: 'logs', label: 'Call Logs (CDR)', icon: FileText, roles: ['agent', 'supervisor', 'admin', 'superadmin'] }
      ]
    },
    {
      title: 'Administration',
      items: [
        { id: 'users', label: 'Users & Roles', icon: ShieldCheck, roles: ['admin', 'superadmin'] }
      ]
    },
    {
      title: 'Platform Management',
      items: [
        { id: 'superadmin-platform', label: 'Tenants & Nodes', icon: Database, roles: ['superadmin'] }
      ]
    }
  ];

  return (
    <aside 
      id="main-sidebar"
      className={`bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between transition-all duration-300 select-none z-30 h-screen ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 relative">
        <div className="flex justify-center">
          <img src={logoSrc} alt="NativeTalk logo" className="w-20 h-20 rounded bg-slate-900 object-contain" />
        </div>
        <button 
          id="sidebar-toggle"
          onClick={toggleSidebar} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-slate-800/50 rounded transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Sidebar Navigation Items */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 custom-scrollbar">
        {sections.map((section) => {
          // Filter items based on dynamic role permissions to check access controls
          const visibleItems = section.items.filter(item => {
            const permKey = item.id === 'superadmin-platform' ? 'superadminPlatform' : item.id;
            if (rolePermissions && rolePermissions[currentRole]) {
              return !!(rolePermissions[currentRole] as any)[permKey];
            }
            return item.roles.includes(currentRole);
          });
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              {/* Section Header */}
              {!isSidebarCollapsed && (
                <div 
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between px-3 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 select-none"
                >
                  <span>{section.title}</span>
                </div>
              )}

              {/* Section Items */}
              <div className="space-y-[2px]">
                {visibleItems.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      id={`sidebar-tab-${item.id}`}
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left text-sm transition-all duration-150 group relative ${
                        isActive 
                          ? 'bg-blue-600/15 text-blue-400 font-medium border-l-2 border-blue-500 pl-[10px]' 
                          : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                      }`}
                      title={isSidebarCollapsed ? item.label : undefined}
                    >
                      <Icon size={16} className={`shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                      
                      {/* Active indicator dot for collapsed view */}
                      {isSidebarCollapsed && isActive && (
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer / Current Workspace Information */}
      <div className="p-3 border-t border-slate-800 bg-[#0F172A] shrink-0 text-xs">
        {!isSidebarCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-mono text-[10px]">VER 2.4.0-PROD</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ONLINE
              </span>
            </div>
            <div className="p-2 rounded bg-slate-800/40 border border-slate-800 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">SIP REGISTER</p>
                <p className="text-[11px] text-slate-200 truncate font-mono">MTN Trunk 1: OK</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        )}
      </div>
    </aside>
  );
}
