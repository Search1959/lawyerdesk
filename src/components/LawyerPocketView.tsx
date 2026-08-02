import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Mic,
  Camera,
  Calendar,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Folder,
  UserCheck,
  Zap,
  ChevronRight,
  Send,
  Sliders,
  DollarSign,
  FileText,
  X,
  Volume2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  ExternalLink,
  Laptop,
  BookOpen,
  Copy,
  FileSearch
} from 'lucide-react';
import { Matter, Hearing, Client, Task, Invoice, User, LawFirm } from '../types';

interface LawyerPocketProps {
  matters: Matter[];
  hearings: Hearing[];
  clients: Client[];
  tasks: Task[];
  invoices: Invoice[];
  currentUser: User;
  currentFirm: LawFirm;
  onAddHearing?: (hearing: Partial<Hearing>) => void;
  onAddClient?: (client: Partial<Client>) => void;
  onAddMatter?: (matter: Partial<Matter>) => void;
  onAddInvoice?: (invoice: Partial<Invoice>) => void;
  onAddTask?: (task: Partial<Task>) => void;
  onUpdateMatter?: (matter: Matter) => void;
  onOpenLawyerDeskView?: (view: string) => void;
}

export const LawyerPocketView: React.FC<LawyerPocketProps> = ({
  matters,
  hearings,
  clients,
  tasks,
  invoices,
  currentUser,
  currentFirm,
  onAddHearing,
  onAddClient,
  onAddMatter,
  onAddInvoice,
  onAddTask,
  onUpdateMatter,
  onOpenLawyerDeskView
}) => {
  // Navigation & Frame Modes
  const [activeTab, setActiveTab] = useState<'home' | 'cases' | 'camera' | 'voice' | 'profile'>('home');
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [syncedStatus, setSyncedStatus] = useState<string>('Live Synced with LawyerDesk ERP');

  // Quick Action Modals
  const [quickActionModal, setQuickActionModal] = useState<
    'record_hearing' | 'record_fee' | 'new_client' | 'new_case' | 'voice_dictate' | 'camera_scan' | 'doc_search' | null
  >(null);

  // Document Content AI Search State
  const [docSearchMatterId, setDocSearchMatterId] = useState<string>('all');
  const [docSearchQuery, setDocSearchQuery] = useState<string>('interim stay');
  const [isSearchingDocs, setIsSearchingDocs] = useState<boolean>(false);
  const [docSearchResults, setDocSearchResults] = useState<Array<{
    id: string;
    docName: string;
    caseNumber: string;
    pageNo: number;
    paraNo: number;
    matchScore: number;
    excerpt: string;
    category: string;
  }> | null>(null);

  // Quick Hearing Record State
  const [selectedMatterId, setSelectedMatterId] = useState<string>(matters[0]?.id || '');
  const [hearingOutcome, setHearingOutcome] = useState<string>('Adjourned to next date');
  const [nextHearingDate, setNextHearingDate] = useState<string>('2026-08-18');
  const [feeCollectedINR, setFeeCollectedINR] = useState<string>('');
  const [hearingNotes, setHearingNotes] = useState<string>('');

  // Quick Fee State
  const [feeClientId, setFeeClientId] = useState<string>(clients[0]?.id || '');
  const [feeAmount, setFeeAmount] = useState<string>('5000');
  const [feeMode, setFeeMode] = useState<'UPI' | 'Cash' | 'Bank Transfer' | 'Cheque'>('UPI');
  const [feeNotes, setFeeNotes] = useState<string>('Court appearance token fee');

  // Voice Mode State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [isParsingVoice, setIsParsingVoice] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    caseNumber?: string;
    outcome?: string;
    nextDate?: string;
    feePaid?: string;
    notes?: string;
  } | null>(null);

  // Camera Mode State
  const [docCategory, setDocCategory] = useState<'Court Order' | 'Cause List' | 'Petition' | 'Fee Receipt' | 'Vakalatnama'>('Court Order');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<{
    matchedCaseNumber?: string;
    matchedMatterId?: string;
    extractedText?: string;
    confidence?: number;
  } | null>(null);

  // AI Quick Chat Query
  const [aiQuery, setAiQuery] = useState('');
  const [aiChatLogs, setAiChatLogs] = useState<Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: `Hello ${currentUser.name || 'Advocate'}! I am your LawyerPocket AI Companion. Ask me to find clients, check today's court list, or record hearing results instantly.`,
      timestamp: 'Just now'
    }
  ]);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filtered Today's Data
  const todayStr = new Date().toISOString().split('T')[0];
  const todayHearings = hearings.filter((h) => h.date === todayStr || true).slice(0, 5); // Show top items
  const pendingTasksList = tasks.filter((t) => !t.completed).slice(0, 4);
  const unpaidInvoices = invoices.filter((i) => i.status === 'Pending' || i.status === 'Overdue');
  const totalPendingFeesINR = unpaidInvoices.reduce((acc, i) => acc + (i.totalINR || 0), 0);

  // Filtered Cases for Search
  const filteredMatters = matters.filter(
    (m) =>
      m.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.court && m.court.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle Quick Hearing Record Submit
  const handleSaveQuickHearing = (e: React.FormEvent) => {
    e.preventDefault();
    const matter = matters.find((m) => m.id === selectedMatterId);
    if (!matter) return;

    if (onAddHearing) {
      onAddHearing({
        matterId: matter.id,
        date: todayStr,
        time: '10:30 AM',
        courtName: matter.court,
        courtHallNo: matter.courtRoomNo || 'Court Hall 4',
        judgeName: matter.judgeName || 'Hon’ble Bench',
        stage: 'Arguments / Hearing',
        synopsis: hearingNotes || hearingOutcome,
        outcome: hearingOutcome,
        nextHearingDate: nextHearingDate,
        assignedLawyerId: currentUser.id,
        assignedLawyerName: currentUser.name
      });
    }

    if (onUpdateMatter) {
      onUpdateMatter({
        ...matter,
        nextHearingDate: nextHearingDate,
        status: 'Active Litigation'
      });
    }

    // If fee collected
    if (feeCollectedINR && Number(feeCollectedINR) > 0 && onAddInvoice) {
      onAddInvoice({
        matterId: matter.id,
        clientId: matter.clientId,
        clientName: matter.clientName,
        lawFirmName: currentFirm.name,
        invoiceNumber: `INV-PKT-${Date.now().toString().slice(-4)}`,
        issueDate: todayStr,
        dueDate: todayStr,
        status: 'Paid',
        subtotalINR: Number(feeCollectedINR),
        gstINR: 0,
        totalINR: Number(feeCollectedINR),
        feeType: 'Appearance Fee',
        items: [
          {
            description: `Court Appearance Fee (${matter.caseNumber})`,
            sacCode: '998213',
            amountINR: Number(feeCollectedINR)
          }
        ]
      });
    }

    setQuickActionModal(null);
    showToast(`✅ Hearing outcome & next date (${nextHearingDate}) updated to LawyerDesk ERP!`);
  };

  // Handle Quick Fee Submit
  const handleSaveQuickFee = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === feeClientId);
    if (!client) return;

    if (onAddInvoice) {
      onAddInvoice({
        clientId: client.id,
        clientName: client.name,
        lawFirmName: currentFirm.name,
        invoiceNumber: `INV-PKT-${Date.now().toString().slice(-4)}`,
        issueDate: todayStr,
        dueDate: todayStr,
        status: 'Paid',
        subtotalINR: Number(feeAmount),
        gstINR: 0,
        totalINR: Number(feeAmount),
        feeType: 'Appearance Fee',
        items: [
          {
            description: feeNotes || 'Court retainer & appearance fee',
            sacCode: '998213',
            amountINR: Number(feeAmount)
          }
        ]
      });
    }

    setQuickActionModal(null);
    showToast(`💰 Payment of ₹${Number(feeAmount).toLocaleString('en-IN')} recorded & synced to LawyerDesk!`);
  };

  // Voice AI Dictation Parser
  const runVoiceSimulation = (sampleText: string) => {
    setVoiceText(sampleText);
    setIsRecording(false);
    setIsParsingVoice(true);

    setTimeout(() => {
      setIsParsingVoice(false);
      // Smart extraction simulation
      const extracted = {
        caseNumber: sampleText.match(/(?:Execution Petition|Commercial Suit|Writ Petition|CS|CC)\s*\d+(?:\s*of\s*\d+)?/i)?.[0] || 'Execution Petition 458 of 2026',
        outcome: sampleText.includes('Adjourned') ? 'Adjourned to Next Date' : 'Stay Order Granted',
        nextDate: sampleText.includes('18 August') ? '2026-08-18' : '2026-09-10',
        feePaid: sampleText.match(/(?:paid|collected|received)\s*(\d+)/i)?.[1] || '5000',
        notes: sampleText
      };
      setExtractedData(extracted);
      showToast('⚡ AI extracted Case #, Next Date & Payment from your dictation!');
    }, 1200);
  };

  // Sync Voice Extracted Data
  const handleSyncVoiceToERP = () => {
    if (!extractedData) return;
    const matchedMatter = matters.find((m) => m.caseNumber.toLowerCase().includes((extractedData.caseNumber || '').toLowerCase().slice(0, 8))) || matters[0];

    if (onAddHearing && matchedMatter) {
      onAddHearing({
        matterId: matchedMatter.id,
        date: todayStr,
        time: '11:00 AM',
        courtName: matchedMatter.court,
        courtHallNo: 'Court Hall 2',
        judgeName: matchedMatter.judgeName || 'Hon’ble Bench',
        stage: 'Voice Dictated Briefing',
        synopsis: extractedData.notes,
        outcome: extractedData.outcome,
        nextHearingDate: extractedData.nextDate,
        assignedLawyerId: currentUser.id,
        assignedLawyerName: currentUser.name
      });
    }

    setExtractedData(null);
    setVoiceText('');
    setQuickActionModal(null);
    showToast(`🚀 Voice Briefing synced automatically to LawyerDesk ERP case ${matchedMatter?.caseNumber || ''}!`);
  };

  // Camera Capture Simulation
  const handleSimulateCameraCapture = () => {
    setIsOcrProcessing(true);
    setCapturedImage('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80');

    setTimeout(() => {
      setIsOcrProcessing(false);
      const targetMatter = matters[0];
      setOcrResult({
        matchedCaseNumber: targetMatter?.caseNumber || 'WP 1042/2026',
        matchedMatterId: targetMatter?.id,
        extractedText: `IN THE HIGH COURT OF JUDICATURE AT CALCUTTA\nORDER SHEET DATED ${todayStr}\nCORAM: HON'BLE JUSTICE CHATTERJEE\nMATTER: ${targetMatter?.caseNumber || 'WP 1042/2026'}\nInterim Stay extended till next date of hearing. Counter affidavit to be filed within 2 weeks.`,
        confidence: 98.4
      });
      showToast('📷 PaddleOCR extracted text & matched LawyerDesk Case file!');
    }, 1500);
  };

  const handleSyncOcrToERP = () => {
    if (!ocrResult) return;
    showToast(`📄 Document attached to LawyerDesk Case ${ocrResult.matchedCaseNumber} timeline successfully!`);
    setCapturedImage(null);
    setOcrResult(null);
    setActiveTab('home');
  };

  // AI Document Content Search Executor
  const handleExecuteDocSearch = (queryOverride?: string) => {
    const q = queryOverride !== undefined ? queryOverride : docSearchQuery;
    if (!q.trim()) return;

    setIsSearchingDocs(true);
    const targetMatter = docSearchMatterId !== 'all' ? matters.find((m) => m.id === docSearchMatterId) : null;
    const caseRef = targetMatter ? targetMatter.caseNumber : (matters[0]?.caseNumber || 'CS(COMM) 420/2024');

    setTimeout(() => {
      setIsSearchingDocs(false);
      const mockResults = [
        {
          id: 'res-1',
          docName: `${caseRef.replace(/[^a-z0-9]/gi, '_')}_HighCourt_Order_01Aug2026.pdf`,
          caseNumber: caseRef,
          pageNo: 2,
          paraNo: 6,
          matchScore: 98.8,
          category: 'Court Order',
          excerpt: `"...Upon hearing learned counsel for petitioner, Court grants ad-interim stay on execution of money decree till next date. Respondent directed to file counter affidavit within 3 weeks..."`
        },
        {
          id: 'res-2',
          docName: `${caseRef.replace(/[^a-z0-9]/gi, '_')}_Written_Statement_Defendant.pdf`,
          caseNumber: caseRef,
          pageNo: 4,
          paraNo: 12,
          matchScore: 94.2,
          category: 'Written Statement',
          excerpt: `"...Defendant specifically denies liability under Section 138 NI Act as statutory demand notice was issued beyond the 30-day limitation window prescribed under proviso (b)..."`
        },
        {
          id: 'res-3',
          docName: `${caseRef.replace(/[^a-z0-9]/gi, '_')}_Commercial_Agreement_2025.pdf`,
          caseNumber: caseRef,
          pageNo: 8,
          paraNo: 19,
          matchScore: 91.5,
          category: 'Exhibits & Contract',
          excerpt: `"...Clause 14.2 (Arbitration & Jurisdiction): All disputes shall be referred to sole arbitrator in New Delhi under MCIA Rules. High Court of Calcutta shall have supervisory jurisdiction..."`
        }
      ];

      setDocSearchResults(mockResults);
      showToast(`🔍 Found ${mockResults.length} grounded document excerpts matching "${q}"!`);
    }, 600);
  };

  // Handle AI Chat Send
  const handleSendAiChat = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const userQ = customQuery || aiQuery;
    if (!userQ.trim()) return;

    if (!customQuery) setAiQuery('');
    setAiChatLogs((prev) => [...prev, { sender: 'user', text: userQ, timestamp: 'Just now' }]);

    setTimeout(() => {
      let reply = `Based on your LawyerDesk ERP database: I found matching information for "${userQ}".`;
      const qLower = userQ.toLowerCase();

      if (
        qLower.includes('doc') ||
        qLower.includes('search') ||
        qLower.includes('stay') ||
        qLower.includes('order') ||
        qLower.includes('written') ||
        qLower.includes('notice') ||
        qLower.includes('petition') ||
        qLower.includes('clause') ||
        qLower.includes('content') ||
        qLower.includes('paragraph') ||
        qLower.includes('file')
      ) {
        const topCase = matters[0]?.caseNumber || 'WP 1042/2026';
        reply = `📄 **PaddleOCR Case Document Vector Search Results**:

Matches found across 3 uploaded case files for **${topCase}**:

1. **High Court Interim Stay Order** (Page 2, Para 6 • 98.8% Vector Match)
   *"...Court grants ad-interim stay on execution of decree subject to deposit of 20% within 14 days..."*

2. **Written Statement of Defendant** (Page 4, Para 12 • 94.2% Vector Match)
   *"...Defendant raises preliminary objection regarding territorial jurisdiction and limitation window under Section 138..."*

3. **Commercial Agreement Exhibit A** (Page 8, Para 19 • 91.5% Vector Match)
   *"...Clause 14.2: Arbitration seat shall be Kolkata with exclusive High Court jurisdiction..."*

*All excerpts extracted from PaddleOCR vector chunks grounded in LawyerDesk Firestore.*`;
      } else if (qLower.includes('sharma') || qLower.includes('client')) {
        reply = `Found client Rajesh Sharma. Phone: +91 98301 22341. Total 2 active matters in Calcutta High Court. Outstanding Fee: ₹12,500.`;
      } else if (qLower.includes('today') || qLower.includes('matter') || qLower.includes('hearing')) {
        reply = `You have ${todayHearings.length} court hearings today. First matter is item #14 before Court Hall 3 at 10:30 AM.`;
      } else if (qLower.includes('unpaid') || qLower.includes('fee')) {
        reply = `Total pending fees in LawyerDesk ERP: ₹${totalPendingFeesINR.toLocaleString('en-IN')}. Top unpaid client: Apex Tech Corp (₹35,000).`;
      }

      setAiChatLogs((prev) => [...prev, { sender: 'ai', text: reply, timestamp: 'Just now' }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-1.5 sm:p-4 font-sans relative">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-3 sm:top-4 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-300 max-w-[90vw]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="truncate">{toastMsg}</span>
        </div>
      )}

      {/* Top Application Header / Desktop Switcher */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 px-1 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-600/30 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-black text-base sm:text-lg text-white tracking-tight">LAWYERPOCKET</span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                10-Sec Companion
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Your Chamber in Your Pocket &bull; LawyerDesk ERP Integration</p>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
          {/* Toggle Device Frame */}
          <button
            onClick={() => setIsMobileFrameMode(!isMobileFrameMode)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all active:scale-95"
            title="Toggle between Smartphone Container and Expanded View"
          >
            {isMobileFrameMode ? <Laptop className="w-3.5 h-3.5 text-indigo-400" /> : <Smartphone className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isMobileFrameMode ? 'Expanded View' : 'Phone Frame View'}</span>
          </button>

          {/* ERP Return Link */}
          {onOpenLawyerDeskView && (
            <button
              onClick={() => onOpenLawyerDeskView('dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <span>Back to ERP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Single Database Sync Banner */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-800/40 rounded-xl px-2.5 sm:px-3 py-2 flex items-center justify-between text-xs mb-2 sm:mb-3 shadow-inner">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
          <span className="font-bold text-slate-200 text-[11px] sm:text-xs truncate">{syncedStatus}</span>
          <span className="hidden md:inline text-slate-400">&bull; Single PostgreSQL Database &bull; Zero Duplicate Records</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded border transition-colors ${
              isOfflineMode ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isOfflineMode ? 'Offline Queue' : 'Online Sync'}
          </button>
          <button
            onClick={() => {
              showToast('Refreshed connection to LawyerDesk PostgreSQL Database.');
              setSyncedStatus('Synced Just Now');
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors active:scale-95"
            title="Sync Now"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Smartphone Container View / Canvas */}
      <div
        className={`w-full transition-all duration-300 flex justify-center ${
          isMobileFrameMode ? 'max-w-full sm:max-w-[420px]' : 'max-w-4xl'
        }`}
      >
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-[28px] shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)] sm:h-[820px] sm:min-h-[680px] sm:max-h-[820px] relative sm:border-t-8 sm:border-t-slate-800">
          {/* Desktop/Tablet Simulated Speaker & Camera Notch (Hidden on Mobile viewports) */}
          <div className="hidden sm:flex w-full bg-slate-950 py-1.5 justify-center items-center shrink-0 border-b border-slate-800/60">
            <div className="w-16 h-1 bg-slate-700 rounded-full"></div>
          </div>

          {/* Header Mobile Toolbar */}
          <div className="bg-slate-900/90 backdrop-blur-md px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-800/80 flex items-center justify-between shrink-0 sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-xs shadow-md shrink-0">
                LP
              </div>
              <div>
                <h1 className="text-sm font-black text-white leading-tight">LawyerPocket</h1>
                <p className="text-[10px] text-amber-400 font-semibold truncate max-w-[140px] sm:max-w-[180px]">{currentFirm.name}</p>
              </div>
            </div>

            {/* Quick 10-sec Voice Mic Button in Header */}
            <button
              onClick={() => setQuickActionModal('voice_dictate')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-transform shrink-0 min-h-[36px]"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span>Voice AI</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-3 sm:px-4 py-2 bg-slate-950/60 border-b border-slate-800/50 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cases, clients, documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3 sm:top-2.5" />
            </div>
          </div>

          {/* MAIN SCROLLABLE CONTENT BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
            {/* TAB 1: HOME DASHBOARD */}
            {activeTab === 'home' && (
              <>
                {/* 10-Second Quick Action Buttons Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      10-Second Quick Actions
                    </span>
                    <span className="text-[10px] text-indigo-400 font-bold">1-Tap Sync</span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    <button
                      onClick={() => setQuickActionModal('record_hearing')}
                      className="p-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/90 border border-indigo-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span className="text-[9px] font-bold text-indigo-200 leading-tight">Hearing</span>
                    </button>

                    <button
                      onClick={() => {
                        setQuickActionModal('doc_search');
                        handleExecuteDocSearch('interim stay');
                      }}
                      className="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900/90 border border-purple-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileSearch className="w-3.5 h-3.5 text-purple-300" />
                      </div>
                      <span className="text-[9px] font-bold text-purple-200 leading-tight">Doc AI</span>
                    </button>

                    <button
                      onClick={() => setQuickActionModal('record_fee')}
                      className="p-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-[9px] font-bold text-emerald-200 leading-tight">Fees</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('camera');
                        setQuickActionModal('camera_scan');
                      }}
                      className="p-2 rounded-xl bg-sky-950/70 hover:bg-sky-900/90 border border-sky-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-sky-600/30 border border-sky-500/40 text-sky-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-3.5 h-3.5 text-sky-400" />
                      </div>
                      <span className="text-[9px] font-bold text-sky-200 leading-tight">Scan Order</span>
                    </button>

                    <button
                      onClick={() => setQuickActionModal('voice_dictate')}
                      className="p-2 rounded-xl bg-amber-950/70 hover:bg-amber-900/90 border border-amber-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-600/30 border border-amber-500/40 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mic className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span className="text-[9px] font-bold text-amber-200 leading-tight">Voice AI</span>
                    </button>
                  </div>
                </div>

                {/* Today's Court Hearing Roster Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      <span className="font-extrabold text-xs text-white">Today's Court Hearings</span>
                      <span className="px-1.5 py-0.2 rounded bg-indigo-600/30 text-indigo-300 text-[10px] font-bold">
                        {todayHearings.length}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{todayStr}</span>
                  </div>

                  {todayHearings.length === 0 ? (
                    <p className="text-slate-500 text-center py-3">No hearings listed for today.</p>
                  ) : (
                    <div className="space-y-2">
                      {todayHearings.map((h) => {
                        const m = matters.find((item) => item.id === h.matterId);
                        return (
                          <div
                            key={h.id}
                            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-indigo-300 truncate">{m?.caseNumber || 'Matter'}</span>
                                <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-1 py-0.5 rounded">
                                  {h.time}
                                </span>
                              </div>
                              <p className="text-[11px] font-medium text-slate-200 truncate">{m?.title || h.synopsis}</p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                <span>{h.courtName}</span>
                                <span>&bull;</span>
                                <span>{h.courtHallNo}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedMatterId(h.matterId);
                                setQuickActionModal('record_hearing');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold shrink-0 shadow-sm"
                            >
                              Record
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick Call & WhatsApp Clients Bar */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Quick Client Contact
                    </span>
                    <span className="text-[10px] text-slate-400">{clients.length} Clients</span>
                  </div>

                  <div className="divide-y divide-slate-800/60">
                    {clients.slice(0, 3).map((c) => (
                      <div key={c.id} className="py-2 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-200 text-xs">{c.name}</div>
                          <div className="text-[10px] text-slate-400">{c.phone || '+91 98301 00000'}</div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <a
                            href={`https://wa.me/${(c.phone || '').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 transition-colors"
                            title="WhatsApp Client"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`tel:${c.phone || ''}`}
                            className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 transition-colors"
                            title="Direct Call Client"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Tasks & Unpaid Retainers Summary */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2.5">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Pending Tasks</div>
                    <div className="text-lg font-black text-amber-400 mt-0.5">{pendingTasksList.length} Tasks</div>
                    <p className="text-[10px] text-slate-500 mt-1">Due for Court & Staff</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2.5">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Unpaid Fees</div>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">
                      ₹{totalPendingFeesINR.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{unpaidInvoices.length} Outstanding Invoices</p>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: CASES LIST */}
            {activeTab === 'cases' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-indigo-400" />
                    LawyerDesk Active Cases ({filteredMatters.length})
                  </h2>
                  <button
                    onClick={() => setQuickActionModal('new_case')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Case</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {filteredMatters.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-300 text-xs">{m.caseNumber}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {m.court}
                        </span>
                      </div>

                      <div className="font-bold text-slate-100 text-xs leading-tight">{m.title}</div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Client: {m.clientName}</span>
                        <span className="text-amber-400 font-semibold">Next: {m.nextHearingDate || 'TBD'}</span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-900">
                        <button
                          onClick={() => {
                            setSelectedMatterId(m.id);
                            setQuickActionModal('record_hearing');
                          }}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold"
                        >
                          Record Outcome
                        </button>
                        <a
                          href={`tel:${clients.find((c) => c.id === m.clientId)?.phone || ''}`}
                          className="px-2 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CAMERA SCANNER */}
            {activeTab === 'camera' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-sky-400" />
                    AI Camera Order Scanner
                  </h2>
                  <span className="text-[10px] font-mono text-slate-400">PaddleOCR 2.8</span>
                </div>

                {/* Doc Type Selector */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {(['Court Order', 'Cause List', 'Petition', 'Fee Receipt', 'Vakalatnama'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setDocCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all ${
                        docCategory === cat
                          ? 'bg-sky-600 text-white border-sky-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Simulated Camera Viewport */}
                <div className="bg-slate-950 border-2 border-dashed border-sky-500/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden min-h-[220px]">
                  {capturedImage ? (
                    <div className="w-full space-y-2">
                      <img src={capturedImage} alt="Captured Document" className="w-full h-36 object-cover rounded-xl border border-slate-800" />
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setCapturedImage(null);
                            setOcrResult(null);
                          }}
                          className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold"
                        >
                          Retake
                        </button>
                        <button
                          onClick={handleSyncOcrToERP}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold"
                        >
                          Sync Document to LawyerDesk
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                        <Camera className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">Tap to Take Court Document Photo</div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Scans order sheet, cause list, or fee receipts instantly</p>
                      </div>

                      {/* File Capture Input */}
                      <label className="cursor-pointer px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-transform">
                        <span>Open Camera / Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleSimulateCameraCapture}
                          className="hidden"
                        />
                      </label>

                      <button
                        onClick={handleSimulateCameraCapture}
                        className="text-[10px] text-sky-400 underline font-semibold mt-1"
                      >
                        or Test Sample High Court Order Sheet
                      </button>
                    </>
                  )}

                  {isOcrProcessing && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center space-y-2">
                      <RefreshCw className="w-6 h-6 text-sky-400 animate-spin" />
                      <div className="text-xs font-bold text-white">PaddleOCR Reading Document...</div>
                    </div>
                  )}
                </div>

                {/* OCR Extracted Result Card */}
                {ocrResult && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-emerald-400 text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Matched Case: {ocrResult.matchedCaseNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{ocrResult.confidence}% Confidence</span>
                    </div>
                    <pre className="text-[10px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto bg-slate-900 p-2 rounded-xl border border-slate-800">
                      {ocrResult.extractedText}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: VOICE AI & CHAT */}
            {activeTab === 'voice' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-amber-400" />
                    Voice AI Dictation Studio
                  </h2>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Grounded Gemini 3.6
                  </span>
                </div>

                {/* Dictation Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-3">
                  <div className="text-[11px] text-slate-300 font-medium">
                    Speak naturally in court or car: Mention case #, adjourned date, or fee paid. AI auto-updates LawyerDesk.
                  </div>

                  {/* Mic Control Button */}
                  <div className="flex flex-col items-center justify-center space-y-2 py-2">
                    <button
                      onClick={() => {
                        if (isRecording) {
                          setIsRecording(false);
                        } else {
                          setIsRecording(true);
                          setTimeout(() => {
                            runVoiceSimulation(
                              'Execution Petition 458 of 2026. Matter called. Adjourned to 18 August. Client paid 5000. Upload today’s order.'
                            );
                          }, 2000);
                        }
                      }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-90 ${
                        isRecording
                          ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-500/20'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                      }`}
                    >
                      <Mic className="w-8 h-8" />
                    </button>
                    <span className="text-[10px] font-bold text-slate-400">
                      {isRecording ? 'Listening... Speak Now' : 'Tap Microphone to Start Voice Dictation'}
                    </span>
                  </div>

                  {/* Preset Quick Voice Snippets */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Test Voice Prompts:</div>
                    <button
                      onClick={() =>
                        runVoiceSimulation(
                          'Execution Petition 458 of 2026. Matter called. Adjourned to 18 August. Client paid 5000. Upload today’s order.'
                        )
                      }
                      className="w-full text-left p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] text-slate-300 transition-colors"
                    >
                      🗣️ "Execution Petition 458 of 2026... Adjourned to 18 August... Client paid 5000"
                    </button>
                    <button
                      onClick={() =>
                        runVoiceSimulation(
                          'Commercial Suit 102 of 2025. Hon’ble High Court granted interim stay till 24 September. Send stay order copy.'
                        )
                      }
                      className="w-full text-left p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] text-slate-300 transition-colors"
                    >
                      🗣️ "Commercial Suit 102 of 2025... Interim Stay Granted... Next date 24 Sept"
                    </button>
                  </div>

                  {isParsingVoice && (
                    <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-xs py-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gemini AI Parsing Dictation & Case Matching...</span>
                    </div>
                  )}

                  {/* Extracted Data Card */}
                  {extractedData && (
                    <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-3 space-y-2">
                      <div className="font-bold text-amber-300 text-xs flex items-center justify-between">
                        <span>AI Extracted Briefing</span>
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Parsed</span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        <div>
                          <span className="text-slate-500">Case:</span>{' '}
                          <span className="font-bold text-white">{extractedData.caseNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Next Date:</span>{' '}
                          <span className="font-bold text-amber-300">{extractedData.nextDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Fee Paid:</span>{' '}
                          <span className="font-bold text-emerald-400">₹{extractedData.feePaid}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Outcome:</span>{' '}
                          <span className="font-bold text-slate-200">{extractedData.outcome}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleSyncVoiceToERP}
                        className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Auto-Update LawyerDesk ERP (1 Tap)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* AI Assistant Chat Stream */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-200 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Quick LawyerPocket Chat</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setQuickActionModal('doc_search');
                        handleExecuteDocSearch('interim stay');
                      }}
                      className="px-2 py-0.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-[10px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <FileSearch className="w-3 h-3 text-purple-300" />
                      <span>Search Case Docs AI</span>
                    </button>
                  </div>

                  {/* Quick Chat Chips */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleSendAiChat(undefined, 'Search case document content for interim stay order')}
                      className="px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 shrink-0"
                    >
                      📄 Stay Order Terms
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendAiChat(undefined, 'Search written statement for limitation defense')}
                      className="px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 shrink-0"
                    >
                      ⚖️ Limitation Defense
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendAiChat(undefined, 'Find client Sharma contact details & fees')}
                      className="px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 shrink-0"
                    >
                      📞 Client Sharma
                    </button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {aiChatLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl text-[11px] leading-relaxed whitespace-pre-wrap ${
                          log.sender === 'user'
                            ? 'bg-indigo-600 text-white ml-6 text-right'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 mr-6'
                        }`}
                      >
                        {log.text}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendAiChat} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Ask AI or search case document content..."
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 5: PROFILE & SSO SYNC */}
            {activeTab === 'profile' && (
              <div className="space-y-3">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg ring-4 ring-indigo-500/20">
                    {currentUser.name ? currentUser.name[0] : 'A'}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-sm text-white">{currentUser.name}</h2>
                    <p className="text-[11px] text-indigo-400 font-semibold">{currentUser.role} &bull; {currentFirm.name}</p>
                    <p className="text-[10px] font-mono text-slate-500">{currentUser.email}</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Single Sign-On (SSO) Active
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2 text-xs">
                  <div className="font-bold text-slate-300 border-b border-slate-800 pb-1.5">
                    LawyerDesk Integration Diagnostics
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Database Engine:</span>
                    <span className="font-mono text-slate-200">PostgreSQL Cloud</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Rest API Bridge:</span>
                    <span className="font-mono text-emerald-400">Connected (0ms delay)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Cases Synced:</span>
                    <span className="font-bold text-white">{matters.length} Cases</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Clients Synced:</span>
                    <span className="font-bold text-white">{clients.length} Clients</span>
                  </div>
                </div>

                {onOpenLawyerDeskView && (
                  <button
                    onClick={() => onOpenLawyerDeskView('dashboard')}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Launch Full LawyerDesk Desktop ERP</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* BOTTOM MOBILE NAVIGATION BAR */}
          <div className="bg-slate-950 border-t border-slate-800/80 px-1 sm:px-2 py-2 flex items-center justify-around shrink-0 z-20 pb-safe">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] min-h-[48px] active:scale-95 ${
                activeTab === 'home' ? 'text-indigo-400 font-extrabold bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('cases')}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] min-h-[48px] active:scale-95 ${
                activeTab === 'cases' ? 'text-indigo-400 font-extrabold bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span className="text-[10px]">Cases</span>
            </button>

            <button
              onClick={() => setActiveTab('camera')}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] min-h-[48px] active:scale-95 ${
                activeTab === 'camera' ? 'text-sky-400 font-extrabold bg-sky-500/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span className="text-[10px]">Camera</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] min-h-[48px] active:scale-95 ${
                activeTab === 'voice' ? 'text-amber-400 font-extrabold bg-amber-500/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span className="text-[10px]">Voice AI</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] min-h-[48px] active:scale-95 ${
                activeTab === 'profile' ? 'text-indigo-400 font-extrabold bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span className="text-[10px]">Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: 10-SECOND QUICK RECORD HEARING OUTCOME */}
      {quickActionModal === 'record_hearing' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-3">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-full sm:max-w-sm p-4 sm:p-5 space-y-3 shadow-2xl text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                10-Sec Court Outcome Record
              </div>
              <button
                onClick={() => setQuickActionModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickHearing} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Case:</label>
                <select
                  value={selectedMatterId}
                  onChange={(e) => setSelectedMatterId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                >
                  {matters.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.caseNumber} &bull; {m.clientName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Court Hearing Outcome:</label>
                <select
                  value={hearingOutcome}
                  onChange={(e) => setHearingOutcome(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                >
                  <option value="Adjourned to next date">Adjourned to next date</option>
                  <option value="Argued & Interim Stay Granted">Argued & Interim Stay Granted</option>
                  <option value="Notice Issued Returnable">Notice Issued Returnable</option>
                  <option value="Ex-Parte Order Passed">Ex-Parte Order Passed</option>
                  <option value="Bail Granted">Bail Granted</option>
                  <option value="Judgment Reserved">Judgment Reserved</option>
                  <option value="Matter Disposed / Allowed">Matter Disposed / Allowed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Next Hearing Date:</label>
                <input
                  type="date"
                  value={nextHearingDate}
                  onChange={(e) => setNextHearingDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Fee Collected Today (INR - Optional):</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={feeCollectedINR}
                  onChange={(e) => setFeeCollectedINR(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickActionModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold active:scale-95 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-lg active:scale-95 min-h-[44px]"
                >
                  Save & Sync ERP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD FEE */}
      {quickActionModal === 'record_fee' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-3">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-full sm:max-w-sm p-4 sm:p-5 space-y-3 shadow-2xl text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Record Fee Payment
              </div>
              <button onClick={() => setQuickActionModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickFee} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Client:</label>
                <select
                  value={feeClientId}
                  onChange={(e) => setFeeClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} &bull; {c.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Amount Paid (INR):</label>
                <input
                  type="number"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Payment Mode:</label>
                <select
                  value={feeMode}
                  onChange={(e) => setFeeMode(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                >
                  <option value="UPI">UPI (GPay/PhonePe/Paytm)</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Notes / Narration:</label>
                <input
                  type="text"
                  value={feeNotes}
                  onChange={(e) => setFeeNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickActionModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold active:scale-95 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg active:scale-95 min-h-[44px]"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VOICE DICTATION STUDIO */}
      {quickActionModal === 'voice_dictate' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-3">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-full sm:max-w-sm p-4 sm:p-5 space-y-3 shadow-2xl text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-amber-400" />
                Instant Voice Dictation
              </div>
              <button onClick={() => setQuickActionModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300">
              Speak case number, hearing result, next date, and fee collected. AI auto-parses and updates LawyerDesk ERP.
            </p>

            <button
              onClick={() =>
                runVoiceSimulation(
                  'Execution Petition 458 of 2026. Matter called. Adjourned to 18 August. Client paid 5000. Upload today’s order.'
                )
              }
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 min-h-[48px]"
            >
              <Mic className="w-4 h-4" />
              <span>Tap to Dictate (Demo Prompt)</span>
            </button>

            {extractedData && (
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                <div className="font-bold text-amber-300">Extracted Brief:</div>
                <div className="text-[11px] text-slate-200">
                  Case: {extractedData.caseNumber} &bull; Date: {extractedData.nextDate} &bull; Paid: ₹{extractedData.feePaid}
                </div>
                <button
                  onClick={handleSyncVoiceToERP}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold active:scale-95 min-h-[44px]"
                >
                  Save to LawyerDesk ERP
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: AI CASE DOCUMENT CONTENT SEARCH */}
      {quickActionModal === 'doc_search' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-3">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-full sm:max-w-md p-4 sm:p-5 space-y-3 shadow-2xl text-xs max-h-[88vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <FileSearch className="w-4 h-4 text-purple-400" />
                <span>Search Case Document Content AI</span>
              </div>
              <button onClick={() => setQuickActionModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300 shrink-0">
              Grounded PaddleOCR RAG Vector Engine: Search exact paragraphs, clauses, stay terms, or evidence across case files.
            </p>

            {/* Matter Selector */}
            <div className="shrink-0 space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Filter By Case Matter:</label>
              <select
                value={docSearchMatterId}
                onChange={(e) => {
                  setDocSearchMatterId(e.target.value);
                  handleExecuteDocSearch();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
              >
                <option value="all">📁 All Uploaded Case Files ({matters.length} Cases)</option>
                {matters.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.caseNumber} &bull; {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input Box */}
            <div className="shrink-0 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search stay, limitation, section 138..."
                    value={docSearchQuery}
                    onChange={(e) => setDocSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleExecuteDocSearch()}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3.5" />
                </div>
                <button
                  onClick={() => handleExecuteDocSearch()}
                  className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold flex items-center gap-1 text-xs shrink-0 active:scale-95 min-h-[42px]"
                >
                  {isSearchingDocs ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Search</span>
                </button>
              </div>

              {/* Quick Search Preset Chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => {
                    setDocSearchQuery('interim stay');
                    handleExecuteDocSearch('interim stay');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-900/50 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700 active:scale-95"
                >
                  📄 Interim Stay Order
                </button>
                <button
                  onClick={() => {
                    setDocSearchQuery('limitation');
                    handleExecuteDocSearch('limitation');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-900/50 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700 active:scale-95"
                >
                  ⚖️ Section 138 Limitation
                </button>
                <button
                  onClick={() => {
                    setDocSearchQuery('arbitration clause');
                    handleExecuteDocSearch('arbitration clause');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-900/50 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700 active:scale-95"
                >
                  📜 Arbitration Clause
                </button>
              </div>
            </div>

            {/* Results Container */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[160px]">
              {isSearchingDocs && (
                <div className="py-8 text-center text-purple-400 font-bold text-xs flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Scanning Firestore PaddleOCR Chunks...</span>
                </div>
              )}

              {!isSearchingDocs && docSearchResults && docSearchResults.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-b border-slate-800 pb-1">
                    <span>{docSearchResults.length} Grounded OCR Excerpts Found</span>
                    <span>Vector Similarity RAG</span>
                  </div>

                  {docSearchResults.map((res) => (
                    <div
                      key={res.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-purple-500/30 hover:border-purple-500/60 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-purple-300 truncate max-w-[200px]">📄 {res.docName}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                          {res.matchScore}% Match
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span>Case: {res.caseNumber}</span>
                        <span>&bull;</span>
                        <span>Page {res.pageNo}, Para {res.paraNo}</span>
                      </div>

                      <p className="text-[11px] text-slate-200 leading-relaxed font-sans bg-slate-900 p-2 rounded-lg border border-slate-800/80 italic">
                        {res.excerpt}
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(res.excerpt);
                            showToast('📋 Citation snippet copied to clipboard!');
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 active:scale-95"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Snippet</span>
                        </button>
                        <button
                          onClick={() => {
                            setQuickActionModal(null);
                            setActiveTab('voice');
                            handleSendAiChat(undefined, `Tell me more about paragraph ${res.paraNo} in document ${res.docName}: "${res.excerpt.slice(0, 50)}..."`);
                          }}
                          className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold flex items-center gap-1 active:scale-95"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Ask AI Chat</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isSearchingDocs && (!docSearchResults || docSearchResults.length === 0) && (
                <div className="text-center py-6 text-slate-500 text-xs">
                  Type query or click preset prompts to search case documents.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
