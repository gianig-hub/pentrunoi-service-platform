import { PublicPage } from "@/components/PublicPage";

export default function LaptopServicePage() {
  return (
    <PublicPage
      eyebrow="Service laptop Ploiești"
      title="Service laptop în Ploiești și reparații prin curier"
      intro="Oferim servicii pentru laptopuri folosite acasă, la birou sau în firmă: diagnosticare, curățare internă, verificare temperaturi, upgrade SSD/RAM, înlocuire display, tastatură, baterie, mufă alimentare și depanare software."
      primaryHref="/cerere-service"
      primaryLabel="Trimite cerere service"
      secondaryHref="/status"
      secondaryLabel="Verifică status"
      features={[
        {
          title: "Diagnosticare",
          description: "Verificăm simptomele, componentele principale, temperaturile, stocarea, memoria și comportamentul sistemului."
        },
        {
          title: "Curățare și mentenanță",
          description: "Curățare praf, verificare sistem de răcire și recomandări pentru prevenirea supraîncălzirii."
        },
        {
          title: "Upgrade laptop",
          description: "Montare SSD, upgrade RAM, reinstalare sistem și optimizare pentru utilizare mai rapidă."
        },
        {
          title: "Display, tastatură, baterie",
          description: "Înlocuire componente defecte în funcție de model, disponibilitate piese și confirmarea clientului."
        },
        {
          title: "Service prin curier",
          description: "Pentru clienții din afara zonei, echipamentul poate fi trimis prin curier și urmărit cu tracking ID."
        },
        {
          title: "Jurnal reparație",
          description: "Fiecare lucrare poate avea istoric, statusuri, note, devize și recomandări de mentenanță."
        }
      ]}
      sections={[
        {
          title: "Cum lucrăm",
          body: [
            "Clientul trimite o cerere prin formular. Sistemul generează un cod unic de tracking.",
            "După verificare, lucrarea este actualizată în admin, iar clientul poate vedea statusul fără cont."
          ]
        },
        {
          title: "Important despre date",
          body: [
            "Recomandăm backup pentru datele importante înainte de predarea echipamentului, dacă acest lucru este posibil.",
            "Pentru recuperare de date, clientul trebuie să menționeze clar problema în formular."
          ]
        }
      ]}
    />
  );
}
