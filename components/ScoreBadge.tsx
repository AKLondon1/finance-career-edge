type ScoreBadgeProps = {
  score: number;
  label?: string;
};

export function ScoreBadge({ score, label = "Overall role fit" }: ScoreBadgeProps) {
  return (
    <div className="rounded-[2rem] border border-spruce/15 bg-white p-5 text-center shadow-soft sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-spruce">{label}</p>
      <div
        className="mx-auto mt-5 flex h-36 w-36 items-center justify-center rounded-full p-2"
        style={{
          background: `conic-gradient(#28554d ${score}%, #e8e1d3 ${score}% 100%)`,
        }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
          <span className="text-5xl font-semibold text-ink">{score}%</span>
        </div>
      </div>
      <p className="mx-auto mt-5 max-w-xs text-sm leading-6 text-ink-soft">
        Strong base, with priority work needed on senior-finance evidence and commercial framing.
      </p>
    </div>
  );
}
