type FAQItemProps = {
  question: string;
  answer: string;
};

export function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <details className="group rounded-[1.5rem] border border-ink/10 bg-white p-5 shadow-card">
      <summary className="cursor-pointer list-none text-base font-semibold leading-7 text-ink">
        <span className="flex items-center justify-between gap-4">
          {question}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-xl text-brass transition group-open:rotate-45">
            +
          </span>
        </span>
      </summary>
      <p className="mt-4 leading-7 text-ink-soft">{answer}</p>
    </details>
  );
}
