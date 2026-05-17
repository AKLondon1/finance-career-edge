import { cn } from "@/lib/utils";

type TrustStripProps = {
  items: string[];
  className?: string;
};

export function TrustStrip({ items, className }: TrustStripProps) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-ink/10 bg-white/85 p-3 shadow-card backdrop-blur",
        className,
      )}
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div className="rounded-[1.15rem] bg-porcelain px-4 py-3" key={item}>
            <p className="text-sm font-semibold leading-5 text-ink">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
