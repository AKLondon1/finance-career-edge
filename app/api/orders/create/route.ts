import { NextResponse } from "next/server";
import { createOrder, isOrderStorageConfigured, updateOrder } from "@/lib/orders";
import { isPackageSlug } from "@/lib/productData";
import { isCurrencyCode } from "@/lib/pricing";
import { getStripeClient } from "@/lib/stripe";
import type { CurrencyCode } from "@/lib/pricing";
import type { IntakeSubmission } from "@/lib/types";

export const runtime = "nodejs";

type CreateOrderRequest = {
  currency?: string;
  intake?: Partial<IntakeSubmission>;
};

const checkoutUnavailable =
  "Secure checkout is temporarily unavailable. Please try again shortly.";

export async function POST(request: Request) {
  let body: CreateOrderRequest;

  try {
    body = (await request.json()) as CreateOrderRequest;
  } catch {
    return NextResponse.json(
      { error: "We could not prepare secure checkout. Please check your review details and try again." },
      { status: 400 },
    );
  }

  const validationError = validateOrderRequest(body);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (!isOrderStorageConfigured() && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: checkoutUnavailable }, { status: 503 });
  }

  const stripe = getStripeClient();

  if (!stripe) {
    return NextResponse.json({ error: checkoutUnavailable }, { status: 503 });
  }

  const intake = body.intake as IntakeSubmission;
  const currency = normaliseCurrency(body.currency);
  const appUrl = getAppUrl(request);

  try {
    const order = await createOrder({ currency, intake });
    const session = await stripe.checkout.sessions.create({
      cancel_url: `${appUrl}/checkout/cancel?package=${order.packageSlug}&currency=${order.currency}&orderId=${order.id}`,
      customer_email: intake.email,
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

function validateOrderRequest(body: CreateOrderRequest) {
  const intake = body.intake;

  if (!intake) {
    return "Please complete the review details before continuing to secure checkout.";
  }

  if (!intake.fullName?.trim()) {
    return "Enter your full name.";
  }

  if (!intake.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(intake.email)) {
    return "Enter a valid email address.";
  }

  if (!intake.targetRole?.trim()) {
    return "Enter the role or job title you are targeting.";
  }

  if (!isPackageSlug(intake.packageChoice)) {
    return "Please choose a review package.";
  }

  if (!intake.cvFileName && !intake.cvText?.trim()) {
    return "Upload your CV or paste the CV text.";
  }

  return null;
}

function normaliseCurrency(value: string | undefined): CurrencyCode {
  const upper = value?.toUpperCase() ?? null;
  return isCurrencyCode(upper) ? upper : "GBP";
}

function getAppUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  if (configured) {
    return configured;
  }

  return new URL(request.url).origin;
}
