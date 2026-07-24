import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Gavel, Scale, Clock, User, FileText } from 'lucide-react';
import { Hearing } from '../types';
import { mockHearings, mockMatters } from '../data/mockData';

export const HearingCalendarView: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState('August 2026');
  const [selectedDay, setSelectedDay] = useState<number>(4);

  // August 2026 days mapping (31 days)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Highlight days with hearings
  const hearingDaysMap: { [day: number]: Hearing[] } = {
    4: [mockHearings[0]],
    12: [mockHearings[1]],
    20: [mockHearings[2]],
    28: [
      {
        id: 'hrg-4',
        matterId: 'matter-4',
        date: '2026-08-28',
        time: '11:30 AM',
        courtName: 'District Court',
        courtHallNo: 'Court Room No. 3, Barasat',
        judgeName: 'Hon’ble Ld. 3rd Civil Judge',
        stage: 'Injunction Notice & Service Verification',
        synopsis: 'Order 39 Rule 1 Injunction application hearing for Belghoria partition suit.',
        assignedLawyerId: 'usr-1',
        assignedLawyerName: 'Adv. Rajeshwar V. Sharma',
      },
    ],
  };

  const selectedHearings = hearingDaysMap[selectedDay] || [];

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <CalendarDays className="w-4 h-4" /> Interactive Court Hearing Master Calendar
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Hearing Calendar</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Visual cause list calendar with color-coded court halls, bench schedules, and judge rosters.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-xs text-slate-800 dark:text-slate-200 px-2">{currentMonth}</span>
          <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Monthly Calendar Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase text-slate-400 dark:text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Empty offset for Aug 1 start (Sat = offset 6) */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`offset-${i}`} className="h-20 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg" />
            ))}

            {daysInMonth.map((day) => {
              const hearingsOnDay = hearingDaysMap[day] || [];
              const isSelected = selectedDay === day;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-20 p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-500/20 shadow-sm'
                      : hearingsOnDay.length > 0
                      ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 hover:bg-amber-100/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black ${
                        isSelected
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : hearingsOnDay.length > 0
                          ? 'text-amber-900 dark:text-amber-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {day}
                    </span>
                    {hearingsOnDay.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    )}
                  </div>

                  {hearingsOnDay.length > 0 ? (
                    <div className="space-y-0.5">
                      {hearingsOnDay.map((h) => (
                        <div
                          key={h.id}
                          className="text-[9.5px] font-bold truncate bg-amber-500 text-white px-1.5 py-0.5 rounded"
                        >
                          {h.courtName.split(' ')[0]} • {h.time}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-300 dark:text-slate-600">No cause list</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Cause List Details for Selected Day */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Selected Day</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  August {selectedDay}, 2026
                </h3>
              </div>
              <span className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-full">
                {selectedHearings.length} Scheduled
              </span>
            </div>

            {selectedHearings.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
                <Gavel className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-medium">No court hearings listed for this date.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedHearings.map((h) => {
                  const matter = mockMatters.find(m => m.id === h.matterId);

                  return (
                    <div
                      key={h.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-indigo-600 dark:text-indigo-400 font-mono">{matter?.caseNumber}</span>
                        <span className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded font-mono">
                          {h.time}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                        {matter?.title}
                      </h4>

                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <div>🏛️ <strong>{h.courtName}</strong> ({h.courtHallNo})</div>
                        <div>⚖️ Presiding: {h.judgeName}</div>
                        <div>📌 Stage: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{h.stage}</span></div>
                        <div>👤 Lead Lawyer: <strong>{h.assignedLawyerName}</strong></div>
                      </div>

                      {h.synopsis && (
                        <div className="p-2.5 bg-white rounded-lg text-xs text-slate-600 border border-slate-200 italic">
                          "{h.synopsis}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
