import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dev.pentrunoi.ro";
const isDevDomain = siteUrl.includes("dev.");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Service Laptop Ploiești | Reparații laptop prin curier | Pentrunoi.ro",
    template: "%s | Pentrunoi.ro"
  },
  description:
    "Service laptop și calculatoare în Ploiești, reparații prin curier, status tracking online, suport IT firme, rețele business, web design și aplicații web.",
  robots: isDevDomain
    ? {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false
        }
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true
        }
      },
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: siteUrl,
    siteName: "Pentrunoi.ro",
    title: "Service Laptop Ploiești | Reparații prin curier | Pentrunoi.ro",
    description:
      "Service laptop și calculatoare, reparații prin curier, tracking status online, suport IT firme și proiecte digitale.",
    images: [
      {
        url: "/logo-pentrunoi.png",
        width: 450,
        height: 102,
        alt: "Pentrunoi.ro - Service Laptop Giani"
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
