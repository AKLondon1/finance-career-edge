"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { FileUploadCard } from "@/components/FileUploadCard";
import { FormField } from "@/components/FormField";
import { IntakeSection } from "@/components/IntakeSection";
import { PackageSelector } from "@/components/PackageSelector";
import { PriceText } from "@/components/PriceText";
import { packages } from "@/lib/productData";
import { currencyFromLocale, currencyFromSearch } from "@/lib/pricing";
import {
  clearGeneratedReport,
  clearVerifiedPurchase,
  saveIntakeSubmission,
  savePendingOrderId,
} from "@/lib/report-storage";
import type { PackageSlug } from "@/lib/productData";
import type { CurrencyCode } from "@/lib/pricing";
import type { IntakeSubmission } from "@/lib/types";

type FormState = {
  fullName: string;
  email: string;
  targetRole: string;
  targetCompany: string;
  jobAdvert: string;
  cvFileName: string;
  cvText: string;
  achievements: string;
  concerns: string;
  packageChoice: PackageSlug;
};

type Errors = Partial<Record<keyof FormState | "cvInput", string>>;

const initialState: FormState = {
  fullName: "",
  email: "",
  targetRole: "",
  targetCompany: "",
  jobAdvert: "",
  cvFileName: "",
  cvText: "",
  achievements: "",
  concerns: "",
  packageChoice: "ai-tailored-cv-report",
};

export function IntakeForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("GBP");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Preparing secure checkout");

  useEffect(() => {
    const search = window.location.search;
    const selected = new URLSearchParams(search).get("package");
    if (selected === "senior-finance-review" || selected === "ai-tailored-cv-report") {
      setForm((current) => ({ ...current, packageChoice: selected }));
    }
    setCurrency(currencyFromSearch(search) ?? currencyFromLocale(window.navigator.language));
  }, []);

  const selectedPackage = useMemo(
    () => packages.find((item) => item.slug === form.packageChoice) ?? packages[0],
    [form.packageChoice],
  );

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, cvInput: undefined }));
    setFormError("");
  }

  function validate() {
    const nextErrors: Errors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Enter your full name.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.targetRole.trim()) {
      nextErrors.targetRole = "Enter the role or job title you are targeting.";
    }

    if (!form.cvFileName && !form.cvText.trim()) {
      nextErrors.cvInput = "Upload your CV or paste the CV text.";
    }

    if (form.cvText.trim().length > 0 && form.cvText.trim().length < 60) {
      nextErrors.cvText = "Paste a little more CV text so the review has enough context.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    setLoadingMessage("Preparing secure checkout");

    await delay(250);
    setLoadingMessage("Checking your selected review");

    const submission: IntakeSubmission = {
      ...form,
      packageName: selectedPackage.name,
      submittedAt: new Date().toISOString(),
    };

    saveIntakeSubmission(submission);
    clearGeneratedReport();
    clearVerifiedPurchase();

    try {
      const response = await fetch("/api/orders/create", {
        body: JSON.stringify({
          currency,
          intake: submission,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = (await response.json()) as {
        error?: string;
        orderId?: string;
      };

      if (!response.ok || !data.orderId) {
        throw new Error(data.error || "Your review details could not be saved.");
      }

      savePendingOrderId(data.orderId);
      setLoadingMessage("Opening secure checkout");

      const checkoutResponse = await fetch("/api/checkout/create-session", {
        body: JSON.stringify({ orderId: data.orderId }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const checkoutData = (await checkoutResponse.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!checkoutResponse.ok || !checkoutData.checkoutUrl) {
        throw new Error(checkoutData.error || "Secure checkout could not be started.");
      }

      setLoadingMessage("Opening secure checkout");
      window.location.assign(checkoutData.checkoutUrl);
    } catch (error) {
      setIsSubmitting(false);
      setFormError(
        error instanceof Error
          ? error.message
          : "Secure checkout could not be started. Please try again.",
      );
    }
  }

  if (isSubmitting) {
    return (
      <div className="rounded-[2rem] border border-ink/10 bg-white p-6 text-center shadow-soft sm:p-8">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-spruce-soft border-t-spruce" />
        <h2 className="mt-6 text-2xl font-semibold leading-tight text-ink">
          {loadingMessage}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-soft">
          We are preparing secure checkout for your selected review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-28 sm:pb-0">
      <div className="rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
          <span>Review setup</span>
          <span>3 steps</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["CV", "Target role", "Review option"].map((step) => (
            <span className="h-2 rounded-full bg-spruce" key={step} title={step} />
          ))}
        </div>
      </div>

      <IntakeSection
        step="1"
        title="Your CV"
        description="Upload your CV or paste the text instead. Use whichever is quicker for you."
      >
        <FileUploadCard
          error={errors.cvInput}
          fileName={form.cvFileName}
          onChange={(fileName) => updateField("cvFileName", fileName)}
        />
        <FormField
          label="Paste CV text instead"
          hint="Use this if you prefer not to select a file."
          value={form.cvText}
          error={errors.cvText}
          multiline
          rows={6}
          onChange={(value) => updateField("cvText", value)}
        />
      </IntakeSection>

      <IntakeSection
        step="2"
        title="Target role"
        description="Add the role you are aiming for. The job spec is optional, but it helps make the report more tailored."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Full name"
            value={form.fullName}
            error={errors.fullName}
            onChange={(value) => updateField("fullName", value)}
          />
          <FormField
            label="Email address"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(value) => updateField("email", value)}
          />
          <FormField
            label="Target role or job title"
            hint="Example: Head of Finance, Commercial Finance Manager, Finance Business Partner."
            value={form.targetRole}
            error={errors.targetRole}
            onChange={(value) => updateField("targetRole", value)}
          />
          <FormField
            label="Target company, optional"
            value={form.targetCompany}
            onChange={(value) => updateField("targetCompany", value)}
          />
        </div>
        <FormField
          label="Job advert text, optional"
          hint="The job spec is optional, but it helps make the report more tailored."
          value={form.jobAdvert}
          multiline
          rows={5}
          onChange={(value) => updateField("jobAdvert", value)}
        />
      </IntakeSection>

      <details className="rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-card">
        <summary className="cursor-pointer list-none text-lg font-semibold text-ink">
          Optional context
          <span className="mt-1 block text-sm font-normal leading-6 text-ink-soft">
            Useful if you want the review to pick up specific wins.
          </span>
        </summary>
        <div className="mt-5 grid gap-5">
          <FormField
            label="Top achievements, optional"
            hint="Use numbers where possible: revenue, margin, cash, cost, forecast accuracy, team size, portfolio scale or transformation impact."
            value={form.achievements}
            multiline
            rows={4}
            onChange={(value) => updateField("achievements", value)}
          />
          <FormField
            label="Main CV concerns, optional"
            hint="Example: too operational, not commercial enough, weak senior narrative or limited board-level language."
            value={form.concerns}
            multiline
            rows={3}
            onChange={(value) => updateField("concerns", value)}
          />
        </div>
      </details>

      <IntakeSection
        step="3"
        title="Choose your review"
        description="Start with the tailored CV and role report, or add senior finance judgement for an important application."
      >
        <fieldset>
          <legend className="sr-only">Package choice</legend>
          <PackageSelector
            packages={packages}
            value={form.packageChoice}
            onChange={(value) => updateField("packageChoice", value)}
          />
        </fieldset>
      </IntakeSection>

      <div className="rounded-[1.75rem] border border-spruce/15 bg-spruce-soft p-5 shadow-card">
        <p className="font-semibold text-ink">Privacy note</p>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          Your information is used to prepare your review. Do not include unnecessary
          sensitive personal information.
        </p>
      </div>

      {formError ? (
        <div className="rounded-[1.5rem] border border-brass/20 bg-[#f7efe2] p-4 text-sm leading-6 text-ink-soft shadow-card">
          <p className="font-semibold text-ink">Checkout could not be started</p>
          <p className="mt-1">{formError}</p>
        </div>
      ) : null}

      <div className="hidden rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-card sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">Selected review</p>
          <p className="mt-1 text-sm text-ink-soft">
            {selectedPackage.name}, <PriceText product={selectedPackage.slug} />
          </p>
        </div>
        <Button type="submit" className="sm:min-w-56">
          Continue to secure checkout
        </Button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-porcelain/95 px-4 pb-4 pt-3 shadow-[0_-12px_35px_rgba(24,33,47,0.08)] backdrop-blur sm:hidden">
        <p className="mb-2 text-center text-xs font-medium text-ink-soft">
          {selectedPackage.name}, <PriceText product={selectedPackage.slug} />
        </p>
        <Button type="submit" fullWidth>
          Continue to secure checkout
        </Button>
      </div>
    </form>
  );
}

function delay(milliseconds: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}
