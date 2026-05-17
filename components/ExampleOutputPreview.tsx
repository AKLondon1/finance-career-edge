import { outputPreview } from "@/lib/productData";

export function ExampleOutputPreview() {
  return (
    <div className="rounded-[2rem] border border-ink/10 bg-ink p-4 text-white shadow-soft sm:p-5">
      <div className="rounded-[1.5rem] bg-white/10 p-4 ring-1 ring-white/10 sm:p-5">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f38b7d]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e6c35f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#62b58f]" />
          <span className="ml-auto text-xs font-medium text-white/60">Output preview</span>
        </div>
        <div className="grid gap-3 pt-4">
          <div className="rounded-2xl bg-white p-4 text-ink">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">
                Tailored role report
              </p>
              <span className="rounded-full bg-spruce-soft px-3 py-1 text-xs font-semibold text-spruce">
                {outputPreview.roleReport.score}% fit
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-ink-soft">
              {outputPreview.roleReport.priorityFixes.slice(0, 3).map((fix) => (
                <li className="flex gap-2" key={fix}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                  <span>{fix}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {outputPreview.roleReport.keywordGaps.map((gap) => (
                <span className="rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-ink-soft" key={gap}>
                  {gap}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">
              Improved CV draft
            </p>
            <p className="mt-3 text-sm font-semibold leading-6 text-white">
              {outputPreview.cvDraft.profile}
            </p>
            <p className="mt-3 rounded-xl bg-white/10 p-3 text-sm leading-6 text-white/80">
              {outputPreview.cvDraft.achievement}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
