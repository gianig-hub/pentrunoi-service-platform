import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Contact
      </p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        Contact prin formular
      </h1>

      <p className="mt-4 max-w-3xl text-slate-700">
        Pentru versiunea nouă pentrunoi.ro, contactul principal se face prin formulare.
        Pentru cereri service, folosește formularul dedicat pentru a primi cod de tracking.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/cerere-service" className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-950">Cerere service</h2>
          <p className="mt-2 text-sm text-slate-600">
            Pentru laptopuri, calculatoare, reparații prin curier și tracking.
          </p>
        </Link>

        <Link href="/status" className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-950">Verifică status</h2>
          <p className="mt-2 text-sm text-slate-600">
            Introdu codul primit pentru a vedea statusul cererii.
          </p>
        </Link>
      </div>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Email public</h2>
        <p className="mt-3 text-slate-700">contact@pentrunoi.ro</p>
        <p className="mt-3 text-sm text-slate-500">
          Nu folosim telefonul ca principal call-to-action pe paginile de marketing.
        </p>
      </section>
    </main>
  );
}
