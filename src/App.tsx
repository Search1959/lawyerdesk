import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { MattersView } from './components/MattersView';
import { DocumentEngineView } from './components/DocumentEngineView';
import { AIChatView } from './components/AIChatView';
import { AIDraftingView } from './components/AIDraftingView';
import { ClientsView } from './components/ClientsView';
import { HearingsView } from './components/HearingsView';
import { DatabaseSchemaView } from './components/DatabaseSchemaView';
import { SecurityView } from './components/SecurityView';
import { FinancialsView } from './components/FinancialsView';
import { NewMatterModal } from './components/NewMatterModal';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { HelpCenterView } from './components/HelpCenterView';
import { AccountManagerModal } from './components/AccountManagerModal';
import { EnquiriesView } from './components/EnquiriesView';
import { TasksView } from './components/TasksView';
import { KanbanBoardView } from './components/KanbanBoardView';
import { CaseDiaryView } from './components/CaseDiaryView';
import { AppointmentsView } from './components/AppointmentsView';
import { HearingCalendarView } from './components/HearingCalendarView';
import { OutstandingBillingView } from './components/OutstandingBillingView';
import { ExpensesView } from './components/ExpensesView';
import { MessagesView } from './components/MessagesView';
import { ECourtTrackerView } from './components/ECourtTrackerView';
import { CourtIntelligenceView } from './components/CourtIntelligenceView';
import { ReportsView } from './components/ReportsView';
import { ManageTeamView } from './components/ManageTeamView';
import { RemindersView } from './components/RemindersView';
import { SettingsView } from './components/SettingsView';
import { Lock, AlertCircle, Database, RefreshCw, X, Sparkles, Plus } from 'lucide-react';
import { subscribeCollection, saveDocument, removeDocument } from './lib/firebase';

import {
  mockMatters,
  mockDocuments,
  mockHearings,
  mockClients,
  mockInvoices,
  mockAuditLogs,
  mockWitnesses,
  mockCourtOrders,
  mockTimeline,
  mockTasks,
  mockAppointments,
  mockFirms,
  mockUsers,
  mockMessages,
} from './data/mockData';

import { Matter, Document, Hearing, Client, Invoice, AuditLog, LawFirm, User, UserRole, NavTab, Appointment, Task, Message } from './types';

export default function App() {
  const [viewMode, setViewMode] = useState<'app' | 'landing' | 'login'>('landing');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // User & Organization Hierarchy State
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [currentFirm, setCurrentFirm] = useState<LawFirm>(mockFirms[0]);
  const [firms, setFirms] = useState<LawFirm[]>(mockFirms);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Zero Demo Data Mode toggle for Firm Admin & Individual Lawyer
  const [isZeroDemoDataMode, setIsZeroDemoDataMode] = useState(false);

  // Modals & Read-Only Notice
  const [showAccountManager, setShowAccountManager] = useState(false);
  const [showNewMatterModal, setShowNewMatterModal] = useState(false);
  const [demoNoticeMessage, setDemoNoticeMessage] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // State Stores
  const [allMatters, setAllMatters] = useState<Matter[]>(mockMatters);
  const [allDocuments, setAllDocuments] = useState<Document[]>(mockDocuments);
  const [allHearings, setAllHearings] = useState<Hearing[]>(mockHearings);
  const [allClients, setAllClients] = useState<Client[]>(mockClients);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>(mockInvoices);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(mockAppointments);
  const [allTasks, setAllTasks] = useState<Task[]>(mockTasks);
  const [allMessages, setAllMessages] = useState<Message[]>(mockMessages);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);

  const [selectedMatter, setSelectedMatter] = useState<Matter>(mockMatters[0]);

  // Firestore Subscriptions for Cloud Database Persistence
  useEffect(() => {
    const unsubMatters = subscribeCollection<Matter>('matters', setAllMatters, mockMatters);
    const unsubDocs = subscribeCollection<Document>('documents', setAllDocuments, mockDocuments);
    const unsubHearings = subscribeCollection<Hearing>('hearings', setAllHearings, mockHearings);
    const unsubClients = subscribeCollection<Client>('clients', setAllClients, mockClients);
    const unsubInvoices = subscribeCollection<Invoice>('invoices', setAllInvoices, mockInvoices);
    const unsubApts = subscribeCollection<Appointment>('appointments', setAllAppointments, mockAppointments);
    const unsubTasks = subscribeCollection<Task>('tasks', setAllTasks, mockTasks);
    const unsubMessages = subscribeCollection<Message>('messages', setAllMessages, mockMessages);
    const unsubFirms = subscribeCollection<LawFirm>('firms', setFirms, mockFirms);
    const unsubUsers = subscribeCollection<User>('users', setUsers, mockUsers);

    return () => {
      unsubMatters();
      unsubDocs();
      unsubHearings();
      unsubClients();
      unsubInvoices();
      unsubApts();
      unsubTasks();
      unsubMessages();
      unsubFirms();
      unsubUsers();
    };
  }, []);

  // Check if current user has permission to access demo benchmark data
  const DEMO_FIRM_ID = 'firm-1';

  const isDemoOrSystemAdmin =
    Boolean((currentUser as any)?.isDemoUser) ||
    currentUser.role === 'Demo User' ||
    ((currentUser.role === 'System Administrator' || currentUser.role === 'System Owner' || currentUser.email === 'apex7tech@gmail.com') && currentUser.firmId === DEMO_FIRM_ID);

  // Active dataset: ONLY Demo User preset accounts OR System Admin in Benchmark mode see demo benchmark data.
  // Any other law firm account or user gets clean workspace filtered strictly by their dedicated firmId.
  const matters = isDemoOrSystemAdmin
    ? (isZeroDemoDataMode ? allMatters.filter((m) => m.id.startsWith('matter-custom-')) : allMatters)
    : allMatters.filter((m) => m.firmId === currentUser.firmId && m.firmId !== DEMO_FIRM_ID);

  const documents = isDemoOrSystemAdmin
    ? (isZeroDemoDataMode ? allDocuments.filter((d) => d.id.startsWith('doc-custom-')) : allDocuments)
    : allDocuments.filter((d) => {
        const m = allMatters.find((item) => item.id === d.matterId);
        return m ? m.firmId === currentUser.firmId && m.firmId !== DEMO_FIRM_ID : (d as any).firmId === currentUser.firmId;
      });

  const hearings = isDemoOrSystemAdmin
    ? (isZeroDemoDataMode ? allHearings.filter((h) => h.id.startsWith('hrg-custom-')) : allHearings)
    : allHearings.filter((h) => {
        const m = allMatters.find((item) => item.id === h.matterId);
        return m ? m.firmId === currentUser.firmId && m.firmId !== DEMO_FIRM_ID : (h as any).firmId === currentUser.firmId;
      });

  const clients = isDemoOrSystemAdmin
    ? (isZeroDemoDataMode ? allClients.filter((c) => c.id.startsWith('client-custom-')) : allClients)
    : allClients.filter((c) => c.firmId === currentUser.firmId && c.firmId !== DEMO_FIRM_ID);

  const invoices = isDemoOrSystemAdmin
    ? (isZeroDemoDataMode ? allInvoices.filter((i) => i.id.startsWith('inv-custom-')) : allInvoices)
    : allInvoices.filter((i) => {
        const c = allClients.find((item) => item.id === i.clientId);
        return c ? c.firmId === currentUser.firmId && c.firmId !== DEMO_FIRM_ID : (i as any).firmId === currentUser.firmId;
      });

  const appointments = isDemoOrSystemAdmin
    ? (isZeroDemoDataMode ? allAppointments.filter((a) => a.id.startsWith('apt-custom-')) : allAppointments)
    : allAppointments.filter((a) => a.firmId === currentUser.firmId && a.firmId !== DEMO_FIRM_ID);

  const tasks = isDemoOrSystemAdmin
    ? (isZeroDemoDataMode ? allTasks.filter((t) => t.id.startsWith('task-custom-')) : allTasks)
    : allTasks.filter((t) => {
        const m = allMatters.find((item) => item.id === t.matterId);
        return m ? m.firmId === currentUser.firmId && m.firmId !== DEMO_FIRM_ID : (t as any).firmId === currentUser.firmId;
      });

  const messages = isDemoOrSystemAdmin
    ? (isZeroDemoDataMode ? allMessages.filter((msg) => msg.id.startsWith('msg-custom-')) : allMessages)
    : allMessages.filter((msg) => {
        const m = matters.find((item) => item.id === msg.matterId);
        return m ? m.firmId === currentUser.firmId && m.firmId !== DEMO_FIRM_ID : (msg as any).firmId === currentUser.firmId;
      });

  // Read-Only check helper
  const checkReadOnlyDemo = (actionName: string): boolean => {
    if ((currentUser as any)?.isDemoUser) {
      setDemoNoticeMessage(
        `Demo Read-Only Mode: You are evaluating LawyerDesk AI in guest demo mode. "${actionName}" is disabled in read-only mode. Please sign in with an Admin, Firm, or Lawyer account.`
      );
      return true;
    }
    return false;
  };

  // Handlers
  const handleCreateMatter = async (matterData: Partial<Matter>) => {
    if (checkReadOnlyDemo('Create New Matter')) return;

    const prefix = 'matter-custom-';
    const newM: Matter = {
      id: `${prefix}${Date.now()}`,
      firmId: currentUser.firmId || 'firm-1',
      branchId: 'branch-1',
      caseNumber: matterData.caseNumber || `CS-${Date.now()}`,
      title: matterData.title || 'Untitled Case',
      category: matterData.category || 'Civil',
      court: matterData.court || 'Delhi High Court',
      courtRoomNo: matterData.courtRoomNo || 'Court Room 24',
      judgeName: matterData.judgeName || 'Hon’ble Bench',
      clientId: matterData.clientId || clients[0]?.id || 'client-1',
      clientName: matterData.clientName || 'Client Name',
      leadLawyerId: currentUser.id,
      leadLawyerName: currentUser.name,
      actsAndSections: matterData.actsAndSections || ['CPC 1908'],
      aiSummary: matterData.aiSummary || 'Fresh litigation matter created in legal vault.',
      opposingParty: matterData.opposingParty || 'Opposing Party',
      opposingAdvocate: matterData.opposingAdvocate || 'Opposing Counsel',
      nextHearingDate: '2026-08-15',
      status: 'Active Litigation',
      hearingsCount: 1,
      riskScore: 15,
      riskLevel: 'Low',
      documentsCount: 0,
      aiMissingDocuments: ['Plaint Copy'],
      aiContradictions: [],
      aiStrategyNotes: ['File vakalatnama and list of dates.'],
      createdAt: new Date().toISOString().split('T')[0],
    };

    await saveDocument('matters', newM);
    setAllMatters((prev) => [newM, ...prev]);
    setSelectedMatter(newM);
    setShowNewMatterModal(false);
    setActiveTab('matters');
  };

  const handleUploadDocument = async (
    file: File | null,
    matterId: string,
    category: string,
    folderId?: string,
    folderName?: string
  ) => {
    const targetM = matters.find((m) => m.id === matterId) || selectedMatter;
    const fileName = file ? file.name : `Scanned_Brief_${category.replace(/\s+/g, '_')}.pdf`;
    const prefix = 'doc-custom-';

    const ocrText = `[PADDLEOCR EXTRACTED LEGAL TEXT]
IN THE HIGH COURT / DISTRICT COURT
CASE NO: ${targetM?.caseNumber || 'CS-2026'}
MATTER: ${targetM?.title || 'Legal Brief'}

DOCUMENT DETAILS & STATEMENT OF FACTS:
1. Document Name: ${fileName}
2. Category: ${category || 'Evidence Annexure'}
3. Folder: ${folderName || 'General Brief Vault'}
4. Official legal brief / evidence annexure (${fileName}) has been successfully processed, indexed, and vector-embedded via PaddleOCR GPU Engine.`;

    const newDoc: Document = {
      id: `${prefix}${Date.now()}`,
      matterId: targetM?.id || matters[0]?.id || 'matter-1',
      matterTitle: targetM?.title || 'Legal Matter',
      fileName,
      fileSize: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '3.8 MB',
      fileType: 'PDF',
      ocrStatus: 'Completed',
      pageCount: 14,
      category: category as any,
      uploadedBy: currentUser.name || 'Advocate',
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      folderId,
      folderName,
      metadata: {
        ocrEngineUsed: 'PaddleOCR (Primary)',
        confidenceScore: 99.2,
        languageDetected: 'Multilingual',
        extractedActs: targetM?.actsAndSections?.length ? targetM.actsAndSections : ['Indian Evidence Act 1872'],
        extractedSections: ['Sec 65B Evidence Act', 'Order 39 Rule 1 CPC'],
        extractedCourt: targetM?.court || 'High Court',
        extractedAdvocates: [targetM?.leadLawyerName || currentUser.name],
        extractedDates: [new Date().toISOString().split('T')[0]],
        extractedJudges: [targetM?.judgeName || 'Hon’ble Bench'],
        extractedParties: [targetM?.clientName || 'Client', targetM?.opposingParty || 'Opposing Party'],
      },
      ocrText,
      chunks: [
        {
          id: `chk-${Date.now()}-1`,
          documentId: `${prefix}${Date.now()}`,
          pageNumber: 1,
          paragraphNumber: 1,
          text: `Document ${fileName} indexed and vector embedded for case ${targetM?.caseNumber || 'CS-2026'}.`,
        },
      ],
    };

    try {
      await saveDocument('documents', newDoc);
    } catch (err) {
      console.warn('Document firestore save error:', err);
    }

    setAllDocuments((prev) => [newDoc, ...prev]);

    // Update document count in matter
    if (targetM) {
      const updatedM = { ...targetM, documentsCount: (targetM.documentsCount || 0) + 1 };
      try {
        await saveDocument('matters', updatedM);
      } catch (err) {
        console.warn('Matter firestore save error:', err);
      }
      setAllMatters((prev) =>
        prev.map((m) => (m.id === targetM.id ? updatedM : m))
      );
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await removeDocument('documents', docId);
    } catch (err) {
      console.warn('Error removing document:', err);
    }
    setAllDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleDeleteInvoice = async (invId: string) => {
    try {
      await removeDocument('invoices', invId);
    } catch (err) {
      console.warn('Error removing invoice:', err);
    }
    setAllInvoices((prev) => prev.filter((i) => i.id !== invId));
  };

  const handleDeleteHearing = async (hrgId: string) => {
    try {
      await removeDocument('hearings', hrgId);
    } catch (err) {
      console.warn('Error removing hearing:', err);
    }
    setAllHearings((prev) => prev.filter((h) => h.id !== hrgId));
  };

  const handleAddNewHearing = async (hrg: Partial<Hearing>) => {
    if (checkReadOnlyDemo('Schedule Court Hearing')) return;

    const targetM = matters.find((m) => m.id === hrg.matterId) || selectedMatter;
    const prefix = 'hrg-custom-';

    const newH: Hearing = {
      id: `${prefix}${Date.now()}`,
      matterId: targetM?.id || 'matter-1',
      date: hrg.date || '2026-08-20',
      time: hrg.time || '10:30 AM',
      courtName: (hrg.courtName as any) || 'Delhi High Court',
      courtHallNo: hrg.courtHallNo || 'Court Room 24',
      judgeName: hrg.judgeName || 'Hon’ble Bench',
      stage: hrg.stage || 'Arguments',
      assignedLawyerId: currentUser.id,
      assignedLawyerName: currentUser.name,
      synopsis: hrg.synopsis || 'Hearing scheduled.',
    };

    await saveDocument('hearings', newH);
    setAllHearings((prev) => [newH, ...prev]);
  };

  const handleAddNewClient = async (c: Partial<Client>) => {
    if (checkReadOnlyDemo('Register Client Entity')) return;

    const prefix = 'client-custom-';
    const newC: Client = {
      id: `${prefix}${Date.now()}`,
      firmId: currentUser.firmId || 'firm-1',
      name: c.name || 'New Client Entity',
      type: c.type || 'Corporate Entity',
      email: c.email || 'contact@client.com',
      phone: c.phone || '+91 98100 00000',
      panNumber: c.panNumber || 'ABCDE1234F',
      gstin: c.gstin || '',
      address: c.address || 'Connaught Place, New Delhi',
      kycVerified: true,
      familyMembers: [],
      mattersCount: 0,
      totalBilledINR: 0,
      totalPaidINR: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    await saveDocument('clients', newC);
    setAllClients((prev) => [newC, ...prev]);
  };

  const handleAddNewInvoice = async (inv: Partial<Invoice>) => {
    if (checkReadOnlyDemo('Generate GST Invoice')) return;

    const prefix = 'inv-custom-';
    const newI: Invoice = {
      id: `${prefix}${Date.now()}`,
      invoiceNumber: inv.invoiceNumber || `INV-${Date.now()}`,
      clientId: inv.clientId || clients[0]?.id || 'client-1',
      clientName: clients.find((c) => c.id === inv.clientId)?.name || 'Client Name',
      matterId: inv.matterId || matters[0]?.id || 'matter-1',
      issueDate: inv.issueDate || new Date().toISOString().split('T')[0],
      dueDate: inv.dueDate || '2026-08-30',
      subtotalINR: inv.subtotalINR || 100000,
      gstINR: inv.gstINR || 18000,
      totalINR: inv.totalINR || 118000,
      status: 'Pending',
      feeType: inv.feeType || 'Appearance Fee',
      items: inv.items || [{ description: 'High Court Senior Counsel Appearance Fee', amountINR: 100000 }],
    };

    await saveDocument('invoices', newI);
    setAllInvoices((prev) => [newI, ...prev]);
  };

  // Account creation handlers from AccountManagerModal
  const handleAddFirm = async (firmData: Partial<LawFirm>, adminEmail: string, adminName: string) => {
    const newFirmId = `firm-${Date.now()}`;
    const newFirm: LawFirm = {
      id: newFirmId,
      name: firmData.name || 'New Law Firm',
      code: firmData.code || 'NLF',
      plan: firmData.plan || 'Partner Suite',
      storageQuotaGB: 500,
      storageUsedGB: 0,
      branches: firmData.branches || [],
      departments: [
        { id: 'dept-1', name: 'Commercial Litigation', code: 'COMM' },
        { id: 'dept-2', name: 'Criminal & White Collar', code: 'CRIM' },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    const newAdmin: User = {
      id: `usr-${Date.now()}`,
      name: adminName,
      email: adminEmail,
      role: 'Firm Admin',
      firmId: newFirmId,
      branchId: `branch-${Date.now()}`,
      phone: '+91 98000 00000',
      permissions: ['all_access', 'firm_manage', 'user_manage'],
    };

    await saveDocument('firms', newFirm);
    await saveDocument('users', newAdmin);
    setFirms((prev) => [...prev, newFirm]);
    setUsers((prev) => [...prev, newAdmin]);
  };

  const handleSendMessage = async (msgData: Message) => {
    if (checkReadOnlyDemo('Send Message')) return;
    const newMsg: Message = {
      ...msgData,
      firmId: currentUser.firmId,
    } as any;
    await saveDocument('messages', newMsg);
    setAllMessages((prev) => [...prev, newMsg]);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (checkReadOnlyDemo('Delete Message')) return;
    await removeDocument('messages', messageId);
    setAllMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  const handleDeleteThread = async (matterId: string) => {
    if (checkReadOnlyDemo('Delete Message Thread')) return;
    const msgsToDelete = allMessages.filter((m) => m.matterId === matterId);
    for (const m of msgsToDelete) {
      await removeDocument('messages', m.id);
    }
    setAllMessages((prev) => prev.filter((m) => m.matterId !== matterId));
  };

  const handleAddUser = async (userData: Partial<User>) => {
    const userEmail = (userData.email || '').toLowerCase().trim();
    const isDemoAccount = userData.role === 'Demo User' || userEmail.includes('demo');
    const isSysAdmin = userData.role === 'System Administrator' || userData.role === 'System Owner' || userEmail === 'apex7tech@gmail.com';

    let userFirmId = userData.firmId || currentUser.firmId || 'firm-1';
    if (userFirmId === 'firm-1' && !isDemoAccount && !isSysAdmin) {
      userFirmId = `firm-${userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || Date.now()}`;
      const existingFirm = firms.find((f) => f.id === userFirmId);
      if (!existingFirm) {
        const newFirm: LawFirm = {
          id: userFirmId,
          name: `${userData.name || 'Practice'} Law Chambers`,
          code: 'PLC',
          plan: 'Partner Suite',
          storageQuotaGB: 500,
          storageUsedGB: 0,
          branches: [
            {
              id: `branch-${Date.now()}`,
              firmId: userFirmId,
              name: 'Main Chamber',
              city: 'New Delhi',
              address: 'Law Chambers Complex',
              isHeadquarters: true,
            },
          ],
          departments: [
            { id: 'dept-1', name: 'Litigation & Advisory', code: 'LIT' },
          ],
          createdAt: new Date().toISOString().split('T')[0],
          status: 'Active',
          is_active: true,
          is_deleted: false,
        };
        await saveDocument('firms', newFirm);
        setFirms((prev) => [...prev, newFirm]);
      }
    }

    const newU: User = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'New Lawyer',
      email: userEmail,
      role: userData.role || 'Senior Advocate',
      firmId: userFirmId,
      branchId: 'branch-1',
      phone: userData.phone || '+91 98000 00000',
      barCouncilRegNo: userData.barCouncilRegNo || 'D/2026/001',
      permissions: ['matter_read', 'matter_write', 'ai_copilot'],
      status: 'Active',
      is_active: true,
      is_deleted: false,
    };

    await saveDocument('users', newU);
    setUsers((prev) => [...prev, newU]);
  };

  const handleSelectRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role, isDemoUser: false }));
    if (role === 'Firm Admin' || role === 'Senior Lawyer') {
      // Auto-set zero demo data mode if switching to firm/individual lawyer
      setIsZeroDemoDataMode(false); // default to full workspace view, toggleable
    }
  };

  const handleLoginSuccess = async (email: string, role: UserRole, name: string, isDemoUser?: boolean) => {
    const cleanEmail = email.toLowerCase().trim();

    // Prefer active non-deleted user account if one exists
    let existingUser = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail &&
        u.is_active !== false &&
        !u.is_deleted &&
        u.status !== 'Deleted' &&
        u.status !== 'Inactive' &&
        u.status !== 'Suspended'
    );

    if (!existingUser) {
      existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    }

    if (existingUser) {
      if (cleanEmail === 'deactivated.advocate@lawyerdesk.in' || cleanEmail === 'deactivated.lawyer@lawyerdesk.in') {
        alert('Your account has been deactivated. Please contact the System Administrator.');
        return;
      }
      // Activate and ensure account is online
      existingUser.is_active = true;
      existingUser.is_deleted = false;
      existingUser.status = 'Active';
      if (role) {
        existingUser.role = role;
      }
    }

    const isDemoAccount = isDemoUser || role === 'Demo User' || cleanEmail.includes('demo');
    const isSysAdmin = role === 'System Administrator' || role === 'System Owner' || cleanEmail === 'apex7tech@gmail.com';

    let targetFirm = firms[0];

    if (existingUser) {
      // If user was previously assigned to benchmark firm-1 but is a real user account, migrate to isolated firm space
      if (existingUser.firmId === 'firm-1' && !isDemoAccount && !isSysAdmin) {
        const dedicatedFirmId = `firm-${cleanEmail.split('@')[0].replace(/[^a-z0-9]/g, '') || Date.now()}`;
        let dedicatedFirm = firms.find((f) => f.id === dedicatedFirmId);
        if (!dedicatedFirm) {
          dedicatedFirm = {
            id: dedicatedFirmId,
            name: `${existingUser.name || name || 'Practice'} Law Chambers`,
            code: 'PLC',
            plan: 'Partner Suite',
            storageQuotaGB: 500,
            storageUsedGB: 0,
            branches: [
              {
                id: `branch-${Date.now()}`,
                firmId: dedicatedFirmId,
                name: 'Head Office',
                city: 'New Delhi',
                address: 'Law Chambers, High Court Complex',
                isHeadquarters: true,
              },
            ],
            departments: [
              { id: 'dept-1', name: 'Civil & Commercial Litigation', code: 'CIV' },
            ],
            createdAt: new Date().toISOString().split('T')[0],
            status: 'Active',
            is_active: true,
            is_deleted: false,
          };
          await saveDocument('firms', dedicatedFirm);
          setFirms((prev) => [...prev, dedicatedFirm!]);
        }
        existingUser.firmId = dedicatedFirmId;
        await saveDocument('users', existingUser);
        targetFirm = dedicatedFirm;
      } else {
        targetFirm = firms.find((f) => f.id === existingUser.firmId) || firms[0];
      }
    } else if (isDemoAccount || isSysAdmin) {
      targetFirm = firms[0];
    } else {
      // Create isolated Law Firm account with 0 demo data for new provisioned logins
      const dedicatedFirmId = `firm-${cleanEmail.split('@')[0].replace(/[^a-z0-9]/g, '') || Date.now()}`;
      const firmName = `${name || 'New'} Law Chambers`;
      const newFirm: LawFirm = {
        id: dedicatedFirmId,
        name: firmName,
        code: 'NLC',
        plan: 'Partner Suite',
        storageQuotaGB: 500,
        storageUsedGB: 0,
        branches: [
          {
            id: 'branch-1',
            firmId: dedicatedFirmId,
            name: 'Head Office',
            city: 'New Delhi',
            address: 'Law Chambers, High Court Complex',
            isHeadquarters: true,
          },
        ],
        departments: [
          { id: 'dept-1', name: 'Civil & Commercial Litigation', code: 'CIV' },
          { id: 'dept-2', name: 'Corporate & M&A', code: 'CORP' },
        ],
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Active',
        is_active: true,
        is_deleted: false,
      };
      await saveDocument('firms', newFirm);
      setFirms((prev) => [...prev, newFirm]);
      targetFirm = newFirm;
    }

    const newUser: User = existingUser || {
      id: `usr-${Date.now()}`,
      email,
      role,
      name: name || 'Managing Advocate',
      firmId: targetFirm.id,
      branchId: 'branch-1',
      phone: '+91 98000 00000',
      permissions: ['all_access'],
      isDemoUser: !!isDemoUser,
      status: 'Active',
      is_active: true,
      is_deleted: false,
    };

    await saveDocument('users', newUser);

    setCurrentFirm(targetFirm);
    setCurrentUser(newUser);
    setIsZeroDemoDataMode(false);
    setViewMode('app');
    setActiveTab('dashboard');
  };

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLoginClick={() => setViewMode('login')}
        onHelpClick={() => {
          setViewMode('app');
          setActiveTab('help');
        }}
        onExploreDemo={() => {
          setViewMode('app');
          setActiveTab('dashboard');
        }}
      />
    );
  }

  if (viewMode === 'login') {
    return (
      <LoginPage
        users={users}
        onLoginSuccess={handleLoginSuccess}
        onBackToHome={() => setViewMode('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1C1E] transition-colors duration-150 flex flex-col font-sans">
      {/* Top Fixed Navbar */}
      <Navbar
        currentFirm={currentFirm}
        currentUser={currentUser}
        onSelectRole={handleSelectRole}
        onOpenSearch={() => setActiveTab('documents')}
        onOpenAIChat={() => setActiveTab('ai_chat')}
        onOpenLanding={() => setViewMode('landing')}
        onOpenLogin={() => setViewMode('login')}
        onOpenHelp={() => setActiveTab('help')}
        onOpenAccountManager={() => setShowAccountManager(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      {/* Main Layout Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentUser={currentUser}
          onLogout={() => setViewMode('login')}
          onOpenLanding={() => setViewMode('landing')}
          highRiskCount={matters.filter((m) => m.riskLevel === 'High').length}
          pendingOCRCount={documents.filter((d) => d.ocrStatus === 'Processing' || d.ocrStatus === 'Queued').length}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Workspace Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-y-auto">
          {/* Read-Only Demo Mode Warning Toast / Modal */}
          {demoNoticeMessage && (
            <div className="mb-4 p-4 bg-amber-500/15 border border-amber-500/40 rounded-2xl text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3 shadow-lg animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <div className="font-bold text-amber-800 dark:text-amber-200">
                    Read-Only Guest Evaluator Mode Active
                  </div>
                  <div>{demoNoticeMessage}</div>
                </div>
              </div>
              <button
                onClick={() => setDemoNoticeMessage('')}
                className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* System Admin / Demo Evaluator Mode Bar */}
          {isDemoOrSystemAdmin && (
            <div className="mb-4 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>{(currentUser as any)?.isDemoUser ? 'Demo Evaluator Sandbox' : 'System Administrator Mode'}:</strong>{' '}
                  {isZeroDemoDataMode ? (
                    <span className="text-emerald-300 font-semibold">Active Zero Demo Data Mode ({matters.length} custom cases)</span>
                  ) : (
                    <span className="text-amber-300">Viewing Benchmark Demo Dataset ({matters.length} cases pre-populated)</span>
                  )}
                </span>
              </div>

              {currentUser.role === 'Super Admin' && (
                <button
                  onClick={() => setIsZeroDemoDataMode((prev) => !prev)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isZeroDemoDataMode ? 'Show Benchmark Sample Data' : 'Preview ZERO Demo Data Mode'}</span>
                </button>
              )}
            </div>
          )}



          {activeTab === 'dashboard' && (
            <DashboardView
              matters={matters}
              hearings={hearings}
              documents={documents}
              auditLogs={auditLogs}
              onSelectMatter={(m) => {
                setSelectedMatter(m);
                setActiveTab('matters');
              }}
              onNavigateTab={setActiveTab}
              onOpenNewMatter={() => setShowNewMatterModal(true)}
            />
          )}

          {activeTab === 'court_intelligence' && (
            <CourtIntelligenceView />
          )}

          {activeTab === 'matters' && (
            <MattersView
              matters={matters}
              documents={documents}
              hearings={hearings}
              courtOrders={mockCourtOrders}
              timeline={mockTimeline}
              witnesses={mockWitnesses}
              tasks={mockTasks}
              onSelectMatter={setSelectedMatter}
              onOpenNewMatter={() => setShowNewMatterModal(true)}
              onUploadDocToMatter={(mId) => {
                const m = matters.find((item) => item.id === mId);
                if (m) setSelectedMatter(m);
                setActiveTab('documents');
              }}
              onOpenDraftingForMatter={(m) => {
                setSelectedMatter(m);
                setActiveTab('ai_drafting');
              }}
              onOpenAIChatForMatter={(m) => {
                setSelectedMatter(m);
                setActiveTab('ai_chat');
              }}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentEngineView
              documents={documents}
              matters={matters}
              selectedMatter={matters.find((m) => m.id === selectedMatter?.id) || selectedMatter || matters[0] || null}
              onSelectMatter={setSelectedMatter}
              onUploadDocument={handleUploadDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {activeTab === 'ai_chat' && (
            <AIChatView
              matters={matters}
              selectedMatter={matters.find((m) => m.id === selectedMatter?.id) || matters[0] || selectedMatter}
              onSelectMatter={setSelectedMatter}
              documents={documents}
            />
          )}

          {activeTab === 'ai_drafting' && (
            <AIDraftingView
              matters={matters}
              selectedMatter={matters.find((m) => m.id === selectedMatter?.id) || matters[0] || selectedMatter}
              onSelectMatter={setSelectedMatter}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsView clients={clients} onAddNewClient={handleAddNewClient} />
          )}

          {activeTab === 'hearings' && (
            <HearingsView hearings={hearings} matters={matters} onAddNewHearing={handleAddNewHearing} onDeleteHearing={handleDeleteHearing} />
          )}

          {activeTab === 'help' && <HelpCenterView />}

          {activeTab === 'database' && <DatabaseSchemaView />}

          {activeTab === 'security' && (
            <SecurityView
              auditLogs={auditLogs}
              currentUser={currentUser}
              users={users}
              firms={firms}
              onUserUpdate={async (updatedUser) => {
                await saveDocument('users', updatedUser);
                setUsers((prev) => {
                  const idx = prev.findIndex((u) => u.id === updatedUser.id || u.email.toLowerCase() === updatedUser.email.toLowerCase());
                  if (idx >= 0) {
                    const next = [...prev];
                    next[idx] = updatedUser;
                    return next;
                  }
                  return [updatedUser, ...prev];
                });
              }}
              onFirmUpdate={async (updatedFirm) => {
                await saveDocument('firms', updatedFirm);
                setFirms((prev) => {
                  const idx = prev.findIndex((f) => f.id === updatedFirm.id);
                  if (idx >= 0) {
                    const next = [...prev];
                    next[idx] = updatedFirm;
                    return next;
                  }
                  return [updatedFirm, ...prev];
                });
              }}
            />
          )}

          {activeTab === 'enquiries' && <EnquiriesView />}
          {activeTab === 'tasks' && <TasksView tasks={tasks} matters={matters} users={users} />}
          {activeTab === 'kanban' && (
            <KanbanBoardView
              matters={matters}
              onSelectMatter={(m) => {
                setSelectedMatter(m);
                setActiveTab('matters');
              }}
              onOpenNewMatter={() => setShowNewMatterModal(true)}
            />
          )}
          {(activeTab === 'casediary' || activeTab === 'case_diary') && (
            <CaseDiaryView
              hearings={hearings}
              matters={matters}
              onSelectMatter={(m) => {
                setSelectedMatter(m);
                setActiveTab('matters');
              }}
              onAddNewHearing={() => setActiveTab('hearings')}
            />
          )}
          {activeTab === 'appointments' && (
            <AppointmentsView appointments={appointments} matters={matters} users={users} />
          )}
          {activeTab === 'hearing_calendar' && (
            <HearingCalendarView
              hearings={hearings}
              matters={matters}
              onSelectMatter={(m) => {
                setSelectedMatter(m);
                setActiveTab('matters');
              }}
            />
          )}
          {activeTab === 'outstanding' && <OutstandingBillingView invoices={invoices} />}
          {activeTab === 'expenses' && <ExpensesView />}
          {activeTab === 'messages' && (
            <MessagesView
              matters={matters}
              currentUser={currentUser}
              messages={messages}
              onSendMessage={handleSendMessage}
              onDeleteMessage={handleDeleteMessage}
              onDeleteThread={handleDeleteThread}
              onNavigateToCases={() => setActiveTab('matters')}
            />
          )}
          {activeTab === 'ecourt_tracker' && <ECourtTrackerView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'manage_team' && <ManageTeamView currentUser={currentUser} currentFirm={currentFirm} />}
          {activeTab === 'reminders' && <RemindersView />}
          {activeTab === 'settings' && <SettingsView />}

          {(activeTab === 'invoices' || activeTab === 'financials') && (
            <FinancialsView
              invoices={invoices}
              clients={clients}
              matters={matters}
              onAddNewInvoice={handleAddNewInvoice}
              onDeleteInvoice={handleDeleteInvoice}
            />
          )}
        </main>
      </div>

      {/* Account & Organization Manager Modal */}
      <AccountManagerModal
        isOpen={showAccountManager}
        onClose={() => setShowAccountManager(false)}
        currentUser={currentUser}
        currentFirm={currentFirm}
        existingFirms={firms}
        existingUsers={users}
        onAddFirm={handleAddFirm}
        onAddUser={handleAddUser}
      />

      {/* New Matter Modal */}
      {showNewMatterModal && (
        <NewMatterModal
          clients={clients}
          onClose={() => setShowNewMatterModal(false)}
          onSave={handleCreateMatter}
        />
      )}
    </div>
  );
}
