import React, { useState } from 'react';
import {
  Folder,
  FileText,
  Search,
  Plus,
  Sparkles,
  BookOpen,
  Lock,
  Download,
  Share2,
  Tag,
  ShieldCheck,
  Building,
  Upload,
  MessageSquare,
} from 'lucide-react';

interface VaultItem {
  id: string;
  title: string;
  category: 'Draft Template' | 'High Court Precedent' | 'Office SOP' | 'Research Brief';
  author: string;
  date: string;
  fileSize: string;
  tags: string[];
  summary: string;
}

export const KnowledgeVaultView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const mockVaultItems: VaultItem[] = [
    {
      id: 'kv-1',
      title: 'Standard High Court Vakalatnama & Power of Attorney Template',
      category: 'Draft Template',
      author: 'Managing Partner',
      date: '2026-05-10',
      fileSize: '1.2 MB',
      tags: ['Vakalatnama', 'High Court', 'Mandatory'],
      summary: 'Verified Vakalatnama format compliant with Calcutta High Court Original and Appellate side filing rules.',
    },
    {
      id: 'kv-2',
      title: 'SOP for Sec 138 NI Act Cheque Bounce Notice & Filing Timeline',
      category: 'Office SOP',
      author: 'Senior Partner',
      date: '2026-04-18',
      fileSize: '850 KB',
      tags: ['Section 138', 'Notice', 'SOP'],
      summary: 'Step-by-step guideline for dispatching 15-day statutory demand notice, postal receipt verification, and drafting 138 complaint.',
    },
    {
      id: 'kv-3',
      title: 'Landmark Precedents on Order 39 Interim Injunctions (2020-2025)',
      category: 'High Court Precedent',
      author: 'Research Cell',
      date: '2026-03-22',
      fileSize: '3.4 MB',
      tags: ['Order 39', 'CPC', 'Injunctions'],
      summary: 'Annotated compilation of Supreme Court and High Court judgments on balance of convenience and irreparable injury.',
    },
    {
      id: 'kv-4',
      title: 'Firm Fee Agreement & Retainership Contract (Corporate Client)',
      category: 'Draft Template',
      author: 'Accounts & Legal',
      date: '2026-02-14',
      fileSize: '920 KB',
      tags: ['Fee Agreement', 'Corporate', 'Retainer'],
      summary: 'Standard commercial retainer contract including GST terms, appearance fee schedules, and out-of-pocket expenses.',
    },
  ];

  const handleAskFirmAi = () => {
    if (!aiQuery.trim()) return;
    setIsAiThinking(true);
    setAiAnswer('');
    setTimeout(() => {
      setAiAnswer(
        `Based strictly on the private LawyerDesk Knowledge Vault:\n\n1. According to the "SOP for Sec 138 NI Act", the statutory demand notice must be served within 30 days of receiving the cheque return memo.\n2. As per the "Vakalatnama Template", Calcutta High Court requires a ₹15 Welfare Stamp along with advocate advocate bar council registration details.`
      );
      setIsAiThinking(false);
    }, 900);
  };

  const filteredItems = mockVaultItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Private Firm Vault
            </span>
            <span className="text-xs text-slate-300">Encrypted Repository & RAG Engine</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Lock className="w-6 h-6 text-indigo-400" /> Law Firm Knowledge Vault
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Centralized private library of verified draft templates, firm SOPs, research notes, and High Court precedents.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2">
          <Upload className="w-4 h-4" />
          <span>Upload Firm Vault Document</span>
        </button>
      </div>

      {/* RAG Firm AI Query Bar */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span>Ask Firm AI (Answers Grounded Strictly in Private Firm Vault)</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="e.g., What is our firm SOP for serving Sec 138 demand notice?"
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium"
            onKeyDown={(e) => e.key === 'Enter' && handleAskFirmAi()}
          />
          <button
            onClick={handleAskFirmAi}
            disabled={isAiThinking}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{isAiThinking ? 'Searching Vault...' : 'Query Vault'}</span>
          </button>
        </div>

        {aiAnswer && (
          <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-sans whitespace-pre-line animate-in fade-in duration-200">
            {aiAnswer}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates, SOPs, tags..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['All', 'Draft Template', 'Office SOP', 'High Court Precedent', 'Research Brief'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm hover:border-indigo-500 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{item.fileSize}</span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{item.summary}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {item.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-semibold text-[10px]">
                    #{t}
                  </span>
                ))}
              </div>

              <button className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-colors flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                <span>Use Template</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
