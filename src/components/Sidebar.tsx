import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  CheckSquare,
  Users,
  Folder,
  FolderKanban,
  BookOpen,
  Calendar,
  CalendarDays,
  Gavel,
  FileText,
  AlertCircle,
  Receipt,
  MessageSquare,
  Scale,
  BarChart3,
  MessageSquareCode,
  PenTool,
  UserCheck,
  Bell,
  Settings,
  Database,
  ShieldCheck,
  HelpCircle,
  X,
  Sparkles,
  LogOut,
  HardDrive,
  Landmark,
  Lock,
  User as UserIcon,
  Smartphone,
} from 'lucide-react';
import { User, NavTab } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser?: User;
  onLogout?: () => void;
  onOpenLanding?: () => void;
  highRiskCount?: number;
  pendingOCRCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavGroup {
  title?: string;
  items: {
    id: NavTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
    isAi?: boolean;
    isSystemOnly?: boolean;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  onOpenLanding,
  highRiskCount = 0,
  pendingOCRCount = 0,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const role = currentUser?.role || 'Super Admin';

  const navGroups: NavGroup[] = [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'lawyerdesk_pocket', label: 'LawyerDesk Pocket', icon: Smartphone, isAi: true, badge: 'Pocket App' },
        { id: 'enquiries', label: 'Enquiries', icon: UserPlus },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
      ],
    },
    {
      title: 'CORE',
      items: [
        { id: 'court_intelligence', label: 'Litigation Command Center', icon: Scale, isAi: true, badge: 'V3.6' },
        { id: 'clients', label: 'Clients', icon: Users },
        { id: 'matters', label: 'Cases', icon: Folder },
        { id: 'kanban', label: 'Kanban Board', icon: FolderKanban },
        { id: 'casediary', label: 'Case Diary', icon: BookOpen },
      ],
    },
    {
      title: 'SCHEDULE',
      items: [
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'hearing_calendar', label: 'Hearing Calendar', icon: CalendarDays },
        { id: 'hearings', label: 'Hearings', icon: Gavel },
      ],
    },
    {
      title: 'BILLING',
      items: [
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'outstanding', label: 'Outstanding', icon: AlertCircle },
        { id: 'expenses', label: 'Expenses', icon: Receipt },
      ],
    },
    {
      title: 'COMMUNICATION',
      items: [
        { id: 'messages', label: 'Messages', icon: MessageSquare },
      ],
    },
    {
      title: 'FILES & UTILITIES',
      items: [
        { id: 'ecourt_tracker', label: 'eCourt Tracker', icon: Scale },
        { id: 'west_bengal_suite', label: 'WB & Kolkata Suite', icon: Landmark, isAi: true, badge: 'High Court' },
        { id: 'knowledge_vault', label: 'Knowledge Vault', icon: Lock, isAi: true },
        { id: 'documents', label: 'Documents', icon: FileText, badge: pendingOCRCount > 0 ? `${pendingOCRCount} Pending` : 'AI' },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'ai_chat', label: 'Knowledge Graph AI', icon: MessageSquareCode, isAi: true },
        { id: 'ai_drafting', label: 'AI Draft Chamber', icon: PenTool, isAi: true, badge: 'Chamber' },
        { id: 'client_portal', label: 'Client Portal', icon: UserIcon },
      ],
    },
    {
      title: 'ADMIN',
      items: [
        { id: 'manage_team', label: 'Manage Team', icon: UserCheck },
        { id: 'reminders', label: 'Reminders', icon: Bell },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'database', label: 'PostgreSQL Schema', icon: Database, isSystemOnly: true },
        { id: 'security', label: 'RBAC & Security', icon: ShieldCheck, isSystemOnly: true },
        { id: 'help', label: 'Help & Manual', icon: HelpCircle },
      ],
    },
  ];

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AK';

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      <aside
        className={`bg-[#0B132B] text-slate-300 flex flex-col shrink-0 border-r border-slate-800/80 shadow-2xl select-none transition-all duration-200 z-50 ${
          isOpenMobile
            ? 'fixed inset-y-0 left-0 w-[240px] h-full flex'
            : 'hidden md:flex w-[220px] min-h-[calc(100vh-3.5rem)]'
        }`}
      >
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-[#070D1E]">
          <div
            onClick={onOpenLanding}
            className={`flex items-center gap-2.5 ${onOpenLanding ? 'cursor-pointer group hover:opacity-90' : ''}`}
            title="Go to LawyerDesk Home Page"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md transition-all" style={{ background: '#B8881A' }}>
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm tracking-tight flex items-center gap-1 font-playfair transition-colors">
                <span>Lawyer Desk</span>
              </div>
              <div className="text-[9px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: '#B8881A' }}>
                CASE MANAGEMENT
              </div>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 p-2.5 space-y-4 overflow-y-auto custom-scrollbar">
          {navGroups.map((group, idx) => {
            const isSysAdminUser =
              role === 'Super Admin' ||
              role === 'System Administrator' ||
              role === 'System Owner' ||
              currentUser?.email === 'apex7tech@gmail.com';

            const filteredItems = group.items.filter((item) => {
              // System-Only items (e.g., PostgreSQL Schema, RBAC & Security) MUST strictly only be shown to System Administrators
              if (item.isSystemOnly) {
                return isSysAdminUser;
              }

              if (role === 'Client' || role === 'Client Portal User') {
                return ['dashboard', 'matters', 'hearings', 'invoices', 'help', 'messages'].includes(item.id);
              }

              return true;
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                {group.title && (
                  <div className="px-2 pt-2 pb-1 text-[9.5px] font-extrabold uppercase tracking-widest text-slate-500">
                    {group.title}
                  </div>
                )}

                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile?.();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? 'text-white shadow-md font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                      }`}
                      style={isActive ? { background: '#B8881A' } : {}}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                            isActive
                              ? 'text-white'
                              : item.isAi
                              ? 'text-sky-400'
                              : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {item.isAi && !isActive && (
                          <Sparkles className="w-3 h-3 text-sky-400 animate-pulse" />
                        )}
                        {item.badge !== undefined && (
                          <span
                            className={`ml-auto text-[9.5px] px-1.5 py-0.5 rounded font-bold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-[#B8881A]/20 text-[#D4A82A]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Profile & Storage Bottom Section */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 bg-[#070D1E]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0 border"
                style={{
                  background: (currentUser as any)?.isDemoUser ? '#d97706' : role === 'Super Admin' ? '#dc2626' : role === 'Firm Admin' ? '#059669' : '#B8881A',
                  borderColor: (currentUser as any)?.isDemoUser ? 'rgba(251,191,36,0.4)' : role === 'Super Admin' ? 'rgba(248,113,113,0.4)' : role === 'Firm Admin' ? 'rgba(52,211,153,0.4)' : 'rgba(184,136,26,0.4)',
                }}
              >
                {userInitials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {currentUser?.name || 'Adv. Amit Kumar'}
                </div>
                <div className="text-[10px] truncate font-mono" style={{ color: '#D4A82A' }}>
                  {(currentUser as any)?.isDemoUser ? (
                    <span className="text-amber-300 font-bold">Demo User</span>
                  ) : role === 'Super Admin' ? (
                    <span className="text-rose-300 font-bold">System Admin</span>
                  ) : role === 'Firm Admin' ? (
                    <span className="text-emerald-300 font-bold">Firm Admin</span>
                  ) : (
                    <span className="text-sky-300 font-bold">{role}</span>
                  )}
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out / Switch Account"
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
              </button>
            )}
          </div>

          <div className="text-[10px] bg-slate-900/80 p-2 rounded-lg text-slate-300 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <HardDrive className="w-3 h-3" style={{ color: '#B8881A' }} />
              <span className="truncate">Vault: 8.4 TB / 10 TB</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-400">84%</span>
          </div>
        </div>
      </aside>
    </>
  );
};
