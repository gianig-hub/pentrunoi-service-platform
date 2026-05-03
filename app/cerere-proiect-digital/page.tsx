import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateTrackingId } from "@/lib/tracking";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

async function createDigitalProjectLead(formData: FormData) {
  "use server";

  const name = value(formData, "name");
  const email = value(formData, "email");
  const companyName = value(formData, "companyName");
  const projectUrl = value(formData, "projectUrl");
  const projectType = value(formData, "projectType");
  const budgetRange = value(formData, "budgetRange");
  const deadline = value(formData, "deadline");
  const message = value(formData, "message");

  if (!name || !email || !projectType || !message) {
    throw new Error("Name, email, project type and message are required.");
  }

  let trackingId = generateTrackingId("WEB");

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const existing = await prisma.lead.findUnique({
      where: { trackingId }
    });

    if (!existing) {
      break;
    }

    trackingId = generateTrackingId("WEB");
  }

  const lead = await prisma.lead.create({
    data: {
      trackingId,
      type: "DIGITAL_PROJECT",
      status: "NEW",
      name,
      email,
      companyName: companyName || null,
      projectUrl: projectUrl || null,
      message,
      publicNotes: "Cererea pentru proiect digital a fost primită și va fi analizată.",
      metadata: {
        projectType,
        budgetRange,
        deadline
      }
    }
  });

  await prisma.changelogEntry.create({
    data: {
      version: "0.1.0-dev",
      type: "FEATURE",
      module: "Leads",
      title: `Digital project lead created: ${lead.trackingId}`,
      description: `A new digital project request was created with tracking ID ${lead.trackingId}.`,
      status: "DONE"
    }
  });

  redirect(`/status/${lead.trackingId}`);
}

export default function DigitalProjectRequestPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Cerere proiect digital
      </p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        Trimite detalii pentru website, aplicație web sau mobile app
      </h1>

      <p className="mt-4 max-w-3xl text-slate-700">
        Completează formularul pentru site de prezentare, magazin online, aplicație web,
        marketplace, mobile app, PWA sau sistem intern pentru firmă. Vei primi un cod unic
        de tracking, fără cont client.
      </p>

      <form action={createDigitalProjectLead} className="mt-8 space-y-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Nume *
            </label>
            <input id="name" name="name" required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email *
            </label>
            <input id="email" name="email" type="email" required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">
              Firmă
            </label>
            <input id="companyName" name="companyName" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>

          <div>
            <label htmlFor="projectUrl" className="block text-sm font-medium text-slate-700">
              Website existent
            </label>
            <input id="projectUrl" name="projectUrl" placeholder="https://..." className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>

          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-slate-700">
              Tip proiect *
            </label>
            <select id="projectType" name="projectType" required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
              <option value="">Alege tipul</option>
              <option value="Site prezentare">Site prezentare</option>
              <option value="Magazin online">Magazin online</option>
              <option value="Aplicație web">Aplicație web</option>
              <option value="Mobile app / PWA">Mobile app / PWA</option>
              <option value="Marketplace">Marketplace</option>
              <option value="Sistem intern firmă">Sistem intern firmă</option>
              <option value="Mentenanță website">Mentenanță website</option>
              <option value="Nu sunt sigur">Nu sunt sigur</option>
            </select>
          </div>

          <div>
            <label htmlFor="budgetRange" className="block text-sm font-medium text-slate-700">
              Buget orientativ
            </label>
            <select id="budgetRange" name="budgetRange" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
              <option value="">Alege opțional</option>
              <option value="Sub 500 EUR">Sub 500 EUR</option>
              <option value="500-1000 EUR">500-1000 EUR</option>
              <option value="1000-2500 EUR">1000-2500 EUR</option>
              <option value="2500+ EUR">2500+ EUR</option>
              <option value="Nu știu încă">Nu știu încă</option>
            </select>
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-slate-700">
              Termen dorit
            </label>
            <input id="deadline" name="deadline" placeholder="Ex: 2-4 săptămâni" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700">
            Descriere proiect *
          </label>
          <textarea id="message" name="message" required rows={7} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
        </div>

        <label className="flex gap-3 text-sm text-slate-700">
          <input type="checkbox" required className="mt-1" />
          Confirm că informațiile sunt corecte și sunt de acord să fiu contactat pe email pentru această cerere.
        </label>

        <button type="submit" className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
          Trimite cererea
        </button>
      </form>
    </main>
  );
}
