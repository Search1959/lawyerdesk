import React from 'react';
import {
  Search,
  Sparkles,
  Globe,
  LogIn,
  HelpCircle,
  Users,
  Lock,
  Menu,
  KeyRound,
  Mic,
  Smartphone,
} from 'lucide-react';
import { LawFirm, User, UserRole } from '../types';

interface NavbarProps {
  currentFirm: LawFirm;
  currentUser: User;
  onSelectRole: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenAIChat: () => void;
  onOpenLawyerPocket?: () => void;
  onOpenVoiceAssistant?: () => void;
  onOpenLanding?: () => void;
  onOpenLogin?: () => void;
  onOpenHelp?: () => void;
  onOpenAccountManager?: () => void;
  onOpenChangePassword?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentFirm,
  currentUser,
  onSelectRole,
  onOpenSearch,
  onOpenAIChat,
  onOpenLawyerPocket,
  onOpenVoiceAssistant,
  onOpenLanding,
  onOpenLogin,
  onOpenHelp,
  onOpenAccountManager,
  onOpenChangePassword,
  onToggleMobileSidebar,
}) => {
  const isDemoUser = (currentUser as any)?.isDemoUser;
  const isSystemAdmin =
    currentUser.role === 'Super Admin' ||
    currentUser.role === 'System Administrator' ||
    currentUser.role === 'System Owner' ||
    currentUser.email === 'apex7tech@gmail.com';
  const isFirmAdmin =
    currentUser.role === 'Firm Admin' ||
    currentUser.role === 'Law Firm' ||
    isSystemAdmin;
  const isIndividualLawyer =
    currentUser.role === 'Senior Lawyer' ||
    currentUser.role === 'Senior Advocate' ||
    currentUser.role === 'Associate' ||
    currentUser.role === 'Associate Advocate' ||
    currentUser.role === 'Junior Advocate' ||
    currentUser.role === 'External Counsel';

  return (
    <header className="h-14 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between px-3 sm:px-6 bg-white dark:bg-slate-900 shrink-0 sticky top-0 z-30 transition-colors shadow-sm">
      {/* Mobile Sidebar Toggle Button & Search Bar */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-xl">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
            title="Open Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" style={{ color: '#B8881A' }} />
          </button>
        )}

        <div className="relative w-full">
          <button
            onClick={onOpenSearch}
            className="w-full text-left bg-[#F1F5F9] dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-lg pl-9 sm:pl-10 pr-2 sm:pr-4 py-2 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shadow-inner"
          >
            <span className="truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">Search Acts, Orders, Evidence...</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>
          <div className="absolute left-2.5 sm:left-3 top-2.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Right Controls & Indicators */}
      <div className="flex items-center gap-2 sm:gap-2.5 ml-4">
        {/* Demo Read-Only Badge */}
        {isDemoUser && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-[11px] font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Demo (Read-Only)</span>
          </div>
        )}

        {/* LawyerDesk Pocket Button */}
        {onOpenLawyerPocket && (
          <button
            onClick={onOpenLawyerPocket}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-300 text-xs font-black hover:bg-amber-500/30 transition-all shadow-xs"
            title="Open Mobile-First LawyerPocket Companion"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="hidden sm:inline">LawyerDesk Pocket 📱</span>
          </button>
        )}

        {/* Account & Organization Manager Button */}
        {onOpenAccountManager && (isSystemAdmin || isFirmAdmin || isIndividualLawyer) && (
          <button
            onClick={onOpenAccountManager}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: 'rgba(184,136,26,0.1)', border: '1px solid rgba(184,136,26,0.3)', color: '#D4A82A' }}
            title="Manage Law Firm & Lawyer Accounts"
          >
            <Users className="w-3.5 h-3.5" style={{ color: '#B8881A' }} />
            <span className="hidden xl:inline">
              {isSystemAdmin ? 'Manage Firms & Users' : isFirmAdmin ? 'Manage Firm Team' : 'Manage Associates'}
            </span>
          </button>
        )}
        {/* LawyerDesk Home Link */}
        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
            style={{ background: 'rgba(184,136,26,0.1)', border: '1px solid rgba(184,136,26,0.3)', color: '#D4A82A' }}
            title="Return to Main Homepage"
          >
            <Globe className="w-3.5 h-3.5" style={{ color: '#B8881A' }} />
            <span className="hidden xs:inline">Home Page</span>
          </button>
        )}

        {/* Help Center Link */}
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
            title="Help Center & User Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Help Guide</span>
          </button>
        )}

        {/* AI Voice Assistant Launcher */}
        {onOpenVoiceAssistant && (
          <button
            onClick={onOpenVoiceAssistant}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all shadow-xs"
            title="Voice Assistant (English & Bengali)"
          >
            <Mic className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="hidden sm:inline">Voice AI</span>
          </button>
        )}

        {/* AI Copilot Launcher */}
        <button
          onClick={onOpenAIChat}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
          style={{ background: '#B8881A' }}
        >
          <Sparkles className="w-3.5 h-3.5 text-white/80" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Logged in User Profile Pill */}
        <div
          onClick={onOpenLogin}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer group shrink-0"
          title={`Logged in as ${currentUser.name} at ${currentFirm?.name || 'Firm'} (${currentUser.role}) — Click to switch account`}
        >
          <div className="relative shrink-0">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-[#B8881A]/40"
              />
            ) : (
              <div className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#B8881A]/40" style={{ background: '#B8881A' }}>
                {currentUser.name ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-[9px] uppercase font-bold text-slate-400">Logged in:</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[130px]">
                {currentUser.name}
              </span>
            </div>
            <span className="text-[10px] font-bold leading-tight truncate max-w-[140px]" style={{ color: '#D4A82A' }}>
              {currentFirm?.name ? `${currentFirm.name.slice(0, 16)} • ${currentUser.role}` : currentUser.role}
            </span>
          </div>
        </div>

        {/* Change Password Button for All Users */}
        {onOpenChangePassword && (
          <button
            onClick={onOpenChangePassword}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shrink-0"
            title="Change Your Account Password"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden lg:inline">Change Password</span>
          </button>
        )}

        {/* Sign In / Switch Account Button */}
        {onOpenLogin && (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all border border-slate-700"
            title="Login Screen / Role Switcher"
          >
            <LogIn className="w-3.5 h-3.5" style={{ color: '#D4A82A' }} />
            <span className="hidden xl:inline">Portal Login</span>
          </button>
        )}
      </div>
    </header>
  );
};
