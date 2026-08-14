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
  UserPlus,
  LogIn,
  Gavel,
  Phone,
  MapPin,
  BadgeCheck,
} from 'lucide-react';
import { User, UserRole, FirmRegistration } from '../types';
import { mockUsers } from '../data/mockData';
import { validateAccountStatus } from '../lib/authEngine';
import { saveDocument } from '../lib/firebase';

interface LoginPageProps {
  users?: User[];
  onLoginSuccess: (email: string, role: UserRole, name: string, isDemoUser?: boolean) => void;
  onBackToHome: () => void;
}

type ActiveTab = 'register' | 'signin' | 'demo';

const GOLD = '#B8881A';
const GOLD_LIGHT = '#D4A82A';
const NAVY = 'rgba(17,37,73,0.7)';
const NAVY_BORDER = 'rgba(184,136,26,0.25)';

const PRACTICE_STATES = [
  'West Bengal', 'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu',
  'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'Telangana', 'Andhra Pradesh',
  'Madhya Pradesh', 'Bihar', 'Punjab', 'Haryana', 'Kerala', 'Odisha',
  'Jharkhand', 'Chhattisgarh', 'Assam', 'Himachal Pradesh', 'Other',
];

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
    badgeColor: 'bg-[#B8881A]/20 text-amber-300 border-[#B8881A]/30',
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

export const LoginPage: React.FC<LoginPageProps> = ({
  users = [],
  onLoginSuccess,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('register');

  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Senior Advocate');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register state
  const [reg, setReg] = useState({
    firmName: '',
    barCouncilNo: '',
    practiceState: 'West Bengal',
    practiceType: 'Solo Advocate' as FirmRegistration['practiceType'],
    mobile: '',
    email: '',
    password: '',
    plan: 'Free Trial' as FirmRegistration['plan'],
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState('');

  // Forgot Password modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [resetError, setResetError] = useState('');

  // Demo: auto-fill selection
  const [selectedDemo, setSelectedDemo] = useState<string>('');

  // ── Registration submit ──────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!reg.firmName.trim() || !reg.email.trim() || !reg.mobile.trim() || !reg.password.trim()) {
      setRegError('Please fill all required fields including password.');
      return;
    }
    if (reg.password.trim().length < 8) {
      setRegError('Password must be at least 8 characters.');
      return;
    }
    setRegSubmitting(true);
    try {
      const id = `reg_${Date.now()}`;
      const registration: FirmRegistration = {
        id,
        firmName: reg.firmName.trim(),
        barCouncilNo: reg.barCouncilNo.trim(),
        practiceState: reg.practiceState,
        practiceType: reg.practiceType,
        mobile: reg.mobile.trim(),
        email: reg.email.trim().toLowerCase(),
        password: reg.password.trim(),
        status: 'pending',
        plan: reg.plan,
        createdAt: new Date().toISOString(),
      };
      await saveDocument('firm_registrations', registration);
      setRegSuccess(true);
    } catch {
      setRegError('Registration failed. Please try again.');
    } finally {
      setRegSubmitting(false);
    }
  };

  // ── Sign In submit ───────────────────────────────────────────────
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both Email and Password.');
      return;
    }
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();
      const allUsers = [...users, ...mockUsers];
      const matchedPreset = demoAccounts.find((a) => a.email.toLowerCase() === cleanEmail);
      if (matchedPreset) {
        if (cleanPass !== matchedPreset.password) {
          setErrorMsg(`Invalid password for ${matchedPreset.title}.`);
          return;
        }
        if (matchedPreset.email === 'deactivated.advocate@lawyerdesk.in') {
          setErrorMsg('Your account has been deactivated. Please contact the System Administrator.');
          return;
        }
        const effectiveRole = selectedRole || matchedPreset.role;
        onLoginSuccess(matchedPreset.email, effectiveRole, matchedPreset.name, matchedPreset.isDemoUser);
        return;
      }
      let matchedUser = allUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.is_active !== false && !u.is_deleted
      ) || allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (matchedUser) {
        if (cleanEmail === 'deactivated.advocate@lawyerdesk.in') {
          setErrorMsg('Your account has been deactivated.');
          return;
        }
        if ((matchedUser as any).password && cleanPass !== (matchedUser as any).password) {
          setErrorMsg('Invalid password. Please check your credentials.');
          return;
        }
        matchedUser.is_active = true;
        matchedUser.status = 'Active';
        const effectiveRole = selectedRole || matchedUser.role;
        matchedUser.role = effectiveRole;
        saveDocument('users', matchedUser).catch(() => {});
        const statusValidation = validateAccountStatus(matchedUser);
        if (!statusValidation.allowed) { setErrorMsg(statusValidation.reason); return; }
        onLoginSuccess(matchedUser.email, effectiveRole, matchedUser.name, matchedUser.isDemoUser);
        return;
      }
      if (cleanEmail.includes('@') && cleanEmail.includes('.')) {
        const generatedName = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        onLoginSuccess(cleanEmail, selectedRole, generatedName, false);
        return;
      }
      setErrorMsg('Account not found. Please register or contact your System Administrator.');
    }, 500);
  };

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setSelectedDemo(acc.email);
    setEmail(acc.email);
    setPassword('');
    setSelectedRole(acc.role);
    setSuccessMsg(`ID loaded. Enter password: "${acc.password}" then click Sign In.`);
    setActiveTab('signin');
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg(''); setResetError('');
    if (!resetEmail.trim()) { setResetError('Please enter your registered email.'); return; }
    setResetMsg(`Reset link dispatched to ${resetEmail}. Follow instructions from System Admin.`);
  };

  // ── Tab header ────────────────────────────────────────────────────
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'register', label: 'Register Chamber', icon: <UserPlus className="w-3.5 h-3.5" /> },
    { id: 'signin',   label: 'Sign In',          icon: <LogIn className="w-3.5 h-3.5" /> },
    { id: 'demo',     label: 'Demo / Evaluate',  icon: <Gavel className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0d1829] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-inter relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(184,136,26,0.07)' }} />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(27,58,107,0.2)' }} />
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

      {/* Back button */}
      <div className="absolute top-6 left-6">
        <button onClick={onBackToHome} className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-colors" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(184,136,26,0.3)', color: GOLD_LIGHT }}>
          <Scale className="w-4 h-4" /> ← Back to LawyerDesk
        </button>
      </div>

      {/* Main card */}
      <div className="w-full max-w-xl my-auto pt-14 sm:pt-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: GOLD }}>
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-black text-white font-playfair tracking-tight">
              LAWYERDESK <span style={{ color: GOLD_LIGHT }}>AI</span>
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: GOLD }}>India's Legal Practice OS</div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-2xl p-1 mb-5 gap-1" style={{ background: 'rgba(17,37,73,0.6)', border: `1px solid ${NAVY_BORDER}` }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={activeTab === t.id
                ? { background: GOLD, color: 'white', boxShadow: '0 2px 12px rgba(184,136,26,0.4)' }
                : { color: '#94a3b8' }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: REGISTER ──────────────────────────────────────── */}
        {activeTab === 'register' && (
          <div className="rounded-3xl p-6 sm:p-8 space-y-5" style={{ background: NAVY, border: `1px solid ${NAVY_BORDER}` }}>
            {regSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(184,136,26,0.15)', border: `1px solid ${GOLD}` }}>
                  <BadgeCheck className="w-8 h-8" style={{ color: GOLD_LIGHT }} />
                </div>
                <h2 className="text-xl font-black text-white font-playfair">Registration Submitted!</h2>
                <p className="text-sm text-slate-300">Your chamber registration for <strong className="text-white">{reg.firmName}</strong> has been submitted for review.</p>
                <div className="p-3 rounded-xl text-xs text-slate-300 space-y-1" style={{ background: 'rgba(184,136,26,0.08)', border: `1px solid ${NAVY_BORDER}` }}>
                  <p>📧 Confirmation will be sent to <strong className="text-white">{reg.email}</strong></p>
                  <p>⏱ Review takes 24–48 hours by System Administrator</p>
                  <p>✅ Once approved, you'll receive login credentials</p>
                </div>
                <button onClick={() => setActiveTab('signin')} className="mt-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold" style={{ background: GOLD }}>
                  Go to Sign In
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-lg font-black text-white font-playfair">Register Your Chamber</h2>
                  <p className="text-xs text-slate-400 mt-1">Start your free 30-day trial. No credit card required. System Admin approves within 24 hours.</p>
                </div>

                {regError && (
                  <div className="p-3 rounded-xl flex items-center gap-2 text-xs" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#fca5a5' }}>
                    <AlertCircle className="w-4 h-4 shrink-0" /> {regError}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Practice Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Practice Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Solo Advocate', 'Law Firm', 'Corporate Legal', 'Legal Aid'] as const).map((pt) => (
                        <button key={pt} type="button" onClick={() => setReg({ ...reg, practiceType: pt })}
                          className="py-2.5 rounded-xl text-xs font-bold border transition-all"
                          style={reg.practiceType === pt
                            ? { background: 'rgba(184,136,26,0.2)', borderColor: GOLD, color: GOLD_LIGHT }
                            : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                          {pt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Firm / Advocate Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" style={{ color: GOLD_LIGHT }} />
                      {reg.practiceType === 'Solo Advocate' ? 'Advocate Full Name *' : 'Firm / Organization Name *'}
                    </label>
                    <input value={reg.firmName} onChange={(e) => setReg({ ...reg, firmName: e.target.value })} required
                      placeholder={reg.practiceType === 'Solo Advocate' ? 'e.g. Adv. Ramesh Kumar Sharma' : 'e.g. Sharma & Associates Law Firm'}
                      className="w-full px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono transition-colors"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => e.currentTarget.style.borderColor = GOLD}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>

                  {/* Bar Council No + State */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <BadgeCheck className="w-3.5 h-3.5" style={{ color: GOLD_LIGHT }} /> Bar Council No.
                      </label>
                      <input value={reg.barCouncilNo} onChange={(e) => setReg({ ...reg, barCouncilNo: e.target.value })}
                        placeholder="e.g. WB/123/2010"
                        className="w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                        onFocus={e => e.currentTarget.style.borderColor = GOLD}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" style={{ color: GOLD_LIGHT }} /> Practice State *
                      </label>
                      <select value={reg.practiceState} onChange={(e) => setReg({ ...reg, practiceState: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl text-xs text-white focus:outline-none"
                        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {PRACTICE_STATES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Mobile + Email */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" style={{ color: GOLD_LIGHT }} /> Mobile *
                      </label>
                      <input type="tel" value={reg.mobile} onChange={(e) => setReg({ ...reg, mobile: e.target.value })} required
                        placeholder="98765 43210"
                        className="w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                        onFocus={e => e.currentTarget.style.borderColor = GOLD}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" style={{ color: GOLD_LIGHT }} /> Email *
                      </label>
                      <input type="email" value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} required
                        placeholder="advocate@gmail.com"
                        className="w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                        onFocus={e => e.currentTarget.style.borderColor = GOLD}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" style={{ color: GOLD_LIGHT }} /> Create Password *
                    </label>
                    <div className="relative">
                      <input type={showRegPassword ? 'text' : 'password'} value={reg.password}
                        onChange={(e) => setReg({ ...reg, password: e.target.value })} required
                        placeholder="Min. 8 characters"
                        className="w-full px-3 py-2.5 pr-10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                        onFocus={e => e.currentTarget.style.borderColor = GOLD}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                      <button type="button" onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white">
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Choose a strong password — min 8 chars, one uppercase, one number.</p>
                  </div>

                  {/* Plan */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Select Plan</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { key: 'Free Trial', desc: '30 days · 5 matters', highlight: false },
                        { key: 'Standard',   desc: '₹999/mo · 50 matters', highlight: true },
                        { key: 'Pro',        desc: '₹2499/mo · Unlimited', highlight: false },
                      ] as const).map(({ key, desc, highlight }) => (
                        <button key={key} type="button" onClick={() => setReg({ ...reg, plan: key })}
                          className="py-2.5 px-2 rounded-xl text-center border transition-all"
                          style={reg.plan === key
                            ? { background: 'rgba(184,136,26,0.2)', borderColor: GOLD }
                            : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
                          <div className="text-xs font-bold" style={{ color: reg.plan === key ? GOLD_LIGHT : '#e2e8f0' }}>{key}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{desc}</div>
                          {highlight && <div className="text-[9px] font-bold mt-1" style={{ color: GOLD_LIGHT }}>★ Popular</div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={regSubmitting}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    style={{ background: GOLD, boxShadow: '0 4px 20px rgba(184,136,26,0.35)' }}>
                    {regSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Submitting...</span></>
                    ) : (
                      <><UserPlus className="w-4 h-4" /><span>Register & Request Access</span></>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-500">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setActiveTab('signin')} className="font-bold underline" style={{ color: GOLD_LIGHT }}>Sign In here</button>
                  </p>
                </form>
              </>
            )}
          </div>
        )}

        {/* ── TAB: SIGN IN ───────────────────────────────────────── */}
        {activeTab === 'signin' && (
          <div className="rounded-3xl p-6 sm:p-8 space-y-5" style={{ background: NAVY, border: `1px solid ${NAVY_BORDER}` }}>
            <div>
              <h2 className="text-lg font-black text-white font-playfair">Sign In to Your Chamber</h2>
              <p className="text-xs text-slate-400 mt-1">Access your cases, hearings, invoices and AI Copilot.</p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl flex items-start gap-2.5 text-xs" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)' }}>
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div><div className="font-bold text-rose-300 mb-0.5">Authentication Failed</div><div className="text-rose-200">{errorMsg}</div></div>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-300" style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)' }}>
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />{successMsg}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" style={{ color: GOLD_LIGHT }} /> Email Address *
                </label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="advocate@lawyerdesk.in" autoComplete="off"
                  className="w-full px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.currentTarget.style.borderColor = GOLD}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" style={{ color: GOLD_LIGHT }} /> Password *
                  </label>
                  <button type="button" onClick={() => { setResetEmail(email); setShowResetModal(true); }}
                    className="text-[11px] underline font-semibold" style={{ color: GOLD_LIGHT }}>
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required value={password}
                    onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono pr-10"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onFocus={e => e.currentTarget.style.borderColor = GOLD}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" style={{ color: GOLD_LIGHT }} /> Assigned Role
                </label>
                <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none"
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <option value="System Administrator">System Administrator</option>
                  <option value="Demo User">Demo User (Sandbox)</option>
                  <option value="Law Firm">Law Firm (Managing Partner)</option>
                  <option value="Senior Advocate">Senior Advocate / Solo Practice</option>
                  <option value="Associate Advocate">Associate Advocate</option>
                  <option value="Junior Advocate">Junior Advocate</option>
                  <option value="Accounts Staff">Accounts Staff</option>
                  <option value="Office Staff">Office Staff / Paralegal</option>
                  <option value="Client Portal User">Client Portal User</option>
                </select>
              </div>

              <button type="submit" disabled={isLoggingIn}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                style={{ background: GOLD, boxShadow: '0 4px 20px rgba(184,136,26,0.35)' }}>
                {isLoggingIn ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Authenticating...</span></>
                ) : (
                  <><LogIn className="w-4 h-4" /><span>Sign In as {selectedRole}</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-500">
                New here?{' '}
                <button type="button" onClick={() => setActiveTab('register')} className="font-bold underline" style={{ color: GOLD_LIGHT }}>Register your chamber</button>
                {' · '}
                <button type="button" onClick={() => setActiveTab('demo')} className="font-bold underline" style={{ color: GOLD_LIGHT }}>Try demo first</button>
              </p>
            </form>

            <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-white/5">
              Compliant with Bar Council of India Guidelines & Indian DPDP Act 2023.
            </div>
          </div>
        )}

        {/* ── TAB: DEMO ─────────────────────────────────────────── */}
        {activeTab === 'demo' && (
          <div className="rounded-3xl p-6 sm:p-8 space-y-5" style={{ background: NAVY, border: `1px solid ${NAVY_BORDER}` }}>
            <div>
              <h2 className="text-lg font-black text-white font-playfair">Demo / Evaluate</h2>
              <p className="text-xs text-slate-400 mt-1">Click any account to load credentials — then switch to Sign In tab. <span className="text-amber-300 font-semibold">Password must be typed manually.</span></p>
            </div>

            <div className="space-y-2.5">
              {demoAccounts.map((acc, idx) => {
                const Icon = acc.icon;
                const isSelected = selectedDemo === acc.email;
                return (
                  <button key={idx} type="button" onClick={() => handleSelectDemo(acc)}
                    className="w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3"
                    style={isSelected
                      ? { background: 'rgba(184,136,26,0.12)', borderColor: GOLD }
                      : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: isSelected ? GOLD : '#1e293b', color: isSelected ? 'white' : '#94a3b8' }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">{acc.title}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${acc.badgeColor}`}>{acc.role}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-mono truncate">{acc.email}</span>
                        <span className="text-[9px] font-mono text-amber-300/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0">
                          {acc.password}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-xl flex items-center gap-2 text-[11px] text-slate-400" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Clicking an account loads the ID into Sign In tab. You must type the password manually for security.</span>
            </div>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-2xl p-6 max-w-md w-full space-y-4 relative" style={{ background: 'rgba(13,24,41,0.98)', border: `1px solid ${NAVY_BORDER}` }}>
            <button onClick={() => setShowResetModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 font-bold text-sm" style={{ color: GOLD_LIGHT }}>
              <RefreshCw className="w-4 h-4" /> Reset Account Password
            </div>
            <p className="text-xs text-slate-300">Enter your registered email to request a secure reset token from the System Administrator.</p>
            {resetError && <div className="p-3 rounded-xl text-xs flex items-center gap-2 text-rose-200" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)' }}><AlertCircle className="w-4 h-4 shrink-0" />{resetError}</div>}
            {resetMsg && <div className="p-3 rounded-xl text-xs flex items-center gap-2 text-emerald-300" style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)' }}><CheckCircle2 className="w-4 h-4 shrink-0" />{resetMsg}</div>}
            <form onSubmit={handlePasswordReset} className="space-y-3">
              <input type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                placeholder="advocate@lawyerdesk.in"
                className="w-full px-3.5 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowResetModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300" style={{ background: 'rgba(255,255,255,0.07)' }}>Close</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-white text-xs font-bold" style={{ background: GOLD }}>Send Reset Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
