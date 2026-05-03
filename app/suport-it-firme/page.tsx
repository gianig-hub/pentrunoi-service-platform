import { PublicPage } from "@/components/PublicPage";

export default function BusinessItPage() {
  return (
    <PublicPage
      eyebrow="Suport IT firme"
      title="Suport IT, mentenanță calculatoare și administrare tehnică pentru firme"
      intro="Ajutăm firmele mici și medii să își mențină calculatoarele, laptopurile, rețelele, emailurile și backup-urile într-o stare bună de funcționare, cu cereri prin formular și tracking pentru lucrări."
      primaryHref="/cerere-suport-it-firme"
      primaryLabel="Trimite cerere IT"
      secondaryHref="/status"
      secondaryLabel="Verifică status"
      features={[
        {
          title: "Mentenanță calculatoare",
          description: "Verificări periodice, curățare software, temperaturi, update-uri, performanță și recomandări pentru echipamente."
        },
        {
          title: "Email business",
          description: "Configurare email profesional, domenii, conturi, semnături, acces pe laptop și telefon."
        },
        {
          title: "Backup date",
          description: "Soluții de backup local sau cloud, verificare periodică și proceduri simple de restaurare."
        },
        {
          title: "Rețele birou",
          description: "Routere, switch-uri, Wi-Fi, imprimante, partajare fișiere și conectivitate internă."
        },
        {
          title: "Suport remote",
          description: "Pentru probleme simple, suportul poate fi oferit remote, în funcție de situație."
        },
        {
          title: "Abonamente mentenanță",
          description: "Pentru firme, putem pregăti pachete recurente de verificare și suport periodic."
        }
      ]}
    />
  );
}
