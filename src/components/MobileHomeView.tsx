import React, { useState } from 'react';
import {
  Scale, CalendarDays, Bot, MessageSquare, CheckSquare,
  Receipt, Users, Landmark, Bell, LogOut, Home,
  ChevronRight, Clock, Menu,
  FileText, Settings, BarChart3, X, Plus,
  Briefcase, CreditCard, MoreHorizontal,
} from 'lucide-react';
import type { NavTab, Matter, Hearing, Invoice, Task, User, LawFirm } from '../types';

interface MobileHomeViewProps {
  currentUser: User;
  currentFirm: LawFirm;
  matters: Matter[];
  hearings: Hearing[];
  invoices: Invoice[];
  tasks: Task[];
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onLogout: () => void;
}

// ─── Quick Menu (4-per-row, Real Estate OS style) ────────────────────────────
const QUICK_MENU = [
  { tab: 'hearings'       as NavTab, label: 'Hearings',   icon: <CalendarDays className="w-6 h-6" />, bg: '#FEF3C7', color: '#D97706' },
  { tab: 'matters'        as NavTab, label: 'Cases',      icon: <Scale className="w-6 h-6" />,        bg: '#EEF2FF', color: '#4F46E5' },
  { tab: 'ecourt_tracker' as NavTab, label: 'eCourt',     icon: <Landmark className="w-6 h-6" />,     bg: '#ECFDF5', color: '#059669' },
  { tab: 'ai_chat'        as NavTab, label: 'AI',         icon: <Bot className="w-6 h-6" />,          bg: '#E0F2FE', color: '#0284C7' },
  { tab: 'tasks'          as NavTab, label: 'Tasks',      icon: <CheckSquare className="w-6 h-6" />,  bg: '#F5F3FF', color: '#7C3AED' },
  { tab: 'invoices'       as NavTab, label: 'Invoices',   icon: <Receipt className="w-6 h-6" />,      bg: '#FFF7ED', color: '#EA580C' },
  { tab: 'clients'        as NavTab, label: 'Clients',    icon: <Users className="w-6 h-6" />,        bg: '#FFF1F2', color: '#E11D48' },
  { tab: 'ai_drafting'    as NavTab, label: 'All Menus',  icon: <MoreHorizontal className="w-6 h-6" />, bg: '#B8881A', color: '#fff' },
];

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
const BOTTOM_NAV = [
  { tab: 'dashboard'  as NavTab, label: 'Home',     icon: Home },
  { tab: 'matters'    as NavTab, label: 'Cases',    icon: Scale },
  { tab: '__menu__'   as any,    label: 'Menu',     icon: Menu,   center: true },
  { tab: 'invoices'   as NavTab, label: 'Dues',     icon: CreditCard },
  { tab: 'reminders'  as NavTab, label: 'Alerts',   icon: Bell },
];

const MORE_ITEMS: { tab: NavTab; label: string; icon: React.ReactNode; color: string }[] = [
  { tab: 'hearing_calendar', label: 'Hearing Calendar', icon: <CalendarDays className="w-5 h-5" />, color: '#D97706' },
  { tab: 'clients',          label: 'Clients',          icon: <Users className="w-5 h-5" />,        color: '#0284C7' },
  { tab: 'messages',         label: 'Messages',         icon: <MessageSquare className="w-5 h-5" />,color: '#059669' },
  { tab: 'ai_drafting',      label: 'AI Drafting',      icon: <FileText className="w-5 h-5" />,     color: '#4F46E5' },
  { tab: 'reports',          label: 'Reports',          icon: <BarChart3 className="w-5 h-5" />,    color: '#7C3AED' },
  { tab: 'settings',         label: 'Settings',         icon: <Settings className="w-5 h-5" />,     color: '#64748B' },
];

function todayStr() { return new Date().toISOString().split('T')[0]; }
function fmtAmount(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
}
function todayLabel() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
}

// ─── Component ────────────────────────────────────────────────────────────────
export function MobileHomeView({
  currentUser, currentFirm, matters, hearings, invoices, tasks, activeTab, onNavigate, onLogout,
}: MobileHomeViewProps) {
  const [showMore, setShowMore] = useState(false);
  const [dismissBanner, setDismissBanner] = useState(false);

  const today          = todayStr();
  const todayHearings  = hearings.filter((h) => h.date === today);
  const pendingTasks   = tasks.filter((t) => (t as any).status !== 'Completed' && (t as any).status !== 'completed');
  const outstanding    = invoices
    .filter((i) => i.status === 'Pending' || i.status === 'Overdue')
    .reduce((s, i) => s + (i.totalINR ?? 0), 0);
  const isDemoUser     = (currentUser as any).isDemoUser;

  const GOLD = '#B8881A';

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh' }} className="flex flex-col">

      {/* ── Top Bar (dark navy — Real Estate OS style) ───────────────────────── */}
      <header style={{ background: '#0b1220', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* hamburger */}
          <button onClick={() => setShowMore(true)} className="p-1">
            <Menu className="w-5 h-5 text-white" />
          </button>
          <p className="text-base font-bold text-white tracking-tight">Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="relative p-2 rounded-xl text-slate-300"
            style={{ background: 'rgba(255,255,255,0.08)' }}
            onClick={() => onNavigate('reminders')}
          >
            <Bell className="w-4 h-4" />
            {todayHearings.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] text-white font-black flex items-center justify-center">
                {todayHearings.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowMore(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow"
            style={{ background: GOLD }}
          >
            {currentUser.name.charAt(0).toUpperCase()}
          </button>
        </div>
      </header>

      {/* ── Scrollable body ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-28">

        {/* Demo banner */}
        {isDemoUser && !dismissBanner && (
          <div className="mx-4 mt-3 flex items-start justify-between gap-3 px-4 py-3 rounded-2xl text-sm"
            style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}>
            <p>You are exploring the live demo as <strong>{currentUser.name}</strong>. Data is shared and may be reset.</p>
            <button onClick={() => setDismissBanner(true)} className="shrink-0 mt-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Hero Welcome Card (Real Estate OS dark card) ─────────────────── */}
        <div className="mx-4 mt-4 rounded-3xl p-5 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #0b1220 0%, #112549 100%)' }}>
          {/* glow */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(184,136,26,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Top row: greeting + date */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400">Welcome back,</p>
              <p className="text-xl font-bold text-white leading-tight">
                {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1] ?? ''}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-300"
              style={{ background: 'rgba(255,255,255,0.1)' }}>
              {todayLabel()}
            </span>
          </div>

          {/* Stat chips */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: 'HEARINGS',    value: todayHearings.length,     sub: 'today' },
              { label: 'TASKS',       value: pendingTasks.length,      sub: 'pending' },
              { label: 'OUTSTANDING', value: fmtAmount(outstanding),   sub: 'to collect' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl px-3 py-2.5 text-center"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mb-1">{s.label}</p>
                <p className="text-base font-black text-white leading-none">{s.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Action buttons row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '+ Case',    tab: 'matters'   as NavTab, active: false },
              { label: '⚖ Hearing', tab: 'hearings'  as NavTab, active: true  },
              { label: '₹ Invoice', tab: 'invoices'  as NavTab, active: false },
            ].map((b) => (
              <button key={b.tab} onClick={() => onNavigate(b.tab)}
                className="py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95"
                style={b.active
                  ? { background: GOLD, color: '#fff' }
                  : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Quick Menu (4-per-row, white cards — Real Estate OS style) ──── */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#64748b' }}>Quick Menu</p>
            <button onClick={() => setShowMore(true)} className="text-xs font-semibold flex items-center gap-0.5" style={{ color: GOLD }}>
              All menus <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {QUICK_MENU.map((card) => (
              <button key={card.tab} onClick={() => card.label === 'All Menus' ? setShowMore(true) : onNavigate(card.tab)}
                className="flex flex-col items-center gap-2 py-3 rounded-2xl active:scale-95 transition-transform"
                style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: card.label === 'All Menus' ? GOLD : card.bg, color: card.color }}>
                  {card.icon}
                </div>
                <span className="text-[10px] font-semibold text-slate-600 leading-tight text-center">{card.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Today's Hearings (white cards) ──────────────────────────────── */}
        {todayHearings.length > 0 && (
          <div className="px-4 mt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" style={{ color: GOLD }} />
                <p className="text-sm font-bold text-slate-800">Today at a Glance</p>
              </div>
              <button onClick={() => onNavigate('hearings')} className="text-xs font-semibold flex items-center gap-0.5" style={{ color: GOLD }}>
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {todayHearings.slice(0, 3).map((h) => {
                const matter = matters.find((m) => m.id === h.matterId);
                return (
                  <button key={h.id} onClick={() => onNavigate('hearings')}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left active:scale-[0.98] transition-transform"
                    style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{matter?.title ?? h.courtName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{matter?.caseNumber ?? ''} · {h.courtName}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-sm font-bold" style={{ color: GOLD }}>{h.time}</p>
                      <p className="text-[10px] text-slate-400">{h.stage ?? ''}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom spacer for tab bar */}
        <div className="h-6" />
      </div>

      {/* ── More Bottom Sheet ────────────────────────────────────────────────── */}
      {showMore && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMore(false)} />
          <div className="relative rounded-t-3xl z-10 max-h-[85vh] flex flex-col"
            style={{ background: '#fff', borderTop: '1px solid #e2e8f0' }}>
            {/* Handle */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <div className="w-10 h-1 rounded-full" style={{ background: '#e2e8f0' }} />
              <button onClick={() => setShowMore(false)} className="p-1.5 rounded-full" style={{ background: '#f1f5f9' }}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            {/* User card */}
            <div className="flex items-center gap-3 px-5 py-3 mb-1 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                style={{ background: GOLD }}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: GOLD }}>{currentUser.role}</p>
              </div>
            </div>
            {/* Nav items */}
            <div className="overflow-y-auto flex-1 px-3 py-2">
              {MORE_ITEMS.map((item) => (
                <button key={item.tab}
                  onClick={() => { onNavigate(item.tab); setShowMore(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left active:bg-slate-50">
                  <span style={{ color: item.color }}>{item.icon}</span>
                  <span className="text-sm text-slate-700 flex-1 font-medium">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              ))}
              <button onClick={() => { setShowMore(false); onLogout(); }}
                className="w-full flex items-center gap-3 px-3 py-3.5 mt-2 rounded-xl text-rose-500 active:bg-rose-50">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-semibold">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Navigation (white — Real Estate OS style) ─────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40"
        style={{ background: '#fff', borderTop: '1px solid #e2e8f0', boxShadow: '0 -2px 16px rgba(0,0,0,0.06)' }}>
        <div className="flex items-end pb-2">
          {BOTTOM_NAV.map((item) => {
            const isCenter = (item as any).center;
            const isActive = !isCenter && activeTab === item.tab;
            const Icon     = item.icon;
            if (isCenter) {
              return (
                <button key="menu" onClick={() => setShowMore(true)}
                  className="flex-1 flex flex-col items-center -mt-5">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: GOLD }}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold mt-1" style={{ color: GOLD }}>{item.label}</span>
                </button>
              );
            }
            return (
              <button key={String(item.tab)} onClick={() => onNavigate(item.tab as NavTab)}
                className="flex-1 flex flex-col items-center justify-center gap-1 pt-2 pb-1">
                <Icon className="w-5 h-5" style={{ color: isActive ? GOLD : '#94a3b8' }} />
                <span className="text-[10px] font-medium" style={{ color: isActive ? GOLD : '#94a3b8' }}>{item.label}</span>
                {isActive && <span className="absolute bottom-0 w-5 h-0.5 rounded-full" style={{ background: GOLD }} />}
              </button>
            );
          })}
        </div>
        <div className="h-safe-area-inset-bottom" />
      </nav>

    </div>
  );
}

export default MobileHomeView;
