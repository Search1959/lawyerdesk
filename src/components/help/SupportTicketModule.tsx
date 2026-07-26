import React, { useState } from 'react';
import { SupportTicket, SupportTicketComment } from '../../types/helpTypes';
import {
  LifeBuoy,
  Plus,
  Send,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  FileText,
  User,
  ShieldCheck,
  X,
  Paperclip,
} from 'lucide-react';

interface SupportTicketModuleProps {
  tickets: SupportTicket[];
  onCreateTicket: (newTicket: Partial<SupportTicket>) => void;
  onAddComment: (ticketId: string, commentText: string) => void;
}

export const SupportTicketModule: React.FC<SupportTicketModuleProps> = ({
  tickets,
  onCreateTicket,
  onAddComment,
}) => {
  const [activeTicketId, setActiveTicketId] = useState<string>(tickets[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New ticket form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Cause List Sync');
  const [type, setType] = useState<'Bug' | 'Feature Request' | 'Question' | 'Urgent Issue'>('Bug');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  // Comment state
  const [commentText, setCommentText] = useState('');

  const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];

  const handleSubmitNewTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    onCreateTicket({
      subject,
      category,
      type,
      priority,
      description,
      screenshots: attachmentUrl ? [attachmentUrl] : [],
      status: 'Open',
    });

    setSubject('');
    setDescription('');
    setAttachmentUrl('');
    setShowCreateModal(false);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeTicket) return;
    onAddComment(activeTicket.id, commentText);
    setCommentText('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <LifeBuoy className="w-3.5 h-3.5" /> LawyerDesk Engineering Support
          </div>
          <h2 className="text-xl font-black">Support Desk & Ticket Tracking</h2>
          <p className="text-xs text-slate-300">Submit technical queries, report platform bugs, or request features directly to engineering.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Support Ticket</span>
        </button>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ticket List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 px-1">
            Your Active Tickets ({tickets.length})
          </div>

          <div className="space-y-2">
            {tickets.map((tkt) => {
              const isSelected = tkt.id === activeTicket?.id;
              return (
                <div
                  key={tkt.id}
                  onClick={() => setActiveTicketId(tkt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-slate-900 dark:text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{tkt.ticketNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        tkt.status === 'Open'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                          : tkt.status === 'In Progress'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                      }`}
                    >
                      {tkt.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs line-clamp-1">{tkt.subject}</h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <span>{tkt.category}</span>
                    <span>{tkt.createdAt.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Ticket Conversation Thread */}
        {activeTicket ? (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-6 flex flex-col justify-between">
            {/* Ticket Metadata Header */}
            <div className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  {activeTicket.ticketNumber} • Priority: {activeTicket.priority}
                </span>
                <span className="text-xs text-slate-400">Created: {activeTicket.createdAt}</span>
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">{activeTicket.subject}</h3>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {activeTicket.description}
              </div>
            </div>

            {/* Comments Thread */}
            <div className="space-y-4 overflow-y-auto max-h-[300px] pr-1">
              <div className="text-xs font-extrabold uppercase text-slate-400">Ticket Activity Log & Support Replies</div>

              {activeTicket.comments && activeTicket.comments.length > 0 ? (
                activeTicket.comments.map((cm) => (
                  <div
                    key={cm.id}
                    className={`p-4 rounded-2xl text-xs space-y-2 border ${
                      cm.isStaff
                        ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60 ml-4'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        {cm.isStaff ? (
                          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <User className="w-4 h-4 text-slate-500" />
                        )}
                        <span>{cm.authorName}</span>
                        <span className="text-[10px] font-normal text-slate-400">({cm.authorRole})</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{cm.createdAt}</span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{cm.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">No support comments yet. Our engineers are reviewing your ticket.</div>
              )}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendComment} className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add comment or reply to support..."
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <LifeBuoy className="w-12 h-12 text-slate-400 mx-auto" />
            <div className="text-sm font-bold text-slate-500">No ticket selected</div>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-base">
                <LifeBuoy className="w-5 h-5" />
                <span>Create Support Ticket</span>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Cause List Sync">Cause List Sync</option>
                    <option value="PaddleOCR Engine">PaddleOCR Engine</option>
                    <option value="AI Legal Chat">AI Legal Chat</option>
                    <option value="GST Billing & Invoices">GST Billing & Invoices</option>
                    <option value="WhatsApp Notifications">WhatsApp Notifications</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Bug">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Question">Technical Question</option>
                    <option value="Urgent Issue">Urgent Critical Issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Short summary of issue or request..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the problem, steps to reproduce, or feature requested..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Screenshot / Attachment Image URL (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    placeholder="https://image-url.com/screenshot.png"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setAttachmentUrl('https://images.unsplash.com/photo-1589829545856-d10d557cf95f')}
                    className="px-3 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold whitespace-nowrap"
                  >
                    Sample Attach
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-md"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
