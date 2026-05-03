const projects = [
  {
    name: "KoldMarket / Everything Kold",
    type: "Marketplace vertical",
    status: "În dezvoltare",
    tech: "Next.js, PostgreSQL, Prisma, Docker, Tailwind CSS",
    description:
      "Platformă marketplace dedicată industriei de răcire, aer condiționat, camere frigorifice, echipamente, piese, servicii și anunțuri specializate.",
    features: ["marketplace de nișă", "listări produse și servicii", "seller plans", "featured listings", "dashboard administrare"]
  },
  {
    name: "EE Motors Northampton",
    type: "Garage/workshop management system",
    status: "În dezvoltare",
    tech: "Next.js, PostgreSQL, Prisma, Docker, Tailwind CSS",
    description:
      "Sistem web pentru management complet de service auto: clienți, vehicule, programări, job cards, loguri mecanic, poze, aprobări client, facturi și rapoarte.",
    features: ["clienți și vehicule", "job cards", "photo evidence", "customer approval", "print/export reports"]
  },
  {
    name: "Pentrunoi.ro",
    type: "Service laptop platform",
    status: "Dev rebuild",
    tech: "Next.js, PostgreSQL, Prisma, Docker, Tailwind CSS",
    description:
      "Reconstrucție website service laptop și calculatoare, cu cereri service, reparații prin curier, tracking ID, admin dashboard, jurnal service și legal pack.",
    features: ["cerere service", "status tracking", "admin repairs", "changelog", "legal pages"]
  },
  {
    name: "Recovery Northampton",
    type: "24/7 recovery website + lead system",
    status: "Rebuild recomandat",
    tech: "Next.js sau WordPress, în funcție de buget",
    description:
      "Website pentru firmă de recovery și roadside assistance în Northampton, optimizat pentru lead-uri, cereri urgente, local SEO și posibil driver workflow.",
    features: ["urgent quote form", "local SEO", "service area pages", "driver workflow later", "lead tracking"]
  }
];

export default function PortfolioPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Portofoliu
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        Portofoliu website-uri, aplicații web și sisteme personalizate
      </h1>
      <p className="mt-4 max-w-3xl text-slate-700">
        Proiecte proprii, proiecte în dezvoltare și exemple de sisteme care arată direcția
        serviciilor digitale: marketplace-uri, service management, tracking, lead systems și aplicații pentru firme.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <article key={project.name} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">{project.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{project.type}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {project.status}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-700">{project.description}</p>

            <p className="mt-4 text-sm">
              <span className="font-semibold text-slate-950">Tehnologii:</span>{" "}
              <span className="text-slate-700">{project.tech}</span>
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.features.map((feature) => (
                <span key={feature} className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-700">
                  {feature}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
