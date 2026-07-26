import React, { useState } from 'react';
import { X, MessageCircle, Send, CheckCheck, Copy, Check, Sparkles, Phone, User as UserIcon, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import { WhatsAppReminderData, generateWhatsAppMessage, sanitizePhoneNumber, openWhatsAppWeb, sendBackendWhatsAppReminder } from '../lib/whatsapp';

interface WhatsAppReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: WhatsAppReminderData;
  onReminderSent?: (reminder: WhatsAppReminderData & { sentAt: string }) => void;
}

export const WhatsAppReminderModal: React.FC<WhatsAppReminderModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onReminderSent,
}) => {
  const [data, setData] = useState<WhatsAppReminderData>(initialData);
  const [activeTab, setActiveTab] = useState<'HEARING_ALERT' | 'APPOINTMENT_REMINDER' | 'INVOICE_REMINDER' | 'STATUTORY_LIMITATION' | 'CUSTOM'>(
    initialData.reminderType || 'HEARING_ALERT'
  );
  const [customMsgText, setCustomMsgText] = useState(
    initialData.customMessage || generateWhatsAppMessage({ ...initialData, reminderType: initialData.reminderType || 'HEARING_ALERT' })
  );

  const [copied, setCopied] = useState(false);
  const [isSendingCloud, setIsSendingCloud] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const currentData: WhatsAppReminderData = {
    ...data,
    reminderType: activeTab,
    customMessage: activeTab === 'CUSTOM' ? customMsgText : undefined,
  };

  const previewMessage = activeTab === 'CUSTOM' ? customMsgText : generateWhatsAppMessage(currentData);
  const cleanPhone = sanitizePhoneNumber(data.recipientPhone);

  const handleTabChange = (type: 'HEARING_ALERT' | 'APPOINTMENT_REMINDER' | 'INVOICE_REMINDER' | 'STATUTORY_LIMITATION' | 'CUSTOM') => {
    setActiveTab(type);
    const updatedData = { ...data, reminderType: type };
    const generated = generateWhatsAppMessage(updatedData);
    setCustomMsgText(generated);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(previewMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsAppDirect = () => {
    if (!data.recipientPhone) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid recipient phone number.' });
      return;
    }
    openWhatsAppWeb(data.recipientPhone, previewMessage);
    setStatusMessage({ type: 'success', text: 'Opening WhatsApp Web / App with pre-filled reminder!' });
    if (onReminderSent) {
      onReminderSent({ ...currentData, sentAt: new Date().toISOString() });
    }
  };

  const handleDispatchCloudAPI = async () => {
    if (!data.recipientPhone) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid recipient phone number.' });
      return;
    }
    setIsSendingCloud(true);
    setStatusMessage(null);

    const res = await sendBackendWhatsAppReminder(currentData);
    setIsSendingCloud(false);

    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: `WhatsApp reminder dispatched successfully! (Phone: +${cleanPhone})`,
      });
      if (res.whatsappUrl) {
        window.open(res.whatsappUrl, '_blank');
      }
      if (onReminderSent) {
        onReminderSent({ ...currentData, sentAt: new Date().toISOString() });
      }
    } else {
      setStatusMessage({
        type: 'error',
        text: res.error || 'Failed to dispatch cloud API message. Trying direct link...',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/40 text-emerald-100 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider border border-emerald-300/30">
                  WhatsApp Integration
                </span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5">WhatsApp Message Reminder</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Template Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Reminder Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleTabChange('HEARING_ALERT')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border ${
                  activeTab === 'HEARING_ALERT'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <span>🏛️ Court Hearing</span>
                <span className="text-[10px] font-normal opacity-80">Roster & Bench</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('APPOINTMENT_REMINDER')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border ${
                  activeTab === 'APPOINTMENT_REMINDER'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <span>📅 Consultation</span>
                <span className="text-[10px] font-normal opacity-80">Chamber & Virtual</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('INVOICE_REMINDER')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border ${
                  activeTab === 'INVOICE_REMINDER'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <span>💳 Legal Fee Due</span>
                <span className="text-[10px] font-normal opacity-80">Invoice Payment</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('STATUTORY_LIMITATION')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border ${
                  activeTab === 'STATUTORY_LIMITATION'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <span>⚠️ Court Deadline</span>
                <span className="text-[10px] font-normal opacity-80">Statutory Limitation</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('CUSTOM')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border ${
                  activeTab === 'CUSTOM'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <span>📝 Custom Message</span>
                <span className="text-[10px] font-normal opacity-80">Free Text Editor</span>
              </button>
            </div>
          </div>

          {/* Recipient Details Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Recipient Name
              </label>
              <div className="relative">
                <UserIcon className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={data.recipientName}
                  onChange={(e) => setData({ ...data, recipientName: e.target.value })}
                  placeholder="Client or Advocate Name"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                WhatsApp Phone Number (+91)
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={data.recipientPhone}
                  onChange={(e) => setData({ ...data, recipientPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              {cleanPhone && (
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                  Sanitized for WhatsApp API: +{cleanPhone}
                </div>
              )}
            </div>
          </div>

          {/* Editable Custom Message Field if activeTab === 'CUSTOM' */}
          {activeTab === 'CUSTOM' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Message Content:
              </label>
              <textarea
                rows={5}
                value={customMsgText}
                onChange={(e) => setCustomMsgText(e.target.value)}
                placeholder="Type custom legal update or notification..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-sans"
              />
            </div>
          )}

          {/* Live WhatsApp Chat Bubble Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> WhatsApp Chat Bubble Live Preview:
              </label>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-[11px] text-slate-500 hover:text-emerald-600 font-bold flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>

            <div className="bg-[#e5ddd5] dark:bg-[#0b141a] p-4 rounded-xl border border-slate-300 dark:border-slate-800 shadow-inner">
              <div className="bg-[#dcf8c6] dark:bg-[#005c4b] text-slate-900 dark:text-slate-100 p-3.5 rounded-2xl rounded-tr-none max-w-lg ml-auto shadow-sm text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {previewMessage}
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 dark:text-slate-300 mt-2 font-mono">
                  <span>Just now</span>
                  <CheckCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDispatchCloudAPI}
              disabled={isSendingCloud}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSendingCloud ? 'Dispatching...' : 'Dispatch Cloud API'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenWhatsAppDirect}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md hover:shadow-emerald-500/20"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in WhatsApp Web / App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
