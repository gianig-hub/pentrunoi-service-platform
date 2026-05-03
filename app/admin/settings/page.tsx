import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { defaultSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

const fields = [
  {
    key: "company_name",
    label: "Denumire companie",
    group: "company",
    type: "text"
  },
  {
    key: "company_cui",
    label: "CUI",
    group: "company",
    type: "text"
  },
  {
    key: "company_reg_com",
    label: "Nr. Registrul Comerțului",
    group: "company",
    type: "text"
  },
  {
    key: "company_euid",
    label: "EUID",
    group: "company",
    type: "text"
  },
  {
    key: "registered_address",
    label: "Sediu social",
    group: "company",
    type: "textarea"
  },
  {
    key: "public_email",
    label: "Email public",
    group: "contact",
    type: "text"
  },
  {
    key: "admin_email",
    label: "Email admin",
    group: "contact",
    type: "text"
  },
  {
    key: "legal_phone_placeholder",
    label: "Telefon legal / placeholder editabil",
    group: "contact",
    type: "text"
  },
  {
    key: "vat_status",
    label: "Status TVA",
    group: "legal",
    type: "text"
  },
  {
    key: "labour_warranty",
    label: "Garanție manoperă",
    group: "warranty",
    type: "text"
  },
  {
    key: "parts_warranty",
    label: "Garanție piese",
    group: "warranty",
    type: "text"
  },
  {
    key: "courier_return_policy",
    label: "Politică retur curier",
    group: "courier",
    type: "textarea"
  },
  {
    key: "abandoned_device_policy",
    label: "Politică echipamente neridicate",
    group: "legal",
    type: "textarea"
  },
  {
    key: "data_backup_warning",
    label: "Avertizare backup date",
    group: "legal",
    type: "textarea"
  },
  {
    key: "no_phone_cta_note",
    label: "Notă no phone CTA",
    group: "contact",
    type: "textarea"
  }
];

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function saveSettings(formData: FormData) {
  "use server";

  for (const field of fields) {
    const value = textValue(formData, field.key);

    await prisma.siteSetting.upsert({
      where: {
        key: field.key
      },
      update: {
        value,
        group: field.group,
        isPublic: true
      },
      create: {
        key: field.key,
        value,
        group: field.group,
        isPublic: true
      }
    });
  }

  await prisma.changelogEntry.create({
    data: {
      version: "0.1.0-dev",
      type: "ADMIN",
      module: "Settings",
      title: "Site settings updated",
      description:
        "Company, legal, contact, warranty and policy settings were updated from admin.",
      status: "DONE"
    }
  });

  revalidatePath("/admin/settings");
  revalidatePath("/informatii-legale");
  revalidatePath("/garantie-service");
  revalidatePath("/reparatii-prin-curier-termeni");
  revalidatePath("/termeni-si-conditii");
}

export default async function AdminSettingsPage() {
  const rows = await prisma.siteSetting.findMany();
  const values = { ...defaultSiteSettings };

  for (const row of rows) {
    values[row.key] = row.value || "";
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/admin" className="text-sm font-medium text-slate-600">
        ← Back to admin
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Site settings
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Editează datele companiei, emailurile, placeholder-ul pentru telefon,
          garanțiile, termenii de curier și textele legale importante.
        </p>
      </div>

      <form action={saveSettings} className="mt-8 space-y-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          Aceste setări sunt pentru versiunea de dezvoltare. Înainte de producție,
          verifică toate datele companiei, garanțiile, termenii și obligațiile legale.
        </div>

        {fields.map((field) => (
          <div key={field.key} className="rounded-2xl bg-white p-6 shadow-sm">
            <label htmlFor={field.key} className="block text-sm font-semibold text-slate-950">
              {field.label}
            </label>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
              {field.group} / {field.key}
            </p>

            {field.type === "textarea" ? (
              <textarea
                id={field.key}
                name={field.key}
                rows={4}
                defaultValue={values[field.key] || ""}
                className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-slate-900"
              />
            ) : (
              <input
                id={field.key}
                name={field.key}
                defaultValue={values[field.key] || ""}
                className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-slate-900"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
        >
          Salvează setările
        </button>
      </form>
    </main>
  );
}
