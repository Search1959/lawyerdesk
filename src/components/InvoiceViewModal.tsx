import React from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  User,
  ShieldCheck,
  FileText,
  IndianRupee,
  Share2,
  Edit3,
} from 'lucide-react';
import { Invoice, Client, Matter, LawFirm } from '../types';
import { numberToWordsIndian } from '../lib/invoiceUtils';

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  client?: Client;
  matter?: Matter;
  firm?: LawFirm;
  onEdit?: (invoice: Invoice) => void;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  isOpen,
  onClose,
  invoice,
  client,
  matter,
  firm,
  onEdit,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !invoice) return null;

  const firmName = invoice.lawFirmName || firm?.name || 'LawyerDesk Chambers & Senior Legal Consultants';
  const firmGstin = invoice.lawFirmGstin || firm?.gstin || '07AAAAA0000A1Z5';
  const firmPan = invoice.lawFirmPan || firm?.panNumber || 'AAAAA0000A';
  const firmAddress = invoice.lawFirmAddress || firm?.branches?.[0]?.address || 'Lawyers Chambers, High Court Complex, New Delhi - 110001';
  const firmPhone = invoice.lawFirmPhone || firm?.phone || '+91 11 2338 9012';
  const firmEmail = invoice.lawFirmEmail || 'accounts@lawyerdesk.co.in';

  const clientName = invoice.clientName || client?.name || 'Client Entity';
  const clientGstin = invoice.clientGstin || client?.gstin || client?.panNumber || '19AAAC1234F1Z0';
  const clientAddress = invoice.clientAddress || client?.address || 'Connaught Place, New Delhi';

  const bankName = invoice.lawFirmBankDetails?.bankName || 'HDFC Bank Ltd';
  const bankAcc = invoice.lawFirmBankDetails?.accountNumber || '50200088991122';
  const bankIfsc = invoice.lawFirmBankDetails?.ifscCode || 'HDFC0000123';
  const bankBranch = invoice.lawFirmBankDetails?.branch || 'High Court Complex Branch, New Delhi';
  const upiId = invoice.lawFirmBankDetails?.upiId || 'lawyerdesk@hdfcbank';

  const isIgst = invoice.taxType === 'IGST';
  const subtotal = invoice.subtotalINR || 0;
  const cgst = invoice.cgstINR ?? (isIgst ? 0 : Math.round(subtotal * 0.09));
  const sgst = invoice.sgstINR ?? (isIgst ? 0 : Math.round(subtotal * 0.09));
  const igst = invoice.igstINR ?? (isIgst ? Math.round(subtotal * 0.18) : 0);
  const totalTax = isIgst ? igst : cgst + sgst;
  const grandTotal = invoice.totalINR || subtotal + totalTax;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `TAX INVOICE #${invoice.invoiceNumber}\nIssuer: ${firmName} (GSTIN: ${firmGstin})\nClient: ${clientName}\nTotal Amount Due: ₹${grandTotal.toLocaleString('en-IN')}\nDue Date: ${invoice.dueDate}\nBank: ${bankName} A/C ${bankAcc} IFSC ${bankIfsc}\nUPI: ${upiId}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Action Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              Official Tax Invoice #{invoice.invoiceNumber}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                invoice.status === 'Paid'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : invoice.status === 'Overdue'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(invoice);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Invoice</span>
              </button>
            )}

            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Details!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 font-sans print:p-0 print:bg-white print:text-black">
          {/* Document Header Banner */}
          <div className="border-b-2 border-indigo-600 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-2xl font-black text-indigo-950 dark:text-indigo-200 tracking-tight flex items-center gap-2">
                <Building className="w-6 h-6 text-indigo-600" />
                <span>{firmName}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Advocates, Solicitors & Supreme Court Legal Consultants
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-block px-3 py-1 rounded bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-black tracking-wider uppercase">
                GST TAX INVOICE
              </div>
              <div className="text-sm font-mono font-extrabold mt-1 text-slate-900 dark:text-white">
                Invoice No: {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                Issue Date: <strong className="text-slate-700 dark:text-slate-300">{invoice.issueDate}</strong> | Due Date: <strong className="text-slate-700 dark:text-slate-300">{invoice.dueDate}</strong>
              </div>
            </div>
          </div>

          {/* Service Provider & Service Receiver Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed">
            {/* Left: Law Firm Details */}
            <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 pb-4 md:pb-0 md:pr-4">
              <div className="font-extrabold text-xs text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Service Provider (Law Firm)</span>
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">{firmName}</div>
              <div className="text-slate-600 dark:text-slate-300">{firmAddress}</div>
              <div className="text-slate-600 dark:text-slate-300">
                <strong>GSTIN:</strong> <span className="font-mono font-bold text-slate-900 dark:text-white">{firmGstin}</span> | <strong>PAN:</strong> <span className="font-mono font-bold">{firmPan}</span>
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                <strong>Ph:</strong> {firmPhone} | <strong>Email:</strong> {firmEmail}
              </div>
            </div>

            {/* Right: Client Details */}
            <div className="space-y-1.5">
              <div className="font-extrabold text-xs text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Service Receiver (Billed To)</span>
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">{clientName}</div>
              <div className="text-slate-600 dark:text-slate-300">{clientAddress}</div>
              <div className="text-slate-600 dark:text-slate-300">
                <strong>Client GSTIN / PAN:</strong> <span className="font-mono font-bold text-slate-900 dark:text-white">{clientGstin}</span>
              </div>
              {matter && (
                <div className="mt-2 p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px]">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Matter Reference:</span> {matter.caseNumber} - {matter.title} ({matter.court})
                </div>
              )}
            </div>
          </div>

          {/* Itemized Legal Fee Schedule Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-indigo-900 text-white font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3">Particulars & Legal Services Description</th>
                  <th className="p-3 w-28 text-center">SAC Code</th>
                  <th className="p-3 w-28 text-center">Fee Type</th>
                  <th className="p-3 w-32 text-right">Taxable Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 font-sans">
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">{item.description}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-600 dark:text-slate-400">
                        {item.sacCode || '998211'}
                      </td>
                      <td className="p-3 text-center font-medium text-slate-500">{invoice.feeType}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ₹{item.amountINR.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 text-center font-bold text-slate-400">1</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Professional Fee for Legal Representation & Consultation</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-600">998211</td>
                    <td className="p-3 text-center font-medium text-slate-500">{invoice.feeType}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tax Computation Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Notes & Reverse Charge Mechanism Notice */}
            <div className="md:col-span-7 space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-extrabold flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Reverse Charge Mechanism (RCM) Declaration</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  As per Notification No. 13/2017-Central Tax (Rate), GST on legal services provided by an Advocate or Senior Advocate/Firm of Advocates to a business entity is payable under <strong>Reverse Charge Mechanism (RCM)</strong> directly by the service recipient.
                </p>
              </div>

              {/* Bank Details for Direct Transfer */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="font-extrabold text-xs text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                  Direct Bank Remittance Details (NEFT / RTGS / UPI)
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <div><strong>Bank Name:</strong> {bankName}</div>
                  <div><strong>Account No:</strong> <span className="font-bold text-slate-900 dark:text-white">{bankAcc}</span></div>
                  <div><strong>IFSC Code:</strong> <span className="font-bold text-slate-900 dark:text-white">{bankIfsc}</span></div>
                  <div><strong>Branch:</strong> {bankBranch}</div>
                  <div className="col-span-2"><strong>UPI VPA ID:</strong> <span className="font-bold text-indigo-600 dark:text-indigo-400">{upiId}</span></div>
                </div>
              </div>
            </div>

            {/* Right: Subtotal, GST & Grand Total Box */}
            <div className="md:col-span-5 p-4 rounded-xl bg-slate-900 dark:bg-slate-950 text-white space-y-2.5 font-mono text-xs shadow-lg">
              <div className="flex justify-between text-slate-300 pb-1.5 border-b border-slate-800">
                <span>Taxable Value Subtotal:</span>
                <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {!isIgst ? (
                <>
                  <div className="flex justify-between text-slate-300">
                    <span>CGST @ 9%:</span>
                    <span>₹{cgst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 pb-1.5 border-b border-slate-800">
                    <span>SGST @ 9%:</span>
                    <span>₹{sgst.toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-300 pb-1.5 border-b border-slate-800">
                  <span>IGST @ 18%:</span>
                  <span>₹{igst.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-indigo-300 font-extrabold text-sm pt-1">
                <span>Grand Total Amount Due:</span>
                <span className="text-amber-400 text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 text-[11px] text-slate-300 font-sans italic border-t border-slate-800 leading-snug">
                <strong>Amount in Words:</strong><br />
                {numberToWordsIndian(grandTotal)}
              </div>
            </div>
          </div>

          {/* Footer Signature & Terms */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-slate-500 text-[11px] max-w-md">
              <p><strong>Payment Terms:</strong> Fees are payable within 15 days from date of invoice. Please mention Invoice No. ({invoice.invoiceNumber}) in bank remittance remarks.</p>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white">For {firmName}</div>
              <div className="h-10 my-1 flex items-center justify-end">
                <span className="font-serif italic text-indigo-600 text-sm font-bold tracking-widest border-b border-indigo-400 pb-0.5">
                  Adv. Rajeshwar V. Sharma
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Authorized Partner / Senior Advocate Signature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
