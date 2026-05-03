import Link from "next/link";

const navLinks = [
  { href: "/", label: "Acasă" },
  { href: "/service-laptop-ploiesti", label: "Service Laptop" },
  { href: "/service-calculator-ploiesti", label: "Service Calculator" },
  { href: "/reparatii-laptop-prin-curier", label: "Reparații prin Curier" },
  { href: "/web-design-aplicatii-web", label: "Web & Apps" },
  { href: "/portofoliu", label: "Portofoliu" },
  { href: "/status", label: "Status" }
];

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-950">
          Pentrunoi.ro
        </Link>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-950">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cerere-service"
          className="inline-flex w-fit rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Cerere service
        </Link>
      </div>
    </header>
  );
}
