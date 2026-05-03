import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

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

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function sendReminderNow(formData: FormData) {
  "use server";

  const reminderId = textValue(formData, "reminderId");

  if (!reminderId) {
    throw new Error("Missing reminder ID.");
  }

  const reminder = await prisma.reminder.findUnique({
    where: {
      id: reminderId
    },
    include: {
      customer: true,
      repairCase: {
        include: {
          customer: true,
          device: true
        }
      }
    }
  });

  if (!reminder) {
    throw new Error("Reminder not found.");
  }

  if (reminder.status === "CANCELLED") {
    throw new Error("Cannot send a cancelled reminder.");
  }

  const recipientEmail = reminder.customer?.email || reminder.repairCase?.customer?.email || "";
  const recipientName = reminder.customer?.name || reminder.repairCase?.customer?.name || "client";
  const trackingId = reminder.repairCase?.trackingId || "";
  const deviceLabel = reminder.repairCase?.device
    ? [reminder.repairCase.device.type, reminder.repairCase.device.brand, reminder.repairCase.device.model]
        .filter(Boolean)
        .join(" ")
    : "";

  if (!recipientEmail) {
    await prisma.changelogEntry.create({
      data: {
        version: "0.1.0-dev",
        type: "ADMIN",
        module: "Reminders",
        title: "Reminder could not be sent",
        description: `Reminder ${reminder.id} has no recipient email.`,
        status: "DONE"
      }
    });

    revalidatePath("/admin/reminders");

    throw new Error("This reminder has no recipient email.");
  }

  const subject =
    reminder.subject ||
    `Reminder service ${trackingId ? `- ${trackingId}` : ""}`;

  const message =
    reminder.message ||
    [
      `Bună, ${recipientName},`,
      "",
      "A trecut o perioadă de la ultima intervenție service.",
      deviceLabel ? `Echipament: ${deviceLabel}` : "",
      trackingId ? `Cod tracking: ${trackingId}` : "",
      "",
      "Recomandăm o verificare preventivă pentru curățare, temperaturi și funcționare.",
      "",
      "Pentrunoi.ro"
    ]
      .filter(Boolean)
      .join("\n");

  const result = await sendEmail({
    to: recipientEmail,
    subject,
    text: message
  });

  await prisma.reminder.update({
    where: {
      id: reminder.id
    },
    data: {
      status: "SENT",
      sentAt: new Date()
    }
  });

  await prisma.changelogEntry.create({
    data: {
      version: "0.1.0-dev",
      type: "FEATURE",
      module: "Reminders",
      title: `Reminder sent: ${trackingId || reminder.id}`,
      description: result.sent
        ? `Reminder email was sent to ${recipientEmail}.`
        : `Reminder was processed but email was skipped: ${result.reason || "unknown reason"}.`,
      status: "DONE"
    }
  });

  revalidatePath("/admin/reminders");

  if (trackingId) {
    revalidatePath(`/admin/repairs/${trackingId}`);
    revalidatePath(`/admin/repairs/${trackingId}/reminders`);
  }
}

async function cancelReminder(formData: FormData) {
  "use server";

  const reminderId = textValue(formData, "reminderId");

  if (!reminderId) {
    throw new Error("Missing reminder ID.");
  }

  await prisma.reminder.update({
    where: {
      id: reminderId
    },
    data: {
      status: "CANCELLED"
    }
  });

  await prisma.changelogEntry.create({
    data: {
      version: "0.1.0-dev",
      type: "ADMIN",
      module: "Reminders",
      title: "Reminder cancelled",
      description: `Reminder ${reminderId} was cancelled from admin.`,
      status: "DONE"
    }
  });

  revalidatePath("/admin/reminders");
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
          mentenanță IT business și mentenanță website. Trimiterea automată va fi adăugată ulterior.
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
              <th className="p-4">Acțiuni</th>
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
                  <td className="p-4">
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        reminder.status === "SENT"
                          ? "bg-emerald-50 text-emerald-800"
                          : reminder.status === "CANCELLED"
                            ? "bg-red-50 text-red-800"
                            : "bg-amber-50 text-amber-800"
                      ].join(" ")}
                    >
                      {humanStatus(reminder.status)}
                    </span>
                  </td>
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
                    <div className="flex flex-wrap gap-2">
                      {reminder.repairCase ? (
                        <Link
                          href={`/admin/repairs/${reminder.repairCase.trackingId}/reminders`}
                          className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900"
                        >
                          Deschide
                        </Link>
                      ) : null}

                      {reminder.status === "SCHEDULED" ? (
                        <>
                          <form action={sendReminderNow}>
                            <input type="hidden" name="reminderId" value={reminder.id} />
                            <button
                              type="submit"
                              className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white"
                            >
                              Send now
                            </button>
                          </form>

                          <form action={cancelReminder}>
                            <input type="hidden" name="reminderId" value={reminder.id} />
                            <button
                              type="submit"
                              className="rounded-lg bg-red-700 px-3 py-2 text-xs font-semibold text-white"
                            >
                              Cancel
                            </button>
                          </form>
                        </>
                      ) : null}
                    </div>
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
