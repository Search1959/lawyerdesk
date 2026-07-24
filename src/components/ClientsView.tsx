import React, { useState } from 'react';
import {
  Users,
  Building,
  UserCheck,
  Plus,
  Search,
  Phone,
  Mail,
  FileCheck2,
  Receipt,
  MessageSquare,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { Client } from '../types';

interface ClientsViewProps {
  clients: Client[];
  onAddNewClient: (client: Partial<Client>) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ clients, onAddNewClient }) => {
  const [selectedClient, setSelectedClient] = useState<Client>(clients[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    type: 'Corporate Entity' as const,
    email: '',
    phone: '',
    panNumber: '',
    gstin: '',
    address: '',
  });

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.panNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNewClient(newClientData);
    setShowModal(false);
    setNewClientData({
      name: '',
      type: 'Corporate Entity',
      email: '',
      phone: '',
      panNumber: '',
      gstin: '',
      address: '',
    });
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Client Management & KYC Vault</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Corporate Entities & Individual Clients • KYC (PAN, Aadhaar, Passport, GSTIN) • Family & Director Hierarchy
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Client List (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by client name, PAN, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-2.5">
            {filteredClients.map((c) => {
              const isSelected = selectedClient?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClient(c)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 ring-1 ring-indigo-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[180px]">{c.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> KYC Verified
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>{c.type}</span>
                    <span className="font-mono">PAN: {c.panNumber}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Client Details Panel (8 cols) */}
        {selectedClient ? (
          <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] uppercase">
                  {selectedClient.type}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{selectedClient.name}</h2>
                <p className="text-xs text-slate-500 mt-1">{selectedClient.address}</p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 font-bold">Total Billed</div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  ₹{(selectedClient.totalBilledINR / 100000).toFixed(2)} Lakhs
                </div>
              </div>
            </div>

            {/* Contact & KYC Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
                <div className="text-slate-400 text-[10px] font-bold">PAN NUMBER</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{selectedClient.panNumber}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
                <div className="text-slate-400 text-[10px] font-bold">GSTIN / CIN</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedClient.gstin || selectedClient.companyRegistrationNumber || 'N/A'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
                <div className="text-slate-400 text-[10px] font-bold">EMAIL</div>
                <div className="font-medium text-slate-900 dark:text-white mt-0.5 truncate">{selectedClient.email}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
                <div className="text-slate-400 text-[10px] font-bold">PHONE</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedClient.phone}</div>
              </div>
            </div>

            {/* Family / Directors Tree */}
            {selectedClient.familyMembers && selectedClient.familyMembers.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-slate-400 mb-2">
                  Directors & Designated Key Personnel
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedClient.familyMembers.map((fm) => (
                    <div key={fm.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{fm.name}</div>
                        <div className="text-slate-500 text-[11px]">{fm.relation}</div>
                      </div>
                      <div className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">{fm.phone}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* New Client Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Onboard New Client</h2>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Client Name / Entity Name</label>
                <input
                  type="text"
                  required
                  value={newClientData.name}
                  onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Type</label>
                <select
                  value={newClientData.type}
                  onChange={(e) => setNewClientData({ ...newClientData, type: e.target.value as any })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                >
                  <option value="Corporate Entity">Corporate Entity</option>
                  <option value="Individual">Individual</option>
                  <option value="Partnership Firm">Partnership Firm</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">PAN Number</label>
                  <input
                    type="text"
                    required
                    value={newClientData.panNumber}
                    onChange={(e) => setNewClientData({ ...newClientData, panNumber: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={newClientData.gstin}
                    onChange={(e) => setNewClientData({ ...newClientData, gstin: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold">
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
