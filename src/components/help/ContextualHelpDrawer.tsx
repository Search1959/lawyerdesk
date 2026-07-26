import React, { useState } from 'react';
import { HelpArticle, LanguageCode } from '../../types/helpTypes';
import { HelpCircle, X, Search, Sparkles, BookOpen, Bot, FileText, ChevronRight, Video } from 'lucide-react';

interface ContextualHelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeContextPage?: string; // e.g. "hearings", "documents", "ai-chat", "billing", "cases"
  articles: HelpArticle[];
  currentLang: LanguageCode;
  onOpenArticle: (article: HelpArticle) => void;
}

export const ContextualHelpDrawer: React.FC<ContextualHelpDrawerProps> = ({
  isOpen,
  onClose,
  activeContextPage = 'general',
  articles,
  currentLang,
  onOpenArticle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Contextual mapping for page specific articles
  const filteredArticles = articles.filter((art) => {
    const title = art.title.en.toLowerCase();
    const cat = art.categoryName.toLowerCase();
    const query = searchQuery.toLowerCase();

    if (query) {
      return title.includes(query) || cat.includes(query);
    }

    if (activeContextPage === 'hearings') return cat.includes('hearing') || cat.includes('cause list');
    if (activeContextPage === 'documents') return cat.includes('document') || cat.includes('ocr');
    if (activeContextPage === 'ai-chat' || activeContextPage === 'drafting') return cat.includes('ai') || cat.includes('draft');
    if (activeContextPage === 'billing') return cat.includes('billing') || cat.includes('financial');
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">Contextual Help Center</h3>
              <p className="text-[10px] text-slate-300">Page: {activeContextPage.toUpperCase()}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Search Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Article Feed */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <div className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
            Relevant Articles for This Screen
          </div>

          {filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => {
                onOpenArticle(art);
                onClose();
              }}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 cursor-pointer transition-all space-y-1.5 group shadow-sm"
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                <span>{art.categoryName}</span>
                <span>{art.estimatedReadTimeMin} min</span>
              </div>

              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {art.title[currentLang] || art.title.en}
              </h4>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {art.shortDescription[currentLang] || art.shortDescription.en}
              </p>

              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 pt-1">
                <span>Read Full Article</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">Need personal assistance? Launch full Help Center.</p>
        </div>
      </div>
    </div>
  );
};
