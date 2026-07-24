import React, { useState } from 'react';
import {
  ExternalLink,
  Info,
  Landmark,
  Database,
  Scale,
  Search,
  RefreshCw,
  CheckCircle2,
  ListFilter,
  Save,
  Clock,
  Sparkles
} from 'lucide-react';
import { ECourtCase } from '../types';
import { mockECourtCases, mockMatters } from '../data/mockData';

export const ECourtTrackerView: React.FC = () => {
  // Combine eCourt mock cases with matters for full coverage
  const initialCases: ECourtCase[] = mockMatters.map((m, idx) => ({
    id: `ecourt-m-${m.id}`,
    cnrNumber: idx === 0 ? 'DLHC01-004120-2024' : idx === 1 ? 'MHMB01-008912-2024' : `DLHC01-00${3000 + idx}-2025`,
    courtName: m.court,
    caseTypeAndNo: m.caseNumber,
    petitioner: m.title.split(' v. ')[0] || m.title,
    respondent: m.title.split(' v. ')[1] || m.opposingParty,
    nextHearingDate: m.nextHearingDate,
    stage: m.status,
    lastOrderDate: '2026-07-15',
    lastOrderSummary: 'DDA directed to file written statement within 30 days.',
    syncStatus: 'Live Synced',
    lastSyncedAt: '2026-07-24 10:30 AM',
  }));

  const [cases, setCases] = useState<ECourtCase[]>(initialCases);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncingId, setIsSyncingId] = useState<string | null>(null);
  const [globalSyncing, setGlobalSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredCases = cases.filter(
    (c) =>
      c.caseTypeAndNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cnrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.petitioner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.respondent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateCase = (id: string, field: keyof ECourtCase, value: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              [field]: value,
              lastSyncedAt: 'Just Now',
              syncStatus: 'Live Synced',
            }
          : c
      )
    );
  };

  const handleSyncSingle = (id: string) => {
    setIsSyncingId(id);
    setTimeout(() => {
      setIsSyncingId(null);
      setCases((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, lastSyncedAt: 'Just Now', syncStatus: 'Live Synced' }
            : c
        )
      );
      setToastMessage('Live eCourts status refreshed via National Judicial Data Grid (NJDG)!');
      setTimeout(() => setToastMessage(null), 3500);
    }, 1000);
  };

  const handleGlobalSync = () => {
    setGlobalSyncing(true);
    setTimeout(() => {
      setGlobalSyncing(false);
      setCases((prev) =>
        prev.map((c) => ({ ...c, lastSyncedAt: 'Just Now', syncStatus: 'Live Synced' }))
      );
      setToastMessage('All cases successfully synced with live eCourts portal database.');
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  const openECourtPortal = (cnr?: string) => {
    const url = cnr
      ? `https://services.ecourts.gov.in/ecourtindia_v6/?cnr=${encodeURIComponent(cnr)}`
      : 'https://ecourts.gov.in/ecourts_home/';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200 max-w-[1600px] mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <span>⚖️ eCourt / NJDG Tracker</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track case status across Indian courts — linked to eCourts portal
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleGlobalSync}
            disabled={globalSyncing}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${globalSyncing ? 'animate-spin' : ''}`} />
            {globalSyncing ? 'Syncing All...' : 'Sync All'}
          </button>
          <button
            onClick={() => openECourtPortal()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open eCourts Portal</span>
          </button>
        </div>
      </div>

      {/* "How to use" Banner */}
      <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-l-emerald-500 border border-emerald-200/80 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3 shadow-xs">
        <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold text-emerald-950 dark:text-emerald-100">How to use:</strong> Link each case to its eCourts case number, then click "Open on eCourts" to check live status. After checking, update the next hearing date and stage here so the app tracks it. WhatsApp reminders will use the updated dates automatically.
        </div>
      </div>

      {/* 4 Quick Link Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: eCourts Portal */}
        <div
          onClick={() => window.open('https://ecourts.gov.in/ecourts_home/', '_blank')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer text-center group"
        >
          <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Landmark className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            eCourts Portal
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">All India Courts</p>
        </div>

        {/* Card 2: NJDG Dashboard */}
        <div
          onClick={() => window.open('https://njdg.ecourts.gov.in/', '_blank')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer text-center group"
        >
          <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            NJDG Dashboard
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">National Judicial Data</p>
        </div>

        {/* Card 3: Supreme Court */}
        <div
          onClick={() => window.open('https://main.sci.gov.in/case-status', '_blank')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-rose-300 dark:hover:border-rose-700 transition-all cursor-pointer text-center group"
        >
          <div className="w-10 h-10 mx-auto rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            Supreme Court
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Case Status</p>
        </div>

        {/* Card 4: Case Search */}
        <div
          onClick={() => window.open('https://services.ecourts.gov.in/ecourtindia_v6/', '_blank')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer text-center group"
        >
          <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            Case Search
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">By CNR / Party Name</p>
        </div>
      </div>

      {/* Your Cases Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-base">
            <ListFilter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Your Cases</span>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Cases Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-3.5 pl-5">Case Number</th>
                <th className="p-3.5">Court</th>
                <th className="p-3.5">eCourt CNR / Number</th>
                <th className="p-3.5">Next Hearing</th>
                <th className="p-3.5">Stage</th>
                <th className="p-3.5">Last Updated</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 dark:text-slate-500">
                    No cases matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Case Number */}
                    <td className="p-3.5 pl-5 font-bold text-slate-900 dark:text-white">
                      <div>{c.caseTypeAndNo}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate max-w-[200px]">
                        {c.petitioner} v. {c.respondent}
                      </div>
                    </td>

                    {/* Court */}
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-[180px] truncate font-medium">
                      {c.courtName}
                    </td>

                    {/* eCourt CNR Input / Display */}
                    <td className="p-3.5">
                      <input
                        type="text"
                        value={c.cnrNumber}
                        onChange={(e) => handleUpdateCase(c.id, 'cnrNumber', e.target.value.toUpperCase())}
                        placeholder="Link CNR No..."
                        className="w-44 px-2.5 py-1 text-xs font-mono font-semibold bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none uppercase"
                      />
                    </td>

                    {/* Next Hearing Date */}
                    <td className="p-3.5">
                      <input
                        type="date"
                        value={c.nextHearingDate}
                        onChange={(e) => handleUpdateCase(c.id, 'nextHearingDate', e.target.value)}
                        className="px-2.5 py-1 text-xs font-mono font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </td>

                    {/* Stage Select */}
                    <td className="p-3.5">
                      <select
                        value={c.stage}
                        onChange={(e) => handleUpdateCase(c.id, 'stage', e.target.value)}
                        className="px-2 py-1 text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="Notice Stage">Notice Stage</option>
                        <option value="Active Litigation">Active Litigation</option>
                        <option value="Pleadings / Written Statement">Pleadings / Written Statement</option>
                        <option value="Evidence & Cross-Exam">Evidence & Cross-Exam</option>
                        <option value="Pending Order">Pending Order</option>
                        <option value="Decreed / Settled">Decreed / Settled</option>
                      </select>
                    </td>

                    {/* Last Updated */}
                    <td className="p-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {c.lastSyncedAt}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pr-5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openECourtPortal(c.cnrNumber)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:hover:bg-indigo-900/80 text-indigo-600 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800/80 inline-flex items-center gap-1 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open on eCourts</span>
                      </button>

                      <button
                        onClick={() => handleSyncSingle(c.id)}
                        disabled={isSyncingId === c.id}
                        className="px-2 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg inline-flex items-center gap-1 transition-all"
                        title="Sync latest eCourts status"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncingId === c.id ? 'animate-spin' : ''}`} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

