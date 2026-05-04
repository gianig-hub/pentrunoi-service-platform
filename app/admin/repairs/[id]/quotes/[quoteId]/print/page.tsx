import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { PrintButton } from "@/components/PrintButton";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
    quoteId: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function money(amount: { toString: () => string } | null, currency: string) {
  if (!amount) return "Fără sumă";
  return `${amount.toString()} ${currency}`;
}

function quoteStatus(quote: {
  approvedAt: Date | null;
  rejectedAt: Date | null;
}) {
  if (quote.approvedAt) return "Aprobat";
  if (quote.rejectedAt) return "Respins";
  return "În așteptarea deciziei clientului";
}

export default async function QuotePrintPage({ params }: PageProps) {
  const { id, quoteId } = await params;
  const settings = await getSiteSettings();

  const quote = await prisma.quote.findUnique({
    where: {
      id: quoteId
    },
    include: {
      repairCase: {
        include: {
          customer: true,
          device: true
        }
      }
    }
  });

  if (!quote || !quote.repairCase) {
    notFound();
  }

  const repair = quote.repairCase;

  if (repair.id !== id && repair.trackingId !== id) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl bg-white px-6 py-10 text-slate-950 print:max-w-none print:px-0 print:py-0">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href={`/admin/repairs/${repair.trackingId}/quotes`} className="text-sm font-medium text-slate-600">
          ← Back to quotes
        </Link>
        <PrintButton />
      </div>

      <section className="border-b border-slate-300 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Image
              src="/logo-pentrunoi.png"
              alt="Pentrunoi.ro - Service Laptop Giani"
              width={220}
              height={50}
              priority
              className="h-auto w-[220px]"
            />
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Deviz service
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {repair.trackingId}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Deviz generat: {formatDate(quote.createdAt)}
            </p>
          </div>

          <div className="text-right text-sm">
            <p className="font-semibold">{settings.company_name}</p>
            <p>{settings.company_cui ? `CUI: ${settings.company_cui}` : ""}</p>
            <p>{settings.company_reg_com ? `Reg. Com.: ${settings.company_reg_com}` : ""}</p>
            <p>{settings.public_email}</p>
            <p>{settings.registered_address}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
          <h2 className="text-lg font-semibold">Client</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">Nume</dt>
              <dd className="font-medium">{repair.customer?.name || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd>{repair.customer?.email || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Telefon</dt>
              <dd>{repair.customer?.phone || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Locație</dt>
              <dd>
                {[repair.customer?.city, repair.customer?.county].filter(Boolean).join(", ") || "N/A"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
          <h2 className="text-lg font-semibold">Echipament</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">Tip</dt>
              <dd className="font-medium">{repair.device?.type || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Brand / Model</dt>
              <dd>
                {[repair.device?.brand, repair.device?.model].filter(Boolean).join(" ") || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Serial number</dt>
              <dd>{repair.device?.serialNumber || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Cod tracking</dt>
              <dd className="font-medium">{repair.trackingId}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 p-6 print:break-inside-avoid">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Valoare deviz</h2>
            <p className="mt-2 text-sm text-slate-600">Monedă: {quote.currency}</p>
          </div>
          <p className="text-3xl font-bold">{money(quote.amount, quote.currency)}</p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 p-6 print:break-inside-avoid">
        <h2 className="text-lg font-semibold">Descriere deviz</h2>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7">{quote.description}</p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
          <h2 className="text-lg font-semibold">Status deviz</h2>
          <p className="mt-4 text-sm font-medium">{quoteStatus(quote)}</p>
          {quote.approvedAt ? (
            <p className="mt-2 text-sm text-slate-600">Aprobat la: {formatDate(quote.approvedAt)}</p>
          ) : null}
          {quote.rejectedAt ? (
            <p className="mt-2 text-sm text-slate-600">Respins la: {formatDate(quote.rejectedAt)}</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-slate-200 p-5 print:break-inside-avoid">
          <h2 className="text-lg font-semibold">Aprobare client</h2>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Clientul poate aproba sau refuza devizul online din pagina publică de status:
          </p>
          <p className="mt-3 break-all text-sm font-medium">
            /status/{repair.trackingId}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 print:break-inside-avoid">
        <h2 className="font-semibold">Observații importante</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Devizul este estimativ până la confirmarea finală a pieselor și intervenției.</li>
          <li>Reparația se efectuează după aprobarea clientului, dacă aprobarea este necesară.</li>
          <li>{settings.data_backup_warning}</li>
          <li>Garanție manoperă: {settings.labour_warranty}</li>
          <li>Garanție piese: {settings.parts_warranty}</li>
        </ul>
      </section>

      <section className="mt-10 grid gap-8 border-t border-slate-300 pt-8 text-sm md:grid-cols-2">
        <div>
          <p className="font-semibold">Semnătură service</p>
          <div className="mt-10 border-t border-slate-300 pt-2 text-slate-500">
            Nume / semnătură
          </div>
        </div>

        <div>
          <p className="font-semibold">Semnătură client</p>
          <div className="mt-10 border-t border-slate-300 pt-2 text-slate-500">
            Nume / semnătură
          </div>
        </div>
      </section>

      <p className="mt-8 text-xs text-slate-500">
        Document generat din admin pentrunoi.ro. Pentru status online: /status/{repair.trackingId}
      </p>
    </main>
  );
}
