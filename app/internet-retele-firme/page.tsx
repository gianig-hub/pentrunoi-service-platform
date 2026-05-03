import { PublicPage } from "@/components/PublicPage";

export default function ConnectivityPage() {
  return (
    <PublicPage
      eyebrow="Internet, rețele și conectivitate firme"
      title="Soluții de conectivitate business pentru zone cu semnal slab"
      intro="Configurăm și optimizăm soluții de conectivitate pentru firme, folosind servicii furnizate de operatori autorizați, routere profesionale, backup internet, 4G/5G, Wi-Fi business și rețele stabile."
      primaryHref="/cerere-retele-internet-firme"
      primaryLabel="Trimite cerere conectivitate"
      secondaryHref="/suport-it-firme"
      secondaryLabel="Vezi suport IT firme"
      features={[
        {
          title: "Backup internet",
          description: "Configurare soluții de rezervă pentru firme care nu își permit întreruperi lungi de conexiune."
        },
        {
          title: "Routere 4G/5G",
          description: "Alegere, configurare și testare routere mobile pentru locații cu fibră slabă sau lipsă."
        },
        {
          title: "Dual WAN",
          description: "Routere care pot comuta între conexiunea principală și backup, în funcție de disponibilitate."
        },
        {
          title: "Wi-Fi business",
          description: "Acoperire Wi-Fi pentru birouri, depozite, pensiuni, service-uri, ateliere și spații comerciale."
        },
        {
          title: "Firewall și VPN",
          description: "Configurare acces remote, reguli de securitate, separare rețea oaspeți și echipamente interne."
        },
        {
          title: "CCTV remote access",
          description: "Ajutor pentru conectarea camerelor de supraveghere la internet în locații dificile."
        }
      ]}
      sections={[
        {
          title: "Poziționare corectă",
          body: [
            "Nu ne prezentăm ca furnizor de internet. Configurăm soluții de conectivitate folosind servicii existente și operatori autorizați.",
            "Scopul este să ajutăm firmele să aibă o rețea mai stabilă, backup mai bun și echipamente configurate corect."
          ]
        }
      ]}
    />
  );
}
