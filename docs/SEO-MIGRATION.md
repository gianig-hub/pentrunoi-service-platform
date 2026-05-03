# SEO and Romanian VPS Migration Notes

## Current dev domain

Current dev URL:

https://dev.pentrunoi.ro

The dev domain must not be indexed by Google.

The app now blocks indexing on dev through:

- robots.txt disallow all when NEXT_PUBLIC_SITE_URL contains dev.
- metadata robots noindex when NEXT_PUBLIC_SITE_URL contains dev.

## Production domain later

When moving to Romanian VPS and production domain, set:

NEXT_PUBLIC_SITE_URL=https://pentrunoi.ro

Then rebuild/restart the app.

## Production SEO checklist

Before launch:

1. Point pentrunoi.ro DNS to the Romanian VPS.
2. Set NEXT_PUBLIC_SITE_URL=https://pentrunoi.ro.
3. Confirm robots.txt allows public pages.
4. Confirm sitemap.xml lists production URLs.
5. Keep admin blocked from indexing.
6. Keep /api blocked from indexing.
7. Confirm service pages have Romanian SEO text.
8. Add real prices if wanted.
9. Confirm legal pages are complete.
10. Confirm contact form and service request form work.
11. Submit sitemap in Google Search Console.
12. Keep old WordPress URLs redirected if needed.

## Important production redirects

When the old WordPress site is replaced, prepare redirects from old important URLs to the new pages.

Main target pages:

- /service-laptop-ploiesti
- /service-calculator-ploiesti
- /reparatii-laptop-prin-curier
- /suport-it-firme
- /internet-retele-firme
- /web-design-aplicatii-web
- /cerere-service
- /status

## Notes

Do not launch with dev URLs in sitemap.

Do not allow indexing on dev.pentrunoi.ro.

Do not expose admin routes without protection.
