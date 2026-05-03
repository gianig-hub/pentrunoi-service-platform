import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function humanType(type: string) {
  const map: Record<string, string> = {
    LAPTOP_CLEANING: "Curățare laptop",
    THERMAL_CHECK: "Verificare termică",
    HEALTH_CHECK: "Health check",
    BUSINESS_IT_MAINTENANCE: "Mentenanță IT firmă",
    WEBSITE_MAINTENANCE: "Mentenanță website"
  };

  return map[type] || type;
}

function humanStatus(status: string) {
  const map: Record<string, string> = {
    SCHEDULED: "Programat",
    SENT: "Trimis",
    CANCELLED: "Anulat"
  };

  return map[status] || status;
}

export default async function AdminRemindersPage() {
  const reminders = await prisma.reminder.findMany({
    orderBy: {
      scheduledFor: "asc"
    },
    include: {
      repairCase: {
        include: {
          customer: true,
          device: true
        }
      },
      customer: true
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
          Reminders
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Urmărire remindere pentru curățare laptop, verificare termică, health check,
          mentenanță IT business și mentenanță website.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">Data</th>
              <th className="p-4">Tip</th>
              <th className="p-4">Status</th>
              <th className="p-4">Client</th>
              <th className="p-4">Lucrare</th>
              <th className="p-4">Subiect</th>
              <th className="p-4">Acțiune</th>
            </tr>
          </thead>
          <tbody>
            {reminders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-slate-600">
                  Nu există remindere încă.
                </td>
              </tr>
            ) : (
              reminders.map((reminder) => (
                <tr key={reminder.id} className="border-t border-slate-100 align-top">
                  <td className="p-4">{formatDate(reminder.scheduledFor)}</td>
                  <td className="p-4">{humanType(reminder.type)}</td>
                  <td className="p-4">{humanStatus(reminder.status)}</td>
                  <td className="p-4">
                    <div className="font-medium text-slate-950">
                      {reminder.customer?.name || reminder.repairCase?.customer?.name || "N/A"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {reminder.customer?.email || reminder.repairCase?.customer?.email || ""}
                    </div>
                  </td>
                  <td className="p-4">
                    {reminder.repairCase ? (
                      <Link
                        href={`/admin/repairs/${reminder.repairCase.trackingId}`}
                        className="font-medium text-slate-950 underline"
                      >
                        {reminder.repairCase.trackingId}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-950">
                      {reminder.subject || "Fără subiect"}
                    </div>
                    {reminder.message ? (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-slate-500">
                          Vezi mesaj
                        </summary>
                        <p className="mt-2 whitespace-pre-wrap text-xs text-slate-700">
                          {reminder.message}
                        </p>
                      </details>
                    ) : null}
                  </td>
                  <td className="p-4">
                    {reminder.repairCase ? (
                      <Link
                        href={`/admin/repairs/${reminder.repairCase.trackingId}/reminders`}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900"
                      >
                        Deschide
                      </Link>
                    ) : (
                      "—"
                    )}
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
