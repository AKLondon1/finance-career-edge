import type { PackageSlug } from "@/lib/productData";
import type { CurrencyCode } from "@/lib/pricing";
import type { GeneratedReport, IntakeSubmission } from "@/lib/types";

export const reportStorageKey = "finance-career-edge-report";
export const intakeStorageKey = "finance-career-edge-intake";
export const pendingOrderStorageKey = "finance-career-edge-pending-order";
export const verifiedPurchaseStorageKey = "finance-career-edge-verified-purchase";

export type VerifiedPurchase = {
  orderId?: string;
  sessionId: string;
  packageSlug: PackageSlug;
  packageName: string;
  currency: CurrencyCode;
  targetRole?: string;
  targetCompany?: string;
  verifiedAt: string;
};

export function saveIntakeSubmission(submission: IntakeSubmission) {
  window.sessionStorage.setItem(intakeStorageKey, JSON.stringify(submission));
}

export function loadIntakeSubmission() {
  return loadJson<IntakeSubmission>(intakeStorageKey);
}

export function saveGeneratedReport(report: GeneratedReport) {
  window.sessionStorage.setItem(reportStorageKey, JSON.stringify(report));
}

export function loadGeneratedReport() {
  return loadJson<GeneratedReport>(reportStorageKey);
}

export function clearGeneratedReport() {
  window.sessionStorage.removeItem(reportStorageKey);
}

export function savePendingOrderId(orderId: string) {
  window.sessionStorage.setItem(pendingOrderStorageKey, orderId);
}

export function loadPendingOrderId() {
  return window.sessionStorage.getItem(pendingOrderStorageKey);
}

export function saveVerifiedPurchase(purchase: VerifiedPurchase) {
  window.sessionStorage.setItem(verifiedPurchaseStorageKey, JSON.stringify(purchase));
}

export function loadVerifiedPurchase() {
  return loadJson<VerifiedPurchase>(verifiedPurchaseStorageKey);
}

export function clearVerifiedPurchase() {
  window.sessionStorage.removeItem(verifiedPurchaseStorageKey);
}

function loadJson<T>(key: string) {
  const raw = window.sessionStorage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    window.sessionStorage.removeItem(key);
    return null;
  }
}
