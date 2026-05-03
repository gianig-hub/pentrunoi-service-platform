import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateTrackingId } from "@/lib/tracking";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

async function createRepairRequest(formData: FormData) {
  "use server";

  const name = value(formData, "name");
  const email = value(formData, "email");
  const phone = value(formData, "phone");
  const city = value(formData, "city");
  const county = value(formData, "county");
  const deviceType = value(formData, "deviceType");
  const brand = value(formData, "brand");
  const model = value(formData, "model");
  const serialNumber = value(formData, "serialNumber");
  const issueReported = value(formData, "issueReported");
  const courierRequested = value(formData, "courierRequested");

  if (!name || !email || !deviceType || !issueReported) {
    throw new Error("Name, email, device type and problem description are required.");
  }

  let trackingId = generateTrackingId("REP");

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const existing = await prisma.repairCase.findUnique({
      where: { trackingId }
    });

    if (!existing) {
      break;
    }

    trackingId = generateTrackingId("REP");
  }

  const customer = await prisma.customer.create({
    data: {
      name,
      email,
      phone: phone || null,
      city: city || null,
      county: county || null
    }
  });

  const device = await prisma.device.create({
    data: {
      customerId: customer.id,
      type: deviceType,
      brand: brand || null,
      model: model || null,
      serialNumber: serialNumber || null
    }
  });

  const repairCase = await prisma.repairCase.create({
    data: {
      trackingId,
      customerId: customer.id,
      deviceId: device.id,
      issueReported,
      publicNotes:
        courierRequested === "yes"
          ? "Cererea a fost primită. Următorul pas este organizarea trimiterii echipamentului prin curier."
          : "Cererea a fost primită. Următorul pas este verificarea detaliilor și confirmarea recepției echipamentului.",
      internalNotes: courierRequested === "yes" ? "Client requested courier repair flow." : null,
      statusUpdates: {
        create: {
          status: "REQUEST_RECEIVED",
          isPublic: true,
          publicNote: "Cererea a fost înregistrată în sistem."
        }
      }
    }
  });

  redirect(`/status/${repairCase.trackingId}`);
}

export default function RepairRequestPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/" className="text-sm font-medium text-slate-600">
        ← Înapoi la prima pagină
      </Link>

      <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Cerere service
      </p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        Trimite o cerere pentru reparație laptop sau calculator
      </h1>

      <p className="mt-4 max-w-3xl text-slate-700">
        Completează formularul, iar sistemul va genera un cod unic de tracking.
        Nu ai nevoie de cont client. Vei putea urmări statusul lucrării pe pagina /status.
      </p>

      <form action={createRepairRequest} className="mt-8 space-y-8 rounded-2xl bg-white p-6 shadow-sm">
        <section>
          <h2 className="text-lg font-semibold text-slate-950">Date client</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Nume *
              </label>
              <input
                id="name"
                name="name"
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                Telefon opțional
              </label>
              <input
                id="phone"
                name="phone"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-700">
                Oraș
              </label>
              <input
                id="city"
                name="city"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label htmlFor="county" className="block text-sm font-medium text-slate-700">
                Județ
              </label>
              <input
                id="county"
                name="county"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-950">Echipament</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="deviceType" className="block text-sm font-medium text-slate-700">
                Tip echipament *
              </label>
              <select
                id="deviceType"
                name="deviceType"
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              >
                <option value="">Alege tipul</option>
                <option value="Laptop">Laptop</option>
                <option value="Calculator PC">Calculator PC</option>
                <option value="All-in-One">All-in-One</option>
                <option value="Alt echipament">Alt echipament</option>
              </select>
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-slate-700">
                Brand
              </label>
              <input
                id="brand"
                name="brand"
                placeholder="Dell, HP, Lenovo, Asus..."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-slate-700">
                Model
              </label>
              <input
                id="model"
                name="model"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-slate-700">
                Serie / SN opțional
              </label>
              <input
                id="serialNumber"
                name="serialNumber"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-950">Problema raportată</h2>

          <div className="mt-4">
            <label htmlFor="issueReported" className="block text-sm font-medium text-slate-700">
              Descrie problema *
            </label>
            <textarea
              id="issueReported"
              name="issueReported"
              required
              rows={6}
              placeholder="Exemplu: laptopul se încălzește, nu pornește, merge greu, ecran spart..."
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <label className="flex gap-3 text-sm text-slate-700">
              <input type="checkbox" name="courierRequested" value="yes" className="mt-1" />
              Vreau să trimit echipamentul prin curier.
            </label>
          </div>

          <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            Recomandare: înainte de predarea echipamentului, fă backup la datele importante
            dacă este posibil. Pentru recuperare date, menționează clar acest lucru în descriere.
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 p-4">
          <label className="flex gap-3 text-sm text-slate-700">
            <input type="checkbox" name="consent" required className="mt-1" />
            Confirm că informațiile trimise sunt corecte și sunt de acord să fiu contactat
            pe email pentru această cerere.
          </label>
        </section>

        <button
          type="submit"
          className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
        >
          Trimite cererea
        </button>
      </form>
    </main>
  );
}
