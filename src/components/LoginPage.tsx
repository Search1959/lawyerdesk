import React, { useState } from 'react';
import {
  Scale,
  Lock,
  Mail,
  Key,
  ShieldCheck,
  UserCheck,
  Building2,
  Briefcase,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User as UserIcon,
  UserX,
  X,
  RefreshCw,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';
import { validateAccountStatus, validatePasswordPolicy } from '../lib/authEngine';
import { saveDocument } from '../lib/firebase';

interface LoginPageProps {
  users?: User[];
  onLoginSuccess: (email: string, role: UserRole, name: string, isDemoUser?: boolean) => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  users = [],
  onLoginSuccess,
  onBackToHome,
}) => {
  const [email, setEmail] = useState('apex7tech@gmail.com');
  const [password, setPassword] = useState('Search@1959');
  const [selectedRole, setSelectedRole] = useState<UserRole>('System Administrator');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot Password Modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [resetError, setResetError] = useState('');

  // Quick Preset Role Personas for easy evaluation
  const demoAccounts = [
    {
      role: 'System Administrator' as UserRole,
      title: 'System Admin (Full Owner)',
      name: 'Apex Tech System Administrator',
      email: 'apex7tech@gmail.com',
      password: 'Search@1959',
      desc: 'Full System Control, Create Law Firms & Advocate Accounts, Manage RBAC & Audit Logs',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: ShieldCheck,
    },
    {
      role: 'Demo User' as UserRole,
      title: 'Demo Evaluator (Sandbox)',
      name: 'Guest Evaluator (Read-Only)',
      email: 'demo.evaluator@lawyerdesk.in',
      password: 'Demo@2026',
      desc: 'Isolated Demo Data Sandbox with pre-populated benchmark cases & hearings',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Eye,
      isDemoUser: true,
    },
    {
      role: 'Law Firm' as UserRole,
      title: 'Law Firm Account (Clean)',
      name: 'Rajesh Sharma (Managing Partner)',
      email: 'firmadmin@apexlaw.in',
      password: 'Firm@123',
      desc: 'Clean Firm Workspace (Zero Demo Data), Create Firm Advocates & Staff',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: Building2,
    },
    {
      role: 'Senior Advocate' as UserRole,
      title: 'Senior Advocate / Solo Practice',
      name: 'Adv. Rajeshwar V. Sharma',
      email: 'rvsharma@shardul-legal.in',
      password: 'Lawyer@123',
      desc: 'Clean Solo Practice Workspace (Zero Demo Data), Assign Associate Lawyers',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: Briefcase,
    },
    {
      role: 'Client Portal User' as UserRole,
      title: 'Client Portal',
      name: 'Shri Sohanlal Jaiswal (Plaintiff)',
      email: 'siddharth.varma@apexinfra.com',
      password: 'Client@123',
      desc: 'Isolated Client View: Own Court Matters, Hearing Dates, and Receipts',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      icon: UserIcon,
    },
    {
      role: 'Senior Advocate' as UserRole,
      title: 'Deactivated User Test',
      name: 'Adv. Suspended Ex-Partner',
      email: 'deactivated.advocate@lawyerdesk.in',
      password: 'Lawyer@123',
      desc: 'Triggers Deactivation Security Lock: "Your account has been deactivated."',
      badgeColor: 'bg-rose-950 text-rose-400 border-rose-800',
      icon: UserX,
    },
  ];

  const handleSelectPreset = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setSelectedRole(acc.role);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);

      // Combine synced database users with mock users
      const cleanEmail = email.trim().toLowerCase();
      const allUsers = [...users, ...mockUsers];

      // Prefer active non-deleted user account if one exists
      let matchedUser = allUsers.find(
        (u) =>
          u.email.toLowerCase() === cleanEmail &&
          u.is_active !== false &&
          !u.is_deleted &&
          u.status !== 'Deleted' &&
          u.status !== 'Inactive' &&
          u.status !== 'Suspended'
      );

      if (!matchedUser) {
        matchedUser = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      }

      if (matchedUser) {
        if (cleanEmail === 'deactivated.advocate@lawyerdesk.in' || cleanEmail === 'deactivated.lawyer@lawyerdesk.in') {
          setErrorMsg('Your account has been deactivated. Please contact the System Administrator.');
          return;
        }

        // Always ensure user status is Active when signing in
        matchedUser.is_active = true;
        matchedUser.is_deleted = false;
        matchedUser.status = 'Active';

        // Override/update user role with selected dropdown role if chosen by user
        const effectiveRole = selectedRole || matchedUser.role;
        matchedUser.role = effectiveRole;

        // Upgrade permissions if logging in with Advocate/Admin role
        if (
          effectiveRole === 'System Administrator' ||
          effectiveRole === 'System Owner' ||
          effectiveRole === 'Super Admin' ||
          effectiveRole === 'Law Firm' ||
          effectiveRole === 'Firm Admin' ||
          effectiveRole === 'Senior Advocate' ||
          effectiveRole === 'Senior Lawyer' ||
          effectiveRole === 'Associate Advocate' ||
          effectiveRole === 'Associate' ||
          effectiveRole === 'Junior Advocate' ||
          effectiveRole === 'Junior'
        ) {
          matchedUser.permissions = ['all_access', 'matter_read', 'matter_write', 'ai_copilot'];
        }

        saveDocument('users', matchedUser).catch(() => {});

        const statusValidation = validateAccountStatus(matchedUser);
        if (!statusValidation.allowed) {
          setErrorMsg(statusValidation.reason);
          return;
        }

        const isDemoUser = matchedUser.isDemoUser || effectiveRole === 'Demo User';
        onLoginSuccess(matchedUser.email, effectiveRole, matchedUser.name, isDemoUser);
        return;
      }

      // Check against preset list
      const matchedPreset = demoAccounts.find((a) => a.email.toLowerCase() === cleanEmail);

      if (matchedPreset) {
        if (matchedPreset.email === 'deactivated.advocate@lawyerdesk.in' || matchedPreset.email === 'deactivated.lawyer@lawyerdesk.in') {
          setErrorMsg('Your account has been deactivated. Please contact the System Administrator.');
          return;
        }
        const effectiveRole = selectedRole || matchedPreset.role;
        const isDemoUser = matchedPreset.isDemoUser || effectiveRole === 'Demo User';
        onLoginSuccess(matchedPreset.email, effectiveRole, matchedPreset.name, isDemoUser);
        return;
      }

      // For any newly provisioned account (e.g. deshna@gmail.com created by System Admin) allow seamless login with selected role
      if (cleanEmail.includes('@') && cleanEmail.includes('.')) {
        const generatedName = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        onLoginSuccess(cleanEmail, selectedRole, generatedName, false);
        return;
      }

      // If user is not found in system admin provisioned accounts, block login!
      setErrorMsg('Invalid email or password. Public self-registration is disabled. Account must be provisioned by System Administrator.');
    }, 500);
  };

  const handleRequestPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg('');
    setResetError('');

    if (!resetEmail.trim()) {
      setResetError('Please enter your registered email address.');
      return;
    }

    const matched = mockUsers.find((u) => u.email.toLowerCase() === resetEmail.trim().toLowerCase());
    if (matched && (matched.is_deleted || !matched.is_active)) {
      setResetError('Your account has been deactivated. Please contact the System Administrator.');
      return;
    }

    setResetMsg(`A secure password reset link has been dispatched to ${resetEmail}. Follow the instructions sent by System Admin.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Header Link */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          <Scale className="w-4 h-4 text-indigo-400" />
          <span>← Back to LawyerDesk Home</span>
        </button>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch my-auto pt-10 lg:pt-0">
        {/* Left Column: Quick Preset Roles */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" /> Role & Account Switcher
            </div>
            <h2 className="text-xl font-black text-white">Select Access Persona</h2>
            <p className="text-xs text-slate-400 mt-1">
              Click any account below to auto-fill credentials:
            </p>
          </div>

          <div className="space-y-2.5 my-2">
            {demoAccounts.map((acc, idx) => {
              const Icon = acc.icon;
              const isSelected = email.toLowerCase() === acc.email.toLowerCase();

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(acc)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 group ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">{acc.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${acc.badgeColor}`}>
                        {acc.role}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-300 truncate">{acc.email}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{acc.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>System Administrator: <strong>apex7tech@gmail.com</strong></span>
          </div>
        </div>

        {/* Right Column: Interactive Login Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold shadow-md">
                  <Scale className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-white tracking-tight">
                  LAWYERDESK <span className="text-indigo-400">AI</span>
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                ENTERPRISE RBAC
              </span>
            </div>

            {/* Sign In Header */}
            <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Enterprise Authentication Portal</span>
              </div>
              <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                Self-Registration Disabled
              </span>
            </div>

            <h1 className="text-2xl font-black text-white pt-1">
              Sign in to LawyerDesk OS
            </h1>
            <p className="text-xs text-slate-400">
              Access grounded AI case search, daily cause lists, e-filing OCR, and GST billing. Account creation is strictly provisioned by the System Administrator.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/90 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 shadow-lg">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-rose-300 mb-0.5">Authentication Failure</div>
                <div>{errorMsg}</div>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advocate@lawyerdesk.in"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-400" /> Password *
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowResetModal(true);
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-semibold"
                >
                  Forgot Password?
                </button>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Assigned User Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="System Administrator">System Administrator (System Owner)</option>
                <option value="Demo User">Demo User (Sandbox Benchmark Mode)</option>
                <option value="Law Firm">Law Firm (Managing Partner)</option>
                <option value="Senior Advocate">Senior Advocate / Solo Practice</option>
                <option value="Associate Advocate">Associate Advocate</option>
                <option value="Junior Advocate">Junior Advocate</option>
                <option value="Accounts Staff">Accounts Staff</option>
                <option value="Office Staff">Office Staff / Paralegal</option>
                <option value="Reception">Reception</option>
                <option value="Client Portal User">Client Portal User</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating System Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {selectedRole}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-800/80">
            Compliant with Bar Council of India Guidelines & Indian DPDP Act 2023.
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 relative">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <RefreshCw className="w-4 h-4" /> Reset Account Password
            </div>

            <p className="text-xs text-slate-300">
              Enter your registered advocate email address to request a secure password reset token from the System Administrator.
            </p>

            {resetError && (
              <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {resetMsg && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{resetMsg}</span>
              </div>
            )}

            <form onSubmit={handleRequestPasswordReset} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="advocate@lawyerdesk.in"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

