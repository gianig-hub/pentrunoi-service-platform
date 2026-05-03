import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
    BUSINESS_IT: "IT firme",
    CONNECTIVITY: "Conectivitate",
    DIGITAL_PROJECT: "Web/App",
    GENERAL_CONTACT: "Contact"
  };

  return map[type] || type;
}

export default async function AdminPage() {
  const [
    repairCount,
    openRepairCount,
    leadCount,
    openLeadCount,
    reminderCount,
    scheduledReminderCount,
    emailLogCount,
    skippedEmailCount,
    customerCount,
    latestRepairs,
    latestLeads,
    latestChangelog
  ] = await Promise.all([
    prisma.repairCase.count(),
    prisma.repairCase.count({
      where: {
        status: {
          notIn: ["COMPLETED", "CLOSED", "REJECTED"]
        }
      }
    }),
    prisma.lead.count(),
    prisma.lead.count({
      where: {
        status: {
          notIn: ["COMPLETED", "CLOSED"]
        }
      }
    }),
    prisma.reminder.count(),
    prisma.reminder.count({
      where: {
        status: "SCHEDULED"
      }
    }),
    prisma.emailLog.count().catch(() => 0),
    prisma.emailLog.count({ where: { status: "SKIPPED" } }).catch(() => 0),
    prisma.customer.count(),
    prisma.repairCase.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        customer: true,
        device: true
      },
      take: 5
    }),
    prisma.lead.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    }),
    prisma.changelogEntry.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    })
  ]);

  const cards = [
    {
      label: "Repair cases",
      value: repairCount,
      detail: `${openRepairCount} active`,
      href: "/admin/repairs"
    },
    {
      label: "Leads",
      value: leadCount,
      detail: `${openLeadCount} active`,
      href: "/admin/leads"
    },
    {
      label: "Reminders",
      value: reminderCount,
      detail: `${scheduledReminderCount} scheduled`,
      href: "/admin/reminders"
    },
    {
      label: "Email logs",
      value: emailLogCount,
      detail: `${skippedEmailCount} skipped`,
      href: "/admin/email-logs"
    },
    {
      label: "Customers",
      value: customerCount,
      detail: "internal records",
      href: "/admin/customers"
    }
  ];

  const quickLinks = [
    {
      href: "/admin/repairs",
      title: "Repair cases",
      description: "Vezi și actualizează cererile service primite."
    },
    {
      href: "/admin/leads",
      title: "Leads",
      description: "Gestionează cereri WEB, IT și NET primite prin formulare."
    },
    {
      href: "/admin/reminders",
      title: "Reminders",
      description: "Vezi remindere pentru service, mentenanță și follow-up."
    },
    {
      href: "/admin/changelog",
      title: "Changelog",
      description: "Vezi istoricul de lucru, modificările și modulele dezvoltate."
    },
    {
      href: "/admin/email-logs",
      title: "Email logs",
      description: "Vezi notificările trimise, eșuate sau omise în development."
    },
    {
      href: "/admin/exports",
      title: "Exports",
      description: "Descarcă CSV pentru reparații, lead-uri, clienți, remindere și email logs."
    },
    {
      href: "/admin/settings",
      title: "Settings",
      description: "Editează date companie, legal, garanții, curier și contact."
    }
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Admin
      </p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        Pentrunoi admin dashboard
      </h1>

      <p className="mt-4 max-w-3xl text-slate-700">
        Control panel pentru reparații, lead-uri, remindere, emailuri, changelog,
        setări și statusul platformei.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">{card.value}</p>
            <p className="mt-1 text-sm text-slate-600">{card.detail}</p>
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-950">Latest repairs</h2>
            <Link href="/admin/repairs" className="text-sm font-semibold text-slate-600">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {latestRepairs.length === 0 ? (
              <p className="text-sm text-slate-600">No repairs yet.</p>
            ) : (
              latestRepairs.map((repair) => (
                <Link
                  key={repair.id}
                  href={`/admin/repairs/${repair.trackingId}`}
                  className="block rounded-xl border border-slate-100 p-4 hover:bg-slate-50"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{repair.trackingId}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {repair.customer?.name || "Fără client"} · {repair.device?.type || "N/A"}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {humanRepairStatus(repair.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{formatDate(repair.createdAt)}</p>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-950">Latest leads</h2>
            <Link href="/admin/leads" className="text-sm font-semibold text-slate-600">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {latestLeads.length === 0 ? (
              <p className="text-sm text-slate-600">No leads yet.</p>
            ) : (
              latestLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="block rounded-xl border border-slate-100 p-4 hover:bg-slate-50"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{lead.trackingId}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {lead.name || "N/A"} · {lead.companyName || "Fără firmă"}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {humanLeadType(lead.type)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{formatDate(lead.createdAt)}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-950">Quick links</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-slate-100 p-5 transition hover:bg-slate-50"
              >
                <h3 className="font-semibold text-slate-950">{link.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Latest changelog</h2>

          <div className="mt-5 space-y-4">
            {latestChangelog.length === 0 ? (
              <p className="text-sm text-slate-600">No changelog yet.</p>
            ) : (
              latestChangelog.map((entry) => (
                <div key={entry.id} className="border-l-2 border-slate-200 pl-4">
                  <p className="font-semibold text-slate-950">{entry.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {entry.type} · {entry.module} · {formatDate(entry.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>

          <Link
            href="/admin/changelog"
            className="mt-5 inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            View changelog
          </Link>
        </div>
      </section>
    </main>
  );
}
