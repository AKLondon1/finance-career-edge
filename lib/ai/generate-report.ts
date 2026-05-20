import { generateReport as generateDeterministicReport } from "@/lib/report-generator";
import type { GeneratedReport, IntakeSubmission } from "@/lib/types";

export async function generateReportForSubmission(
  submission: IntakeSubmission,
): Promise<GeneratedReport> {
  if (process.env.OPENAI_API_KEY) {
    return generateDeterministicReport(submission);
  }

  return generateDeterministicReport(submission);
}
