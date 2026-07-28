import React, { useState, useEffect } from 'react';
import { Settings, Shield, Building, FileText, Database, Save, CheckCircle2, CreditCard, PhoneCall, Globe, Key } from 'lucide-react';
import { LawFirm, User } from '../types';

interface SettingsViewProps {
  currentFirm?: LawFirm;
  currentUser?: User;
  onUpdateFirm?: (updatedFirm: LawFirm) => Promise<void> | void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentFirm,
  currentUser,
  onUpdateFirm,
}) => {
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [firmConfig, setFirmConfig] = useState({
    firmName: currentFirm?.name || '',
    managingPartner: currentFirm?.managingPartner || currentUser?.name || '',
    barRegistrationNo: currentFirm?.barRegistrationNo || 'D/REG/2004/DL',
    gstin: currentFirm?.gstin || '07AAAAA0000A1Z5',
    panNumber: currentFirm?.panNumber || 'AAAAA0000A',
    tanNumber: currentFirm?.tanNumber || 'DELA00000A',
    phone: currentFirm?.phone || currentUser?.phone || '+91 98000 00000',
    email: currentFirm?.email || currentUser?.email || 'chambers@lawfirm.in',
    address: currentFirm?.address || currentFirm?.branches?.[0]?.address || 'Law Chambers, High Court Complex',
    defaultCourt: currentFirm?.defaultCourt || 'Delhi High Court',
    invoiceHeaderNotes: currentFirm?.invoiceHeaderNotes || 'Professional Retainer Fees and Litigation Expenses billed subject to 18% GST.',
    bankName: currentFirm?.bankName || 'State Bank of India',
    bankAccountNo: currentFirm?.bankAccountNo || '38901234567',
    bankIfsc: currentFirm?.bankIfsc || 'SBIN0000691',
    eCourtsApiKey: currentFirm?.eCourtsApiKey || 'ecourt_live_gw_88493102948',
    eCourtsAdvocateCode: currentFirm?.eCourtsAdvocateCode || 'ADV/DEL/2004/88',
    autoSyncCauseList: currentFirm?.autoSyncCauseList ?? true,
    aiModel: currentFirm?.aiModel || 'Gemini 3.6 Flash (Grounded Legal RAG)',
    strictGrounding: currentFirm?.strictGrounding ?? true,
  });

  useEffect(() => {
    if (currentFirm) {
      setFirmConfig({
        firmName: currentFirm.name || '',
        managingPartner: currentFirm.managingPartner || currentUser?.name || '',
        barRegistrationNo: currentFirm.barRegistrationNo || 'D/REG/2004/DL',
        gstin: currentFirm.gstin || '07AAAAA0000A1Z5',
        panNumber: currentFirm.panNumber || 'AAAAA0000A',
        tanNumber: currentFirm.tanNumber || 'DELA00000A',
        phone: currentFirm.phone || currentUser?.phone || '+91 98000 00000',
        email: currentFirm.email || currentUser?.email || 'chambers@lawfirm.in',
        address: currentFirm.address || currentFirm.branches?.[0]?.address || 'Law Chambers, High Court Complex',
        defaultCourt: currentFirm.defaultCourt || 'Delhi High Court',
        invoiceHeaderNotes: currentFirm.invoiceHeaderNotes || 'Professional Retainer Fees and Litigation Expenses billed subject to 18% GST.',
        bankName: currentFirm.bankName || 'State Bank of India',
        bankAccountNo: currentFirm.bankAccountNo || '38901234567',
        bankIfsc: currentFirm.bankIfsc || 'SBIN0000691',
        eCourtsApiKey: currentFirm.eCourtsApiKey || 'ecourt_live_gw_88493102948',
        eCourtsAdvocateCode: currentFirm.eCourtsAdvocateCode || 'ADV/DEL/2004/88',
        autoSyncCauseList: currentFirm.autoSyncCauseList ?? true,
        aiModel: currentFirm.aiModel || 'Gemini 3.6 Flash (Grounded Legal RAG)',
        strictGrounding: currentFirm.strictGrounding ?? true,
      });
    }
  }, [currentFirm, currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFirm) return;

    setIsSaving(true);
    try {
      const updatedFirm: LawFirm = {
        ...currentFirm,
        name: firmConfig.firmName,
        barRegistrationNo: firmConfig.barRegistrationNo,
        gstin: firmConfig.gstin,
        panNumber: firmConfig.panNumber,
        tanNumber: firmConfig.tanNumber,
        managingPartner: firmConfig.managingPartner,
        phone: firmConfig.phone,
        email: firmConfig.email,
        address: firmConfig.address,
        defaultCourt: firmConfig.defaultCourt,
        invoiceHeaderNotes: firmConfig.invoiceHeaderNotes,
        bankName: firmConfig.bankName,
        bankAccountNo: firmConfig.bankAccountNo,
        bankIfsc: firmConfig.bankIfsc,
        eCourtsApiKey: firmConfig.eCourtsApiKey,
        eCourtsAdvocateCode: firmConfig.eCourtsAdvocateCode,
        autoSyncCauseList: firmConfig.autoSyncCauseList,
        aiModel: firmConfig.aiModel,
        strictGrounding: firmConfig.strictGrounding,
        updatedAt: new Date().toISOString(),
      };

      if (onUpdateFirm) {
        await onUpdateFirm(updatedFirm);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error('Error saving firm settings:', err);
    } finally {
      setIsSaving(false);
    }
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
            Configure firm branding, Bar Council credentials, GSTIN tax rules, eCourts India API gateway, and Banking details.
          </p>
        </div>
        {currentFirm && (
          <div className="text-right border-l pl-4 border-slate-200 dark:border-slate-800 hidden sm:block">
            <span className="text-xs text-slate-400 font-medium block">Active Firm ID</span>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{currentFirm.id}</span>
          </div>
        )}
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Firm credentials & configuration updated and saved to Cloud Database successfully!</span>
          </div>
          <span className="text-[11px] font-normal text-emerald-700">Persisted across logouts</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Section 1: Firm Identity */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Building className="w-4 h-4 text-indigo-600" /> Firm Identity & Bar Council Registration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Advocate Law Firm Name</label>
              <input
                type="text"
                value={firmConfig.firmName}
                onChange={(e) => setFirmConfig({ ...firmConfig, firmName: e.target.value })}
                required
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Managing Partner / Senior Advocate</label>
              <input
                type="text"
                value={firmConfig.managingPartner}
                onChange={(e) => setFirmConfig({ ...firmConfig, managingPartner: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Bar Council Registration Number</label>
              <input
                type="text"
                value={firmConfig.barRegistrationNo}
                onChange={(e) => setFirmConfig({ ...firmConfig, barRegistrationNo: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Default Court Room Jurisdiction</label>
              <input
                type="text"
                value={firmConfig.defaultCourt}
                onChange={(e) => setFirmConfig({ ...firmConfig, defaultCourt: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Office Address */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <PhoneCall className="w-4 h-4 text-indigo-600" /> Chambers Contact & Head Office Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Chambers Phone Number</label>
              <input
                type="text"
                value={firmConfig.phone}
                onChange={(e) => setFirmConfig({ ...firmConfig, phone: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Official Chambers Email</label>
              <input
                type="email"
                value={firmConfig.email}
                onChange={(e) => setFirmConfig({ ...firmConfig, email: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">High Court / District Chambers Address</label>
            <input
              type="text"
              value={firmConfig.address}
              onChange={(e) => setFirmConfig({ ...firmConfig, address: e.target.value })}
              className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Section 3: Taxation, GSTIN & Banking */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-indigo-600" /> Taxation, GSTIN & Bank Account Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Firm GSTIN</label>
              <input
                type="text"
                value={firmConfig.gstin}
                onChange={(e) => setFirmConfig({ ...firmConfig, gstin: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-mono uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Firm PAN Number</label>
              <input
                type="text"
                value={firmConfig.panNumber}
                onChange={(e) => setFirmConfig({ ...firmConfig, panNumber: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-mono uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Firm TAN Number</label>
              <input
                type="text"
                value={firmConfig.tanNumber}
                onChange={(e) => setFirmConfig({ ...firmConfig, tanNumber: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-mono uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Bank Name</label>
              <input
                type="text"
                value={firmConfig.bankName}
                onChange={(e) => setFirmConfig({ ...firmConfig, bankName: e.target.value })}
                placeholder="e.g. State Bank of India"
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Account Number</label>
              <input
                type="text"
                value={firmConfig.bankAccountNo}
                onChange={(e) => setFirmConfig({ ...firmConfig, bankAccountNo: e.target.value })}
                placeholder="e.g. 38901234567"
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">IFSC Code</label>
              <input
                type="text"
                value={firmConfig.bankIfsc}
                onChange={(e) => setFirmConfig({ ...firmConfig, bankIfsc: e.target.value })}
                placeholder="e.g. SBIN0000691"
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-mono uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Invoice Header Disclaimer / Footnote</label>
            <textarea
              rows={2}
              value={firmConfig.invoiceHeaderNotes}
              onChange={(e) => setFirmConfig({ ...firmConfig, invoiceHeaderNotes: e.target.value })}
              className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Section 4: eCourts API */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Shield className="w-4 h-4 text-indigo-600" /> eCourts India API Gateway Sync
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">eCourts API Key Token</label>
              <input
                type="password"
                value={firmConfig.eCourtsApiKey}
                onChange={(e) => setFirmConfig({ ...firmConfig, eCourtsApiKey: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-mono focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Used to fetch live Cause Lists and Certified Orders directly from District Courts & High Courts.
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Advocate eCourts Bar Code</label>
              <input
                type="text"
                value={firmConfig.eCourtsAdvocateCode}
                onChange={(e) => setFirmConfig({ ...firmConfig, eCourtsAdvocateCode: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-mono focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Enables automatic hearing status updates for CNR tracking across tribunals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <input
              type="checkbox"
              id="autoSyncCauseList"
              checked={firmConfig.autoSyncCauseList}
              onChange={(e) => setFirmConfig({ ...firmConfig, autoSyncCauseList: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor="autoSyncCauseList" className="text-slate-700 dark:text-slate-300 font-bold cursor-pointer">
              Enable Daily Automated eCourts Cause List Sync at 06:00 AM IST
            </label>
          </div>
        </div>

        {/* Section 5: AI Reasoning Engine */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Database className="w-4 h-4 text-indigo-600" /> Legal AI Engine & LLM Provider Switcher
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Active Reasoning Engine</label>
              <select
                value={firmConfig.aiModel || 'Gemini 3.6 Flash (Grounded Legal RAG)'}
                onChange={(e) => setFirmConfig({ ...firmConfig, aiModel: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Gemini 3.6 Flash (Grounded Legal RAG)">Gemini 3.6 Flash (Grounded RAG + Citation Engine) - [Default Recommended]</option>
                <option value="Gemini 3.5 Pro Legal">Gemini 3.5 Pro (Deep Case Analytics)</option>
                <option value="Claude 3.5 Sonnet Legal">Claude 3.5 Sonnet (Drafting & Submissions)</option>
                <option value="GPT-4o Counsel">GPT-4o Counsel (Precedent Search)</option>
                <option value="DeepSeek R1 Statutory">DeepSeek R1 (Statutory Reasoning)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Strict Hallucination Shield</label>
              <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                <input
                  type="checkbox"
                  id="hallucinationShield"
                  checked={firmConfig.strictGrounding ?? true}
                  onChange={(e) => setFirmConfig({ ...firmConfig, strictGrounding: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="hallucinationShield" className="text-slate-700 dark:text-slate-300 font-bold cursor-pointer">
                  Require verified case record citations for every response
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Saving to Database...' : 'Save Firm Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
