import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import { isPackageSlug } from "@/lib/productData";
import { isCurrencyCode } from "@/lib/pricing";
import {
  getSupabaseConfigIssue,
  SupabaseRequestError,
} from "@/lib/supabase/server";
import type { CurrencyCode } from "@/lib/pricing";
import type { IntakeSubmission } from "@/lib/types";

export const runtime = "nodejs";

type CreateOrderRequest = {
  currency?: string;
  intake?: Partial<IntakeSubmission>;
};

const orderSetupError =
  "Order setup is temporarily unavailable. Please try again shortly.";

export async function POST(request: Request) {
  let body: CreateOrderRequest;

  try {
    body = (await request.json()) as CreateOrderRequest;
  } catch {
    return NextResponse.json(
      { error: "We could not save your review details. Please check the form and try again." },
      { status: 400 },
    );
  }

  const validationError = validateOrderRequest(body);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const configIssue = getSupabaseConfigIssue();

  if (configIssue === "missing-url") {
    console.warn("Order create failed: Supabase URL missing");
    return NextResponse.json({ error: orderSetupError }, { status: 503 });
  }

  if (configIssue === "missing-service-key") {
    console.warn("Order create failed: Supabase service key missing");
    return NextResponse.json({ error: orderSetupError }, { status: 503 });
  }

  try {
    const order = await createOrder({
      currency: normaliseCurrency(body.currency),
      intake: body.intake as IntakeSubmission,
    });

    return NextResponse.json({ order, orderId: order.id });
  } catch (error) {
    if (error instanceof SupabaseRequestError) {
      console.warn("Order create failed: Supabase insert error", {
        response: error.responseText,
        status: error.status,
      });
    } else {
      console.warn("Order create failed: Supabase insert error");
    }

    return NextResponse.json({ error: orderSetupError }, { status: 500 });
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
