const categories = [
  { href: "#overview", label: "Overview" },
  { href: "#role-fit", label: "Role Fit" },
  { href: "#cv-draft", label: "CV Draft" },
  { href: "#keywords", label: "Keywords" },
  { href: "#interview-prep", label: "Interview Prep" },
  { href: "#next-steps", label: "Next Steps" },
];

export function ReportCategoryNav() {
  return (
    <nav
      aria-label="Report categories"
      className="sticky top-[73px] z-30 -mx-4 border-y border-ink/10 bg-porcelain/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-full sm:border sm:shadow-card"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
        {categories.map((category) => (
          <a
            className="focus-ring whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink-soft shadow-card transition hover:bg-ink hover:text-white"
            href={category.href}
            key={category.href}
          >
            {category.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
