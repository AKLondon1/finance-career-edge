"use client";

import { PriceText } from "@/components/PriceText";
import type { Package } from "@/lib/productData";
import type { PackageSlug } from "@/lib/productData";
import { cn } from "@/lib/utils";

type PackageSelectorProps = {
  packages: Package[];
  value: PackageSlug;
  onChange: (value: PackageSlug) => void;
};

export function PackageSelector({ packages, value, onChange }: PackageSelectorProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {packages.map((item) => {
        const checked = value === item.slug;

        return (
          <label
            className={cn(
              "cursor-pointer rounded-[1.5rem] border p-4 transition",
              checked
                ? "border-spruce/35 bg-spruce-soft shadow-card"
                : "border-ink/10 bg-porcelain hover:border-spruce/30",
            )}
            key={item.name}
          >
            <span className="flex items-start gap-3">
              <input
                checked={checked}
                className="mt-1 h-5 w-5 accent-spruce"
                name="packageChoice"
                type="radio"
                onChange={() => onChange(item.slug)}
              />
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-2xl font-semibold text-ink">
                    <PriceText product={item.slug} />
                  </span>
                  {item.badge ? (
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-spruce">
                      {item.badge}
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 block text-lg font-semibold leading-6 text-ink">
                  {item.name}
                </span>
                {!item.badge ? (
                  <span className="mt-2 block text-sm font-medium text-brass">{item.label}</span>
                ) : null}
                <span className="mt-2 block text-sm leading-6 text-ink-soft">
                  {item.delivery}
                </span>
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
