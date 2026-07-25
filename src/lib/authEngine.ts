import { User, UserRole, UserSession, AuditLog, AuditEventType, UserStatus } from '../types';

// Password Policy Rule Engine
export function validatePasswordPolicy(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Must include at least one uppercase letter (A-Z)');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Must include at least one lowercase letter (a-z)');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Must include at least one number (0-9)');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Must include at least one special character (!@#$%^&*)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Account State & Login Validator
export function validateAccountStatus(user: User): { allowed: boolean; reason: string } {
  // Root System Administrator accounts are immune to lockout, deactivation, or soft-deletion
  if (
    user.role === 'System Administrator' ||
    user.role === 'System Owner' ||
    user.role === 'Super Admin' ||
    user.id === 'usr-sys-admin' ||
    user.email.toLowerCase() === 'apex7tech@gmail.com'
  ) {
    return { allowed: true, reason: '' };
  }

  if (user.is_deleted || user.status === 'Deleted') {
    return {
      allowed: false,
      reason: 'Your account has been deactivated. Please contact the System Administrator.',
    };
  }

  if (!user.is_active || user.status === 'Inactive') {
    return {
      allowed: false,
      reason: 'Your account has been deactivated. Please contact the System Administrator.',
    };
  }

  if (user.status === 'Suspended') {
    return {
      allowed: false,
      reason: 'Your Law Firm account or individual advocate access is currently suspended. Please contact System Administrator.',
    };
  }

  if (user.status === 'Locked' || (user.lockoutUntil && new Date(user.lockoutUntil) > new Date())) {
    return {
      allowed: false,
      reason: 'Account is temporarily locked due to multiple failed login attempts. Try again later or contact System Admin.',
    };
  }

  return { allowed: true, reason: '' };
}

// Multi-Tenant Isolation Rule Engine
export function canUserAccessData(
  currentUser: User | null,
  recordFirmId?: string,
  isDemoRecord: boolean = false
): boolean {
  if (!currentUser) return false;

  // System Owners & System Admins have platform-level auditing rights
  if (currentUser.role === 'System Owner' || currentUser.role === 'System Administrator' || currentUser.role === 'Super Admin') {
    return true;
  }

  // Demo User can ONLY access Demo Data
  if (currentUser.role === 'Demo User' || currentUser.isDemoUser) {
    return isDemoRecord;
  }

  // Production Users (Law Firm, Advocates, Staff, Clients) MUST NEVER see Demo Data
  if (isDemoRecord) {
    return false;
  }

  // Client Portal User can only access their specific firm/client data
  if (currentUser.role === 'Client Portal User' || currentUser.role === 'Client') {
    return recordFirmId === currentUser.firmId;
  }

  // Strict Firm Tenant Isolation
  if (!recordFirmId || recordFirmId !== currentUser.firmId) {
    return false;
  }

  return true;
}

// RBAC Role-Permissions Matrix
export const ROLE_PERMISSIONS_MAP: Record<UserRole, string[]> = {
  'System Owner': ['*'],
  'System Administrator': [
    'manage_firms',
    'manage_users',
    'create_advocate',
    'create_staff',
    'reset_passwords',
    'activate_deactivate_users',
    'delete_users',
    'suspend_firms',
    'manage_subscriptions',
    'view_all_firms',
    'view_audit_logs',
    'manage_sessions',
  ],
  'Super Admin': [
    'manage_firms',
    'manage_users',
    'create_advocate',
    'create_staff',
    'reset_passwords',
    'activate_deactivate_users',
    'delete_users',
    'suspend_firms',
    'view_all_firms',
    'view_audit_logs',
  ],
  'Demo User': ['view_demo_data', 'read_only_eval'],
  'Law Firm': [
    'manage_own_firm',
    'create_firm_staff',
    'manage_matters',
    'manage_clients',
    'manage_billing',
    'view_firm_audit',
  ],
  'Firm Admin': [
    'manage_own_firm',
    'create_firm_staff',
    'manage_matters',
    'manage_clients',
    'manage_billing',
    'view_firm_audit',
  ],
  'Senior Advocate': [
    'create_matters',
    'edit_matters',
    'assign_associates',
    'manage_documents',
    'ai_drafting',
    'view_billing',
    'manage_hearings',
  ],
  'Senior Lawyer': [
    'create_matters',
    'edit_matters',
    'assign_associates',
    'manage_documents',
    'ai_drafting',
    'view_billing',
    'manage_hearings',
  ],
  'Associate Advocate': [
    'view_assigned_matters',
    'edit_assigned_matters',
    'upload_documents',
    'ai_copilot',
    'manage_tasks',
  ],
  'Associate': [
    'view_assigned_matters',
    'edit_assigned_matters',
    'upload_documents',
    'ai_copilot',
    'manage_tasks',
  ],
  'Junior Advocate': [
    'view_assigned_matters',
    'upload_documents',
    'draft_petitions',
    'view_hearings',
  ],
  'Junior': [
    'view_assigned_matters',
    'upload_documents',
    'draft_petitions',
    'view_hearings',
  ],
  'Accounts Staff': [
    'view_financials',
    'create_invoices',
    'process_payments',
    'manage_expenses',
    'view_outstanding',
  ],
  'Accounts': [
    'view_financials',
    'create_invoices',
    'process_payments',
    'manage_expenses',
    'view_outstanding',
  ],
  'Office Staff': [
    'manage_cause_list',
    'schedule_hearings',
    'upload_orders',
    'manage_reminders',
  ],
  'Staff': [
    'manage_cause_list',
    'schedule_hearings',
    'upload_orders',
    'manage_reminders',
  ],
  'Reception': [
    'manage_appointments',
    'manage_enquiries',
    'visitor_log',
    'client_greeting',
  ],
  'Client Portal User': [
    'view_own_matters',
    'view_own_hearings',
    'view_own_invoices',
    'download_own_documents',
  ],
  'Client': [
    'view_own_matters',
    'view_own_hearings',
    'view_own_invoices',
    'download_own_documents',
  ],
  'External Counsel': [
    'view_brief_documents',
    'add_counsel_notes',
  ],
};

export function hasPermission(user: User, permission: string): boolean {
  if (user.permissions.includes('*') || user.permissions.includes('all_access')) {
    return true;
  }
  const roleDefaultPermissions = ROLE_PERMISSIONS_MAP[user.role] || [];
  return (
    user.permissions.includes(permission) ||
    roleDefaultPermissions.includes(permission) ||
    roleDefaultPermissions.includes('*')
  );
}

// In-Memory Session & Audit Storage Helper for UI State
export const mockSessionsStore: UserSession[] = [
  {
    id: 'sess-1',
    userId: 'usr-sys-admin',
    userName: 'Apex Tech System Administrator',
    userEmail: 'apex7tech@gmail.com',
    userRole: 'System Administrator',
    firmId: 'firm-system',
    loginTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    ipAddress: '103.211.54.12',
    browser: 'Chrome 122.0',
    os: 'macOS Sonoma',
    device: 'Desktop Mac Studio',
    location: 'New Delhi, India',
    status: 'Active',
  },
  {
    id: 'sess-2',
    userId: 'usr-firm-admin',
    userName: 'Rajesh Sharma (Managing Partner)',
    userEmail: 'firmadmin@apexlaw.in',
    userRole: 'Law Firm',
    firmId: 'firm-101',
    loginTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    ipAddress: '49.207.210.88',
    browser: 'Firefox 123.0',
    os: 'Windows 11 Pro',
    device: 'ThinkPad X1 Carbon',
    location: 'Mumbai, India',
    status: 'Active',
  },
];

export const mockAuditLogsStore: AuditLog[] = [
  {
    id: 'audit-1',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    eventType: 'LOGIN_SUCCESS',
    performedBy: 'usr-sys-admin',
    performedByName: 'System Admin (apex7tech@gmail.com)',
    firmId: 'firm-system',
    ipAddress: '103.211.54.12',
    details: 'System Administrator logged in with 2FA verified token.',
    status: 'SUCCESS',
  },
  {
    id: 'audit-2',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    eventType: 'FIRM_CREATED',
    performedBy: 'usr-sys-admin',
    performedByName: 'System Admin (apex7tech@gmail.com)',
    firmId: 'firm-102',
    details: 'Created Law Firm "M/s Trilegal & Partners" with clean 0 demo cases state.',
    status: 'SUCCESS',
  },
  {
    id: 'audit-3',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    eventType: 'LOGIN_FAILED',
    performedBy: 'unknown',
    performedByName: 'Unrecognized IP Attempt',
    ipAddress: '185.220.101.4',
    details: 'Failed login attempt for user lawyer.rogue@gmail.com - Incorrect password.',
    status: 'FAILED',
  },
];
