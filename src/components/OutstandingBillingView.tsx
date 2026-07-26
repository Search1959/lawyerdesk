import React, { useState, useEffect } from 'react';
import { AlertCircle, Search, Send, FileText, CheckCircle, Clock, DollarSign, ArrowUpRight, Eye, Edit3, Trash2, X, MessageCircle } from 'lucide-react';
import { Invoice } from '../types';
import { WhatsAppReminderModal } from './WhatsAppReminderModal';
import { WhatsAppReminderData } from '../lib/whatsapp';

interface OutstandingBillingViewProps {
  invoices: Invoice[];
  onAddNewInvoice?: () => void;
}

export const OutstandingBillingView: React.FC<OutstandingBillingViewProps> = ({
  invoices: initialInvoices,
  onAddNewInvoice,
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [reminderSent, setReminderSent] = useState<{ [id: string]: boolean }>({});

  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(null);
  const [whatsappModalData, setWhatsappModalData] = useState<WhatsAppReminderData | null>(null);

  useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  const pendingInvoices = invoices.filter(
    (i) =>
      (i.status === 'Pending' || i.status === 'Overdue') &&
      (i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.feeType.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const totalOutstandingINR = pendingInvoices.reduce((acc, i) => acc + i.totalINR, 0);

  const handleSendReminder = (inv: Invoice) => {
    setReminderSent({ ...reminderSent, [inv.id]: true });
    setWhatsappModalData({
      recipientName: inv.clientName,
      recipientPhone: '+91 98765 43210',
      reminderType: 'INVOICE_REMINDER',
      invoiceNumber: inv.invoiceNumber,
      amountDue: inv.totalINR,
      dueDate: inv.dueDate,
      caseTitle: `${inv.feeType} - Invoice #${inv.invoiceNumber}`,
    });
  };

  const handleUpdateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;
    setInvoices(invoices.map((inv) => (inv.id === editingInvoice.id ? editingInvoice : inv)));
    setEditingInvoice(null);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter((inv) => inv.id !== id));
    setDeletingInvoiceId(null);
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
            Track unpaid legal fee invoices, GST tax disbursements, and automated WhatsApp client payment reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pendingInvoices.length > 0 && (
            <button
              onClick={() => handleSendReminder(pendingInvoices[0])}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Fee Reminders</span>
            </button>
          )}

          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-4 rounded-xl text-right">
            <div className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400">Total Outstanding Fees</div>
            <div className="text-2xl font-black text-rose-900 dark:text-rose-300">
              ₹{totalOutstandingINR.toLocaleString()}
            </div>
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
                <th className="p-3">Reminder Action</th>
                <th className="p-3 text-right">Actions</th>
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
                  <td className="p-3">
                    {reminderSent[inv.id] ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5" /> WhatsApp Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendReminder(inv)}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" /> WhatsApp Fee Alert
                      </button>
                    )}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setViewingInvoice(inv)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                        title="View Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingInvoice(inv)}
                        className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 hover:bg-amber-200"
                        title="Edit Invoice"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingInvoiceId(inv.id)}
                        className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 hover:bg-rose-200"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Invoice Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold">Invoice Details #{viewingInvoice.invoiceNumber}</h3>
              <button onClick={() => setViewingInvoice(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">{viewingInvoice.clientName}</div>
                <div className="text-slate-500">Fee Type: {viewingInvoice.feeType}</div>
                <div className="text-slate-500">Status: <span className="font-bold text-rose-600">{viewingInvoice.status}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Issue Date</span>
                  <div className="font-mono font-bold">{viewingInvoice.issueDate}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Due Date</span>
                  <div className="font-mono font-bold text-rose-600">{viewingInvoice.dueDate}</div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl flex justify-between items-center border border-indigo-100 dark:border-indigo-900">
                <span className="font-bold text-indigo-900 dark:text-indigo-200">Total Payable (Incl. GST)</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">₹{viewingInvoice.totalINR.toLocaleString()}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setEditingInvoice(viewingInvoice);
                    setViewingInvoice(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                >
                  Edit Invoice
                </button>
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold">Edit Invoice #{editingInvoice.invoiceNumber}</h3>
              <button onClick={() => setEditingInvoice(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={editingInvoice.clientName}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, clientName: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fee Category</label>
                  <input
                    type="text"
                    required
                    value={editingInvoice.feeType}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, feeType: e.target.value as any })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingInvoice.totalINR}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, totalINR: Number(e.target.value) })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={editingInvoice.issueDate}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, issueDate: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                  <input
                    type="text"
                    value={editingInvoice.dueDate}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, dueDate: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Invoice Confirmation Modal */}
      {deletingInvoiceId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Invoice</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to delete this invoice record from billing collections?
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingInvoiceId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteInvoice(deletingInvoiceId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Yes, Delete
              </button>
            </div>
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
