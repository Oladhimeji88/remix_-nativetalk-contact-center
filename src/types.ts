/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Campaign {
  id: string;
  name: string;
  description: string;
  goal: string;
  retryDelay: number; // in minutes
  maxAttempts: number;
  wrapUpTime: number; // in seconds
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'archived';
  contactsCount: number;
  activeAgents: number;
  contactRate: number; // percentage
  createdDate: string;
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  company: string;
  notes: string;
  lastContactDate: string;
  campaignId: string;
  status: 'pending' | 'dialing' | 'connected' | 'no_answer' | 'busy' | 'dnc' | 'callback';
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'supervisor' | 'admin' | 'superadmin';
  status: 'Available' | 'On Call' | 'Wrap-Up' | 'Offline';
  callsMade: number;
  connections: number;
  avgHandleTime: number; // in seconds
  conversionRate: number; // percentage
  avatar: string;
  lastActive: string;
}

export interface Recording {
  id: string;
  date: string;
  caller: string;
  agentName: string;
  duration: number; // in seconds
  campaignName: string;
  disposition: string;
  notes: string;
}

export interface CallTimelineEvent {
  event: 'CHANNEL_CREATE' | 'CHANNEL_ANSWER' | 'CHANNEL_HANGUP' | 'RECORD_STOP';
  timestamp: string;
  duration?: number; // accumulated seconds from start
}

export interface CallLog {
  id: string;
  callTime: string;
  caller: string;
  agentName: string;
  duration: number; // in seconds
  outcome: string;
  recordingStatus: 'Available' | 'Unavailable';
  timeline: CallTimelineEvent[];
}

export interface Extension {
  id: string;
  number: string;
  displayName: string;
  assignedUser: string;
  registrationStatus: 'Registered' | 'Unregistered';
  deviceType: 'Browser WebRTC' | 'SIP Softphone' | 'Desk Phone';
  lastRegistration: string;
}

export interface SIPTrunk {
  id: string;
  name: string;
  host: string;
  username: string;
  transport: 'UDP' | 'TCP' | 'TLS';
  codec: 'G711' | 'G729';
  status: 'Active' | 'Offline';
  activeCalls: number;
  lastRegistration: string;
}

export interface Queue {
  id: string;
  name: string;
  agentCount: number;
  waitingCalls: number;
  avgWaitTime: number; // in seconds
  ringStrategy: 'Round Robin' | 'Longest Idle' | 'Simultaneous';
  timeout: number; // in seconds
  overflowQueueId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'supervisor' | 'admin' | 'superadmin';
  status: 'Active' | 'Inactive';
  lastActive: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface DialerEvent {
  id: string;
  timestamp: string;
  event: 'Dial Started' | 'Call Connected' | 'Call Ended' | 'Disposition Submitted';
  details: string;
}

export interface PermissionConfig {
  dashboard: boolean;
  workspace: boolean;
  queues: boolean;
  supervisor: boolean;
  recordings: boolean;
  campaigns: boolean;
  contacts: boolean;
  dialer: boolean;
  cloudpbx: boolean;
  analytics: boolean;
  logs: boolean;
  users: boolean;
  superadminPlatform: boolean;

  // Key System Actions
  editCampaigns: boolean;
  editContacts: boolean;
  deleteRecordings: boolean;
  deleteUsers: boolean;
  managePBX: boolean;
}

export type RoleType = 'agent' | 'supervisor' | 'admin' | 'superadmin';

export type RolePermissions = Record<RoleType, PermissionConfig>;

