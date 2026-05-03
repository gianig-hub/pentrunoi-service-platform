import Link from "next/link";
import { mkdir, access } from "node:fs/promises";
import os from "node:os";
import { prisma } from "@/lib/prisma";
import { getUploadsDir } from "@/lib/uploads";

export const dynamic = "force-dynamic";

function yesNo(value: boolean) {
  return value ? "Yes" : "No";
}

function statusBadge(ok: boolean) {
  return ok
    ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
    : "rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-800";
}

function mask(value?: string) {
  if (!value) return "Not set";
  if (value.length <= 6) return "Set";
  return `${value.slice(0, 3)}***${value.slice(-3)}`;
}

async function checkUploadsDir() {
  const dir = getUploadsDir();

  try {
    await mkdir(dir, { recursive: true });
    await access(dir);
    return {
      ok: true,
      dir
    };
  } catch (error) {
    return {
      ok: false,
      dir,
      error: error instanceof Error ? error.message : "Unknown upload directory error"
    };
  }
}

async function checkDatabase() {
  try {
    const result = await prisma.$queryRaw<Array<{ now: Date }>>`SELECT NOW() as now`;

    return {
      ok: true,
      now: result[0]?.now
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown database error"
    };
  }
}

export default async function AdminSystemPage() {
  const uploads = await checkUploadsDir();
  const database = await checkDatabase();

  const [
    repairCount,
    customerCount,
    deviceCount,
    leadCount,
    reminderCount,
    emailLogCount,
    uploadCount,
    quoteCount,
    changelogCount
  ] = await Promise.all([
    prisma.repairCase.count().catch(() => 0),
    prisma.customer.count().catch(() => 0),
    prisma.device.count().catch(() => 0),
    prisma.lead.count().catch(() => 0),
    prisma.reminder.count().catch(() => 0),
    prisma.emailLog.count().catch(() => 0),
    prisma.uploadedFile.count().catch(() => 0),
    prisma.quote.count().catch(() => 0),
    prisma.changelogEntry.count().catch(() => 0)
  ]);

  const smtpConfigured = Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD
  );

  const checks = [
    {
      label: "Database",
      ok: database.ok,
      detail: database.ok ? "Connected" : database.error || "Database error"
    },
    {
      label: "Uploads directory",
      ok: uploads.ok,
      detail: uploads.ok ? uploads.dir : uploads.error || uploads.dir
    },
    {
      label: "SMTP",
      ok: smtpConfigured,
      detail: smtpConfigured ? "Configured" : "Not configured - emails will be logged as SKIPPED"
    },
    {
      label: "Admin protection",
      ok: true,
      detail: "Protected externally by Caddy basic auth on dev domain"
    }
  ];

  const envRows = [
    ["Project version", process.env.npm_package_version || "0.1.0-dev"],
    ["Node environment", process.env.NODE_ENV || "unknown"],
    ["Hostname", os.hostname()],
    ["Platform", `${os.platform()} ${os.arch()}`],
    ["Public site URL", process.env.NEXT_PUBLIC_SITE_URL || "Not set"],
    ["Uploads dir", uploads.dir],
    ["Max upload MB", process.env.MAX_UPLOAD_MB || "10"],
    ["Admin email", process.env.ADMIN_EMAIL || "gianig@gmail.com"],
    ["Public email", process.env.PUBLIC_CONTACT_EMAIL || "contact@pentrunoi.ro"],
    ["SMTP host", mask(process.env.SMTP_HOST)],
    ["SMTP user", mask(process.env.SMTP_USER)]
  ];

  const countRows = [
    ["Repair cases", repairCount],
    ["Customers", customerCount],
    ["Devices", deviceCount],
    ["Leads", leadCount],
    ["Reminders", reminderCount],
    ["Email logs", emailLogCount],
    ["Uploaded files", uploadCount],
    ["Quotes / devize", quoteCount],
    ["Changelog entries", changelogCount]
  ];

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
          System health
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Operational overview for the dev platform before production migration.
          This page does not expose secrets.
        </p>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {checks.map((check) => (
          <article key={check.label} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold text-slate-950">{check.label}</h2>
              <span className={statusBadge(check.ok)}>{check.ok ? "OK" : "Check"}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{check.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Environment</h2>

          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                {envRows.map(([key, value]) => (
                  <tr key={key} className="border-b border-slate-100 last:border-0">
                    <th className="w-1/3 bg-slate-50 p-3 font-medium text-slate-700">
                      {key}
                    </th>
                    <td className="p-3 text-slate-800">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Database counts</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {countRows.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Migration reminders</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
          <p>Set NEXT_PUBLIC_SITE_URL to https://pentrunoi.ro before production launch.</p>
          <p>Keep dev.pentrunoi.ro noindexed and blocked in robots.</p>
          <p>Back up PostgreSQL database before moving VPS.</p>
          <p>Back up uploads volume before moving VPS.</p>
          <p>Move .env privately. Never commit production secrets.</p>
          <p>Confirm SMTP before enabling real outgoing emails.</p>
        </div>
      </section>
    </main>
  );
}
