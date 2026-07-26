import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Building,
  Trash2,
  MessageCircle,
} from 'lucide-react';
import { Invoice, Client, Matter } from '../types';
import { WhatsAppReminderModal } from './WhatsAppReminderModal';
import { WhatsAppReminderData } from '../lib/whatsapp';

interface FinancialsViewProps {
  invoices: Invoice[];
  clients: Client[];
  matters: Matter[];
  onAddNewInvoice: (inv: Partial<Invoice>) => void;
  onDeleteInvoice?: (invoiceId: string) => void;
}

export const FinancialsView: React.FC<FinancialsViewProps> = ({
  invoices,
  clients,
  matters,
  onAddNewInvoice,
  onDeleteInvoice,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [whatsappModalData, setWhatsappModalData] = useState<WhatsAppReminderData | null>(null);
  const [newInv, setNewInv] = useState({
    invoiceNumber: `INV-2026-0${invoices.length + 1}`,
    clientId: clients[0]?.id || '',
    matterId: matters[0]?.id || '',
    amountINR: 150000,
    dueDate: '2026-08-30',
    feeType: 'Appearance Fee' as const,
    items: [
      { description: 'High Court Senior Counsel Appearance Fee', amountINR: 150000 },
    ],
  });

  const totalBilled = invoices.reduce((acc, inv) => acc + inv.totalINR, 0);
  const totalPaid = invoices.filter((i) => i.status === 'Paid').reduce((acc, inv) => acc + inv.totalINR, 0);
  const totalPending = totalBilled - totalPaid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = newInv.amountINR;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    onAddNewInvoice({
      invoiceNumber: newInv.invoiceNumber,
      clientId: newInv.clientId,
      matterId: newInv.matterId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: newInv.dueDate,
      subtotalINR: subtotal,
      gstINR: gst,
      totalINR: total,
      status: 'Pending',
      feeType: newInv.feeType,
      items: newInv.items,
    });

    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Legal Invoicing & GST Accounting</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Appearance Fees • Retainers • Success Commissions • 18% CGST/SGST Invoicing for Indian Law Firms
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Total Invoiced</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{(totalBilled / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Incl. 18% GST</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-emerald-600">Collected Payments</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{(totalPaid / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Direct Bank Wire / NEFT</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-amber-600">Outstanding Receivables</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            ₹{(totalPending / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[11px] text-amber-600 mt-1">3 Invoices Pending</div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white text-sm">Active Invoices ({invoices.length})</h2>

        <div className="space-y-3">
          {invoices.map((inv) => {
            const client = clients.find((c) => c.id === inv.clientId);
            const matter = matters.find((m) => m.id === inv.matterId);

            return (
              <div
                key={inv.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{inv.invoiceNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                    <span className="text-slate-400">• {inv.feeType}</span>
                  </div>

                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {client ? client.name : 'Client Entity'}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{matter ? matter.title : ''}</div>
                </div>

                <div className="text-right flex flex-col md:items-end justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setWhatsappModalData({
                          recipientName: client ? client.name : 'Client Entity',
                          recipientPhone: client?.phone || '+91 98765 43210',
                          reminderType: 'INVOICE_REMINDER',
                          invoiceNumber: inv.invoiceNumber,
                          amountDue: inv.totalINR,
                          dueDate: inv.dueDate,
                          caseTitle: matter ? matter.title : `${inv.feeType} Invoice #${inv.invoiceNumber}`,
                        })
                      }
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                      title="Send WhatsApp Invoice Reminder"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Alert</span>
                    </button>
                    <div className="text-base font-black text-slate-900 dark:text-white">
                      ₹{inv.totalINR.toLocaleString('en-IN')}
                    </div>
                    {onDeleteInvoice && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
                            onDeleteInvoice(inv.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Subtotal: ₹{inv.subtotalINR.toLocaleString('en-IN')} + GST: ₹{inv.gstINR.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Due Date: {inv.dueDate}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Legal Fee Invoice</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Client</label>
                <select
                  value={newInv.clientId}
                  onChange={(e) => setNewInv({ ...newInv, clientId: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.panNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Matter</label>
                <select
                  value={newInv.matterId}
                  onChange={(e) => setNewInv({ ...newInv, matterId: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border"
                >
                  {matters.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.caseNumber} - {m.title.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Professional Fee (₹ INR)</label>
                  <input
                    type="number"
                    value={newInv.amountINR}
                    onChange={(e) => setNewInv({ ...newInv, amountINR: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Fee Category</label>
                  <select
                    value={newInv.feeType}
                    onChange={(e) => setNewInv({ ...newInv, feeType: e.target.value as any })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border"
                  >
                    <option value="Appearance Fee">Appearance Fee</option>
                    <option value="Retainer">Monthly Retainer</option>
                    <option value="Drafting Fee">Pleading Drafting Fee</option>
                    <option value="Success Commission">Success Commission</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal Fee:</span>
                  <span>₹{newInv.amountINR.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-bold">
                  <span>+ 18% GST (CGST 9% + SGST 9%):</span>
                  <span>₹{Math.round(newInv.amountINR * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-extrabold text-slate-900 dark:text-white pt-1 border-t border-indigo-200 dark:border-indigo-800">
                  <span>Total Invoice Amount:</span>
                  <span>₹{Math.round(newInv.amountINR * 1.18).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold">
                  Generate Invoice
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
