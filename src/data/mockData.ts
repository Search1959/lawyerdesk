import {
  LawFirm,
  User,
  Client,
  Matter,
  Document,
  Hearing,
  CourtOrder,
  TimelineEvent,
  Witness,
  Task,
  Invoice,
  AuditLog,
  Enquiry,
  Appointment,
  Expense,
  Message,
  ECourtCase,
  Reminder,
  TeamMember,
} from '../types';

export const mockFirms: LawFirm[] = [
  {
    id: 'firm-1',
    name: 'M/s Shardul & Legal Associates Advocates',
    code: 'SLA-DEL',
    plan: 'Enterprise Unlimited',
    storageQuotaGB: 500,
    storageUsedGB: 142.8,
    branches: [
      {
        id: 'branch-1',
        firmId: 'firm-1',
        name: 'Delhi High Court Chambers & Corporate Office',
        city: 'New Delhi',
        address: 'Chamber 412, Lawyers Block, Delhi High Court, New Delhi - 110003',
        isHeadquarters: true,
      },
      {
        id: 'branch-2',
        firmId: 'firm-1',
        name: 'Mumbai NCLT & High Court Wing',
        city: 'Mumbai',
        address: 'Suite 804, Nariman Point, Mumbai - 400021',
        isHeadquarters: false,
      },
      {
        id: 'branch-3',
        firmId: 'firm-1',
        name: 'Bengaluru Tech & Arbitration Bench',
        city: 'Bengaluru',
        address: 'Level 5, UB City Towers, MG Road, Bengaluru - 560001',
        isHeadquarters: false,
      },
    ],
    departments: [
      { id: 'dept-1', name: 'Commercial & Corporate Litigation', code: 'COMM-LIT' },
      { id: 'dept-2', name: 'Criminal Defence & White Collar Crime', code: 'CRIM-DEF' },
      { id: 'dept-3', name: 'Insolvency, Bankruptcy & NCLT', code: 'NCLT-IBC' },
      { id: 'dept-4', name: 'Taxation & Indirect GST Bench', code: 'TAX-GST' },
      { id: 'dept-5', name: 'Arbitration & Alternate Dispute Resolution', code: 'ADR-ARB' },
    ],
    createdAt: '2021-01-15',
  },
];

export const mockUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Adv. Rajeshwar V. Sharma',
    email: 'rvsharma@shardul-legal.in',
    role: 'Senior Lawyer',
    firmId: 'firm-1',
    branchId: 'branch-1',
    departmentId: 'dept-1',
    phone: '+91 98110 44321',
    barCouncilRegNo: 'D/1428/2002',
    permissions: ['all_access', 'matter_manage', 'ai_copilot', 'drafting', 'billing_view'],
  },
  {
    id: 'usr-2',
    name: 'Adv. Ananya Roy',
    email: 'ananya.roy@shardul-legal.in',
    role: 'Firm Admin',
    firmId: 'firm-1',
    branchId: 'branch-1',
    departmentId: 'dept-3',
    phone: '+91 98201 88765',
    barCouncilRegNo: 'D/2104/2012',
    permissions: ['all_access', 'firm_manage', 'user_manage', 'matter_manage'],
  },
  {
    id: 'usr-3',
    name: 'Adv. Vikramaditya Singh',
    email: 'vikram.singh@shardul-legal.in',
    role: 'Associate',
    firmId: 'firm-1',
    branchId: 'branch-1',
    departmentId: 'dept-2',
    phone: '+91 97112 33456',
    barCouncilRegNo: 'D/3491/2018',
    permissions: ['matter_read', 'matter_write', 'ai_copilot', 'drafting'],
  },
  {
    id: 'usr-4',
    name: 'Siddharth Varma',
    email: 'siddharth.varma@apexinfra.com',
    role: 'Client',
    firmId: 'firm-1',
    branchId: 'branch-1',
    phone: '+91 98765 11223',
    permissions: ['portal_access', 'view_my_matters', 'view_invoices'],
  },
];

export const mockClients: Client[] = [
  {
    id: 'client-1',
    firmId: 'firm-1',
    name: 'M/s Apex Infrastructure & Developers Pvt Ltd',
    type: 'Corporate Entity',
    email: 'legal@apexinfra.com',
    phone: '+91 11 4123 9900',
    panNumber: 'AAAC1234F',
    companyRegistrationNumber: 'U45201DL2010PTC204918',
    gstin: '07AAAC1234F1Z2',
    kycVerified: true,
    address: 'Apex Tower, Plot No. 14, Jasola District Centre, New Delhi - 110025',
    mattersCount: 3,
    totalBilledINR: 1450000,
    totalPaidINR: 1200000,
    createdAt: '2023-02-10',
    familyMembers: [
      { id: 'fm-1', name: 'Siddharth Varma', relation: 'Managing Director', phone: '+91 98765 11223' },
      { id: 'fm-2', name: 'Ritu Varma', relation: 'Executive Director', phone: '+91 98765 11224' },
    ],
  },
  {
    id: 'client-2',
    firmId: 'firm-1',
    name: 'Dr. Ramesh K. Malhotra',
    type: 'Individual',
    email: 'dr.malhotra@healthplus.org',
    phone: '+91 98101 22334',
    panNumber: 'BPLPM8821K',
    aadhaarNumber: 'XXXX-XXXX-8912',
    passportNumber: 'Z3918204',
    kycVerified: true,
    address: 'C-4/88, Safdarjung Development Area, New Delhi - 110016',
    mattersCount: 2,
    totalBilledINR: 650000,
    totalPaidINR: 650000,
    createdAt: '2023-08-18',
  },
  {
    id: 'client-3',
    firmId: 'firm-1',
    name: 'Puri Overseas Logistics Ltd',
    type: 'Corporate Entity',
    email: 'counsel@purilogistics.in',
    phone: '+91 22 2839 1000',
    panNumber: 'AABCP9918E',
    companyRegistrationNumber: 'L63090MH1998PLC114210',
    gstin: '27AABCP9918E1ZQ',
    kycVerified: true,
    address: 'Puri House, Marol Naka, Andheri East, Mumbai - 400059',
    mattersCount: 1,
    totalBilledINR: 880000,
    totalPaidINR: 500000,
    createdAt: '2024-01-05',
  },
];

export const mockMatters: Matter[] = [
  {
    id: 'matter-1',
    firmId: 'firm-1',
    branchId: 'branch-1',
    caseNumber: 'CS(COMM) 420/2024',
    title: 'M/s Apex Infrastructure Ltd v. Union of India & Anr',
    category: 'Civil',
    court: 'Delhi High Court',
    judgeName: 'Hon’ble Mr. Justice Sanjeev Narula',
    courtRoomNo: 'Court Room No. 24',
    status: 'Active Litigation',
    clientId: 'client-1',
    clientName: 'M/s Apex Infrastructure & Developers Pvt Ltd',
    opposingParty: 'Union of India (Ministry of Road Transport & Highways)',
    opposingAdvocate: 'Adv. Chetan Sharma (Additional Solicitor General)',
    leadLawyerId: 'usr-1',
    leadLawyerName: 'Adv. Rajeshwar V. Sharma',
    actsAndSections: ['Commercial Courts Act Sec 12A', 'Arbitration & Conciliation Act Sec 9', 'Indian Contract Act Sec 73'],
    riskScore: 32,
    riskLevel: 'Low',
    aiSummary:
      'Commercial suit seeking mandatory injunction and recovery of Rs. 24.8 Crores against Ministry for wrongful invocation of Bank Guarantee under EPC Highway Contract. Strong prima facie balance of convenience based on Clause 14.3 extension agreement.',
    aiMissingDocuments: [
      'Original Performance Bank Guarantee Confirmation Letter from SBI Jasola Branch',
      'Joint Inspection Report dated 14th November 2023 signed by Project Director NHAI',
    ],
    aiStrategyNotes: [
      'Focus arguments on non-fulfillment of prerequisite condition under Clause 18.2 (30-day cure period notice).',
      'Rely on Delhi HC precedent in *BSES Rajdhani v. DDA (2022)* prohibiting fraud and irretrievable injury invocation.',
      'Prepare cross-examination questions for NHAI Chief Engineer regarding delay attributable to land acquisition in Sector 88.',
    ],
    aiContradictions: [
      'Letter dated 10-Oct-2023 from NHAI claims site was handed over 100%, whereas Site Inspection Diary Page 41 records ongoing encroachments till Dec 2023.',
    ],
    nextHearingDate: '2026-08-04',
    hearingsCount: 8,
    documentsCount: 6,
    createdAt: '2024-03-12',
  },
  {
    id: 'matter-2',
    firmId: 'firm-1',
    branchId: 'branch-1',
    caseNumber: 'CRA-S-1092/2023',
    title: 'State (NCT of Delhi) v. Dr. Ramesh K. Malhotra',
    category: 'Criminal',
    court: 'District Court',
    judgeName: 'Hon’ble Ms. Neelam Singh (Special Judge, CBI / PC Act)',
    courtRoomNo: 'Court Room No. 308, Saket Courts',
    status: 'Active Litigation',
    clientId: 'client-2',
    clientName: 'Dr. Ramesh K. Malhotra',
    opposingParty: 'State through CBI / Special Public Prosecutor',
    opposingAdvocate: 'Adv. K.S. Negi (SPP CBI)',
    leadLawyerId: 'usr-3',
    leadLawyerName: 'Adv. Vikramaditya Singh',
    actsAndSections: ['IPC Section 420 (Cheating)', 'IPC Section 120B (Criminal Conspiracy)', 'Prevention of Corruption Act Sec 13(1)(d)'],
    riskScore: 68,
    riskLevel: 'High',
    aiSummary:
      'Alleged irregularity in procurement of medical diagnostic equipment for Super Specialty Hospital. Defence premise rests on complete compliance with Central Vigilance Commission (CVC) tender guidelines and absence of pecuniary gain.',
    aiMissingDocuments: [
      'Certified Copy of Board Approval Minutes dated 12-May-2021',
      'Original Audit clearance certificate issued by Controller & Auditor General (CAG)',
    ],
    aiStrategyNotes: [
      'Highlight absence of any recovery or monetary trail connecting accused to vendor M/s BioTech Solutions.',
      'File Section 207 CrPC application demanding un-relied documents seized during raid.',
    ],
    aiContradictions: [
      'Prosecution witness PW-2 statement under Sec 161 CrPC conflicts with his own internal sanction note dated 04-Jun-2021.',
    ],
    nextHearingDate: '2026-08-12',
    hearingsCount: 14,
    documentsCount: 9,
    createdAt: '2023-09-10',
  },
  {
    id: 'matter-3',
    firmId: 'firm-1',
    branchId: 'branch-2',
    caseNumber: 'CP (IB) No. 891/MB/2024',
    title: 'Puri Overseas Logistics Ltd v. Apex Global Freight Carriers Pvt Ltd',
    category: 'Company & Insolvency',
    court: 'NCLT (National Company Law Tribunal)',
    judgeName: 'Hon’ble Shri Kuldip Kumar Kareer (Member Judicial)',
    courtRoomNo: 'Court Room No. 1, NCLT Mumbai Bench',
    status: 'Notice Stage',
    clientId: 'client-3',
    clientName: 'Puri Overseas Logistics Ltd',
    opposingParty: 'Apex Global Freight Carriers Pvt Ltd',
    opposingAdvocate: 'Adv. Mahesh Jethmalani & Associates',
    leadLawyerId: 'usr-2',
    leadLawyerName: 'Adv. Ananya Roy',
    actsAndSections: ['Insolvency and Bankruptcy Code (IBC) Section 9', 'Insolvency and Bankruptcy Rules Rule 6'],
    riskScore: 25,
    riskLevel: 'Low',
    aiSummary:
      'Section 9 IBC petition filed by Operational Creditor for default in payment of freight invoices amounting to Rs. 4.12 Crores. Pre-existing dispute raised by Corporate Debtor is unsubstantiated.',
    aiMissingDocuments: [
      'NeSL Information Utility Default Certificate',
      'Bank Certificate under Sec 9(3)(c) of IBC from HDFC Bank Fort Branch',
    ],
    aiStrategyNotes: [
      'Establish that email reply dated 18-Jan-2024 contains an explicit admission of debt by Corporate Debtor Finance Director.',
      'Demolish alleged quality dispute as a sham post-notice afterthought.',
    ],
    aiContradictions: [],
    nextHearingDate: '2026-08-20',
    hearingsCount: 3,
    documentsCount: 4,
    createdAt: '2024-02-18',
  },
  {
    id: 'matter-4',
    firmId: 'firm-1',
    branchId: 'branch-1',
    caseNumber: 'Title Suit No. 87/2024',
    title: 'Belghoria Property Dispute (Jaiswal Family Partition Suit)',
    category: 'Civil',
    court: 'District Court',
    judgeName: 'Hon’ble Ld. 3rd Civil Judge (Sr. Divn), Barasat',
    courtRoomNo: 'Court Room No. 3',
    status: 'Active Litigation',
    clientId: 'client-2',
    clientName: 'Shri Sohanlal Jaiswal (Plaintiff)',
    opposingParty: 'Prem Chand, Dinesh Kumar, Rajendra Kumar & 18 Ors (21 Defendants)',
    opposingAdvocate: 'Adv. S.P. Saxena',
    leadLawyerId: 'usr-1',
    leadLawyerName: 'Adv. Rajeshwar V. Sharma',
    actsAndSections: ['Partition Act 1893', 'CPC Order 39 Rule 1 & 2', 'Hindu Succession Act Sec 6', 'West Bengal Land Reforms Act'],
    riskScore: 42,
    riskLevel: 'Medium',
    aiSummary:
      'Title Suit No. 87/2024 for partition of 3.32 acres (~212.4 Kattah) ancestral property in Mouza Ariadaha Kamarhati, PS Belghoria across 4 Schedules (A, B, C, D) valued at Rs. 35.04 Crores. Plaintiff Sohanlal Jaiswal holds consolidated 4/18 (2/9) share valued at Rs. 7.42 Crores.',
    aiMissingDocuments: [
      'Certified Copy of Deed No. 2480/1960 (Umrai Debi Purchase Deed)',
      'Certified Copy of Gift Deed Vol 1526-2022 registered at ADSR Belghoria',
    ],
    aiStrategyNotes: [
      'File application under CPC Order 39 Rule 1 & 2 for ad-interim injunction restraining 21 defendants from alienating or altering Belghoria property.',
      'Seek appointment of Survey Commissioner for physical measurement and partition by metes and bounds.',
    ],
    aiContradictions: [
      'Defendants refused amicable partition on 27 July 2024 despite Plaintiff acquiring undivided shares via registered Gift Deed Vol 1526-2022.',
    ],
    nextHearingDate: '2026-08-28',
    hearingsCount: 5,
    documentsCount: 2,
    createdAt: '2024-07-28',
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    matterId: 'matter-1',
    matterTitle: 'M/s Apex Infrastructure Ltd v. Union of India & Anr',
    fileName: 'Plaint_Commercial_Suit_Apex_v_UOI_Signed.pdf',
    fileSize: '4.8 MB',
    fileType: 'PDF',
    category: 'Petition',
    uploadedBy: 'Adv. Rajeshwar V. Sharma',
    uploadedAt: '2024-03-12 11:30 AM',
    ocrStatus: 'Completed',
    pageCount: 42,
    ocrText: `IN THE HIGH COURT OF DELHI AT NEW DELHI
COMMERCIAL DIVISION
CS (COMM) NO. 420 OF 2024

IN THE MATTER OF:
M/S APEX INFRASTRUCTURE & DEVELOPERS PVT LTD ...PLAINTIFF
VERSUS
UNION OF INDIA & ANR ...DEFENDANTS

PLAINT UNDER ORDER VII RULE 1 READ WITH SECTION 151 OF CODE OF CIVIL PROCEDURE, 1908 AND SECTION 6 OF COMMERCIAL COURTS ACT, 2015

MOST RESPECTFULLY SHOWETH:
1. That the Plaintiff is a duly incorporated company carrying on civil infrastructure projects across India.
2. The Defendant No. 1 is the Ministry of Road Transport & Highways, Government of India.
3. On 14th January 2021, Defendant issued Tender No. NHAI/EPC/2021/88 for four-laning of Expressway Segment KM 14 to KM 48.
4. Clause 14.3 of the EPC Contract stipulates that if delay in site handover exceeds 90 days, the contractor shall be entitled to extension of time and financial compensation without penalty.
5. Despite repeated communications dated 12-May-2022, 18-Aug-2022, and 10-Oct-2023, Defendant failed to clear environmental obstructions and land acquisition encumbrances in Sector 88.
6. Suddenly on 02-March-2024, Defendant illegally issued Notice for Invocation of SBI Bank Guarantee No. 00391BG210088 for Rs. 24,80,00,000/- (Rupees Twenty Four Crores Eighty Lakhs Only).
7. PRAYER: It is humbly prayed that this Hon'ble Court be pleased to issue a Decree of Permanent Injunction restraining Defendants from encashing the Bank Guarantee and pass consequential damages.`,
    chunks: [
      {
        id: 'chk-1',
        documentId: 'doc-1',
        pageNumber: 3,
        paragraphNumber: 4,
        text: 'Clause 14.3 of the EPC Contract stipulates that if delay in site handover exceeds 90 days, the contractor shall be entitled to extension of time and financial compensation without penalty.',
      },
      {
        id: 'chk-2',
        documentId: 'doc-1',
        pageNumber: 6,
        paragraphNumber: 6,
        text: 'Suddenly on 02-March-2024, Defendant illegally issued Notice for Invocation of SBI Bank Guarantee No. 00391BG210088 for Rs. 24,80,00,000/- (Rupees Twenty Four Crores Eighty Lakhs Only).',
      },
    ],
    metadata: {
      extractedActs: ['Commercial Courts Act 2015', 'Code of Civil Procedure 1908', 'Indian Contract Act 1872'],
      extractedSections: ['Order VII Rule 1 CPC', 'Section 6 Commercial Courts Act', 'Section 73 Contract Act'],
      extractedJudges: ['Hon’ble Mr. Justice Sanjeev Narula'],
      extractedDates: ['14-01-2021', '12-05-2022', '18-08-2022', '10-10-2023', '02-03-2024'],
      extractedParties: ['M/s Apex Infrastructure & Developers Pvt Ltd', 'Union of India', 'National Highways Authority of India'],
      extractedCourt: 'Delhi High Court',
      extractedAdvocates: ['Adv. Rajeshwar V. Sharma', 'Adv. Chetan Sharma ASG'],
      confidenceScore: 99.4,
      ocrEngineUsed: 'PaddleOCR (Primary)',
      languageDetected: 'English',
    },
  },
  {
    id: 'doc-2',
    matterId: 'matter-1',
    matterTitle: 'M/s Apex Infrastructure Ltd v. Union of India & Anr',
    fileName: 'Scanned_NHAI_Site_Handover_Diary_Scanned_OCR.pdf',
    fileSize: '12.4 MB',
    fileType: 'Scanned PDF',
    category: 'Evidence Annexure',
    uploadedBy: 'Adv. Vikramaditya Singh',
    uploadedAt: '2024-03-14 04:15 PM',
    ocrStatus: 'Completed',
    pageCount: 18,
    ocrText: `SITE INSPECTION REGISTER & FIELD DIARY - SECTOR 88 HIGHWAY PROJECT
DATE OF ENTRY: 14th NOVEMBER 2023
INSPECTING OFFICER: Er. A.K. Tiwari, Executive Engineer, NHAI

Observations:
1. High Tension Electrical lines between Ch. 22+400 to 26+800 are still awaiting DISCOM shut down clearance.
2. Local farmers protest ongoing regarding un-disbursed compensation under Land Acquisition Act. Site access restricted.
3. Total physical unencumbered land available to contractor as of today is approximately 64% against requirement of 100%.
4. Note: Contractor M/s Apex Infra has mobilized 42 heavy earthmovers which are sitting idle due to un-acquired patches.`,
    chunks: [
      {
        id: 'chk-3',
        documentId: 'doc-2',
        pageNumber: 4,
        paragraphNumber: 3,
        text: 'Total physical unencumbered land available to contractor as of today (14-Nov-2023) is approximately 64% against requirement of 100%. Contractor M/s Apex Infra has mobilized 42 heavy earthmovers sitting idle.',
      },
    ],
    metadata: {
      extractedActs: ['Land Acquisition Act 2013'],
      extractedSections: ['Section 24 RFCTLARR Act'],
      extractedJudges: [],
      extractedDates: ['14-11-2023'],
      extractedParties: ['Executive Engineer NHAI Er. A.K. Tiwari', 'M/s Apex Infra'],
      extractedCourt: 'NHAI Regional Office',
      extractedAdvocates: [],
      confidenceScore: 96.2,
      ocrEngineUsed: 'PaddleOCR (Primary)',
      languageDetected: 'English',
    },
  },
  {
    id: 'doc-3',
    matterId: 'matter-2',
    matterTitle: 'State (NCT of Delhi) v. Dr. Ramesh K. Malhotra',
    fileName: 'FIR_CBI_RC_0042021A0012_Scanned.pdf',
    fileSize: '2.1 MB',
    fileType: 'Scanned PDF',
    category: 'FIR / Charge Sheet',
    uploadedBy: 'Adv. Vikramaditya Singh',
    uploadedAt: '2023-09-12 10:00 AM',
    ocrStatus: 'Completed',
    pageCount: 12,
    ocrText: `FIRST INFORMATION REPORT
(Under Section 154 Cr.P.C.)
CBI / ACB / NEW DELHI
RC NO.: RC-220/2021/E0004
DATE: 04.06.2021

1. District: New Delhi, Police Station: CBI/ACB
2. Acts & Sections:
   (i) IPC 1860 - Section 420 (Cheating)
   (ii) IPC 1860 - Section 120B (Criminal Conspiracy)
   (iii) PC Act 1988 - Section 13(2) r/w 13(1)(d)
3. Complainant / Informant: Shri V.K. Aggarwal, Chief Vigilance Officer
4. Details of Accused:
   1. Dr. Ramesh K. Malhotra, Medical Superintendent, Super Specialty Hospital
   2. M/s BioTech Solutions Ltd through Director Suresh Nanda
5. Brief Allegations: Source information revealed that during 2020-2021, accused Dr. Ramesh K. Malhotra entered into a criminal conspiracy with M/s BioTech Solutions to award tender for 5 CT Scan machines at inflated rates of Rs. 4.2 Crores per unit against market price of Rs. 2.8 Crores, causing pecuniary loss to public exchequer.`,
    chunks: [
      {
        id: 'chk-4',
        documentId: 'doc-3',
        pageNumber: 2,
        paragraphNumber: 5,
        text: 'Allegations against Dr. Ramesh K. Malhotra involve criminal conspiracy under IPC 120B and 420 for alleged inflated procurement of 5 CT Scan machines at Rs 4.2 Cr each from M/s BioTech Solutions.',
      },
    ],
    metadata: {
      extractedActs: ['Indian Penal Code 1860', 'Prevention of Corruption Act 1988', 'Code of Criminal Procedure 1973'],
      extractedSections: ['IPC Section 420', 'IPC Section 120B', 'PC Act Section 13(1)(d)', 'CrPC Section 154'],
      extractedJudges: [],
      extractedDates: ['04-06-2021'],
      extractedParties: ['Dr. Ramesh K. Malhotra', 'CBI ACB New Delhi', 'M/s BioTech Solutions Ltd'],
      extractedCourt: 'Special CBI Court Saket',
      extractedAdvocates: ['Adv. K.S. Negi SPP'],
      confidenceScore: 98.1,
      ocrEngineUsed: 'PaddleOCR (Primary)',
      languageDetected: 'English',
    },
  },
  {
    id: 'doc-4',
    matterId: 'matter-3',
    matterTitle: 'Puri Overseas Logistics Ltd v. Apex Global Freight Carriers Pvt Ltd',
    fileName: 'IBC_Sec9_Demand_Notice_and_Invoices.pdf',
    fileSize: '6.2 MB',
    fileType: 'PDF',
    category: 'Notice',
    uploadedBy: 'Adv. Ananya Roy',
    uploadedAt: '2024-02-20 02:30 PM',
    ocrStatus: 'Completed',
    pageCount: 26,
    ocrText: `FORM 3
DEMAND NOTICE ATTACHING INVOICES
(Under Rule 5 of Insolvency and Bankruptcy (Application to Adjudicating Authority) Rules, 2016)

DATE: 12th January 2024
TO: Apex Global Freight Carriers Pvt Ltd, Nariman Point, Mumbai.
FROM: Puri Overseas Logistics Ltd, Andheri East, Mumbai.

SUBJECT: Demand Notice for unpaid operational debt of Rs. 4,12,45,000/- (Rupees Four Crores Twelve Lakhs Forty Five Thousand Only).

Details of Unpaid Freight Invoices:
1. Invoice No. POL/23-24/0891 dated 14-Aug-2023 - Rs. 1,10,00,000/-
2. Invoice No. POL/23-24/1042 dated 20-Sep-2023 - Rs. 1,52,00,000/-
3. Invoice No. POL/23-24/1210 dated 05-Nov-2023 - Rs. 1,50,45,000/-

Total Default Amount: Rs. 4,12,45,000/-
Default Date: 05th December 2023 (Expiry of 30-day credit period).

Take notice that if you fail to pay within 10 days or fail to prove pre-existing dispute, Section 9 IBC proceedings shall be instituted before NCLT Mumbai Bench.`,
    chunks: [
      {
        id: 'chk-5',
        documentId: 'doc-4',
        pageNumber: 1,
        paragraphNumber: 3,
        text: 'Section 9 IBC Demand Notice issued on 12-Jan-2024 for unpaid freight invoices totaling Rs. 4,12,45,000/- with date of default 05-Dec-2023.',
      },
    ],
    metadata: {
      extractedActs: ['Insolvency and Bankruptcy Code 2016'],
      extractedSections: ['Section 8 IBC', 'Section 9 IBC', 'Rule 5 IBC Rules'],
      extractedJudges: [],
      extractedDates: ['12-01-2024', '14-08-2023', '20-09-2023', '05-11-2023', '05-12-2023'],
      extractedParties: ['Puri Overseas Logistics Ltd', 'Apex Global Freight Carriers Pvt Ltd'],
      extractedCourt: 'NCLT Mumbai Bench',
      extractedAdvocates: ['Adv. Ananya Roy'],
      confidenceScore: 99.8,
      ocrEngineUsed: 'PaddleOCR (Primary)',
      languageDetected: 'English',
    },
  },
  {
    id: 'doc-5',
    matterId: 'matter-4',
    matterTitle: 'Belghoria Property Dispute (Jaiswal Family Partition Suit)',
    fileName: 'belghoria-property-detail.pdf',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    category: 'Evidence Annexure',
    uploadedBy: 'Adv. Rajeshwar V. Sharma',
    uploadedAt: '2024-07-28 11:30 AM',
    ocrStatus: 'Completed',
    pageCount: 14,
    ocrText: `[PADDLEOCR EXTRACTED FULL TEXT - CASE BRIEF & SCHEDULES]
TITLE SUIT NO. 87/2024
IN THE COURT OF LD. 3RD CIVIL JUDGE (SR. DIVN), BARASAT, DISTRICT NORTH 24 PARGANAS
FILED: JULY 2024

SUIT TITLE: Jaiswal Family Property Partition Suit
SUIT VALUE: Rs. 16,00,000/- (Partition Rs. 15,99,800 + Injunction Rs. 100 + Accounts Rs. 100)
SUIT TYPE: Partition + Permanent Injunction + Accounts

PARTIES TO THE SUIT:
1. PLAINTIFF: Shri Sohanlal Jaiswal, Son of Late Kashi Nath Shaw alias Jaiswal, residing at 8/2 Loudon Street, Flat 3A, Kolkata 700017 (Kashi Nath's youngest son — received gift deed 2022).
2. DEFENDANTS (21 Persons):
   - Def. 1-4: Prem Chand, Dinesh Kumar, Rajendra Kumar, Ashok Kumar Jaiswal (sons of Late Biswanath Prasad Shaw).
   - Def. 5: Smt Parbati Devi Shaw (wife of Late Biswanath Prasad Shaw).
   - Def. 6-11: Heirs of Panna Lal / Moti Lal branch.
   - Def. 12-14: Vinod Kumar, Narendra Kumar, Manoj Kumar Jaiswal (sons of Late Pancham Lal).
   - Def. 15-17: Anup, Jitendra, Bipin Jaiswal (grandsons of Pancham Lal).
   - Def. 18-21: Somdeo Gupta & sons (married into Pancham Lal's family).

OWNERSHIP & TITLE CHRONOLOGY:
- 1960: Umrai Debi purchases land via Registered Deed of Conveyance dated 25/03/1960 (Deed No. 2480/1960) from Gobinda Mohan Chatterjee & others at Sub Registrar, Cossipore Dum Dum.
- 1980 (28 Oct 1980): Umrai Debi dies intestate. 3 sons become joint owners with 1/3 share each: (1) Kashi Nath Shaw (2) Biswanath Prasad Shaw (3) Pancham Lal Jaiswal.
- 1960s: M/S Ashoka Iron & Steel Works established as partnership firm of the 3 brothers. Purchased Schedule C (12 Cottahs, RS Dag 6013) and Schedule D (Shali & Danga land, 2.83 acres) via registered deeds.
- 2003 / 1987: Biswanath Prasad Shaw dies 18.10.2003; Pancham Lal Shaw dies 21.07.1987. Their heirs (Def. 1-21) inherit their respective 1/3 shares.
- 2016 (13 Dec 2016): Kashi Nath Shaw dies intestate leaving 6 legal heir branches: 4 sons (Arun, Mohan Lal, Surendra, Sohanlal) + 1 daughter (Bandana Shaw) + 1 predeceased daughter branch (Rita's sons Vivek & Gautam Jaiswal). Each branch holds 1/18 share of Kashi Nath's 1/3.
- 2022 (22 Aug 2022): Gift Deed executed by Mohan Lal Jaiswal, Bandana Shaw, Vivek Jaiswal & Gautam Jaiswal gifting their undivided shares to Sohanlal Jaiswal (Plaintiff). Registered at ADSR Belghoria, Book I, Vol 1526-2022.
- 2024 (July 2024): Plaintiff's requests for amicable partition refused on 27 July 2024. Partition suit filed before Ld. 3rd Civil Judge, Barasat.

SCHEDULE OF PROPERTIES (ALL LOCATED AT PS BELGHORIA / MOUZA ARIADAHA KAMARHATI, NORTH 24 PARGANAS):
1. Schedule A: Main Land — CS Dag 6081 & 5923, CS Khatian 1481, RS Khatian 2828/2830/2832. Area: 0.4000 acre (~17,424 sq.ft / 1 Bigha 4 Kattah 4 Chittak 4 sq.ft). Land Type: Residential / Mixed.
2. Schedule B: House Property with Structure — CS/RS Dag 3011, CS Khatian 1181, RS Khatian 3049. Area: 0.09 acre (~3,920 sq.ft / 2 Bigha 14 Kattah 8 Chittak 6 sq.ft). Land Type: House with structure.
3. Schedule C: Sali Land (M/S Ashoka Iron & Steel Works) — RS Dag 6013, RS Khatian 975, Touzi 173. Area: ~0.030 acre (~1,310 sq.ft / 12 Kattah 10 Chittak 10 sq.ft). Land Type: Sali land.
4. Schedule D: Shali & Danga Land (M/S Ashoka Iron & Steel Works) — RS Dag 5935/5937/5998/6002/6071/6016/6002-6174, RS Khatian 792 & 1105. Area: 2.83 acres (~1,23,235 sq.ft / 8 Bigha 11 Kattah 9 Chittak 33 sq.ft). Land Type: Shali & Danga land.

GRAND TOTAL ALL 4 SCHEDULES COMBINED:
- Total Area: ~3.35 acres / ~1,45,889 sq.ft (10 Bigha 12 Kattah 6 Chittak 8 sq.ft / ~212.4 Kattah).
- Total Market Valuation (@ Rs. 16,50,000 per Kattah): Rs. 35,04,60,000/- (~Rs. 35.04 Crore).

PLAINTIFF (SOHANLAL JAISWAL) CONSOLIDATED SHARE & VALUATION:
- Own Share: 1/18 + Gifted Shares (3/18) = 4/18 = 2/9 share of Kashi Nath's 1/3 share.
- Total Land Area: ~32,419 sq.ft (~0.744 acres / ~45.6 Kattah).
- Consolidated Market Valuation (@ Rs. 16,50,000 per Kattah): Rs. 7,42,50,000/- (~Rs. 7.42 Crore).

RELIEFS PRAYED (Para 29):
a) Preliminary Decree declaring shares of all parties in respect of suit properties.
b) Appointment of Survey Commissioner; Final Decree for Accounts; Permanent Injunction restraining defendants from changing nature/character of suit property.
c) All costs of the suit.
d) Any other relief or reliefs as Plaintiff may be entitled in law and equity.`,
    chunks: [
      {
        id: 'chk-501',
        documentId: 'doc-5',
        pageNumber: 1,
        paragraphNumber: 1,
        text: 'Title Suit No. 87/2024 Jaiswal Family Property Partition Suit filed before Ld. 3rd Civil Judge Barasat for 3.32 acres (~212.4 Kattah) land in PS Belghoria valued at Rs. 35.04 Crores.',
      },
      {
        id: 'chk-502',
        documentId: 'doc-5',
        pageNumber: 2,
        paragraphNumber: 3,
        text: 'Plaintiff Sohanlal Jaiswal consolidated share: 4/18 (2/9) share totaling ~45.6 Kattah (~32,419 sq.ft) valued at Rs. 7,42,50,000 (~7.42 Crore).',
      },
      {
        id: 'chk-503',
        documentId: 'doc-5',
        pageNumber: 4,
        paragraphNumber: 1,
        text: 'Reliefs prayed: Preliminary Decree declaring shares, Survey Commissioner for partition, Permanent Injunction against 21 defendants.',
      },
    ],
    metadata: {
      extractedActs: ['Partition Act 1893', 'CPC Order 39 Rule 1', 'Hindu Succession Act Sec 6', 'Commercial Courts Act'],
      extractedSections: ['Sec 6 Hindu Succession Act', 'Order 39 Rule 1 CPC', 'Sec 2 Partition Act'],
      extractedJudges: ['Hon’ble Ld. 3rd Civil Judge (Sr. Divn), Barasat'],
      extractedDates: ['25-03-1960', '28-10-1980', '18-10-2003', '13-12-2016', '22-08-2022', '27-07-2024'],
      extractedParties: ['Shri Sohanlal Jaiswal', 'Prem Chand & 20 Ors'],
      extractedCourt: 'Court of Ld. 3rd Civil Judge (Sr. Divn), Barasat',
      extractedAdvocates: ['Adv. Rajeshwar V. Sharma'],
      confidenceScore: 99.4,
      ocrEngineUsed: 'PaddleOCR (Primary)',
      languageDetected: 'English',
    },
  },
  {
    id: 'doc-6',
    matterId: 'matter-4',
    matterTitle: 'Belghoria Property Dispute (Jaiswal Family Partition Suit)',
    fileName: 'belghoria high court.pdf',
    fileSize: '3.8 MB',
    fileType: 'PDF',
    category: 'Evidence Annexure',
    uploadedBy: 'Adv. Rajeshwar V. Sharma',
    uploadedAt: '2024-07-28 11:35 AM',
    ocrStatus: 'Completed',
    pageCount: 14,
    ocrText: `[PADDLEOCR EXTRACTED LEGAL TEXT - HIGH COURT & BARASAT COURT PETITION]
TITLE SUIT NO. 87/2024 | BELGHORIA PROPERTY DISPUTE
COURT OF LD. 3RD CIVIL JUDGE (SR. DIVN), BARASAT, NORTH 24 PARGANAS

PLAINTIFF: Shri Sohanlal Jaiswal
DEFENDANTS: 21 Persons (Prem Chand, Dinesh Kumar, Rajendra Kumar & Ors)

SUMMARY OF SUIT & PROPERTY SCHEDULES:
- Total Ancestral Property: 3.35 acres (~1,45,889 sq.ft / 10 Bigha 12 Kattah 6 Chittak 8 sq.ft / ~212.4 Kattah) across Mouza Ariadaha Kamarhati, PS Belghoria.
- Schedule A (Main Land): 0.4000 acre (~17,424 sq.ft).
- Schedule B (House Property): 0.09 acre (~3,920 sq.ft).
- Schedule C (Sali Land M/S Ashoka Iron & Steel): ~0.030 acre (~1,310 sq.ft).
- Schedule D (Shali & Danga Land M/S Ashoka Iron & Steel): 2.83 acres (~1,23,235 sq.ft).

VALUATION & SHARE:
- Total Property Value: Rs. 35,04,60,000/- (@ Rs. 16,50,000/Kattah).
- Plaintiff's Share (4/18 = 2/9): ~45.6 Kattah (~32,419 sq.ft) = Rs. 7,42,50,000/- (~Rs. 7.42 Crore).
- Gift Deed Vol 1526-2022 registered at ADSR Belghoria on 22 Aug 2022.`,
    chunks: [
      {
        id: 'chk-601',
        documentId: 'doc-6',
        pageNumber: 1,
        paragraphNumber: 1,
        text: 'Title Suit No. 87/2024 Belghoria property dispute partition suit in Barasat court. Total property 3.35 acres valued at Rs. 35.04 Crore.',
      },
    ],
    metadata: {
      extractedActs: ['Partition Act 1893', 'CPC Order 39 Rule 1', 'Hindu Succession Act Sec 6'],
      extractedSections: ['Sec 6 Hindu Succession Act', 'Order 39 Rule 1 CPC'],
      extractedJudges: ['Hon’ble Ld. 3rd Civil Judge (Sr. Divn), Barasat'],
      extractedDates: ['25-03-1960', '22-08-2022', '27-07-2024'],
      extractedParties: ['Shri Sohanlal Jaiswal', 'Prem Chand & 20 Ors'],
      extractedCourt: 'Court of Ld. 3rd Civil Judge (Sr. Divn), Barasat',
      extractedAdvocates: ['Adv. Rajeshwar V. Sharma'],
      confidenceScore: 99.2,
      ocrEngineUsed: 'PaddleOCR (Primary)',
      languageDetected: 'English',
    },
  },
];

export const mockHearings: Hearing[] = [
  {
    id: 'hrg-1',
    matterId: 'matter-1',
    date: '2026-08-04',
    time: '10:30 AM',
    courtName: 'Delhi High Court',
    courtHallNo: 'Court Room No. 24',
    judgeName: 'Hon’ble Mr. Justice Sanjeev Narula',
    stage: 'Arguments on Interim Injunction (Sec 9 / Order 39)',
    synopsis: 'Ad-interim stay on SBI Bank Guarantee encashment granted earlier; NHAI to file counter-affidavit.',
    assignedLawyerId: 'usr-1',
    assignedLawyerName: 'Adv. Rajeshwar V. Sharma',
  },
  {
    id: 'hrg-2',
    matterId: 'matter-2',
    date: '2026-08-12',
    time: '02:00 PM',
    courtName: 'District Court',
    courtHallNo: 'Court Room No. 308, Saket Courts',
    judgeName: 'Hon’ble Ms. Neelam Singh (Special CBI Judge)',
    stage: 'Cross Examination of Prosecution Witness PW-1',
    synopsis: 'Cross-examine CBI CVO V.K. Aggarwal on sanction procedure and procurement committee notes.',
    assignedLawyerId: 'usr-3',
    assignedLawyerName: 'Adv. Vikramaditya Singh',
  },
  {
    id: 'hrg-3',
    matterId: 'matter-3',
    date: '2026-08-20',
    time: '11:00 AM',
    courtName: 'NCLT (National Company Law Tribunal)',
    courtHallNo: 'Court Room No. 1, NCLT Mumbai Bench',
    stage: 'Admission / Reply by Corporate Debtor',
    judgeName: 'Hon’ble Shri Kuldip Kumar Kareer',
    synopsis: 'First hearing post notice returnable; Corporate debtor to present maintainability objections.',
    assignedLawyerId: 'usr-2',
    assignedLawyerName: 'Adv. Ananya Roy',
  },
];

export const mockCourtOrders: CourtOrder[] = [
  {
    id: 'ord-1',
    matterId: 'matter-1',
    orderDate: '2024-03-15',
    judgeName: 'Hon’ble Mr. Justice Sanjeev Narula',
    type: 'Interim Order',
    summary:
      'The Court directed Defendant NHAI to maintain status quo and restrained encashment of SBI Bank Guarantee No. 00391BG210088 subject to Plaintiff keeping BG alive.',
    keyDirectives: [
      'Defendants restrained from invoking BG till next date of hearing.',
      'Plaintiff directed to extend validity of SBI BG by 6 months within 7 days.',
      'Defendants to file reply within 4 weeks with advance copy to Plaintiff.',
    ],
  },
  {
    id: 'ord-2',
    matterId: 'matter-2',
    orderDate: '2023-11-20',
    judgeName: 'Hon’ble Ms. Neelam Singh',
    type: 'Bail Order',
    summary:
      'Regular Bail granted to Dr. Ramesh K. Malhotra under Section 439 CrPC on personal bond of Rs. 2,00,000/- with two local sureties.',
    keyDirectives: [
      'Accused shall surrender passport to CBI Special Court.',
      'Accused shall not attempt to influence witnesses or tamper with hospital records.',
      'Accused to join investigation as and when summoned.',
    ],
  },
];

export const mockTimeline: TimelineEvent[] = [
  {
    id: 'tl-1',
    matterId: 'matter-1',
    date: '14-Jan-2021',
    title: 'EPC Tender Awarded',
    description: 'NHAI awarded Highway Expressway Tender to Apex Infrastructure Ltd for Rs 180 Crores.',
    type: 'Filing',
    docCitation: 'Plaint Pg 4',
  },
  {
    id: 'tl-2',
    matterId: 'matter-1',
    date: '14-Nov-2023',
    title: 'Joint Inspection Field Visit',
    description: 'Field diary confirms only 64% land handed over due to DISCOM powerline and land disputes.',
    type: 'Evidence',
    docCitation: 'Site Register Pg 4',
  },
  {
    id: 'tl-3',
    matterId: 'matter-1',
    date: '02-Mar-2024',
    title: 'Bank Guarantee Invocation Notice Issued',
    description: 'NHAI issued sudden notice calling upon SBI to encash Rs 24.8 Cr performance guarantee.',
    type: 'Notice',
    docCitation: 'Plaint Pg 6',
  },
  {
    id: 'tl-4',
    matterId: 'matter-1',
    date: '12-Mar-2024',
    title: 'Commercial Suit Instituted in Delhi HC',
    description: 'CS(COMM) 420/2024 filed along with Sec 9 / Order 39 interim injunction application.',
    type: 'Pleading',
  },
  {
    id: 'tl-5',
    matterId: 'matter-1',
    date: '15-Mar-2024',
    title: 'Ad-Interim Stay Order Granted',
    description: 'Delhi HC restrained NHAI from invoking Bank Guarantee subject to extension of BG validity.',
    type: 'Court Order',
    docCitation: 'Order Dated 15-Mar-2024',
  },
];

export const mockWitnesses: Witness[] = [
  {
    id: 'wit-1',
    matterId: 'matter-2',
    name: 'Shri V.K. Aggarwal (Chief Vigilance Officer, CBI Complainant)',
    role: 'Prosecution Witness',
    statementSummary: 'Claims Dr. Malhotra overrode procurement committee objections regarding CT scan specifications.',
    crossExamStatus: 'Drafted',
  },
  {
    id: 'wit-2',
    matterId: 'matter-2',
    name: 'Er. Rajesh Gupta (Senior Biomedical Engineer)',
    role: 'Expert Witness',
    statementSummary: 'Certified that high-end 256-slice cardiac CT scanner market price in 2021 was Rs 4.1 to 4.5 Crores.',
    crossExamStatus: 'Pending',
  },
];

export const mockTasks: Task[] = [
  {
    id: 'tsk-1',
    matterId: 'matter-1',
    matterTitle: 'CS(COMM) 420/2024 - Apex v. UOI',
    title: 'Draft Rejoinder Affidavit to NHAI Counter Affidavit',
    priority: 'High',
    dueDate: '2026-07-30',
    assignedTo: 'Adv. Vikramaditya Singh',
    completed: false,
  },
  {
    id: 'tsk-2',
    matterId: 'matter-2',
    matterTitle: 'CRA-S-1092/2023 - State v. Malhotra',
    title: 'Prepare Cross-Examination questionnaire for PW-1 CVO',
    priority: 'High',
    dueDate: '2026-08-05',
    assignedTo: 'Adv. Rajeshwar V. Sharma',
    completed: false,
  },
  {
    id: 'tsk-3',
    matterId: 'matter-3',
    matterTitle: 'CP(IB) 891/2024 - Puri v. Apex Freight',
    title: 'Obtain NeSL Default Information Utility Certificate',
    priority: 'Medium',
    dueDate: '2026-08-10',
    assignedTo: 'Adv. Ananya Roy',
    completed: true,
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'SLA/2024/0391',
    matterId: 'matter-1',
    clientId: 'client-1',
    clientName: 'M/s Apex Infrastructure & Developers Pvt Ltd',
    issueDate: '2024-03-20',
    dueDate: '2024-04-05',
    subtotalINR: 500000,
    gstINR: 90000,
    totalINR: 590000,
    status: 'Paid',
    feeType: 'Appearance Fee',
    items: [{ description: 'High Court Senior Advocate Appearance Fee', amountINR: 500000 }],
  },
  {
    id: 'inv-2',
    invoiceNumber: 'SLA/2024/0512',
    matterId: 'matter-2',
    clientId: 'client-2',
    clientName: 'Dr. Ramesh K. Malhotra',
    issueDate: '2024-05-10',
    dueDate: '2024-05-25',
    subtotalINR: 350000,
    gstINR: 63000,
    totalINR: 413000,
    status: 'Paid',
    feeType: 'Retainer',
    items: [{ description: 'Criminal Defence Senior Retainer', amountINR: 350000 }],
  },
  {
    id: 'inv-3',
    invoiceNumber: 'SLA/2024/0788',
    matterId: 'matter-3',
    clientId: 'client-3',
    clientName: 'Puri Overseas Logistics Ltd',
    issueDate: '2024-07-01',
    dueDate: '2024-07-15',
    subtotalINR: 300000,
    gstINR: 54000,
    totalINR: 354000,
    status: 'Pending',
    feeType: 'Drafting Fee',
    items: [{ description: 'NCLT Section 7 Application & Annexure Drafting', amountINR: 300000 }],
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-07-23 18:42:10',
    userId: 'usr-1',
    userName: 'Adv. Rajeshwar V. Sharma',
    userRole: 'Senior Lawyer',
    action: 'AI_CHAT_QUERY',
    resource: 'CS(COMM) 420/2024 - Document RAG',
    ipAddress: '103.22.180.42',
    details: 'Searched for Bank guarantee invocation clauses and delay notes in Apex v UOI.',
  },
  {
    id: 'log-102',
    timestamp: '2026-07-23 17:15:02',
    userId: 'usr-3',
    userName: 'Adv. Vikramaditya Singh',
    userRole: 'Associate',
    action: 'OCR_DOCUMENT_UPLOAD',
    resource: 'Scanned_NHAI_Site_Handover_Diary.pdf',
    ipAddress: '103.22.180.44',
    details: 'Ran PaddleOCR & Language detection on 18 scanned field diary pages.',
  },
  {
    id: 'log-103',
    timestamp: '2026-07-23 14:05:33',
    userId: 'usr-2',
    userName: 'Adv. Ananya Roy',
    userRole: 'Firm Admin',
    action: 'RBAC_PERMISSION_UPDATE',
    resource: 'Role: Associate Lawyers',
    ipAddress: '103.22.180.42',
    details: 'Updated permission matrix for AI drafting assistant & confidential evidence view.',
  },
];

export const mockEnquiries: Enquiry[] = [
  {
    id: 'enq-1',
    clientName: 'Suresh Chandra Goel',
    phone: '+91 98112 88900',
    email: 'scgoel@goeltextiles.com',
    category: 'GST & Indirect Tax',
    subject: 'High Court Writ Petition against Show Cause Notice under Sec 74 CGST Act',
    source: 'Website Lead',
    consultFeeINR: 15000,
    status: 'New Lead',
    date: '2026-07-22',
    notes: 'Received SCN claiming Rs 1.8 Cr ITC reversal. Needs urgency stay from Delhi High Court.',
  },
  {
    id: 'enq-2',
    clientName: 'Meenakshi Sundaram',
    phone: '+91 98401 55667',
    email: 'm.sundaram@chennaitech.io',
    category: 'Arbitration',
    subject: 'Section 11 Application for Appointment of Sole Arbitrator',
    source: 'Client Referral',
    consultFeeINR: 25000,
    status: 'Consultation Fixed',
    date: '2026-07-20',
    notes: 'Software licensing dispute under SIAC rules / Indian Arbitration Act. Chamber consultation scheduled.',
  },
  {
    id: 'enq-3',
    clientName: 'Karanvir Malhotra',
    phone: '+91 97110 33441',
    email: 'karan@malhotraproperties.in',
    category: 'Property & Real Estate',
    subject: 'Specific Performance Suit & Injunction for Okhla Commercial Land',
    source: 'High Court Chamber',
    consultFeeINR: 20000,
    status: 'Converted to Matter',
    date: '2026-07-15',
    notes: 'Advance agreement executed; seller attempting third-party sale. Converted to active litigation file.',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    clientName: 'Siddharth Varma (Apex Infra)',
    matterTitle: 'CS(COMM) 420/2024 - Apex v. UOI',
    lawyerName: 'Adv. Rajeshwar V. Sharma',
    date: '2026-07-25',
    time: '11:30 AM',
    mode: 'Chamber Meeting',
    purpose: 'Senior Counsel Briefing & Rejoinder Affidavit Review',
    status: 'Scheduled',
  },
  {
    id: 'apt-2',
    clientName: 'Dr. Ramesh K. Malhotra',
    matterTitle: 'CRA-S-1092/2023 - State v. Malhotra',
    lawyerName: 'Adv. Vikramaditya Singh',
    date: '2026-07-26',
    time: '04:00 PM',
    mode: 'Video Call (Google Meet)',
    purpose: 'Witness Cross-Examination Strategy Discussion',
    status: 'Scheduled',
  },
  {
    id: 'apt-3',
    clientName: 'Puri Overseas Logistics',
    matterTitle: 'CP (IB) 891/2024 - Puri v. Apex Freight',
    lawyerName: 'Adv. Ananya Roy',
    date: '2026-07-28',
    time: '02:30 PM',
    mode: 'High Court Canteen Briefing',
    purpose: 'NCLT Admission Order Hearing Prep',
    status: 'Scheduled',
  },
];

export const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    matterId: 'matter-1',
    matterTitle: 'CS(COMM) 420/2024 - Apex v. UOI',
    category: 'Court Fee Stamp',
    description: 'Ad Valorem Court Fee Stamp Duty for High Court Suit',
    amountINR: 125000,
    spentBy: 'Adv. Vikramaditya Singh',
    date: '2026-07-10',
    status: 'Billed to Client',
  },
  {
    id: 'exp-2',
    matterId: 'matter-1',
    matterTitle: 'CS(COMM) 420/2024 - Apex v. UOI',
    category: 'Senior Counsel Clerkage',
    description: 'Senior Advocate Clerkage Charges for Order 39 Appearance',
    amountINR: 18000,
    spentBy: 'Adv. Rajeshwar V. Sharma',
    date: '2026-07-12',
    status: 'Pending Reimbursable',
  },
  {
    id: 'exp-3',
    matterId: 'matter-2',
    matterTitle: 'CRA-S-1092/2023 - State v. Malhotra',
    category: 'Certified Copy Charges',
    description: 'CBI Court Certified Orders & Witness Statement Copies',
    amountINR: 4500,
    spentBy: 'Junior Staff',
    date: '2026-07-18',
    status: 'Billed to Client',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    matterId: 'matter-1',
    matterTitle: 'CS(COMM) 420/2024 - Apex v. UOI',
    senderName: 'Siddharth Varma',
    senderRole: 'Client MD',
    text: 'Adv. Sharma, we have received the updated bank guarantee validity letter from SBI Jasola branch. Sharing PDF in documents.',
    timestamp: 'Today, 10:15 AM',
    isClientMessage: true,
    unread: true,
  },
  {
    id: 'msg-2',
    matterId: 'matter-1',
    matterTitle: 'CS(COMM) 420/2024 - Apex v. UOI',
    senderName: 'Adv. Rajeshwar V. Sharma',
    senderRole: 'Senior Lawyer',
    text: 'Excellent. Adv. Vikramaditya is annexing it to our Rejoinder Affidavit before Delhi High Court.',
    timestamp: 'Today, 10:22 AM',
    isClientMessage: false,
    unread: false,
  },
  {
    id: 'msg-3',
    matterId: 'matter-2',
    matterTitle: 'CRA-S-1092/2023 - State v. Malhotra',
    senderName: 'Dr. Ramesh K. Malhotra',
    senderRole: 'Client',
    text: 'Will the CBI court hearing on 12th August require my personal presence or can we seek exemption?',
    timestamp: 'Yesterday, 06:40 PM',
    isClientMessage: true,
    unread: false,
  },
];

export const mockECourtCases: ECourtCase[] = [
  {
    id: 'ecourt-1',
    cnrNumber: 'DLHC01-004120-2024',
    courtName: 'Delhi High Court',
    caseTypeAndNo: 'CS(COMM) 420/2024',
    petitioner: 'M/s Apex Infrastructure & Developers Pvt Ltd',
    respondent: 'Union of India & Anr',
    nextHearingDate: '2026-08-04',
    stage: 'Arguments on Interim Injunction',
    lastOrderDate: '2026-03-15',
    lastOrderSummary: 'Interim stay granted on SBI Bank Guarantee invocation. Counter-affidavit awaited.',
    syncStatus: 'Live Synced',
    lastSyncedAt: '2026-07-24 08:30 AM',
  },
  {
    id: 'ecourt-2',
    cnrNumber: 'DLST01-001092-2023',
    courtName: 'Saket District Court, New Delhi',
    caseTypeAndNo: 'CRA-S-1092/2023',
    petitioner: 'State (NCT of Delhi) through CBI',
    respondent: 'Dr. Ramesh K. Malhotra',
    nextHearingDate: '2026-08-12',
    stage: 'Cross Examination PW-1',
    lastOrderDate: '2026-05-18',
    lastOrderSummary: 'PW-1 Chief Vigilance Officer examination part-heard. Adjourned for cross.',
    syncStatus: 'Live Synced',
    lastSyncedAt: '2026-07-24 08:30 AM',
  },
  {
    id: 'ecourt-3',
    cnrNumber: 'MHNC01-000891-2024',
    courtName: 'NCLT Mumbai Bench 1',
    caseTypeAndNo: 'CP (IB) No. 891/MB/2024',
    petitioner: 'Puri Overseas Logistics Ltd',
    respondent: 'Apex Global Freight Carriers Pvt Ltd',
    nextHearingDate: '2026-08-20',
    stage: 'Admission / Reply',
    lastOrderDate: '2026-04-10',
    lastOrderSummary: 'Notice issued to Corporate Debtor returnable by 20-Aug-2026.',
    syncStatus: 'Update Available',
    lastSyncedAt: '2026-07-23 04:15 PM',
  },
];

export const mockReminders: Reminder[] = [
  {
    id: 'rem-1',
    matterId: 'matter-1',
    matterTitle: 'CS(COMM) 420/2024 - Apex v. UOI',
    title: 'File Rejoinder Affidavit in Delhi High Court',
    type: 'Order Compliance',
    dueDate: '2026-07-30',
    daysRemaining: 6,
    priority: 'Critical',
    status: 'Pending',
  },
  {
    id: 'rem-2',
    matterId: 'matter-4',
    matterTitle: 'Belghoria Property Dispute Partition Suit',
    title: 'Deposit Survey Commissioner Fee Stamp at Barasat Treasury',
    type: 'Court Fee Deposit',
    dueDate: '2026-08-02',
    daysRemaining: 9,
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 'rem-3',
    matterId: 'matter-3',
    matterTitle: 'CP(IB) 891/2024 - Puri v. Apex Freight',
    title: 'Serve Advance Copy of NCLT Rejoinder to Respondent Counsel',
    type: 'Evidence Filing',
    dueDate: '2026-08-15',
    daysRemaining: 22,
    priority: 'Medium',
    status: 'Pending',
  },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'usr-1',
    name: 'Adv. Rajeshwar V. Sharma',
    role: 'Senior Lawyer',
    department: 'Commercial & Corporate Litigation',
    email: 'rvsharma@shardul-legal.in',
    phone: '+91 98110 44321',
    barCouncilNo: 'D/1428/2002',
    activeCasesCount: 14,
    monthlyBillableHours: 142,
    hourlyRateINR: 15000,
    status: 'In Court',
  },
  {
    id: 'usr-2',
    name: 'Adv. Ananya Roy',
    role: 'Firm Admin',
    department: 'Insolvency & NCLT Bench',
    email: 'ananya.roy@shardul-legal.in',
    phone: '+91 98201 88765',
    barCouncilNo: 'D/2104/2012',
    activeCasesCount: 18,
    monthlyBillableHours: 168,
    hourlyRateINR: 12000,
    status: 'Active',
  },
  {
    id: 'usr-3',
    name: 'Adv. Vikramaditya Singh',
    role: 'Associate',
    department: 'Criminal Defence & White Collar',
    email: 'vikram.singh@shardul-legal.in',
    phone: '+91 97112 33456',
    barCouncilNo: 'D/3491/2018',
    activeCasesCount: 9,
    monthlyBillableHours: 195,
    hourlyRateINR: 6500,
    status: 'Active',
  },
];
