import { Button } from "@/components/Button";
import { PriceText } from "@/components/PriceText";
import type { Package } from "@/lib/productData";
import { cn } from "@/lib/utils";

type PackageCardProps = {
  item: Package;
  featured?: boolean;
};

export function PackageCard({ item, featured }: PackageCardProps) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[2rem] border bg-white p-5 shadow-card sm:p-7",
        featured ? "border-spruce/35 ring-1 ring-spruce/15" : "border-ink/10",
      )}
    >
      {featured ? <div className="absolute inset-x-0 top-0 h-1.5 bg-spruce" /> : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-sm">
          {item.badge ? (
            <p className="ml-2 inline-flex rounded-full bg-spruce-soft px-3 py-1.5 text-xs font-semibold text-spruce">
              {item.badge}
            </p>
          ) : (
            <p className="mb-3 inline-flex rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-ink-soft">
              {item.label}
            </p>
          )}
          <h3 className="mt-1 text-2xl font-semibold leading-tight text-ink">{item.name}</h3>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-4xl font-semibold text-ink">
            <PriceText product={item.slug} />
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">Current price</p>
        </div>
      </div>
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-brass">
        Who it is for
      </p>
      <p className="mt-2 leading-7 text-ink-soft">{item.audience}</p>
      <p className="mt-5 leading-7 text-ink-soft">{item.description}</p>
      <div className="mt-5 rounded-[1.25rem] bg-porcelain p-4">
        <p className="text-sm font-semibold text-ink">Delivery</p>
        <p className="mt-1 text-sm leading-6 text-ink-soft">{item.delivery}</p>
      </div>
      <ul className="mt-6 space-y-3 text-sm leading-6 text-ink-soft">
        {item.includes.map((include) => (
          <li className="flex gap-3" key={include}>
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
            <span>{include}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <Button href={item.href} fullWidth>
          {item.cta}
        </Button>
      </div>
    </article>
  );
}
