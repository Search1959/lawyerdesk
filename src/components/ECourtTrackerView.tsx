import React, { useState, useEffect } from 'react';
import {
  Scale,
  Gavel,
  Calendar,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Search,
  Clock,
  MessageSquare,
  Copy,
  Check,
  Edit3,
  X,
  ChevronRight,
  Sparkles,
  Building2,
  User,
  ShieldCheck,
  CalendarDays,
  FileText,
  Send,
  AlertCircle,
  ExternalLink,
  Database,
  Info,
} from 'lucide-react';
import { Matter, ECourtSyncLog } from '../types';

interface ECourtTrackerViewProps {
  matters?: Matter[];
  onSelectMatter?: (matter: Matter) => void;
  onUpdateMatter?: (matter: Matter) => void;
}

export const ECourtTrackerView: React.FC<ECourtTrackerViewProps> = ({
  matters: propMatters,
  onSelectMatter,
  onUpdateMatter,
}) => {
  const todayDateStr = new Date().toISOString().split('T')[0];

  const [localMatters, setLocalMatters] = useState<Matter[]>(propMatters || []);
  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourt, setSelectedCourt] = useState<string>('ALL');

  // Syncing states
  const [syncingCaseId, setSyncingCaseId] = useState<string | null>(null);
  const [isBulkSyncing, setIsBulkSyncing] = useState<boolean>(false);
  const [bulkProgress, setBulkProgress] = useState<number>(0);
  const [bulkStatusText, setBulkStatusText] = useState<string>('');
  const [bulkSummaryModal, setBulkSummaryModal] = useState<{
    total: number;
    synced: number;
    changed: number;
    failed: number;
  } | null>(null);

  // Modals & Drawers
  const [syncLogCase, setSyncLogCase] = useState<Matter | null>(null);
  const [syncLogs, setSyncLogs] = useState<ECourtSyncLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);

  const [editCnrCase, setEditCnrCase] = useState<Matter | null>(null);
  const [cnrInput, setCnrInput] = useState<string>('');
  const [cnrError, setCnrError] = useState<string | null>(null);

  const [showMissingCnrModal, setShowMissingCnrModal] = useState<boolean>(false);
  const [copiedCnr, setCopiedCnr] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch matters if not provided or to keep synced
  const fetchMatters = async () => {
    try {
      const res = await fetch('/api/matters');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLocalMatters(data);
        }
      }
    } catch (err) {
      console.warn('Error loading matters for eCourt tracker:', err);
    }
  };

  useEffect(() => {
    if (propMatters && propMatters.length > 0) {
      setLocalMatters(propMatters);
    } else {
      fetchMatters();
    }
  }, [propMatters]);

  const activeMatters = localMatters.filter(
    (m) => m.status === 'Active Litigation' || m.status === 'Notice Stage' || m.status === 'Pending Order'
  );

  // Helper functions for CNR
  const sanitizeCNR = (cnr?: string): string => {
    if (!cnr) return '';
    return String(cnr).replace(/[\s\-\/]/g, '').toUpperCase();
  };

  const validateCNR = (cnr?: string): boolean => {
    const clean = sanitizeCNR(cnr);
    return /^[A-Z]{4}\d{10}$/.test(clean);
  };

  const casesWithCnr = activeMatters.filter((m) => validateCNR(m.cnrNumber || m.cnr));
  const casesMissingCnr = activeMatters.filter((m) => !validateCNR(m.cnrNumber || m.cnr));

  // Synced today count
  const syncedTodayCount = localMatters.filter(
    (m) => m.courtSyncAt && m.courtSyncAt.startsWith(todayDateStr)
  ).length;

  // Hearings on selected date
  const hearingsOnSelectedDate = localMatters.filter((m) => {
    if (m.nextHearingDate !== selectedDate) return false;
    if (selectedCourt !== 'ALL' && m.court !== selectedCourt) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = m.caseNumber.toLowerCase().includes(q);
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchCnr = (m.cnrNumber || m.cnr || '').toLowerCase().includes(q);
      const matchJudge = m.judgeName.toLowerCase().includes(q);
      const matchClient = m.clientName.toLowerCase().includes(q);
      return matchNumber || matchTitle || matchCnr || matchJudge || matchClient;
    }
    return true;
  });

  // Group cause list by Court Name
  const courtGroupedCauseList = hearingsOnSelectedDate.reduce((acc, caseItem) => {
    const courtName = caseItem.court || 'Other District / High Court';
    if (!acc[courtName]) acc[courtName] = [];
    acc[courtName].push(caseItem);
    return acc;
  }, {} as Record<string, Matter[]>);

  // Sort each group by Item Number
  Object.keys(courtGroupedCauseList).forEach((court) => {
    courtGroupedCauseList[court].sort((a, b) => {
      const itemA = parseInt((a.itemNumber || '').replace(/[^\d]/g, '') || '999', 10);
      const itemB = parseInt((b.itemNumber || '').replace(/[^\d]/g, '') || '999', 10);
      return itemA - itemB;
    });
  });

  // Handle single case sync
  const handleSyncCase = async (caseItem: Matter) => {
    const cnr = caseItem.cnrNumber || caseItem.cnr;
    if (!cnr || !validateCNR(cnr)) {
      setEditCnrCase(caseItem);
      setCnrInput(cnr || '');
      setCnrError('A valid 14-character CNR number is required to sync with eCourts India.');
      return;
    }

    setSyncingCaseId(caseItem.id);
    try {
      const res = await fetch(`/api/ecourt/sync/${caseItem.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        const updatedMatter = data.data;
        setLocalMatters((prev) =>
          prev.map((m) => (m.id === updatedMatter.id ? { ...m, ...updatedMatter } : m))
        );
        if (onUpdateMatter) onUpdateMatter(updatedMatter);

        setToastMessage(
          data.dateChanged
            ? `📅 Hearing date updated! WhatsApp alert sent to ${updatedMatter.leadLawyerName}.`
            : `✅ eCourt status confirmed for ${updatedMatter.caseNumber}`
        );
      } else {
        setToastMessage(`⚠️ ${data.message || 'eCourt server delay. Retrying...'}`);
      }
    } catch (err) {
      console.error('Error syncing case:', err);
      setToastMessage('❌ Failed to connect to eCourts server.');
    } finally {
      setSyncingCaseId(null);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Handle Bulk Sync All Cases
  const handleSyncAllCases = async () => {
    setIsBulkSyncing(true);
    setBulkProgress(15);
    setBulkStatusText(`Initializing eCourts API worker session for ${casesWithCnr.length} CNR cases...`);

    try {
      const interval = setInterval(() => {
        setBulkProgress((p) => (p >= 85 ? 85 : p + 15));
      }, 400);

      const res = await fetch('/api/ecourt/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firmId: 'firm-1' }),
      });

      clearInterval(interval);
      setBulkProgress(100);

      if (res.ok) {
        const result = await res.json();
        setBulkSummaryModal({
          total: result.total,
          synced: result.synced,
          changed: result.changed,
          failed: result.failed,
        });
        await fetchMatters();
      } else {
        setToastMessage('⚠️ Bulk sync failed to complete. Please try again.');
      }
    } catch (err) {
      console.error('Bulk sync error:', err);
      setToastMessage('❌ Server connection error during eCourts bulk sync.');
    } finally {
      setIsBulkSyncing(false);
      setBulkProgress(0);
      setBulkStatusText('');
    }
  };

  // Fetch logs for Case Sync History modal
  const handleOpenSyncLog = async (m: Matter) => {
    setSyncLogCase(m);
    setIsLoadingLogs(true);
    try {
      const res = await fetch(`/api/ecourt/sync-log/${m.id}`);
      if (res.ok) {
        const data = await res.json();
        setSyncLogs(data);
      }
    } catch (err) {
      console.warn('Error fetching sync logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Save CNR edit
  const handleSaveCnr = async () => {
    if (!editCnrCase) return;
    const clean = sanitizeCNR(cnrInput);

    if (!clean) {
      setCnrError('CNR number cannot be empty.');
      return;
    }
    if (!validateCNR(clean)) {
      setCnrError('Invalid CNR format. Must be 4 uppercase letters followed by 10 digits (e.g. WBCA010001232024).');
      return;
    }

    try {
      const res = await fetch(`/api/matters/${editCnrCase.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnrNumber: clean }),
      });

      if (res.ok) {
        const updated = await res.json();
        setLocalMatters((prev) =>
          prev.map((m) => (m.id === updated.id ? { ...m, cnrNumber: clean, cnr: clean, courtSyncStatus: 'Synced' } : m))
        );
        if (onUpdateMatter) onUpdateMatter({ ...editCnrCase, cnrNumber: clean, cnr: clean, courtSyncStatus: 'Synced' });

        setEditCnrCase(null);
        setCnrInput('');
        setCnrError(null);
        setToastMessage(`✅ CNR ${clean} saved for ${editCnrCase.caseNumber}!`);
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (err) {
      console.error('Error saving CNR:', err);
      setCnrError('Failed to save CNR to server.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCnr(text);
    setTimeout(() => setCopiedCnr(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-indigo-500/40 flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold tracking-wider uppercase border border-indigo-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Live eCourts India Gateway
              </span>
              <span className="text-xs text-slate-400">Synced via services.ecourts.gov.in</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Gavel className="w-7 h-7 text-indigo-400" />
              ECOURT / NJDG TRACKER
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Track case status across Indian courts — linked to eCourts portal. Auto-syncs at 7:00 AM & 2:00 PM IST with instant WhatsApp alert dispatching.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSyncAllCases}
              disabled={isBulkSyncing}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBulkSyncing ? 'animate-spin' : ''}`} />
              <span>{isBulkSyncing ? 'Syncing...' : 'Sync All'}</span>
            </button>

            <a
              href="https://services.ecourts.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open eCourts Portal</span>
            </a>
          </div>
        </div>

        {/* Bulk Sync Progress Bar */}
        {isBulkSyncing && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex justify-between text-xs text-indigo-200">
              <span className="font-semibold">{bulkStatusText}</span>
              <span className="font-mono font-bold">{bulkProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${bulkProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* How to Use Guidance Banner */}
      <div className="bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 rounded-2xl p-4 flex items-start gap-3 text-emerald-950 dark:text-emerald-100 text-xs font-medium leading-relaxed shadow-sm">
        <div className="p-1 rounded-full bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <strong className="font-bold text-emerald-900 dark:text-emerald-200">How to use: </strong>
          Link each case to its eCourts case number, then click <span className="font-bold border-b border-emerald-500/50">"Open on eCourts"</span> to check live status. After checking, update the next hearing date and stage here so the app tracks it. WhatsApp reminders will use the updated dates automatically.
        </div>
      </div>

      {/* Quick Access Portal Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="https://services.ecourts.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-1">
              <span>eCourts Portal</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">All India Courts</p>
          </div>
        </a>

        <a
          href="https://njdg.ecourts.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-md transition-all flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 flex items-center gap-1">
              <span>NJDG Dashboard</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">National Judicial Data</p>
          </div>
        </a>

        <a
          href="https://main.sci.gov.in/case-status"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-400 dark:hover:border-rose-600 hover:shadow-md transition-all flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 flex items-center gap-1">
              <span>Supreme Court</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Case Status</p>
          </div>
        </a>

        <a
          href="https://services.ecourts.gov.in/ecourtindia_v6/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center gap-1">
              <span>Case Search</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">By CNR / Party Name</p>
          </div>
        </a>
      </div>

      {/* Dashboard Stats (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Active Cases
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {activeMatters.length}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Litigation matters in firm
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cases with CNR
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <span>{casesWithCnr.length}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {activeMatters.length > 0 ? Math.round((casesWithCnr.length / activeMatters.length) * 100) : 0}%
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Auto-sync ready
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Synced Today
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {syncedTodayCount}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Auto 7 AM & 2 PM IST runs
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
            <RefreshCw className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Hearings Selected Date
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {hearingsOnSelectedDate.length}
            </h3>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
              On Cause List for {selectedDate}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Warning Banner for Cases Missing CNR */}
      {casesMissingCnr.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 rounded-xl shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                ⚠️ {casesMissingCnr.length} active case{casesMissingCnr.length > 1 ? 's' : ''} missing CNR number
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                Add CNR number in Edit Case to enable automatic eCourt cause list sync & WhatsApp alerts.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowMissingCnrModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 shadow-sm transition-all"
          >
            View Cases & Add CNR →
          </button>
        </div>
      )}

      {/* Date Picker, Court Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Date Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Cause List Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            />
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedDate(todayDateStr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDate === todayDateStr
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => {
                  const tm = new Date(Date.now() + 86400000).toISOString().split('T')[0];
                  setSelectedDate(tm);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDate === new Date(Date.now() + 86400000).toISOString().split('T')[0]
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Tomorrow
              </button>
            </div>
          </div>

          {/* Court Dropdown Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
            >
              <option value="ALL">🏛️ All Courts</option>
              <option value="Delhi High Court">Delhi High Court</option>
              <option value="District Court">District Court</option>
              <option value="NCLT (National Company Law Tribunal)">NCLT</option>
              <option value="Supreme Court of India">Supreme Court</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search cause list by CNR number, case number, party title, court or judge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Daily Cause List Board */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Gavel className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Daily Cause List Board ({selectedDate})
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing {hearingsOnSelectedDate.length} case{hearingsOnSelectedDate.length !== 1 ? 's' : ''}
          </span>
        </div>

        {Object.keys(courtGroupedCauseList).length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
              <CalendarDays className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No court hearings scheduled for {selectedDate}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              There are no cases listed for hearing on this date in your firm's cause list. Select another date or run eCourt sync to fetch live updates.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setSelectedDate(todayDateStr)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Go to Today
              </button>
              <button
                onClick={handleSyncAllCases}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
              >
                Sync Active Cases
              </button>
            </div>
          </div>
        ) : (
          Object.keys(courtGroupedCauseList).map((courtName) => (
            <div key={courtName} className="space-y-3">
              {/* Court Header */}
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {courtName} ({courtGroupedCauseList[courtName].length})
                </h3>
              </div>

              {/* Case Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courtGroupedCauseList[courtName].map((c) => {
                  const hasCnr = validateCNR(c.cnrNumber || c.cnr);
                  const isSyncingThis = syncingCaseId === c.id;

                  return (
                    <div
                      key={c.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3 relative flex flex-col justify-between"
                    >
                      <div>
                        {/* Header Badge Line */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-black border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1">
                            {c.itemNumber || 'Item #01'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {hasCnr ? (
                              <button
                                onClick={() => copyToClipboard(c.cnrNumber || c.cnr || '')}
                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1"
                                title="Click to copy CNR"
                              >
                                {copiedCnr === (c.cnrNumber || c.cnr) ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3 text-slate-400" />
                                )}
                                <span>{c.cnrNumber || c.cnr}</span>
                              </button>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                                No CNR
                              </span>
                            )}

                            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {c.courtSyncAt ? `Synced ${c.courtSyncAt.split(' ')[1] || '7:00 AM'}` : 'Not Synced'}
                            </span>
                          </div>
                        </div>

                        {/* Title & Case No */}
                        <div>
                          <div className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {c.caseNumber}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-2 leading-snug">
                            {c.title}
                          </h4>
                        </div>

                        {/* Details */}
                        <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-400 shrink-0">Bench / Judge:</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                              {c.judgeName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-400 shrink-0">Stage:</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                              {c.caseStageEcourt || c.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                            <span className="text-slate-400">Client: <strong className="text-slate-700 dark:text-slate-300">{c.clientName}</strong></span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="text-slate-400">Lawyer: <strong className="text-slate-700 dark:text-slate-300">{c.leadLawyerName}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSyncCase(c)}
                            disabled={isSyncingThis}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingThis ? 'animate-spin' : ''}`} />
                            <span>{isSyncingThis ? 'Syncing...' : 'Sync Now'}</span>
                          </button>

                          <a
                            href={c.cnrNumber || c.cnr ? `https://services.ecourts.gov.in/ecourtindia_v6/?cnr=${c.cnrNumber || c.cnr}` : "https://services.ecourts.gov.in/ecourtindia_v6/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open on eCourts</span>
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenSyncLog(c)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>Sync Log</span>
                          </button>

                          {onSelectMatter && (
                            <button
                              onClick={() => onSelectMatter(c)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1 hover:opacity-90"
                            >
                              <span>View Case</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGE 2 — Sync Log Modal */}
      {syncLogCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  eCourts Sync Audit Log
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {syncLogCase.caseNumber} — {syncLogCase.title}
                </h3>
              </div>
              <button onClick={() => setSyncLogCase(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CNR Header bar inside modal */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">CNR Number:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {syncLogCase.cnrNumber || syncLogCase.cnr || 'NOT ADDED'}
                </span>
              </div>
              <button
                onClick={() => {
                  setEditCnrCase(syncLogCase);
                  setCnrInput(syncLogCase.cnrNumber || syncLogCase.cnr || '');
                  setSyncLogCase(null);
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit CNR
              </button>
            </div>

            {/* Last 10 Sync Attempts Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Last 10 Sync Attempts
              </h4>

              {isLoadingLogs ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-indigo-500 mb-2" />
                  Loading eCourts sync history...
                </div>
              ) : syncLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  No previous sync logs recorded for this matter. Click "Sync Now" to trigger live eCourts status check.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Date / Time</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Next Hearing Found</th>
                        <th className="p-2.5">Court / Stage</th>
                        <th className="p-2.5">Item No</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {syncLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-2.5 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                            {log.syncedAt}
                          </td>
                          <td className="p-2.5">
                            {log.status === 'success' ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                                ✅ Synced
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                                ⚠️ {log.status}
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                            {log.nextHearing || 'N/A'}
                          </td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-400">
                            {log.caseStage || log.courtName || 'Court Listing'}
                          </td>
                          <td className="p-2.5 font-bold text-indigo-600 dark:text-indigo-400">
                            {log.itemNumber || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <button
                onClick={() => {
                  if (syncLogCase) handleSyncCase(syncLogCase);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sync Case Now
              </button>
              <button
                onClick={() => setSyncLogCase(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick CNR Editor Modal */}
      {editCnrCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Add / Update CNR Number
              </h3>
              <button onClick={() => setEditCnrCase(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                Case: <strong className="text-slate-900 dark:text-white">{editCnrCase.caseNumber}</strong> ({editCnrCase.title})
              </p>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                eCourts 16-Digit CNR Number
              </label>
              <input
                type="text"
                value={cnrInput}
                onChange={(e) => {
                  setCnrInput(e.target.value.toUpperCase());
                  setCnrError(null);
                }}
                placeholder="e.g. WBCA010001232024"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Format: 4 uppercase letters + 10 digits (e.g. WBCA010001232024). Hyphens/spaces will be stripped automatically.
              </p>
              {cnrError && (
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-2 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50">
                  ⚠️ {cnrError}
                </p>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setEditCnrCase(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCnr}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
              >
                Save & Enable Sync
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 3 — Modal for Active Cases Missing CNR */}
      {showMissingCnrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Active Cases Pending CNR Intake
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  These active litigation cases cannot be auto-synced until a CNR number is provided.
                </p>
              </div>
              <button onClick={() => setShowMissingCnrModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {casesMissingCnr.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {m.caseNumber}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                      {m.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {m.court} • Client: {m.clientName}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditCnrCase(m);
                      setCnrInput('');
                      setShowMissingCnrModal(false);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Add CNR Number
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowMissingCnrModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Sync Summary Results Modal */}
      {bulkSummaryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto font-bold">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                eCourts Bulk Sync Completed
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Finished live synchronization against eCourts India public portal.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 text-xs space-y-2 text-left font-medium">
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                <span>✅ Cases Synced:</span>
                <span>{bulkSummaryModal.synced} / {bulkSummaryModal.total}</span>
              </div>
              <div className="flex justify-between items-center text-indigo-600 dark:text-indigo-400 font-bold">
                <span>📅 Hearing Dates Updated & WhatsApp Sent:</span>
                <span>{bulkSummaryModal.changed}</span>
              </div>
              <div className="flex justify-between items-center text-amber-600 dark:text-amber-400 font-bold">
                <span>❌ CNR Numbers Missing / Invalid:</span>
                <span>{bulkSummaryModal.failed}</span>
              </div>
            </div>

            <button
              onClick={() => setBulkSummaryModal(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
            >
              Done & Refresh Board
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
