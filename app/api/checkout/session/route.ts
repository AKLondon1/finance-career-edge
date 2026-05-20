import { NextResponse } from "next/server";
import { getOrder, getOrderByStripeSessionId, updateOrder } from "@/lib/orders";
import { getPackageBySlug, isPackageSlug } from "@/lib/productData";
import { getPackageUnitAmount, isCurrencyCode } from "@/lib/pricing";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

const verificationError =
  "Payment could not be confirmed. Please return to checkout or contact support if payment has been taken.";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ verified: false, error: verificationError }, { status: 400 });
  }

  const stripe = getStripeClient();

  if (!stripe) {
    return NextResponse.json({ verified: false, error: verificationError }, { status: 503 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadata = session.metadata ?? {};
    const packageSlug = metadata.packageSlug;
    const metadataCurrency = metadata.currency?.toUpperCase() ?? null;
    const orderId = metadata.orderId;

    if (!isPackageSlug(packageSlug) || !isCurrencyCode(metadataCurrency)) {
      return NextResponse.json({ verified: false, error: verificationError }, { status: 400 });
    }

    const order = orderId
      ? await getOrder(orderId)
      : await getOrderByStripeSessionId(session.id);

    if (!order) {
      return NextResponse.json({ verified: false, error: verificationError }, { status: 404 });
    }

    const selectedPackage = getPackageBySlug(packageSlug);
    const expectedAmount = getPackageUnitAmount(packageSlug, metadataCurrency);
    const sessionCurrency = session.currency?.toUpperCase();
    const isVerified =
      session.payment_status === "paid" &&
      session.amount_total === expectedAmount &&
      order.amount === expectedAmount &&
      order.currency === metadataCurrency &&
      sessionCurrency === metadataCurrency &&
      metadata.packageName === selectedPackage.name;

    if (!isVerified) {
      return NextResponse.json({ verified: false, error: verificationError }, { status: 402 });
    }

    const updatedOrder = await updateOrder(order.id, {
      reportStatus: order.reportStatus === "ready" ? "ready" : "not_started",
      status: "paid",
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : undefined,
      stripeSessionId: session.id,
    });

    return NextResponse.json({
      verified: true,
      currency: metadataCurrency,
      orderId: order.id,
      packageName: selectedPackage.name,
      packageSlug,
      reportStatus: updatedOrder?.reportStatus ?? order.reportStatus,
      targetCompany: metadata.targetCompany ?? "",
      targetRole: metadata.targetRole ?? "",
    });
  } catch {
    return NextResponse.json({ verified: false, error: verificationError }, { status: 500 });
  }
}
