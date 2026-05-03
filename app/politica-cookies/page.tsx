import { LegalPage } from "@/components/LegalPage";

export default function CookiesPage() {
  return (
    <LegalPage
      title="Politica de cookies"
      intro="Această pagină descrie folosirea cookie-urilor și a tehnologiilor similare."
      sections={[
        {
          title: "Cookie-uri necesare",
          body: [
            "Website-ul poate folosi cookie-uri sau stocare tehnică necesară pentru funcționare, securitate, formulare și administrare.",
            "Aceste cookie-uri sunt necesare pentru furnizarea serviciului solicitat."
          ]
        },
        {
          title: "Analytics și marketing",
          body: [
            "Dacă se vor adăuga instrumente de analiză sau marketing, acestea trebuie activate doar conform setărilor de consimțământ.",
            "Pentru versiunea de dezvoltare, nu se adaugă tracking de marketing."
          ]
        },
        {
          title: "Actualizări",
          body: [
            "Lista exactă de cookie-uri trebuie completată înainte de lansarea finală, în funcție de instrumentele folosite."
          ]
        }
      ]}
    />
  );
}
