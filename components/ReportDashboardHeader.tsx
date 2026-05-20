import type { ReactNode } from "react";

type ReportDashboardHeaderProps = {
  packageName: string;
  targetRole: string;
  targetCompany?: string;
  score: number;
  generatedDate: string;
  summary: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  actionBar?: ReactNode;
};

export function ReportDashboardHeader({
  packageName,
  targetRole,
  targetCompany,
  score,
  generatedDate,
  summary,
  eyebrow = "Finance Career Edge",
  title = "Senior finance application dashboard",
  intro,
  actionBar,
}: ReportDashboardHeaderProps) {
  return (
    <header className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[1fr_20rem]">
        <div className="p-5 sm:p-7 lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-5xl">
            {title}
          </h1>
          {intro ? <p className="mt-4 max-w-3xl text-base leading-8 text-ink-soft">{intro}</p> : null}

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge>{packageName}</Badge>
            <Badge>Target role: {targetRole}</Badge>
            {targetCompany ? <Badge>Target company: {targetCompany}</Badge> : null}
            <Badge>Prepared: {generatedDate}</Badge>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-8 text-ink-soft">{summary}</p>

          {actionBar ? <div className="mt-6">{actionBar}</div> : null}
        </div>

        <div className="border-t border-ink/10 bg-ink p-5 text-white sm:p-7 lg:border-l lg:border-t-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
            Role-fit score
          </p>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-6xl font-semibold leading-none">{score}</span>
            <span className="pb-2 text-xl font-semibold text-white/70">%</span>
          </div>
          <div className="mt-5 h-2 rounded-full bg-white/15">
            <div className="h-2 rounded-full bg-brass" style={{ width: `${score}%` }} />
          </div>
          <p className="mt-5 text-sm leading-6 text-white/75">
            A focused view of role fit, CV draft strength, keyword alignment and
            interview preparation.
          </p>
        </div>
      </div>
    </header>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-ink-soft">
      {children}
    </span>
  );
}
