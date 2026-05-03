import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

function humanLeadType(type: string) {
  const map: Record<string, string> = {
    BUSINESS_IT: "Suport IT firme",
    CONNECTIVITY: "Conectivitate",
    DIGITAL_PROJECT: "Web/App",
    GENERAL_CONTACT: "Contact"
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

function humanReminderType(type: string) {
  const map: Record<string, string> = {
    LAPTOP_CLEANING: "Curățare laptop",
    THERMAL_CHECK: "Verificare termică",
    HEALTH_CHECK: "Health check",
    BUSINESS_IT_MAINTENANCE: "Mentenanță IT firmă",
    WEBSITE_MAINTENANCE: "Mentenanță website"
  };

  return map[type] || type;
}

export default async function AdminCustomerDetailPage({ params }: PageProps) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      devices: {
        orderBy: {
          createdAt: "desc"
        }
      },
      repairCases: {
        orderBy: {
          createdAt: "desc"
        },
        include: {
          device: true,
          quotes: {
            orderBy: {
              createdAt: "desc"
            },
            take: 1
          },
          uploads: true,
          reminders: true
        }
      },
      leads: {
        orderBy: {
          createdAt: "desc"
        }
      },
      reminders: {
        orderBy: {
          scheduledFor: "asc"
        },
        include: {
          repairCase: true
        }
      }
    }
  });

  if (!customer) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Link href="/admin/customers" className="text-sm font-medium text-slate-600">
        ← Back to customers
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Customer
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {customer.name}
          </h1>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-1 font-medium text-slate-950">{customer.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Telefon</p>
              <p className="mt-1 font-medium text-slate-950">{customer.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Oraș</p>
              <p className="mt-1 font-medium text-slate-950">{customer.city || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Județ</p>
              <p className="mt-1 font-medium text-slate-950">{customer.county || "N/A"}</p>
            </div>
          </div>

          {customer.address ? (
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Adresă</p>
              <p className="mt-1 text-slate-800">{customer.address}</p>
            </div>
          ) : null}

          {customer.notes ? (
            <div className="mt-5 rounded-xl bg-amber-50 p-4">
              <p className="text-sm text-amber-800">Note interne client</p>
              <p className="mt-1 text-amber-900">{customer.notes}</p>
            </div>
          ) : null}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Created</p>
            <p className="mt-1 font-medium text-slate-950">{formatDate(customer.createdAt)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Devices</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{customer.devices.length}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Repairs</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{customer.repairCases.length}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Leads</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{customer.leads.length}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Reminders</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{customer.reminders.length}</p>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Devices</h2>

        {customer.devices.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No devices yet.</p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customer.devices.map((device) => (
              <article key={device.id} className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-950">{device.type}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {[device.brand, device.model].filter(Boolean).join(" ") || "N/A"}
                </p>
                {device.serialNumber ? (
                  <p className="mt-2 text-xs text-slate-500">SN: {device.serialNumber}</p>
                ) : null}
                {device.notes ? (
                  <p className="mt-3 text-sm text-slate-700">{device.notes}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Repair history</h2>

        {customer.repairCases.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No repair cases yet.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {customer.repairCases.map((repair) => (
              <article key={repair.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/admin/repairs/${repair.trackingId}`}
                      className="text-lg font-semibold text-slate-950 underline"
                    >
                      {repair.trackingId}
                    </Link>
                    <p className="mt-1 text-sm text-slate-600">
                      {repair.device?.type || "N/A"} · {formatDate(repair.createdAt)}
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {humanRepairStatus(repair.status)}
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-700">{repair.issueReported}</p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="rounded-full bg-slate-50 px-3 py-1">
                    Quotes: {repair.quotes.length}
                  </span>
                  <span className="rounded-full bg-slate-50 px-3 py-1">
                    Uploads: {repair.uploads.length}
                  </span>
                  <span className="rounded-full bg-slate-50 px-3 py-1">
                    Reminders: {repair.reminders.length}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Leads</h2>

          {customer.leads.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No leads linked to this customer.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {customer.leads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="block rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
                >
                  <p className="font-semibold text-slate-950">{lead.trackingId}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {humanLeadType(lead.type)} · {humanLeadStatus(lead.status)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Reminders</h2>

          {customer.reminders.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No reminders linked to this customer.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {customer.reminders.map((reminder) => (
                <article key={reminder.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-950">
                    {humanReminderType(reminder.type)}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {reminder.status} · {formatDate(reminder.scheduledFor)}
                  </p>
                  {reminder.repairCase ? (
                    <Link
                      href={`/admin/repairs/${reminder.repairCase.trackingId}`}
                      className="mt-2 inline-flex text-sm font-semibold text-slate-950 underline"
                    >
                      {reminder.repairCase.trackingId}
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
