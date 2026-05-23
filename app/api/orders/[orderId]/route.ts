import { NextResponse } from "next/server";
import { getOrder, getReportOutputByOrderId } from "@/lib/orders";
import { buildSignedReportPath, verifyReportAccessToken } from "@/lib/report-links";

export const runtime = "nodejs";

type Params = {
  params: Promise<{
    orderId: string;
  }>;
};

const privateLinkError =
  "Use the private report link sent to the email address provided at checkout.";

export async function GET(request: Request, { params }: Params) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    return NextResponse.json(
      { error: "We could not find this order." },
      { status: 404 },
    );
  }

  if (order.status !== "paid") {
    return NextResponse.json(
      { error: "Secure checkout must be completed before this report is available." },
      { status: 403 },
    );
  }

  const token = new URL(request.url).searchParams.get("token");

  if (!verifyReportAccessToken(order.id, token)) {
    return NextResponse.json({ error: privateLinkError }, { status: 403 });
  }

  const reportOutput =
    order.status === "paid" && order.packageSlug === "ai-tailored-cv-report"
      ? await getReportOutputByOrderId(order.id)
      : null;
  const reportAccessPath = buildSignedReportPath(order.id);

  return NextResponse.json({
    order: {
      ...order,
      customerEmail: "",
    },
    report: reportOutput?.reportJson ?? null,
    reportAccessPath: reportAccessPath ?? undefined,
    reportStatus: order.reportStatus,
  });
}
