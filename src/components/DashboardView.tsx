import React, { useMemo, useState } from 'react';
import {
  Scale, CalendarDays, FileText, AlertTriangle, Sparkles,
  ArrowUpRight, Clock, Plus, Send, Gavel, TrendingUp,
  IndianRupee, Users, CheckSquare, Bell, MessageSquare,
  ChevronRight, BarChart3, CircleDot,
} from 'lucide-react';
import { Matter, Hearing, Document, Invoice, Task, AuditLog } from '../types';

const GOLD = '#B8881A';
const GOLD_LIGHT = '#D4A82A';

interface DashboardViewProps {
  matters: Matter[];
  hearings: Hearing[];
  documents: Document[];
  auditLogs: AuditLog[];
  invoices?: Invoice[];
  tasks?: Task[];
  onSelectMatter: (matter: Matter) => void;
  onNavigateTab: (tab: any) => void;
  onOpenNewMatter: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  matters, hearings, documents, auditLogs,
  invoices = [], tasks = [],
  onSelectMatter, onNavigateTab, onOpenNewMatter,
}) => {
  const [aiQuery, setAiQuery] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const todayHearings   = hearings.filter((h) => h.date === today);
  const upcomingHearings = hearings.filter((h) => h.date > today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const urgentHearings  = hearings.filter((h) => h.date === today || h.date === tomorrow);

  const pendingInvoices   = invoices.filter((i) => i.status === 'Pending' || i.status === 'Overdue');
  const outstandingAmount = pendingInvoices.reduce((s, i) => s + (i.totalINR || 0), 0);
  const pendingTasks      = tasks.filter((t) => (t as any).status !== 'Completed' && (t as any).status !== 'Done');
  const highRiskMatters   = matters.filter((m) => m.riskLevel === 'High' || m.riskLevel === 'Critical');

  // Case status distribution for mini-chart
  const statusDist = useMemo(() => {
    const map: Record<string, number> = {};
    matters.forEach((m) => { map[m.status] = (map[m.status] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [matters]);

  const maxCount = Math.max(...statusDist.map((s) => s[1]), 1);

  const STATUS_COLORS: Record<string, string> = {
    Active: '#B8881A', 'In Progress': '#60a5fa', Pending: '#fbbf24',
    Closed: '#34d399', Filed: '#a78bfa', Default: '#94a3b8',
  };

  const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  const fmtINR  = (n: number) => n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : `₹${n.toLocaleString('en-IN')}`;

  const statTiles = [
    { label: 'Active Cases',     value: matters.length,         sub: `${highRiskMatters.length} high-risk`, icon: Scale,        color: GOLD_LIGHT,  nav: 'matters' },
    { label: "Today's Hearings", value: todayHearings.length,   sub: `${urgentHearings.length} in 48 hrs`,  icon: Gavel,        color: '#f97316',  nav: 'hearings' },
    { label: 'Pending Tasks',    value: pendingTasks.length,    sub: 'awaiting completion',                  icon: CheckSquare,  color: '#60a5fa',  nav: 'tasks' },
    { label: 'Outstanding',      value: fmtINR(outstandingAmount), sub: `${pendingInvoices.length} invoices`, icon: IndianRupee, color: '#f87171',  nav: 'invoices' },
    { label: 'Documents',        value: documents.length,       sub: 'indexed & searchable',                 icon: FileText,     color: '#a78bfa',  nav: 'documents' },
    { label: 'Total Clients',    value: [...new Set(matters.map((m) => m.clientId))].length, sub: 'across all matters', icon: Users, color: '#34d399', nav: 'clients' },
  ];

  return (
    <div className="space-y-6 pb-8">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl"
        style={{ background: 'rgba(17,37,73,0.5)', border: `1px solid rgba(184,136,26,0.25)` }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-1" style={{ color: GOLD }}>
            <Scale className="w-4 h-4" /> Practice Intelligence Dashboard
          </div>
          <h1 className="text-2xl font-black text-white font-playfair">Law Practice Overview</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Live snapshot — cases, hearings, billing and AI insights for <span className="text-white font-semibold">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigateTab('reminders')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all"
            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#fb923c' }}>
            <Bell className="w-3.5 h-3.5" /> Reminders {urgentHearings.length > 0 && <span className="bg-orange-500 text-white rounded-full px-1.5 py-0.5 text-[9px] font-black">{urgentHearings.length}</span>}
          </button>
          <button onClick={onOpenNewMatter}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all"
            style={{ background: GOLD, boxShadow: '0 4px 16px rgba(184,136,26,0.3)' }}>
            <Plus className="w-4 h-4" /> Register New Case
          </button>
        </div>
      </div>

      {/* ── Today's Hearings Strip ──────────────────────────────── */}
      {todayHearings.length > 0 && (
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.3)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-300">
              <CircleDot className="w-4 h-4 animate-pulse text-orange-400" />
              Today's Court Hearings — {fmtDate(today)}
            </div>
            <button onClick={() => onNavigateTab('hearings')} className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1">
              Full Schedule <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {todayHearings.map((h) => {
              const matter = matters.find((m) => m.id === h.matterId);
              return (
                <div key={h.id} onClick={() => matter && onSelectMatter(matter)}
                  className="flex-shrink-0 p-3 rounded-xl cursor-pointer min-w-[200px] transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(249,115,22,0.25)' }}>
                  <div className="flex items-center gap-1.5 text-orange-400 text-[10px] font-bold mb-1.5">
                    <Clock className="w-3 h-3" /> {h.time || '10:30 AM'} • {h.courtHallNo || 'Hall 1'}
                  </div>
                  <div className="text-white font-bold text-xs truncate max-w-[180px]">{matter?.title || h.caseTitle || 'Hearing'}</div>
                  <div className="text-slate-400 text-[10px] mt-1 truncate">{h.courtName} • {h.stage}</div>
                  {h.judgeName && <div className="text-slate-500 text-[10px] truncate">Hon. {h.judgeName}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 6 Stat Tiles ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statTiles.map(({ label, value, sub, icon: Icon, color, nav }) => (
          <button key={label} onClick={() => onNavigateTab(nav)}
            className="p-4 rounded-2xl text-left transition-all hover:scale-[1.03] active:scale-95"
            style={{ background: 'rgba(17,37,73,0.45)', border: '1px solid rgba(184,136,26,0.12)' }}>
            <Icon className="w-4 h-4 mb-2" style={{ color }} />
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">{label}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">{sub}</div>
          </button>
        ))}
      </div>

      {/* ── Main Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-5">

          {/* Priority Cases Table */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(184,136,26,0.15)' }}>
            <div className="flex items-center justify-between px-4 py-3"
              style={{ background: 'rgba(17,37,73,0.6)', borderBottom: '1px solid rgba(184,136,26,0.1)' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <Scale className="w-4 h-4" style={{ color: GOLD }} /> Priority Cases
              </h3>
              <button onClick={() => onNavigateTab('matters')} className="text-xs font-semibold flex items-center gap-1" style={{ color: GOLD_LIGHT }}>
                All Cases ({matters.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                    style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th className="px-4 py-2.5">Case / Client</th>
                    <th className="px-4 py-2.5">Court</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Risk</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {matters.slice(0, 6).map((m, idx) => (
                    <tr key={m.id} onClick={() => onSelectMatter(m)}
                      className="text-xs transition-all cursor-pointer hover:bg-white/5"
                      style={{ background: idx % 2 === 0 ? 'rgba(17,37,73,0.3)' : 'rgba(11,19,43,0.4)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white font-mono text-[11px]">{m.caseNumber}</div>
                        <div className="text-slate-400 truncate max-w-[180px] text-[11px]">{m.title}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-lg font-bold text-slate-300" style={{ background: 'rgba(255,255,255,0.07)' }}>
                          {m.court?.slice(0, 18)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(184,136,26,0.15)', color: GOLD_LIGHT }}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 w-24">
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${m.riskScore || 0}%`, background: (m.riskScore || 0) > 50 ? '#f87171' : (m.riskScore || 0) > 25 ? '#fbbf24' : '#34d399' }} />
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">{m.riskScore || 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-[11px] font-semibold" style={{ color: GOLD_LIGHT }}>Open →</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Hearings List */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(184,136,26,0.15)' }}>
            <div className="flex items-center justify-between px-4 py-3"
              style={{ background: 'rgba(17,37,73,0.6)', borderBottom: '1px solid rgba(184,136,26,0.1)' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" style={{ color: GOLD }} /> Upcoming Hearings
              </h3>
              <button onClick={() => onNavigateTab('hearing_calendar')} className="text-xs font-semibold flex items-center gap-1" style={{ color: GOLD_LIGHT }}>
                Calendar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              {upcomingHearings.length === 0 ? (
                <div className="px-4 py-6 text-center text-slate-500 text-sm">No upcoming hearings scheduled</div>
              ) : upcomingHearings.map((h, idx) => {
                const matter = matters.find((m) => m.id === h.matterId);
                const isUrgent = h.date === tomorrow;
                return (
                  <div key={h.id} onClick={() => matter && onSelectMatter(matter)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all hover:bg-white/5"
                    style={{ background: idx % 2 === 0 ? 'rgba(17,37,73,0.3)' : 'rgba(11,19,43,0.4)' }}>
                    <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 text-center"
                      style={{ background: isUrgent ? 'rgba(249,115,22,0.2)' : 'rgba(184,136,26,0.15)', border: `1px solid ${isUrgent ? 'rgba(249,115,22,0.4)' : 'rgba(184,136,26,0.3)'}` }}>
                      <span className="text-[10px] font-black leading-tight" style={{ color: isUrgent ? '#fb923c' : GOLD_LIGHT }}>
                        {new Date(h.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit' })}
                      </span>
                      <span className="text-[8px] font-bold" style={{ color: isUrgent ? '#fb923c' : GOLD }}>
                        {new Date(h.date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{matter?.title || h.caseTitle || 'Hearing'}</div>
                      <div className="text-[10px] text-slate-400 truncate">{h.courtName} • {h.stage}</div>
                    </div>
                    {isUrgent && <span className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 bg-orange-500/20 text-orange-300 border border-orange-500/30">TOMORROW</span>}
                    <button onClick={(e) => { e.stopPropagation(); onNavigateTab('reminders'); }}
                      className="p-1.5 rounded-lg shrink-0 transition-all hover:scale-110"
                      style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)' }}
                      title="Send WhatsApp Reminder">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1/3 */}
        <div className="space-y-5">

          {/* AI Copilot Box */}
          <div className="p-5 rounded-2xl space-y-4"
            style={{ background: 'linear-gradient(135deg, rgba(17,37,73,0.9) 0%, rgba(11,15,30,0.95) 100%)', border: `1px solid rgba(184,136,26,0.3)` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: GOLD_LIGHT }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD_LIGHT }}>AI Copilot</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(184,136,26,0.2)', color: GOLD_LIGHT, border: `1px solid rgba(184,136,26,0.3)` }}>
                Claude AI
              </span>
            </div>
            <div className="p-3 rounded-xl text-xs font-mono leading-relaxed"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8' }}>
              <span className="text-slate-500">Query: "Summarise PW-2 contradictions"</span>
              <br /><br />
              <span className="text-slate-200">AI found evidence across 3 PDFs:</span><br />
              — PW-2: site presence at 10:00 AM (Exh. 42)<br />
              — CCTV log: entry 11:35 AM (Exh. 56)<br />
              <button onClick={() => onNavigateTab('ai_drafting')}
                className="mt-2 block underline" style={{ color: GOLD_LIGHT }}>
                → Draft cross-examination note
              </button>
            </div>
            <div className="relative">
              <input value={aiQuery} onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') onNavigateTab('ai_chat'); }}
                placeholder="Ask about any matter or section…"
                className="w-full pl-3 pr-10 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid rgba(184,136,26,0.25)` }} />
              <button onClick={() => onNavigateTab('ai_chat')}
                className="absolute right-2.5 top-2" style={{ color: GOLD }}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Case Status Chart */}
          <div className="p-5 rounded-2xl" style={{ background: 'rgba(17,37,73,0.45)', border: '1px solid rgba(184,136,26,0.15)' }}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4" style={{ color: GOLD }} />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Case Distribution</h3>
            </div>
            {statusDist.length === 0 ? (
              <div className="text-slate-500 text-sm text-center py-4">No cases yet</div>
            ) : (
              <div className="space-y-3">
                {statusDist.map(([status, count]) => (
                  <div key={status}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300 font-semibold">{status}</span>
                      <span className="font-black text-white">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(count / maxCount) * 100}%`, background: STATUS_COLORS[status] || STATUS_COLORS.Default }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-4 rounded-2xl space-y-2" style={{ background: 'rgba(17,37,73,0.45)', border: '1px solid rgba(184,136,26,0.15)' }}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Quick Actions</h3>
            {[
              { label: 'View Cause List',        icon: Gavel,        nav: 'ecourt_tracker',   color: '#60a5fa' },
              { label: 'Send WhatsApp Reminder', icon: MessageSquare, nav: 'reminders',        color: '#4ade80' },
              { label: 'Create Invoice',          icon: FileText,     nav: 'invoices',         color: GOLD_LIGHT },
              { label: 'AI Draft Chamber',        icon: Sparkles,     nav: 'ai_drafting',      color: '#a78bfa' },
              { label: 'Client Portal',           icon: Users,        nav: 'client_portal',    color: '#fb923c' },
              { label: 'Reports & Analytics',     icon: TrendingUp,   nav: 'reports',          color: '#34d399' },
            ].map(({ label, icon: Icon, nav, color }) => (
              <button key={nav} onClick={() => onNavigateTab(nav)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 text-left"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                {label}
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-600" />
              </button>
            ))}
          </div>

          {/* Urgent Deadlines */}
          {highRiskMatters.length > 0 && (
            <div className="p-4 rounded-2xl" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-rose-300">
                <AlertTriangle className="w-4 h-4" /> High Risk Matters
              </h3>
              <div className="space-y-2">
                {highRiskMatters.slice(0, 3).map((m) => (
                  <div key={m.id} onClick={() => onSelectMatter(m)}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-all border-l-2 border-rose-500 pl-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{m.caseNumber}</div>
                      <div className="text-[10px] text-slate-400 truncate">{m.title}</div>
                    </div>
                    <span className="text-[10px] font-black text-rose-400 shrink-0">{m.riskScore}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
