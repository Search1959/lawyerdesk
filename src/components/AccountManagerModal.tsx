import React, { useState } from 'react';
import {
  Building2,
  UserPlus,
  ShieldCheck,
  User,
  Users,
  Briefcase,
  X,
  CheckCircle2,
  Lock,
  Plus,
  Scale,
  Mail,
  Phone,
  FileText,
  BadgeCheck,
  Eye,
  EyeOff,
  Key,
} from 'lucide-react';
import { UserRole, LawFirm, User as UserType } from '../types';

interface AccountManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType;
  currentFirm?: LawFirm;
  existingFirms: LawFirm[];
  existingUsers: UserType[];
  onAddFirm: (
    firm: Partial<LawFirm>,
    adminEmail: string,
    adminName: string,
    adminRole?: UserRole,
    initZeroData?: boolean
  ) => void;
  onAddUser: (user: Partial<UserType>) => void;
}

export const AccountManagerModal: React.FC<AccountManagerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentFirm,
  existingFirms,
  existingUsers,
  onAddFirm,
  onAddUser,
}) => {
  const isDemo = (currentUser as any)?.isDemoUser;
  const isSystemAdmin =
    currentUser.role === 'Super Admin' ||
    currentUser.role === 'System Administrator' ||
    currentUser.role === 'System Owner' ||
    currentUser.email === 'apex7tech@gmail.com';
  const isFirmAdmin =
    currentUser.role === 'Firm Admin' ||
    currentUser.role === 'Law Firm' ||
    isSystemAdmin;
  const isIndividualLawyer =
    currentUser.role === 'Senior Lawyer' ||
    currentUser.role === 'Senior Advocate' ||
    currentUser.role === 'Associate' ||
    currentUser.role === 'Associate Advocate' ||
    currentUser.role === 'Junior Advocate' ||
    currentUser.role === 'External Counsel';

  const [activeTab, setActiveTab] = useState<'firm' | 'lawyer' | 'staff' | 'overview'>(
    isSystemAdmin ? 'firm' : isFirmAdmin ? 'staff' : 'lawyer'
  );

  // New Firm Form State (System Admin)
  const [firmName, setFirmName] = useState('');
  const [firmCode, setFirmCode] = useState('');
  const [firmCity, setFirmCity] = useState('New Delhi');
  const [firmAdminName, setFirmAdminName] = useState('');
  const [firmAdminEmail, setFirmAdminEmail] = useState('');
  const [firmAdminPassword, setFirmAdminPassword] = useState('');
  const [firmAdminConfirmPassword, setFirmAdminConfirmPassword] = useState('');
  const [showFirmPassword, setShowFirmPassword] = useState(false);
  const [firmPlan, setFirmPlan] = useState<'Enterprise Unlimited' | 'Partner Suite' | 'Standard Firm'>('Partner Suite');
  const [firmAdminRole, setFirmAdminRole] = useState<UserRole>('System Administrator');
  const [initZeroData, setInitZeroData] = useState(true);

  // New User Form State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userConfirmPassword, setUserConfirmPassword] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('Senior Lawyer');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [barRegNo, setBarRegNo] = useState('D/1982/2020');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCreateFirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) return;
    setErrorMsg('');
    if (!firmName || !firmAdminEmail) {
      setErrorMsg('Firm Name and Admin Email are required.');
      return;
    }
    if (!firmAdminPassword) {
      setErrorMsg('Please enter a password for the Firm Admin account.');
      return;
    }
    if (firmAdminPassword !== firmAdminConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    onAddFirm(
      {
        name: firmName,
        code: firmCode || firmName.substring(0, 3).toUpperCase(),
        plan: firmPlan,
        branches: [
          {
            id: `branch-${Date.now()}`,
            firmId: `firm-${Date.now()}`,
            name: `${firmCity} Office`,
            city: firmCity,
            address: `${firmCity} Legal Chambers`,
            isHeadquarters: true,
          },
        ],
      },
      firmAdminEmail,
      firmAdminName || 'System Administrator',
      firmAdminRole,
      initZeroData
    );

    setSuccessMsg(`Law Firm "${firmName}" & ${firmAdminRole} Account (${firmAdminEmail}) provisioned with Zero Demo Data!`);
    setFirmName('');
    setFirmCode('');
    setFirmAdminName('');
    setFirmAdminEmail('');
    setFirmAdminPassword('');
    setFirmAdminConfirmPassword('');

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) return;
    setErrorMsg('');
    if (!userName || !userEmail) {
      setErrorMsg('User Name and Email are required.');
      return;
    }
    if (!userPassword) {
      setErrorMsg('Please enter a password for the new account.');
      return;
    }
    if (userPassword !== userConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    onAddUser({
      name: userName,
      email: userEmail,
      role: userRole,
      phone: userPhone,
      barCouncilRegNo: barRegNo,
      firmId: currentUser.firmId || 'firm-1',
    });

    setSuccessMsg(`Account created successfully for ${userName} (${userRole})!`);
    setUserName('');
    setUserEmail('');
    setUserPassword('');
    setUserConfirmPassword('');

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <span>Account & Organization Management</span>
                {isSystemAdmin && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    System Admin Authority
                  </span>
                )}
                {isFirmAdmin && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Firm Admin Scope
                  </span>
                )}
                {isIndividualLawyer && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Solo Practice Scope
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Manage organization hierarchy, firm accounts, staff members, and client credentials.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Read-Only Alert Banner */}
        {isDemo && (
          <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2 px-6">
            <Lock className="w-4 h-4 shrink-0 text-amber-500" />
            <span>
              <strong>Demo Read-Only Mode:</strong> You are currently logged in as Demo Evaluator. To register new Law Firms or Lawyers, please log in with System Admin or Firm credentials.
            </span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border-b border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 px-6">
            <Lock className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 px-6">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-6 pt-3 gap-2 text-xs font-semibold">
          {isSystemAdmin && (
            <button
              onClick={() => setActiveTab('firm')}
              className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'firm'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-t-2 border-indigo-600 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Create Law Firm Account</span>
            </button>
          )}

          {(isSystemAdmin || isFirmAdmin || isIndividualLawyer) && (
            <button
              onClick={() => setActiveTab('lawyer')}
              className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'lawyer'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-t-2 border-indigo-600 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>
                {isSystemAdmin
                  ? 'Create Individual Lawyer'
                  : isFirmAdmin
                  ? 'Add Lawyer / Staff'
                  : 'Add Practice Associate'}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-t-2 border-indigo-600 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Organization Roster</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 text-slate-800 dark:text-slate-200 text-xs overflow-y-auto max-h-[calc(92vh-120px)] space-y-4">
          {/* TAB 1: System Admin - Create Law Firm */}
          {activeTab === 'firm' && isSystemAdmin && (
            <form onSubmit={handleCreateFirm} className="space-y-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-indigo-900 dark:text-indigo-200 text-xs leading-relaxed">
                <strong>System Admin Hierarchy Privilege:</strong> You have authority to provision new multi-branch Law Firm accounts. Creating a firm automatically boots a clean firm workspace (0 demo records) and sets up its Managing Partner account.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Law Firm Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M/s Khaitan & Partners Advocates"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Firm Code Prefix
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KPA-DEL"
                    value={firmCode}
                    onChange={(e) => setFirmCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Headquarters City
                  </label>
                  <input
                    type="text"
                    value={firmCity}
                    onChange={(e) => setFirmCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subscription Tier
                  </label>
                  <select
                    value={firmPlan}
                    onChange={(e) => setFirmPlan(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Partner Suite">Partner Suite (10TB Vault, PaddleOCR)</option>
                    <option value="Enterprise Unlimited">Enterprise Unlimited (Supreme Court AI)</option>
                    <option value="Standard Firm">Standard Firm Practice</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Firm Admin / Managing Partner Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Adv. Vikram Khaitan"
                    value={firmAdminName}
                    onChange={(e) => setFirmAdminName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Firm Admin Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@khaitanpartners.in"
                    value={firmAdminEmail}
                    onChange={(e) => setFirmAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Firm Admin Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showFirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={firmAdminPassword}
                      onChange={(e) => setFirmAdminPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFirmPassword(!showFirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                    >
                      {showFirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type={showFirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={firmAdminConfirmPassword}
                    onChange={(e) => setFirmAdminConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Firm Admin Account Privilege Level *
                  </label>
                  <select
                    value={firmAdminRole}
                    onChange={(e) => setFirmAdminRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="System Administrator">System Administrator (Full Owner & System Admin)</option>
                    <option value="Firm Admin">Firm Admin (Managing Partner / Firm Operations)</option>
                  </select>
                </div>
              </div>

              {/* Zero Demo Data & Isolation Option */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-2.5 shadow-inner">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={initZeroData}
                    onChange={(e) => setInitZeroData(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded border-slate-700 focus:ring-emerald-500"
                  />
                  <span className="font-extrabold text-emerald-400 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Provision Pure Clean Workspace (Zero Demo Data Mode)
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2 text-[10.5px] text-slate-300 pt-1 border-t border-slate-800">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Isolated Firm ID & Branch</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>0 Pre-existing Matters / Clients</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Full Admin User Management</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Independent Audit Log & GST Billing</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isDemo}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold shadow-md flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Provision Law Firm & Firm Admin Account</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Create Lawyer / Staff / Associate */}
          {activeTab === 'lawyer' && (
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                {isSystemAdmin && 'System Admin can register independent advocates or firm associates.'}
                {isFirmAdmin && 'Firm Admin can register lawyers, associates, paralegals, and accounts staff under your firm.'}
                {isIndividualLawyer && 'Register associate advocates, junior counsel, or office staff under your solo practice.'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adv. Meenakshi Sundaram"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. meenakshi@lawyerdesk.in"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Account Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showUserPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUserPassword(!showUserPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                    >
                      {showUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type={showUserPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={userConfirmPassword}
                    onChange={(e) => setUserConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Role & Authority Level *
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold focus:ring-2 focus:ring-indigo-500"
                  >
                    {isSystemAdmin && <option value="System Administrator">System Administrator (Full Owner & Admin)</option>}
                    <option value="Firm Admin">Firm Admin (Managing Partner / Firm Ops)</option>
                    <option value="Senior Advocate">Senior Advocate / Partner</option>
                    <option value="Associate Advocate">Associate Advocate</option>
                    <option value="Junior Advocate">Junior Advocate</option>
                    <option value="Office Staff">Paralegal / Legal Secretary</option>
                    <option value="Accounts Staff">Accounts & GST Billing Specialist</option>
                    <option value="Client Portal User">Client Portal Account</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bar Council Registration No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. D/1842/2016"
                    value={barRegNo}
                    onChange={(e) => setBarRegNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Dynamic Role Authority & Privilege Matrix Card */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-2 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-bold text-indigo-300">
                  <span className="flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    Role Authority & Privilege Matrix
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                    {userRole}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  {(userRole === 'System Administrator' || userRole === 'Firm Admin' || userRole === 'Super Admin') && (
                    <>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Full Firm Management & User Provisioning</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>All Court Matters, Cause Lists & OCR</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>GST Invoicing, Collections & Financial Analytics</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>System Settings, Audit Logs & Database Export</span>
                      </div>
                    </>
                  )}

                  {(userRole === 'Senior Lawyer' || userRole === 'Associate' || userRole === 'Junior') && (
                    <>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Create & Edit Assigned Court Matters</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>High Court / District Court Cause List Tracker</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>PaddleOCR Document Scanning & AI Grounded RAG</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 line-through">
                        <X className="w-3.5 h-3.5 shrink-0" />
                        <span>No System Owner Settings / Firm Provisioning</span>
                      </div>
                    </>
                  )}

                  {(userRole === 'Staff' || userRole === 'Accounts') && (
                    <>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Manage Cause List Hearings & Task Schedules</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Issue GST Tax Invoices & Track Receipts</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 line-through">
                        <X className="w-3.5 h-3.5 shrink-0" />
                        <span>No Senior Advocate Privileges</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 line-through">
                        <X className="w-3.5 h-3.5 shrink-0" />
                        <span>No System Admin Controls</span>
                      </div>
                    </>
                  )}

                  {userRole === 'Client' && (
                    <>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Isolated Client Portal Access</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>View Assigned Cases, Order PDFs & Invoices</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 line-through">
                        <X className="w-3.5 h-3.5 shrink-0" />
                        <span>No Access to Other Clients' Data</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 line-through">
                        <X className="w-3.5 h-3.5 shrink-0" />
                        <span>No Advocate / Firm Tools</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isDemo}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold shadow-md flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Account & Send Access Credentials</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Overview & Existing Roster */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Registered Law Firms */}
              {isSystemAdmin && (
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    <span>Registered Law Firms ({existingFirms.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {existingFirms.map((f) => (
                      <div
                        key={f.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            {f.name} ({f.code})
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Plan: {f.plan} • Storage: {f.storageUsedGB} GB / {f.storageQuotaGB} GB
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                          ACTIVE FIRM
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registered Users Roster */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>Active Registered Advocates & Staff ({existingUsers.length})</span>
                </h3>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {existingUsers.map((u) => (
                    <div
                      key={u.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            {u.email} • {u.barCouncilRegNo || 'Bar Reg Pending'}
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
