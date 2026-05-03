import { prisma } from "@/lib/prisma";

export type SettingsMap = Record<string, string>;

export const defaultSiteSettings: SettingsMap = {
  company_name: "SERVICE LAPTOP GIANI S.R.L.",
  company_cui: "43422556",
  company_reg_com: "J29/2332/2020",
  company_euid: "ROONRC.J29/2332/2020",
  registered_address: "Ploiești, Str. Văleni, Nr. 67, Et. Parter, județ Prahova",
  public_email: "contact@pentrunoi.ro",
  admin_email: "gianig@gmail.com",
  legal_phone_placeholder: "[opțional / de completat dacă este necesar legal]",
  vat_status: "[de completat]",
  labour_warranty: "[de completat: ex. 30-90 zile]",
  parts_warranty: "[în funcție de piesă / furnizor]",
  courier_return_policy: "[de completat înainte de producție]",
  abandoned_device_policy: "[de completat înainte de producție]",
  data_backup_warning:
    "Recomandăm backup pentru datele importante înainte de predarea echipamentului, dacă este posibil.",
  no_phone_cta_note:
    "Contactul principal pe paginile de marketing se face prin formulare, fără telefon ca principal call-to-action."
};

export async function getSiteSettings() {
  try {
    const rows = await prisma.siteSetting.findMany();
    const settings: SettingsMap = { ...defaultSiteSettings };

    for (const row of rows) {
      if (row.value !== null && row.value !== undefined) {
        settings[row.key] = row.value;
      }
    }

    return settings;
  } catch {
    return { ...defaultSiteSettings };
  }
}
