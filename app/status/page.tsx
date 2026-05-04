import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verifică status cerere",
  description:
    "Verifică statusul unei reparații sau cereri folosind codul unic de tracking primit."
};

function cleanTrackingCode(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toUpperCase();
}

async function lookupStatus(formData: FormData) {
  "use server";

  const trackingId = cleanTrackingCode(formData.get("trackingId"));

  if (!trackingId) {
    redirect("/status");
  }

  redirect(`/status/${encodeURIComponent(trackingId)}`);
}

export default function StatusLookupPage() {
  return (
    <main>
      <section className="bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Status tracking
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Verifică statusul unei reparații sau cereri.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Introdu codul primit după trimiterea formularului. Nu ai nevoie de cont client.
            Codurile pot începe cu REP, WEB, IT sau NET.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <form action={lookupStatus} className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <label htmlFor="trackingId" className="block text-sm font-semibold text-slate-950">
                Cod tracking
              </label>
              <input
                id="trackingId"
                name="trackingId"
                required
                placeholder="Ex: REP-2026-XXXXX"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-lg font-semibold uppercase tracking-wide outline-none focus:border-slate-950"
              />
            </div>

            <button
              type="submit"
              className="self-end rounded-xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white"
            >
              Verifică status
            </button>
          </form>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["REP", "Reparații laptop/calculator"],
              ["WEB", "Proiecte web și aplicații"],
              ["IT", "Suport IT firme"],
              ["NET", "Conectivitate business"]
            ].map(([prefix, label]) => (
              <div key={prefix} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-lg font-bold text-slate-950">{prefix}</p>
                <p className="mt-1 text-sm text-slate-600">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            Această pagină afișează doar informații publice despre status. Datele personale,
            notele interne, telefonul, adresa și detaliile sensibile nu sunt afișate.
          </div>
        </div>
      </section>
    </main>
  );
}
