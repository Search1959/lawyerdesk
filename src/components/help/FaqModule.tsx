import React, { useState } from 'react';
import { HelpFAQ, LanguageCode } from '../../types/helpTypes';
import { HelpCircle, ChevronDown, ChevronUp, Search, ThumbsUp, Copy, Check, Filter } from 'lucide-react';

interface FaqModuleProps {
  faqs: HelpFAQ[];
  currentLang: LanguageCode;
}

export const FaqModule: React.FC<FaqModuleProps> = ({ faqs, currentLang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(faqs[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyAnswer = (faq: HelpFAQ, e: React.MouseEvent) => {
    e.stopPropagation();
    const q = faq.question[currentLang] || faq.question.en;
    const a = faq.answer[currentLang] || faq.answer.en;
    navigator.clipboard.writeText(`Q: ${q}\nA: ${a}`);
    setCopiedId(faq.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const q = (faq.question[currentLang] || faq.question.en).toLowerCase();
    const a = (faq.answer[currentLang] || faq.answer.en).toLowerCase();
    const query = searchQuery.toLowerCase();
    return q.includes(query) || a.includes(query) || faq.keywords.some((k) => k.toLowerCase().includes(query));
  });

  return (
    <div className="space-y-5">
      {/* Search Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <h2 className="text-xl font-black">Search LawyerDesk AI FAQs</h2>
          <p className="text-xs text-slate-300">Quick answers to common questions regarding cases, cause lists, OCR & billing.</p>
        </div>

        <div className="relative w-full sm:w-80 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g. client, OCR, invoice, password)..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          const qText = faq.question[currentLang] || faq.question.en;
          const aText = faq.answer[currentLang] || faq.answer.en;

          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-white dark:bg-slate-900 border-indigo-500/80 shadow-md'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs shrink-0">
                    Q
                  </div>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">{qText}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 hidden sm:flex">
                    <ThumbsUp className="w-3 h-3 text-emerald-500" />
                    {faq.helpfulCount}
                  </span>
                  <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {aText}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex flex-wrap gap-1">
                      {faq.keywords.map((kw, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500">
                          #{kw}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => handleCopyAnswer(faq, e)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      {copiedId === faq.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === faq.id ? 'Copied!' : 'Copy Answer'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
