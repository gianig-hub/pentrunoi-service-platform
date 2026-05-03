import { PublicPage } from "@/components/PublicPage";

export default function DigitalServicesPage() {
  return (
    <PublicPage
      eyebrow="Web Design, Aplicații Web & Mobile Apps"
      title="Creare site-uri web, aplicații web și mobile apps pentru afaceri"
      intro="Construim soluții digitale pentru firme care vor mai mult decât o simplă pagină de prezentare: site-uri moderne, marketplace-uri, dashboard-uri, aplicații web, aplicații mobile/PWA și sisteme personalizate pentru lucru intern."
      primaryHref="/cerere-proiect-digital"
      primaryLabel="Trimite proiectul tău"
      secondaryHref="/portofoliu"
      secondaryLabel="Vezi portofoliu"
      features={[
        {
          title: "Site-uri de prezentare",
          description: "Website-uri clare, rapide și responsive pentru firme locale, service-uri, ateliere, transport, recovery, restaurante, pensiuni și servicii profesionale."
        },
        {
          title: "Magazine online",
          description: "Structură pentru produse, categorii, pagini SEO, formulare, comenzi și administrare, în funcție de proiect."
        },
        {
          title: "Aplicații web personalizate",
          description: "Dashboard-uri, status tracking, formulare, fișe clienți, rapoarte, upload poze, istoric și administrare internă."
        },
        {
          title: "Marketplace-uri",
          description: "Platforme cu listări, categorii, servicii, vânzători, promovări și structură pregătită pentru monetizare."
        },
        {
          title: "Mobile apps și PWA",
          description: "Aplicații mobile sau aplicații web instalabile pe telefon pentru clienți, angajați, mecanici, șoferi sau tehnicieni."
        },
        {
          title: "Mentenanță website",
          description: "Actualizări, backup, conținut, pagini noi, corecturi, optimizare viteză și îmbunătățiri tehnice."
        }
      ]}
      sections={[
        {
          title: "Tehnologii folosite",
          body: [
            "Folosim tehnologii moderne precum Next.js, React, TypeScript, PostgreSQL, Prisma, Docker și Tailwind CSS pentru aplicații web și sisteme personalizate.",
            "Pentru proiecte potrivite, putem folosi WordPress și WooCommerce. Pentru aplicații mobile putem folosi React Native, Expo sau PWA, în funcție de cerințe."
          ]
        },
        {
          title: "Cum alegem soluția",
          body: [
            "Nu toate firmele au nevoie de aceeași tehnologie. Un site simplu poate fi construit diferit față de un marketplace sau față de un sistem intern cu bază de date.",
            "Scopul este să construim o soluție utilă, rapidă, ușor de administrat și pregătită pentru extindere."
          ]
        },
        {
          title: "Contact prin formular",
          body: [
            "Pentru proiecte digitale lucrăm pe bază de formular, analiză și ofertă. Astfel putem înțelege corect proiectul înainte să recomandăm tehnologia și pașii următori."
          ]
        }
      ]}
    />
  );
}
