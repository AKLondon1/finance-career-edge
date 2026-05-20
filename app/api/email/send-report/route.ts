import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { getOrder, getReportOutputByOrderId } from "@/lib/orders";

export const runtime = "nodejs";

type SendReportRequest = {
  orderId?: string;
};

export async function POST(request: Request) {
  let body: SendReportRequest;

  try {
    body = (await request.json()) as SendReportRequest;
  } catch {
    return NextResponse.json(
      { sent: false, message: "Report email could not be prepared." },
      { status: 400 },
    );
  }

  if (!body.orderId) {
    return NextResponse.json(
      { sent: false, message: "Report email could not be prepared." },
      { status: 400 },
    );
  }

  const order = await getOrder(body.orderId);

  if (!order || order.status !== "paid") {
    return NextResponse.json(
      { sent: false, message: "Report email is not available for this order." },
      { status: 403 },
    );
  }

  const reportOutput = await getReportOutputByOrderId(order.id);

  if (!reportOutput) {
    return NextResponse.json(
      { sent: false, message: "The report is not ready to email yet." },
      { status: 409 },
    );
  }

  const result = await sendEmail({
    subject: "Your Finance Career Edge report is ready",
    text:
      "Your tailored role report and new CV draft are ready. Return to Finance Career Edge to view and download both outputs.",
    to: order.customerEmail,
  });

  return NextResponse.json(result);
}
