export type PackageSlug = "ai-tailored-cv-report" | "senior-finance-review";

export type Package = {
  slug: PackageSlug;
  name: string;
  label: string;
  audience: string;
  description: string;
  delivery: string;
  includes: string[];
  cta: string;
  href: string;
  badge?: string;
  recommended?: boolean;
};

export type RewriteExample = {
  before: string;
  after: string;
  why: string;
};

export const packages: Package[] = [
  {
    slug: "ai-tailored-cv-report",
    name: "AI Tailored CV & Role Report",
    label: "For fast tailored output",
    audience:
      "For finance professionals who want a downloadable tailored report and new CV draft for this application.",
    description:
      "Get a downloadable tailored report and a new CV draft shaped around the role you are applying for.",
    delivery: "Prepared in-app after intake submission.",
    includes: [
      "Downloadable tailored role report",
      "New CV draft for this application",
      "Role-fit assessment",
      "Rewritten profile summary",
      "Stronger achievement bullets",
      "Keyword and ATS alignment",
      "Commercial impact suggestions",
      "Interview talking points",
      "Recommended next steps",
    ],
    cta: "Start review",
    href: "/intake?package=ai-tailored-cv-report",
  },
  {
    slug: "senior-finance-review",
    name: "Senior Finance Review",
    label: "Senior finance human review",
    audience:
      "For important applications where the tailored report and new CV draft need senior finance judgement before use.",
    description:
      "Get everything in the AI Tailored CV & Role Report, plus senior finance judgement on whether the CV sounds credible, commercial and ready for a serious application.",
    delivery: "2-business-day turnaround.",
    includes: [
      "Everything in the AI Tailored CV & Role Report",
      "Downloadable tailored report",
      "New CV draft for this application",
      "Human review by a senior finance professional",
      "Final CV quality check",
      "Seniority and credibility review",
      "Sharper commercial finance positioning",
      "Improved role-fit narrative",
      "Cover note direction",
      "Final application recommendations",
    ],
    cta: "Choose senior review",
    href: "/intake?package=senior-finance-review",
    badge: "Recommended for senior applications",
    recommended: true,
  },
];

export function isPackageSlug(value: string | null | undefined): value is PackageSlug {
  return value === "ai-tailored-cv-report" || value === "senior-finance-review";
}

export function getPackageBySlug(slug: PackageSlug) {
  return packages.find((item) => item.slug === slug) ?? packages[0];
}

export const credibilityFocus = [
  "Built for senior finance roles",
  "Tailored to the job spec",
  "Improved CV draft included",
];

export const howItWorks = [
  {
    title: "Add your CV and target role",
    text:
      "Upload or paste your CV, then add the role title and job spec if you have it.",
  },
  {
    title: "Receive your tailored CV and role report",
    text:
    "Review role fit, keyword gaps, stronger CV wording and practical interview angles.",
  },
  {
    title: "Add senior review if the application matters",
    text:
      "Upgrade when you want human judgement on credibility, seniority and final positioning.",
  },
];

export const outputPreview = {
  roleReport: {
    score: 78,
    priorityFixes: [
      "Move commercial impact into the top third of the CV.",
      "Connect forecasting work to decisions on margin, cash and resource allocation.",
      "Use job-spec language around business partnering, controls and board-level reporting.",
    ],
    keywordGaps: ["working capital", "pricing", "forecast accuracy", "board reporting"],
    interviewAngles: [
      "Forecast accuracy and decision-making",
      "Margin pressure and stakeholder influence",
      "Controls improvement during transformation",
    ],
  },
  cvDraft: {
    profile:
      "Commercial finance professional with experience across forecasting, performance management and business partnering. Strong record of turning reporting into decision support, improving cash visibility and helping senior stakeholders understand margin, pricing and operational trade-offs.",
    achievement:
      "Redesigned the forecasting rhythm with sales and operations, improving forecast accuracy and giving leaders earlier visibility of working capital pressure.",
    wording:
      "Sharper senior-finance wording links the work to commercial impact, stakeholder decisions and measurable performance movement.",
  },
};

export const trustPoints = [
  "Your information is used to prepare your review.",
  "Do not include unnecessary sensitive personal information.",
  "No service can guarantee interviews or job offers.",
  "Senior review is available for applications that need human judgement.",
];

export const faqs = [
  {
    question: "What do I get in the AI Tailored CV & Role Report?",
    answer:
      "You receive a downloadable tailored report, a new CV draft for this application, role-fit assessment, rewritten profile summary, stronger achievement bullets, keyword alignment, interview talking points and recommended next steps.",
  },
  {
    question: "What is different about Senior Finance Review?",
    answer:
      "The Senior Finance Review includes the AI Tailored CV & Role Report plus human review by a senior finance professional, with a focus on credibility, seniority, commercial nuance and final application recommendations.",
  },
  {
    question: "Is this only for finance professionals?",
    answer:
      "Yes. Finance Career Edge is built for UK finance professionals applying for Finance Manager, FP&A, Commercial Finance, Finance Business Partner, Head of Finance, Finance Director and CFO-track roles.",
  },
  {
    question: "Do I need a job advert?",
    answer:
      "No, but it helps. A job spec gives the review clearer language, priorities and seniority signals to compare against your CV.",
  },
  {
    question: "Do you guarantee interviews?",
    answer:
      "No. The service improves application quality and role alignment, but hiring outcomes depend on the role, market and selection process.",
  },
  {
    question: "What information do I need to provide?",
    answer:
      "Your name, email, target role, CV and package choice are enough to start. Target company, job advert, achievements and concerns are optional but useful.",
  },
];

export const report = {
  packageName: "AI Tailored CV & Role Report",
  targetRole: "Head of Finance",
  score: 78,
  executiveSummary:
    "Your CV shows credible finance experience, but the current version underplays commercial decision support, measurable impact and senior stakeholder influence. The strongest improvement is to move from responsibility-led wording to evidence of margin, cash, forecasting, controls and business partnering outcomes.",
  roleReport: {
    assessments: [
      {
        label: "Commercial impact",
        score: 72,
        text:
          "Good base in performance management, but the CV needs clearer evidence of how your work changed trading, pricing, margin or cash decisions.",
      },
      {
        label: "Seniority signal",
        score: 75,
        text:
          "The role history is credible, but the top third should show board-level relevance and ownership of finance operating rhythm sooner.",
      },
      {
        label: "Keyword alignment",
        score: 81,
        text:
          "Core finance language is present, but the job-spec terms around working capital, pricing and transformation need better coverage.",
      },
    ],
    keywordGaps: [
      "commercial finance",
      "business partnering",
      "forecast accuracy",
      "working capital",
      "pricing",
      "board-level reporting",
      "controls",
      "transformation",
      "performance management",
      "stakeholder influence",
    ],
    priorityFixes: [
      {
        title: "Lead with measurable commercial outcomes",
        text:
          "Add revenue, margin, cash, cost, forecast accuracy or portfolio scale to the strongest bullets.",
      },
      {
        title: "Strengthen board-level reporting language",
        text:
          "Show how reporting informed decisions, challenged assumptions or created earlier visibility of risk.",
      },
      {
        title: "Make business partnering more specific",
        text:
          "Name the stakeholder groups, the decision being supported and the commercial trade-off involved.",
      },
      {
        title: "Show controls and governance through impact",
        text:
          "Link process improvements to confidence, risk reduction, pace or quality of decision support.",
      },
    ],
    financeLanguageImprovements: [
      "Replace 'prepared reports' with 'translated performance data into board-level decision support'.",
      "Replace 'supported forecasting' with 'improved forecast accuracy and cash visibility'.",
      "Replace 'worked with stakeholders' with 'influenced sales and operations leaders on margin and working-capital trade-offs'.",
    ],
  },
  cvDraft: {
    profile:
      "Commercial finance leader with experience across forecasting, performance management and business partnering. Strong record of translating reporting into decision support, improving visibility of margin and cash risk, and helping senior stakeholders act on financial insight. Comfortable operating across finance, sales and operations to strengthen controls, planning discipline and commercial performance.",
    coreSkills: [
      "Commercial finance and business partnering",
      "Forecasting, planning and performance management",
      "Board-level reporting and decision support",
      "Margin, pricing and working-capital analysis",
      "Controls, governance and transformation",
      "Stakeholder influence across non-finance teams",
    ],
    achievementBullets: [
      "Led monthly performance reporting for a £45m business unit, translating margin, cash and forecast movements into board-level actions for commercial and operational leaders.",
      "Redesigned the forecasting process with sales and operations, improving forecast accuracy and giving leaders earlier visibility of working capital pressure.",
      "Built pricing and profitability analysis that identified underperforming customer segments and supported a margin improvement plan worth £1.2m annualised.",
    ],
    experienceExamples: [
      {
        before: "Prepared monthly management accounts and reported results to senior stakeholders.",
        after:
          "Led monthly performance reporting for a £45m business unit, translating margin, cash and forecast movements into board-level actions for commercial and operational leaders.",
        why:
          "The stronger version adds scale, senior stakeholder relevance and a clear commercial purpose.",
      },
      {
        before: "Improved forecasting process across the business.",
        after:
          "Redesigned the forecasting rhythm with sales and operations, improving forecast accuracy and giving leaders earlier visibility of working capital pressure.",
        why:
          "The stronger version connects process improvement to forecast quality, cash visibility and cross-functional influence.",
      },
    ],
  },
  interviewPrep: [
    "Talk through a time you improved forecast accuracy and how that changed decision-making.",
    "Prepare a pricing or margin story that shows your commercial judgement.",
    "Use one example where you influenced non-finance leaders without relying on formal authority.",
    "Explain how you improved cash or working-capital visibility for senior stakeholders.",
    "Prepare a transformation or controls example that shows governance without slowing commercial pace.",
  ],
  nextSteps: [
    "Update the profile summary first, using the improved senior-finance positioning.",
    "Replace the first six achievement bullets with quantified commercial outcomes.",
    "Tailor the keyword language against each job spec before applying.",
    "Prepare two interview stories: one on forecasting or cash, one on stakeholder influence.",
    "Consider Senior Finance Review if this is a critical role or a step up in seniority.",
  ],
};

export const premiumReviewAdds = [
  {
    title: "Human review by a senior finance professional",
    text:
      "A quality layer focused on whether the application reads credibly for senior finance hiring conversations.",
  },
  {
    title: "Seniority and credibility review",
    text:
      "Checks whether the wording sounds like a serious finance leader rather than a capable manager listing responsibilities.",
  },
  {
    title: "Sharper commercial finance positioning",
    text:
      "Looks for stronger evidence around margin, cash, pricing, forecasting, controls, governance and stakeholder influence.",
  },
  {
    title: "Improved role-fit narrative",
    text:
      "Assesses whether the final material is shaped around the specific target role and its commercial priorities.",
  },
];

export const premiumReviewChecklist = [
  "Everything in the AI Tailored CV & Role Report",
  "Final CV quality check",
  "Seniority and credibility review",
  "Sharper commercial finance positioning",
  "Cover note direction",
  "Final application recommendations",
  "2-business-day turnaround",
];

export type Report = typeof report;
