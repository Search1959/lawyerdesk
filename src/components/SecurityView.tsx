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
} from 'lucide-react';
import { UserRole, AuditLog } from '../types';

interface SecurityViewProps {
  auditLogs: AuditLog[];
}

export const SecurityView: React.FC<SecurityViewProps> = ({ auditLogs }) => {
  const rolesList: UserRole[] = [
    'Super Admin',
    'Firm Admin',
    'Senior Lawyer',
    'Associate',
    'Junior',
    'Staff',
    'Reception',
    'Accounts',
    'Client',
    'External Counsel',
  ];

  const permissionsList = [
    { key: 'all_access', label: 'All Platform Admin Controls' },
    { key: 'matter_read', label: 'View Case Files & Pleadings' },
    { key: 'matter_write', label: 'Edit Matters & Upload Documents' },
    { key: 'ai_copilot', label: 'Grounded AI Chat & RAG' },
    { key: 'drafting', label: 'AI Legal Drafting Studio' },
    { key: 'billing_view', label: 'View Invoices & Billing Stats' },
    { key: 'firm_manage', label: 'Law Firm Branch & User Admin' },
  ];

  // Permissions state matrix
  const [matrix, setMatrix] = useState<Record<UserRole, string[]>>({
    'Super Admin': ['all_access', 'matter_read', 'matter_write', 'ai_copilot', 'drafting', 'billing_view', 'firm_manage'],
    'Firm Admin': ['all_access', 'matter_read', 'matter_write', 'ai_copilot', 'drafting', 'billing_view', 'firm_manage'],
    'Senior Lawyer': ['matter_read', 'matter_write', 'ai_copilot', 'drafting', 'billing_view'],
    Associate: ['matter_read', 'matter_write', 'ai_copilot', 'drafting'],
    Junior: ['matter_read', 'ai_copilot'],
    Staff: ['matter_read'],
    Reception: ['matter_read'],
    Accounts: ['billing_view'],
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

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Role-Based Access Control & Security Matrix</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            AES-256 Encrypted Vault • Configurable Role Matrix • JWT Session Guard & Audit Trail
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            2FA & Digital Signatures Active
          </span>
        </div>
      </div>

      {/* RBAC Matrix Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <KeyRound className="w-4 h-4 text-indigo-600" />
          <span>Configurable Access Matrix (10 Enterprise Roles)</span>
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

      {/* Audit Logs Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <List className="w-4 h-4 text-indigo-600" />
          <span>Full Enterprise Audit Log Stream</span>
        </h2>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{log.userName}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                    {log.userRole}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{log.action}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300 mt-1">{log.details}</div>
              </div>

              <div className="text-right text-[11px] font-mono text-slate-400">
                <div>IP: {log.ipAddress}</div>
                <div>{log.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
