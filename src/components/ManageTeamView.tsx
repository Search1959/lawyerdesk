import React, { useState } from 'react';
import { Users, Plus, Search, Shield, Briefcase, Mail, Phone, Award } from 'lucide-react';
import { TeamMember } from '../types';
import { mockTeamMembers } from '../data/mockData';

export const ManageTeamView: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>(mockTeamMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Associate' as TeamMember['role'],
    department: 'Civil & Commercial Litigation',
    email: '',
    phone: '',
    barCouncilNo: 'D/2024/',
    hourlyRateINR: 8000,
  });

  const filteredTeam = team.filter((t) => {
    const text = `${t.name} ${t.department} ${t.barCouncilNo} ${t.role}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const created: TeamMember = {
      id: `usr-${Date.now()}`,
      name: newMember.name,
      role: newMember.role,
      department: newMember.department,
      email: newMember.email,
      phone: newMember.phone,
      barCouncilNo: newMember.barCouncilNo,
      activeCasesCount: 0,
      monthlyBillableHours: 0,
      hourlyRateINR: Number(newMember.hourlyRateINR),
      status: 'Active',
    };
    setTeam([...team, created]);
    setShowAddModal(false);
    setNewMember({
      name: '',
      role: 'Associate',
      department: 'Civil & Commercial Litigation',
      email: '',
      phone: '',
      barCouncilNo: 'D/2024/',
      hourlyRateINR: 8000,
    });
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" /> Law Firm Counsel & Staff Roster
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Lawyer Team Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage advocate profiles, Bar Council registration IDs, hourly billing rates, and case assignments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Advocate / Staff
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search advocate name, Bar No, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((m) => (
          <div
            key={m.id}
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/60">
                  {m.role}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1">{m.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{m.department}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  m.status === 'In Court'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                {m.status}
              </span>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Bar Enrolment: <strong className="font-mono text-slate-800 dark:text-slate-200">{m.barCouncilNo}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span className="truncate">{m.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>{m.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Active Cases</span>
                <strong className="text-sm text-slate-900 dark:text-white">{m.activeCasesCount} Cases</strong>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Billing Rate</span>
                <strong className="text-sm text-indigo-600 dark:text-indigo-400">₹{m.hourlyRateINR.toLocaleString()}/hr</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Team Advocate</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Advocate Name</label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Adv. Priya Sen"
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Firm Role</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Senior Lawyer">Senior Lawyer</option>
                    <option value="Firm Admin">Firm Admin</option>
                    <option value="Associate">Associate</option>
                    <option value="Para-legal Staff">Para-legal Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Bar Enrolment No</label>
                  <input
                    type="text"
                    required
                    value={newMember.barCouncilNo}
                    onChange={(e) => setNewMember({ ...newMember, barCouncilNo: e.target.value })}
                    placeholder="e.g. D/1842/2016"
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={newMember.department}
                  onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                  placeholder="e.g. Commercial Litigation"
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="advocate@firm.in"
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    required
                    value={newMember.hourlyRateINR}
                    onChange={(e) => setNewMember({ ...newMember, hourlyRateINR: Number(e.target.value) })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
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
                  Save Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
