import React, { useState } from 'react';
import { Bell, Clock, AlertTriangle, Search, Plus, CheckCircle, ShieldAlert, Trash2 } from 'lucide-react';
import { Reminder } from '../types';
import { mockReminders, mockMatters } from '../data/mockData';
import { saveDocument, removeDocument } from '../lib/firebase';

export const RemindersView: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

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

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">Due: {r.dueDate}</div>
                <div className="text-xs text-rose-600 dark:text-rose-400 font-extrabold">{r.daysRemaining} Days Remaining</div>
              </div>

              <button
                onClick={() => toggleStatus(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  r.status === 'Completed'
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
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
    </div>
  );
};
