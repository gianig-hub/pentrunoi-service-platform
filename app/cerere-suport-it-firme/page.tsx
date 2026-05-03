import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateTrackingId } from "@/lib/tracking";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

async function createBusinessItLead(formData: FormData) {
  "use server";

  const name = value(formData, "name");
  const email = value(formData, "email");
  const companyName = value(formData, "companyName");
  const location = value(formData, "location");
  const deviceCount = value(formData, "deviceCount");
  const requestType = value(formData, "requestType");
  const urgency = value(formData, "urgency");
  const message = value(formData, "message");

  if (!name || !email || !companyName || !requestType || !message) {
    throw new Error("Name, email, company, request type and message are required.");
  }

  let trackingId = generateTrackingId("IT");

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const existing = await prisma.lead.findUnique({
      where: { trackingId }
    });

    if (!existing) {
      break;
    }

    trackingId = generateTrackingId("IT");
  }

  const lead = await prisma.lead.create({
    data: {
      trackingId,
      type: "BUSINESS_IT",
      status: "NEW",
      name,
      email,
      companyName,
      location: location || null,
      message,
      publicNotes: "Cererea pentru suport IT business a fost primită și va fi analizată.",
      metadata: {
        deviceCount,
        requestType,
        urgency
      }
    }
  });

  await prisma.changelogEntry.create({
    data: {
      version: "0.1.0-dev",
      type: "FEATURE",
      module: "Leads",
      title: `Business IT lead created: ${lead.trackingId}`,
      description: `A new business IT request was created with tracking ID ${lead.trackingId}.`,
      status: "DONE"
    }
  });

  redirect(`/status/${lead.trackingId}`);
}

export default function BusinessItRequestPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Cerere suport IT firme
      </p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        Trimite o cerere pentru suport IT business
      </h1>

      <p className="mt-4 max-w-3xl text-slate-700">
        Folosește formularul pentru mentenanță calculatoare, rețea, backup, email business,
        routere, Wi-Fi, suport remote sau probleme tehnice într-o firmă.
      </p>

      <form action={createBusinessItLead} className="mt-8 space-y-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nume contact *</label>
            <input id="name" name="name" required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email *</label>
            <input id="email" name="email" type="email" required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">Firmă *</label>
            <input id="companyName" name="companyName" required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700">Localitate / județ</label>
            <input id="location" name="location" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>

          <div>
            <label htmlFor="deviceCount" className="block text-sm font-medium text-slate-700">Număr aproximativ echipamente</label>
            <input id="deviceCount" name="deviceCount" placeholder="Ex: 3 laptopuri, 2 PC-uri" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>

          <div>
            <label htmlFor="requestType" className="block text-sm font-medium text-slate-700">Tip cerere *</label>
            <select id="requestType" name="requestType" required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
              <option value="">Alege tipul</option>
              <option value="Mentenanță calculatoare">Mentenanță calculatoare</option>
              <option value="Rețea/Wi-Fi">Rețea/Wi-Fi</option>
              <option value="Backup date">Backup date</option>
              <option value="Email business">Email business</option>
              <option value="Suport remote">Suport remote</option>
              <option value="Abonament mentenanță">Abonament mentenanță</option>
              <option value="Altă problemă">Altă problemă</option>
            </select>
          </div>

          <div>
            <label htmlFor="urgency" className="block text-sm font-medium text-slate-700">Urgență</label>
            <select id="urgency" name="urgency" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Planificat">Planificat</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700">Descriere problemă *</label>
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
