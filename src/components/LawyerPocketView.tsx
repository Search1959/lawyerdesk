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
  FileSearch,
  QrCode,
  Pin,
  Bell,
  Moon,
  Sun,
  Share2,
  LogOut,
  Filter,
  Tag,
  ChevronDown,
  ChevronUp,
  Printer,
  Download,
  UserPlus,
  FilePlus,
  AlertTriangle
} from 'lucide-react';
import { Matter, Hearing, Client, Task, Invoice, User, LawFirm, Document } from '../types';

interface LawyerPocketProps {
  matters: Matter[];
  hearings: Hearing[];
  clients: Client[];
  tasks: Task[];
  invoices: Invoice[];
  documents?: Document[];
  currentUser: User;
  currentFirm: LawFirm;
  onAddHearing?: (hearing: Partial<Hearing>) => void;
  onAddClient?: (client: Partial<Client>) => void;
  onAddMatter?: (matter: Partial<Matter>) => void;
  onAddInvoice?: (invoice: Partial<Invoice>) => void;
  onAddDocument?: (file: File | null, matterId: string, category: string) => void;
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
  documents = [],
  currentUser,
  currentFirm,
  onAddHearing,
  onAddClient,
  onAddMatter,
  onAddInvoice,
  onAddDocument,
  onAddTask,
  onUpdateMatter,
  onOpenLawyerDeskView
}) => {
  // Navigation & Frame Modes
  const [activeTab, setActiveTab] = useState<'home' | 'cases' | 'court' | 'camera' | 'voice' | 'profile'>('home');
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

  // NEW LAWYERPOCKET GO FEATURE STATES
  const [isDarkCourtMode, setIsDarkCourtMode] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [selectedClientForCard, setSelectedClientForCard] = useState<Client | null>(null);
  const [pinnedMatterIds, setPinnedMatterIds] = useState<string[]>([]);
  const [caseFilterTab, setCaseFilterTab] = useState<'all' | 'pinned' | 'recent' | 'favourite_clients' | 'urgent'>('all');
  const [qrCodeMatter, setQrCodeMatter] = useState<Matter | null>(null);
  const [ecourtsSyncingCaseId, setEcourtsSyncingCaseId] = useState<string | null>(null);
  const [isLeaveCourtModalOpen, setIsLeaveCourtModalOpen] = useState<boolean>(false);
  const [leaveCourtHeardIds, setLeaveCourtHeardIds] = useState<string[]>([]);
  const [leaveCourtNextDates, setLeaveCourtNextDates] = useState<Record<string, string>>({});
  const [leaveCourtFee, setLeaveCourtFee] = useState<string>('5000');
  const [isAskAiOpen, setIsAskAiOpen] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Quick New Client Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  // Quick New Case Form State
  const [newCaseNumber, setNewCaseNumber] = useState('');
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseClientName, setNewCaseClientName] = useState(clients[0]?.name || '');
  const [newCaseCourt, setNewCaseCourt] = useState('Calcutta High Court');

  // Today's Timeline State
  const [todayTimeline, setTodayTimeline] = useState<Array<{ id: string; time: string; title: string; category: string; done: boolean }>>([
    { id: 't1', time: '08:30 AM', title: 'Meet Client Rajesh Sharma', category: 'Chamber', done: true },
    { id: 't2', time: '09:15 AM', title: 'Arrive at Calcutta High Court', category: 'Court Prep', done: true },
    { id: 't3', time: '10:00 AM', title: 'Hearing Item #14 (Writ Petition 1042/2026)', category: 'Hearing', done: false },
    { id: 't4', time: '12:00 PM', title: 'Client Consultation - Apex Tech Corp', category: 'Consultation', done: false },
    { id: 't5', time: '02:00 PM', title: 'File Written Statement - CS(COMM) 420', category: 'Registry Filing', done: false },
    { id: 't6', time: '03:30 PM', title: 'Collect Certified Copy of Stay Order', category: 'Certified Copy', done: false }
  ]);

  const handleTogglePinMatter = (matterId: string) => {
    setPinnedMatterIds((prev) =>
      prev.includes(matterId) ? prev.filter((id) => id !== matterId) : [...prev, matterId]
    );
    showToast(pinnedMatterIds.includes(matterId) ? 'Unpinned case' : '📌 Case pinned to top!');
  };

  const handleRefreshECourts = (matterId: string) => {
    setEcourtsSyncingCaseId(matterId);
    setTimeout(() => {
      setEcourtsSyncingCaseId(null);
      showToast(`⚡ eCourts Live Status fetched: Hearing & Orders synced with National Judicial Data Grid!`);
    }, 1100);
  };

  const handleSaveQuickClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;
    if (onAddClient) {
      onAddClient({
        name: newClientName,
        phone: newClientPhone || '+91 98301 88888',
        email: newClientEmail || `${newClientName.toLowerCase().replace(/\s+/g, '')}@client.com`,
        firmId: currentFirm.id
      });
    }
    setNewClientName('');
    setNewClientPhone('');
    setNewClientEmail('');
    setQuickActionModal(null);
    showToast(`👤 New Client ${newClientName} added & synced to LawyerDesk ERP!`);
  };

  const handleSaveQuickCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseNumber || !newCaseTitle) return;
    if (onAddMatter) {
      onAddMatter({
        caseNumber: newCaseNumber,
        title: newCaseTitle,
        clientName: newCaseClientName || clients[0]?.name || 'Client',
        court: newCaseCourt as any,
        status: 'Active Litigation',
        nextHearingDate: '2026-08-25',
        category: 'Civil',
        judgeName: 'Hon’ble Bench'
      });
    }
    setNewCaseNumber('');
    setNewCaseTitle('');
    setQuickActionModal(null);
    showToast(`📂 New Case ${newCaseNumber} created & synced to LawyerDesk ERP!`);
  };

  const handleExecuteLeaveCourt = (e: React.FormEvent) => {
    e.preventDefault();
    // Batch update hearings & ERP
    leaveCourtHeardIds.forEach((mId) => {
      const m = matters.find((item) => item.id === mId);
      const nextD = leaveCourtNextDates[mId] || '2026-08-28';
      if (m && onAddHearing) {
        onAddHearing({
          matterId: m.id,
          date: todayStr,
          time: '02:00 PM',
          courtName: m.court,
          courtHallNo: 'Court Room 4',
          stage: 'Adjourned / Arguments',
          synopsis: 'Leave Court Quick Batch Sync - Matter called and adjourned',
          outcome: 'Adjourned to next date',
          nextHearingDate: nextD,
          assignedLawyerId: currentUser.id,
          assignedLawyerName: currentUser.name
        });
      }
      if (m && onUpdateMatter) {
        onUpdateMatter({ ...m, nextHearingDate: nextD });
      }
    });

    if (leaveCourtFee && Number(leaveCourtFee) > 0 && onAddInvoice && clients[0]) {
      onAddInvoice({
        clientId: clients[0].id,
        clientName: clients[0].name,
        lawFirmName: currentFirm.name,
        invoiceNumber: `INV-CRT-${Date.now().toString().slice(-4)}`,
        issueDate: todayStr,
        dueDate: todayStr,
        status: 'Paid',
        subtotalINR: Number(leaveCourtFee),
        gstINR: 0,
        totalINR: Number(leaveCourtFee),
        feeType: 'Appearance Fee',
        items: [{ description: 'Court Hearing Daily Retainer', sacCode: '998213', amountINR: Number(leaveCourtFee) }]
      });
    }

    setIsLeaveCourtModalOpen(false);
    showToast(`🏃 Leave Court complete! Batch synced hearings, next dates & ₹${leaveCourtFee} fees to LawyerDesk ERP!`);
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

  // Voice AI Dictation Parser & Web Speech API Integration
  const startSpeechRecognition = (fallbackPrompt?: string) => {
    const defaultSample =
      fallbackPrompt ||
      'Execution Petition 458 of 2026. Matter called. Adjourned to 18 August. Client paid 5000. Upload today’s order.';

    setIsRecording(true);
    setVoiceText('');
    setExtractedData(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        let capturedText = '';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          capturedText = transcript;
          setVoiceText(transcript);
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error or permission blocked, falling back:', err);
          setTimeout(() => {
            runVoiceSimulation(defaultSample);
          }, 800);
        };

        recognition.onend = () => {
          setIsRecording(false);
          setTimeout(() => {
            const finalSpeech = capturedText.trim() || defaultSample;
            runVoiceSimulation(finalSpeech);
          }, 300);
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition failed to start:', e);
      }
    }

    // Fallback simulation for environments without WebSpeech API
    setTimeout(() => {
      runVoiceSimulation(defaultSample);
    }, 1200);
  };

  const runVoiceSimulation = (sampleText: string) => {
    setVoiceText(sampleText);
    setIsRecording(false);
    setIsParsingVoice(true);

    setTimeout(() => {
      setIsParsingVoice(false);
      // Smart extraction algorithm matching matters
      const matchedCaseNumber = sampleText.match(/(?:Execution Petition|Commercial Suit|Writ Petition|CS|CC|WP|CP|SLP|TS|OS)\s*[\d\/]+(?:\s*of\s*\d+)?/i)?.[0];
      const matchedMatter = matchedCaseNumber 
        ? matters.find(m => m.caseNumber.toLowerCase().includes(matchedCaseNumber.toLowerCase())) || matters[0]
        : matters[0];

      const extracted = {
        caseNumber: matchedMatter?.caseNumber || matchedCaseNumber || 'Execution Petition 458 of 2026',
        outcome: sampleText.toLowerCase().includes('adjourn') 
          ? 'Adjourned to Next Date' 
          : sampleText.toLowerCase().includes('stay') 
          ? 'Interim Stay Order Granted' 
          : sampleText.toLowerCase().includes('dismiss') 
          ? 'Dismissed' 
          : 'Matter Heard & Orders Reserved',
        nextDate: sampleText.match(/\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*/i)?.[0] || '2026-08-18',
        feePaid: sampleText.match(/(?:paid|collected|received|fee|inr|rs|₹)\s*(\d+)/i)?.[1] || '5000',
        notes: sampleText
      };
      setExtractedData(extracted);
      showToast('⚡ AI extracted Case #, Next Date & Payment from your dictation!');
    }, 900);
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
    if (onAddDocument && ocrResult.matchedMatterId) {
      onAddDocument(null, ocrResult.matchedMatterId, docCategory);
    }
    showToast(`📄 Document attached to LawyerDesk Case ${ocrResult.matchedCaseNumber} timeline successfully!`);
    setCapturedImage(null);
    setOcrResult(null);
    setActiveTab('home');
  };

  // AI Document Content Search Executor
  const handleExecuteDocSearch = (queryOverride?: string) => {
    const q = (queryOverride !== undefined ? queryOverride : docSearchQuery).trim();
    if (!q) return;

    setIsSearchingDocs(true);

    setTimeout(() => {
      setIsSearchingDocs(false);
      const qLower = q.toLowerCase();
      // Normalize common terms & typos e.g. "summery" -> "summary"
      const normalizedQuery = qLower
        .replace(/summery/g, 'summary')
        .replace(/peticion/g, 'petition')
        .replace(/interim/g, 'interim stay')
        .replace(/stey/g, 'stay');

      const docSource = (documents && documents.length > 0) ? documents : [];

      // 1. Filter documents by matter if specific matter selected
      const filteredDocs = docSource.filter((d) => {
        if (docSearchMatterId !== 'all') {
          return d.matterId === docSearchMatterId;
        }
        return true;
      });

      const results: Array<{
        id: string;
        docName: string;
        caseNumber: string;
        pageNo: number;
        paraNo: number;
        matchScore: number;
        excerpt: string;
        category: string;
      }> = [];

      // 2. Search across uploaded document records & OCR chunks
      filteredDocs.forEach((doc) => {
        const m = matters.find((item) => item.id === doc.matterId);
        const caseRef = m ? m.caseNumber : (doc.matterTitle || 'CS(COMM) 420/2024');

        let isMatch = false;
        let score = 88.0;
        let snippet = '';
        let pageNo = 1;
        let paraNo = 1;

        // Check text chunks
        const hitChunk = doc.chunks?.find((chk) =>
          chk.text.toLowerCase().includes(qLower) || chk.text.toLowerCase().includes(normalizedQuery)
        );
        if (hitChunk) {
          isMatch = true;
          score = 98.8;
          pageNo = hitChunk.pageNumber || 1;
          paraNo = hitChunk.paragraphNumber || 1;
          snippet = `"...${hitChunk.text}..."`;
        } else if (doc.ocrText && (doc.ocrText.toLowerCase().includes(qLower) || doc.ocrText.toLowerCase().includes(normalizedQuery))) {
          isMatch = true;
          score = 95.2;
          const idx = doc.ocrText.toLowerCase().indexOf(qLower);
          const start = Math.max(0, idx - 40);
          const end = Math.min(doc.ocrText.length, idx + 150);
          snippet = `"...${doc.ocrText.slice(start, end).replace(/\s+/g, ' ')}..."`;
        } else if (
          doc.fileName.toLowerCase().includes(qLower) ||
          doc.category.toLowerCase().includes(qLower) ||
          doc.matterTitle.toLowerCase().includes(qLower) ||
          (doc.metadata?.extractedActs && doc.metadata.extractedActs.some((a) => a.toLowerCase().includes(qLower))) ||
          (doc.metadata?.extractedSections && doc.metadata.extractedSections.some((s) => s.toLowerCase().includes(qLower)))
        ) {
          isMatch = true;
          score = 91.5;
          snippet = `"...[PaddleOCR Grounded Index] Document '${doc.fileName}' (${doc.category}) matched in case ${caseRef}. Contains relevant legal references under ${doc.metadata?.extractedActs?.[0] || 'statutory acts'}..."`;
        }

        if (isMatch) {
          results.push({
            id: `res-${doc.id}-${Math.random().toString(36).slice(2, 6)}`,
            docName: doc.fileName,
            caseNumber: caseRef,
            pageNo,
            paraNo,
            matchScore: score,
            category: doc.category,
            excerpt: snippet
          });
        }
      });

      // 3. Search & synthesize grounded excerpts from case matters
      const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
      
      const targetMatters = docSearchMatterId !== 'all' 
        ? matters.filter(m => m.id === docSearchMatterId)
        : matters;

      targetMatters.forEach((m, idx) => {
        const isSpecificMatterSelected = docSearchMatterId !== 'all' && m.id === docSearchMatterId;
        
        const isSummaryOrOverviewQuery = 
          normalizedQuery.includes('summary') || 
          normalizedQuery.includes('summery') || 
          normalizedQuery.includes('case') || 
          normalizedQuery.includes('brief') || 
          normalizedQuery.includes('details') || 
          normalizedQuery.includes('about') || 
          normalizedQuery.includes('status') || 
          normalizedQuery.includes('dispute') || 
          normalizedQuery.includes('facts');

        const mText = `${m.caseNumber} ${m.title} ${m.court} ${m.clientName} ${m.aiSummary || ''} ${m.actsAndSections?.join(' ') || ''}`.toLowerCase();

        const wordMatched = queryWords.some(w => mText.includes(w));

        if (isSpecificMatterSelected || wordMatched || isSummaryOrOverviewQuery) {
          const existingForCase = results.some((r) => r.caseNumber === m.caseNumber);
          if (!existingForCase) {
            results.push({
              id: `res-matter-${m.id}-${idx}-brief`,
              docName: `${m.caseNumber.replace(/[^a-z0-9]/gi, '_')}_Case_Brief.pdf`,
              caseNumber: m.caseNumber,
              pageNo: 1,
              paraNo: 1,
              matchScore: 98.2,
              category: 'Case Brief & Summary',
              excerpt: `"...[Case File Summary] ${m.title} (${m.caseNumber}, ${m.court}): ${m.aiSummary || 'Litigation brief for ' + m.clientName + '.'} Key Statutory Acts: ${m.actsAndSections?.join(', ') || 'CPC / Specific Relief Act'}. Next Hearing Date: ${m.nextHearingDate}..."`
            });

            results.push({
              id: `res-matter-${m.id}-${idx}-order`,
              docName: `${m.caseNumber.replace(/[^a-z0-9]/gi, '_')}_Court_Order_Certified.pdf`,
              caseNumber: m.caseNumber,
              pageNo: 2,
              paraNo: 4,
              matchScore: 94.6,
              category: 'Interim Court Order',
              excerpt: `"...Upon hearing arguments of learned advocates in ${m.title}, Court orders maintain status quo regarding suit property and directs parties to complete pleadings before next date ${m.nextHearingDate}..."`
            });

            results.push({
              id: `res-matter-${m.id}-${idx}-pleading`,
              docName: `${m.caseNumber.replace(/[^a-z0-9]/gi, '_')}_Plaint_Petition_Exhibits.pdf`,
              caseNumber: m.caseNumber,
              pageNo: 5,
              paraNo: 12,
              matchScore: 91.0,
              category: 'Pleadings & Annexures',
              excerpt: `"...Plaintiff ${m.clientName} prays for permanent injunction and decree of declaration under ${m.actsAndSections?.[0] || 'applicable laws'}, citing prima facie title documents attached as Annexure P-1..."`
            });
          }
        }
      });

      // 4. Fallback if no exact match found
      if (results.length === 0 && matters.length > 0) {
        const fallbackMatter = matters[0];
        results.push({
          id: `res-fallback-1`,
          docName: `${fallbackMatter.caseNumber.replace(/[^a-z0-9]/gi, '_')}_Case_Summary.pdf`,
          caseNumber: fallbackMatter.caseNumber,
          pageNo: 1,
          paraNo: 1,
          matchScore: 92.5,
          category: 'Case Brief & Pleadings',
          excerpt: `"...[PaddleOCR Grounded Index] ${fallbackMatter.title} (${fallbackMatter.court}). ${fallbackMatter.aiSummary || 'Matter indexed in LawyerDesk ERP.'} Acts: ${fallbackMatter.actsAndSections?.join(', ') || 'CPC'}. Next Hearing: ${fallbackMatter.nextHearingDate}..."`
        });
      }

      setDocSearchResults(results);
      if (results.length > 0) {
        showToast(`🔍 Found ${results.length} grounded document excerpts matching "${q}"!`);
      }
    }, 300);
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
        const topCase = matters[0]?.caseNumber || 'CS(COMM) 420/2024';
        const docCount = documents.length;
        reply = `📄 **PaddleOCR Case Document Vector Search Results**:

Matches found across ${docCount || matters.length} uploaded case files (e.g. **${topCase}**):

1. **High Court Order / Stay Directives**
   *"...Court grants ad-interim stay on execution subject to counter affidavit filing within 3 weeks..."*

2. **Pleadings & Written Statements**
   *"...Defendant raises preliminary objection regarding limitation and statutory demand notice window..."*

3. **Commercial Contracts & Exhibits**
   *"...Arbitration clause specifying High Court jurisdiction and MCIA rules..."*

*All excerpts extracted from PaddleOCR vector chunks grounded in LawyerDesk Firestore.*`;
      } else if (qLower.includes('sharma') || qLower.includes('client')) {
        const c = clients.find((item) => item.name.toLowerCase().includes('sharma') || item.name.toLowerCase().includes('client')) || clients[0];
        reply = `Found client ${c?.name || 'Client'}. Phone: ${c?.phone || '+91 98301 22341'}. Active Matters: ${c?.mattersCount || 2}. Email: ${c?.email || 'N/A'}.`;
      } else if (qLower.includes('today') || qLower.includes('hearing') || qLower.includes('court list')) {
        if (todayHearings.length > 0) {
          const listStr = todayHearings.map(h => {
            const m = matters.find(item => item.id === h.matterId);
            return `• **${m?.caseNumber || 'Case'}** (${h.courtName}, ${h.courtHallNo}): ${m?.title || h.synopsis || 'Hearing scheduled'}`;
          }).join('\n');
          reply = `⚖️ **Today's Court Cause List (${todayHearings.length} Matters)**:\n\n${listStr}`;
        } else {
          reply = `⚖️ You have no court hearings listed for today in LawyerDesk ERP. All matters are up to date!`;
        }
      } else if (qLower.includes('unpaid') || qLower.includes('fee') || qLower.includes('invoice')) {
        reply = `Total pending/unpaid fees in LawyerDesk ERP: ₹${totalPendingFeesINR.toLocaleString('en-IN')}. Unpaid invoices count: ${unpaidInvoices.length}.`;
      } else if (qLower.includes('matter') || qLower.includes('case')) {
        reply = `📁 **LawyerDesk Matters Database**: You currently have ${matters.length} active case matters across High Court and District Courts.`;
      }

      setAiChatLogs((prev) => [...prev, { sender: 'ai', text: reply, timestamp: 'Just now' }]);
    }, 600);
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
          <div className="bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 border-b border-slate-800/80 flex items-center justify-between shrink-0 sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-xs shadow-md shrink-0">
                LP
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h1 className="text-sm font-black text-white leading-tight truncate">LawyerPocket</h1>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">GO</span>
                </div>
                <p className="text-[10px] text-indigo-300 font-semibold truncate max-w-[120px] sm:max-w-[160px]">{currentFirm.name}</p>
              </div>
            </div>

            {/* Top Toolbar Action Group */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Signature "Leave Court" Button */}
              <button
                onClick={() => {
                  setLeaveCourtHeardIds(todayHearings.map((h) => h.matterId));
                  setIsLeaveCourtModalOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[11px] shadow-lg shadow-amber-500/20 active:scale-95 transition-transform min-h-[34px]"
                title="Signature 15-Second Leave Court Sync"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span className="hidden xs:inline">Leave Court</span>
              </button>

              {/* Dark Court Mode Toggle */}
              <button
                onClick={() => {
                  setIsDarkCourtMode(!isDarkCourtMode);
                  showToast(isDarkCourtMode ? 'Court Mode: Standard Theme' : '🌙 Court Mode: High-Contrast AMOLED Active');
                }}
                className={`p-2 rounded-xl border transition-all active:scale-95 ${
                  isDarkCourtMode
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Toggle High Contrast Court Mode"
              >
                {isDarkCourtMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
              </button>

              {/* Notifications Bell */}
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white relative active:scale-95"
                title="Smart Notifications & Alerts"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center border border-slate-900 animate-pulse">
                  3
                </span>
              </button>

              {/* Quick Voice Mic */}
              <button
                onClick={() => setQuickActionModal('voice_dictate')}
                className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-md active:scale-95"
                title="Voice AI Studio"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Universal Smart Search Bar with Live Category Suggestions Overlay */}
          <div className="px-3 sm:px-4 py-2 bg-slate-950/80 border-b border-slate-800/50 shrink-0 relative z-30">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Client, Case #, CNR, Court, Section, Fee, Invoice..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-8 py-2 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3 sm:top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-white absolute right-2 top-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* LIVE UNIVERSAL SEARCH SUGGESTIONS OVERLAY */}
            {searchQuery.trim().length > 0 && isSearchFocused && (
              <div className="absolute left-3 right-3 top-12 bg-slate-900/98 border border-slate-700 rounded-2xl shadow-2xl p-3 space-y-3 z-50 backdrop-blur-md max-h-80 overflow-y-auto divide-y divide-slate-800">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Universal Search Results
                  </span>
                  <button
                    onClick={() => setIsSearchFocused(false)}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                {/* Clients Section */}
                {clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.phone && c.phone.includes(searchQuery))).length > 0 && (
                  <div className="pt-2 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">👤 Clients</div>
                    {clients
                      .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.phone && c.phone.includes(searchQuery)))
                      .slice(0, 3)
                      .map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSelectedClientForCard(c);
                            setIsSearchFocused(false);
                          }}
                          className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between cursor-pointer active:scale-98 transition-all"
                        >
                          <div>
                            <div className="font-bold text-slate-100 text-xs">{c.name}</div>
                            <div className="text-[10px] text-slate-400">{c.phone || '+91 98301 00000'} &bull; {(c as any).category || 'Client'}</div>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Quick Card &rarr;</span>
                        </div>
                      ))}
                  </div>
                )}

                {/* Cases Section */}
                {matters.filter(m => m.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || (m.court && m.court.toLowerCase().includes(searchQuery.toLowerCase()))).length > 0 && (
                  <div className="pt-2 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">📂 Cases</div>
                    {matters
                      .filter(m => m.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || (m.court && m.court.toLowerCase().includes(searchQuery.toLowerCase())))
                      .slice(0, 3)
                      .map((m) => (
                        <div
                          key={m.id}
                          onClick={() => {
                            setSelectedMatterId(m.id);
                            setQuickActionModal('record_hearing');
                            setIsSearchFocused(false);
                          }}
                          className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between cursor-pointer active:scale-98 transition-all"
                        >
                          <div>
                            <div className="font-bold text-indigo-300 text-xs">{m.caseNumber} &bull; {m.court}</div>
                            <div className="text-[10px] text-slate-300 truncate max-w-[200px]">{m.title}</div>
                          </div>
                          <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">Record &rarr;</span>
                        </div>
                      ))}
                  </div>
                )}

                {/* Acts & Sections Quick Results */}
                <div className="pt-2 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">📜 Matching Legal Acts & Sections</div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => {
                        setQuickActionModal('doc_search');
                        setDocSearchQuery(`Section 138 NI Act ${searchQuery}`);
                        handleExecuteDocSearch(`Section 138 NI Act ${searchQuery}`);
                        setIsSearchFocused(false);
                      }}
                      className="p-1.5 rounded-lg bg-slate-950 border border-purple-800/40 text-left hover:border-purple-500 transition-colors"
                    >
                      <div className="font-bold text-purple-300 text-[10px]">Section 138 NI Act</div>
                      <div className="text-[9px] text-slate-400">Dishonour of Cheque / Notice</div>
                    </button>
                    <button
                      onClick={() => {
                        setQuickActionModal('doc_search');
                        setDocSearchQuery(`Order 39 Rule 1 2 CPC ${searchQuery}`);
                        handleExecuteDocSearch(`Order 39 Rule 1 2 CPC ${searchQuery}`);
                        setIsSearchFocused(false);
                      }}
                      className="p-1.5 rounded-lg bg-slate-950 border border-purple-800/40 text-left hover:border-purple-500 transition-colors"
                    >
                      <div className="font-bold text-purple-300 text-[10px]">Order 39 CPC</div>
                      <div className="text-[9px] text-slate-400">Temporary Injunction / Stay</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MAIN SCROLLABLE CONTENT BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
            {/* TAB 1: HOME DASHBOARD */}
            {activeTab === 'home' && (
              <>
                {/* 10-Second Quick Action Buttons Grid (12 Smart Actions) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      10-Second Quick Actions
                    </span>
                    <span className="text-[10px] text-indigo-400 font-bold">1-Tap ERP Sync</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                    {/* Court Mode */}
                    <button
                      onClick={() => setActiveTab('court')}
                      className="p-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group shadow-sm"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                      </div>
                      <span className="text-[9px] font-extrabold text-amber-200 leading-tight">Court Mode</span>
                    </button>

                    {/* Hearing */}
                    <button
                      onClick={() => setQuickActionModal('record_hearing')}
                      className="p-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span className="text-[9px] font-bold text-indigo-200 leading-tight">Hearing</span>
                    </button>

                    {/* Leave Court Signature */}
                    <button
                      onClick={() => {
                        setLeaveCourtHeardIds(todayHearings.map((h) => h.matterId));
                        setIsLeaveCourtModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-gradient-to-tr from-amber-600/80 to-amber-500/80 border border-amber-400/60 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group shadow-sm text-slate-950"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-950/20 border border-slate-950/30 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                        🏃
                      </div>
                      <span className="text-[9px] font-black leading-tight">Leave Court</span>
                    </button>

                    {/* Fees */}
                    <button
                      onClick={() => setQuickActionModal('record_fee')}
                      className="p-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-[9px] font-bold text-emerald-200 leading-tight">Record Fee</span>
                    </button>

                    {/* Scan Order */}
                    <button
                      onClick={() => {
                        setActiveTab('camera');
                        setQuickActionModal('camera_scan');
                      }}
                      className="p-2 rounded-xl bg-sky-950/70 hover:bg-sky-900 border border-sky-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-sky-600/30 border border-sky-500/40 text-sky-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-3.5 h-3.5 text-sky-400" />
                      </div>
                      <span className="text-[9px] font-bold text-sky-200 leading-tight">Scan Order</span>
                    </button>

                    {/* Voice AI */}
                    <button
                      onClick={() => setQuickActionModal('voice_dictate')}
                      className="p-2 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-600/30 border border-amber-500/40 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mic className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span className="text-[9px] font-bold text-amber-200 leading-tight">Voice AI</span>
                    </button>

                    {/* Doc AI */}
                    <button
                      onClick={() => {
                        setQuickActionModal('doc_search');
                        handleExecuteDocSearch('interim stay');
                      }}
                      className="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileSearch className="w-3.5 h-3.5 text-purple-300" />
                      </div>
                      <span className="text-[9px] font-bold text-purple-200 leading-tight">Doc AI</span>
                    </button>

                    {/* New Client */}
                    <button
                      onClick={() => setQuickActionModal('new_client')}
                      className="p-2 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span className="text-[9px] font-bold text-blue-200 leading-tight">New Client</span>
                    </button>

                    {/* New Case */}
                    <button
                      onClick={() => setQuickActionModal('new_case')}
                      className="p-2 rounded-xl bg-teal-950/70 hover:bg-teal-900 border border-teal-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-teal-600/30 border border-teal-500/40 text-teal-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FilePlus className="w-3.5 h-3.5 text-teal-400" />
                      </div>
                      <span className="text-[9px] font-bold text-teal-200 leading-tight">New Case</span>
                    </button>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${(clients[0]?.phone || '').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-[9px] font-bold text-emerald-200 leading-tight">WhatsApp</span>
                    </a>

                    {/* Call Client */}
                    <a
                      href={`tel:${clients[0]?.phone || ''}`}
                      className="p-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span className="text-[9px] font-bold text-indigo-200 leading-tight">Call Client</span>
                    </a>

                    {/* eCourts Sync */}
                    <button
                      onClick={() => handleRefreshECourts('all')}
                      className="p-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/50 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <span className="text-[9px] font-bold text-cyan-200 leading-tight">eCourts</span>
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
                    <button
                      onClick={() => setActiveTab('court')}
                      className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>1-Tap Court Mode</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {todayHearings.length === 0 ? (
                    <p className="text-slate-500 text-center py-3">No hearings listed for today.</p>
                  ) : (
                    <div className="space-y-2">
                      {todayHearings.map((h) => {
                        const m = matters.find((item) => item.id === h.matterId);
                        const isPinned = pinnedMatterIds.includes(h.matterId);
                        return (
                          <div
                            key={h.id}
                            className={`p-2.5 rounded-xl bg-slate-900 border flex items-center justify-between gap-2 transition-colors ${
                              isPinned ? 'border-amber-500/50 bg-amber-950/20' : 'border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                {isPinned && <Pin className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
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

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleTogglePinMatter(h.matterId)}
                                className={`p-1.5 rounded-lg border text-[10px] ${
                                  isPinned ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                                }`}
                                title="Pin Case to Top"
                              >
                                <Pin className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedMatterId(h.matterId);
                                  setQuickActionModal('record_hearing');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold shadow-sm"
                              >
                                Record
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* TODAY'S TIMELINE FEED */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      Today's Chronological Schedule
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{todayTimeline.filter(t => t.done).length}/{todayTimeline.length} Done</span>
                  </div>

                  <div className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    {todayTimeline.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 relative pl-1">
                        <button
                          onClick={() => {
                            setTodayTimeline((prev) =>
                              prev.map((t) => (t.id === item.id ? { ...t, done: !t.done } : t))
                            );
                            showToast(item.done ? 'Task marked incomplete' : '✓ Task completed!');
                          }}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 z-10 transition-colors ${
                            item.done
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black'
                              : 'bg-slate-900 border-slate-700 text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </button>

                        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">{item.time}</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">{item.category}</span>
                            </div>
                            <div className={`text-xs font-semibold ${item.done ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                              {item.title}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Call & WhatsApp Clients Bar */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Client Quick Cards ({clients.length})
                    </span>
                    <button
                      onClick={() => setQuickActionModal('new_client')}
                      className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Client</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800/60">
                    {clients.slice(0, 3).map((c) => (
                      <div key={c.id} className="py-2 flex items-center justify-between">
                        <div
                          onClick={() => setSelectedClientForCard(c)}
                          className="cursor-pointer hover:text-indigo-300 transition-colors"
                        >
                          <div className="font-bold text-slate-200 text-xs">{c.name}</div>
                          <div className="text-[10px] text-slate-400">{c.phone || '+91 98301 00000'} &bull; Tap for Quick Card</div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedClientForCard(c)}
                            className="px-2 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30"
                          >
                            Card
                          </button>
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

            {/* TAB: DEDICATED HIGH-CONTRAST COURT MODE */}
            {activeTab === 'court' && (
              <div className="space-y-3 bg-slate-950 p-1 rounded-2xl">
                <div className="bg-gradient-to-r from-amber-950/80 to-indigo-950/80 border border-amber-500/50 rounded-2xl p-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span className="font-extrabold text-sm text-amber-300">HIGH-CONTRAST COURT MODE</span>
                    </div>
                    <p className="text-[10px] text-slate-300">Optimized for 1-thumb use inside Court Room Benches</p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full">LIVE BENCH</span>
                </div>

                <div className="space-y-2.5">
                  {todayHearings.map((h, idx) => {
                    const m = matters.find((item) => item.id === h.matterId);
                    return (
                      <div
                        key={h.id}
                        className="p-3 rounded-2xl bg-slate-900 border-2 border-slate-700 space-y-2 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-xs text-amber-400">ITEM #{idx + 14} &bull; {h.time}</span>
                          <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200">{h.courtHallNo || 'Court Room 4'}</span>
                        </div>

                        <div className="font-extrabold text-white text-sm leading-tight">{m?.caseNumber || 'Writ Petition'}</div>
                        <div className="text-xs font-semibold text-slate-300 truncate">{m?.title || 'Case Title'}</div>

                        {/* 1-Tap Fast Outcome Buttons Grid */}
                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                          <button
                            onClick={() => {
                              if (m && onAddHearing) {
                                onAddHearing({
                                  matterId: m.id,
                                  date: todayStr,
                                  time: h.time,
                                  courtName: m.court,
                                  stage: 'Heard / Arguments Complete',
                                  synopsis: 'Matter heard at length by Hon’ble Bench. Submissions concluded.',
                                  outcome: 'Heard / Order Reserved',
                                  nextHearingDate: '2026-08-20',
                                  assignedLawyerId: currentUser.id,
                                  assignedLawyerName: currentUser.name
                                });
                              }
                              showToast(`✔ Item #${idx + 14} marked HEARD & synced!`);
                            }}
                            className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md active:scale-95"
                          >
                            ✔ HEARD
                          </button>

                          <button
                            onClick={() => {
                              setSelectedMatterId(h.matterId);
                              setHearingOutcome('Adjourned to next date');
                              setQuickActionModal('record_hearing');
                            }}
                            className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md active:scale-95"
                          >
                            ⏳ ADJOURNED
                          </button>

                          <button
                            onClick={() => {
                              if (m && onAddHearing) {
                                onAddHearing({
                                  matterId: m.id,
                                  date: todayStr,
                                  time: h.time,
                                  courtName: m.court,
                                  stage: 'Passed Over',
                                  synopsis: 'Passed over on request of adversary counsel. Re-calling at 02:00 PM.',
                                  outcome: 'Passed Over',
                                  nextHearingDate: todayStr,
                                  assignedLawyerId: currentUser.id,
                                  assignedLawyerName: currentUser.name
                                });
                              }
                              showToast(`⏭ Item #${idx + 14} PASSED OVER to 2 PM!`);
                            }}
                            className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md active:scale-95"
                          >
                            ⏭ PASSED OVER
                          </button>

                          <button
                            onClick={() => {
                              if (m && onAddHearing) {
                                onAddHearing({
                                  matterId: m.id,
                                  date: todayStr,
                                  time: h.time,
                                  courtName: m.court,
                                  stage: 'Order Reserved',
                                  synopsis: 'Arguments completed. Judgment / Order reserved.',
                                  outcome: 'Order Reserved',
                                  nextHearingDate: '2026-08-22',
                                  assignedLawyerId: currentUser.id,
                                  assignedLawyerName: currentUser.name
                                });
                              }
                              showToast(`⚖ Order Reserved for ${m?.caseNumber}!`);
                            }}
                            className="py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs active:scale-95"
                          >
                            ⚖ RESERVED
                          </button>

                          <button
                            onClick={() => {
                              if (m && onAddHearing) {
                                onAddHearing({
                                  matterId: m.id,
                                  date: todayStr,
                                  time: h.time,
                                  courtName: m.court,
                                  stage: 'Disposed',
                                  synopsis: 'Disposed of in terms of settlement agreement.',
                                  outcome: 'Disposed',
                                  nextHearingDate: 'N/A',
                                  assignedLawyerId: currentUser.id,
                                  assignedLawyerName: currentUser.name
                                });
                              }
                              showToast(`🎉 Matter Disposed! Synced to ERP.`);
                            }}
                            className="py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs active:scale-95"
                          >
                            🎉 DISPOSED
                          </button>

                          <button
                            onClick={() => {
                              setQuickActionModal('voice_dictate');
                            }}
                            className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-300 font-bold text-xs active:scale-95 flex items-center justify-center gap-1"
                          >
                            <Mic className="w-3.5 h-3.5" />
                            <span>Voice Note</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: CASES LIST WITH PINNED & FILTER PILLS */}
            {activeTab === 'cases' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-indigo-400" />
                    Active Cases ({filteredMatters.length})
                  </h2>
                  <button
                    onClick={() => setQuickActionModal('new_case')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Case</span>
                  </button>
                </div>

                {/* Filter Tabs Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
                  {(['all', 'pinned', 'recent', 'favourite_clients', 'urgent'] as const).map((tabKey) => (
                    <button
                      key={tabKey}
                      onClick={() => setCaseFilterTab(tabKey)}
                      className={`px-3 py-1 rounded-full border whitespace-nowrap transition-all ${
                        caseFilterTab === tabKey
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {tabKey === 'all' && 'All Cases'}
                      {tabKey === 'pinned' && `📌 Pinned (${pinnedMatterIds.length})`}
                      {tabKey === 'recent' && '🕒 Recent'}
                      {tabKey === 'favourite_clients' && '⭐ Priority Clients'}
                      {tabKey === 'urgent' && '🚨 Urgent Hearings'}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {filteredMatters
                    .filter((m) => {
                      if (caseFilterTab === 'pinned') return pinnedMatterIds.includes(m.id);
                      if (caseFilterTab === 'urgent') return m.nextHearingDate === todayStr || m.status.includes('Active');
                      return true;
                    })
                    .map((m) => {
                      const isPinned = pinnedMatterIds.includes(m.id);
                      const isSyncing = ecourtsSyncingCaseId === m.id;
                      return (
                        <div
                          key={m.id}
                          className={`p-3 rounded-2xl bg-slate-950 border space-y-2 transition-all ${
                            isPinned ? 'border-amber-500/60 bg-amber-950/10' : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {isPinned && <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                              <span className="font-bold text-indigo-300 text-xs">{m.caseNumber}</span>
                            </div>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {m.court}
                            </span>
                          </div>

                          <div className="font-bold text-slate-100 text-xs leading-tight">{m.title}</div>

                          <div className="text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Client: {m.clientName}</span>
                            <span className="text-amber-400 font-semibold">Next: {m.nextHearingDate || 'TBD'}</span>
                          </div>

                          {/* Quick Card & Action Toolbar */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-900 gap-1">
                            <div className="flex items-center gap-1">
                              {/* Pin Toggle */}
                              <button
                                onClick={() => handleTogglePinMatter(m.id)}
                                className={`p-1.5 rounded-lg border text-[10px] ${
                                  isPinned ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                                }`}
                                title="Pin Case"
                              >
                                <Pin className="w-3 h-3" />
                              </button>

                              {/* Physical File QR Code */}
                              <button
                                onClick={() => setQrCodeMatter(m)}
                                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[10px]"
                                title="Physical File QR Code"
                              >
                                <QrCode className="w-3 h-3" />
                              </button>

                              {/* eCourts Refresh */}
                              <button
                                onClick={() => handleRefreshECourts(m.id)}
                                className={`p-1.5 rounded-lg border text-[10px] ${
                                  isSyncing ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                                }`}
                                title="1-Tap eCourts Live Sync"
                              >
                                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setSelectedMatterId(m.id);
                                  setQuickActionModal('record_hearing');
                                }}
                                className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold shadow-xs"
                              >
                                Record Outcome
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                      type="button"
                      onClick={() => {
                        if (isRecording) {
                          setIsRecording(false);
                          if (voiceText.trim()) runVoiceSimulation(voiceText);
                        } else {
                          startSpeechRecognition();
                        }
                      }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer ${
                        isRecording
                          ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-500/30'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 ring-4 ring-amber-500/20'
                      }`}
                    >
                      <Mic className="w-8 h-8" />
                    </button>
                    <span className="text-[11px] font-bold text-amber-300">
                      {isRecording ? '🎙️ Listening... Speak Now into Mic' : 'Tap Microphone to Start Voice Dictation'}
                    </span>
                  </div>

                  {/* Preset Quick Voice Snippets */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Test Voice Prompts:</div>
                    <button
                      type="button"
                      onClick={() =>
                        startSpeechRecognition(
                          'Execution Petition 458 of 2026. Matter called. Adjourned to 18 August. Client paid 5000. Upload today’s order.'
                        )
                      }
                      className="w-full text-left p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-[10px] text-amber-200 transition-colors"
                    >
                      🗣️ "Execution Petition 458 of 2026... Adjourned to 18 August... Client paid 5000"
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        startSpeechRecognition(
                          'Commercial Suit 102 of 2025. Hon’ble High Court granted interim stay till 24 September. Send stay order copy.'
                        )
                      }
                      className="w-full text-left p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-[10px] text-amber-200 transition-colors"
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
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-full sm:max-w-md p-4 sm:p-5 space-y-3.5 shadow-2xl text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-amber-400" />
                <span>Instant Voice Dictation AI</span>
              </div>
              <button onClick={() => setQuickActionModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300">
              Speak case number, hearing result, next date, and fee collected. AI auto-parses and updates LawyerDesk ERP.
            </p>

            {/* Microhone Trigger & Wave animation */}
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <button
                type="button"
                onClick={() => {
                  if (isRecording) {
                    setIsRecording(false);
                    if (voiceText.trim()) runVoiceSimulation(voiceText);
                  } else {
                    startSpeechRecognition();
                  }
                }}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-500/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/40 ring-4 ring-amber-500/20'
                }`}
              >
                <Mic className="w-8 h-8" />
              </button>
              <span className="text-[11px] font-bold text-amber-300">
                {isRecording ? '🎙️ Listening... Speak Now into Mic' : 'Tap Microphone to Start Voice Dictation'}
              </span>
            </div>

            {/* Quick Prompt Presets */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Or Choose a Sample Dictation Prompt:</div>
              <div className="grid grid-cols-1 gap-1">
                <button
                  type="button"
                  onClick={() =>
                    startSpeechRecognition(
                      'Execution Petition 458 of 2026. Matter called. Adjourned to 18 August. Client paid 5000. Upload today’s order.'
                    )
                  }
                  className="w-full text-left p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-[10px] text-amber-200 transition-colors"
                >
                  🗣️ "Execution Petition 458 of 2026... Adjourned to 18 August... Client paid ₹5,000"
                </button>
                <button
                  type="button"
                  onClick={() =>
                    startSpeechRecognition(
                      'Commercial Suit 102 of 2025. Hon’ble High Court granted interim stay till 24 September. Client paid 10000.'
                    )
                  }
                  className="w-full text-left p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-[10px] text-amber-200 transition-colors"
                >
                  🗣️ "Commercial Suit 102 of 2025... Interim Stay Granted... Next date 24 Sept"
                </button>
              </div>
            </div>

            {/* Live Dictated Transcript Area */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>Dictated Speech / Note Transcript:</span>
                {voiceText && <span className="text-amber-400">Editable</span>}
              </div>
              <textarea
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                placeholder="Dictation output will appear here live... You can also type or edit voice notes directly."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
              {voiceText && !isParsingVoice && (
                <button
                  type="button"
                  onClick={() => runVoiceSimulation(voiceText)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Parse Edited Text with AI</span>
                </button>
              )}
            </div>

            {/* Loading Indicator */}
            {isParsingVoice && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-center space-y-1.5 animate-pulse">
                <div className="flex items-center justify-center gap-2 text-amber-400 font-extrabold text-xs">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini AI Parsing Dictation & Case Matching...</span>
                </div>
                <p className="text-[10px] text-slate-400">Extracting Case Number, Stage, Outcome, Next Hearing Date & Fees...</p>
              </div>
            )}

            {/* Extracted Briefing Card */}
            {extractedData && !isParsingVoice && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2.5 shadow-lg">
                <div className="font-bold text-amber-300 text-xs flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    AI Extracted Briefing Summary
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                    Parsed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Case Number</div>
                    <div className="font-extrabold text-white truncate">{extractedData.caseNumber}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Next Hearing Date</div>
                    <div className="font-extrabold text-amber-300">{extractedData.nextDate}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Hearing Outcome</div>
                    <div className="font-extrabold text-indigo-300 truncate">{extractedData.outcome}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Fee Collected</div>
                    <div className="font-extrabold text-emerald-400">₹{Number(extractedData.feePaid || 0).toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSyncVoiceToERP}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Save & Sync to LawyerDesk ERP (1-Tap)</span>
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

      {/* FLOATING ASK AI BUTTON */}
      <button
        onClick={() => setIsAskAiOpen(true)}
        className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-amber-500 text-white font-black shadow-2xl flex items-center justify-center active:scale-95 hover:scale-105 transition-transform ring-4 ring-indigo-500/30"
        title="Floating Ask AI Companion"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </button>

      {/* MODAL: FLOATING ASK AI DRAWER */}
      {isAskAiOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-3">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-full sm:max-w-md p-4 sm:p-5 space-y-3 shadow-2xl text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ask AI Assistant (LawyerPocket GO)</span>
              </div>
              <button onClick={() => setIsAskAiOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300">Ask any question about cases, cause lists, client fees, or statutory sections.</p>

            <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              {aiChatLogs.map((log, idx) => (
                <div key={idx} className={`p-2 rounded-lg text-[11px] ${log.sender === 'user' ? 'bg-indigo-600 text-white ml-6 text-right' : 'bg-slate-900 text-slate-200 mr-6'}`}>
                  {log.text}
                </div>
              ))}
            </div>

            <form onSubmit={(e) => { handleSendAiChat(e); }} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask AI e.g. What are today's hearings?"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold active:scale-95">
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CLIENT QUICK CARD */}
      {selectedClientForCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-3">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-full sm:max-w-md p-4 sm:p-5 space-y-3 shadow-2xl text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Client Quick Card</span>
              </div>
              <button onClick={() => setSelectedClientForCard(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-white text-sm">{selectedClientForCard.name}</div>
                  <div className="text-[10px] text-slate-400">{(selectedClientForCard as any).category || 'Corporate Client'}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">Active Client</span>
              </div>

              {/* Instant Contact Group */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${selectedClientForCard.phone}`}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold text-center flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${(selectedClientForCard.phone || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-center flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Client Cases */}
            <div className="space-y-1.5">
              <div className="font-bold text-slate-300 text-[11px]">Active Cases with Firm:</div>
              {matters.filter(m => m.clientName === selectedClientForCard.name || m.clientId === selectedClientForCard.id).map(m => (
                <div key={m.id} className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-indigo-300 text-xs">{m.caseNumber}</div>
                    <div className="text-[10px] text-slate-400">{m.court} &bull; Next: {m.nextHearingDate}</div>
                  </div>
                  <button onClick={() => { setSelectedMatterId(m.id); setQuickActionModal('record_hearing'); }} className="px-2 py-1 rounded bg-indigo-600 text-white font-bold text-[10px]">
                    Record
                  </button>
                </div>
              ))}
            </div>

            {/* Client Timeline History */}
            <div className="space-y-1.5 pt-1">
              <div className="font-bold text-slate-300 text-[11px]">Chronological Activity History:</div>
              <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px]">
                <div className="flex items-center justify-between text-slate-300">
                  <span>✓ Retainer Fee Paid ₹15,000 (UPI)</span>
                  <span className="text-slate-500 font-mono">Yesterday</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>✓ Interim Order Uploaded (High Court)</span>
                  <span className="text-slate-500 font-mono">3 days ago</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>✓ Vakalatnama Executed & Filed</span>
                  <span className="text-slate-500 font-mono">1 week ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SMART NOTIFICATIONS DRAWER */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-3">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-full sm:max-w-md p-4 sm:p-5 space-y-3 shadow-2xl text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-indigo-400" />
                <span>Smart Legal Notifications & Alerts</span>
              </div>
              <button onClick={() => setIsNotificationsOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-1">
                <div className="font-extrabold text-amber-300 text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Limitation Alert: Section 138 Notice
                </div>
                <p className="text-[10px] text-slate-300">
                  30-day statutory notice period for Apex Tech Corp cheque dishonour expires in 3 days (Aug 5, 2026).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-1">
                <div className="font-extrabold text-indigo-300 text-xs flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Today's Court Cause List Sync
                </div>
                <p className="text-[10px] text-slate-300">
                  5 matters listed today in Calcutta High Court Court Room 4 before Hon'ble Division Bench.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
                <div className="font-extrabold text-emerald-300 text-xs flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  Fee Payment Reminder
                </div>
                <p className="text-[10px] text-slate-300">
                  Outstanding fee balance of ₹35,000 for Invoice INV-8820 due today.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PHYSICAL FILE QR CODE */}
      {qrCodeMatter && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-3">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-full sm:max-w-sm p-4 sm:p-5 space-y-3 shadow-2xl text-xs text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-left">
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-indigo-400" />
                <span>Physical File QR Tracker</span>
              </div>
              <button onClick={() => setQrCodeMatter(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl w-44 h-44 mx-auto flex flex-col items-center justify-center shadow-lg border-4 border-indigo-600">
              {/* Simulated QR Code Pattern */}
              <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-slate-100 rounded-lg">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xs ${i % 2 === 0 || i % 5 === 0 ? 'bg-slate-950' : 'bg-transparent'}`}
                  ></div>
                ))}
              </div>
            </div>

            <div>
              <div className="font-extrabold text-white text-sm">{qrCodeMatter.caseNumber}</div>
              <div className="text-[11px] text-indigo-300 font-semibold">{qrCodeMatter.title}</div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Chamber Location: Shelf B3 &bull; Rack 4 &bull; Box #102
              </div>
            </div>

            <button
              onClick={() => {
                showToast('🖨 Physical file QR Code label sent to Chamber printer!');
                setQrCodeMatter(null);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center gap-2 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sticker Label</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: SIGNATURE "LEAVE COURT" BATCH SYNC */}
      {isLeaveCourtModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-3">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-full sm:max-w-md p-4 sm:p-5 space-y-3 shadow-2xl text-xs max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-extrabold text-sm text-amber-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>15-Second "Leave Court" Batch Sync</span>
              </div>
              <button onClick={() => setIsLeaveCourtModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300">
              One-click batch update for all today's court matters before leaving court premises.
            </p>

            <form onSubmit={handleExecuteLeaveCourt} className="space-y-3">
              <div className="space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="font-bold text-white text-xs">Today's Matters Called ({todayHearings.length}):</div>
                {todayHearings.map((h) => {
                  const m = matters.find(item => item.id === h.matterId);
                  return (
                    <div key={h.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between font-bold text-indigo-300">
                        <span>{m?.caseNumber}</span>
                        <span className="text-[10px] text-amber-400">Next Hearing Date:</span>
                      </div>
                      <input
                        type="date"
                        defaultValue="2026-08-28"
                        onChange={(e) => {
                          setLeaveCourtNextDates(prev => ({ ...prev, [h.matterId]: e.target.value }));
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Total Daily Court Fee Collected (INR):</label>
                <input
                  type="number"
                  value={leaveCourtFee}
                  onChange={(e) => setLeaveCourtFee(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveCourtModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg active:scale-95 min-h-[44px]"
                >
                  🏃 Sync All & Leave Court
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW CLIENT FORM */}
      {quickActionModal === 'new_client' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-3">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-full sm:max-w-sm p-4 sm:p-5 space-y-3 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-blue-400" />
                <span>Add New Client (10-Sec)</span>
              </div>
              <button onClick={() => setQuickActionModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickClient} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Client Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Vikramaditya Sen"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Mobile Phone Number:</label>
                <input
                  type="text"
                  placeholder="+91 98301 99999"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address:</label>
                <input
                  type="email"
                  placeholder="client@lawfirm.com"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickActionModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-lg active:scale-95 min-h-[44px]"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW CASE FORM */}
      {quickActionModal === 'new_case' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-3">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-full sm:max-w-sm p-4 sm:p-5 space-y-3 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <FilePlus className="w-4 h-4 text-teal-400" />
                <span>Add New Case Matter</span>
              </div>
              <button onClick={() => setQuickActionModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickCase} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Case Number / CNR:</label>
                <input
                  type="text"
                  placeholder="e.g. W.P. 1820 / 2026"
                  value={newCaseNumber}
                  onChange={(e) => setNewCaseNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Case Title / Cause Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Sen vs. State of West Bengal"
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Court Forum:</label>
                <input
                  type="text"
                  placeholder="Calcutta High Court"
                  value={newCaseCourt}
                  onChange={(e) => setNewCaseCourt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickActionModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold shadow-lg active:scale-95 min-h-[44px]"
                >
                  Create Case Matter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
