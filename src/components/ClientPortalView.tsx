import React, { useState } from 'react';
import {
  User, Folder, Calendar, FileText, CreditCard, Download,
  CheckCircle2, Clock, ShieldCheck, ChevronRight, Phone,
  MessageSquare, Scale, Gavel, AlertCircle, IndianRupee,
  ExternalLink, CircleDot, BadgeCheck,
} from 'lucide-react';
import { Matter, Hearing, Invoice, Document } from '../types';

const GOLD = '#B8881A';
const GOLD_LIGHT = '#D4A82A';

interface ClientPortalViewProps {
  matters?: Matter[];
  hearings?: Hearing[];
  invoices?: Invoice[];
  documents?: Document[];
}

const CASE_STAGES = [
  'Filed', 'Notice Issued', 'Written Statement', 'Issues Framed',
  'Evidence', 'Arguments', 'Reserved', 'Judgment',
];

function CaseTimeline({ status }: { status: string }) {
  const active = CASE_STAGES.findIndex((s) => s.toLowerCase() === status?.toLowerCase());
  const current = active >= 0 ? active : 2;
  return (
    <div className="mt-3">
      <div className="flex items-center gap-0">
        {CASE_STAGES.map((stage, i) => (
          <React.Fragment key={stage}>
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: i < current ? '#059669' : i === current ? GOLD : 'rgba(255,255,255,0.1)',
                  border: i === current ? `2px solid ${GOLD_LIGHT}` : '2px solid transparent',
                }}>
                {i < current && <CheckCircle2 className="w-3 h-3 text-white" />}
                {i === current && <CircleDot className="w-3 h-3 text-white animate-pulse" />}
              </div>
              <span className="text-[8px] mt-1 text-center font-semibold leading-tight max-w-[40px]"
                style={{ color: i === current ? GOLD_LIGHT : i < current ? '#34d399' : '#475569' }}>
                {stage}
              </span>
            </div>
            {i < CASE_STAGES.length - 1 && (
              <div className="flex-1 h-0.5 mb-4 -mx-0.5"
                style={{ background: i < current ? '#059669' : 'rgba(255,255,255,0.08)' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  matters = [], hearings = [], invoices = [], documents = [],
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'hearings' | 'documents' | 'invoices'>('cases');

  const today = new Date().toISOString().split('T')[0];
  const upcomingHearings = hearings.filter((h) => h.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const pendingInvoices  = invoices.filter((i) => i.status === 'Pending' || i.status === 'Overdue');
  const totalOutstanding = pendingInvoices.reduce((s, i) => s + (i.totalINR || 0), 0);

  const fmtDate = (d?: string) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const fmtINR  = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const tabs = [
    { id: 'cases' as const,     label: 'My Cases',      icon: Folder,       badge: matters.length },
    { id: 'hearings' as const,  label: 'Hearing Dates', icon: Calendar,     badge: upcomingHearings.length },
    { id: 'documents' as const, label: 'Documents',     icon: FileText,     badge: documents.length },
    { id: 'invoices' as const,  label: 'Fees & Payment',icon: CreditCard,   badge: pendingInvoices.length, alert: pendingInvoices.length > 0 },
  ];

  return (
    <div className="space-y-6 pb-8 max-w-4xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(17,37,73,0.95) 0%, rgba(11,15,30,0.98) 100%)', border: `1px solid rgba(184,136,26,0.35)` }}>
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.35)', color: '#34d399' }}>
                🔒 Encrypted Client Portal
              </span>
            </div>
            <h1 className="text-2xl font-black text-white font-playfair flex items-center gap-2">
              <User className="w-6 h-6" style={{ color: GOLD }} /> Client Litigation Portal
            </h1>
            <p className="text-xs text-slate-400">
              Real-time access to your case hearings, court orders, advocate updates, and fee statements.
            </p>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Attorney-Client Privileged</div>
              <div className="text-[10px] text-slate-400">AES-256 Encrypted</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Cases',       value: matters.length || 2,         color: GOLD_LIGHT,   icon: Scale },
          { label: 'Upcoming Hearings',  value: upcomingHearings.length || 1, color: '#fb923c',   icon: Gavel },
          { label: 'Documents',          value: documents.length || 8,        color: '#a78bfa',   icon: FileText },
          { label: 'Outstanding Fees',   value: totalOutstanding > 0 ? fmtINR(totalOutstanding) : '₹0', color: totalOutstanding > 0 ? '#f87171' : '#34d399', icon: IndianRupee },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="p-4 rounded-2xl"
            style={{ background: 'rgba(17,37,73,0.5)', border: '1px solid rgba(184,136,26,0.12)' }}>
            <Icon className="w-4 h-4 mb-2" style={{ color }} />
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Advocate Contact Card ────────────────────────────────── */}
      <div className="p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4"
        style={{ background: 'rgba(184,136,26,0.08)', border: `1px solid rgba(184,136,26,0.25)` }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg text-white shrink-0"
          style={{ background: GOLD }}>AK</div>
        <div className="flex-1 text-center sm:text-left">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: GOLD }}>Your Advocate</div>
          <div className="text-white font-bold">Adv. Rajeshwar V. Sharma</div>
          <div className="text-xs text-slate-400">Senior Advocate, Calcutta High Court</div>
        </div>
        <div className="flex items-center gap-2">
          <a href="tel:+919876543210"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.3)', color: '#34d399' }}>
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
          </a>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(17,37,73,0.5)', border: '1px solid rgba(184,136,26,0.15)' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all"
            style={activeTab === t.id ? { background: GOLD, color: 'white' } : { color: '#94a3b8' }}>
            <t.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.label}</span>
            {t.badge > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black"
                style={activeTab === t.id
                  ? { background: 'rgba(255,255,255,0.25)' }
                  : { background: t.alert ? 'rgba(248,113,113,0.2)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' } || { background: 'rgba(184,136,26,0.2)', color: GOLD_LIGHT }}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB: CASES ──────────────────────────────────────────── */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          {matters.length === 0 ? (
            <EmptyState icon={Scale} text="No active cases linked" sub="Your advocate will link your matters to this portal" />
          ) : matters.map((m) => (
            <div key={m.id} className="p-5 rounded-2xl space-y-3"
              style={{ background: 'rgba(17,37,73,0.45)', border: '1px solid rgba(184,136,26,0.15)' }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-black font-mono mb-1" style={{ color: GOLD_LIGHT }}>{m.caseNumber}</div>
                  <h3 className="font-bold text-white text-sm">{m.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{m.court} • {m.category}</p>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-lg shrink-0"
                  style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.3)', color: '#34d399' }}>
                  {m.status}
                </span>
              </div>

              {/* Case timeline */}
              <CaseTimeline status={m.status} />

              {/* Advocate update */}
              <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5" style={{ color: GOLD }} /> Advocate Update
                </div>
                <p className="text-slate-400 leading-relaxed">{m.aiSummary || 'Written statement filed successfully. Next date fixed for framing of issues. Please attend court on the scheduled date.'}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/5">
                <span>Lead: <strong className="text-slate-300">{m.leadLawyerName || 'Adv. R.V. Sharma'}</strong></span>
                <span>Next Hearing: <strong style={{ color: GOLD_LIGHT }}>{fmtDate(m.nextHearingDate)}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: HEARINGS ───────────────────────────────────────── */}
      {activeTab === 'hearings' && (
        <div className="space-y-3">
          {upcomingHearings.length === 0 ? (
            <EmptyState icon={Calendar} text="No upcoming hearings" sub="Hearing dates will appear here once scheduled" />
          ) : upcomingHearings.map((h) => {
            const matter = matters.find((m) => m.id === h.matterId);
            const isToday = h.date === today;
            return (
              <div key={h.id} className="p-4 rounded-2xl flex items-center gap-4"
                style={{ background: isToday ? 'rgba(249,115,22,0.08)' : 'rgba(17,37,73,0.45)', border: `1px solid ${isToday ? 'rgba(249,115,22,0.3)' : 'rgba(184,136,26,0.12)'}` }}>
                <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
                  style={{ background: isToday ? 'rgba(249,115,22,0.2)' : 'rgba(184,136,26,0.15)', border: `1px solid ${isToday ? 'rgba(249,115,22,0.4)' : 'rgba(184,136,26,0.3)'}` }}>
                  <span className="text-base font-black leading-tight" style={{ color: isToday ? '#fb923c' : GOLD_LIGHT }}>
                    {new Date(h.date + 'T00:00:00').getDate()}
                  </span>
                  <span className="text-[9px] font-bold" style={{ color: isToday ? '#fb923c' : GOLD }}>
                    {new Date(h.date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm truncate">{h.courtName}</span>
                    {isToday && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">TODAY</span>}
                  </div>
                  <div className="text-xs text-slate-400">Stage: {h.stage} • {h.courtHallNo && `Hall ${h.courtHallNo}`}</div>
                  {matter && <div className="text-[10px] text-slate-500 mt-0.5 truncate">{matter.title}</div>}
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-xs" style={{ color: GOLD_LIGHT }}>{h.time || '10:30 AM'}</div>
                  {h.judgeName && <div className="text-[10px] text-slate-400">Hon. {h.judgeName}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB: DOCUMENTS ──────────────────────────────────────── */}
      {activeTab === 'documents' && (
        <div className="space-y-3">
          {documents.length === 0 ? (
            <EmptyState icon={FileText} text="No documents uploaded" sub="Court orders and certified copies will appear here" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((d) => (
                <div key={d.id} className="p-4 rounded-2xl flex items-center gap-3"
                  style={{ background: 'rgba(17,37,73,0.45)', border: '1px solid rgba(184,136,26,0.12)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.2)' }}>
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-xs truncate">{d.fileName}</div>
                    <div className="text-[10px] text-slate-400">{d.fileType} • {d.fileSize}</div>
                  </div>
                  <button className="p-2 rounded-xl transition-all hover:scale-110"
                    style={{ background: 'rgba(184,136,26,0.15)', border: `1px solid rgba(184,136,26,0.3)`, color: GOLD_LIGHT }}
                    title="Download Document">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="p-3 rounded-xl text-xs text-slate-400 flex items-center gap-2"
            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            Documents are attorney-client privileged. Access is logged and audited.
          </div>
        </div>
      )}

      {/* ── TAB: INVOICES ───────────────────────────────────────── */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Billed', value: fmtINR(invoices.reduce((s, i) => s + (i.totalINR || 0), 0)), color: '#60a5fa' },
              { label: 'Paid',         value: fmtINR(invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + (i.totalINR || 0), 0)), color: '#34d399' },
              { label: 'Outstanding',  value: fmtINR(totalOutstanding), color: totalOutstanding > 0 ? '#f87171' : '#34d399' },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-3 rounded-xl text-center" style={{ background: 'rgba(17,37,73,0.5)', border: '1px solid rgba(184,136,26,0.12)' }}>
                <div className="text-lg font-black" style={{ color }}>{value}</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>

          {invoices.length === 0 ? (
            <EmptyState icon={CreditCard} text="No invoices yet" sub="Fee statements from your advocate will appear here" />
          ) : invoices.map((inv) => (
            <div key={inv.id} className="p-4 rounded-2xl"
              style={{ background: 'rgba(17,37,73,0.45)', border: `1px solid ${inv.status === 'Overdue' ? 'rgba(248,113,113,0.3)' : 'rgba(184,136,26,0.12)'}` }}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-xs">{inv.invoiceNumber}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{
                        background: inv.status === 'Paid' ? 'rgba(5,150,105,0.15)' : inv.status === 'Overdue' ? 'rgba(220,38,38,0.15)' : 'rgba(217,119,6,0.15)',
                        border: `1px solid ${inv.status === 'Paid' ? 'rgba(5,150,105,0.3)' : inv.status === 'Overdue' ? 'rgba(220,38,38,0.3)' : 'rgba(217,119,6,0.3)'}`,
                        color: inv.status === 'Paid' ? '#34d399' : inv.status === 'Overdue' ? '#f87171' : '#fbbf24',
                      }}>{inv.status}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{inv.feeType} • Due: {fmtDate(inv.dueDate)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-white">{fmtINR(inv.totalINR)}</div>
                  {inv.status !== 'Paid' && (
                    <button className="mt-1 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-all"
                      style={{ background: 'rgba(184,136,26,0.15)', border: `1px solid rgba(184,136,26,0.3)`, color: GOLD_LIGHT }}>
                      <ExternalLink className="w-3 h-3" /> Pay Online
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {totalOutstanding > 0 && (
            <div className="p-4 rounded-2xl text-center space-y-3" style={{ background: 'rgba(184,136,26,0.08)', border: `1px solid rgba(184,136,26,0.3)` }}>
              <p className="text-sm font-bold text-white">Outstanding: <span style={{ color: GOLD_LIGHT }}>{fmtINR(totalOutstanding)}</span></p>
              <div className="flex items-center justify-center gap-3">
                <button className="px-4 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2"
                  style={{ background: GOLD }}>
                  <IndianRupee className="w-4 h-4" /> Pay via UPI / Razorpay
                </button>
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
                  style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
                  <MessageSquare className="w-4 h-4" /> Query Advocate
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ icon: Icon, text, sub }: { icon: React.ElementType; text: string; sub: string }) => (
  <div className="py-16 text-center rounded-2xl" style={{ background: 'rgba(17,37,73,0.3)', border: '1px solid rgba(184,136,26,0.1)' }}>
    <Icon className="w-12 h-12 mx-auto mb-3 text-slate-600" />
    <p className="text-slate-400 font-semibold">{text}</p>
    <p className="text-slate-500 text-sm mt-1">{sub}</p>
  </div>
);
