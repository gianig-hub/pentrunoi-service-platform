import type { Metadata } from "next";
import { MarketingPage } from "@/components/MarketingPage";

export const metadata: Metadata = {
  title: "Suport IT firme",
  description:
    "Suport IT pentru firme: mentenanță calculatoare, email business, backup, rețele, Wi-Fi, routere și suport remote."
};

export default function BusinessItPage() {
  return (
    <MarketingPage
      eyebrow="Suport IT firme"
      title="Suport IT pentru firme mici, birouri și activități locale."
      intro="Ajutăm firmele să își țină calculatoarele, emailurile, backup-urile, rețelele și echipamentele într-o stare bună. Cererile intră în sistem ca lead-uri și pot fi urmărite cu tracking."
      primaryHref="/cerere-suport-it-firme"
      primaryLabel="Trimite cerere IT"
      secondaryHref="/internet-retele-firme"
      secondaryLabel="Internet & rețele"
      highlights={[
        { title: "Mentenanță", description: "Verificări periodice pentru calculatoare și laptopuri de firmă." },
        { title: "Backup", description: "Soluții simple pentru protejarea datelor importante." },
        { title: "Email business", description: "Configurare conturi, domenii, semnături și acces pe dispozitive." },
        { title: "Rețele", description: "Routere, Wi-Fi, imprimante, switch-uri și conectivitate." }
      ]}
      problems={[
        { title: "PC-uri lente în firmă", description: "Verificare hardware/software și recomandări de upgrade sau mentenanță." },
        { title: "Emailuri configurate greșit", description: "Ajutor pentru email business, domenii, aplicații și semnături." },
        { title: "Lipsă backup", description: "Stabilim un plan de backup local sau cloud potrivit pentru firmă." },
        { title: "Wi-Fi slab", description: "Analizăm acoperirea, echipamentele și configurarea rețelei." },
        { title: "Imprimante/rețea", description: "Configurare acces, partajare și conectare în rețeaua firmei." },
        { title: "Suport remote", description: "Pentru probleme simple, suportul poate fi oferit remote." }
      ]}
      steps={[
        { title: "1. Cerere business", description: "Completezi formularul cu problema și detalii despre firmă." },
        { title: "2. Analiză", description: "Stabilim ce echipamente, utilizatori și servicii sunt implicate." },
        { title: "3. Plan", description: "Propunem pași, deviz sau abonament de mentenanță." },
        { title: "4. Follow-up", description: "Putem programa remindere de mentenanță." }
      ]}
      trustItems={[
        "Cereri în admin",
        "Tracking pentru lead",
        "Istoric client",
        "Remindere mentenanță",
        "Exporturi CSV",
        "Fără telefon CTA"
      ]}
      faqs={[
        { question: "Lucrați cu firme mici?", answer: "Da, serviciul este gândit pentru firme mici, birouri, ateliere, magazine și servicii locale." },
        { question: "Faceți abonamente?", answer: "Platforma este pregătită pentru mentenanță periodică și remindere. Pachetele pot fi stabilite ulterior." },
        { question: "Faceți suport remote?", answer: "Da, pentru probleme care pot fi rezolvate fără deplasare." },
        { question: "Cum trimit o cerere?", answer: "Prin formularul de suport IT firme. Nu folosim telefonul ca principal call-to-action." }
      ]}
    />
  );
}
