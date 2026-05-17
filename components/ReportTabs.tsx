"use client";

import { useState } from "react";
import { AchievementRewriteCard } from "@/components/AchievementRewriteCard";
import { Button } from "@/components/Button";
import { InsightCard } from "@/components/InsightCard";
import { KeywordChips } from "@/components/KeywordChips";
import { PriceText } from "@/components/PriceText";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import type { Report } from "@/lib/productData";
import { cn } from "@/lib/utils";

type Tab = "role-report" | "cv-draft" | "interview-prep" | "next-steps";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "role-report", label: "Role Report" },
  { id: "cv-draft", label: "Improved CV Draft" },
  { id: "interview-prep", label: "Interview Prep" },
  { id: "next-steps", label: "Next Steps" },
];

type ReportTabsProps = {
  report: Report;
};

export function ReportTabs({ report }: ReportTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("role-report");

  return (
    <div className="space-y-5">
      <div className="sticky top-[73px] z-30 rounded-[1.5rem] border border-ink/10 bg-porcelain/95 p-2 shadow-card backdrop-blur">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tabs.map((tab) => (
            <button
              className={cn(
                "focus-ring rounded-full px-3 py-3 text-sm font-semibold transition",
                activeTab === tab.id
                  ? "bg-ink text-white shadow-card"
                  : "bg-white text-ink-soft hover:text-ink",
              )}
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "role-report" ? <RoleReport report={report} /> : null}
      {activeTab === "cv-draft" ? <CVDraft report={report} /> : null}
      {activeTab === "interview-prep" ? <InterviewPrep report={report} /> : null}
      {activeTab === "next-steps" ? <NextSteps report={report} /> : null}
    </div>
  );
}

function RoleReport({ report }: ReportTabsProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <InsightCard title="Tailored Role Report" eyebrow="Downloadable report" tone="spruce">
        <ScoreBreakdown items={report.roleReport.assessments} />
      </InsightCard>

      <InsightCard title="Priority fixes" eyebrow="What to change first" tone="brass">
        <div className="grid gap-4">
          {report.roleReport.priorityFixes.map((fix, index) => (
            <article className="rounded-[1.25rem] bg-white/75 p-4" key={fix.title}>
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold leading-6 text-ink">{fix.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{fix.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </InsightCard>

      <InsightCard title="Keyword gaps" eyebrow="ATS alignment">
        <KeywordChips items={report.roleReport.keywordGaps} />
      </InsightCard>

      <InsightCard title="Specific finance-language improvements" eyebrow="Wording">
        <BulletList items={report.roleReport.financeLanguageImprovements} />
      </InsightCard>
    </div>
  );
}

function CVDraft({ report }: ReportTabsProps) {
  return (
    <div className="grid gap-5">
      <InsightCard title="Improved CV Draft" eyebrow="Application-specific CV draft" tone="spruce">
        <p className="rounded-[1.5rem] bg-white p-4 text-ink shadow-card">
          {report.cvDraft.profile}
        </p>
      </InsightCard>

      <InsightCard title="Core skills section" eyebrow="Senior-finance positioning">
        <KeywordChips items={report.cvDraft.coreSkills} />
      </InsightCard>

      <InsightCard title="Rewritten achievement bullets" eyebrow="Commercial impact">
        <BulletList items={report.cvDraft.achievementBullets} />
      </InsightCard>

      <InsightCard title="Experience wording examples" eyebrow="Before and after">
        <div className="grid gap-4">
          {report.cvDraft.experienceExamples.map((rewrite) => (
            <AchievementRewriteCard rewrite={rewrite} key={rewrite.before} />
          ))}
        </div>
      </InsightCard>
    </div>
  );
}

function InterviewPrep({ report }: ReportTabsProps) {
  return (
    <InsightCard title="Interview talking points" eyebrow="Based on the improved positioning">
      <BulletList items={report.interviewPrep} />
    </InsightCard>
  );
}

function NextSteps({ report }: ReportTabsProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
      <InsightCard title="Recommended next steps" eyebrow="Action plan" tone="dark">
        <ol className="space-y-3">
          {report.nextSteps.map((item, index) => (
            <li className="flex gap-3" key={item}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-brass">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </InsightCard>

      <div className="rounded-[1.75rem] border border-spruce/20 bg-white p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">
          Applying for an important senior role?
        </p>
        <h2 className="mt-3 text-xl font-semibold leading-7 text-ink">
          Add senior finance review.
        </h2>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          Add human judgement on credibility, seniority, commercial nuance and final application direction from <PriceText product="senior-finance-review" />.
        </p>
        <Button href="/premium-review" fullWidth className="mt-5" variant="secondary">
          Add senior finance review
        </Button>
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li className="flex gap-3" key={item}>
          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
