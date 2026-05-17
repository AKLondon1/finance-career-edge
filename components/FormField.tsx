import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  value: string;
  error?: string;
  hint?: string;
  type?: string;
  rows?: number;
  multiline?: boolean;
  onChange: (value: string) => void;
};

export function FormField({
  label,
  value,
  error,
  hint,
  type = "text",
  rows = 4,
  multiline,
  onChange,
}: FormFieldProps) {
  const fieldClasses = cn(
    "focus-ring mt-2 w-full rounded-[1.25rem] border bg-porcelain px-4 py-3.5 text-base leading-7 text-ink shadow-sm outline-none transition",
    error ? "border-red-400 bg-red-50/60" : "border-ink/10 focus-visible:border-spruce",
  );

  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {hint ? <span className="mt-1 block text-sm leading-6 text-ink-soft">{hint}</span> : null}
      {multiline ? (
        <textarea
          aria-invalid={Boolean(error)}
          className={fieldClasses}
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          aria-invalid={Boolean(error)}
          className={fieldClasses}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error ? (
        <span className="mt-2 block rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}
