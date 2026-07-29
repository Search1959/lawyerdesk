import { StateMaster, DistrictMaster, CourtComplex, CourtEstablishment, CaseTypeMaster, CourtUpdates } from '../types';

export const mockStates: StateMaster[] = [
  { id: 'st-wb', code: 'WB', name: 'West Bengal' },
  { id: 'st-dl', code: 'DL', name: 'Delhi (NCT)' },
  { id: 'st-mh', code: 'MH', name: 'Maharashtra' },
  { id: 'st-ka', code: 'KA', name: 'Karnataka' },
  { id: 'st-tn', code: 'TN', name: 'Tamil Nadu' },
  { id: 'st-up', code: 'UP', name: 'Uttar Pradesh' },
  { id: 'st-gj', code: 'GJ', name: 'Gujarat' },
];

export const mockDistricts: DistrictMaster[] = [
  // West Bengal
  { id: 'dt-wb-24pgns-n', stateId: 'st-wb', code: 'NP', name: 'North 24 Parganas' },
  { id: 'dt-wb-kol', stateId: 'st-wb', code: 'KC', name: 'Kolkata' },
  { id: 'dt-wb-24pgns-s', stateId: 'st-wb', code: 'SP', name: 'South 24 Parganas' },
  { id: 'dt-wb-hwr', stateId: 'st-wb', code: 'HW', name: 'Howrah' },
  { id: 'dt-wb-hgl', stateId: 'st-wb', code: 'HG', name: 'Hooghly' },
  
  // Delhi
  { id: 'dt-dl-cnt', stateId: 'st-dl', code: 'CT', name: 'Central Delhi (Tis Hazari)' },
  { id: 'dt-dl-sth', stateId: 'st-dl', code: 'ST', name: 'South Delhi (Saket)' },
  { id: 'dt-dl-ndl', stateId: 'st-dl', code: 'ND', name: 'New Delhi (Patiala House)' },
  { id: 'dt-dl-dwk', stateId: 'st-dl', code: 'SW', name: 'South West Delhi (Dwarka)' },

  // Maharashtra
  { id: 'dt-mh-mum', stateId: 'st-mh', code: 'MC', name: 'Mumbai City' },
  { id: 'dt-mh-pne', stateId: 'st-mh', code: 'PU', name: 'Pune' },

  // Karnataka
  { id: 'dt-ka-blr', stateId: 'st-ka', code: 'BG', name: 'Bengaluru Urban' },

  // Tamil Nadu
  { id: 'dt-tn-chn', stateId: 'st-tn', code: 'CH', name: 'Chennai' },
];

export const mockComplexes: CourtComplex[] = [
  // North 24 Parganas
  { id: 'cx-barasat', districtId: 'dt-wb-24pgns-n', code: 'WBNP01', name: 'District & Sessions Judge Court Complex, Barasat', address: 'Kachhari Road, Barasat, Kolkata - 700124' },
  { id: 'cx-barrackpore', districtId: 'dt-wb-24pgns-n', code: 'WBNP02', name: 'Barrackpore Sub-Divisional Court Complex', address: 'Station Road, Barrackpore, North 24 Parganas' },
  { id: 'cx-bidhannagar', districtId: 'dt-wb-24pgns-n', code: 'WBNP03', name: 'Bidhannagar Salt Lake Court Complex', address: 'Mayukh Bhavan, DJ Block, Salt Lake' },

  // Kolkata
  { id: 'cx-chc', districtId: 'dt-wb-kol', code: 'WBHC01', name: 'High Court at Calcutta (Principal Bench)', address: '3, Council House Street, BBD Bagh, Kolkata' },
  { id: 'cx-citycivil', districtId: 'dt-wb-kol', code: 'WBKC01', name: 'City Civil Court Kolkata', address: 'Old Post Office Street, Kolkata' },
  { id: 'cx-bankshall', districtId: 'dt-wb-kol', code: 'WBKC02', name: 'Chief Metropolitan Magistrate Court (Bankshall)', address: 'Bankshall Street, Kolkata' },

  // Central Delhi
  { id: 'cx-tishazari', districtId: 'dt-dl-cnt', code: 'DLCT01', name: 'Tis Hazari District Courts Complex', address: 'Tis Hazari, Delhi - 110054' },

  // South Delhi
  { id: 'cx-saket', districtId: 'dt-dl-sth', code: 'DLST01', name: 'Saket District Courts Complex', address: 'Saket, New Delhi - 110017' },

  // Mumbai
  { id: 'cx-bhc', districtId: 'dt-mh-mum', code: 'MHC01', name: 'Bombay High Court Principal Bench', address: 'Fort, Mumbai - 400032' },

  // Bengaluru
  { id: 'cx-khc', districtId: 'dt-ka-blr', code: 'KHC01', name: 'High Court of Karnataka Principal Bench', address: 'Ambedkar Veedhi, Bengaluru' },

  // Chennai
  { id: 'cx-mhc', districtId: 'dt-tn-chn', code: 'MHC02', name: 'Madras High Court Principal Bench', address: 'High Court Complex, Chennai' },
];

export const mockEstablishments: CourtEstablishment[] = [
  // Barasat Complex
  { id: 'est-barasat-dist', complexId: 'cx-barasat', code: '01', name: 'District & Sessions Judge Court, Barasat' },
  { id: 'est-barasat-macc', complexId: 'cx-barasat', code: '02', name: 'Motor Accident Claims Tribunal (M A C C), Barasat' },
  { id: 'est-barasat-adj1', complexId: 'cx-barasat', code: '03', name: 'Additional District Judge 1st Court, Barasat' },
  { id: 'est-barasat-comm', complexId: 'cx-barasat', code: '04', name: 'Commercial Court, Barasat' },

  // Barrackpore Complex
  { id: 'est-bkp-adj1', complexId: 'cx-barrackpore', code: '01', name: 'Additional District Judge 1st Court, Barrackpore' },
  { id: 'est-bkp-sdjm', complexId: 'cx-barrackpore', code: '02', name: 'Sub-Divisional Judicial Magistrate Court, Barrackpore' },

  // Calcutta High Court
  { id: 'est-chc-app', complexId: 'cx-chc', code: '01', name: 'Calcutta High Court (Appellate Side)' },
  { id: 'est-chc-orig', complexId: 'cx-chc', code: '02', name: 'Calcutta High Court (Original Side)' },

  // Tis Hazari
  { id: 'est-th-dist', complexId: 'cx-tishazari', code: '01', name: 'District & Sessions Judge (Central), Tis Hazari' },
  { id: 'est-th-comm', complexId: 'cx-tishazari', code: '02', name: 'Commercial Court (Central), Tis Hazari' },
];

export const mockCaseTypes: CaseTypeMaster[] = [
  { id: 'ct-macc', code: 'M A C C', name: 'Motor Accident Claims Petition', category: 'Motor Accident Claims' },
  { id: 'ct-ts', code: 'TS', name: 'Title Suit (Civil Property)', category: 'Property & Real Estate' },
  { id: 'ct-cscomm', code: 'CS(COMM)', name: 'Commercial Suit (Commercial Courts Act)', category: 'Commercial' },
  { id: 'ct-wpa', code: 'WPA', name: 'Writ Petition (Article 226 Constitutional)', category: 'Civil' },
  { id: 'ct-cra', code: 'CRA', name: 'Criminal Appeal', category: 'Criminal' },
  { id: 'ct-crr', code: 'CRR', name: 'Criminal Revision', category: 'Criminal' },
  { id: 'ct-arb', code: 'ARB', name: 'Arbitration Application (Sec 9 / Sec 11 / Sec 34)', category: 'Arbitration' },
  { id: 'ct-cc', code: 'CC', name: 'Cheque Bounce Complaint (Sec 138 NI Act)', category: 'Civil' },
  { id: 'ct-cba', code: 'CBA', name: 'Bail Application', category: 'Criminal' },
];

export interface CourtIntegrationConfig {
  id: string;
  name: string;
  type: 'District eCourts CIS 3.2' | 'High Court NJDG Gateway' | 'NCLT e-Filing API' | 'DRT Portal API' | 'Supreme Court Gateway';
  status: 'ACTIVE' | 'LIMITED' | 'MAINTENANCE' | 'DISABLED';
  endpoint: string;
  lastSyncAt: string;
  successRate24h: string;
  totalSyncedCases: number;
}

export const mockCourtIntegrations: CourtIntegrationConfig[] = [
  {
    id: 'int-ecourts-cis',
    name: 'National eCourts CIS 3.2 Direct Portal API',
    type: 'District eCourts CIS 3.2',
    status: 'ACTIVE',
    endpoint: 'https://services.ecourts.gov.in/ecourtIndia_v6/api/v1/case_status',
    lastSyncAt: '2026-07-29T14:45:00Z',
    successRate24h: '99.4%',
    totalSyncedCases: 142850,
  },
  {
    id: 'int-njdg-hc',
    name: 'High Court NJDG Direct Data Gateway',
    type: 'High Court NJDG Gateway',
    status: 'ACTIVE',
    endpoint: 'https://hcservices.ecourts.gov.in/hcservices/api/v2/cnr_query',
    lastSyncAt: '2026-07-29T14:48:10Z',
    successRate24h: '98.9%',
    totalSyncedCases: 89420,
  },
  {
    id: 'int-nclt-api',
    name: 'National Company Law Tribunal (NCLT) Portal',
    type: 'NCLT e-Filing API',
    status: 'ACTIVE',
    endpoint: 'https://nclt.gov.in/api/v1/cause_list',
    lastSyncAt: '2026-07-29T12:30:00Z',
    successRate24h: '96.2%',
    totalSyncedCases: 12400,
  },
  {
    id: 'int-sc-portal',
    name: 'Supreme Court e-Filing 2.0 Web Gateway',
    type: 'Supreme Court Gateway',
    status: 'ACTIVE',
    endpoint: 'https://sci.gov.in/api/case_status',
    lastSyncAt: '2026-07-29T13:15:00Z',
    successRate24h: '97.8%',
    totalSyncedCases: 31200,
  },
];

export const mockSyncLogs: CourtUpdates[] = [
  {
    id: 'sync-log-01',
    cnrNumber: 'WBNP010042182026',
    matterId: 'mat-macc-458',
    updatedAt: '2026-07-29 14:48:12 IST',
    status: 'SUCCESS',
    changesCount: 2,
    rawResponseSummary: 'Verified M A C C 458/2026 record at District & Sessions Court Barasat. Next Hearing: 25-09-2026.',
  },
  {
    id: 'sync-log-02',
    cnrNumber: 'DLCT010008772024',
    matterId: 'mat-001',
    updatedAt: '2026-07-29 14:30:05 IST',
    status: 'SUCCESS',
    changesCount: 1,
    rawResponseSummary: 'Cross examination stage verified. Item #4 on cause list for Court Room 312.',
  },
  {
    id: 'sync-log-03',
    cnrNumber: 'WBHC010049202024',
    matterId: 'mat-002',
    updatedAt: '2026-07-29 13:10:00 IST',
    status: 'SUCCESS',
    changesCount: 0,
    rawResponseSummary: 'No changes detected. Order dated 20-07-2026 remains latest.',
  },
  {
    id: 'sync-log-04',
    cnrNumber: 'WBHC0100INVALID0',
    updatedAt: '2026-07-29 11:05:22 IST',
    status: 'NOT_FOUND',
    changesCount: 0,
    rawResponseSummary: 'No matching record found in CIS registry for CNR WBHC0100INVALID0.',
  },
];
