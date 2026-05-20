"use client";

import { Button } from "@/components/Button";
import { buildCvDraftText, buildReportText, downloadTextFile } from "@/lib/downloads";
import type { GeneratedReport } from "@/lib/types";

type ReportActionsProps = {
  report: GeneratedReport;
};

export function ReportActions({ report }: ReportActionsProps) {
  return (
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
  );
}
