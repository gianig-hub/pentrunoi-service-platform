import { LegalPage } from "@/components/LegalPage";

export default function AnpcSalPage() {
  return (
    <LegalPage
      title="ANPC și SAL"
      intro="Această pagină este pregătită pentru informațiile privind protecția consumatorului și soluționarea alternativă a litigiilor."
      sections={[
        {
          title: "Protecția consumatorului",
          body: [
            "Consumatorii pot consulta informații oficiale prin Autoritatea Națională pentru Protecția Consumatorilor.",
            "Linkurile și textele finale trebuie verificate înainte de lansarea publică."
          ]
        },
        {
          title: "Soluționarea alternativă a litigiilor",
          body: [
            "În cazul unui litigiu, clientul poate folosi mecanismele disponibile pentru soluționarea alternativă a litigiilor, conform legislației aplicabile.",
            "Această pagină trebuie completată cu linkuri oficiale actualizate înainte de producție."
          ]
        }
      ]}
    />
  );
}
