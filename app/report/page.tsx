import { PageShell } from "@/components/PageShell";
import { ReportHeader } from "@/components/ReportHeader";
import { ReportTabs } from "@/components/ReportTabs";
import { report } from "@/lib/productData";

export default function ReportPage() {
  return (
    <PageShell className="pt-8 sm:pt-12">
      <div className="space-y-6">
        <ReportHeader
          packageName={report.packageName}
          score={report.score}
          summary={report.executiveSummary}
          targetRole={report.targetRole}
        />
        <ReportTabs report={report} />
      </div>
    </PageShell>
  );
}
