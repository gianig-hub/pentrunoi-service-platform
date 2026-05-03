import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Admin
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        Pentrunoi admin dashboard
      </h1>
      <p className="mt-4 max-w-2xl text-slate-700">
        Zonă rezervată pentru dashboard, reparații, changelog și setări.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/changelog"
          className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-950">Changelog</h2>
          <p className="mt-2 text-sm text-slate-600">
            Vezi istoricul de lucru, modificările și modulele dezvoltate.
          </p>
        </Link>
      </div>
    </main>
  );
}
