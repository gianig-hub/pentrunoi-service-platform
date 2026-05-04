import type { Metadata } from "next";
import { MarketingPage } from "@/components/MarketingPage";

export const metadata: Metadata = {
  title: "Internet, rețele și Wi-Fi firme",
  description:
    "Soluții pentru conectivitate business: backup internet, 4G/5G, routere, dual WAN, Wi-Fi business, firewall și VPN."
};

export default function ConnectivityPage() {
  return (
    <MarketingPage
      eyebrow="Internet, rețele și conectivitate firme"
      title="Soluții de conectivitate pentru firme în zone cu semnal slab."
      intro="Ajutăm firmele să își configureze rețele mai stabile: backup internet, routere 4G/5G, Wi-Fi business, dual WAN, firewall, VPN și acces remote pentru echipamente."
      primaryHref="/cerere-retele-internet-firme"
      primaryLabel="Trimite cerere conectivitate"
      secondaryHref="/suport-it-firme"
      secondaryLabel="Suport IT firme"
      highlights={[
        { title: "Backup internet", description: "Conexiune de rezervă pentru activități care nu pot sta offline." },
        { title: "4G/5G", description: "Routere mobile pentru zone fără fibră bună sau cu semnal dificil." },
        { title: "Wi-Fi business", description: "Acoperire pentru birouri, depozite, pensiuni, service-uri sau magazine." },
        { title: "VPN/firewall", description: "Acces remote și reguli de securitate pentru rețeaua firmei." }
      ]}
      problems={[
        { title: "Internet instabil", description: "Analizăm conexiunea, routerul, semnalul și posibilitatea de backup." },
        { title: "Fără fibră", description: "Căutăm soluții alternative prin operatori autorizați și echipamente potrivite." },
        { title: "Wi-Fi slab", description: "Verificăm acoperirea, poziționarea echipamentelor și separarea rețelelor." },
        { title: "Camere CCTV remote", description: "Ajutor pentru acces remote și conectivitate stabilă." },
        { title: "Dual WAN", description: "Routere care pot comuta între conexiunea principală și backup." },
        { title: "Locații dificile", description: "Birouri, depozite, pensiuni, ferme, ateliere sau șantiere." }
      ]}
      steps={[
        { title: "1. Cerere", description: "Descrii locația, providerul actual și problema principală." },
        { title: "2. Analiză", description: "Stabilim nevoile: utilizatori, dispozitive, acoperire, backup." },
        { title: "3. Recomandare", description: "Propunem echipamente și configurare potrivită." },
        { title: "4. Configurare", description: "Setare routere, Wi-Fi, backup, VPN sau acces remote." }
      ]}
      trustItems={[
        "Nu ne prezentăm ca furnizor de internet",
        "Lucrăm cu servicii existente/operatori autorizați",
        "Rețele business",
        "Backup internet",
        "Wi-Fi pentru locații dificile",
        "Tracking cerere"
      ]}
      faqs={[
        { question: "Sunteți furnizor de internet?", answer: "Nu. Putem ajuta cu analiză, configurare și echipamente folosind servicii existente și operatori autorizați." },
        { question: "Puteți ajuta în zone rurale?", answer: "Da, putem analiza opțiuni de backup și conectivitate în zone cu semnal slab." },
        { question: "Faceți Wi-Fi pentru pensiuni sau depozite?", answer: "Da, putem analiza acoperirea și configura echipamente potrivite." },
        { question: "Pot trimite cererea fără telefon?", answer: "Da, formularul este principalul canal pentru cereri." }
      ]}
    />
  );
}
