import React, { useState } from 'react';
import {
  Search, Scale, CalendarDays, Bot, FileText, Receipt, Users,
  BarChart3, ShieldCheck, MessageSquare, CheckSquare, Landmark,
  Sparkles, Settings, HelpCircle, LogOut, Building2, Briefcase,
  CreditCard, Bell, BookOpen, Award, LayoutGrid, Clock,
  Wallet, Lock, X,
} from 'lucide-react';
import type { NavTab } from '../types';

interface AllMenusViewProps {
  onNavigate: (tab: NavTab) => void;
  onLogout:   () => void;
  onClose?:   () => void;
}

const GOLD = '#B8881A';

type MenuGroup = {
  group: string;
  items: { tab: NavTab; label: string; icon: React.ReactNode; color: string; bg: string; keywords: string }[];
};

const MENU_GROUPS: MenuGroup[] = [
  {
    group: 'Core Practice',
    items: [
      { tab: 'matters',         label: 'Cases & Matters',      icon: <Scale className="w-5 h-5" />,          color: '#4F46E5', bg: '#EEF2FF', keywords: 'cases matters files disputes' },
      { tab: 'hearings',        label: 'Hearings',             icon: <Landmark className="w-5 h-5" />,       color: '#D97706', bg: '#FEF3C7', keywords: 'hearings court schedule cause list' },
      { tab: 'hearing_calendar',label: 'Hearing Calendar',     icon: <CalendarDays className="w-5 h-5" />,   color: '#0284C7', bg: '#E0F2FE', keywords: 'calendar hearings dates schedule' },
      { tab: 'ecourt_tracker',  label: 'eCourt Tracker',       icon: <Landmark className="w-5 h-5" />,       color: '#059669', bg: '#ECFDF5', keywords: 'ecourt tracker cnr sync high court' },
      { tab: 'casediary',       label: 'Case Diary',           icon: <BookOpen className="w-5 h-5" />,       color: '#7C3AED', bg: '#F5F3FF', keywords: 'case diary notes journal log' },
      { tab: 'kanban',          label: 'Kanban Board',         icon: <LayoutGrid className="w-5 h-5" />,     color: '#EA580C', bg: '#FFF7ED', keywords: 'kanban board workflow stages pipeline' },
    ],
  },
  {
    group: 'AI Tools',
    items: [
      { tab: 'ai_chat',         label: 'AI Copilot',           icon: <Bot className="w-5 h-5" />,            color: '#059669', bg: '#ECFDF5', keywords: 'ai chat assistant copilot answers' },
      { tab: 'ai_drafting',     label: 'AI Drafting Studio',   icon: <Sparkles className="w-5 h-5" />,       color: '#4F46E5', bg: '#EEF2FF', keywords: 'ai drafting studio notice petition bail' },
    ],
  },
  {
    group: 'Documents',
    items: [
      { tab: 'documents',       label: 'Document Engine',      icon: <FileText className="w-5 h-5" />,       color: '#B45309', bg: '#FDF5E6', keywords: 'documents files upload ocr pdf' },
      { tab: 'knowledge_vault', label: 'Knowledge Vault',      icon: <Award className="w-5 h-5" />,          color: '#0E7490', bg: '#ECFEFF', keywords: 'knowledge vault templates legal library' },
    ],
  },
  {
    group: 'Clients & Communication',
    items: [
      { tab: 'clients',         label: 'Clients',              icon: <Users className="w-5 h-5" />,          color: '#E11D48', bg: '#FFF1F2', keywords: 'clients kyc contact database' },
      { tab: 'client_portal',   label: 'Client Portal',        icon: <Briefcase className="w-5 h-5" />,      color: '#B45309', bg: '#FDF5E6', keywords: 'client portal self-service login' },
      { tab: 'messages',        label: 'Messages',             icon: <MessageSquare className="w-5 h-5" />,  color: '#0284C7', bg: '#E0F2FE', keywords: 'messages chat whatsapp communication' },
      { tab: 'reminders',       label: 'WhatsApp Alerts',      icon: <Bell className="w-5 h-5" />,           color: '#059669', bg: '#ECFDF5', keywords: 'whatsapp alerts reminders notifications' },
      { tab: 'enquiries',       label: 'Enquiries',            icon: <HelpCircle className="w-5 h-5" />,     color: '#6B7280', bg: '#F9FAFB', keywords: 'enquiries leads intake new clients' },
    ],
  },
  {
    group: 'Finance',
    items: [
      { tab: 'invoices',        label: 'Invoices & Billing',   icon: <Receipt className="w-5 h-5" />,        color: '#7C3AED', bg: '#F5F3FF', keywords: 'invoices billing gst tax payment' },
      { tab: 'outstanding',     label: 'Outstanding Dues',     icon: <CreditCard className="w-5 h-5" />,     color: '#DC2626', bg: '#FEF2F2', keywords: 'outstanding dues overdue collection' },
      { tab: 'expenses',        label: 'Expenses',             icon: <Wallet className="w-5 h-5" />,         color: '#D97706', bg: '#FEF3C7', keywords: 'expenses costs office petty cash' },
      { tab: 'appointments',    label: 'Appointments',         icon: <Clock className="w-5 h-5" />,          color: '#0E7490', bg: '#ECFEFF', keywords: 'appointments schedule consultation booking' },
    ],
  },
  {
    group: 'Tasks & Productivity',
    items: [
      { tab: 'tasks',           label: 'Tasks',                icon: <CheckSquare className="w-5 h-5" />,    color: '#4F46E5', bg: '#EEF2FF', keywords: 'tasks todo checklist deadlines' },
      { tab: 'reminders',       label: 'Reminders',            icon: <Bell className="w-5 h-5" />,           color: '#D97706', bg: '#FEF3C7', keywords: 'reminders alerts notifications' },
      { tab: 'reports',         label: 'Reports',              icon: <BarChart3 className="w-5 h-5" />,      color: '#0284C7', bg: '#E0F2FE', keywords: 'reports analytics dashboard revenue' },
    ],
  },
  {
    group: 'Administration',
    items: [
      { tab: 'firm_registry',   label: 'Firm Registry',        icon: <Building2 className="w-5 h-5" />,      color: '#374151', bg: '#F9FAFB', keywords: 'firm registry staff users manage' },
      { tab: 'manage_team',     label: 'Manage Team',          icon: <Users className="w-5 h-5" />,          color: '#374151', bg: '#F9FAFB', keywords: 'team staff manage users roles' },
      { tab: 'settings',        label: 'Settings',             icon: <Settings className="w-5 h-5" />,       color: '#64748B', bg: '#F8FAFC', keywords: 'settings profile firm account' },
      { tab: 'security',        label: 'Security & Audit',     icon: <Lock className="w-5 h-5" />,           color: '#1E293B', bg: '#F8FAFC', keywords: 'security audit log access permissions' },
      { tab: 'help',            label: 'Help Centre',          icon: <HelpCircle className="w-5 h-5" />,     color: '#0284C7', bg: '#E0F2FE', keywords: 'help support guide documentation' },
    ],
  },
];

export function AllMenusView({ onNavigate, onLogout, onClose }: AllMenusViewProps) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const filtered: MenuGroup[] = q
    ? MENU_GROUPS.map((g) => ({
        ...g,
        items: g.items.filter((item) =>
          item.label.toLowerCase().includes(q) || item.keywords.includes(q)
        ),
      })).filter((g) => g.items.length > 0)
    : MENU_GROUPS;

  return (
    <div className="flex flex-col min-h-full" style={{ background: '#f1f5f9' }}>

      {/* Search bar */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3" style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a menu…"
            className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Groups */}
      <div className="flex-1 px-4 py-3 pb-28 space-y-5">
        {filtered.map((group) => (
          <div key={group.group}>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#64748b' }}>
              {group.group}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {group.items.map((item) => (
                <button
                  key={`${group.group}-${item.tab}-${item.label}`}
                  onClick={() => { onNavigate(item.tab); onClose?.(); }}
                  className="flex flex-col items-center gap-2 py-3 rounded-2xl active:scale-95 transition-transform"
                  style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: item.bg, color: item.color }}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 leading-tight text-center px-1">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Account section */}
        {!q && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#64748b' }}>Account</p>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => { onNavigate('settings'); onClose?.(); }}
                className="flex flex-col items-center gap-2 py-3 rounded-2xl active:scale-95 transition-transform"
                style={{ background: '#fff', border: '1px solid #f1f5f9' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F8FAFC', color: '#64748B' }}>
                  <Settings className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-600 text-center">Settings</span>
              </button>
              <button
                onClick={() => { onLogout(); onClose?.(); }}
                className="flex flex-col items-center gap-2 py-3 rounded-2xl active:scale-95 transition-transform"
                style={{ background: '#fff', border: '1px solid #f1f5f9' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FFF1F2', color: '#E11D48' }}>
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-rose-500 text-center">Log Out</span>
              </button>
            </div>
          </div>
        )}

        {filtered.length === 0 && q && (
          <div className="text-center py-12 text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No menus found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllMenusView;
