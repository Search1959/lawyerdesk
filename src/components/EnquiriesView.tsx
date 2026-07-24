import React, { useState } from 'react';
import { UserPlus, Search, Plus, Filter, Phone, Mail, FileText, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';
import { Enquiry } from '../types';
import { mockEnquiries } from '../data/mockData';

export const EnquiriesView: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newEnquiry, setNewEnquiry] = useState({
    clientName: '',
    phone: '',
    email: '',
    category: 'Civil' as any,
    subject: '',
    source: 'Website Lead' as any,
    consultFeeINR: 10000,
    notes: '',
  });

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.includes(searchQuery);
    const matchesStatus = selectedStatus === 'All' || e.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Enquiry = {
      id: `enq-${Date.now()}`,
      clientName: newEnquiry.clientName,
      phone: newEnquiry.phone,
      email: newEnquiry.email,
      category: newEnquiry.category,
      subject: newEnquiry.subject,
      source: newEnquiry.source,
      consultFeeINR: Number(newEnquiry.consultFeeINR),
      status: 'New Lead',
      date: new Date().toISOString().split('T')[0],
      notes: newEnquiry.notes,
    };
    setEnquiries([created, ...enquiries]);
    setShowAddModal(false);
    setNewEnquiry({
      clientName: '',
      phone: '',
      email: '',
      category: 'Civil',
      subject: '',
      source: 'Website Lead',
      consultFeeINR: 10000,
      notes: '',
    });
  };

  const handleStatusChange = (id: string, newStatus: Enquiry['status']) => {
    setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <UserPlus className="w-4 h-4" /> Client Intake & Lead Management
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Enquiries & Prospect Desk</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track prospective client enquiries, chamber consultation bookings, and lead conversions.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> New Client Enquiry
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Enquiries</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{enquiries.length}</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Active lead pipeline
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Unassigned Leads</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {enquiries.filter(e => e.status === 'New Lead').length}
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Needs consultation setup
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Consultations Fixed</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {enquiries.filter(e => e.status === 'Consultation Fixed').length}
          </div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Chamber appointments
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conversion Rate</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {Math.round((enquiries.filter(e => e.status === 'Converted to Matter').length / (enquiries.length || 1)) * 100)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Retained as active cases</div>
        </div>
      </div>

      {/* Controls: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search prospect name, phone, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['All', 'New Lead', 'Consultation Fixed', 'Converted to Matter', 'Declined'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries List / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEnquiries.map((enquiry) => (
          <div
            key={enquiry.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {enquiry.category}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    enquiry.status === 'New Lead'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      : enquiry.status === 'Consultation Fixed'
                      ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300'
                      : enquiry.status === 'Converted to Matter'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {enquiry.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{enquiry.clientName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{enquiry.subject}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{enquiry.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{enquiry.email}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>Source: <strong className="text-slate-700 dark:text-slate-200">{enquiry.source}</strong></span>
                  <span>Consult Fee: <strong className="text-slate-700 dark:text-slate-200">₹{enquiry.consultFeeINR.toLocaleString()}</strong></span>
                </div>
              </div>

              {enquiry.notes && (
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-600 dark:text-slate-300 italic border border-slate-200/60 dark:border-slate-700/60">
                  "{enquiry.notes}"
                </div>
              )}
            </div>

            {/* Quick Status Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Date: {enquiry.date}</span>
              <select
                value={enquiry.status}
                onChange={(e) => handleStatusChange(enquiry.id, e.target.value as any)}
                className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="New Lead">New Lead</option>
                <option value="Consultation Fixed">Consultation Fixed</option>
                <option value="Converted to Matter">Converted to Matter</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* New Enquiry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Record New Client Enquiry</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEnquiry} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Prospect Name</label>
                <input
                  type="text"
                  required
                  value={newEnquiry.clientName}
                  onChange={(e) => setNewEnquiry({ ...newEnquiry, clientName: e.target.value })}
                  placeholder="e.g. Adv. Rajesh Goel / M/s ABC Corp"
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newEnquiry.phone}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEnquiry.email}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, email: e.target.value })}
                    placeholder="prospect@example.com"
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Practice Area</label>
                  <select
                    value={newEnquiry.category}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, category: e.target.value as any })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Civil">Civil</option>
                    <option value="Criminal">Criminal</option>
                    <option value="Company & Insolvency">Company & Insolvency</option>
                    <option value="GST & Indirect Tax">GST & Indirect Tax</option>
                    <option value="Arbitration">Arbitration</option>
                    <option value="Property & Real Estate">Property & Real Estate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Enquiry Source</label>
                  <select
                    value={newEnquiry.source}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, source: e.target.value as any })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Website Lead">Website Lead</option>
                    <option value="Client Referral">Client Referral</option>
                    <option value="High Court Chamber">High Court Chamber</option>
                    <option value="Phone Enquiry">Phone Enquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Subject / Legal Issue</label>
                <input
                  type="text"
                  required
                  value={newEnquiry.subject}
                  onChange={(e) => setNewEnquiry({ ...newEnquiry, subject: e.target.value })}
                  placeholder="e.g. Sec 138 NI Act Dishonour Notice / High Court Injunction"
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Initial Notes</label>
                <textarea
                  rows={2}
                  value={newEnquiry.notes}
                  onChange={(e) => setNewEnquiry({ ...newEnquiry, notes: e.target.value })}
                  placeholder="Key background notes from preliminary phone conversation..."
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
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
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
