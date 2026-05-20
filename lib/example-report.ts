import type { GeneratedReport } from "@/lib/types";

export const exampleGeneratedReport: GeneratedReport = {
  id: "fce-example-output",
  candidateName: "Example candidate",
  packageName: "AI Tailored CV & Role Report",
  packageChoice: "ai-tailored-cv-report",
  targetRole: "Head of Commercial Finance",
  targetCompany: "UK services business",
  score: 82,
  executiveSummary:
    "The CV shows credible commercial finance experience and useful exposure to forecasting, reporting and business partnering. For a Head of Commercial Finance application, the main improvement is to make seniority, scale and commercial judgement clearer in the top third of the CV. The strongest version should show how finance insight changed pricing, margin, cash, working capital and trading decisions, not only that reporting and planning processes were owned.",
  roleReport: {
    assessments: [
      {
        label: "Commercial impact",
        score: 80,
        text:
          "Good evidence of reporting and analysis, but the CV should connect more bullets to margin improvement, pricing decisions and cash discipline.",
      },
      {
        label: "Seniority signal",
        score: 76,
        text:
          "The experience is relevant, but the wording needs stronger ownership of operating rhythm, stakeholder challenge and board-level communication.",
      },
      {
        label: "Role alignment",
        score: 84,
        text:
          "The background fits commercial finance leadership, especially if the CV makes business partnering, forecasting and performance management more explicit.",
      },
      {
        label: "Evidence and metrics",
        score: 78,
        text:
          "Several achievements could be strengthened with portfolio size, revenue, margin, forecast accuracy or working-capital measures.",
      },
    ],
    keywordGaps: [
      "pricing",
      "margin",
      "forecast accuracy",
      "working capital",
      "board-level reporting",
      "stakeholder influence",
      "controls",
      "transformation",
    ],
    priorityFixes: [
      {
        title: "Move commercial impact into the opening profile",
        text:
          "Position the candidate as a finance leader who turns data into decisions on trading performance, margin, cash and resource allocation.",
      },
      {
        title: "Replace responsibility-led bullets with outcomes",
        text:
          "Convert phrases such as monthly reporting, forecasting and stakeholder support into measurable examples of decision support.",
      },
      {
        title: "Show influence beyond finance",
        text:
          "Name the senior stakeholder groups influenced, such as sales, operations, pricing or the executive team, and explain the trade-offs involved.",
      },
      {
        title: "Add scale and cadence",
        text:
          "Include portfolio value, business unit scale, reporting rhythm, forecast cycle ownership and the level of board or executive exposure.",
      },
    ],
    strengths: [
      "The CV has a credible commercial finance base and relevant exposure to forecasting, reporting and business partnering.",
      "There is enough senior stakeholder work to build a stronger Head of Commercial Finance narrative.",
      "The experience can be reframed into clearer margin, cash, pricing and performance management outcomes.",
    ],
    weaknesses: [
      "The CV risks sounding too task-led if reporting and forecasting are not connected to commercial decisions.",
      "Scale of ownership is not yet visible enough for a Head of Commercial Finance application.",
      "Board-level reporting, stakeholder influence and controls improvement need stronger evidence.",
    ],
    missingSignals: [
      "Ownership of commercial trade-offs.",
      "Influence over sales, operations and senior non-finance stakeholders.",
      "Pricing, margin and working-capital contribution.",
      "Board-level reporting linked to action.",
      "Transformation, controls and governance impact.",
      "Planning cadence and performance management rhythm.",
    ],
    financeLanguageImprovements: [
      "Replace 'responsible for monthly reporting' with 'translated performance reporting into trading actions for senior stakeholders'.",
      "Replace 'supported forecasting' with 'improved forecast accuracy and visibility of cash and working-capital risk'.",
      "Replace 'worked with commercial teams' with 'influenced sales and operations leaders on pricing, margin and performance trade-offs'.",
    ],
  },
  cvDraft: {
    profile:
      "Commercial finance leader with experience across forecasting, performance management and business partnering in complex services environments. Strong record of turning reporting into decision support, improving visibility of margin and cash risk, and influencing senior stakeholders on pricing, working capital and trading performance. Comfortable partnering with sales, operations and executive teams to strengthen planning discipline, controls and commercial decision-making.",
    coreSkills: [
      "Commercial finance leadership",
      "Forecasting and planning",
      "Board-level reporting",
      "Margin and pricing analysis",
      "Working-capital visibility",
      "Business partnering",
      "Performance management",
      "Controls and governance",
      "Stakeholder influence",
      "Transformation support",
    ],
    achievementBullets: [
      "Led monthly commercial performance reviews for a multi-site services portfolio, translating margin, cash and forecast movements into actions for senior sales and operations leaders.",
      "Redesigned the rolling forecast process with commercial teams, improving visibility of revenue risk and giving leadership earlier warning of working-capital pressure.",
      "Built pricing and profitability analysis that identified underperforming customer segments and supported targeted margin recovery actions.",
    ],
    experienceExamples: [
      {
        before: "Responsible for monthly reporting and forecasting.",
        after:
          "Led monthly performance reporting and rolling forecast reviews across a multi-million-pound services portfolio, improving visibility of margin pressure, cash risk and trading decisions for senior stakeholders.",
        why:
          "The stronger wording adds scale, commercial context and the decisions supported by the finance work.",
      },
      {
        before: "Worked with commercial teams to improve profitability.",
        after:
          "Partnered with sales and operations leaders to identify pricing leakage and underperforming customer segments, supporting targeted actions to protect margin and improve profitability.",
        why:
          "This version shows business partnering, stakeholder influence and a clearer link between analysis and commercial action.",
      },
    ],
  },
  interviewPrep: [
    "Talk through a forecast accuracy improvement and how it changed resource, margin or cash decisions.",
    "Prepare a pricing or margin story where you challenged assumptions and influenced commercial leaders.",
    "Use one example of improving cash or working-capital visibility for senior stakeholders.",
    "Explain how you translated reporting into board-level action during a period of trading pressure.",
    "Prepare a controls or governance example that shows commercial judgement as well as risk discipline.",
  ],
  nextSteps: [
    "Rewrite the opening profile around commercial finance leadership, decision support and stakeholder influence.",
    "Update the first six achievement bullets with quantified impact across margin, cash, forecasting or pricing.",
    "Add missing job-spec language around board-level reporting, working capital and performance management.",
    "Prepare two interview stories: one on commercial impact and one on influencing non-finance leaders.",
    "Consider Senior Finance Review if this is a critical role or a step up in seniority.",
  ],
};
