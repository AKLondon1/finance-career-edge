import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "accent";
  fullWidth?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variants = {
  primary: "bg-ink text-white shadow-card hover:bg-[#101723]",
  secondary:
    "border border-ink/10 bg-white text-ink shadow-card hover:border-spruce/30 hover:text-spruce",
  ghost: "text-ink-soft hover:bg-ink/5 hover:text-ink",
  accent: "bg-brass text-white shadow-card hover:bg-[#a87a37]",
};

export function Button({
  children,
  href,
  variant = "primary",
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "focus-ring inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition sm:px-6",
    variants[variant],
    fullWidth && "w-full",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
