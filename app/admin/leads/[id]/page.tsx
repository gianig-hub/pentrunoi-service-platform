import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: "NEW", label: "Nou" },
  { value: "IN_REVIEW", label: "În analiză" },
  { value: "QUESTIONS_SENT", label: "Întrebări trimise" },
  { value: "QUOTE_SENT", label: "Ofertă trimisă" },
  { value: "APPROVED", label: "Aprobat" },
  { value: "IN_PROGRESS", label: "În lucru" },
  { value: "COMPLETED", label: "Finalizat" },
  { value: "CLOSED", label: "Închis" }
];

function humanLeadStatus(status: string) {
  return statusOptions.find((option) => option.value === status)?.label || status;
}

function humanLeadType(type: string) {
  const map: Record<string, string> = {
    BUSINESS_IT: "Suport IT firme",
    CONNECTIVITY: "Internet, rețele și conectivitate",
    DIGITAL_PROJECT: "Web design / aplicații",
    GENERAL_CONTACT: "Contact general"
  };

  return map[type] || type;
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

export default async function AdminLeadDetailPage({ params }: PageProps) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      uploads: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!lead) {
    notFound();
  }

  async function updateLead(formData: FormData) {
    "use server";

    const status = textValue(formData, "status") as LeadStatus;
    const publicNotes = textValue(formData, "publicNotes");
    const internalNotes = textValue(formData, "internalNotes");

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status,
        publicNotes: publicNotes || null,
        internalNotes: internalNotes || null
      }
    });

    await prisma.changelogEntry.create({
      data: {
        version: "0.1.0-dev",
        type: "ADMIN",
        module: "Leads",
        title: `Lead status updated: ${lead.trackingId}`,
        description: `Lead ${lead.trackingId} was updated to ${status}.`,
        status: "DONE"
      }
    });

    revalidatePath(`/admin/leads/${lead.id}`);
    revalidatePath("/admin/leads");
    revalidatePath(`/status/${lead.trackingId}`);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/admin/leads" className="text-sm font-medium text-slate-600">
        ← Back to leads
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Lead
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          {lead.trackingId}
        </h1>
        <p className="mt-3 text-slate-700">
          {humanLeadType(lead.type)} — <strong>{humanLeadStatus(lead.status)}</strong>
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-950">Update lead</h2>

          <form action={updateLead} className="mt-6 space-y-5">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={lead.status}
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
                Notă publică
              </label>
              <textarea
                id="publicNotes"
                name="publicNotes"
                rows={4}
                defaultValue={lead.publicNotes || ""}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
              <p className="mt-2 text-xs text-slate-500">
                Această notă poate fi afișată pe pagina publică de status.
              </p>
            </div>

            <div>
              <label htmlFor="internalNotes" className="block text-sm font-medium text-slate-700">
                Note interne
              </label>
              <textarea
                id="internalNotes"
                name="internalNotes"
                rows={5}
                defaultValue={lead.internalNotes || ""}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
              <p className="mt-2 text-xs text-slate-500">
                Aceste note rămân doar în admin.
              </p>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Salvează lead
            </button>
          </form>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">Contact</h2>
            <p className="mt-3 font-medium">{lead.name || "N/A"}</p>
            <p className="text-sm text-slate-600">{lead.email || ""}</p>
            <p className="text-sm text-slate-600">{lead.companyName || ""}</p>
            <p className="text-sm text-slate-600">{lead.location || ""}</p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">Detalii</h2>
            <p className="mt-3 text-sm text-slate-700">
              <strong>Tip:</strong> {humanLeadType(lead.type)}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Status:</strong> {humanLeadStatus(lead.status)}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Creat:</strong> {formatDate(lead.createdAt)}
            </p>
            {lead.projectUrl ? (
              <p className="mt-2 text-sm text-slate-700">
                <strong>Website:</strong> {lead.projectUrl}
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">Mesaj</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
              {lead.message || "Fără mesaj."}
            </p>
          </section>
        </aside>
      </div>

      {lead.metadata ? (
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Metadata formular</h2>
          <pre className="mt-4 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-50">
            {JSON.stringify(lead.metadata, null, 2)}
          </pre>
        </section>
      ) : null}

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Public status link</h2>
        <Link
          href={`/status/${lead.trackingId}`}
          className="mt-3 inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          Vezi pagina publică
        </Link>
      </section>
    </main>
  );
}
