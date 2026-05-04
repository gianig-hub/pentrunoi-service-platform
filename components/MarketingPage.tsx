import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";

type Card = {
  title: string;
  description: string;
};

type Step = {
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type MarketingPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  highlights: Card[];
  problemsTitle?: string;
  problemsIntro?: string;
  problems?: Card[];
  processTitle?: string;
  processIntro?: string;
  steps?: Step[];
  trustTitle?: string;
  trustIntro?: string;
  trustItems?: string[];
  faqs?: FaqItem[];
};

export function MarketingPage({
  eyebrow,
  title,
  intro,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  highlights,
  problemsTitle = "Ce putem rezolva",
  problemsIntro = "Serviciile sunt gândite pentru probleme reale, explicate clar și urmărite prin status.",
  problems = [],
  processTitle = "Cum lucrăm",
  processIntro = "Flux simplu, fără cont client: formular, tracking, actualizări și decizie informată.",
  steps = [],
  trustTitle = "De ce contează platforma",
  trustIntro = "Nu este doar o pagină de prezentare. Cererile au istoric, status și documentare internă.",
  trustItems = [],
  faqs = []
}: MarketingPageProps) {
  return (
    <main>
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              {intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={primaryHref}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
              >
                {primaryLabel}
              </Link>

              {secondaryHref && secondaryLabel ? (
                <Link
                  href={secondaryHref}
                  className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white"
                >
                  {secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <article key={item.title} className="rounded-2xl bg-white/10 p-5 text-white">
                <h2 className="font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {problems.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Servicii
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {problemsTitle}
            </h2>
            <p className="mt-4 leading-7 text-slate-700">{problemsIntro}</p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((item) => (
              <article key={item.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {steps.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-3xl bg-white p-8 shadow-sm lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Proces
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {processTitle}
                </h2>
                <p className="mt-4 leading-7 text-slate-700">{processIntro}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {steps.map((step) => (
                  <article key={step.title} className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="font-semibold text-slate-950">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{step.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {trustItems.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Încredere
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {trustTitle}
              </h2>
              <p className="mt-4 leading-7 text-slate-700">{trustIntro}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {trustItems.map((item) => (
                <div key={item} className="rounded-2xl bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <FaqSection items={faqs} />

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-3xl bg-slate-950 p-8 text-white lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Vrei să începem?
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                Completează formularul potrivit. Pentru service primești cod de tracking.
                Pentru proiecte digitale, IT sau conectivitate, cererea intră în admin ca lead.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={primaryHref}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
              >
                {primaryLabel}
              </Link>

              <Link
                href="/status"
                className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white"
              >
                Verifică status
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
