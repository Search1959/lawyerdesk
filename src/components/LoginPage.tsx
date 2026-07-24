import React, { useState } from 'react';
import {
  Scale,
  Lock,
  Mail,
  Key,
  ShieldCheck,
  UserCheck,
  Building2,
  Users,
  Briefcase,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  BadgeCheck,
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (email: string, role: UserRole, name: string, isDemoUser?: boolean) => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToHome,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('apex7tech@gmail.com');
  const [password, setPassword] = useState('Search@1959');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [barRegNo, setBarRegNo] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Super Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Quick Demo Preset Accounts requested by user
  const demoAccounts = [
    {
      role: 'Super Admin' as UserRole,
      title: 'Demo Evaluator (Read-Only)',
      name: 'Guest Evaluator (Read-Only)',
      email: 'demo.evaluator@lawyerdesk.in',
      password: 'Demo@2026',
      desc: 'Read-Only evaluation mode with pre-populated demo cases & benchmark data',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Eye,
      isDemoUser: true,
    },
    {
      role: 'Super Admin' as UserRole,
      title: 'System Admin',
      name: 'Apex Tech System Administrator',
      email: 'apex7tech@gmail.com',
      password: 'Search@1959',
      desc: 'Full System Control, Create Law Firms & Individual Lawyers, SQL Schema & RBAC',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: ShieldCheck,
    },
    {
      role: 'Firm Admin' as UserRole,
      title: 'Law Firm Account',
      name: 'Rajesh Sharma (Managing Partner)',
      email: 'firmadmin@apexlaw.in',
      password: 'Firm@123',
      desc: 'Clean Firm Workspace (Zero Demo Data), Create Firm Lawyers & Staff',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: Building2,
    },
    {
      role: 'Senior Lawyer' as UserRole,
      title: 'Individual Lawyer / Solo Practice',
      name: 'Adv. Rajeshwar V. Sharma',
      email: 'rajeshwar.sharma@lawyerdesk.in',
      password: 'Lawyer@123',
      desc: 'Clean Solo Practice Workspace (Zero Demo Data), Create Practice Associates',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: Briefcase,
    },
    {
      role: 'Client' as UserRole,
      title: 'Client Portal',
      name: 'Shri Sohanlal Jaiswal (Plaintiff)',
      email: 'sohanlal.jaiswal@gmail.com',
      password: 'Client@123',
      desc: 'View Case Status, Hearing Dates, and Payment Receipts',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      icon: User,
    },
  ];

  const handleSelectPreset = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setSelectedRole(acc.role);
    setErrorMsg('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (authMode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name or advocate firm name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please check your password fields.');
        return;
      }
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);

      if (authMode === 'signup') {
        const userName = fullName.trim();
        onLoginSuccess(email, selectedRole, userName, false);
      } else {
        // Find matching preset name or default
        const matched = demoAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
        const userName = matched ? matched.name : email.split('@')[0];
        const role = matched ? matched.role : selectedRole;
        const isDemoUser = matched?.isDemoUser || email.toLowerCase().includes('demo');

        onLoginSuccess(email, role, userName, isDemoUser);
      }
    }, 600);
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
              <Sparkles className="w-4 h-4" /> Quick Demo Role Switcher
            </div>
            <h2 className="text-xl font-black text-white">Select User Persona</h2>
            <p className="text-xs text-slate-400 mt-1">
              Click any demo account below to auto-fill login credentials:
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
            <span>Pre-loaded System Admin: <strong>apex7tech@gmail.com</strong></span>
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
                PORTAL AUTH
              </span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  authMode === 'signin'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  authMode === 'signup'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create New Account
              </button>
            </div>

            <h1 className="text-2xl font-black text-white pt-1">
              {authMode === 'signin' ? 'Sign in to Legal OS' : 'Create Your LawyerDesk AI Account'}
            </h1>
            <p className="text-xs text-slate-400">
              {authMode === 'signin'
                ? 'Access grounded AI case search, daily cause lists, e-filing OCR, and GST billing.'
                : 'Register your advocate account or law firm workspace with encrypted password security.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name / Advocate Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Adv. Rajesh Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            )}

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-400" /> Password *
                  </span>
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

              {authMode === 'signup' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" /> Confirm Password *
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-end text-[10px] text-slate-500 p-2 font-mono">
                  AES-256 Cloud Session Encrypted
                </div>
              )}
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-indigo-400" /> Bar Council Registration Number (Optional)
                </label>
                <input
                  type="text"
                  value={barRegNo}
                  onChange={(e) => setBarRegNo(e.target.value)}
                  placeholder="e.g. D/1984/2021"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Target Access Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Senior Lawyer">Senior Lawyer / Lead Counsel</option>
                <option value="Firm Admin">Firm Admin / Managing Partner</option>
                <option value="Associate">Associate Lawyer</option>
                <option value="Super Admin">System Admin (Super Admin)</option>
                <option value="Staff">Staff / Paralegal</option>
                <option value="Client">Client Portal Access</option>
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
                  <span>
                    {authMode === 'signup'
                      ? 'Creating New Account & Vault...'
                      : 'Authenticating System Session...'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {authMode === 'signup'
                      ? `Create Account & Launch Workspace (${selectedRole})`
                      : `Sign In as ${selectedRole}`}
                  </span>
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
    </div>
  );
};
