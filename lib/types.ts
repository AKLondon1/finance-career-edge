import type { PackageSlug } from "@/lib/productData";
import type { CurrencyCode } from "@/lib/pricing";

export type IntakeSubmission = {
  fullName: string;
  email: string;
  targetRole: string;
  targetCompany?: string;
  jobAdvert?: string;
  cvFileName?: string;
  cvText?: string;
  achievements?: string;
  concerns?: string;
  packageChoice: PackageSlug;
  packageName: string;
  submittedAt: string;
};

export type OrderStatus = "created" | "checkout_started" | "paid" | "cancelled" | "failed";

export type ReportStatus = "not_started" | "generating" | "ready" | "failed";

export type OrderRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  customerEmail: string;
  customerName?: string;
  packageSlug: PackageSlug;
  packageName: string;
  currency: CurrencyCode;
  amount: number;
  status: OrderStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  targetRole?: string;
  targetCompany?: string;
  reportStatus: ReportStatus;
};

export type IntakeSubmissionRecord = {
  id: string;
  orderId: string;
  createdAt: string;
  cvText?: string;
  cvFileName?: string;
  targetRole?: string;
  targetCompany?: string;
  jobAdvertText?: string;
  topAchievements?: string;
  mainCvConcerns?: string;
};

export type ScoreAssessment = {
  label: string;
  score: number;
  text: string;
};

export type PriorityFix = {
  title: string;
  text: string;
};

export type RewriteExample = {
  before: string;
  after: string;
  why: string;
};

export type GeneratedReport = {
  id: string;
  candidateName: string;
  packageName: string;
  packageChoice: PackageSlug;
  targetRole: string;
  targetCompany?: string;
  score: number;
  executiveSummary: string;
  roleReport: {
    assessments: ScoreAssessment[];
    keywordGaps: string[];
    priorityFixes: PriorityFix[];
    strengths: string[];
    weaknesses: string[];
    missingSignals: string[];
    financeLanguageImprovements: string[];
  };
  cvDraft: {
    profile: string;
    coreSkills: string[];
    achievementBullets: string[];
    experienceExamples: RewriteExample[];
  };
  interviewPrep: string[];
  nextSteps: string[];
};

export type ReportOutputRecord = {
  id: string;
  orderId: string;
  createdAt: string;
  packageSlug: PackageSlug;
  targetRole?: string;
  targetCompany?: string;
  reportJson: GeneratedReport;
  reportText?: string;
  cvDraftText?: string;
};
