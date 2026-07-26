import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Printer,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Tag,
  ExternalLink,
  Video,
  FileText,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { HelpArticle, LanguageCode } from '../../types/helpTypes';

interface ArticleDetailModalProps {
  article: HelpArticle | null;
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  onSelectRelatedArticle?: (articleId: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (articleId: string) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  isOpen,
  onClose,
  currentLang,
  onSelectRelatedArticle,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  if (!isOpen || !article) return null;

  const titleText = article.title[currentLang] || article.title.en;
  const descText = article.shortDescription[currentLang] || article.shortDescription.en;
  const contentText = article.content[currentLang] || article.content.en;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  const handleRating = (isHelpful: boolean) => {
    setFeedbackSubmitted(isHelpful);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                {article.categoryName}
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5" />
                {article.estimatedReadTimeMin} min read
              </span>
              <span className="px-2 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-slate-300">
                {article.version}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">{titleText}</h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(article.id)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
              >
                {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="text-slate-500 dark:text-slate-400 font-medium">
            Last Updated: <span className="font-bold text-slate-700 dark:text-slate-300">{article.lastUpdated}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleShare}
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedShareLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`Downloading PDF document for: ${titleText}`);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF Manual</span>
            </a>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
          {/* Summary Callout Box */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Executive Guide Overview</span>
            </div>
            <p className="text-xs text-indigo-950 dark:text-indigo-200 font-medium leading-relaxed">{descText}</p>
          </div>

          {/* Main Markdown / Text Content */}
          <div className="prose dark:prose-invert max-w-none space-y-4 text-xs sm:text-sm whitespace-pre-line">
            {contentText}
          </div>

          {/* Step-by-Step Guide Section */}
          {article.stepByStepGuide && article.stepByStepGuide.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Step-by-Step Execution Guide</span>
              </h3>

              <div className="space-y-4">
                {article.stepByStepGuide.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {step.stepNumber}
                      </div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {step.title[currentLang] || step.title.en}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 pl-10">
                      {step.description[currentLang] || step.description.en}
                    </p>

                    {step.imageUrl && (
                      <div className="pl-10">
                        <img
                          src={step.imageUrl}
                          alt={step.title.en}
                          className="rounded-xl border border-slate-300 dark:border-slate-700 max-h-48 object-cover w-full"
                        />
                      </div>
                    )}

                    {step.tip && (
                      <div className="ml-10 p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start gap-2 text-xs text-amber-800 dark:text-amber-200">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{step.tip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips Box */}
          {article.tips && article.tips.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <span>Pro Tips & Best Practices</span>
              </div>
              <ul className="list-disc pl-5 text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
                {article.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings Box */}
          {article.warnings && article.warnings.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-rose-800 dark:text-rose-300 uppercase">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Important Compliance Warnings</span>
              </div>
              <ul className="list-disc pl-5 text-xs text-rose-950 dark:text-rose-200 space-y-1">
                {article.warnings.map((warn, idx) => (
                  <li key={idx}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Keywords Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-bold text-slate-400 mr-1">Tags:</span>
            {article.keywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300"
              >
                #{kw}
              </span>
            ))}
          </div>

          {/* Article Rating / Feedback Box */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Was this article helpful?</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {article.helpfulYesCount} users found this useful. Your feedback improves system documentation.
              </p>
            </div>

            {feedbackSubmitted !== null ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you for your feedback!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleRating(true)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 hover:text-emerald-600 border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Yes</span>
                </button>
                <button
                  onClick={() => handleRating(false)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-700 dark:text-slate-200 hover:text-rose-600 border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />
                  <span>No</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
