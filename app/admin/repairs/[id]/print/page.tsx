import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { PrintButton } from "@/components/PrintButton";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function humanRepairStatus(status: string) {
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

function money(amount: { toString: () => string } | null, currency: string) {
  if (!amount) return "Fără sumă";
  return `${amount.toString()} ${currency}`;
}

export default async function RepairPrintPage({ params }: PageProps) {
  const { id } = await params;
  const settings = await getSiteSettings();

  const repair = await prisma.repairCase.findFirst({
    where: {
      OR: [{ id }, { trackingId: id }]
    },
    include: {
      customer: true,
      device: true,
      statusUpdates: {
        orderBy: {
          createdAt: "asc"
        }
      },
      quotes: {
        orderBy: {
          createdAt: "desc"
        }
      },
      uploads: {
        orderBy: {
          createdAt: "desc"
        }
      },
      reminders: {
        orderBy: {
          scheduledFor: "asc"
        }
      }
    }
  });

  if (!repair) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl bg-white px-6 py-10 text-slate-950 print:max-w-none print:px-0 print:py-0">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href={`/admin/repairs/${repair.trackingId}`} className="text-sm font-medium text-slate-600">
          ← Back to repair case
        </Link>
        <PrintButton />
      </div>

      <section className="border-b border-slate-300 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Repair report / Job card
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {repair.trackingId}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Generated: {formatDate(new Date())}
            </p>
          </div>

          <div className="text-right text-sm">
            <p className="font-semibold">{settings.company_name}</p>
            <p>{settings.company_cui ? `CUI: ${settings.company_cui}` : ""}</p>
            <p>{settings.company_reg_com ? `Reg. Com.: ${settings.company_reg_com}` : ""}</p>
            <p>{settings.public_email}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
          <h2 className="text-lg font-semibold">Client</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">Name</dt>
              <dd className="font-medium">{repair.customer?.name || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd>{repair.customer?.email || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Phone</dt>
              <dd>{repair.customer?.phone || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Location</dt>
              <dd>
                {[repair.customer?.city, repair.customer?.county].filter(Boolean).join(", ") || "N/A"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
          <h2 className="text-lg font-semibold">Device</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">Type</dt>
              <dd className="font-medium">{repair.device?.type || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Brand / Model</dt>
              <dd>
                {[repair.device?.brand, repair.device?.model].filter(Boolean).join(" ") || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Serial number</dt>
              <dd>{repair.device?.serialNumber || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Current status</dt>
              <dd className="font-medium">{humanRepairStatus(repair.status)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
        <h2 className="text-lg font-semibold">Reported issue</h2>
        <p className="mt-4 whitespace-pre-wrap text-sm">{repair.issueReported}</p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
          <h2 className="text-lg font-semibold">Public notes</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm">
            {repair.publicNotes || "No public notes."}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 print:break-inside-avoid">
          <h2 className="text-lg font-semibold">Internal notes</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm">
            {repair.internalNotes || "No internal notes."}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 p-5">
        <h2 className="text-lg font-semibold">Status history</h2>
        {repair.statusUpdates.length === 0 ? (
          <p className="mt-4 text-sm">No status updates.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {repair.statusUpdates.map((update) => (
              <div key={update.id} className="border-l-2 border-slate-300 pl-4">
                <p className="font-medium">{humanRepairStatus(update.status)}</p>
                <p className="text-xs text-slate-500">{formatDate(update.createdAt)}</p>
                {update.publicNote ? (
                  <p className="mt-1 text-sm">Public: {update.publicNote}</p>
                ) : null}
                {update.internalNote ? (
                  <p className="mt-1 text-sm text-amber-800">Internal: {update.internalNote}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 p-5">
        <h2 className="text-lg font-semibold">Quotes / Devize</h2>
        {repair.quotes.length === 0 ? (
          <p className="mt-4 text-sm">No quotes.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {repair.quotes.map((quote) => (
              <article key={quote.id} className="rounded-xl border border-slate-200 p-4 print:break-inside-avoid">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{money(quote.amount, quote.currency)}</p>
                    <p className="text-xs text-slate-500">Created: {formatDate(quote.createdAt)}</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    {quote.approvedAt
                      ? `Approved: ${formatDate(quote.approvedAt)}`
                      : quote.rejectedAt
                        ? `Rejected: ${formatDate(quote.rejectedAt)}`
                        : "Pending"}
                  </p>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm">{quote.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 p-5">
        <h2 className="text-lg font-semibold">Uploads / Evidence</h2>
        {repair.uploads.length === 0 ? (
          <p className="mt-4 text-sm">No uploads.</p>
        ) : (
          <table className="mt-4 w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2">File</th>
                <th className="py-2">Visibility</th>
                <th className="py-2">Type</th>
                <th className="py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {repair.uploads.map((file) => (
                <tr key={file.id} className="border-b border-slate-100">
                  <td className="py-2">{file.originalName}</td>
                  <td className="py-2">{file.visibility}</td>
                  <td className="py-2">{file.mimeType}</td>
                  <td className="py-2">{file.description || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 p-5">
        <h2 className="text-lg font-semibold">Reminders</h2>
        {repair.reminders.length === 0 ? (
          <p className="mt-4 text-sm">No reminders.</p>
        ) : (
          <table className="mt-4 w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2">Type</th>
                <th className="py-2">Scheduled</th>
                <th className="py-2">Status</th>
                <th className="py-2">Subject</th>
              </tr>
            </thead>
            <tbody>
              {repair.reminders.map((reminder) => (
                <tr key={reminder.id} className="border-b border-slate-100">
                  <td className="py-2">{reminder.type}</td>
                  <td className="py-2">{formatDate(reminder.scheduledFor)}</td>
                  <td className="py-2">{reminder.status}</td>
                  <td className="py-2">{reminder.subject || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="mt-8 border-t border-slate-300 pt-6 text-xs text-slate-500">
        <p>
          This report is generated from the internal admin system. Public customer status page:
          {" "}
          /status/{repair.trackingId}
        </p>
        <p className="mt-2">
          {settings.data_backup_warning}
        </p>
      </section>
    </main>
  );
}
