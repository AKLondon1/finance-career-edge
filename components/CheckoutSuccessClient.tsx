"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { InsightCard } from "@/components/InsightCard";
import { ReportPreparationProgress } from "@/components/ReportPreparationProgress";
import { SeniorReviewStatusCard } from "@/components/SeniorReviewStatusCard";
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
  reportAccessPath?: string;
  reportAccessToken?: string;
  reportStatus?: ReportStatus;
  targetCompany?: string;
  targetRole?: string;
};

type GenerateResponse = {
  error?: string;
  reportAccessPath?: string;
  reportStatus?: ReportStatus;
};

export function CheckoutSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerificationState>("verifying");
  const [message, setMessage] = useState("Confirming your secure checkout.");
  const [actionHref, setActionHref] = useState("/report");
  const [actionLabel, setActionLabel] = useState("View my report");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [confirmedPackageSlug, setConfirmedPackageSlug] = useState<PackageSlug | null>(null);
  const [needsReportPreparation, setNeedsReportPreparation] = useState(false);
  const [isPreparingReport, setIsPreparingReport] = useState(false);
  const [prepareError, setPrepareError] = useState("");
  const [reportAccessPath, setReportAccessPath] = useState("");
  const [reportAccessToken, setReportAccessToken] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");
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
        const reportHref =
          data.reportAccessPath ?? `/report?orderId=${encodeURIComponent(data.orderId)}`;
        setOrderId(data.orderId);
        setConfirmedPackageSlug(data.packageSlug);
        setReportAccessPath(data.reportAccessPath ?? "");
        setReportAccessToken(data.reportAccessToken ?? "");
        setTargetCompany(data.targetCompany ?? "");
        setTargetRole(data.targetRole ?? "");
        savePendingOrderId(data.orderId);
        saveVerifiedPurchase({
          currency: data.currency ?? "GBP",
          orderId: data.orderId,
          packageName: data.packageName ?? selectedPackage.name,
          packageSlug: data.packageSlug,
          reportAccessPath: data.reportAccessPath,
          reportAccessToken: data.reportAccessToken,
          sessionId: checkoutSessionId,
          targetCompany: data.targetCompany,
          targetRole: data.targetRole,
          verifiedAt: new Date().toISOString(),
        });

        setActionHref(reportHref);
        if (data.packageSlug === "senior-finance-review") {
          setActionLabel("View review status");
          setNeedsReportPreparation(false);
          setSuccessTitle("Your Senior Finance Review is underway.");
          setMessage("Payment has been received and your review details have been submitted.");
        } else if (data.reportStatus === "ready") {
          setActionLabel("View my report");
          setNeedsReportPreparation(false);
          setSuccessTitle("Your tailored report and CV draft are ready.");
          setMessage("Your report is available to view and download.");
        } else {
          setActionLabel("Get my report");
          setNeedsReportPreparation(true);
          setSuccessTitle("Payment confirmed.");
          setMessage("Your review details are ready for report preparation.");
        }
        setState("success");
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

  async function handlePrepareReport() {
    if (!orderId || isPreparingReport) {
      return;
    }

    setIsPreparingReport(true);
    setPrepareError("");
    setMessage("Preparing your tailored report and new CV draft.");

    try {
      const response = await fetch("/api/reports/generate", {
        body: JSON.stringify({ orderId, token: reportAccessToken }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json()) as GenerateResponse;

      if (!response.ok || data.reportStatus !== "ready") {
        throw new Error(data.error || "We could not prepare your report. Please try again shortly.");
      }

      router.push(
        data.reportAccessPath ||
          reportAccessPath ||
          `/report?orderId=${encodeURIComponent(orderId)}`,
      );
    } catch (error) {
      setPrepareError(
        error instanceof Error
          ? error.message
          : "We could not prepare your report. Please try again shortly.",
      );
      setMessage("Payment is confirmed. You can try preparing your report again.");
      setIsPreparingReport(false);
    }
  }

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

  if (confirmedPackageSlug === "senior-finance-review") {
    return (
      <SeniorReviewStatusCard
        actionHref={actionHref}
        orderId={orderId ?? undefined}
        targetCompany={targetCompany}
        targetRole={targetRole}
      />
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
      {prepareError ? (
        <p className="mx-auto mt-4 max-w-xl rounded-[1.25rem] bg-[#f7efe2] p-4 text-sm leading-6 text-ink-soft">
          {prepareError}
        </p>
      ) : null}
      {isPreparingReport ? <ReportPreparationProgress active={isPreparingReport} /> : null}
      {needsReportPreparation ? (
        <Button
          className="mt-7"
          disabled={isPreparingReport}
          onClick={handlePrepareReport}
          type="button"
        >
          {isPreparingReport ? "Preparing your report..." : actionLabel}
        </Button>
      ) : (
        <Button href={actionHref} className="mt-7">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
