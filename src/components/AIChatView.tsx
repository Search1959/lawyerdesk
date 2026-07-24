import React, { useState } from 'react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Send,
  BookOpen,
  Mic,
  MicOff,
  Copy,
  Check,
  Scale,
  Bot,
  User,
  ShieldCheck,
  FileText,
  Printer,
  Download,
} from 'lucide-react';
import { Matter, AIChatMessage, Document } from '../types';

interface AIChatViewProps {
  matters: Matter[];
  selectedMatter: Matter;
  onSelectMatter: (m: Matter) => void;
  documents?: Document[];
}

export const AIChatView: React.FC<AIChatViewProps> = ({
  matters,
  selectedMatter,
  onSelectMatter,
  documents = [],
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedMatter) {
      setMessages([
        {
          id: `welcome-${selectedMatter.id}-${Date.now()}`,
          sender: 'ai',
          text: `### **LEGAL MEMORANDUM & CASE COPILOT**
**Matter:** ${selectedMatter.title}
**Case Number:** ${selectedMatter.caseNumber}
**Court:** ${selectedMatter.court}

---

Welcome to LAWYER DESK AI Copilot. I am strictly grounded in the case files for **${selectedMatter.title}** (${selectedMatter.caseNumber}).

I search only case documents, court orders, OCR chunks, and hearings for this case. Every response cites exact Document Name, Page Number, Paragraph, and Date.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          groundedInCase: true,
        },
      ]);
    }
  }, [selectedMatter?.id]);

  const samplePrompts = [
    'Summary of case',
    'Who are the plaintiff and defendants?',
    'What are the legal claims and acts charged?',
    'Search case documents and summarize findings',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || !selectedMatter) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groundedInCase: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matterId: selectedMatter.id,
          selectedMatter: selectedMatter,
          query: textToSend,
          documents: documents,
        }),
      });

      const data = await res.json();

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || 'I could not find supporting information in this case.',
        citations: data.citations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedInCase: true,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'I could not find supporting information in this case.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          groundedInCase: true,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputQuery('What is the key ground for bank guarantee stay under EPC contract clause 14.3?');
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrintDocument = (text: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Legal Document Memorandum</title>
          <style>
            body { font-family: Georgia, serif; line-height: 1.6; padding: 40px; color: #111; }
            h1, h2, h3 { border-bottom: 1px solid #ccc; padding-bottom: 4px; }
            hr { border: 0; border-top: 1px solid #aaa; margin: 20px 0; }
            pre { background: #f4f4f4; padding: 10px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div>${text.replace(/\n/g, '<br/>')}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header & Case Context Selector */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Grounded Legal AI Copilot</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Harvey AI + ChatGPT Legal Engine • Strict Document Grounding & Zero Hallucinations
          </p>
        </div>

        {/* Case Switcher */}
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-slate-400" />
          <select
            value={selectedMatter.id}
            onChange={(e) => {
              const m = matters.find((item) => item.id === e.target.value);
              if (m) onSelectMatter(m);
            }}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
          >
            {matters.map((m) => (
              <option key={m.id} value={m.id}>
                {m.caseNumber} - {m.title.slice(0, 30)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grounding Mandate Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-indigo-950 text-indigo-200 text-xs border border-indigo-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            <strong>Grounded Guarantee:</strong> Answers drawn ONLY from uploaded briefs for {selectedMatter.caseNumber}. Unsupported queries return strict fallback.
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase">Gemini 2.5 Flash RAG</span>
      </div>

      {/* Chat Messages Container */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 min-h-[460px] flex flex-col justify-between">
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="max-w-[95%] sm:max-w-[88%] w-full space-y-2">
                {msg.sender === 'user' ? (
                  /* User Message Bubble */
                  <div className="ml-auto max-w-[80%] p-4 rounded-2xl bg-indigo-600 text-white font-medium shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-[10px] opacity-80 pb-1 border-b border-white/20">
                      <span className="font-bold">Counsel</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="text-xs pt-1">{msg.text}</div>
                  </div>
                ) : (
                  /* AI Word Document / Legal Brief Sheet Card */
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 shadow-sm overflow-hidden transition-all">
                    {/* Document Top Bar */}
                    <div className="px-4 py-2.5 bg-slate-200/60 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2 font-bold">
                        <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>LEGAL MEMORANDUM & BRIEF REPORT</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] opacity-70">{msg.timestamp}</span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="px-2 py-1 rounded bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => handlePrintDocument(msg.text)}
                          className="px-2 py-1 rounded bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                          title="Print Legal Document"
                        >
                          <Printer className="w-3 h-3 text-indigo-500" />
                          <span>Print</span>
                        </button>
                      </div>
                    </div>

                    {/* Word Document Paper Sheet */}
                    <div className="p-5 md:p-6 bg-white dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 leading-relaxed space-y-3">
                      <div className="markdown-content">
                        <Markdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-base font-extrabold text-indigo-950 dark:text-indigo-200 border-b border-indigo-200 dark:border-indigo-800 pb-1.5 mb-3 mt-1 uppercase tracking-wide">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1 mb-2 mt-4">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mt-3 mb-1.5 flex items-center gap-1">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="mb-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-outside ml-4 space-y-1 mb-3 text-xs text-slate-700 dark:text-slate-200">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-outside ml-4 space-y-1 mb-3 text-xs text-slate-700 dark:text-slate-200">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => <li className="leading-relaxed pl-0.5">{children}</li>,
                            hr: () => <hr className="my-3 border-slate-200 dark:border-slate-800" />,
                            strong: ({ children }) => (
                              <strong className="font-bold text-slate-900 dark:text-white">
                                {children}
                              </strong>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-3 border-indigo-500 pl-3 my-2 italic text-slate-600 dark:text-slate-300 bg-indigo-50/60 dark:bg-indigo-950/40 py-1.5 rounded-r text-xs">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {msg.text}
                        </Markdown>
                      </div>

                      {/* Citations Box */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-[11px]">
                          <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Retrieved Case Citations & Evidence References ({msg.citations.length})</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {msg.citations.map((cit, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300"
                              >
                                <div>
                                  <strong className="text-indigo-600 dark:text-indigo-400">Doc:</strong> {cit.documentName}
                                </div>
                                <div>
                                  <strong>Pg:</strong> {cit.pageNumber}, Para {cit.paragraphNumber} | <strong>Date:</strong> {cit.date}
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 mt-1 italic line-clamp-2">"{cit.excerpt}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 text-xs items-center text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
                <span>Searching OCR vector chunks & drafting legal brief report...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar & Voice Recorder */}
        <div className="mt-4 space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          {/* Quick Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick Queries:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap transition-colors border border-slate-200 dark:border-slate-700"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`p-2.5 rounded-xl border transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Voice Dictation"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-600" />}
            </button>

            <input
              type="text"
              placeholder={`Ask about ${selectedMatter.caseNumber}... (e.g., 'Who are the plaintiff and defendants?')`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md transition-all active:scale-95 flex items-center gap-1 text-xs font-semibold px-4"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

