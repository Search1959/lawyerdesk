import React, { useState } from 'react';
import {
  Scale, CalendarDays, Bot, MessageSquare, CheckSquare,
  Receipt, Users, Landmark, Bell, LogOut, Home,
  MoreHorizontal, ChevronRight, Clock, Menu,
  FileText, Settings, BarChart3, X,
} from 'lucide-react';
import type { NavTab, Matter, Hearing, Invoice, Task, User, LawFirm } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────
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

// ─── Menu Cards ───────────────────────────────────────────────────────────────
const MENU_CARDS: {
  tab: NavTab;
  label: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  border: string;
}[] = [
  {
    tab: 'hearings',
    label: "Today's Hearings",
    sub: 'Cause list & schedule',
    icon: <CalendarDays className="w-7 h-7" />,
    iconBg: 'bg-amber-500/20 text-amber-400',
    border: 'border-amber-500/20',
  },
  {
    tab: 'matters',
    label: 'Cases',
    sub: 'All active matters',
    icon: <Scale className="w-7 h-7" />,
    iconBg: 'bg-indigo-500/20 text-indigo-400',
    border: 'border-indigo-500/20',
  },
  {
    tab: 'ecourt_tracker',
    label: 'eCourt Tracker',
    sub: 'CNR sync & cause list',
    icon: <Landmark className="w-7 h-7" />,
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    border: 'border-emerald-500/20',
  },
  {
    tab: 'ai_chat',
    label: 'AI Assistant',
    sub: 'Ask legal questions',
    icon: <Bot className="w-7 h-7" />,
    iconBg: 'bg-sky-500/20 text-sky-400',
    border: 'border-sky-500/20',
  },
  {
    tab: 'reminders',
    label: 'WhatsApp Alerts',
    sub: 'Send client reminders',
    icon: <MessageSquare className="w-7 h-7" />,
    iconBg: 'bg-green-500/20 text-green-400',
    border: 'border-green-500/20',
  },
  {
    tab: 'tasks',
    label: 'Tasks',
    sub: "Today's pending work",
    icon: <CheckSquare className="w-7 h-7" />,
    iconBg: 'bg-violet-500/20 text-violet-400',
    border: 'border-violet-500/20',
  },
  {
    tab: 'invoices',
    label: 'Invoices',
    sub: 'Billing & payments',
    icon: <Receipt className="w-7 h-7" />,
    iconBg: 'bg-orange-500/20 text-orange-400',
    border: 'border-orange-500/20',
  },
  {
    tab: 'client_portal',
    label: 'Client Portal',
    sub: 'Share docs securely',
    icon: <Users className="w-7 h-7" />,
    iconBg: 'bg-rose-500/20 text-rose-400',
    border: 'border-rose-500/20',
  },
];

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
const BOTTOM_NAV = [
  { tab: 'dashboard' as NavTab,  label: 'Home',    icon: <Home className="w-5 h-5" /> },
  { tab: 'matters'   as NavTab,  label: 'Cases',   icon: <Scale className="w-5 h-5" /> },
  { tab: 'hearings'  as NavTab,  label: 'Calendar',icon: <CalendarDays className="w-5 h-5" /> },
  { tab: 'ai_chat'   as NavTab,  label: 'AI',      icon: <Bot className="w-5 h-5" /> },
  { tab: 'more'      as any,     label: 'More',    icon: <Menu className="w-5 h-5" /> },
];

// ─── More Sheet Extra Items ───────────────────────────────────────────────────
const MORE_ITEMS: { tab: NavTab; label: string; icon: React.ReactNode; color: string }[] = [
  { tab: 'hearing_calendar', label: 'Hearing Calendar', icon: <CalendarDays className="w-5 h-5" />, color: 'text-amber-400' },
  { tab: 'clients',          label: 'Clients',          icon: <Users className="w-5 h-5" />,        color: 'text-sky-400'   },
  { tab: 'messages',         label: 'Messages',         icon: <MessageSquare className="w-5 h-5" />,color: 'text-green-400' },
  { tab: 'ai_drafting',      label: 'AI Drafting',      icon: <FileText className="w-5 h-5" />,     color: 'text-indigo-400'},
  { tab: 'reports',          label: 'Reports',          icon: <BarChart3 className="w-5 h-5" />,    color: 'text-violet-400'},
  { tab: 'settings',         label: 'Settings',         icon: <Settings className="w-5 h-5" />,     color: 'text-slate-400' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function greeting(name: string) {
  const h = new Date().getHours();
  const time = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  return `${time}, ${name.split(' ')[0]} 👋`;
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function fmtAmount(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function MobileHomeView({
  currentUser,
  currentFirm,
  matters,
  hearings,
  invoices,
  tasks,
  activeTab,
  onNavigate,
  onLogout,
}: MobileHomeViewProps) {
  const [showMore, setShowMore] = useState(false);

  const today = todayStr();
  const todayHearings = hearings.filter((h) => h.date === today);
  const pendingTasks  = tasks.filter((t) => (t as any).status !== 'Completed' && (t as any).status !== 'completed');
  const outstanding   = invoices
    .filter((i) => i.status === 'Pending' || i.status === 'Overdue')
    .reduce((s, i) => s + (i.totalINR ?? 0), 0);

  const stats = [
    { label: 'Total Cases',      value: matters.length,       color: 'text-indigo-400', icon: <Scale className="w-4 h-4" /> },
    { label: "Today's Hearings", value: todayHearings.length, color: 'text-amber-400',  icon: <CalendarDays className="w-4 h-4" /> },
    { label: 'Pending Tasks',    value: pendingTasks.length,  color: 'text-violet-400', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Outstanding',      value: fmtAmount(outstanding), color: 'text-rose-400', icon: <Receipt className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#080e1f] text-slate-100">

      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#080e1f]/95 backdrop-blur-md border-b border-slate-800/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
            <Scale className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 leading-none">{currentFirm.name}</p>
            <p className="text-sm font-bold text-white leading-tight">Lawyer Desk</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="relative p-2 rounded-xl bg-slate-800/70 text-slate-300"
            onClick={() => onNavigate('reminders')}
          >
            <Bell className="w-4 h-4" />
            {todayHearings.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[9px] text-slate-900 font-black flex items-center justify-center">
                {todayHearings.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowMore(true)}
            className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-sm font-bold shadow"
          >
            {currentUser.name.charAt(0).toUpperCase()}
          </button>
        </div>
      </header>

      {/* ── Scrollable Body ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-24">

        {/* Greeting */}
        <div className="px-4 pt-5 pb-1">
          <p className="text-lg font-semibold text-white">{greeting(currentUser.name)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{currentUser.role} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>

        {/* Stat Cards */}
        <div className="px-4 mt-4 grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-4">
              <div className={`flex items-center gap-1.5 mb-2 ${s.color}`}>
                {s.icon}
                <span className="text-[11px] text-slate-400">{s.label}</span>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Today's Hearings Strip */}
        {todayHearings.length > 0 && (
          <div className="px-4 mt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <p className="text-sm font-semibold text-white">Today's Hearings</p>
              </div>
              <button onClick={() => onNavigate('hearings')} className="text-xs text-indigo-400 flex items-center gap-0.5">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {todayHearings.slice(0, 3).map((h) => {
                const matter = matters.find((m) => m.id === h.matterId);
                return (
                  <button
                    key={h.id}
                    onClick={() => onNavigate('hearings')}
                    className="w-full bg-slate-800/60 border border-amber-500/15 rounded-2xl px-4 py-3 flex items-center justify-between text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {matter?.title ?? h.courtName}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {matter?.caseNumber ?? ''} · {h.courtName}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-sm font-bold text-amber-400">{h.time}</p>
                      <p className="text-[10px] text-slate-500">{h.stage ?? ''}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Access Cards */}
        <div className="px-4 mt-6">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Quick Access</p>
          <div className="grid grid-cols-2 gap-3">
            {MENU_CARDS.map((card) => (
              <button
                key={card.tab}
                onClick={() => onNavigate(card.tab)}
                className={`bg-slate-800/50 border ${card.border} rounded-2xl p-4 text-left flex flex-col gap-3 active:scale-[0.97] transition-transform`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">{card.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{card.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>{/* end scrollable body */}

      {/* ── More Bottom Sheet ────────────────────────────────────────────────── */}
      {showMore && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowMore(false)}
          />
          {/* Sheet */}
          <div className="relative bg-[#111827] rounded-t-3xl border-t border-slate-700/60 z-10 max-h-[85vh] flex flex-col">
            {/* Handle + close */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="w-10 h-1 bg-slate-600 rounded-full" />
              <button onClick={() => setShowMore(false)} className="p-1 rounded-full bg-slate-700">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* User card */}
            <div className="flex items-center gap-3 px-5 py-3 mb-1 border-b border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-lg font-bold shrink-0">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                <p className="text-xs text-indigo-400 mt-0.5">{currentUser.role}</p>
              </div>
            </div>

            {/* Extra nav items */}
            <div className="overflow-y-auto flex-1 px-3 py-2">
              {MORE_ITEMS.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => { onNavigate(item.tab); setShowMore(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-slate-800/60 text-left"
                >
                  <span className={item.color}>{item.icon}</span>
                  <span className="text-sm text-slate-200 flex-1">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              ))}

              {/* Logout */}
              <button
                onClick={() => { setShowMore(false); onLogout(); }}
                className="w-full flex items-center gap-3 px-3 py-3.5 mt-2 rounded-xl text-rose-400"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Fixed Bottom Navigation ──────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080e1f]/95 backdrop-blur-md border-t border-slate-800/60">
        <div className="flex">
          {BOTTOM_NAV.map((item) => {
            const isMore   = item.tab === 'more';
            const isActive = !isMore && activeTab === item.tab;
            return (
              <button
                key={String(item.tab)}
                onClick={() => isMore ? setShowMore(true) : onNavigate(item.tab as NavTab)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 relative transition-colors ${
                  isActive ? 'text-amber-400' : 'text-slate-500'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
        {/* iOS safe area */}
        <div className="h-safe-area-inset-bottom" />
      </nav>

    </div>
  );
}

export default MobileHomeView;
