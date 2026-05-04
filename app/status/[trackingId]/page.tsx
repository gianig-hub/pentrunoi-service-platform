import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type StatusPageProps = {
  params: Promise<{
    trackingId: string;
  }>;
};

const repairSteps = [
  "REQUEST_RECEIVED",
  "WAITING_FOR_DEVICE",
  "DEVICE_RECEIVED",
  "DIAGNOSIS_IN_PROGRESS",
  "QUOTE_SENT",
  "APPROVED",
  "IN_REPAIR",
  "TESTING",
  "READY_FOR_RETURN",
  "SENT_TO_CUSTOMER",
  "COMPLETED"
];

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
    DEVICE_RECEIVED: "Echipament primit în service",
    DIAGNOSIS_IN_PROGRESS: "Diagnosticare în curs",
    QUOTE_SENT: "Deviz trimis",
    WAITING_FOR_APPROVAL: "Așteptăm aprobarea clientului",
    APPROVED: "Aprobat",
    IN_REPAIR: "În reparație",
    TESTING: "În testare",
    READY_FOR_RETURN: "Pregătit pentru retur",
    SENT_TO_CUSTOMER: "Trimis către client",
    COMPLETED: "Finalizat",
    REJECTED: "Refuzat",
    CLOSED: "Închis"
  };

  return map[status] || status;
}

function humanLeadStatus(status: string) {
  const map: Record<string, string> = {
    NEW: "Cerere primită",
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

function humanLeadType(type: string) {
  const map: Record<string, string> = {
    BUSINESS_IT: "Suport IT firme",
    CONNECTIVITY: "Internet, rețele și conectivitate firme",
    DIGITAL_PROJECT: "Web design, aplicații web și mobile",
    GENERAL_CONTACT: "Contact general"
  };

  return map[type] || type;
}

function canDecideQuote(quote: {
  approvedAt: Date | null;
  rejectedAt: Date | null;
}) {
  return !quote.approvedAt && !quote.rejectedAt;
}

function progressPercent(status: string) {
  if (status === "REJECTED" || status === "CLOSED") {
    return 100;
  }

  const index = repairSteps.indexOf(status);

  if (index < 0) {
    return 10;
  }

  return Math.max(8, Math.round(((index + 1) / repairSteps.length) * 100));
}

function statusTone(status: string) {
  if (status === "COMPLETED" || status === "APPROVED" || status === "SENT_TO_CUSTOMER") {
    return "bg-emerald-50 text-emerald-800";
  }

  if (status === "REJECTED" || status === "CLOSED") {
    return "bg-red-50 text-red-800";
  }

  if (status === "QUOTE_SENT" || status === "WAITING_FOR_APPROVAL") {
    return "bg-amber-50 text-amber-800";
  }

  return "bg-sky-50 text-sky-800";
}

export default async function PublicTrackingPage({ params }: StatusPageProps) {
  const { trackingId: rawTrackingId } = await params;
  const trackingId = decodeURIComponent(rawTrackingId).trim().toUpperCase();

  const repairCase = await prisma.repairCase.findUnique({
    where: { trackingId },
    include: {
      statusUpdates: {
        where: { isPublic: true },
        orderBy: { createdAt: "desc" },
        take: 8
      },
      quotes: {
        orderBy: { createdAt: "desc" },
        take: 1
      },
      uploads: {
        where: { visibility: "PUBLIC" },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (repairCase) {
    const latestQuote = repairCase.quotes[0] || null;
    const repairCaseId = repairCase.id;
    const quoteId = latestQuote?.id || "";
    const publicTrackingId = repairCase.trackingId;
    const percent = progressPercent(repairCase.status);

    async function approveQuote() {
      "use server";

      if (!quoteId) {
        throw new Error("No quote found.");
      }

      const quote = await prisma.quote.findUnique({
        where: { id: quoteId }
      });

      if (!quote || quote.repairCaseId !== repairCaseId || quote.approvedAt || quote.rejectedAt) {
        throw new Error("Quote is no longer available for approval.");
      }

      await prisma.quote.update({
        where: { id: quoteId },
        data: {
          approvedAt: new Date()
        }
      });

      await prisma.repairCase.update({
        where: { id: repairCaseId },
        data: {
          status: "APPROVED",
          publicNotes: "Devizul a fost aprobat. Lucrarea poate continua.",
          statusUpdates: {
            create: {
              status: "APPROVED",
              isPublic: true,
              publicNote: "Clientul a aprobat devizul."
            }
          }
        }
      });

      await prisma.changelogEntry.create({
        data: {
          version: "0.1.0-dev",
          type: "FEATURE",
          module: "Quotes",
          title: `Quote approved: ${publicTrackingId}`,
          description: `The quote for repair case ${publicTrackingId} was approved from the public status page.`,
          status: "DONE"
        }
      });

      revalidatePath(`/status/${publicTrackingId}`);
      revalidatePath(`/admin/repairs/${publicTrackingId}`);
      revalidatePath(`/admin/repairs/${publicTrackingId}/quotes`);
    }

    async function rejectQuote() {
      "use server";

      if (!quoteId) {
        throw new Error("No quote found.");
      }

      const quote = await prisma.quote.findUnique({
        where: { id: quoteId }
      });

      if (!quote || quote.repairCaseId !== repairCaseId || quote.approvedAt || quote.rejectedAt) {
        throw new Error("Quote is no longer available for rejection.");
      }

      await prisma.quote.update({
        where: { id: quoteId },
        data: {
          rejectedAt: new Date()
        }
      });

      await prisma.repairCase.update({
        where: { id: repairCaseId },
        data: {
          status: "REJECTED",
          publicNotes: "Devizul a fost refuzat. Cazul va fi verificat pentru pașii următori.",
          statusUpdates: {
            create: {
              status: "REJECTED",
              isPublic: true,
              publicNote: "Clientul a refuzat devizul."
            }
          }
        }
      });

      await prisma.changelogEntry.create({
        data: {
          version: "0.1.0-dev",
          type: "FEATURE",
          module: "Quotes",
          title: `Quote rejected: ${publicTrackingId}`,
          description: `The quote for repair case ${publicTrackingId} was rejected from the public status page.`,
          status: "DONE"
        }
      });

      revalidatePath(`/status/${publicTrackingId}`);
      revalidatePath(`/admin/repairs/${publicTrackingId}`);
      revalidatePath(`/admin/repairs/${publicTrackingId}/quotes`);
    }

    return (
      <main>
        <section className="bg-slate-950">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <Link href="/status" className="text-sm font-medium text-slate-300">
              ← Verifică alt cod
            </Link>

            <div className="mt-8 flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  Status reparație
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
                  {repairCase.trackingId}
                </h1>
              </div>

              <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusTone(repairCase.status)}`}>
                {humanRepairStatus(repairCase.status)}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Status actual</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">
                  {humanRepairStatus(repairCase.status)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Ultima actualizare</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {formatDate(repairCase.updatedAt)}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Progres lucrare</span>
                <span>{percent}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-950"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {repairCase.publicNotes ? (
              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-500">Notă publică</p>
                <p className="mt-2 leading-7 text-slate-800">{repairCase.publicNotes}</p>
              </div>
            ) : null}
          </div>

          {latestQuote ? (
            <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Deviz
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    Devizul cel mai recent
                  </h2>
                </div>

                {latestQuote.amount ? (
                  <p className="rounded-2xl bg-slate-950 px-5 py-3 text-lg font-bold text-white">
                    {latestQuote.amount.toString()} {latestQuote.currency}
                  </p>
                ) : null}
              </div>

              <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-800">
                {latestQuote.description}
              </p>

              {latestQuote.approvedAt ? (
                <div className="mt-6 rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-900">
                  Deviz aprobat la {formatDate(latestQuote.approvedAt)}.
                </div>
              ) : latestQuote.rejectedAt ? (
                <div className="mt-6 rounded-2xl bg-red-50 p-5 text-sm text-red-900">
                  Deviz refuzat la {formatDate(latestQuote.rejectedAt)}.
                </div>
              ) : canDecideQuote(latestQuote) ? (
                <div className="mt-6 rounded-2xl bg-amber-50 p-5">
                  <p className="text-sm leading-6 text-amber-900">
                    Te rugăm să verifici devizul. Poți aproba sau refuza direct de aici.
                    După alegere, statusul lucrării se actualizează automat.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <form action={approveQuote}>
                      <button
                        type="submit"
                        className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
                      >
                        Aprob devizul
                      </button>
                    </form>

                    <form action={rejectQuote}>
                      <button
                        type="submit"
                        className="rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white"
                      >
                        Refuz devizul
                      </button>
                    </form>
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {repairCase.uploads.length > 0 ? (
            <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Fișiere publice
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                Poze sau documente vizibile clientului
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {repairCase.uploads.map((file) => (
                  <article key={file.id} className="rounded-2xl border border-slate-200 p-4">
                    {file.mimeType.startsWith("image/") ? (
                      <img
                        src={`/files/${file.id}`}
                        alt={file.description || file.originalName}
                        className="max-h-80 w-full rounded-xl object-cover"
                      />
                    ) : (
                      <Link
                        href={`/files/${file.id}`}
                        className="font-semibold text-slate-950 underline"
                      >
                        {file.originalName}
                      </Link>
                    )}

                    {file.description ? (
                      <p className="mt-3 text-sm leading-6 text-slate-700">{file.description}</p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Timeline
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Actualizări publice
            </h2>

            {repairCase.statusUpdates.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">
                Nu există actualizări publice încă.
              </p>
            ) : (
              <div className="mt-6 space-y-5">
                {repairCase.statusUpdates.map((update) => (
                  <div key={update.id} className="border-l-2 border-slate-200 pl-5">
                    <p className="font-semibold text-slate-950">
                      {humanRepairStatus(update.status)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(update.createdAt)}</p>
                    {update.publicNote ? (
                      <p className="mt-2 text-sm leading-6 text-slate-700">{update.publicNote}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-8 rounded-3xl bg-slate-950 p-6 text-sm leading-6 text-slate-300">
            Această pagină afișează doar informații publice despre status. Datele personale,
            adresa, telefonul, notele interne și detaliile sensibile nu sunt afișate.
          </section>
        </section>
      </main>
    );
  }

  const lead = await prisma.lead.findUnique({
    where: { trackingId }
  });

  if (lead) {
    return (
      <main>
        <section className="bg-slate-950">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <Link href="/status" className="text-sm font-medium text-slate-300">
              ← Verifică alt cod
            </Link>

            <div className="mt-8 flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  Status cerere
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
                  {lead.trackingId}
                </h1>
              </div>

              <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800">
                {humanLeadStatus(lead.status)}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-sm text-slate-500">Tip cerere</p>
                <p className="mt-1 text-xl font-bold text-slate-950">
                  {humanLeadType(lead.type)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Status actual</p>
                <p className="mt-1 text-xl font-bold text-slate-950">
                  {humanLeadStatus(lead.status)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Ultima actualizare</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {formatDate(lead.updatedAt)}
                </p>
              </div>
            </div>

            {lead.publicNotes ? (
              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-500">Notă publică</p>
                <p className="mt-2 leading-7 text-slate-800">{lead.publicNotes}</p>
              </div>
            ) : null}
          </div>

          <section className="mt-8 rounded-3xl bg-slate-950 p-6 text-sm leading-6 text-slate-300">
            Această pagină afișează doar informații publice despre status. Datele personale,
            notele interne și detaliile sensibile nu sunt afișate.
          </section>
        </section>
      </main>
    );
  }

  notFound();
}
