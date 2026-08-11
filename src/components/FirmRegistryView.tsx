import React, { useState, useEffect } from 'react';
import {
  Building2, CheckCircle2, XCircle, Clock, Search,
  Phone, Mail, MapPin, BadgeCheck, Filter, RefreshCw,
  Users, AlertCircle, Eye, ShieldCheck, Briefcase,
  UserCheck, Crown, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { FirmRegistration, LawFirm, User } from '../types';
import { subscribeCollection, saveDocument } from '../lib/firebase';
import { mockUsers } from '../data/mockData';

const GOLD = '#B8881A';
const GOLD_LIGHT = '#D4A82A';

const STATUS_STYLES = {
  pending:  { bg: 'rgba(217,119,6,0.15)',  border: 'rgba(217,119,6,0.4)',  text: '#fbbf24', label: 'Pending Review' },
  approved: { bg: 'rgba(5,150,105,0.15)',  border: 'rgba(5,150,105,0.4)',  text: '#34d399', label: 'Approved' },
  rejected: { bg: 'rgba(220,38,38,0.12)',  border: 'rgba(220,38,38,0.35)', text: '#f87171', label: 'Rejected' },
  Active:   { bg: 'rgba(5,150,105,0.15)',  border: 'rgba(5,150,105,0.4)',  text: '#34d399', label: 'Active' },
  Suspended:{ bg: 'rgba(220,38,38,0.12)',  border: 'rgba(220,38,38,0.35)', text: '#f87171', label: 'Suspended' },
  Inactive: { bg: 'rgba(100,116,139,0.15)',border: 'rgba(100,116,139,0.4)',text: '#94a3b8', label: 'Inactive' },
};

const PLAN_BADGE: Record<string, string> = {
  'Free Trial':          'bg-slate-700/80 text-slate-300',
  'Standard':            'bg-emerald-900/60 text-emerald-300',
  'Pro':                 'bg-amber-900/60 text-amber-300',
  'Enterprise Unlimited':'bg-purple-900/60 text-purple-300',
  'Partner Suite':       'bg-blue-900/60 text-blue-300',
  'Standard Firm':       'bg-emerald-900/60 text-emerald-300',
};

type ViewTab = 'all_firms' | 'all_users' | 'new_registrations';

export const FirmRegistryView: React.FC = () => {
  const [viewTab, setViewTab]               = useState<ViewTab>('all_firms');
  const [registrations, setRegistrations]   = useState<FirmRegistration[]>([]);
  const [firms, setFirms]                   = useState<LawFirm[]>([]);
  const [users, setUsers]                   = useState<User[]>([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState('');
  const [filterStatus, setFilterStatus]     = useState<string>('all');
  const [selectedReg, setSelectedReg]       = useState<FirmRegistration | null>(null);
  const [rejectReason, setRejectReason]     = useState('');
  const [actionMsg, setActionMsg]           = useState('');

  useEffect(() => {
    let loaded = 0;
    const done = () => { loaded++; if (loaded >= 3) setLoading(false); };

    const u1 = subscribeCollection<FirmRegistration>('firm_registrations', (d) => { setRegistrations(d); done(); }, []);
    const u2 = subscribeCollection<LawFirm>('firms', (d) => { setFirms(d); done(); }, []);
    const u3 = subscribeCollection<User>('users', (d) => {
      // Merge Firestore users with mockUsers, deduplicate by email
      const merged = [...d];
      mockUsers.forEach((mu) => {
        if (!merged.find((u) => u.email.toLowerCase() === mu.email.toLowerCase())) merged.push(mu);
      });
      setUsers(merged);
      done();
    }, mockUsers);

    return () => { u1(); u2(); u3(); };
  }, []);

  const pendingCount = registrations.filter((r) => r.status === 'pending').length;

  const stats = {
    firms:    firms.length,
    users:    users.length,
    pending:  pendingCount,
    approved: registrations.filter((r) => r.status === 'approved').length,
  };

  const fmt = (iso?: string) => iso
    ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  const handleApprove = async (reg: FirmRegistration) => {
    await saveDocument('firm_registrations', { ...reg, status: 'approved', reviewedAt: new Date().toISOString(), reviewedBy: 'System Administrator' });
    setActionMsg(`✅ ${reg.firmName} approved.`);
    setSelectedReg(null);
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleReject = async (reg: FirmRegistration) => {
    if (!rejectReason.trim()) return;
    await saveDocument('firm_registrations', { ...reg, status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: 'System Administrator', rejectReason: rejectReason.trim() });
    setActionMsg(`❌ ${reg.firmName} rejected.`);
    setSelectedReg(null);
    setRejectReason('');
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleToggleFirmStatus = async (firm: LawFirm) => {
    const newStatus = firm.status === 'Active' ? 'Suspended' : 'Active';
    await saveDocument('firms', { ...firm, status: newStatus, is_active: newStatus === 'Active' });
    setActionMsg(`${newStatus === 'Active' ? '✅' : '⏸'} ${firm.name} ${newStatus}.`);
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleToggleUserStatus = async (user: User) => {
    const isActive = user.is_active !== false;
    await saveDocument('users', { ...user, is_active: !isActive, status: !isActive ? 'Active' : 'Inactive' });
    setActionMsg(`${!isActive ? '✅' : '⏸'} ${user.name} ${!isActive ? 'activated' : 'deactivated'}.`);
    setTimeout(() => setActionMsg(''), 3000);
  };

  // ── Filtered data per tab ────────────────────────────────────────
  const filteredFirms = firms.filter((f) => {
    const s = search.toLowerCase();
    const matchSearch = f.name.toLowerCase().includes(s) || (f.managingPartner || '').toLowerCase().includes(s) || (f.gstin || '').toLowerCase().includes(s);
    const matchStatus = filterStatus === 'all' || (f.status || 'Active') === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.role.toLowerCase().includes(s);
    const matchStatus = filterStatus === 'all' || (u.status || 'Active') === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredRegs = registrations.filter((r) => {
    const s = search.toLowerCase();
    const matchSearch = r.firmName.toLowerCase().includes(s) || r.email.toLowerCase().includes(s) || r.mobile.includes(s);
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const ROLE_ICON: Record<string, React.ReactNode> = {
    'System Administrator': <Crown className="w-3.5 h-3.5 text-rose-400" />,
    'System Owner':         <Crown className="w-3.5 h-3.5 text-rose-400" />,
    'Super Admin':          <Crown className="w-3.5 h-3.5 text-rose-400" />,
    'Law Firm':             <Building2 className="w-3.5 h-3.5 text-emerald-400" />,
    'Senior Advocate':      <Briefcase className="w-3.5 h-3.5" style={{ color: GOLD }} />,
    'Associate Advocate':   <UserCheck className="w-3.5 h-3.5 text-sky-400" />,
  };

  const viewTabs: { id: ViewTab; label: string; count: number }[] = [
    { id: 'all_firms',         label: 'Registered Firms',   count: stats.firms },
    { id: 'all_users',         label: 'All Users / Accounts', count: stats.users },
    { id: 'new_registrations', label: 'New Registrations',  count: pendingCount },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white font-playfair">Chamber Registry</h1>
          <p className="text-sm text-slate-400 mt-1">All registered firms, advocate accounts, and new sign-up requests</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
          style={{ background: 'rgba(184,136,26,0.12)', border: `1px solid rgba(184,136,26,0.3)`, color: GOLD_LIGHT }}>
          <ShieldCheck className="w-4 h-4" /> System Admin Only
        </div>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div className="p-3.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'rgba(184,136,26,0.15)', border: `1px solid rgba(184,136,26,0.4)` }}>
          {actionMsg}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Firms',      value: stats.firms,    icon: Building2,   color: GOLD_LIGHT },
          { label: 'Total Users',      value: stats.users,    icon: Users,       color: '#60a5fa' },
          { label: 'Pending Signups',  value: stats.pending,  icon: Clock,       color: '#fbbf24' },
          { label: 'Approved Signups', value: stats.approved, icon: CheckCircle2,color: '#34d399' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-2xl"
            style={{ background: 'rgba(17,37,73,0.5)', border: '1px solid rgba(184,136,26,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-xs text-slate-400 font-semibold">{label}</span>
            </div>
            <div className="text-3xl font-black text-white">{loading ? '…' : value}</div>
          </div>
        ))}
      </div>

      {/* View tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(17,37,73,0.5)', border: '1px solid rgba(184,136,26,0.15)' }}>
        {viewTabs.map((t) => (
          <button key={t.id} onClick={() => { setViewTab(t.id); setSearch(''); setFilterStatus('all'); }}
            className="flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            style={viewTab === t.id
              ? { background: GOLD, color: 'white' }
              : { color: '#94a3b8' }}>
            {t.label}
            {t.count > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black"
                style={viewTab === t.id ? { background: 'rgba(255,255,255,0.25)' } : { background: 'rgba(184,136,26,0.2)', color: GOLD_LIGHT }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={viewTab === 'all_firms' ? 'Search firms by name, partner, GSTIN…' : viewTab === 'all_users' ? 'Search by name, email, role…' : 'Search by name, email, mobile…'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
            onFocus={e => e.currentTarget.style.borderColor = GOLD}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {(viewTab === 'new_registrations'
            ? ['all', 'pending', 'approved', 'rejected']
            : ['all', 'Active', 'Suspended', 'Inactive']
          ).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
              style={filterStatus === s
                ? { background: GOLD, color: 'white' }
                : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* ── TABLE: REGISTERED FIRMS ─────────────────────────── */}
      {viewTab === 'all_firms' && (
        loading ? <LoadingSpinner /> : filteredFirms.length === 0 ? <EmptyState text="No firms found" sub="Firms registered in the system appear here" /> : (
          <div className="space-y-3">
            {filteredFirms.map((firm) => {
              const status = firm.status || 'Active';
              const s = STATUS_STYLES[status as keyof typeof STATUS_STYLES] || STATUS_STYLES['Active'];
              return (
                <div key={firm.id} className="p-4 rounded-2xl"
                  style={{ background: 'rgba(17,37,73,0.45)', border: '1px solid rgba(184,136,26,0.12)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Building2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                        <span className="font-bold text-white text-sm">{firm.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{s.label}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PLAN_BADGE[firm.plan] || 'bg-slate-700 text-slate-300'}`}>{firm.plan}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                        {firm.managingPartner && <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" /> {firm.managingPartner}</span>}
                        {firm.gstin && <span className="font-mono">GSTIN: {firm.gstin}</span>}
                        {firm.barRegistrationNo && <span>Bar: {firm.barRegistrationNo}</span>}
                        <span>Code: <span className="font-mono text-slate-300">{firm.code}</span></span>
                        <span>Storage: {firm.storageUsedGB}GB / {firm.storageQuotaGB}GB</span>
                        <span>Since: {fmt(firm.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleToggleFirmStatus(firm)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                        style={status === 'Active'
                          ? { background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171' }
                          : { background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.3)', color: '#34d399' }}>
                        {status === 'Active' ? <><ToggleRight className="w-4 h-4" /> Suspend</> : <><ToggleLeft className="w-4 h-4" /> Activate</>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ── TABLE: ALL USERS ────────────────────────────────── */}
      {viewTab === 'all_users' && (
        loading ? <LoadingSpinner /> : filteredUsers.length === 0 ? <EmptyState text="No users found" sub="All provisioned accounts appear here" /> : (
          <div className="space-y-2">
            {filteredUsers.map((user) => {
              const isActive = user.is_active !== false && user.status !== 'Inactive' && user.status !== 'Suspended';
              const statusKey = isActive ? 'Active' : 'Inactive';
              const s = STATUS_STYLES[statusKey as keyof typeof STATUS_STYLES];
              return (
                <div key={user.id} className="p-3.5 rounded-2xl"
                  style={{ background: 'rgba(17,37,73,0.4)', border: '1px solid rgba(184,136,26,0.1)' }}>
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
                      style={{ background: user.role === 'System Administrator' || user.role === 'Super Admin' ? '#dc2626' : user.role === 'Law Firm' ? '#059669' : GOLD }}>
                      {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {ROLE_ICON[user.role] || <UserCheck className="w-3.5 h-3.5 text-slate-400" />}
                        <span className="font-bold text-white text-xs">{user.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{statusKey}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300">{user.role}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
                        <span className="font-mono">{user.email}</span>
                        {(user as any).phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{(user as any).phone}</span>}
                        {user.firmId && <span>Firm: {user.firmId}</span>}
                      </div>
                    </div>
                    <button onClick={() => handleToggleUserStatus(user)}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                      style={isActive
                        ? { background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#f87171' }
                        : { background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.25)', color: '#34d399' }}>
                      {isActive ? <><ToggleRight className="w-3.5 h-3.5" /> Deactivate</> : <><ToggleLeft className="w-3.5 h-3.5" /> Activate</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ── TABLE: NEW REGISTRATIONS ────────────────────────── */}
      {viewTab === 'new_registrations' && (
        loading ? <LoadingSpinner /> : filteredRegs.length === 0 ? (
          <EmptyState text="No registrations found" sub="New self-registrations from the login page appear here" />
        ) : (
          <div className="space-y-3">
            {filteredRegs.map((reg) => {
              const s = STATUS_STYLES[reg.status];
              return (
                <div key={reg.id} className="p-4 rounded-2xl"
                  style={{ background: 'rgba(17,37,73,0.45)', border: '1px solid rgba(184,136,26,0.12)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Building2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                        <span className="font-bold text-white text-sm">{reg.firmName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{s.label}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PLAN_BADGE[reg.plan] || 'bg-slate-700 text-slate-300'}`}>{reg.plan}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3" style={{ color: GOLD }} />{reg.practiceType}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: GOLD }} />{reg.practiceState}</span>
                        {reg.barCouncilNo && <span className="font-mono">Bar: {reg.barCouncilNo}</span>}
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{reg.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{reg.mobile}</span>
                        <span className="text-slate-500">Applied: {fmt(reg.createdAt)}</span>
                      </div>
                      {reg.rejectReason && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-300">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {reg.rejectReason}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setSelectedReg(reg)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                        <Eye className="w-3.5 h-3.5" /> Review
                      </button>
                      {reg.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(reg)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                            style={{ background: '#059669' }}>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => setSelectedReg(reg)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171' }}>
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Detail / Reject Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-2xl p-6 w-full max-w-lg space-y-5 relative"
            style={{ background: 'rgba(11,19,43,0.98)', border: `1px solid rgba(184,136,26,0.3)` }}>
            <button onClick={() => { setSelectedReg(null); setRejectReason(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"><XCircle className="w-5 h-5" /></button>
            <div>
              <h3 className="text-lg font-black text-white font-playfair">{selectedReg.firmName}</h3>
              <div className="flex gap-2 mt-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: STATUS_STYLES[selectedReg.status].bg, border: `1px solid ${STATUS_STYLES[selectedReg.status].border}`, color: STATUS_STYLES[selectedReg.status].text }}>
                  {STATUS_STYLES[selectedReg.status].label}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${PLAN_BADGE[selectedReg.plan] || ''}`}>{selectedReg.plan}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                ['Practice Type', selectedReg.practiceType],
                ['Practice State', selectedReg.practiceState],
                ['Bar Council No.', selectedReg.barCouncilNo || '—'],
                ['Applied On', fmt(selectedReg.createdAt)],
                ['Email', selectedReg.email],
                ['Mobile', selectedReg.mobile],
              ].map(([label, value]) => (
                <div key={label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-slate-500 mb-0.5">{label}</div>
                  <div className="text-white font-semibold font-mono">{value}</div>
                </div>
              ))}
            </div>
            {selectedReg.status === 'pending' && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <button onClick={() => handleApprove(selectedReg)}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
                  style={{ background: '#059669' }}>
                  <CheckCircle2 className="w-4 h-4" /> Approve — Grant Access
                </button>
                <div className="space-y-2">
                  <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Rejection reason (required)…" rows={2}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(220,38,38,0.3)' }} />
                  <button onClick={() => handleReject(selectedReg)} disabled={!rejectReason.trim()}
                    className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                    style={{ background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)', color: '#f87171' }}>
                    <XCircle className="w-4 h-4" /> Reject Registration
                  </button>
                </div>
              </div>
            )}
            {selectedReg.status !== 'pending' && selectedReg.reviewedAt && (
              <div className="pt-2 border-t border-white/10 text-xs text-slate-400">
                Reviewed by <strong className="text-slate-300">{selectedReg.reviewedBy}</strong> on {fmt(selectedReg.reviewedAt)}
                {selectedReg.rejectReason && <div className="mt-1 text-rose-300">Reason: {selectedReg.rejectReason}</div>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Helper components ────────────────────────────────────────────────
const LoadingSpinner = () => (
  <div className="text-center py-16 text-slate-400">
    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: '#B8881A' }} />
    <p>Loading data…</p>
  </div>
);

const EmptyState = ({ text, sub }: { text: string; sub: string }) => (
  <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(17,37,73,0.3)', border: '1px solid rgba(184,136,26,0.1)' }}>
    <Users className="w-12 h-12 mx-auto mb-3 text-slate-600" />
    <p className="text-slate-400 font-semibold">{text}</p>
    <p className="text-slate-500 text-sm mt-1">{sub}</p>
  </div>
);
