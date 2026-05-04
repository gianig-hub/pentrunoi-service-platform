import type { Metadata } from "next";
import { MarketingPage } from "@/components/MarketingPage";

export const metadata: Metadata = {
  title: "Service calculator Ploiești",
  description:
    "Service PC și calculatoare în Ploiești: diagnosticare, upgrade SSD/RAM, curățare, Windows, backup, rețele și mentenanță pentru firme."
};

export default function PcServicePage() {
  return (
    <MarketingPage
      eyebrow="Service calculator Ploiești"
      title="Service PC, desktop și All-in-One pentru acasă și firme."
      intro="Reparăm, optimizăm și întreținem calculatoare desktop, sisteme office, stații de lucru și PC-uri folosite în firme. Fluxul include cerere online, tracking, diagnosticare și istoric intern."
      primaryHref="/cerere-service"
      primaryLabel="Trimite cerere service"
      secondaryHref="/suport-it-firme"
      secondaryLabel="Suport IT firme"
      highlights={[
        { title: "PC lent", description: "Analizăm stocarea, memoria, sistemul și programele care încetinesc calculatorul." },
        { title: "Upgrade SSD/RAM", description: "Recomandăm upgrade-uri potrivite pentru lucru, școală, birou sau firmă." },
        { title: "Curățare", description: "Verificare praf, airflow, ventilatoare și temperaturi." },
        { title: "Business", description: "Mentenanță pentru calculatoare de firmă și suport periodic." }
      ]}
      problems={[
        { title: "Calculatorul pornește greu", description: "Verificăm Windows, SSD/HDD, RAM și programele de pornire." },
        { title: "Se blochează", description: "Căutăm probleme de temperatură, memorie, drivere, stocare sau sursă." },
        { title: "Nu pornește", description: "Verificăm alimentarea, sursa, placa de bază, RAM și componentele esențiale." },
        { title: "Zgomot mare", description: "Curățare ventilatoare, verificare airflow și recomandări de mentenanță." },
        { title: "Backup și date", description: "Pregătim soluții de backup sau verificare date, în funcție de situație." },
        { title: "PC-uri firmă", description: "Evidență, istoric, remindere și suport pentru calculatoare folosite în business." }
      ]}
      steps={[
        { title: "1. Completezi cererea", description: "Descrii problema și tipul echipamentului." },
        { title: "2. Diagnosticare", description: "Verificăm hardware/software și notăm concluziile." },
        { title: "3. Deviz", description: "Dacă sunt costuri, pregătim deviz pentru aprobare." },
        { title: "4. Finalizare", description: "Lucrarea poate primi raport printabil și reminder viitor." }
      ]}
      trustItems={[
        "Istoric echipament",
        "Fișă service internă",
        "Statusuri clare",
        "Deviz înainte de reparație",
        "Export CSV",
        "Raport printabil"
      ]}
      faqs={[
        { question: "Pot aduce PC de firmă?", answer: "Da, sistemul poate păstra istoric pentru client, echipamente și lucrări." },
        { question: "Faceți upgrade SSD?", answer: "Da, în funcție de compatibilitate și necesarul clientului." },
        { question: "Pot primi deviz înainte?", answer: "Da, devizul poate fi creat în admin și aprobat/refuzat pe pagina de status." },
        { question: "Se poate face mentenanță periodică?", answer: "Da, putem crea remindere pentru verificări, curățare și mentenanță." }
      ]}
    />
  );
}
