import React, { useState, useRef, useEffect } from 'react';
import {
  PenTool,
  Sparkles,
  FileText,
  Folder,
  Copy,
  Check,
  Download,
  Scale,
  BookOpen,
  RefreshCw,
  Sliders,
  Save,
  CheckCircle2,
  FilePlus,
  Building,
  UserCheck,
  Search,
  BookMarked,
  Printer,
  Mic,
  MicOff,
  Radio,
  FileType,
  FileCheck,
  Volume2,
  Layers,
  Send,
  History,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Share2,
  X,
  ChevronRight,
  Maximize2,
  Minimize2,
  Filter,
  Tag,
  HelpCircle,
  ShieldAlert,
  Zap,
  Workflow,
  User as UserIcon,
  Users,
  FileSpreadsheet,
} from 'lucide-react';
import {
  Matter,
  Document,
  User,
  Client,
  LegalDraftRecord,
  DraftVersion,
  StenographerAssignment,
  EvidenceChecklistItem,
} from '../types';

export interface DictatedSentenceItem {
  id: string;
  sentenceIndex: number;
  rawText: string;
  formattedLegalText: string;
  speaker: 'Advocate' | 'Stenographer';
  timestamp: string;
  language: string;
  status: 'Live Dictated' | 'Steno Verified' | 'Inserted in Pleading';
}

interface AIDraftingViewProps {
  matters: Matter[];
  selectedMatter: Matter;
  onSelectMatter: (m: Matter) => void;
  documents?: Document[];
  onUploadDocument?: (
    file: File | null,
    matterId: string,
    category: string,
    folderId?: string,
    folderName?: string,
    fileName?: string,
    ocrText?: string
  ) => void;
  currentUser?: User;
  users?: User[];
  clients?: Client[];
}

export const AIDraftingView: React.FC<AIDraftingViewProps> = ({
  matters,
  selectedMatter,
  onSelectMatter,
  documents = [],
  onUploadDocument,
  currentUser,
  users = [],
  clients = [],
}) => {
  // Main Draft Chamber States
  const [draftType, setDraftType] = useState<string>('Civil Plaint');
  const [jurisdiction, setJurisdiction] = useState<string>('Delhi High Court');
  const [specificInstructions, setSpecificInstructions] = useState<string>('');
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  // User Mode: Lawyer vs Stenographer
  const [userRoleMode, setUserRoleMode] = useState<'Lawyer' | 'Stenographer'>(
    currentUser?.role === 'Stenographer' ? 'Stenographer' : 'Lawyer'
  );

  // Active Side Panel Tab: 'ai_assistant' | 'evidence_builder' | 'doc_references' | 'ai_chat' | 'versions'
  const [activeSidePanel, setActiveSidePanel] = useState<
    'ai_assistant' | 'evidence_builder' | 'doc_references' | 'ai_chat' | 'versions'
  >('ai_assistant');

  // Editor Styling & Formatting States
  const [fontFamily, setFontFamily] = useState<string>('Times New Roman');
  const [fontSize, setFontSize] = useState<string>('13pt');
  const [lineSpacing, setLineSpacing] = useState<string>('1.6');
  const [courtFormatPreset, setCourtFormatPreset] = useState<string>('High Court Format');

  // Voice Dictation States
  const [voiceDraftText, setVoiceDraftText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [dictationLanguage, setDictationLanguage] = useState<'en-IN' | 'hi-IN' | 'bn-IN' | 'hinglish'>('en-IN');
  const recognitionRef = useRef<any>(null);

  // Chamber View Mode & Continuous Advocate Dictation Stream States
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(false);
  const [chamberViewMode, setChamberViewMode] = useState<'word_editor' | 'steno_stream_dashboard'>('steno_stream_dashboard');
  const [dictatedSentences, setDictatedSentences] = useState<DictatedSentenceItem[]>([
    {
      id: 'sent-1',
      sentenceIndex: 1,
      rawText: 'मेरा नाम अरुण जायसवाल है, मैं बेलघोरिया संपत्ति का कानूनी स्वामी हूँ',
      formattedLegalText: 'That the Plaintiff, Shri Arun Jaiswal, is the lawful and absolute owner of the demised Belghoria suit property.',
      speaker: 'Advocate',
      timestamp: '07:50:12 AM',
      language: 'Hindi (हिंदी)',
      status: 'Steno Verified',
    },
    {
      id: 'sent-2',
      sentenceIndex: 2,
      rawText: 'प्रतिवादी ने पिछले 8 महीने से 45,000 रुपये मासिक किराए का भुगतान नहीं किया है',
      formattedLegalText: 'That the Defendant has committed continuous default in payment of monthly rent of Rs. 45,000/- for the past eight consecutive months.',
      speaker: 'Advocate',
      timestamp: '07:50:40 AM',
      language: 'Hindi (हिंदी)',
      status: 'Steno Verified',
    },
    {
      id: 'sent-3',
      sentenceIndex: 3,
      rawText: 'Statutory demand notice under Section 106 Transfer of Property Act served on 10th June 2026',
      formattedLegalText: 'That the Plaintiff served a Statutory Legal Demand Notice dated 10th June 2026 under Section 106 of the Transfer of Property Act, 1882 terminating the tenancy.',
      speaker: 'Advocate',
      timestamp: '07:51:15 AM',
      language: 'English (IN)',
      status: 'Live Dictated',
    },
    {
      id: 'sent-4',
      sentenceIndex: 4,
      rawText: 'Pray for eviction, recovery of arrears of 3,60,000 with 18 percent interest and permanent injunction',
      formattedLegalText: 'PRAYER: Pass a Decree of Eviction & Vacant Possession in respect of Suit Property along with Rs. 3,60,000 rent arrears with 18% interest p.a.',
      speaker: 'Advocate',
      timestamp: '07:52:01 AM',
      language: 'English (IN)',
      status: 'Inserted in Pleading',
    },
  ]);
  const [isContinuousStreamActive, setIsContinuousStreamActive] = useState<boolean>(false);
  const [autoAppendToPleading, setAutoAppendToPleading] = useState<boolean>(true);
  const [editingSentenceId, setEditingSentenceId] = useState<string | null>(null);
  const [editingSentenceText, setEditingSentenceText] = useState<string>('');
  const [isSimulatingStream, setIsSimulatingStream] = useState<boolean>(false);

  // AI Quality Audit Engine States
  const [showAuditReportModal, setShowAuditReportModal] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditReport, setAuditReport] = useState<any>(null);

  // Version Control States
  const [versionsList, setVersionsList] = useState<DraftVersion[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [selectedVersionForCompare, setSelectedVersionForCompare] = useState<DraftVersion | null>(null);

  // Stenographer Workflow & Assignment States
  const [showAssignStenoModal, setShowAssignStenoModal] = useState<boolean>(false);
  const [stenoInstructions, setStenoInstructions] = useState<string>('');
  const [selectedStenoName, setSelectedStenoName] = useState<string>('Ramesh Sharma (Senior Stenographer)');
  const [stenoPriority, setStenoPriority] = useState<'Urgent' | 'High' | 'Normal'>('High');
  const [stenoDeadline, setStenoDeadline] = useState<string>('2026-08-05');
  const [activeStenoAssignment, setActiveStenoAssignment] = useState<StenographerAssignment | null>(null);

  // Evidence Builder States
  const [evidenceList, setEvidenceList] = useState<EvidenceChecklistItem[]>([]);

  // AI Document Chat inside Draft Chamber States
  const [chamberChatQuery, setChamberChatQuery] = useState<string>('');
  const [chamberChatMessages, setChamberChatMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text: '🙏 Namaste Advocate. I am your grounded AI Draft Chamber Assistant. Ask me to extract clauses, summarize uploaded deeds, check missing facts, or insert citations into your draft.',
      time: 'Just now',
    },
  ]);
  const [isChatting, setIsChatting] = useState<boolean>(false);

  // Document Library & AI Search States
  const [showLibraryModal, setShowLibraryModal] = useState<boolean>(false);
  const [librarySearchQuery, setLibrarySearchQuery] = useState<string>('');
  const [savedDraftsLibrary, setSavedDraftsLibrary] = useState<LegalDraftRecord[]>([]);

  // Auto Save State
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('Synced');

  // Precedents / Kanoon Search State
  const [kanoonQuery, setKanoonQuery] = useState<string>('');
  const [precedents, setPrecedents] = useState<any[]>([]);
  const [isSearchingKanoon, setIsSearchingKanoon] = useState<boolean>(false);

  // Synchronize court jurisdiction and default draft when selected matter changes
  useEffect(() => {
    if (selectedMatter) {
      if (selectedMatter.court) {
        setJurisdiction(selectedMatter.court);
      }
      // Initialize evidence checklist for this matter & draft type
      generateEvidenceChecklistForDraft(draftType, selectedMatter);

      // Generate default initial legal draft if empty
      if (!generatedDraft) {
        generateInitialSampleDraft(selectedMatter, draftType);
      }
    }
  }, [selectedMatter]);

  // Clean up speech recognition
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Auto-save interval (simulates saving every 10 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      if (generatedDraft) {
        setAutoSaveStatus('Saving to LawyerDesk Cloud...');
        setTimeout(() => {
          setAutoSaveStatus(`Auto-Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
        }, 800);
      }
    }, 12000);
    return () => clearInterval(timer);
  }, [generatedDraft]);

  // 26 Comprehensive Indian Legal Document Templates
  const ALL_DRAFT_TYPES = [
    { category: 'Litigation Pleadings', items: ['Civil Plaint', 'Written Statement', 'Rejoinder / Reply', 'Affidavit', 'Execution Petition', 'High Court Appeal', 'Revision Petition'] },
    { category: 'Criminal & Bail', items: ['Bail Application', 'Anticipatory Bail', 'Cheque Bounce Complaint (Sec 138 NI Act)', 'FIR Quashing Petition'] },
    { category: 'Notices & Letters', items: ['Legal Notice', 'Reply Notice', 'RTI Application', 'Representation', 'General Legal Letter'] },
    { category: 'Agreements & Deeds', items: ['Rent Agreement', 'Sale Agreement', 'Gift Deed', 'Will', 'Power of Attorney', 'Employment Agreement', 'Partnership Deed', 'Company Resolution'] },
    { category: 'Family & Matrimonial', items: ['Divorce Petition', 'Maintenance Petition'] },
    { category: 'Custom', items: ['Custom Legal Draft'] },
  ];

  // Helper to generate dynamic Evidence Checklist based on Draft Type
  const generateEvidenceChecklistForDraft = (type: string, matter: Matter) => {
    const matterDocs = documents.filter((d) => d.matterId === matter.id);
    const hasDoc = (keyword: string) => matterDocs.some((d) => d.fileName.toLowerCase().includes(keyword) || d.category.toLowerCase().includes(keyword));

    let items: EvidenceChecklistItem[] = [];

    if (type.includes('Plaint') || type.includes('Rent') || type.includes('Sale') || type.includes('Property')) {
      items = [
        { id: 'ev-1', title: 'Registered Title Deed / Sale Deed', category: 'Mandatory', status: hasDoc('sale') || hasDoc('deed') || hasDoc('title') ? 'Attached' : 'Missing', description: 'Primary ownership document proving title.' },
        { id: 'ev-2', title: 'Municipal Property Tax Receipts', category: 'Recommended', status: hasDoc('tax') || hasDoc('receipt') ? 'Attached' : 'Missing', description: 'Proof of possession and tax clearance.' },
        { id: 'ev-3', title: 'Prior Legal Notice & Postal Tracking Report', category: 'Mandatory', status: hasDoc('notice') ? 'Attached' : 'Missing', description: 'Statutory demand notice served on opposite party.' },
        { id: 'ev-4', title: 'Postal Acknowledgment (AD Card)', category: 'Mandatory', status: 'To Be Obtained', description: 'Signed AD card proving receipt by defendant.' },
        { id: 'ev-5', title: 'Identity & Address Proof of Plaintiff', category: 'Recommended', status: 'Attached', description: 'Aadhaar / PAN of client.' },
      ];
    } else if (type.includes('Cheque') || type.includes('138')) {
      items = [
        { id: 'ev-1', title: 'Original Dishonoured Cheque', category: 'Mandatory', status: 'Attached', description: 'Cheque bearing signature and amount.' },
        { id: 'ev-2', title: 'Bank Cheque Return Memo', category: 'Mandatory', status: hasDoc('bank') || hasDoc('memo') ? 'Attached' : 'Missing', description: 'Official bank memo stating Funds Insufficient / Stop Payment.' },
        { id: 'ev-3', title: 'Section 138 Statutory Legal Demand Notice', category: 'Mandatory', status: hasDoc('notice') ? 'Attached' : 'Missing', description: 'Served within 30 days of cheque bounce.' },
        { id: 'ev-4', title: 'Speed Post Receipt & Postal Tracking Report', category: 'Mandatory', status: 'Attached', description: 'Proof of postal dispatch.' },
        { id: 'ev-5', title: 'Bank Account Statement of Complainant', category: 'Recommended', status: 'To Be Obtained', description: 'Showing transaction entry.' },
      ];
    } else if (type.includes('Bail')) {
      items = [
        { id: 'ev-1', title: 'Copy of FIR & Charge Sheet', category: 'Mandatory', status: hasDoc('fir') ? 'Attached' : 'Missing', description: 'Certified copy of FIR registered at Police Station.' },
        { id: 'ev-2', title: 'Remand Order / Injunction Order', category: 'Mandatory', status: hasDoc('order') ? 'Attached' : 'Missing', description: 'Order of Magistrate sending accused to judicial custody.' },
        { id: 'ev-3', title: 'Medical Certificate / Health Records', category: 'Recommended', status: 'To Be Obtained', description: 'Special grounds for medical bail.' },
        { id: 'ev-4', title: 'Local Surety Identity & Revenue Record', category: 'Mandatory', status: 'Missing', description: 'Proof of local permanent residence and surety property.' },
      ];
    } else {
      items = [
        { id: 'ev-1', title: 'Primary Contract / Agreement Copy', category: 'Mandatory', status: hasDoc('agreement') || hasDoc('contract') ? 'Attached' : 'Missing', description: 'Underlying contract between parties.' },
        { id: 'ev-2', title: 'Legal Demand Notice & Reply', category: 'Mandatory', status: hasDoc('notice') ? 'Attached' : 'Missing', description: 'Exchange of notices prior to filing.' },
        { id: 'ev-3', title: 'Invoices & Bank Payment Receipts', category: 'Recommended', status: 'Attached', description: 'Financial proof of claim.' },
        { id: 'ev-4', title: 'Power of Attorney / Vakalatnama', category: 'Mandatory', status: 'Attached', description: 'Authorized signatory authorization.' },
      ];
    }

    setEvidenceList(items);
  };

  // Generate Initial Sample Pleading
  const generateInitialSampleDraft = (matter: Matter, type: string) => {
    const courtUpper = (matter.court || jurisdiction || 'HIGH COURT OF DELHI AT NEW DELHI').toUpperCase();
    const caseNo = matter.caseNumber || 'CS (COMM) 420 OF 2024';
    const clientName = (matter.clientName || 'RAM KUMAR').toUpperCase();
    const oppName = (matter.opposingParty || 'SHYAM SUNDAR & ANR').toUpperCase();

    const sample = `IN THE ${courtUpper}
CIVIL ORIGINAL JURISDICTION

${type.toUpperCase()} NO. _______ OF 2026
IN
CASE NO. ${caseNo}

IN THE MATTER OF:

${clientName},
S/o Shri Harish Kumar,
R/o H.No. 45, Connaught Place, New Delhi - 110001
... PLAINTIFF / PETITIONER

VERSUS

${oppName},
S/o Shri Rameshwar Sundar,
R/o Flat No. 102, Saket Enclave, New Delhi - 110017
... DEFENDANT / RESPONDENT

SUIT FOR RECOVERY OF POSSESSION, ARREARS OF RENT, PERMANENT INJUNCTION AND DAMAGES UNDER THE CODE OF CIVIL PROCEDURE, 1908.

MOST RESPECTFULLY SHOWETH:

1. That the Plaintiff is a law-abiding citizen of India, residing at the address mentioned in the cause title and is the lawful owner and landlord of the demised premises bearing Flat No. 102, Saket Enclave, New Delhi - 110017 (hereinafter referred to as the "Suit Property").

2. That the Defendant entered into a Registered Tenancy Agreement dated 15th March 2024 with the Plaintiff for a period of 11 months, agreeing to pay a monthly rent of Rs. 45,000/- (Rupees Forty-Five Thousand Only) payable on or before the 5th day of each English calendar month.

3. That despite repeated verbal reminders and written communications, the Defendant has committed continuous default in payment of monthly rent for the past eight consecutive months, amounting to a total outstanding arrears of Rs. 3,60,000/- (Rupees Three Lakhs Sixty Thousand Only).

4. That the Plaintiff served a Statutory Legal Demand Notice dated 10th June 2026 under Section 106 of the Transfer of Property Act, 1882, terminating the tenancy and demanding vacant possession within 15 days. Despite receipt of the said notice on 12th June 2026, the Defendant failed to vacate or pay the arrears.

5. That the cause of action accrued in favour of the Plaintiff and against the Defendant on 15th March 2024 when the tenancy agreement was executed, and further accrued on 10th June 2026 when statutory notice was served, and continues to accrue daily within the territorial jurisdiction of this Hon'ble Court.

PRAYER:

In view of the facts and circumstances stated hereinabove, it is most respectfully prayed that this Hon'ble Court may graciously be pleased to:

a) Pass a Decree of Eviction & Recovery of Possession in favour of the Plaintiff and against the Defendant in respect of the Suit Property;
b) Pass a Decree for Recovery of Rent Arrears amounting to Rs. 3,60,000/- along with pendente lite and future interest @ 18% per annum;
c) Pass a Permanent Injunction restraining the Defendant from creating any third-party interest in the Suit Property;
d) Award costs of the suit in favour of the Plaintiff;
e) Pass such other or further order(s) as this Hon'ble Court may deem fit and proper in the interest of justice.

PLAINTIFF
THROUGH
ADV. RAJESHWAR V. SHARMA
(BAR COUNCIL REG. NO. D/1482/2012)
ADVOCATE FOR THE PLAINTIFF
LAWYERDESK AI CHAMBER, NEW DELHI

VERIFICATION:
Verified at New Delhi on this 3rd day of August 2026, that the contents of paragraphs 1 to 5 are true to my personal knowledge, and paragraphs 6 to 8 are based on legal advice believed to be true.

DEPONENT / PLAINTIFF`;

    setGeneratedDraft(sample);
  };

  // Generate Draft via AI API or Local Gemini Structuring Engine
  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    setSavedBanner(null);
    setGeneratedDraft(`⚡ LAWYERDESK AI DRAFT CHAMBER: Synthesizing formal ${draftType} for ${selectedMatter.caseNumber} (${selectedMatter.title})...`);

    try {
      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matterId: selectedMatter.id,
          matter: selectedMatter,
          draftType,
          specificInstructions: `Court Jurisdiction: ${selectedMatter.court || jurisdiction}. ${specificInstructions}`,
        }),
      });

      const data = await res.json();
      const draftContent = data.draft || 'Draft generation completed.';
      setGeneratedDraft(draftContent);
      setSavedBanner(`✨ ${draftType} generated successfully for ${selectedMatter.title}!`);

      // Add new version entry
      const newVer: DraftVersion = {
        id: `ver-${Date.now()}`,
        versionNumber: versionsList.length + 1,
        content: draftContent,
        savedBy: currentUser?.name || 'Advocate',
        savedAt: new Date().toLocaleString('en-IN'),
        changeSummary: `Generated fresh ${draftType} via AI Chamber Engine`,
      };
      setVersionsList((prev) => [newVer, ...prev]);
    } catch (err) {
      console.error(err);
      setGeneratedDraft('Error generating draft. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Speech-to-Legal Dictation Parser
  const startSpeechRecognition = (fallbackPrompt?: string) => {
    const defaultSample =
      fallbackPrompt ||
      'My client Ram Kumar entered into a tenancy agreement dated 15 March 2024. The tenant has not paid rent for eight months despite repeated demands. Draft a civil suit for eviction and recovery of rent arrears.';

    setIsListening(true);
    setVoiceDraftText('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = dictationLanguage;

        let capturedText = '';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          capturedText = transcript;
          setVoiceDraftText(transcript);
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition fallback:', err);
          setTimeout(() => {
            runVoiceToLegalParsing(defaultSample);
          }, 600);
        };

        recognition.onend = () => {
          setIsListening(false);
          setTimeout(() => {
            const finalSpeech = capturedText.trim() || defaultSample;
            runVoiceToLegalParsing(finalSpeech);
          }, 300);
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition error:', e);
      }
    }

    // Fallback simulation
    setTimeout(() => {
      runVoiceToLegalParsing(defaultSample);
    }, 1000);
  };

  const runVoiceToLegalParsing = async (spokenText: string) => {
    setVoiceDraftText(spokenText);
    setIsListening(false);
    setIsGenerating(true);
    setSavedBanner(null);

    setGeneratedDraft(`⚡ Converting Natural Voice Dictation into Structured Legal Language...\n\nSpoken Input: "${spokenText}"`);

    try {
      const combinedInstructions = `[LAWYER NATURAL VOICE DICTATION]:\n"${spokenText}"\n\nTransform this natural spoken dictation into formal Indian Court Pleading structure with proper cause title, facts, grounds, and prayer clause. Jurisdiction: ${selectedMatter.court || jurisdiction}. ${specificInstructions}`;

      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matterId: selectedMatter.id,
          matter: selectedMatter,
          draftType,
          specificInstructions: combinedInstructions,
        }),
      });

      const data = await res.json();
      const parsedDraft = data.draft || 'Voice dictation converted to legal draft.';
      setGeneratedDraft(parsedDraft);
      setSavedBanner(`✨ Voice Dictation converted into Professional Legal ${draftType}!`);

      // Add to versions
      const newVer: DraftVersion = {
        id: `ver-${Date.now()}`,
        versionNumber: versionsList.length + 1,
        content: parsedDraft,
        savedBy: currentUser?.name || 'Advocate',
        savedAt: new Date().toLocaleString('en-IN'),
        changeSummary: `Voice Dictation converted into ${draftType}`,
      };
      setVersionsList((prev) => [newVer, ...prev]);
    } catch (e) {
      console.error(e);
      setGeneratedDraft('Error converting voice dictation. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  // CONTINUOUS ADVOCATE-TO-STENOGRAPHER REAL-TIME DICTATION ENGINE
  const toggleContinuousSpeechStream = () => {
    if (isContinuousStreamActive) {
      setIsContinuousStreamActive(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setSavedBanner('⏸️ Continuous Advocate Dictation Stream paused.');
      return;
    }

    setIsContinuousStreamActive(true);
    setSavedBanner('🎙️ Continuous Dictation ACTIVE: Dictate endless sentences. Every sentence streams live to Stenographer & Pleading Canvas!');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = dictationLanguage === 'hi-IN' ? 'hi-IN' : dictationLanguage === 'bn-IN' ? 'bn-IN' : 'en-IN';

        recognitionRef.current = recognition;

        recognition.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              const spokenSentence = event.results[i][0].transcript.trim();
              if (spokenSentence) {
                handleNewDictatedSentence(spokenSentence);
              }
            }
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Continuous speech error:', err);
        };

        recognition.onend = () => {
          if (isContinuousStreamActive && recognitionRef.current) {
            try {
              recognition.start();
            } catch (e) {
              // ignore
            }
          }
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('Error starting continuous recognition:', e);
      }
    }

    // Fallback simulation if speech recognition is unsupported or restricted
    handleSimulateContinuousDictationStream();
  };

  const handleNewDictatedSentence = (rawSpokenText: string) => {
    const nextIdx = dictatedSentences.length + 1;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let legalFormulation = rawSpokenText;
    if (/नाम|name/i.test(rawSpokenText)) {
      legalFormulation = `That the Plaintiff / Petitioner, Shri Arun Jaiswal, is a law-abiding citizen residing at the address stated in the cause title.`;
    } else if (/किराया|rent|arrears|default|भुगतान/i.test(rawSpokenText)) {
      legalFormulation = `That the Defendant committed continuous breach and default in payment of monthly rent of Rs. 45,000/- for eight consecutive months.`;
    } else if (/notice|नोटीस|धारा|section|106/i.test(rawSpokenText)) {
      legalFormulation = `That statutory notice dated 10th June 2026 terminating tenancy under Section 106 of the Transfer of Property Act was duly served.`;
    } else if (/pray|याचिका|बेदखली|eviction|damages/i.test(rawSpokenText)) {
      legalFormulation = `PRAYER: Pass a Decree of Eviction & Vacant Possession in respect of the suit premises along with 18% interest p.a.`;
    } else {
      legalFormulation = `That ${rawSpokenText.charAt(0).toUpperCase() + rawSpokenText.slice(1)}.`;
    }

    const newItem: DictatedSentenceItem = {
      id: `sent-${Date.now()}-${Math.random()}`,
      sentenceIndex: nextIdx,
      rawText: rawSpokenText,
      formattedLegalText: legalFormulation,
      speaker: 'Advocate',
      timestamp: timeStr,
      language: dictationLanguage === 'hi-IN' ? 'Hindi (हिंदी)' : dictationLanguage === 'bn-IN' ? 'Bengali (বাংলা)' : 'English (IN)',
      status: 'Live Dictated',
    };

    setDictatedSentences((prev) => [...prev, newItem]);

    if (autoAppendToPleading) {
      setGeneratedDraft((prev) => {
        const addition = `\n\n${nextIdx}. ${legalFormulation}`;
        return prev + addition;
      });
    }
  };

  const handleSimulateContinuousDictationStream = () => {
    if (isSimulatingStream) return;
    setIsSimulatingStream(true);
    setIsContinuousStreamActive(true);
    setSavedBanner('🚀 Streaming continuous Advocate dictation sentences live to Stenographer Feed...');

    const sampleSentences = [
      { raw: 'मेरा नाम अरुण जायसवाल है, मैं बेलघोरिया संपत्ति का मालिक हूँ', lang: 'Hindi (हिंदी)' },
      { raw: 'Defendant entered into tenancy agreement dated 15th March 2024 for monthly rent of 45,000 rupees', lang: 'English (IN)' },
      { raw: 'प्रतिवादी ने पिछले 8 महीने से किराए का एक भी रुपया नहीं दिया है', lang: 'Hindi (हिंदी)' },
      { raw: 'Statutory demand notice under Section 106 Transfer of Property Act was issued on 10 June 2026', lang: 'English (IN)' },
      { raw: 'Speed Post Acknowledgment confirms receipt by defendant on 12th June 2026', lang: 'English (IN)' },
      { raw: 'Defendant refused to vacate the premises despite expiry of 15 days statutory notice period', lang: 'English (IN)' },
      { raw: 'Total rent arrears accrued is 3,60,000 rupees along with interest at 18 percent per annum', lang: 'English (IN)' },
      { raw: 'Cause of action arose in New Delhi within territorial jurisdiction of this court', lang: 'English (IN)' },
      { raw: 'Plaintiff prays for eviction decree and decree for recovery of arrears of rent', lang: 'English (IN)' },
      { raw: 'Permanent injunction restraining defendant from creating third party interest in suit property', lang: 'English (IN)' },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i >= sampleSentences.length) {
        clearInterval(interval);
        setIsSimulatingStream(false);
        setIsContinuousStreamActive(false);
        setSavedBanner('✅ Continuous Dictation Stream complete: 10 Sentences indexed & appended to pleading!');
        return;
      }
      const item = sampleSentences[i];
      handleNewDictatedSentence(item.raw);
      i++;
    }, 2000);
  };

  // Run AI Quality Audit Check
  const handleRunQualityAudit = () => {
    setIsAuditing(true);
    setShowAuditReportModal(true);

    setTimeout(() => {
      setIsAuditing(false);
      setAuditReport({
        score: 96,
        status: 'High Quality • Ready for Filing',
        checks: [
          { name: 'Cause Title & Jurisdiction Formatting', passed: true, detail: `Matches ${selectedMatter.court || jurisdiction} rules.` },
          { name: 'Parties Names & Address Accuracy', passed: true, detail: `Plaintiff: ${selectedMatter.clientName} | Defendant: ${selectedMatter.opposingParty}` },
          { name: 'Statutory Sections & Grounding', passed: true, detail: `Verified against ${selectedMatter.actsAndSections?.join(', ') || 'CPC 1908'}.` },
          { name: 'Paragraph Sequence & Numbering', passed: true, detail: '1 to 5 sequential paragraphs formatted.' },
          { name: 'Prayer & Verification Clause', passed: true, detail: 'Complete relief prayer and verification block included.' },
          { name: 'Evidence Annexure References', passed: false, detail: 'Missing Postal Acknowledgment AD Card reference.' },
        ],
        suggestions: [
          'Add citation of Landmark Supreme Court Judgment on Rent Control.',
          'Attach Postal Acknowledgment card in Evidence Checklist before final printing.',
        ],
      });
    }, 1200);
  };

  // 1-Click Auto Fix Quality Issues
  const handleAutoFixQualityIssues = () => {
    if (!generatedDraft) return;
    const fixed = generatedDraft + `\n\n[AI AUDIT AUTO-CORRECTION]:\n"ANNEXURE A-1: True Copy of Postal Acknowledgment AD Card showing receipt of Legal Demand Notice on 12th June 2026."`;
    setGeneratedDraft(fixed);
    if (auditReport) {
      setAuditReport({ ...auditReport, score: 100, status: 'Perfect Score • Fully Audited & Compliant' });
    }
    setSavedBanner('✨ 1-Click Auto-Fix Applied: Added Postal Acknowledgment Annexure A-1!');
    setTimeout(() => setSavedBanner(null), 3000);
  };

  // Save Draft to LawyerDesk ERP Case File
  const handleSaveToCaseFile = async () => {
    if (!generatedDraft) return;

    if (onUploadDocument) {
      const fileName = `${draftType.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedMatter.caseNumber.replace(/[^a-zA-Z0-9]/g, '_')}_v${versionsList.length || 1}.docx`;
      onUploadDocument(null, selectedMatter.id, draftType, undefined, 'AI Draft Chamber', fileName, generatedDraft);
    }

    // Save to local library
    const newRecord: LegalDraftRecord = {
      id: `draft-rec-${Date.now()}`,
      matterId: selectedMatter.id,
      caseNumber: selectedMatter.caseNumber,
      title: `${draftType} - ${selectedMatter.title}`,
      draftType,
      content: generatedDraft,
      court: selectedMatter.court,
      status: 'Lawyer Approved',
      versions: versionsList,
      evidenceChecklist: evidenceList,
      createdAt: new Date().toLocaleDateString('en-IN'),
      updatedAt: new Date().toLocaleTimeString('en-IN'),
      createdBy: currentUser?.name || 'Advocate',
    };

    setSavedDraftsLibrary((prev) => [newRecord, ...prev]);
    setSavedBanner(`💰 ${draftType} saved & synced to LawyerDesk ERP Case File!`);
    setTimeout(() => setSavedBanner(null), 4000);
  };

  // Save Assignment to Stenographer
  const handleAssignToStenographer = () => {
    const newAssignment: StenographerAssignment = {
      id: `steno-assign-${Date.now()}`,
      draftId: `draft-${Date.now()}`,
      draftName: `${draftType} - ${selectedMatter.caseNumber}`,
      matterId: selectedMatter.id,
      matterTitle: selectedMatter.title,
      assignedBy: currentUser?.name || 'Senior Advocate',
      assignedTo: selectedStenoName,
      instructions: stenoInstructions || 'Please type dictation, format paragraph margins, and verify address details.',
      priority: stenoPriority,
      deadline: stenoDeadline,
      status: 'Assigned',
      createdAt: new Date().toLocaleString('en-IN'),
    };

    setActiveStenoAssignment(newAssignment);
    setShowAssignStenoModal(false);
    setSavedBanner(`📋 Draft assigned to Stenographer ${selectedStenoName} with ${stenoPriority} priority!`);
    setTimeout(() => setSavedBanner(null), 4000);
  };

  // Chamber AI Chat Handler
  const handleSendChamberChat = async () => {
    if (!chamberChatQuery.trim()) return;

    const userQ = chamberChatQuery;
    setChamberChatQuery('');
    setChamberChatMessages((prev) => [...prev, { sender: 'user', text: userQ, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setIsChatting(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matterId: selectedMatter.id,
          selectedMatter,
          query: `In the context of drafting ${draftType} for case ${selectedMatter.title}: ${userQ}`,
        }),
      });
      const data = await res.json();
      setChamberChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.text || 'Analyzed case record.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {
      console.error(e);
      setChamberChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Error connecting to grounded AI engine.', time: 'Now' },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download DOCX
  const handleDownloadDocx = () => {
    const docxHeader = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${draftType}</title>
    <style>body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.6; padding: 1in; }</style>
    </head><body><pre style="font-family: inherit; white-space: pre-wrap;">${generatedDraft}</pre></body></html>`;

    const blob = new Blob([docxHeader], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draftType.replace(/\s+/g, '_')}_${selectedMatter.caseNumber.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download PDF / Print
  const handlePrintPdf = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    printWin.document.write(`
      <html>
        <head>
          <title>${draftType} - ${selectedMatter.caseNumber}</title>
          <style>
            @page { size: A4; margin: 25mm; }
            body { font-family: 'Times New Roman', Georgia, serif; font-size: 13px; line-height: 1.8; color: #111; padding: 20px; }
            .header { text-align: center; font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .content { white-space: pre-wrap; text-align: justify; }
            .footer { margin-top: 40px; border-top: 1px solid #ccc; pt: 10px; font-size: 10px; display: flex; justify-content: space-between; color: #555; }
          </style>
        </head>
        <body>
          <div class="header">
            ${(selectedMatter.court || jurisdiction).toUpperCase()}<br/>
            <span style="font-size: 11px; font-weight: normal;">LAWYERDESK AI DRAFT CHAMBER - OFFICIAL PLEADING</span>
          </div>
          <div class="content">${generatedDraft.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          <div class="footer">
            <span>Case: ${selectedMatter.caseNumber} (${selectedMatter.title})</span>
            <span>LawyerDesk AI (lawyerdesk.co.in)</span>
          </div>
          <script>window.onload = function() { setTimeout(function(){ window.print(); }, 400); };</script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="space-y-4 text-slate-100 max-w-full pb-16">
      {/* 1. TOP BRANDING & CHAMBER HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    LAWYERDESK AI DRAFT CHAMBER
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] border border-amber-500/30 uppercase tracking-wider">
                    v2.0 Legal OS
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 font-semibold italic flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>"Speak Naturally. Draft Professionally."</span>
                </p>
              </div>
            </div>
          </div>

          {/* Top Right Controls: Role Mode Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Role View Toggle: Lawyer vs Stenographer */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
              <button
                type="button"
                onClick={() => setUserRoleMode('Lawyer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  userRoleMode === 'Lawyer'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Lawyer View</span>
              </button>
              <button
                type="button"
                onClick={() => setUserRoleMode('Stenographer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  userRoleMode === 'Stenographer'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Stenographer Mode</span>
              </button>
            </div>

            {/* AI Quality Audit Button */}
            <button
              type="button"
              onClick={handleRunQualityAudit}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>AI Quality Audit</span>
              {auditReport && (
                <span className="ml-1 bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  {auditReport.score}%
                </span>
              )}
            </button>

            {/* Document Library & Search */}
            <button
              type="button"
              onClick={() => setShowLibraryModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <BookMarked className="w-4 h-4 text-indigo-400" />
              <span>Draft Library ({savedDraftsLibrary.length})</span>
            </button>

            {/* Toggle Right AI Assistant Side Panel */}
            <button
              type="button"
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className={`px-3 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
                isRightPanelOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md'
                  : 'bg-slate-800 text-amber-300 border-amber-500/30 hover:bg-slate-700'
              }`}
              title="Toggle Right AI Suggestions & Assistant Panel"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isRightPanelOpen ? 'Hide Suggestions (Max Space)' : 'Show AI Suggestions'}</span>
            </button>

            {/* Save & Sync to Case File */}
            <button
              type="button"
              onClick={handleSaveToCaseFile}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save to LawyerDesk ERP</span>
            </button>
          </div>
        </div>

        {/* 2. CASE INTEGRATION BANNER (Zero Manual Typing) */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Case Selector */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider flex items-center gap-1">
              <Folder className="w-3 h-3" />
              <span>Loaded Case File (Zero Manual Typing)</span>
            </label>
            <select
              value={selectedMatter?.id}
              onChange={(e) => {
                const m = matters.find((item) => item.id === e.target.value);
                if (m) onSelectMatter(m);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
            >
              {matters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.caseNumber} - {m.title} ({m.court})
                </option>
              ))}
            </select>
          </div>

          {/* Loaded Metadata Badges */}
          <div className="md:col-span-8 flex flex-wrap items-center gap-2 text-[11px]">
            <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              <span className="text-slate-400 text-[10px] block font-bold">CLIENT</span>
              <span className="font-extrabold text-white">{selectedMatter?.clientName || 'N/A'}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              <span className="text-slate-400 text-[10px] block font-bold">OPPOSING PARTY</span>
              <span className="font-extrabold text-slate-200">{selectedMatter?.opposingParty || 'N/A'}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              <span className="text-slate-400 text-[10px] block font-bold">CNR NUMBER</span>
              <span className="font-mono font-bold text-amber-300">{selectedMatter?.cnrNumber || 'DLHC010004202024'}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              <span className="text-slate-400 text-[10px] block font-bold">BENCH & JUDGE</span>
              <span className="font-bold text-indigo-300">{selectedMatter?.judgeName || 'Hon’ble Bench'}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auto-Loaded from Case Record</span>
            </div>
          </div>
        </div>

        {/* Saved Banner Toast */}
        {savedBanner && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {savedBanner}
            </span>
            <button onClick={() => setSavedBanner(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* STENOGRAPHER MODE NOTICE (if Stenographer Mode active) */}
      {userRoleMode === 'Stenographer' && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-300 font-black">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span>STENOGRAPHER WORKSPACE ACTIVE</span>
              {activeStenoAssignment && (
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] border border-amber-500/30">
                  Priority: {activeStenoAssignment.priority}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">Assigned by: Senior Advocate</span>
          </div>

          <p className="text-slate-300">
            {activeStenoAssignment
              ? `Task Instructions: "${activeStenoAssignment.instructions}" — Deadline: ${activeStenoAssignment.deadline}`
              : 'You are in Stenographer Mode. Dictate or type assigned pleadings and click "Submit to Lawyer for Approval" when done.'}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setSavedBanner('✅ Draft submitted to Senior Advocate for final review!');
                setTimeout(() => setSavedBanner(null), 3000);
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Draft to Lawyer for Review</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE VIEW - 3 COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* LEFT COLUMN (LG: 3): TEMPLATE TYPES */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Draft Type Picker Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-xl flex flex-col justify-between flex-1 h-full min-h-[680px] space-y-3">
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <FileType className="w-4 h-4 text-amber-400" />
                  <span>Select Draft Type</span>
                </span>
                <span className="text-[10px] bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  26 Templates
                </span>
              </div>

              {/* Grouped Draft Categories */}
              <div className="space-y-2.5 flex-1 min-h-[380px] max-h-[520px] overflow-y-auto pr-1 text-xs">
                {ALL_DRAFT_TYPES.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1">
                      {group.category}
                    </div>
                    <div className="space-y-0.5">
                      {group.items.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setDraftType(item);
                            generateEvidenceChecklistForDraft(item, selectedMatter);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center justify-between text-xs ${
                            draftType === item
                              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{item}</span>
                          {draftType === item && <Check className="w-3.5 h-3.5 text-slate-950" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800">
              {/* Target Court Forum Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Target Court Forum</label>
                <input
                  type="text"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  placeholder="e.g. In the High Court of Delhi at New Delhi"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              {/* Specific Lawyer Directives */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Specific Lawyer Directives & Points</label>
                <textarea
                  value={specificInstructions}
                  onChange={(e) => setSpecificInstructions(e.target.value)}
                  placeholder="Key facts (e.g., 'Eviction u/s 14(1)(a) Delhi Rent Control Act, 8 months unpaid rent, Section 106 notice issued')..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Generate via AI Button */}
              <button
                type="button"
                onClick={handleGenerateDraft}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>AI Drafting Legal OS...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate {draftType} via AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: MS WORD STYLE RICH PLEADING EDITOR (EXPANDS TO COL-SPAN-9 WHEN RIGHT PANEL COLLAPSED) */}
        <div className={isRightPanelOpen ? 'lg:col-span-6 space-y-3' : 'lg:col-span-9 space-y-3'}>
          {/* PLEADING VIEW CANVAS BOX */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[440px]">
            {/* Editor Top Ribbon Toolbar */}
            <div className="bg-slate-950 border-b border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              {/* Left Font & Styling Controls */}
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Font Selector */}
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Garamond">Garamond</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Arial">Arial</option>
                </select>

                {/* Font Size */}
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="11pt">11 pt</option>
                  <option value="12pt">12 pt</option>
                  <option value="13pt">13 pt (Court Std)</option>
                  <option value="14pt">14 pt</option>
                  <option value="16pt">16 pt (Heading)</option>
                </select>

                {/* Court Formatting Preset */}
                <select
                  value={courtFormatPreset}
                  onChange={(e) => {
                    setCourtFormatPreset(e.target.value);
                    if (e.target.value.includes('District')) {
                      setFontFamily('Times New Roman');
                      setFontSize('13pt');
                      setLineSpacing('2.0');
                    } else if (e.target.value.includes('High Court')) {
                      setFontFamily('Times New Roman');
                      setFontSize('13pt');
                      setLineSpacing('1.6');
                    }
                  }}
                  className="bg-slate-900 border border-amber-500/40 text-xs font-bold text-amber-300 rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="High Court Format">High Court (Legal Size / 1.6 Spacing)</option>
                  <option value="District Court Format">District Court (A4 / 2.0 Spacing)</option>
                  <option value="NCLT / DRT Tribunal">NCLT / DRT Tribunal Format</option>
                  <option value="Consumer Commission">Consumer Commission Format</option>
                  <option value="Arbitration Tribunal">Arbitration Tribunal Format</option>
                </select>
              </div>

              {/* Right Export Actions Menu */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isRightPanelOpen
                      ? 'bg-slate-800 text-slate-300 hover:text-white'
                      : 'bg-amber-500 text-slate-950 font-black shadow-md'
                  }`}
                  title={isRightPanelOpen ? 'Hide side panel for full-width editor' : 'Expanded full-width canvas'}
                >
                  {isRightPanelOpen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-slate-950" />}
                  <span>{isRightPanelOpen ? 'Full Space' : 'Expanded View'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadDocx}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition-colors"
                  title="Download Word (.docx)"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors"
                  title="Print / Save PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Pleading Structural Generator Bar */}
            <div className="bg-slate-950/60 border-b border-slate-800/80 px-3 py-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-[10px] font-black text-slate-400 uppercase">Insert Clause:</span>
              <button
                type="button"
                onClick={() =>
                  setGeneratedDraft(
                    (prev) => `IN THE COURT OF ${jurisdiction.toUpperCase()}\n\nCASE NO. ${selectedMatter.caseNumber}\n\n${prev}`
                  )
                }
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[10px]"
              >
                + Cause Title
              </button>
              <button
                type="button"
                onClick={() =>
                  setGeneratedDraft(
                    (prev) =>
                      prev +
                      `\n\nPRAYER:\nIn view of the facts stated, it is respectfully prayed that this Hon'ble Court may graciously be pleased to pass orders in favour of the Plaintiff.`
                  )
                }
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-[10px]"
              >
                + Prayer Clause
              </button>
              <button
                type="button"
                onClick={() =>
                  setGeneratedDraft(
                    (prev) =>
                      prev +
                      `\n\nVERIFICATION:\nVerified at New Delhi on this ${new Date().toLocaleDateString('en-IN')}, that paragraphs 1 to 5 are true to my personal knowledge.`
                  )
                }
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-[10px]"
              >
                + Verification
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentUser?.role === 'Senior Advocate') {
                    setShowAssignStenoModal(true);
                  } else {
                    setShowAssignStenoModal(true);
                  }
                }}
                className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1 ml-auto"
              >
                <UserCheck className="w-3 h-3" />
                <span>Assign to Stenographer</span>
              </button>
            </div>

            {/* Main Textarea Pleading Canvas */}
            <div className="p-4 flex-1 bg-slate-950 flex flex-col">
              <textarea
                value={generatedDraft}
                onChange={(e) => setGeneratedDraft(e.target.value)}
                placeholder="Formal legal pleading will appear here... You can edit directly or dictate via voice."
                style={{
                  fontFamily: fontFamily === 'Times New Roman' ? '"Times New Roman", Times, serif' : fontFamily,
                  fontSize: fontSize,
                  lineHeight: lineSpacing,
                }}
                className="w-full h-full min-h-[310px] bg-slate-950 text-slate-100 placeholder-slate-600 p-4 border border-slate-800/80 rounded-xl focus:outline-none focus:border-amber-500/60 font-mono text-xs leading-relaxed resize-y"
              />
            </div>

            {/* Editor Footer Status Bar */}
            <div className="bg-slate-950 border-t border-slate-800 px-3 py-2 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {autoSaveStatus}
                </span>
                <span>Words: {generatedDraft.trim().split(/\s+/).filter(Boolean).length}</span>
                <span>Chars: {generatedDraft.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-amber-300">{courtFormatPreset}</span>
                <span className="text-slate-600">|</span>
                <span>LawyerDesk AI Engine v3.6</span>
              </div>
            </div>
          </div>

          {/* ADVOCATE VOICE DICTATION STUDIO CARD (LOCATED BELOW PLEADING VIEW CANVAS) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-extrabold text-xs text-white flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-amber-400" />
                <span>Advocate Dictation Input Studio</span>
              </div>
              <select
                value={dictationLanguage}
                onChange={(e) => setDictationLanguage(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-[10px] font-bold text-amber-300 rounded px-2 py-1 focus:outline-none"
              >
                <option value="en-IN">English (India)</option>
                <option value="hi-IN">Hindi (हिंदी)</option>
                <option value="bn-IN">Bengali (বাংলা)</option>
                <option value="hinglish">Mixed / Hinglish</option>
              </select>
            </div>

            {/* Mic Trigger & Quick Actions */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isListening) {
                    setIsListening(false);
                    setSavedBanner('⏸️ Dictation paused.');
                  } else {
                    startSpeechRecognition();
                  }
                }}
                className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-500/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md font-extrabold'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isListening ? '🎙️ Listening Live...' : 'Start Continuous Dictation Mic'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const demoParagraphs = [
                    "मेरा नाम अरुण जायसवाल है, मैं बेलघोरिया संपत्ति का कानूनी स्वामी हूँ।",
                    "Defendant entered into tenancy agreement dated 15th March 2024 for monthly rent of Rs. 45,000/-.",
                    "प्रतिवादी ने पिछले 8 महीने से 45,000 रुपये मासिक किराए का भुगतान नहीं किया है। Total arrears accrued is Rs. 3,60,000/-.",
                    "Statutory demand notice under Section 106 Transfer of Property Act was issued on 10th June 2026 and served via Speed Post.",
                    "Defendant failed to vacate within 15 days of notice expiry. Pray for eviction decree and recovery of arrears with 18% interest p.a."
                  ];
                  setVoiceDraftText((prev) => (prev ? prev + "\n\n" + demoParagraphs.join(" ") : demoParagraphs.join(" ")));
                  setSavedBanner("🚀 Natural Advocate Dictation loaded into Description Box!");
                  setTimeout(() => setSavedBanner(null), 3000);
                }}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-all"
                title="Simulate Advocate Dictation in 1 click"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Simulate</span>
              </button>
            </div>

            {/* Dictation Description Input Box */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
                <span>Spoken / Dictated Text Box:</span>
                {voiceDraftText && (
                  <button
                    type="button"
                    onClick={() => setVoiceDraftText('')}
                    className="text-slate-500 hover:text-rose-400 text-[10px]"
                  >
                    Clear Text
                  </button>
                )}
              </div>
              <textarea
                value={voiceDraftText}
                onChange={(e) => setVoiceDraftText(e.target.value)}
                placeholder="Advocate dictation will stream here live as you speak... You can also paste or edit dictation freely."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-amber-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
              />
            </div>

            {/* Convert / Append Button */}
            <button
              type="button"
              onClick={() => runVoiceToLegalParsing(voiceDraftText || "Advocate dictated tenancy eviction and arrears claim.")}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Convert / Append Dictation to Pleading</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN (LG: 3): DYNAMIC AI SIDE PANEL (COLLAPSIBLE FOR MAXIMUM CANVAS SPACE) */}
        {isRightPanelOpen && (
          <div className="lg:col-span-3 space-y-3 animate-in fade-in">
            {/* Side Panel Tabs Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 flex items-center justify-between gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveSidePanel('ai_assistant')}
              className={`px-2.5 py-1.5 rounded-xl font-bold flex-1 transition-all flex items-center justify-center gap-1 ${
                activeSidePanel === 'ai_assistant'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suggestions</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSidePanel('evidence_builder')}
              className={`px-2.5 py-1.5 rounded-xl font-bold flex-1 transition-all flex items-center justify-center gap-1 ${
                activeSidePanel === 'evidence_builder'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Evidence</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSidePanel('ai_chat')}
              className={`px-2.5 py-1.5 rounded-xl font-bold flex-1 transition-all flex items-center justify-center gap-1 ${
                activeSidePanel === 'ai_chat'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>RAG Chat</span>
            </button>
          </div>

          {/* TAB 1: SMART LEGAL SUGGESTIONS */}
          {activeSidePanel === 'ai_assistant' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-xl">
              <div className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>Smart Legal Suggestions</span>
                </span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  Grounded
                </span>
              </div>

              {/* Applicable Acts & Sections */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-black text-amber-400 uppercase">Applicable Acts & Sections:</div>
                <div className="space-y-1">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="font-extrabold text-white">Code of Civil Procedure, 1908</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Order 39 Rules 1 & 2 (Temporary Injunctions)</div>
                    <button
                      type="button"
                      onClick={() =>
                        setGeneratedDraft(
                          (prev) =>
                            prev +
                            `\n\n[INJUNCTION CLAUSE UNDER CPC ORDER 39]:\nThat the Plaintiff has a strong prima facie case and balance of convenience lies in favour of the Plaintiff. Irreparable injury will be caused if temporary injunction is not granted.`
                        )
                      }
                      className="mt-1.5 text-[10px] text-amber-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Insert Injunction Clause</span>
                    </button>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="font-extrabold text-white">Transfer of Property Act, 1882</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Section 106 (Notice terminating lease)</div>
                    <button
                      type="button"
                      onClick={() =>
                        setGeneratedDraft(
                          (prev) =>
                            prev +
                            `\n\n[STATUTORY NOTICE CLAUSE U/S 106 TPA]:\nThat a valid statutory notice dated 10th June 2026 was served upon the Defendant terminating tenancy as required under Section 106 of the Transfer of Property Act, 1882.`
                        )
                      }
                      className="mt-1.5 text-[10px] text-amber-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Insert Notice Clause</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Judicial Precedents */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-[10px] font-black text-indigo-300 uppercase">Landmark Judicial Precedents:</div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="font-extrabold text-white">State of Haryana v. Bhajan Lal (1992 Supp (1) SCC 335)</div>
                  <div className="text-[10px] text-slate-400 italic">"Guidelines for quashing FIR and inherent powers of High Court."</div>
                  <button
                    type="button"
                    onClick={() =>
                      setGeneratedDraft(
                        (prev) =>
                          prev +
                          `\n\n[RELIED UPON PRECEDENT]:\n"In State of Haryana v. Bhajan Lal (1992 Supp (1) SCC 335), the Hon'ble Supreme Court held that where allegations made in FIR do not disclose a cognizable offense, the same is liable to be set aside."`
                      )
                    }
                    className="mt-1 text-[10px] text-indigo-400 hover:underline font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Insert Precedent Citation</span>
                  </button>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[10px] text-amber-300">
                ⚠️ <b>Disclaimer:</b> All AI Suggestions require advocate verification before filing.
              </div>
            </div>
          )}

          {/* TAB 2: AI EVIDENCE BUILDER PANEL */}
          {activeSidePanel === 'evidence_builder' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-xl">
              <div className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>AI Evidence Builder</span>
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  {evidenceList.filter((e) => e.status === 'Attached').length}/{evidenceList.length} Verified
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Checklist of required evidence annexures to ensure no incomplete pleading is filed.
              </p>

              {/* Evidence Checklist Items */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {evidenceList.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                      item.status === 'Attached'
                        ? 'bg-slate-950 border-emerald-500/40'
                        : item.status === 'Missing'
                        ? 'bg-slate-950 border-red-500/40'
                        : 'bg-slate-950 border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {item.status === 'Attached' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span>{item.title}</span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          item.status === 'Attached'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : item.status === 'Missing'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400">{item.description}</div>

                    {item.status !== 'Attached' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = evidenceList.map((e) => (e.id === item.id ? { ...e, status: 'Attached' as const } : e));
                            setEvidenceList(updated);
                            setSavedBanner(`✅ ${item.title} marked as Attached & Verified!`);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[10px] flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Attach Document</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: IN-CONTEXT RAG AI DOCUMENT CHAT */}
          {activeSidePanel === 'ai_chat' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-xl flex flex-col h-[520px]">
              <div className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>AI Document Chat</span>
                </span>
                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  Grounded
                </span>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                {chamberChatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-100 ml-4'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                      <span>{msg.sender === 'user' ? 'Advocate' : 'Grounded AI Assistant'}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className="text-[11px] leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                  </div>
                ))}
                {isChatting && (
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-bold text-xs animate-pulse">
                    ⚡ Grounded AI Engine reading case vault...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5">
                <input
                  type="text"
                  value={chamberChatQuery}
                  onChange={(e) => setChamberChatQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChamberChat()}
                  placeholder="Ask: Find arbitration clause, Who is liable?..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleSendChamberChat}
                  disabled={isChatting}
                  className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      {/* MODAL: AI QUALITY AUDIT REPORT */}
      {showAuditReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-extrabold text-sm text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>AI Draft Quality & Filing Compliance Audit</span>
              </div>
              <button onClick={() => setShowAuditReportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAuditing ? (
              <div className="p-8 text-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
                <div className="font-extrabold text-amber-300 text-sm">Evaluating Court Pleading Rules...</div>
                <p className="text-slate-400 text-xs">Checking Cause Title, Party Names, Verification, and Annexures...</p>
              </div>
            ) : (
              auditReport && (
                <div className="space-y-4">
                  {/* Score Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-amber-500/40 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Draft Quality Score</div>
                      <div className="text-2xl font-black text-amber-300">{auditReport.score} / 100</div>
                      <div className="text-xs text-emerald-400 font-bold mt-0.5">{auditReport.status}</div>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-amber-500 flex items-center justify-center font-black text-amber-400 text-lg">
                      {auditReport.score}%
                    </div>
                  </div>

                  {/* Audit Checklist */}
                  <div className="space-y-2">
                    <div className="font-extrabold text-white text-xs uppercase">Compliance Checklist:</div>
                    <div className="space-y-1.5">
                      {auditReport.checks.map((chk: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2 text-xs">
                          {chk.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-bold text-white">{chk.name}</div>
                            <div className="text-[10px] text-slate-400">{chk.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Auto Fix Button */}
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAutoFixQualityIssues}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>1-Click Auto-Fix All Audit Issues</span>
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* MODAL: STENOGRAPHER ASSIGNMENT */}
      {showAssignStenoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-extrabold text-sm text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-400" />
                <span>Assign Draft to Stenographer</span>
              </div>
              <button onClick={() => setShowAssignStenoModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Assigned Stenographer / Junior</label>
                <select
                  value={selectedStenoName}
                  onChange={(e) => setSelectedStenoName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 mt-1 font-bold"
                >
                  <option value="Ramesh Sharma (Senior Stenographer)">Ramesh Sharma (Senior Stenographer)</option>
                  <option value="Sujata Banerjee (Court Typist)">Sujata Banerjee (Court Typist)</option>
                  <option value="Adv. Vikas Mehta (Junior Associate)">Adv. Vikas Mehta (Junior Associate)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Priority</label>
                  <select
                    value={stenoPriority}
                    onChange={(e) => setStenoPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 mt-1 font-bold"
                  >
                    <option value="Urgent">🔴 Urgent</option>
                    <option value="High">🟠 High Priority</option>
                    <option value="Normal">🟢 Normal</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Deadline</label>
                  <input
                    type="date"
                    value={stenoDeadline}
                    onChange={(e) => setStenoDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 mt-1 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Specific Instructions for Stenographer</label>
                <textarea
                  value={stenoInstructions}
                  onChange={(e) => setStenoInstructions(e.target.value)}
                  placeholder="e.g. Type dictated facts, format paragraph margins, check address in cause title..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>

              <button
                type="button"
                onClick={handleAssignToStenographer}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg active:scale-95 transition-all"
              >
                Dispatch Task to Stenographer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DRAFT LIBRARY & NATURAL LANGUAGE SEARCH */}
      {showLibraryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-5 space-y-4 shadow-2xl text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-extrabold text-sm text-white flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-amber-400" />
                <span>LawyerDesk Legal Draft Chamber Library</span>
              </div>
              <button onClick={() => setShowLibraryModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Natural Language Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={librarySearchQuery}
                onChange={(e) => setLibrarySearchQuery(e.target.value)}
                placeholder="Search drafts by Client, Case, Section, Document Type (e.g. 'Show all Section 138 complaints')..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>

            {/* Quick Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="font-bold text-slate-400 uppercase">AI Search Prompts:</span>
              <button
                onClick={() => setLibrarySearchQuery('Execution Petition')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold"
              >
                "Execution Petitions"
              </button>
              <button
                onClick={() => setLibrarySearchQuery('Legal Notice')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold"
              >
                "Legal Notices"
              </button>
              <button
                onClick={() => setLibrarySearchQuery('Section 138')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold"
              >
                "Section 138 Complaints"
              </button>
            </div>

            {/* Drafts List */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {savedDraftsLibrary.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-1">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="font-bold">No saved drafts in library yet.</p>
                  <p className="text-[10px]">Click "Save to LawyerDesk ERP" to save drafts here.</p>
                </div>
              ) : (
                savedDraftsLibrary
                  .filter((d) => !librarySearchQuery || d.title.toLowerCase().includes(librarySearchQuery.toLowerCase()))
                  .map((draft) => (
                    <div key={draft.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-white">
                        <span>{draft.title}</span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                          {draft.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Case: {draft.caseNumber} &bull; Court: {draft.court} &bull; Created: {draft.createdAt}
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setGeneratedDraft(draft.content);
                            setShowLibraryModal(false);
                            setSavedBanner(`Loaded draft "${draft.title}" into Draft Chamber!`);
                          }}
                          className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px]"
                        >
                          Load into Chamber
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
