"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { InsightCard } from "@/components/InsightCard";
import { ReportPreparationProgress } from "@/components/ReportPreparationProgress";
import { ReportActions } from "@/components/ReportActions";
import { ReportDashboard } from "@/components/ReportDashboard";
import { SeniorReviewStatusCard } from "@/components/SeniorReviewStatusCard";
import { normaliseReportSection } from "@/lib/report-sections";
import {
  loadGeneratedReport,
  loadIntakeSubmission,
  loadPendingOrderId,
  loadVerifiedPurchase,
  saveGeneratedReport,
} from "@/lib/report-storage";
import type { GeneratedReport, IntakeSubmission, OrderRecord, ReportStatus } from "@/lib/types";

type ReportState = {
  error?: string;
  report: GeneratedReport | null;
  intake: IntakeSubmission | null;
  isVerified: boolean;
  order: OrderRecord | null;
  orderId?: string;
  reportAccessPath?: string;
  reportAccessToken?: string;
  reportLinkEmailSent?: boolean;
  reportStatus?: ReportStatus;
};

type OrderResponse = {
  error?: string;
  order?: OrderRecord;
  report?: GeneratedReport | null;
  reportAccessPath?: string;
  reportStatus?: ReportStatus;
};

type GenerateResponse = {
  error?: string;
  report?: GeneratedReport;
  reportAccessPath?: string;
  reportLinkEmailSent?: boolean;
  reportStatus?: ReportStatus;
};

export function ReportPageClient() {
  const searchParams = useSearchParams();
  const activeSection = normaliseReportSection(searchParams.get("section"));
  const [reportState, setReportState] = useState<ReportState>({
    order: null,
    intake: null,
    isVerified: false,
    report: null,
  });
  const [isReady, setIsReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function loadReportState() {
      const verifiedPurchase = loadVerifiedPurchase();
      const requestedOrderId =
        searchParams.get("orderId") ?? verifiedPurchase?.orderId ?? loadPendingOrderId();
      const requestedToken =
        searchParams.get("token") ?? verifiedPurchase?.reportAccessToken ?? "";

      if (requestedOrderId) {
        try {
          const response = await fetch(
            buildOrderApiHref(requestedOrderId, requestedToken),
          );
          const data = (await response.json()) as OrderResponse;

          if (!response.ok || !data.order) {
            setReportState({
              error: data.error || "We could not find this order.",
              intake: null,
              isVerified: false,
              order: null,
              orderId: requestedOrderId,
              report: null,
            });
            setIsReady(true);
            return;
          }

          setReportState({
            intake: null,
            isVerified: data.order.status === "paid",
            order: data.order,
            orderId: data.order.id,
            report: data.report ?? null,
            reportAccessPath:
              data.reportAccessPath ?? buildClientReportPath(data.order.id, requestedToken),
            reportAccessToken: requestedToken || undefined,
            reportStatus: data.reportStatus ?? data.order.reportStatus,
          });
          setIsReady(true);
          return;
        } catch {
          setReportState({
            error: "We could not load this report. Please try again shortly.",
            intake: null,
            isVerified: false,
            order: null,
            orderId: requestedOrderId,
            report: null,
          });
          setIsReady(true);
          return;
        }
      }

    const intake = loadIntakeSubmission();
    const report = loadGeneratedReport();

    setReportState({
      intake,
      isVerified: Boolean(verifiedPurchase && report),
      order: null,
      orderId: verifiedPurchase?.orderId,
      report,
      reportAccessPath: verifiedPurchase?.reportAccessPath,
      reportAccessToken: verifiedPurchase?.reportAccessToken,
    });
    setIsReady(true);
    }

    void loadReportState();
  }, [searchParams]);

  async function handleGenerateReport() {
    if (!reportState.orderId) {
      return;
    }

    if (reportState.order?.packageSlug === "senior-finance-review") {
      return;
    }

    setIsGenerating(true);
    setReportState((current) => ({ ...current, error: undefined }));

    try {
      const response = await fetch("/api/reports/generate", {
        body: JSON.stringify({
          orderId: reportState.orderId,
          token: reportState.reportAccessToken,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json()) as GenerateResponse;

      if (!response.ok || !data.report) {
        throw new Error(data.error || "We could not prepare your report.");
      }

      saveGeneratedReport(data.report);
      setReportState((current) => ({
        ...current,
        isVerified: true,
        report: data.report ?? current.report,
        reportAccessPath: data.reportAccessPath ?? current.reportAccessPath,
        reportLinkEmailSent: data.reportLinkEmailSent,
        reportStatus: data.reportStatus ?? "ready",
      }));
    } catch (error) {
      setReportState((current) => ({
        ...current,
        error:
          error instanceof Error
            ? error.message
            : "We could not prepare your report. Please try again shortly.",
      }));
    } finally {
      setIsGenerating(false);
    }
  }

  if (!isReady) {
    return (
      <InsightCard title="Preparing your report" eyebrow="Finance Career Edge" tone="spruce">
        <p>Your tailored finance CV review is being loaded.</p>
      </InsightCard>
    );
  }

  if (reportState.error && !reportState.report) {
    return (
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-white p-6 text-center shadow-soft sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
          Report unavailable
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          We could not load this report.
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-soft">{reportState.error}</p>
        <Button href="/intake" className="mt-7">
          Return to review details
        </Button>
      </div>
    );
  }

  if (!reportState.isVerified && reportState.intake) {
    return (
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-white p-6 text-center shadow-soft sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
          Secure checkout required
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          Complete checkout to prepare your tailored report.
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-soft">
          Your review details are saved in this browser. Continue to secure checkout
          before viewing the tailored role report and new CV draft.
        </p>
        <Button href={`/intake?package=${reportState.intake.packageChoice}`} className="mt-7">
          Return to review details
        </Button>
      </div>
    );
  }

  if (!reportState.isVerified && reportState.order) {
    return (
      <CheckoutRequiredState packageSlug={reportState.order.packageSlug} />
    );
  }

  if (!reportState.isVerified) {
    return <EmptyReportState />;
  }

  if (reportState.order?.packageSlug === "senior-finance-review") {
    return (
      <SeniorReviewStatusCard
        orderId={reportState.order.id}
        targetCompany={reportState.order.targetCompany}
        targetRole={reportState.order.targetRole}
      />
    );
  }

  if (reportState.order && !reportState.report) {
    return (
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-white p-6 text-center shadow-soft sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
          Payment confirmed
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          Prepare your tailored report and CV draft.
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-soft">
          Your order is confirmed. Prepare the senior-finance dashboard, tailored
          role report and new CV draft for this application.
        </p>
        {reportState.error ? (
          <p className="mx-auto mt-4 max-w-xl rounded-[1.25rem] bg-[#f7efe2] p-4 text-sm leading-6 text-ink-soft">
            {reportState.error}
          </p>
        ) : null}
        {isGenerating ? <ReportPreparationProgress active={isGenerating} /> : null}
        <Button
          className="mt-7"
          disabled={isGenerating}
          onClick={handleGenerateReport}
          type="button"
        >
          {isGenerating ? "Preparing your report..." : "Get my report"}
        </Button>
      </div>
    );
  }

  if (!reportState.report) {
    return <EmptyReportState />;
  }

  return (
    <ReportDashboard
      actionBar={
        <ReportActions
          privateReportUrl={buildAbsoluteReportUrl(reportState.reportAccessPath)}
          report={reportState.report}
          reportLinkEmailSent={reportState.reportLinkEmailSent}
        />
      }
      activeSection={activeSection}
      generatedDate={formatGeneratedDate(reportState.report.id)}
      report={reportState.report}
      sectionBaseHref={buildReportSectionBaseHref(
        searchParams,
        reportState.orderId,
        reportState.reportAccessToken,
      )}
    />
  );
}

function buildOrderApiHref(orderId: string, token: string) {
  const params = new URLSearchParams();

  if (token) {
    params.set("token", token);
  }

  const query = params.toString();

  return `/api/orders/${encodeURIComponent(orderId)}${query ? `?${query}` : ""}`;
}

function buildClientReportPath(orderId: string, token: string) {
  if (!token) {
    return undefined;
  }

  const params = new URLSearchParams({
    orderId,
    token,
  });

  return `/report?${params.toString()}`;
}

function buildAbsoluteReportUrl(reportAccessPath: string | undefined) {
  if (!reportAccessPath || typeof window === "undefined") {
    return undefined;
  }

  return new URL(reportAccessPath, window.location.origin).toString();
}

function buildReportSectionBaseHref(
  searchParams: { toString: () => string },
  orderId?: string,
  token?: string,
) {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("section");

  if (orderId) {
    params.set("orderId", orderId);
  }

  if (token) {
    params.set("token", token);
  }

  const query = params.toString();
  return query ? `/report?${query}` : "/report";
}

function CheckoutRequiredState({ packageSlug }: { packageSlug: string }) {
  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-white p-6 text-center shadow-soft sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
        Secure checkout required
      </p>
      <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
        Complete checkout to prepare your tailored report.
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-soft">
        The tailored role report and new CV draft are only available after payment
        confirmation.
      </p>
      <Button href={`/intake?package=${packageSlug}`} className="mt-7">
        Return to review details
      </Button>
    </div>
  );
}

function EmptyReportState() {
  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-white p-6 text-center shadow-soft sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
        Start a review
      </p>
      <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
        Your tailored finance CV review will appear here.
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-soft">
        Complete the intake and secure checkout so we can prepare your tailored
        role report, new CV draft and interview talking points.
      </p>
      <Button href="/intake" className="mt-7">
        Go to intake
      </Button>
    </div>
  );
}

function formatGeneratedDate(id: string) {
  const timestamp = Number(id.replace("fce-", ""));

  if (!Number.isFinite(timestamp)) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}
