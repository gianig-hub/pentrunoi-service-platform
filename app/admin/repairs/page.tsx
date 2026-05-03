import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function humanStatus(status: string) {
  const map: Record<string, string> = {
    REQUEST_RECEIVED: "Cerere primită",
    WAITING_FOR_DEVICE: "Așteptăm echipamentul",
    DEVICE_RECEIVED: "Echipament primit",
    DIAGNOSIS_IN_PROGRESS: "Diagnosticare",
    QUOTE_SENT: "Deviz trimis",
    WAITING_FOR_APPROVAL: "Așteptăm aprobare",
    APPROVED: "Aprobat",
    IN_REPAIR: "În reparație",
    TESTING: "În testare",
    READY_FOR_RETURN: "Pregătit retur",
    SENT_TO_CUSTOMER: "Trimis clientului",
    COMPLETED: "Finalizat",
    REJECTED: "Refuzat",
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

export default async function AdminRepairsPage() {
  const repairs = await prisma.repairCase.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      customer: true,
      device: true
    },
    take: 100
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Link href="/admin" className="text-sm font-medium text-slate-600">
        ← Back to admin
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Repair cases
          </h1>
          <p className="mt-3 max-w-3xl text-slate-700">
            Cereri service primite prin formular. Aici verifici clientul, echipamentul,
            problema raportată și statusul lucrării.
          </p>
        </div>

        <Link
          href="/cerere-service"
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Cerere nouă
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">Tracking</th>
              <th className="p-4">Client</th>
              <th className="p-4">Echipament</th>
              <th className="p-4">Status</th>
              <th className="p-4">Creat</th>
              <th className="p-4">Acțiune</th>
            </tr>
          </thead>
          <tbody>
            {repairs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-slate-600">
                  Nu există cereri service încă.
                </td>
              </tr>
            ) : (
              repairs.map((repair) => (
                <tr key={repair.id} className="border-t border-slate-100">
                  <td className="p-4 font-medium text-slate-950">
                    {repair.trackingId}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-950">
                      {repair.customer?.name || "Fără client"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {repair.customer?.email || ""}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>{repair.device?.type || "N/A"}</div>
                    <div className="text-xs text-slate-500">
                      {[repair.device?.brand, repair.device?.model].filter(Boolean).join(" ")}
                    </div>
                  </td>
                  <td className="p-4">{humanStatus(repair.status)}</td>
                  <td className="p-4">{formatDate(repair.createdAt)}</td>
                  <td className="p-4">
                    <Link
                      href={`/admin/repairs/${repair.id}`}
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
