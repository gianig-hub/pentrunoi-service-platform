import { prisma } from "@/lib/prisma";
import { csvResponse, toCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET() {
  const reminders = await prisma.reminder.findMany({
    orderBy: { scheduledFor: "asc" },
    include: {
      customer: true,
      repairCase: {
        include: {
          customer: true
        }
      }
    }
  });

  const csv = toCsv(
    [
      "type",
      "status",
      "scheduledFor",
      "sentAt",
      "customerName",
      "customerEmail",
      "repairTrackingId",
      "subject",
      "message",
      "createdAt",
      "updatedAt"
    ],
    reminders.map((reminder) => [
      reminder.type,
      reminder.status,
      reminder.scheduledFor.toISOString(),
      reminder.sentAt?.toISOString() || "",
      reminder.customer?.name || reminder.repairCase?.customer?.name || "",
      reminder.customer?.email || reminder.repairCase?.customer?.email || "",
      reminder.repairCase?.trackingId || "",
      reminder.subject,
      reminder.message,
      reminder.createdAt.toISOString(),
      reminder.updatedAt.toISOString()
    ])
  );

  return csvResponse(`pentrunoi-reminders-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
