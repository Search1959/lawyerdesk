import {
  HelpCategory,
  HelpArticle,
  HelpVideo,
  HelpFAQ,
  ErrorTroubleItem,
  WalkthroughStep,
  ReleaseNoteItem,
  SupportTicket,
} from '../types/helpTypes';

export const helpCategories: HelpCategory[] = [
  {
    id: 'cat-getting-started',
    code: 'Getting Started',
    name: {
      en: 'Getting Started & Onboarding',
      hi: 'प्रारंभिक शुरुआत एवं ऑनबोर्डिंग',
      bn: 'সূচনা ও অনবোর্ডিং',
    },
    description: {
      en: 'System prerequisites, advocate bar reg setup, quick tour, and first legal case upload.',
      hi: 'सिस्टम पूर्वापेक्षित आवश्यकताएं, अधिवक्ता पंजीकरण, त्वरित दौरा एवं पहला केस अपलोड।',
      bn: 'সিস্টেম প্রয়োজনীয়তা, বার রেজিস্ট্রেশন সেটআপ এবং প্রথম আইনি মামলা আপলোড।',
    },
    iconName: 'Rocket',
    articleCount: 6,
    featured: true,
    order: 1,
  },
  {
    id: 'cat-dashboard',
    code: 'Dashboard',
    name: {
      en: 'Main Operating Dashboard',
      hi: 'मुख्य ऑपरेटर डैशबोर्ड',
      bn: 'প্রধান অপারেটিং ড্যাশবোর্ড',
    },
    description: {
      en: 'Overview of cause list agenda, hearing alerts, billing KPIs, and recent activity streams.',
      hi: 'कॉज़ लिस्ट एजेंडा, सुनवाई अलर्ट, बिलिंग एवं हालिया गतिविधियों का अवलोकन।',
      bn: 'কজ লিস্ট এজেন্ডা, শুনানি সতর্কতা, বিলিং এবং সাম্প্রতিক ক্রিয়াকলাপের বিবরণ।',
    },
    iconName: 'LayoutDashboard',
    articleCount: 4,
    featured: true,
    order: 2,
  },
  {
    id: 'cat-case-management',
    code: 'Case Management',
    name: {
      en: 'Case & Matter Management',
      hi: 'केस एवं फाइल प्रबंधन',
      bn: 'মামলা ও বিষয় পরিচালনা',
    },
    description: {
      en: 'Managing High Court & District Court litigations, CNR numbers, litigants, and court rooms.',
      hi: 'उच्च न्यायालय व जिला अदालत के मुकदमों, सीएनआर नंबरों व पक्षकारों का संचालन।',
      bn: 'হাইকোর্ট ও ডিস্ট্রিক্ট কোর্টের মামলা, CNR নম্বর ও মামলা পরিচালন ব্যবস্থা।',
    },
    iconName: 'Briefcase',
    articleCount: 8,
    featured: true,
    order: 3,
  },
  {
    id: 'cat-cause-list',
    code: 'Hearings',
    name: {
      en: 'Hearings & Daily Cause List',
      hi: 'सुनवाई एवं दैनिक कॉज लिस्ट',
      bn: 'শুনানি ও দৈনিক কজ লিস্ট',
    },
    description: {
      en: 'Auto-syncing court daily boards, bench assignment, pass-overs, and WhatsApp reminders.',
      hi: 'अदालती कॉज लिस्ट का स्वतः सिंक, बेंच आवंटन, पास-ओवर व व्हाट्सएप रिमाइंडर।',
      bn: 'আদালতের ডেইলি বোর্ড অটো-সিঙ্ক, বেঞ্চ অ্যালটমেন্ট ও হোয়াটসঅ্যাপ রিমাইন্ডার।',
    },
    iconName: 'CalendarDays',
    articleCount: 7,
    featured: true,
    order: 4,
  },
  {
    id: 'cat-ocr-docs',
    code: 'OCR',
    name: {
      en: 'Document Engine & PaddleOCR',
      hi: 'दस्तावेज़ इंजन एवं पैडल ओसीआर',
      bn: 'নথি ইঞ্জিন ও প্যাডেল ওসিআর',
    },
    description: {
      en: 'Multi-lingual scanned PDF parsing for Devanagari Hindi, Bengali, and English legal briefs.',
      hi: 'स्कैन किए गए हिंदी, बंगाली व अंग्रेजी कानूनी दस्तावेजों की उच्च-सटीक OCR प्रोसेसिंग।',
      bn: 'স্ক্যান করা হিন্দি, বাংলা ও ইংরেজি আইনি ফাইলের উচ্চ-সঠিক OCR প্রসেসিং।',
    },
    iconName: 'FileText',
    articleCount: 9,
    featured: true,
    order: 5,
  },
  {
    id: 'cat-ai-chat',
    code: 'AI Chat',
    name: {
      en: 'AI Legal Copilot & Grounded RAG',
      hi: 'एआई लीगल कोपायलट व ग्राउंडेड खोज',
      bn: 'এআই লিগ্যাল কোপাইলট ও RAG অনুসন্ধান',
    },
    description: {
      en: 'Query case briefs with exact citation page references, law acts, and zero hallucinations.',
      hi: 'सटीक पृष्ठ संदर्भों व कानूनों के साथ केस ब्रीफ पर सवाल पूछें।',
      bn: 'সঠিক পৃষ্ঠা রেফারেন্স ও আইনের ধারা সহ কেসের প্রশ্ন উত্তর অনুসন্ধান।',
    },
    iconName: 'MessageSquareCode',
    articleCount: 8,
    featured: true,
    order: 6,
  },
  {
    id: 'cat-ai-drafting',
    code: 'AI Drafting',
    name: {
      en: 'AI Automated Legal Drafting',
      hi: 'एआई स्वचालित कानूनी ड्राफ्टिंग',
      bn: 'এআই স্বয়ংক্রিয় আইনি ড্রাফটিং',
    },
    description: {
      en: 'Generating Writs, Written Arguments, Injunctions, and Bail Applications in minutes.',
      hi: 'रिट याचिका, लिखित बहस, निषेधाज्ञा व जमानत आवेदनों का त्वरित एआई निर्माण।',
      bn: 'রিট আবেদন, লিখিত যুক্তি ও জামিনের আবেদনের তাৎক্ষণিক এআই ড্রাফটিং।',
    },
    iconName: 'Bot',
    articleCount: 6,
    featured: true,
    order: 7,
  },
  {
    id: 'cat-billing',
    code: 'Billing',
    name: {
      en: 'GST Billing & Client Retainers',
      hi: 'जीएसटी बिलिंग एवं ग्राहक रिटेनर',
      bn: 'জিএসটি বিলিং ও ক্লায়েন্ট রিটেইনার',
    },
    description: {
      en: 'Creating 18% GST tax invoices, tracking fee disbursements, and unpaid fee collections.',
      hi: '18% जीएसटी टैक्स इनवॉइस का निर्माण, शुल्क रिकॉर्ड एवं बकाया भुगतान ट्रैक करना।',
      bn: '১৮% জিএসটি ইনভয়েস তৈরি, ফি ট্র্যাকিং এবং বকেয়া পেমেন্ট সংগ্রহ।',
    },
    iconName: 'Receipt',
    articleCount: 5,
    featured: true,
    order: 8,
  },
  {
    id: 'cat-whatsapp',
    code: 'WhatsApp',
    name: {
      en: 'WhatsApp & Automated Alerts',
      hi: 'व्हाट्सएप एवं स्वचालित अलर्ट',
      bn: 'হোয়াটসঅ্যাপ ও স্বয়ংক্রিয় অ্যালার্ট',
    },
    description: {
      en: 'Sending automated hearing date notifications, payment links, and statutory deadline alerts.',
      hi: 'सुनवाई तिथि, भुगतान लिंक एवं अदालत समयसीमा के स्वचालित व्हाट्सएप अलर्ट भेजना।',
      bn: 'শুনানির তারিখ, পেমেন্ট লিঙ্ক এবং আদালতের সময়সীমার হোয়াটসঅ্যাপ রিমাইন্ডার।',
    },
    iconName: 'MessageCircle',
    articleCount: 4,
    featured: true,
    order: 9,
  },
  {
    id: 'cat-settings-security',
    code: 'Settings',
    name: {
      en: 'Settings, RBAC & Security Audit',
      hi: 'सेटिंग्स, आरबीएसी एवं सुरक्षा ऑडिट',
      bn: 'সেটিংস, রোল পারমিশন ও সিকিউরিটি',
    },
    description: {
      en: 'Role-Based Access Control, firm user provisioning, and immutable audit logging.',
      hi: 'भूमिका-आधारित पहुंच नियंत्रण (RBAC), फर्म यूजर प्रबंधन व ऑडिट लॉग।',
      bn: 'রোল-ভিত্তিক এক্সেস কন্ট্রোল (RBAC), ফার্ম ইউজার এবং অডিট লগ।',
    },
    iconName: 'ShieldCheck',
    articleCount: 5,
    featured: true,
    order: 10,
  },
  {
    id: 'cat-troubleshooting',
    code: 'Troubleshooting',
    name: {
      en: 'Troubleshooting & Error Diagnostics',
      hi: 'समस्या निवारण एवं त्रुटि निदान',
      bn: 'ত্রুটি নিদান ও ট্রাবলশুটিং',
    },
    description: {
      en: 'Solving cause list sync timeouts, encrypted PDF errors, and authentication locks.',
      hi: 'कॉज़ लिस्ट सिंक टाइमआउट, पासवर्ड सुरक्षा एवं पासवर्ड रीसेट संबंधी समाधान।',
      bn: 'কজ লিস্ট সিঙ্ক টাইমআউট, পাসওয়ার্ড এনক্রিপ্টেড PDF সমাধান।',
    },
    iconName: 'AlertCircle',
    articleCount: 6,
    featured: true,
    order: 11,
  },
  {
    id: 'cat-release-notes',
    code: 'Release Notes',
    name: {
      en: 'Release Notes & Product Updates',
      hi: 'रिलीज़ नोट्स एवं उत्पाद अपडेट',
      bn: 'রিলিজ নোট ও সাম্প্রতিক আপডেট',
    },
    description: {
      en: 'Latest feature releases, PaddleOCR multi-gpu speedups, and High Court portal additions.',
      hi: 'नवीनतम सुविधा रिलीज़, ओसीआर स्पीड-अप और उच्च न्यायालय पोर्टल अपडेट।',
      bn: 'সর্বশেষ বৈশিষ্ট্য রিলিজ, ওসিআর স্পিড-আপ এবং নতুন হাইকোর্ট পোর্টাল সিঙ্ক।',
    },
    iconName: 'Sparkles',
    articleCount: 3,
    featured: true,
    order: 12,
  },
];

export const helpArticles: HelpArticle[] = [
  {
    id: 'art-101',
    categoryId: 'cat-cause-list',
    categoryName: 'Hearings & Daily Cause List',
    title: {
      en: 'How to Sync Daily Cause Lists from e-Courts & High Courts',
      hi: 'ई-कोर्ट्स और उच्च न्यायालयों से दैनिक कॉज लिस्ट कैसे सिंक करें',
      bn: 'ই-কোর্টস এবং হাইকোর্ট থেকে দৈনিক কজ লিস্ট কিভাবে সিঙ্ক করবেন',
    },
    shortDescription: {
      en: 'Automate daily hearing syncs using Bar Council Registration and Advocates Code.',
      hi: 'बार काउंसिल पंजीकरण संख्या द्वारा दैनिक अदालती सुनवाई स्वतः सिंक करें।',
      bn: 'বার কাউন্সিল রেজিস্ট্রেশন নম্বর দিয়ে প্রতিদিনের আদালতের শুনানি সিঙ্ক করুন।',
    },
    content: {
      en: `LawyerDesk AI connects directly to e-Courts Services, Delhi High Court, Bombay High Court, Calcutta High Court, Allahabad High Court, and NCLT/DRT portals. 

By registering your Bar Council ID (e.g. D/1042/2012) in Firm Settings, the system routinely polls cause lists every midnight at 02:00 AM IST.

### Key Benefits:
1. **Zero Manual Board Checking:** Automatically lists item numbers, court hall numbers, and judge benches.
2. **WhatsApp Notification Engine:** Send formatted WhatsApp alerts to litigants with one click.
3. **Conflict Detection:** Identifies overlapping hearings scheduled in different court rooms at the same hour.`,
      hi: `लॉयर्डेस्क एआई सीधे ई-कोर्ट सेवाओं, दिल्ली उच्च न्यायालय, बॉम्बे उच्च न्यायालय, कलकत्ता उच्च न्यायालय, इलाहाबाद उच्च न्यायालय और एनसीएलटी/डीआरटी पोर्टलों से जुड़ता है।

फर्म सेटिंग्स में अपना बार काउंसिल आईडी (उदा. D/1042/2012) पंजीकृत करके, सिस्टम हर मध्यरात्रि 02:00 बजे स्वचालित रूप से कॉज लिस्ट सिंक करता है।`,
      bn: `লয়ারডেস্ক এআই সরাসরি ই-কোর্ট সার্ভিস, দিল্লি হাইকোর্ট, বোম্বে হাইকোর্ট, কলকাতা হাইকোর্ট এবং এনসিএলটি পোর্টালের সাথে সংযুক্ত।`,
    },
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: {
          en: 'Go to Settings > Law Firm Profile',
          hi: 'सेटिंग्स > लॉ फर्म प्रोफ़ाइल पर जाएं',
          bn: 'সেটিংস > ল ফার্ম প্রোফাইলে যান',
        },
        description: {
          en: 'Enter your official Bar Council Advocate Registration Number and state bar code.',
          hi: 'अपना आधिकारिक बार काउंसिल अधिवक्ता पंजीकरण नंबर दर्ज करें।',
          bn: 'আপনার অফিসিয়াল বার কাউন্সিল অ্যাডভোকেট রেজিস্ট্রেশন নম্বর লিখুন।',
        },
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        tip: 'Ensure the State Bar prefix matches e-Courts format (e.g. D/ for Delhi, MAH/ for Maharashtra).',
      },
      {
        stepNumber: 2,
        title: {
          en: 'Open Hearings & Cause List View',
          hi: 'सुनवाई और कॉज लिस्ट दृश्य खोलें',
          bn: 'শুনানি এবং কজ লিস্ট ভিউ খুলুন',
        },
        description: {
          en: 'Click on "Hearings" in the main navigation sidebar.',
          hi: 'मुख्य नेविगेशन साइडबार में "सुनवाई" पर क्लिक करें।',
          bn: 'প্রধান নেভিগেশন সাইডবারে "শুনানি" টিপুন।',
        },
      },
      {
        stepNumber: 3,
        title: {
          en: 'Click "Auto-Sync Cause List"',
          hi: '"ऑटो-सिंक कॉज लिस्ट" पर क्लिक करें',
          bn: '"অটো-সিঙ্ক কজ লিস্ট" এ ক্লিক করুন',
        },
        description: {
          en: 'The system will pull fresh cause list items and map them to your active case files.',
          hi: 'सिस्टम नया कॉज लिस्ट डेटा खींचेगा और आपके केस फाइलों से जोड़ेगा।',
          bn: 'সিস্টেম নতুন কজ লিস্ট ডেটা সংগ্রহ করে সক্রিয় কেস ফাইলের সাথে মিলিয়ে দেবে।',
        },
      },
    ],
    tips: [
      'You can also set automated daily 08:00 AM WhatsApp summaries to be sent to your associate lawyers.',
      'Check the "Conflict Detector" badge if you have two matters listed in different Court Rooms simultaneously.',
    ],
    warnings: [
      'If High Court portals undergo captcha updates, click "Force Re-Sync" in the top right menu.',
    ],
    keywords: ['cause list', 'ecourts', 'hearing', 'court date', 'whatsapp alert', 'high court', 'district court', 'bar council'],
    version: 'v3.6.2',
    lastUpdated: '2026-07-20',
    estimatedReadTimeMin: 3,
    viewsCount: 1420,
    helpfulYesCount: 320,
    helpfulNoCount: 5,
    pdfDownloadUrl: '#',
    status: 'Published',
  },
  {
    id: 'art-102',
    categoryId: 'cat-ocr-docs',
    categoryName: 'Document Engine & PaddleOCR',
    title: {
      en: 'PaddleOCR Multi-Lingual Legal Brief & Evidence Parser',
      hi: 'पैडल ओसीआर बहुभाषी कानूनी दस्तावेज़ एवं साक्ष्य पार्सर',
      bn: 'প্যাডেল ওসিআর বহুভাষিক আইনি ফাইল ও প্রমাণ পার্সার',
    },
    shortDescription: {
      en: 'Parse scanned PDF files in Hindi (Devanagari), Bengali, and English with high vector accuracy.',
      hi: 'हिंदी, बंगाली और अंग्रेजी में स्कैन की गई पीडीएफ फाइलों का उच्च-सटीक ओसीआर निष्कर्षण।',
      bn: 'হিন্দি, বাংলা এবং ইংরেজিতে স্ক্যান করা পিডিএফ ফাইলের উচ্চ-সঠিক ওসিআর।',
    },
    content: {
      en: `LawyerDesk AI utilizes PaddleOCR 2.8 with deep legal domain fine-tuning. It processes blurry scanned petitions, handwritten trial court orders, police charge sheets (FIRs), and boundary annexures.

### Capabilities:
- **Languages Supported:** Devanagari Hindi, Bengali, Tamil, Telugu, and Legal English.
- **Auto-Chunking:** Automatically segments PDFs into page chunks with paragraph indexing.
- **Key Entity Extraction:** Identifies Statutory Acts, Sections (e.g. IPC Sec 420, NI Act Sec 138), Judge Names, and Date Stamps.`,
      hi: `लॉयर्डेस्क एआई पैडल ओसीआर 2.8 का उपयोग करता है। यह धुंधली याचिकाएं, हाथ से लिखे अदालती आदेश, पुलिस चार्जशीट (एफआईआर) और अनुबंध दस्तावेजों को प्रोसेस करता है।`,
      bn: `লয়ারডেস্ক এআই প্যাডেল ওসিআর ২.৮ ব্যবহার করে হ্যান্ডরিটেন বা স্ক্যান করা পিডিএফ সংকেত প্রসেস করে।`,
    },
    tips: [
      'Maximum file upload size per PDF is 250 MB.',
      'For encrypted or password-protected PDFs, remove the lock prior to uploading or enter the document password during upload.',
    ],
    keywords: ['ocr', 'paddleocr', 'scanned pdf', 'hindi ocr', 'bengali ocr', 'evidence', 'document engine', 'vector search'],
    version: 'v3.6.0',
    lastUpdated: '2026-07-18',
    estimatedReadTimeMin: 4,
    viewsCount: 2150,
    helpfulYesCount: 480,
    helpfulNoCount: 8,
    status: 'Published',
  },
  {
    id: 'art-103',
    categoryId: 'cat-ai-chat',
    categoryName: 'AI Legal Copilot & Grounded RAG',
    title: {
      en: 'Zero-Hallucination Legal AI RAG with Page Citations',
      hi: 'पृष्ठ उद्धरणों के साथ शून्य-भ्रांति एआई लीगल आरएजी',
      bn: 'পৃষ্ঠা সাইটেশন সহ শূন্য-ভ্রান্তি এআই আইনি অনুসন্ধান',
    },
    shortDescription: {
      en: 'Ask queries regarding thousands of document pages and get answers pinned to exact citations.',
      hi: 'हजारों पृष्ठों के दस्तावेज़ों से सवाल पूछें और सटीक पृष्ठ संख्या संदर्भ के साथ उत्तर पाएं।',
      bn: 'হাজার হাজার পৃষ্ঠার নথি থেকে প্রশ্ন করুন এবং নির্ভুল পৃষ্ঠা নম্বর সাইটেশন পান।',
    },
    content: {
      en: `Our Grounded Legal RAG engine combines Gemini 3.6 Flash with indexed vector embeddings of your matter file.

When you ask: *"What is the specific allegation against Defendant No. 2 regarding the bank guarantee?"*
The AI searches your uploaded OCR chunks and replies with exact quoted text alongside a clickable **[Page 14, Para 3 - Rejoinder Affidavit]** badge.`,
      hi: `हमारा ग्राउंडेड लीगल RAG इंजन जेमिनी 3.6 फ्लैश को आपके केस फाइल के इंडेक्स किए गए वेक्टर एम्बेडिंग के साथ जोड़ता है।`,
      bn: `আমাদের গ্রাউন্ডেড লিগ্যাল RAG ইঞ্জিন আপনার কেস ফাইলের ইমবেডিং ভেক্টরের সাথে কাজ করে।`,
    },
    keywords: ['rag', 'ai chat', 'citations', 'gemini', 'hallucination free', 'legal search', 'prompts'],
    version: 'v3.6.1',
    lastUpdated: '2026-07-22',
    estimatedReadTimeMin: 3,
    viewsCount: 1890,
    helpfulYesCount: 410,
    helpfulNoCount: 4,
    status: 'Published',
  },
  {
    id: 'art-104',
    categoryId: 'cat-billing',
    categoryName: 'GST Billing & Client Retainers',
    title: {
      en: 'Generating 18% GST Compliant Tax Invoices & Retainers',
      hi: '18% जीएसटी अनुपालन कर चालान एवं रिटेनर का निर्माण',
      bn: '১৮% জিএসটি কর ইনভয়েস এবং রিটেইনার তৈরি',
    },
    shortDescription: {
      en: 'How to issue legal tax invoices with CGST/SGST/IGST breakdown and export client receipts.',
      hi: 'सीजीएसटी/एसजीएसटी/आईजीएसटी विवरण के साथ कानूनी कर चालान कैसे जारी करें।',
      bn: 'সিজিএসটি/এসজিএসটি/আইজিএসটি বিবরণ সহ আইনি কর ইনভয়েস কিভাবে তৈরি করবেন।',
    },
    content: {
      en: `Legal services in India under SAC Code 998213 attract 18% GST. LawyerDesk AI handles tax invoice calculations, reverse charge mechanism (RCM) flags, and client GSTIN validation automatically.`,
      hi: `भारत में SAC कोड 998213 के तहत कानूनी सेवाओं पर 18% जीएसटी लागू होता है।`,
      bn: `ভারতে SAC কোড ৯৯৮২১৩ এর অধীনে আইনি পরিষেবায় ১৮% জিএসটি প্রযোজ্য।`,
    },
    keywords: ['billing', 'invoice', 'gst', 'sac code', 'tax', 'retainer', 'outstanding fees', 'payment'],
    version: 'v3.5.8',
    lastUpdated: '2026-07-15',
    estimatedReadTimeMin: 3,
    viewsCount: 980,
    helpfulYesCount: 210,
    helpfulNoCount: 2,
    status: 'Published',
  },
];

export const helpVideos: HelpVideo[] = [
  {
    id: 'vid-201',
    categoryId: 'cat-getting-started',
    title: {
      en: 'Mastering LawyerDesk AI in 10 Minutes - Full Walkthrough',
      hi: '10 मिनट में लॉयर्डेस्क एआई में महारत हासिल करें - संपूर्ण गाइड',
      bn: '১০ মিনিটে লয়ারডেস্ক এআই সম্পূর্ণ গাইড',
    },
    description: {
      en: 'Complete tour of Cause Lists, PaddleOCR document search, AI drafting, and GST invoices.',
      hi: 'कॉज़ लिस्ट, ओसीआर दस्तावेज़ खोज, एआई ड्राफ्टिंग और जीएसटी इनवॉइस की पूरी जानकारी।',
      bn: 'কজ লিস্ট, ওসিআর অনুসন্ধান, এআই ড্রাফটিং এবং জিএসটি ইনভয়েসের বিবরণ।',
    },
    duration: '09:45',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    viewsCount: 3420,
    keywords: ['getting started', 'overview', 'walkthrough', 'demo', 'tutorial'],
  },
  {
    id: 'vid-202',
    categoryId: 'cat-cause-list',
    title: {
      en: 'Automating Cause List Syncing & WhatsApp Alerts',
      hi: 'कॉज़ लिस्ट सिंक और व्हाट्सएप अलर्ट स्वचालित करना',
      bn: 'কজ লিস্ট সিঙ্ক এবং হোয়াটসঅ্যাপ সতর্কবার্তা স্বয়ংক্রিয় করা',
    },
    description: {
      en: 'How to setup advocate bar code polling and send 1-click WhatsApp hearing dates to clients.',
      hi: 'अधिवक्ता बार कोड पोलिंग सेट करने और क्लाइंट्स को व्हाट्सएप सुनवाई भेजने का तरीका।',
      bn: 'বার কোড পোলিং সেটআপ এবং ক্লায়েন্টকে হোয়াটসঅ্যাপে শুনানির বার্তা পাঠানো।',
    },
    duration: '05:30',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    viewsCount: 2180,
    keywords: ['cause list', 'whatsapp', 'alerts', 'hearing', 'ecourts'],
  },
  {
    id: 'vid-203',
    categoryId: 'cat-ocr-docs',
    title: {
      en: 'Processing Scanned Devanagari & Bengali PDFs with PaddleOCR',
      hi: 'पैडल ओसीआर के साथ स्कैन की गई हिंदी व बंगाली पीडीएफ प्रोसेस करना',
      bn: 'প্যাডেল ওসিআর দিয়ে স্ক্যান করা হিন্দি ও বাংলা পিডিএফ প্রসেসিং',
    },
    description: {
      en: 'Learn how LawyerDesk extracts text from low-quality trial court evidence scans.',
      hi: 'देखें कि लॉयर्डेस्क निम्न गुणवत्ता वाली निचली अदालत की साक्ष्य स्कैन से टेक्स्ट कैसे निकालता है।',
      bn: 'ট্রায়াল কোর্টের স্ক্যান থেকে টেক্সট বের করার পদ্ধতি জানুন।',
    },
    duration: '07:12',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    viewsCount: 1850,
    keywords: ['ocr', 'pdf', 'devanagari', 'bengali', 'scanned document'],
  },
  {
    id: 'vid-204',
    categoryId: 'cat-ai-drafting',
    title: {
      en: 'Drafting High Court Writs & Written Arguments in 3 Minutes',
      hi: '3 मिनट में हाई कोर्ट रिट और लिखित बहस ड्राफ्ट करना',
      bn: '৩ মিনিটে হাইকোর্ট রিট ও লিখিত যুক্তি ড্রাফটিং',
    },
    description: {
      en: 'Use pre-built legal templates and case brief references to generate court-ready drafts.',
      hi: 'कोर्ट-रेडी ड्राफ्ट तैयार करने के लिए लीगल टेम्प्लेट और केस संदर्भ का उपयोग करें।',
      bn: 'আইনি টেমপ্লেট এবং কেসের তথ্য ব্যবহার করে নির্ভুল ড্রাফট তৈরি।',
    },
    duration: '06:15',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=600&q=80',
    viewsCount: 2900,
    keywords: ['drafting', 'writs', 'written arguments', 'ai drafting', 'templates'],
  },
];

export const helpFAQs: HelpFAQ[] = [
  {
    id: 'faq-301',
    categoryId: 'cat-getting-started',
    question: {
      en: 'How do I add a new client to LawyerDesk AI?',
      hi: 'लॉयर्डेस्क एआई में नया ग्राहक (क्लाइंट) कैसे जोड़ें?',
      bn: 'লয়ারডেস্ক এআই-তে নতুন ক্লায়েন্ট কিভাবে যোগ করবেন?',
    },
    answer: {
      en: 'Navigate to "Client Management" from the main menu, click "+ Add Client", fill in the client contact details, state GSTIN (if applicable), and click Save. You can also send a Client Portal invitation email.',
      hi: 'मुख्य मेनू से "क्लाइंट मैनेजमेंट" पर जाएं, "+ ऐड क्लाइंट" पर क्लिक करें, संपर्क विवरण भरें और सेव करें।',
      bn: 'প্রধান মেনু থেকে "ক্লায়েন্ট ম্যানেজমেন্ট"-এ যান, "+ অ্যাড ক্লায়েন্ট" টিপুন, বিবরণ টাইপ করে সেভ করুন।',
    },
    keywords: ['add client', 'new client', 'client portal', 'contacts'],
    helpfulCount: 420,
  },
  {
    id: 'faq-302',
    categoryId: 'cat-ocr-docs',
    question: {
      en: 'How does PaddleOCR handle scanned documents and FIRs?',
      hi: 'पैडल ओसीआर स्कैन किए गए दस्तावेजों और एफआईआर को कैसे प्रोसेस करता है?',
      bn: 'প্যাডেল ওসিআর স্ক্যান করা নথি এবং এফআইআর কিভাবে প্রসেস করে?',
    },
    answer: {
      en: 'Our embedded PaddleOCR model runs multi-pass contrast enhancements on scanned files, identifies Devanagari Hindi or Bengali character glyphs, and converts them into searchable text chunks with vector embeddings.',
      hi: 'हमारा ओसीआर मॉडल स्कैन की गई फाइलों पर कंट्रास्ट सुधार चलाता है और उन्हें खोजने योग्य टेक्स्ट में बदलता है।',
      bn: 'আমাদের ওসিআর মডেল ফাইলগুলির বৈসাদৃশ্য উন্নত করে এবং তাদের অনুসন্ধানযোগ্য পাঠ্যে রূপান্তর করে।',
    },
    keywords: ['ocr', 'fir', 'scanned pdf', 'paddleocr', 'devanagari'],
    helpfulCount: 380,
  },
  {
    id: 'faq-303',
    categoryId: 'cat-billing',
    question: {
      en: 'How do I generate an 18% GST tax invoice for a client?',
      hi: 'ग्राहक के लिए 18% जीएसटी टैक्स इनवॉइस कैसे बनाएं?',
      bn: 'ক্লায়েন্টের জন্য ১৮% জিএসটি ট্যাক্স ইনভয়েস কিভাবে তৈরি করবেন?',
    },
    answer: {
      en: 'Go to "Outstanding & Billing", click "+ Create Invoice", select the client, pick fee items (e.g., Senior Counsel Appearance Fee, Drafting Charges), choose intra-state (CGST+SGST) or inter-state (IGST), and click "Generate PDF Invoice".',
      hi: '"आउटस्टैंडिंग एंड बिलिंग" पर जाएं, "+ क्रिएट इनवॉइस" पर क्लिक करें, शुल्क आइटम चुनें और "जनरेट पीडीएफ" पर क्लिक करें।',
      bn: '"আউটস্ট্যান্ডিং অ্যান্ড বিলিং"-এ যান, ইনভয়েস অপশন বেছে নিয়ে ফি বিবরণ যোগ করে পিডিএফ ডাউনলোড করুন।',
    },
    keywords: ['invoice', 'gst', 'tax invoice', 'billing', 'cgst', 'sgst'],
    helpfulCount: 510,
  },
  {
    id: 'faq-304',
    categoryId: 'cat-cause-list',
    question: {
      en: 'What should I do if a cause list does not auto-sync?',
      hi: 'यदि कॉज़ लिस्ट स्वतः सिंक न हो तो मुझे क्या करना चाहिए?',
      bn: 'কজ লিস্ট অটো-সিঙ্ক না হলে কী করবেন?',
    },
    answer: {
      en: 'First, verify your Bar Registration Number in Settings > Firm Profile. If the High Court portal captcha was recently updated, go to "Hearings" and click the "Force Re-Sync" button.',
      hi: 'पहले सेटिंग्स > फर्म प्रोफ़ाइल में अपना बार पंजीकरण नंबर सत्यापित करें। यदि समस्या बनी रहती है तो "फ़ोर्स री-सिंक" पर क्लिक करें।',
      bn: 'প্রথমে সেটিংস থেকে বার রেজিস্ট্রেশন নম্বরটি যাচাই করুন। এরপর "ফোর্স রি-সিঙ্ক" বাটনে টিপুন।',
    },
    keywords: ['cause list', 'sync error', 'force resync', 'bar registration'],
    helpfulCount: 290,
  },
  {
    id: 'faq-305',
    categoryId: 'cat-ai-chat',
    question: {
      en: 'How does AI Legal Copilot prevent hallucinations?',
      hi: 'एआई लीगल कोपायलट काल्पनिक उत्तरों (hallucinations) को कैसे रोकता है?',
      bn: 'এআই লিগ্যাল কোপायलট কিভাবে ভুল তথ্য এড়ায়?',
    },
    answer: {
      en: 'Our AI engine uses Grounded Retrieval Augmented Generation (RAG). It strictly restricts answers to text present in your uploaded case documents, with exact paragraph and page citations.',
      hi: 'हमारा एआई इंजन ग्राउंडेड आरएजी का उपयोग करता है जो केवल आपके अपलोड किए गए दस्तावेजों से ही उत्तर देता है।',
      bn: 'আমাদের এআই ইঞ্জিন কেবল আপনার আপলোড করা নথি থেকে সরাসরি উত্তর সংগ্রহ করে।',
    },
    keywords: ['hallucination', 'grounded rag', 'citations', 'ai chat'],
    helpfulCount: 640,
  },
];

export const errorTroubleshootingList: ErrorTroubleItem[] = [
  {
    id: 'err-401',
    errorCode: 'ERR_OCR_PDF_ENCRYPTED',
    problem: {
      en: 'Document OCR processing failed due to password protection or PDF encryption.',
      hi: 'पासवर्ड सुरक्षा या पीडीएफ एनक्रिप्शन के कारण दस्तावेज़ ओसीआर विफल रहा।',
      bn: 'পাসওয়ার্ড বা এনক্রিপশনের কারণে পিডিএফ ওসিআর ব্যর্থ হয়েছে।',
    },
    reason: {
      en: 'The uploaded PDF file contains a read/edit password lock applied by the source court or scanner.',
      hi: 'अपलोड की गई पीडीएफ फाइल में स्रोत अदालत या स्कैनर द्वारा पासवर्ड लॉक लगा है।',
      bn: 'আপলোড করা পিডিএফ ফাইলটি পাসওয়ার্ড দ্বারা সুরক্ষিত রয়েছে।',
    },
    solutionSteps: {
      en: [
        'Open the PDF in Adobe Reader or Web Browser.',
        'Enter the document password (e.g. litigant phone number or court case number).',
        'Print to PDF without password security, or enter the document password during upload.',
        'Re-upload the unlocked PDF into Document Engine.',
      ],
      hi: [
        'वेब ब्राउज़र या एडोब रीडर में पीडीएफ खोलें।',
        'दस्तावेज़ का पासवर्ड दर्ज करें।',
        'बिना सुरक्षा के दोबारा पीडीएफ सेव करें और पुनः अपलोड करें।',
      ],
      bn: [
        'ওয়েব ব্রাউজার বা পিডিএফে নথিটি খুলুন।',
        'পাসওয়ার্ড দিয়ে ফাইলটি আনলক করে পুনরায় আপলোড করুন।',
      ],
    },
    relatedArticleId: 'art-102',
    severity: 'Medium',
  },
  {
    id: 'err-402',
    errorCode: 'ERR_CAUSELIST_BAR_NO_MISMATCH',
    problem: {
      en: 'e-Courts Cause List Auto-Sync returned 0 listed hearings.',
      hi: 'ई-कोर्ट्स कॉज़ लिस्ट स्वतः सिंक में 0 सुनवाई दर्ज हुई।',
      bn: 'ই-কোর্ট কজ লিস্ট অটো-সিঙ্কে কোন শুনানি পাওয়া যায়নি।',
    },
    reason: {
      en: 'Advocate Bar Council Registration Number format mismatch or state code missing.',
      hi: 'अधिवक्ता बार काउंसिल पंजीकरण नंबर का प्रारूप या राज्य कोड मेल नहीं खाता।',
      bn: 'বার কাউন্সিল রেজিস্ট্রেশন নম্বরের ফরম্যাটে ভুল রয়েছে।',
    },
    solutionSteps: {
      en: [
        'Go to Settings > Law Firm Profile.',
        'Ensure registration contains full slash separators (e.g. D/1042/2012 instead of D104212).',
        'Click Save and test with "Force Cause List Sync".',
      ],
      hi: [
        'सेटिंग्स > लॉ फर्म प्रोफ़ाइल पर जाएं।',
        'जांचें कि स्लैश चिह्न मौजूद हैं (उदा. D/1042/2012)।',
        'सेव करें और पुनः सिंक करें।',
      ],
      bn: [
        'সেটিংসে গিয়ে স্ল্যাশ চিহ্নের সঠিক ব্যবহার সুনিশ্চিত করুন।',
      ],
    },
    relatedArticleId: 'art-101',
    severity: 'High',
  },
  {
    id: 'err-403',
    errorCode: 'ERR_GSTIN_INVALID_CHECKSUM',
    problem: {
      en: 'Client GSTIN checksum validation failed during invoice generation.',
      hi: 'चालान निर्माण के दौरान ग्राहक जीएसटीइन सत्यापन विफल रहा।',
      bn: 'ইনভয়েস তৈরির সময় ক্লায়েন্টের জিএসটিআইএন যাচাইকরণ ব্যর্থ হয়েছে।',
    },
    reason: {
      en: 'The 15-digit GSTIN entered contains typo errors in state code or PAN digits.',
      hi: 'दर्ज किए गए 15-अंकीय जीएसटीआईएन में राज्य कोड या पैन नंबर में टाइपो त्रुटि है।',
      bn: '১৫ সংখ্যার জিএসটিআইএন নম্বরে ভুল রয়েছে।',
    },
    solutionSteps: {
      en: [
        'Open Client Profile under Client Management.',
        'Verify GSTIN string on GST Portal (e.g. 07AAAAA0000A1Z5).',
        'Update GSTIN and re-run Invoice Generator.',
      ],
      hi: [
        'जीएसटी पोर्टल पर जीएसटीआईएन की जांच करें।',
        'क्लाइंट प्रोफ़ाइल में सही जीएसटीआईएन अपडेट करें।',
      ],
      bn: [
        'জিএসটি পোর্টালে নম্বরটি যাচাই করে নতুন করে টাইপ করুন।',
      ],
    },
    relatedArticleId: 'art-104',
    severity: 'Low',
  },
];

export const onboardingWalkthroughSteps: WalkthroughStep[] = [
  {
    stepId: 1,
    targetElementId: 'nav-dashboard',
    title: {
      en: 'Welcome to LawyerDesk AI',
      hi: 'लॉयर्डेस्क एआई में आपका स्वागत है',
      bn: 'লয়ারডেস্ক এআই-তে স্বাগতম',
    },
    description: {
      en: 'Your enterprise Legal Operating System for High Courts, District Courts, NCLT, and DRT practice.',
      hi: 'उच्च न्यायालय, जिला अदालत, एनसीएलटी व डीआरटी अभ्यास के लिए आपका एआई-संचालित कानूनी ऑपरेटिंग सिस्टम।',
      bn: 'হাইকোর্ট, ডিস্ট্রিক্ট কোর্ট ও এনসিএলটি প্র্যাকটিসের জন্য আপনার আইনি অপারেটিং সিস্টেম।',
    },
    badgeText: 'Step 1 of 5',
    actionText: 'Get Started',
  },
  {
    stepId: 2,
    targetElementId: 'nav-hearings',
    title: {
      en: 'Daily Cause List & Hearing Sync',
      hi: 'दैनिक कॉज़ लिस्ट एवं सुनवाई सिंक',
      bn: 'দৈনিক কজ লিস্ট ও শুনানি সিঙ্ক',
    },
    description: {
      en: 'Automatically fetch daily hearing boards from e-Courts and send 1-click WhatsApp reminders to clients.',
      hi: 'ई-कोर्ट्स से दैनिक सुनवाई बोर्ड स्वतः प्राप्त करें और ग्राहकों को 1-क्लिक व्हाट्सएप रिमाइंडर भेजें।',
      bn: 'ই-কোর্টস থেকে দৈনিক শুনানি বোর্ড অটো-সিঙ্ক করুন এবং হোয়াটসঅ্যাপে বার্তা পাঠান।',
    },
    badgeText: 'Step 2 of 5',
    actionText: 'Next: Document Engine',
  },
  {
    stepId: 3,
    targetElementId: 'nav-documents',
    title: {
      en: 'PaddleOCR Multi-Lingual Document Engine',
      hi: 'पैडल ओसीआर बहुभाषी दस्तावेज़ इंजन',
      bn: 'প্যাডেল ওসিআর ফাইল ইঞ্জিন',
    },
    description: {
      en: 'Upload scanned court petitions in Hindi, Bengali, or English for page-level OCR vector indexing.',
      hi: 'पेज-स्तर ओसीआर इंडेक्सिंग के लिए हिंदी, बंगाली या अंग्रेजी में केस पेटिशन अपलोड करें।',
      bn: 'হিন্দি, বাংলা বা ইংরেজিতে পেটিশন আপলোড করে ওসিআর সার্চ করুন।',
    },
    badgeText: 'Step 3 of 5',
    actionText: 'Next: AI Copilot',
  },
  {
    stepId: 4,
    targetElementId: 'nav-ai-chat',
    title: {
      en: 'Grounded AI Legal Copilot & RAG',
      hi: 'ग्राउंडेड एआई लीगल कोपायलट एवं आरएजी',
      bn: 'গ্রাউন্ডেড এআই আইনি কোপাইলট',
    },
    description: {
      en: 'Query case briefs with exact citation page badges and zero hallucinated facts.',
      hi: 'सटीक पृष्ठ उद्धरणों और शून्य काल्पनिक तथ्यों के साथ केस फाइलों से सवाल पूछें।',
      bn: 'নির্ভুল পৃষ্ঠা নম্বর সাইটেশন সহ কেসের যেকোনো প্রশ্নের উত্তর জানুন।',
    },
    badgeText: 'Step 4 of 5',
    actionText: 'Next: Billing & Invoices',
  },
  {
    stepId: 5,
    targetElementId: 'nav-billing',
    title: {
      en: '18% GST Tax Billing & Fee Alerts',
      hi: '18% जीएसटी टैक्स बिलिंग एवं फीस अलर्ट',
      bn: '১৮% জিএসটি ইনভয়েসিং ও ফি অ্যালার্ট',
    },
    description: {
      en: 'Generate compliant tax invoices, track retainer deposits, and collect outstanding fee dues.',
      hi: 'अनुपालन टैक्स चालान बनाएं, रिटेनर डिपॉजिट ट्रैक करें और बकाया शुल्क एकत्र करें।',
      bn: 'ইনভয়েস তৈরি করুন, রিটেইনার ট্র্যাক করুন এবং বকেয়া পেমেন্ট সংগ্রহ করুন।',
    },
    badgeText: 'Step 5 of 5',
    actionText: 'Finish Walkthrough',
  },
];

export const releaseNotesList: ReleaseNoteItem[] = [
  {
    id: 'rel-362',
    version: 'v3.6.2',
    releaseDate: 'July 24, 2026',
    title: 'WhatsApp Cloud API Integration & Direct Link Fallback Engine',
    summary: 'Direct 1-click WhatsApp reminders for hearings, appointments, statutory limitation deadlines, and GST fee invoices.',
    highlights: [
      'Added automated WhatsApp modal with template selectors for Hearing Alert, Appointment, Statutory Limitation, and Invoice Payment.',
      'Server-side audit logging for all dispatched WhatsApp messages with IP tracking.',
      'Support for Meta WhatsApp Cloud API credentials or web.whatsapp.link direct launch.',
    ],
    category: 'Major Feature',
  },
  {
    id: 'rel-361',
    version: 'v3.6.1',
    releaseDate: 'July 15, 2026',
    title: 'Grounded Gemini 3.6 Flash Legal RAG Upgrade',
    summary: 'Enhanced zero-hallucination vector retrieval with page and paragraph citations.',
    highlights: [
      'PaddleOCR 2.8 integration with Devanagari Hindi and Bengali language models.',
      'Clickable citation badges linking directly to PDF page previews.',
      '300% faster response latency for multi-gigabyte litigation files.',
    ],
    category: 'AI Enhancement',
  },
  {
    id: 'rel-360',
    version: 'v3.6.0',
    releaseDate: 'June 28, 2026',
    title: '18% GST Compliant Invoice & Retainer Module',
    summary: 'Complete legal fee management with automatic SAC code 998213 calculations.',
    highlights: [
      'Intra-state (CGST+SGST) and Inter-state (IGST) tax breakdown.',
      'Export invoices to PDF and track unpaid fee alerts.',
      'Client portal invoice viewing and fee payment logs.',
    ],
    category: 'Major Feature',
  },
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'tkt-1001',
    ticketNumber: 'TKT-2026-081',
    userId: 'usr-1',
    userName: 'Adv. Rajeshwar V. Sharma',
    userEmail: 'rajeshwar@sharmalegal.in',
    userPhone: '+91 98765 43210',
    firmName: 'Sharma & Associates Advocates',
    category: 'Cause List Sync',
    type: 'Question',
    priority: 'Medium',
    subject: 'Need help adding 3 new advocate codes for High Court daily cause list',
    description: 'We have inducted 3 junior associate advocates to our firm. How do we configure their state bar council codes in LawyerDesk so their daily court listings automatically merge into our firm cause list agenda?',
    status: 'In Progress',
    createdAt: '2026-07-25 11:30:00',
    updatedAt: '2026-07-25 14:15:00',
    comments: [
      {
        id: 'cm-1',
        ticketId: 'tkt-1001',
        authorName: 'LawyerDesk Support Engineering',
        authorRole: 'System Administrator',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        message: 'Respected Adv. Sharma, you can add multiple Advocate Bar Registration numbers in Settings > Firm Profile > Advocate Bar Codes list. Once saved, the cause list polling engine will fetch matters listed under all 3 associate codes.',
        createdAt: '2026-07-25 14:15:00',
        isStaff: true,
      },
    ],
  },
  {
    id: 'tkt-1002',
    ticketNumber: 'TKT-2026-079',
    userId: 'usr-2',
    userName: 'Adv. Vikramaditya Singh',
    userEmail: 'vikram@sharmalegal.in',
    category: 'OCR Engine',
    type: 'Bug',
    priority: 'Low',
    subject: 'OCR processing time for 250-page scanned petition file',
    description: 'Uploaded a 250-page trial court paperbook scan. It took approx 45 seconds to finish vector embedding. Suggesting a progress indicator percentage during processing.',
    status: 'Resolved',
    createdAt: '2026-07-22 09:10:00',
    updatedAt: '2026-07-23 16:00:00',
    comments: [
      {
        id: 'cm-2',
        ticketId: 'tkt-1002',
        authorName: 'LawyerDesk Support Engineering',
        authorRole: 'System Administrator',
        message: 'Thank you for the feedback Counsel! We have updated the PaddleOCR background job queue and added a live page processing progress bar in release v3.6.1.',
        createdAt: '2026-07-23 16:00:00',
        isStaff: true,
      },
    ],
  },
];
