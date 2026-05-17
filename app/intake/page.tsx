import { IntakeForm } from "@/components/IntakeForm";
import { PageShell } from "@/components/PageShell";
import { SectionHeading } from "@/components/SectionHeading";
import { TrustStrip } from "@/components/TrustStrip";

export default function IntakePage() {
  return (
    <PageShell className="pb-8 pt-8 sm:pb-16 lg:pt-12">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <aside className="lg:sticky lg:top-24">
          <SectionHeading
            eyebrow="Start review"
            title="Start your finance CV review"
            description="Upload or paste your CV, add the role you are targeting, and choose the level of review you want."
          />
          <TrustStrip
            className="mt-7 sm:grid-cols-1"
            items={[
              "Upload or paste your CV",
              "Add the target role",
              "Choose your review level",
            ]}
          />
          <div className="mt-5 rounded-[1.5rem] border border-ink/10 bg-white p-5 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brass">
              Low-friction intake
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-soft">
              <li>Required: name, email, target role and CV input.</li>
              <li>Optional: job advert, achievements and CV concerns.</li>
              <li>The job spec helps tailor the output, but you can start without it.</li>
            </ul>
          </div>
        </aside>
        <IntakeForm />
      </div>
    </PageShell>
  );
}
