import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact prin formular",
  description:
    "Contact Pentrunoi.ro prin formulare pentru service laptop, reparații prin curier, suport IT, conectivitate și proiecte web."
};

export default function ContactPage() {
  const options = [
    {
      title: "Cerere service",
      description: "Laptop, calculator, reparații prin curier și tracking REP.",
      href: "/cerere-service"
    },
    {
      title: "Proiect digital",
      description: "Website, aplicație web, marketplace, PWA/mobile app și dashboard.",
      href: "/cerere-proiect-digital"
    },
    {
      title: "Suport IT firme",
      description: "Mentenanță, backup, email business, rețele și suport remote.",
      href: "/cerere-suport-it-firme"
    },
    {
      title: "Conectivitate business",
      description: "Internet backup, Wi-Fi, routere, VPN și zone cu semnal slab.",
      href: "/cerere-retele-internet-firme"
    }
  ];

  return (
    <main>
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Contact
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white">
            Contact prin formular, ca să avem toate detaliile corecte.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Pentru noul pentrunoi.ro, formularele sunt canalul principal: fiecare cerere
            intră în sistem, primește tracking unde este cazul și poate fi urmărită corect.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 md:grid-cols-2">
          {options.map((option) => (
            <Link key={option.href} href={option.href} className="rounded-3xl bg-white p-7 shadow-sm transition hover:shadow-md">
              <h2 className="text-xl font-semibold text-slate-950">{option.title}</h2>
              <p className="mt-3 leading-7 text-slate-700">{option.description}</p>
              <p className="mt-5 text-sm font-semibold text-slate-950">Deschide formular →</p>
            </Link>
          ))}
        </div>

        <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Email public</h2>
          <p className="mt-3 text-slate-700">contact@pentrunoi.ro</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Nu folosim telefonul ca principal call-to-action pe paginile de marketing.
            Dacă legal este nevoie de telefon, există placeholder editabil în admin settings.
          </p>
        </section>
      </section>
    </main>
  );
}
