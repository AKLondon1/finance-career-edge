import { CTASection } from "@/components/CTASection";
import { ExampleOutputPreview } from "@/components/ExampleOutputPreview";
import { FAQItem } from "@/components/FAQItem";
import { Hero } from "@/components/Hero";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { PageShell } from "@/components/PageShell";
import { PriceText } from "@/components/PriceText";
import { PricingSection } from "@/components/PricingSection";
import { SectionHeading } from "@/components/SectionHeading";
import { TrustStrip } from "@/components/TrustStrip";
import { credibilityFocus, faqs, howItWorks, trustPoints } from "@/lib/productData";

export default function Home() {
  return (
    <div className="pb-24 sm:pb-0">
      <Hero
        eyebrow="For UK senior finance professionals"
        title="Your finance CV, sharpened for the role you want next."
        description="Finance Career Edge turns your CV and target job spec into a tailored senior-finance application report, improved CV draft and practical interview angles."
        primaryHref="/intake?package=ai-tailored-cv-report"
        primaryLabel={
          <>
            Start <PriceText product="ai-tailored-cv-report" /> review
          </>
        }
        secondaryHref="/example-output"
        secondaryLabel="View example output"
        proofPoints={credibilityFocus}
      >
        <ExampleOutputPreview />
      </Hero>

      <PageShell id="packages" className="pt-4 sm:pt-8">
        <PricingSection />
      </PageShell>

      <PageShell tone="muted">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps from CV to sharper application."
        />
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <article
              className="rounded-[1.5rem] border border-ink/10 bg-white p-5 shadow-card"
              key={step.title}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold leading-7 text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{step.text}</p>
            </article>
          ))}
        </div>
      </PageShell>

      <PageShell tone="dark">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
              Example output
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Tailored role report plus improved CV draft.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/75">
              The tailored report gives you role-fit insight, priority fixes, keyword
              gaps, interview angles and sharper senior-finance CV wording.
            </p>
          </div>
          <ExampleOutputPreview />
        </div>
      </PageShell>

      <PageShell>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Trust"
              title="Clear scope. Practical output."
              description="Finance Career Edge helps improve application material. It does not promise hiring outcomes."
            />
            <div className="mt-6 grid gap-3">
              {trustPoints.map((point) => (
                <div className="rounded-[1.35rem] border border-ink/10 bg-white p-4 shadow-card" key={point}>
                  <p className="text-sm leading-6 text-ink-soft">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="FAQ" title="Questions before you start." />
            <div className="mt-6 grid gap-3">
              {faqs.map((faq) => (
                <FAQItem answer={faq.answer} question={faq.question} key={faq.question} />
              ))}
            </div>
          </div>
        </div>
      </PageShell>

      <PageShell className="pt-0">
        <CTASection
          eyebrow="Start with the tailored report"
          title="Turn your finance CV and target role into a sharper senior-level application."
          description="Start with the tailored CV and role report. Upgrade to senior review if the role is important."
          primaryHref="/intake?package=ai-tailored-cv-report"
          primaryLabel={
            <>
              Start <PriceText product="ai-tailored-cv-report" /> review
            </>
          }
          secondaryHref="/intake?package=senior-finance-review"
          secondaryLabel="Choose senior review"
        />
      </PageShell>

      <MobileStickyCTA
        href="/intake?package=ai-tailored-cv-report"
        label={
          <>
            Start <PriceText product="ai-tailored-cv-report" /> review
          </>
        }
        supportingText="Tailored CV and role report"
      />
    </div>
  );
}
