import { Suspense } from "react";
import { CheckoutSuccessClient } from "@/components/CheckoutSuccessClient";
import { PageShell } from "@/components/PageShell";

export default function CheckoutSuccessPage() {
  return (
    <PageShell className="pt-8 sm:pt-12" width="narrow">
      <Suspense fallback={<SuccessFallback />}>
        <CheckoutSuccessClient />
      </Suspense>
    </PageShell>
  );
}

function SuccessFallback() {
  return (
    <div className="rounded-[2rem] border border-ink/10 bg-white p-6 text-center shadow-soft sm:p-10">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-spruce-soft border-t-spruce" />
      <h1 className="mt-6 text-2xl font-semibold leading-tight text-ink">
        Confirming secure checkout
      </h1>
    </div>
  );
}
