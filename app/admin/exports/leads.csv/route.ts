import { prisma } from "@/lib/prisma";
import { csvResponse, toCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" }
  });

  const csv = toCsv(
    [
      "trackingId",
      "type",
      "status",
      "name",
      "email",
      "companyName",
      "location",
      "projectUrl",
      "message",
      "publicNotes",
      "internalNotes",
      "metadata",
      "createdAt",
      "updatedAt"
    ],
    leads.map((lead) => [
      lead.trackingId,
      lead.type,
      lead.status,
      lead.name,
      lead.email,
      lead.companyName,
      lead.location,
      lead.projectUrl,
      lead.message,
      lead.publicNotes,
      lead.internalNotes,
      lead.metadata ? JSON.stringify(lead.metadata) : "",
      lead.createdAt.toISOString(),
      lead.updatedAt.toISOString()
    ])
  );

  return csvResponse(`pentrunoi-leads-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
