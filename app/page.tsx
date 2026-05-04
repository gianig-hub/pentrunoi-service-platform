import Link from "next/link";
import Image from "next/image";
import { SeoJsonLd } from "@/components/SeoJsonLd";

const mainServices = [
  {
    title: "Service laptop Ploiești",
    description:
      "Diagnosticare, curățare internă, temperaturi, upgrade SSD/RAM, display, tastatură, baterie și probleme software.",
    href: "/service-laptop-ploiesti",
    label: "Vezi service laptop"
  },
  {
    title: "Reparații prin curier",
    description:
      "Trimite echipamentul prin curier, primești cod de tracking, vezi statusul online și aprobi devizul fără cont client.",
    href: "/reparatii-laptop-prin-curier",
    label: "Vezi flux curier"
  },
  {
    title: "Suport IT firme",
    description:
      "Mentenanță calculatoare, email business, backup, rețele, Wi-Fi, routere și suport tehnic pentru firme mici.",
    href: "/suport-it-firme",
    label: "Vezi suport IT"
  },
  {
    title: "Web design & aplicații",
    description:
      "Site-uri, aplicații web, marketplace-uri, dashboard-uri, PWA/mobile apps și sisteme interne pentru business.",
    href: "/web-design-aplicatii-web",
    label: "Vezi servicii digitale"
  }
];

const processSteps = [
  {
    title: "1. Trimiți cererea",
    description:
      "Completezi formularul potrivit: service, proiect digital, suport IT sau conectivitate business."
  },
  {
    title: "2. Primești tracking ID",
    description:
      "Fiecare cerere primește un cod unic. Clientul poate verifica statusul fără cont."
  },
  {
    title: "3. Verificăm și actualizăm",
    description:
      "În admin se adaugă statusuri, note, poze, deviz, aprobări și istoric pentru lucrare."
  },
  {
    title: "4. Finalizare și follow-up",
    description:
      "Lucrarea se închide cu istoric, raport printabil și remindere pentru mentenanță viitoare."
  }
];

const platformFeatures = [
  "Status tracking online",
  "Admin repair workflow",
  "Poze și fișiere public/private",
  "Deviz cu aprobare client",
  "Remindere service",
  "CSV exports și rapoarte",
  "Legal/settings editabile",
  "Pregătit pentru migrare Docker"
];

export default function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dev.pentrunoi.ro";

  return (
    <main>
      <SeoJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Pentrunoi.ro - Service Laptop Giani",
          url: siteUrl,
          image: `${siteUrl}/logo-pentrunoi.png`,
          email: "contact@pentrunoi.ro",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Str. Văleni, Nr. 67",
            addressLocality: "Ploiești",
            addressRegion: "Prahova",
            addressCountry: "RO"
          },
          areaServed: ["Ploiești", "Prahova", "România"],
          makesOffer: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Service laptop și calculatoare"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Reparații laptop prin curier"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Suport IT firme"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Web design și aplicații web"
              }
            }
          ]
        }}
      />

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.16),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100">
              Service laptop, tracking online și soluții digitale pentru firme
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Service laptop Ploiești, reparații prin curier și platformă modernă de lucru.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Pentrunoi.ro este reconstruit ca sistem complet: cereri service, tracking ID,
              status online, poze, deviz, aprobare client, remindere și servicii digitale
              pentru firme — fără cont client și fără telefon ca principal call-to-action.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cerere-service"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm"
              >
                Trimite cerere service
              </Link>
              <Link
                href="/status"
                className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white"
              >
                Verifică status
              </Link>
              <Link
                href="/web-design-aplicatii-web"
                className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white"
              >
                Proiecte web & apps
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-white p-6">
              <Image
                src="/logo-pentrunoi.png"
                alt="Pentrunoi.ro - Service Laptop Giani"
                width={300}
                height={68}
                priority
                className="h-auto w-[260px]"
              />

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-500">Exemplu tracking</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">REP-2026-XXXXX</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Clientul vede statusul, devizul, pozele publice și aprobă lucrarea online.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {["Diagnosticare", "Deviz", "Aprobare", "Follow-up"].map((item) => (
                    <div key={item} className="rounded-xl border border-slate-200 p-4 text-sm font-semibold text-slate-800">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Fără cont client", "Tracking simplu pe bază de cod unic."],
            ["Deviz online", "Clientul poate aproba sau refuza devizul."],
            ["Poze service", "Fișiere publice/private pentru fiecare lucrare."],
            ["Remindere", "Follow-up pentru curățare și verificări viitoare."]
          ].map(([title, description]) => (
            <article key={title} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Servicii principale
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Totul pornește din formular, apoi fiecare cerere are istoric și status.
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {mainServices.map((service) => (
            <article key={service.href} className="rounded-3xl bg-white p-7 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-950">{service.title}</h3>
              <p className="mt-3 leading-7 text-slate-700">{service.description}</p>
              <Link
                href={service.href}
                className="mt-5 inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-950"
              >
                {service.label}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-slate-900 p-8 text-white lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                Cum funcționează
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Flux clar de la cerere până la raport și mentenanță.
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Platforma este gândită pentru lucrări reale: recepție echipament,
                diagnosticare, dovezi foto, deviz, aprobare, reparație, testare și follow-up.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {processSteps.map((step) => (
                <article key={step.title} className="rounded-2xl bg-white/10 p-5">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Platformă, nu doar website
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Pregătit pentru service, suport IT, proiecte digitale și creștere.
            </h2>
            <p className="mt-4 leading-7 text-slate-700">
              Sistemul actual este construit în Docker cu Next.js, PostgreSQL, Prisma și
              o structură pregătită pentru migrare pe VPS românesc, backup, export și SEO.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {platformFeatures.map((feature) => (
              <div key={feature} className="rounded-2xl bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-3xl bg-white p-8 shadow-sm lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Ai un laptop defect sau un proiect digital?
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-slate-700">
                Trimite cererea prin formular. Pentru service primești tracking ID.
                Pentru proiecte web, IT sau conectivitate, cererea intră în admin ca lead.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/cerere-service"
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Cerere service
              </Link>
              <Link
                href="/cerere-proiect-digital"
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950"
              >
                Cerere proiect digital
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
