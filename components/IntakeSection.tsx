import type { ReactNode } from "react";

type IntakeSectionProps = {
  step: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function IntakeSection({ step, title, description, children }: IntakeSectionProps) {
  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-card sm:p-6">
      <div className="flex gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-spruce-soft text-sm font-semibold text-spruce">
          {step}
        </span>
        <div>
          <h2 className="text-xl font-semibold leading-7 text-ink">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-ink-soft">{description}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-5">{children}</div>
    </section>
  );
}
