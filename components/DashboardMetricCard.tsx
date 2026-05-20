type DashboardMetricCardProps = {
  label: string;
  score: number;
  text: string;
};

export function DashboardMetricCard({ label, score, text }: DashboardMetricCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-ink/10 bg-white p-4 shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold leading-6 text-ink">{label}</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{text}</p>
        </div>
        <span className="shrink-0 rounded-full bg-spruce-soft px-3 py-1.5 text-sm font-semibold text-spruce">
          {score}%
        </span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-mist">
        <div className="h-2 rounded-full bg-spruce" style={{ width: `${score}%` }} />
      </div>
    </article>
  );
}
