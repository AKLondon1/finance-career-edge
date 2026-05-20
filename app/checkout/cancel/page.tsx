import { Suspense } from "react";
import { CheckoutCancelClient } from "@/components/CheckoutCancelClient";
import { PageShell } from "@/components/PageShell";

export default function CheckoutCancelPage() {
  return (
    <PageShell className="pt-8 sm:pt-12" width="narrow">
      <Suspense fallback={<CancelFallback />}>
        <CheckoutCancelClient />
      </Suspense>
    </PageShell>
  );
}

function CancelFallback() {
  return (
    <div className="rounded-[2rem] border border-ink/10 bg-white p-6 text-center shadow-soft sm:p-10">
      <h1 className="text-2xl font-semibold leading-tight text-ink">
        Returning to review details
      </h1>
    </div>
  );
}
