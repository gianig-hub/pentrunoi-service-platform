type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  items: FaqItem[];
};

export function FaqSection({ items }: FaqSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Întrebări frecvente
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          Răspunsuri rapide înainte să trimiți cererea
        </h2>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl bg-white p-6 shadow-sm"
          >
            <summary className="cursor-pointer list-none font-semibold text-slate-950">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="text-xl text-slate-400 group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-4 leading-7 text-slate-700">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
