import React, { useState } from 'react';
import { Bell, Clock, AlertTriangle, Search, Plus, CheckCircle, ShieldAlert, Trash2, MessageCircle, Send, Zap, CheckCircle2, RefreshCw } from 'lucide-react';
import { Reminder } from '../types';
import { mockReminders, mockMatters } from '../data/mockData';
import { saveDocument, removeDocument } from '../lib/firebase';
import { WhatsAppReminderModal } from './WhatsAppReminderModal';
import { WhatsAppReminderData } from '../lib/whatsapp';

export const RemindersView: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [whatsappModalData, setWhatsappModalData] = useState<WhatsAppReminderData | null>(null);

  // Cron schedule engine state
  const [cronSchedule, setCronSchedule] = useState('0 8 * * *');
  const [scheduleName, setScheduleName] = useState('Daily Morning 08:00 AM IST (Cause List & Statutory Deadline Sync)');
  const [cronActive, setCronActive] = useState(true);
  const [isExecutingCron, setIsExecutingCron] = useState(false);
  const [lastCronResult, setLastCronResult] = useState<{
    success: boolean;
    lastExecuted: string;
    nextRun: string;
    dispatchedCount: number;
    logs: string[];
  } | null>(null);

  const handleRunCronNow = async () => {
    setIsExecutingCron(true);
    try {
      const res = await fetch('/api/whatsapp/cron-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cronExpression: cronSchedule,
          scheduleRule: scheduleName,
          itemsToNotify: reminders.filter((r) => r.status === 'Pending'),
        }),
      });
      const data = await res.json();
      setLastCronResult({
        success: data.success,
        lastExecuted: data.lastExecuted,
        nextRun: data.nextScheduledRun,
        dispatchedCount: data.dispatchedCount,
        logs: data.logs || [],
      });
    } catch (err) {
      console.error('Error running cron dispatch:', err);
    } finally {
      setIsExecutingCron(false);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (window.confirm('Delete this deadline reminder?')) {
      try {
        await removeDocument('reminders', id);
      } catch (err) {
        console.warn('Error removing reminder:', err);
      }
      setReminders((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const [newRem, setNewRem] = useState({
    matterId: mockMatters[0]?.id || '',
    title: '',
    type: 'Order Compliance' as Reminder['type'],
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Critical' as Reminder['priority'],
  });

  const filteredReminders = reminders.filter((r) => {
    const text = `${r.title} ${r.type} ${r.matterTitle}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const toggleStatus = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, status: r.status === 'Pending' ? 'Completed' : 'Pending' } : r));
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const matter = mockMatters.find(m => m.id === newRem.matterId);
    const created: Reminder = {
      id: `rem-${Date.now()}`,
      matterId: newRem.matterId,
      matterTitle: matter ? `${matter.caseNumber} - ${matter.title}` : 'General Limitation Deadline',
      title: newRem.title,
      type: newRem.type,
      dueDate: newRem.dueDate,
      daysRemaining: 10,
      priority: newRem.priority,
      status: 'Pending',
    };
    setReminders([created, ...reminders]);
    setShowAddModal(false);
    setNewRem({
      matterId: mockMatters[0]?.id || '',
      title: '',
      type: 'Order Compliance',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'Critical',
    });
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Bell className="w-4 h-4" /> Statutory Limitation & Statutory Deadlines
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Court Deadline & Reminders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automated limitation period countdowns, Order 39 interim compliance, and stamp deposit alerts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Statutory Deadline
        </button>
      </div>

      {/* Cron Schedule Engine Configuration Bar */}
      <div className="bg-emerald-950/40 border border-emerald-800/60 p-5 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-sm">Automated WhatsApp Cron Dispatch Engine</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                  {cronActive ? 'CRON ACTIVE' : 'PAUSED'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automated background WhatsApp dispatch trigger for limitation deadlines & court hearing alerts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunCronNow}
              disabled={isExecutingCron}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
            >
              {isExecutingCron ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{isExecutingCron ? 'Running Cron...' : 'Run Cron Dispatch Job Now'}</span>
            </button>
            <button
              onClick={() => setCronActive(!cronActive)}
              className={`px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                cronActive
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {cronActive ? 'Pause Cron' : 'Enable Cron'}
            </button>
          </div>
        </div>

        {/* Cron Schedule Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-emerald-900/60 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-emerald-300 uppercase mb-1">
              Select Dispatch Cron Rule
            </label>
            <select
              value={cronSchedule}
              onChange={(e) => {
                setCronSchedule(e.target.value);
                if (e.target.value === '0 8 * * *') setScheduleName('Daily Morning 08:00 AM IST (Cause List & Deadline Sync)');
                else if (e.target.value === '0 9 * * *') setScheduleName('3 Days Before Statutory Deadline at 09:00 AM IST');
                else if (e.target.value === '0 18 * * *') setScheduleName('1 Day Before Statutory Deadline Evening Alert (06:00 PM IST)');
                else if (e.target.value === '30 7 * * *') setScheduleName('Morning of Court Hearing Date (07:30 AM IST)');
              }}
              className="w-full bg-slate-900/90 border border-emerald-800 text-white rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500"
            >
              <option value="0 8 * * *">0 8 * * * - Daily Morning 08:00 AM IST</option>
              <option value="0 9 * * *">0 9 * * * - 3 Days Before Deadline at 09:00 AM IST</option>
              <option value="0 18 * * *">0 18 * * * - 1 Day Before Evening Alert (06:00 PM IST)</option>
              <option value="30 7 * * *">30 7 * * * - Morning of Court Hearing Date (07:30 AM IST)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-emerald-300 uppercase mb-1">Cron Expression</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={cronSchedule}
                onChange={(e) => setCronSchedule(e.target.value)}
                className="w-full bg-slate-900/90 border border-emerald-800 text-white font-mono rounded-lg p-2 text-xs"
              />
              <span className="text-[10px] text-emerald-400 font-mono whitespace-nowrap">IST</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-emerald-300 uppercase mb-1">Active Rule Description</label>
            <div className="bg-slate-900/90 border border-emerald-800/80 p-2 rounded-lg text-slate-300 text-xs truncate">
              {scheduleName}
            </div>
          </div>
        </div>

        {/* Last Cron Run Result Log */}
        {lastCronResult && (
          <div className="p-3 bg-slate-900/90 border border-emerald-700/60 rounded-xl text-xs space-y-1 animate-in fade-in">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Cron Job Executed at {lastCronResult.lastExecuted} IST
              </span>
              <span>Next Scheduled Run: {lastCronResult.nextRun}</span>
            </div>
            <div className="text-slate-300 font-mono text-[11px] space-y-0.5">
              {lastCronResult.logs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search deadline title, type, or case..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.map((r) => (
          <div
            key={r.id}
            className={`p-5 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              r.status === 'Completed'
                ? 'opacity-60 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    r.priority === 'Critical'
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                      : r.priority === 'High'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300'
                  }`}
                >
                  {r.priority} Priority
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {r.type}
                </span>
              </div>

              <h3 className={`font-bold text-base text-slate-900 dark:text-white ${r.status === 'Completed' ? 'line-through' : ''}`}>
                {r.title}
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{r.matterTitle}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">Due: {r.dueDate}</div>
                <div className="text-xs text-rose-600 dark:text-rose-400 font-extrabold">{r.daysRemaining} Days Remaining</div>
              </div>

              <button
                onClick={() =>
                  setWhatsappModalData({
                    recipientName: r.matterTitle.split('-')[1]?.trim() || 'Client Entity',
                    recipientPhone: '+91 98765 43210',
                    reminderType: 'STATUTORY_LIMITATION',
                    caseTitle: r.title,
                    caseNumber: r.matterTitle.split('-')[0]?.trim() || 'CS/420/2024',
                    dueDate: r.dueDate,
                    statutoryType: r.type,
                    daysRemaining: r.daysRemaining,
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                title="Send WhatsApp Statutory Deadline Reminder"
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span>WhatsApp Alert</span>
              </button>

              <button
                onClick={() => toggleStatus(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  r.status === 'Completed'
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                }`}
              >
                {r.status === 'Completed' ? 'Mark Pending' : 'Mark Done'}
              </button>

              <button
                onClick={() => handleDeleteReminder(r.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-all"
                title="Delete Deadline Reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Statutory Limitation Deadline</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Select Case / Matter</label>
                <select
                  value={newRem.matterId}
                  onChange={(e) => setNewRem({ ...newRem, matterId: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {mockMatters.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.caseNumber} - {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Deadline Title</label>
                <input
                  type="text"
                  required
                  value={newRem.title}
                  onChange={(e) => setNewRem({ ...newRem, title: e.target.value })}
                  placeholder="e.g. Deposit Ad Valorem Court Stamp Fees"
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Type</label>
                  <select
                    value={newRem.type}
                    onChange={(e) => setNewRem({ ...newRem, type: e.target.value as any })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Limitation Period">Limitation Period</option>
                    <option value="Order Compliance">Order Compliance</option>
                    <option value="Court Fee Deposit">Court Fee Deposit</option>
                    <option value="Evidence Filing">Evidence Filing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Priority</label>
                  <select
                    value={newRem.priority}
                    onChange={(e) => setNewRem({ ...newRem, priority: e.target.value as any })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={newRem.dueDate}
                  onChange={(e) => setNewRem({ ...newRem, dueDate: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Save Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Reminder Modal */}
      {whatsappModalData && (
        <WhatsAppReminderModal
          isOpen={!!whatsappModalData}
          onClose={() => setWhatsappModalData(null)}
          initialData={whatsappModalData}
        />
      )}
    </div>
  );
};
