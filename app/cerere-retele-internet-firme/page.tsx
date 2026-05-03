import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateTrackingId } from "@/lib/tracking";
import { sendEmail, getAdminEmail } from "@/lib/email";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

async function createConnectivityLead(formData: FormData) {
  "use server";

  const name = value(formData, "name");
  const email = value(formData, "email");
  const companyName = value(formData, "companyName");
  const location = value(formData, "location");
  const currentProvider = value(formData, "currentProvider");
  const locationType = value(formData, "locationType");
  const problemType = value(formData, "problemType");
  const usersDevices = value(formData, "usersDevices");
  const message = value(formData, "message");

  if (!name || !email || !companyName || !location || !problemType || !message) {
    throw new Error("Name, email, company, location, problem type and message are required.");
  }

  let trackingId = generateTrackingId("NET");

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const existing = await prisma.lead.findUnique({
      where: { trackingId }
    });

    if (!existing) {
      break;
    }

    trackingId = generateTrackingId("NET");
  }

  const lead = await prisma.lead.create({
    data: {
      trackingId,
      type: "CONNECTIVITY",
      status: "NEW",
      name,
      email,
      companyName,
      location,
      message,
      publicNotes: "Cererea pentru conectivitate business a fost primită și va fi analizată.",
      metadata: {
        currentProvider,
        locationType,
        problemType,
        usersDevices
      }
    }
  });

  await prisma.changelogEntry.create({
    data: {
      version: "0.1.0-dev",
      type: "FEATURE",
      module: "Leads",
      title: `Connectivity lead created: ${lead.trackingId}`,
      description: `A new connectivity/network request was created with tracking ID ${lead.trackingId}.`,
      status: "DONE"
    }
  });

  const statusUrl = `/status/${lead.trackingId}`;

  await sendEmail({
    to: email,
    subject: `Cerere conectivitate business primită - ${lead.trackingId}`,
    text: [
      `Bună, ${name},`,
      "",
      "Cererea ta a fost primită.",
      `Cod tracking: ${lead.trackingId}`,
      `Status online: ${statusUrl}`,
      "",
      "Poți urmări statusul folosind codul primit, fără cont client.",
      "",
      "Pentrunoi.ro"
    ].join("\\n")
  });

  await sendEmail({
    to: getAdminEmail(),
    replyTo: email,
    subject: `Connectivity lead nou - ${lead.trackingId}`,
    text: [
      "Lead nou.",
      `Tracking: ${lead.trackingId}`,
      `Tip: Connectivity`,
      `Client: ${name}`,
      `Email: ${email}`,
      `Firmă: ${companyName || "N/A"}`,
      "",
      "Mesaj:",
      message
    ].join("\\n")
  });

  redirect(statusUrl);
}

export default function ConnectivityRequestPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Cerere conectivitate business
      </p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        Trimite o cerere pentru internet backup, rețele sau Wi-Fi business
      </h1>

      <p className="mt-4 max-w-3xl text-slate-700">
        Pentru firme în zone cu semnal slab, birouri, depozite, pensiuni, ateliere sau locații
        unde este nevoie de routere, Wi-Fi, backup internet, dual WAN sau conectivitate mai stabilă.
      </p>

      <form action={createConnectivityLead} className="mt-8 space-y-6 rounded-2xl bg-white p-6 shadow-sm">
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
            <label htmlFor="location" className="block text-sm font-medium text-slate-700">Locație *</label>
            <input id="location" name="location" required placeholder="Localitate, județ, tip locație" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>

          <div>
            <label htmlFor="currentProvider" className="block text-sm font-medium text-slate-700">Provider actual</label>
            <input id="currentProvider" name="currentProvider" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>

          <div>
            <label htmlFor="locationType" className="block text-sm font-medium text-slate-700">Tip locație</label>
            <select id="locationType" name="locationType" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
              <option value="">Alege opțional</option>
              <option value="Birou">Birou</option>
              <option value="Depozit">Depozit</option>
              <option value="Pensiune / hotel">Pensiune / hotel</option>
              <option value="Fermă">Fermă</option>
              <option value="Atelier / service">Atelier / service</option>
              <option value="Magazin">Magazin</option>
              <option value="Șantier">Șantier</option>
              <option value="Altă locație">Altă locație</option>
            </select>
          </div>

          <div>
            <label htmlFor="problemType" className="block text-sm font-medium text-slate-700">Problemă principală *</label>
            <select id="problemType" name="problemType" required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
              <option value="">Alege problema</option>
              <option value="Semnal slab">Semnal slab</option>
              <option value="Internet instabil">Internet instabil</option>
              <option value="Lipsă fibră">Lipsă fibră</option>
              <option value="Backup internet">Backup internet</option>
              <option value="Wi-Fi slab">Wi-Fi slab</option>
              <option value="CCTV remote access">CCTV remote access</option>
              <option value="Router/firewall/VPN">Router/firewall/VPN</option>
            </select>
          </div>

          <div>
            <label htmlFor="usersDevices" className="block text-sm font-medium text-slate-700">Utilizatori/dispozitive</label>
            <input id="usersDevices" name="usersDevices" placeholder="Ex: 10 utilizatori, 20 camere, 5 PC-uri" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700">Descriere situație *</label>
          <textarea id="message" name="message" required rows={7} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
        </div>

        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          Notă: nu ne prezentăm ca furnizor de internet. Putem ajuta cu analiză, configurare,
          echipamente, routere, Wi-Fi, backup și conectivitate folosind operatori autorizați.
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
