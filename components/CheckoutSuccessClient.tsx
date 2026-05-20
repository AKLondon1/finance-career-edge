"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { InsightCard } from "@/components/InsightCard";
import { getPackageBySlug, isPackageSlug } from "@/lib/productData";
import { savePendingOrderId, saveVerifiedPurchase } from "@/lib/report-storage";
import type { CurrencyCode } from "@/lib/pricing";
import type { PackageSlug } from "@/lib/productData";
import type { ReportStatus } from "@/lib/types";

type VerificationState = "verifying" | "success" | "error";

type VerificationResponse = {
  verified?: boolean;
  error?: string;
  currency?: CurrencyCode;
  orderId?: string;
  packageName?: string;
  packageSlug?: PackageSlug;
  reportStatus?: ReportStatus;
  targetCompany?: string;
  targetRole?: string;
};

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerificationState>("verifying");
  const [message, setMessage] = useState("Confirming your secure checkout.");
  const [actionHref, setActionHref] = useState("/report");
  const [actionLabel, setActionLabel] = useState("View my report");
  const [successTitle, setSuccessTitle] = useState(
    "Your tailored report and CV draft are ready.",
  );

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setState("error");
      setMessage("We could not confirm checkout from this link.");
      return;
    }
    const checkoutSessionId = sessionId;

    async function verifyPayment() {
      try {
        const response = await fetch(
          `/api/checkout/session?session_id=${encodeURIComponent(checkoutSessionId)}`,
        );
        const data = (await response.json()) as VerificationResponse;

        if (!response.ok || !data.verified || !isPackageSlug(data.packageSlug) || !data.orderId) {
          throw new Error(data.error || "Payment could not be confirmed.");
        }

        const selectedPackage = getPackageBySlug(data.packageSlug);
        const reportHref = `/report?orderId=${encodeURIComponent(data.orderId)}`;
        savePendingOrderId(data.orderId);
        saveVerifiedPurchase({
          currency: data.currency ?? "GBP",
          orderId: data.orderId,
          packageName: data.packageName ?? selectedPackage.name,
          packageSlug: data.packageSlug,
          sessionId: checkoutSessionId,
          targetCompany: data.targetCompany,
          targetRole: data.targetRole,
          verifiedAt: new Date().toISOString(),
        });

        setActionHref(reportHref);
        if (data.reportStatus === "ready") {
          setActionLabel("View my report");
          setSuccessTitle("Your tailored report and CV draft are ready.");
        } else {
          setActionLabel("Prepare my report");
          setSuccessTitle("Payment confirmed.");
        }
        setState("success");
        setMessage("Your review details are ready for report preparation.");
      } catch (error) {
        setState("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Payment could not be confirmed. Please try again.",
        );
      }
    }

    void verifyPayment();
  }, [searchParams]);

  if (state === "verifying") {
    return (
      <InsightCard title="Confirming secure checkout" eyebrow="Payment verification" tone="spruce">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-spruce-soft border-t-spruce" />
          <p className="mt-5 max-w-md">{message}</p>
        </div>
      </InsightCard>
    );
  }

  if (state === "error") {
    return (
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-white p-6 text-center shadow-soft sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
          Checkout needs attention
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          We could not confirm your payment.
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-soft">{message}</p>
        <Button href="/intake" className="mt-7">
          Return to review details
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-white p-6 text-center shadow-soft sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
        Payment confirmed
      </p>
      <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
        {successTitle}
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-soft">
        {message}
      </p>
      <Button href={actionHref} className="mt-7">
        {actionLabel}
      </Button>
    </div>
  );
}
