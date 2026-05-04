import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

function formatAmount(amount: Prisma.Decimal | null, currency: string) {
  if (!amount) {
    return "Fără sumă";
  }

  return `${amount.toString()} ${currency}`;
}

function quoteStatus(quote: {
  approvedAt: Date | null;
  rejectedAt: Date | null;
}) {
  if (quote.approvedAt) return "Aprobat";
  if (quote.rejectedAt) return "Respins";
  return "În așteptare";
}

function quoteTone(quote: {
  approvedAt: Date | null;
  rejectedAt: Date | null;
}) {
  if (quote.approvedAt) return "bg-emerald-50 text-emerald-800";
  if (quote.rejectedAt) return "bg-red-50 text-red-800";
  return "bg-amber-50 text-amber-800";
}

export default async function RepairQuotesPage({ params }: PageProps) {
  const { id } = await params;

  const repair = await prisma.repairCase.findFirst({
    where: {
      OR: [{ id }, { trackingId: id }]
    },
    include: {
      customer: true,
      device: true,
      quotes: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!repair) {
    notFound();
  }

  const repairId = repair.id;
  const repairTrackingId = repair.trackingId;

  async function createQuote(formData: FormData) {
    "use server";

    const amountRaw = textValue(formData, "amount");
    const currency = textValue(formData, "currency") || "RON";
    const description = textValue(formData, "description");
    const publicNote = textValue(formData, "publicNote");

    if (!description) {
      throw new Error("Description is required.");
    }

    const amount = amountRaw ? new Prisma.Decimal(amountRaw) : null;

    await prisma.quote.create({
      data: {
        repairCaseId: repairId,
        amount,
        currency,
        description
      }
    });

    await prisma.repairCase.update({
      where: {
        id: repairId
      },
      data: {
        status: "QUOTE_SENT",
        publicNotes:
          publicNote ||
          "Devizul a fost pregătit și trimis pentru verificare.",
        statusUpdates: {
          create: {
            status: "QUOTE_SENT",
            isPublic: true,
            publicNote:
              publicNote ||
              "Devizul a fost pregătit și este disponibil pe pagina de status."
          }
        }
      }
    });

    await prisma.changelogEntry.create({
      data: {
        version: "0.1.0-dev",
        type: "FEATURE",
        module: "Quotes",
        title: `Quote created: ${repairTrackingId}`,
        description: `A quote/deviz was created for repair case ${repairTrackingId}.`,
        status: "DONE"
      }
    });

    revalidatePath(`/admin/repairs/${repairTrackingId}`);
    revalidatePath(`/admin/repairs/${repairTrackingId}/quotes`);
    revalidatePath(`/status/${repairTrackingId}`);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Link href={`/admin/repairs/${repair.trackingId}`} className="text-sm font-medium text-slate-600">
        ← Back to repair case
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Deviz / Quote
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Devize pentru {repair.trackingId}
          </h1>
          <p className="mt-3 max-w-3xl text-slate-700">
            Creează devize pentru client. Ultimul deviz este afișat pe pagina publică de status.
            Clientul poate aproba sau refuza devizul online.
          </p>
        </div>

        <Link
          href={`/status/${repair.trackingId}`}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950"
        >
          Vezi status public
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-950">Creează deviz</h2>

          <form action={createQuote} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
                  Sumă
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 250"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-slate-700">
                  Monedă
                </label>
                <select
                  id="currency"
                  name="currency"
                  defaultValue="RON"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  <option value="RON">RON</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                Descriere deviz *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={7}
                placeholder="Ex: Curățare internă, verificare temperaturi, schimb pastă termoconductoare, testare finală."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="publicNote" className="block text-sm font-medium text-slate-700">
                Notă publică status
              </label>
              <textarea
                id="publicNote"
                name="publicNote"
                rows={3}
                placeholder="Ex: Devizul a fost pregătit. Așteptăm confirmarea clientului."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Salvează deviz
            </button>
          </form>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">Client</h2>
            <p className="mt-3 font-medium">{repair.customer?.name || "N/A"}</p>
            <p className="text-sm text-slate-600">{repair.customer?.email || ""}</p>
            <p className="text-sm text-slate-600">{repair.customer?.phone || ""}</p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">Echipament</h2>
            <p className="mt-3">{repair.device?.type || "N/A"}</p>
            <p className="text-sm text-slate-600">
              {[repair.device?.brand, repair.device?.model].filter(Boolean).join(" ") || "N/A"}
            </p>
            {repair.device?.serialNumber ? (
              <p className="mt-2 text-xs text-slate-500">SN: {repair.device.serialNumber}</p>
            ) : null}
          </section>

          <section className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
            <h2 className="font-semibold">Flux deviz</h2>
            <ol className="mt-4 space-y-3 text-sm text-slate-300">
              <li>1. Creezi devizul în admin.</li>
              <li>2. Clientul îl vede pe pagina de status.</li>
              <li>3. Clientul aprobă sau refuză online.</li>
              <li>4. Statusul reparației se actualizează automat.</li>
            </ol>
          </section>
        </aside>
      </div>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Devize existente</h2>

        {repair.quotes.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">Nu există devize încă.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {repair.quotes.map((quote) => (
              <article key={quote.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-bold text-slate-950">
                      {formatAmount(quote.amount, quote.currency)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Creat: {formatDate(quote.createdAt)}
                    </p>
                  </div>

                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${quoteTone(quote)}`}>
                    {quoteStatus(quote)}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {quote.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/admin/repairs/${repair.trackingId}/quotes/${quote.id}/print`}
                    className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Print / Save PDF
                  </Link>

                  <Link
                    href={`/status/${repair.trackingId}`}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-950"
                  >
                    Status public
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
