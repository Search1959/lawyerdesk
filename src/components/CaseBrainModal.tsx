import React, { useState } from 'react';
import {
  Brain,
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Gavel,
  Scale,
  Sparkles,
  Link2,
  ChevronRight,
  TrendingUp,
  Clock,
  Printer,
  Share2,
  FileCheck,
  Building2,
  User,
  Zap,
} from 'lucide-react';
import { Matter, Document, Hearing } from '../types';

interface CaseBrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  matter: Matter;
  documents?: Document[];
  hearings?: Hearing[];
  onOpenHearingPrep?: () => void;
}

export const CaseBrainModal: React.FC<CaseBrainModalProps> = ({
  isOpen,
  onClose,
  matter,
  documents = [],
  hearings = [],
  onOpenHearingPrep,
}) => {
  const [activeTab, setActiveTab] = useState<'brain' | 'entities' | 'timeline' | 'health'>('brain');

  if (!isOpen) return null;

  // Compute Case Health Score dynamically
  const hasDocs = matter.documentsCount > 0;
  const missingDocsCount = matter.aiMissingDocuments?.length || 0;
  const healthScore = Math.max(20, Math.min(98, 100 - missingDocsCount * 12 - (matter.riskScore > 70 ? 25 : 10) + (hasDocs ? 15 : 0)));

  // Simulated extracted Entities
  const extractedEntities = {
    actsAndSections: matter.actsAndSections?.length ? matter.actsAndSections : ['Section 138, Negotiable Instruments Act 1881', 'Section 420, Indian Penal Code', 'Section 9, Arbitration & Conciliation Act 1996'],
    chequeDetails: 'Cheque No. 408291 • HDFC Bank • Amount: ₹ 45,000,000/-',
    propertyDetails: 'KMC Premises No. 14/B, Park Street, Kolkata - 700016 (Ward No. 63)',
    witnesses: ['Mr. S. K. Banerjee (Bank Manager)', 'Adv. R. N. Dutta (Notary Public)'],
    keyDates: [
      { label: 'Demand Notice Served', date: '2024-02-10' },
      { label: 'Statutory 15-Day Expired', date: '2024-02-25' },
      { label: 'Complaint Filed in Court', date: '2024-03-05' },
      { label: 'Summons Issued', date: '2024-04-12' },
    ],
  };

  // Litigation Timeline Steps
  const timelineSteps = [
    { stage: 'Case Filed', date: matter.createdAt || '2024-03-05', status: 'Completed', doc: 'Plaint & Affidavit.pdf' },
    { stage: 'Notice & Summons', date: '2024-04-12', status: 'Completed', doc: 'Summons Execution Return.pdf' },
    { stage: 'Written Statement', date: '2024-05-20', status: 'Completed', doc: 'Opposing Written Statement.pdf' },
    { stage: 'Framing of Issues', date: '2024-06-15', status: 'Completed', doc: 'Court Order - Issues Framed.pdf' },
    { stage: 'Evidence & Examination', date: matter.nextHearingDate || '2026-08-05', status: 'In Progress', doc: 'Evidence Affidavit.pdf' },
    { stage: 'Cross Examination', date: 'Upcoming', status: 'Pending', doc: 'Cross Exam Questionnaire.docx' },
    { stage: 'Arguments & Judgment', date: 'Pending', status: 'Pending', doc: 'Draft Written Arguments.docx' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 text-white flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-lg">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI Case Brain V3.6
                </span>
                <span className="text-xs text-slate-400 font-mono">{matter.caseNumber}</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
                {matter.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenHearingPrep && (
              <button
                onClick={() => {
                  onClose();
                  onOpenHearingPrep();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Prepare Hearing</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 px-5 pt-3 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('brain')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'brain'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4 text-indigo-500" />
            <span>AI Brain & Strategy</span>
          </button>

          <button
            onClick={() => setActiveTab('entities')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'entities'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Extracted Entities & Facts</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'timeline'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-sky-500" />
            <span>Litigation Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'health'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Case Health Score ({healthScore}%)</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: AI Brain & Strategy */}
          {activeTab === 'brain' && (
            <div className="space-y-6">
              
              {/* Executive AI Summary */}
              <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" /> Executive Matter Synopsis
                  </h3>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Grounded in {matter.documentsCount} Case Files
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {matter.aiSummary ||
                    `This matter relates to a high-value dispute filed under ${matter.category} jurisdiction in ${matter.court}. The primary issue centers around breach of contractual obligations, default in financial covenants, and disputed property title boundaries. High likelihood of favorable outcome if evidence affidavit is filed prior to next hearing.`}
                </p>
              </div>

              {/* Grid: Risk & Suggested Next Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Risk Factors */}
                <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-500" /> Risk Factors & Weaknesses
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      Risk Score: {matter.riskScore}/100
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {matter.aiContradictions?.length ? (
                      matter.aiContradictions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>Original bank statement for Q3 2024 not yet verified on record.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>Opposing counsel likely to plead limitation period defense under Article 54.</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Suggested Next Steps */}
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Recommended Action Items
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {matter.aiStrategyNotes?.length ? (
                      matter.aiStrategyNotes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>File Evidence Affidavit by PW-1 with certified banking receipts.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Cite Supreme Court precedent on Section 138 NI Act presumptions (2023).</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

              </div>

              {/* Missing Documents Alert */}
              {matter.aiMissingDocuments && matter.aiMissingDocuments.length > 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Missing Required Filings / Evidentiary Gap
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {matter.aiMissingDocuments.map((doc, idx) => (
                      <div key={idx} className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/60 dark:border-amber-800/40 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                        <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: Extracted Entities & Facts */}
          {activeTab === 'entities' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Court & Judicial Details */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Scale className="w-4 h-4 text-indigo-500" /> Forum & Judicial Officers
                  </h4>
                  <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <div><strong className="text-slate-900 dark:text-white">Court:</strong> {matter.court}</div>
                    <div><strong className="text-slate-900 dark:text-white">Presiding Officer:</strong> {matter.judgeName}</div>
                    <div><strong className="text-slate-900 dark:text-white">Court Room:</strong> {matter.courtRoomNo}</div>
                    <div><strong className="text-slate-900 dark:text-white">Opposing Counsel:</strong> {matter.opposingAdvocate}</div>
                  </div>
                </div>

                {/* Parties */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" /> Litigating Parties
                  </h4>
                  <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <div><strong className="text-slate-900 dark:text-white">Client (Petitioner/Plaintiff):</strong> {matter.clientName}</div>
                    <div><strong className="text-slate-900 dark:text-white">Opposing Party (Respondent):</strong> {matter.opposingParty}</div>
                    <div><strong className="text-slate-900 dark:text-white">Lead Counsel:</strong> {matter.leadLawyerName}</div>
                  </div>
                </div>

                {/* Statutory Acts & Sections */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-indigo-500" /> Statutory Acts & Provisions
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedEntities.actsAndSections.map((act, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] border border-indigo-500/20">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Instrument / Property / Financials */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-500" /> Disputed Assets & Instruments
                  </h4>
                  <div className="space-y-1 text-slate-700 dark:text-slate-300">
                    <div><strong className="text-slate-900 dark:text-white">Cheque/Instrument:</strong> {extractedEntities.chequeDetails}</div>
                    <div><strong className="text-slate-900 dark:text-white">Property Details:</strong> {extractedEntities.propertyDetails}</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: Litigation Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-500" /> Sequential Litigation Roadmap
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Linked to Verified Documents & Court Records
                </span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-200 dark:before:bg-slate-800">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                    <div
                      className={`absolute -left-[23px] top-4 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 ${
                        step.status === 'Completed'
                          ? 'border-emerald-500 bg-emerald-500'
                          : step.status === 'In Progress'
                          ? 'border-indigo-500 animate-pulse'
                          : 'border-slate-400'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">{step.stage}</span>
                        <span
                          className={`text-[9.5px] px-2 py-0.5 rounded font-bold ${
                            step.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : step.status === 'In Progress'
                              ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                              : 'bg-slate-500/10 text-slate-500'
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Date: {step.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                      <FileCheck className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{step.doc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Case Health Score */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              
              {/* Score Meter Banner */}
              <div className="p-6 bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 rounded-2xl text-white flex items-center justify-between border border-emerald-500/30 shadow-xl">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    Litigation Preparedness Index
                  </div>
                  <h3 className="text-2xl font-black">Case Health Score: {healthScore} / 100</h3>
                  <p className="text-xs text-slate-300">
                    Calculated based on court evidence filing status, limitation period buffer, client KYC, and fee clearance.
                  </p>
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500/40 flex items-center justify-center font-black text-2xl text-emerald-400 bg-slate-950/60 shadow-inner shrink-0">
                  {healthScore}%
                </div>
              </div>

              {/* Health Audit Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Client KYC & Vakalatnama</span>
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Verified
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Evidence Affidavit</span>
                  <span className="font-bold text-amber-500 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Pending Draft
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Limitation Risk Buffer</span>
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Safe (&gt;60 Days)
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Fee Deposit Clearance</span>
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Paid
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-indigo-500" />
            <span>LawyerDesk AI RAG Brain Grounded • Updated Just Now</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
          >
            Close Brain
          </button>
        </div>

      </div>
    </div>
  );
};
