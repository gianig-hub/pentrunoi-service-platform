import Link from "next/link";

const cards = [
  {
    title: "Service laptop și calculatoare",
    description:
      "Diagnosticare, curățare, upgrade, reparații, înlocuire display, tastatură, SSD/RAM și verificări de funcționare."
  },
  {
    title: "Reparații prin curier",
    description:
      "Clientul trimite echipamentul, primește cod de tracking, aprobă devizul și urmărește statusul fără cont."
  },
  {
    title: "Status online",
    description:
      "Fiecare cerere primește un cod unic. Pagina publică afișează doar statusul și informațiile sigure."
  },
  {
    title: "Suport IT pentru firme",
    description:
      "Mentenanță calculatoare, rețele, backup, email business, routere, Wi-Fi și suport tehnic pentru firme mici."
  },
  {
    title: "Web design & aplicații web",
    description:
      "Site-uri, magazine online, platforme, dashboard-uri, aplicații web, mobile apps și sisteme personalizate."
  },
  {
    title: "Jurnal service",
    description:
      "Istoric intern pentru echipamente, statusuri, note, devize, garanții, poze și recomandări de mentenanță."
  }
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Pentrunoi.ro — versiune de dezvoltare
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-slate-950">
          Service laptop și calculatoare, reparații prin curier și soluții digitale pentru firme.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
          Reconstruim pentrunoi.ro ca platformă modernă pentru cereri service, tracking online,
          jurnal de reparație, suport IT, conectivitate business și proiecte web/aplicații.
          Contactul principal se face prin formulare, fără cont client.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/cerere-service"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Trimite cerere service
          </Link>
          <Link
            href="/status"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Verifică status
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
