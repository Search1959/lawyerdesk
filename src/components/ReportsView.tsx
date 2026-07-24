import React from 'react';
import { BarChart3, PieChart, TrendingUp, DollarSign, Scale, Award, Users } from 'lucide-react';

export const ReportsView: React.FC = () => {
  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" /> Legal Firm Intelligence & Practice Analytics
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Practice Performance & Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Key practice metrics, court victory ratios, billing realization rates, and associate utilization.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 dark:text-slate-500">
            <span>Litigation Win Rate</span>
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">84.2%</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">↑ 4.5% vs last year</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 dark:text-slate-500">
            <span>Annual Realized Fees</span>
            <DollarSign className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">₹1.48 Cr</div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">92% Realization Rate</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 dark:text-slate-500">
            <span>Active Litigation Matters</span>
            <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">48</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across High Court & District Benches</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 dark:text-slate-500">
            <span>Avg Case Duration</span>
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">14.2 Mos</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">↓ 3.1 Mos faster than benchmark</div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Practice Area Revenue Share */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
            Practice Area Revenue Breakdown
          </h3>
          <div className="space-y-3">
            {[
              { category: 'Commercial & High Court Suits', percentage: 42, revenue: '₹62,16,000', color: 'bg-indigo-600' },
              { category: 'Company & Insolvency (NCLT)', percentage: 28, revenue: '₹41,44,000', color: 'bg-blue-500' },
              { category: 'GST & Indirect Tax Writs', percentage: 18, revenue: '₹26,64,000', color: 'bg-emerald-500' },
              { category: 'Criminal & Special Leave Petitions', percentage: 12, revenue: '₹17,76,000', color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{item.category}</span>
                  <span className="text-slate-900 dark:text-white font-mono">{item.revenue} ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lawyer Utilization & Billable Hours */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
            Lawyer Utilization & Billable Hours (Current Month)
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Adv. Rajeshwar V. Sharma', role: 'Senior Lawyer', hours: 142, rate: '₹15,000/hr' },
              { name: 'Adv. Ananya Roy', role: 'Firm Admin / Counsel', hours: 168, rate: '₹12,000/hr' },
              { name: 'Adv. Vikramaditya Singh', role: 'Associate Lawyer', hours: 195, rate: '₹6,500/hr' },
            ].map((lawyer) => (
              <div key={lawyer.name} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{lawyer.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{lawyer.role} • {lawyer.rate}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">{lawyer.hours} Hrs</span>
                  <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">94% Target Met</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
