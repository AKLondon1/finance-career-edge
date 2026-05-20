"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { isPackageSlug } from "@/lib/productData";
import { isCurrencyCode } from "@/lib/pricing";

export function CheckoutCancelClient() {
  const searchParams = useSearchParams();
  const returnHref = useMemo(() => {
    const packageSlug = searchParams.get("package");
    const currency = searchParams.get("currency")?.toUpperCase() ?? null;
    const params = new URLSearchParams();

    if (isPackageSlug(packageSlug)) {
      params.set("package", packageSlug);
    }

    if (isCurrencyCode(currency)) {
      params.set("currency", currency);
    }

    const query = params.toString();
    return query ? `/intake?${query}` : "/intake";
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-white p-6 text-center shadow-soft sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
        Checkout not completed
      </p>
      <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
        Your review has not been purchased.
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-soft">
        Your review details can still be updated. Return to the intake page when
        you are ready to continue to secure checkout.
      </p>
      <Button href={returnHref} className="mt-7">
        Return to review details
      </Button>
    </div>
  );
}
