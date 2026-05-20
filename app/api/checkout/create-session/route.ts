import { NextResponse } from "next/server";
import { getPackageBySlug, isPackageSlug } from "@/lib/productData";
import { getPackageUnitAmount, isCurrencyCode } from "@/lib/pricing";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

type CheckoutRequestBody = {
  packageSlug?: string;
  currency?: string;
  email?: string;
  targetRole?: string;
  targetCompany?: string;
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

  if (!isPackageSlug(body.packageSlug)) {
    return NextResponse.json(
      { error: "Please choose a review package before continuing to secure checkout." },
      { status: 400 },
    );
  }

  const requestedCurrency = body.currency?.toUpperCase() ?? null;
  const currency = isCurrencyCode(requestedCurrency) ? requestedCurrency : "GBP";
  const selectedPackage = getPackageBySlug(body.packageSlug);
  const stripe = getStripeClient();

  if (!stripe) {
    return NextResponse.json({ error: checkoutUnavailable }, { status: 503 });
  }

  const appUrl = getAppUrl(request);
  const targetRole = clean(body.targetRole) || "Senior finance role";
  const targetCompany = clean(body.targetCompany);

  try {
    const session = await stripe.checkout.sessions.create({
      cancel_url: `${appUrl}/checkout/cancel?package=${selectedPackage.slug}&currency=${currency}`,
      customer_email: isEmail(body.email) ? body.email : undefined,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              description: selectedPackage.description,
              name: selectedPackage.name,
            },
            unit_amount: getPackageUnitAmount(selectedPackage.slug, currency),
          },
          quantity: 1,
        },
      ],
      metadata: {
        currency,
        packageName: selectedPackage.name,
        packageSlug: selectedPackage.slug,
        ...(targetCompany ? { targetCompany } : {}),
        targetRole,
      },
      mode: "payment",
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.url) {
      return NextResponse.json({ error: checkoutUnavailable }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
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

function clean(value: string | undefined) {
  return value?.trim().slice(0, 500) ?? "";
}

function isEmail(value: string | undefined) {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}
