import React, { useState, useEffect } from 'react';
import {
  Gavel,
  Scale,
  Search,
  Building2,
  Users,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  Sparkles,
  Bot,
  Activity,
  GitCommit,
  Share2,
  Bell,
  MessageSquare,
  BarChart3,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Database,
  Settings,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Download,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  Filter,
  Check,
  Zap,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Printer,
  Copy,
  Eye,
  RefreshCw,
  FolderLock,
  Receipt,
  UserCheck,
  Compass,
} from 'lucide-react';

import {
  mockCourtDirectory,
  mockJudgeDirectory,
  mockCauseListItems,
  mockAIHearingBrief,
  mockCaseHealthScore,
  mockKnowledgeGraphNodes,
  mockKnowledgeGraphLinks,
  postgresqlSchemaDDL,
} from '../data/courtIntelligenceData';

import {
  CourtDirectoryProfile,
  JudgeDirectoryProfile,
  CauseListItem,
  AIHearingBrief,
  CaseHealthScoreData,
  KnowledgeGraphNode,
} from '../types';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemName?: string;
}

const PaginationControls: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [3, 5, 10],
  itemName = 'items',
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
      <div className="flex items-center gap-3">
        <span>
          Showing <strong className="font-bold text-slate-900 dark:text-white">{startItem}–{endItem}</strong> of{' '}
          <strong className="font-bold text-slate-900 dark:text-white">{totalItems}</strong> {itemName}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 px-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                pageNum === currentPage
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const getTodayIsoDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (isoStr: string) => {
  if (!isoStr) return '28 Jul 2026';
  try {
    const parts = isoStr.split('-');
    if (parts.length !== 3) return '28 Jul 2026';
    const [y, m, d] = parts.map(Number);
    if (!y || !m || !d) return '28 Jul 2026';
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '28 Jul 2026';
  }
};

export const CourtIntelligenceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'court_directory'
    | 'judge_directory'
    | 'case_tracker'
    | 'cause_list'
    | 'ai_assistant'
    | 'health_score'
    | 'timeline'
    | 'knowledge_graph'
    | 'universal_search'
    | 'notifications'
    | 'client_portal'
    | 'analytics'
    | 'voice_assistant'
    | 'database_schema'
    | 'admin_panel'
  >('dashboard');

  // Search States
  const [universalQuery, setUniversalQuery] = useState('');
  const [courtSearchCategory, setCourtSearchCategory] = useState<string>('All');
  const [courtSearchText, setCourtSearchText] = useState('');
  const [judgeSearchQuery, setJudgeSearchQuery] = useState('');
  const [causeListDate, setCauseListDate] = useState('2026-07-28');
  const [causeListPriority, setCauseListPriority] = useState<string>('All');
  const [cnrSearchQuery, setCnrSearchQuery] = useState('');
  const [caseSearchType, setCaseSearchType] = useState<'cnr' | 'case_no' | 'party' | 'advocate'>('cnr');

  // Voice Assistant States
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [voiceResponse, setVoiceResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [customVoiceInput, setCustomVoiceInput] = useState('');
  const [copiedVoiceResult, setCopiedVoiceResult] = useState(false);

  // Selected Profiles / Details Modals
  const [selectedCourt, setSelectedCourt] = useState<CourtDirectoryProfile | null>(mockCourtDirectory[0]);
  const [selectedJudge, setSelectedJudge] = useState<JudgeDirectoryProfile | null>(mockJudgeDirectory[0]);
  const [copiedSql, setCopiedSql] = useState(false);
  const [mapProvider, setMapProvider] = useState<'gmaps' | 'osm' | 'satellite'>('gmaps');
  const [copiedGps, setCopiedGps] = useState(false);

  // External Link Modal State
  const [activeLinkModal, setActiveLinkModal] = useState<{
    url: string;
    title: string;
    courtName: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Notification Trigger State
  const [notificationSent, setNotificationSent] = useState<string | null>(null);

  // Interactive WhatsApp & Alerts State
  const [waMobile, setWaMobile] = useState('+91 98301 23456');
  const [waCase, setWaCase] = useState('CIVIL/877/2024');
  const [waTemplate, setWaTemplate] = useState<'hearing' | 'causelist' | 'invoice' | 'order'>('hearing');
  const [waCustomNote, setWaCustomNote] = useState('');
  const [waLog, setWaLog] = useState<{ id: string; time: string; channel: string; recipient: string; caseNo: string; status: string }[]>([
    { id: '1', time: 'Today, 09:15 AM', channel: 'WhatsApp', recipient: '+91 98301 23456 (Arun Jaiswal)', caseNo: 'CIVIL/877/2024', status: 'Delivered ✅' },
    { id: '2', time: 'Yesterday, 06:30 PM', channel: 'WhatsApp', recipient: '+91 98765 43210 (M/s Apex Logistics)', caseNo: 'CS(COMM)/420/2024', status: 'Read ✅' },
  ]);

  // Judge Profile Modal State
  const [showJudgeModal, setShowJudgeModal] = useState(false);

  // CNR Search Result State
  const [fetchedCnrResult, setFetchedCnrResult] = useState<CauseListItem | null>(null);
  const [cnrNotFoundMsg, setCnrNotFoundMsg] = useState(false);

  const handleFetchCnr = () => {
    setCnrNotFoundMsg(false);
    if (!cnrSearchQuery.trim()) {
      setFetchedCnrResult(null);
      return;
    }
    const q = cnrSearchQuery.toLowerCase().trim();
    const found = mockCauseListItems.find(
      (c) =>
        c.cnrNumber.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.matterTitle.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q)
    );
    if (found) {
      setFetchedCnrResult(found);
    } else {
      setFetchedCnrResult(null);
      setCnrNotFoundMsg(true);
    }
  };

  // Pagination States
  const [courtListPage, setCourtListPage] = useState(1);
  const [courtPageSize, setCourtPageSize] = useState(4);

  const [judgeListPage, setJudgeListPage] = useState(1);
  const [judgePageSize, setJudgePageSize] = useState(3);

  const [causeListPage, setCauseListPage] = useState(1);
  const [causePageSize, setCausePageSize] = useState(5);

  const [dashboardRosterPage, setDashboardRosterPage] = useState(1);
  const dashboardRosterPageSize = 3;

  // Reset page when filters change
  useEffect(() => {
    setCourtListPage(1);
  }, [courtSearchCategory, courtSearchText]);

  useEffect(() => {
    setJudgeListPage(1);
  }, [judgeSearchQuery]);

  useEffect(() => {
    setCauseListPage(1);
  }, [causeListDate, causeListPriority, cnrSearchQuery]);

  // Derived filtered & paginated lists
  const filteredCourts = mockCourtDirectory
    .filter((c) => courtSearchCategory === 'All' || c.category === courtSearchCategory)
    .filter((c) => {
      if (!courtSearchText.trim()) return true;
      const q = courtSearchText.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    });
  const totalCourtPages = Math.ceil(filteredCourts.length / courtPageSize) || 1;
  const currentCourtListPage = Math.min(courtListPage, totalCourtPages);
  const paginatedCourts = filteredCourts.slice(
    (currentCourtListPage - 1) * courtPageSize,
    currentCourtListPage * courtPageSize
  );

  const filteredJudges = mockJudgeDirectory.filter(
    (j) =>
      j.name.toLowerCase().includes(judgeSearchQuery.toLowerCase()) ||
      j.courtName.toLowerCase().includes(judgeSearchQuery.toLowerCase()) ||
      j.currentAssignment.toLowerCase().includes(judgeSearchQuery.toLowerCase())
  );
  const totalJudgePages = Math.ceil(filteredJudges.length / judgePageSize) || 1;
  const currentJudgeListPage = Math.min(judgeListPage, totalJudgePages);
  const paginatedJudges = filteredJudges.slice(
    (currentJudgeListPage - 1) * judgePageSize,
    currentJudgeListPage * judgePageSize
  );

  const filteredCauseList = mockCauseListItems.filter((item) => {
    if (causeListPriority !== 'All' && item.prepStatus !== causeListPriority) return false;
    if (!cnrSearchQuery.trim()) return true;
    const q = cnrSearchQuery.toLowerCase();
    return (
      item.caseNumber.toLowerCase().includes(q) ||
      item.matterTitle.toLowerCase().includes(q) ||
      item.judgeName.toLowerCase().includes(q) ||
      item.courtName.toLowerCase().includes(q)
    );
  });
  const totalCauseListPages = Math.ceil(filteredCauseList.length / causePageSize) || 1;
  const currentCauseListPage = Math.min(causeListPage, totalCauseListPages);
  const paginatedCauseList = filteredCauseList.slice(
    (currentCauseListPage - 1) * causePageSize,
    currentCauseListPage * causePageSize
  );

  const totalDashboardRosterPages = Math.ceil(mockCauseListItems.length / dashboardRosterPageSize) || 1;
  const currentDashboardRosterPage = Math.min(dashboardRosterPage, totalDashboardRosterPages);
  const paginatedDashboardRoster = mockCauseListItems.slice(
    (currentDashboardRosterPage - 1) * dashboardRosterPageSize,
    currentDashboardRosterPage * dashboardRosterPageSize
  );

  const handleOpenLink = (url: string, title: string, courtName: string) => {
    setActiveLinkModal({ url, title, courtName });
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-IN';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const startMicListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      handleTriggerVoice(customVoiceInput || "Prepare today's arguments");
      return;
    }

    try {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceQuery('Listening to microphone...');
        setVoiceResponse('');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setVoiceQuery(transcript);
        setCustomVoiceInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        handleTriggerVoice(customVoiceInput || "Prepare today's arguments");
      };

      recognition.onend = () => {
        setIsListening(false);
        if (voiceQuery && voiceQuery !== 'Listening to microphone...') {
          handleTriggerVoice(voiceQuery);
        } else {
          handleTriggerVoice(customVoiceInput || "Prepare today's arguments");
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsListening(false);
      handleTriggerVoice(customVoiceInput || "Prepare today's arguments");
    }
  };

  const handleTriggerVoice = (phrase: string) => {
    const cleanPhrase = phrase.trim() || "Prepare today's arguments";
    setVoiceQuery(cleanPhrase);
    setIsListening(true);
    setVoiceResponse('');
    setActiveTab('voice_assistant');

    setTimeout(() => {
      setIsListening(false);
      let responseText = '';
      const q = cleanPhrase.toLowerCase();

      if (q.includes('tomorrow') || q.includes("today's arguments") || q.includes('argument')) {
        responseText = 'Found 4 hearings scheduled for Court Room 312 and Delhi High Court Court 4. Primary matter: CIVIL/877/2024 (Cross Exam PW-1). Argument notes & precedent Vineeta Sharma v. Rakesh Sharma prepared.';
      } else if (q.includes('summarize') || q.includes('last hearing')) {
        responseText = 'Last Hearing Summary: On 12-06-2026, Court framed 5 issues. PW-1 affidavit taken on record. Next date fixed for cross-examination.';
      } else if (q.includes('pending') || q.includes('document')) {
        responseText = 'Missing Documents: Certified Death Certificate of Late Sohanlal Jaiswal & original title deed copy pending court stamp.';
      } else if (q.includes('cause list') || q.includes('item') || q.includes('cnr')) {
        responseText = 'Cause List Query: 12 matters listed for today across Tis Hazari & Delhi High Court. Item #4 before Justice Swarana Kanta Sharma at 10:45 AM.';
      } else {
        responseText = `Voice Command Executed: "${cleanPhrase}". Retrieved latest eCourts intelligence records, updated cause list schedule, and generated AI briefing notes.`;
      }

      setVoiceResponse(responseText);
      speakText(responseText);
    }, 1200);
  };

  const handleSendNotification = (channel: string, matterNo: string) => {
    setNotificationSent(`Successfully sent ${channel} alert to Client for ${matterNo}!`);
    setTimeout(() => setNotificationSent(null), 3000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(postgresqlSchemaDDL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-900 dark:text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40">
                <Gavel className="w-7 h-7" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Court Intelligence & Litigation Command Center
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                    ENTERPRISE V3.6
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Unified Indian High Court, District Court, NCLT, DRT & Tribunal Operating System with Grounded Gemini 3.6 AI
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => {
                setActiveTab('voice_assistant');
                startMicListening();
              }}
              className="px-4.5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              title="Click to launch Voice AI Copilot & Speech Recognition"
            >
              <Mic className="w-4 h-4 text-indigo-200 animate-pulse" />
              <span>Voice AI Command</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('case_tracker');
                setNotificationSent('✓ Live eCourts & NJDG 07:00 AM Cause List Sync Active! 12 Matters Synced.');
              }}
              className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 active:scale-95 border border-slate-800 hover:border-emerald-500/50 text-right transition-all cursor-pointer group shadow-md"
              title="Click to open Live eCourts Status & CNR Terminal"
            >
              <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-end gap-1 group-hover:text-slate-300">
                <span>Live CNR & Cause List Sync</span>
                <ArrowUpRight className="w-3 h-3 text-emerald-400 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>eCourts / NJDG Active</span>
              </div>
            </button>
          </div>
        </div>

        {/* Universal Search Bar embedded in Banner */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="relative max-w-4xl">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              value={universalQuery}
              onChange={(e) => setUniversalQuery(e.target.value)}
              placeholder="Universal Search across CNR, Case No, Client Name, Judge, Court, Order Text, Vehicle, Property, PAN, Aadhaar..."
              className="w-full pl-12 pr-28 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
            />
            <button
              onClick={() => setActiveTab('universal_search')}
              className="absolute right-2 top-2 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all"
            >
              Search All
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Activity },
          { id: 'court_directory', label: 'Court Directory', icon: Building2 },
          { id: 'judge_directory', label: 'Judge Profiles', icon: Scale },
          { id: 'case_tracker', label: 'Case Status & CNR', icon: Search },
          { id: 'cause_list', label: 'Cause List Manager', icon: Clock },
          { id: 'ai_assistant', label: 'AI Hearing Prep', icon: Bot, badge: 'AI' },
          { id: 'health_score', label: 'Case Health (94%)', icon: Zap },
          { id: 'timeline', label: 'Legal Timeline', icon: GitCommit },
          { id: 'knowledge_graph', label: 'Knowledge Graph', icon: Share2 },
          { id: 'notifications', label: 'WhatsApp Alerts', icon: Bell },
          { id: 'client_portal', label: 'Client Portal View', icon: Users },
          { id: 'analytics', label: 'Firm Analytics', icon: BarChart3 },
          { id: 'voice_assistant', label: 'Voice AI Copilot', icon: Mic },
          { id: 'database_schema', label: 'PostgreSQL Schema', icon: Database },
          { id: 'admin_panel', label: 'Admin Panel', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-indigo-400/20 text-indigo-300 font-mono text-[9px]">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {notificationSent && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notificationSent}</span>
        </div>
      )}

      {/* TAB 1: MAIN DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { title: "Today's Hearings", count: '4', sub: '2 High Court, 2 District', icon: Clock, color: 'from-indigo-600 to-indigo-700' },
              { title: "Today's Cause List", count: '12 Items', sub: 'Next Item #4 at 10:45 AM', icon: FileText, color: 'from-blue-600 to-blue-700' },
              { title: 'Urgent Matters', count: '2', sub: 'Stay Application & Bail', icon: AlertCircle, color: 'from-rose-600 to-rose-700' },
              { title: 'Pending Evidence', count: '3 Files', sub: 'PW-1 Cross Examination', icon: FolderLock, color: 'from-amber-600 to-amber-700' },
              { title: 'Limitation Expiry', count: '1 Safe', sub: 'Appeal Deadline in 18 days', icon: Clock, color: 'from-emerald-600 to-emerald-700' },
              { title: 'Outstanding Fees', count: '₹24,840', sub: '2 Invoices Outstanding', icon: Receipt, color: 'from-purple-600 to-purple-700' },
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{metric.title}</span>
                    <span className={`p-2 rounded-xl bg-gradient-to-r ${metric.color} text-white shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xl font-black text-slate-900 dark:text-white">{metric.count}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{metric.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today's Hearing Roster & Quick Cause List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hearings Roster Column */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
                <div className="flex items-center gap-2 font-black text-base text-slate-900 dark:text-white">
                  <Gavel className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Court Appearance Roster ({formatDisplayDate(causeListDate)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ml-1" />
                    <input
                      type="date"
                      value={causeListDate}
                      onChange={(e) => setCauseListDate(e.target.value)}
                      className="bg-transparent text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                    />
                    <button
                      onClick={() => setCauseListDate('2026-07-28')}
                      className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition-all shadow-xs"
                    >
                      Today
                    </button>
                  </div>
                  <button
                    onClick={() => setActiveTab('cause_list')}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 ml-1"
                  >
                    <span>View Cause List</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {paginatedDashboardRoster.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 font-mono text-[10px] font-bold">
                          Item #{item.itemNo}
                        </span>
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {item.caseNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                          {item.stage}
                        </span>
                      </div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{item.matterTitle}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {item.courtName} ({item.courtRoomNo})
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Est: {item.estimatedTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setActiveTab('ai_assistant')}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>AI Prep</span>
                      </button>
                      <button
                        onClick={() => handleSendNotification('WhatsApp', item.caseNumber)}
                        className="p-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs"
                        title="Send WhatsApp Alert to Client"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <PaginationControls
                currentPage={currentDashboardRosterPage}
                totalPages={totalDashboardRosterPages}
                totalItems={mockCauseListItems.length}
                pageSize={dashboardRosterPageSize}
                onPageChange={(page) => setDashboardRosterPage(page)}
                itemName="appearances"
              />
            </div>

            {/* Recent AI Recommendations & Action Items */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Grounded AI Recommendations</span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    <span>Pre-Hearing Cross Examination</span>
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">HIGH PRIORITY</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    PW-1 cross-examination scheduled for CIVIL/877/2024. Review 3 contradict statements extracted from municipal tax receipts by PaddleOCR engine.
                  </p>
                  <button
                    onClick={() => setActiveTab('ai_assistant')}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Questions & Citations</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
                    <span>Missing Certified Document</span>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">DOCUMENT VAULT</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Death certificate certified copy pending substitution in Partition suit. Apply to KMC/Municipal authority.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    <span>Limitation Period Safe</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">18 DAYS REMAINING</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    High Court Writ WP(C)/4521/2024 limitation period is secure. Stay application arguments ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1.5: UNIVERSAL SEARCH VIEW */}
      {activeTab === 'universal_search' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Universal Litigation Search Results</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cross-indexing Courts, Judges, Cause Lists, AI Briefs & Knowledge Graph Nodes
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={universalQuery}
                  onChange={(e) => setUniversalQuery(e.target.value)}
                  placeholder="Search across all legal data..."
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
                {universalQuery && (
                  <button
                    onClick={() => setUniversalQuery('')}
                    className="px-2.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {!universalQuery.trim() ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Search className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Type a keyword above to search across all court registries and case records.</p>
                <p className="text-xs text-slate-400">Try searching "Delhi", "High Court", "Partition", "PW-1", or "Jaiswal"</p>
              </div>
            ) : (
              <div className="space-y-6 pt-2">
                {/* Courts Match */}
                {mockCourtDirectory.filter(c => c.name.toLowerCase().includes(universalQuery.toLowerCase()) || c.city.toLowerCase().includes(universalQuery.toLowerCase()) || c.state.toLowerCase().includes(universalQuery.toLowerCase())).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      <span>Matching Courts & Tribunals</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {mockCourtDirectory
                        .filter(c => c.name.toLowerCase().includes(universalQuery.toLowerCase()) || c.city.toLowerCase().includes(universalQuery.toLowerCase()) || c.state.toLowerCase().includes(universalQuery.toLowerCase()))
                        .map(c => (
                          <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-xs text-slate-900 dark:text-white">{c.name}</div>
                              <div className="text-[11px] text-slate-500">{c.city}, {c.state} • {c.category}</div>
                            </div>
                            <button
                              onClick={() => { setSelectedCourt(c); setActiveTab('court_directory'); }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px]"
                            >
                              Open Court
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Judges Match */}
                {mockJudgeDirectory.filter(j => j.name.toLowerCase().includes(universalQuery.toLowerCase()) || j.courtName.toLowerCase().includes(universalQuery.toLowerCase()) || j.currentAssignment.toLowerCase().includes(universalQuery.toLowerCase())).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4" />
                      <span>Matching Judicial Officers</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {mockJudgeDirectory
                        .filter(j => j.name.toLowerCase().includes(universalQuery.toLowerCase()) || j.courtName.toLowerCase().includes(universalQuery.toLowerCase()) || j.currentAssignment.toLowerCase().includes(universalQuery.toLowerCase()))
                        .map(j => (
                          <div key={j.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-xs text-slate-900 dark:text-white">{j.name}</div>
                              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">{j.designation} • {j.courtName}</div>
                            </div>
                            <button
                              onClick={() => { setSelectedJudge(j); setShowJudgeModal(true); }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-bold text-[11px]"
                            >
                              View Profile
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Cause List Match */}
                {mockCauseListItems.filter(item => item.caseNumber.toLowerCase().includes(universalQuery.toLowerCase()) || item.matterTitle.toLowerCase().includes(universalQuery.toLowerCase()) || item.clientName.toLowerCase().includes(universalQuery.toLowerCase()) || item.judgeName.toLowerCase().includes(universalQuery.toLowerCase())).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>Matching Cause List Hearings</span>
                    </h3>
                    <div className="space-y-2">
                      {mockCauseListItems
                        .filter(item => item.caseNumber.toLowerCase().includes(universalQuery.toLowerCase()) || item.matterTitle.toLowerCase().includes(universalQuery.toLowerCase()) || item.clientName.toLowerCase().includes(universalQuery.toLowerCase()) || item.judgeName.toLowerCase().includes(universalQuery.toLowerCase()))
                        .map(item => (
                          <div key={item.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{item.caseNumber} - Item #{item.itemNo}</div>
                              <div className="font-bold text-slate-900 dark:text-white">{item.matterTitle}</div>
                              <div className="text-slate-500">{item.courtName} ({item.courtRoomNo}) • Judge: {item.judgeName}</div>
                            </div>
                            <button
                              onClick={() => setActiveTab('cause_list')}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                            >
                              Go to Roster
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: COURT DIRECTORY */}
      {activeTab === 'court_directory' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Directory of Indian Courts & Tribunals</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Search, filter, and inspect Supreme Court, 25 High Courts, District & Sessions Courts, and Tribunals across India
              </p>
            </div>

            {/* Dropdown Select & Search Control Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Dropdown 1: Category Selection */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    1. Court Category Dropdown
                  </label>
                  <div className="relative">
                    <select
                      value={courtSearchCategory}
                      onChange={(e) => setCourtSearchCategory(e.target.value)}
                      className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                    >
                      <option value="All">All Categories (Supreme, High, District & Tribunals)</option>
                      <option value="Supreme Court">Supreme Court of India</option>
                      <option value="High Court">High Courts (All Benches)</option>
                      <option value="District Court">District & Sessions Courts</option>
                      <option value="Tribunal (NCLT/DRT/CAT/NGT/RERA/ITAT/GST)">Tribunals & Specialized Boards</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Dropdown 2: Direct Select High Court / District Court */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase mb-1">
                    2. Select High Court / District Court
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCourt?.id || ''}
                      onChange={(e) => {
                        const found = mockCourtDirectory.find((c) => c.id === e.target.value);
                        if (found) setSelectedCourt(found);
                      }}
                      className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-black text-indigo-900 dark:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                    >
                      <optgroup label="Apex Supreme Court">
                        {mockCourtDirectory
                          .filter((c) => c.category === 'Supreme Court')
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              🏛️ {c.name} ({c.city})
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="High Courts (State Jurisdiction)">
                        {mockCourtDirectory
                          .filter((c) => c.category === 'High Court')
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              ⚖️ {c.name} ({c.state})
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="District & Sessions Courts">
                        {mockCourtDirectory
                          .filter((c) => c.category === 'District Court')
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              📍 {c.name} ({c.city})
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Tribunals & Statutory Boards">
                        {mockCourtDirectory
                          .filter((c) => c.category.startsWith('Tribunal'))
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              📑 {c.name} ({c.city})
                            </option>
                          ))}
                      </optgroup>
                    </select>
                    <Building2 className="w-4 h-4 text-indigo-500 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Input 3: Text Search Filter */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    3. Filter by Keyword / City
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={courtSearchText}
                      onChange={(e) => setCourtSearchText(e.target.value)}
                      placeholder="e.g. Delhi, Bombay, Saket, Madras..."
                      className="w-full pl-9 pr-7 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {courtSearchText && (
                      <button
                        onClick={() => setCourtSearchText('')}
                        className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Jump Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-mono font-bold text-slate-400 mr-1">Quick Select:</span>
                {[
                  { name: 'Calcutta High Court', id: 'court-chc' },
                  { name: 'City Civil Court Kolkata', id: 'court-citycivil-kolkata' },
                  { name: 'Alipore District Court', id: 'court-alipore-24pgs' },
                  { name: 'Barasat District Court', id: 'court-barasat-24pgs' },
                  { name: 'NCLT Kolkata Bench', id: 'court-nclt-kolkata' },
                  { name: 'DRT Kolkata', id: 'court-drt-kolkata' },
                  { name: 'Delhi High Court', id: 'court-dhc' },
                  { name: 'Bombay High Court', id: 'court-bhc' },
                  { name: 'Saket District Court', id: 'court-saket' },
                  { name: 'Tis Hazari District Court', id: 'court-tis-hazari' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const found = mockCourtDirectory.find((c) => c.id === item.id);
                      if (found) setSelectedCourt(found);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      selectedCourt?.id === item.id
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of Courts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                <span>Matching Courts ({filteredCourts.length})</span>
                {courtSearchText && (
                  <button
                    onClick={() => setCourtSearchText('')}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-[11px]"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {paginatedCourts.map((court) => (
                <div
                  key={court.id}
                  onClick={() => setSelectedCourt(court)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedCourt?.id === court.id
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>{court.category}</span>
                    <span className="text-[10px] text-slate-400">{court.city}, {court.state}</span>
                  </div>
                  <div className="font-black text-sm text-slate-900 dark:text-white mt-1">{court.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {court.address}
                  </div>
                </div>
              ))}

              <PaginationControls
                currentPage={currentCourtListPage}
                totalPages={totalCourtPages}
                totalItems={filteredCourts.length}
                pageSize={courtPageSize}
                onPageChange={(page) => setCourtListPage(page)}
                onPageSizeChange={(size) => setCourtPageSize(size)}
                pageSizeOptions={[4, 8, 12]}
                itemName="courts"
              />
            </div>

            {/* Selected Court Profile View */}
            {selectedCourt && (
              <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono text-[10px] font-bold">
                      {selectedCourt.category}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{selectedCourt.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{selectedCourt.address}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenLink(selectedCourt.website, 'Official Court Portal', selectedCourt.name)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Globe className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleOpenLink(selectedCourt.causeListUrl, 'Live Cause List Portal', selectedCourt.name)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Live Cause List</span>
                    </button>
                  </div>
                </div>

                {/* Live Interactive GPS & Court Entrance Map */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 relative overflow-hidden border border-slate-800 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <MapPin className="w-4 h-4 shrink-0 text-red-500 animate-pulse" />
                      <span className="text-white text-sm font-black">GPS Geo Location & Interactive Court Entrance Map</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Map Type Provider Switch */}
                      <div className="flex items-center bg-slate-800 p-0.5 rounded-lg text-[11px] border border-slate-700">
                        <button
                          onClick={() => setMapProvider('gmaps')}
                          className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                            mapProvider === 'gmaps' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Google Map
                        </button>
                        <button
                          onClick={() => setMapProvider('satellite')}
                          className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                            mapProvider === 'satellite' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Satellite
                        </button>
                        <button
                          onClick={() => setMapProvider('osm')}
                          className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                            mapProvider === 'osm' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          OpenStreetMap
                        </button>
                      </div>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCourt.latitude},${selectedCourt.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs shrink-0"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Real Map Frame */}
                  <div className="relative h-72 sm:h-80 w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                    {mapProvider === 'osm' ? (
                      <iframe
                        key={`osm-${selectedCourt.id}`}
                        title={`OpenStreetMap for ${selectedCourt.name}`}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedCourt.longitude - 0.008}%2C${selectedCourt.latitude - 0.008}%2C${selectedCourt.longitude + 0.008}%2C${selectedCourt.latitude + 0.008}&layer=mapnik&marker=${selectedCourt.latitude}%2C${selectedCourt.longitude}`}
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    ) : mapProvider === 'satellite' ? (
                      <iframe
                        key={`sat-${selectedCourt.id}`}
                        title={`Satellite Map for ${selectedCourt.name}`}
                        src={`https://maps.google.com/maps?q=${selectedCourt.latitude},${selectedCourt.longitude}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    ) : (
                      <iframe
                        key={`gmap-${selectedCourt.id}`}
                        title={`Google Map for ${selectedCourt.name}`}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedCourt.name + ', ' + selectedCourt.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    )}

                    {/* Floating Info Badge on Map */}
                    <div className="absolute bottom-3 left-3 right-3 sm:right-auto max-w-sm p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs shadow-xl space-y-1 pointer-events-auto">
                      <div className="font-bold text-white flex items-center justify-between gap-2">
                        <span className="truncate">{selectedCourt.name}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${selectedCourt.latitude}, ${selectedCourt.longitude}`);
                            setCopiedGps(true);
                            setTimeout(() => setCopiedGps(false), 2000);
                          }}
                          className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-semibold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 shrink-0 flex items-center gap-1"
                        >
                          {copiedGps ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedGps ? 'Copied' : `${selectedCourt.latitude}, ${selectedCourt.longitude}`}</span>
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-300 line-clamp-1">{selectedCourt.address}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      <span>Court Timings & Working Days</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">{selectedCourt.timings}</div>
                    <div className="text-slate-500 dark:text-slate-400">{selectedCourt.workingDays}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-indigo-500" />
                      <span>Registry Contact & Email</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">{selectedCourt.contactPhones.join(', ')}</div>
                    <div className="text-slate-500 dark:text-slate-400 font-mono">{selectedCourt.email}</div>
                  </div>
                </div>

                {/* Available Forms & Filing Procedures */}
                <div className="space-y-3">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Downloadable Filing Forms & Practice Rules</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCourt.availableForms.map((form, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 dark:text-white">{form.name}</div>
                          <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-[9px] font-mono">{form.category}</span>
                        </div>
                        <button
                          onClick={() => {
                            handleSendNotification('Document Vault', `Saved template for ${form.name}`);
                            handleOpenLink(form.url, form.name, selectedCourt.name);
                          }}
                          className="p-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: JUDGE DIRECTORY */}
      {activeTab === 'judge_directory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Directory of Judges & Presiding Officers</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Judicial Roster, Bench Assignments, Transfer History & Publicly Available Judgments
              </p>
            </div>

            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={judgeSearchQuery}
                onChange={(e) => setJudgeSearchQuery(e.target.value)}
                placeholder="Search Judge Name or Bench..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paginatedJudges.map((judge) => (
                <div
                  key={judge.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-indigo-500 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono text-[10px] font-bold">
                        {judge.benchType}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{judge.courtRoomNo}</span>
                    </div>

                    <h3 className="font-black text-base text-slate-900 dark:text-white">{judge.name}</h3>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{judge.designation}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{judge.courtName}</div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                      <div className="font-bold text-slate-700 dark:text-slate-300">Current Bench Roster:</div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">{judge.currentAssignment}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="text-slate-500">Upcoming List: <span className="font-bold text-slate-900 dark:text-white">{judge.upcomingCauseListCount} Cases</span></div>
                    <button
                      onClick={() => {
                        setSelectedJudge(judge);
                        setShowJudgeModal(true);
                      }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <PaginationControls
              currentPage={currentJudgeListPage}
              totalPages={totalJudgePages}
              totalItems={filteredJudges.length}
              pageSize={judgePageSize}
              onPageChange={(page) => setJudgeListPage(page)}
              onPageSizeChange={(size) => setJudgePageSize(size)}
              pageSizeOptions={[3, 6, 9]}
              itemName="judges"
            />
          </div>
        </div>
      )}

      {/* TAB 4: CASE STATUS & CNR TRACKER */}
      {activeTab === 'case_tracker' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Live Case Status & eCourts CNR Tracker</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track status across High Courts, District Courts & NJDG via CNR, Case No, Party Name or Advocate Registration
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {[
                  { id: 'cnr', label: '16-Digit CNR Number' },
                  { id: 'case_no', label: 'Case Number & Year' },
                  { id: 'party', label: 'Party Name' },
                  { id: 'advocate', label: 'Advocate Enrollment No' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setCaseSearchType(type.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      caseSearchType === type.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 min-w-[280px] relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={cnrSearchQuery}
                  onChange={(e) => setCnrSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFetchCnr()}
                  placeholder="Enter 16-Digit CNR (e.g., DLHC010045212024 or CIVIL/877/2024)..."
                  className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleFetchCnr}
                  className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Fetch CNR
                </button>
              </div>
            </div>
          </div>

          {cnrNotFoundMsg && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-between">
              <span>⚠️ No direct matching record found for "{cnrSearchQuery}". Showing default featured case record below or try searching "DLCT010008772024".</span>
              <button onClick={() => setCnrNotFoundMsg(false)} className="text-amber-700 underline text-[11px]">Dismiss</button>
            </div>
          )}

          {/* Fetched Case Details View */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                    LIVE SYNCED WITH eCOURTS
                  </span>
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">CNR: DLCT010008772024</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Arun Kumar Jaiswal vs. Sohanlal Jaiswal & Ors [CIVIL/877/2024]
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tis Hazari District Court Complex | Court Room No. 312 | Presided by Shri Vikramaditya Das, DHJS
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('ai_assistant')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Bot className="w-4 h-4" />
                  <span>AI Pre-Hearing Brief</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Current Stage</span>
                <div className="font-black text-sm text-slate-900 dark:text-white">Cross Examination of PW-1</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Next Hearing Date</span>
                <div className="font-black text-sm text-indigo-600 dark:text-indigo-400">{formatDisplayDate(causeListDate)} (Item #4)</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Acts & Sections</span>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">Sec 6 Hindu Succession Act</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Assigned Counsel</span>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">Adv. Deshna Jaiswal</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CAUSE LIST MANAGEMENT */}
      {activeTab === 'cause_list' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Automated Cause List Manager</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Organized roster for High Court, District Court & NCLT hearings with estimated appearance times
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="date"
                value={causeListDate}
                onChange={(e) => setCauseListDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none"
              />
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Roster</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-bold">Item #</th>
                  <th className="pb-3 font-bold">Court / Room</th>
                  <th className="pb-3 font-bold">Judge Name</th>
                  <th className="pb-3 font-bold">Case Number / Title</th>
                  <th className="pb-3 font-bold">Stage</th>
                  <th className="pb-3 font-bold">Est Time</th>
                  <th className="pb-3 font-bold">Prep Status</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {paginatedCauseList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      #{item.itemNo}
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{item.courtName}</div>
                      <div className="text-[10px] text-slate-400">{item.courtRoomNo}</div>
                    </td>
                    <td className="py-3.5 text-slate-700 dark:text-slate-300 font-bold">{item.judgeName}</td>
                    <td className="py-3.5">
                      <div className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{item.caseNumber}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 font-bold max-w-xs truncate">{item.matterTitle}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                        {item.stage}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono text-slate-800 dark:text-slate-200 font-bold">{item.estimatedTime}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.prepStatus === 'Ready'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}>
                        {item.prepStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setActiveTab('ai_assistant')}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-bold text-[11px]"
                      >
                        AI Brief
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <PaginationControls
              currentPage={currentCauseListPage}
              totalPages={totalCauseListPages}
              totalItems={filteredCauseList.length}
              pageSize={causePageSize}
              onPageChange={(page) => setCauseListPage(page)}
              onPageSizeChange={(size) => setCausePageSize(size)}
              pageSizeOptions={[5, 10, 20]}
              itemName="hearings"
            />
          </div>
        </div>
      )}

      {/* TAB 6: AI HEARING ASSISTANT */}
      {activeTab === 'ai_assistant' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white">AI Pre-Hearing Assistant & Argue Cockpit</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated case briefing, cross-examination questions, likely objections & Supreme Court citations
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print 1-Page Hearing Brief</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-300">
                <span className="font-mono text-sm">{mockAIHearingBrief.caseNumber} - Case Briefing Note</span>
                <span>Grounded Gemini 3.6 RAG</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {mockAIHearingBrief.caseSummary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Questions to Ask */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Suggested Cross-Examination Questions</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {mockAIHearingBrief.questionsToAsk.map((q, idx) => (
                    <li key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Likely Objections & Counter Strategy */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Likely Opposing Objections & Precedents</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {mockAIHearingBrief.likelyObjections.map((obj, idx) => (
                    <li key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Supreme Court Citations */}
            <div className="space-y-3">
              <div className="font-black text-sm text-slate-900 dark:text-white">Relevant Supreme Court & High Court Citations</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mockAIHearingBrief.recentJudgments.map((j, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                    <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{j.citation}</div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{j.ratio}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: CASE HEALTH SCORE */}
      {activeTab === 'health_score' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                  AI READINESS AUDIT
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Case Health Score: CIVIL/877/2024
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comprehensive audit across evidence completeness, witness readiness, limitation dates & fee compliance
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-indigo-600 p-1 flex items-center justify-center shadow-xl">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{mockCaseHealthScore.score}%</span>
                    <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase">Ready</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              {[
                { label: 'Client KYC & Contact', status: mockCaseHealthScore.clientDetailsComplete },
                { label: 'Evidence Uploaded', status: mockCaseHealthScore.evidenceComplete },
                { label: 'Witness Briefed', status: mockCaseHealthScore.witnessReady },
                { label: 'Cross Notes Ready', status: mockCaseHealthScore.crossExamReady },
                { label: 'Documents Vectorized', status: mockCaseHealthScore.documentsUploaded },
                { label: 'Fees Paid', status: mockCaseHealthScore.feesPaid },
                { label: 'Timeline Updated', status: mockCaseHealthScore.timelineUpdated },
                { label: 'Limitation Safe', status: mockCaseHealthScore.limitationSafe },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                  {item.status ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 space-y-3">
              <div className="font-black text-sm text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Health Improvement Recommendations</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {mockCaseHealthScore.aiRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AI LEGAL TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">AI Legal Chronology & Timeline</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated sequence of pleadings, court orders, client meetings, notices and evidence filings
              </p>
            </div>

            <div className="relative pl-6 border-l-2 border-indigo-500 space-y-6 py-2">
              {[
                { date: '14 Jul 2024', title: 'Plaint Instituted in Barasat / Tis Hazari', desc: 'Suit for Partition and Injunction filed on behalf of Plaintiff Arun Kumar Jaiswal.', type: 'Filing' },
                { date: '20 Sep 2024', title: 'Written Statement Filed', desc: 'Defendant No. 1 filed WS claiming prior oral partition in 1998.', type: 'Pleading' },
                { date: '12 Jun 2026', title: 'Order Passed - 5 Issues Framed', desc: 'Court framed issues regarding limitation, coparcenary share and suit valuation.', type: 'Court Order' },
                { date: formatDisplayDate(causeListDate), title: 'Today: Cross Examination PW-1', desc: 'PW-1 chief affidavit marked Ex PW1/A. Cross examination in Court Room 312.', type: 'Hearing' },
              ].map((event, idx) => (
                <div key={idx} className="relative space-y-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-900 absolute -left-[31px] top-1" />
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    <span>{event.date}</span>
                    <span className="px-2 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-[9px]">{event.type}</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{event.title}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{event.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: LEGAL KNOWLEDGE GRAPH */}
      {activeTab === 'knowledge_graph' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Legal Knowledge Graph Visualizer</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connected graph linking Client → Matter → Court → Judge → Documents → Orders → Evidence → Witnesses → Acts → AI Memory
              </p>
            </div>

            {/* Knowledge Graph Visual Nodes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {mockKnowledgeGraphNodes.map((node) => (
                <div
                  key={node.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1 text-xs hover:border-indigo-500 transition-all"
                >
                  <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono text-[9px] font-bold">
                    {node.type}
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{node.label}</div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">{node.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: SMART NOTIFICATIONS & WHATSAPP ALERT DISPATCHER */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Smart WhatsApp & Multi-Channel Alert Dispatcher</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct WhatsApp API & SMS gateway integration for instant cause list alerts, hearing date changes, fee reminders and order copies
              </p>
            </div>

            {/* Dispatcher Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Dispatch Controls */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                  <span>1. Configure Alert Parameters</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                    WhatsApp Business API Active
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                      Recipient Mobile Number
                    </label>
                    <input
                      type="text"
                      value={waMobile}
                      onChange={(e) => setWaMobile(e.target.value)}
                      placeholder="+91 98301 23456"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                      Select Matter / Case Number
                    </label>
                    <select
                      value={waCase}
                      onChange={(e) => setWaCase(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="CIVIL/877/2024">CIVIL/877/2024 - Arun Kumar Jaiswal vs. Sohanlal Jaiswal</option>
                      <option value="CS(COMM)/420/2024">CS(COMM)/420/2024 - M/s Apex Logistics vs. Union of India</option>
                      <option value="WP(C)/4521/2024">WP(C)/4521/2024 - Rajesh Verma vs. State of WB</option>
                      <option value="BAIL/1092/2026">BAIL/1092/2026 - State vs. Vikrant Sharma</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                      Notification Message Template
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'hearing', label: '🗓️ Next Hearing Date' },
                        { id: 'causelist', label: '⚡ Cause List Approaching' },
                        { id: 'invoice', label: '💳 Fee Invoice Due' },
                        { id: 'order', label: '📑 Order Copy Ready' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setWaTemplate(t.id as any)}
                          className={`p-2 rounded-xl font-bold text-[11px] text-left transition-all ${
                            waTemplate === t.id
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                      Additional Advocate Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={waCustomNote}
                      onChange={(e) => setWaCustomNote(e.target.value)}
                      placeholder="e.g. Please bring original property deed documents tomorrow at 10 AM."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Live Message Preview & Dispatch */}
              <div className="p-5 rounded-2xl bg-[#0B141B] text-slate-100 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                      WhatsApp Live Message Preview
                    </span>
                    <span className="text-[10px] text-slate-400">Recipient: {waMobile}</span>
                  </div>

                  {/* WhatsApp Chat Bubble Mock */}
                  <div className="p-4 rounded-2xl bg-[#202C33] border border-slate-700/60 text-xs text-slate-200 space-y-2 shadow-lg font-sans">
                    <div className="font-bold text-emerald-400 text-sm">⚖️ LawyerDesk eCourt Alert</div>
                    <div className="text-slate-300 leading-relaxed space-y-1">
                      {waTemplate === 'hearing' && (
                        <>
                          <p>Dear Client, your matter <strong>{waCase}</strong> is scheduled for hearing on <strong>{formatDisplayDate(causeListDate)} at 10:45 AM</strong>.</p>
                          <p>Court: <strong>Tis Hazari Court Room 312</strong> (Shri Vikramaditya Das, DHJS).</p>
                          <p>Stage: PW-1 Cross Examination.</p>
                        </>
                      )}
                      {waTemplate === 'causelist' && (
                        <>
                          <p>⚡ <strong>Urgent Cause List Update</strong>: Your case <strong>{waCase}</strong> is listed as <strong>Item #4</strong> in Court Room 312 today.</p>
                          <p>Estimated appearance time: 10:45 AM.</p>
                        </>
                      )}
                      {waTemplate === 'invoice' && (
                        <>
                          <p>💳 <strong>Fee Invoice Reminder</strong>: Invoice #INV-2026-881 for matter <strong>{waCase}</strong> is generated.</p>
                          <p>Amount: ₹15,000 INR. Payable via UPI/Bank transfer.</p>
                        </>
                      )}
                      {waTemplate === 'order' && (
                        <>
                          <p>📑 <strong>Certified Order Copy Ready</strong>: The court order for <strong>{waCase}</strong> has been extracted and uploaded to your client vault.</p>
                        </>
                      )}
                      {waCustomNote && (
                        <p className="pt-2 text-amber-300 font-medium border-t border-slate-700/60">
                          📌 Note: {waCustomNote}
                        </p>
                      )}
                    </div>
                    <div className="text-[9px] text-slate-400 text-right font-mono">Today, 09:42 AM • Sent via LawyerDesk Cloud</div>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <button
                    onClick={() => {
                      const newLog = {
                        id: String(Date.now()),
                        time: 'Just now',
                        channel: 'WhatsApp',
                        recipient: `${waMobile} (${waCase})`,
                        caseNo: waCase,
                        status: 'Sent ✅',
                      };
                      setWaLog([newLog, ...waLog]);
                      handleSendNotification('WhatsApp Alert', waCase);
                      setWaCustomNote('');
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Dispatch WhatsApp Alert Now</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">
                    Compliant with TRAI DND regulations & WhatsApp Business Cloud API
                  </p>
                </div>
              </div>
            </div>

            {/* Historical Dispatch Logs */}
            <div className="space-y-3 pt-2">
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                <span>Recent Dispatched Alert History</span>
                <span className="text-slate-400 text-[10px] font-mono">{waLog.length} Total Alerts Logged</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                      <th className="pb-2">Time</th>
                      <th className="pb-2">Channel</th>
                      <th className="pb-2">Recipient / Client</th>
                      <th className="pb-2">Case No</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {waLog.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 font-mono text-slate-500">{log.time}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            {log.channel}
                          </span>
                        </td>
                        <td className="py-2.5 font-bold text-slate-900 dark:text-white">{log.recipient}</td>
                        <td className="py-2.5 font-mono text-indigo-600 dark:text-indigo-400 font-bold">{log.caseNo}</td>
                        <td className="py-2.5 text-right font-mono text-emerald-500 font-bold">{log.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: CLIENT PORTAL VIEW */}
      {activeTab === 'client_portal' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono text-[10px] font-bold">
                  CLIENT VIEW PREVIEW
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">Client Portal - Arun Kumar Jaiswal</h2>
              </div>
              <div className="text-xs text-emerald-500 font-bold font-mono">PORTAL ACCESS ACTIVE</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold">Next Court Hearing</span>
                <div className="font-bold text-sm text-slate-900 dark:text-white">{formatDisplayDate(causeListDate)} - 10:45 AM</div>
                <div className="text-slate-500">Tis Hazari Court Room 312</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold">Case Status</span>
                <div className="font-bold text-sm text-indigo-600 dark:text-indigo-400">PW-1 Cross Examination</div>
                <div className="text-slate-500">Matter CIVIL/877/2024</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold">Outstanding Invoice</span>
                <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">All Fees Paid (₹0 Due)</div>
                <div className="text-slate-500">GST Invoice #INV2024-0001</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 12: FIRM ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Case Clearance Rate</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">88.4%</div>
              <p className="text-xs text-emerald-500 font-medium">+4.2% higher than state court average</p>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Fee Recovery Rate</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">96.2%</div>
              <p className="text-xs text-emerald-500 font-medium">GST Invoices processed via WhatsApp reminders</p>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">AI Time Saved / Month</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">142 Hours</div>
              <p className="text-xs text-indigo-500 font-medium">PaddleOCR & Gemini 3.6 Flash legal research</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 13: VOICE ASSISTANT */}
      {activeTab === 'voice_assistant' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">AI Voice Assistant & Command Center</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] uppercase border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    Web Speech & Audio Synthesis
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Speak or type natural commands to prepare arguments, search cause lists, summarize hearings, or draft court notes.
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : isSpeaking ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                  {isListening ? 'MICROPHONE RECORDING' : isSpeaking ? 'AI SPEAKING AUDIO' : 'VOICE ENGINE READY'}
                </span>
              </div>
            </div>

            {/* Custom Interactive Voice Input Command Bar */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Speak into Mic or Type Custom Command
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={startMicListening}
                  disabled={isListening}
                  className={`p-3.5 rounded-2xl text-white font-bold text-xs flex items-center justify-center transition-all shadow-md shrink-0 cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 animate-pulse ring-4 ring-rose-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                  title="Click to activate Web Speech Recognition"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customVoiceInput}
                    onChange={(e) => setCustomVoiceInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTriggerVoice(customVoiceInput)}
                    placeholder="Type or dictate command (e.g., 'Find cases listed before Justice Swarana Kanta Sharma', 'Show tomorrow hearings')..."
                    className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleTriggerVoice(customVoiceInput)}
                    className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    title="Run Voice AI Command"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Preset Voice Command Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recommended Voice Prompts</span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Show tomorrow's hearings",
                  "Prepare today's arguments",
                  "Summarize last hearing",
                  "Show pending documents",
                  "Search cause list item #4",
                  "Check bail status in FIR 204/2024",
                ].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => {
                      setCustomVoiceInput(phrase);
                      handleTriggerVoice(phrase);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-600 hover:text-white font-bold text-xs text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-2xs border border-slate-200/60 dark:border-slate-700/60"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>

            {/* Listening State Card */}
            {isListening && (
              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-500 animate-pulse">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-extrabold text-sm text-indigo-950 dark:text-indigo-200">
                      Speech Recognition Active
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px] mt-0.5">
                      "{voiceQuery || 'Listening to microphone...'}"
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-8 bg-rose-500 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-4 bg-emerald-500 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}

            {/* AI Voice Command Result Box */}
            {voiceResponse && (
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800 font-sans text-xs shadow-xl animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-white">AI Voice Command Result</span>
                      <p className="text-[11px] text-slate-400 font-mono">Query: "{voiceQuery}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Speak / Pause Audio Button */}
                    <button
                      onClick={() => speakText(voiceResponse)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSpeaking
                          ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? 'Stop Audio' : 'Read Aloud (TTS)'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-slate-200 text-sm leading-relaxed font-medium bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  {voiceResponse}
                </p>

                {/* Quick Result Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(voiceResponse);
                        setCopiedVoiceResult(true);
                        setTimeout(() => setCopiedVoiceResult(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedVoiceResult ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copiedVoiceResult ? 'Copied!' : 'Copy Result'}</span>
                    </button>

                    <button
                      onClick={() => handleSendNotification('WhatsApp', 'CIVIL/877/2024')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Send via WhatsApp</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setNotificationSent('✓ Generated AI Hearing Briefing Note from Voice Output!')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Save to Hearing Prep File</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 14: DATABASE SCHEMA & ER DIAGRAM */}
      {activeTab === 'database_schema' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">PostgreSQL Enterprise Schema DDL</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Production PostgreSQL tables for Courts, Judges, Cause Lists, Hearings, Knowledge Graph & Case Health
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copied DDL!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            <pre className="p-5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-[500px]">
              {postgresqlSchemaDDL}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 15: ADMIN PANEL */}
      {activeTab === 'admin_panel' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Court Intelligence Admin Panel</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure court directories, judge assignments, practice area classifications & AI RAG permissions
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">Court Master DB</span>
                <p className="text-slate-500">8 Active Courts Configured</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">Judicial Profiles</span>
                <p className="text-slate-500">3 Presiding Officer Profiles</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">PaddleOCR Engine</span>
                <p className="text-slate-500">Devanagari & Bengali Active</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">Gemini 3.6 RAG</span>
                <p className="text-slate-500">Grounded Embeddings Active</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* External Portal Launcher Modal */}
      {activeLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Globe className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    {activeLinkModal.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeLinkModal.courtName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveLinkModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Target Portal URL</div>
                <div className="font-mono text-xs text-indigo-600 dark:text-indigo-400 break-all select-all font-bold">
                  {activeLinkModal.url}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                You are accessing the official public portal for <strong>{activeLinkModal.courtName}</strong>. You can launch the site in a new tab or copy the direct address below.
              </p>

              {activeLinkModal.title.toLowerCase().includes('cause list') && (
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs flex items-center justify-between">
                  <span className="text-indigo-900 dark:text-indigo-200 font-bold">
                    Or view LawyerDesk's integrated cause list roster:
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab('cause_list');
                      setActiveLinkModal(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs shrink-0"
                  >
                    Open Roster
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <a
                href={activeLinkModal.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setTimeout(() => setActiveLinkModal(null), 500);
                }}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all text-center"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in New Tab</span>
              </a>

              <button
                onClick={() => handleCopyLink(activeLinkModal.url)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy URL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Judge Profile Drawer / Modal */}
      {showJudgeModal && selectedJudge && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-lg">
                    {selectedJudge.name}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                    {selectedJudge.designation} • {selectedJudge.courtName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowJudgeModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Bench Type</span>
                <div className="font-black text-slate-900 dark:text-white">{selectedJudge.benchType}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Court Room</span>
                <div className="font-black text-slate-900 dark:text-white">{selectedJudge.courtRoomNo}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Appointed Date</span>
                <div className="font-black text-slate-900 dark:text-white">{selectedJudge.appointedDate}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Retirement Date</span>
                <div className="font-black text-slate-900 dark:text-white">{selectedJudge.retirementDate}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-1.5 text-xs">
              <div className="font-bold text-indigo-900 dark:text-indigo-300">Current Bench Roster & Subject Assignment</div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{selectedJudge.currentAssignment}</p>
            </div>

            {/* Notable Judgments */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-slate-900 dark:text-white">Notable Judgments & Legal Precedents</div>
              <div className="space-y-2">
                {selectedJudge.notableJudgments.map((j, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{j.citation}</span>
                      <span className="text-[10px] text-slate-400">{j.date}</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">{j.title}</div>
                    <p className="text-slate-500">{j.subject}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transfer History */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-slate-900 dark:text-white">Judicial Transfer & Posting History</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedJudge.transferHistory.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{t.previousCourt}</span>
                    <span className="font-mono text-slate-400 text-[10px]">{t.tenure}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowJudgeModal(false);
                  setActiveTab('cause_list');
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                View Roster in Cause List
              </button>
              <button
                onClick={() => setShowJudgeModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
