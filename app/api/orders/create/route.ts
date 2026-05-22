import { NextResponse } from "next/server";
import { CvUploadError, storeCvFile, validateCvFile } from "@/lib/cv-upload";
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
  cvFile?: File | null;
};

const orderSetupError =
  "Order setup is temporarily unavailable. Please try again shortly.";

export async function POST(request: Request) {
  let body: CreateOrderRequest;

  try {
    body = await parseCreateOrderRequest(request);
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

  if (body.cvFile) {
    const fileValidationError = validateCvFile(body.cvFile);

    if (fileValidationError) {
      return NextResponse.json({ error: fileValidationError }, { status: 400 });
    }
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
    let intake = body.intake as IntakeSubmission;

    if (body.cvFile) {
      const storedFile = await storeCvFile(body.cvFile);
      intake = {
        ...intake,
        cvFileName: storedFile.cvFileName,
        cvFileSize: storedFile.cvFileSize,
        cvFileType: storedFile.cvFileType,
        cvStorageBucket: storedFile.cvStorageBucket,
        cvStoragePath: storedFile.cvStoragePath,
        cvText: intake.cvText?.trim() || storedFile.extractedText,
      };
    }

    const order = await createOrder({
      currency: normaliseCurrency(body.currency),
      intake,
    });

    return NextResponse.json({ order, orderId: order.id });
  } catch (error) {
    if (error instanceof CvUploadError) {
      console.warn("CV upload failed", {
        code: error.code,
        status: error.status,
      });

      return NextResponse.json(
        { error: "Your CV file could not be saved. Please try again or paste your CV text instead." },
        { status: error.status && error.status < 500 ? error.status : 503 },
      );
    }

    if (error instanceof SupabaseRequestError) {
      console.warn("Order create failed: Supabase insert error", {
        status: error.status,
      });
    } else {
      console.warn("Order create failed: Supabase insert error");
    }

    return NextResponse.json({ error: orderSetupError }, { status: 500 });
  }
}

async function parseCreateOrderRequest(request: Request): Promise<CreateOrderRequest> {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return (await request.json()) as CreateOrderRequest;
  }

  const formData = await request.formData();
  const intakeValue = formData.get("intake");
  const currencyValue = formData.get("currency");
  const cvFileValue = formData.get("cvFile");

  if (typeof intakeValue !== "string") {
    throw new Error("Missing intake payload.");
  }

  return {
    currency: typeof currencyValue === "string" ? currencyValue : undefined,
    cvFile: cvFileValue instanceof File && cvFileValue.size > 0 ? cvFileValue : null,
    intake: JSON.parse(intakeValue) as Partial<IntakeSubmission>,
  };
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

  if (!body.cvFile && !intake.cvText?.trim()) {
    return "Upload your CV or paste the CV text.";
  }

  if (intake.cvText?.trim() && intake.cvText.trim().length < 60) {
    return "Paste a little more CV text so the review has enough context.";
  }

  return null;
}

function normaliseCurrency(value: string | undefined): CurrencyCode {
  const upper = value?.toUpperCase() ?? null;
  return isCurrencyCode(upper) ? upper : "GBP";
}
