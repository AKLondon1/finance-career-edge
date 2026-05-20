import type { ReactNode } from "react";
import { AchievementRewriteCard } from "@/components/AchievementRewriteCard";
import { Button } from "@/components/Button";
import { DashboardMetricCard } from "@/components/DashboardMetricCard";
import { InsightCard } from "@/components/InsightCard";
import { InterviewPrepCard } from "@/components/InterviewPrepCard";
import { KeywordGroup } from "@/components/KeywordGroup";
import { PriceText } from "@/components/PriceText";
import { PriorityFixCard } from "@/components/PriorityFixCard";
import { ReportCategoryNav } from "@/components/ReportCategoryNav";
import { ReportDashboardHeader } from "@/components/ReportDashboardHeader";
import { ReportSection } from "@/components/ReportSection";
import type { GeneratedReport, ScoreAssessment } from "@/lib/types";

type ReportDashboardProps = {
  report: GeneratedReport;
  generatedDate: string;
  headerEyebrow?: string;
  headerTitle?: string;
  headerIntro?: string;
  actionBar?: ReactNode;
  footerCta?: ReactNode;
};

export function ReportDashboard({
  report,
  generatedDate,
  headerEyebrow,
  headerTitle,
  headerIntro,
  actionBar,
  footerCta,
}: ReportDashboardProps) {
  const roleFitCards = buildRoleFitCards(report);
  const keywordGroups = buildKeywordGroups(report.roleReport.keywordGaps);
  const interviewCards = buildInterviewCards(report);

  return (
    <div className="space-y-6">
      <ReportDashboardHeader
        actionBar={actionBar}
        eyebrow={headerEyebrow}
        generatedDate={generatedDate}
        intro={headerIntro}
        packageName={report.packageName}
        score={report.score}
        summary={report.executiveSummary}
        targetCompany={report.targetCompany}
        targetRole={report.targetRole}
        title={headerTitle}
      />

      <ReportCategoryNav />

      <ReportSection
        id="overview"
        eyebrow="Overview"
        title="Dashboard summary"
        description="The quickest view of role fit, priority fixes and the senior-finance signals to strengthen first."
      >
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <InsightCard title="Executive summary" eyebrow="Downloadable tailored role report" tone="spruce">
            <p>{report.executiveSummary}</p>
          </InsightCard>

          <InsightCard title="Top priority fixes" eyebrow="What to change first" tone="brass">
            <div className="grid gap-3">
              {report.roleReport.priorityFixes.slice(0, 3).map((fix, index) => (
                <PriorityFixCard fix={fix} index={index} key={fix.title} />
              ))}
            </div>
          </InsightCard>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {report.roleReport.assessments.map((assessment) => (
            <DashboardMetricCard
              key={assessment.label}
              label={assessment.label}
              score={assessment.score}
              text={assessment.text}
            />
          ))}
        </div>
      </ReportSection>

      <ReportSection
        id="role-fit"
        eyebrow="Role Fit"
        title="Category-based senior-finance assessment"
        description="Each card explains the current signal, what to improve and why it matters for senior finance roles."
        tone="muted"
      >
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {roleFitCards.map((card) => (
            <InsightCard title={card.title} eyebrow={card.eyebrow} key={card.title}>
              <div className="space-y-4">
                <AssessmentBlock label="Current assessment" text={card.current} />
                <AssessmentBlock label="What to improve" text={card.improve} />
                <AssessmentBlock label="Why it matters" text={card.why} />
              </div>
            </InsightCard>
          ))}
        </div>
      </ReportSection>

      <ReportSection
        id="cv-draft"
        eyebrow="CV Draft"
        title="New CV draft for this application"
        description="Application-specific CV wording shaped around the target role, with profile, skills and achievement examples ready for careful review."
      >
        <div className="grid gap-5">
          <InsightCard
            title="Improved professional profile"
            eyebrow="Application-specific CV draft"
            tone="spruce"
          >
            <p className="rounded-[1.5rem] bg-white p-4 text-ink shadow-card">
              {report.cvDraft.profile}
            </p>
          </InsightCard>

          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <InsightCard title="Core skills section" eyebrow="Senior-finance positioning">
              <ChipList items={report.cvDraft.coreSkills} />
            </InsightCard>

            <InsightCard title="Rewritten achievement bullets" eyebrow="Commercial impact">
              <BulletList items={report.cvDraft.achievementBullets} />
            </InsightCard>
          </div>

          <InsightCard title="Improved experience wording examples" eyebrow="Original to stronger version">
            <div className="grid gap-4 lg:grid-cols-2">
              {report.cvDraft.experienceExamples.map((rewrite) => (
                <AchievementRewriteCard rewrite={rewrite} key={rewrite.before} />
              ))}
            </div>
          </InsightCard>
        </div>
      </ReportSection>

      <ReportSection
        id="keywords"
        eyebrow="Keywords"
        title="Keyword and ATS alignment by category"
        description="Grouped language to help the CV sound aligned to senior finance hiring criteria without becoming keyword-stuffed."
        tone="muted"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {keywordGroups.map((group) => (
            <KeywordGroup
              covered={group.covered}
              key={group.title}
              strengthen={group.strengthen}
              suggested={group.suggested}
              title={group.title}
            />
          ))}
        </div>
      </ReportSection>

      <ReportSection
        id="interview-prep"
        eyebrow="Interview Prep"
        title="Talking points based on the improved positioning"
        description="Practical senior-finance stories to prepare from the revised CV narrative."
      >
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {interviewCards.map((card) => (
            <InterviewPrepCard
              angle={card.angle}
              evidence={card.evidence}
              key={card.title}
              title={card.title}
              why={card.why}
            />
          ))}
        </div>
      </ReportSection>

      <ReportSection
        id="next-steps"
        eyebrow="Next Steps"
        title="Action plan before applying"
        description="A focused sequence for turning the report and CV draft into a stronger application."
        tone="dark"
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_0.82fr]">
          <div className="rounded-[1.5rem] bg-white/10 p-4 ring-1 ring-white/10 sm:p-5">
            <NumberedList items={report.nextSteps} />
          </div>

          <div className="rounded-[1.5rem] bg-white p-5 text-ink shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">
              Applying for an important senior role?
            </p>
            <h3 className="mt-3 text-xl font-semibold leading-7">
              Add senior finance review.
            </h3>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              Add human judgement on credibility, seniority, commercial nuance and
              final application direction from <PriceText product="senior-finance-review" />.
            </p>
            <Button href="/premium-review" fullWidth className="mt-5" variant="secondary">
              Add senior finance review
            </Button>
          </div>
        </div>
      </ReportSection>

      {footerCta}
    </div>
  );
}

function AssessmentBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-spruce">{label}</p>
      <p className="mt-1 text-sm leading-6 text-ink-soft">{text}</p>
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

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li className="flex gap-3" key={item}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-brass">
            {index + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          className="rounded-full border border-ink/10 bg-porcelain px-3 py-2 text-sm font-medium text-ink"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function buildRoleFitCards(report: GeneratedReport) {
  const assessmentFor = (label: string) =>
    report.roleReport.assessments.find((item) =>
      item.label.toLowerCase().includes(label.toLowerCase()),
    );

  const commercial = assessmentFor("Commercial impact");
  const seniority = assessmentFor("Seniority signal");
  const alignment = assessmentFor("Role alignment");
  const evidence = assessmentFor("Evidence");

  return [
    {
      title: "Commercial impact",
      eyebrow: scoreEyebrow(commercial),
      current:
        commercial?.text ??
        "The CV needs clearer links between finance activity and measurable commercial outcomes.",
      improve:
        "Show how reporting, forecasting and analysis influenced margin, pricing, cash, working capital or trading decisions.",
      why:
        `For a ${report.targetRole}, hiring teams look for finance judgement that changes decisions, not just accurate reporting.`,
    },
    {
      title: "Seniority signal",
      eyebrow: scoreEyebrow(seniority),
      current:
        seniority?.text ??
        "The CV should make ownership, leadership rhythm and stakeholder influence more visible.",
      improve:
        "Bring board-level relevance, planning cadence, governance and senior stakeholder communication into the opening profile and first role.",
      why:
        "Senior finance CVs need to show operating maturity and decision influence before the reader reaches the detail.",
    },
    {
      title: "Stakeholder influence",
      eyebrow: "Business partnering",
      current:
        "The report identifies business partnering potential, but the influence story needs sharper evidence.",
      improve:
        "Name the stakeholder groups influenced and the commercial trade-off they acted on.",
      why:
        "Finance Business Partner, Commercial Finance and Head of Finance roles depend on influencing non-finance leaders without relying only on formal authority.",
    },
    {
      title: "Board-level relevance",
      eyebrow: scoreEyebrow(alignment),
      current:
        alignment?.text ??
        "The CV should connect reporting and planning work to board-level decisions.",
      improve:
        "Use wording around board packs, executive reporting, decision support, risk visibility and performance actions where accurate.",
      why:
        "Senior finance applications are judged on whether insight can shape the conversation at leadership level.",
    },
    {
      title: "Forecasting, margin and cash language",
      eyebrow: scoreEyebrow(evidence),
      current:
        evidence?.text ??
        "The application would benefit from more financial scale and outcome evidence.",
      improve:
        "Add measures around forecast accuracy, margin movement, cash visibility, working capital, cost or revenue scale.",
      why:
        "Specific measures make the CV more credible and give interviewers concrete evidence to explore.",
    },
    {
      title: "Transformation and controls",
      eyebrow: "Governance",
      current:
        "Transformation, controls and governance signals are present but need stronger connection to business impact.",
      improve:
        "Frame controls improvements as confidence, pace, risk reduction or better commercial decision support.",
      why:
        "Senior finance leaders must balance commercial pace with governance and reliable operating discipline.",
    },
  ];
}

function scoreEyebrow(assessment: ScoreAssessment | undefined) {
  return assessment ? `${assessment.score}% assessment` : "Assessment";
}

const keywordCategories = [
  {
    title: "Commercial finance",
    terms: ["commercial finance", "business partnering", "decision support"],
    suggested:
      "Use language that links analysis to trading decisions, commercial challenge and business partnering outcomes.",
  },
  {
    title: "FP&A and forecasting",
    terms: ["forecast accuracy", "performance management", "planning"],
    suggested:
      "Add wording around forecasting rhythm, planning discipline, performance reviews and changes in forecast confidence.",
  },
  {
    title: "Margin, cash and working capital",
    terms: ["margin", "cash", "working capital"],
    suggested:
      "Show how finance insight improved visibility of margin pressure, cash risk or working-capital actions.",
  },
  {
    title: "Stakeholder influence",
    terms: ["stakeholder influence", "board-level reporting", "executive reporting"],
    suggested:
      "Describe who you influenced, the decision being made and the commercial evidence used.",
  },
  {
    title: "Controls and governance",
    terms: ["controls", "governance", "risk visibility"],
    suggested:
      "Connect controls and governance work to confidence, pace, decision quality or reduced operational risk.",
  },
  {
    title: "Transformation and systems",
    terms: ["transformation", "systems", "process improvement"],
    suggested:
      "Frame transformation work around better reporting cadence, cleaner data and stronger decision support.",
  },
];

function buildKeywordGroups(keywordGaps: string[]) {
  const gaps = new Set(keywordGaps.map((keyword) => keyword.toLowerCase()));

  return keywordCategories.map((category) => {
    const covered = category.terms.filter((term) => !gaps.has(term.toLowerCase()));
    const strengthen = category.terms.filter((term) => gaps.has(term.toLowerCase()));

    return {
      title: category.title,
      covered: covered.length > 0 ? covered : ["Included in draft where accurate"],
      strengthen: strengthen.length > 0 ? strengthen : ["Use consistently where accurate"],
      suggested: category.suggested,
    };
  });
}

function buildInterviewCards(report: GeneratedReport) {
  const themes = [
    {
      title: "Forecast accuracy story",
      evidence: "Baseline accuracy, process change, stakeholder cadence and the decision impact.",
      why: "Forecasting credibility is central to senior FP&A and commercial finance roles.",
    },
    {
      title: "Margin or pricing story",
      evidence: "Margin pressure, pricing insight, commercial challenge and the action taken.",
      why: "It shows commercial judgement rather than purely technical finance capability.",
    },
    {
      title: "Cash and working capital story",
      evidence: "Cash risk, working-capital movement, ownership rhythm and leadership action.",
      why: "Cash discipline is a senior-finance signal, especially in services and trading environments.",
    },
    {
      title: "Stakeholder influence story",
      evidence: "Who you influenced, what they initially believed and how finance evidence changed the decision.",
      why: "Senior finance leaders need to influence beyond the finance function.",
    },
    {
      title: "Transformation or controls story",
      evidence: "Process issue, control improvement, governance benefit and commercial impact.",
      why: "It proves you can improve discipline without losing sight of business performance.",
    },
  ];

  return themes.map((theme, index) => ({
    ...theme,
    angle: report.interviewPrep[index] ?? `Prepare a ${theme.title.toLowerCase()} for the ${report.targetRole} conversation.`,
  }));
}
