import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  UserCheck,
  Check,
  X,
  FileCheck2,
  List,
  UserPlus,
  Building2,
  AlertCircle,
  RefreshCw,
  UserX,
  Laptop,
  Globe,
  Plus,
  CheckCircle2,
  ShieldAlert,
  Trash2,
  Database,
  Search,
} from 'lucide-react';
import { UserRole, AuditLog, User, LawFirm, UserSession } from '../types';
import { mockUsers, mockFirms } from '../data/mockData';
import { mockSessionsStore, mockAuditLogsStore, validatePasswordPolicy } from '../lib/authEngine';

interface SecurityViewProps {
  auditLogs?: AuditLog[];
  currentUser?: User | null;
  users?: User[];
  firms?: LawFirm[];
  onUserUpdate?: (updatedUser: User) => void;
  onFirmUpdate?: (updatedFirm: LawFirm) => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({
  auditLogs = mockAuditLogsStore,
  currentUser,
  users = mockUsers,
  firms = mockFirms,
  onUserUpdate,
  onFirmUpdate,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'users' | 'firms' | 'sessions' | 'audit'>('users');

  // Local State
  const [usersList, setUsersList] = useState<User[]>(users);
  const [firmsList, setFirmsList] = useState<LawFirm[]>(firms);

  React.useEffect(() => {
    if (users && users.length > 0) {
      setUsersList(users);
    }
  }, [users]);

  React.useEffect(() => {
    if (firms && firms.length > 0) {
      setFirmsList(firms);
    }
  }, [firms]);
  const [sessionsList, setSessionsList] = useState<UserSession[]>(mockSessionsStore);
  const [logsList, setLogsList] = useState<AuditLog[]>(auditLogs);

  // Search & Filters
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Deleted' | 'Suspended'>('All');

  // New Law Firm Modal
  const [showCreateFirmModal, setShowCreateFirmModal] = useState(false);
  const [newFirmName, setNewFirmName] = useState('');
  const [newFirmCode, setNewFirmCode] = useState('');
  const [newFirmPlan, setNewFirmPlan] = useState<'Enterprise Unlimited' | 'Partner Suite' | 'Standard Firm'>('Enterprise Unlimited');

  // New User Creation Modal
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('LawyerDesk@2026');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Senior Advocate');
  const [newUserPhone, setNewUserPhone] = useState('+91 98110 00000');
  const [newUserBarReg, setNewUserBarReg] = useState('');
  const [newUserFirmId, setNewUserFirmId] = useState(mockFirms[0]?.id || 'firm-1');

  // Password Reset Modal
  const [resetModalUser, setResetModalUser] = useState<User | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Creation Messages
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const rolesList: UserRole[] = [
    'System Owner',
    'System Administrator',
    'Demo User',
    'Law Firm',
    'Senior Advocate',
    'Associate Advocate',
    'Junior Advocate',
    'Accounts Staff',
    'Office Staff',
    'Reception',
    'Client Portal User',
  ];

  const permissionsList = [
    { key: 'all_access', label: 'All Platform Admin Controls' },
    { key: 'manage_firms', label: 'Create & Manage Law Firms' },
    { key: 'create_advocate', label: 'Provision Advocates & Staff' },
    { key: 'matter_read', label: 'View Case Files & Pleadings' },
    { key: 'matter_write', label: 'Edit Matters & Upload Documents' },
    { key: 'ai_copilot', label: 'Grounded AI Search & RAG' },
    { key: 'drafting', label: 'AI Legal Drafting Studio' },
    { key: 'billing_view', label: 'View Invoices & Billing Stats' },
    { key: 'firm_manage', label: 'Law Firm Branch & User Admin' },
  ];

  // RBAC Matrix State
  const [matrix, setMatrix] = useState<Record<UserRole, string[]>>({
    'System Owner': ['all_access', 'manage_firms', 'create_advocate', 'matter_read', 'matter_write', 'ai_copilot', 'drafting', 'billing_view', 'firm_manage'],
    'System Administrator': ['all_access', 'manage_firms', 'create_advocate', 'matter_read', 'matter_write', 'ai_copilot', 'drafting', 'billing_view', 'firm_manage'],
    'Super Admin': ['all_access', 'manage_firms', 'create_advocate', 'matter_read', 'matter_write', 'ai_copilot', 'drafting', 'billing_view', 'firm_manage'],
    'Demo User': ['matter_read', 'ai_copilot'],
    'Law Firm': ['matter_read', 'matter_write', 'ai_copilot', 'drafting', 'billing_view', 'firm_manage'],
    'Firm Admin': ['matter_read', 'matter_write', 'ai_copilot', 'drafting', 'billing_view', 'firm_manage'],
    'Senior Advocate': ['matter_read', 'matter_write', 'ai_copilot', 'drafting', 'billing_view'],
    'Senior Lawyer': ['matter_read', 'matter_write', 'ai_copilot', 'drafting', 'billing_view'],
    'Associate Advocate': ['matter_read', 'matter_write', 'ai_copilot', 'drafting'],
    Associate: ['matter_read', 'matter_write', 'ai_copilot', 'drafting'],
    'Junior Advocate': ['matter_read', 'ai_copilot'],
    Junior: ['matter_read', 'ai_copilot'],
    'Accounts Staff': ['billing_view'],
    Accounts: ['billing_view'],
    'Office Staff': ['matter_read'],
    Staff: ['matter_read'],
    Reception: ['matter_read'],
    'Client Portal User': ['matter_read'],
    Client: ['matter_read'],
    'External Counsel': ['matter_read', 'ai_copilot'],
  });

  const togglePermission = (role: UserRole, permKey: string) => {
    setMatrix((prev) => {
      const current = prev[role] || [];
      const updated = current.includes(permKey) ? current.filter((k) => k !== permKey) : [...current, permKey];
      return { ...prev, [role]: updated };
    });
  };

  // Actions
  const handleToggleUserStatus = (user: User) => {
    if (
      user.role === 'System Administrator' ||
      user.role === 'System Owner' ||
      user.id === 'usr-sys-admin' ||
      user.email.toLowerCase() === 'apex7tech@gmail.com'
    ) {
      alert('Protected Account: Root System Administrator cannot be deactivated or soft-deleted.');
      return;
    }

    const isActivating = !user.is_active;
    const actionText = isActivating ? 'activate' : 'deactivate / soft-delete';

    if (window.confirm(`Are you sure you want to ${actionText} account for "${user.name}" (${user.email})?`)) {
      const updatedUser: User = {
        ...user,
        is_active: isActivating,
        is_deleted: !isActivating,
        status: isActivating ? 'Active' : 'Deleted',
        deleted_at: isActivating ? undefined : new Date().toISOString(),
        deleted_by: currentUser?.id || 'usr-sys-admin',
      };

      setUsersList((prev) =>
        prev.map((u) => (u.id === user.id ? updatedUser : u))
      );

      // Also update mockUsers in memory
      const mIdx = mockUsers.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
      if (mIdx >= 0) {
        mockUsers[mIdx] = updatedUser;
      } else {
        mockUsers.push(updatedUser);
      }

      // Notify parent App component & update database
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      // Add audit log
      const newAudit: AuditLog = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        eventType: isActivating ? 'USER_UPDATED' : 'USER_DELETED',
        performedBy: currentUser?.id || 'usr-sys-admin',
        performedByName: currentUser?.name || 'System Administrator',
        targetUserId: user.id,
        targetUserName: user.name,
        ipAddress: '103.211.54.12',
        details: `${isActivating ? 'Activated' : 'Deactivated & soft-deleted'} user account ${user.email}`,
        status: 'SUCCESS',
      };
      setLogsList((prev) => [newAudit, ...prev]);
    }
  };

  const handleTerminateSession = (sessId: string, userName: string) => {
    if (window.confirm(`Terminate live active session for ${userName}?`)) {
      setSessionsList((prev) =>
        prev.map((s) => (s.id === sessId ? { ...s, status: 'Terminated', logoutTime: new Date().toISOString() } : s))
      );

      const newAudit: AuditLog = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        eventType: 'SESSION_TERMINATED',
        performedBy: currentUser?.id || 'usr-sys-admin',
        performedByName: currentUser?.name || 'System Administrator',
        ipAddress: '103.211.54.12',
        details: `Terminated live session ${sessId} for user ${userName}`,
        status: 'WARNING',
      };
      setLogsList((prev) => [newAudit, ...prev]);
    }
  };

  const handleCreateNewFirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirmName.trim() || !newFirmCode.trim()) {
      setModalError('Please enter Law Firm Name and Code.');
      return;
    }

    const firmId = `firm-${Date.now()}`;
    const newFirm: LawFirm = {
      id: firmId,
      name: newFirmName.trim(),
      code: newFirmCode.trim().toUpperCase(),
      plan: newFirmPlan,
      storageQuotaGB: 500,
      storageUsedGB: 0,
      branches: [
        {
          id: `branch-${Date.now()}`,
          firmId,
          name: 'Main High Court Office',
          city: 'New Delhi',
          address: 'High Court Chamber Block, New Delhi',
          isHeadquarters: true,
        },
      ],
      departments: [
        { id: `dept-1`, name: 'Commercial Litigation', code: 'COMM' },
        { id: `dept-2`, name: 'Criminal Defence', code: 'CRIM' },
      ],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Active',
      is_active: true,
      is_deleted: false,
    };

    setFirmsList((prev) => [newFirm, ...prev]);
    mockFirms.unshift(newFirm);
    if (onFirmUpdate) {
      onFirmUpdate(newFirm);
    }

    // Add Audit Log
    const newAudit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: 'FIRM_CREATED',
      performedBy: currentUser?.id || 'usr-sys-admin',
      performedByName: currentUser?.name || 'System Administrator',
      firmId,
      details: `Created new Law Firm "${newFirm.name}" with zero demo data default state.`,
      status: 'SUCCESS',
    };
    setLogsList((prev) => [newAudit, ...prev]);

    setShowCreateFirmModal(false);
    setNewFirmName('');
    setNewFirmCode('');
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!newUserName.trim() || !newUserEmail.trim()) {
      setModalError('Please enter Name and Email address.');
      return;
    }

    const passCheck = validatePasswordPolicy(newUserPassword);
    if (!passCheck.valid) {
      setModalError(passCheck.errors.join(' • '));
      return;
    }

    const newUsr: User = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      role: newUserRole,
      firmId: newUserFirmId,
      branchId: `branch-${Date.now()}`,
      phone: newUserPhone,
      barCouncilRegNo: newUserBarReg,
      permissions: matrix[newUserRole] || [],
      status: 'Active',
      is_active: true,
      is_deleted: false,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: currentUser?.id || 'usr-sys-admin',
    };

    setUsersList((prev) => [newUsr, ...prev]);
    mockUsers.unshift(newUsr);
    if (onUserUpdate) {
      onUserUpdate(newUsr);
    }

    const newAudit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: 'USER_CREATED',
      performedBy: currentUser?.id || 'usr-sys-admin',
      performedByName: currentUser?.name || 'System Administrator',
      targetUserId: newUsr.id,
      targetUserName: newUsr.name,
      firmId: newUserFirmId,
      ipAddress: '103.211.54.12',
      details: `Provisioned account for ${newUsr.name} (${newUsr.role}) in firm ${newUserFirmId}`,
      status: 'SUCCESS',
    };
    setLogsList((prev) => [newAudit, ...prev]);

    setShowCreateUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('LawyerDesk@2026');
  };

  const handleAdminResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!resetModalUser) return;

    const passCheck = validatePasswordPolicy(resetNewPassword);
    if (!passCheck.valid) {
      setResetError(passCheck.errors.join(' • '));
      return;
    }

    setResetSuccess(`Password successfully updated for ${resetModalUser.email}. User must re-authenticate.`);

    const newAudit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: 'PASSWORD_RESET',
      performedBy: currentUser?.id || 'usr-sys-admin',
      performedByName: currentUser?.name || 'System Administrator',
      targetUserId: resetModalUser.id,
      targetUserName: resetModalUser.name,
      ipAddress: '103.211.54.12',
      details: `System Admin reset password for user ${resetModalUser.email}`,
      status: 'SUCCESS',
    };
    setLogsList((prev) => [newAudit, ...prev]);

    setTimeout(() => {
      setResetModalUser(null);
      setResetNewPassword('');
    }, 1500);
  };

  // Metrics
  const activeCount = usersList.filter((u) => u.is_active && !u.is_deleted).length;
  const deletedCount = usersList.filter((u) => u.is_deleted || u.status === 'Deleted').length;
  const activeSessionsCount = sessionsList.filter((s) => s.status === 'Active').length;

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearchTerm.toLowerCase());

    if (userStatusFilter === 'All') return matchesSearch;
    if (userStatusFilter === 'Active') return matchesSearch && u.is_active && !u.is_deleted;
    if (userStatusFilter === 'Deleted') return matchesSearch && (u.is_deleted || u.status === 'Deleted');
    if (userStatusFilter === 'Suspended') return matchesSearch && u.status === 'Suspended';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black tracking-tight">System Security & RBAC Command Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Enterprise Tenant Isolation • Multi-Firm Law Practice Management • Session Guard & Audit Trail Engine
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateFirmModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all"
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Create Law Firm</span>
          </button>

          <button
            onClick={() => setShowCreateUserModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision User</span>
          </button>
        </div>
      </div>

      {/* Security Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{activeCount}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Active User Accounts</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{deletedCount}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Deactivated / Soft Deleted</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-bold">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{activeSessionsCount}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Active Online Sessions</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{firmsList.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Law Firms Provisioned</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'users'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>User Directory & Status ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('firms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'firms'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Law Firms ({firmsList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'sessions'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Live Sessions ({sessionsList.filter((s) => s.status === 'Active').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'matrix'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>RBAC Permissions Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Security Audit Trail ({logsList.length})</span>
        </button>
      </div>

      {/* Tab Content: Users Management */}
      {activeSubTab === 'users' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                placeholder="Filter users by name, email, or role..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Filter Status:</span>
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Users</option>
                <option value="Active">Active Only</option>
                <option value="Deleted">Deactivated / Deleted</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="p-3">User Details</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Firm ID</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3">Creation Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((usr) => {
                  const isDeactivated = usr.is_deleted || !usr.is_active || usr.status === 'Deleted';

                  return (
                    <tr
                      key={usr.id}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 ${
                        isDeactivated ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{usr.name}</span>
                          {usr.isDemoUser && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[9px] font-bold">
                              DEMO SANDBOX
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400">{usr.email}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{usr.role}</td>
                      <td className="p-3 font-mono text-slate-500">{usr.firmId}</td>
                      <td className="p-3">
                        {isDeactivated ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold text-[10px] border border-rose-300 dark:border-rose-800">
                            Deactivated / Deleted
                          </span>
                        ) : usr.status === 'Suspended' ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold text-[10px] border border-amber-300 dark:border-amber-800">
                            Suspended
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-300 dark:border-emerald-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-slate-400">{usr.createdAt}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setResetModalUser(usr);
                              setResetNewPassword('Reset@Lawyer2026');
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all"
                            title="Reset Password"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleUserStatus(usr)}
                            className={`p-1.5 rounded-lg transition-all ${
                              isDeactivated
                                ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                                : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950'
                            }`}
                            title={isDeactivated ? 'Activate Account' : 'Deactivate & Soft Delete'}
                          >
                            {isDeactivated ? <CheckCircle2 className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Law Firms Directory */}
      {activeSubTab === 'firms' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Registered Law Firms & Multi-Branch Offices</span>
            </h2>

            <button
              onClick={() => setShowCreateFirmModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
            >
              <Plus className="w-4 h-4" /> New Law Firm
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {firmsList.map((firm) => (
              <div
                key={firm.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                      {firm.code}
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mt-1">{firm.name}</h3>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    {firm.plan}
                  </span>
                </div>

                <div className="text-xs text-slate-500 space-y-1 font-mono">
                  <div>Storage Used: {firm.storageUsedGB} GB / {firm.storageQuotaGB} GB</div>
                  <div>HQ City: {firm.branches[0]?.city || 'New Delhi'}</div>
                  <div>Branches: {firm.branches.length} Registered</div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Firm ID: {firm.id}</span>
                  <span className="text-emerald-600 font-bold">Isolated DB Vault Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Live Sessions */}
      {activeSubTab === 'sessions' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Active Authenticated Sessions Monitor</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="p-3">User & Role</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Browser / Device</th>
                  <th className="p-3">Login Time</th>
                  <th className="p-3">Session Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sessionsList.map((sess) => (
                  <tr key={sess.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{sess.userName}</div>
                      <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{sess.userRole}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-300">{sess.ipAddress}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      <div>{sess.browser} ({sess.os})</div>
                      <div className="text-[10px] text-slate-400">{sess.device}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{new Date(sess.loginTime).toLocaleTimeString()}</td>
                    <td className="p-3">
                      {sess.status === 'Active' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                          Active Online
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px]">
                          Terminated
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {sess.status === 'Active' && (
                        <button
                          onClick={() => handleTerminateSession(sess.id, sess.userName)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 text-[11px] font-bold hover:bg-rose-100"
                        >
                          Revoke Token
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: RBAC Matrix */}
      {activeSubTab === 'matrix' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <span>Configurable Access Matrix (11 Enterprise Roles)</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="p-3">Permission Name</th>
                  {rolesList.map((r) => (
                    <th key={r} className="p-3 text-center whitespace-nowrap">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionsList.map((perm) => (
                  <tr key={perm.key} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{perm.label}</td>
                    {rolesList.map((role) => {
                      const hasPerm = matrix[role]?.includes(perm.key);
                      return (
                        <td key={role} className="p-3 text-center">
                          <button
                            onClick={() => togglePermission(role, perm.key)}
                            className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center transition-all ${
                              hasPerm
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {hasPerm ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Audit Logs */}
      {activeSubTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <List className="w-4 h-4 text-indigo-600" />
            <span>Real-time Security Audit Stream</span>
          </h2>

          <div className="space-y-2">
            {logsList.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{log.performedByName}</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                      {log.eventType}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 mt-1">{log.details}</div>
                </div>

                <div className="text-right text-[11px] font-mono text-slate-400">
                  <div>IP: {log.ipAddress}</div>
                  <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Law Firm */}
      {showCreateFirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 relative">
            <button
              onClick={() => setShowCreateFirmModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Building2 className="w-5 h-5" /> Create New Law Firm (Clean Workspace)
            </div>

            <p className="text-xs text-slate-300">
              New Law Firms are initialized with completely isolated database vaults and zero demo data.
            </p>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateNewFirm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Law Firm Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newFirmName}
                  onChange={(e) => setNewFirmName(e.target.value)}
                  placeholder="M/s Trilegal & Partners Advocates"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Firm Code *</label>
                <input
                  type="text"
                  required
                  value={newFirmCode}
                  onChange={(e) => setNewFirmCode(e.target.value)}
                  placeholder="TLG-DEL"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Subscription Plan</label>
                <select
                  value={newFirmPlan}
                  onChange={(e) => setNewFirmPlan(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Enterprise Unlimited">Enterprise Unlimited (500 GB)</option>
                  <option value="Partner Suite">Partner Suite (200 GB)</option>
                  <option value="Standard Firm">Standard Firm (50 GB)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateFirmModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                >
                  Create Firm Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create User Account */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 relative">
            <button
              onClick={() => setShowCreateUserModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <UserPlus className="w-5 h-5" /> Provision User Account (System Admin)
            </div>

            <p className="text-xs text-slate-300">
              Only System Administrators can provision advocate and staff accounts. Self-registration is disabled.
            </p>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateNewUser} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Adv. Vikramaditya Roy"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="vikram@lawyerdesk.in"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Account Category / Role *</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Law Firm">Law Firm (Managing Partner)</option>
                    <option value="Senior Advocate">Senior Advocate</option>
                    <option value="Associate Advocate">Associate Advocate</option>
                    <option value="Junior Advocate">Junior Advocate</option>
                    <option value="Client">Client (External Portal User)</option>
                    <option value="Accounts Staff">Accounts Staff</option>
                    <option value="Office Staff">Office Staff</option>
                    <option value="Reception">Reception</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Associated Law Firm / Practice Chamber *</label>
                  <select
                    value={newUserFirmId}
                    onChange={(e) => setNewUserFirmId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  >
                    {firmsList.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-400">
                    Default Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const generated = 'Pass#' + Math.floor(100000 + Math.random() * 900000) + '!';
                      setNewUserPassword(generated);
                    }}
                    className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="e.g. Pass#928134!"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono pr-10"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Policy: Minimum 8 characters with numbers & special characters.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                >
                  Provision User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Password Reset */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 relative">
            <button
              onClick={() => setResetModalUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <RefreshCw className="w-5 h-5" /> Admin Reset Password for {resetModalUser.name}
            </div>

            {resetError && (
              <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAdminResetPassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">New Password *</label>
                <input
                  type="text"
                  required
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
