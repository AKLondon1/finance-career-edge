import { getPackageBySlug, isPackageSlug } from "@/lib/productData";
import type { PackageSlug } from "@/lib/productData";
import type { CurrencyCode } from "@/lib/pricing";
import { getPackageUnitAmount, isCurrencyCode } from "@/lib/pricing";
import { isSupabaseConfigured, supabaseRequest } from "@/lib/supabase/server";
import type {
  GeneratedReport,
  IntakeSubmission,
  IntakeSubmissionRecord,
  OrderRecord,
  OrderStatus,
  ReportOutputRecord,
  ReportStatus,
} from "@/lib/types";

type CreateOrderInput = {
  currency: CurrencyCode;
  intake: IntakeSubmission;
};

type OrderUpdate = Partial<{
  reportStatus: ReportStatus;
  status: OrderStatus;
  stripePaymentIntentId: string;
  stripeSessionId: string;
}>;

type OrderRow = {
  amount: number;
  created_at: string;
  currency: string;
  customer_email: string;
  customer_name: string | null;
  id: string;
  package_name: string;
  package_slug: string;
  report_status: string | null;
  status: string;
  stripe_payment_intent_id: string | null;
  stripe_session_id: string | null;
  target_company: string | null;
  target_role: string | null;
  updated_at: string;
};

type IntakeRow = {
  created_at: string;
  cv_file_name: string | null;
  cv_file_size: number | null;
  cv_file_type: string | null;
  cv_storage_bucket: string | null;
  cv_storage_path: string | null;
  cv_text: string | null;
  id: string;
  job_advert_text: string | null;
  main_cv_concerns: string | null;
  order_id: string;
  target_company: string | null;
  target_role: string | null;
  top_achievements: string | null;
};

type ReportOutputRow = {
  created_at: string;
  cv_draft_text: string | null;
  id: string;
  order_id: string;
  package_slug: string;
  report_json: GeneratedReport;
  report_text: string | null;
  target_company: string | null;
  target_role: string | null;
};

const fallbackOrders = new Map<string, OrderRecord>();
const fallbackIntakes = new Map<string, IntakeSubmissionRecord>();
const fallbackReports = new Map<string, ReportOutputRecord>();

export function isOrderStorageConfigured() {
  return isSupabaseConfigured();
}

export function canUseLocalOrderFallback() {
  return process.env.NODE_ENV !== "production";
}

export async function createOrder(input: CreateOrderInput) {
  const selectedPackage = getPackageBySlug(input.intake.packageChoice);
  const now = new Date().toISOString();
  const orderPayload = {
    amount: getPackageUnitAmount(selectedPackage.slug, input.currency),
    currency: input.currency,
    customer_email: input.intake.email,
    customer_name: input.intake.fullName || null,
    package_name: selectedPackage.name,
    package_slug: selectedPackage.slug,
    report_status: "not_started",
    status: "created",
    target_company: input.intake.targetCompany || null,
    target_role: input.intake.targetRole || null,
  };

  if (isOrderStorageConfigured()) {
    const orders = await supabaseRequest<OrderRow[]>("orders?select=*", {
      body: JSON.stringify(orderPayload),
      headers: {
        prefer: "return=representation",
      },
      method: "POST",
    });
    const order = mapOrderRow(orders[0]);

    await supabaseRequest<IntakeRow[]>("intake_submissions?select=*", {
      body: JSON.stringify({
        cv_file_name: input.intake.cvFileName || null,
        cv_file_size: input.intake.cvFileSize || null,
        cv_file_type: input.intake.cvFileType || null,
        cv_storage_bucket: input.intake.cvStorageBucket || null,
        cv_storage_path: input.intake.cvStoragePath || null,
        cv_text: input.intake.cvText || null,
        job_advert_text: input.intake.jobAdvert || null,
        main_cv_concerns: input.intake.concerns || null,
        order_id: order.id,
        target_company: input.intake.targetCompany || null,
        target_role: input.intake.targetRole || null,
        top_achievements: input.intake.achievements || null,
      }),
      headers: {
        prefer: "return=representation",
      },
      method: "POST",
    });

    return order;
  }

  if (!canUseLocalOrderFallback()) {
    throw new Error("Order storage is not configured.");
  }

  const order: OrderRecord = {
    amount: orderPayload.amount,
    createdAt: now,
    currency: input.currency,
    customerEmail: input.intake.email,
    customerName: input.intake.fullName || undefined,
    id: crypto.randomUUID(),
    packageName: selectedPackage.name,
    packageSlug: selectedPackage.slug,
    reportStatus: "not_started",
    status: "created",
    targetCompany: input.intake.targetCompany || undefined,
    targetRole: input.intake.targetRole || undefined,
    updatedAt: now,
  };

  fallbackOrders.set(order.id, order);
  fallbackIntakes.set(order.id, {
    createdAt: now,
    cvFileName: input.intake.cvFileName || undefined,
    cvFileSize: input.intake.cvFileSize || undefined,
    cvFileType: input.intake.cvFileType || undefined,
    cvStorageBucket: input.intake.cvStorageBucket || undefined,
    cvStoragePath: input.intake.cvStoragePath || undefined,
    cvText: input.intake.cvText || undefined,
    id: crypto.randomUUID(),
    jobAdvertText: input.intake.jobAdvert || undefined,
    mainCvConcerns: input.intake.concerns || undefined,
    orderId: order.id,
    targetCompany: input.intake.targetCompany || undefined,
    targetRole: input.intake.targetRole || undefined,
    topAchievements: input.intake.achievements || undefined,
  });

  return order;
}

export async function getOrder(orderId: string) {
  if (isOrderStorageConfigured()) {
    const rows = await supabaseRequest<OrderRow[]>(
      `orders?id=eq.${encodeURIComponent(orderId)}&select=*&limit=1`,
    );
    return rows[0] ? mapOrderRow(rows[0]) : null;
  }

  return fallbackOrders.get(orderId) ?? null;
}

export async function getOrderByStripeSessionId(sessionId: string) {
  if (isOrderStorageConfigured()) {
    const rows = await supabaseRequest<OrderRow[]>(
      `orders?stripe_session_id=eq.${encodeURIComponent(sessionId)}&select=*&limit=1`,
    );
    return rows[0] ? mapOrderRow(rows[0]) : null;
  }

  return [...fallbackOrders.values()].find((order) => order.stripeSessionId === sessionId) ?? null;
}

export async function updateOrder(orderId: string, update: OrderUpdate) {
  const payload: Record<string, string> = {
    updated_at: new Date().toISOString(),
  };

  if (update.status) {
    payload.status = update.status;
  }

  if (update.reportStatus) {
    payload.report_status = update.reportStatus;
  }

  if (update.stripeSessionId) {
    payload.stripe_session_id = update.stripeSessionId;
  }

  if (update.stripePaymentIntentId) {
    payload.stripe_payment_intent_id = update.stripePaymentIntentId;
  }

  if (isOrderStorageConfigured()) {
    const rows = await supabaseRequest<OrderRow[]>(
      `orders?id=eq.${encodeURIComponent(orderId)}&select=*`,
      {
        body: JSON.stringify(payload),
        headers: {
          prefer: "return=representation",
        },
        method: "PATCH",
      },
    );
    return rows[0] ? mapOrderRow(rows[0]) : null;
  }

  const existing = fallbackOrders.get(orderId);

  if (!existing) {
    return null;
  }

  const next = {
    ...existing,
    ...update,
    updatedAt: payload.updated_at,
  };
  fallbackOrders.set(orderId, next);
  return next;
}

export async function getIntakeByOrderId(orderId: string) {
  if (isOrderStorageConfigured()) {
    const rows = await supabaseRequest<IntakeRow[]>(
      `intake_submissions?order_id=eq.${encodeURIComponent(orderId)}&select=*&limit=1`,
    );
    return rows[0] ? mapIntakeRow(rows[0]) : null;
  }

  return fallbackIntakes.get(orderId) ?? null;
}

export async function getReportOutputByOrderId(orderId: string) {
  if (isOrderStorageConfigured()) {
    const rows = await supabaseRequest<ReportOutputRow[]>(
      `report_outputs?order_id=eq.${encodeURIComponent(orderId)}&select=*&limit=1`,
    );
    return rows[0] ? mapReportOutputRow(rows[0]) : null;
  }

  return fallbackReports.get(orderId) ?? null;
}

export async function saveReportOutput(
  order: OrderRecord,
  report: GeneratedReport,
  reportText: string,
  cvDraftText: string,
) {
  const now = new Date().toISOString();

  if (isOrderStorageConfigured()) {
    const rows = await supabaseRequest<ReportOutputRow[]>(
      "report_outputs?select=*&on_conflict=order_id",
      {
        body: JSON.stringify({
          cv_draft_text: cvDraftText,
          order_id: order.id,
          package_slug: order.packageSlug,
          report_json: report,
          report_text: reportText,
          target_company: order.targetCompany || null,
          target_role: order.targetRole || null,
        }),
        headers: {
          prefer: "resolution=merge-duplicates,return=representation",
        },
        method: "POST",
      },
    );
    await updateOrder(order.id, { reportStatus: "ready" });
    return mapReportOutputRow(rows[0]);
  }

  const output: ReportOutputRecord = {
    createdAt: now,
    cvDraftText,
    id: crypto.randomUUID(),
    orderId: order.id,
    packageSlug: order.packageSlug,
    reportJson: report,
    reportText,
    targetCompany: order.targetCompany,
    targetRole: order.targetRole,
  };
  fallbackReports.set(order.id, output);
  await updateOrder(order.id, { reportStatus: "ready" });
  return output;
}

export function buildSubmissionFromOrder(
  order: OrderRecord,
  intake: IntakeSubmissionRecord,
): IntakeSubmission {
  return {
    achievements: intake.topAchievements,
    concerns: intake.mainCvConcerns,
    cvFileName: intake.cvFileName,
    cvFileSize: intake.cvFileSize,
    cvFileType: intake.cvFileType,
    cvStorageBucket: intake.cvStorageBucket,
    cvStoragePath: intake.cvStoragePath,
    cvText: intake.cvText,
    email: order.customerEmail,
    fullName: order.customerName ?? "",
    jobAdvert: intake.jobAdvertText,
    packageChoice: order.packageSlug,
    packageName: order.packageName,
    submittedAt: intake.createdAt,
    targetCompany: intake.targetCompany ?? order.targetCompany,
    targetRole: intake.targetRole ?? order.targetRole ?? "",
  };
}

function mapOrderRow(row: OrderRow): OrderRecord {
  const packageSlug = isPackageSlug(row.package_slug) ? row.package_slug : "ai-tailored-cv-report";
  const currency = isCurrencyCode(row.currency) ? row.currency : "GBP";

  return {
    amount: row.amount,
    createdAt: row.created_at,
    currency,
    customerEmail: row.customer_email,
    customerName: row.customer_name ?? undefined,
    id: row.id,
    packageName: row.package_name,
    packageSlug,
    reportStatus: mapReportStatus(row.report_status),
    status: mapOrderStatus(row.status),
    stripePaymentIntentId: row.stripe_payment_intent_id ?? undefined,
    stripeSessionId: row.stripe_session_id ?? undefined,
    targetCompany: row.target_company ?? undefined,
    targetRole: row.target_role ?? undefined,
    updatedAt: row.updated_at,
  };
}

function mapIntakeRow(row: IntakeRow): IntakeSubmissionRecord {
  return {
    createdAt: row.created_at,
    cvFileName: row.cv_file_name ?? undefined,
    cvFileSize: row.cv_file_size ?? undefined,
    cvFileType: row.cv_file_type ?? undefined,
    cvStorageBucket: row.cv_storage_bucket ?? undefined,
    cvStoragePath: row.cv_storage_path ?? undefined,
    cvText: row.cv_text ?? undefined,
    id: row.id,
    jobAdvertText: row.job_advert_text ?? undefined,
    mainCvConcerns: row.main_cv_concerns ?? undefined,
    orderId: row.order_id,
    targetCompany: row.target_company ?? undefined,
    targetRole: row.target_role ?? undefined,
    topAchievements: row.top_achievements ?? undefined,
  };
}

function mapReportOutputRow(row: ReportOutputRow): ReportOutputRecord {
  return {
    createdAt: row.created_at,
    cvDraftText: row.cv_draft_text ?? undefined,
    id: row.id,
    orderId: row.order_id,
    packageSlug: isPackageSlug(row.package_slug) ? row.package_slug : "ai-tailored-cv-report",
    reportJson: row.report_json,
    reportText: row.report_text ?? undefined,
    targetCompany: row.target_company ?? undefined,
    targetRole: row.target_role ?? undefined,
  };
}

function mapOrderStatus(status: string): OrderStatus {
  if (
    status === "created" ||
    status === "checkout_started" ||
    status === "paid" ||
    status === "cancelled" ||
    status === "failed"
  ) {
    return status;
  }

  return "created";
}

function mapReportStatus(status: string | null): ReportStatus {
  if (
    status === "not_started" ||
    status === "generating" ||
    status === "ready" ||
    status === "failed" ||
    status === "awaiting_human_review"
  ) {
    return status;
  }

  return "not_started";
}
