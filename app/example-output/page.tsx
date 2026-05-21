import { Button } from "@/components/Button";
import { PageShell } from "@/components/PageShell";
import { PriceText } from "@/components/PriceText";
import { ReportDashboard } from "@/components/ReportDashboard";
import { exampleGeneratedReport } from "@/lib/example-report";
import { normaliseReportSection } from "@/lib/report-sections";

type ExampleOutputPageProps = {
  searchParams: Promise<{
    currency?: string;
    section?: string;
  }>;
};

export default async function ExampleOutputPage({ searchParams }: ExampleOutputPageProps) {
  const params = await searchParams;
  const activeSection = normaliseReportSection(params.section);

  return (
    <PageShell className="pt-8 sm:pt-12">
      <ReportDashboard
        activeSection={activeSection}
        actionBar={
          <div className="grid gap-3 sm:grid-cols-2">
            <Button href="/intake?package=ai-tailored-cv-report">
              Start <PriceText product="ai-tailored-cv-report" /> review
            </Button>
            <Button href="/intake?package=senior-finance-review" variant="secondary">
              Add senior finance review
            </Button>
          </div>
        }
        generatedDate="17 May 2026"
        headerEyebrow="Example output"
        headerIntro="This shows the style and structure of the downloadable tailored role report and new CV draft for this application."
        headerTitle="Example output"
        report={exampleGeneratedReport}
        sectionBaseHref={buildExampleSectionBaseHref(params)}
      />
    </PageShell>
  );
}

function buildExampleSectionBaseHref(params: { currency?: string }) {
  const query = new URLSearchParams();

  if (params.currency) {
    query.set("currency", params.currency);
  }

  const queryString = query.toString();
  return queryString ? `/example-output?${queryString}` : "/example-output";
}
