import React, { useState } from 'react';
import { Calendar, Search, Plus, Filter, Clock, MapPin, User, Video, PhoneCall, CheckCircle2 } from 'lucide-react';
import { Appointment } from '../types';
import { mockAppointments, mockMatters, mockUsers } from '../data/mockData';

export const AppointmentsView: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newApt, setNewApt] = useState({
    clientName: '',
    matterTitle: mockMatters[0]?.title || '',
    lawyerName: mockUsers[0]?.name || 'Adv. Rajeshwar V. Sharma',
    date: new Date().toISOString().split('T')[0],
    time: '03:00 PM',
    mode: 'Chamber Meeting' as Appointment['mode'],
    purpose: '',
  });

  const filteredApts = appointments.filter((apt) => {
    const text = `${apt.clientName} ${apt.lawyerName} ${apt.purpose} ${apt.matterTitle || ''}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());
    const matchesMode = selectedMode === 'All' || apt.mode === selectedMode;
    return matchesSearch && matchesMode;
  });

  const handleCreateApt = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Appointment = {
      id: `apt-${Date.now()}`,
      clientName: newApt.clientName,
      matterTitle: newApt.matterTitle,
      lawyerName: newApt.lawyerName,
      date: newApt.date,
      time: newApt.time,
      mode: newApt.mode,
      purpose: newApt.purpose,
      status: 'Scheduled',
    };
    setAppointments([created, ...appointments]);
    setShowAddModal(false);
    setNewApt({
      clientName: '',
      matterTitle: mockMatters[0]?.title || '',
      lawyerName: mockUsers[0]?.name || 'Adv. Rajeshwar V. Sharma',
      date: new Date().toISOString().split('T')[0],
      time: '03:00 PM',
      mode: 'Chamber Meeting',
      purpose: '',
    });
  };

  const toggleAptStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Calendar className="w-4 h-4" /> Chamber & Client Appointments
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Consultation Scheduler</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage chamber consultations, client briefings, and virtual video conferences.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Schedule Appointment
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search client, advocate or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['All', 'Chamber Meeting', 'Video Call (Google Meet)', 'High Court Canteen Briefing'].map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedMode === mode
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApts.map((apt) => (
          <div
            key={apt.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {apt.mode.includes('Video') ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                  {apt.mode}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    apt.status === 'Scheduled'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : apt.status === 'Completed'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{apt.clientName}</h3>
                {apt.matterTitle && (
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5 truncate">
                    {apt.matterTitle}
                  </p>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                "{apt.purpose}"
              </p>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span><strong>{apt.date}</strong> at {apt.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assigned Advocate: <strong>{apt.lawyerName}</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">ID: {apt.id}</span>
              <select
                value={apt.status}
                onChange={(e) => toggleAptStatus(apt.id, e.target.value as any)}
                className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Book Chamber Appointment</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApt} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={newApt.clientName}
                  onChange={(e) => setNewApt({ ...newApt, clientName: e.target.value })}
                  placeholder="Client / Company Name"
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Related Case / Matter (Optional)</label>
                <select
                  value={newApt.matterTitle}
                  onChange={(e) => setNewApt({ ...newApt, matterTitle: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Standalone Consultation --</option>
                  {mockMatters.map(m => (
                    <option key={m.id} value={`${m.caseNumber} - ${m.title}`}>
                      {m.caseNumber} - {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newApt.date}
                    onChange={(e) => setNewApt({ ...newApt, date: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={newApt.time}
                    onChange={(e) => setNewApt({ ...newApt, time: e.target.value })}
                    placeholder="e.g. 03:30 PM"
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Meeting Mode</label>
                  <select
                    value={newApt.mode}
                    onChange={(e) => setNewApt({ ...newApt, mode: e.target.value as any })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Chamber Meeting">Chamber Meeting</option>
                    <option value="Video Call (Google Meet)">Video Call (Google Meet)</option>
                    <option value="High Court Canteen Briefing">High Court Canteen Briefing</option>
                    <option value="Client Office Visit">Client Office Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Assigned Advocate</label>
                  <select
                    value={newApt.lawyerName}
                    onChange={(e) => setNewApt({ ...newApt, lawyerName: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    {mockUsers.map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Meeting Purpose</label>
                <textarea
                  rows={2}
                  required
                  value={newApt.purpose}
                  onChange={(e) => setNewApt({ ...newApt, purpose: e.target.value })}
                  placeholder="e.g. Senior Counsel Briefing for High Court Interim Stay Arguments..."
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
