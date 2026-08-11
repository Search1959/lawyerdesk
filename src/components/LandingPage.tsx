import React, { useState, useEffect } from 'react';
import { Footer } from './Footer';
import {
  Scale, Sparkles, ShieldCheck, CalendarDays, FileText,
  Users, LogIn, CheckCircle2, HelpCircle, ArrowRight,
  Bot, Receipt, Lock, ChevronLeft, ChevronRight,
  ExternalLink, Play, Pause, Landmark, MessageSquare,
  BarChart3, Zap,
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick:   () => void;
  onHelpClick:    () => void;
  onExploreDemo:  () => void;
}

// ─── Palette (CSS vars injected inline on the wrapper) ───────────────────────
const P = {
  parchment:  '#F5F1E8',
  ink:        '#1A1410',
  navy:       '#1B3A6B',
  navyDark:   '#112549',
  gold:       '#B8881A',
  goldLight:  '#D4A82A',
  crimson:    '#8B1A1A',
  surface:    '#FFFFFF',
  muted:      '#7A6A54',
  border:     '#D6CCBA',
  navyBorder: '#2A5298',
};

// ─── Feature Cards ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Sparkles,
    color: '#1B3A6B',
    bg: '#EEF2FB',
    title: 'AI Legal Copilot',
    desc: 'Zero-hallucination answers grounded strictly in your uploaded case files and court orders -- with inline paragraph citations.',
  },
  {
    icon: CalendarDays,
    color: '#8B1A1A',
    bg: '#FBEAEA',
    title: 'eCourt Cause List Tracker',
    desc: 'Daily CNR-based sync with Supreme Court, High Courts, and District Courts. WhatsApp alert when your hearing date changes.',
  },
  {
    icon: FileText,
    color: '#5A3E10',
    bg: '#FDF5E6',
    title: 'Bilingual OCR Engine',
    desc: 'PaddleOCR extracts English, Hindi, and Bengali text from scanned petitions, registered deeds, and FIRs with 98%+ accuracy.',
  },
  {
    icon: Bot,
    color: '#1A5C3A',
    bg: '#E8F5EE',
    title: 'AI Drafting Studio',
    desc: 'Draft court-ready Written Statements, Bail Applications, Legal Notices, and Vakalatnamas -- formatted for Indian court templates.',
  },
  {
    icon: Receipt,
    color: '#6B2D8B',
    bg: '#F5EBF9',
    title: 'GST-Compliant Billing',
    desc: 'Generate professional tax invoices with 18% CGST/SGST, track retainers, record court appearance fees and payment history.',
  },
  {
    icon: Users,
    color: '#8B5A1A',
    bg: '#FDF0E0',
    title: 'Secure Client Portal',
    desc: 'Clients track their own case progress, download documents, and view invoices -- with PAN/Aadhaar e-KYC verification.',
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '500+', label: 'Advocates' },
  { value: '12K+', label: 'Cases Managed' },
  { value: '28',   label: 'High Courts Synced' },
  { value: '100%', label: 'Citation Grounded AI' },
];

// ─── Pricing ─────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Solo',
    price: '₹999',
    sub: '/month',
    desc: 'Individual practitioner',
    features: ['1 Lawyer Account', '50 Cases', 'AI Copilot', 'GST Invoicing', 'eCourt Tracker'],
    highlight: false,
  },
  {
    name: 'Firm',
    price: '₹2,499',
    sub: '/month',
    desc: 'Small to mid-size firm',
    features: ['Up to 10 Lawyers', 'Unlimited Cases', 'AI Drafting Studio', 'Client Portal', 'WhatsApp Reminders', 'Team Management'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '₹5,999',
    sub: '/month',
    desc: 'Large firm / chambers',
    features: ['Unlimited Lawyers', 'Custom Branding', 'Priority Support', 'API Access', 'Audit Logs', 'Dedicated Server'],
    highlight: false,
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'How does the AI avoid hallucinations in legal answers?',
    a: 'The grounded RAG engine queries only your uploaded case files and court orders. If evidence is absent in the brief, it explicitly states so -- it never fabricates case law or citations.',
  },
  {
    q: 'Does it fetch live court cause lists automatically?',
    a: 'Yes. LawyerDesk syncs with eCourts India daily using your CNR numbers -- extracting item number, judge, court hall, and next hearing date. WhatsApp alerts fire when dates change.',
  },
  {
    q: 'Is client data safe and DPDP Act compliant?',
    a: "All data is encrypted AES-256 at rest and TLS 1.3 in transit. Each law firm's data is strictly isolated. Role-based access ensures lawyers see only their assigned cases.",
  },
  {
    q: 'What user roles does LawyerDesk support?',
    a: 'System Admin, Firm Admin, Senior Advocate, Associate, Junior Counsel, Stenographer, Accounts Staff, Reception, and Client Portal User.',
  },
];

// ─── Dashboard Slides ─────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 'ai',
    tab: 'AI Copilot',
    icon: Sparkles,
    title: 'Grounded Legal AI',
    subtitle: 'Zero-hallucination case brief search',
    badge: 'RAG ENGINE',
    content: (
      <div className="space-y-3 text-xs font-inter">
        <div className="p-3 rounded-xl border" style={{ background: '#F5F1E8', borderColor: '#D6CCBA' }}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: '#7A6A54' }}>Query -- Title Suit No. 87/2024</p>
          <p className="font-semibold" style={{ color: '#1A1410' }}>"Who is the plaintiff and what is their undivided share in the Belghoria property?"</p>
        </div>
        <div className="p-3 rounded-xl border space-y-2" style={{ background: '#EEF2FB', borderColor: '#C0CFED' }}>
          <p className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Citation Verified
          </p>
          <p className="leading-relaxed" style={{ color: '#1A1410' }}>
            <strong>Shri Sohanlal Jaiswal</strong> holds <strong>4/18 (2/9) undivided share</strong> valued at <strong>Rs. 7.42 Crores</strong>.
          </p>
          <div className="text-[10px] pt-1 border-t" style={{ borderColor: '#C0CFED', color: '#1B3A6B' }}>
            <span className="font-bold">Source:</span> belghoria-property-detail.pdf · Para 2
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'ecourt',
    tab: 'eCourt Tracker',
    icon: Landmark,
    title: 'Live Cause List Board',
    subtitle: 'CNR-based daily sync with all courts',
    badge: 'LIVE SYNC',
    content: (
      <div className="space-y-3 text-xs font-inter">
        <div className="p-3 rounded-xl border flex items-center justify-between" style={{ background: '#F5F1E8', borderColor: '#D6CCBA' }}>
          <span className="font-bold" style={{ color: '#1A1410' }}>Daily Board · Delhi High Court</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#1B3A6B', color: '#fff' }}>AUTO-SYNCED</span>
        </div>
        {[
          { no: '#14', case: 'CS(COMM) 420/2024', court: "Court Room 24 · Hon'ble Sanjeev Narula J.", time: '10:30 AM' },
          { no: '#28', case: 'Title Suit 87/2024',  court: 'Court Room 3 · Ld. 3rd Civil Judge Barasat', time: '2:00 PM' },
        ].map((h) => (
          <div key={h.no} className="p-3 rounded-xl border flex items-center justify-between" style={{ background: '#FFFFFF', borderColor: '#D6CCBA' }}>
            <div>
              <p className="font-bold" style={{ color: '#1B3A6B' }}>Item {h.no} · {h.case}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#7A6A54' }}>{h.court}</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-1 rounded-lg" style={{ background: '#FDF0E0', color: '#B8881A' }}>{h.time}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'drafting',
    tab: 'AI Drafting',
    icon: Bot,
    title: 'AI Drafting Studio',
    subtitle: 'Court-formatted Indian legal documents',
    badge: 'DRAFTING',
    content: (
      <div className="space-y-3 text-xs font-inter">
        <div className="p-3 rounded-xl border space-y-1" style={{ background: '#F5F1E8', borderColor: '#D6CCBA' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#B8881A' }}>In the Court of Ld. 3rd Civil Judge at Barasat</p>
          <p className="font-bold" style={{ color: '#1A1410' }}>Title Suit No. 87 of 2024</p>
          <p className="italic" style={{ color: '#7A6A54' }}>Application for Ad-Interim Injunction under Order 39 Rules 1 & 2 r/w Section 151 C.P.C.</p>
        </div>
        <div className="p-2.5 rounded-xl border" style={{ background: '#E8F5EE', borderColor: '#A8D5BB' }}>
          <p className="font-semibold text-emerald-800">✓ Formatted to court template specifications</p>
          <p style={{ color: '#7A6A54' }} className="mt-0.5">Includes Schedule A–D property descriptions & prayer clauses</p>
        </div>
      </div>
    ),
  },
  {
    id: 'billing',
    tab: 'GST Billing',
    icon: Receipt,
    title: 'GST-Compliant Invoicing',
    subtitle: '18% CGST/SGST legal service billing',
    badge: '18% GST',
    content: (
      <div className="space-y-3 text-xs font-inter">
        <div className="p-3 rounded-xl border space-y-2" style={{ background: '#FFFFFF', borderColor: '#D6CCBA' }}>
          <div className="flex justify-between">
            <span className="font-bold" style={{ color: '#1A1410' }}>Invoice #INV-2026-089</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700" style={{ background: '#E8F5EE' }}>PAID</span>
          </div>
          <p style={{ color: '#7A6A54' }}>Client: Shri Sohanlal Jaiswal</p>
          {[
            { label: 'Court Appearance Fee', val: 'Rs. 45,000', bold: false },
            { label: '18% CGST + SGST',      val: 'Rs. 8,100',  bold: false },
            { label: 'Total Amount',          val: 'Rs. 53,100', bold: true  },
          ].map((r) => (
            <div key={r.label} className="flex justify-between pt-1 border-t" style={{ borderColor: '#D6CCBA' }}>
              <span style={{ color: '#7A6A54' }}>{r.label}</span>
              <span className={r.bold ? 'font-bold' : ''} style={{ color: r.bold ? '#1B3A6B' : '#1A1410' }}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onHelpClick, onExploreDemo }) => {
  const [activeFaq,  setActiveFaq]  = useState<number | null>(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay,    setAutoPlay]    = useState(true);

  useEffect(() => {
    document.title = "LawyerDesk -- India's Complete Legal Practice Platform";
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => setActiveSlide((p) => (p + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, [autoPlay]);

  const nextSlide = () => setActiveSlide((p) => (p + 1) % SLIDES.length);
  const prevSlide = () => setActiveSlide((p) => (p - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="font-inter" style={{ background: P.parchment, color: P.ink, minHeight: '100vh' }}>

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav style={{ background: P.navyDark, borderBottom: `1px solid ${P.navyBorder}` }}
           className="sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
               style={{ background: P.gold }}>
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-playfair text-base font-bold text-white leading-tight tracking-wide">
              Lawyer<span style={{ color: P.goldLight }}>Desk</span>
            </p>
            <p className="text-[9px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
              India's Legal Practice Platform
            </p>
          </div>
        </div>

        {/* Nav links -- desktop */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {['Features', 'eCourt Tracker', 'Pricing', 'Help'].map((label) => (
            <a key={label}
               href={label === 'Help' ? '#help' : `#${label.toLowerCase().replace(' ', '-')}`}
               onClick={label === 'Help' ? (e) => { e.preventDefault(); onHelpClick(); } : undefined}
               className="hover:text-white transition-colors">
              {label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <button onClick={onExploreDemo}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.15)`, color: '#fff' }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: P.goldLight }} />
            Live Demo
          </button>
          <button onClick={onLoginClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
                  style={{ background: P.gold }}>
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      {/* Navy letterhead band */}
      <div style={{ background: P.navyDark, borderBottom: `3px solid ${P.gold}` }} className="px-6 pt-14 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left -- headline */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                 style={{ background: 'rgba(184,136,26,0.15)', border: `1px solid rgba(184,136,26,0.35)`, color: P.goldLight }}>
              <Zap className="w-3.5 h-3.5" />
              Trusted by 500+ Indian Advocates
            </div>

            <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-white leading-[1.15]"
                style={{ textWrap: 'balance' } as any}>
              Your Practice.<br />
              <span style={{ color: P.goldLight }}>Our Technology.</span><br />
              Better Justice.
            </h1>

            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              LawyerDesk is India's complete legal practice management platform -- built for advocates
              at High Courts, District Courts, NCLT, and DRT. Manage cases, track cause lists,
              draft documents with AI, and bill clients -- all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={onLoginClick}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all"
                      style={{ background: P.gold }}>
                Sign In / Admin Portal <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onExploreDemo}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.18)`, color: '#fff' }}>
                <Play className="w-4 h-4" style={{ color: P.goldLight }} />
                Explore Live Workspace
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 pt-6" style={{ borderTop: `1px solid rgba(255,255,255,0.1)` }}>
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-playfair text-xl font-bold" style={{ color: P.goldLight }}>{s.value}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right -- feature slides */}
          <div className="rounded-2xl overflow-hidden shadow-2xl"
               style={{ background: P.parchment, border: `1px solid ${P.border}` }}
               onMouseEnter={() => setAutoPlay(false)}
               onMouseLeave={() => setAutoPlay(true)}>

            {/* Slide tabs */}
            <div className="flex overflow-x-auto" style={{ borderBottom: `1px solid ${P.border}`, background: P.surface }}>
              {SLIDES.map((s, i) => {
                const Icon = s.icon;
                const active = i === activeSlide;
                return (
                  <button key={s.id} onClick={() => setActiveSlide(i)}
                          className="flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold whitespace-nowrap shrink-0 transition-all"
                          style={{
                            color: active ? P.navy : P.muted,
                            borderBottom: active ? `2px solid ${P.gold}` : '2px solid transparent',
                            background: active ? P.parchment : 'transparent',
                          }}>
                    <Icon className="w-3.5 h-3.5" />
                    {s.tab}
                  </button>
                );
              })}
            </div>

            {/* Slide content */}
            <div className="p-5 space-y-3 min-h-[280px]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-playfair text-base font-bold" style={{ color: P.ink }}>{SLIDES[activeSlide].title}</p>
                  <p className="text-xs mt-0.5" style={{ color: P.muted }}>{SLIDES[activeSlide].subtitle}</p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded"
                      style={{ background: P.navy, color: '#fff' }}>
                  {SLIDES[activeSlide].badge}
                </span>
              </div>
              {SLIDES[activeSlide].content}
            </div>

            {/* Slide controls */}
            <div className="flex items-center justify-between px-5 py-3"
                 style={{ borderTop: `1px solid ${P.border}` }}>
              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => setActiveSlide(i)}
                          className="h-1.5 rounded-full transition-all"
                          style={{ width: i === activeSlide ? 20 : 6, background: i === activeSlide ? P.gold : P.border }} />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={prevSlide} className="p-1.5 rounded-lg transition-colors"
                        style={{ background: P.surface, border: `1px solid ${P.border}`, color: P.muted }}>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setAutoPlay(!autoPlay)} className="p-1.5 rounded-lg transition-colors"
                        style={{ background: P.surface, border: `1px solid ${P.border}`, color: P.muted }}>
                  {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button onClick={nextSlide} className="p-1.5 rounded-lg transition-colors"
                        style={{ background: P.surface, border: `1px solid ${P.border}`, color: P.muted }}>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trusted by bar ──────────────────────────────────────────────────── */}
      <div className="py-5 px-6 text-center text-xs font-medium" style={{ borderBottom: `1px solid ${P.border}`, color: P.muted }}>
        Serving advocates at &nbsp;
        {['Delhi High Court', 'Calcutta High Court', 'Bombay High Court', 'NCLT New Delhi', 'District Courts across India'].map((c, i) => (
          <span key={c}>{i > 0 && ' · '}<span style={{ color: P.navy, fontWeight: 600 }}>{c}</span></span>
        ))}
      </div>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: P.gold }}>
            Built for Indian Legal Practice
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold" style={{ color: P.ink, textWrap: 'balance' } as any}>
            Everything an Indian advocate needs
          </h2>
          <p className="text-sm max-w-xl mx-auto mt-2" style={{ color: P.muted }}>
            From cause list tracking to AI drafting -- designed specifically for Indian courts, Indian law, and Indian billing requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl p-6 space-y-4 transition-all hover:-translate-y-0.5"
                   style={{ background: P.surface, border: `1px solid ${P.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                     style={{ background: f.bg, color: f.color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-playfair text-base font-bold mb-1" style={{ color: P.ink }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: P.muted }}>{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── eCourt Tracker Highlight ─────────────────────────────────────────── */}
      <section id="ecourt-tracker" className="py-20 px-6"
               style={{ background: P.navyDark, borderTop: `3px solid ${P.gold}` }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                 style={{ background: 'rgba(184,136,26,0.15)', border: `1px solid rgba(184,136,26,0.35)`, color: P.goldLight }}>
              <Landmark className="w-3.5 h-3.5" /> eCourt Cause List Tracker
            </div>
            <h2 className="font-playfair text-3xl font-bold text-white leading-tight" style={{ textWrap: 'balance' } as any}>
              Never miss a hearing date -- ever again
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Add the CNR number once. LawyerDesk syncs daily with eCourts India and sends a
              WhatsApp alert to the assigned advocate the moment a hearing date changes.
            </p>
            <ul className="space-y-3">
              {[
                'CNR-based live sync with all Indian court systems',
                'Daily auto-sync at 7 AM IST + instant manual refresh',
                'WhatsApp alert when next hearing date changes',
                'Cause list board -- all today\'s hearings by court & item no.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm"
                    style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: P.goldLight }} />
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={onExploreDemo}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all"
                    style={{ background: P.gold, color: '#fff' }}>
              Try eCourt Tracker <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Live preview card */}
          <div className="rounded-2xl p-6 space-y-4"
               style={{ background: P.parchment, border: `1px solid ${P.border}` }}>
            <div className="flex items-center justify-between">
              <p className="font-playfair text-base font-bold" style={{ color: P.ink }}>
                Today's Cause List
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ background: '#1A5C3A', color: '#fff' }}>● LIVE</span>
            </div>
            {[
              { no: '14', case: 'CS(COMM) 420/2024', title: 'Apex Infra Ltd vs. NHAI', court: 'DHC Room 24', judge: "Hon'ble Sanjeev Narula J.", time: '10:30 AM', synced: true },
              { no: '28', case: 'Title Suit 87/2024', title: 'Belghoria Partition Matter', court: 'Barasat Room 3', judge: 'Ld. 3rd Civil Judge', time: '2:00 PM', synced: true },
              { no: '7',  case: 'NI Act 138/2025',   title: 'Cheque Dishonour Complaint', court: 'ACMM Room 1', judge: 'Ld. ACMM-I', time: '11:00 AM', synced: false },
            ].map((h) => (
              <div key={h.no} className="rounded-xl p-3.5"
                   style={{ background: P.surface, border: `1px solid ${P.border}` }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold" style={{ color: P.navy }}>
                      Item #{h.no} · {h.case}
                    </p>
                    <p className="text-sm font-semibold mt-0.5 truncate" style={{ color: P.ink }}>{h.title}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: P.muted }}>{h.court} · {h.judge}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold" style={{ color: P.gold }}>{h.time}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: h.synced ? '#1A5C3A' : P.muted }}>
                      {h.synced ? '✓ Synced' : 'No CNR'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: P.gold }}>Simple, Transparent Pricing</p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold" style={{ color: P.ink }}>
            Plans for every practice
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.name}
                 className="rounded-2xl p-6 space-y-5 relative"
                 style={{
                   background: plan.highlight ? P.navy : P.surface,
                   border: `2px solid ${plan.highlight ? P.gold : P.border}`,
                   boxShadow: plan.highlight ? '0 8px 32px rgba(27,58,107,0.25)' : '0 1px 4px rgba(0,0,0,0.06)',
                 }}>
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                     style={{ background: P.gold }}>
                  Most Popular
                </div>
              )}
              <div>
                <p className="font-playfair text-xl font-bold" style={{ color: plan.highlight ? '#fff' : P.ink }}>
                  {plan.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: plan.highlight ? 'rgba(255,255,255,0.55)' : P.muted }}>
                  {plan.desc}
                </p>
              </div>
              <div className="flex items-end gap-1">
                <span className="font-playfair text-4xl font-bold" style={{ color: plan.highlight ? P.goldLight : P.navy }}>
                  {plan.price}
                </span>
                <span className="text-sm mb-1" style={{ color: plan.highlight ? 'rgba(255,255,255,0.5)' : P.muted }}>
                  {plan.sub}
                </span>
              </div>
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm"
                      style={{ color: plan.highlight ? 'rgba(255,255,255,0.85)' : P.ink }}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: plan.highlight ? P.goldLight : P.gold }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={onLoginClick}
                      className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: plan.highlight ? P.gold : 'transparent',
                        color: plan.highlight ? '#fff' : P.navy,
                        border: plan.highlight ? 'none' : `2px solid ${P.navy}`,
                      }}>
                {plan.highlight ? 'Start Free Trial' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-6" style={{ color: P.muted }}>
          All plans include 7-day free trial · No credit card required · India data residency
        </p>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: P.gold }}>FAQ</p>
          <h2 className="font-playfair text-3xl font-bold" style={{ color: P.ink }}>
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-2xl overflow-hidden"
                 style={{ background: P.surface, border: `1px solid ${P.border}` }}>
              <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full px-5 py-4 text-left text-sm font-semibold flex items-center justify-between"
                      style={{ color: P.ink }}>
                {faq.q}
                <span className="text-lg shrink-0 ml-3" style={{ color: P.gold }}>
                  {activeFaq === i ? '−' : '+'}
                </span>
              </button>
              {activeFaq === i && (
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: P.muted, borderTop: `1px solid ${P.border}`, paddingTop: 12 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 text-center"
               style={{ background: P.navyDark, borderTop: `3px solid ${P.gold}` }}>
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-3" style={{ textWrap: 'balance' } as any}>
          Ready to transform your practice?
        </h2>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Join 500+ advocates who manage cases, hearings, and billing on LawyerDesk.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onLoginClick}
                  className="px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: P.gold }}>
            Sign In / Admin Portal
          </button>
          <button onClick={onExploreDemo}
                  className="px-8 py-3.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.2)`, color: '#fff' }}>
            Explore Live Demo -- No Login Needed
          </button>
        </div>
        <div className="flex items-center justify-center gap-6 mt-8 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> DPDP Act Compliant</span>
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> AES-256 Encrypted</span>
          <span className="flex items-center gap-1.5"><Landmark className="w-3.5 h-3.5" /> India Data Residency</span>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
