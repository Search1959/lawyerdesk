import React, { useState, useEffect } from 'react';
import {
  Scale,
  Plus,
  Search,
  Filter,
  FileText,
  Clock,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Users2,
  CalendarDays,
  X,
  FileSearch,
  BookOpen,
  Upload,
  BookMarked,
  Hammer,
  Receipt,
  Edit3,
  ArrowLeft,
  Bot,
  Download,
  FolderOpen,
  CheckCircle2,
  FileCode2,
  Brain,
  Zap,
} from 'lucide-react';
import { Matter, Document, Hearing, CourtOrder, TimelineEvent, Witness, Task, CourtType, Client, LawFirm } from '../types';
import { PaginationControls } from './PaginationControls';
import { InvoiceEditModal } from './InvoiceEditModal';

interface MattersViewProps {
  matters: Matter[];
  documents: Document[];
  hearings: Hearing[];
  courtOrders: CourtOrder[];
  timeline: TimelineEvent[];
  witnesses: Witness[];
  tasks: Task[];
  clients?: Client[];
  currentFirm?: LawFirm;
  onSelectMatter: (matter: Matter) => void;
  onOpenNewMatter: () => void;
  onUploadDocToMatter: (matterId: string) => void;
  onOpenDraftingForMatter: (matter: Matter) => void;
  onOpenAIChatForMatter: (matter: Matter) => void;
  onOpenCaseBrain?: (matter: Matter) => void;
  onOpenHearingPrep?: (matter: Matter) => void;
  onAddNewInvoice?: (inv: any) => void;
}

export const MattersView: React.FC<MattersViewProps> = ({
  matters: initialMatters,
  documents: initialDocuments,
  hearings: initialHearings,
  courtOrders,
  timeline: initialTimeline,
  witnesses,
  tasks,
  clients,
  currentFirm,
  onSelectMatter,
  onOpenNewMatter,
  onUploadDocToMatter,
  onOpenDraftingForMatter,
  onOpenAIChatForMatter,
  onOpenCaseBrain,
  onOpenHearingPrep,
  onAddNewInvoice,
}) => {
  const [mattersList, setMattersList] = useState<Matter[]>(initialMatters);
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(initialMatters[0] || null);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'timeline' | 'docs' | 'witnesses' | 'orders' | 'strategy' | 'sync_log'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // eCourt Sync Log State
  const [caseSyncLogs, setCaseSyncLogs] = useState<any[]>([]);
  const [isSyncingCurrentCase, setIsSyncingCurrentCase] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const fetchSyncLogsForSelected = async (matterId: string) => {
    try {
      const res = await fetch(`/api/ecourt/sync-log/${matterId}`);
      if (res.ok) {
        const data = await res.json();
        setCaseSyncLogs(data);
      }
    } catch (err) {
      console.warn('Error fetching sync logs:', err);
    }
  };

  useEffect(() => {
    if (selectedMatter && activeSubTab === 'sync_log') {
      fetchSyncLogsForSelected(selectedMatter.id);
    }
  }, [selectedMatter, activeSubTab]);

  const handleSyncCurrentCase = async () => {
    if (!selectedMatter) return;
    setIsSyncingCurrentCase(true);
    setSyncStatusMsg(null);
    try {
      const res = await fetch(`/api/ecourt/sync/${selectedMatter.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSyncStatusMsg(data.message || 'Synced successfully with eCourts!');
        fetchSyncLogsForSelected(selectedMatter.id);
      } else {
        setSyncStatusMsg(`⚠️ ${data.message || 'Sync failed.'}`);
      }
    } catch (err) {
      setSyncStatusMsg('❌ Error connecting to eCourts server.');
    } finally {
      setIsSyncingCurrentCase(false);
    }
  };

  // Local state for interactive case details
  const [localHearings, setLocalHearings] = useState<Hearing[]>(initialHearings);
  const [localTimeline, setLocalTimeline] = useState<TimelineEvent[]>(initialTimeline);
  const [localDocs, setLocalDocs] = useState<Document[]>(initialDocuments);

  // Modals for case detail actions
  const [showAddDiaryModal, setShowAddDiaryModal] = useState(false);
  const [showAddHearingModal, setShowAddHearingModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteMatter = () => {
    if (!selectedMatter) return;
    const updated = mattersList.filter(m => m.id !== selectedMatter.id);
    setMattersList(updated);
    setSelectedMatter(updated[0] || null);
    setShowDeleteModal(false);
  };

  // Form states
  const [diaryNoteInput, setDiaryNoteInput] = useState('');
  const [newHearingDate, setNewHearingDate] = useState('2026-08-20');
  const [newHearingPurpose, setNewHearingPurpose] = useState('Arguments on Application');
  const [invoiceAmount, setInvoiceAmount] = useState('15000');
  const [editTitle, setEditTitle] = useState('');
  const [editCourt, setEditCourt] = useState('');
  const [editJudge, setEditJudge] = useState('');

  // Pagination State for Matters List
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const filteredMatters = mattersList.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredMatters.length / pageSize) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const paginatedMatters = filteredMatters.slice((activePage - 1) * pageSize, activePage * pageSize);

  const matterDocs = selectedMatter ? localDocs.filter((d) => d.matterId === selectedMatter.id) : [];
  const matterHearings = selectedMatter ? localHearings.filter((h) => h.matterId === selectedMatter.id) : [];
  const matterOrders = selectedMatter ? courtOrders.filter((o) => o.matterId === selectedMatter.id) : [];
  const matterTL = selectedMatter ? localTimeline.filter((t) => t.matterId === selectedMatter.id) : [];
  const matterWit = selectedMatter ? witnesses.filter((w) => w.matterId === selectedMatter.id) : [];

  // Stage mapping for the 6-stage progression stepper
  const stages = [
    { id: 1, name: 'Filed', match: ['Intake', 'Filed', 'Notice Stage'] },
    { id: 2, name: 'Notice', match: ['Notice', 'Pleadings'] },
    { id: 3, name: 'Evidence', match: ['Evidence', 'Cross-Exam'] },
    { id: 4, name: 'Arguments', match: ['Active Litigation', 'Arguments'] },
    { id: 5, name: 'Judgment', match: ['Pending Order', 'Judgment'] },
    { id: 6, name: 'Closed', match: ['Decreed', 'Closed', 'Settled'] },
  ];

  const getCurrentStageNumber = (status: string) => {
    if (status === 'Decreed' || status === 'Closed' || status === 'Settled') return 6;
    if (status === 'Pending Order' || status === 'Judgment') return 5;
    if (status === 'Active Litigation' || status === 'Arguments') return 4;
    if (status === 'Evidence' || status === 'Evidence & Cross-Exam') return 3;
    if (status === 'Notice Stage' || status === 'Notice') return 2;
    return 1;
  };

  const handleSetStage = (stageNum: number) => {
    if (!selectedMatter) return;
    let newStatus: Matter['status'] = 'Notice Stage';
    if (stageNum === 1) newStatus = 'Notice Stage';
    if (stageNum === 2) newStatus = 'Notice Stage';
    if (stageNum === 3) newStatus = 'Active Litigation';
    if (stageNum === 4) newStatus = 'Active Litigation';
    if (stageNum === 5) newStatus = 'Pending Order';
    if (stageNum === 6) newStatus = 'Decreed';

    const updated: Matter = { ...selectedMatter, status: newStatus };
    setSelectedMatter(updated);
    setMattersList(prev => prev.map(m => m.id === selectedMatter.id ? updated : m));
  };

  const handleAddDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatter || !diaryNoteInput.trim()) return;

    const newEvent: TimelineEvent = {
      id: `tl-${Date.now()}`,
      matterId: selectedMatter.id,
      date: new Date().toISOString().split('T')[0],
      title: 'Court Diary Note',
      description: diaryNoteInput,
      type: 'Court Order',
      docCitation: 'Daily Proceedings Log',
    };

    setLocalTimeline([newEvent, ...localTimeline]);
    setDiaryNoteInput('');
    setShowAddDiaryModal(false);
  };

  const handleAddHearing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatter) return;

    const newHrg: Hearing = {
      id: `hrg-${Date.now()}`,
      matterId: selectedMatter.id,
      date: newHearingDate,
      time: '10:30 AM',
      courtName: selectedMatter.court,
      courtHallNo: selectedMatter.courtRoomNo || 'Court Room 12',
      judgeName: selectedMatter.judgeName || 'Hon’ble Bench',
      stage: newHearingPurpose || 'Arguments & Further Orders',
      synopsis: 'Scheduled hearing in cause list.',
      assignedLawyerId: selectedMatter.leadLawyerId || 'usr-1',
      assignedLawyerName: selectedMatter.leadLawyerName,
    };

    setLocalHearings([newHrg, ...localHearings]);
    
    // Update next hearing date on selected matter
    const updated: Matter = { ...selectedMatter, nextHearingDate: newHearingDate };
    setSelectedMatter(updated);
    setMattersList(prev => prev.map(m => m.id === selectedMatter.id ? updated : m));

    setShowAddHearingModal(false);
  };

  const handleEditCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatter) return;

    const updated: Matter = {
      ...selectedMatter,
      title: editTitle || selectedMatter.title,
      court: (editCourt as CourtType) || selectedMatter.court,
      judgeName: editJudge || selectedMatter.judgeName,
    };

    setSelectedMatter(updated);
    setMattersList(prev => prev.map(m => m.id === selectedMatter.id ? updated : m));
    setShowEditModal(false);
  };

  const handleExportMattersCSV = () => {
    if (!mattersList || mattersList.length === 0) return;

    const headers = [
      'Case Number',
      'Title',
      'Court',
      'Category',
      'Status',
      'Client Name',
      'Lead Lawyer',
      'CNR Number',
      'Created Date',
      'Next Hearing Date',
      'Opposing Party',
      'Opposing Advocate',
      'Judge Name',
      'Court Room No',
    ];

    const rows = mattersList.map((m) => [
      `"${(m.caseNumber || '').replace(/"/g, '""')}"`,
      `"${(m.title || '').replace(/"/g, '""')}"`,
      `"${(m.court || '').replace(/"/g, '""')}"`,
      `"${(m.category || 'Civil').replace(/"/g, '""')}"`,
      `"${(m.status || 'Active Litigation').replace(/"/g, '""')}"`,
      `"${(m.clientName || '').replace(/"/g, '""')}"`,
      `"${(m.leadLawyerName || '').replace(/"/g, '""')}"`,
      `"${m.cnrNumber || m.cnr || ''}"`,
      `"${m.createdAt || ''}"`,
      `"${m.nextHearingDate || ''}"`,
      `"${(m.opposingParty || '').replace(/"/g, '""')}"`,
      `"${(m.opposingAdvocate || '').replace(/"/g, '""')}"`,
      `"${(m.judgeName || '').replace(/"/g, '""')}"`,
      `"${(m.courtRoomNo || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `LawyerDesk_Case_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportMattersFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        let imported: Matter[] = [];
        if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
          const parsed = JSON.parse(text);
          imported = Array.isArray(parsed) ? parsed : [parsed];
        } else {
          const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
          if (lines.length >= 2) {
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map((c) => c.replace(/^"|"$/g, '').trim());
              if (cols.length >= 2) {
                const item: Matter = {
                  id: `mtr-imp-${Date.now()}-${i}`,
                  firmId: currentFirm?.id || 'firm-1',
                  branchId: 'branch-main',
                  clientId: clients?.[0]?.id || 'client-1',
                  caseNumber: cols[0] || `${Math.floor(10 + Math.random() * 90)}/${2026}`,
                  title: cols[1] || 'Imported Matter',
                  court: (cols[2] as CourtType) || 'Delhi High Court',
                  category: (cols[3] as any) || 'Civil',
                  status: (cols[4] as any) || 'Notice Stage',
                  clientName: cols[5] || 'Client Entity',
                  leadLawyerId: 'usr-1',
                  leadLawyerName: cols[6] || 'Adv. Advocate',
                  cnrNumber: cols[7] || '',
                  cnr: cols[7] || '',
                  createdAt: cols[8] || new Date().toISOString().split('T')[0],
                  nextHearingDate: cols[9] || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                  opposingParty: cols[10] || 'Opposing Party Ltd',
                  opposingAdvocate: cols[11] || 'Senior Advocate',
                  judgeName: cols[12] || 'Hon’ble Bench',
                  courtRoomNo: cols[13] || 'Court Hall 5',
                  actsAndSections: ['IPC Sec 420'],
                  riskScore: 25,
                  riskLevel: 'Low',
                  aiSummary: 'Case imported via CSV batch upload.',
                  aiMissingDocuments: [],
                  aiStrategyNotes: [],
                  aiContradictions: [],
                  hearingsCount: 1,
                  documentsCount: 0,
                };
                imported.push(item);
              }
            }
          }
        }

        if (imported.length > 0) {
          setMattersList((prev) => [...imported, ...prev]);
          if (!selectedMatter) {
            setSelectedMatter(imported[0]);
          }
          alert(`Successfully imported ${imported.length} case matter(s) into Case Directory!`);
        } else {
          alert('No valid case rows found in the uploaded file.');
        }
      } catch (err) {
        console.error('Import error:', err);
        alert('Failed to parse uploaded file. Please ensure it is a valid CSV or JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Litigation & Case Directory</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Indian Law Firm Workspace • Grounded Case Intelligence & OCR Integration
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <input
            type="file"
            id="import-matters-file-header"
            accept=".csv,.json"
            className="hidden"
            onChange={handleImportMattersFile}
          />

          <label
            htmlFor="import-matters-file-header"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs"
            title="Import Cases from CSV or Excel file"
          >
            <Upload className="w-4 h-4 text-emerald-500" />
            <span>Import CSV/Excel</span>
          </label>

          <button
            onClick={handleExportMattersCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-xs"
            title="Export Litigation Directory to CSV/Excel"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>Export CSV/Excel</span>
          </button>

          <button
            onClick={onOpenNewMatter}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Matter Intake</span>
          </button>
        </div>
      </div>

      {/* Warning Banner for Cases Missing CNR */}
      {mattersList.filter((m) => !m.cnrNumber && !m.cnr).length > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>{mattersList.filter((m) => !m.cnrNumber && !m.cnr).length} case(s) missing CNR Number.</strong> eCourt auto-sync & WhatsApp date change alerts require CNR number.
            </span>
          </div>
          <button
            onClick={() => {
              if (selectedMatter) {
                setShowEditModal(true);
              }
            }}
            className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-sm"
          >
            Add CNR Numbers
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter by case number, title, or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {['All', 'Civil', 'Criminal', 'Company & Insolvency', 'GST & Indirect Tax'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Split Grid View: Left List, Right Selected Matter Detailed Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Matter List (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-3">
          {paginatedMatters.map((m) => {
            const isSelected = selectedMatter?.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMatter(m);
                  setEditTitle(m.title);
                  setEditCourt(m.court);
                  setEditJudge(m.judgeName || '');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/50 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/40 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800/60">
                    {m.caseNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      m.riskLevel === 'High'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    Risk: {m.riskScore}%
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-2">{m.title}</h3>

                <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                  <div><strong>Court:</strong> {m.court}</div>
                  <div><strong>Client:</strong> {m.clientName}</div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 font-mono">
                  <span>Docs: {m.documentsCount}</span>
                  <span>Next Hearing: {m.nextHearingDate}</span>
                </div>
              </div>
            );
          })}

          <PaginationControls
            currentPage={activePage}
            totalPages={totalPages}
            totalItems={filteredMatters.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
            onPageSizeChange={(s) => setPageSize(s)}
            pageSizeOptions={[5, 10, 20]}
            itemName="cases"
          />
        </div>

        {/* Right Side: Selected Matter Workspace with SUB-MENU & STEPPER */}
        {selectedMatter ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Top Case Detail Bar with Submenu Action Buttons */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white font-mono leading-none">
                      {selectedMatter.caseNumber}
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {selectedMatter.title}
                    </p>
                  </div>
                </div>

                {/* SubMenu Buttons Bar matching screenshot style */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {onOpenCaseBrain && (
                    <button
                      onClick={() => onOpenCaseBrain(selectedMatter)}
                      className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all ring-2 ring-indigo-500/20"
                    >
                      <Brain className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>AI Case Brain</span>
                    </button>
                  )}

                  {onOpenHearingPrep && (
                    <button
                      onClick={() => onOpenHearingPrep(selectedMatter)}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Prepare Hearing</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowAddDiaryModal(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>Add Diary</span>
                  </button>

                  <button
                    onClick={() => setShowAddHearingModal(true)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Hammer className="w-3.5 h-3.5" />
                    <span>Add Hearing</span>
                  </button>

                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditTitle(selectedMatter.title);
                      setEditCourt(selectedMatter.court);
                      setEditJudge(selectedMatter.judgeName || '');
                      setShowEditModal(true);
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <button
                    onClick={() => setSelectedMatter(null)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={() => onOpenAIChatForMatter(selectedMatter)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Bot className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>

              {/* 6-Stage Progression Stepper (1. Filed -> 2. Notice -> 3. Evidence -> 4. Arguments -> 5. Judgment -> 6. Closed) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
                  {/* Connecting Line behind circles */}
                  <div className="absolute left-8 right-8 top-4 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />

                  {stages.map((stg) => {
                    const currentStageNum = getCurrentStageNumber(selectedMatter.status);
                    const isActive = currentStageNum === stg.id;
                    const isCompleted = currentStageNum > stg.id;

                    return (
                      <div
                        key={stg.id}
                        onClick={() => handleSetStage(stg.id)}
                        className="flex flex-col items-center gap-1.5 cursor-pointer group z-10"
                      >
                        <div
                          className={`w-8 h-8 rounded-full font-extrabold text-xs flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950 scale-110 shadow-md'
                              : isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700 group-hover:border-indigo-400'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stg.id}
                        </div>
                        <span
                          className={`text-[11px] font-bold tracking-tight ${
                            isActive
                              ? 'text-indigo-600 dark:text-indigo-400 font-black'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {stg.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Structured Sub-Cards Grid (Case Details, Hearings, Documents) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Card 1: Case Details */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                  Case Details
                </h3>

                <div className="text-xs space-y-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Title</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-bold leading-snug">
                      {selectedMatter.title}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Type</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedMatter.category}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Court</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedMatter.court}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Judge / Bench</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedMatter.judgeName || 'Hon’ble Bench'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Client</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedMatter.clientName}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Hearings */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Hammer className="w-4 h-4 text-amber-500" />
                      <span>Hearings</span>
                    </h3>
                    <button
                      onClick={() => setShowAddHearingModal(true)}
                      className="px-2.5 py-0.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-all"
                    >
                      + Add
                    </button>
                  </div>

                  {matterHearings.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                      No hearings scheduled
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {matterHearings.map((h) => (
                        <div key={h.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs">
                          <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                            <span className="text-indigo-600 dark:text-indigo-400 font-mono">📅 {h.date} ({h.time})</span>
                            <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded">
                              {h.stage}
                            </span>
                          </div>
                          <div className="text-slate-600 dark:text-slate-300 font-medium mt-1">{h.synopsis}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card 3: Documents */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-cyan-500" />
                      <span>Documents</span>
                    </h3>
                    <button
                      onClick={() => onUploadDocToMatter(selectedMatter.id)}
                      className="px-2.5 py-0.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload</span>
                    </button>
                  </div>

                  {matterDocs.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                      No documents uploaded yet
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {matterDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs flex items-center justify-between gap-2"
                        >
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{doc.fileName}</span>
                          <button
                            onClick={() => alert(`Downloading document: ${doc.fileName}`)}
                            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 p-1 shrink-0"
                            title="Download document"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Deep Workspace Tabs (Overview, Timeline, Docs, Witnesses, Orders, AI Strategy) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Sub Tabs Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
                {[
                  { id: 'overview', label: 'Overview & Summary' },
                  { id: 'timeline', label: `Case Diary & Notes (${matterTL.length})` },
                  { id: 'docs', label: `Document Vault (${matterDocs.length})` },
                  { id: 'witnesses', label: `Witnesses (${matterWit.length})` },
                  { id: 'orders', label: `Court Orders (${matterOrders.length})` },
                  { id: 'strategy', label: 'AI Strategy & Contradictions' },
                  { id: 'sync_log', label: 'eCourts Sync Log' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id as any)}
                    className={`px-3 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                      activeSubTab === tab.id
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sub Tab Content */}
              {activeSubTab === 'overview' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">AI Case Summary</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{selectedMatter.aiSummary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Acts & Sections Invoked</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMatter.actsAndSections.map((sec, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                            {sec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Parties & Advocates</h4>
                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <div><strong>Client:</strong> {selectedMatter.clientName}</div>
                        <div><strong>Opposing Party:</strong> {selectedMatter.opposingParty}</div>
                        <div><strong>Opposing Counsel:</strong> {selectedMatter.opposingAdvocate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSubTab === 'timeline' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Case Diary & Daily Proceedings</h4>
                    <button
                      onClick={() => setShowAddDiaryModal(true)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Diary Entry</span>
                    </button>
                  </div>

                  {matterTL.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4">No proceedings or notes logged in case diary yet.</p>
                  ) : (
                    matterTL.map((tl) => (
                      <div key={tl.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-start gap-3">
                        <div className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold whitespace-nowrap">
                          {tl.date}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 dark:text-white">{tl.title}</div>
                          <div className="text-slate-600 dark:text-slate-300 mt-0.5">{tl.description}</div>
                          {tl.docCitation && (
                            <div className="mt-1 text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                              Citation: {tl.docCitation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeSubTab === 'docs' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Document Vault ({matterDocs.length})</h4>
                    <button
                      onClick={() => onUploadDocToMatter(selectedMatter.id)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload & OCR</span>
                    </button>
                  </div>

                  {matterDocs.map((doc) => (
                    <div key={doc.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{doc.fileName}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          OCR Confidence {doc.metadata.confidenceScore}%
                        </span>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 text-[11px] bg-slate-50 dark:bg-slate-950 p-2 rounded line-clamp-3 font-mono">
                        {doc.ocrText}
                      </p>

                      <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
                        <span>Engine: {doc.metadata.ocrEngineUsed}</span>
                        <span>•</span>
                        <span>Extracted Acts: {doc.metadata.extractedActs.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSubTab === 'witnesses' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Witness Directory & Cross-Examination</h4>
                  {matterWit.length === 0 ? (
                    <p className="text-xs text-slate-500">No witnesses recorded for this matter.</p>
                  ) : (
                    matterWit.map((w) => (
                      <div key={w.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                          <span>{w.name}</span>
                          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px]">{w.role}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{w.statementSummary}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeSubTab === 'orders' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Court Orders & Judgments</h4>
                  {matterOrders.map((ord) => (
                    <div key={ord.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-2">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>{ord.type} ({ord.orderDate})</span>
                        <span className="text-indigo-600">{ord.judgeName}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{ord.summary}</p>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 text-[11px] text-slate-600 dark:text-slate-400">
                        <strong>Key Directives:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                          {ord.keyDirectives.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSubTab === 'strategy' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60">
                    <h4 className="font-bold text-rose-800 dark:text-rose-300 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Contradictions & Discrepancies</span>
                    </h4>
                    {selectedMatter.aiContradictions.map((c, idx) => (
                      <div key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        • {c}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60">
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>AI Strategic Counsel Notes</span>
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      {selectedMatter.aiStrategyNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeSubTab === 'sync_log' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        CNR Number: <span className="font-mono text-indigo-600 dark:text-indigo-400">{selectedMatter.cnrNumber || selectedMatter.cnr || 'Not Added'}</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Last synced at: {selectedMatter.courtSyncAt || 'Never'} • Status: {selectedMatter.courtSyncStatus || 'Pending'}
                      </p>
                    </div>
                    <button
                      onClick={handleSyncCurrentCase}
                      disabled={isSyncingCurrentCase}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      <Clock className={`w-3.5 h-3.5 ${isSyncingCurrentCase ? 'animate-spin' : ''}`} />
                      <span>{isSyncingCurrentCase ? 'Syncing...' : 'Sync with eCourts'}</span>
                    </button>
                  </div>

                  {syncStatusMsg && (
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
                      {syncStatusMsg}
                    </div>
                  )}

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Date & Time</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Hearing Date Found</th>
                          <th className="p-3">Court / Bench</th>
                          <th className="p-3">Item No</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                        {caseSyncLogs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-slate-400">
                              No eCourts sync history recorded yet for this case. Click "Sync with eCourts" to perform live check.
                            </td>
                          </tr>
                        ) : (
                          caseSyncLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">{log.syncedAt}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${log.status === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
                                  {log.status === 'success' ? '✅ Synced' : log.status}
                                </span>
                              </td>
                              <td className="p-3 font-bold text-slate-900 dark:text-white">{log.nextHearing || 'N/A'}</td>
                              <td className="p-3 text-slate-600 dark:text-slate-300">{log.caseStage || log.courtName || '-'}</td>
                              <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">{log.itemNumber || '-'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Modal 1: Add Diary */}
      {showAddDiaryModal && selectedMatter && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-emerald-600" />
                <span>Add Court Diary Entry</span>
              </h3>
              <button onClick={() => setShowAddDiaryModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddDiary} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Proceeding Summary / Notes</label>
                <textarea
                  required
                  rows={4}
                  value={diaryNoteInput}
                  onChange={(e) => setDiaryNoteInput(e.target.value)}
                  placeholder="e.g. Defendant filed written statement. Court directed plaintiff to file replication within 14 days..."
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddDiaryModal(false)} className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs">Save Diary Note</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Hearing */}
      {showAddHearingModal && selectedMatter && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Hammer className="w-4 h-4 text-amber-500" />
                <span>Schedule Court Hearing</span>
              </h3>
              <button onClick={() => setShowAddHearingModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddHearing} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Hearing Date</label>
                <input
                  type="date"
                  required
                  value={newHearingDate}
                  onChange={(e) => setNewHearingDate(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Purpose / Stage</label>
                <input
                  type="text"
                  required
                  value={newHearingPurpose}
                  onChange={(e) => setNewHearingPurpose(e.target.value)}
                  placeholder="e.g. Cross-examination of PW-1..."
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddHearingModal(false)} className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-xl shadow-xs">Schedule Hearing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Professional GST Invoice Form */}
      {showInvoiceModal && selectedMatter && (
        <InvoiceEditModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          initialMatterId={selectedMatter.id}
          initialClientId={selectedMatter.clientId}
          clients={
            clients && clients.length > 0
              ? clients
              : ([{ id: selectedMatter.clientId || 'client-1', name: selectedMatter.clientName || 'Client Entity' }] as any)
          }
          matters={initialMatters}
          firm={currentFirm}
          onSave={async (invData) => {
            if (onAddNewInvoice) {
              await onAddNewInvoice(invData);
            }
            setShowInvoiceModal(false);
          }}
        />
      )}

      {/* Modal 4: Edit Case */}
      {showEditModal && selectedMatter && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>Edit Case Details</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleEditCaseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Case Title / Parties</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Court Name</label>
                <input
                  type="text"
                  required
                  value={editCourt}
                  onChange={(e) => setEditCourt(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Judge / Bench Name</label>
                <input
                  type="text"
                  value={editJudge}
                  onChange={(e) => setEditJudge(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMatter && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-center text-slate-900 dark:text-white">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <X className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Delete Case Record</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to delete <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedMatter.caseNumber}</strong>? This action will remove all case diary entries and associated timelines.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMatter}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Yes, Delete Matter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

