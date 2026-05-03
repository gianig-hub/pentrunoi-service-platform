#!/usr/bin/env bash
set -euo pipefail

echo "=== Pentrunoi migration preflight ==="
echo

echo "=== Git status ==="
git status --short

echo
echo "=== Latest commits ==="
git log --oneline -5

echo
echo "=== Docker containers ==="
docker compose ps || true

echo
echo "=== Environment check ==="
echo "NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-not set}"
echo "NODE_ENV=${NODE_ENV:-not set}"
echo "UPLOADS_DIR=${UPLOADS_DIR:-not set}"
echo "ADMIN_EMAIL=${ADMIN_EMAIL:-not set}"
echo "PUBLIC_CONTACT_EMAIL=${PUBLIC_CONTACT_EMAIL:-not set}"

echo
echo "=== Database migration status ==="
npx prisma migrate status || true

echo
echo "=== Backup reminder ==="
echo "./scripts/backup-db.sh"
echo "./scripts/export-uploads.sh"

echo
echo "=== Production reminder ==="
echo "Set NEXT_PUBLIC_SITE_URL=https://pentrunoi.ro before production build."
echo "Keep /admin protected by Caddy basic auth."
