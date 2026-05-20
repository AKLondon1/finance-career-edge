import { PageShell } from "@/components/PageShell";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; body: string[] }>;
};

export function LegalPage({ eyebrow, title, intro, sections }: LegalPageProps) {
  return (
    <PageShell width="narrow" className="pt-8 sm:pt-12">
      <article className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink">{title}</h1>
        <p className="mt-5 leading-8 text-ink-soft">{intro}</p>
        <div className="mt-8 space-y-7">
          {sections.map((section) => (
            <section className="border-t border-ink/10 pt-6" key={section.title}>
              <h2 className="text-xl font-semibold text-ink">{section.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-ink-soft sm:text-base">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </PageShell>
  );
}
