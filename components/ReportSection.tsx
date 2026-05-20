import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ReportSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  tone?: "plain" | "muted" | "dark";
};

const tones = {
  plain: "",
  muted: "rounded-[2rem] bg-white/55 p-4 sm:p-6",
  dark: "rounded-[2rem] bg-ink p-5 text-white shadow-soft sm:p-7",
};

export function ReportSection({
  id,
  eyebrow,
  title,
  description,
  children,
  tone = "plain",
}: ReportSectionProps) {
  return (
    <section className={cn("scroll-mt-32", tones[tone])} id={id}>
      <div className="mb-5 max-w-3xl">
        <p className={cn("text-xs font-semibold uppercase tracking-[0.18em]", tone === "dark" ? "text-brass" : "text-spruce")}>
          {eyebrow}
        </p>
        <h2 className={cn("mt-3 text-2xl font-semibold leading-tight sm:text-3xl", tone === "dark" ? "text-white" : "text-ink")}>
          {title}
        </h2>
        {description ? (
          <p className={cn("mt-3 text-sm leading-7 sm:text-base", tone === "dark" ? "text-white/75" : "text-ink-soft")}>
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
