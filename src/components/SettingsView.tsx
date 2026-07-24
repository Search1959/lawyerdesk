import React, { useState } from 'react';
import { Settings, Shield, Building, FileText, Database, Save, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [firmConfig, setFirmConfig] = useState({
    firmName: 'Shardul & Associates Advocates',
    barRegistrationNo: 'D/REG/2004/DL',
    gstin: '07AAAAA0000A1Z5',
    eCourtsApiKey: 'ecourt_live_gw_88493102948',
    defaultCourt: 'Delhi High Court',
    invoiceHeaderNotes: 'Professional Retainer Fees and Litigation Expenses billed subject to 18% GST.',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Settings className="w-4 h-4" /> Firm System Preferences & eCourts API Configuration
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Law Firm Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure firm branding, Bar Council credentials, GSTIN tax rules, and eCourts India API gateway.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Firm configuration updated and saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-2">
            <Building className="w-4 h-4 text-indigo-600" /> Firm Identity & Registration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Advocate Firm Name</label>
              <input
                type="text"
                value={firmConfig.firmName}
                onChange={(e) => setFirmConfig({ ...firmConfig, firmName: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bar Registration Number</label>
              <input
                type="text"
                value={firmConfig.barRegistrationNo}
                onChange={(e) => setFirmConfig({ ...firmConfig, barRegistrationNo: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-2">
            <FileText className="w-4 h-4 text-indigo-600" /> Taxation & GST Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Firm GSTIN</label>
              <input
                type="text"
                value={firmConfig.gstin}
                onChange={(e) => setFirmConfig({ ...firmConfig, gstin: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Default Court Room Jurisdiction</label>
              <input
                type="text"
                value={firmConfig.defaultCourt}
                onChange={(e) => setFirmConfig({ ...firmConfig, defaultCourt: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Invoice Disclaimer / Footnote</label>
            <textarea
              rows={2}
              value={firmConfig.invoiceHeaderNotes}
              onChange={(e) => setFirmConfig({ ...firmConfig, invoiceHeaderNotes: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-2">
            <Shield className="w-4 h-4 text-indigo-600" /> eCourts India API Gateway Sync
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">eCourts API Key Token</label>
            <input
              type="password"
              value={firmConfig.eCourtsApiKey}
              onChange={(e) => setFirmConfig({ ...firmConfig, eCourtsApiKey: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-mono focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Used to fetch live Cause Lists and Certified Orders directly from District Courts and High Courts.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all"
          >
            <Save className="w-4 h-4" /> Save Firm Settings
          </button>
        </div>
      </form>
    </div>
  );
};
