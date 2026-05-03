import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dev.pentrunoi.ro";

const routes = [
  { path: "/", priority: 1.0 },
  { path: "/service-laptop-ploiesti", priority: 0.95 },
  { path: "/service-calculator-ploiesti", priority: 0.9 },
  { path: "/reparatii-laptop-prin-curier", priority: 0.9 },
  { path: "/suport-it-firme", priority: 0.85 },
  { path: "/internet-retele-firme", priority: 0.8 },
  { path: "/web-design-aplicatii-web", priority: 0.8 },
  { path: "/portofoliu", priority: 0.65 },
  { path: "/preturi", priority: 0.75 },
  { path: "/contact", priority: 0.7 },
  { path: "/cerere-service", priority: 0.8 },
  { path: "/status", priority: 0.55 },
  { path: "/informatii-legale", priority: 0.3 },
  { path: "/termeni-si-conditii", priority: 0.3 },
  { path: "/politica-de-confidentialitate", priority: 0.3 },
  { path: "/politica-cookies", priority: 0.3 },
  { path: "/garantie-service", priority: 0.35 },
  { path: "/reparatii-prin-curier-termeni", priority: 0.35 },
  { path: "/anulare-retragere", priority: 0.3 },
  { path: "/anpc-sal", priority: 0.3 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route.priority
  }));
}
