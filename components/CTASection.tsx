import { Button } from "@/components/Button";
import type { ReactNode } from "react";

type CTASectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: ReactNode;
  secondaryHref?: string;
  secondaryLabel?: ReactNode;
};

export function CTASection({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: CTASectionProps) {
  return (
    <div className="rounded-[2rem] bg-ink p-6 text-white shadow-soft sm:p-10 lg:p-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/75">{description}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={primaryHref} variant="secondary">
            {primaryLabel}
          </Button>
          {secondaryHref && secondaryLabel ? (
            <Button href={secondaryHref} variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
