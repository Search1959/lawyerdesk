export type UserRole =
  | 'System Owner'
  | 'System Administrator'
  | 'Super Admin'
  | 'Demo User'
  | 'Law Firm'
  | 'Firm Admin'
  | 'Senior Advocate'
  | 'Senior Lawyer'
  | 'Associate Advocate'
  | 'Associate'
  | 'Junior Advocate'
  | 'Junior'
  | 'Accounts Staff'
  | 'Accounts'
  | 'Office Staff'
  | 'Staff'
  | 'Reception'
  | 'Client Portal User'
  | 'Client'
  | 'External Counsel';

export type UserStatus = 'Active' | 'Inactive' | 'Deleted' | 'Suspended' | 'Locked';

export interface LawFirm {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
  plan: 'Enterprise Unlimited' | 'Partner Suite' | 'Standard Firm';
  storageQuotaGB: number;
  storageUsedGB: number;
  branches: Branch[];
  departments: Department[];
  createdAt: string;
  updatedAt?: string;
  status?: 'Active' | 'Suspended' | 'Terminated';
  is_active?: boolean;
  is_deleted?: boolean;
  deleted_at?: string;
  deleted_by?: string;
}

export interface Branch {
  id: string;
  firmId: string;
  name: string;
  city: string;
  address: string;
  isHeadquarters: boolean;
}

export interface Department {
  id: string;
  name: string; // e.g., Commercial Litigation, Criminal Defence, Corporate & NCLT, Tax & GST
  code: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  firmId: string;
  branchId: string;
  departmentId?: string;
  avatarUrl?: string;
  phone: string;
  barCouncilRegNo?: string;
  permissions: string[];
  isDemoUser?: boolean;
  status?: UserStatus;
  is_active?: boolean;
  is_deleted?: boolean;
  deleted_at?: string;
  deleted_by?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  failedLoginAttempts?: number;
  lockoutUntil?: string;
  passwordExpired?: boolean;
  twoFactorEnabled?: boolean;
  clientId?: string; // For Client Portal Users
}

export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  firmId: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  browser: string;
  os: string;
  device: string;
  location?: string;
  status: 'Active' | 'Terminated' | 'Expired';
  tokenHash?: string;
}

export type AuditEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DEACTIVATED'
  | 'USER_DELETED'
  | 'PASSWORD_RESET'
  | 'ROLE_CHANGED'
  | 'PERMISSION_CHANGED'
  | 'FIRM_CREATED'
  | 'FIRM_SUSPENDED'
  | 'DOCUMENT_UPLOADED'
  | 'SESSION_TERMINATED';

export interface AuditLog {
  id: string;
  timestamp: string;
  eventType?: AuditEventType;
  performedBy?: string;
  performedByName?: string;
  userId?: string;
  userName?: string;
  userRole?: UserRole;
  action?: string;
  resource?: string;
  firmId?: string;
  targetUserId?: string;
  targetUserName?: string;
  ipAddress?: string;
  details: string;
  status?: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface ClientFamilyMember {
  id: string;
  name: string;
  relation: string; // Spouse, Partner, Director, Guarantor
  phone: string;
  email?: string;
}

export interface Client {
  id: string;
  firmId: string;
  name: string;
  type: 'Individual' | 'Corporate Entity' | 'HUF' | 'Partnership Firm';
  email: string;
  phone: string;
  panNumber: string;
  aadhaarNumber?: string;
  passportNumber?: string;
  companyRegistrationNumber?: string;
  gstin?: string;
  kycVerified: boolean;
  verifiedAt?: string;
  address: string;
  familyMembers?: ClientFamilyMember[];
  mattersCount: number;
  totalBilledINR: number;
  totalPaidINR: number;
  createdAt: string;
}

export type CourtType =
  | 'Supreme Court of India'
  | 'Delhi High Court'
  | 'Bombay High Court'
  | 'Calcutta High Court'
  | 'District Court'
  | 'NCLT (National Company Law Tribunal)'
  | 'DRT (Debts Recovery Tribunal)'
  | 'Consumer Disputes Commission'
  | 'Arbitration Tribunal'
  | 'Income Tax Appellate Tribunal';

export type CaseCategory =
  | 'Civil'
  | 'Criminal'
  | 'Family'
  | 'Consumer'
  | 'Company & Insolvency'
  | 'GST & Indirect Tax'
  | 'Income Tax'
  | 'Arbitration'
  | 'Property & Real Estate';

export interface Hearing {
  id: string;
  matterId: string;
  date: string;
  time: string;
  courtName: CourtType;
  courtHallNo: string;
  judgeName: string;
  stage: string; // Arguments, Evidence, Frame of Issues, Notice Returnable, Pronouncement
  synopsis: string;
  outcome?: string;
  nextHearingDate?: string;
  assignedLawyerId: string;
  assignedLawyerName: string;
}

export interface CourtOrder {
  id: string;
  matterId: string;
  orderDate: string;
  judgeName: string;
  type: 'Interim Order' | 'Final Judgment' | 'Bail Order' | 'Injunction' | 'Directions';
  summary: string;
  keyDirectives: string[];
  pdfDocumentId?: string;
}

export interface TimelineEvent {
  id: string;
  matterId: string;
  date: string;
  title: string;
  description: string;
  type: 'Pleading' | 'Evidence' | 'Court Order' | 'Hearing' | 'Notice' | 'Filing';
  docCitation?: string;
}

export interface Witness {
  id: string;
  matterId: string;
  name: string;
  role: 'Prosecution Witness' | 'Defence Witness' | 'Expert Witness' | 'Claimant Witness';
  statementSummary: string;
  crossExamStatus: 'Pending' | 'Drafted' | 'Completed';
}

export interface Matter {
  id: string;
  firmId: string;
  branchId: string;
  caseNumber: string; // e.g., CS(COMM) 420/2024
  title: string;
  category: CaseCategory;
  court: CourtType;
  judgeName: string;
  courtRoomNo: string;
  status: 'Active Litigation' | 'Pending Order' | 'Notice Stage' | 'Decreed' | 'Settled';
  clientId: string;
  clientName: string;
  opposingParty: string;
  opposingAdvocate: string;
  leadLawyerId: string;
  leadLawyerName: string;
  actsAndSections: string[]; // e.g., ['Section 138 NI Act', 'IPC Sec 420', 'IBC Sec 7']
  riskScore: number; // 0 - 100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  aiSummary: string;
  aiMissingDocuments: string[];
  aiStrategyNotes: string[];
  aiContradictions: string[];
  nextHearingDate: string;
  hearingsCount: number;
  documentsCount: number;
  createdAt: string;
  cnrNumber?: string;
  cnr?: string;
  courtSyncAt?: string;
  courtSyncStatus?: 'Synced' | 'CNR not found' | 'Error' | 'Pending';
  itemNumber?: string;
  caseStageEcourt?: string;
  petitionerName?: string;
  respondentName?: string;
}

export interface ECourtSyncLog {
  id: string;
  adminId: string;
  caseId: string;
  cnrNumber: string;
  syncedAt: string;
  status: 'success' | 'not_found' | 'error';
  nextHearing?: string;
  courtName?: string;
  caseStage?: string;
  petitioner?: string;
  respondent?: string;
  judgeName?: string;
  itemNumber?: string;
  errorMessage?: string;
}

export interface OCRMetadata {
  extractedActs: string[];
  extractedSections: string[];
  extractedJudges: string[];
  extractedDates: string[];
  extractedParties: string[];
  extractedCourt?: string;
  extractedAdvocates: string[];
  confidenceScore: number;
  ocrEngineUsed: 'PaddleOCR (Primary)' | 'Tesseract OCR (Fallback)' | 'Hybrid OCR';
  languageDetected: 'English' | 'Hindi (Devanagari)' | 'Bengali' | 'Multilingual';
}

export interface TextChunk {
  id: string;
  documentId: string;
  pageNumber: number;
  paragraphNumber: number;
  text: string;
  embeddingVectorSample?: number[];
}

export interface DocumentFolder {
  id: string;
  matterId?: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  matterId: string;
  matterTitle: string;
  fileName: string;
  fileSize: string;
  fileType: 'PDF' | 'Scanned PDF' | 'DOCX' | 'XLSX' | 'JPEG' | 'ZIP' | 'EMAIL';
  category: 'Petition' | 'Written Statement' | 'Affidavit' | 'Evidence Annexure' | 'Court Order' | 'FIR / Charge Sheet' | 'Notice';
  uploadedBy: string;
  uploadedAt: string;
  ocrStatus: 'Completed' | 'Processing' | 'Queued';
  pageCount: number;
  ocrText: string;
  chunks: TextChunk[];
  metadata: OCRMetadata;
  folderId?: string;
  folderName?: string;
}

export interface Task {
  id: string;
  matterId: string;
  matterTitle: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  assignedTo: string;
  completed: boolean;
}

export interface Citation {
  documentId: string;
  documentName: string;
  pageNumber: number;
  paragraphNumber: number;
  date: string;
  excerpt: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citations?: Citation[];
  timestamp: string;
  groundedInCase: boolean;
  isThinking?: boolean;
}

export interface LegalDraftRequest {
  matterId: string;
  draftType:
    | 'Written Arguments'
    | 'Synopsis & List of Dates'
    | 'Appeal Draft'
    | 'Reply to Interim Application'
    | 'Affidavit in Evidence'
    | 'Legal Notice'
    | 'Client Update Letter'
    | 'Bail Application';
  specificInstructions?: string;
  targetCourt?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  matterId: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  subtotalINR: number;
  gstINR: number;
  totalINR: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  feeType: 'Appearance Fee' | 'Retainer' | 'Drafting Fee' | 'Success Commission';
  items: { description: string; amountINR: number }[];
}

export type NavTab =
  | 'dashboard'
  | 'court_intelligence'
  | 'enquiries'
  | 'tasks'
  | 'clients'
  | 'matters'
  | 'kanban'
  | 'casediary'
  | 'case_diary'
  | 'appointments'
  | 'hearing_calendar'
  | 'hearings'
  | 'invoices'
  | 'financials'
  | 'outstanding'
  | 'expenses'
  | 'messages'
  | 'ecourt_tracker'
  | 'documents'
  | 'reports'
  | 'ai_chat'
  | 'ai_drafting'
  | 'manage_team'
  | 'reminders'
  | 'settings'
  | 'database'
  | 'security'
  | 'help';

export interface CourtDirectoryProfile {
  id: string;
  name: string;
  category: 'Supreme Court' | 'High Court' | 'District Court' | 'Family Court' | 'Commercial Court' | 'Consumer Commission' | 'Labour Court' | 'MACT' | 'CBI Court' | 'Fast Track' | 'Juvenile' | 'Tribunal (NCLT/DRT/CAT/NGT/RERA/ITAT/GST)';
  state: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  jurisdiction: string;
  contactPhones: string[];
  email: string;
  website: string;
  timings: string;
  workingDays: string;
  holidayCalendarUrl: string;
  totalJudges: number;
  courtRoomsCount: number;
  activeBenches: string[];
  causeListUrl: string;
  filingProcedureSummary: string;
  availableForms: { name: string; url: string; category: string }[];
  importantNotifications: { title: string; date: string; isUrgent?: boolean }[];
}

export interface JudgeDirectoryProfile {
  id: string;
  name: string;
  designation: string;
  courtName: string;
  benchType: 'Single Bench' | 'Division Bench' | 'Full Bench' | 'Constitution Bench';
  courtRoomNo: string;
  currentAssignment: string;
  appointedDate: string;
  retirementDate: string;
  notableJudgments: { citation: string; title: string; date: string; subject: string }[];
  upcomingCauseListCount: number;
  transferHistory: { previousCourt: string; tenure: string }[];
}

export interface CauseListItem {
  id: string;
  date: string;
  courtName: string;
  judgeName: string;
  courtRoomNo: string;
  itemNo: number;
  caseNumber: string;
  cnrNumber: string;
  matterTitle: string;
  parties: string;
  petitionerAdvocate: string;
  respondentAdvocate: string;
  stage: string;
  priority: 'Urgent' | 'High' | 'Regular';
  estimatedTime: string;
  prepStatus: 'Ready' | 'Draft Pending' | 'Senior Briefed' | 'Witness Pending';
  clientName: string;
  assignedLawyer: string;
}

export interface AIHearingBrief {
  matterId: string;
  caseNumber: string;
  caseSummary: string;
  lastHearingSummary: string;
  lastOrderSummary: string;
  pendingDocuments: string[];
  pendingEvidence: string[];
  missingDocuments: string[];
  questionsToAsk: string[];
  likelyObjections: string[];
  suggestedStrategy: string;
  recentJudgments: { citation: string; ratio: string }[];
  relevantSections: string[];
  keyDates: { label: string; date: string }[];
  riskIndicators: { level: 'Low' | 'Medium' | 'High' | 'Critical'; note: string }[];
}

export interface CaseHealthScoreData {
  matterId: string;
  caseNumber: string;
  score: number; // e.g. 92%
  clientDetailsComplete: boolean;
  evidenceComplete: boolean;
  witnessReady: boolean;
  crossExamReady: boolean;
  documentsUploaded: boolean;
  feesPaid: boolean;
  timelineUpdated: boolean;
  limitationSafe: boolean;
  missingTasksCount: number;
  missingEvidenceCount: number;
  missingDocumentsCount: number;
  aiRecommendations: string[];
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: 'Client' | 'Matter' | 'Court' | 'Judge' | 'Document' | 'Order' | 'Evidence' | 'Witness' | 'Hearing' | 'Timeline' | 'Act' | 'Section' | 'LawyerNotes' | 'AIMemory';
  details?: string;
}

export interface KnowledgeGraphLink {
  source: string;
  target: string;
  label: string;
}

export interface Enquiry {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  category: CaseCategory;
  subject: string;
  source: 'Website Lead' | 'Client Referral' | 'High Court Chamber' | 'Phone Enquiry';
  consultFeeINR: number;
  status: 'New Lead' | 'Consultation Fixed' | 'Converted to Matter' | 'Declined';
  date: string;
  notes: string;
}

export interface Appointment {
  id: string;
  firmId?: string;
  clientName: string;
  matterTitle?: string;
  lawyerName: string;
  date: string;
  time: string;
  mode: 'Chamber Meeting' | 'High Court Canteen Briefing' | 'Video Call (Google Meet)' | 'Client Office Visit';
  purpose: string;
  status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
}

export interface Expense {
  id: string;
  matterId: string;
  matterTitle: string;
  category: 'Court Fee Stamp' | 'Process Server Fee' | 'Senior Counsel Clerkage' | 'Certified Copy Charges' | 'Travel & Out of Pocket';
  description: string;
  amountINR: number;
  spentBy: string;
  date: string;
  status: 'Billed to Client' | 'Pending Reimbursable' | 'Waived';
}

export interface Message {
  id: string;
  matterId?: string;
  matterTitle?: string;
  senderName: string;
  senderRole: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isClientMessage: boolean;
  unread: boolean;
}

export interface ECourtCase {
  id: string;
  cnrNumber: string;
  courtName: string;
  caseTypeAndNo: string;
  petitioner: string;
  respondent: string;
  nextHearingDate: string;
  stage: string;
  lastOrderDate: string;
  lastOrderSummary: string;
  syncStatus: 'Live Synced' | 'Syncing' | 'Update Available';
  lastSyncedAt: string;
}

export interface Reminder {
  id: string;
  matterId?: string;
  matterTitle?: string;
  title: string;
  type: 'Limitation Period' | 'Order Compliance' | 'Evidence Filing' | 'Court Fee Deposit';
  dueDate: string;
  daysRemaining: number;
  priority: 'Critical' | 'High' | 'Medium';
  status: 'Pending' | 'Completed' | 'Dismissed';
}

export interface TeamMember {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  email: string;
  phone: string;
  barCouncilNo?: string;
  activeCasesCount: number;
  monthlyBillableHours: number;
  hourlyRateINR: number;
  status: 'Active' | 'On Leave' | 'In Court';
}
