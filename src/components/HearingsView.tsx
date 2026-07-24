import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MessageCircle,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  Scale,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Search,
  Grid,
  List,
  Building2,
  UserCheck,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Hearing, Matter, CourtType } from '../types';

interface HearingsViewProps {
  hearings: Hearing[];
  matters: Matter[];
  onAddNewHearing: (hearing: Partial<Hearing>) => void;
}

export const HearingsView: React.FC<HearingsViewProps> = ({
  hearings,
  matters,
  onAddNewHearing,
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed: 7 = August 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-08-15');
  const [selectedCourt, setSelectedCourt] = useState<string>('ALL');
  const [sentWhatsappId, setSentWhatsappId] = useState<string | null>(null);
  const [isSyncingCauseList, setIsSyncingCauseList] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [newHearing, setNewHearing] = useState({
    matterId: matters[0]?.id || '',
    date: selectedDateStr,
    time: '10:30 AM',
    courtName: 'Delhi High Court' as CourtType,
    courtHallNo: 'Court Room No. 24',
    judgeName: 'Hon’ble Bench',
    stage: 'Arguments',
    synopsis: 'Filing of synopsis and list of dates.',
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSendWhatsapp = (id: string) => {
    setSentWhatsappId(id);
    setTimeout(() => setSentWhatsappId(null), 3000);
  };

  const handleSyncCauseList = () => {
    setIsSyncingCauseList(true);
    setTimeout(() => {
      setIsSyncingCauseList(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNewHearing(newHearing);
    setShowModal(false);
  };

  // Helper to generate days in currentMonth
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  const calendarDays = [];
  // Empty slots for previous month padding
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const monthFormatted = String(currentMonth + 1).padStart(2, '0');
    const dayFormatted = String(d).padStart(2, '0');
    const dateStr = `${currentYear}-${monthFormatted}-${dayFormatted}`;
    calendarDays.push({ dayNumber: d, dateStr });
  }

  // Filter hearings by Court and selected date (if in calendar mode and a date is selected)
  const filteredHearings = hearings.filter((hrg) => {
    const matchesCourt = selectedCourt === 'ALL' || hrg.courtName === selectedCourt;
    return matchesCourt;
  });

  const hearingsOnSelectedDate = filteredHearings.filter(
    (hrg) => hrg.date === selectedDateStr
  );

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Hearing Calendar & e-Cause List</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            e-Courts Roster Auto-Sync • Interactive Hearing Calendar • Automated WhatsApp Client Reminders
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'calendar'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Calendar Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Cause List View</span>
            </button>
          </div>

          {/* Cause List Sync Button */}
          <button
            onClick={handleSyncCauseList}
            disabled={isSyncingCauseList}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${isSyncingCauseList ? 'animate-spin' : ''}`} />
            <span>{isSyncingCauseList ? 'Polling e-Courts...' : 'Sync Cause List'}</span>
          </button>

          {/* Add Hearing Button */}
          <button
            onClick={() => {
              setNewHearing((prev) => ({ ...prev, date: selectedDateStr }));
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Hearing</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span className="font-bold text-slate-700 dark:text-slate-200">Filter by Court:</span>
          <select
            value={selectedCourt}
            onChange={(e) => setSelectedCourt(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Courts ({hearings.length} Total Hearings)</option>
            <option value="Delhi High Court">Delhi High Court</option>
            <option value="Calcutta High Court">Calcutta High Court</option>
            <option value="District Court">District Court (Barasat / Tis Hazari)</option>
            <option value="NCLT (National Company Law Tribunal)">NCLT Delhi / Kolkata</option>
            <option value="Supreme Court of India">Supreme Court of India</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> High Court
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> District Court
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> NCLT / Tribunal
          </span>
        </div>
      </div>

      {/* CALENDAR GRID VIEW */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Calendar Grid Container (8 columns) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            {/* Month Switcher Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentMonth(7);
                    setCurrentYear(2026);
                    setSelectedDateStr('2026-08-15');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                >
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Row */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Month Day Cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((cell, idx) => {
                if (!cell) {
                  return <div key={idx} className="h-16 sm:h-20 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl"></div>;
                }

                const dayHearings = filteredHearings.filter((h) => h.date === cell.dateStr);
                const isSelected = selectedDateStr === cell.dateStr;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDateStr(cell.dateStr)}
                    className={`h-16 sm:h-20 p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>
                      {dayHearings.length > 0 && (
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950">
                          {dayHearings.length}
                        </span>
                      )}
                    </div>

                    {/* Hearing Badge Indicator */}
                    <div className="space-y-1 w-full overflow-hidden">
                      {dayHearings.slice(0, 2).map((h) => (
                        <div
                          key={h.id}
                          className="text-[9px] font-semibold px-1 py-0.5 rounded truncate bg-indigo-600/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20"
                        >
                          {h.courtName.split(' ')[0]} • {h.stage.slice(0, 10)}
                        </div>
                      ))}
                      {dayHearings.length > 2 && (
                        <div className="text-[9px] text-slate-400 font-bold">
                          +{dayHearings.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Agenda Drawer (5 columns) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Selected Date Roster</div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedDateStr}</h3>
              </div>
              <button
                onClick={() => {
                  setNewHearing((prev) => ({ ...prev, date: selectedDateStr }));
                  setShowModal(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Date</span>
              </button>
            </div>

            {hearingsOnSelectedDate.length === 0 ? (
              <div className="p-8 text-center space-y-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <CalendarDays className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">No Court Hearings Scheduled</div>
                <p className="text-[11px] text-slate-500">No cause list items found for {selectedDateStr}.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {hearingsOnSelectedDate.map((hrg) => {
                  const matter = matters.find((m) => m.id === hrg.matterId);
                  const isSent = sentWhatsappId === hrg.id;

                  return (
                    <div
                      key={hrg.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {hrg.courtName}
                        </span>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {hrg.time}
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                        {matter ? matter.title : 'Legal Matter'} ({matter?.caseNumber})
                      </h4>

                      <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div><strong>Bench:</strong> {hrg.judgeName} ({hrg.courtHallNo})</div>
                        <div><strong>Stage:</strong> {hrg.stage}</div>
                        <div><strong>Counsel:</strong> {hrg.assignedLawyerName}</div>
                      </div>

                      <button
                        onClick={() => handleSendWhatsapp(hrg.id)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                      >
                        {isSent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5" />}
                        <span>{isSent ? 'Reminders Dispatched!' : 'Send WhatsApp Alert'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CAUSE LIST TABLE / CARDS VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredHearings.map((hrg) => {
            const matter = matters.find((m) => m.id === hrg.matterId);
            const isSent = sentWhatsappId === hrg.id;

            return (
              <div
                key={hrg.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                      {hrg.courtName}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{hrg.courtHallNo}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold">
                      <Clock className="w-4 h-4" />
                      <span>{hrg.date} at {hrg.time}</span>
                    </div>

                    <button
                      onClick={() => handleSendWhatsapp(hrg.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      {isSent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5" />}
                      <span>{isSent ? 'WhatsApp Reminders Sent!' : 'Send WhatsApp Alert'}</span>
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {matter ? matter.title : 'Legal Matter'} ({matter?.caseNumber})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div><strong>Judge:</strong> {hrg.judgeName}</div>
                  <div><strong>Stage:</strong> {hrg.stage}</div>
                  <div><strong>Assigned Counsel:</strong> {hrg.assignedLawyerName}</div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Board Synopsis:</strong> {hrg.synopsis}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* New Hearing Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Court Hearing Date</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Matter</label>
                <select
                  value={newHearing.matterId}
                  onChange={(e) => setNewHearing({ ...newHearing, matterId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  {matters.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.caseNumber} - {m.title.slice(0, 35)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Hearing Date</label>
                  <input
                    type="date"
                    value={newHearing.date}
                    onChange={(e) => setNewHearing({ ...newHearing, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Board Time</label>
                  <input
                    type="text"
                    value={newHearing.time}
                    onChange={(e) => setNewHearing({ ...newHearing, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Court Room No</label>
                  <input
                    type="text"
                    value={newHearing.courtHallNo}
                    onChange={(e) => setNewHearing({ ...newHearing, courtHallNo: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Stage</label>
                  <input
                    type="text"
                    value={newHearing.stage}
                    onChange={(e) => setNewHearing({ ...newHearing, stage: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Synopsis / Board Brief</label>
                <textarea
                  rows={2}
                  value={newHearing.synopsis}
                  onChange={(e) => setNewHearing({ ...newHearing, synopsis: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
