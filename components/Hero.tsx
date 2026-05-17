import type { ReactNode } from "react";
import { Button } from "@/components/Button";
import { TrustStrip } from "@/components/TrustStrip";

type HeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: ReactNode;
  secondaryHref: string;
  secondaryLabel: ReactNode;
  proofPoints: string[];
  children: ReactNode;
};

export function Hero({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  proofPoints,
  children,
}: HeroProps) {
  return (
    <section className="px-4 pb-10 pt-7 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.96fr_0.84fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-brass/25 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brass shadow-card">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-[2.55rem] font-semibold leading-[1.03] text-ink sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.05rem] leading-8 text-ink-soft sm:text-lg">
            {description}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href={primaryHref} fullWidth className="sm:w-auto">
              {primaryLabel}
            </Button>
            <Button href={secondaryHref} variant="secondary" fullWidth className="sm:w-auto">
              {secondaryLabel}
            </Button>
          </div>
          <TrustStrip items={proofPoints} className="mt-6" />
        </div>
        <div className="lg:pl-4">{children}</div>
      </div>
    </section>
  );
}
