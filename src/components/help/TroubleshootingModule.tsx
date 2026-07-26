import React, { useState } from 'react';
import { ErrorTroubleItem, HelpArticle, LanguageCode } from '../../types/helpTypes';
import { AlertTriangle, Wrench, Search, CheckCircle2, ChevronRight, HelpCircle, LifeBuoy, FileText } from 'lucide-react';

interface TroubleshootingModuleProps {
  errors: ErrorTroubleItem[];
  articles: HelpArticle[];
  currentLang: LanguageCode;
  onOpenArticle: (article: HelpArticle) => void;
  onRequestSupport: () => void;
}

export const TroubleshootingModule: React.FC<TroubleshootingModuleProps> = ({
  errors,
  articles,
  currentLang,
  onOpenArticle,
  onRequestSupport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedErrorCode, setSelectedErrorCode] = useState<string>(errors[0]?.errorCode || '');

  const filteredErrors = errors.filter((err) => {
    const prob = (err.problem[currentLang] || err.problem.en).toLowerCase();
    const code = err.errorCode.toLowerCase();
    const query = searchQuery.toLowerCase();
    return prob.includes(query) || code.includes(query);
  });

  const activeError = errors.find((e) => e.errorCode === selectedErrorCode) || filteredErrors[0] || errors[0];

  const relatedArt = activeError?.relatedArticleId
    ? articles.find((a) => a.id === activeError.relatedArticleId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white rounded-3xl border border-rose-900/60 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <Wrench className="w-3.5 h-3.5" /> Interactive Error Diagnostic Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Troubleshooting & Error Diagnostics</h2>
            <p className="text-xs text-slate-300">
              Select or search an error code (e.g., ERR_OCR_PDF_ENCRYPTED, ERR_CAUSELIST_BAR_NO_MISMATCH) to view immediate solutions.
            </p>
          </div>

          <div className="relative w-full sm:w-72 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search error code or problem..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-400 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Error Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Known System Errors ({filteredErrors.length})
          </div>

          <div className="space-y-2">
            {filteredErrors.map((err) => {
              const isSelected = err.errorCode === activeError?.errorCode;
              const probText = err.problem[currentLang] || err.problem.en;

              return (
                <div
                  key={err.id}
                  onClick={() => setSelectedErrorCode(err.errorCode)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                    isSelected
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                      {err.errorCode}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        err.severity === 'Critical' || err.severity === 'High'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                      }`}
                    >
                      {err.severity}
                    </span>
                  </div>

                  <p className="text-xs font-bold line-clamp-2 leading-snug">{probText}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Error Diagnostic Breakdown */}
        {activeError && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-6">
            {/* Error Header */}
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span className="font-mono text-sm font-black text-rose-700 dark:text-rose-300">
                    {activeError.errorCode}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Severity: {activeError.severity}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Problem Description:</div>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {activeError.problem[currentLang] || activeError.problem.en}
                </p>
              </div>
            </div>

            {/* Root Cause Analysis */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Wrench className="w-4 h-4" />
                <span>Root Cause Analysis</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 leading-relaxed font-medium">
                {activeError.reason[currentLang] || activeError.reason.en}
              </p>
            </div>

            {/* Resolution Steps */}
            <div className="space-y-3">
              <div className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Step-by-Step Resolution Protocol</span>
              </div>

              <div className="space-y-2">
                {(activeError.solutionSteps[currentLang] || activeError.solutionSteps.en).map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-medium leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Related Article & Support Action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {relatedArt ? (
                <button
                  onClick={() => onOpenArticle(relatedArt)}
                  className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  <span>Read Full Article: {relatedArt.title[currentLang] || relatedArt.title.en}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="text-xs text-slate-400">Need further assistance? Contact our engineering team.</div>
              )}

              <button
                onClick={onRequestSupport}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <LifeBuoy className="w-4 h-4" />
                <span>Contact Engineering Support</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
