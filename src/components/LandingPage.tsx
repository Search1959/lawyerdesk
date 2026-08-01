import React, { useState, useEffect } from 'react';
import { Footer } from './Footer';
import {
  Scale,
  Sparkles,
  ShieldCheck,
  CalendarDays,
  FileText,
  Users,
  MessageSquareCode,
  LogIn,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Zap,
  Globe,
  Bot,
  Receipt,
  BookOpen,
  Lock,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  Pause,
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onHelpClick: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginClick,
  onHelpClick,
  onExploreDemo,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // Carousel Slides representing key dashboard panels
  const dashboardSlides = [
    {
      id: 'rag-copilot',
      title: 'AI Grounded Legal Copilot',
      subtitle: 'Zero-Hallucination Case Brief Search',
      badge: 'RAG ENGINE',
      badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-700/60',
      icon: Sparkles,
      preview: (
        <div className="space-y-3 font-sans text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-bold text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> User Legal Query
              </span>
              <span>Title Suit No. 87/2024</span>
            </div>
            <p className="text-white font-medium">"Who is the plaintiff and what is their undivided share in the Belghoria property?"</p>
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/80 space-y-2 text-indigo-100">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Grounded Evidence Verified (100% Citation)
              </span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-900 text-[9px] font-mono">0.18s GPU</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-200">
              <strong>Shri Sohanlal Jaiswal</strong> holds a consolidated <strong>4/18 (2/9) undivided share</strong> across all 4 Schedules, valued at <strong>Rs. 7.42 Crores</strong> (~45.6 Kattah entitlement).
            </p>
            <div className="pt-2 border-t border-indigo-800/60 flex items-center gap-2 text-[10px] text-indigo-300">
              <span className="font-bold">Citation:</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-900/80 border border-indigo-700/50 font-mono">
                belghoria-property-detail.pdf (Pg 1, Para 2)
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'cause-list',
      title: 'e-Courts Cause List Calendar',
      subtitle: 'Real-Time Court Hall Roster Sync',
      badge: 'CAUSE LIST',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-700/60',
      icon: CalendarDays,
      preview: (
        <div className="space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">Daily Board • Tis Hazari & Delhi High Court</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              AUTO-SYNCED
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Item #14 • CS(COMM) 420/2024</div>
                <div className="text-[10px] text-slate-400">Court Room 24 • Hon'ble Sanjeev Narula J.</div>
              </div>
              <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                Next: 10:30 AM
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Item #28 • Title Suit 87/2024</div>
                <div className="text-[10px] text-slate-400">Court Room 3 • 3rd Civil Judge Barasat</div>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                WhatsApp Sent
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ocr-engine',
      title: 'PaddleOCR Document Engine',
      subtitle: 'Scanned Bilingual Devanagari & English',
      badge: 'BILINGUAL OCR',
      badgeColor: 'bg-sky-950 text-sky-300 border-sky-700/60',
      icon: FileText,
      preview: (
        <div className="space-y-3 font-sans text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-sky-400">belghoria-deed-registered-1526.pdf</span>
              <span className="text-emerald-400 font-bold">OCR Confidence 98.4%</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-300">
              "Gift Deed dated 22.08.2022 registered at ADSR Belghoria in Volume 1526 conveying 3/18 share to Shri Sohanlal Jaiswal..."
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Extracted Acts:</span>
              <span className="font-bold text-indigo-300">Partition Act 1893, CPC Sec 151</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Identified Parties:</span>
              <span className="font-bold text-indigo-300">21 Defendants, 1 Plaintiff</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ai-drafting',
      title: 'AI Legal Drafting Studio',
      subtitle: 'Writ Petitions, Notices & Applications',
      badge: 'DRAFTING STUDIO',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-700/60',
      icon: Bot,
      preview: (
        <div className="space-y-2.5 font-sans text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">In the Court of Ld. 3rd Civil Judge at Barasat</div>
            <div className="font-extrabold text-white text-xs">IN THE MATTER OF: Title Suit No. 87 of 2024</div>
            <div className="text-[11px] text-slate-300 italic">Application for Ad-Interim Order of Injunction under Order 39 Rules 1 & 2 read with Section 151 C.P.C.</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-300 space-y-1">
            <div className="font-bold text-emerald-400">✓ Formatted to Court Template Specs</div>
            <div>Includes Schedule A-D Property Descriptions & Prayer Clauses</div>
          </div>
        </div>
      ),
    },
    {
      id: 'gst-billing',
      title: 'Legal Billing & GST Portal',
      subtitle: 'Tax Invoices, Retainers & Tax Rates',
      badge: '18% GST BILLING',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-700/60',
      icon: Receipt,
      preview: (
        <div className="space-y-3 font-sans text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-white">Invoice #INV-2026-089</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">PAID</span>
            </div>
            <div className="text-slate-300">Client: Shri Sohanlal Jaiswal</div>
            <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800">
              <span>Court Appearance Fee:</span>
              <span className="font-bold text-white">Rs. 45,000</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>18% CGST + SGST:</span>
              <span className="font-bold text-indigo-400">Rs. 8,100</span>
            </div>
            <div className="flex justify-between font-extrabold text-xs text-white pt-1 border-t border-slate-800">
              <span>Total Taxable Amount:</span>
              <span className="text-emerald-400">Rs. 53,100</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % dashboardSlides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + dashboardSlides.length) % dashboardSlides.length);
  };

  useEffect(() => {
    document.title = 'LawyerDesk – Your Practice. Our Technology. Better Justice. ⚖️🚀';
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % dashboardSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, dashboardSlides.length]);

  const features = [
    {
      icon: Sparkles,
      title: 'AI Legal Copilot & Grounded RAG',
      desc: 'Ask complex legal queries across thousands of case files, OCR briefs, and certified court orders with 100% grounded citations.',
    },
    {
      icon: CalendarDays,
      title: 'e-Courts Cause List Auto-Sync',
      desc: 'Automated daily cause list synchronization with Supreme Court, High Courts, and District Courts across India with WhatsApp reminders.',
    },
    {
      icon: FileText,
      title: 'PaddleOCR High-Precision Parser',
      desc: 'Extract bilingual legal text (English, Hindi, Bengali) from scanned PDFs, handwritten petitions, and court orders instantly.',
    },
    {
      icon: Bot,
      title: 'AI Drafting Studio & Precedents',
      desc: 'Draft Written Statements, Synopsis, Applications, Legal Notices, and Bail Writs formatted specifically for Indian court templates.',
    },
    {
      icon: Users,
      title: 'Client Portal & e-KYC Verification',
      desc: 'Secure client onboarding with PAN/Aadhaar e-KYC verification, case progress timelines, and digital document sharing.',
    },
    {
      icon: Receipt,
      title: 'Legal Billing & GST Invoicing',
      desc: 'Generate court appearance invoices, retainers, and success fee notes with automated 18% GST calculation and payment tracking.',
    },
  ];

  const faqs = [
    {
      q: 'How does LawyerDesk AI ensure zero hallucinations in legal answers?',
      a: 'Our grounded RAG engine strictly queries only your uploaded case files, court orders, and OCR text chunks. If supporting evidence is not present in the brief, the system explicitly declares it cannot find supporting information.',
    },
    {
      q: 'Does it automatically fetch court cause lists?',
      a: 'Yes, LawyerDesk integrates with the e-Courts API and High Court portals to fetch your firm’s daily item numbers, court hall assignments, and next hearing dates.',
    },
    {
      q: 'Is client data safe and compliant with Indian laws?',
      a: 'All documents are encrypted with AES-256 at rest and TLS 1.3 in transit. Role-Based Access Control (RBAC) ensures strict isolation between firms, lawyers, and clients.',
    },
    {
      q: 'What roles are supported in LawyerDesk?',
      a: 'System Admin, Firm Admin, Senior Lawyer, Associate, Junior Counsel, Staff/Reception, Accounts, and Client Portal.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-500/30">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>LAWYERDESK</span> <span className="text-indigo-400 font-black">AI</span>
            </div>
            <div className="text-[10px] text-indigo-300 font-mono tracking-widest uppercase">
              Next-Gen Legal OS for India
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
          <a href="#cause-list" className="hover:text-indigo-400 transition-colors">Cause List Calendar</a>
          <a href="#ai-drafting" className="hover:text-indigo-400 transition-colors">AI Drafting</a>
          <a href="#help" onClick={(e) => { e.preventDefault(); onHelpClick(); }} className="hover:text-indigo-400 transition-colors flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Help Center</span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreDemo}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Live Workspace Demo</span>
          </button>

          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Admin Portal</span>
          </button>
        </div>
      </nav>

      {/* Hero Section - Split Panel with Slide System */}
      <section className="relative pt-10 pb-16 px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Panel: Headline, Description & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Primary Requested Slogan & Tech Badge */}
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-black shadow-xl shadow-indigo-950/80">
                <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="tracking-tight">LawyerDesk AI – Complete Practice Management & Legal Copilot ⚖️🚀</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-[11px] font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                <span>eCourts Cause Lists &bull; AI Legal Drafting &bull; GST Billing</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Your Practice. Our Technology. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-amber-300">Better Justice.</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              LawyerDesk simplifies legal practice management for High Courts, District Courts, NCLT, and DRT advocates. Effortlessly track daily cause list rosters, OCR bilingual petitions, generate AI pleadings, manage GST client billing, and search case files safely.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={onLoginClick}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Sign In / Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreDemo}
                className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Explore Live Workspace</span>
              </button>
            </div>

            {/* Metrics & Roster Trust Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-left">
              <div>
                <div className="text-lg sm:text-xl font-black text-white">28+ Courts</div>
                <div className="text-[10px] text-slate-400 font-medium">High Courts & NCLT Synced</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-emerald-400">100% Zero</div>
                <div className="text-[10px] text-slate-400 font-medium">Hallucination Grounded AI</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-indigo-400">18% GST</div>
                <div className="text-[10px] text-slate-400 font-medium">Tax Invoicing Compliant</div>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Dashboard Slide System Card */}
          <div className="lg:col-span-6 relative">
            <div
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className="p-5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl space-y-4 relative group"
            >
              {/* Slide Selector Header Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
                {dashboardSlides.map((slide, idx) => {
                  const SlideIcon = slide.icon;
                  const isActive = activeSlide === idx;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => setActiveSlide(idx)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <SlideIcon className={`w-3 h-3 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                      <span>{slide.title.split(' ')[0]} {slide.title.split(' ')[1] || ''}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Slide Card Mockup Preview */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800/90 shadow-inner transition-all duration-300 min-h-[260px] flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400">
                        {React.createElement(dashboardSlides[activeSlide].icon, { className: 'w-4 h-4' })}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xs sm:text-sm">
                          {dashboardSlides[activeSlide].title}
                        </h3>
                        <p className="text-[10px] text-slate-400">
                          {dashboardSlides[activeSlide].subtitle}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${dashboardSlides[activeSlide].badgeColor}`}>
                      {dashboardSlides[activeSlide].badge}
                    </span>
                  </div>

                  {/* Slide Live Mockup Box */}
                  <div className="pt-2">
                    {dashboardSlides[activeSlide].preview}
                  </div>
                </div>

                {/* Footer Bar inside Slide Card */}
                <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px]">
                  <button
                    onClick={onExploreDemo}
                    className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 text-[11px] transition-colors"
                  >
                    <span>Launch {dashboardSlides[activeSlide].title} Panel</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      title={isAutoPlaying ? "Pause Auto-play" : "Play Auto-play"}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                    >
                      {isAutoPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                    </button>
                    <span className="text-[10px] font-mono text-slate-500">
                      {activeSlide + 1} / {dashboardSlides.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls Bottom Bar */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-1.5">
                  {dashboardSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeSlide === idx ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                      }`}
                      title={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                    title="Previous Dashboard Panel"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                    title="Next Dashboard Panel"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-16 px-6 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Built for High Courts, NCLT, & District Courts</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Engineered for Indian Legal Practice</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/10 space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cause List Calendar Feature Highlight */}
      <section id="cause-list" className="py-16 px-6 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold">
              <CalendarDays className="w-3.5 h-3.5" /> Cause List Calendar Engine
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Never Miss a Item Number with Real-Time Cause List Reminders
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Automated hearing schedules linked with High Court rosters, Supreme Court advance cause lists, and District Court boards. Send automatic WhatsApp alerts to advocates and clients prior to hearing dates.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Monthly, Weekly, and Daily Cause List Agenda View</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-Click WhatsApp & SMS Hearing Notifications</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Assigned Senior Counsel & Associate Court Room Allocations</span>
              </li>
            </ul>
          </div>

          {/* Graphic Preview Box */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-indigo-400" />
                <span>Daily Cause List • Delhi High Court</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">LIVE SYNC</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
              <div className="text-indigo-400 font-bold">CS(COMM) 420/2024 • Court Room 24</div>
              <div className="text-slate-200 font-semibold">Apex Infra Ltd v. National Highways Authority</div>
              <div className="text-[11px] text-slate-400">Stage: Arguments on Bank Guarantee Injunction • Judge: Hon'ble Sanjeev Narula</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
              <div className="text-indigo-400 font-bold">Title Suit No. 87/2024 • Court Room 3</div>
              <div className="text-slate-200 font-semibold">Belghoria Property Dispute (Jaiswal Partition Suit)</div>
              <div className="text-[11px] text-slate-400">Stage: Frame of Issues & Injunction Application • Judge: Ld. 3rd Civil Judge Barasat</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about LawyerDesk AI Legal OS</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-200 flex items-center justify-between hover:text-white"
              >
                <span>{faq.q}</span>
                <span className="text-indigo-400 text-base">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-400 border-t border-slate-800/80 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
