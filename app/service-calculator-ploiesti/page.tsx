import { PublicPage } from "@/components/PublicPage";

export default function PcServicePage() {
  return (
    <PublicPage
      eyebrow="Service calculator Ploiești"
      title="Service calculator PC, desktop și All-in-One"
      intro="Reparăm și optimizăm calculatoare pentru acasă, birou și firme: diagnosticare, upgrade SSD/RAM, surse, temperaturi, curățare, reinstalare sistem, devirusare, backup și probleme de performanță."
      primaryHref="/cerere-service"
      primaryLabel="Trimite cerere service"
      secondaryHref="/preturi"
      secondaryLabel="Vezi prețuri orientative"
      features={[
        {
          title: "PC lent sau instabil",
          description: "Verificăm stocarea, memoria, sistemul, temperaturile și programele care încetinesc calculatorul."
        },
        {
          title: "Upgrade SSD/RAM",
          description: "Recomandăm upgrade-uri potrivite pentru buget și utilizare: birou, școală, gaming sau firmă."
        },
        {
          title: "Curățare și temperaturi",
          description: "Verificare ventilatoare, praf, airflow, temperaturi și recomandări pentru funcționare stabilă."
        },
        {
          title: "Windows și software",
          description: "Reinstalare, configurare, drivere, securizare, devirusare și pregătire pentru lucru."
        },
        {
          title: "PC business",
          description: "Mentenanță pentru calculatoare de firmă, stații de lucru, backup și suport periodic."
        },
        {
          title: "Tracking lucrare",
          description: "Fiecare lucrare poate fi urmărită prin cod unic pe pagina de status."
        }
      ]}
    />
  );
}
