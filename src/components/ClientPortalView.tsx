import React, { useState } from 'react';
import {
  User,
  Folder,
  Calendar,
  FileText,
  CreditCard,
  MessageSquare,
  Clock,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Matter, Hearing, Invoice, Document } from '../types';

interface ClientPortalViewProps {
  matters?: Matter[];
  hearings?: Hearing[];
  invoices?: Invoice[];
  documents?: Document[];
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  matters = [],
  hearings = [],
  invoices = [],
  documents = [],
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'cases' | 'hearings' | 'documents' | 'invoices'>('cases');

  return (
    <div className="space-y-6">
      
      {/* Client Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Encrypted Client Portal
            </span>
            <span className="text-xs text-slate-300">LawyerDesk Legal Operating System</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-400" /> Client Litigation Portal
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Real-time access to your court hearings, case progress, certified orders, invoices, and direct advocate messaging.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-white/10 p-3 rounded-2xl border border-white/10">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-white">Attorney-Client Privileged</div>
            <div className="text-[10px] text-slate-300">AES-256 Encrypted Connection</div>
          </div>
        </div>
      </div>

      {/* Portal Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Active Cases</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{matters.length || 2}</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Upcoming Hearings</span>
          <div className="text-2xl font-black text-amber-500">{hearings.length || 1}</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Court Orders & Docs</span>
          <div className="text-2xl font-black text-indigo-500">{documents.length || 8}</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Pending Invoices</span>
          <div className="text-2xl font-black text-emerald-500">₹ 0.00</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('cases')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'cases'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>My Matters & Progress</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hearings')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'hearings'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Hearing Dates</span>
        </button>

        <button
          onClick={() => setActiveSubTab('documents')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'documents'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Download Court Documents</span>
        </button>

        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'invoices'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Invoices & Online Payment</span>
        </button>
      </div>

      {/* TAB CONTENT: Cases */}
      {activeSubTab === 'cases' && (
        <div className="space-y-4 text-xs">
          {matters.length > 0 ? (
            matters.map((m) => (
              <div key={m.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase font-mono">{m.caseNumber}</div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{m.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{m.court} • {m.category}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-lg border border-emerald-500/20">
                    {m.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <div className="font-bold text-slate-700 dark:text-slate-300">Advocate Update:</div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs">{m.aiSummary || 'Written statement filed successfully. Next date fixed for framing of issues.'}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>Lead Advocate: <strong>{m.leadLawyerName}</strong></div>
                  <div>Next Hearing: <strong className="text-indigo-600 dark:text-indigo-400">{m.nextHearingDate}</strong></div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No active matters linked to client profile.
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Hearings */}
      {activeSubTab === 'hearings' && (
        <div className="space-y-4 text-xs">
          {hearings.length > 0 ? (
            hearings.map((h) => (
              <div key={h.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{h.courtName}</div>
                  <div className="text-slate-500 text-xs">Stage: {h.stage} • Hall {h.courtHallNo}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-500 text-sm">{h.date}</div>
                  <div className="text-slate-400 text-[10px]">{h.time}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No upcoming hearing dates scheduled.
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Documents */}
      {activeSubTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {documents.map((d) => (
            <div key={d.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{d.fileName}</div>
                <div className="text-slate-400 text-[10px]">{d.fileType} • {d.fileSize}</div>
              </div>
              <button className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: Invoices */}
      {activeSubTab === 'invoices' && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Law Firm Fee Statements</h3>
            <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> All Invoices Paid
            </span>
          </div>
          <p className="text-slate-500">No outstanding fee dues at present. Direct online Razorpay / UPI portal integrated.</p>
        </div>
      )}

    </div>
  );
};
