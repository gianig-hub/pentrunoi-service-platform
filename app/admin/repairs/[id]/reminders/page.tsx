import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ReminderType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const reminderTypes: { value: ReminderType; label: string; defaultMonths: number }[] = [
  { value: "LAPTOP_CLEANING", label: "Curățare laptop", defaultMonths: 6 },
  { value: "THERMAL_CHECK", label: "Verificare termică", defaultMonths: 6 },
  { value: "HEALTH_CHECK", label: "Health check", defaultMonths: 12 },
  { value: "BUSINESS_IT_MAINTENANCE", label: "Mentenanță IT firmă", defaultMonths: 3 },
  { value: "WEBSITE_MAINTENANCE", label: "Mentenanță website", defaultMonths: 1 }
];

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

function humanType(type: string) {
  return reminderTypes.find((item) => item.value === type)?.label || type;
}

function humanStatus(status: string) {
  const map: Record<string, string> = {
    SCHEDULED: "Programat",
    SENT: "Trimis",
    CANCELLED: "Anulat"
  };

  return map[status] || status;
}

function defaultDateAfterMonths(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

export default async function RepairRemindersPage({ params }: PageProps) {
  const { id } = await params;

  const repair = await prisma.repairCase.findFirst({
    where: {
      OR: [{ id }, { trackingId: id }]
    },
    include: {
      customer: true,
      device: true,
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
  const customerId = repair.customerId;

  async function createReminder(formData: FormData) {
    "use server";

    const type = textValue(formData, "type") as ReminderType;
    const scheduledForRaw = textValue(formData, "scheduledFor");
    const subject = textValue(formData, "subject");
    const message = textValue(formData, "message");

    if (!type || !scheduledForRaw || !subject) {
      throw new Error("Type, scheduled date and subject are required.");
    }

    const scheduledFor = new Date(`${scheduledForRaw}T09:00:00.000Z`);

    await prisma.reminder.create({
      data: {
        repairCaseId: repairId,
        customerId: customerId || null,
        type,
        status: "SCHEDULED",
        scheduledFor,
        subject,
        message: message || null
      }
    });

    await prisma.changelogEntry.create({
      data: {
        version: "0.1.0-dev",
        type: "FEATURE",
        module: "Reminders",
        title: `Reminder created: ${repairTrackingId}`,
        description: `A reminder was scheduled for repair case ${repairTrackingId}.`,
        status: "DONE"
      }
    });

    revalidatePath(`/admin/repairs/${repairTrackingId}`);
    revalidatePath(`/admin/repairs/${repairTrackingId}/reminders`);
    revalidatePath("/admin/reminders");
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href={`/admin/repairs/${repair.trackingId}`} className="text-sm font-medium text-slate-600">
        ← Back to repair case
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Reminders
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Remindere pentru {repair.trackingId}
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Creează remindere pentru mentenanță, curățare, verificare termică sau follow-up.
          Trimiterea automată prin email va fi activată într-un pas următor.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-950">Creează reminder</h2>

          <form action={createReminder} className="mt-6 space-y-5">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-slate-700">
                Tip reminder
              </label>
              <select
                id="type"
                name="type"
                defaultValue="LAPTOP_CLEANING"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                {reminderTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label} — recomandat după {item.defaultMonths} luni
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="scheduledFor" className="block text-sm font-medium text-slate-700">
                Data reminder
              </label>
              <input
                id="scheduledFor"
                name="scheduledFor"
                type="date"
                defaultValue={defaultDateAfterMonths(6)}
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
                Subiect email / notă
              </label>
              <input
                id="subject"
                name="subject"
                required
                defaultValue={`Reminder service pentru ${repair.device?.type || "echipament"}`}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                Mesaj
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                defaultValue={[
                  `Bună, ${repair.customer?.name || ""},`,
                  "",
                  "A trecut o perioadă de la ultima intervenție service.",
                  "Recomandăm o verificare preventivă pentru curățare, temperaturi și funcționare.",
                  "",
                  "Pentrunoi.ro"
                ].join("\n")}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Creează reminder
            </button>
          </form>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">Client</h2>
            <p className="mt-3 font-medium">{repair.customer?.name || "N/A"}</p>
            <p className="text-sm text-slate-600">{repair.customer?.email || ""}</p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">Echipament</h2>
            <p className="mt-3">{repair.device?.type || "N/A"}</p>
            <p className="text-sm text-slate-600">
              {[repair.device?.brand, repair.device?.model].filter(Boolean).join(" ")}
            </p>
          </section>
        </aside>
      </div>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Remindere existente</h2>

        {repair.reminders.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">Nu există remindere încă.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {repair.reminders.map((reminder) => (
              <article key={reminder.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">
                      {humanType(reminder.type)}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {humanStatus(reminder.status)} · {formatDate(reminder.scheduledFor)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 font-medium text-slate-950">
                  {reminder.subject || "Fără subiect"}
                </p>

                {reminder.message ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                    {reminder.message}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
