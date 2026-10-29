import React, { useState } from 'react';
import {
  X, ChevronLeft, ChevronRight, Scale, CalendarDays, Bot,
  FileText, Receipt, Users, BarChart3, ShieldCheck, MessageSquare,
  CheckCircle2, Landmark, Sparkles, Play,
} from 'lucide-react';

interface ProductTourViewProps {
  onClose: () => void;
  onTryDemo: () => void;
}

const GOLD = '#B8881A';
const NAVY = '#0b1220';

const SLIDES = [
  {
    id: 1,
    icon: Scale,
    color: '#4F46E5',
    bg: '#EEF2FF',
    title: 'Matter & Case Management',
    subtitle: 'Your complete case command centre',
    points: [
      'Track every case from filing to disposal with full timeline',
      'Assign matters to lawyers, set priorities and deadlines',
      'Link documents, hearings, invoices and tasks to each matter',
      'Kanban board view — drag cases across workflow stages',
    ],
    screen: { label: 'Cases Dashboard', rows: ['WP(C) 4120/2024 — Apex Infra vs DDA', 'CRL.A. 221/2023 — State vs Sharma', 'CS(OS) 778/2024 — Kapoor v. Mehta'], badge: ['High Court', 'District Court', 'Civil Court'], status: ['Active', 'Hearing Due', 'Pending Docs'] },
  },
  {
    id: 2,
    icon: CalendarDays,
    color: '#D97706',
    bg: '#FEF3C7',
    title: 'Hearing Calendar & eCourt Tracker',
    subtitle: 'Never miss a hearing date again',
    points: [
      'Auto-sync with eCourts cause list using CNR number',
      'Daily WhatsApp alerts to lawyers & clients before hearing',
      'Visual calendar grid — colour-coded by court & stage',
      'Post-hearing voice dictation → AI summary + next date',
    ],
    screen: { label: 'Today\'s Hearings', rows: ['Delhi HC · Court No. 24 · WP(C) 4120', 'NCLT Delhi · Hall 7 · CP(IB)/1234', 'Calcutta HC · Court 11 · CRL.A. 221'], badge: ['10:30 AM', '11:00 AM', '2:15 PM'], status: ['Confirmed', 'Adjourned', 'Board Listed'] },
  },
  {
    id: 3,
    icon: Bot,
    color: '#059669',
    bg: '#ECFDF5',
    title: 'AI Legal Copilot & Drafting Studio',
    subtitle: 'Zero-hallucination answers from your own files',
    points: [
      'Ask questions grounded strictly in your uploaded case files',
      'AI drafts Written Statements, Bail Applications, Legal Notices',
      'PaddleOCR extracts Hindi/Bengali text from scanned documents',
      'All AI answers cite the exact paragraph from your brief',
    ],
    screen: { label: 'AI Copilot Chat', rows: ['"What are the key arguments in the Delhi HC petition?"', '"Draft a legal notice under Section 138 NI Act"', '"Summarise the latest order in CP(IB)/1234"'], badge: ['Cited Doc', 'Draft Ready', 'Grounded'], status: ['3 sources', 'Auto-formatted', 'Court-ready'] },
  },
  {
    id: 4,
    icon: Receipt,
    color: '#7C3AED',
    bg: '#F5F3FF',
    title: 'GST Billing & Invoicing',
    subtitle: 'Professional invoices in seconds',
    points: [
      'GST-compliant invoices with 18% CGST/SGST auto-calculation',
      'Track retainers, appearance fees and consultation charges',
      'Payment aging — Outstanding, Partially Paid, Overdue',
      'Export to PDF, share via WhatsApp or email',
    ],
    screen: { label: 'Invoice Register', rows: ['INV-2024-089 · Apex Infra · ₹1,25,000', 'INV-2024-090 · Sharma Family · ₹38,500', 'INV-2024-091 · Kapoor Estates · ₹72,000'], badge: ['Paid', 'Pending', 'Overdue'], status: ['GST paid', 'Due in 5d', '21 days'] },
  },
  {
    id: 5,
    icon: Users,
    color: '#E11D48',
    bg: '#FFF1F2',
    title: 'Client Portal',
    subtitle: 'Your clients stay informed, automatically',
    points: [
      'Clients login to view their cases, hearings and documents',
      'Download invoices, receipts and court orders independently',
      'Real-time status updates — no WhatsApp follow-up needed',
      'PAN / Aadhaar e-KYC verification built in',
    ],
    screen: { label: 'Client Portal', rows: ['My Active Cases: WP(C) 4120/2024', 'Next Hearing: Delhi HC · 15 Nov 2026', 'Invoice Due: INV-091 · ₹72,000'], badge: ['Your Case', 'Upcoming', 'Action Required'], status: ['Active', '10:30 AM', 'Pay Now'] },
  },
  {
    id: 6,
    icon: BarChart3,
    color: '#0284C7',
    bg: '#E0F2FE',
    title: 'Reports & Dashboards',
    subtitle: 'Your firm\'s performance at a glance',
    points: [
      'Revenue by lawyer, matter type and time period',
      'Collection aging — Outstanding, Overdue, Collected',
      'Hearing attendance and case disposal rate tracking',
      'Export reports to Excel, PDF or print',
    ],
    screen: { label: 'Revenue Dashboard', rows: ['Total Billed (Oct 2026): ₹7.1 Lakh', 'Collected: ₹5.4 Lakh · Outstanding: ₹1.7L', 'Top Earner: Adv. Rajeshwar V. Sharma'], badge: ['Revenue', 'Collections', 'Performance'], status: ['+18% MoM', '76%', '#1 Lawyer'] },
  },
  {
    id: 7,
    icon: ShieldCheck,
    color: '#64748B',
    bg: '#F8FAFC',
    title: 'Security, Roles & Audit Log',
    subtitle: 'Court-grade data protection',
    points: [
      'Role-based access: Senior Advocate, Associate, Clerk, Client',
      'Every action logged — who changed what and when',
      'Client data isolation — no cross-matter leakage possible',
      'Indian data residency — servers hosted within India',
    ],
    screen: { label: 'Audit Log', rows: ['Adv. Ananya Roy — Created invoice INV-091', 'Adv. Vikram Singh — Uploaded Vakalatnama.pdf', 'System — Synced eCourt cause list (NCLT)'], badge: ['2 min ago', '14 min ago', '1 hr ago'], status: ['Billing', 'Documents', 'Automated'] },
  },
];

export function ProductTourView({ onClose, onTryDemo }: ProductTourViewProps) {
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current];
  const Icon = slide.icon;
  const total = SLIDES.length;

  const prev = () => setCurrent((c) => (c === 0 ? total - 1 : c - 1));
  const next = () => setCurrent((c) => (c === total - 1 ? 0 : c + 1));

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#f1f5f9' }}>

      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ background: NAVY, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5" style={{ color: GOLD }} />
          <span className="text-sm font-bold text-white">LawyerDesk AI — Product Tour</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{current + 1} / {total}</span>
          <button onClick={onClose} className="p-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Progress dots */}
      <div className="flex gap-1.5 justify-center pt-4 pb-2 px-4 shrink-0">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className="rounded-full transition-all"
            style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? GOLD : '#cbd5e1' }} />
        ))}
      </div>

      {/* Slide content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">

        {/* Icon + title */}
        <div className="flex items-center gap-3 mt-2 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: slide.bg }}>
            <Icon className="w-6 h-6" style={{ color: slide.color }} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">{slide.title}</h2>
            <p className="text-sm text-slate-500">{slide.subtitle}</p>
          </div>
        </div>

        {/* Mock screen */}
        <div className="rounded-2xl overflow-hidden mb-4" style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Browser bar */}
          <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
            <div className="flex-1 mx-2 px-2 py-0.5 rounded text-[10px] text-slate-500" style={{ background: 'rgba(255,255,255,0.06)' }}>
              lawyerdesk.co.in · {slide.screen.label}
            </div>
          </div>
          {/* Rows */}
          <div className="p-3 space-y-2">
            {slide.screen.rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-white truncate">{row}</p>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-lg shrink-0"
                  style={{ background: 'rgba(184,136,26,0.2)', color: '#D4A82A' }}>
                  {slide.screen.badge[i]}
                </span>
                <span className="text-[9px] text-slate-400 shrink-0">{slide.screen.status[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature points */}
        <div className="space-y-2.5 mb-4">
          {slide.points.map((pt, i) => (
            <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-2xl"
              style={{ background: '#fff', border: '1px solid #f1f5f9' }}>
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
              <p className="text-sm text-slate-700 leading-snug">{pt}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 px-4 pb-6 pt-3 space-y-2" style={{ background: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
        <div className="flex gap-2">
          <button onClick={prev}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold"
            style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#475569' }}>
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <button onClick={next}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold"
            style={{ background: GOLD, color: '#fff' }}>
            {current === total - 1 ? 'Restart' : 'Next'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <button onClick={onTryDemo}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold"
          style={{ background: NAVY, color: '#fff' }}>
          <Play className="w-4 h-4" style={{ color: GOLD }} />
          Try Live Demo — No Signup Needed
        </button>
      </div>

    </div>
  );
}

export default ProductTourView;
