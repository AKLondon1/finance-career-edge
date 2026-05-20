type KeywordGroupProps = {
  title: string;
  covered: string[];
  strengthen: string[];
  suggested: string;
};

export function KeywordGroup({ title, covered, strengthen, suggested }: KeywordGroupProps) {
  return (
    <article className="rounded-[1.5rem] border border-ink/10 bg-white p-4 shadow-card sm:p-5">
      <h3 className="text-lg font-semibold leading-7 text-ink">{title}</h3>

      <div className="mt-4 grid gap-4">
        <ChipBlock items={covered} label="Already covered" tone="covered" />
        <ChipBlock items={strengthen} label="Strengthen" tone="strengthen" />
      </div>

      <div className="mt-4 rounded-[1.1rem] bg-spruce-soft p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-spruce">
          Suggested wording
        </p>
        <p className="mt-2 text-sm leading-6 text-ink-soft">{suggested}</p>
      </div>
    </article>
  );
}

function ChipBlock({
  items,
  label,
  tone,
}: {
  items: string[];
  label: string;
  tone: "covered" | "strengthen";
}) {
  const classes =
    tone === "covered"
      ? "border-spruce/15 bg-spruce-soft text-spruce"
      : "border-brass/20 bg-[#f7efe2] text-ink";

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${classes}`} key={item}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
