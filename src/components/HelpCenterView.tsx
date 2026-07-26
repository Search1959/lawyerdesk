import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Search,
  Sparkles,
  BookOpen,
  Video,
  Bot,
  Wrench,
  LifeBuoy,
  FileText,
  CalendarDays,
  ShieldCheck,
  Receipt,
  MessageSquareCode,
  Globe,
  Play,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Tag,
  Clock,
  ThumbsUp,
  BarChart3,
  Phone,
  Mail,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

import {
  helpCategories,
  helpArticles as seedArticles,
  helpVideos as seedVideos,
  helpFAQs as seedFaqs,
  errorTroubleshootingList as seedErrors,
  onboardingWalkthroughSteps,
  releaseNotesList,
  mockSupportTickets as seedTickets,
} from '../data/helpData';

import { HelpArticle, HelpCategory, HelpVideo, SupportTicket, LanguageCode } from '../types/helpTypes';
import { HelpSearchBar } from './help/HelpSearchBar';
import { ArticleDetailModal } from './help/ArticleDetailModal';
import { VideoLibrary } from './help/VideoLibrary';
import { AiHelpAssistant } from './help/AiHelpAssistant';
import { FaqModule } from './help/FaqModule';
import { TroubleshootingModule } from './help/TroubleshootingModule';
import { WalkthroughTour } from './help/WalkthroughTour';
import { SupportTicketModule } from './help/SupportTicketModule';
import { HelpAdminPanel } from './help/HelpAdminPanel';
import { HelpAnalyticsView } from './help/HelpAnalyticsView';

export const HelpCenterView: React.FC = () => {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<
    'home' | 'articles' | 'videos' | 'ai-assistant' | 'faq' | 'troubleshooting' | 'tickets' | 'release-notes' | 'admin' | 'analytics'
  >('home');

  // Language state
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');

  // State collections
  const [articles, setArticles] = useState<HelpArticle[]>(seedArticles);
  const [categories, setCategories] = useState<HelpCategory[]>(helpCategories);
  const [videos, setVideos] = useState<HelpVideo[]>(seedVideos);
  const [tickets, setTickets] = useState<SupportTicket[]>(seedTickets);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Modal states
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Voice Search Handler
  const handleVoiceSearch = () => {
    setIsVoiceListening(true);
    setTimeout(() => {
      setIsVoiceListening(false);
      setSearchQuery('cause list');
    }, 2000);
  };

  // Bookmark toggle
  const toggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((b) => b !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  // Open Article Detail
  const handleOpenArticle = (article: HelpArticle) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
    // Increment view count
    setArticles((prev) =>
      prev.map((a) => (a.id === article.id ? { ...a, viewsCount: a.viewsCount + 1 } : a))
    );
  };

  // Create Ticket Handler
  const handleCreateTicket = (newTkt: Partial<SupportTicket>) => {
    const created: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-2026-0${tickets.length + 82}`,
      userId: 'usr-1',
      userName: 'Adv. Senior Counsel',
      userEmail: 'counsel@sharmalegal.in',
      firmName: 'Sharma & Associates',
      category: newTkt.category || 'General',
      type: newTkt.type || 'Question',
      priority: newTkt.priority || 'Medium',
      subject: newTkt.subject || 'Support Query',
      description: newTkt.description || '',
      screenshots: newTkt.screenshots || [],
      status: 'Open',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      comments: [],
    };
    setTickets([created, ...tickets]);
  };

  // Add Comment to Ticket
  const handleAddComment = (ticketId: string, commentText: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newCm = {
            id: `cm-${Date.now()}`,
            ticketId,
            authorName: 'Adv. Senior Counsel',
            authorRole: 'Senior Advocate',
            message: commentText,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
            isStaff: false,
          };
          return { ...t, comments: [...t.comments, newCm] };
        }
        return t;
      })
    );
  };

  // Filtered Articles Calculation
  const filteredArticles = articles.filter((art) => {
    const title = (art.title[currentLang] || art.title.en).toLowerCase();
    const desc = (art.shortDescription[currentLang] || art.shortDescription.en).toLowerCase();
    const content = (art.content[currentLang] || art.content.en).toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      title.includes(query) ||
      desc.includes(query) ||
      content.includes(query) ||
      art.keywords.some((k) => k.toLowerCase().includes(query));

    const matchesCat = selectedCategoryId === 'all' || art.categoryId === selectedCategoryId;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white border border-indigo-800/60 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                <HelpCircle className="w-3.5 h-3.5" /> Official Help & Learning Center
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                LawyerDesk Legal OS Manual v3.6
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Knowledge Base & System Documentation</h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Interactive guides for e-Courts cause list syncing, PaddleOCR Devanagari parsing, AI drafting, and 18% GST invoices.
            </p>
          </div>

          {/* Right Action Bar: Language Switcher & Walkthrough Trigger */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Multilingual Selector */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs">
              <Globe className="w-4 h-4 text-indigo-400 ml-1" />
              {(['en', 'hi', 'bn'] as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCurrentLang(lang)}
                  className={`px-2.5 py-1 rounded-xl font-bold uppercase transition-all ${
                    currentLang === lang
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिंदी' : 'বাংলা'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsWalkthroughOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Interactive Tour</span>
            </button>
          </div>
        </div>

        {/* Global Search Bar Component */}
        <HelpSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
          categories={categories}
          currentLang={currentLang}
          onVoiceSearchTrigger={handleVoiceSearch}
          isVoiceListening={isVoiceListening}
        />
      </div>

      {/* Main Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'home', label: 'Dashboard Home', icon: BookOpen },
          { id: 'articles', label: 'All Articles', icon: FileText },
          { id: 'videos', label: 'Video Academy', icon: Video },
          { id: 'ai-assistant', label: 'AI Help Assistant', icon: Bot },
          { id: 'faq', label: 'Searchable FAQs', icon: HelpCircle },
          { id: 'troubleshooting', label: 'Error Diagnostics', icon: Wrench },
          { id: 'tickets', label: 'Support Desk', icon: LifeBuoy },
          { id: 'release-notes', label: 'Release Notes', icon: Sparkles },
          { id: 'admin', label: 'Admin Panel', icon: ShieldCheck },
          { id: 'analytics', label: 'System Analytics', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HOME DASHBOARD */}
      {activeTab === 'home' && (
        <div className="space-y-8">
          {/* Featured Categories Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                Browse Knowledge Categories ({categories.length})
              </h2>
              <button
                onClick={() => setActiveTab('articles')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
              >
                <span>View All Guides</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setActiveTab('articles');
                  }}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded uppercase">
                      {cat.code}
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-400">{cat.articleCount || 4} Articles</span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {cat.name[currentLang] || cat.name.en}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {cat.description[currentLang] || cat.description.en}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular / Featured Articles Section */}
          <div className="space-y-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Popular & High-Impact Guides
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.slice(0, 4).map((art) => (
                <div
                  key={art.id}
                  onClick={() => handleOpenArticle(art)}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/80 cursor-pointer transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded uppercase">
                      {art.categoryName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-bold">{art.version}</span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 leading-snug">
                    {art.title[currentLang] || art.title.en}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {art.shortDescription[currentLang] || art.shortDescription.en}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                    <span className="text-slate-400 text-[11px]">{art.estimatedReadTimeMin} min read • {art.viewsCount} views</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 text-xs">
                      Read Guide <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded AI Help Assistant Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/80 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
                  <Bot className="w-4 h-4 animate-pulse" />
                  <span>AI Grounded Help Assistant</span>
                </div>
                <h3 className="text-lg font-black">Need instant answers about LawyerDesk AI?</h3>
                <p className="text-xs text-slate-300">
                  Ask our AI Assistant anything about cause lists, PaddleOCR multi-lingual scanning, or GST billing.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('ai-assistant')}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shrink-0"
              >
                <span>Launch AI Help Copilot</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARTICLES DIRECTORY */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Showing {filteredArticles.length} Articles</span>
            <span>Category: {selectedCategoryId === 'all' ? 'All' : selectedCategoryId}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => handleOpenArticle(art)}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 cursor-pointer transition-all space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded uppercase">
                      {art.categoryName}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(art.id);
                      }}
                      className="p-1 rounded text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {bookmarkedIds.includes(art.id) ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 leading-snug">
                    {art.title[currentLang] || art.title.en}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                    {art.shortDescription[currentLang] || art.shortDescription.en}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px]">{art.lastUpdated}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 text-xs">
                    Read <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VIDEO ACADEMY */}
      {activeTab === 'videos' && <VideoLibrary videos={videos} currentLang={currentLang} />}

      {/* TAB 4: AI HELP ASSISTANT */}
      {activeTab === 'ai-assistant' && (
        <AiHelpAssistant articles={articles} currentLang={currentLang} onOpenArticle={handleOpenArticle} />
      )}

      {/* TAB 5: FAQ MODULE */}
      {activeTab === 'faq' && <FaqModule faqs={seedFaqs} currentLang={currentLang} />}

      {/* TAB 6: TROUBLESHOOTING & ERROR DIAGNOSTICS */}
      {activeTab === 'troubleshooting' && (
        <TroubleshootingModule
          errors={seedErrors}
          articles={articles}
          currentLang={currentLang}
          onOpenArticle={handleOpenArticle}
          onRequestSupport={() => setActiveTab('tickets')}
        />
      )}

      {/* TAB 7: SUPPORT DESK & TICKETS */}
      {activeTab === 'tickets' && (
        <SupportTicketModule
          tickets={tickets}
          onCreateTicket={handleCreateTicket}
          onAddComment={handleAddComment}
        />
      )}

      {/* TAB 8: RELEASE NOTES */}
      {activeTab === 'release-notes' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-slate-800 shadow-md space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Product Changelog & Release Notes
            </div>
            <h2 className="text-xl font-black">LawyerDesk AI Release Log</h2>
            <p className="text-xs text-slate-300">Continuous upgrades for e-Courts cause lists, PaddleOCR, and AI RAG engines.</p>
          </div>

          <div className="space-y-4">
            {releaseNotesList.map((rel) => (
              <div
                key={rel.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
                      {rel.version}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{rel.releaseDate}</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-full">
                    {rel.category}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{rel.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">{rel.summary}</p>

                <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  {rel.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: ADMIN PANEL */}
      {activeTab === 'admin' && (
        <HelpAdminPanel
          articles={articles}
          categories={categories}
          onSaveArticle={(updatedArt) => {
            if (articles.some((a) => a.id === updatedArt.id)) {
              setArticles(articles.map((a) => (a.id === updatedArt.id ? ({ ...a, ...updatedArt } as HelpArticle) : a)));
            } else {
              setArticles([updatedArt as HelpArticle, ...articles]);
            }
          }}
          onDeleteArticle={(id) => setArticles(articles.filter((a) => a.id !== id))}
          onSaveCategory={(newCat) => setCategories([...categories, newCat as HelpCategory])}
        />
      )}

      {/* TAB 10: ANALYTICS */}
      {activeTab === 'analytics' && <HelpAnalyticsView articles={articles} tickets={tickets} />}

      {/* MODAL: Article Reader Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        currentLang={currentLang}
        isBookmarked={selectedArticle ? bookmarkedIds.includes(selectedArticle.id) : false}
        onToggleBookmark={toggleBookmark}
      />

      {/* MODAL: Onboarding Walkthrough Tour */}
      <WalkthroughTour
        steps={onboardingWalkthroughSteps}
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        currentLang={currentLang}
        onCompleteTour={() => alert('Congratulations! You completed the LawyerDesk AI Onboarding Tour.')}
      />
    </div>
  );
};
