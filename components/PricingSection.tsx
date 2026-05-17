import { PackageCard } from "@/components/PackageCard";
import { SectionHeading } from "@/components/SectionHeading";
import { packages } from "@/lib/productData";

export function PricingSection() {
  return (
    <div>
      <SectionHeading
        eyebrow="Choose your review"
        title="Start with the tailored report and CV draft, or add senior finance judgement."
        description="Both options include a downloadable tailored report and a new CV draft for this application. Senior Finance Review adds a human quality layer for important applications."
      />
      <p className="mt-4 text-sm font-medium text-ink-soft">
        Prices shown in your local currency where available.
      </p>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {packages.map((item) => (
          <PackageCard item={item} featured={item.recommended} key={item.name} />
        ))}
      </div>
    </div>
  );
}
