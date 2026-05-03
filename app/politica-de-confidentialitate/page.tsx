import { LegalPage } from "@/components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politica de confidențialitate"
      intro="Această pagină descrie, în format draft, ce date pot fi colectate prin website și cum sunt folosite."
      sections={[
        {
          title: "Date colectate",
          body: [
            "Prin formulare pot fi colectate date precum nume, email, telefon opțional, oraș, județ, detalii despre echipament, problema raportată și mesajul transmis.",
            "Pentru lucrări service pot fi stocate detalii despre dispozitiv, statusuri, devize, note publice, note interne și fișiere atașate."
          ]
        },
        {
          title: "Scopul prelucrării",
          body: [
            "Datele sunt folosite pentru preluarea cererilor, diagnosticare, comunicare, devize, status tracking, garanție, istoric service și îmbunătățirea serviciilor.",
            "Datele nu trebuie folosite pentru marketing fără consimțământ separat."
          ]
        },
        {
          title: "Tracking fără cont",
          body: [
            "Clientul poate verifica statusul folosind un cod unic, fără cont de utilizator.",
            "Pagina publică de status afișează doar informații generale și nu afișează note interne sau detalii sensibile."
          ]
        },
        {
          title: "Drepturile persoanei vizate",
          body: [
            "Clientul poate solicita acces, corectare sau ștergere acolo unde legea permite.",
            "Solicitările se trimit prin formularul de contact sau la emailul public afișat pe site."
          ]
        }
      ]}
    />
  );
}
