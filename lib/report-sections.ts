export const reportSections = [
  { id: "overview", label: "Overview" },
  { id: "role-fit", label: "Role Fit" },
  { id: "cv-draft", label: "CV Draft" },
  { id: "keywords", label: "Keywords" },
  { id: "interview-prep", label: "Interview Prep" },
  { id: "next-steps", label: "Next Steps" },
] as const;

export type ReportSectionId = (typeof reportSections)[number]["id"];

const reportSectionIds = new Set<string>(reportSections.map((section) => section.id));

export function normaliseReportSection(section: string | null | undefined): ReportSectionId {
  return section && reportSectionIds.has(section) ? (section as ReportSectionId) : "overview";
}

export function sectionHref(baseHref: string, section: ReportSectionId) {
  const [path, query = ""] = baseHref.split("?");
  const params = new URLSearchParams(query);
  params.set("section", section);
  const nextQuery = params.toString();

  return nextQuery ? `${path}?${nextQuery}` : path;
}
