import Image from "next/image";
import Link from "next/link";

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

const serviceLinks = [
  { href: "/service-laptop-ploiesti", label: "Service laptop Ploiești" },
  { href: "/service-calculator-ploiesti", label: "Service calculator" },
  { href: "/reparatii-laptop-prin-curier", label: "Reparații prin curier" },
  { href: "/suport-it-firme", label: "Suport IT firme" },
  { href: "/internet-retele-firme", label: "Internet/rețele firme" },
  { href: "/web-design-aplicatii-web", label: "Web design & apps" }
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1.2fr]">
          <div>
            <Image
              src="/logo-pentrunoi.png"
              alt="Pentrunoi.ro - Service Laptop Giani"
              width={180}
              height={41}
              className="h-auto w-[180px]"
            />
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Service laptop și calculatoare, cereri prin curier, status tracking,
              suport IT și proiecte digitale. Contact principal prin formulare.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/cerere-service"
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
              >
                Cerere service
              </Link>
              <Link
                href="/status"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-950"
              >
                Status
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Servicii
            </h3>
            <div className="mt-4 grid gap-3">
              {serviceLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-slate-600 hover:text-slate-950">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Legal
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-slate-600 hover:text-slate-950">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Pentrunoi.ro. Versiune de dezvoltare.
        </p>
      </div>
    </footer>
  );
}
