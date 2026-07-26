import React, { useState } from 'react';
import {
  Printer,
  Download,
  Copy,
  Check,
  X,
  FileText,
  ShieldCheck,
  Sparkles,
  Bot,
  Calendar,
  Receipt,
  Scale,
  Users,
  FolderLock,
  MessageSquare,
  Building2,
  Clock,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface ClientPrintableGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientPrintableGuide: React.FC<ClientPrintableGuideProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHtml = () => {
    const el = document.getElementById('printable-guide-content');
    if (el) {
      navigator.clipboard.writeText(el.outerHTML);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadHtml = () => {
    const el = document.getElementById('printable-guide-content');
    if (!el) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LawyerDesk AI - Official Client & Firm Practice Guide</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      body { background: white !important; color: black !important; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 font-sans p-8 max-w-5xl mx-auto">
  ${el.innerHTML}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LawyerDesk_AI_Client_Practice_Guide.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] my-4 overflow-hidden">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-base sm:text-lg text-white">Client & Firm Practice Guide (Printable PDF / HTML)</h2>
              <p className="text-xs text-slate-300">Shareable documentation detailing all features of LawyerDesk AI</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download HTML</span>
            </button>

            <button
              onClick={handleCopyHtml}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
              <span>{copied ? 'Copied HTML!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-guide-content" className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-white text-slate-900 font-sans leading-relaxed">
          {/* Header & Title Section */}
          <div className="border-b-2 border-indigo-600 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                  LD
                </span>
                <span className="font-black text-xl text-slate-900 uppercase tracking-tight">LAWYERDESK AI</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono text-[10px] font-bold">
                  Official Guide v3.6
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Enterprise Legal Practice Management & Client Operating System
              </h1>
              <p className="text-xs text-slate-600 max-w-2xl font-medium">
                Comprehensive overview of case tracking, e-Courts CNR sync, PaddleOCR Devanagari parsing, Grounded Gemini 3.6 AI legal assistant, GST billing, and WhatsApp alerts for Advocates in India.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 shrink-0 font-mono">
              <div className="font-bold text-slate-900">M/s Deinrim Solutionss (P) Ltd.</div>
              <div className="text-slate-600">Official Portal: lawyerdesk.co.in</div>
              <div className="text-slate-600">Corporate Contact: +91 98361 30393</div>
              <div className="text-slate-600">Kolkata, West Bengal (WB), India</div>
            </div>
          </div>

          {/* Quick Summary Banner */}
          <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-2">
            <div className="font-black text-sm uppercase text-indigo-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Platform Executive Summary</span>
            </div>
            <p className="font-medium leading-relaxed">
              LawyerDesk AI is an all-in-one legal operating system engineered specifically for Indian Advocates, Chambers, High Court practitioners, District Court litigators, and Law Firms. It eliminates paper register delays, missed hearing dates, uncollected fees, and manual legal research hours through secure automation and zero-hallucination grounded AI.
            </p>
          </div>

          {/* Module 1: Grounded AI Legal Assistant */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-base text-slate-900 border-b border-slate-200 pb-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              <span>1. Grounded AI Legal Assistant & Case RAG Engine</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2">
              <p className="font-medium">
                Our Gemini 3.6 Flash AI assistant is strictly grounded in your firm's uploaded case files, pleadings, judgments, and FIR documents. It provides zero-hallucination case summaries, legal research, and instant drafting assistance.
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
                <li><strong>Grounded Document RAG:</strong> Ask questions in plain English, Hindi, or Bengali and receive cited answers pointing directly to specific page numbers in your case PDFs.</li>
                <li><strong>Instant Legal Drafting:</strong> Generate initial drafts for Writs, Written Statements, Legal Notices, Bail Applications, and Injunction Petitions.</li>
                <li><strong>Case Briefing Generator:</strong> Instantly compile 1-page court hearing briefs for arguing counsel before court appearances.</li>
              </ul>
            </div>
          </div>

          {/* Module 2: e-Courts & NJDG Sync */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-base text-slate-900 border-b border-slate-200 pb-2">
              <Scale className="w-5 h-5 text-indigo-600" />
              <span>2. Automated e-Courts & NJDG Case Tracker</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2">
              <p className="font-medium">
                Directly linked with e-Courts, National Judicial Data Grid (NJDG), High Court Cause Lists, and Supreme Court portals.
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
                <li><strong>CNR Number Integration:</strong> Enter a 16-digit CNR number once to automatically sync next hearing dates, judge bench details, and case stages.</li>
                <li><strong>Automated Cause List Sync:</strong> Matches your Bar Council Enrollment ID against daily High Court and District Court cause lists to build your daily court appearance roster.</li>
                <li><strong>Court Portal Shortcuts:</strong> One-click navigation to eCourts Services, NJDG, Supreme Court Case Status, and NCLT/DRT boards.</li>
              </ul>
            </div>
          </div>

          {/* Module 3: Case Management & Case Diary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-base text-slate-900 border-b border-slate-200 pb-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>3. Centralized Case Repository & Digital Case Diary</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2">
              <p className="font-medium">
                Replaces bulky physical registers with a searchable, multi-column master table supporting filters, CSV exports, and stage progression.
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
                <li><strong>Complete Case Lifecycle:</strong> Track case stage from Pre-filing, Admission, Evidence, Arguments, Order Reserved, to Final Judgment.</li>
                <li><strong>Assigned Advocates & Opposing Counsel:</strong> Maintain records of lead advocates, junior associates, opposing counsel, and judicial officers.</li>
                <li><strong>Exportable Case Register:</strong> Export filtered case lists to CSV for court clerk filings or internal chamber reviews.</li>
              </ul>
            </div>
          </div>

          {/* Module 4: Client CRM & Client Portal */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-base text-slate-900 border-b border-slate-200 pb-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>4. Client CRM & Client Portal Access</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2">
              <p className="font-medium">
                Organize individual litigants and corporate clients with dedicated profiles, contact logs, linked matters, and secure client portal permissions.
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
                <li><strong>Individual vs Corporate Client Categorization:</strong> Store GSTIN, corporate registration numbers, billing addresses, and primary contacts.</li>
                <li><strong>Client Access Controls:</strong> Toggle client portal access so clients can view their hearing dates and invoices without calling your office late at night.</li>
              </ul>
            </div>
          </div>

          {/* Module 5: Court Calendar & Scheduler */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-base text-slate-900 border-b border-slate-200 pb-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>5. Integrated Calendar, Appointments & Billable Time Tracker</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2">
              <p className="font-medium">
                Single unified view for court hearings, client consultations, arbitration meetings, and limitation deadlines with built-in conflict prevention.
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
                <li><strong>Flexible Calendar Views:</strong> Toggle between Month, Week, Day, and Roster List views instantly.</li>
                <li><strong>Double-Booking Protection:</strong> Automatic conflict warnings when two court appearances or appointments overlap on the same advocate.</li>
                <li><strong>Billable Stopwatch Timer:</strong> Real-time header stopwatch timer for tracking hourly consultation fees and drafting hours.</li>
              </ul>
            </div>
          </div>

          {/* Module 6: Hearings & Limitation Deadlines */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-base text-slate-900 border-b border-slate-200 pb-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span>6. Upcoming Hearings Timeline & Limitation Period Deadlines</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2">
              <p className="font-medium">
                Never miss a statutory limitation deadline, appeal window, or hearing appearance with 7, 15, and 30-day automated lookahead windows.
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
                <li><strong>Limitation Expiry Radar:</strong> Tracks critical statutory deadlines for filing Written Statements (30/120 days), Appeals, and Execution petitions.</li>
                <li><strong>Purpose of Hearing Logging:</strong> Note down specific hearing objectives (e.g., Arguments on Stay, Cross-examination of PW-1).</li>
              </ul>
            </div>
          </div>

          {/* Module 7: GST Billing & Invoices */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-base text-slate-900 border-b border-slate-200 pb-2">
              <Receipt className="w-5 h-5 text-indigo-600" />
              <span>7. GST-Compliant Billing, Tax Invoices & Fee Collection</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2">
              <p className="font-medium">
                Full-featured legal financial engine supporting Indian GST rules (18% CGST+SGST for intra-state, IGST for inter-state), retainer fees, and partial payment tracking.
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
                <li><strong>Automated Tax Calculation:</strong> Auto-calculates 18% GST breakdowns with legal SAC codes (998211 / 998212).</li>
                <li><strong>Payment Tracking:</strong> Monitor Paid, Partial, and Outstanding balances with clear status indicators and PDF invoice downloads.</li>
              </ul>
            </div>
          </div>

          {/* Module 8: Document Vault & PaddleOCR Engine */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-base text-slate-900 border-b border-slate-200 pb-2">
              <FolderLock className="w-5 h-5 text-indigo-600" />
              <span>8. Secure Document Vault & PaddleOCR Multi-Lingual Engine</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2">
              <p className="font-medium">
                Cloud-hosted document storage integrated with PaddleOCR for extracting searchable text from low-quality scanned court documents, handwritten FIRs, and regional language pleadings.
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
                <li><strong>Devanagari Hindi & Bengali Support:</strong> Specialized OCR models optimized for Indian High Courts and regional trial courts.</li>
                <li><strong>Automated Document Categorization:</strong> Tag documents under Pleadings, Evidence, Orders/Judgments, Client Records, or Notices.</li>
                <li><strong>Ready Legal Templates:</strong> Built-in templates for Vakalatanama, Affidavits, Caveats, and Statutory Notices.</li>
              </ul>
            </div>
          </div>

          {/* Module 9: WhatsApp Notifications */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-base text-slate-900 border-b border-slate-200 pb-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>9. Automated WhatsApp Alerts & Court Reminders</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2">
              <p className="font-medium">
                Direct WhatsApp integration to send automated court date notifications, next hearing summaries, and invoice payment reminders directly to clients.
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
                <li><strong>One-Click Client Updates:</strong> Send professional court outcome reports over WhatsApp instantly after hearings finish.</li>
                <li><strong>Fee Reminder Messages:</strong> Send polite, automated WhatsApp messages for overdue tax invoices with payment details.</li>
              </ul>
            </div>
          </div>

          {/* Module 10: Firm Management & Statutory Payroll */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-base text-slate-900 border-b border-slate-200 pb-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>10. Firm Management, Multi-Tenant Security & Statutory Payroll</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2">
              <p className="font-medium">
                Enterprise law firm architecture with multi-tenant data isolation, associate role permissions, and compliant Indian statutory payroll processing.
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
                <li><strong>Multi-Tenant Data Isolation:</strong> Every law firm account operates in an isolated secure partition in Firebase Cloud Database.</li>
                <li><strong>Indian Statutory Payroll:</strong> Compute Employee Provident Fund (EPF), Employees State Insurance (ESIC), Professional Tax (PT), and Income Tax TDS automatically per Indian labour laws.</li>
              </ul>
            </div>
          </div>

          {/* Module 11: Help Center & Learning Hub */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-base text-slate-900 border-b border-slate-200 pb-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <span>11. Official Help Center, Video Academy & Grounded Support Copilot</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2">
              <p className="font-medium">
                Comprehensive training and support ecosystem including interactive articles, video tutorials, error diagnostics, and direct engineering support ticket tracking.
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
                <li><strong>Multilingual Support:</strong> Full documentation rendered in English, Hindi (हिंदी), and Bengali (বাংলা).</li>
                <li><strong>Interactive Onboarding Tour:</strong> Guided step-by-step onboarding walkthrough for new advocates and chamber clerks.</li>
                <li><strong>Error Diagnostic Engine:</strong> Troubleshooting database containing resolution protocols for system codes (e.g., ERR_OCR_PDF_ENCRYPTED, ERR_CAUSELIST_BAR_NO_MISMATCH).</li>
              </ul>
            </div>
          </div>

          {/* Security & Compliance Footer */}
          <div className="pt-6 border-t-2 border-slate-200 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Security & Regulatory Compliance Guarantee</span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">LawyerDesk Security Standard</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                LawyerDesk AI adheres strictly to advocate-client privilege principles, Bar Council of India guidelines, and Indian IT Act regulations. All client data is encrypted at rest and in transit. Your firm's uploaded documents are never used for public AI training.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-medium pt-2">
              <div>Generated via LawyerDesk AI Operating System (lawyerdesk.co.in)</div>
              <div>Contact: +91 98361 30393 | Email: deinrimsolutionss@gmail.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
