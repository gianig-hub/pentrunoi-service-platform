import { prisma } from "@/lib/prisma";
import { csvResponse, toCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET() {
  const repairs = await prisma.repairCase.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      device: true,
      _count: {
        select: {
          quotes: true,
          uploads: true,
          reminders: true,
          statusUpdates: true
        }
      }
    }
  });

  const csv = toCsv(
    [
      "trackingId",
      "status",
      "customerName",
      "customerEmail",
      "customerPhone",
      "city",
      "county",
      "deviceType",
      "brand",
      "model",
      "serialNumber",
      "issueReported",
      "publicNotes",
      "internalNotes",
      "courierInboundAwb",
      "courierOutboundAwb",
      "quotesCount",
      "uploadsCount",
      "remindersCount",
      "statusUpdatesCount",
      "createdAt",
      "updatedAt"
    ],
    repairs.map((repair) => [
      repair.trackingId,
      repair.status,
      repair.customer?.name,
      repair.customer?.email,
      repair.customer?.phone,
      repair.customer?.city,
      repair.customer?.county,
      repair.device?.type,
      repair.device?.brand,
      repair.device?.model,
      repair.device?.serialNumber,
      repair.issueReported,
      repair.publicNotes,
      repair.internalNotes,
      repair.courierInboundAwb,
      repair.courierOutboundAwb,
      repair._count.quotes,
      repair._count.uploads,
      repair._count.reminders,
      repair._count.statusUpdates,
      repair.createdAt.toISOString(),
      repair.updatedAt.toISOString()
    ])
  );

  return csvResponse(`pentrunoi-repairs-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
