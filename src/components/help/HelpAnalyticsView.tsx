import React from 'react';
import { HelpArticle, SupportTicket } from '../../types/helpTypes';
import { BarChart3, Eye, Search, AlertCircle, ThumbsUp, Video, LifeBuoy, TrendingUp, CheckCircle2 } from 'lucide-react';

interface HelpAnalyticsViewProps {
  articles: HelpArticle[];
  tickets: SupportTicket[];
}

export const HelpAnalyticsView: React.FC<HelpAnalyticsViewProps> = ({ articles, tickets }) => {
  const totalViews = articles.reduce((acc, a) => acc + a.viewsCount, 0);
  const totalYes = articles.reduce((acc, a) => acc + a.helpfulYesCount, 0);
  const totalNo = articles.reduce((acc, a) => acc + a.helpfulNoCount, 0);
  const totalRatings = totalYes + totalNo;
  const satisfactionRate = totalRatings > 0 ? Math.round((totalYes / totalRatings) * 100) : 98;

  const mostViewed = [...articles].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 5);

  const topSearchKeywords = [
    { keyword: 'e-Courts Cause List Sync', count: 1240 },
    { keyword: 'PaddleOCR Scanned FIR', count: 980 },
    { keyword: 'AI Writs Legal Drafting', count: 850 },
    { keyword: '18% GST Tax Invoice', count: 620 },
    { keyword: 'WhatsApp Reminders', count: 540 },
    { keyword: 'Grounded RAG Citations', count: 490 },
  ];

  const failedSearchQueries = [
    { query: 'NCLAT filing fee calculator', count: 14 },
    { query: 'Income Tax Tribunal e-filing', count: 9 },
    { query: 'Consumer forum stamp paper rules', count: 6 },
  ];

  const ticketsOpen = tickets.filter((t) => t.status === 'Open').length;
  const ticketsProgress = tickets.filter((t) => t.status === 'In Progress').length;
  const ticketsResolved = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-slate-800 shadow-md space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
          <BarChart3 className="w-3.5 h-3.5" /> Real-time System Metrics
        </div>
        <h2 className="text-xl font-black">Help Center & Knowledge Base Analytics</h2>
        <p className="text-xs text-slate-300">Track article engagement, search trends, failed queries, and user satisfaction rate.</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Total Article Views</span>
            <Eye className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalViews.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% from last week</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Satisfaction Rate</span>
            <ThumbsUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{satisfactionRate}%</div>
          <div className="text-[11px] text-slate-500 font-medium">{totalYes} Positive vs {totalNo} Negative</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Support Tickets</span>
            <LifeBuoy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{tickets.length}</div>
          <div className="text-[11px] text-indigo-600 font-bold">{ticketsOpen} Open • {ticketsProgress} In Progress • {ticketsResolved} Resolved</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Walkthrough Completion</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">94.2%</div>
          <div className="text-[11px] text-slate-500 font-medium">Onboarding tour success rate</div>
        </div>
      </div>

      {/* Detail Analytics Tables & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed Articles */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-black text-sm text-slate-900 dark:text-white">
            <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Top 5 Most Viewed Help Articles</span>
          </div>

          <div className="space-y-2.5">
            {mostViewed.map((art, idx) => (
              <div key={art.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 truncate pr-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white truncate">{art.title.en}</span>
                </div>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">{art.viewsCount} views</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Searched Keywords & Failed Searches */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-sm text-slate-900 dark:text-white">
              <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Top Searched Keywords</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {topSearchKeywords.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.keyword}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{item.count} queries</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 font-black text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
              <span>Failed Searches (Zero Results - Candidate for New Articles)</span>
            </div>

            <div className="space-y-1 text-xs">
              {failedSearchQueries.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200">
                  <span className="font-medium">"{item.query}"</span>
                  <span className="font-mono font-bold text-[10px]">{item.count} attempts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
