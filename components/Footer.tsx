import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-ink-soft sm:px-6 md:grid-cols-[1.4fr_1fr] lg:px-8">
        <div>
          <p className="font-semibold text-ink">Finance Career Edge</p>
          <p className="mt-3 max-w-xl leading-6">
            Specialist CV and application support for UK finance professionals
            moving into senior commercial, FP&A, business partnering and finance
            leadership roles.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link href="#" className="rounded-full bg-porcelain px-4 py-2 hover:text-ink">
            Privacy Policy
          </Link>
          <Link href="#" className="rounded-full bg-porcelain px-4 py-2 hover:text-ink">
            Terms
          </Link>
          <Link href="#" className="rounded-full bg-porcelain px-4 py-2 hover:text-ink">
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
