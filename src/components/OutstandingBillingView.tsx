import React, { useState } from 'react';
import { AlertCircle, Search, Send, FileText, CheckCircle, Clock, DollarSign, ArrowUpRight } from 'lucide-react';
import { Invoice } from '../types';
import { mockInvoices, mockClients } from '../data/mockData';

export const OutstandingBillingView: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [reminderSent, setReminderSent] = useState<{ [id: string]: boolean }>({});

  const pendingInvoices = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
  const totalOutstandingINR = pendingInvoices.reduce((acc, i) => acc + i.totalINR, 0);

  const handleSendReminder = (invoiceId: string) => {
    setReminderSent({ ...reminderSent, [invoiceId]: true });
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" /> Billing Collections & Overdue Aging
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Outstanding Fees & Collections</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track unpaid legal fee invoices, GST tax disbursements, and automated client payment reminders.
          </p>
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-4 rounded-xl text-right">
          <div className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400">Total Outstanding Fees</div>
          <div className="text-2xl font-black text-rose-900 dark:text-rose-300">
            ₹{totalOutstandingINR.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Aging Breakdown Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">0 - 30 Days Due</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            ₹{pendingInvoices.filter(i => i.status === 'Pending').reduce((a, b) => a + b.totalINR, 0).toLocaleString()}
          </div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">Normal billing period</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">31 - 60 Days Overdue</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            ₹1,85,000
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">First reminder trigger</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">60+ Days Overdue</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            ₹3,54,000
          </div>
          <div className="text-xs text-rose-600 font-medium mt-1">Action required</div>
        </div>
      </div>

      {/* Outstanding Invoices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
            Pending Client Invoices ({pendingInvoices.length})
          </h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                <th className="p-3">Invoice #</th>
                <th className="p-3">Client Name</th>
                <th className="p-3">Fee Category</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Total (Incl GST)</th>
                <th className="p-3 text-right">Reminder Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {pendingInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">{inv.invoiceNumber}</td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">{inv.clientName}</td>
                  <td className="p-3 text-xs text-slate-600 dark:text-slate-300">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium">{inv.feeType}</span>
                  </td>
                  <td className="p-3 text-xs font-mono text-slate-600 dark:text-slate-400">{inv.issueDate}</td>
                  <td className="p-3 text-xs font-mono text-rose-600 dark:text-rose-400 font-bold">{inv.dueDate}</td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white">₹{inv.totalINR.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    {reminderSent[inv.id] ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5" /> Reminder Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendReminder(inv.id)}
                        className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" /> Send Fee Alert
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
