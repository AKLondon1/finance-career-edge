import type { GeneratedReport } from "@/lib/types";

export function buildReportText(report: GeneratedReport) {
  return [
    "Finance Career Edge - Tailored Role Report",
    "",
    `Candidate: ${report.candidateName}`,
    `Target role: ${report.targetRole}`,
    report.targetCompany ? `Target company: ${report.targetCompany}` : "",
    `Package: ${report.packageName}`,
    `Role-fit score: ${report.score}%`,
    "",
    "Executive summary",
    report.executiveSummary,
    "",
    "Score breakdown",
    ...report.roleReport.assessments.map(
      (item) => `- ${item.label}: ${item.score}% - ${item.text}`,
    ),
    "",
    "Priority fixes",
    ...report.roleReport.priorityFixes.map((item) => `- ${item.title}: ${item.text}`),
    "",
    "CV strengths",
    ...report.roleReport.strengths.map((item) => `- ${item}`),
    "",
    "CV weaknesses",
    ...report.roleReport.weaknesses.map((item) => `- ${item}`),
    "",
    "Missing senior-finance signals",
    ...report.roleReport.missingSignals.map((item) => `- ${item}`),
    "",
    "Keyword gaps",
    report.roleReport.keywordGaps.join(", "),
    "",
    "Interview talking points",
    ...report.interviewPrep.map((item) => `- ${item}`),
    "",
    "Recommended next steps",
    ...report.nextSteps.map((item) => `- ${item}`),
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function buildCvDraftText(report: GeneratedReport) {
  return [
    "Finance Career Edge - New CV Draft for This Application",
    "",
    `Target role: ${report.targetRole}`,
    report.targetCompany ? `Target company: ${report.targetCompany}` : "",
    "",
    "Professional profile",
    report.cvDraft.profile,
    "",
    "Core skills",
    ...report.cvDraft.coreSkills.map((item) => `- ${item}`),
    "",
    "Achievement bullets",
    ...report.cvDraft.achievementBullets.map((item) => `- ${item}`),
    "",
    "Experience wording examples",
    ...report.cvDraft.experienceExamples.flatMap((item) => [
      `Original: ${item.before}`,
      `Improved: ${item.after}`,
      `Why stronger: ${item.why}`,
      "",
    ]),
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function downloadTextFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
