import Link from "next/link";
import { Button } from "@/components/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-porcelain/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-full">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white shadow-card">
            FCE
          </span>
          <span>
            <span className="block text-sm font-semibold text-ink">Finance Career Edge</span>
            <span className="hidden text-xs text-ink-soft min-[390px]:block">
              Senior finance applications
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft md:flex">
          <Link className="hover:text-ink" href="/#packages">
            Packages
          </Link>
          <Link className="hover:text-ink" href="/report">
            Example report
          </Link>
          <Link className="hover:text-ink" href="/premium-review">
            Premium review
          </Link>
        </nav>
        <Button href="/intake?package=ai-tailored-cv-report" className="min-w-28 px-4 sm:inline-flex">
          Start CV review
        </Button>
      </div>
    </header>
  );
}
