import { Button } from "@/components/Button";
import { CTASection } from "@/components/CTASection";
import { InsightCard } from "@/components/InsightCard";
import { PageShell } from "@/components/PageShell";
import { PremiumReviewChecklist } from "@/components/PremiumReviewChecklist";
import { PriceText } from "@/components/PriceText";
import { SectionHeading } from "@/components/SectionHeading";
import { premiumReviewAdds, premiumReviewChecklist } from "@/lib/productData";

const bestFor = [
  "You are applying for a Head of Finance, Head of FP&A, Finance Director or CFO-track role.",
  "The role needs evidence of commercial impact, board-level reporting or stakeholder influence.",
  "You want a senior finance professional to check whether the final application sounds credible.",
];

export default function PremiumReviewPage() {
  return (
    <>
      <PageShell className="pt-8 sm:pt-12">
        <div className="rounded-[2rem] border border-spruce/15 bg-white p-5 shadow-soft sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full bg-spruce-soft px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-spruce">
                Senior Finance Review
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                Add senior finance judgement to your application.
              </h1>
              <p className="mt-5 text-base leading-8 text-ink-soft sm:text-lg">
                The AI Tailored CV & Role Report gives you the downloadable
                tailored report and new CV draft for this application. Senior
                Finance Review adds a human quality layer focused on credibility,
                seniority, commercial nuance and whether the final application
                sounds like a serious finance leader.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/intake?package=senior-finance-review">
                  Choose senior review
                </Button>
                <Button href="/intake?package=ai-tailored-cv-report" variant="secondary">
                  Start <PriceText product="ai-tailored-cv-report" /> review
                </Button>
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-mist p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-spruce">
                Turnaround
              </p>
              <p className="mt-3 text-3xl font-semibold text-ink">2 business days</p>
              <p className="mt-4 leading-7 text-ink-soft">
                Includes the AI Tailored CV & Role Report plus senior finance
                human review and final application recommendations.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Best for"
              title="Applications where credibility matters."
              description="The senior review is for roles where wording, judgement and commercial nuance need to be checked before you apply."
            />
            <div className="mt-8 grid gap-4">
              {bestFor.map((item) => (
                <div className="rounded-[1.5rem] border border-ink/10 bg-white p-5 shadow-card" key={item}>
                  <p className="leading-7 text-ink-soft">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {premiumReviewAdds.map((item) => (
              <InsightCard title={item.title} eyebrow="What the senior review adds" key={item.title}>
                <p>{item.text}</p>
              </InsightCard>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <PremiumReviewChecklist items={premiumReviewChecklist} />
          <InsightCard title="What you receive" eyebrow="Senior review output" tone="spruce">
            <p>
              You receive the downloadable tailored report and new CV draft for
              this application, reviewed through a senior finance lens. The review
              focuses on commercial impact, forecast credibility, margin and cash
              language, controls, governance, business partnering and role-fit narrative.
            </p>
          </InsightCard>
        </div>
      </PageShell>

      <PageShell className="pt-0">
        <CTASection
          eyebrow="Add the senior layer"
          title="Use Senior Finance Review when the application needs human judgement."
          description="Start the intake with Senior Finance Review selected, or begin with the AI Tailored CV & Role Report if you want the tailored report first."
          primaryHref="/intake?package=senior-finance-review"
          primaryLabel="Choose senior review"
          secondaryHref="/intake?package=ai-tailored-cv-report"
          secondaryLabel={
            <>
              Start <PriceText product="ai-tailored-cv-report" /> review
            </>
          }
        />
      </PageShell>
    </>
  );
}
