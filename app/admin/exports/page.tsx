import Link from "next/link";

const exportsList = [
  {
    href: "/admin/exports/repairs.csv",
    title: "Repair cases CSV",
    description: "Exportă lucrările service cu client, echipament, status, AWB și număr de devize/uploads/remindere."
  },
  {
    href: "/admin/exports/leads.csv",
    title: "Leads CSV",
    description: "Exportă cererile WEB, IT și NET cu tracking, status, client, firmă și mesaj."
  },
  {
    href: "/admin/exports/customers.csv",
    title: "Customers CSV",
    description: "Exportă clienții interni cu contact, locație și număr de echipamente/lucrări/lead-uri."
  },
  {
    href: "/admin/exports/reminders.csv",
    title: "Reminders CSV",
    description: "Exportă reminderele cu status, client, lucrare, data programată și data trimiterii."
  },
  {
    href: "/admin/exports/email-logs.csv",
    title: "Email logs CSV",
    description: "Exportă emailurile trimise, omise sau eșuate, inclusiv motivul."
  }
];

export default function AdminExportsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/admin" className="text-sm font-medium text-slate-600">
        ← Back to admin
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Data exports
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Exporturi CSV pentru backup, raportare și mutare date. Aceste linkuri sunt
          protejate de zona admin.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {exportsList.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            <p className="mt-4 text-sm font-semibold text-slate-950">
              Download CSV →
            </p>
          </a>
        ))}
      </div>
    </main>
  );
}
