import { LegalPage } from "@/components/LegalPage";

export default function WarrantyPage() {
  return (
    <LegalPage
      title="Garanție service"
      intro="Această pagină stabilește cadrul pentru garanția lucrărilor service."
      sections={[
        {
          title: "Garanție pentru manoperă",
          body: [
            "Perioada de garanție pentru manoperă trebuie stabilită în setările finale ale firmei.",
            "Garanția se aplică doar lucrării efectuate și problemei confirmate în fișa de service."
          ]
        },
        {
          title: "Garanție pentru piese",
          body: [
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
