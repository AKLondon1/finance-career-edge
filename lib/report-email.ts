import { sendEmail } from "@/lib/email";
import { buildSignedReportUrl } from "@/lib/report-links";
import type { OrderRecord } from "@/lib/types";

export async function sendReportReadyCustomerEmail(order: OrderRecord, appUrl: string) {
  if (
    order.status !== "paid" ||
    order.reportStatus !== "ready" ||
    order.packageSlug !== "ai-tailored-cv-report"
  ) {
    return { reason: "Report email is not available for this order.", sent: false };
  }

  const reportUrl = buildSignedReportUrl(order.id, appUrl);

  if (!reportUrl) {
    console.warn("Report-ready customer email skipped", {
      orderId: order.id,
      reason: "report-link-secret-not-configured",
    });
    return { reason: "Private report link is not configured.", sent: false };
  }

  const result = await sendEmail({
    subject: "Your Finance Career Edge report is ready",
    text: buildReportReadyEmailText(order, reportUrl),
    to: order.customerEmail,
  });

  if (!result.sent) {
    console.warn("Report-ready customer email was not sent", {
      orderId: order.id,
      reason: result.reason ?? "email-not-sent",
    });
  }

  return result;
}

function buildReportReadyEmailText(order: OrderRecord, reportUrl: string) {
  const greeting = order.customerName?.trim()
    ? `Hi ${order.customerName.trim()},`
    : "Hi,";
  const targetRole = order.targetRole
    ? `\nTarget role: ${order.targetRole}`
    : "";

  return [
    greeting,
    "",
    `Your ${order.packageName} is ready.${targetRole}`,
    "",
    "Open your private report link:",
    reportUrl,
    "",
    "Please keep this link safe. It gives access to your paid report.",
    "",
    "Finance Career Edge",
  ].join("\n");
}
