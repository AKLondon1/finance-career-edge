import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/app-url";
import { getOrder, getReportOutputByOrderId } from "@/lib/orders";
import { sendReportReadyCustomerEmail } from "@/lib/report-email";
import { verifyReportAccessToken } from "@/lib/report-links";

export const runtime = "nodejs";

type SendReportRequest = {
  orderId?: string;
  token?: string;
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

  if (!verifyReportAccessToken(order.id, body.token)) {
    return NextResponse.json(
      { sent: false, message: "Report email is not available from this link." },
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

  const result = await sendReportReadyCustomerEmail(
    { ...order, reportStatus: "ready" },
    getAppUrl(request),
  );

  return NextResponse.json(result);
}
