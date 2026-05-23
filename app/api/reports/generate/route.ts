import { NextResponse } from "next/server";
import { generateReportForSubmission } from "@/lib/ai/generate-report";
import { getAppUrl } from "@/lib/app-url";
import { buildCvDraftText, buildReportText } from "@/lib/downloads";
import {
  buildSubmissionFromOrder,
  getIntakeByOrderId,
  getOrder,
  getReportOutputByOrderId,
  saveReportOutput,
  updateOrder,
} from "@/lib/orders";
import { sendReportReadyCustomerEmail } from "@/lib/report-email";
import { buildSignedReportPath, verifyReportAccessToken } from "@/lib/report-links";
import { SENIOR_REVIEW_REPORT_STATUS } from "@/lib/senior-review";

export const runtime = "nodejs";

type GenerateReportRequest = {
  orderId?: string;
  token?: string;
};

const generationError =
  "We could not prepare your report at the moment. Please try again shortly.";
const privateLinkError =
  "Use the private report link sent to the email address provided at checkout.";

export async function POST(request: Request) {
  let body: GenerateReportRequest;

  try {
    body = (await request.json()) as GenerateReportRequest;
  } catch {
    return NextResponse.json({ error: generationError }, { status: 400 });
  }

  if (!body.orderId) {
    return NextResponse.json({ error: generationError }, { status: 400 });
  }

  const order = await getOrder(body.orderId);

  if (!order) {
    return NextResponse.json({ error: "We could not find this order." }, { status: 404 });
  }

  if (order.status !== "paid") {
    return NextResponse.json(
      { error: "Secure checkout must be completed before the report is prepared." },
      { status: 403 },
    );
  }

  if (!verifyReportAccessToken(order.id, body.token)) {
    return NextResponse.json({ error: privateLinkError }, { status: 403 });
  }

  if (order.packageSlug === "senior-finance-review") {
    if (order.reportStatus !== SENIOR_REVIEW_REPORT_STATUS) {
      try {
        await updateOrder(order.id, { reportStatus: SENIOR_REVIEW_REPORT_STATUS });
      } catch {
        console.warn("Senior review status could not be updated before generate block", {
          orderId: order.id,
        });
      }
    }

    return NextResponse.json(
      {
        error:
          "Your Senior Finance Review is being handled through the human review workflow.",
        reportStatus: SENIOR_REVIEW_REPORT_STATUS,
      },
      { status: 409 },
    );
  }

  const existingReport = await getReportOutputByOrderId(order.id);
  const reportAccessPath = buildSignedReportPath(order.id);

  if (existingReport) {
    return NextResponse.json({
      report: existingReport.reportJson,
      reportAccessPath: reportAccessPath ?? undefined,
      reportStatus: "ready",
    });
  }

  if (order.reportStatus === "generating") {
    return NextResponse.json(
      { error: "Your report is already being prepared. Please try again shortly." },
      { status: 409 },
    );
  }

  const intake = await getIntakeByOrderId(order.id);

  if (!intake) {
    return NextResponse.json({ error: generationError }, { status: 404 });
  }

  try {
    await updateOrder(order.id, { reportStatus: "generating" });
    const submission = buildSubmissionFromOrder(order, intake);
    const report = await generateReportForSubmission(submission);
    const reportText = buildReportText(report);
    const cvDraftText = buildCvDraftText(report);
    await saveReportOutput(order, report, reportText, cvDraftText);
    const reportEmail = await sendReportReadyCustomerEmail(
      { ...order, reportStatus: "ready" },
      getAppUrl(request),
    );

    return NextResponse.json({
      report,
      reportAccessPath: reportAccessPath ?? undefined,
      reportLinkEmailSent: reportEmail.sent,
      reportStatus: "ready",
    });
  } catch {
    await updateOrder(order.id, { reportStatus: "failed" });
    return NextResponse.json({ error: generationError }, { status: 500 });
  }
}
