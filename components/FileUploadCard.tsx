"use client";

import { cn } from "@/lib/utils";

type FileUploadCardProps = {
  fileName: string;
  error?: string;
  onChange: (fileName: string) => void;
};

export function FileUploadCard({ fileName, error, onChange }: FileUploadCardProps) {
  return (
    <label
      className={cn(
        "block cursor-pointer rounded-[1.5rem] border border-dashed bg-porcelain p-5 text-center transition hover:border-spruce/40",
        error ? "border-red-400 bg-red-50/60" : "border-ink/15",
      )}
    >
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-semibold text-spruce shadow-card">
        CV
      </span>
      <span className="mt-4 block text-lg font-semibold text-ink">
        {fileName || "Choose your CV file"}
      </span>
      <span className="mt-2 block text-sm leading-6 text-ink-soft">
        PDF, DOC, DOCX or TXT
      </span>
      <span className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
        Select file
      </span>
      <input
        accept=".pdf,.doc,.docx,.txt"
        className="sr-only"
        type="file"
        onChange={(event) => onChange(event.target.files?.[0]?.name ?? "")}
      />
      {error ? (
        <span className="mt-3 block rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}
