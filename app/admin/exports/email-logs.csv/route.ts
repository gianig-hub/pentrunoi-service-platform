import { prisma } from "@/lib/prisma";
import { csvResponse, toCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET() {
  const logs = await prisma.emailLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5000
  });

  const csv = toCsv(
    [
      "status",
      "to",
      "from",
      "replyTo",
      "subject",
      "reason",
      "error",
      "createdAt",
      "updatedAt"
    ],
    logs.map((log) => [
      log.status,
      log.to,
      log.from,
      log.replyTo,
      log.subject,
      log.reason,
      log.error,
      log.createdAt.toISOString(),
      log.updatedAt.toISOString()
    ])
  );

  return csvResponse(`pentrunoi-email-logs-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
