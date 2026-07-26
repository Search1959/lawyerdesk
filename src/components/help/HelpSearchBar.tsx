import React, { useState } from 'react';
import { Search, Mic, X, Filter, Tag, Zap, AlertCircle } from 'lucide-react';
import { LanguageCode } from '../../types/helpTypes';

interface HelpSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategorySelect: (catId: string) => void;
  categories: { id: string; name: { en: string; hi: string; bn: string }; code: string }[];
  currentLang: LanguageCode;
  onVoiceSearchTrigger?: () => void;
  isVoiceListening?: boolean;
}

export const HelpSearchBar: React.FC<HelpSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  categories,
  currentLang,
  onVoiceSearchTrigger,
  isVoiceListening = false,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const quickFilterTags = [
    { label: 'Cause List Sync', query: 'cause list' },
    { label: 'PaddleOCR Scans', query: 'ocr' },
    { label: 'AI RAG Citations', query: 'rag' },
    { label: 'AI Writs Drafting', query: 'drafting' },
    { label: '18% GST Invoices', query: 'gst' },
    { label: 'WhatsApp Hearing Alerts', query: 'whatsapp' },
    { label: 'RBAC Security', query: 'rbac' },
  ];

  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <div className="relative flex items-center w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="w-5 h-5 text-indigo-400" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            currentLang === 'hi'
              ? 'हेल्प गाइड, फीचर्स, एरर कोड या कॉज लिस्ट खोजें...'
              : currentLang === 'bn'
              ? 'হেল্প গাইড, ফিচার, ট্রাবলশুটিং খুঁজুন...'
              : 'Search help by keyword, menu, error message, court, cause list, GST, OCR, AI Chat...'
          }
          className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm transition-all"
        />

        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-20 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            title="Clear Search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Voice Search Button */}
        <button
          onClick={onVoiceSearchTrigger}
          className={`absolute right-3 p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            isVoiceListening
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
          }`}
          title="Voice Search Assistance"
        >
          <Mic className="w-4 h-4" />
          <span className="hidden sm:inline text-[11px]">{isVoiceListening ? 'Listening...' : 'Voice'}</span>
        </button>
      </div>

      {/* Quick Search Tag Pills */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <Tag className="w-3.5 h-3.5 text-indigo-500" />
          <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px]">Popular Searches:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {quickFilterTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => onSearchChange(tag.query)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                searchQuery.toLowerCase() === tag.query.toLowerCase()
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline ml-2"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{showFilters ? 'Hide Filters' : 'Categories'}</span>
        </button>
      </div>

      {/* Expandable Category Selectors */}
      {showFilters && (
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-wrap gap-1.5 animate-in fade-in">
          <button
            onClick={() => onCategorySelect('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.name[currentLang] || cat.name.en}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
