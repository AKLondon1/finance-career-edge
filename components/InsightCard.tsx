import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type InsightCardProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  tone?: "plain" | "spruce" | "brass" | "dark";
  className?: string;
};

const tones = {
  plain: "border-ink/10 bg-white text-ink",
  spruce: "border-spruce/15 bg-spruce-soft text-ink",
  brass: "border-brass/20 bg-[#f7efe2] text-ink",
  dark: "border-white/10 bg-ink text-white",
};

export function InsightCard({
  title,
  eyebrow,
  children,
  tone = "plain",
  className,
}: InsightCardProps) {
  return (
    <section className={cn("rounded-[1.75rem] border p-5 shadow-card sm:p-6", tones[tone], className)}>
      {eyebrow ? (
        <p className={cn("mb-3 text-xs font-semibold uppercase tracking-[0.16em]", tone === "dark" ? "text-brass" : "text-spruce")}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn("text-xl font-semibold leading-7", tone === "dark" ? "text-white" : "text-ink")}>
        {title}
      </h2>
      <div className={cn("mt-4 text-sm leading-7 sm:text-base", tone === "dark" ? "text-white/80" : "text-ink-soft")}>
        {children}
      </div>
    </section>
  );
}
