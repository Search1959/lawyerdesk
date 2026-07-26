import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Search, Paperclip, Trash2, Scale, CheckCheck, Plus, AlertCircle } from 'lucide-react';
import { Message, Matter, User } from '../types';

interface MessagesViewProps {
  matters: Matter[];
  currentUser: User;
  messages: Message[];
  onSendMessage: (msg: Message) => void;
  onDeleteMessage: (messageId: string) => void;
  onDeleteThread: (matterId: string) => void;
  onNavigateToCases?: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  matters = [],
  currentUser,
  messages = [],
  onSendMessage,
  onDeleteMessage,
  onDeleteThread,
  onNavigateToCases,
}) => {
  const [activeMatterId, setActiveMatterId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteThreadId, setConfirmDeleteThreadId] = useState<string | null>(null);

  // Automatically select first available matter if current active matter is invalid
  useEffect(() => {
    if (matters.length > 0) {
      if (!activeMatterId || !matters.some((m) => m.id === activeMatterId)) {
        setActiveMatterId(matters[0].id);
      }
    } else {
      setActiveMatterId('');
    }
  }, [matters, activeMatterId]);

  const activeMatter = matters.find((m) => m.id === activeMatterId) || matters[0];
  const threadMessages = activeMatter ? messages.filter((m) => m.matterId === activeMatter.id) : [];

  const filteredMatters = matters.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeMatter) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      matterId: activeMatter.id,
      matterTitle: `${activeMatter.caseNumber} - ${activeMatter.title}`,
      senderName: currentUser.name || 'Advocate',
      senderRole: currentUser.role || 'Senior Advocate',
      text: inputText.trim(),
      timestamp: 'Just now',
      isClientMessage: currentUser.role === 'Client',
      unread: false,
    };

    onSendMessage(newMsg);
    setInputText('');
  };

  const handleConfirmDeleteThread = (matterId: string) => {
    onDeleteThread(matterId);
    setConfirmDeleteThreadId(null);
  };

  // If no matters exist for this user account (e.g. clean new account)
  if (matters.length === 0) {
    return (
      <div className="space-y-6 pb-8 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" /> Client Portal Direct Communications
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Case Communications & Messages</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Encrypted client messenger linked directly to active court case files and document repositories.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-2xl mx-auto shadow-sm my-8">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-900">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Case Message Threads Yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Your law practice workspace is clean with no demo data. Register a court case in Case Management to initiate encrypted messaging threads with clients and advocates.
          </p>
          {onNavigateToCases && (
            <button
              onClick={onNavigateToCases}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
            >
              <Plus className="w-4 h-4" /> Register New Court Case
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" /> Client Portal Direct Communications
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Case Communications & Messages</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Encrypted client messenger linked directly to active court case files and document repositories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px]">
        {/* Left Column: Matter Threads */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Case Message Threads ({matters.length})
            </h3>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case or client..."
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {filteredMatters.map((matter) => {
              const isSelected = activeMatter?.id === matter.id;
              const matterMsgs = messages.filter((m) => m.matterId === matter.id);
              const lastMsg = matterMsgs[matterMsgs.length - 1];

              return (
                <div
                  key={matter.id}
                  onClick={() => setActiveMatterId(matter.id)}
                  className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{matter.caseNumber}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{lastMsg?.timestamp || ''}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteThreadId(matter.id);
                        }}
                        title="Delete entire message thread"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1 truncate">{matter.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                    {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : 'No messages yet'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        {activeMatter ? (
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{activeMatter.caseNumber}</span>
                <h3 className="font-black text-slate-900 dark:text-white text-sm">{activeMatter.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Client: {activeMatter.clientName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
                  Encrypted Thread
                </span>
                {threadMessages.length > 0 && (
                  <button
                    onClick={() => setConfirmDeleteThreadId(activeMatter.id)}
                    className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800/60 transition-all font-medium"
                    title="Clear all messages in this thread"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Thread
                  </button>
                )}
              </div>
            </div>

            {/* Delete Thread Confirmation Modal */}
            {confirmDeleteThreadId === activeMatter.id && (
              <div className="bg-rose-50 dark:bg-rose-950/80 border-b border-rose-200 dark:border-rose-800 p-3.5 flex items-center justify-between text-xs animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  Are you sure you want to delete all messages in this case thread? This action cannot be undone.
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleConfirmDeleteThread(activeMatter.id)}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-all"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setConfirmDeleteThreadId(null)}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Messages Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/40 dark:bg-slate-950/40">
              {threadMessages.length === 0 ? (
                <div className="text-center py-20 text-slate-400 dark:text-slate-500 text-xs">
                  No conversation history logged for this case yet. Start typing below.
                </div>
              ) : (
                threadMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`group relative flex flex-col ${msg.isClientMessage ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{msg.senderName}</span> • {msg.timestamp}
                    </div>
                    <div className="relative flex items-center gap-2 max-w-md">
                      {/* Delete Message Button (Client message: right side) */}
                      {msg.isClientMessage && (
                        <button
                          onClick={() => onDeleteMessage(msg.id)}
                          title="Delete message"
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-all order-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div
                        className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                          msg.isClientMessage
                            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none order-1'
                            : 'bg-indigo-600 text-white rounded-tr-none'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Delete Message Button (Lawyer/My message: left side) */}
                      {!msg.isClientMessage && (
                        <button
                          onClick={() => onDeleteMessage(msg.id)}
                          title="Delete message"
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Send message regarding ${activeMatter.caseNumber}...`}
                className="flex-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center p-8 text-slate-400 text-xs">
            Select a case thread on the left to view messages.
          </div>
        )}
      </div>
    </div>
  );
};
