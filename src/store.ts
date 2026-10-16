/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { 
  Campaign, Contact, Agent, Recording, CallLog, 
  Extension, SIPTrunk, Queue, User, Notification, DialerEvent, CallTimelineEvent,
  RolePermissions, RoleType, PermissionConfig
} from './types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// SEED DATA: Realistic Nigerian records
const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Lagos Fiber Promo',
    description: 'Outbound campaign targeting SMEs in Ikeja & Lekki for high-speed fiber internet.',
    goal: 'Exceeded 200 subscriptions',
    retryDelay: 5,
    maxAttempts: 3,
    wrapUpTime: 30,
    startDate: '2026-06-01',
    endDate: '2026-07-15',
    status: 'active',
    contactsCount: 150,
    activeAgents: 4,
    contactRate: 64.5,
    createdDate: '2026-05-28'
  },
  {
    id: 'camp-2',
    name: 'Retail Banking Upgrade',
    description: 'Upgrading retail customers to high-yield savings accounts.',
    goal: '1500 accounts upgraded',
    retryDelay: 10,
    maxAttempts: 4,
    wrapUpTime: 20,
    startDate: '2026-06-10',
    endDate: '2026-08-10',
    status: 'active',
    contactsCount: 380,
    activeAgents: 6,
    contactRate: 58.2,
    createdDate: '2026-06-05'
  },
  {
    id: 'camp-3',
    name: 'Solar Power Inverter Leads',
    description: 'Nurturing leads for solar backup power systems in Abuja residential areas.',
    goal: 'Set up 50 consultations',
    retryDelay: 15,
    maxAttempts: 5,
    wrapUpTime: 45,
    startDate: '2026-06-15',
    endDate: '2026-07-30',
    status: 'paused',
    contactsCount: 120,
    activeAgents: 0,
    contactRate: 42.1,
    createdDate: '2026-06-12'
  },
  {
    id: 'camp-4',
    name: 'DStv Premium Retention',
    description: 'Calling lapsed premium subscribers for custom discount offers.',
    goal: '35% winback rate',
    retryDelay: 5,
    maxAttempts: 3,
    wrapUpTime: 15,
    startDate: '2026-05-01',
    endDate: '2026-06-30',
    status: 'active',
    contactsCount: 220,
    activeAgents: 3,
    contactRate: 71.3,
    createdDate: '2026-04-28'
  }
];

const INITIAL_CONTACTS: Contact[] = [
  { id: 'c-1', name: 'Chinedu Okafor', phoneNumber: '+234 803 111 2222', email: 'chinedu.o@lagosbiz.com', company: 'Okafor Enterprises', notes: 'Interested in Lagos Fiber 50Mbps plan. Callback requested.', lastContactDate: '2026-06-23 14:22', campaignId: 'camp-1', status: 'callback' },
  { id: 'c-2', name: 'Olumide Awosika', phoneNumber: '+234 812 333 4444', email: 'olumide@awosikaconsult.ng', company: 'Awosika & Co', notes: 'Busy, call back in the evening.', lastContactDate: '2026-06-24 09:15', campaignId: 'camp-1', status: 'busy' },
  { id: 'c-3', name: 'Funke Adesina', phoneNumber: '+234 705 555 6666', email: 'f.adesina@gmail.com', company: 'Solo Stylist', notes: 'Connected, pitched subscription. Sent invoice.', lastContactDate: '2026-06-24 10:45', campaignId: 'camp-1', status: 'connected' },
  { id: 'c-4', name: 'Blessing Okon', phoneNumber: '+234 909 777 8888', email: 'blessing.okon@calabarfoods.com', company: 'Calabar Delights', notes: 'No answer after 3 attempts.', lastContactDate: '2026-06-23 11:30', campaignId: 'camp-1', status: 'no_answer' },
  { id: 'c-5', name: 'Tunde Balogun', phoneNumber: '+234 802 999 0000', email: 'tbalogun@balogunlogistics.com', company: 'Balogun Logistics', notes: 'Refused offer. Do Not Call requested.', lastContactDate: '2026-06-22 16:00', campaignId: 'camp-1', status: 'dnc' },
  { id: 'c-6', name: 'Amina Yusuf', phoneNumber: '+234 813 444 5555', email: 'amina.yusuf@kandotech.ng', company: 'Kando Tech', notes: 'Pitched fiber internet. Wants custom quote.', lastContactDate: '2026-06-24 11:10', campaignId: 'camp-1', status: 'connected' },
  { id: 'c-7', name: 'Chioma Nwachukwu', phoneNumber: '+234 703 666 7777', email: 'chioma.n@nwachukwufashions.com', company: 'Chioma Fashions', notes: 'Fresh contact. Ready to dial.', lastContactDate: 'Never', campaignId: 'camp-1', status: 'pending' },
  { id: 'c-8', name: 'Ibrahim Bello', phoneNumber: '+234 809 888 9999', email: 'ibello@bellofarms.com', company: 'Bello Agricultural', notes: 'Upgraded savings account to Gold Yield plan.', lastContactDate: '2026-06-24 08:30', campaignId: 'camp-2', status: 'connected' },
  { id: 'c-9', name: 'Yetunde Adebayo', phoneNumber: '+234 815 222 3333', email: 'yetunde.a@gmail.com', company: 'Adebayo Legal', notes: 'No answer. Will retry tomorrow.', lastContactDate: '2026-06-23 17:15', campaignId: 'camp-2', status: 'no_answer' },
  { id: 'c-10', name: 'Abubakar Musa', phoneNumber: '+234 908 444 5555', email: 'abubakar.m@kanotrade.com', company: 'Kano Trade Hub', notes: 'Requested callback on Friday at 2pm.', lastContactDate: '2026-06-24 10:00', campaignId: 'camp-2', status: 'callback' },
  { id: 'c-11', name: 'Nkechi Egwu', phoneNumber: '+234 701 111 4444', email: 'negwu@coalcityretail.com', company: 'Coal City Retail', notes: 'Wrong number provided.', lastContactDate: '2026-06-21 14:00', campaignId: 'camp-2', status: 'dnc' },
  { id: 'c-12', name: 'Efe Omonigho', phoneNumber: '+234 803 555 9999', email: 'efe.omonigho@deltaoil.com', company: 'Omonigho Supply', notes: 'Fresh contact for banking upgrade.', lastContactDate: 'Never', campaignId: 'camp-2', status: 'pending' },
  { id: 'c-13', name: 'Oluwaseun Ajayi', phoneNumber: '+234 811 777 3333', email: 's.ajayi@yabatech.edu.ng', company: 'Yabatech Ventures', notes: 'Interested in Solar backup. Set consultation.', lastContactDate: '2026-06-20 12:45', campaignId: 'camp-3', status: 'callback' },
  { id: 'c-14', name: 'Zainab Dauda', phoneNumber: '+234 902 888 2222', email: 'zainab@daudapharma.com', company: 'Dauda Pharma Ltd', notes: 'Connected, but requested budget review. Call next month.', lastContactDate: '2026-06-19 10:30', campaignId: 'camp-3', status: 'callback' },
  { id: 'c-15', name: 'Obinna Eze', phoneNumber: '+234 805 444 8888', email: 'obinna.eze@ezebuilds.com', company: 'Eze Construction', notes: 'Lapsed DStv customer. Offered 20% discount. Accepted and renewed.', lastContactDate: '2026-06-24 11:45', campaignId: 'camp-4', status: 'connected' }
];

const INITIAL_AGENTS: Agent[] = [
  { id: 'a-1', name: 'Babatunde Alao', email: 'b.alao@nativetalk.ng', role: 'agent', status: 'Available', callsMade: 48, connections: 32, avgHandleTime: 145, conversionRate: 66.7, avatar: 'BA', lastActive: '2 mins ago' },
  { id: 'a-2', name: 'Ngozi Nkemdilim', email: 'n.nkeme@nativetalk.ng', role: 'agent', status: 'On Call', callsMade: 35, connections: 22, avgHandleTime: 180, conversionRate: 62.8, avatar: 'NN', lastActive: 'Just now' },
  { id: 'a-3', name: 'Emeka Nwosu', email: 'e.nwosu@nativetalk.ng', role: 'agent', status: 'Wrap-Up', callsMade: 42, connections: 28, avgHandleTime: 112, conversionRate: 71.4, avatar: 'EN', lastActive: '5 mins ago' },
  { id: 'a-4', name: 'Halima Musa', email: 'h.musa@nativetalk.ng', role: 'agent', status: 'Available', callsMade: 29, connections: 15, avgHandleTime: 210, conversionRate: 51.7, avatar: 'HM', lastActive: '12 mins ago' },
  { id: 'a-5', name: 'Toluwani Ojo', email: 't.ojo@nativetalk.ng', role: 'supervisor', status: 'Available', callsMade: 12, connections: 8, avgHandleTime: 95, conversionRate: 75.0, avatar: 'TO', lastActive: 'Just now' },
  { id: 'a-6', name: 'Kelechi Amadi', email: 'k.amadi@nativetalk.ng', role: 'admin', status: 'Offline', callsMade: 0, connections: 0, avgHandleTime: 0, conversionRate: 0, avatar: 'KA', lastActive: '1 day ago' }
];

const INITIAL_RECORDINGS: Recording[] = [
  { id: 'r-1', date: '2026-06-24 11:45', caller: '+234 805 444 8888', agentName: 'Babatunde Alao', duration: 184, campaignName: 'DStv Premium Retention', disposition: 'Answered - Spoke', notes: 'Subscriber renewed on 20% discount program. Explicit authorization provided.' },
  { id: 'r-2', date: '2026-06-24 11:10', caller: '+234 813 444 5555', agentName: 'Ngozi Nkemdilim', duration: 242, campaignName: 'Lagos Fiber Promo', disposition: 'Callback Requested', notes: 'Requested custom price quote for 100Mbps dedicated fiber backup to be emailed.' },
  { id: 'r-3', date: '2026-06-24 10:45', caller: '+234 705 555 6666', agentName: 'Emeka Nwosu', duration: 125, campaignName: 'Lagos Fiber Promo', disposition: 'Answered - Spoke', notes: 'Sent invoice for the standard SME Lite plan.' },
  { id: 'r-4', date: '2026-06-24 08:30', caller: '+234 809 888 9999', agentName: 'Halima Musa', duration: 305, campaignName: 'Retail Banking Upgrade', disposition: 'Answered - Spoke', notes: 'Consent granted for Savings account gold tier upgrade.' },
  { id: 'r-5', date: '2026-06-23 14:22', caller: '+234 803 111 2222', agentName: 'Babatunde Alao', duration: 92, campaignName: 'Lagos Fiber Promo', disposition: 'Callback Requested', notes: 'Called back tomorrow. Asked for technical specifications sheet.' }
];

const INITIAL_CALL_LOGS: CallLog[] = [
  {
    id: 'cdr-1',
    callTime: '2026-06-24 11:45:10',
    caller: '+234 805 444 8888',
    agentName: 'Babatunde Alao',
    duration: 184,
    outcome: 'Answered - Connected',
    recordingStatus: 'Available',
    timeline: [
      { event: 'CHANNEL_CREATE', timestamp: '11:45:10' },
      { event: 'CHANNEL_ANSWER', timestamp: '11:45:15', duration: 5 },
      { event: 'CHANNEL_HANGUP', timestamp: '11:48:14', duration: 179 },
      { event: 'RECORD_STOP', timestamp: '11:48:19', duration: 184 }
    ]
  },
  {
    id: 'cdr-2',
    callTime: '2026-06-24 11:10:05',
    caller: '+234 813 444 5555',
    agentName: 'Ngozi Nkemdilim',
    duration: 242,
    outcome: 'Answered - Connected',
    recordingStatus: 'Available',
    timeline: [
      { event: 'CHANNEL_CREATE', timestamp: '11:10:05' },
      { event: 'CHANNEL_ANSWER', timestamp: '11:10:12', duration: 7 },
      { event: 'CHANNEL_HANGUP', timestamp: '11:14:07', duration: 235 },
      { event: 'RECORD_STOP', timestamp: '11:14:14', duration: 242 }
    ]
  },
  {
    id: 'cdr-3',
    callTime: '2026-06-24 10:55:00',
    caller: '+234 812 333 4444',
    agentName: 'Emeka Nwosu',
    duration: 18,
    outcome: 'Line Busy',
    recordingStatus: 'Unavailable',
    timeline: [
      { event: 'CHANNEL_CREATE', timestamp: '10:55:00' },
      { event: 'CHANNEL_HANGUP', timestamp: '10:55:18', duration: 18 }
    ]
  },
  {
    id: 'cdr-4',
    callTime: '2026-06-24 10:45:20',
    caller: '+234 705 555 6666',
    agentName: 'Emeka Nwosu',
    duration: 125,
    outcome: 'Answered - Connected',
    recordingStatus: 'Available',
    timeline: [
      { event: 'CHANNEL_CREATE', timestamp: '10:45:20' },
      { event: 'CHANNEL_ANSWER', timestamp: '10:45:25', duration: 5 },
      { event: 'CHANNEL_HANGUP', timestamp: '10:47:25', duration: 120 },
      { event: 'RECORD_STOP', timestamp: '10:47:30', duration: 125 }
    ]
  },
  {
    id: 'cdr-5',
    callTime: '2026-06-24 09:30:15',
    caller: '+234 909 777 8888',
    agentName: 'Halima Musa',
    duration: 45,
    outcome: 'No Answer',
    recordingStatus: 'Unavailable',
    timeline: [
      { event: 'CHANNEL_CREATE', timestamp: '09:30:15' },
      { event: 'CHANNEL_HANGUP', timestamp: '09:31:00', duration: 45 }
    ]
  }
];

const INITIAL_EXTENSIONS: Extension[] = [
  { id: 'ext-1', number: '101', displayName: 'Babatunde Alao (Agent)', assignedUser: 'Babatunde Alao', registrationStatus: 'Registered', deviceType: 'Browser WebRTC', lastRegistration: '2026-06-24 08:00' },
  { id: 'ext-2', number: '102', displayName: 'Ngozi Nkemdilim (Agent)', assignedUser: 'Ngozi Nkemdilim', registrationStatus: 'Registered', deviceType: 'Browser WebRTC', lastRegistration: '2026-06-24 08:15' },
  { id: 'ext-3', number: '103', displayName: 'Emeka Nwosu (Agent)', assignedUser: 'Emeka Nwosu', registrationStatus: 'Registered', deviceType: 'SIP Softphone', lastRegistration: '2026-06-24 07:50' },
  { id: 'ext-4', number: '104', displayName: 'Halima Musa (Agent)', assignedUser: 'Halima Musa', registrationStatus: 'Registered', deviceType: 'Desk Phone', lastRegistration: '2026-06-23 09:00' },
  { id: 'ext-5', number: '201', displayName: 'Toluwani Ojo (Supervisor)', assignedUser: 'Toluwani Ojo', registrationStatus: 'Registered', deviceType: 'Browser WebRTC', lastRegistration: '2026-06-24 08:30' }
];

const INITIAL_TRUNKS: SIPTrunk[] = [
  { id: 'trk-1', name: 'MTN Nigeria Trunk 1', host: 'sip.mtn.com.ng', username: 'nt_trunk_mtn01', transport: 'TLS', codec: 'G711', status: 'Active', activeCalls: 8, lastRegistration: 'Just now' },
  { id: 'trk-2', name: 'Airtel Enterprise SIP', host: 'sip.airtel.ng', username: 'nt_airtel_ent', transport: 'UDP', codec: 'G711', status: 'Active', activeCalls: 3, lastRegistration: '2 mins ago' },
  { id: 'trk-3', name: 'Glo Gateway Abuja', host: 'glo.sip.com.ng', username: 'nt_glo_abj', transport: 'TCP', codec: 'G729', status: 'Offline', activeCalls: 0, lastRegistration: '1 hour ago' }
];

const INITIAL_QUEUES: Queue[] = [
  { id: 'q-1', name: 'Sales Support Queue', agentCount: 4, waitingCalls: 2, avgWaitTime: 45, ringStrategy: 'Round Robin', timeout: 30, overflowQueueId: 'q-2' },
  { id: 'q-2', name: 'Billing & Payments Queue', agentCount: 3, waitingCalls: 0, avgWaitTime: 12, ringStrategy: 'Longest Idle', timeout: 45, overflowQueueId: 'q-3' },
  { id: 'q-3', name: 'General Enquiries Queue', agentCount: 5, waitingCalls: 1, avgWaitTime: 58, ringStrategy: 'Simultaneous', timeout: 60 }
];

const INITIAL_USERS: User[] = [
  { id: 'u-1', name: 'Babatunde Alao', email: 'b.alao@nativetalk.ng', role: 'agent', status: 'Active', lastActive: '2 mins ago' },
  { id: 'u-2', name: 'Ngozi Nkemdilim', email: 'n.nkeme@nativetalk.ng', role: 'agent', status: 'Active', lastActive: 'Just now' },
  { id: 'u-3', name: 'Emeka Nwosu', email: 'e.nwosu@nativetalk.ng', role: 'agent', status: 'Active', lastActive: '5 mins ago' },
  { id: 'u-4', name: 'Halima Musa', email: 'h.musa@nativetalk.ng', role: 'agent', status: 'Active', lastActive: '12 mins ago' },
  { id: 'u-5', name: 'Toluwani Ojo', email: 't.ojo@nativetalk.ng', role: 'supervisor', status: 'Active', lastActive: 'Just now' },
  { id: 'u-6', name: 'Kelechi Amadi', email: 'k.amadi@nativetalk.ng', role: 'admin', status: 'Active', lastActive: '1 day ago' },
  { id: 'u-7', name: 'Alhaji Musa', email: 'musa@nativetalk.ng', role: 'superadmin', status: 'Active', lastActive: 'Just now' }
];

export interface Tenant {
  id: string;
  name: string;
  plan: 'Growth' | 'Enterprise' | 'Scale';
  usersCount: number;
  activeCalls: number;
  status: 'Active' | 'Suspended';
}

export interface FSNode {
  id: string;
  name: string;
  ip: string;
  cpu: number;
  memory: number;
  registrations: number;
  activeCalls: number;
  status: 'Online' | 'Offline';
}

const INITIAL_TENANTS: Tenant[] = [
  { id: 't-1', name: 'Dangote Group', plan: 'Enterprise', usersCount: 120, activeCalls: 14, status: 'Active' },
  { id: 't-2', name: 'Access Bank PLC', plan: 'Enterprise', usersCount: 450, activeCalls: 38, status: 'Active' },
  { id: 't-3', name: 'Flutterwave', plan: 'Scale', usersCount: 85, activeCalls: 9, status: 'Active' },
  { id: 't-4', name: 'Paystack Nigeria', plan: 'Growth', usersCount: 40, activeCalls: 4, status: 'Active' },
  { id: 't-5', name: 'Glo Mobile Retail', plan: 'Growth', usersCount: 25, activeCalls: 0, status: 'Suspended' }
];

const INITIAL_NODES: FSNode[] = [
  { id: 'node-1', name: 'fs-core-lagos-01', ip: '10.12.0.11', cpu: 24, memory: 42, registrations: 540, activeCalls: 65, status: 'Online' },
  { id: 'node-2', name: 'fs-core-abuja-02', ip: '10.12.0.12', cpu: 18, memory: 38, registrations: 320, activeCalls: 22, status: 'Online' },
  { id: 'node-3', name: 'fs-edge-ph-03', ip: '10.12.1.20', cpu: 5, memory: 12, registrations: 80, activeCalls: 0, status: 'Online' },
  { id: 'node-4', name: 'fs-backup-temp-04', ip: '10.12.2.14', cpu: 0, memory: 8, registrations: 0, activeCalls: 0, status: 'Offline' }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n-1', title: 'Fiber Promo Milestone', message: 'Lagos Fiber Promo campaign has reached 64% contact rate.', timestamp: '10 mins ago', read: false, type: 'success' },
  { id: 'n-2', title: 'Glo Trunk Offline', message: 'SIP Trunk "Glo Gateway Abuja" lost connection to host glo.sip.com.ng', timestamp: '1 hour ago', read: false, type: 'error' },
  { id: 'n-3', title: 'New Campaign Assigned', message: 'You have been assigned to the Retail Banking Upgrade campaign.', timestamp: '2 hours ago', read: true, type: 'info' }
];

export const DEFAULT_PERMISSIONS: RolePermissions = {
  agent: {
    dashboard: true,
    workspace: true,
    queues: false,
    supervisor: false,
    recordings: true,
    campaigns: false,
    contacts: true,
    dialer: false,
    cloudpbx: false,
    analytics: false,
    logs: true,
    users: false,
    superadminPlatform: false,
    editCampaigns: false,
    editContacts: false,
    deleteRecordings: false,
    deleteUsers: false,
    managePBX: false
  },
  supervisor: {
    dashboard: true,
    workspace: true,
    queues: true,
    supervisor: true,
    recordings: true,
    campaigns: true,
    contacts: true,
    dialer: true,
    cloudpbx: false,
    analytics: true,
    logs: true,
    users: false,
    superadminPlatform: false,
    editCampaigns: true,
    editContacts: true,
    deleteRecordings: false,
    deleteUsers: false,
    managePBX: false
  },
  admin: {
    dashboard: true,
    workspace: true,
    queues: true,
    supervisor: true,
    recordings: true,
    campaigns: true,
    contacts: true,
    dialer: true,
    cloudpbx: true,
    analytics: true,
    logs: true,
    users: true,
    superadminPlatform: false,
    editCampaigns: true,
    editContacts: true,
    deleteRecordings: true,
    deleteUsers: true,
    managePBX: true
  },
  superadmin: {
    dashboard: true,
    workspace: true,
    queues: true,
    supervisor: true,
    recordings: true,
    campaigns: true,
    contacts: true,
    dialer: true,
    cloudpbx: true,
    analytics: true,
    logs: true,
    users: true,
    superadminPlatform: true,
    editCampaigns: true,
    editContacts: true,
    deleteRecordings: true,
    deleteUsers: true,
    managePBX: true
  }
};

interface NativeTalkState {
  // Navigation & User Context
  currentRole: 'agent' | 'supervisor' | 'admin' | 'superadmin';
  currentUser: User;
  activeTab: string; // Left Sidebar Active Tab
  selectedCampaignId: string | null;
  notifications: Notification[];
  isSidebarCollapsed: boolean;
  rolePermissions: RolePermissions;

  // Domain Entities (Zustand state)
  campaigns: Campaign[];
  contacts: Contact[];
  agents: Agent[];
  recordings: Recording[];
  callLogs: CallLog[];
  extensions: Extension[];
  trunks: SIPTrunk[];
  queues: Queue[];
  users: User[];
  tenants: Tenant[];
  infraNodes: FSNode[];

  // Active Dialer simulation
  dialerStatus: 'stopped' | 'running' | 'paused';
  dialerEvents: DialerEvent[];
  queueHealth: {
    waiting: number;
    retry: number;
    callback: number;
  };

  // Agent workspace softphone simulation
  softphoneState: 'Idle' | 'Ringing' | 'Connected' | 'On Hold' | 'Wrap-Up';
  softphoneContact: Contact | null;
  softphoneTimer: number; // in seconds
  softphoneMuted: boolean;
  softphoneOnHold: boolean;
  softphoneRecording: boolean;

  // Actions
  setRole: (role: 'agent' | 'supervisor' | 'admin' | 'superadmin') => void;
  setCurrentUser: (user: User | null) => void;
  setActiveTab: (tab: string) => void;
  setSelectedCampaignId: (id: string | null) => void;
  toggleSidebar: () => void;
  addNotification: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  markNotificationsAsRead: () => void;

  // Campaigns CRUD
  addCampaign: (campaign: Omit<Campaign, 'id' | 'contactsCount' | 'activeAgents' | 'contactRate' | 'createdDate'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  toggleCampaignStatus: (id: string) => void;

  // Contacts CRUD
  addContact: (contact: Omit<Contact, 'id'>) => void;
  importContacts: (contacts: Omit<Contact, 'id'>[]) => void;
  deleteContact: (id: string) => void;
  updateContactStatus: (id: string, status: Contact['status'], notes?: string) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;

  // Agents CRUD
  addAgent: (agent: Omit<Agent, 'id' | 'callsMade' | 'connections' | 'avgHandleTime' | 'conversionRate'>) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  setAgentStatus: (id: string, status: Agent['status']) => void;

  // Recordings CRUD
  addRecording: (recording: Omit<Recording, 'id'>) => void;
  deleteRecording: (id: string) => void;

  // Extensions CRUD
  addExtension: (ext: Omit<Extension, 'id' | 'registrationStatus' | 'lastRegistration'>) => void;
  updateExtension: (id: string, updates: Partial<Extension>) => void;
  deleteExtension: (id: string) => void;
  toggleExtensionStatus: (id: string) => void;

  // SIP Trunks CRUD
  addTrunk: (trunk: Omit<SIPTrunk, 'id' | 'status' | 'activeCalls' | 'lastRegistration'>) => void;
  updateTrunk: (id: string, updates: Partial<SIPTrunk>) => void;
  deleteTrunk: (id: string) => void;
  toggleTrunkStatus: (id: string) => void;

  // Queues CRUD
  addQueue: (queue: Omit<Queue, 'id' | 'agentCount' | 'waitingCalls' | 'avgWaitTime'>) => void;
  updateQueue: (id: string, updates: Partial<Queue>) => void;
  deleteQueue: (id: string) => void;

  // Users CRUD
  addUser: (user: Omit<User, 'id' | 'lastActive'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Permissions Settings
  updateRolePermission: (role: RoleType, permissionKey: keyof PermissionConfig, value: boolean) => void;

  // Softphone Actions
  triggerIncomingCall: (contact: Contact) => void;
  triggerOutgoingCall: (contact: Contact) => void;
  answerCall: () => void;
  holdCall: () => void;
  muteCall: () => void;
  hangUpCall: () => void;
  submitDisposition: (status: Contact['status'], notes: string, callbackDate?: string) => void;
  incrementSoftphoneTimer: () => void;

  // Dialer simulation actions
  startDialer: () => void;
  stopDialer: () => void;
  pauseDialer: () => void;
  addDialerEvent: (event: DialerEvent['event'], details: string) => void;
  simulateDialerActivity: () => void;
}

export const useStore = create<NativeTalkState>((set, get) => {
  // Load state from local storage if available
  const getSavedState = () => {
    try {
      const saved = localStorage.getItem('nativetalk_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
    return null;
  };

  const savedState = getSavedState();

  const syncLocalStorage = (newState: Partial<NativeTalkState>) => {
    try {
      const current = get();
      const updated = { ...current, ...newState };
      // Save data-heavy arrays and settings, avoid keeping intervals
      const stateToSave = {
        currentRole: updated.currentRole,
        currentUser: updated.currentUser,
        activeTab: updated.activeTab,
        selectedCampaignId: updated.selectedCampaignId,
        isSidebarCollapsed: updated.isSidebarCollapsed,
        campaigns: updated.campaigns,
        contacts: updated.contacts,
        agents: updated.agents,
        recordings: updated.recordings,
        callLogs: updated.callLogs,
        extensions: updated.extensions,
        trunks: updated.trunks,
        queues: updated.queues,
        users: updated.users,
        notifications: updated.notifications,
        queueHealth: updated.queueHealth,
        softphoneState: updated.softphoneState,
        softphoneContact: updated.softphoneContact,
        tenants: updated.tenants,
        infraNodes: updated.infraNodes,
        rolePermissions: updated.rolePermissions
      };
      localStorage.setItem('nativetalk_state', JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  };

  return {
    // Initial State values
    currentRole: savedState?.currentRole || 'admin',
    currentUser: savedState?.currentUser || INITIAL_USERS[5], // Kelechi Amadi (Admin) on load
    activeTab: savedState?.activeTab || 'dashboard',
    selectedCampaignId: savedState?.selectedCampaignId || null,
    isSidebarCollapsed: savedState?.isSidebarCollapsed || false,
    notifications: savedState?.notifications || INITIAL_NOTIFICATIONS,
    rolePermissions: savedState?.rolePermissions || DEFAULT_PERMISSIONS,

    campaigns: savedState?.campaigns || INITIAL_CAMPAIGNS,
    contacts: savedState?.contacts || INITIAL_CONTACTS,
    agents: savedState?.agents || INITIAL_AGENTS,
    recordings: savedState?.recordings || INITIAL_RECORDINGS,
    callLogs: savedState?.callLogs || INITIAL_CALL_LOGS,
    extensions: savedState?.extensions || INITIAL_EXTENSIONS,
    trunks: savedState?.trunks || INITIAL_TRUNKS,
    queues: savedState?.queues || INITIAL_QUEUES,
    users: savedState?.users || INITIAL_USERS,
    tenants: savedState?.tenants || INITIAL_TENANTS,
    infraNodes: savedState?.infraNodes || INITIAL_NODES,

    dialerStatus: 'stopped',
    dialerEvents: [
      { id: '1', timestamp: '11:45:10', event: 'Dial Started', details: 'Dialing customer Chinedu Okafor (+234 803 111 2222)' },
      { id: '2', timestamp: '11:45:15', event: 'Call Connected', details: 'Connected with Chinedu Okafor. Routed to agent Babatunde Alao.' },
      { id: '3', timestamp: '11:48:14', event: 'Call Ended', details: 'Call ended with Chinedu Okafor. Duration: 179s.' },
      { id: '4', timestamp: '11:48:22', event: 'Disposition Submitted', details: 'Agent Babatunde Alao submitted disposition: Callback Requested.' }
    ],
    queueHealth: savedState?.queueHealth || {
      waiting: 4,
      retry: 8,
      callback: 12
    },

    softphoneState: savedState?.softphoneState || 'Idle',
    softphoneContact: savedState?.softphoneContact || null,
    softphoneTimer: 0,
    softphoneMuted: false,
    softphoneOnHold: false,
    softphoneRecording: false,

    // Core Actions
    setRole: (role) => {
      const targetUser = get().users.find(u => u.role === role) || get().users[get().users.length - 1]; // Fallback to last user (Musa for superadmin)
      set({ currentRole: role, currentUser: targetUser });
      // Change sidebar defaults based on roles to be helper
      if (role === 'agent') {
        set({ activeTab: 'workspace' });
      } else if (role === 'supervisor') {
        set({ activeTab: 'dashboard' });
      } else {
        set({ activeTab: 'dashboard' });
      }
      syncLocalStorage({ currentRole: role, currentUser: targetUser });
    },
    setCurrentUser: (user) => {
      set({ currentUser: user || undefined });
      if (user) {
        set({ currentRole: user.role });
        // Set default tabs
        if (user.role === 'agent') {
          set({ activeTab: 'workspace' });
        } else {
          set({ activeTab: 'dashboard' });
        }
      }
      syncLocalStorage({ currentUser: user || undefined });
    },
    setActiveTab: (tab) => {
      set({ activeTab: tab });
      syncLocalStorage({ activeTab: tab });
    },
    setSelectedCampaignId: (id) => {
      set({ selectedCampaignId: id });
      syncLocalStorage({ selectedCampaignId: id });
    },
    toggleSidebar: () => {
      set((state) => {
        const collapsed = !state.isSidebarCollapsed;
        syncLocalStorage({ isSidebarCollapsed: collapsed });
        return { isSidebarCollapsed: collapsed };
      });
    },
    addNotification: (title, message, type) => {
      const newNotif: Notification = {
        id: generateId(),
        title,
        message,
        timestamp: 'Just now',
        read: false,
        type
      };
      set((state) => {
        const updatedNotifs = [newNotif, ...state.notifications];
        syncLocalStorage({ notifications: updatedNotifs });
        return { notifications: updatedNotifs };
      });
    },
    markNotificationsAsRead: () => {
      set((state) => {
        const readNotifs = state.notifications.map(n => ({ ...n, read: true }));
        syncLocalStorage({ notifications: readNotifs });
        return { notifications: readNotifs };
      });
    },

    // Campaigns CRUD
    addCampaign: (camp) => {
      const newCamp: Campaign = {
        ...camp,
        id: 'camp-' + generateId(),
        contactsCount: 0,
        activeAgents: 0,
        contactRate: 0,
        createdDate: new Date().toISOString().split('T')[0]
      };
      set((state) => {
        const updated = [...state.campaigns, newCamp];
        syncLocalStorage({ campaigns: updated });
        return { campaigns: updated };
      });
      get().addNotification('Campaign Created', `Campaign "${newCamp.name}" was successfully launched.`, 'success');
    },
    updateCampaign: (id, updates) => {
      set((state) => {
        const updated = state.campaigns.map(c => c.id === id ? { ...c, ...updates } : c);
        syncLocalStorage({ campaigns: updated });
        return { campaigns: updated };
      });
      get().addNotification('Campaign Updated', 'Campaign configurations saved successfully.', 'info');
    },
    deleteCampaign: (id) => {
      set((state) => {
        const updated = state.campaigns.filter(c => c.id !== id);
        syncLocalStorage({ campaigns: updated });
        return { campaigns: updated };
      });
      get().addNotification('Campaign Removed', 'The campaign has been removed or archived.', 'warning');
    },
    toggleCampaignStatus: (id) => {
      set((state) => {
        const updated = state.campaigns.map(c => {
          if (c.id === id) {
            const nextStatus = c.status === 'active' ? 'paused' : 'active';
            get().addNotification(
              `Campaign ${nextStatus === 'active' ? 'Resumed' : 'Paused'}`,
              `Campaign "${c.name}" status updated.`,
              nextStatus === 'active' ? 'success' : 'warning'
            );
            return { ...c, status: nextStatus as 'active' | 'paused' };
          }
          return c;
        });
        syncLocalStorage({ campaigns: updated });
        return { campaigns: updated };
      });
    },

    // Contacts CRUD
    addContact: (contact) => {
      const newContact: Contact = {
        ...contact,
        id: 'c-' + generateId()
      };
      set((state) => {
        const updated = [newContact, ...state.contacts];
        // Increment campaigns count
        const updatedCamps = state.campaigns.map(c => 
          c.id === contact.campaignId ? { ...c, contactsCount: c.contactsCount + 1 } : c
        );
        syncLocalStorage({ contacts: updated, campaigns: updatedCamps });
        return { contacts: updated, campaigns: updatedCamps };
      });
    },
    importContacts: (contactsList) => {
      const formatted = contactsList.map(c => ({
        ...c,
        id: 'c-' + generateId()
      }));
      set((state) => {
        const updated = [...formatted, ...state.contacts];
        // Update relevant campaign counts
        const updatedCamps = state.campaigns.map(c => {
          const addedCount = formatted.filter(fc => fc.campaignId === c.id).length;
          return addedCount > 0 ? { ...c, contactsCount: c.contactsCount + addedCount } : c;
        });
        syncLocalStorage({ contacts: updated, campaigns: updatedCamps });
        return { contacts: updated, campaigns: updatedCamps };
      });
      get().addNotification('Import Success', `${contactsList.length} contacts imported successfully.`, 'success');
    },
    deleteContact: (id) => {
      set((state) => {
        const contact = state.contacts.find(c => c.id === id);
        const updated = state.contacts.filter(c => c.id !== id);
        const updatedCamps = state.campaigns.map(c => 
          contact && c.id === contact.campaignId ? { ...c, contactsCount: Math.max(0, c.contactsCount - 1) } : c
        );
        syncLocalStorage({ contacts: updated, campaigns: updatedCamps });
        return { contacts: updated, campaigns: updatedCamps };
      });
    },
    updateContactStatus: (id, status, notes) => {
      set((state) => {
        const updated = state.contacts.map(c => 
          c.id === id ? { 
            ...c, 
            status, 
            notes: notes ? notes : c.notes, 
            lastContactDate: new Date().toISOString().replace('T', ' ').substring(0, 16) 
          } : c
        );
        syncLocalStorage({ contacts: updated });
        return { contacts: updated };
      });
    },
    updateContact: (id, updates) => {
      set((state) => {
        const updated = state.contacts.map(c => 
          c.id === id ? { ...c, ...updates } : c
        );
        syncLocalStorage({ contacts: updated });
        return { contacts: updated };
      });
    },

    // Agents CRUD
    addAgent: (agent) => {
      const newAgent: Agent = {
        ...agent,
        id: 'a-' + generateId(),
        callsMade: 0,
        connections: 0,
        avgHandleTime: 0,
        conversionRate: 0
      };
      set((state) => {
        const updated = [...state.agents, newAgent];
        syncLocalStorage({ agents: updated });
        return { agents: updated };
      });
      get().addNotification('Agent Created', `${newAgent.name} has been provisioned.`, 'success');
    },
    updateAgent: (id, updates) => {
      set((state) => {
        const updated = state.agents.map(a => a.id === id ? { ...a, ...updates } : a);
        syncLocalStorage({ agents: updated });
        return { agents: updated };
      });
    },
    deleteAgent: (id) => {
      set((state) => {
        const updated = state.agents.filter(a => a.id !== id);
        syncLocalStorage({ agents: updated });
        return { agents: updated };
      });
      get().addNotification('Agent Deactivated', 'Agent record deactivated and removed.', 'warning');
    },
    setAgentStatus: (id, status) => {
      set((state) => {
        const updated = state.agents.map(a => a.id === id ? { ...a, status, lastActive: 'Just now' } : a);
        syncLocalStorage({ agents: updated });
        return { agents: updated };
      });
    },

    // Recordings CRUD
    addRecording: (rec) => {
      const newRec: Recording = {
        ...rec,
        id: 'r-' + generateId()
      };
      set((state) => {
        const updated = [newRec, ...state.recordings];
        syncLocalStorage({ recordings: updated });
        return { recordings: updated };
      });
    },
    deleteRecording: (id) => {
      set((state) => {
        const updated = state.recordings.filter(r => r.id !== id);
        syncLocalStorage({ recordings: updated });
        return { recordings: updated };
      });
      get().addNotification('Recording Deleted', 'Call recording purged from secure server.', 'warning');
    },

    // Extensions CRUD
    addExtension: (ext) => {
      const newExt: Extension = {
        ...ext,
        id: 'ext-' + generateId(),
        registrationStatus: 'Registered',
        lastRegistration: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      set((state) => {
        const updated = [...state.extensions, newExt];
        syncLocalStorage({ extensions: updated });
        return { extensions: updated };
      });
      get().addNotification('Extension Provisioned', `SIP extension ${newExt.number} created.`, 'success');
    },
    updateExtension: (id, updates) => {
      set((state) => {
        const updated = state.extensions.map(e => e.id === id ? { ...e, ...updates } : e);
        syncLocalStorage({ extensions: updated });
        return { extensions: updated };
      });
    },
    deleteExtension: (id) => {
      set((state) => {
        const updated = state.extensions.filter(e => e.id !== id);
        syncLocalStorage({ extensions: updated });
        return { extensions: updated };
      });
      get().addNotification('Extension Disabled', 'Extension disabled and deleted.', 'warning');
    },
    toggleExtensionStatus: (id) => {
      set((state) => {
        const updated = state.extensions.map(e => {
          if (e.id === id) {
            const nextStatus = e.registrationStatus === 'Registered' ? 'Unregistered' : 'Registered';
            return { ...e, registrationStatus: nextStatus as 'Registered' | 'Unregistered' };
          }
          return e;
        });
        syncLocalStorage({ extensions: updated });
        return { extensions: updated };
      });
    },

    // SIP Trunks CRUD
    addTrunk: (trunk) => {
      const newTrunk: SIPTrunk = {
        ...trunk,
        id: 'trk-' + generateId(),
        status: 'Active',
        activeCalls: 0,
        lastRegistration: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      set((state) => {
        const updated = [...state.trunks, newTrunk];
        syncLocalStorage({ trunks: updated });
        return { trunks: updated };
      });
      get().addNotification('Trunk Added', `SIP trunk ${newTrunk.name} configured successfully.`, 'success');
    },
    updateTrunk: (id, updates) => {
      set((state) => {
        const updated = state.trunks.map(t => t.id === id ? { ...t, ...updates } : t);
        syncLocalStorage({ trunks: updated });
        return { trunks: updated };
      });
    },
    deleteTrunk: (id) => {
      set((state) => {
        const updated = state.trunks.filter(t => t.id !== id);
        syncLocalStorage({ trunks: updated });
        return { trunks: updated };
      });
      get().addNotification('Trunk Deleted', 'SIP trunk deleted from gateway config.', 'warning');
    },
    toggleTrunkStatus: (id) => {
      set((state) => {
        const updated = state.trunks.map(t => {
          if (t.id === id) {
            const nextStatus = t.status === 'Active' ? 'Offline' : 'Active';
            return { ...t, status: nextStatus as 'Active' | 'Offline' };
          }
          return t;
        });
        syncLocalStorage({ trunks: updated });
        return { trunks: updated };
      });
    },

    // Queues CRUD
    addQueue: (queue) => {
      const newQueue: Queue = {
        ...queue,
        id: 'q-' + generateId(),
        agentCount: 0,
        waitingCalls: 0,
        avgWaitTime: 0
      };
      set((state) => {
        const updated = [...state.queues, newQueue];
        syncLocalStorage({ queues: updated });
        return { queues: updated };
      });
      get().addNotification('Queue Configured', `Queue ${newQueue.name} configured.`, 'success');
    },
    updateQueue: (id, updates) => {
      set((state) => {
        const updated = state.queues.map(q => q.id === id ? { ...q, ...updates } : q);
        syncLocalStorage({ queues: updated });
        return { queues: updated };
      });
    },
    deleteQueue: (id) => {
      set((state) => {
        const updated = state.queues.filter(q => q.id !== id);
        syncLocalStorage({ queues: updated });
        return { queues: updated };
      });
      get().addNotification('Queue Removed', 'The queue has been deleted.', 'warning');
    },

    // Users CRUD
    addUser: (user) => {
      const newUser: User = {
        ...user,
        id: 'u-' + generateId(),
        lastActive: 'Never'
      };
      set((state) => {
        const updated = [...state.users, newUser];
        syncLocalStorage({ users: updated });
        return { users: updated };
      });
      get().addNotification('User Provisioned', `New ${newUser.role} user created: ${newUser.name}`, 'success');
    },
    updateUser: (id, updates) => {
      set((state) => {
        const updated = state.users.map(u => u.id === id ? { ...u, ...updates } : u);
        syncLocalStorage({ users: updated });
        return { users: updated };
      });
    },
    deleteUser: (id) => {
      set((state) => {
        const updated = state.users.filter(u => u.id !== id);
        syncLocalStorage({ users: updated });
        return { users: updated };
      });
      get().addNotification('User Removed', 'User profile deactivated and removed.', 'warning');
    },

    updateRolePermission: (role, permissionKey, value) => {
      set((state) => {
        const updatedPermissions = {
          ...state.rolePermissions,
          [role]: {
            ...state.rolePermissions[role],
            [permissionKey]: value
          }
        };
        syncLocalStorage({ rolePermissions: updatedPermissions });
        return { rolePermissions: updatedPermissions };
      });
      get().addNotification(
        'Permissions Updated',
        `Adjusted ${permissionKey} permission for ${role} role.`,
        'success'
      );
    },

    // Softphone actions (Simulating full State Machine)
    triggerIncomingCall: (contact) => {
      set({
        softphoneState: 'Ringing',
        softphoneContact: contact,
        softphoneTimer: 0,
        softphoneOnHold: false,
        softphoneMuted: false,
        softphoneRecording: false
      });
      get().addNotification('Incoming Call', `Incoming call from ${contact.name} (${contact.phoneNumber})`, 'info');
    },
    triggerOutgoingCall: (contact) => {
      set({
        softphoneState: 'Ringing',
        softphoneContact: contact,
        softphoneTimer: 0,
        softphoneOnHold: false,
        softphoneMuted: false,
        softphoneRecording: true // auto record outgoing for safety
      });
    },
    answerCall: () => {
      set({
        softphoneState: 'Connected',
        softphoneTimer: 0,
        softphoneRecording: true
      });
      // Update Agent state
      const agent = get().agents.find(a => a.role === 'agent');
      if (agent) {
        get().updateAgent(agent.id, { status: 'On Call' });
      }
    },
    holdCall: () => {
      set((state) => {
        const nextHold = !state.softphoneOnHold;
        return {
          softphoneOnHold: nextHold,
          softphoneState: nextHold ? 'On Hold' : 'Connected'
        };
      });
    },
    muteCall: () => {
      set((state) => ({ softphoneMuted: !state.softphoneMuted }));
    },
    hangUpCall: () => {
      set({
        softphoneState: 'Wrap-Up',
        softphoneOnHold: false
      });
      // Update Agent state
      const agent = get().agents.find(a => a.role === 'agent');
      if (agent) {
        get().updateAgent(agent.id, { status: 'Wrap-Up' });
      }
    },
    submitDisposition: (status, notes, callbackDate) => {
      const contact = get().softphoneContact;
      if (!contact) return;

      // 1. Update contact status and notes
      get().updateContactStatus(contact.id, status, notes);

      // 2. Add to logs
      const duration = get().softphoneTimer;
      const outcomeLabel = {
        'connected': 'Answered - Spoke',
        'no_answer': 'No Answer',
        'busy': 'Line Busy',
        'dnc': 'Do Not Call Request',
        'callback': `Callback Requested (${callbackDate || 'soon'})`,
        'pending': 'Unreached',
        'dialing': 'Failed Connect'
      }[status] || 'Unknown Outcome';

      const logId = 'cdr-' + generateId();
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newLog: CallLog = {
        id: logId,
        callTime: timestamp,
        caller: contact.phoneNumber,
        agentName: get().currentUser.name,
        duration,
        outcome: outcomeLabel,
        recordingStatus: duration > 10 ? 'Available' : 'Unavailable',
        timeline: [
          { event: 'CHANNEL_CREATE', timestamp: timestamp.substring(11, 19) },
          { event: 'CHANNEL_ANSWER', timestamp: timestamp.substring(11, 19), duration: 4 },
          { event: 'CHANNEL_HANGUP', timestamp: timestamp.substring(11, 19), duration: duration + 4 },
          ...(duration > 10 ? [{ event: 'RECORD_STOP', timestamp: timestamp.substring(11, 19), duration: duration + 6 } as CallTimelineEvent] : [])
        ]
      };

      // Add call log
      set((state) => ({ callLogs: [newLog, ...state.callLogs] }));

      // 3. Add to recordings if duration > 10
      if (duration > 10) {
        get().addRecording({
          date: timestamp.substring(0, 16),
          caller: contact.phoneNumber,
          agentName: get().currentUser.name,
          duration,
          campaignName: 'Lagos Fiber Promo',
          disposition: outcomeLabel,
          notes: notes
        });
      }

      // 4. Update Agent stats
      const agent = get().agents.find(a => a.name === get().currentUser.name);
      if (agent) {
        const nextCalls = agent.callsMade + 1;
        const nextConn = status === 'connected' ? agent.connections + 1 : agent.connections;
        const nextAHT = Math.round((agent.avgHandleTime * agent.callsMade + duration) / nextCalls);
        const nextConv = Math.round((nextConn / nextCalls) * 100);
        get().updateAgent(agent.id, {
          callsMade: nextCalls,
          connections: nextConn,
          avgHandleTime: nextAHT,
          conversionRate: nextConv,
          status: 'Available'
        });
      }

      // 5. Reset Softphone
      set({
        softphoneState: 'Idle',
        softphoneContact: null,
        softphoneTimer: 0,
        softphoneOnHold: false,
        softphoneMuted: false,
        softphoneRecording: false
      });

      get().addNotification('Disposition Saved', `Call record saved for ${contact.name}.`, 'success');
    },
    incrementSoftphoneTimer: () => {
      set((state) => ({ softphoneTimer: state.softphoneTimer + 1 }));
    },

    // Progressive Dialer Simulation
    startDialer: () => {
      set({ dialerStatus: 'running' });
      get().addDialerEvent('Dial Started', 'Dialer starting up...');
      get().addNotification('Dialer Started', 'Autodialer is active on "Lagos Fiber Promo" campaign.', 'success');
    },
    stopDialer: () => {
      set({ dialerStatus: 'stopped' });
      get().addDialerEvent('Dial Started', 'Dialer stopped manually.');
      get().addNotification('Dialer Stopped', 'Autodialer has been turned off.', 'warning');
    },
    pauseDialer: () => {
      set({ dialerStatus: 'paused' });
      get().addDialerEvent('Dial Started', 'Dialer paused.');
      get().addNotification('Dialer Paused', 'Autodialer paused.', 'info');
    },
    addDialerEvent: (event, details) => {
      const newEvent: DialerEvent = {
        id: generateId(),
        timestamp: new Date().toLocaleTimeString(),
        event,
        details
      };
      set((state) => ({ dialerEvents: [newEvent, ...state.dialerEvents].slice(0, 30) }));
    },
    simulateDialerActivity: () => {
      const { dialerStatus, contacts, campaigns } = get();
      if (dialerStatus !== 'running') return;

      // Randomly select a pending contact
      const pending = contacts.filter(c => c.status === 'pending');
      if (pending.length === 0) {
        get().addDialerEvent('Dial Started', 'All campaign contacts dialed. Dialer idling.');
        set({ dialerStatus: 'paused' });
        return;
      }

      const randomContact = pending[Math.floor(Math.random() * pending.length)];
      const outcomes: Array<Contact['status']> = ['connected', 'connected', 'no_answer', 'busy', 'callback'];
      const chosenOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];

      const currentTime = new Date().toLocaleTimeString();

      // Trigger Dialer Sequence
      get().addDialerEvent('Dial Started', `System placing call to ${randomContact.name} (${randomContact.phoneNumber})`);
      
      setTimeout(() => {
        if (get().dialerStatus !== 'running') return;
        
        if (chosenOutcome === 'connected') {
          get().addDialerEvent('Call Connected', `Connected with ${randomContact.name}. Audio channel routed to queue agents.`);
          // update contact state
          get().updateContactStatus(randomContact.id, 'connected', 'Simulated progressive auto-pitch.');
          
          // Randomly assign to a live agent in store to simulate work
          const liveAgents = get().agents.filter(a => a.status === 'Available');
          if (liveAgents.length > 0) {
            const chosenAgent = liveAgents[0];
            get().updateAgent(chosenAgent.id, { status: 'On Call' });
            get().addDialerEvent('Disposition Submitted', `Routed to ${chosenAgent.name}. Disposition pending.`);
            
            // Release agent after brief moment
            setTimeout(() => {
              get().updateAgent(chosenAgent.id, { status: 'Wrap-Up' });
              setTimeout(() => {
                get().updateAgent(chosenAgent.id, { status: 'Available' });
              }, 4000);
            }, 6000);
          }
        } else if (chosenOutcome === 'no_answer') {
          get().addDialerEvent('Call Connected', `No Answer from ${randomContact.name}. Timeout after 30s.`);
          get().updateContactStatus(randomContact.id, 'no_answer');
        } else if (chosenOutcome === 'busy') {
          get().addDialerEvent('Call Connected', `Line Busy for ${randomContact.name}. Added to retry queue.`);
          get().updateContactStatus(randomContact.id, 'busy');
          set((state) => ({
            queueHealth: {
              ...state.queueHealth,
              retry: state.queueHealth.retry + 1
            }
          }));
        } else {
          get().addDialerEvent('Call Connected', `${randomContact.name} requested callback later.`);
          get().updateContactStatus(randomContact.id, 'callback');
          set((state) => ({
            queueHealth: {
              ...state.queueHealth,
              callback: state.queueHealth.callback + 1
            }
          }));
        }
      }, 2000);
    }
  };
});
