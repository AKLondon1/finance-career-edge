import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

type CheckoutRequestBody = {
  orderId?: string;
};

const checkoutUnavailable =
  "Secure checkout is temporarily unavailable. Please try again shortly.";

export async function POST(request: Request) {
  let body: CheckoutRequestBody;

  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json(
      { error: "We could not prepare secure checkout. Please check your review details and try again." },
      { status: 400 },
    );
  }

  if (!body.orderId) {
    return NextResponse.json(
      { error: "Please start from the review details page before continuing to secure checkout." },
      { status: 400 },
    );
  }

  const order = await getOrder(body.orderId);

  if (!order) {
    return NextResponse.json(
      { error: "Please start from the review details page before continuing to secure checkout." },
      { status: 404 },
    );
  }

  if (order.status === "paid") {
    return NextResponse.json(
      { error: "This order has already been confirmed." },
      { status: 409 },
    );
  }

  const stripe = getStripeClient();

  if (!stripe) {
    console.warn("Checkout unavailable: Stripe secret missing");
    return NextResponse.json({ error: checkoutUnavailable }, { status: 503 });
  }

  const appUrl = getAppUrl(request);

  try {
    const session = await stripe.checkout.sessions.create({
      cancel_url: `${appUrl}/checkout/cancel?package=${order.packageSlug}&currency=${order.currency}&orderId=${order.id}`,
      customer_email: order.customerEmail,
      line_items: [
        {
          price_data: {
            currency: order.currency.toLowerCase(),
            product_data: {
              description:
                "Downloadable tailored role report and new CV draft for this application.",
              name: order.packageName,
            },
            unit_amount: order.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        currency: order.currency,
        customerEmail: order.customerEmail,
        orderId: order.id,
        packageName: order.packageName,
        packageSlug: order.packageSlug,
        ...(order.targetCompany ? { targetCompany: order.targetCompany } : {}),
        targetRole: order.targetRole ?? "",
      },
      mode: "payment",
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.url) {
      await updateOrder(order.id, { status: "failed" });
      return NextResponse.json({ error: checkoutUnavailable }, { status: 500 });
    }

    await updateOrder(order.id, {
      status: "checkout_started",
      stripeSessionId: session.id,
    });

    return NextResponse.json({ checkoutUrl: session.url, orderId: order.id });
  } catch {
    return NextResponse.json({ error: checkoutUnavailable }, { status: 500 });
  }
}

function getAppUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  if (configured) {
    return configured;
  }

  return new URL(request.url).origin;
}
