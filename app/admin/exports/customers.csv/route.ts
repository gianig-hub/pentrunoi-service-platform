import { prisma } from "@/lib/prisma";
import { csvResponse, toCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          devices: true,
          repairCases: true,
          leads: true,
          reminders: true
        }
      }
    }
  });

  const csv = toCsv(
    [
      "name",
      "email",
      "phone",
      "city",
      "county",
      "address",
      "notes",
      "devicesCount",
      "repairCasesCount",
      "leadsCount",
      "remindersCount",
      "createdAt",
      "updatedAt"
    ],
    customers.map((customer) => [
      customer.name,
      customer.email,
      customer.phone,
      customer.city,
      customer.county,
      customer.address,
      customer.notes,
      customer._count.devices,
      customer._count.repairCases,
      customer._count.leads,
      customer._count.reminders,
      customer.createdAt.toISOString(),
      customer.updatedAt.toISOString()
    ])
  );

  return csvResponse(`pentrunoi-customers-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
