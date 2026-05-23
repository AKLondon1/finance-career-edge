"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { buildCvDraftText, buildReportText, downloadTextFile } from "@/lib/downloads";
import type { GeneratedReport } from "@/lib/types";

type ReportActionsProps = {
  privateReportUrl?: string;
  report: GeneratedReport;
  reportLinkEmailSent?: boolean;
};

export function ReportActions({
  privateReportUrl,
  report,
  reportLinkEmailSent,
}: ReportActionsProps) {
  const [copyMessage, setCopyMessage] = useState("");

  async function handleCopyReportLink() {
    if (!privateReportUrl) {
      setCopyMessage("The private report link is not available in this browser.");
      return;
    }

    try {
      await navigator.clipboard.writeText(privateReportUrl);
      setCopyMessage("Private report link copied.");
    } catch {
      setCopyMessage("Copy was not available in this browser. Please copy the link from the address bar.");
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-[1.25rem] border border-spruce/15 bg-spruce-soft p-4 text-sm leading-6 text-ink-soft">
        <p>
          {reportLinkEmailSent === true
            ? "We've sent this private report link to the email address you provided. Please keep it safe."
            : "Your private report link is ready. Copy it as a backup and keep it safe."}
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Button
            className="min-h-10 px-4 py-2"
            disabled={!privateReportUrl}
            onClick={handleCopyReportLink}
            type="button"
            variant="secondary"
          >
            Copy report link
          </Button>
          {copyMessage ? (
            <p className="self-center text-xs text-ink-soft">{copyMessage}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          onClick={() =>
            downloadTextFile("finance-career-edge-role-report.txt", buildReportText(report))
          }
        >
          Download tailored report
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            downloadTextFile("finance-career-edge-cv-draft.txt", buildCvDraftText(report))
          }
        >
          Download CV draft
        </Button>
      </div>
    </div>
  );
}
