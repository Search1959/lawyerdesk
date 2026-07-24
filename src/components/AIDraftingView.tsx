import React, { useState } from 'react';
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
} from 'lucide-react';
import { Matter } from '../types';

interface AIDraftingViewProps {
  matters: Matter[];
  selectedMatter: Matter;
  onSelectMatter: (m: Matter) => void;
}

export const AIDraftingView: React.FC<AIDraftingViewProps> = ({
  matters,
  selectedMatter,
  onSelectMatter,
}) => {
  const [draftType, setDraftType] = useState<string>('Written Arguments');
  const [specificInstructions, setSpecificInstructions] = useState<string>('');
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const draftTypesList = [
    'Written Arguments',
    'Synopsis & List of Dates',
    'Appeal Draft',
    'Reply to Interim Application',
    'Affidavit in Evidence',
    'Legal Notice',
    'Bail Application',
    'Client Update Letter',
  ];

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matterId: selectedMatter.id,
          draftType,
          specificInstructions,
        }),
      });

      const data = await res.json();
      setGeneratedDraft(data.draft || 'Draft generation completed.');
    } catch (err) {
      console.error(err);
      setGeneratedDraft('Error generating draft. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            Production-Ready Court Pleadings, Written Arguments, Synopsis & Legal Notices
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

      {/* Main Studio Grid: Left Configuration, Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Pleading Configuration</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Draft Type</label>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {draftTypesList.map((dt) => (
                <button
                  key={dt}
                  onClick={() => setDraftType(dt)}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all ${
                    draftType === dt
                      ? 'bg-indigo-600 text-white font-bold shadow'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {dt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Specific Instructions / Emphasis
            </label>
            <textarea
              rows={4}
              placeholder="e.g., Emphasize non-compliance of 30-day cure period under EPC contract Clause 18.2; rely on BSES Rajdhani HC precedent..."
              value={specificInstructions}
              onChange={(e) => setSpecificInstructions(e.target.value)}
              className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleGenerateDraft}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Generating Legal Pleading...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate {draftType}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Preview Panel (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                LIVE COURT FORMAT
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {draftType} - {selectedMatter.caseNumber}
              </h2>
            </div>

            {generatedDraft && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Word / PDF</span>
                </button>
              </div>
            )}
          </div>

          {!generatedDraft && !isGenerating && (
            <div className="h-96 flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-2" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Select Draft Type & Click Generate</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                Generates complete formal High Court pleadings, including cause title, list of dates, legal grounds, precedents, and prayer clause.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="h-96 flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900">
              <Sparkles className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mb-2" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Synthesizing High Court Pleading...</h3>
              <p className="text-xs text-slate-500 mt-1">
                Integrating case facts, OCR extracts, contract clauses, and High Court precedents.
              </p>
            </div>
          )}

          {generatedDraft && !isGenerating && (
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-serif text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed max-h-[550px] overflow-y-auto whitespace-pre-wrap select-text shadow-inner">
              {generatedDraft}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
