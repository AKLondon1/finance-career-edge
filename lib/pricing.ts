import type { PackageSlug } from "@/lib/productData";

export type CurrencyCode = "GBP" | "USD" | "EUR";

const prices: Record<PackageSlug, Record<CurrencyCode, number>> = {
  "ai-tailored-cv-report": {
    GBP: 49,
    USD: 59,
    EUR: 59,
  },
  "senior-finance-review": {
    GBP: 249,
    USD: 299,
    EUR: 289,
  },
};

const euroRegions = new Set([
  "AT",
  "BE",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PT",
  "SI",
  "SK",
]);

export function isCurrencyCode(value: string | null): value is CurrencyCode {
  return value === "GBP" || value === "USD" || value === "EUR";
}

export function currencyFromLocale(locale: string | undefined): CurrencyCode {
  if (!locale) {
    return "GBP";
  }

  const region = locale.split("-")[1]?.toUpperCase();

  if (region === "US") {
    return "USD";
  }

  if (region === "GB" || region === "UK") {
    return "GBP";
  }

  if (region && euroRegions.has(region)) {
    return "EUR";
  }

  return "GBP";
}

export function currencyFromSearch(search: string): CurrencyCode | null {
  const value = new URLSearchParams(search).get("currency")?.toUpperCase() ?? null;
  return isCurrencyCode(value) ? value : null;
}

export function formatPackagePrice(product: PackageSlug, currency: CurrencyCode) {
  return new Intl.NumberFormat(localeForCurrency(currency), {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(prices[product][currency]);
}

export function getPackagePrice(product: PackageSlug, currency: CurrencyCode) {
  return prices[product][currency];
}

export function getPackageUnitAmount(product: PackageSlug, currency: CurrencyCode) {
  return getPackagePrice(product, currency) * 100;
}

function localeForCurrency(currency: CurrencyCode) {
  if (currency === "USD") {
    return "en-US";
  }

  if (currency === "EUR") {
    return "en-IE";
  }

  return "en-GB";
}
