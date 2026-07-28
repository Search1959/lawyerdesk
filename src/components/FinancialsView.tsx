import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  Eye,
  Edit3,
  Trash2,
  MessageCircle,
  Search,
  Building,
  User,
  ShieldCheck,
  FileText,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import { Invoice, Client, Matter, LawFirm } from '../types';
import { WhatsAppReminderModal } from './WhatsAppReminderModal';
import { WhatsAppReminderData } from '../lib/whatsapp';
import { PaginationControls } from './PaginationControls';
import { InvoiceViewModal } from './InvoiceViewModal';
import { InvoiceEditModal } from './InvoiceEditModal';
import { exportInvoicesToCSV, exportInvoicesToJSON, parseInvoicesFromText } from '../lib/invoiceUtils';

interface FinancialsViewProps {
  invoices: Invoice[];
  clients: Client[];
  matters: Matter[];
  currentFirm?: LawFirm;
  onAddNewInvoice: (inv: Partial<Invoice>) => void;
  onUpdateInvoice?: (inv: Invoice) => void;
  onDeleteInvoice?: (invoiceId: string) => void;
}

export const FinancialsView: React.FC<FinancialsViewProps> = ({
  invoices,
  clients,
  matters,
  currentFirm,
  onAddNewInvoice,
  onUpdateInvoice,
  onDeleteInvoice,
}) => {
  const [whatsappModalData, setWhatsappModalData] = useState<WhatsAppReminderData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [invoicePage, setInvoicePage] = useState(1);
  const [invoicePageSize, setInvoicePageSize] = useState(5);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Modals
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    setInvoicePage(1);
  }, [searchQuery]);

  const filteredInvoices = invoices.filter((inv) => {
    const client = clients.find((c) => c.id === inv.clientId);
    const matter = matters.find((m) => m.id === inv.matterId);
    const query = searchQuery.toLowerCase();
    const firmName = (inv.lawFirmName || currentFirm?.name || '').toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(query) ||
      inv.feeType.toLowerCase().includes(query) ||
      inv.clientName.toLowerCase().includes(query) ||
      firmName.includes(query) ||
      (client && client.name.toLowerCase().includes(query)) ||
      (matter && matter.title.toLowerCase().includes(query))
    );
  });

  const totalInvoicePages = Math.ceil(filteredInvoices.length / invoicePageSize) || 1;
  const activeInvoicePage = Math.min(invoicePage, totalInvoicePages);
  const paginatedInvoices = filteredInvoices.slice(
    (activeInvoicePage - 1) * invoicePageSize,
    activeInvoicePage * invoicePageSize
  );

  const totalBilled = invoices.reduce((acc, inv) => acc + (inv.totalINR || 0), 0);
  const totalPaid = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((acc, inv) => acc + (inv.totalINR || 0), 0);
  const totalPending = totalBilled - totalPaid;
  const pendingCount = invoices.filter((i) => i.status !== 'Paid').length;

  const handleSaveInvoice = (data: Partial<Invoice>) => {
    if (data.id) {
      if (onUpdateInvoice) {
        onUpdateInvoice(data as Invoice);
      }
    } else {
      onAddNewInvoice(data);
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Legal Invoicing & GST Accounting
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Law Firm & Client GST Tax Invoices • SAC 998211 • CGST/SGST/IGST Calculations • Reverse Charge (RCM) Sec 9(3)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <input
            type="file"
            id="import-invoice-file-fin"
            accept=".csv,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const content = event.target?.result as string;
                  if (content) {
                    const parsed = parseInvoicesFromText(content);
                    if (parsed.length > 0) {
                      parsed.forEach((inv) => onAddNewInvoice(inv));
                      alert(`Successfully imported ${parsed.length} invoice(s)!`);
                    } else {
                      alert('Could not parse any valid invoice rows from the uploaded file.');
                    }
                  }
                };
                reader.readAsText(file);
              }
              e.target.value = '';
            }}
          />

          <label
            htmlFor="import-invoice-file-fin"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Import Invoices from CSV or JSON file"
          >
            <Upload className="w-4 h-4 text-emerald-500" />
            <span>Import CSV/JSON</span>
          </label>

          <button
            onClick={() => exportInvoicesToCSV(invoices)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
            title="Export all invoices to CSV"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => exportInvoicesToJSON(invoices)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
            title="Export full JSON backup"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-500" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => {
              setEditingInvoice(null);
              setIsCreateOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Generate New GST Invoice</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Total Billed (Incl. GST)</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{(totalBilled / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[11px] text-slate-400 mt-1">18% GST Compliance Rate</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-emerald-600">Collected Payments</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{(totalPaid / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Settled via NEFT / RTGS / Bank Wire</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-amber-600">Outstanding Receivables</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            ₹{(totalPending / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[11px] text-amber-600 mt-1">{pendingCount} Pending Invoices</div>
        </div>
      </div>

      {/* Invoice List Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-slate-900 dark:text-white text-sm">
              Active GST Tax Invoices ({filteredInvoices.length})
            </h2>
            <span className="text-xs text-slate-400 font-normal">• Showing Law Firm & Client Details</span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice #, client, firm, matter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-3">
          {paginatedInvoices.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No legal fee invoices found matching "{searchQuery}"
            </div>
          ) : (
            paginatedInvoices.map((inv) => {
              const client = clients.find((c) => c.id === inv.clientId);
              const matter = matters.find((m) => m.id === inv.matterId);
              const firmName = inv.lawFirmName || currentFirm?.name || 'LawyerDesk Chambers';
              const clientName = inv.clientName || client?.name || 'Client Entity';
              const clientGstin = inv.clientGstin || client?.gstin || client?.panNumber || '19AAAC1234F1Z0';

              return (
                <div
                  key={inv.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
                >
                  {/* Left Column: Law Firm & Client Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 text-xs">
                        {inv.invoiceNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : inv.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                      <span className="text-slate-500 font-medium text-[11px]">• Fee: {inv.feeType}</span>
                      <span className="text-slate-400 font-mono text-[10px]">SAC 998211</span>
                    </div>

                    {/* Law Firm Name & Client Name Header */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          <span>Law Firm Issuer:</span>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {firmName}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>Billed Client Entity:</span>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {clientName} <span className="font-mono font-normal text-slate-500 text-[10px]">({clientGstin})</span>
                        </div>
                      </div>
                    </div>

                    {matter && (
                      <div className="text-slate-500 text-[11px] truncate pt-0.5">
                        <strong>Matter:</strong> {matter.caseNumber} - {matter.title} ({matter.court})
                      </div>
                    )}
                  </div>

                  {/* Right Column: Amount, Dates, and VIEW / EDIT / DELETE Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-lg font-black text-slate-900 dark:text-white">
                        ₹{(inv.totalINR || 0).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Subtotal: ₹{(inv.subtotalINR || 0).toLocaleString('en-IN')} + GST: ₹{(inv.gstINR || 0).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Issue: {inv.issueDate} | Due: <strong className="text-slate-700 dark:text-slate-300">{inv.dueDate}</strong>
                      </div>
                    </div>

                    {/* ACTION BUTTONS: VIEW, EDIT, DELETE, WHATSAPP */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* VIEW BUTTON */}
                      <button
                        onClick={() => setViewingInvoice(inv)}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-bold text-xs flex items-center gap-1 border border-indigo-200 dark:border-indigo-800 transition-all shadow-2xs"
                        title="View GST Tax Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {/* EDIT BUTTON */}
                      <button
                        onClick={() => {
                          setEditingInvoice(inv);
                          setIsCreateOpen(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition-all"
                        title="Edit GST Tax Invoice"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* WHATSAPP BUTTON */}
                      <button
                        onClick={() =>
                          setWhatsappModalData({
                            recipientName: clientName,
                            recipientPhone: client?.phone || '+91 98765 43210',
                            reminderType: 'INVOICE_REMINDER',
                            invoiceNumber: inv.invoiceNumber,
                            amountDue: inv.totalINR,
                            dueDate: inv.dueDate,
                            caseTitle: matter ? matter.title : `${inv.feeType} Invoice #${inv.invoiceNumber}`,
                          })
                        }
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-2xs"
                        title="Send WhatsApp Invoice Reminder"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>

                      {/* DELETE BUTTON */}
                      {onDeleteInvoice && (
                        deleteConfirmId === inv.id ? (
                          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/80 p-1 rounded-lg border border-rose-200 dark:border-rose-800 animate-in fade-in duration-150">
                            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 px-1">Delete?</span>
                            <button
                              onClick={() => {
                                onDeleteInvoice(inv.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded shadow-xs"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] rounded"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(inv.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <PaginationControls
          currentPage={activeInvoicePage}
          totalPages={totalInvoicePages}
          totalItems={filteredInvoices.length}
          pageSize={invoicePageSize}
          onPageChange={(p) => setInvoicePage(p)}
          onPageSizeChange={(s) => setInvoicePageSize(s)}
          pageSizeOptions={[5, 10, 20]}
          itemName="invoices"
        />
      </div>

      {/* GST Tax Invoice Viewer Modal */}
      {viewingInvoice && (
        <InvoiceViewModal
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          invoice={viewingInvoice}
          client={clients.find((c) => c.id === viewingInvoice.clientId)}
          matter={matters.find((m) => m.id === viewingInvoice.matterId)}
          firm={currentFirm}
          onEdit={(inv) => {
            setViewingInvoice(null);
            setEditingInvoice(inv);
            setIsCreateOpen(true);
          }}
        />
      )}

      {/* GST Tax Invoice Creator & Editor Modal */}
      {isCreateOpen && (
        <InvoiceEditModal
          isOpen={isCreateOpen}
          onClose={() => {
            setIsCreateOpen(false);
            setEditingInvoice(null);
          }}
          invoiceToEdit={editingInvoice}
          clients={clients}
          matters={matters}
          firm={currentFirm}
          onSave={handleSaveInvoice}
        />
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
