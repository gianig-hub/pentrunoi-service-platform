import { LegalPage } from "@/components/LegalPage";

export default function CancellationPage() {
  return (
    <LegalPage
      title="Anulare și retragere"
      intro="Această pagină descrie cadrul pentru anularea cererilor și drepturile clientului."
      sections={[
        {
          title: "Anularea unei cereri",
          body: [
            "Clientul poate solicita anularea unei cereri înainte de începerea diagnosticării sau reparației.",
            "Dacă serviciile au început deja la cererea clientului, pot exista costuri pentru serviciile deja prestate."
          ]
        },
        {
          title: "Refuz deviz",
          body: [
            "Clientul poate refuza devizul înainte de începerea reparației.",
            "În caz de refuz, pot exista costuri pentru diagnosticare, transport sau retur, dacă acestea au fost comunicate în prealabil."
          ]
        },
        {
          title: "Document final",
          body: [
            "Textul final trebuie verificat juridic înainte de lansarea publică."
          ]
        }
      ]}
    />
  );
}
