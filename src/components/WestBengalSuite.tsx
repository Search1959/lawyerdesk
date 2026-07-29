import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  Scale,
  Calculator,
  Languages,
  FileSearch,
  Search,
  Sparkles,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Landmark,
  Gavel,
  Zap,
} from 'lucide-react';

export const WestBengalSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'limitation' | 'courts' | 'kmc' | 'ocr'>('limitation');

  // Limitation Calculator State
  const [caseType, setCaseType] = useState('Civil Suit (Money Recovery - Art 19)');
  const [causeOfActionDate, setCauseOfActionDate] = useState('2024-01-15');
  const [calculatedLimitation, setCalculatedLimitation] = useState<{
    expiryDate: string;
    daysRemaining: number;
    limitationPeriod: string;
    actsCited: string;
  } | null>(null);

  // Bengali OCR state
  const [ocrText, setOcrText] = useState('');
  const [translatedEnglish, setTranslatedEnglish] = useState('');
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  const handleCalculateLimitation = () => {
    const startDate = new Date(causeOfActionDate);
    if (isNaN(startDate.getTime())) return;

    let years = 3;
    let days = 0;
    let label = '3 Years under Article 19, Indian Limitation Act 1963';
    let acts = 'Article 19 & Section 12, Limitation Act 1963';

    if (caseType.includes('Section 138')) {
      years = 0;
      days = 30; // 30 days from expiry of 15 days demand notice
      label = '1 Month (30 Days) from expiry of 15 days statutory notice under Sec 138(b)';
      acts = 'Section 138 & 142, Negotiable Instruments Act 1881';
    } else if (caseType.includes('Civil Appeal')) {
      years = 0;
      days = 90; // 90 days to High Court
      label = '90 Days to High Court from date of decree under Article 116';
      acts = 'Article 116, Indian Limitation Act 1963';
    } else if (caseType.includes('Execution Petition')) {
      years = 12;
      label = '12 Years under Article 136';
      acts = 'Article 136, Limitation Act 1963';
    } else if (caseType.includes('Consumer')) {
      years = 2;
      label = '2 Years under Section 69, Consumer Protection Act 2019';
      acts = 'Section 69, CPA 2019';
    }

    const expiry = new Date(startDate);
    expiry.setFullYear(expiry.getFullYear() + years);
    expiry.setDate(expiry.getDate() + days);

    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setCalculatedLimitation({
      expiryDate: expiry.toISOString().split('T')[0],
      daysRemaining: diffDays,
      limitationPeriod: label,
      actsCited: acts,
    });
  };

  const sampleWestBengalCourts = [
    {
      name: 'Calcutta High Court (Appellate & Original Side)',
      location: '3, Esplanade Row West, Kolkata - 700001',
      jurisdiction: 'Statewide High Court & Original Civil Jurisdiction',
      activeBenches: ['Appellate Commercial Bench', 'Vacation Bench', 'Tax & Revenue Division'],
      status: 'Live Cause List Synced',
    },
    {
      name: 'Alipore District & Sessions Court',
      location: 'Belvedere Road, Alipore, Kolkata - 700027',
      jurisdiction: 'South 24 Parganas Civil & Criminal Jurisdiction',
      activeBenches: ['Commercial Court 1', 'Fast Track Court 3', 'MACT Tribunal'],
      status: 'Live Cause List Synced',
    },
    {
      name: 'Sealdah Civil & Criminal Court',
      location: 'Acharya Jagadish Chandra Bose Rd, Kolkata - 700014',
      jurisdiction: 'East Kolkata Metropolitan Area',
      activeBenches: ['ACMM Court 2', 'Sub-Judge Commercial Bench'],
      status: 'Live Cause List Synced',
    },
    {
      name: 'Bankshall City Civil Court',
      location: '2 & 3, Kiran Shankar Roy Road, Kolkata - 700001',
      jurisdiction: 'Kolkata Metropolitan Area Civil Jurisdiction',
      activeBenches: ['City Civil Court Room 6', 'Commercial Appeals Court'],
      status: 'Live Cause List Synced',
    },
    {
      name: 'Barasat District Court',
      location: 'Station Road, Barasat, North 24 Parganas - 700124',
      jurisdiction: 'North 24 Parganas Civil & Session Bench',
      activeBenches: ['Additional District Judge 4', 'Land Acquisition Tribunal'],
      status: 'Live Cause List Synced',
    },
    {
      name: 'Howrah District & Sessions Court',
      location: 'Court Road, Howrah - 711101',
      jurisdiction: 'Howrah Metropolitan & District Courts',
      activeBenches: ['District Judge Bench', 'Commercial Court 2'],
      status: 'Live Cause List Synced',
    },
  ];

  const handleSimulateBengaliOcr = () => {
    setIsOcrProcessing(true);
    setTimeout(() => {
      setOcrText(`মাননীয় আলিপুর জেলা আদালতের রায় অনুযায়ী, বিতর্কিত সম্পত্তিটি (কলকাতা মিউনিসিপ্যাল কর্পোরেশন ওয়ার্ড ৬৩, হোল্ডিং ১৪/বি) বাদীপক্ষের বৈধ মালিকানাধীন।`);
      setTranslatedEnglish(`As per the judgment of the Hon'ble Alipore District Court, the disputed property (Kolkata Municipal Corporation Ward 63, Holding 14/B) is legally owned by the Plaintiff.`);
      setIsOcrProcessing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white rounded-3xl border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              West Bengal & Kolkata Suite
            </span>
            <span className="text-xs text-slate-300">Calcutta High Court & District Benches</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Landmark className="w-6 h-6 text-emerald-400" /> West Bengal Litigation Toolkit
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Integrated Bench Cause Lists, Limitation Calculator (Act 1963), Bengali Multilingual OCR, and KMC Property Disputes Engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('limitation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'limitation'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Limitation Calculator</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('limitation')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'limitation'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Limitation Period Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('courts')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'courts'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Kolkata Court Benches ({sampleWestBengalCourts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('kmc')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'kmc'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>KMC Property & Thika Tenancy</span>
        </button>

        <button
          onClick={() => setActiveTab('ocr')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'ocr'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>Bengali OCR & Translation</span>
        </button>
      </div>

      {/* TAB 1: Limitation Calculator */}
      {activeTab === 'limitation' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Statutory Limitation Calculator (Indian Limitation Act 1963)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculates precise filing deadlines, statutory notice periods, and limitation expiry for High Courts & District Benches.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nature of Proceeding / Cause of Action *
              </label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-900 dark:text-white"
              >
                <option value="Civil Suit (Money Recovery - Art 19)">Civil Suit for Money Recovery (Art. 19 - 3 Years)</option>
                <option value="Cheque Bounce (Sec 138 NI Act)">Cheque Bounce Complaint (Sec 138 NI Act - 30 Days)</option>
                <option value="Civil Appeal to High Court (Art 116)">Civil Appeal to High Court (Art. 116 - 90 Days)</option>
                <option value="Execution Petition (Art 136)">Execution of Decree / Order (Art. 136 - 12 Years)</option>
                <option value="Consumer Complaint (Sec 69 CPA)">Consumer Forum Complaint (Sec. 69 CPA - 2 Years)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date of Cause of Action / Decree / Demand Expiry *
              </label>
              <input
                type="date"
                value={causeOfActionDate}
                onChange={(e) => setCauseOfActionDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCalculateLimitation}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Calculate Expiry Deadline</span>
            </button>
          </div>

          {calculatedLimitation && (
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl border border-indigo-500/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
                  Limitation Audit Result
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  calculatedLimitation.daysRemaining > 30
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                }`}>
                  {calculatedLimitation.daysRemaining > 0
                    ? `${calculatedLimitation.daysRemaining} Days Remaining`
                    : 'Limitation Expired!'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Calculated Expiry Date:</span>
                  <div className="text-lg font-black text-amber-400">{calculatedLimitation.expiryDate}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Statutory Provision Cited:</span>
                  <div className="font-semibold text-white">{calculatedLimitation.actsCited}</div>
                </div>
              </div>

              <div className="text-xs text-slate-300 pt-2 border-t border-indigo-900/60">
                <strong>Statutory Rule:</strong> {calculatedLimitation.limitationPeriod}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: West Bengal Court Benches */}
      {activeTab === 'courts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {sampleWestBengalCourts.map((court, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm hover:border-indigo-500 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{court.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{court.location}</span>
                  </p>
                </div>
                <span className="text-[9.5px] px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-500/20">
                  {court.status}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-300 text-[10.5px]">Jurisdiction Scope:</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">{court.jurisdiction}</div>
              </div>

              <div className="flex flex-wrap gap-1">
                {court.activeBenches.map((b, bIdx) => (
                  <span key={bIdx} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 rounded font-semibold text-[10px]">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: KMC Property Toolkit */}
      {activeTab === 'kmc' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 text-xs shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                KMC Property & Thika Tenancy Litigation Module
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Specialized tools for Kolkata Municipal Corporation (KMC) property tax assessment, mutation disputes, and West Bengal Thika Tenancy (Acquisition and Regulation) Act 2001.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">KMC Mutation Verification</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">Verify Ward No, Assessee Number, and Annual Valuation certificate details.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Thika Tenancy Controller Search</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">Cross-reference Thika Controller records under WB Thika Tenancy Act 2001.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">BL&LRO Land Record Search</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">Check Mouza, Khatian, and Dag numbers across West Bengal districts.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Bengali OCR */}
      {activeTab === 'ocr' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Bengali & Multilingual OCR / Translation Engine
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Extracts text from scanned Bengali land deeds, court orders, and summons, providing side-by-side English legal translation.
                </p>
              </div>
            </div>

            <button
              onClick={handleSimulateBengaliOcr}
              disabled={isOcrProcessing}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isOcrProcessing ? 'Extracting Bengali OCR...' : 'Run Sample Bengali OCR'}</span>
            </button>
          </div>

          {ocrText && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white text-xs block">Extracted Bengali Text:</span>
                <p className="text-xs font-serif leading-relaxed text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  {ocrText}
                </p>
              </div>

              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 space-y-2">
                <span className="font-bold text-indigo-900 dark:text-indigo-200 text-xs block">Grounded English Legal Translation:</span>
                <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  {translatedEnglish}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
