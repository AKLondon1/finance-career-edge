type ScoreBreakdownProps = {
  items: Array<{ label: string; score: number; text?: string }>;
};

export function ScoreBreakdown({ items }: ScoreBreakdownProps) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div className="rounded-[1.25rem] bg-white p-4 shadow-card" key={item.label}>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-ink">{item.label}</p>
            <p className="text-sm font-semibold text-spruce">{item.score}%</p>
          </div>
          <div className="mt-3 h-2 rounded-full bg-mist">
            <div
              className="h-2 rounded-full bg-spruce"
              style={{ width: `${item.score}%` }}
            />
          </div>
          {item.text ? <p className="mt-3 text-sm leading-6 text-ink-soft">{item.text}</p> : null}
        </div>
      ))}
    </div>
  );
}
