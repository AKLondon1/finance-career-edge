import { NextResponse } from "next/server";
import { getOrder, getReportOutputByOrderId } from "@/lib/orders";

export const runtime = "nodejs";

type Params = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    return NextResponse.json(
      { error: "We could not find this order." },
      { status: 404 },
    );
  }

  const reportOutput =
    order.status === "paid" ? await getReportOutputByOrderId(order.id) : null;

  return NextResponse.json({
    order,
    report: reportOutput?.reportJson ?? null,
    reportStatus: order.reportStatus,
  });
}
