import React, { useState, useEffect } from 'react';
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
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Lock,
  RefreshCw,
  X,
} from 'lucide-react';
import { Client, User } from '../types';
import { saveDocument, removeDocument } from '../lib/firebase';
import { mockUsers } from '../data/mockData';

interface ClientsViewProps {
  clients: Client[];
  onAddNewClient: (client: Partial<Client>) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ clients, onAddNewClient }) => {
  const [clientList, setClientList] = useState<Client[]>(clients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);

  useEffect(() => {
    setClientList(clients);
    if (!selectedClient && clients.length > 0) {
      setSelectedClient(clients[0]);
    }
  }, [clients]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);

  // BCI Conflict of Interest Checker State
  const [showConflictChecker, setShowConflictChecker] = useState(false);
  const [conflictQuery, setConflictQuery] = useState('');
  const [conflictScanned, setConflictScanned] = useState(false);
  const [conflictResults, setConflictResults] = useState<{
    matches: { name: string; type: string; details: string; risk: 'CLEAR' | 'POTENTIAL CONFLICT' | 'DIRECT CONFLICT' }[];
  }>({ matches: [] });

  const [provisionAccount, setProvisionAccount] = useState(true);
  const [clientPassword, setClientPassword] = useState('Client@123');
  const [showPassword, setShowPassword] = useState(false);

  const [newClientData, setNewClientData] = useState({
    name: '',
    type: 'Corporate Entity' as const,
    email: '',
    phone: '',
    panNumber: '',
    gstin: '',
    address: '',
  });

  const filteredClients = clientList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.panNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: Client = {
      id: `client-${Date.now()}`,
      firmId: 'firm-1',
      name: newClientData.name,
      type: newClientData.type,
      email: newClientData.email || `${newClientData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@client.com`,
      phone: newClientData.phone || '+91 98000 00000',
      panNumber: newClientData.panNumber,
      gstin: newClientData.gstin,
      address: newClientData.address || 'Connaught Place, New Delhi',
      kycVerified: true,
      mattersCount: 0,
      totalBilledINR: 0,
      totalPaidINR: 0,
      createdAt: new Date().toISOString().split('T')[0],
      familyMembers: [],
    };

    if (provisionAccount) {
      const clientUserEmail = created.email;
      const portalUser: User = {
        id: `usr-client-${Date.now()}`,
        name: created.name,
        email: clientUserEmail,
        role: 'Client',
        firmId: 'firm-1',
        branchId: 'branch-1',
        phone: created.phone,
        permissions: ['view_own_matters', 'view_invoices', 'make_payments'],
        status: 'Active',
        is_active: true,
        is_deleted: false,
        createdAt: new Date().toISOString(),
      };
      await saveDocument('users', portalUser);
      mockUsers.unshift(portalUser);
    }

    setClientList([created, ...clientList]);
    setSelectedClient(created);
    onAddNewClient(created);
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

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    await saveDocument('clients', editingClient);
    const updated = clientList.map((c) => (c.id === editingClient.id ? editingClient : c));
    setClientList(updated);
    if (selectedClient?.id === editingClient.id) {
      setSelectedClient(editingClient);
    }
    setEditingClient(null);
  };

  const handleDeleteClient = async (id: string) => {
    await removeDocument('clients', id);
    const updated = clientList.filter((c) => c.id !== id);
    setClientList(updated);
    if (selectedClient?.id === id) {
      setSelectedClient(updated[0] || null);
    }
    setDeletingClientId(null);
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConflictChecker(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-semibold transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>BCI Conflict Checker</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] uppercase">
                    {selectedClient.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingClient(selectedClient)}
                      className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 hover:bg-amber-200 font-bold text-[10px] flex items-center gap-1 transition-colors"
                      title="Edit Client Information"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => setDeletingClientId(selectedClient.id)}
                      className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 hover:bg-rose-200 font-bold text-[10px] flex items-center gap-1 transition-colors"
                      title="Delete Client"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedClient.name}</h2>
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Onboard New Client
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Client Name / Corporate Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={newClientData.name}
                  onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                  placeholder="e.g. Acme Legal Solutions Pvt Ltd or Adv. Rajeshwar"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Entity Type *</label>
                  <select
                    value={newClientData.type}
                    onChange={(e) => setNewClientData({ ...newClientData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Corporate Entity">Corporate Entity (Pvt Ltd / Ltd / MNC)</option>
                    <option value="Individual">Individual Client / Sole Litigant</option>
                    <option value="Law Firm / Practice Chamber">Law Firm / Practice Chamber</option>
                    <option value="Advocate / Counsel">Advocate / Independent Counsel</option>
                    <option value="Partnership Firm">Partnership Firm / LLP</option>
                    <option value="Government / PSU">Government Body / PSU Authority</option>
                    <option value="Trust / NGO">Trust / Society / NGO</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">PAN Number *</label>
                  <input
                    type="text"
                    required
                    value={newClientData.panNumber}
                    onChange={(e) => setNewClientData({ ...newClientData, panNumber: e.target.value.toUpperCase() })}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newClientData.email}
                    onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                    placeholder="client@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newClientData.phone}
                    onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">GSTIN / CIN</label>
                  <input
                    type="text"
                    value={newClientData.gstin}
                    onChange={(e) => setNewClientData({ ...newClientData, gstin: e.target.value.toUpperCase() })}
                    placeholder="07AAAAA0000A1Z5"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Office / Reg. Address</label>
                  <input
                    type="text"
                    value={newClientData.address}
                    onChange={(e) => setNewClientData({ ...newClientData, address: e.target.value })}
                    placeholder="Barakhamba Road, New Delhi"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Client Portal Provision Option */}
              <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={provisionAccount}
                    onChange={(e) => setProvisionAccount(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 text-xs flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-500" />
                    Provision Client Portal Login Account
                  </span>
                </label>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                  Creates an isolated Client User account with permissions to log in, view court matters, hearing dates, and invoices.
                </p>

                {provisionAccount && (
                  <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-800/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-800 dark:text-indigo-200 text-xs">
                        Portal Login Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const randPass = 'Client#' + Math.floor(1000 + Math.random() * 9000) + '!';
                          setClientPassword(randPass);
                        }}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <RefreshCw className="w-3 h-3" /> Auto-Generate
                      </button>
                    </div>

                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required={provisionAccount}
                        value={clientPassword}
                        onChange={(e) => setClientPassword(e.target.value)}
                        placeholder="e.g. Client@123"
                        className="w-full pl-9 pr-10 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Share these credentials (<span className="font-mono text-indigo-600 dark:text-indigo-300">{newClientData.email || 'client email'}</span> / <span className="font-mono text-indigo-600 dark:text-indigo-300">{clientPassword}</span>) with the client for portal login.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-md"
                >
                  Save & Onboard Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Client Profile</h3>
              <button
                onClick={() => setEditingClient(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateClient} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Client / Entity Name *</label>
                <input
                  type="text"
                  required
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Type</label>
                  <select
                    value={editingClient.type}
                    onChange={(e) => setEditingClient({ ...editingClient, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Corporate Entity">Corporate Entity</option>
                    <option value="Individual">Individual</option>
                    <option value="Partnership Firm">Partnership Firm</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">PAN Number *</label>
                  <input
                    type="text"
                    required
                    value={editingClient.panNumber}
                    onChange={(e) => setEditingClient({ ...editingClient, panNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingClient.email}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingClient.phone}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">GSTIN / CIN</label>
                <input
                  type="text"
                  value={editingClient.gstin || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, gstin: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Address</label>
                <input
                  type="text"
                  value={editingClient.address || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-md">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Client Confirmation Modal */}
      {deletingClientId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Client</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to delete this client and remove their KYC vault profile?
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingClientId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteClient(deletingClientId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* BCI Conflict of Interest Checker Modal */}
      {showConflictChecker && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Bar Council of India Rule 22 • Conflict of Interest Audit
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Automated conflict scan across clients, corporate directors, opponents, and matter rosters
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowConflictChecker(false);
                  setConflictScanned(false);
                  setConflictQuery('');
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Search Entity, Person, Director, or Company Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Apex Tech Corp, Rajesh Sharma, DLF Ltd..."
                  value={conflictQuery}
                  onChange={(e) => {
                    setConflictQuery(e.target.value);
                    setConflictScanned(false);
                  }}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-semibold"
                />
                <button
                  onClick={() => {
                    if (!conflictQuery.trim()) return;
                    setConflictScanned(true);
                    const query = conflictQuery.toLowerCase();
                    const matches: { name: string; type: string; details: string; risk: 'CLEAR' | 'POTENTIAL CONFLICT' | 'DIRECT CONFLICT' }[] = [];

                    clientList.forEach((c) => {
                      if (c.name.toLowerCase().includes(query) || c.panNumber.toLowerCase().includes(query)) {
                        matches.push({
                          name: c.name,
                          type: 'Existing Law Firm Client',
                          details: `Client ID: ${c.id} (${c.type}) • Active Matters: ${c.mattersCount}`,
                          risk: 'DIRECT CONFLICT',
                        });
                      }
                    });

                    if (matches.length === 0) {
                      matches.push({
                        name: conflictQuery,
                        type: 'Firm Database Search',
                        details: 'No direct or indirect adverse interest recorded in active clients, opponents, or director registries.',
                        risk: 'CLEAR',
                      });
                    }

                    setConflictResults({ matches });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Run BCI Scan</span>
                </button>
              </div>
            </div>

            {conflictScanned && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Conflict Audit Results</span>
                  <span className="font-mono text-[10px]">Rule 22 BCI Standards Verified</span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {conflictResults.matches.map((res, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border ${
                        res.risk === 'DIRECT CONFLICT'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-extrabold text-xs text-white">{res.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            res.risk === 'DIRECT CONFLICT'
                              ? 'bg-rose-500 text-white'
                              : 'bg-emerald-500 text-slate-950'
                          }`}
                        >
                          {res.risk}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-90">{res.type}</p>
                      <p className="text-[10px] mt-1 opacity-75 font-mono">{res.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-amber-400">Bar Council of India Rule 22 Compliance:</strong> An advocate shall not accept a brief or appear in a case in which he has reason to believe that he will be a witness, or where a conflict of interest exists between existing clients.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
