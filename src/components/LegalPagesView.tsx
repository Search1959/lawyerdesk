import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  HelpCircle,
  Trash2,
  Lock,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Send,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Scale,
  Sparkles
} from 'lucide-react';
import { saveDocument } from '../lib/firebase';

export type PolicyPageType = 'privacy' | 'terms' | 'support' | 'deletion';

interface LegalPagesViewProps {
  initialTab?: PolicyPageType;
  onClose?: () => void;
}

export const LegalPagesView: React.FC<LegalPagesViewProps> = ({
  initialTab = 'privacy',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<PolicyPageType>(initialTab);

  // Support Form State
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    phone: '',
    courtJurisdiction: 'Delhi High Court',
    category: 'e-Courts Cause List Sync',
    subject: '',
    message: ''
  });
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [supportTicketId, setSupportTicketId] = useState('');

  // Data Deletion State
  const [deletionForm, setDeletionForm] = useState({
    adminEmail: '',
    firmName: '',
    barCouncilNo: '',
    reason: 'Account closure / Firm migration',
    confirmCheckbox: false
  });
  const [deletionSubmitted, setDeletionSubmitted] = useState(false);
  const [deletionTicketId, setDeletionTicketId] = useState('');

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = `SUP-LD-${Math.floor(100000 + Math.random() * 900000)}`;
    setSupportTicketId(ticketId);

    try {
      await saveDocument('support_tickets', {
        id: ticketId,
        ...supportForm,
        status: 'Open',
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.log('Logged ticket locally:', ticketId);
    }

    setSupportSubmitted(true);
  };

  const handleDeletionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletionForm.confirmCheckbox) return;

    const ticketId = `DEL-LD-${Math.floor(100000 + Math.random() * 900000)}`;
    setDeletionTicketId(ticketId);

    try {
      await saveDocument('deletion_requests', {
        id: ticketId,
        ...deletionForm,
        status: 'Pending Verification',
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.log('Logged deletion request locally:', ticketId);
    }

    setDeletionSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#090d18]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                LAWYERDESK AI <span className="text-xs font-mono text-indigo-400 font-normal">(lawyerdesk.co.in)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Legal Compliance & Regulatory Standards Portal
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <Building2 className="w-4 h-4 text-orange-400" />
          <span>M/s Deinrim Solutionss (P) Ltd.</span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-[#0b101d] border-b border-slate-800 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Privacy Policy
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'terms'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            Terms of Service
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'support'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            App Support Page
          </button>

          <button
            onClick={() => setActiveTab('deletion')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'deletion'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800/60'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Data Deletion Request
          </button>
        </div>
      </div>

      {/* Page Body Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* PRIVACY POLICY PAGE */}
        {activeTab === 'privacy' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8 shadow-xl text-left">
            <div className="border-b border-slate-800 pb-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Effective Date: July 2026 • DPDP Act 2023 Compliant</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Privacy Policy & Data Processing Standards
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Official privacy standards for LawyerDesk AI (<span className="text-indigo-400">lawyerdesk.co.in</span>), operated by <strong className="text-white">M/s Deinrim Solutionss (P) Ltd.</strong>
              </p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  1. Corporate Identity & Domain Notice
                </h3>
                <p>
                  LawyerDesk AI, accessible via <strong className="text-white">lawyerdesk.co.in</strong>, is developed, owned, and operated exclusively by <strong>M/s Deinrim Solutionss (P) Ltd.</strong>, headquartered in Kolkata, West Bengal (WB), India.
                  We provide an AI-First Enterprise Legal Operating System tailored for Indian High Courts, District Courts, NCLT, DRT, and corporate advocate chambers.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  2. DPDP Act 2023 & Bar Council Privacy Standards
                </h3>
                <p>
                  We adhere strictly to India’s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and the confidentiality mandates prescribed by the <strong>Bar Council of India</strong>. Client case files, advocate-client privileged communications, and cause list subscriptions are processed with strict multi-tenant isolation.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  3. Grounded AI Models & Zero-Retention Training Guarantee
                </h3>
                <p>
                  Our legal AI copilot utilizes grounded <strong>Gemini 3.6 Flash</strong> and <strong>PaddleOCR</strong> vector embeddings.
                  <strong className="text-amber-400 block mt-1">Zero Global Model Training:</strong> Your uploaded petitions, case briefs, scanned documents, and case queries are NEVER used to train, fine-tune, or improve public AI models. All vector extractions reside in isolated tenant storage.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  4. Data Encryption & Storage Infrastructure
                </h3>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Encryption Standard:</span>
                    <span className="font-mono text-emerald-400 font-bold">AES-256 (At Rest & In Transit)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Database Engine:</span>
                    <span className="font-mono text-indigo-300 font-bold">Isolated Multi-Tenant Cloud Firestore</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Automated Backup Schedule:</span>
                    <span className="font-mono text-amber-400 font-bold">Every 6 Hours (High Availability)</span>
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  5. Contact Corporate Data Protection Desk
                </h3>
                <p>
                  For privacy officer inquiries or data handling audits, please contact:
                </p>
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div><strong className="text-white">Entity:</strong> M/s Deinrim Solutionss (P) Ltd.</div>
                  <div><strong className="text-white">Address:</strong> Kolkata, West Bengal (WB), India</div>
                  <div><strong className="text-white">Direct Hotline:</strong> <span className="text-amber-400 font-mono font-bold">+91 98361-30393</span></div>
                  <div><strong className="text-white">Official Domain:</strong> lawyerdesk.co.in</div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* TERMS OF SERVICE PAGE */}
        {activeTab === 'terms' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8 shadow-xl text-left">
            <div className="border-b border-slate-800 pb-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 text-xs font-semibold">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Terms & Conditions • LawyerDesk AI Framework v3.5</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Terms of Service & Operational Standards
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Legal terms governing usage of lawyerdesk.co.in, operated by <strong className="text-white">M/s Deinrim Solutionss (P) Ltd.</strong>
              </p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  1. Agreement & Platform Subscription
                </h3>
                <p>
                  By registering or accessing LawyerDesk AI at <strong>lawyerdesk.co.in</strong>, you agree to these Terms of Service.
                  LawyerDesk AI provides software tools for cause list synchronization, legal drafting, document OCR extraction, and GST fee invoicing.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  2. Advocate Professional Responsibility & AI Verification
                </h3>
                <p>
                  LawyerDesk AI is an assistive copilot. All generated legal notices, petitions, draft applications, and legal research citations must be reviewed and verified by a licensed advocate registered with the Bar Council of India prior to court submission.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  3. Service Level Agreement (SLA) & Uptime
                </h3>
                <p>
                  M/s Deinrim Solutionss (P) Ltd. provides a <strong className="text-emerald-400">99.9% Uptime SLA</strong> for active cloud workspaces, backed by automated container health monitors and real-time database replication.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  4. GST Invoicing & Tax Compliance
                </h3>
                <p>
                  All legal services fee invoices generated through the portal comply with Indian GST rules (18% CGST + SGST or IGST). Tax invoices generated by tenant firms remain the sole responsibility of the respective law firm or advocate chamber.
                </p>
              </section>
            </div>
          </div>
        )}

        {/* APP SUPPORT PAGE */}
        {activeTab === 'support' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8 shadow-xl text-left">
            <div className="border-b border-slate-800 pb-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 text-xs font-semibold">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>24/7 Corporate Technical Desk</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                App Support Page & Technical HelpDesk
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Direct support portal for advocate accounts on lawyerdesk.co.in operated by M/s Deinrim Solutionss (P) Ltd.
              </p>
            </div>

            {/* Support Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <Phone className="w-5 h-5 text-amber-400 mb-1" />
                <div className="text-xs font-bold text-slate-400 uppercase">Corporate Support Hotline</div>
                <div className="text-sm font-bold text-white font-mono">+91 98361-30393</div>
                <div className="text-[11px] text-slate-500">Mon - Sat (9:00 AM - 8:00 PM IST)</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <Building2 className="w-5 h-5 text-indigo-400 mb-1" />
                <div className="text-xs font-bold text-slate-400 uppercase">Operating Headquarters</div>
                <div className="text-sm font-bold text-white">M/s Deinrim Solutionss (P) Ltd.</div>
                <div className="text-[11px] text-slate-500">Kolkata, West Bengal (WB), India</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-slate-400 uppercase">e-Courts Cause List Desk</div>
                <div className="text-sm font-bold text-white">Daily High Court & District Sync</div>
                <div className="text-[11px] text-slate-500">Support for e-Courts Portal 3.0</div>
              </div>
            </div>

            {/* Support Ticket Submission Form */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-400" />
                Submit Technical Support Ticket
              </h3>

              {supportSubmitted ? (
                <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-xl p-5 space-y-2 text-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                    <CheckCircle2 className="w-5 h-5" />
                    Support Ticket Generated Successfully!
                  </div>
                  <div className="text-xs text-slate-300">
                    Ticket ID: <span className="font-mono text-amber-400 font-bold">{supportTicketId}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Our technical team at M/s Deinrim Solutionss (P) Ltd. will investigate your inquiry and contact you at <strong className="text-white">{supportForm.email}</strong> or <strong className="text-white">{supportForm.phone}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSupportSubmitted(false);
                      setSupportForm({
                        name: '',
                        email: '',
                        phone: '',
                        courtJurisdiction: 'Delhi High Court',
                        category: 'e-Courts Cause List Sync',
                        subject: '',
                        message: ''
                      });
                    }}
                    className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Submit Another Support Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Advocate / Firm Contact Name *</label>
                      <input
                        type="text"
                        required
                        value={supportForm.name}
                        onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                        placeholder="Adv. Rajesh Sharma"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={supportForm.email}
                        onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                        placeholder="advocate@lawfirm.in"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone Number *</label>
                      <input
                        type="text"
                        required
                        value={supportForm.phone}
                        onChange={(e) => setSupportForm({ ...supportForm, phone: e.target.value })}
                        placeholder="+91 98000 00000"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Court Jurisdiction</label>
                      <select
                        value={supportForm.courtJurisdiction}
                        onChange={(e) => setSupportForm({ ...supportForm, courtJurisdiction: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="Delhi High Court">Delhi High Court</option>
                        <option value="Bombay High Court">Bombay High Court</option>
                        <option value="Calcutta High Court">Calcutta High Court</option>
                        <option value="Madras High Court">Madras High Court</option>
                        <option value="Allahabad High Court">Allahabad High Court</option>
                        <option value="District Courts e-Courts">District Courts (e-Courts)</option>
                        <option value="NCLT / DRT Tribunal">NCLT / DRT Tribunal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Support Category</label>
                      <select
                        value={supportForm.category}
                        onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="e-Courts Cause List Sync">e-Courts Cause List Sync</option>
                        <option value="PaddleOCR Document Search">PaddleOCR Document Search</option>
                        <option value="AI Legal Drafting Engine">AI Legal Drafting Engine</option>
                        <option value="GST Billing & Invoice Setup">GST Billing & Invoice Setup</option>
                        <option value="Multi-Tenant Account Setup">Multi-Tenant Account Setup</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Subject / Brief Issue Summary *</label>
                    <input
                      type="text"
                      required
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                      placeholder="e.g. Cause list auto-fetch error for Item No. 14"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Detailed Inquiry Description *</label>
                    <textarea
                      rows={4}
                      required
                      value={supportForm.message}
                      onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                      placeholder="Please provide details about the issue or question..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Support Ticket to Deinrim Engineers
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* DATA DELETION REQUEST PAGE */}
        {activeTab === 'deletion' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8 shadow-xl text-left">
            <div className="border-b border-slate-800 pb-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 border border-rose-700/60 text-rose-300 text-xs font-semibold">
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Tenant Isolation & Full Erasure Protocol</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Data Deletion Request Portal
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Initiate full tenant database purge and legal document shredding under DEINRIM Framework v3.5 protocol on <span className="text-indigo-400">lawyerdesk.co.in</span>.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Data Purge Terms & Scope
              </h3>
              <p>
                Submitting a deletion request will trigger an immutable tenant purge across M/s Deinrim Solutionss (P) Ltd. isolated cloud infrastructure:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs">
                <li>Permanent deletion of all case files, cause list hearings, and client contacts.</li>
                <li>Shredding of PaddleOCR extracted document vector indexes.</li>
                <li>Purge of GST fee invoices, retainers, and accounting audit logs.</li>
                <li>Unlinking of advocate account credentials and firm tenant keys.</li>
              </ul>
            </div>

            {deletionSubmitted ? (
              <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-xl p-6 space-y-3 text-emerald-200">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                  <CheckCircle2 className="w-6 h-6" />
                  Data Deletion Request Officially Registered!
                </div>
                <div className="text-xs text-slate-300">
                  Request Ref ID: <span className="font-mono text-amber-400 font-bold">{deletionTicketId}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your tenant erasure request for <strong className="text-white">{deletionForm.firmName}</strong> (<span className="font-mono text-emerald-300">{deletionForm.adminEmail}</span>) has been logged in our compliance ledger.
                  M/s Deinrim Solutionss (P) Ltd. Data Protection Officer will complete the isolated tenant purge within 24 hours.
                </p>
                <div className="text-xs text-slate-400 pt-2 border-t border-emerald-800/60">
                  For emergency cancellation prior to purge, contact corporate support at <strong className="text-amber-400 font-mono">+91 98361-30393</strong>.
                </div>
              </div>
            ) : (
              <form onSubmit={handleDeletionSubmit} className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Registered Advocate / Firm Admin Email *</label>
                    <input
                      type="email"
                      required
                      value={deletionForm.adminEmail}
                      onChange={(e) => setDeletionForm({ ...deletionForm, adminEmail: e.target.value })}
                      placeholder="admin@lawfirm.in"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Firm / Chamber Legal Entity Name *</label>
                    <input
                      type="text"
                      required
                      value={deletionForm.firmName}
                      onChange={(e) => setDeletionForm({ ...deletionForm, firmName: e.target.value })}
                      placeholder="e.g. Apex Legal Associates"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Bar Council Registration No.</label>
                    <input
                      type="text"
                      value={deletionForm.barCouncilNo}
                      onChange={(e) => setDeletionForm({ ...deletionForm, barCouncilNo: e.target.value })}
                      placeholder="e.g. D/1920/2018"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Reason for Data Deletion</label>
                    <select
                      value={deletionForm.reason}
                      onChange={(e) => setDeletionForm({ ...deletionForm, reason: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    >
                      <option value="Account closure / Firm migration">Account closure / Firm migration</option>
                      <option value="Data privacy compliance requirement">Data privacy compliance requirement</option>
                      <option value="Duplicate or test tenant cleanup">Duplicate or test tenant cleanup</option>
                      <option value="Other legal reason">Other legal reason</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={deletionForm.confirmCheckbox}
                      onChange={(e) => setDeletionForm({ ...deletionForm, confirmCheckbox: e.target.checked })}
                      className="mt-0.5 rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-xs text-slate-300 leading-snug">
                      I confirm that I am an authorized administrator for this law firm/advocate chamber and request permanent erasure of all tenant database records on <strong>lawyerdesk.co.in</strong>.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!deletionForm.confirmCheckbox}
                  className={`px-6 py-3 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                    deletionForm.confirmCheckbox
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  Submit Official Data Purge Request
                </button>
              </form>
            )}
          </div>
        )}

      </main>

      {/* Footer Notice */}
      <footer className="bg-[#050810] border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500 space-y-1">
        <div>LAWYERDESK AI • <span className="text-slate-300">lawyerdesk.co.in</span> • Operated & Developed by M/s Deinrim Solutionss (P) Ltd.</div>
        <div>DEINRIM Legal OS Framework v3.5 • Isolated Multi-Tenant High-Performance Legal Architecture</div>
      </footer>
    </div>
  );
};
