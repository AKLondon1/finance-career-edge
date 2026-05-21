import Link from "next/link";
import { reportSections, sectionHref, type ReportSectionId } from "@/lib/report-sections";
import { cn } from "@/lib/utils";

type ReportCategoryNavProps = {
  activeSection: ReportSectionId;
  baseHref: string;
};

export function ReportCategoryNav({ activeSection, baseHref }: ReportCategoryNavProps) {
  return (
    <nav
      aria-label="Report categories"
      className="sticky top-[73px] z-30 -mx-4 border-y border-ink/10 bg-porcelain/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-full sm:border sm:shadow-card"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
        {reportSections.map((category) => (
          <Link
            aria-current={activeSection === category.id ? "page" : undefined}
            className={cn(
              "focus-ring whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold shadow-card transition",
              activeSection === category.id
                ? "bg-ink text-white"
                : "bg-white text-ink-soft hover:bg-ink hover:text-white",
            )}
            href={sectionHref(baseHref, category.id)}
            key={category.id}
          >
            {category.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
