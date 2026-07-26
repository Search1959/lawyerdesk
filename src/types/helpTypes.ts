export type LanguageCode = 'en' | 'hi' | 'bn';

export type UserRoleAccess =
  | 'All'
  | 'System Administrator'
  | 'Firm Admin'
  | 'Senior Lawyer'
  | 'Staff'
  | 'Client';

export interface HelpCategory {
  id: string;
  code: string;
  name: {
    en: string;
    hi: string;
    bn: string;
  };
  description: {
    en: string;
    hi: string;
    bn: string;
  };
  iconName: string; // Lucide icon identifier
  articleCount?: number;
  featured?: boolean;
  order: number;
  roleAccess?: UserRoleAccess[];
}

export interface StepGuideItem {
  stepNumber: number;
  title: {
    en: string;
    hi: string;
    bn: string;
  };
  description: {
    en: string;
    hi: string;
    bn: string;
  };
  imageUrl?: string;
  tip?: string;
}

export interface HelpArticle {
  id: string;
  categoryId: string;
  categoryName: string;
  title: {
    en: string;
    hi: string;
    bn: string;
  };
  shortDescription: {
    en: string;
    hi: string;
    bn: string;
  };
  content: {
    en: string;
    hi: string;
    bn: string;
  };
  stepByStepGuide?: StepGuideItem[];
  screenshots?: { caption: string; url: string }[];
  gifAnimationUrl?: string;
  videoUrl?: string;
  tips?: string[];
  warnings?: string[];
  keywords: string[];
  relatedArticleIds?: string[];
  version: string;
  lastUpdated: string;
  estimatedReadTimeMin: number;
  viewsCount: number;
  helpfulYesCount: number;
  helpfulNoCount: number;
  pdfDownloadUrl?: string;
  roleAccess?: UserRoleAccess[];
  status: 'Published' | 'Draft' | 'Archived' | 'Scheduled';
  scheduledDate?: string;
}

export interface HelpVideo {
  id: string;
  categoryId: string;
  title: {
    en: string;
    hi: string;
    bn: string;
  };
  description: {
    en: string;
    hi: string;
    bn: string;
  };
  duration: string; // e.g. "4:15"
  videoUrl: string;
  thumbnailUrl: string;
  completed?: boolean;
  viewsCount: number;
  keywords: string[];
}

export interface HelpFAQ {
  id: string;
  categoryId: string;
  question: {
    en: string;
    hi: string;
    bn: string;
  };
  answer: {
    en: string;
    hi: string;
    bn: string;
  };
  keywords: string[];
  helpfulCount: number;
}

export interface ErrorTroubleItem {
  id: string;
  errorCode: string;
  problem: {
    en: string;
    hi: string;
    bn: string;
  };
  reason: {
    en: string;
    hi: string;
    bn: string;
  };
  solutionSteps: {
    en: string[];
    hi: string[];
    bn: string[];
  };
  relatedArticleId?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface WalkthroughStep {
  stepId: number;
  targetElementId: string;
  title: {
    en: string;
    hi: string;
    bn: string;
  };
  description: {
    en: string;
    hi: string;
    bn: string;
  };
  badgeText?: string;
  actionText?: string;
}

export interface ReleaseNoteItem {
  id: string;
  version: string;
  releaseDate: string;
  title: string;
  summary: string;
  highlights: string[];
  category: 'Major Feature' | 'Security Fix' | 'OCR Upgrade' | 'AI Enhancement' | 'Performance';
}

export interface SupportTicketComment {
  id: string;
  ticketId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  message: string;
  attachments?: string[];
  createdAt: string;
  isStaff: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  firmName?: string;
  category: string; // Bug Report, Feature Request, Billing Issue, Cause List Sync, OCR Engine, Other
  type: 'Bug' | 'Feature Request' | 'Question' | 'Urgent Issue';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  subject: string;
  description: string;
  screenshots?: string[];
  videoUrl?: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  comments: SupportTicketComment[];
}

export interface HelpSearchLog {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
  matchedArticleId?: string;
  isSuccessful: boolean;
  userId?: string;
}

export interface HelpAnalytics {
  totalViews: number;
  totalArticles: number;
  totalVideos: number;
  satisfactionRate: number; // Percentage positive ratings
  mostViewedArticles: { id: string; title: string; views: number }[];
  mostSearchedKeywords: { keyword: string; count: number }[];
  failedSearches: { query: string; count: number }[];
  ticketsSummary: { open: number; inProgress: number; resolved: number; closed: number };
}
