import React, { useState } from 'react';
import { ShieldCheck, Lock, FileText, Phone, Building2, ExternalLink, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { LegalPagesView, PolicyPageType } from './LegalPagesView';

export const Footer: React.FC = () => {
  const [activePolicyTab, setActivePolicyTab] = useState<PolicyPageType | null>(null);

  return (
    <footer className="w-full bg-[#060911] border-t border-slate-800/90 text-slate-300 py-10 px-4 sm:px-8 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        
        {/* Column 1: OPERATED & DEVELOPED BY */}
        <div className="space-y-3">
          <div className="text-orange-500 font-bold text-xs uppercase tracking-widest">
            OPERATED & DEVELOPED BY
          </div>
          <div className="text-white font-bold text-base sm:text-lg tracking-tight">
            M/s Deinrim Solutionss (P) ltd.
          </div>
          <div className="text-slate-300 text-xs sm:text-sm">
            Kolkata, West Bengal (WB), India
          </div>
          <div className="text-white font-bold text-xs sm:text-sm pt-1">
            Corporate Contact: <span className="text-amber-400 font-mono">+91 98361-30393</span>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            LAWYERDESK AI Legal OS Framework v3.5 • Isolated High-Performance Multi-Tenant Legal Architecture with Real-Time Data Replication.
          </div>
        </div>

        {/* Column 2: REGULATORY COMPLIANCE */}
        <div className="space-y-3">
          <div className="text-orange-500 font-bold text-xs uppercase tracking-widest">
            REGULATORY COMPLIANCE
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Public links and documentation confirming our data processing standards, tenant isolation parameters, and corporate operational standards:
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-medium pt-1">
            <button
              onClick={() => setActivePolicyTab('privacy')}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/40 transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setActivePolicyTab('terms')}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/40 transition-colors"
            >
              Terms of Service
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setActivePolicyTab('support')}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/40 transition-colors"
            >
              App Support Page
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setActivePolicyTab('deletion')}
              className="text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-4 decoration-rose-500/50 transition-colors"
            >
              Data Deletion request
            </button>
          </div>
        </div>

        {/* Column 3: ENTERPRISE SECURITY & COMPLIANCE */}
        <div className="space-y-3">
          <div className="text-orange-500 font-bold text-xs uppercase tracking-widest">
            ENTERPRISE SECURITY & COMPLIANCE
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold text-base leading-none">•</span>
              <div>
                <strong className="text-white font-semibold">Multi-Tenant Isolation:</strong> Customer company databases are isolated per unique tenant schema. No cross-tenant query execution is possible.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold text-base leading-none">•</span>
              <div>
                <strong className="text-white font-semibold">Data Sovereignty:</strong> Live transactions are encrypted using AES-256 standard and stored on highly available secure container databases backed up every 6 hours.
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar copyright & domain notice */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span>© {new Date().getFullYear()} <strong className="text-white">LAWYERDESK AI</strong> (lawyerdesk.co.in).</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-amber-300 font-semibold">Your Practice. Our Technology. Better Justice. ⚖️🚀</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            AES-256 Encrypted
          </span>
          <span>•</span>
          <span className="text-slate-300">Indian Legal OS Standard</span>
        </div>
      </div>

      {/* Full Page Overlay Modal for Compliance Pages */}
      {activePolicyTab && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md">
          <LegalPagesView
            initialTab={activePolicyTab}
            onClose={() => setActivePolicyTab(null)}
          />
        </div>
      )}

    </footer>
  );
};

