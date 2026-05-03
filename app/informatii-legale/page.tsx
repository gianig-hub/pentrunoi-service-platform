import { LegalPage } from "@/components/LegalPage";
import { getSiteSettings } from "@/lib/site-settings";

export default async function LegalInfoPage() {
  const settings = await getSiteSettings();

  return (
    <LegalPage
      title="Informații legale"
      intro="Datele de mai jos sunt pregătite pentru identificarea furnizorului serviciilor pentrunoi.ro."
      sections={[
        {
          title: "Date companie",
          body: [
            `Denumire: ${settings.company_name}.`,
            `CUI: ${settings.company_cui}.`,
            `Nr. Registrul Comerțului: ${settings.company_reg_com}.`,
            `EUID: ${settings.company_euid}.`,
            `Sediu social: ${settings.registered_address}.`,
            `Email public: ${settings.public_email}.`,
            `Telefon: ${settings.legal_phone_placeholder}.`,
            `Status TVA: ${settings.vat_status}.`
          ]
        },
        {
          title: "Contact principal",
          body: [
            "Pentru proiectul nou, contactul principal se face prin formularele disponibile pe website.",
            settings.no_phone_cta_note
          ]
        },
        {
          title: "Observație",
          body: [
            "Datele trebuie verificate cu documentele oficiale ale firmei înainte de lansarea publică finală."
          ]
        }
      ]}
    />
  );
}
