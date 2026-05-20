type InterviewPrepCardProps = {
  title: string;
  angle: string;
  evidence: string;
  why: string;
};

export function InterviewPrepCard({ title, angle, evidence, why }: InterviewPrepCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-ink/10 bg-white p-4 shadow-card sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">
        {title}
      </p>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-ink">{angle}</h3>
      <div className="mt-4 grid gap-3 text-sm leading-6 text-ink-soft">
        <p>
          <span className="font-semibold text-ink">Evidence to prepare: </span>
          {evidence}
        </p>
        <p>
          <span className="font-semibold text-ink">Why it matters: </span>
          {why}
        </p>
      </div>
    </article>
  );
}
