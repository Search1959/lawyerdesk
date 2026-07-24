import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  Search,
  Sparkles,
  CalendarDays,
  FileText,
  ShieldCheck,
  Receipt,
  Users,
  ChevronRight,
  MessageSquareCode,
  Zap,
  ExternalLink,
  CheckCircle2,
  Bot,
  Keyboard,
  Phone,
  Mail,
} from 'lucide-react';

export const HelpCenterView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const helpTopics = [
    {
      id: 'cause-list',
      category: 'Calendar & Cause List',
      title: 'How to Sync Daily Cause Lists from e-Courts & High Courts',
      icon: CalendarDays,
      content:
        'LawyerDesk automatically polls High Court cause lists and District Court boards using your Bar Council Registration Number. You can toggle between Month Grid, Week View, and Daily Cause List Agenda. Click "Send WhatsApp Alert" to instantly send client hearing reminders.',
    },
    {
      id: 'rag-chat',
      category: 'AI Knowledge RAG',
      title: 'Zero-Hallucination Legal AI RAG & Citations',
      icon: MessageSquareCode,
      content:
        'Our Grounded RAG search indexes all scanned petitions, affidavits, and orders uploaded to a case. When you ask a question (e.g. "Who is the plaintiff and what is their share?"), the system cites exact page numbers, paragraph numbers, and document names.',
    },
    {
      id: 'ocr-engine',
      category: 'Document Engine',
      title: 'PaddleOCR High-Precision Scanned PDF Parser',
      icon: FileText,
      content:
        'Supports bilingual Devanagari (Hindi), Bengali, and English scanned legal briefs. Uploaded PDFs are broken down into page chunks with extracted Acts, Sections, Judge Names, and Date metadata.',
    },
    {
      id: 'drafting-studio',
      category: 'AI Drafting',
      title: 'Generating Writs, Written Arguments & Bail Applications',
      icon: Bot,
      content:
        'Select a case brief, pick a target template (e.g., Written Arguments, Interim Injunction Application, Legal Notice), specify court specifics, and click "Generate Draft". You can copy or export the completed legal draft directly to Word format.',
    },
    {
      id: 'gst-billing',
      category: 'Financials & GST',
      title: 'Creating GST Compliant Invoices & Retainers',
      icon: Receipt,
      content:
        'Generate tax invoices with automatic 18% CGST/SGST/IGST breakdown for client appearances, drafting fees, and retainers. Track unpaid fees and export PDF receipts.',
    },
    {
      id: 'rbac-security',
      category: 'Security & Access',
      title: 'Role-Based Access Control (RBAC) & Audit Logs',
      icon: ShieldCheck,
      content:
        'System Admin, Firm Admin, Senior Lawyer, Staff, and Client Portal roles maintain strict data isolation. Every OCR upload, AI query, and invoice generation is recorded in the immutable audit log.',
    },
  ];

  const keyboardShortcuts = [
    { key: '⌘ + K', desc: 'Global Search across Acts, Orders, & Evidence' },
    { key: '⌘ + J', desc: 'Launch AI Legal Copilot Chat' },
    { key: '⌘ + D', desc: 'Open Document Engine & PaddleOCR' },
    { key: '⌘ + H', desc: 'Switch to Daily Cause List Calendar' },
  ];

  const filteredTopics = helpTopics.filter((t) => {
    const matchesCat = activeCategory === 'all' || t.category.toLowerCase().includes(activeCategory);
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Help Center Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border border-indigo-800/60 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <HelpCircle className="w-3.5 h-3.5" /> LawyerDesk Knowledge Base & User Guide
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Help Center & Legal OS Manual</h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Complete guides for cause list auto-sync, OCR vector search, AI drafting, and billing.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 shrink-0 text-xs text-slate-300">
            <Phone className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-bold text-white">LawyerDesk Support Line</div>
              <div className="text-[10px] text-slate-400">+91 (11) 4050-8800 • support@lawyerdesk.in</div>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides (e.g., cause list, PaddleOCR, GST billing, RAG citations)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'calendar', 'ai', 'document', 'drafting', 'financials', 'security'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Documentation' : cat}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => {
          const Icon = topic.icon;
          return (
            <div
              key={topic.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-indigo-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
                    {topic.category}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">{topic.title}</h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{topic.content}</p>
            </div>
          );
        })}
      </div>

      {/* Keyboard Shortcuts Reference */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white">
          <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>System Hotkeys & Power Shortcuts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {keyboardShortcuts.map((sc, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300 font-medium">{sc.desc}</span>
              <kbd className="px-2 py-1 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
