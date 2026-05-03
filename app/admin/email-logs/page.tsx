import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default async function AdminEmailLogsPage() {
  const logs = await prisma.emailLog.findMany({
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
          Email logs
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Istoric notificări email. În development, dacă SMTP nu este configurat,
          emailurile sunt salvate ca SKIPPED.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">Status</th>
              <th className="p-4">To</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Reason/Error</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-slate-600">
                  Nu există emailuri înregistrate încă.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-t border-slate-100 align-top">
                  <td className="p-4 font-medium text-slate-950">{log.status}</td>
                  <td className="p-4">{log.to}</td>
                  <td className="p-4">
                    <div className="font-medium text-slate-950">{log.subject}</div>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-slate-500">
                        Vezi conținut
                      </summary>
                      <pre className="mt-2 max-h-64 overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-50">
                        {log.body}
                      </pre>
                    </details>
                  </td>
                  <td className="p-4 text-xs text-slate-600">
                    {log.reason || log.error || "—"}
                  </td>
                  <td className="p-4">{formatDate(log.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
