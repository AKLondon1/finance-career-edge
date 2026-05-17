"use client";

import { useEffect, useState } from "react";
import type { PackageSlug } from "@/lib/productData";
import {
  currencyFromLocale,
  currencyFromSearch,
  formatPackagePrice,
  type CurrencyCode,
} from "@/lib/pricing";

type PriceTextProps = {
  product: PackageSlug;
};

export function PriceText({ product }: PriceTextProps) {
  const [currency, setCurrency] = useState<CurrencyCode>("GBP");

  useEffect(() => {
    const queryCurrency = currencyFromSearch(window.location.search);

    if (queryCurrency) {
      setCurrency(queryCurrency);
      return;
    }

    const browserLocale = navigator.languages?.[0] ?? navigator.language;
    setCurrency(currencyFromLocale(browserLocale));
  }, []);

  return <>{formatPackagePrice(product, currency)}</>;
}
