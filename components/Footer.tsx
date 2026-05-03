import Image from "next/image";

const legalLinks = [
  { href: "/informatii-legale", label: "Informații legale" },
  { href: "/termeni-si-conditii", label: "Termeni și condiții" },
  { href: "/politica-de-confidentialitate", label: "Confidențialitate" },
  { href: "/politica-cookies", label: "Cookies" },
  { href: "/garantie-service", label: "Garanție service" },
  { href: "/reparatii-prin-curier-termeni", label: "Reparații prin curier" },
  { href: "/anulare-retragere", label: "Anulare/retragere" },
  { href: "/anpc-sal", label: "ANPC/SAL" }
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <Image
              src="/logo-pentrunoi.png"
              alt="Pentrunoi.ro - Service Laptop Giani"
              width={180}
              height={41}
              className="h-auto w-[180px]"
            />
            <p className="mt-4 text-sm text-slate-600">
              Service laptop și calculatoare, cereri prin curier, status tracking,
              suport IT și proiecte digitale. Contact principal prin formulare.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Legal
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {legalLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-sm text-slate-600 hover:text-slate-950">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          © {new Date().getFullYear()} Pentrunoi.ro. Versiune de dezvoltare.
        </p>
      </div>
    </footer>
  );
}
