import React from 'react';
import {
  Scale,
  CalendarDays,
  FileText,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileSearch,
  Plus,
  Send,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Matter, Hearing, Document, AuditLog } from '../types';

interface DashboardViewProps {
  matters: Matter[];
  hearings: Hearing[];
  documents: Document[];
  auditLogs: AuditLog[];
  onSelectMatter: (matter: Matter) => void;
  onNavigateTab: (tab: any) => void;
  onOpenNewMatter: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  matters,
  hearings,
  documents,
  auditLogs,
  onSelectMatter,
  onNavigateTab,
  onOpenNewMatter,
}) => {
  const highRiskMatters = matters.filter((m) => m.riskLevel === 'High' || m.riskLevel === 'Critical');

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Dashboard Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Scale className="w-4 h-4" /> Practice Intelligence Dashboard
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Law Practice Master Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time intelligence on active court cases, cause list schedules, OCR document processing, and AI token utilization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewMatter}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Register New Case
          </button>
        </div>
      </div>

      {/* Metrics Row (4 Columns - Uniform Professional Styling) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Matters
          </div>
          <div className="text-2xl font-black mt-1 text-slate-900 dark:text-white">
            {matters.length}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            High Court & NCLT Benches
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Documents Processed
          </div>
          <div className="text-2xl font-black mt-1 text-slate-900 dark:text-white">
            42.8k
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            PaddleOCR Success: 99.8%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Upcoming Hearings
          </div>
          <div className="text-2xl font-black mt-1 text-slate-900 dark:text-white">
            {hearings.length}
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            {highRiskMatters.length} urgent hearings scheduled
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            AI Tokens Utilized
          </div>
          <div className="text-2xl font-black mt-1 text-slate-900 dark:text-white">
            1.2M
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Gemini Grounded RAG
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Dashboard Table + AI Assistant Command */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Priority Matters & Cause List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Matters Table Container */}
          <div className="border border-[#E2E8F0] dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <div className="px-4 py-3 border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Priority Matters Dashboard
              </h3>
              <button
                onClick={() => onNavigateTab('matters')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All Cases ({matters.length})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white dark:bg-slate-900 sticky top-0 border-b border-slate-100 dark:border-slate-800">
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Case Ref / Title</th>
                    <th className="px-4 py-3">Court / Forum</th>
                    <th className="px-4 py-3">AI Status</th>
                    <th className="px-4 py-3">Risk Score</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {matters.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => onSelectMatter(m)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs sm:text-sm transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white font-mono text-xs">{m.caseNumber}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{m.title}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 inline-block font-medium">
                          {m.court}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium text-xs">
                          <div className={`w-2 h-2 rounded-full ${m.riskLevel === 'High' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                          <span>{m.riskLevel === 'High' ? 'Reviewing Evidence' : 'Indexed & Mapped'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 w-32">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                m.riskScore > 50 ? 'bg-rose-500' : m.riskScore > 25 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${m.riskScore}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">{m.riskScore}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                          Explore →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Today's Cause List Card */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Today's Cause List & Board Status
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('hearings')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Full Schedule</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {hearings.map((hrg) => {
                const matter = matters.find((m) => m.id === hrg.matterId);
                return (
                  <div
                    key={hrg.id}
                    onClick={() => matter && onSelectMatter(matter)}
                    className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                          {hrg.courtName}
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{hrg.courtHallNo}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{hrg.date} at {hrg.time}</span>
                      </div>
                    </div>

                    <h4 className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-blue-600 transition-colors">
                      {matter ? matter.title : 'Legal Proceeding'}
                    </h4>

                    <div className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <div><strong className="text-slate-500">Bench:</strong> {hrg.judgeName}</div>
                      <div><strong className="text-slate-500">Stage:</strong> {hrg.stage}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): AI Command Box & Urgent Deadlines */}
        <div className="space-y-6">
          {/* AI Assistant Command Box (Dark theme block matching Professional Polish) */}
          <div className="bg-[#0F172A] rounded-xl p-5 text-white flex flex-col gap-4 shadow-lg border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">AI Assistant Command</h3>
              </div>
              <span className="text-[10px] bg-blue-500/80 px-1.5 py-0.5 rounded font-mono font-bold">Neural V4</span>
            </div>

            <div className="bg-slate-800/70 rounded-lg p-3 text-xs font-mono text-blue-300 border border-slate-700 leading-relaxed max-h-48 overflow-y-auto">
              <span className="text-slate-400">User: "Summarize PW2 testimony contradictions"</span>
              <br /><br />
              <span className="text-slate-200">AI groundings found across 3 PDF filings:</span>
              <br />
              - PW2 claims site presence at 10:00 AM (Exh. 42).
              <br />
              - CCTV digital log records entry at 11:35 AM (Exh. 56).
              <br />
              <button
                onClick={() => onNavigateTab('ai_drafting')}
                className="text-[#38BDF8] underline mt-1 hover:text-white font-sans text-[11px] block text-left"
              >
                → Click to draft cross-examination note
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Ask AI about any matter or section..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onNavigateTab('ai_chat');
                }}
                className="w-full bg-slate-800 border-slate-700 border rounded-lg pl-3 pr-10 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
              />
              <button
                onClick={() => onNavigateTab('ai_chat')}
                className="absolute right-2 top-2 text-[#38BDF8] hover:text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Urgent Deadlines Card */}
          <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
              <span>Urgent Deadlines</span>
              <span className="text-[10px] text-rose-500 font-normal">Next 48 Hours</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 border-l-4 border-rose-500 pl-3 py-0.5">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Written Submission Due</div>
                  <div className="text-[10px] text-slate-500 truncate">Matter: NCLT/M/772 • Tomorrow</div>
                </div>
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400 shrink-0">23h</div>
              </div>

              <div className="flex items-center gap-3 border-l-4 border-orange-500 pl-3 py-0.5">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Vakalatnama Signature</div>
                  <div className="text-[10px] text-slate-500 truncate">Matter: TAX/IT/112 • Wednesday</div>
                </div>
                <div className="text-xs font-bold text-orange-600 dark:text-orange-400 shrink-0">48h</div>
              </div>

              <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-3 py-0.5">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Rejoinder Affidavit Filing</div>
                  <div className="text-[10px] text-slate-500 truncate">Matter: CIVIL/2024/0981 • Friday</div>
                </div>
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">72h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

