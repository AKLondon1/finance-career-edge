import { Button } from "@/components/Button";
import { CTASection } from "@/components/CTASection";
import { PageShell } from "@/components/PageShell";
import { PriceText } from "@/components/PriceText";
import { ReportDashboard } from "@/components/ReportDashboard";
import { exampleGeneratedReport } from "@/lib/example-report";

export default function ExampleOutputPage() {
  return (
    <PageShell className="pt-8 sm:pt-12">
      <ReportDashboard
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
        footerCta={
          <CTASection
            eyebrow="Ready to start"
            title="Turn your CV and target role into a sharper senior-finance application."
            description="Start with the tailored CV and role report. Choose senior finance review if the application needs an extra judgement layer."
            primaryHref="/intake?package=ai-tailored-cv-report"
            primaryLabel={
              <>
                Start <PriceText product="ai-tailored-cv-report" /> review
              </>
            }
            secondaryHref="/intake?package=senior-finance-review"
            secondaryLabel="Choose senior finance review"
          />
        }
        generatedDate="17 May 2026"
        headerEyebrow="Example output"
        headerIntro="This shows the style and structure of the downloadable tailored role report and new CV draft for this application."
        headerTitle="Example output"
        report={exampleGeneratedReport}
      />
    </PageShell>
  );
}
