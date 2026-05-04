import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { PrintButton } from "@/components/PrintButton";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

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

export default async function RepairCompletionPage({ params }: PageProps) {
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

  const repairId = repair.id;
  const repairTrackingId = repair.trackingId;
  const latestQuote = repair.quotes[0] || null;

  async function markCompleted(formData: FormData) {
    "use server";

    const publicNote =
      textValue(formData, "publicNote") ||
      "Lucrarea a fost finalizată. Echipamentul este pregătit pentru predare/retur.";

    const internalNote = textValue(formData, "internalNote");

    await prisma.repairCase.update({
      where: {
        id: repairId
      },
      data: {
        status: "COMPLETED",
        publicNotes: publicNote,
        internalNotes: internalNote || undefined,
        statusUpdates: {
          create: {
            status: "COMPLETED",
            isPublic: true,
            publicNote,
            internalNote: internalNote || null
          }
        }
      }
    });

    await prisma.changelogEntry.create({
      data: {
        version: "0.1.0-dev",
        type: "FEATURE",
        module: "Reports",
        title: `Repair completed: ${repairTrackingId}`,
        description: `Repair case ${repairTrackingId} was marked as completed from the completion report page.`,
        status: "DONE"
      }
    });

    revalidatePath(`/admin/repairs/${repairTrackingId}`);
    revalidatePath(`/admin/repairs/${repairTrackingId}/completion`);
    revalidatePath(`/status/${repairTrackingId}`);
  }

  return (
    <main className="mx-auto max-w-5xl bg-white px-6 py-10 text-slate-950 print:max-w-none print:px-0 print:py-0">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href={`/admin/repairs/${repair.trackingId}`} className="text-sm font-medium text-slate-600">
          ← Back to repair case
        </Link>
        <PrintButton />
      </div>

      {repair.status !== "COMPLETED" ? (
        <section className="mb-8 rounded-2xl bg-amber-50 p-6 print:hidden">
          <h2 className="text-lg font-semibold text-amber-950">
            Mark repair as completed
          </h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            This updates the public status page and records a completion status update.
          </p>

          <form action={markCompleted} className="mt-5 space-y-4">
            <div>
              <label htmlFor="publicNote" className="block text-sm font-medium text-amber-950">
                Public completion note
              </label>
              <textarea
                id="publicNote"
                name="publicNote"
                rows={3}
                defaultValue="Lucrarea a fost finalizată. Echipamentul este pregătit pentru predare/retur."
                className="mt-2 w-full rounded-xl border border-amber-200 px-4 py-3 text-slate-950"
              />
            </div>

            <div>
              <label htmlFor="internalNote" className="block text-sm font-medium text-amber-950">
                Internal completion note
              </label>
              <textarea
                id="internalNote"
                name="internalNote"
                rows={3}
                placeholder="Ex: test final OK, temperaturi OK, client informat, accesorii returnate..."
                className="mt-2 w-full rounded-xl border border-amber-200 px-4 py-3 text-slate-950"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Mark as completed
            </button>
          </form>
        </section>
      ) : null}

      <section className="border-b border-slate-300 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Image
              src="/logo-pentrunoi.png"
              alt="Pentrunoi.ro - Service Laptop Giani"
              width={220}
              height={50}
              priority
              className="h-auto w-[220px]"
            />
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Raport final service / garanție
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {repair.trackingId}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Generat: {formatDate(new Date())}
            </p>
          </div>

          <div className="text-right text-sm">
            <p className="font-semibold">{settings.company_name}</p>
            <p>{settings.company_cui ? `CUI: ${settings.company_cui}` : ""}</p>
            <p>{settings.company_reg_com ? `Reg. Com.: ${settings.company_reg_com}` : ""}</p>
            <p>{settings.public_email}</p>
            <p>{settings.registered_address}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
          <h2 className="text-lg font-semibold">Client</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">Nume</dt>
              <dd className="font-medium">{repair.customer?.name || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd>{repair.customer?.email || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Telefon</dt>
              <dd>{repair.customer?.phone || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Locație</dt>
              <dd>
                {[repair.customer?.city, repair.customer?.county].filter(Boolean).join(", ") || "N/A"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
          <h2 className="text-lg font-semibold">Echipament</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">Tip</dt>
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
              <dt className="text-slate-500">Status final</dt>
              <dd className="font-medium">{humanRepairStatus(repair.status)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
        <h2 className="text-lg font-semibold">Problema raportată</h2>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7">
          {repair.issueReported}
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
          <h2 className="text-lg font-semibold">Notă publică finală</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7">
            {repair.publicNotes || "Nu există notă publică finală."}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 print:break-inside-avoid">
          <h2 className="text-lg font-semibold">Note interne</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7">
            {repair.internalNotes || "Nu există note interne."}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
        <h2 className="text-lg font-semibold">Deviz / cost</h2>
        {latestQuote ? (
          <div className="mt-4">
            <p className="text-2xl font-bold">{money(latestQuote.amount, latestQuote.currency)}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{latestQuote.description}</p>
            <p className="mt-3 text-xs text-slate-500">
              {latestQuote.approvedAt
                ? `Aprobat la ${formatDate(latestQuote.approvedAt)}`
                : latestQuote.rejectedAt
                  ? `Respins la ${formatDate(latestQuote.rejectedAt)}`
                  : "În așteptare"}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm">Nu există deviz.</p>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 p-5">
        <h2 className="text-lg font-semibold">Istoric status</h2>
        {repair.statusUpdates.length === 0 ? (
          <p className="mt-4 text-sm">Nu există statusuri.</p>
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
                  <p className="mt-1 text-sm text-amber-800">Intern: {update.internalNote}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 p-5">
        <h2 className="text-lg font-semibold">Fișiere / dovezi</h2>
        {repair.uploads.length === 0 ? (
          <p className="mt-4 text-sm">Nu există fișiere încărcate.</p>
        ) : (
          <table className="mt-4 w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2">Fișier</th>
                <th className="py-2">Vizibilitate</th>
                <th className="py-2">Tip</th>
                <th className="py-2">Descriere</th>
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

      <section className="mt-8 rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
        <h2 className="text-lg font-semibold">Garanție și observații</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6">
          <li>Garanție manoperă: {settings.labour_warranty}</li>
          <li>Garanție piese: {settings.parts_warranty}</li>
          <li>{settings.data_backup_warning}</li>
          <li>Garanția se aplică lucrării efectuate și problemei confirmate în fișa de service.</li>
          <li>Intervențiile ulterioare neautorizate, loviturile, lichidele sau defectele noi pot limita garanția.</li>
        </ul>
      </section>

      <section className="mt-10 grid gap-8 border-t border-slate-300 pt-8 text-sm md:grid-cols-2">
        <div>
          <p className="font-semibold">Semnătură service</p>
          <div className="mt-10 border-t border-slate-300 pt-2 text-slate-500">
            Nume / semnătură
          </div>
        </div>

        <div>
          <p className="font-semibold">Semnătură client</p>
          <div className="mt-10 border-t border-slate-300 pt-2 text-slate-500">
            Nume / semnătură
          </div>
        </div>
      </section>

      <p className="mt-8 text-xs text-slate-500">
        Document generat din admin pentrunoi.ro. Status online: /status/{repair.trackingId}
      </p>
    </main>
  );
}
