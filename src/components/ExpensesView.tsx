import React, { useState } from 'react';
import { Receipt, Search, Plus, Filter, FileText, CheckCircle, DollarSign, Calendar, Trash2 } from 'lucide-react';
import { Expense } from '../types';
import { mockExpenses, mockMatters } from '../data/mockData';
import { saveDocument, removeDocument } from '../lib/firebase';

export const ExpensesView: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await removeDocument('expenses', id);
      } catch (err) {
        console.warn('Error deleting expense:', err);
      }
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const [newExp, setNewExp] = useState({
    matterId: mockMatters[0]?.id || '',
    category: 'Court Fee Stamp' as Expense['category'],
    description: '',
    amountINR: 5000,
    spentBy: 'Adv. Vikramaditya Singh',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending Reimbursable' as Expense['status'],
  });

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.matterTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.spentBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalDisbursementsINR = expenses.reduce((acc, e) => acc + e.amountINR, 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const matter = mockMatters.find(m => m.id === newExp.matterId);
    const created: Expense = {
      id: `exp-${Date.now()}`,
      matterId: newExp.matterId,
      matterTitle: matter ? `${matter.caseNumber} - ${matter.title}` : 'General Office Expense',
      category: newExp.category,
      description: newExp.description,
      amountINR: Number(newExp.amountINR),
      spentBy: newExp.spentBy,
      date: newExp.date,
      status: newExp.status,
    };
    setExpenses([created, ...expenses]);
    setShowAddModal(false);
    setNewExp({
      matterId: mockMatters[0]?.id || '',
      category: 'Court Fee Stamp',
      description: '',
      amountINR: 5000,
      spentBy: 'Adv. Vikramaditya Singh',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Reimbursable',
    });
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Receipt className="w-4 h-4" /> Court Fee Stamps & Case Disbursements
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Disbursements & Expenses</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Log out-of-pocket litigation expenses, certified copy charges, process server fees, and court fees.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Log Case Expense
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Disbursements Logged</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{totalDisbursementsINR.toLocaleString()}</div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">All case expenses</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Billed To Client</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{expenses.filter(e => e.status === 'Billed to Client').reduce((a, b) => a + b.amountINR, 0).toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Recovered in invoice</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Client Reimbursement</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            ₹{expenses.filter(e => e.status === 'Pending Reimbursable').reduce((a, b) => a + b.amountINR, 0).toLocaleString()}
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">Needs client billing</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search expense description, case, or staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Categories</option>
          <option value="Court Fee Stamp">Court Fee Stamp</option>
          <option value="Process Server Fee">Process Server Fee</option>
          <option value="Senior Counsel Clerkage">Senior Counsel Clerkage</option>
          <option value="Certified Copy Charges">Certified Copy Charges</option>
          <option value="Travel & Out of Pocket">Travel & Out of Pocket</option>
        </select>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                <th className="p-3">Expense Category</th>
                <th className="p-3">Description</th>
                <th className="p-3">Case / Matter</th>
                <th className="p-3">Spent By</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Billing Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredExpenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-xs text-indigo-600 dark:text-indigo-400">{e.category}</td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">{e.description}</td>
                  <td className="p-3 text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate">{e.matterTitle}</td>
                  <td className="p-3 text-xs text-slate-700 dark:text-slate-300 font-medium">{e.spentBy}</td>
                  <td className="p-3 text-xs font-mono text-slate-500 dark:text-slate-400">{e.date}</td>
                  <td className="p-3 font-black text-slate-900 dark:text-white">₹{e.amountINR.toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        e.status === 'Billed to Client'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : e.status === 'Pending Reimbursable'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteExpense(e.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all"
                      title="Delete Expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Log Case Disbursement</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Select Case / Matter</label>
                <select
                  value={newExp.matterId}
                  onChange={(e) => setNewExp({ ...newExp, matterId: e.target.value })}
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Expense Category</label>
                <select
                  value={newExp.category}
                  onChange={(e) => setNewExp({ ...newExp, category: e.target.value as any })}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Court Fee Stamp">Court Fee Stamp</option>
                  <option value="Process Server Fee">Process Server Fee</option>
                  <option value="Senior Counsel Clerkage">Senior Counsel Clerkage</option>
                  <option value="Certified Copy Charges">Certified Copy Charges</option>
                  <option value="Travel & Out of Pocket">Travel & Out of Pocket</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={newExp.description}
                  onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  placeholder="e.g. Ad Valorem Court Fee Stamp / Certified Copy Fees"
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newExp.amountINR}
                    onChange={(e) => setNewExp({ ...newExp, amountINR: Number(e.target.value) })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newExp.date}
                    onChange={(e) => setNewExp({ ...newExp, date: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
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
                  Save Disbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
