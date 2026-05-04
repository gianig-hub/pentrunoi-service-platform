import type { Metadata } from "next";
import { MarketingPage } from "@/components/MarketingPage";

export const metadata: Metadata = {
  title: "Reparații laptop prin curier",
  description:
    "Trimite laptopul prin curier pentru diagnosticare și reparație. Primești tracking ID, deviz online și status actualizat fără cont."
};

export default function CourierRepairPage() {
  return (
    <MarketingPage
      eyebrow="Reparații laptop prin curier"
      title="Trimite laptopul prin curier și urmărește reparația online."
      intro="Fluxul prin curier este pregătit pentru clienții care nu pot ajunge fizic la service: cerere online, tracking ID, recepție echipament, diagnosticare, deviz, aprobare și retur."
      primaryHref="/cerere-service"
      primaryLabel="Începe cererea"
      secondaryHref="/reparatii-prin-curier-termeni"
      secondaryLabel="Termeni curier"
      highlights={[
        { title: "Fără cont", description: "Primești cod unic și verifici statusul direct online." },
        { title: "AWB", description: "Adminul poate nota AWB de intrare și retur." },
        { title: "Deviz online", description: "Clientul aprobă sau refuză devizul din pagina de status." },
        { title: "Poze publice", description: "Dovezile foto pot fi publice sau private." }
      ]}
      problems={[
        { title: "Laptop defect din alt oraș", description: "Poți trimite echipamentul prin curier după completarea cererii." },
        { title: "Aprobare la distanță", description: "Devizul este afișat online, iar clientul poate decide fără deplasare." },
        { title: "Istoric complet", description: "Lucrarea are statusuri, note, poze, deviz și raport." },
        { title: "Retur organizat", description: "După finalizare, returul se gestionează conform termenilor agreați." },
        { title: "Ambalare corectă", description: "Recomandăm cutie rezistentă, protecție și separarea accesoriilor." },
        { title: "Date personale", description: "Pe pagina publică se afișează doar informații sigure despre status." }
      ]}
      steps={[
        { title: "1. Formular", description: "Completezi cererea și descrii problema." },
        { title: "2. Trimiți coletul", description: "Pregătești ambalarea și trimiți echipamentul." },
        { title: "3. Recepție și diagnosticare", description: "Echipamentul este verificat și statusul se actualizează." },
        { title: "4. Deviz, reparație, retur", description: "Aprobi lucrarea, se repară/testează și se returnează." }
      ]}
      trustItems={[
        "Tracking ID",
        "AWB intrare/retur",
        "Status public",
        "Note interne separate",
        "Deviz online",
        "Retur documentat"
      ]}
      faqs={[
        { question: "Pot trimite încărcătorul?", answer: "Da, mai ales dacă problema este legată de alimentare. Dacă nu este necesar, poți trimite doar laptopul." },
        { question: "Ce se întâmplă dacă refuz devizul?", answer: "Statusul se actualizează, iar echipamentul poate fi returnat conform condițiilor agreate." },
        { question: "Cum văd statusul?", answer: "Introduci codul primit în pagina /status." },
        { question: "Cine răspunde de ambalare?", answer: "Clientul trebuie să ambaleze corect echipamentul pentru transport." }
      ]}
    />
  );
}
