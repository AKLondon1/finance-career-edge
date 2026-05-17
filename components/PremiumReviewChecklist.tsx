type PremiumReviewChecklistProps = {
  items: string[];
};

export function PremiumReviewChecklist({ items }: PremiumReviewChecklistProps) {
  return (
    <div className="rounded-[2rem] border border-ink/10 bg-ink p-5 text-white shadow-soft sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
        Quality-control checklist
      </p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight">What the pack includes</h2>
      <ul className="mt-7 space-y-4">
        {items.map((item) => (
          <li className="flex gap-3 text-sm leading-6 text-white/80" key={item}>
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brass" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
