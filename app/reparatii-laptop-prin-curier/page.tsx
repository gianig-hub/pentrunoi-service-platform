import { PublicPage } from "@/components/PublicPage";

export default function CourierRepairPage() {
  return (
    <PublicPage
      eyebrow="Reparații prin curier"
      title="Trimite laptopul prin curier, urmărește reparația online"
      intro="Pentru clienții care nu pot ajunge fizic la service, pregătim un flux simplu: cerere online, cod de tracking, trimitere prin curier, diagnosticare, deviz, aprobare, reparație și retur."
      primaryHref="/cerere-service"
      primaryLabel="Începe cererea"
      secondaryHref="/reparatii-prin-curier-termeni"
      secondaryLabel="Vezi termenii curier"
      features={[
        {
          title: "Fără cont client",
          description: "Clientul primește un cod unic și poate verifica statusul direct pe /status."
        },
        {
          title: "AWB intrare și retur",
          description: "Adminul poate nota AWB-ul de intrare și AWB-ul de retur pentru evidență."
        },
        {
          title: "Deviz înainte de reparație",
          description: "Reparația se poate începe după diagnosticare și acceptarea devizului, acolo unde este necesar."
        },
        {
          title: "Statusuri clare",
          description: "Cerere primită, așteptăm echipamentul, diagnosticare, deviz trimis, în reparație, testare, retur."
        },
        {
          title: "Note publice și interne",
          description: "Clientul vede doar notele publice. Detaliile interne rămân în admin."
        },
        {
          title: "Pregătit pentru extindere",
          description: "Fluxul poate fi extins ulterior cu upload poze, PDF service report și email reminders."
        }
      ]}
      sections={[
        {
          title: "Ambalare recomandată",
          body: [
            "Folosește cutie rezistentă, protecție pentru colțuri și folie cu bule.",
            "Adaugă încărcătorul doar dacă problema poate fi legată de alimentare sau dacă este cerut explicit."
          ]
        },
        {
          title: "Responsabilitate date",
          body: [
            "Dacă laptopul pornește, recomandăm backup înainte de trimitere.",
            "Pentru probleme de date, menționează clar că dorești verificare sau recuperare date."
          ]
        }
      ]}
    />
  );
}
