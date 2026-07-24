import React, { useState } from 'react';
import { Scale, X, Plus } from 'lucide-react';
import { Matter, Client, CourtType } from '../types';

interface NewMatterModalProps {
  clients: Client[];
  onClose: () => void;
  onSave: (matterData: Partial<Matter>) => void;
}

export const NewMatterModal: React.FC<NewMatterModalProps> = ({
  clients,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    caseNumber: '',
    category: 'Civil' as const,
    court: 'Delhi High Court',
    judgeName: 'Hon’ble Justice Rajiv Shakdher',
    courtRoomNo: 'Court Room No. 24',
    clientId: clients[0]?.id || '',
    leadLawyerName: 'Adv. Senior Advocate',
    actsAndSections: 'CPC 1908 O.39 R.1&2; Commercial Courts Act Sec.12A',
    aiSummary: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formData.clientId);

    onSave({
      title: formData.title,
      caseNumber: formData.caseNumber,
      category: formData.category,
      court: (formData.court as CourtType) || 'District Court',
      judgeName: formData.judgeName,
      courtRoomNo: formData.courtRoomNo,
      clientId: formData.clientId,
      clientName: client?.name || 'Selected Client',
      leadLawyerName: formData.leadLawyerName,
      actsAndSections: formData.actsAndSections.split(';').map((s) => s.trim()),
      aiSummary: formData.aiSummary || 'Newly ingested litigation matter. OCR document extraction pending.',
      opposingParty: 'Respondent Entity',
      opposingAdvocate: 'Opposing Senior Counsel',
      nextHearingDate: '2026-08-20',
      status: 'Active Litigation',
      riskScore: 25,
      riskLevel: 'Medium',
      documentsCount: 0,
      aiMissingDocuments: ['Initial Plaint / Petition Copy', 'Power of Attorney (Vakalatnama)'],
      aiContradictions: [],
      aiStrategyNotes: ['Schedule pre-institution mediation check under Sec 12A Commercial Courts Act.'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Intake New Litigation Matter</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Case Title</label>
            <input
              type="text"
              required
              placeholder="e.g., M/s Apex Infrastructure Ltd v. Union of India"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Case Number / CNR</label>
              <input
                type="text"
                required
                placeholder="e.g., CS(COMM) 890/2026"
                value={formData.caseNumber}
                onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Case Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                <option value="Civil">Civil / Commercial Suit</option>
                <option value="Criminal">Criminal Trial / Appeal</option>
                <option value="Company & Insolvency">Company & NCLT Insolvency</option>
                <option value="GST & Indirect Tax">GST & Indirect Tax</option>
                <option value="Constitutional">Constitutional / Writ Petition</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Court / Forum</label>
              <input
                type="text"
                value={formData.court}
                onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Client</label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.panNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Presiding Judge</label>
              <input
                type="text"
                value={formData.judgeName}
                onChange={(e) => setFormData({ ...formData, judgeName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Lead Advocate</label>
              <input
                type="text"
                value={formData.leadLawyerName}
                onChange={(e) => setFormData({ ...formData, leadLawyerName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Acts & Sections (Semicolon Separated)</label>
            <input
              type="text"
              value={formData.actsAndSections}
              onChange={(e) => setFormData({ ...formData, actsAndSections: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Initial Brief / AI Synopsis Context</label>
            <textarea
              rows={3}
              placeholder="Brief facts of the suit, dispute monetary value, or grounds..."
              value={formData.aiSummary}
              onChange={(e) => setFormData({ ...formData, aiSummary: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md"
            >
              Create Matter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
