import Link from "next/link";

type Section = {
  title: string;
  body: string[];
};

type Feature = {
  title: string;
  description: string;
};

type PublicPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  features?: Feature[];
  sections?: Section[];
};

export function PublicPage({
  eyebrow,
  title,
  intro,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  features = [],
  sections = []
}: PublicPageProps) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <section className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-700">{intro}</p>

        {(primaryHref || secondaryHref) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryHref && primaryLabel ? (
              <Link
                href={primaryHref}
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                {primaryLabel}
              </Link>
            ) : null}

            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        )}
      </section>

      {features.length > 0 ? (
        <section className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {feature.description}
              </p>
            </article>
          ))}
        </section>
      ) : null}

      {sections.length > 0 ? (
        <section className="mt-12 space-y-6">
          {sections.map((section) => (
            <article key={section.title} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
              <div className="mt-4 space-y-3 text-slate-700">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}
