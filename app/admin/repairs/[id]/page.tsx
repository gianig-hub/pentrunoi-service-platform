import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CaseStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusOptions: { value: CaseStatus; label: string }[] = [
  { value: "REQUEST_RECEIVED", label: "Cerere primită" },
  { value: "WAITING_FOR_DEVICE", label: "Așteptăm echipamentul" },
  { value: "DEVICE_RECEIVED", label: "Echipament primit" },
  { value: "DIAGNOSIS_IN_PROGRESS", label: "Diagnosticare în curs" },
  { value: "QUOTE_SENT", label: "Deviz trimis" },
  { value: "WAITING_FOR_APPROVAL", label: "Așteptăm aprobarea clientului" },
  { value: "APPROVED", label: "Aprobat" },
  { value: "IN_REPAIR", label: "În reparație" },
  { value: "TESTING", label: "În testare" },
  { value: "READY_FOR_RETURN", label: "Pregătit pentru retur" },
  { value: "SENT_TO_CUSTOMER", label: "Trimis către client" },
  { value: "COMPLETED", label: "Finalizat" },
  { value: "REJECTED", label: "Refuzat" },
  { value: "CLOSED", label: "Închis" }
];

function humanStatus(status: string) {
  return statusOptions.find((option) => option.value === status)?.label || status;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export default async function AdminRepairDetailPage({ params }: PageProps) {
  const { id } = await params;

  const repair = await prisma.repairCase.findFirst({
    where: {
      OR: [{ id }, { trackingId: id }]
    },
    include: {
      customer: true,
      device: true,
      statusUpdates: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!repair) {
    notFound();
  }

  const repairId = repair.id;
  const repairTrackingId = repair.trackingId;

  async function updateRepair(formData: FormData) {
    "use server";

    const status = textValue(formData, "status") as CaseStatus;
    const publicNotes = textValue(formData, "publicNotes");
    const internalNotes = textValue(formData, "internalNotes");
    const publicUpdateNote = textValue(formData, "publicUpdateNote");
    const internalUpdateNote = textValue(formData, "internalUpdateNote");
    const courierInboundAwb = textValue(formData, "courierInboundAwb");
    const courierOutboundAwb = textValue(formData, "courierOutboundAwb");

    await prisma.repairCase.update({
      where: { id: repairId },
      data: {
        status,
        publicNotes: publicNotes || null,
        internalNotes: internalNotes || null,
        courierInboundAwb: courierInboundAwb || null,
        courierOutboundAwb: courierOutboundAwb || null,
        statusUpdates: {
          create: {
            status,
            isPublic: true,
            publicNote: publicUpdateNote || null,
            internalNote: internalUpdateNote || null
          }
        }
      }
    });

    await prisma.changelogEntry.create({
      data: {
        version: "0.1.0-dev",
        type: "ADMIN",
        module: "Repairs",
        title: `Repair status updated: ${repairTrackingId}`,
        description: `Repair case ${repairTrackingId} was updated to ${status}.`,
        status: "DONE"
      }
    });

    revalidatePath(`/admin/repairs/${repairId}`);
    revalidatePath("/admin/repairs");
    revalidatePath(`/status/${repairTrackingId}`);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/admin/repairs" className="text-sm font-medium text-slate-600">
        ← Back to repair cases
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Repair case
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {repair.trackingId}
          </h1>
          <p className="mt-3 text-slate-700">
            Status actual: <strong>{humanStatus(repair.status)}</strong>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/repairs/${repair.trackingId}/print`}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Print job card
          </Link>

          <Link
            href={`/admin/repairs/${repair.trackingId}/completion`}
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Completion report
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-950">Update lucrare</h2>

          <form action={updateRepair} className="mt-6 space-y-5">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={repair.status}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="publicNotes" className="block text-sm font-medium text-slate-700">
                Notă publică permanentă
              </label>
              <textarea
                id="publicNotes"
                name="publicNotes"
                rows={3}
                defaultValue={repair.publicNotes || ""}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="publicUpdateNote" className="block text-sm font-medium text-slate-700">
                Notă publică pentru această actualizare
              </label>
              <textarea
                id="publicUpdateNote"
                name="publicUpdateNote"
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="internalNotes" className="block text-sm font-medium text-slate-700">
                Note interne permanente
              </label>
              <textarea
                id="internalNotes"
                name="internalNotes"
                rows={3}
                defaultValue={repair.internalNotes || ""}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="internalUpdateNote" className="block text-sm font-medium text-slate-700">
                Notă internă pentru această actualizare
              </label>
              <textarea
                id="internalUpdateNote"
                name="internalUpdateNote"
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="courierInboundAwb" className="block text-sm font-medium text-slate-700">
                  AWB intrare
                </label>
                <input
                  id="courierInboundAwb"
                  name="courierInboundAwb"
                  defaultValue={repair.courierInboundAwb || ""}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label htmlFor="courierOutboundAwb" className="block text-sm font-medium text-slate-700">
                  AWB retur
                </label>
                <input
                  id="courierOutboundAwb"
                  name="courierOutboundAwb"
                  defaultValue={repair.courierOutboundAwb || ""}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Salvează actualizare
            </button>
          </form>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">Client</h2>
            <p className="mt-3 font-medium">{repair.customer?.name || "N/A"}</p>
            <p className="text-sm text-slate-600">{repair.customer?.email || ""}</p>
            <p className="text-sm text-slate-600">{repair.customer?.city || ""}</p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">Echipament</h2>
            <p className="mt-3">{repair.device?.type || "N/A"}</p>
            <p className="text-sm text-slate-600">
              {[repair.device?.brand, repair.device?.model].filter(Boolean).join(" ")}
            </p>
            {repair.device?.serialNumber ? (
              <p className="text-sm text-slate-600">SN: {repair.device.serialNumber}</p>
            ) : null}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">Problemă raportată</h2>
            <p className="mt-3 text-sm text-slate-700">{repair.issueReported}</p>
          </section>
        </aside>
      </div>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Istoric status</h2>

        {repair.statusUpdates.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">Nu există actualizări încă.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {repair.statusUpdates.map((update) => (
              <div key={update.id} className="border-l-2 border-slate-200 pl-4">
                <p className="font-medium text-slate-950">
                  {humanStatus(update.status)}
                </p>
                <p className="text-xs text-slate-500">{formatDate(update.createdAt)}</p>
                {update.publicNote ? (
                  <p className="mt-1 text-sm text-slate-700">
                    Public: {update.publicNote}
                  </p>
                ) : null}
                {update.internalNote ? (
                  <p className="mt-1 text-sm text-amber-700">
                    Intern: {update.internalNote}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
