import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders";
import {
  getPaidReportStatusForPackage,
  sendSeniorReviewCustomerConfirmation,
  sendSeniorReviewInternalNotification,
} from "@/lib/senior-review";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.warn("Stripe webhook received before Stripe webhook configuration was available.");
    return NextResponse.json({ received: true });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Invalid webhook request." }, { status: 400 });
  }

  let event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook request." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        const order = await getOrder(orderId);
        const reportStatus = order
          ? getPaidReportStatusForPackage(order.packageSlug, order.reportStatus)
          : "not_started";
        await updateOrder(orderId, {
          reportStatus,
          status: "paid",
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : undefined,
          stripeSessionId: session.id,
        });

        if (
          order?.packageSlug === "senior-finance-review" &&
          order.reportStatus !== "awaiting_human_review"
        ) {
          const confirmedOrder = {
            ...order,
            reportStatus: "awaiting_human_review",
            status: "paid",
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : order.stripePaymentIntentId,
            stripeSessionId: session.id,
          } as const;

          await sendSeniorReviewInternalNotification(confirmedOrder);
          await sendSeniorReviewCustomerConfirmation(confirmedOrder);
        }
      } catch {
        console.warn("Stripe webhook could not update order payment status.");
      }
    }
  }

  return NextResponse.json({ received: true });
}
