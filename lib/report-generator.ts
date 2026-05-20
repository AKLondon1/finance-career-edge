import type { GeneratedReport, IntakeSubmission } from "@/lib/types";

const financeKeywords = [
  "commercial finance",
  "business partnering",
  "forecast accuracy",
  "working capital",
  "pricing",
  "board-level reporting",
  "controls",
  "governance",
  "transformation",
  "performance management",
  "stakeholder influence",
  "cash",
  "margin",
];

export function generateReport(submission: IntakeSubmission): GeneratedReport {
  const role = clean(submission.targetRole) || "senior finance role";
  const company = clean(submission.targetCompany);
  const contextText = [
    submission.cvText,
    submission.jobAdvert,
    submission.achievements,
    submission.concerns,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const hasJobAdvert = Boolean(clean(submission.jobAdvert));
  const hasAchievements = Boolean(clean(submission.achievements));
  const hasCvText = Boolean(clean(submission.cvText));
  const score = clamp(70 + (hasJobAdvert ? 4 : 0) + (hasAchievements ? 4 : 0) + (hasCvText ? 2 : 0));
  const keywordGaps = financeKeywords.filter((keyword) => !contextText.includes(keyword)).slice(0, 8);
  const achievementBullets = buildAchievementBullets(submission, role);
  const companyPhrase = company ? ` for ${company}` : "";

  return {
    id: `fce-${Date.now()}`,
    candidateName: submission.fullName,
    packageName: submission.packageName,
    packageChoice: submission.packageChoice,
    targetRole: role,
    targetCompany: company,
    score,
    executiveSummary: `${submission.fullName}'s CV has credible finance experience for a ${role}${companyPhrase}, but the application should make commercial impact, seniority and decision support clearer. The strongest improvements are to move measurable outcomes into the top third of the CV, align wording to the target role, and show how finance work influenced margin, cash, forecasting, controls and stakeholder decisions.`,
    roleReport: {
      assessments: [
        {
          label: "Commercial impact",
          score: clamp(score - 6),
          text: `The CV needs clearer links between finance activity and commercial outcomes for a ${role}, particularly around margin, cash, pricing or performance movement.`,
        },
        {
          label: "Seniority signal",
          score: clamp(score - 3),
          text: "The profile should show board-level relevance, stakeholder influence and ownership of operating rhythm earlier.",
        },
        {
          label: "Role alignment",
          score: clamp(score + (hasJobAdvert ? 5 : -2)),
          text: hasJobAdvert
            ? "The job advert gives enough context to tailor language around the role's priorities."
            : "Adding the job advert would make the role alignment sharper and more specific.",
        },
        {
          label: "Evidence and metrics",
          score: clamp(score - (hasAchievements ? 1 : 8)),
          text: hasAchievements
            ? "The achievements give useful raw material, but they should be expressed with financial scale and decision impact."
            : "Add measurable achievements covering revenue, margin, cash, cost, forecast accuracy or transformation impact.",
        },
      ],
      keywordGaps,
      priorityFixes: [
        {
          title: "Lead with measurable commercial outcomes",
          text: `For a ${role}, the first page should show quantified impact across margin, cash, forecast accuracy, cost, controls or performance management.`,
        },
        {
          title: "Make role alignment explicit",
          text: hasJobAdvert
            ? "Mirror the target job spec where accurate, especially around business partnering, reporting cadence, governance and decision support."
            : "Add the job spec before final use so the wording can be checked against the role's language and priorities.",
        },
        {
          title: "Strengthen stakeholder influence",
          text: "Show where you influenced sales, operations, board or executive stakeholders through finance insight rather than simply producing analysis.",
        },
        {
          title: "Reframe duties into achievements",
          text: "Start bullets with the result or decision supported, then explain the reporting, forecasting or controls work behind it.",
        },
      ],
      strengths: [
        `The CV has a relevant finance base for a ${role}, with enough experience to build a stronger senior narrative.`,
        "Forecasting, reporting and stakeholder support can be repositioned as decision support rather than routine finance activity.",
        hasAchievements
          ? "The achievements provided can be sharpened into stronger commercial impact bullets."
          : "The existing role context can support stronger evidence once quantified achievements are added.",
      ],
      weaknesses: [
        "The application risks sounding task-led if measurable outcomes are not made more visible.",
        "Commercial finance language should be stronger around margin, cash, working capital and pricing.",
        "Board-level reporting and governance signals need clearer connection to decisions and business impact.",
      ],
      missingSignals: [
        "Ownership of commercial decisions and trade-offs.",
        "Influence over non-finance stakeholders.",
        "Margin, pricing or working-capital contribution.",
        "Board-level reporting linked to action.",
        "Transformation, controls and governance impact.",
        "Team rhythm, planning cadence and performance management.",
      ],
      financeLanguageImprovements: [
        "Replace 'prepared reports' with 'translated performance data into board-level decision support'.",
        "Replace 'supported forecasting' with 'improved forecast accuracy and cash visibility'.",
        "Replace 'worked with stakeholders' with 'influenced commercial and operational leaders on margin and working-capital decisions'.",
      ],
    },
    cvDraft: {
      profile: `${role} candidate with experience across forecasting, performance management and business partnering. Brings a commercially focused approach to reporting, helping senior stakeholders understand margin, cash, working-capital and trading performance. Able to connect finance insight with decision support, controls, governance and practical action across finance and non-finance teams.`,
      coreSkills: [
        "Commercial finance and business partnering",
        "Forecasting, planning and performance management",
        "Board-level reporting and decision support",
        "Margin, pricing and working-capital analysis",
        "Controls, governance and transformation",
        "Stakeholder influence across non-finance teams",
      ],
      achievementBullets,
      experienceExamples: [
        {
          before: "Prepared monthly management accounts and reported results to senior stakeholders.",
          after: `Led monthly performance reporting for a senior finance audience, translating margin, cash and forecast movements into actions relevant to the ${role} remit.`,
          why: "The stronger version adds seniority, commercial interpretation and decision support.",
        },
        {
          before: "Improved forecasting process across the business.",
          after: "Redesigned the forecasting rhythm with commercial and operational stakeholders, improving visibility of forecast risk, working-capital pressure and performance actions.",
          why: "The stronger version links process improvement to forecast quality, cash visibility and stakeholder influence.",
        },
      ],
    },
    interviewPrep: [
      `Talk through why the ${role} is the right next step and which parts of your finance experience map most directly to it.`,
      "Prepare a forecasting example that shows how improved accuracy changed decision-making.",
      "Prepare a margin, pricing or working-capital story that shows commercial judgement.",
      "Use one example where you influenced non-finance leaders without relying on formal authority.",
      "Explain how you improved controls or governance while keeping reporting useful for commercial teams.",
    ],
    nextSteps: [
      "Update the profile summary first, using the improved senior-finance positioning.",
      "Replace the first six achievement bullets with quantified commercial outcomes.",
      "Tailor the keyword language against the job spec before applying.",
      "Prepare two interview stories: one on forecasting or cash, one on stakeholder influence.",
      submission.packageChoice === "senior-finance-review"
        ? "Use the senior review stage to review credibility, seniority and final wording quality."
        : "Consider Senior Finance Review if this is a critical role or a step up in seniority.",
    ],
  };
}

function buildAchievementBullets(submission: IntakeSubmission, role: string) {
  const achievements = splitLines(submission.achievements);

  if (achievements.length > 0) {
    return achievements.slice(0, 4).map((achievement) =>
      `Reframed achievement for ${role}: ${achievement.replace(/\.$/, "")}, with emphasis on commercial impact, stakeholder decision-making and measurable finance outcomes.`,
    );
  }

  return [
    `Led performance reporting relevant to a ${role} remit, translating margin, cash and forecast movements into senior stakeholder actions.`,
    "Improved forecasting rhythm with commercial and operational teams, strengthening visibility of working-capital pressure and performance risk.",
    "Strengthened controls and reporting cadence, improving confidence in board-level performance packs and decision support.",
  ];
}

function splitLines(value: string | undefined) {
  return clean(value)
    .split(/\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function clean(value: string | undefined) {
  return value?.trim() ?? "";
}

function clamp(value: number) {
  return Math.max(45, Math.min(94, value));
}
