import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pentrunoi Service Platform",
  description: "Development-first rebuild of pentrunoi.ro"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>{children}<Footer /></body>
    </html>
  );
}
