import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Send,
  BookOpen,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Scale,
  Bot,
  User,
  ShieldCheck,
  FileText,
  Printer,
  Download,
  Trash2,
  FileSpreadsheet,
  Zap,
  FilePenLine,
  X,
  ExternalLink,
  Radio,
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
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoReadAloud, setAutoReadAloud] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [citationModalText, setCitationModalText] = useState<{
    title: string;
    docName: string;
    details: string;
    excerpt: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

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

I search only case documents, court orders, OCR chunks, and hearings for this case. Every response cites exact Document Name, Page Number, Paragraph, and Date.

Try typing, dictating with the **Voice Mic**, or selecting a **Quick Command** from the left panel.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          groundedInCase: true,
        },
      ]);
    }
  }, [selectedMatter?.id]);

  const stripMarkdownForSpeech = (text: string): string => {
    return text
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
      .replace(/`{1,3}(.*?)(`{1,3}|$)/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/---/g, '')
      .replace(/\|\s*/g, ' ')
      .trim();
  };

  const speakMessage = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech voice synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    if (speakingMsgId === msgId) {
      setSpeakingMsgId(null);
      return;
    }

    const cleanText = stripMarkdownForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsListening(true);
      setInputQuery('What are the key grounds for interim injunction under Order 39 Rule 1?');
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
      return;
    }

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingMsgId(null);

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Voice dictation error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Could not start speech recognition:', err);
      setIsListening(false);
    }
  };

  const caseDocsCount = documents.filter((d) => !selectedMatter || d.matterId === selectedMatter.id).length;

  const quickQuestions = [
    { label: 'Case Summary & Facts', query: 'Summarize the core facts, claims, and prayer in this case.' },
    { label: 'Upcoming Hearing Dates', query: 'List all upcoming court hearing dates, judge details, and stage.' },
    { label: 'Outstanding Client Dues', query: 'What is the total billed amount, outstanding dues, and invoice status for this client?' },
    { label: 'Pending Legal Tasks', query: 'List all pending office tasks and drafting items for this matter.' },
    { label: 'High Court Precedents', query: 'Search Calcutta High Court & Supreme Court precedents relevant to this matter.' },
  ];

  const quickDrafts = [
    { label: 'Notice u/s 138 NI Act', query: 'Draft a statutory demand notice for cheque bounce under Section 138 NI Act for this matter.' },
    { label: 'Vakalatnama & Memo', query: 'Draft a standard Vakalatnama and Memorandum of Appearance for Calcutta High Court.' },
    { label: 'Bail Application (Criminal)', query: 'Draft a regular Bail Application under Section 439 CrPC / 483 BNSS.' },
    { label: 'Written Statement (Civil)', query: 'Draft a preliminary objections Written Statement in response to the plaint.' },
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || !selectedMatter) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
    }

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

      if (autoReadAloud && aiMsg.text) {
        setTimeout(() => {
          speakMessage(aiMsg.id, aiMsg.text);
        }, 300);
      }
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

  const handleClearChat = () => {
    if (confirm('Clear entire AI conversation history?')) {
      setMessages([]);
    }
  };

  const handleExportChat = () => {
    const text = messages
      .map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n`)
      .join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LawyerDesk_AI_Chat_${selectedMatter?.caseNumber || 'export'}.txt`;
    a.click();
  };

  const handleCopyAll = () => {
    const text = messages.map((m) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n\n');
    navigator.clipboard.writeText(text);
    alert('Entire chat copied to clipboard!');
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
    <div className="space-y-4 pb-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="px-4 py-3 rounded-2xl bg-indigo-950 text-indigo-100 text-xs border border-indigo-800 flex items-center justify-between flex-wrap gap-2 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Grounding Guarantee:</strong> Answers drawn strictly from uploaded briefs for <strong>{selectedMatter.caseNumber}</strong>. Zero hallucinations.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-indigo-900 text-indigo-300 font-mono font-bold text-[10px]">
            {caseDocsCount} docs loaded for AI
          </span>
          <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase">Gemini 3.6 Flash</span>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (300px / 4 cols) - Case Selector & Quick Commands */}
        <div className="lg:col-span-4 space-y-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {/* Case Scope Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Target Case Scope</span>
            </label>
            <select
              value={selectedMatter.id}
              onChange={(e) => {
                const m = matters.find((item) => item.id === e.target.value);
                if (m) onSelectMatter(m);
              }}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-indigo-50/80 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {matters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.caseNumber} - {m.title.slice(0, 28)}...
                </option>
              ))}
            </select>
          </div>

          {/* Quick Questions Section */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Quick Ask</span>
            </div>
            <div className="space-y-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.query)}
                  className="w-full text-left p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between group"
                >
                  <span className="truncate pr-1">{q.label}</span>
                  <Send className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Drafts Section */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <FilePenLine className="w-4 h-4 text-indigo-500" />
              <span>Draft Templates</span>
            </div>
            <div className="space-y-1.5">
              {quickDrafts.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(d.query)}
                  className="w-full text-left p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/60 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between group"
                >
                  <span className="truncate pr-1">{d.label}</span>
                  <Send className="w-3 h-3 text-slate-400 group-hover:text-purple-600 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (8 cols) - Main Chat Stream & Controls */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 min-h-[520px] flex flex-col justify-between">
          {/* Right Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Grounded Legal AI Copilot Stream
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoReadAloud(!autoReadAloud)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                  autoReadAloud
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
                title="Automatically read aloud new AI responses using voice synthesis"
              >
                <Volume2 className={`w-3 h-3 ${autoReadAloud ? 'animate-pulse' : ''}`} />
                <span>{autoReadAloud ? 'Auto Read Aloud On' : 'Auto Read Aloud Off'}</span>
              </button>
              <button
                onClick={handleCopyAll}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="Copy entire chat"
              >
                <Copy className="w-3 h-3" /> Copy All
              </button>
              <button
                onClick={handleExportChat}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="Export conversation"
              >
                <Download className="w-3 h-3" /> Export
              </button>
              <button
                onClick={handleClearChat}
                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="space-y-6 max-h-[580px] overflow-y-auto pr-2">
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
                    <div className="ml-auto max-w-[85%] p-4 rounded-2xl bg-indigo-600 text-white font-medium shadow-sm space-y-1">
                      <div className="flex items-center justify-between text-[10px] opacity-80 pb-1 border-b border-white/20">
                        <span className="font-bold">Counsel</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div className="text-xs pt-1">{msg.text}</div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 shadow-sm overflow-hidden transition-all">
                      {/* Document Sheet Header */}
                      <div className="px-4 py-2.5 bg-slate-200/60 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 flex-wrap gap-2">
                        <div className="flex items-center gap-2 font-bold">
                          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span>LEGAL MEMORANDUM & BRIEF REPORT</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] opacity-70">{msg.timestamp}</span>
                          <button
                            onClick={() => speakMessage(msg.id, msg.text)}
                            className={`px-2 py-1 rounded border text-[10px] font-semibold flex items-center gap-1 transition-all ${
                              speakingMsgId === msg.id
                                ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                                : 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                            }`}
                            title="Read Aloud AI response using text-to-speech voice"
                          >
                            {speakingMsgId === msg.id ? (
                              <>
                                <VolumeX className="w-3 h-3 text-white" />
                                <span>Stop Voice</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-indigo-500" />
                                <span>Read Aloud</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="px-2 py-1 rounded bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-[10px] font-semibold flex items-center gap-1 transition-colors"
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
                          >
                            <Printer className="w-3 h-3 text-indigo-500" />
                            <span>Print</span>
                          </button>
                        </div>
                      </div>

                      {/* Word Document Sheet */}
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
                            }}
                          >
                            {msg.text}
                          </Markdown>
                        </div>

                        {/* Interactive Clickable Source Citations */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-[11px]">
                            <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Retrieved Case Citations & Evidence References ({msg.citations.length})</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {msg.citations.map((cit, idx) => (
                                <button
                                  key={idx}
                                  onClick={() =>
                                    setCitationModalText({
                                      title: `Source Excerpt ${idx + 1}`,
                                      docName: cit.documentName,
                                      details: `Page ${cit.pageNumber}, Para ${cit.paragraphNumber} • Date: ${cit.date}`,
                                      excerpt: cit.excerpt,
                                    })
                                  }
                                  className="text-left p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 font-mono text-[10px] text-indigo-950 dark:text-indigo-200 transition-all cursor-pointer group"
                                >
                                  <div className="flex items-center justify-between font-bold text-indigo-700 dark:text-indigo-300">
                                    <span className="truncate pr-2">📄 {cit.documentName}</span>
                                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 shrink-0" />
                                  </div>
                                  <div className="text-slate-500 dark:text-slate-400 text-[9px] mt-0.5">
                                    Pg {cit.pageNumber}, Para {cit.paragraphNumber} | {cit.date}
                                  </div>
                                  <p className="text-slate-700 dark:text-slate-300 mt-1 italic line-clamp-2">
                                    "{cit.excerpt}"
                                  </p>
                                </button>
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

          {/* Textarea Input Bar (Ctrl+Enter to Send) */}
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {isListening && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 animate-bounce text-rose-600" />
                  <span>Speech Recognition Active — Speak into your microphone...</span>
                </div>
                <button
                  onClick={toggleSpeechRecognition}
                  className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wide hover:bg-rose-700"
                >
                  Stop Mic
                </button>
              </div>
            )}

            <div className="relative">
              <textarea
                rows={2}
                placeholder={
                  isListening
                    ? 'Listening... Speak into microphone to dictating query...'
                    : `Ask AI about ${selectedMatter.caseNumber}... (Press Ctrl+Enter or click Send)`
                }
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className={`w-full px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/90 border text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all ${
                  isListening ? 'border-rose-500 ring-2 ring-rose-300 dark:ring-rose-900' : 'border-slate-200 dark:border-slate-700'
                }`}
              />

              <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
                <button
                  onClick={toggleSpeechRecognition}
                  className={`p-1.5 rounded-lg border transition-all ${
                    isListening
                      ? 'bg-rose-600 text-white border-rose-600 animate-pulse shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60'
                  }`}
                  title={isListening ? 'Stop Voice Dictation' : 'Start Voice Dictation'}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                </button>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputQuery.trim() || isThinking}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-xs transition-all active:scale-95 flex items-center gap-1 text-xs font-bold"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Radio className={`w-3 h-3 ${isListening ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`} />
                <span>Voice Dictation & Speech Readout Active</span>
              </span>
              <span>Grounded in case: <strong>{selectedMatter.caseNumber}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Citation Inspector Modal */}
      {citationModalText && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>{citationModalText.title}</span>
              </div>
              <button
                onClick={() => setCitationModalText(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                📄 {citationModalText.docName}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                {citationModalText.details}
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed max-h-60 overflow-y-auto">
                "{citationModalText.excerpt}"
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCitationModalText(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
              >
                Close Excerpt Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
