import { LegalPage } from "@/components/LegalPage";

export default function CourierTermsPage() {
  return (
    <LegalPage
      title="Termeni pentru reparații prin curier"
      intro="Această pagină explică regulile pentru trimiterea și returnarea echipamentelor prin curier."
      sections={[
        {
          title: "Ambalare",
          body: [
            "Clientul trebuie să ambaleze echipamentul corespunzător pentru transport.",
            "Se recomandă folosirea cutiei originale, protecție pentru colțuri, folie cu bule și separarea încărcătorului/accesoriilor."
          ]
        },
        {
          title: "Transport",
          body: [
            "AWB-ul de intrare și AWB-ul de retur pot fi înregistrate în sistem pentru urmărirea lucrării.",
            "Costurile de transport, asigurarea coletului și responsabilitatea în caz de deteriorare trebuie clarificate înainte de lansarea finală."
          ]
        },
        {
          title: "Recepție echipament",
          body: [
            "La primirea echipamentului se pot face fotografii pentru evidență internă.",
            "Dacă echipamentul ajunge deteriorat, acest lucru trebuie notat în fișa de service."
          ]
        },
        {
          title: "Retur",
          body: [
            "Echipamentul se returnează după finalizarea lucrării, refuzul devizului sau închiderea cazului, conform condițiilor agreate cu clientul."
          ]
        }
      ]}
    />
  );
}
