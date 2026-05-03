type LegalSection = {
  title: string;
  body: string[];
};

type LegalPageProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Document informativ
      </p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        {title}
      </h1>

      <p className="mt-4 text-slate-700">{intro}</p>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Acest document este un draft intern pentru versiunea de dezvoltare. Înainte de
        publicarea finală, datele companiei, termenii, garanțiile și obligațiile legale
        trebuie verificate și confirmate.
      </div>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
            <div className="mt-4 space-y-3 text-slate-700">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
