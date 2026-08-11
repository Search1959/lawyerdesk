import React, { useState, useEffect } from 'react';
import {
  Building2, CheckCircle2, XCircle, Clock, Search,
  Phone, Mail, MapPin, BadgeCheck, Filter, RefreshCw,
  Users, TrendingUp, AlertCircle, Eye,
} from 'lucide-react';
import { FirmRegistration } from '../types';
import { subscribeCollection, saveDocument } from '../lib/firebase';

const GOLD = '#B8881A';
const GOLD_LIGHT = '#D4A82A';

const STATUS_STYLES = {
  pending:  { bg: 'rgba(217,119,6,0.15)',  border: 'rgba(217,119,6,0.4)',  text: '#fbbf24', label: 'Pending Review' },
  approved: { bg: 'rgba(5,150,105,0.15)',  border: 'rgba(5,150,105,0.4)',  text: '#34d399', label: 'Approved' },
  rejected: { bg: 'rgba(220,38,38,0.12)',  border: 'rgba(220,38,38,0.35)', text: '#f87171', label: 'Rejected' },
};

const PLAN_BADGE: Record<string, string> = {
  'Free Trial': 'bg-slate-700 text-slate-300',
  'Standard':   'bg-emerald-900/60 text-emerald-300',
  'Pro':        'bg-amber-900/60 text-amber-300',
};

export const FirmRegistryView: React.FC = () => {
  const [registrations, setRegistrations] = useState<FirmRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | FirmRegistration['status']>('all');
  const [selectedReg, setSelectedReg] = useState<FirmRegistration | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    const unsub = subscribeCollection<FirmRegistration>(
      'firm_registrations',
      (data) => { setRegistrations(data); setLoading(false); },
      []
    );
    return unsub;
  }, []);

  const stats = {
    total:    registrations.length,
    pending:  registrations.filter((r) => r.status === 'pending').length,
    approved: registrations.filter((r) => r.status === 'approved').length,
    rejected: registrations.filter((r) => r.status === 'rejected').length,
  };

  const filtered = registrations.filter((r) => {
    const matchSearch =
      r.firmName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.mobile.includes(search);
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleApprove = async (reg: FirmRegistration) => {
    const updated: FirmRegistration = {
      ...reg,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'System Administrator',
    };
    await saveDocument('firm_registrations', updated);
    setActionMsg(`✅ ${reg.firmName} approved. Login credentials can now be sent.`);
    setSelectedReg(null);
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleReject = async (reg: FirmRegistration) => {
    if (!rejectReason.trim()) { setRejectReason(''); return; }
    const updated: FirmRegistration = {
      ...reg,
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'System Administrator',
      rejectReason: rejectReason.trim(),
    };
    await saveDocument('firm_registrations', updated);
    setActionMsg(`❌ ${reg.firmName} rejected.`);
    setSelectedReg(null);
    setRejectReason('');
    setTimeout(() => setActionMsg(''), 4000);
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white font-playfair">Chamber Registry</h1>
          <p className="text-sm text-slate-400 mt-1">Review and approve new law firm / advocate registrations</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
          style={{ background: 'rgba(184,136,26,0.12)', border: `1px solid rgba(184,136,26,0.3)`, color: GOLD_LIGHT }}>
          <BadgeCheck className="w-4 h-4" /> System Admin Only
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
          { label: 'Total Registrations', value: stats.total,    icon: Users,       color: GOLD_LIGHT },
          { label: 'Pending Review',       value: stats.pending,  icon: Clock,       color: '#fbbf24' },
          { label: 'Approved',             value: stats.approved, icon: CheckCircle2,color: '#34d399' },
          { label: 'Rejected',             value: stats.rejected, icon: XCircle,     color: '#f87171' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-2xl"
            style={{ background: 'rgba(17,37,73,0.5)', border: '1px solid rgba(184,136,26,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-xs text-slate-400 font-semibold">{label}</span>
            </div>
            <div className="text-3xl font-black text-white">{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or mobile..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
            onFocus={e => e.currentTarget.style.borderColor = GOLD}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="px-3 py-2 rounded-lg text-xs font-bold capitalize transition-all"
              style={filterStatus === s
                ? { background: GOLD, color: 'white' }
                : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
              {s === 'all' ? `All (${stats.total})` : s === 'pending' ? `Pending (${stats.pending})` : s === 'approved' ? `Approved (${stats.approved})` : `Rejected (${stats.rejected})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: GOLD }} />
          <p>Loading registrations...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(17,37,73,0.3)', border: '1px solid rgba(184,136,26,0.1)' }}>
          <TrendingUp className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <p className="text-slate-400 font-semibold">No registrations found</p>
          <p className="text-slate-500 text-sm mt-1">New registrations from the login page will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((reg) => {
            const s = STATUS_STYLES[reg.status];
            return (
              <div key={reg.id} className="p-4 rounded-2xl transition-all"
                style={{ background: 'rgba(17,37,73,0.45)', border: '1px solid rgba(184,136,26,0.12)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Building2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                      <span className="font-bold text-white text-sm truncate">{reg.firmName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
                        {s.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PLAN_BADGE[reg.plan] || 'bg-slate-700 text-slate-300'}`}>
                        {reg.plan}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" style={{ color: GOLD }} />
                        {reg.practiceType}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" style={{ color: GOLD }} />
                        {reg.practiceState}
                      </span>
                      {reg.barCouncilNo && (
                        <span className="flex items-center gap-1 font-mono">
                          Bar: {reg.barCouncilNo}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {reg.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {reg.mobile}
                      </span>
                      <span className="text-slate-500">Registered: {fmt(reg.createdAt)}</span>
                    </div>

                    {reg.rejectReason && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-300">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        Reject reason: {reg.rejectReason}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setSelectedReg(reg)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                      <Eye className="w-3.5 h-3.5" /> Review
                    </button>
                    {reg.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(reg)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
                          style={{ background: '#059669' }}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => setSelectedReg(reg)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
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
      )}

      {/* Detail / Action Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-2xl p-6 w-full max-w-lg space-y-5 relative"
            style={{ background: 'rgba(11,19,43,0.98)', border: `1px solid rgba(184,136,26,0.3)` }}>
            <button onClick={() => { setSelectedReg(null); setRejectReason(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <XCircle className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-white font-playfair">{selectedReg.firmName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: STATUS_STYLES[selectedReg.status].bg, border: `1px solid ${STATUS_STYLES[selectedReg.status].border}`, color: STATUS_STYLES[selectedReg.status].text }}>
                  {STATUS_STYLES[selectedReg.status].label}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${PLAN_BADGE[selectedReg.plan] || ''}`}>
                  {selectedReg.plan}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { label: 'Practice Type', value: selectedReg.practiceType },
                { label: 'Practice State', value: selectedReg.practiceState },
                { label: 'Bar Council No.', value: selectedReg.barCouncilNo || '—' },
                { label: 'Registered On', value: fmt(selectedReg.createdAt) },
                { label: 'Email', value: selectedReg.email },
                { label: 'Mobile', value: selectedReg.mobile },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-slate-500 mb-0.5">{label}</div>
                  <div className="text-white font-semibold font-mono">{value}</div>
                </div>
              ))}
            </div>

            {selectedReg.status === 'pending' && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <p className="text-xs text-slate-400 font-semibold">Take action on this registration:</p>
                <button onClick={() => handleApprove(selectedReg)}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
                  style={{ background: '#059669' }}>
                  <CheckCircle2 className="w-4 h-4" /> Approve — Grant Access
                </button>

                <div className="space-y-2">
                  <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Rejection reason (required before rejecting)..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(220,38,38,0.3)' }} />
                  <button onClick={() => handleReject(selectedReg)} disabled={!rejectReason.trim()}
                    className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                    style={{ background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)', color: '#f87171' }}>
                    <XCircle className="w-4 h-4" /> Reject Registration
                  </button>
                </div>
              </div>
            )}

            {selectedReg.status !== 'pending' && selectedReg.reviewedAt && (
              <div className="pt-2 border-t border-white/10 text-xs text-slate-400">
                Reviewed by <strong className="text-slate-300">{selectedReg.reviewedBy}</strong> on {fmt(selectedReg.reviewedAt)}
                {selectedReg.rejectReason && (
                  <div className="mt-1 text-rose-300">Reason: {selectedReg.rejectReason}</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
