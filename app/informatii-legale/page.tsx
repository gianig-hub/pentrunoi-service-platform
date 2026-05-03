import { LegalPage } from "@/components/LegalPage";

export default function LegalInfoPage() {
  return (
    <LegalPage
      title="Informații legale"
      intro="Datele de mai jos sunt pregătite pentru identificarea furnizorului serviciilor pentrunoi.ro."
      sections={[
        {
          title: "Date companie",
          body: [
            "Denumire: SERVICE LAPTOP GIANI S.R.L.",
            "CUI: 43422556.",
            "Nr. Registrul Comerțului: J29/2332/2020.",
            "EUID: ROONRC.J29/2332/2020.",
            "Sediu social: Ploiești, Str. Văleni, Nr. 67, Et. Parter, județ Prahova.",
            "Email public: contact@pentrunoi.ro.",
            "Telefon: [opțional / de completat dacă este necesar legal]."
          ]
        },
        {
          title: "Contact principal",
          body: [
            "Pentru proiectul nou, contactul principal se face prin formularele disponibile pe website.",
            "Nu folosim telefonul ca principal call-to-action pe paginile de marketing."
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
