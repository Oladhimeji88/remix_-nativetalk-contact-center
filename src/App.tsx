/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from './store';

// Layout components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Authentication
import LoginScreen from './screens/LoginScreen';

// Core Tab Screens
import Dashboard from './screens/Dashboard';
import AgentWorkspace from './screens/AgentWorkspace';
import CampaignList from './screens/CampaignList';
import CampaignDetail from './screens/CampaignDetail';
import ProgressiveDialer from './screens/ProgressiveDialer';
import SupervisorDashboard from './screens/SupervisorDashboard';
import RecordingsLibrary from './screens/RecordingsLibrary';
import CallLogs from './screens/CallLogs';
import ExtensionsManagement from './screens/ExtensionsManagement';
import SIPTrunksManagement from './screens/SIPTrunksManagement';
import QueuesManagement from './screens/QueuesManagement';
import Analytics from './screens/Analytics';
import UsersRoles from './screens/UsersRoles';
import ContactsManagement from './screens/ContactsManagement';
import CloudPBXScreen from './screens/CloudPBXScreen';
import SuperAdminPlatform from './screens/SuperAdminPlatform';

export default function App() {
  const { currentUser, activeTab, setCurrentUser } = useStore();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // If no user is logged in, show the interactive login screen first
  if (!currentUser || !currentUser.email) {
    return <LoginScreen />;
  }

  // Determine viewport component based on activeTab state
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'workspace':
        return <AgentWorkspace />;
      case 'campaigns':
        return <CampaignList />;
      case 'campaign-detail':
        return <CampaignDetail />;
      case 'dialer':
        return <ProgressiveDialer />;
      case 'supervisor':
        return <SupervisorDashboard />;
      case 'recordings':
        return <RecordingsLibrary />;
      case 'logs':
        return <CallLogs />;
      case 'contacts':
        return <ContactsManagement />;
      case 'cloudpbx':
        return <CloudPBXScreen />;
      case 'superadmin-platform':
        return <SuperAdminPlatform />;
      case 'extensions':
        return <ExtensionsManagement />;
      case 'trunks':
        return <SIPTrunksManagement />;
      case 'queues':
        return <QueuesManagement />;
      case 'analytics':
        return <Analytics />;
      case 'users':
        return <UsersRoles />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div id="layout-app-root" className="min-h-screen bg-[#020617] text-slate-100 flex font-sans select-none overflow-hidden antialiased">
      
      {/* Left Collapsible Persistent Sidebar */}
      <Sidebar />

      {/* Right Column (Header + Viewport Wrapper) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header Controls bar */}
        <Header onLogout={handleLogout} />

        {/* Scrollable Main tab-viewport area */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[#020617] pb-16">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </main>

      </div>

    </div>
  );
}
