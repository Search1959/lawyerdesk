import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, IndianRupee, ShieldCheck, Building, User, FileText, CheckCircle2, Upload, Download } from 'lucide-react';
import { Invoice, InvoiceItem, Client, Matter, LawFirm } from '../types';
import { parseInvoicesFromText, exportInvoicesToCSV } from '../lib/invoiceUtils';

interface InvoiceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceToEdit?: Invoice | null;
  initialMatterId?: string;
  initialClientId?: string;
  clients: Client[];
  matters: Matter[];
  firm?: LawFirm;
  onSave: (invoiceData: any) => void;
}

export const InvoiceEditModal: React.FC<InvoiceEditModalProps> = ({
  isOpen,
  onClose,
  invoiceToEdit,
  initialMatterId,
  initialClientId,
  clients,
  matters,
  firm,
  onSave,
}) => {
  const isEditing = !!invoiceToEdit;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    invoiceNumber: '',
    clientId: '',
    matterId: '',
    feeType: 'Appearance Fee' as Invoice['feeType'],
    status: 'Pending' as Invoice['status'],
    taxType: 'CGST_SGST' as 'CGST_SGST' | 'IGST',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '2026-08-30',
    items: [
      { description: 'High Court Senior Counsel Appearance Fee', amountINR: 150000, sacCode: '998211' },
    ] as InvoiceItem[],
    notes: 'Tax payable on Reverse Charge basis under Sec 9(3) of CGST Act 2017 for Legal Services.',
  });

  useEffect(() => {
    if (invoiceToEdit) {
      setFormData({
        id: invoiceToEdit.id,
        invoiceNumber: invoiceToEdit.invoiceNumber,
        clientId: invoiceToEdit.clientId,
        matterId: invoiceToEdit.matterId,
        feeType: invoiceToEdit.feeType,
        status: invoiceToEdit.status,
        taxType: invoiceToEdit.taxType || 'CGST_SGST',
        issueDate: invoiceToEdit.issueDate,
        dueDate: invoiceToEdit.dueDate,
        items: invoiceToEdit.items && invoiceToEdit.items.length > 0
          ? invoiceToEdit.items
          : [{ description: 'High Court Senior Counsel Appearance Fee', amountINR: invoiceToEdit.subtotalINR || 150000, sacCode: '998211' }],
        notes: invoiceToEdit.notes || 'Tax payable on Reverse Charge basis under Sec 9(3) of CGST Act 2017 for Legal Services.',
      });
    } else {
      const selectedMatterObj = initialMatterId ? matters.find((m) => m.id === initialMatterId) : matters[0];
      const targetClientId = initialClientId || selectedMatterObj?.clientId || clients[0]?.id || '';
      const targetMatterId = initialMatterId || selectedMatterObj?.id || matters[0]?.id || '';

      setFormData({
        id: '',
        invoiceNumber: `SLA/2026/${Math.floor(100 + Math.random() * 900)}`,
        clientId: targetClientId,
        matterId: targetMatterId,
        feeType: 'Appearance Fee',
        status: 'Pending',
        taxType: 'CGST_SGST',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        items: selectedMatterObj ? [
          { description: `Legal Representation & Appearance Fee for Case ${selectedMatterObj.caseNumber} - ${selectedMatterObj.title}`, amountINR: 150000, sacCode: '998211' }
        ] : [
          { description: 'High Court Senior Counsel Appearance Fee', amountINR: 150000, sacCode: '998211' },
        ],
        notes: 'Tax payable on Reverse Charge basis under Sec 9(3) of CGST Act 2017 for Legal Services.',
      });
    }
  }, [invoiceToEdit, isOpen, initialMatterId, initialClientId, clients, matters]);

  if (!isOpen) return null;

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const parsed = parseInvoicesFromText(text);
          if (parsed && parsed.length > 0) {
            const first = parsed[0];
            setFormData((prev) => ({
              ...prev,
              invoiceNumber: first.invoiceNumber || prev.invoiceNumber,
              feeType: first.feeType || prev.feeType,
              items: first.items && first.items.length > 0 ? first.items : prev.items,
              notes: first.notes || prev.notes,
            }));
            alert(`Imported ${parsed.length} invoice draft(s). Form populated with imported data!`);
          }
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: 'Court Drafting & Miscellaneous Charges', amountINR: 25000, sacCode: '998211' },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: field === 'amountINR' ? Number(value) : value };
      return { ...prev, items: newItems };
    });
  };

  const subtotal = formData.items.reduce((acc, item) => acc + (Number(item.amountINR) || 0), 0);
  const isIgst = formData.taxType === 'IGST';
  const cgst = isIgst ? 0 : Math.round(subtotal * 0.09);
  const sgst = isIgst ? 0 : Math.round(subtotal * 0.09);
  const igst = isIgst ? Math.round(subtotal * 0.18) : 0;
  const totalTax = isIgst ? igst : cgst + sgst;
  const grandTotal = subtotal + totalTax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const selectedClient = clients.find((c) => c.id === formData.clientId);
      const selectedMatter = matters.find((m) => m.id === formData.matterId);

      const payload: Partial<Invoice> = {
        id: formData.id || undefined,
        invoiceNumber: formData.invoiceNumber,
        clientId: formData.clientId,
        clientName: selectedClient?.name || 'Client Entity',
        clientGstin: selectedClient?.gstin || selectedClient?.panNumber || '19AAAC1234F1Z0',
        clientAddress: selectedClient?.address || 'Connaught Place, New Delhi',
        clientPhone: selectedClient?.phone || '+91 98765 43210',
        clientEmail: selectedClient?.email || 'billing@client.com',
        lawFirmName: firm?.name || 'LawyerDesk Chambers & Consultants',
        lawFirmGstin: firm?.gstin || '07AAAAA0000A1Z5',
        lawFirmPan: firm?.panNumber || 'AAAAA0000A',
        lawFirmAddress: firm?.branches?.[0]?.address || 'Lawyers Chambers, High Court Complex, New Delhi - 110001',
        lawFirmPhone: firm?.phone || '+91 11 2338 9012',
        lawFirmEmail: 'accounts@lawyerdesk.co.in',
        lawFirmBankDetails: {
          bankName: 'HDFC Bank Ltd',
          accountNumber: '50200088991122',
          ifscCode: 'HDFC0000123',
          branch: 'High Court Complex Branch, New Delhi',
          upiId: 'lawyerdesk@hdfcbank',
        },
        matterId: formData.matterId,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        subtotalINR: subtotal,
        taxType: formData.taxType,
        gstINR: totalTax,
        cgstINR: cgst,
        sgstINR: sgst,
        igstINR: igst,
        totalINR: grandTotal,
        status: formData.status,
        feeType: formData.feeType,
        items: formData.items,
        notes: formData.notes,
      };

      await onSave(payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-auto max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isEditing ? `Edit GST Tax Invoice #${formData.invoiceNumber}` : 'Create New GST Legal Fee Invoice'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 flex items-center gap-1 transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Import CSV/JSON</span>
              <input type="file" accept=".csv,.json" className="hidden" onChange={handleImportFile} />
            </label>
            <button
              type="button"
              onClick={() => {
                const selectedClient = clients.find((c) => c.id === formData.clientId);
                exportInvoicesToCSV([{
                  invoiceNumber: formData.invoiceNumber,
                  clientName: selectedClient?.name || 'Client Entity',
                  clientGstin: selectedClient?.gstin || '',
                  lawFirmName: firm?.name || 'LawyerDesk Chambers',
                  feeType: formData.feeType,
                  status: formData.status,
                  issueDate: formData.issueDate,
                  dueDate: formData.dueDate,
                  subtotalINR: subtotal,
                  gstINR: totalTax,
                  totalINR: grandTotal,
                  notes: formData.notes
                }]);
              }}
              className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 flex items-center gap-1 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Invoice Number</label>
              <input
                type="text"
                required
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Invoice['status'] })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
              >
                <option value="Pending">Pending (Unpaid)</option>
                <option value="Paid">Paid (Settled)</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Client Entity</label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.panNumber || c.gstin || 'Client'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Case / Matter</label>
              <select
                value={formData.matterId}
                onChange={(e) => setFormData({ ...formData, matterId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              >
                {matters.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.caseNumber} - {m.title.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Fee Category</label>
              <select
                value={formData.feeType}
                onChange={(e) => setFormData({ ...formData, feeType: e.target.value as Invoice['feeType'] })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Appearance Fee">Appearance Fee</option>
                <option value="Retainer">Monthly Retainer</option>
                <option value="Drafting Fee">Pleading Drafting Fee</option>
                <option value="Success Commission">Success Commission</option>
                <option value="Legal Opinion">Legal Opinion / Advisory</option>
                <option value="Consultation">Consultation Fee</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">GST Tax Type</label>
              <select
                value={formData.taxType}
                onChange={(e) => setFormData({ ...formData, taxType: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-indigo-600 dark:text-indigo-400"
              >
                <option value="CGST_SGST">Intra-state (CGST 9% + SGST 9%)</option>
                <option value="IGST">Inter-state (IGST 18%)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Issue Date</label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Dynamic Fee Line Items */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Fee Items & Service Schedule
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold hover:bg-indigo-100 flex items-center gap-1 border border-indigo-200 dark:border-indigo-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Service Description e.g., Senior Advocate Court Appearance"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full p-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      placeholder="SAC Code"
                      value={item.sacCode || '998211'}
                      onChange={(e) => handleItemChange(idx, 'sacCode', e.target.value)}
                      className="w-full p-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-center"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Amount (₹)"
                      value={item.amountINR}
                      onChange={(e) => handleItemChange(idx, 'amountINR', e.target.value)}
                      className="w-full p-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-right"
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-2 text-slate-400 hover:text-rose-600"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Tax Summary Box */}
          <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-mono space-y-1.5 shadow-2xs">
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>Taxable Subtotal:</span>
              <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {!isIgst ? (
              <>
                <div className="flex justify-between text-indigo-700 dark:text-indigo-300">
                  <span>+ CGST @ 9%:</span>
                  <span>₹{cgst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-indigo-700 dark:text-indigo-300">
                  <span>+ SGST @ 9%:</span>
                  <span>₹{sgst.toLocaleString('en-IN')}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-indigo-700 dark:text-indigo-300">
                <span>+ IGST @ 18%:</span>
                <span>₹{igst.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-indigo-200 dark:border-indigo-800">
              <span>Grand Total Invoice Amount:</span>
              <span className="text-indigo-600 dark:text-indigo-400">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Invoice Changes' : 'Generate Tax Invoice'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
