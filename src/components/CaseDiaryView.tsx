import React, { useState } from 'react';
import { BookOpen, Calendar, Search, Plus, Filter, FileText, CheckCircle, ChevronRight, User } from 'lucide-react';
import { mockHearings, mockMatters } from '../data/mockData';

export const CaseDiaryView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-04');
  const [searchQuery, setSearchQuery] = useState('');
  const [diaryNotes, setDiaryNotes] = useState<{ [key: string]: string }>({
    'hrg-1': 'High Court Bench noted Senior Advocate submission on Clause 14.3. Stay extended till 04-Aug.',
    'hrg-2': 'Cross-examination of PW-1 postponed due to CVO absence. Directions issued.',
  });

  const [newNote, setNewNote] = useState('');
  const [activeHearingId, setActiveHearingId] = useState<string>('hrg-1');

  const filteredHearings = mockHearings.filter((h) => {
    const matter = mockMatters.find(m => m.id === h.matterId);
    const text = `${h.courtName} ${h.judgeName} ${h.stage} ${matter?.title || ''}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const handleSaveNote = (hearingId: string) => {
    setDiaryNotes({ ...diaryNotes, [hearingId]: newNote });
    setNewNote('');
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> Advocate Court Room Diary & Cause List
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Daily Case Diary</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Log daily court hall proceedings, judicial remarks, bench observations, and next date orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Diary Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Cause List Hearings for Selected Day */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                Court Cause List ({filteredHearings.length})
              </h3>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{selectedDate}</span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter court, judge or case..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredHearings.map((h) => {
                const matter = mockMatters.find(m => m.id === h.matterId);
                const isSelected = activeHearingId === h.id;

                return (
                  <div
                    key={h.id}
                    onClick={() => {
                      setActiveHearingId(h.id);
                      setNewNote(diaryNotes[h.id] || '');
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-indigo-600 dark:text-indigo-400 font-mono">{matter?.caseNumber}</span>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">{h.time}</span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1 line-clamp-1">
                      {matter?.title}
                    </h4>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 space-y-0.5">
                      <div>🏛️ {h.courtName} • {h.courtHallNo}</div>
                      <div>⚖️ {h.judgeName}</div>
                    </div>

                    {diaryNotes[h.id] && (
                      <div className="mt-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/60 text-[10px] text-indigo-700 dark:text-indigo-300 font-medium truncate">
                        📝 Note Logged
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Court Proceedings & Diary Editor */}
        <div className="lg:col-span-2 space-y-4">
          {(() => {
            const h = mockHearings.find(item => item.id === activeHearingId) || mockHearings[0];
            const matter = mockMatters.find(m => m.id === h.matterId);

            return (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                {/* Matter Context Banner */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 px-2.5 py-0.5 rounded">
                      {matter?.caseNumber}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Assigned: {h.assignedLawyerName}</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">{matter?.title}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400 dark:text-slate-500 font-bold">Court & Hall</span>
                      <strong>{h.courtName} ({h.courtHallNo})</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400 dark:text-slate-500 font-bold">Presiding Judge</span>
                      <strong>{h.judgeName}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400 dark:text-slate-500 font-bold">Hearing Stage</span>
                      <strong className="text-indigo-600 dark:text-indigo-400">{h.stage}</strong>
                    </div>
                  </div>
                </div>

                {/* Existing Synopsis */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Court Hearing Synopsis</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-200 bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200/80 dark:border-amber-900/50">
                    {h.synopsis}
                  </p>
                </div>

                {/* Advocate Daily Diary Log Box */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Advocate Courtroom Diary Notes</h4>
                  
                  {diaryNotes[h.id] ? (
                    <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-2">
                      <div className="flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300 font-bold">
                        <span>Recorded Entry</span>
                        <button
                          onClick={() => setDiaryNotes({ ...diaryNotes, [h.id]: '' })}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-[11px]"
                        >
                          Edit Note
                        </button>
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                        "{diaryNotes[h.id]}"
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        rows={4}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Type court hall notes, judge directives, opponent arguments, or order directions..."
                        className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 font-serif"
                      />
                      <button
                        onClick={() => handleSaveNote(h.id)}
                        disabled={!newNote.trim()}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-all"
                      >
                        <FileText className="w-4 h-4" /> Save Diary Entry
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
