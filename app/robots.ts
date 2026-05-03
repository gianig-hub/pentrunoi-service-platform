import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dev.pentrunoi.ro";
const isDevDomain = siteUrl.includes("dev.");

export default function robots(): MetadataRoute.Robots {
  if (isDevDomain) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/"
      },
      sitemap: `${siteUrl}/sitemap.xml`
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
