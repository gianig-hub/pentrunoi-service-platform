# Pentrunoi.ro Production Migration Pack — Romanian VPS

## Goal

Move the current dev platform from dev.pentrunoi.ro to production pentrunoi.ro on a Romanian VPS.

## Current dev rule

Do not index dev.pentrunoi.ro.

Dev must stay blocked by:
- robots.txt disallow all
- metadata noindex
- admin protected by Caddy basic auth

## Production target

Production should run:
- Docker
- PostgreSQL 16
- Next.js app
- Caddy reverse proxy
- persistent DB volume
- persistent uploads volume
- private .env
- backups for DB and uploads

## Before moving

1. Confirm latest code is pushed to GitHub.
2. Confirm git status is clean.
3. Create database backup from dev.
4. Export uploads from dev.
5. Save .env privately.
6. Confirm admin basic auth password.
7. Confirm SMTP provider details.
8. Confirm legal pages and company settings.
9. Confirm pentrunoi.ro DNS timing.
10. Do not point production DNS until the production VPS is tested.

## Dev backup commands

From dev VPS:

cd ~/pentrunoi-service-platform
./scripts/backup-db.sh
./scripts/export-uploads.sh

Also copy privately:

.env

Never commit .env.

## Production setup overview

On Romanian VPS:

apt update
apt install -y git curl ca-certificates

Install Docker and Docker Compose plugin.

Clone repo:

git clone https://github.com/gianig-hub/pentrunoi-service-platform.git
cd pentrunoi-service-platform

Prepare env:

cp .env.production.example .env
nano .env

Important production value:

NEXT_PUBLIC_SITE_URL=https://pentrunoi.ro

Use a strong database password.

## Docker production compose

Use:

cp docker-compose.production.example.yml docker-compose.yml

Then:

docker network create webproxy || true
docker compose up -d --build

Apply migrations:

docker compose exec app npx prisma migrate deploy

## Restore database

Copy backup file to production VPS, then restore using project restore script.

Example:

./scripts/restore-db.sh backups/database/YOUR-BACKUP.sql.gz

## Restore uploads

Copy uploads archive to production VPS.

Example:

./scripts/import-uploads.sh backups/uploads/YOUR-UPLOADS.tar.gz

## Caddy production

Use:

deployment/Caddyfile.production.example

Production domains:
- pentrunoi.ro
- www.pentrunoi.ro

Keep /admin protected with Caddy basic auth until real app login is implemented.

## DNS

Only after app works on the production VPS, point A records:

pentrunoi.ro -> Romanian VPS IP
www.pentrunoi.ro -> Romanian VPS IP

## SEO launch checklist

1. Confirm NEXT_PUBLIC_SITE_URL=https://pentrunoi.ro.
2. Confirm /robots.txt allows public pages.
3. Confirm /sitemap.xml uses production URLs.
4. Confirm dev.pentrunoi.ro remains blocked.
5. Submit sitemap to Google Search Console.
6. Add redirects from old WordPress URLs if needed.
7. Keep admin and API blocked from indexing.
8. Test service request form.
9. Test status tracking.
10. Test admin dashboard.
11. Test uploads.
12. Test quote approval.
13. Test email logs.
14. Configure real SMTP.
15. Create first production backup after launch.

## Production smoke tests

curl -I https://pentrunoi.ro
curl -I https://pentrunoi.ro/service-laptop-ploiesti
curl -I https://pentrunoi.ro/cerere-service
curl -I https://pentrunoi.ro/status
curl -I https://pentrunoi.ro/robots.txt
curl -I https://pentrunoi.ro/sitemap.xml

Admin should require auth:

curl -I https://pentrunoi.ro/admin

Expected: 401 unless authenticated.

## Rollback plan

If production has issues:

1. Point DNS back to old server if needed.
2. Keep database backup safe.
3. Keep uploads backup safe.
4. Do not delete dev VPS until production is stable.
5. Keep GitHub as source of truth.
