import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function humanLeadType(type: string) {
  const map: Record<string, string> = {
    BUSINESS_IT: "Suport IT firme",
    CONNECTIVITY: "Internet, rețele și conectivitate",
    DIGITAL_PROJECT: "Web design / aplicații",
    GENERAL_CONTACT: "Contact general"
  };

  return map[type] || type;
}

function humanLeadStatus(status: string) {
  const map: Record<string, string> = {
    NEW: "Nou",
    IN_REVIEW: "În analiză",
    QUESTIONS_SENT: "Întrebări trimise",
    QUOTE_SENT: "Ofertă trimisă",
    APPROVED: "Aprobat",
    IN_PROGRESS: "În lucru",
    COMPLETED: "Finalizat",
    CLOSED: "Închis"
  };

  return map[status] || status;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: 100
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
          Leads
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Cereri primite pentru proiecte digitale, suport IT firme și conectivitate business.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">Tracking</th>
              <th className="p-4">Tip</th>
              <th className="p-4">Client</th>
              <th className="p-4">Firmă</th>
              <th className="p-4">Status</th>
              <th className="p-4">Creat</th>
              <th className="p-4">Acțiune</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-slate-600">
                  Nu există lead-uri încă.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-t border-slate-100">
                  <td className="p-4 font-medium text-slate-950">
                    {lead.trackingId}
                  </td>
                  <td className="p-4">{humanLeadType(lead.type)}</td>
                  <td className="p-4">
                    <div className="font-medium text-slate-950">{lead.name || "N/A"}</div>
                    <div className="text-xs text-slate-500">{lead.email || ""}</div>
                  </td>
                  <td className="p-4">{lead.companyName || "N/A"}</td>
                  <td className="p-4">{humanLeadStatus(lead.status)}</td>
                  <td className="p-4">{formatDate(lead.createdAt)}</td>
                  <td className="p-4">
                    <Link
                      href={`/admin/leads/${lead.id}`}
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
