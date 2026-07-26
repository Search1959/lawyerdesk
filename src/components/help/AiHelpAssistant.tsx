import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  FileText,
  AlertCircle,
  ChevronRight,
  BookOpen,
  RefreshCw,
  User,
  ExternalLink,
} from 'lucide-react';
import { HelpArticle, LanguageCode } from '../../types/helpTypes';

interface AiHelpAssistantProps {
  articles: HelpArticle[];
  currentLang: LanguageCode;
  onOpenArticle: (article: HelpArticle) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  matchedArticles?: HelpArticle[];
  isNotFound?: boolean;
  timestamp: string;
}

export const AiHelpAssistant: React.FC<AiHelpAssistantProps> = ({
  articles,
  currentLang,
  onOpenArticle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text:
        currentLang === 'hi'
          ? 'नमस्कार! मैं लॉयर्डेस्क एआई हेल्प असिस्टेंट हूँ। मैं केवल हमारी आधिकारिक सहायता गाइड, ओसीआर दस्तावेज़ और सिस्टम मैनुअल से उत्तर देता हूँ। आप मुझसे क्या पूछना चाहते हैं?'
          : currentLang === 'bn'
          ? 'নমস্কার! আমি লয়ারডেস্ক এআই হেল্প অ্যাসিস্ট্যান্ট। আমি কেবল আমাদের অফিসিয়াল সাহায্য গাইড এবং সিস্টেম ম্যানুয়াল থেকে উত্তর দিই। আপনার প্রশ্ন টাইপ করুন।'
          : 'Greetings Counsel! I am the LawyerDesk AI Grounded Help Assistant. I provide zero-hallucination support strictly derived from LawyerDesk System Articles, User Guides, and Release Notes. How may I assist your firm today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const samplePrompts = [
    'How do I sync e-Courts cause list for my Bar ID?',
    'How does PaddleOCR parse scanned Devanagari Hindi or Bengali PDFs?',
    'How do I generate an 18% GST tax invoice for legal fees?',
    'What is Grounded AI RAG and page citations?',
    'How do I reset my password or fix cause list sync errors?',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsThinking(true);

    // Perform Grounded Help Search
    setTimeout(() => {
      const queryLower = textToSend.toLowerCase();

      // Search matching help articles
      const matched = articles.filter((art) => {
        const titleEn = art.title.en.toLowerCase();
        const contentEn = art.content.en.toLowerCase();
        const keywords = art.keywords.map((k) => k.toLowerCase());
        return (
          titleEn.includes(queryLower) ||
          contentEn.includes(queryLower) ||
          keywords.some((kw) => queryLower.includes(kw) || kw.includes(queryLower))
        );
      });

      if (matched.length > 0) {
        const topArticle = matched[0];
        const contentSnippet = topArticle.content[currentLang] || topArticle.content.en;

        const replyText = `Based on the LawyerDesk System Knowledge Base article **"${
          topArticle.title[currentLang] || topArticle.title.en
        }"** (Category: ${topArticle.categoryName}, Version: ${topArticle.version}):\n\n${contentSnippet.slice(
          0,
          350
        )}...\n\n📌 *For complete step-by-step instructions, please view the linked article below.*`;

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          matchedArticles: matched,
          isNotFound: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        // Strict Guardrail: Information Unavailable in Help Center
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: 'I could not find this information in the Help Center.',
          matchedArticles: articles.slice(0, 3), // Provide general recommended guides
          isNotFound: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      }

      setIsThinking(false);
    }, 700);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[650px]">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-white text-sm sm:text-base">Grounded AI Help Assistant</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                STRICT DOCS GROUNDED
              </span>
            </div>
            <p className="text-xs text-slate-300">Answers exclusively from LawyerDesk Knowledge Base & Release Notes</p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'm-1',
                sender: 'assistant',
                text: 'Chat history cleared. How may I assist you with LawyerDesk AI?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          title="Clear Conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[82%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-none shadow-md'
                    : msg.isNotFound
                    ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900/60 rounded-tl-none font-medium'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.isNotFound && (
                  <div className="flex items-center gap-2 font-black text-rose-600 dark:text-rose-400 mb-1 text-xs uppercase">
                    <AlertCircle className="w-4 h-4" />
                    <span>Knowledge Base Notice</span>
                  </div>
                )}
                <div className="whitespace-pre-line">{msg.text}</div>

                <div
                  className={`text-[10px] text-right mt-1.5 font-mono ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Matched Articles Cards */}
              {msg.matchedArticles && msg.matchedArticles.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {msg.isNotFound ? 'Recommended Help Articles:' : 'Source Help Articles:'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.matchedArticles.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => onOpenArticle(art)}
                        className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-500 cursor-pointer transition-all shadow-sm space-y-1 group"
                      >
                        <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                          {art.categoryName}
                        </div>
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600">
                          {art.title[currentLang] || art.title.en}
                        </div>
                        <div className="text-[11px] text-indigo-500 flex items-center gap-1 font-bold">
                          <span>Read Full Article</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
            <Bot className="w-4 h-4" />
            <span>Searching LawyerDesk Help Articles...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompt Pills */}
      <div className="p-3 bg-slate-100 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Suggested Questions:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 text-xs font-semibold whitespace-nowrap transition-all shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask AI Help Assistant (e.g. How to sync cause list, parse OCR, issue GST invoice)..."
          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isThinking}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </form>
    </div>
  );
};
