import { Button } from "@/components/Button";
import type { ReactNode } from "react";

type MobileStickyCTAProps = {
  href: string;
  label: ReactNode;
  supportingText?: string;
};

export function MobileStickyCTA({ href, label, supportingText }: MobileStickyCTAProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-porcelain/95 px-4 pb-4 pt-3 shadow-[0_-12px_35px_rgba(24,33,47,0.08)] backdrop-blur sm:hidden">
      {supportingText ? (
        <p className="mb-2 text-center text-xs font-medium text-ink-soft">{supportingText}</p>
      ) : null}
      <Button href={href} fullWidth>
        {label}
      </Button>
    </div>
  );
}
