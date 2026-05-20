import type { PriorityFix } from "@/lib/types";

type PriorityFixCardProps = {
  fix: PriorityFix;
  index: number;
};

export function PriorityFixCard({ fix, index }: PriorityFixCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-ink/10 bg-white p-4 shadow-card">
      <div className="flex gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
          {index + 1}
        </span>
        <div>
          <h3 className="font-semibold leading-6 text-ink">{fix.title}</h3>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{fix.text}</p>
        </div>
      </div>
    </article>
  );
}
