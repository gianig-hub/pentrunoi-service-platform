import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminChangelogPage() {
  let entries: Awaited<ReturnType<typeof prisma.changelogEntry.findMany>> = [];
  let errorMessage = "";

  try {
    entries = await prisma.changelogEntry.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 100
    });
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Could not load changelog entries.";
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <Link href="/admin" className="text-sm font-medium text-slate-600">
          ← Back to admin
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          Changelog
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Internal work log for the pentrunoi-service-platform build. This will record
          planning, features, fixes, security changes, legal work, database changes and
          deployment notes.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          <h2 className="font-semibold">Database not ready yet</h2>
          <p className="mt-2 text-sm">
            The changelog page is built, but entries cannot be loaded until the database
            is running and migrations/seeds are applied.
          </p>
          <pre className="mt-4 overflow-auto rounded-xl bg-white p-4 text-xs">
            {errorMessage}
          </pre>
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold">No changelog entries yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Run the database migration and seed command when the database is available.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-4">Version</th>
                <th className="p-4">Type</th>
                <th className="p-4">Module</th>
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-100">
                  <td className="p-4 font-medium">{entry.version}</td>
                  <td className="p-4">{entry.type}</td>
                  <td className="p-4">{entry.module}</td>
                  <td className="p-4">
                    <div className="font-medium text-slate-950">{entry.title}</div>
                    <div className="mt-1 text-slate-600">{entry.description}</div>
                  </td>
                  <td className="p-4">{entry.status}</td>
                  <td className="p-4">
                    {new Intl.DateTimeFormat("ro-RO", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    }).format(entry.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
