import React, { useState } from 'react';
import {
  Gavel,
  X,
  Printer,
  Share2,
  CheckSquare,
  Sparkles,
  FileText,
  AlertTriangle,
  BookOpen,
  Calendar,
  Building,
  UserCheck,
  Scale,
  Zap,
  Copy,
  Check,
} from 'lucide-react';
import { Matter, Hearing } from '../types';

interface HearingPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  hearing?: Hearing;
  matter?: Matter;
}

export const HearingPrepModal: React.FC<HearingPrepModalProps> = ({
  isOpen,
  onClose,
  hearing,
  matter,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const caseNo = matter?.caseNumber || hearing?.matterId || 'CS(COMM) 420/2024';
  const courtName = hearing?.courtName || matter?.court || 'Calcutta High Court (Original Side)';
  const judgeName = hearing?.judgeName || matter?.judgeName || 'Hon’ble Justice S. K. Mukherjee';
  const stage = hearing?.stage || 'Arguments on Interim Application';
  const itemNo = hearing?.courtHallNo ? `Item No. 14 (Court Hall ${hearing.courtHallNo})` : 'Item No. 18 (Court Room 4)';
  const date = hearing?.date || matter?.nextHearingDate || '2026-08-05';

  const briefContent = {
    synopsis: matter?.aiSummary || 'High Court Commercial Division suit concerning default in repayment of inter-corporate loan agreement. Petitioner seeking urgent injunction against encumbrance of primary pledged property.',
    lastOrder: 'On previous date (2026-06-12), court directed respondent to file counter affidavit within 3 weeks and strictly ordered status quo on property until next date.',
    questionsToAddress: [
      'Has Respondent filed counter affidavit with service copy provided to petitioner?',
      'Whether status quo was breached during the interregnum period?',
      'Which Supreme Court precedents support urgent interim attachment under Order 38 Rule 5 CPC?',
    ],
    missingDocsChecklist: [
      { name: 'Original Bank Certificate under Sec 65B Evidence Act', status: 'Pending' },
      { name: 'Certified Copy of KMC Property Mutation Certificate', status: 'Ready' },
      { name: 'Board Resolution authorizing Advocate on Record', status: 'Ready' },
    ],
    keyPrecedents: [
      { citation: '(2021) 8 SCC 412', ratio: 'Prima facie case and balance of convenience must be demonstrated for Order 39 interim relief.' },
      { citation: 'AIR 2023 SC 1109', ratio: 'Section 138 NI Act presumption applies strictly once signature on instrument is admitted.' },
    ],
  };

  const handleCopyText = () => {
    const text = `HEARING BRIEF - LAWYERDESK AI
Case No: ${caseNo}
Court: ${courtName}
Judge: ${judgeName} (${itemNo})
Hearing Date: ${date}
Stage: ${stage}

1. BRIEF SYNOPSIS:
${briefContent.synopsis}

2. LAST COURT ORDER:
${briefContent.lastOrder}

3. KEY QUESTIONS TO ADDRESS:
${briefContent.questionsToAddress.map((q, i) => `${i + 1}. ${q}`).join('\n')}

4. RELEVANT PRECEDENTS:
${briefContent.keyPrecedents.map((p) => `• ${p.citation}: ${p.ratio}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-950 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-lg">
              <Zap className="w-6 h-6 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-white/20 text-white tracking-wider">
                  Hearing Prep Assistant
                </span>
                <span className="text-xs text-amber-100 font-mono font-bold">{caseNo}</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                One-Click Court Hearing Brief
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-amber-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">

          {/* Quick Court Info Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Court & Hall</span>
              <div className="font-bold text-slate-900 dark:text-white text-xs">{courtName}</div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">{itemNo}</div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Presiding Judge & Stage</span>
              <div className="font-bold text-slate-900 dark:text-white text-xs">{judgeName}</div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">Stage: {stage}</div>
            </div>
          </div>

          {/* Case Synopsis */}
          <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl space-y-1.5">
            <h3 className="font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Executive Case Briefing
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {briefContent.synopsis}
            </p>
          </div>

          {/* Last Hearing Summary & Order */}
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 rounded-2xl space-y-1.5">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Gavel className="w-4 h-4 text-indigo-500" /> Last Court Directive & Order
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {briefContent.lastOrder}
            </p>
          </div>

          {/* Questions to Address in Court */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-500" /> Essential Questions To Address Before Bench
            </h3>
            <div className="space-y-1.5">
              {briefContent.questionsToAddress.map((q, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Precedents & Citations */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" /> Binding Statutory Precedents & Citations
            </h3>
            <div className="space-y-2">
              {briefContent.keyPrecedents.map((p, idx) => (
                <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block">{p.citation}</span>
                  <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300">{p.ratio}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCopyText}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Brief!' : 'Copy Brief Text'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Brief</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
