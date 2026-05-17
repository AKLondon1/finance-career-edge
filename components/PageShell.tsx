import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "plain" | "muted" | "dark";
  width?: "narrow" | "standard" | "wide";
};

const widths = {
  narrow: "max-w-4xl",
  standard: "max-w-7xl",
  wide: "max-w-[88rem]",
};

const tones = {
  plain: "",
  muted: "bg-white/50",
  dark: "bg-ink text-white",
};

export function PageShell({
  children,
  className,
  id,
  tone = "plain",
  width = "standard",
}: PageShellProps) {
  return (
    <section
      id={id}
      className={cn("px-4 py-12 sm:px-6 sm:py-16 lg:px-8", tones[tone], className)}
    >
      <div className={cn("mx-auto", widths[width])}>{children}</div>
    </section>
  );
}
