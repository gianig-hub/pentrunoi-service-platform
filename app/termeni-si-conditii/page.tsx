import { LegalPage } from "@/components/LegalPage";
import { getSiteSettings } from "@/lib/site-settings";

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <LegalPage
      title="Termeni și condiții"
      intro="Acești termeni explică modul de utilizare a website-ului și a serviciilor solicitate prin formulare."
      sections={[
        {
          title: "Utilizarea website-ului",
          body: [
            "Website-ul permite trimiterea cererilor pentru service laptop/calculator, cereri prin curier, servicii IT, conectivitate business și proiecte digitale.",
            "Utilizatorul trebuie să trimită informații corecte și complete atunci când folosește formularele."
          ]
        },
        {
          title: "Cereri service",
          body: [
            "Trimiterea unei cereri nu înseamnă acceptarea automată a unei reparații.",
            "După diagnosticare, clientul poate primi un deviz estimativ. Reparația se efectuează doar după confirmare, atunci când este necesară aprobarea clientului."
          ]
        },
        {
          title: "Responsabilitate date",
          body: [
            settings.data_backup_warning,
            "Pentru recuperare de date, clientul trebuie să menționeze clar acest lucru în formular."
          ]
        },
        {
          title: "Echipamente neridicate",
          body: [
            settings.abandoned_device_policy
          ]
        },
        {
          title: "Status tracking",
          body: [
            "Fiecare cerere poate primi un cod unic de tracking. Codul permite verificarea statusului fără cont client.",
            "Clientul este responsabil să păstreze codul de tracking în siguranță."
          ]
        },
        {
          title: "Limitări",
          body: [
            "Informațiile de pe website au rol informativ și pot fi actualizate.",
            "Prețurile, termenele și disponibilitatea serviciilor pot varia în funcție de diagnostic, piese, curier și complexitatea lucrării."
          ]
        }
      ]}
    />
  );
}
