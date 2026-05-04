import type { Metadata } from "next";
import { MarketingPage } from "@/components/MarketingPage";

export const metadata: Metadata = {
  title: "Service laptop Ploiești",
  description:
    "Service laptop în Ploiești: diagnosticare, curățare, upgrade SSD/RAM, display, tastatură, baterie, temperaturi și reparații prin curier."
};

export default function LaptopServicePage() {
  return (
    <MarketingPage
      eyebrow="Service laptop Ploiești"
      title="Service laptop în Ploiești, cu tracking online și deviz clar."
      intro="Diagnosticăm și reparăm laptopuri pentru acasă, birou sau firmă. Cererea se trimite prin formular, primești cod de tracking, iar statusul lucrării poate fi verificat online fără cont client."
      primaryHref="/cerere-service"
      primaryLabel="Trimite cerere service"
      secondaryHref="/reparatii-laptop-prin-curier"
      secondaryLabel="Reparații prin curier"
      highlights={[
        { title: "Diagnosticare", description: "Verificare simptome, temperaturi, stocare, memorie, alimentare și funcționare." },
        { title: "Curățare internă", description: "Curățare praf, verificare răcire și recomandări pentru temperaturi mai bune." },
        { title: "Upgrade", description: "SSD, RAM, reinstalare sistem și optimizare pentru viteză." },
        { title: "Tracking online", description: "Fiecare lucrare primește cod unic și status public." }
      ]}
      problems={[
        { title: "Laptop lent", description: "Verificăm SSD/HDD, RAM, temperaturi, programe la startup și starea sistemului." },
        { title: "Se încălzește sau se oprește", description: "Analizăm răcirea, ventilatorul, pasta termoconductoare și acumularea de praf." },
        { title: "Display spart", description: "Identificăm modelul compatibil și pregătim deviz în funcție de disponibilitatea piesei." },
        { title: "Tastatură defectă", description: "Verificăm modelul, layout-ul, conexiunea și opțiunile de înlocuire." },
        { title: "Nu pornește", description: "Verificăm alimentatorul, placa, bateria, mufa de încărcare și componentele principale." },
        { title: "Probleme software", description: "Reinstalare, drivere, erori Windows, devirusare și configurare pentru utilizare normală." }
      ]}
      steps={[
        { title: "1. Cerere online", description: "Completezi datele și descrii problema cât mai clar." },
        { title: "2. Tracking ID", description: "Primești un cod pentru statusul lucrării." },
        { title: "3. Diagnosticare", description: "Verificăm echipamentul și adăugăm actualizări în admin." },
        { title: "4. Deviz și aprobare", description: "Clientul vede devizul și poate aproba sau refuza online." }
      ]}
      trustItems={[
        "Fără cont client",
        "Status tracking public",
        "Poze publice/private",
        "Deviz cu aprobare",
        "Raport printabil",
        "Remindere pentru mentenanță"
      ]}
      faqs={[
        { question: "Trebuie să îmi fac cont?", answer: "Nu. Pentru service primești un cod unic de tracking și poți verifica statusul fără cont." },
        { question: "Pot trimite laptopul prin curier?", answer: "Da. Fluxul de curier este pregătit pentru recepție, tracking, deviz și retur." },
        { question: "Se face reparația fără acordul meu?", answer: "Nu pentru lucrările care necesită deviz. Devizul poate fi aprobat sau refuzat online." },
        { question: "Datele mele sunt în siguranță?", answer: "Recomandăm backup înainte de predare dacă laptopul pornește. Pentru recuperare date trebuie menționat clar în formular." }
      ]}
    />
  );
}
