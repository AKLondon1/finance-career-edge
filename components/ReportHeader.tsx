import { Button } from "@/components/Button";
import { ScoreBadge } from "@/components/ScoreBadge";

type ReportHeaderProps = {
  score: number;
  targetRole: string;
  packageName: string;
  summary: string;
};

export function ReportHeader({
  score,
  targetRole,
  packageName,
  summary,
}: ReportHeaderProps) {
  return (
    <header className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-soft sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <ScoreBadge score={score} />
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-spruce-soft px-3 py-1.5 text-xs font-semibold text-spruce">
              {packageName}
            </span>
            <span className="rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-ink-soft">
              Target role: {targetRole}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-5xl">
            Senior finance CV diagnostic
          </h1>
          <p className="mt-4 text-base leading-8 text-ink-soft">{summary}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/intake">Update intake</Button>
            <Button href="/premium-review" variant="secondary">
              Add senior finance review
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
