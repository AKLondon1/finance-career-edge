import type { RewriteExample } from "@/lib/productData";

type AchievementRewriteCardProps = {
  rewrite: RewriteExample;
};

export function AchievementRewriteCard({ rewrite }: AchievementRewriteCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white">
      <div className="bg-mist p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
          Original wording
        </p>
        <p className="mt-2 text-ink-soft">{rewrite.before}</p>
      </div>
      <div className="border-y border-ink/10 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-spruce">
          Stronger senior-finance version
        </p>
        <p className="mt-2 font-medium leading-7 text-ink">{rewrite.after}</p>
      </div>
      <div className="bg-spruce-soft p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-spruce">
          Why this is better
        </p>
        <p className="mt-2 text-sm leading-6 text-ink-soft">{rewrite.why}</p>
      </div>
    </article>
  );
}
