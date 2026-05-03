import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      devices: true,
      repairCases: true,
      leads: true,
      reminders: true
    },
    take: 200
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Link href="/admin" className="text-sm font-medium text-slate-600">
        ← Back to admin
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Customers
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Clienți creați automat din cereri service și lead-uri. Nu există cont client;
          aceasta este doar evidență internă pentru istoric, service și follow-up.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">Client</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Locație</th>
              <th className="p-4">Devices</th>
              <th className="p-4">Repairs</th>
              <th className="p-4">Leads</th>
              <th className="p-4">Created</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-slate-600">
                  Nu există clienți încă.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-t border-slate-100 align-top">
                  <td className="p-4">
                    <div className="font-semibold text-slate-950">{customer.name}</div>
                    {customer.notes ? (
                      <div className="mt-1 text-xs text-slate-500">{customer.notes}</div>
                    ) : null}
                  </td>
                  <td className="p-4">
                    <div>{customer.email || "N/A"}</div>
                    <div className="text-xs text-slate-500">{customer.phone || ""}</div>
                  </td>
                  <td className="p-4">
                    {[customer.city, customer.county].filter(Boolean).join(", ") || "N/A"}
                  </td>
                  <td className="p-4">{customer.devices.length}</td>
                  <td className="p-4">{customer.repairCases.length}</td>
                  <td className="p-4">{customer.leads.length}</td>
                  <td className="p-4">{formatDate(customer.createdAt)}</td>
                  <td className="p-4">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900"
                    >
                      Deschide
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
