type KeywordChipsProps = {
  items: string[];
};

export function KeywordChips({ items }: KeywordChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          className="rounded-full border border-ink/10 bg-porcelain px-3 py-2 text-sm font-medium text-ink"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
