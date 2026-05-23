import { sendEmail } from "@/lib/email";
import { getIntakeByOrderId } from "@/lib/orders";
import type { PackageSlug } from "@/lib/productData";
import { buildReviewReference } from "@/lib/review-reference";
import type { IntakeSubmissionRecord, OrderRecord, ReportStatus } from "@/lib/types";

export const SENIOR_REVIEW_REPORT_STATUS: ReportStatus = "awaiting_human_review";

export function getPaidReportStatusForPackage(
  packageSlug: PackageSlug,
  currentStatus: ReportStatus,
): ReportStatus {
  if (packageSlug === "senior-finance-review") {
    return SENIOR_REVIEW_REPORT_STATUS;
  }

  return currentStatus === "ready" ? "ready" : "not_started";
}

export async function sendSeniorReviewInternalNotification(order: OrderRecord) {
  if (order.packageSlug !== "senior-finance-review") {
    return { reason: "Order is not a Senior Finance Review.", sent: false };
  }

  const internalReviewEmail = process.env.INTERNAL_REVIEW_EMAIL;

  if (!internalReviewEmail) {
    console.warn("Senior review notification skipped", {
      orderId: order.id,
      reason: "internal-review-email-not-configured",
    });
    return { reason: "Internal review email is not configured.", sent: false };
  }

  try {
    const intake = await getIntakeByOrderId(order.id);
    const result = await sendEmail({
      subject: `Senior Finance Review submitted: ${buildReviewReference(order.id)}`,
      text: buildSeniorReviewInternalEmail(order, intake),
      to: internalReviewEmail,
    });

    if (!result.sent) {
      console.warn("Senior review notification was not sent", {
        orderId: order.id,
        reason: result.reason ?? "email-not-sent",
      });
    }

    return result;
  } catch {
    console.warn("Senior review notification failed", {
      orderId: order.id,
      stage: "prepare-notification",
    });
    return { reason: "Senior review notification could not be sent.", sent: false };
  }
}

export async function sendSeniorReviewCustomerConfirmation(order: OrderRecord) {
  if (order.packageSlug !== "senior-finance-review" || order.status !== "paid") {
    return { reason: "Order is not a paid Senior Finance Review.", sent: false };
  }

  const result = await sendEmail({
    subject: `Your Senior Finance Review reference: ${buildReviewReference(order.id)}`,
    text: buildSeniorReviewCustomerEmail(order),
    to: order.customerEmail,
  });

  if (!result.sent) {
    console.warn("Senior review customer confirmation was not sent", {
      orderId: order.id,
      reason: result.reason ?? "email-not-sent",
    });
  }

  return result;
}

function buildSeniorReviewInternalEmail(
  order: OrderRecord,
  intake: IntakeSubmissionRecord | null,
) {
  const hasCvEvidence = Boolean(intake?.cvText?.trim() || intake?.cvFileName);
  const lines = [
    "A Senior Finance Review has been submitted.",
    "",
    `Review reference: ${buildReviewReference(order.id)}`,
    `Order ID: ${order.id}`,
    `Customer name: ${order.customerName ?? "Not provided"}`,
    `Customer email: ${order.customerEmail}`,
    `Package: ${order.packageName}`,
    `Target role: ${order.targetRole ?? intake?.targetRole ?? "Not provided"}`,
    `Target company: ${order.targetCompany ?? intake?.targetCompany ?? "Not provided"}`,
    `Usable CV evidence exists: ${hasCvEvidence ? "Yes" : "No"}`,
    `CV file name: ${intake?.cvFileName ?? "Not provided"}`,
    `CV file type: ${intake?.cvFileType ?? "Not provided"}`,
    `CV file size: ${formatFileSize(intake?.cvFileSize)}`,
  ];

  addOptionalBlock(lines, "Job advert text", intake?.jobAdvertText);
  addOptionalBlock(lines, "Top achievements", intake?.topAchievements);
  addOptionalBlock(lines, "Main CV concerns", intake?.mainCvConcerns);

  lines.push(
    "",
    "Full CV text and private storage paths are intentionally not included in this email.",
  );

  return lines.join("\n");
}

function buildSeniorReviewCustomerEmail(order: OrderRecord) {
  const greeting = order.customerName?.trim()
    ? `Hi ${order.customerName.trim()},`
    : "Hi,";
  const targetRole = order.targetRole
    ? `\nTarget role: ${order.targetRole}`
    : "";

  return [
    greeting,
    "",
    "Payment has been received and your Senior Finance Review has been submitted.",
    "",
    `Review reference: ${buildReviewReference(order.id)}${targetRole}`,
    "",
    "The review adds human judgement on credibility, commercial positioning and role-fit for this application.",
    "",
    "You will receive reviewed output or next steps by email.",
    "",
    "Finance Career Edge",
  ].join("\n");
}

function addOptionalBlock(lines: string[], label: string, value: string | undefined) {
  if (!value?.trim()) {
    lines.push("", `${label}: Not provided`);
    return;
  }

  lines.push("", `${label}:`, truncateEmailField(value.trim()));
}

function truncateEmailField(value: string) {
  const maxLength = 3000;

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}\n[Truncated for email length]`;
}

function formatFileSize(value: number | undefined) {
  if (!value) {
    return "Not provided";
  }

  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}
