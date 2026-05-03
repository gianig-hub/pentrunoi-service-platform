import { LegalPage } from "@/components/LegalPage";
import { getSiteSettings } from "@/lib/site-settings";

export default async function WarrantyPage() {
  const settings = await getSiteSettings();

  return (
    <LegalPage
      title="Garanție service"
      intro="Această pagină stabilește cadrul pentru garanția lucrărilor service."
      sections={[
        {
          title: "Garanție pentru manoperă",
          body: [
            `Perioada de garanție pentru manoperă: ${settings.labour_warranty}.`,
            "Garanția se aplică doar lucrării efectuate și problemei confirmate în fișa de service."
          ]
        },
        {
          title: "Garanție pentru piese",
          body: [
            `Condiții garanție piese: ${settings.parts_warranty}.`,
            "Piesele noi, second-hand sau recondiționate pot avea condiții diferite de garanție.",
            "Condițiile exacte trebuie comunicate clientului înainte de aprobarea lucrării."
          ]
        },
        {
          title: "Excluderi",
          body: [
            "Garanția poate fi limitată sau exclusă în cazuri precum lichide, lovituri, intervenții neautorizate ulterioare, defecte multiple sau probleme nedeclarate inițial.",
            "Recuperarea de date nu poate garanta recuperarea completă a tuturor fișierelor."
          ]
        }
      ]}
    />
  );
}
