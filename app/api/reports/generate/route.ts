import { NextResponse } from "next/server";
import { generateReportForSubmission } from "@/lib/ai/generate-report";
import { buildCvDraftText, buildReportText } from "@/lib/downloads";
import {
  buildSubmissionFromOrder,
  getIntakeByOrderId,
  getOrder,
  getReportOutputByOrderId,
  saveReportOutput,
  updateOrder,
} from "@/lib/orders";

export const runtime = "nodejs";

type GenerateReportRequest = {
  orderId?: string;
};

const generationError =
  "We could not prepare your report at the moment. Please try again shortly.";

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

  const existingReport = await getReportOutputByOrderId(order.id);

  if (existingReport) {
    return NextResponse.json({ report: existingReport.reportJson, reportStatus: "ready" });
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

    return NextResponse.json({ report, reportStatus: "ready" });
  } catch {
    await updateOrder(order.id, { reportStatus: "failed" });
    return NextResponse.json({ error: generationError }, { status: 500 });
  }
}
