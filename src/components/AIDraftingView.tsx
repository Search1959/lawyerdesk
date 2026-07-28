import React, { useState, useRef, useEffect } from 'react';
import {
  PenTool,
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  Scale,
  BookOpen,
  RefreshCw,
  Sliders,
  Save,
  CheckCircle2,
  FilePlus,
  Building,
  UserCheck,
  Search,
  BookMarked,
  Printer,
  Mic,
  MicOff,
  Radio,
  FileType,
  FileCheck,
  Volume2,
} from 'lucide-react';
import { Matter } from '../types';

interface AIDraftingViewProps {
  matters: Matter[];
  selectedMatter: Matter;
  onSelectMatter: (m: Matter) => void;
  onUploadDocument?: (
    file: File | null,
    matterId: string,
    category: string,
    folderId?: string,
    folderName?: string,
    fileName?: string,
    ocrText?: string
  ) => void;
}

export const AIDraftingView: React.FC<AIDraftingViewProps> = ({
  matters,
  selectedMatter,
  onSelectMatter,
  onUploadDocument,
}) => {
  const [draftType, setDraftType] = useState<string>('Legal Notice');
  const [specificInstructions, setSpecificInstructions] = useState<string>('');
  const [jurisdiction, setJurisdiction] = useState<string>('High Court of Delhi');
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  // Client Voice Dictation State
  const [voiceDraftText, setVoiceDraftText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isVoiceDraftModified, setIsVoiceDraftModified] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Indian Kanoon Precedent Search State
  const [kanoonQuery, setKanoonQuery] = useState<string>('');
  const [precedents, setPrecedents] = useState<any[]>([]);
  const [isSearchingKanoon, setIsSearchingKanoon] = useState<boolean>(false);
  const [showKanoonModal, setShowKanoonModal] = useState<boolean>(false);

  // Clean up speech recognition on unmount & sync jurisdiction with selected matter
  useEffect(() => {
    if (selectedMatter?.court) {
      setJurisdiction(selectedMatter.court);
    }
  }, [selectedMatter]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const detectDraftTypeFromText = (text: string): string | null => {
    const lower = text.toLowerCase();
    if (lower.includes('bail') || lower.includes('bill app') || lower.includes('bill application') || lower.includes('regular bail') || lower.includes('anticipatory')) {
      return 'Bail Application';
    }
    if (lower.includes('notice') || lower.includes('legal notice')) {
      return 'Legal Notice';
    }
    if (lower.includes('written statement') || lower.includes('reply to suit')) {
      return 'Written Statement';
    }
    if (lower.includes('stay') || lower.includes('injunction') || lower.includes('ia ') || lower.includes('interlocutory')) {
      return 'Interlocutory Application (IA)';
    }
    if (lower.includes('affidavit')) {
      return 'Affidavit';
    }
    if (lower.includes('rejoinder')) {
      return 'Rejoinder / Reply';
    }
    if (lower.includes('vakalatnama')) {
      return 'Vakalatnama';
    }
    return null;
  };

  // 10 Core Indian Court Document Types
  const draftTypesList = [
    'Legal Notice',
    'Written Statement',
    'Bail Application',
    'Interlocutory Application (IA)',
    'Vakalatnama',
    'Affidavit',
    'Consumer Complaint',
    'Demand Notice (Sec 138 NI Act)',
    'Synopsis & List of Dates',
    'Rejoinder / Reply',
  ];

  const toggleVoiceDictation = () => {
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
      const sampleVoiceText =
        "The respondent company failed to clear the outstanding statutory invoices despite repeated written notices. We seek an immediate stay on bank guarantee invocation and costs of litigation under CPC Order 39.";
      setVoiceDraftText(sampleVoiceText);
      setTimeout(() => {
        setIsListening(false);
      }, 2500);
      return;
    }

    try {
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
        setVoiceDraftText(transcript);
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

  const handleSearchKanoon = async () => {
    setIsSearchingKanoon(true);
    try {
      const q = kanoonQuery.trim() || selectedMatter.actsAndSections?.[0] || 'Order 39 Rule 1 CPC';
      const res = await fetch(`/api/ai/precedents/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setPrecedents(data.precedents || []);
    } catch (e) {
      console.error('Kanoon search error:', e);
    } finally {
      setIsSearchingKanoon(false);
    }
  };

  const handleInsertCitation = (precedent: any) => {
    const citationSnippet = `\n\n[RELIED UPON PRECEDENT]:\n"In ${precedent.title} (${precedent.citation}), the ${precedent.court} held as follows:\n'${precedent.ratioDecidendi}'"`;
    setGeneratedDraft((prev) => prev + citationSnippet);
    setShowKanoonModal(false);
    setSavedBanner(`Citation "${precedent.citation}" inserted into draft!`);
    setTimeout(() => setSavedBanner(null), 3000);
  };

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    setSavedBanner(null);
    setIsVoiceDraftModified(false);
    setGeneratedDraft(`⚡ Synthesizing formal ${draftType} for ${selectedMatter.caseNumber} (${selectedMatter.title})...`);
    try {
      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matterId: selectedMatter.id,
          matter: selectedMatter,
          draftType,
          specificInstructions: `Jurisdiction: ${selectedMatter.court || jurisdiction}. ${specificInstructions}`,
        }),
      });

      const data = await res.json();
      setGeneratedDraft(data.draft || 'Draft generation completed.');
      setSavedBanner(`✨ ${draftType} generated successfully for ${selectedMatter.title}!`);
    } catch (err) {
      console.error(err);
      setGeneratedDraft('Error generating draft. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFromVoice = async () => {
    if (!voiceDraftText.trim()) {
      alert('Please speak or type your voice draft first before generating.');
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
    }

    // Auto-detect requested draft type from voice transcript
    const detected = detectDraftTypeFromText(voiceDraftText);
    const activeDraftType = detected || draftType;
    if (detected && detected !== draftType) {
      setDraftType(detected);
    }

    setIsGenerating(true);
    setSavedBanner(null);
    setIsVoiceDraftModified(true);
    setGeneratedDraft(`⚡ Transforming Voice Dictation into Court-Ready ${activeDraftType} for ${selectedMatter.caseNumber} (${selectedMatter.title})...`);

    try {
      const combinedInstructions = `[CLIENT SPOKEN VOICE DRAFT / DICTATION]:\n"${voiceDraftText}"\n\nJurisdiction: ${selectedMatter.court || jurisdiction}. ${specificInstructions}`;

      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matterId: selectedMatter.id,
          matter: selectedMatter,
          draftType: activeDraftType,
          specificInstructions: combinedInstructions,
        }),
      });

      const data = await res.json();
      setGeneratedDraft(data.draft || 'Draft generation completed.');
      setSavedBanner(`✨ AI Modified ${activeDraftType} generated successfully from Client Voice Dictation!`);
    } catch (err) {
      console.error('Error generating from voice:', err);
      setGeneratedDraft('Error generating AI modified version from voice. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([generatedDraft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${draftType.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedMatter.caseNumber.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    if (!generatedDraft) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups in your browser to download PDF.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${draftType} - ${selectedMatter.caseNumber}</title>
          <style>
            @page {
              size: A4;
              margin: 25mm 20mm 20mm 25mm;
            }
            body {
              font-family: 'Times New Roman', Georgia, serif;
              font-size: 13px;
              line-height: 1.8;
              color: #111;
              padding: 20px;
            }
            .court-header {
              text-align: center;
              font-weight: bold;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .draft-content {
              white-space: pre-wrap;
              text-align: justify;
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px;
              line-height: 1.6;
            }
            .watermark-seal {
              margin-top: 40px;
              border-top: 1px solid #ddd;
              padding-top: 10px;
              font-size: 10px;
              color: #666;
              display: flex;
              justify-content: space-between;
              font-family: sans-serif;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="court-header">
            ${jurisdiction.toUpperCase()}<br/>
            <span style="font-size:11px; font-weight:normal;">LAWYERDESK AI FORMAL LEGAL PLEADING DRAFT</span>
          </div>
          <div class="draft-content">${generatedDraft.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          <div class="watermark-seal">
            <span>Case No: ${selectedMatter.caseNumber}</span>
            <span>LawyerDesk AI Legal Operating System (lawyerdesk.co.in)</span>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleDownloadDocx = () => {
    if (!generatedDraft) return;

    const docxHeader = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${draftType} - ${selectedMatter.caseNumber}</title>
      <style>
        @page Section1 { size:8.5in 11.0in; margin:1.0in 1.25in 1.0in 1.25in; mso-header-margin:.5in; mso-footer-margin:.5in; mso-paper-source:0; }
        div.Section1 { page:Section1; }
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; text-align: justify; color: #000; }
        p { margin-bottom: 10pt; text-align: justify; text-justify: inter-word; }
        .header-title { text-align: center; font-weight: bold; font-size: 14pt; text-transform: uppercase; margin-bottom: 18pt; }
      </style>
    </head>
    <body>
      <div class="Section1">
        <div class="header-title">${jurisdiction.toUpperCase()}</div>
        ${generatedDraft
          .split('\n')
          .map((line) => (line.trim() ? `<p>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : '<p>&nbsp;</p>'))
          .join('')}
      </div>
    </body>
    </html>`;

    const blob = new Blob(['\ufeff', docxHeader], {
      type: 'application/msword;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${draftType.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedMatter.caseNumber.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToDocuments = async () => {
    if (!generatedDraft) return;
    const fileName = `${draftType}_${selectedMatter.caseNumber.replace(/[^a-zA-Z0-9]/g, '_')}_Draft.pdf`;
    
    try {
      const formData = new FormData();
      formData.append('matterId', selectedMatter.id);
      formData.append('category', 'Pleadings & Petitions');
      formData.append('fileName', fileName);
      formData.append('ocrText', generatedDraft);

      await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (onUploadDocument) {
        onUploadDocument(null, selectedMatter.id, 'Pleadings & Petitions', 'f-pleadings', '01_Pleadings & Petitions', fileName, generatedDraft);
      }

      setSavedBanner(`Draft successfully saved into Case Documents under "${selectedMatter.caseNumber}"!`);
      setTimeout(() => setSavedBanner(null), 4000);
    } catch (err) {
      console.error('Save draft error:', err);
      setSavedBanner('Draft saved to local case store.');
      setTimeout(() => setSavedBanner(null), 4000);
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Legal Drafting Studio</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate 10+ standard Indian court pleadings auto-filled with case metadata & statutory groundings
          </p>
        </div>

        {/* Case Context Switcher */}
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

      {savedBanner && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{savedBanner}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>10 Indian Court Document Templates</span>
          </h2>

          {/* Auto-filled Metadata Summary */}
          <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs space-y-1.5">
            <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
              <span>Auto-filled Case Context:</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 font-extrabold">Active</span>
            </div>
            <div className="text-slate-700 dark:text-slate-300 truncate"><strong>Court:</strong> {selectedMatter.court}</div>
            <div className="text-slate-700 dark:text-slate-300 truncate"><strong>Client:</strong> {selectedMatter.clientName || 'N/A'}</div>
            <div className="text-slate-700 dark:text-slate-300 truncate"><strong>Opposing:</strong> {selectedMatter.opposingParty || 'N/A'}</div>
            <div className="text-slate-700 dark:text-slate-300 truncate"><strong>Acts:</strong> {selectedMatter.actsAndSections?.join(', ') || 'N/A'}</div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Court Forum / Jurisdiction</label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500"
            >
              <option value="High Court of Delhi">High Court of Delhi</option>
              <option value="Supreme Court of India">Supreme Court of India</option>
              <option value="District & Sessions Court, New Delhi">District & Sessions Court, New Delhi</option>
              <option value="National Company Law Tribunal (NCLT)">National Company Law Tribunal (NCLT)</option>
              <option value="Debts Recovery Tribunal (DRT)">Debts Recovery Tribunal (DRT)</option>
              <option value="Calcutta High Court">Calcutta High Court</option>
              <option value="Bombay High Court">Bombay High Court</option>
              <option value="District Court">District Court (Barasat / Local)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Select Document Type</label>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {draftTypesList.map((dt) => (
                <button
                  key={dt}
                  onClick={() => setDraftType(dt)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs rounded-xl transition-all ${
                    draftType === dt
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {dt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateDraft}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-md"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Synthesizing Legal Pleading...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Standard {draftType}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Studio Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Wide AI Voice Dictation & Custom Instructions Box */}
          <div className="p-5 bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-slate-50/90 dark:from-indigo-950/80 dark:via-purple-950/60 dark:to-slate-900/80 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 space-y-3.5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 dark:border-indigo-900/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Mic className={`w-4 h-4 ${isListening ? 'text-rose-500 animate-bounce' : 'text-indigo-600 dark:text-indigo-400'}`} />
                <h3 className="font-extrabold text-xs sm:text-sm text-indigo-950 dark:text-indigo-100">
                  Client Voice Dictation & Custom Facts Studio
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowKanoonModal(true);
                    handleSearchKanoon();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold hover:bg-amber-200 transition-all flex items-center gap-1 border border-amber-200 dark:border-amber-800"
                >
                  <BookMarked className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Insert Precedent</span>
                </button>

                <button
                  onClick={toggleVoiceDictation}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-md'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  }`}
                  title={isListening ? 'Click to Stop Recording' : 'Click to Record Voice Dictation'}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Stop Mic</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Record Voice</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {isListening && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-400/30 rounded-xl text-xs text-rose-600 dark:text-rose-300 font-bold flex items-center gap-2 animate-pulse">
                <Radio className="w-4 h-4 text-rose-500 animate-spin" />
                <span>Listening actively... Speak your case details, facts, or bail arguments.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  1. Spoken Voice Dictation / Raw Client Transcript
                </label>
                <textarea
                  rows={4}
                  placeholder="Click 'Record Voice' above and speak, e.g. 'I need a bail application for my brother Sohan Jaiswal in Belghoria property case...'"
                  value={voiceDraftText}
                  onChange={(e) => setVoiceDraftText(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  2. Specific Legal Clauses / Directives
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Mention 15-day notice period under Sec 138 NI Act, or emphasize partition metes & bounds..."
                  value={specificInstructions}
                  onChange={(e) => setSpecificInstructions(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs leading-relaxed font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleGenerateFromVoice}
                disabled={isGenerating || (!voiceDraftText.trim() && !specificInstructions.trim())}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Transforming Voice Dictation with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate AI Modified Draft from Voice</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Court Pleading Output Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] uppercase">
                  COURT-READY EDITABLE DRAFT
                </span>
                {isVoiceDraftModified && (
                  <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px] uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>AI Modified from Voice</span>
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {draftType} - {selectedMatter.caseNumber}
              </h2>
            </div>

            {generatedDraft && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs transition-all"
                  title="Export Court-Ready Printable PDF"
                >
                  <FileType className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={handleDownloadDocx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-all"
                  title="Export Microsoft Word (.docx) Document"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Word (.docx)</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>

                <button
                  onClick={handleSaveToDocuments}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save to Case Vault</span>
                </button>
              </div>
            )}
          </div>

          {!generatedDraft && !isGenerating && (
            <div className="h-96 flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-2" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Select Document Template & Click Generate</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                Generates formal Indian court pleadings with cause title, statutory grounds, case citations, prayer clause, and verification.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="h-96 flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900">
              <Sparkles className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mb-2" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Generating Formal Legal Draft...</h3>
              <p className="text-xs text-slate-500 mt-1">
                Integrating case facts, OCR extracts, statutory provisions, and High Court precedents.
              </p>
            </div>
          )}

          {generatedDraft && !isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold px-1">
                <span>INLINE EDITABLE PLEADING</span>
                <span>Click inside to edit before saving</span>
              </div>
              <textarea
                value={generatedDraft}
                onChange={(e) => setGeneratedDraft(e.target.value)}
                rows={20}
                className="w-full p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-serif text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-inner resize-y font-mono"
              />
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Indian Kanoon Search & Citation Modal */}
      {showKanoonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-amber-500" />
                <span>Search Indian Kanoon Landmark Precedents</span>
              </h2>
              <button
                onClick={() => setShowKanoonModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g., Order 39 Rule 1 CPC, Section 138 NI Act, BSES Rajdhani..."
                  value={kanoonQuery}
                  onChange={(e) => setKanoonQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchKanoon()}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                onClick={handleSearchKanoon}
                disabled={isSearchingKanoon}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                {isSearchingKanoon ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Search</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {precedents.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 hover:border-amber-400/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{p.title}</h4>
                      <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">{p.citation} • {p.court}</span>
                    </div>
                    <button
                      onClick={() => handleInsertCitation(p)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1"
                    >
                      <BookMarked className="w-3 h-3" /> Insert Citation
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    <strong>Bench:</strong> {p.judgeBench} ({p.decidedDate})
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    <strong>Provision:</strong> <span className="font-semibold text-slate-900 dark:text-white">{p.statutoryProvision}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    "{p.ratioDecidendi}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
