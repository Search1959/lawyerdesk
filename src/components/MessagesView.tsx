import React, { useState } from 'react';
import { MessageSquare, Send, Search, Paperclip, User, Scale, CheckCheck } from 'lucide-react';
import { Message } from '../types';
import { mockMessages, mockMatters } from '../data/mockData';

export const MessagesView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [activeMatterId, setActiveMatterId] = useState<string>('matter-1');
  const [inputText, setInputText] = useState('');

  const activeMatter = mockMatters.find(m => m.id === activeMatterId) || mockMatters[0];
  const threadMessages = messages.filter(m => m.matterId === activeMatterId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      matterId: activeMatterId,
      matterTitle: `${activeMatter.caseNumber} - ${activeMatter.title}`,
      senderName: 'Adv. Rajeshwar V. Sharma',
      senderRole: 'Senior Lawyer',
      text: inputText,
      timestamp: 'Just now',
      isClientMessage: false,
      unread: false,
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

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
          <h3 className="font-bold text-xs uppercase text-slate-500 dark:text-slate-400 tracking-wider">Case Message Threads</h3>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {mockMatters.map((matter) => {
              const isSelected = activeMatterId === matter.id;
              const matterMsgs = messages.filter(m => m.matterId === matter.id);
              const lastMsg = matterMsgs[matterMsgs.length - 1];

              return (
                <div
                  key={matter.id}
                  onClick={() => setActiveMatterId(matter.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{matter.caseNumber}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{lastMsg?.timestamp || ''}</span>
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
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{activeMatter.caseNumber}</span>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">{activeMatter.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Client: {activeMatter.clientName}</p>
            </div>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
              Encrypted Thread
            </span>
          </div>

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
                  className={`flex flex-col ${msg.isClientMessage ? 'items-start' : 'items-end'}`}
                >
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{msg.senderName}</span> • {msg.timestamp}
                  </div>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                      msg.isClientMessage
                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                        : 'bg-indigo-600 text-white rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
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
      </div>
    </div>
  );
};
