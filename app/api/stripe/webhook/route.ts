import { NextResponse } from "next/server";
import { updateOrder } from "@/lib/orders";
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
        await updateOrder(orderId, {
          reportStatus: "not_started",
          status: "paid",
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : undefined,
          stripeSessionId: session.id,
        });
      } catch {
        console.warn("Stripe webhook could not update order payment status.");
      }
    }
  }

  return NextResponse.json({ received: true });
}
