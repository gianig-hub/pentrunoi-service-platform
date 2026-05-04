import type { Metadata } from "next";
import { MarketingPage } from "@/components/MarketingPage";

export const metadata: Metadata = {
  title: "Web design, aplicații web și mobile apps",
  description:
    "Creare site-uri, magazine online, aplicații web, dashboard-uri, marketplace-uri, PWA și mobile apps pentru firme."
};

export default function DigitalServicesPage() {
  return (
    <MarketingPage
      eyebrow="Web design, aplicații web & mobile apps"
      title="Website-uri, aplicații web și sisteme digitale pentru firme."
      intro="Construim soluții digitale pentru firme care vor mai mult decât o pagină simplă: site-uri, magazine online, marketplace-uri, dashboard-uri, aplicații web, PWA/mobile apps și sisteme interne."
      primaryHref="/cerere-proiect-digital"
      primaryLabel="Trimite proiectul tău"
      secondaryHref="/portofoliu"
      secondaryLabel="Vezi portofoliu"
      highlights={[
        { title: "Site-uri", description: "Pagini rapide, responsive și structurate pentru servicii locale." },
        { title: "Aplicații web", description: "Dashboard-uri, formulare, tracking, baze de date și admin." },
        { title: "Marketplace", description: "Structuri cu listări, categorii, planuri și promovări." },
        { title: "Mobile/PWA", description: "Aplicații instalabile sau mobile apps pentru fluxuri de lucru." }
      ]}
      problems={[
        { title: "Site de prezentare", description: "Pentru firme care vor pagini clare, rapide și ușor de administrat." },
        { title: "Magazin online", description: "Structură pentru produse, categorii, conținut SEO și comenzi." },
        { title: "Sistem intern", description: "Admin, clienți, statusuri, rapoarte, exporturi și workflow personalizat." },
        { title: "Marketplace", description: "Platformă cu listări, servicii, vânzători și monetizare." },
        { title: "PWA/mobile app", description: "Aplicații pentru telefon, tablete sau echipe de teren." },
        { title: "Mentenanță", description: "Actualizări, backup, conținut, viteză și îmbunătățiri continue." }
      ]}
      steps={[
        { title: "1. Cerere proiect", description: "Completezi formularul cu ce ai nevoie." },
        { title: "2. Analiză", description: "Alegem tehnologia potrivită pentru buget și scop." },
        { title: "3. Plan", description: "Stabilim fazele, paginile, funcțiile și prioritățile." },
        { title: "4. Build", description: "Construim, testăm și pregătim lansarea." }
      ]}
      trustItems={[
        "Next.js",
        "React",
        "TypeScript",
        "PostgreSQL",
        "Prisma",
        "Docker",
        "Tailwind CSS",
        "WordPress/WooCommerce când este potrivit"
      ]}
      faqs={[
        { question: "Faceți doar site-uri simple?", answer: "Nu. Putem construi și aplicații web, dashboard-uri, marketplace-uri sau sisteme interne." },
        { question: "Ce tehnologie folosiți?", answer: "Depinde de proiect. Pentru aplicații folosim des Next.js, React, TypeScript, PostgreSQL, Prisma și Docker. Pentru site-uri simple poate fi potrivit WordPress." },
        { question: "Faceți mobile apps?", answer: "Da, putem pregăti PWA sau aplicații mobile în funcție de cerințe și buget." },
        { question: "Cum trimit proiectul?", answer: "Prin formularul de proiect digital. Cererea primește tracking în sistem." }
      ]}
    />
  );
}
