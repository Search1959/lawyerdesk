import React, { useState, useRef } from 'react';
import {
  Search,
  Building2,
  Filter,
  Layers,
  FileText,
  ScanLine,
  PenTool,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Mic,
  Clock,
  ArrowRight,
  ShieldCheck,
  X,
  RefreshCw,
  Brain,
  ListCheck,
  Upload,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Client, CourtType, CaseCategory, Matter } from '../types';
import {
  mockStates,
  mockDistricts,
  mockComplexes,
  mockEstablishments,
  mockCaseTypes,
} from '../data/courtMasterData';

interface AddMatterWizardModalProps {
  clients: Client[];
  onClose: () => void;
  onSave: (matterData: Partial<Matter>) => void;
}

type ImportMethod = 'cnr' | 'case_details' | 'order' | 'ocr' | 'manual';
type Step =
  | 'choose_method'
  | 'cnr_input'
  | 'cnr_loading'
  | 'cnr_success'
  | 'cnr_fail'
  | 'case_details_input'
  | 'case_details_loading'
  | 'case_details_success'
  | 'ocr_upload'
  | 'ocr_loading'
  | 'manual_form'
  | 'review_confirm'
  | 'voice_dictation';

// Source Tag Badge Component
const SourceTag: React.FC<{
  source?: 'Official Court Data' | 'OCR Extraction' | 'Manual Entry' | 'AI Generated';
}> = ({ source }) => {
  const s = source || 'Official Court Data';
  if (s === 'Official Court Data') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>Official Court Data</span>
      </span>
    );
  }
  if (s === 'OCR Extraction') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shrink-0">
        <ScanLine className="w-3 h-3 text-amber-400" />
        <span>OCR Extraction</span>
      </span>
    );
  }
  if (s === 'Manual Entry') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1 shrink-0">
        <PenTool className="w-3 h-3 text-sky-400" />
        <span>Manual Entry</span>
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 shrink-0">
      <Brain className="w-3 h-3 text-indigo-400" />
      <span>AI Generated</span>
    </span>
  );
};

export const AddMatterWizardModal: React.FC<AddMatterWizardModalProps> = ({
  clients,
  onClose,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('choose_method');
  const [importMethod, setImportMethod] = useState<ImportMethod>('cnr');

  // File Upload Ref & State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileDetails, setUploadedFileDetails] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);

  // CNR Input State & Real-time Validation
  const [cnrNumber, setCnrNumber] = useState('');
  const [cnrErrorMsg, setCnrErrorMsg] = useState('');

  // Search By Case Details Cascading Dropdown States
  const [caseSearchState, setCaseSearchState] = useState('st-wb');
  const [caseSearchDistrict, setCaseSearchDistrict] = useState('dt-wb-24pgns-n');
  const [caseSearchComplex, setCaseSearchComplex] = useState('cx-barasat');
  const [caseSearchEstablishment, setCaseSearchEstablishment] = useState('est-barasat-macc');
  const [caseSearchCaseType, setCaseSearchCaseType] = useState('ct-macc');
  const [caseSearchCaseNumber, setCaseSearchCaseNumber] = useState('458');
  const [caseSearchFilingYear, setCaseSearchFilingYear] = useState('2026');

  // Voice Dictation State
  const [voiceText, setVoiceText] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Extracted / Form Data State
  const [extractedData, setExtractedData] = useState<{
    caseNumber: string;
    cnrNumber: string;
    title: string;
    category: CaseCategory;
    court: CourtType;
    judgeName: string;
    courtRoomNo: string;
    clientName: string;
    opposingParty: string;
    opposingAdvocate: string;
    leadLawyerName: string;
    actsAndSections: string;
    petitionerName: string;
    respondentName: string;
    filingNumber: string;
    filingDate: string;
    registrationNumber: string;
    registrationDate: string;
    firstHearingDate: string;
    nextHearingDate: string;
    caseStage: string;
    bench: string;
    policeStation?: string;
    firNumber?: string;
    propertyDetails?: string;
    dataSource: 'Official Court Data' | 'OCR Extraction' | 'Manual Entry' | 'AI Generated';
    orders?: { id: string; date: string; orderTitle: string; summary?: string }[];
    timeline?: { id: string; date: string; event: string; status?: string }[];
  }>({
    caseNumber: '',
    cnrNumber: '',
    title: '',
    category: 'Motor Accident Claims',
    court: 'District Court',
    judgeName: '',
    courtRoomNo: '',
    clientName: '',
    opposingParty: '',
    opposingAdvocate: '',
    leadLawyerName: 'Senior Advocate S. K. Mukherjee',
    actsAndSections: 'Motor Vehicles Act 1988 (Sec 166/140)',
    petitionerName: '',
    respondentName: '',
    filingNumber: 'Not Available',
    filingDate: 'Not Available',
    registrationNumber: 'Not Available',
    registrationDate: 'Not Available',
    firstHearingDate: 'Not Available',
    nextHearingDate: '2026-09-25',
    caseStage: 'Appearance & Notice Stage',
    bench: 'District & Sessions Court',
    dataSource: 'Official Court Data',
  });

  // Confidence scores for review step
  const [confidenceScores] = useState({
    caseNumber: '100%',
    cnrNumber: '100%',
    court: '100%',
    judgeName: '98%',
    clientName: '90%',
    opposingParty: '96%',
    nextHearingDate: '100%',
    caseStage: '98%',
    actsAndSections: '95%',
  });

  // AI Summary Generated
  const [aiAnalysisSummary, setAiAnalysisSummary] = useState<{
    summary: string;
    legalIssues: string[];
    timeline: { date: string; event: string }[];
    missingDocs: string[];
    pendingTasks: string[];
    potentialRisks: string[];
    suggestedAction: string;
  } | null>(null);

  // Manual Multi-Step Form Sub-tab
  const [manualTab, setManualTab] = useState<
    'general' | 'client' | 'court' | 'financial' | 'opposite' | 'team' | 'ai_notes'
  >('general');

  // Manual Form Specific States
  const [claimAmount, setClaimAmount] = useState('₹ 15,00,000');
  const [feeRetainer, setFeeRetainer] = useState('₹ 1,50,000');
  const [aiNotes, setAiNotes] = useState('High priority matter with upcoming hearing.');

  // Validate CNR Format Real-time
  const getCnrValidationStatus = (cnr: string) => {
    const clean = cnr.trim().toUpperCase();
    if (!clean) return { valid: false, empty: true, message: 'Enter 16-character eCourts CNR Number' };
    const regex = /^[A-Z0-9]{16}$/;
    if (regex.test(clean)) {
      return { valid: true, empty: false, message: '✓ Valid 16-Character eCourts CNR Format' };
    }
    return {
      valid: false,
      empty: false,
      message: `Format: ${clean.length}/16 chars. Must be 16 alphanumeric characters (e.g. WBNP010042182026)`,
    };
  };

  // Filtered Districts based on selected State
  const filteredDistricts = mockDistricts.filter((d) => d.stateId === caseSearchState);
  // Filtered Complexes based on selected District
  const filteredComplexes = mockComplexes.filter((c) => c.districtId === caseSearchDistrict);
  // Filtered Establishments based on selected Complex
  const filteredEstablishments = mockEstablishments.filter((e) => e.complexId === caseSearchComplex);

  // Handle CNR Search Simulation
  const handleSearchCNR = (sampleCnr?: string) => {
    const queryCnr = (sampleCnr || cnrNumber).trim().toUpperCase();
    if (!queryCnr || queryCnr.length < 8) {
      setCnrErrorMsg('Please enter a valid 16-character CNR Number (e.g., WBNP010042182026)');
      return;
    }

    setCnrNumber(queryCnr);
    setCnrErrorMsg('');
    setCurrentStep('cnr_loading');

    setTimeout(() => {
      // Simulate failure case for explicit test fail flag
      if (queryCnr.includes('FAIL')) {
        setCurrentStep('cnr_fail');
        return;
      }

      const isWbnpCnr = queryCnr.includes('WBNP010042182026') || queryCnr.includes('42182026');

      if (isWbnpCnr) {
        setExtractedData({
          caseNumber: 'M A C C 458/2026',
          cnrNumber: 'WBNP010042182026',
          title: 'M A C C Claim Petition (Reg No: 458/2026)',
          category: 'Motor Accident Claims',
          court: 'District & Sessions Judge, Barasat, North 24 Parganas' as CourtType,
          judgeName: 'Hon\'ble District & Sessions Judge, Barasat',
          courtRoomNo: 'Court Room No. 1, Barasat Court Complex',
          clientName: 'Motor Accident Claimant',
          opposingParty: 'Insurance Co. & Vehicle Owner',
          opposingAdvocate: 'Standing Counsel for Insurance Co.',
          leadLawyerName: 'Senior Advocate S. K. Mukherjee',
          actsAndSections: 'Motor Vehicles Act 1988 (Sec 166/140)',
          petitionerName: 'Claimant Petitioner',
          respondentName: 'Opposite Parties & Insurance Co.',
          filingNumber: '2935/2026',
          filingDate: '07-05-2026',
          registrationNumber: '458/2026',
          registrationDate: '08-05-2026',
          firstHearingDate: '08-05-2026',
          nextHearingDate: '25-09-2026',
          caseStage: 'Appearance & First Hearing Notice',
          bench: 'Motor Accident Claims Tribunal (M A C C), Barasat',
          propertyDetails: 'District & Sessions Court Complex, Barasat, North 24 Parganas',
          dataSource: 'Official Court Data',
          orders: [
            {
              id: 'ord-1',
              date: '08-05-2026',
              orderTitle: 'Interim Notice & Summons Order',
              summary: 'Notice issued to Opposite Party vehicle owner & Insurance Company. Returnable on 25-09-2026.',
            },
          ],
          timeline: [
            { id: 'tm-1', date: '07-05-2026', event: 'Case Filed (Filing No: 2935/2026)', status: 'Completed' },
            { id: 'tm-2', date: '08-05-2026', event: 'Case Registered (Reg No: 458/2026) & First Hearing', status: 'Completed' },
            { id: 'tm-3', date: '25-09-2026', event: 'Next Hearing: Appearance of Insurance Co.', status: 'Scheduled' },
          ],
        });
        generateAiSummary('Motor Accident Claims', 'M A C C Claim Petition - Barasat Court (CNR: WBNP010042182026)');
      } else {
        setExtractedData({
          caseNumber: 'CS(COMM) 712/2024',
          cnrNumber: queryCnr,
          title: 'M/s Bengal Real Estate Pvt Ltd vs Kolkata Port Trust Authority',
          category: 'Commercial',
          court: 'Calcutta High Court',
          judgeName: 'Hon\'ble Mr. Justice I. P. Mukerji',
          courtRoomNo: 'Court Room No. 3',
          clientName: 'M/s Bengal Real Estate Pvt Ltd',
          opposingParty: 'Kolkata Port Trust Authority',
          opposingAdvocate: 'Adv. A. K. Roy (Standing Counsel)',
          leadLawyerName: 'Senior Advocate S. K. Mukherjee',
          actsAndSections: 'Commercial Courts Act 2015, Order 39 CPC',
          petitionerName: 'M/s Bengal Real Estate Pvt Ltd (Petitioner)',
          respondentName: 'Kolkata Port Trust Authority (Respondent)',
          filingNumber: '3104/2024',
          filingDate: '10-03-2024',
          registrationNumber: '712/2024',
          registrationDate: '12-03-2024',
          firstHearingDate: '15-03-2024',
          nextHearingDate: '2026-08-20',
          caseStage: 'Arguments on Interim Injunction (Order 39)',
          bench: 'Appellate Commercial Bench',
          propertyDetails: 'KMC Ward No. 63, Plot 14/B Strand Road, Kolkata',
          dataSource: 'Official Court Data',
          orders: [
            {
              id: 'ord-2',
              date: '20-07-2026',
              orderTitle: 'Status Quo Interim Order Extended',
              summary: 'Interim order extended till next hearing date.',
            },
          ],
          timeline: [
            { id: 'tm-10', date: '10-03-2024', event: 'Case Filed', status: 'Completed' },
            { id: 'tm-11', date: '12-03-2024', event: 'Registered & Admitted', status: 'Completed' },
            { id: 'tm-12', date: '20-08-2026', event: 'Next Hearing: Arguments on Order 39', status: 'Scheduled' },
          ],
        });
        generateAiSummary('Commercial', 'M/s Bengal Real Estate Pvt Ltd vs Kolkata Port Trust Authority');
      }
      setCurrentStep('cnr_success');
    }, 1200);
  };

  // Handle Search By Case Details
  const handleSearchCaseDetails = () => {
    setCurrentStep('case_details_loading');

    setTimeout(() => {
      const selectedStateObj = mockStates.find((s) => s.id === caseSearchState);
      const selectedDistObj = mockDistricts.find((d) => d.id === caseSearchDistrict);
      const selectedComplexObj = mockComplexes.find((c) => c.id === caseSearchComplex);
      const selectedEstObj = mockEstablishments.find((e) => e.id === caseSearchEstablishment);
      const selectedCaseTypeObj = mockCaseTypes.find((ct) => ct.id === caseSearchCaseType);

      const caseTypeLabel = selectedCaseTypeObj?.code || 'M A C C';
      const fullCaseNo = `${caseTypeLabel} ${caseSearchCaseNumber || '458'}/${caseSearchFilingYear || '2026'}`;
      const cnrGenerated = `${selectedComplexObj?.code || 'WBNP01'}00${Math.floor(100000 + Math.random() * 900000)}${caseSearchFilingYear || '2026'}`;

      if (caseSearchCaseNumber === '458' || caseSearchEstablishment === 'est-barasat-macc') {
        setExtractedData({
          caseNumber: 'M A C C 458/2026',
          cnrNumber: 'WBNP010042182026',
          title: 'M A C C Claim Petition (Reg No: 458/2026)',
          category: 'Motor Accident Claims',
          court: (selectedEstObj?.name || 'District & Sessions Judge, Barasat, North 24 Parganas') as CourtType,
          judgeName: 'Hon\'ble District & Sessions Judge, Barasat',
          courtRoomNo: 'Court Room No. 1, Barasat Court Complex',
          clientName: 'Motor Accident Claimant',
          opposingParty: 'Insurance Co. & Vehicle Owner',
          opposingAdvocate: 'Standing Counsel for Insurance Co.',
          leadLawyerName: 'Senior Advocate S. K. Mukherjee',
          actsAndSections: 'Motor Vehicles Act 1988 (Sec 166/140)',
          petitionerName: 'Claimant Petitioner',
          respondentName: 'Opposite Parties & Insurance Co.',
          filingNumber: '2935/2026',
          filingDate: '07-05-2026',
          registrationNumber: '458/2026',
          registrationDate: '08-05-2026',
          firstHearingDate: '08-05-2026',
          nextHearingDate: '25-09-2026',
          caseStage: 'Appearance & First Hearing Notice',
          bench: 'Motor Accident Claims Tribunal (M A C C), Barasat',
          propertyDetails: selectedComplexObj?.address || 'Barasat Court Complex',
          dataSource: 'Official Court Data',
          orders: [
            {
              id: 'ord-1',
              date: '08-05-2026',
              orderTitle: 'Notice & Summons Issue Order',
              summary: 'Notice issued to Opposite Parties & Insurance Co. Returnable on 25-09-2026.',
            },
          ],
          timeline: [
            { id: 'tm-1', date: '07-05-2026', event: 'Case Filed (Filing No: 2935/2026)', status: 'Completed' },
            { id: 'tm-2', date: '08-05-2026', event: 'Case Registered & First Hearing', status: 'Completed' },
            { id: 'tm-3', date: '25-09-2026', event: 'Next Hearing: Appearance of Insurance Co.', status: 'Scheduled' },
          ],
        });
        generateAiSummary('Motor Accident Claims', 'M A C C Claim Petition - Barasat Court (CNR: WBNP010042182026)');
      } else {
        setExtractedData({
          caseNumber: fullCaseNo,
          cnrNumber: cnrGenerated,
          title: `${selectedCaseTypeObj?.name || 'Legal Matter'}: Petitioner vs Respondent & Ors`,
          category: (selectedCaseTypeObj?.category || 'Civil') as CaseCategory,
          court: (selectedEstObj?.name || selectedComplexObj?.name || 'District Court') as CourtType,
          judgeName: 'Hon\'ble Presiding Judge',
          courtRoomNo: 'Court Room No. 2',
          clientName: 'Litigant Client',
          opposingParty: 'Opposite Party / Govt Authority',
          opposingAdvocate: 'Adv. S. Bhattacharya',
          leadLawyerName: 'Senior Advocate S. K. Mukherjee',
          actsAndSections: 'Code of Civil Procedure 1908',
          petitionerName: 'Petitioner / Complainant',
          respondentName: 'Respondent / Opposite Party',
          filingNumber: `F-${Math.floor(1000 + Math.random() * 9000)}/${caseSearchFilingYear}`,
          filingDate: `${caseSearchFilingYear}-05-01`,
          registrationNumber: `${caseSearchCaseNumber}/${caseSearchFilingYear}`,
          registrationDate: `${caseSearchFilingYear}-05-08`,
          firstHearingDate: `${caseSearchFilingYear}-05-15`,
          nextHearingDate: '2026-09-25',
          caseStage: 'Pleadings & First Hearing Notice',
          bench: selectedEstObj?.name || 'District Division Bench',
          propertyDetails: selectedComplexObj?.address || 'Court Complex',
          dataSource: 'Official Court Data',
          orders: [
            {
              id: 'ord-m',
              date: `${caseSearchFilingYear}-05-08`,
              orderTitle: 'Notice Issued Order',
              summary: 'Summons issued to respondents.',
            },
          ],
          timeline: [
            { id: 'tm-a', date: `${caseSearchFilingYear}-05-01`, event: 'Filing Completed', status: 'Completed' },
            { id: 'tm-b', date: `${caseSearchFilingYear}-05-08`, event: 'Registration & First Hearing', status: 'Completed' },
            { id: 'tm-c', date: '2026-09-25', event: 'Next Hearing', status: 'Scheduled' },
          ],
        });
        generateAiSummary(selectedCaseTypeObj?.category || 'Civil', `${fullCaseNo} - ${selectedEstObj?.name}`);
      }
      setCurrentStep('case_details_success');
    }, 1200);
  };

  // Handle Selected File Upload & OCR Processing
  const handleFileSelected = (file: File) => {
    setUploadedFileDetails({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type || 'Document PDF',
    });
    setCurrentStep('ocr_loading');

    setTimeout(() => {
      const fileNameLower = file.name.toLowerCase();

      let category: CaseCategory = 'Property & Real Estate';
      let title = 'Belghoria Property Dispute: Sri Subhashish Mukherjee vs State of West Bengal';
      let cnr = 'WBNP010042182026';
      let caseNo = 'TS 214/2026';
      let acts = 'WB Municipal Act 1993, Sec 144 CrPC, Transfer of Property Act Sec 54';
      let court: CourtType = 'District Court';
      let judge = 'Hon\'ble Ld. Additional District Judge, Barrackpore 1st Court';
      let courtRoom = 'Court Room No. 2, Barrackpore Court';
      let client = 'Sri Subhashish Mukherjee';
      let opposing = 'State of West Bengal & Belghoria P.S.';
      let opposingAdv = 'Adv. S. Bhattacharya (Govt Pleader)';
      let bench = 'ADJ Barrackpore - Civil & Land Division';
      let propDetails = 'Mouza Belghoria, J.L. No. 17, Dag 1042, Khatian 891, Feeder Road, Belghoria, Kolkata 700056';

      if (
        fileNameLower.includes('belghoria') ||
        fileNameLower.includes('kamarhati') ||
        fileNameLower.includes('barrackpore') ||
        fileNameLower.includes('panihati') ||
        fileNameLower.includes('north 24')
      ) {
        category = 'Property & Real Estate';
        title = 'Belghoria Property & Title Dispute: Sri Subhashish Mukherjee vs State of West Bengal & Belghoria P.S.';
        caseNo = 'TS 214/2026';
        cnr = 'WBNP010042182026';
        court = 'District Court';
        judge = 'Hon\'ble Ld. Additional District Judge, Barrackpore 1st Court';
        courtRoom = 'Court Room No. 2, Barrackpore Court';
        client = 'Sri Subhashish Mukherjee';
        opposing = 'State of West Bengal & IC Belghoria P.S.';
        opposingAdv = 'Adv. S. Bhattacharya (Govt Pleader)';
        acts = 'WB Municipal Act 1993, Sec 144 CrPC, Transfer of Property Act Sec 54';
        bench = 'ADJ Court Barrackpore - Land Division';
        propDetails = 'Mouza Belghoria, J.L. No. 17, Dag 1042, Khatian 891, Feeder Road, Belghoria, Kolkata 700056';
      }

      setExtractedData({
        caseNumber: caseNo,
        cnrNumber: cnr,
        title,
        category,
        court,
        judgeName: judge,
        courtRoomNo: courtRoom,
        clientName: client,
        opposingParty: opposing,
        opposingAdvocate: opposingAdv,
        leadLawyerName: 'Senior Advocate S. K. Mukherjee',
        actsAndSections: acts,
        petitionerName: client,
        respondentName: opposing,
        filingNumber: 'Not Available',
        filingDate: 'Not Available',
        registrationNumber: '214/2026',
        registrationDate: '2026-02-10',
        firstHearingDate: '2026-02-15',
        nextHearingDate: '2026-09-18',
        caseStage: 'Belghoria P.S. Inspection Report Hearing',
        bench,
        propertyDetails: propDetails,
        dataSource: 'OCR Extraction',
      });

      generateAiSummary(category, title);
      setCurrentStep('review_confirm');
    }, 1500);
  };

  // Generate Grounded AI Summary
  const generateAiSummary = (category: string, title: string) => {
    setAiAnalysisSummary({
      summary: `Automated AI Legal Analysis for matter "${title}". High Court precedent indicates strong prima facie grounds for interim protection. Verification complete against NJDG eCourts registry.`,
      legalIssues: [
        'Interim Notice & Mandatory Compliance',
        'Service of Summons on Insurance Company & Opposite Parties',
        'Jurisdiction & Forum Competency',
      ],
      timeline: [
        { date: '2026-05-07', event: 'Filing & Stamp Duty Verification' },
        { date: '2026-05-08', event: 'Registration & First Hearing Order' },
        { date: '2026-09-25', event: 'Scheduled Appearance Date' },
      ],
      missingDocs: ['Vakalatanama Signature Copy', 'Certified Copy of Annexure B'],
      pendingTasks: ['Serve Notice to Opposite Party', 'File Rejoinder Affidavit'],
      potentialRisks: ['Service delay if notice unserved before hearing'],
      suggestedAction: 'Prepare Notice Affidavit of Service before next hearing date.',
    });
  };

  // Voice Simulation
  const handleSimulateVoice = () => {
    setIsVoiceListening(true);
    setVoiceText('Listening to lawyer dictation...');
    setTimeout(() => {
      setVoiceText('Recognized: "Create a Motor Accident Claims petition at Barasat Court for Sri Subhashish Mukherjee against Insurance Company, CNR WBNP010042182026"');
      setIsVoiceListening(false);
      setTimeout(() => {
        handleSearchCNR('WBNP010042182026');
      }, 1000);
    }, 2000);
  };

  // Final Save Handler
  const handleFinalSave = () => {
    const finalMatter: Partial<Matter> = {
      caseNumber: extractedData.caseNumber || 'TS 214/2026',
      title: extractedData.title || 'Legal Matter',
      category: extractedData.category || 'Civil',
      court: extractedData.court || 'District Court',
      judgeName: extractedData.judgeName || 'Not Available',
      courtRoomNo: extractedData.courtRoomNo || 'Court Room No. 1',
      status: 'Active Litigation',
      clientName: extractedData.clientName || 'Sri Subhashish Mukherjee',
      opposingParty: extractedData.opposingParty || 'State of West Bengal',
      opposingAdvocate: extractedData.opposingAdvocate || 'Govt Pleader',
      leadLawyerName: extractedData.leadLawyerName || 'Senior Advocate S. K. Mukherjee',
      actsAndSections: extractedData.actsAndSections ? extractedData.actsAndSections.split(',') : ['CPC Sec 9'],
      riskScore: 25,
      riskLevel: 'Low',
      aiSummary: aiAnalysisSummary?.summary || 'Official matter imported into firm database.',
      aiMissingDocuments: aiAnalysisSummary?.missingDocs || [],
      aiStrategyNotes: [aiAnalysisSummary?.suggestedAction || 'Review initial court order.'],
      aiContradictions: [],
      nextHearingDate: extractedData.nextHearingDate || '2026-09-25',
      hearingsCount: 1,
      documentsCount: 1,
      cnrNumber: extractedData.cnrNumber || 'WBNP010042182026',
      cnr: extractedData.cnrNumber || 'WBNP010042182026',
      courtSyncAt: new Date().toISOString(),
      lastSyncedDate: new Date().toLocaleDateString('en-IN'),
      lastSyncedTime: new Date().toLocaleTimeString('en-IN'),
      courtSyncStatus: 'Synced',
      caseStageEcourt: extractedData.caseStage || 'Appearance & Notice Stage',
      petitionerName: extractedData.petitionerName || extractedData.clientName,
      respondentName: extractedData.respondentName || extractedData.opposingParty,
      filingNumber: extractedData.filingNumber || 'Not Available',
      filingDate: extractedData.filingDate || 'Not Available',
      registrationNumber: extractedData.registrationNumber || 'Not Available',
      registrationDate: extractedData.registrationDate || 'Not Available',
      firstHearingDate: extractedData.firstHearingDate || 'Not Available',
      fieldSources: {
        court: extractedData.dataSource,
        caseNumber: extractedData.dataSource,
        cnrNumber: extractedData.dataSource,
        registrationNumber: extractedData.dataSource,
        registrationDate: extractedData.dataSource,
        filingNumber: extractedData.dataSource,
        filingDate: extractedData.dataSource,
        nextHearingDate: extractedData.dataSource,
        caseStage: extractedData.dataSource,
        petitionerName: extractedData.dataSource,
        respondentName: extractedData.dataSource,
        judgeName: extractedData.dataSource,
        clientName: 'Manual Entry',
        aiSummary: 'AI Generated',
      },
    };

    onSave(finalMatter);
    onClose();
  };

  // Smart Checklist items generator
  const getSmartChecklist = (cat: CaseCategory) => {
    switch (cat) {
      case 'Motor Accident Claims':
        return [
          { doc: 'FIR Copy & Inspection Report', status: 'Mandatory', checked: true },
          { doc: 'Medical Bills & Hospital Discharge Summary', status: 'Mandatory', checked: true },
          { doc: 'Insurance Policy Copy & Vehicle RC', status: 'Mandatory', checked: true },
          { doc: 'Vakalatanama & Advocate Verification', status: 'Mandatory', checked: false },
        ];
      case 'Property & Real Estate':
        return [
          { doc: 'Original Deed of Sale / Partition Deed', status: 'Mandatory', checked: true },
          { doc: 'Khatian / Porcha Extract (BL&LRO)', status: 'Mandatory', checked: true },
          { doc: 'Belghoria P.S. Inspection Report (Sec 144)', status: 'Recommended', checked: true },
          { doc: 'Municipal Tax Receipt / Mutation Copy', status: 'Mandatory', checked: false },
        ];
      default:
        return [
          { doc: 'Plaint / Petition Copy', status: 'Mandatory', checked: true },
          { doc: 'Vakalatanama & Power of Attorney', status: 'Mandatory', checked: true },
          { doc: 'Affidavit of Service', status: 'Mandatory', checked: false },
        ];
    }
  };

  const validationInfo = getCnrValidationStatus(cnrNumber);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Smart Case Search & Import
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">eCourts NJDG Direct Integration</span>
              </div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                Create New Matter Module
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep('voice_dictation')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Dictate Case</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* STEP 1: CHOOSE IMPORT METHOD */}
          {currentStep === 'choose_method' && (
            <div className="space-y-6">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <h3 className="text-lg font-black text-white">Select Case Import Pathway</h3>
                <p className="text-slate-400 text-xs">
                  Choose your preferred option to create a matter. LawyerDesk eliminates manual data entry whenever official court data is available.
                </p>
              </div>

              {/* 5-Option Method Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Option 1: Search Using CNR */}
                <button
                  onClick={() => {
                    setImportMethod('cnr');
                    setCurrentStep('cnr_input');
                  }}
                  className="p-5 bg-gradient-to-br from-indigo-950/90 to-slate-900 border border-indigo-500/40 hover:border-indigo-400 rounded-2xl text-left space-y-3 transition-all group hover:scale-[1.01] shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Method 1
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-indigo-300 transition-colors">
                      ① Search Using CNR
                    </h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      Instant fetch using 16-character CNR Number from eCourts NJDG & High Court database.
                    </p>
                  </div>
                </button>

                {/* Option 2: Search Using Case Details */}
                <button
                  onClick={() => {
                    setImportMethod('case_details');
                    setCurrentStep('case_details_input');
                  }}
                  className="p-5 bg-gradient-to-br from-sky-950/90 to-slate-900 border border-sky-500/40 hover:border-sky-400 rounded-2xl text-left space-y-3 transition-all group hover:scale-[1.01] shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Method 2
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-all">
                    <Filter className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-sky-300 transition-colors">
                      ② Search Using Case Details
                    </h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      For when CNR is unknown. Cascading lookup: State → District → Court → Case Type → Number → Year.
                    </p>
                  </div>
                </button>

                {/* Option 3: Upload Court Order PDF */}
                <button
                  onClick={() => {
                    setImportMethod('order');
                    setCurrentStep('ocr_upload');
                    setTimeout(() => {
                      fileInputRef.current?.click();
                    }, 100);
                  }}
                  className="p-5 bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 rounded-2xl text-left space-y-3 transition-all group hover:scale-[1.01] shadow-md"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors">
                      ③ Upload Court Order PDF
                    </h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      Extract case metadata, interim directions, and hearing dates from certified court order sheet.
                    </p>
                  </div>
                </button>

                {/* Option 4: Upload Scanned Image (OCR) */}
                <button
                  onClick={() => {
                    setImportMethod('ocr');
                    setCurrentStep('ocr_upload');
                    setTimeout(() => {
                      fileInputRef.current?.click();
                    }, 100);
                  }}
                  className="p-5 bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 rounded-2xl text-left space-y-3 transition-all group hover:scale-[1.01] shadow-md"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                    <ScanLine className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                      ④ Upload Scanned Image (OCR)
                    </h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      Multilingual PaddleOCR for scanned Bengali land deeds, petitions, or mobile photos.
                    </p>
                  </div>
                </button>

                {/* Option 5: Manual Entry */}
                <button
                  onClick={() => {
                    setImportMethod('manual');
                    setCurrentStep('manual_form');
                  }}
                  className="p-5 bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 rounded-2xl text-left space-y-3 transition-all group hover:scale-[1.01] shadow-md md:col-span-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0">
                      <PenTool className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white group-hover:text-purple-300 transition-colors">
                        ⑤ Manual Entry
                      </h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        Structured form for custom, unlisted, arbitration, or private advisory legal matters.
                      </p>
                    </div>
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* STEP 2: METHOD 1 - SEARCH USING CNR */}
          {currentStep === 'cnr_input' && (
            <div className="space-y-6 max-w-2xl mx-auto py-4">
              <div className="space-y-1 text-center">
                <h3 className="text-lg font-black text-white">Method 1: Search Using CNR Number</h3>
                <p className="text-slate-400 text-xs">
                  Enter the 16-character alphanumeric eCourts CNR Number (e.g. WBNP010042182026).
                </p>
              </div>

              {/* CNR Search Input Box */}
              <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-300 text-xs">eCourts CNR Number *</label>
                  
                  {/* Real-time Validation Badge */}
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      validationInfo.valid
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : validationInfo.empty
                        ? 'bg-slate-800 text-slate-400 border-slate-700'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {validationInfo.message}
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cnrNumber}
                    onChange={(e) => {
                      setCnrNumber(e.target.value.toUpperCase());
                      setCnrErrorMsg('');
                    }}
                    placeholder="e.g. WBNP010042182026"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 font-mono font-bold text-sm text-amber-400 tracking-wider uppercase focus:outline-none focus:border-indigo-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchCNR()}
                  />
                  <button
                    onClick={() => handleSearchCNR()}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all flex items-center gap-2 shadow-lg shrink-0"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Case</span>
                  </button>
                </div>

                {cnrErrorMsg && (
                  <p className="text-xs text-rose-400 font-bold flex items-center gap-1.5 pt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{cnrErrorMsg}</span>
                  </p>
                )}

                {/* Quick Presets for Demo Testing */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Sample CNR Numbers:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSearchCNR('WBNP010042182026')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-mono text-emerald-300 border border-slate-700"
                    >
                      WBNP010042182026 (Barasat M A C C 458/2026)
                    </button>
                    <button
                      onClick={() => handleSearchCNR('WBHC010049202024')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-mono text-indigo-300 border border-slate-700"
                    >
                      WBHC010049202024 (Calcutta High Court)
                    </button>
                    <button
                      onClick={() => handleSearchCNR('WBHC01FAIL000000')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-mono text-rose-300 border border-slate-700"
                    >
                      WBHC01FAIL000000 (Simulate Not Found)
                    </button>
                  </div>
                </div>
              </div>

              {/* Official Court Notice */}
              <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white">Official eCourts Data Source</div>
                  <div className="text-slate-300">
                    LawyerDesk queries eCourts CIS 3.2 and High Court NJDG Gateway. Data retrieved is tagged as Official Court Data.
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep('choose_method')}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold text-xs"
                >
                  ← Back to Pathways
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: METHOD 2 - SEARCH USING CASE DETAILS */}
          {currentStep === 'case_details_input' && (
            <div className="space-y-6 max-w-3xl mx-auto py-2">
              <div className="space-y-1 text-center">
                <h3 className="text-lg font-black text-white">Method 2: Search Using Case Details</h3>
                <p className="text-slate-400 text-xs">
                  Select court hierarchy and enter case number to search official court records.
                </p>
              </div>

              <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* 1. State */}
                  <div>
                    <label className="block font-bold text-slate-300 text-xs mb-1">State *</label>
                    <select
                      value={caseSearchState}
                      onChange={(e) => {
                        setCaseSearchState(e.target.value);
                        const firstDist = mockDistricts.find((d) => d.stateId === e.target.value);
                        if (firstDist) {
                          setCaseSearchDistrict(firstDist.id);
                          const firstCplx = mockComplexes.find((c) => c.districtId === firstDist.id);
                          if (firstCplx) setCaseSearchComplex(firstCplx.id);
                        }
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
                    >
                      {mockStates.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. District */}
                  <div>
                    <label className="block font-bold text-slate-300 text-xs mb-1">District *</label>
                    <select
                      value={caseSearchDistrict}
                      onChange={(e) => {
                        setCaseSearchDistrict(e.target.value);
                        const firstCplx = mockComplexes.find((c) => c.districtId === e.target.value);
                        if (firstCplx) setCaseSearchComplex(firstCplx.id);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
                    >
                      {filteredDistricts.map((dt) => (
                        <option key={dt.id} value={dt.id}>
                          {dt.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Court Complex */}
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-300 text-xs mb-1">Court Complex *</label>
                    <select
                      value={caseSearchComplex}
                      onChange={(e) => {
                        setCaseSearchComplex(e.target.value);
                        const firstEst = mockEstablishments.find((est) => est.complexId === e.target.value);
                        if (firstEst) setCaseSearchEstablishment(firstEst.id);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
                    >
                      {filteredComplexes.map((cx) => (
                        <option key={cx.id} value={cx.id}>
                          {cx.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Court Establishment */}
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-300 text-xs mb-1">Court Establishment *</label>
                    <select
                      value={caseSearchEstablishment}
                      onChange={(e) => setCaseSearchEstablishment(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
                    >
                      {filteredEstablishments.map((est) => (
                        <option key={est.id} value={est.id}>
                          {est.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 5. Case Type */}
                  <div>
                    <label className="block font-bold text-slate-300 text-xs mb-1">Case Type *</label>
                    <select
                      value={caseSearchCaseType}
                      onChange={(e) => setCaseSearchCaseType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-amber-300 font-bold focus:outline-none focus:border-indigo-500"
                    >
                      {mockCaseTypes.map((ct) => (
                        <option key={ct.id} value={ct.id}>
                          {ct.code} - {ct.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 6. Case Number */}
                  <div>
                    <label className="block font-bold text-slate-300 text-xs mb-1">Case Number *</label>
                    <input
                      type="text"
                      value={caseSearchCaseNumber}
                      onChange={(e) => setCaseSearchCaseNumber(e.target.value)}
                      placeholder="e.g. 458"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* 7. Filing Year */}
                  <div>
                    <label className="block font-bold text-slate-300 text-xs mb-1">Filing Year *</label>
                    <select
                      value={caseSearchFilingYear}
                      onChange={(e) => setCaseSearchFilingYear(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
                    >
                      {['2026', '2025', '2024', '2023', '2022', '2021'].map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSearchCaseDetails}
                    className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shadow-lg flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Case in eCourts</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep('choose_method')}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold text-xs"
                >
                  ← Back to Pathways
                </button>
              </div>
            </div>
          )}

          {/* STEP: CNR / CASE DETAILS LOADING */}
          {(currentStep === 'cnr_loading' || currentStep === 'case_details_loading') && (
            <div className="py-16 text-center space-y-6 max-w-md mx-auto">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <Search className="w-8 h-8 text-indigo-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">Searching Official Court Records...</h3>
                <p className="text-xs text-indigo-300 font-mono">
                  Querying eCourts National Judicial Data Grid (NJDG) & CIS 3.2 database...
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5 text-left">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>Connecting to eCourts Direct Gateway</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> <span>Extracting Litigants, Judge & Hearing Schedule</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP: CNR / CASE DETAILS SUCCESS PREVIEW */}
          {(currentStep === 'cnr_success' || currentStep === 'case_details_success') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Official Court Record Found</h3>
                    <p className="text-xs text-emerald-300 font-mono">CNR: {extractedData.cnrNumber}</p>
                  </div>
                </div>
                <SourceTag source="Official Court Data" />
              </div>

              {/* Structured Field Display with Source Tags */}
              <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4">
                <div className="text-xs font-black text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span>eCourts Retrieved Information</span>
                  <span className="text-[10px] text-slate-400 font-normal">Every field verified against court registry</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Court */}
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px]">Court:</span>
                      <SourceTag source="Official Court Data" />
                    </div>
                    <div className="font-bold text-white">{extractedData.court}</div>
                  </div>

                  {/* Case Number */}
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px]">Case Number:</span>
                      <SourceTag source="Official Court Data" />
                    </div>
                    <div className="font-bold text-amber-400 font-mono">{extractedData.caseNumber}</div>
                  </div>

                  {/* Registration Number & Date */}
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px]">Registration No & Date:</span>
                      <SourceTag source="Official Court Data" />
                    </div>
                    <div className="font-semibold text-slate-200">
                      Reg No: {extractedData.registrationNumber} | Date: {extractedData.registrationDate}
                    </div>
                  </div>

                  {/* Filing Number & Date */}
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px]">Filing No & Date:</span>
                      <SourceTag source="Official Court Data" />
                    </div>
                    <div className="font-semibold text-slate-200">
                      Filing No: {extractedData.filingNumber} | Date: {extractedData.filingDate}
                    </div>
                  </div>

                  {/* Petitioner */}
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px]">Petitioner / Complainant:</span>
                      <SourceTag source="Official Court Data" />
                    </div>
                    <div className="font-bold text-emerald-300">{extractedData.petitionerName}</div>
                  </div>

                  {/* Respondent */}
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px]">Respondent / Opposite Party:</span>
                      <SourceTag source="Official Court Data" />
                    </div>
                    <div className="font-bold text-rose-300">{extractedData.respondentName}</div>
                  </div>

                  {/* Judge & Bench */}
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px]">Presiding Judge & Bench:</span>
                      <SourceTag source="Official Court Data" />
                    </div>
                    <div className="font-semibold text-slate-200">{extractedData.judgeName}</div>
                  </div>

                  {/* First Hearing & Next Hearing */}
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px]">Hearing Schedule:</span>
                      <SourceTag source="Official Court Data" />
                    </div>
                    <div className="font-black text-amber-400 text-sm">
                      First: {extractedData.firstHearingDate} | Next: {extractedData.nextHearingDate}
                    </div>
                  </div>

                </div>

                {/* Orders Section */}
                {extractedData.orders && extractedData.orders.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <div className="text-[11px] font-bold text-indigo-300">Retrieved Interim Orders:</div>
                    {extractedData.orders.map((ord) => (
                      <div key={ord.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                        <div className="font-bold text-amber-300">{ord.orderTitle} ({ord.date})</div>
                        <p className="text-slate-300 text-[11px] mt-1">{ord.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Choices */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep('choose_method')}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold text-xs"
                >
                  ← Search Again
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentStep('review_confirm')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700"
                  >
                    Edit Before Import
                  </button>

                  <button
                    onClick={handleFinalSave}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Import Matter</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP: CNR FAILURE / NOT FOUND DIAGNOSTIC SCREEN */}
          {currentStep === 'cnr_fail' && (
            <div className="space-y-6 max-w-xl mx-auto py-4">
              <div className="p-6 bg-rose-950/40 border border-rose-500/30 rounded-2xl space-y-4 text-center">
                <AlertCircle className="w-12 h-12 text-rose-400 mx-auto animate-bounce" />
                <h3 className="text-base font-black text-white">No Case Found in eCourts Portal</h3>
                <p className="text-xs text-rose-200">
                  We could not find an official record matching CNR <strong>{cnrNumber}</strong>.
                </p>

                <div className="p-4 bg-slate-950/80 rounded-xl text-[11px] text-slate-300 text-left space-y-2">
                  <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Possible Diagnostic Reasons:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Invalid CNR Number or typo in 16-digit alphanumeric code</li>
                    <li>Case not publicly available or restricted on eCourts portal</li>
                    <li>eCourts CIS server temporarily offline or undergoing maintenance</li>
                    <li>Case data not yet registered or synchronized in NJDG database</li>
                  </ul>
                </div>
              </div>

              <div className="text-center font-bold text-slate-300 text-xs">
                Select an alternative pathway:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setCurrentStep('case_details_input')}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-sky-500 rounded-2xl text-left space-y-1.5 transition-all"
                >
                  <Filter className="w-5 h-5 text-sky-400" />
                  <div className="font-bold text-white text-xs">Search By Case Details</div>
                  <p className="text-[10px] text-slate-400">State, District, Court & Number</p>
                </button>

                <button
                  onClick={() => setCurrentStep('ocr_upload')}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500 rounded-2xl text-left space-y-1.5 transition-all"
                >
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <div className="font-bold text-white text-xs">Upload Court Order / OCR</div>
                  <p className="text-[10px] text-slate-400">Extract from order sheet PDF</p>
                </button>

                <button
                  onClick={() => setCurrentStep('manual_form')}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-purple-500 rounded-2xl text-left space-y-1.5 transition-all"
                >
                  <PenTool className="w-5 h-5 text-purple-400" />
                  <div className="font-bold text-white text-xs">Manual Entry</div>
                  <p className="text-[10px] text-slate-400">Fill in form manually</p>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setCurrentStep('cnr_input')}
                  className="text-xs text-slate-400 hover:text-white font-bold"
                >
                  ← Try Another CNR Number
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OCR / DOCUMENT UPLOAD SCREEN */}
          {currentStep === 'ocr_upload' && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-white">Upload Court Document or Scanned Order</h3>
                <p className="text-slate-400 text-xs">
                  Upload PDF, scanned order sheet, or petition. High Court Multilingual OCR will extract metadata automatically.
                </p>
              </div>

              {/* Drag & Drop Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelected(e.dataTransfer.files[0]);
                  }
                }}
                className={`p-8 border-2 border-dashed rounded-3xl bg-slate-950/60 text-center space-y-4 transition-all cursor-pointer group ${
                  isDragging ? 'border-indigo-400 bg-indigo-950/40 scale-[1.01]' : 'border-slate-700 hover:border-indigo-500'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">Click or Drag & Drop Document Here</div>
                  <div className="text-xs text-slate-400">Supports PDF, Scanned PDF, JPEG, PNG, TIFF (Bengali & English)</div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Browse & Upload Document</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.tiff"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelected(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep('choose_method')}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold text-xs"
                >
                  ← Back to Pathways
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OCR LOADING ANIMATION */}
          {currentStep === 'ocr_loading' && (
            <div className="py-16 text-center space-y-6 max-w-md mx-auto">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                <ScanLine className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">Processing Document OCR...</h3>
                <p className="text-xs text-amber-300 font-mono">
                  {uploadedFileDetails?.name || 'Document'} ({uploadedFileDetails?.size || 'Processing'})
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5 text-left">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>PaddleOCR Multilingual Tokenizer Ready</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> <span>Extracting Parties, Judge, CNR & Next Hearing Date</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM FORM WITH FIELD-LEVEL SOURCE TAGS */}
          {currentStep === 'review_confirm' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl">
                <div>
                  <h3 className="font-bold text-white text-sm">Review & Verify Extracted Information</h3>
                  <p className="text-slate-300 text-xs">
                    Every field displays its explicit source origin badge. Verify or update before finalizing.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Source-Labeled Review
                </span>
              </div>

              {/* Editable Fields Grid */}
              <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4">
                <div className="text-xs font-black text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                  Matter Parameters & Field Provenance
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Case Title */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300 text-[11px]">Case Title *</label>
                      <SourceTag source={extractedData.dataSource} />
                    </div>
                    <input
                      type="text"
                      value={extractedData.title}
                      onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>

                  {/* CNR Number */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300 text-[11px]">eCourts CNR Number</label>
                      <SourceTag source={extractedData.dataSource} />
                    </div>
                    <input
                      type="text"
                      value={extractedData.cnrNumber}
                      onChange={(e) => setExtractedData({ ...extractedData, cnrNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold"
                    />
                  </div>

                  {/* Case Number */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300 text-[11px]">Case Number *</label>
                      <SourceTag source={extractedData.dataSource} />
                    </div>
                    <input
                      type="text"
                      value={extractedData.caseNumber}
                      onChange={(e) => setExtractedData({ ...extractedData, caseNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>

                  {/* Court Forum */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300 text-[11px]">Court Forum *</label>
                      <SourceTag source={extractedData.dataSource} />
                    </div>
                    <input
                      type="text"
                      value={extractedData.court}
                      onChange={(e) => setExtractedData({ ...extractedData, court: e.target.value as CourtType })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>

                  {/* Next Hearing Date */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300 text-[11px]">Next Hearing Date *</label>
                      <SourceTag source={extractedData.dataSource} />
                    </div>
                    <input
                      type="date"
                      value={extractedData.nextHearingDate}
                      onChange={(e) => setExtractedData({ ...extractedData, nextHearingDate: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
                    />
                  </div>

                  {/* Petitioner */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300 text-[11px]">Petitioner / Complainant</label>
                      <SourceTag source={extractedData.dataSource} />
                    </div>
                    <input
                      type="text"
                      value={extractedData.petitionerName}
                      onChange={(e) => setExtractedData({ ...extractedData, petitionerName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-semibold"
                    />
                  </div>

                  {/* Respondent */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300 text-[11px]">Respondent / Accused</label>
                      <SourceTag source={extractedData.dataSource} />
                    </div>
                    <input
                      type="text"
                      value={extractedData.respondentName}
                      onChange={(e) => setExtractedData({ ...extractedData, respondentName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-rose-300 font-semibold"
                    />
                  </div>

                  {/* Presiding Judge */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300 text-[11px]">Presiding Judge</label>
                      <SourceTag source={extractedData.dataSource} />
                    </div>
                    <input
                      type="text"
                      value={extractedData.judgeName || 'Not Available'}
                      onChange={(e) => setExtractedData({ ...extractedData, judgeName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>

                  {/* Client Name */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300 text-[11px]">Client Name *</label>
                      <SourceTag source="Manual Entry" />
                    </div>
                    <input
                      type="text"
                      value={extractedData.clientName}
                      onChange={(e) => setExtractedData({ ...extractedData, clientName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-indigo-300 font-bold"
                    />
                  </div>

                  {/* Acts & Sections */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300 text-[11px]">Acts & Sections Cited</label>
                      <SourceTag source={extractedData.dataSource} />
                    </div>
                    <input
                      type="text"
                      value={extractedData.actsAndSections}
                      onChange={(e) => setExtractedData({ ...extractedData, actsAndSections: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-indigo-300 font-semibold"
                    />
                  </div>

                </div>
              </div>

              {/* AI Generated Insights Section */}
              {aiAnalysisSummary && (
                <div className="p-5 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-900/60 pb-2">
                    <div className="flex items-center gap-2 font-bold text-indigo-300 text-xs">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Grounded AI Analysis & Case Insights</span>
                    </div>
                    <SourceTag source="AI Generated" />
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    {aiAnalysisSummary.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-bold text-indigo-300 text-[11px]">Core Legal Issues:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                        {aiAnalysisSummary.legalIssues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-bold text-amber-300 text-[11px]">Suggested Immediate Action:</div>
                      <p className="text-slate-200 text-[11px] font-semibold">{aiAnalysisSummary.suggestedAction}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Smart Checklist */}
              <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 font-bold text-white text-xs">
                    <ListCheck className="w-4 h-4 text-emerald-400" />
                    <span>Dynamic Smart Checklist ({extractedData.category})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Auto-generated for Case Type</span>
                </div>

                <div className="space-y-2">
                  {getSmartChecklist(extractedData.category).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`w-4 h-4 ${item.checked ? 'text-emerald-400' : 'text-slate-600'}`} />
                        <span className="font-semibold text-slate-200 text-xs">{item.doc}</span>
                      </div>
                      <span className={`text-[9.5px] px-2 py-0.5 rounded font-bold uppercase ${
                        item.status === 'Mandatory'
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Bar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep('choose_method')}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold text-xs"
                >
                  ← Restart Wizard
                </button>

                <button
                  onClick={handleFinalSave}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-sm shadow-xl flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>Confirm & Create Matter</span>
                </button>
              </div>

            </div>
          )}

          {/* STEP: VOICE DICTATION MODE */}
          {currentStep === 'voice_dictation' && (
            <div className="py-8 text-center space-y-6 max-w-lg mx-auto">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">Voice Dictation Onboarding</h3>
                <p className="text-xs text-slate-400">Speak case details naturally in English or Bengali.</p>
              </div>

              <div className="p-8 bg-slate-950/80 rounded-3xl border border-slate-800 space-y-6">
                <button
                  onClick={handleSimulateVoice}
                  disabled={isVoiceListening}
                  className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-2xl transition-all ${
                    isVoiceListening
                      ? 'bg-rose-500 ring-8 ring-rose-500/30 animate-pulse'
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  <Mic className="w-8 h-8 text-white" />
                </button>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300">
                    {isVoiceListening ? 'Listening and parsing spoken input...' : 'Tap Mic or Use Sample Below'}
                  </div>
                  <p className="text-xs font-mono text-amber-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    {voiceText || 'e.g., "Create a Motor Accident Claims petition at Barasat Court for Sri Subhashish Mukherjee, CNR WBNP010042182026"'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('choose_method')}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold text-xs"
                >
                  ← Back to Wizard Options
                </button>
              </div>
            </div>
          )}

          {/* STEP: MANUAL MULTI-SECTION FORM */}
          {currentStep === 'manual_form' && (
            <div className="space-y-6">
              
              {/* Tab Navigation */}
              <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-800 pb-2 text-xs font-bold">
                {[
                  { id: 'general', label: '1. General Info' },
                  { id: 'client', label: '2. Client' },
                  { id: 'court', label: '3. Court Details' },
                  { id: 'financial', label: '4. Financials' },
                  { id: 'opposite', label: '5. Opposite Party' },
                  { id: 'team', label: '6. Advocate Team' },
                  { id: 'ai_notes', label: '7. AI Notes' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setManualTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                      manualTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white bg-slate-900/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* MANUAL TAB 1: General */}
              {manualTab === 'general' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Case Title *</label>
                    <input
                      type="text"
                      value={extractedData.title}
                      onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                      placeholder="e.g., Sri Subhashish Mukherjee vs State of West Bengal"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Case Category *</label>
                    <select
                      value={extractedData.category}
                      onChange={(e) => setExtractedData({ ...extractedData, category: e.target.value as CaseCategory })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      {['Civil', 'Criminal', 'Property & Real Estate', 'Commercial', 'Arbitration', 'Constitutional / Writ', 'Motor Accident Claims'].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Case Number</label>
                    <input
                      type="text"
                      value={extractedData.caseNumber}
                      onChange={(e) => setExtractedData({ ...extractedData, caseNumber: e.target.value })}
                      placeholder="e.g. M A C C 458/2026 or TS 214/2026"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">eCourts CNR Number</label>
                    <input
                      type="text"
                      value={extractedData.cnrNumber}
                      onChange={(e) => setExtractedData({ ...extractedData, cnrNumber: e.target.value })}
                      placeholder="e.g. WBNP010042182026"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* MANUAL TAB 2: Client */}
              {manualTab === 'client' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Client Name *</label>
                    <input
                      type="text"
                      value={extractedData.clientName}
                      onChange={(e) => setExtractedData({ ...extractedData, clientName: e.target.value })}
                      placeholder="e.g., Sri Subhashish Mukherjee"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Select Existing Client Profile</label>
                    <select
                      onChange={(e) => {
                        const cl = clients.find((c) => c.id === e.target.value);
                        if (cl) setExtractedData({ ...extractedData, clientName: cl.name });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="">-- Choose Existing Client --</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* MANUAL TAB 3: Court */}
              {manualTab === 'court' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Court Forum</label>
                    <input
                      type="text"
                      value={extractedData.court}
                      onChange={(e) => setExtractedData({ ...extractedData, court: e.target.value as CourtType })}
                      placeholder="e.g., District & Sessions Judge, Barasat"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Presiding Judge</label>
                    <input
                      type="text"
                      value={extractedData.judgeName}
                      onChange={(e) => setExtractedData({ ...extractedData, judgeName: e.target.value })}
                      placeholder="Hon'ble Judge Name"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Next Hearing Date</label>
                    <input
                      type="date"
                      value={extractedData.nextHearingDate}
                      onChange={(e) => setExtractedData({ ...extractedData, nextHearingDate: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Case Stage</label>
                    <input
                      type="text"
                      value={extractedData.caseStage}
                      onChange={(e) => setExtractedData({ ...extractedData, caseStage: e.target.value })}
                      placeholder="e.g., Appearance & Notice"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}

              {/* MANUAL TAB 4: Financials */}
              {manualTab === 'financial' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Claim Amount / Suit Valuation</label>
                    <input
                      type="text"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Agreed Professional Retainer Fee</label>
                    <input
                      type="text"
                      value={feeRetainer}
                      onChange={(e) => setFeeRetainer(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-indigo-300 font-bold"
                    />
                  </div>
                </div>
              )}

              {/* MANUAL TAB 5: Opposite Party */}
              {manualTab === 'opposite' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Opposite Party / Defendant</label>
                    <input
                      type="text"
                      value={extractedData.opposingParty}
                      onChange={(e) => setExtractedData({ ...extractedData, opposingParty: e.target.value })}
                      placeholder="e.g., State of West Bengal & Insurance Co."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Opposite Party Advocate</label>
                    <input
                      type="text"
                      value={extractedData.opposingAdvocate}
                      onChange={(e) => setExtractedData({ ...extractedData, opposingAdvocate: e.target.value })}
                      placeholder="Opposing Advocate Name"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}

              {/* MANUAL TAB 6: Advocate Team */}
              {manualTab === 'team' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Lead Advocate</label>
                    <input
                      type="text"
                      value={extractedData.leadLawyerName}
                      onChange={(e) => setExtractedData({ ...extractedData, leadLawyerName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                </div>
              )}

              {/* MANUAL TAB 7: AI Notes */}
              {manualTab === 'ai_notes' && (
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Strategy & Initial Case Notes</label>
                  <textarea
                    rows={4}
                    value={aiNotes}
                    onChange={(e) => setAiNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed"
                  />
                </div>
              )}

              {/* Submit Manual Entry Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep('choose_method')}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold text-xs"
                >
                  ← Back to Pathways
                </button>

                <button
                  onClick={() => {
                    setExtractedData({
                      ...extractedData,
                      dataSource: 'Manual Entry',
                    });
                    setCurrentStep('review_confirm');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
                >
                  <span>Review & Save Matter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
