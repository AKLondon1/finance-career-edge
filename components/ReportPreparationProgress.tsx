"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const preparationSteps = [
  "Reading your CV",
  "Comparing it with the target role",
  "Preparing role-fit recommendations",
  "Drafting your application-specific CV",
  "Finalising your report",
];

type ReportPreparationProgressProps = {
  active: boolean;
};

export function ReportPreparationProgress({ active }: ReportPreparationProgressProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setActiveStep(0);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, preparationSteps.length - 1));
    }, 1800);

    return () => window.clearInterval(interval);
  }, [active]);

  const progressWidth = `${((activeStep + 1) / preparationSteps.length) * 100}%`;

  return (
    <div className="mx-auto mt-6 max-w-xl text-left" aria-live="polite">
      <p className="mb-5 rounded-[1.25rem] border border-spruce/15 bg-spruce-soft px-4 py-3 text-sm leading-6 text-ink-soft">
        Report preparation can take a little time. Please do not refresh or close
        this page. Your report will open automatically when it is ready.
      </p>

      <div className="h-2 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-spruce transition-all duration-700 ease-out"
          style={{ width: progressWidth }}
        />
      </div>

      <ol className="mt-5 space-y-3">
        {preparationSteps.map((step, index) => {
          const isComplete = index < activeStep;
          const isCurrent = index === activeStep;

          return (
            <li
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
                isCurrent
                  ? "border-spruce/25 bg-spruce-soft text-ink"
                  : "border-ink/10 bg-white text-ink-soft",
              )}
              key={step}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isComplete || isCurrent
                    ? "bg-spruce text-white"
                    : "bg-ink/10 text-ink-soft",
                )}
              >
                {isComplete ? "OK" : index + 1}
              </span>
              <span className="font-medium">{step}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
